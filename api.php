<?php
declare(strict_types=1);

session_start();

header('Content-Type: application/json; charset=utf-8');

 $action = $_GET['action'] ?? '';
if ($_SERVER['REQUEST_METHOD'] !== 'GET' && !in_array($action, ['register', 'login', 'order'], true)) {
    http_response_code(405);
    header('Allow: GET');
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$dsn = getenv('HALFCOURT_DB_DSN') ?: 'mysql:host=127.0.0.1;port=3306;dbname=halfcourt_shoe;charset=utf8mb4';
$user = getenv('HALFCOURT_DB_USER') ?: 'root';
$password = getenv('HALFCOURT_DB_PASSWORD') ?: '';

function respond(array $data, int $status = 200): never {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

function requestBody(): array {
    $body = json_decode(file_get_contents('php://input'), true);
    return is_array($body) ? $body : [];
}

try {
    $db = new PDO($dsn, $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    if ($action === 'me') {
        respond(['user' => $_SESSION['member'] ?? null]);
    }
    if ($action === 'logout') {
        $_SESSION = [];
        session_destroy();
        respond(['user' => null]);
    }
    if ($action === 'orders') {
        if (empty($_SESSION['member']['id'])) respond(['error' => 'Sign in required'], 401);
        $query = $db->prepare('SELECT order_no, status, subtotal, shipping_fee, total, placed_at FROM orders WHERE customer_id = ? ORDER BY placed_at DESC');
        $query->execute([$_SESSION['member']['id']]);
        respond(['orders' => $query->fetchAll()]);
    }
    if ($action === 'register' || $action === 'login' || $action === 'order') {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') respond(['error' => 'POST required'], 405);
        $body = requestBody();
        if ($action === 'register') {
            $name = trim((string) ($body['name'] ?? ''));
            $contactNumber = trim((string) ($body['contact_number'] ?? ''));
            $accountAddress = trim((string) ($body['address'] ?? ''));
            $email = strtolower(trim((string) ($body['email'] ?? '')));
            $passwordValue = (string) ($body['password'] ?? '');
            if (strlen($name) < 2 || !preg_match('/^[0-9+ ()-]{7,20}$/', $contactNumber) || strlen($accountAddress) < 5 || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($passwordValue) < 6) {
                respond(['error' => 'Enter a name, valid contact number, address, valid email, and password of at least 6 characters.'], 422);
            }
            $check = $db->prepare('SELECT id FROM customers WHERE email = ?');
            $check->execute([$email]);
            if ($check->fetch()) respond(['error' => 'An account with that email already exists.'], 409);
            $insert = $db->prepare('INSERT INTO customers (full_name, email, contact_number, address, password_hash) VALUES (?, ?, ?, ?, ?)');
            $insert->execute([$name, $email, $contactNumber, $accountAddress, password_hash($passwordValue, PASSWORD_DEFAULT)]);
            $_SESSION['member'] = ['id' => (int) $db->lastInsertId(), 'name' => $name, 'email' => $email, 'contact_number' => $contactNumber, 'address' => $accountAddress];
            respond(['user' => $_SESSION['member']]);
        }
        if ($action === 'login') {
            $email = strtolower(trim((string) ($body['email'] ?? '')));
            $passwordValue = (string) ($body['password'] ?? '');
            $query = $db->prepare('SELECT id, full_name, email, contact_number, address, password_hash FROM customers WHERE email = ?');
            $query->execute([$email]);
            $member = $query->fetch();
            if (!$member || !password_verify($passwordValue, $member['password_hash'])) respond(['error' => 'Invalid email or password.'], 401);
            $_SESSION['member'] = ['id' => (int) $member['id'], 'name' => $member['full_name'], 'email' => $member['email'], 'contact_number' => $member['contact_number'], 'address' => $member['address']];
            respond(['user' => $_SESSION['member']]);
        }
        $address = $body['address'] ?? [];
        $items = $body['items'] ?? [];
        $shippingId = (string) ($body['shippingId'] ?? '');
        if (!$items || !$address || !$shippingId) respond(['error' => 'Order details are incomplete.'], 422);

        $db->beginTransaction();
        $shippingQuery = $db->prepare('SELECT id, fee FROM shipping_methods WHERE id = ?');
        $shippingQuery->execute([$shippingId]);
        $shipping = $shippingQuery->fetch();
        if (!$shipping) {
            $db->rollBack();
            respond(['error' => 'Invalid shipping method.'], 422);
        }

        $productQuery = $db->prepare('SELECT id, name, colorway, price, stock FROM products WHERE id = ? AND is_active = 1 FOR UPDATE');
        $sizeQuery = $db->prepare('SELECT stock FROM product_sizes WHERE product_id = ? AND size = ? FOR UPDATE');
        $decrementProduct = $db->prepare('UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?');
        $decrementSize = $db->prepare('UPDATE product_sizes SET stock = stock - ? WHERE product_id = ? AND size = ? AND stock >= ?');
        $normalizedItems = [];
        $subtotal = 0.0;

        foreach ($items as $item) {
            $productId = (string) ($item['id'] ?? '');
            $size = trim((string) ($item['size'] ?? ''));
            $qty = filter_var($item['qty'] ?? null, FILTER_VALIDATE_INT);
            if (!$productId || !$size || $qty === false || $qty < 1) {
                $db->rollBack();
                respond(['error' => 'Invalid order item.'], 422);
            }

            $productQuery->execute([$productId]);
            $product = $productQuery->fetch();
            if (!$product) {
                $db->rollBack();
                respond(['error' => 'A selected product is no longer available.'], 409);
            }

            if ((int) $product['stock'] < $qty) {
                $db->rollBack();
                respond(['error' => $product['name'] . ' is out of stock.'], 409);
            }

            $sizeQuery->execute([$productId, $size]);
            $sizeStock = $sizeQuery->fetchColumn();
            if ($sizeStock !== false && (int) $sizeStock < $qty) {
                $db->rollBack();
                respond(['error' => $product['name'] . ' size ' . $size . ' does not have enough stock.'], 409);
            }

            $decrementProduct->execute([$qty, $productId, $qty]);
            if ($decrementProduct->rowCount() !== 1) {
                $db->rollBack();
                respond(['error' => $product['name'] . ' is out of stock.'], 409);
            }
            if ($sizeStock !== false) {
                $decrementSize->execute([$qty, $productId, $size, $qty]);
                if ($decrementSize->rowCount() !== 1) {
                    $db->rollBack();
                    respond(['error' => $product['name'] . ' size ' . $size . ' is no longer available.'], 409);
                }
            }

            $price = (float) $product['price'];
            $subtotal += $price * $qty;
            $normalizedItems[] = [$productId, $size, $qty, $price, $product['name'], $product['colorway']];
        }

        $shippingFee = (float) $shipping['fee'];
        $total = $subtotal + $shippingFee;
        $orderNo = 'DV-' . random_int(100000, 999999);
        $insert = $db->prepare('INSERT INTO orders (order_no, customer_id, subtotal, shipping_method_id, shipping_fee, total) VALUES (?, ?, ?, ?, ?, ?)');
        $customerId = $_SESSION['member']['id'] ?? null;
        $insert->execute([$orderNo, $customerId, $subtotal, $shippingId, $shippingFee, $total]);
        $orderId = (int) $db->lastInsertId();
        $addressInsert = $db->prepare('INSERT INTO order_addresses (order_id, full_name, phone, email, street, barangay, city, province, zip) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $addressInsert->execute([$orderId, $address['name'], $address['phone'], $address['email'] ?? null, $address['street'], $address['brgy'], $address['city'], $address['province'], $address['zip']]);
        $itemInsert = $db->prepare('INSERT INTO order_items (order_id, product_id, size, qty, unit_price, name, colorway) VALUES (?, ?, ?, ?, ?, ?, ?)');
        foreach ($normalizedItems as $item) {
            $itemInsert->execute([$orderId, ...$item]);
        }
        $db->commit();
        respond(['orderNo' => $orderNo, 'subtotal' => $subtotal, 'shippingFee' => $shippingFee, 'total' => $total]);
    }

    $products = $db->query(
        'SELECT p.id, p.model, p.name, p.colorway, p.price, p.stock, p.badge,
                p.image_url
         FROM products p
         WHERE p.is_active = 1
         ORDER BY p.created_at, p.id'
    )->fetchAll();

    $sizesByProduct = [];
    $sizes = $db->query(
        'SELECT product_id, size FROM product_sizes ORDER BY product_id, size'
    )->fetchAll();
    foreach ($sizes as $size) {
        $sizesByProduct[$size['product_id']][] = $size['size'];
    }

    foreach ($products as &$product) {
        $product['price'] = (float) $product['price'];
        $product['stock'] = (int) $product['stock'];
        $product['sizes'] = $sizesByProduct[$product['id']] ?? [];
    }
    unset($product);

    $shipping = $db->query(
        'SELECT id, label, eta, fee FROM shipping_methods ORDER BY id'
    )->fetchAll();

    foreach ($shipping as &$method) {
        $method['fee'] = (float) $method['fee'];
    }
    unset($method);

    echo json_encode(['products' => $products, 'shipping' => $shipping]);
} catch (Throwable $error) {
    http_response_code(500);
    echo json_encode(['error' => 'Unable to load catalog']);
}
