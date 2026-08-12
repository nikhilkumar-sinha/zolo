# Hostinger Production Deployment Guide — ZOLOFRESH

Follow these steps to deploy **ZOLOFRESH** on your Hostinger domain hosting (`zolofresh.in`) with a live MySQL database.

---

## 1. Create a MySQL Database in Hostinger hPanel

1. Log in to your **Hostinger hPanel**.
2. Navigate to **Databases** > **MySQL Databases**.
3. Create a new database:
   - **MySQL Database**: `u790143531_zolofresh`
   - **MySQL Username**: `u790143531_admin`
   - **Password**: Enter a secure password (e.g., `zolo_secure_pass_2026`).
4. Click **Create**. Note down the exact database name, username, and password.

---

## 2. Configure Database Credentials

Open the file `config.php` in your project and make sure the parameters match your newly created database details:

```php
define('DB_HOST', 'localhost'); // Keep as localhost
define('DB_USER', 'u790143531_admin'); // Your database username
define('DB_PASS', 'zolo_secure_pass_2026'); // Your database password
define('DB_NAME', 'u790143531_zolofresh'); // Your database name
```

---

## 3. Upload Code Files to Hostinger File Manager

1. In hPanel, go to **Files** > **File Manager**.
2. Open the **`public_html`** folder of your domain (`zolofresh.in`).
3. Upload all the files and folders from this project folder:
   - `index.html`
   - `delivery.html`
   - `admin.html`
   - `style.css`
   - `app.js`
   - `admin.js`
   - `config.php`
   - `login.php`
   - `setup_db.php`
   - `assets/` (the entire folder containing images and logo)
   - `CNAME`
   - `README.md`

---

## 4. Run the Database Initialization Script

Once the files are uploaded, open your web browser and navigate to:
👉 **`https://zolofresh.in/setup_db.php`**

- The page will display a JSON success confirmation:
  ```json
  {
    "status": "success",
    "message": "ZOLOFRESH Database Schema created and fully seeded with 24 categories and all product details successfully!"
  }
  ```
- This script automatically builds the tables (`users`, `categories`, `products`, `product_images`, `product_inventory`) and seeds them with all of ZOLOFRESH's product catalog.

---

## 5. 🔒 Production Security Hardening (CRITICAL)

> [!CAUTION]
> Anyone can run `setup_db.php` in their browser and wipe your database. 
> Immediately after running it, perform **one** of the following actions in your Hostinger File Manager:
> 1. **Delete** the `setup_db.php` file from the server. (Recommended)
> 2. Or, **rename** it to a secret name (e.g., `setup_db_secret_9823.php`).

---

## 6. Accessing the Admin Dashboard

- Navigate to: **`https://zolofresh.in/admin.html`**
- Log in using the secure default credentials:
  - **Username**: `admin`
  - **Password**: `khetihaar2026`
- Once logged in, you can manage the store bounty, track order statistics, check stock levels, and export inventory spreadsheets.
