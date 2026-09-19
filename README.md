# HalfCourt Shoe Store

HalfCourt Shoe is a Davao sneaker storefront with Jordan catalog pricing, customer accounts, checkout, order history, and database-backed inventory.

## Clone

```bash
git clone https://github.com/Phycosis214/halfcourt-shoe-store.git
cd halfcourt-shoe-store
```

## Requirements

- XAMPP with Apache, PHP, and MySQL/MariaDB
- A browser

## Install with XAMPP

1. Copy the project folder into:

   ```text
   C:\xampp\htdocs\halfcourt-shoe-store
   ```

2. Open the XAMPP Control Panel.
3. Start **Apache** and **MySQL**.
4. Open phpMyAdmin:

   [http://localhost/phpmyadmin/](http://localhost/phpmyadmin/)

5. Import [xampp-schema.sql](xampp-schema.sql). This creates the `halfcourt_shoe` database, tables, products, prices, shipping methods, and size inventory.

## Run

Open the storefront at:

[http://localhost/halfcourt-shoe-store/](http://localhost/halfcourt-shoe-store/)

The PHP API is loaded from `api.php`. Make sure MySQL is running before using accounts, checkout, or inventory features.

## Database flow

- `customers`: member accounts, contact numbers, and account addresses
- `products`: product prices and total inventory
- `product_sizes`: inventory by shoe size
- `orders`: customer orders and totals
- `order_addresses`: delivery details for each order
- `order_items`: products included in each order
- `shipping_methods`: Metro Davao, nationwide, and pickup options

When an order is placed, the PHP API verifies the price and stock from the database and decreases inventory inside a transaction.

## Notes

- This is a demo storefront. Checkout does not process real payments.
- The Lanang location is a designated pickup lot, not a retail storefront.