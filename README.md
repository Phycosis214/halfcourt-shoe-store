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

## Supabase and Vercel

The PHP API accepts a PostgreSQL connection URI in `DATABASE_URL` and keeps the existing MySQL defaults for local XAMPP use. The root [Dockerfile](Dockerfile) provides PHP and the `pdo_pgsql` extension for Vercel's Container Runtime.

1. In Supabase, open **SQL Editor** and run [supabase-schema.sql](supabase-schema.sql). It creates the tables and seeds the shoe catalog and shipping methods.
2. In **Project Settings > Database > Connect**, copy a PostgreSQL URI. For Vercel serverless functions, use the Supabase pooler URI when available. Keep the URI private.
3. In Vercel, set the project framework/runtime to **Container** if prompted, then open **Settings > Environment Variables** and add `DATABASE_URL` with the full URI for Production (and Preview if needed). Never put this value in frontend files or send it in chat.
4. Redeploy the Vercel project after saving the environment variable. The root Dockerfile runs the site and `api.php` through PHP's built-in HTTP server and includes `pdo_pgsql`.

To inspect orders, use Supabase **Table Editor** and open `orders`, `order_addresses`, or `order_items`. The `customer_order_details` view combines order and item details and can also be queried in **SQL Editor**. Never place the database URI, its password, or a Supabase service-role key in browser code. Orders will not appear until the deployment has the secret and is redeployed, then checkout succeeds.

## Notes

- This is a demo storefront. Checkout does not process real payments.
- The Lanang location is a designated pickup lot, not a retail storefront.