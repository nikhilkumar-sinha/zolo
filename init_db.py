import sqlite3
import os
import json
import hashlib

DB_FILE = os.path.join(os.path.dirname(__file__), 'zolofresh.db')

def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    # Enable foreign keys
    cursor.execute("PRAGMA foreign_keys = ON;")

    # 1. Users Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 2. Orders Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id TEXT NOT NULL UNIQUE,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        shipping_address TEXT NOT NULL,
        shipping_city TEXT NOT NULL,
        shipping_zip TEXT NOT NULL,
        payment_method TEXT NOT NULL,
        delivery_tier TEXT NOT NULL,
        total_amount REAL NOT NULL,
        status TEXT DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 3. Order Items Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        product_title TEXT NOT NULL,
        price REAL NOT NULL,
        quantity INTEGER NOT NULL,
        subtotal REAL NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE CASCADE
    );
    """)

    # 4. Categories Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        parent_id INTEGER DEFAULT NULL,
        description TEXT,
        image TEXT,
        status INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (parent_id) REFERENCES categories (id) ON DELETE SET NULL
    );
    """)

    # 5. Products Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sku TEXT NOT NULL UNIQUE,
        product_title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        short_description TEXT,
        category_id INTEGER,
        origin_region TEXT,
        unit TEXT,
        price REAL NOT NULL DEFAULT 0.00,
        featured INTEGER DEFAULT 0,
        organic INTEGER DEFAULT 1,
        gi_tagged INTEGER DEFAULT 0,
        seasonal INTEGER DEFAULT 0,
        harvest_season TEXT,
        image TEXT,
        status TEXT DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE SET NULL
    );
    """)

    # Seed Admin User if not present
    cursor.execute("SELECT COUNT(*) FROM users WHERE username = 'admin'")
    if cursor.fetchone()[0] == 0:
        # Simple admin password store for demo / hashed
        cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", ('admin', 'khetihaar2026'))

    # Seed Categories
    categories_data = [
        (1, 'Fruits & Fresh Produce', 'fruits-fresh-produce', None),
        (2, 'Staples & Grains', 'staples-grains', None),
        (3, 'Superfoods & Snacks', 'superfoods-snacks', None),
        (4, 'Handlooms & Handicrafts', 'handlooms-handicrafts', None),
        (5, 'Puja Essentials & Kits', 'puja-essentials-kits', None),
        (6, 'Shahi Litchi', 'shahi-litchi', 1),
        (7, 'Jardalu Mango', 'jardalu-mango', 1),
        (8, 'Katarni Rice', 'katarni-rice', 2),
        (9, 'Bhagalpuri Rice', 'bhagalpuri-rice', 2),
        (10, 'Chana Ka Sattu', 'chana-ka-sattu', 2),
        (11, 'Chura / Poha', 'chura-poha', 2),
        (12, 'Mithila Makhana', 'mithila-makhana', 3),
        (13, 'Bhuna Makhana', 'bhuna-makhana', 3),
        (14, 'Silao Khaja', 'silao-khaja', 3),
        (15, 'Tilkut', 'tilkut', 3),
        (16, 'Thekua', 'thekua', 3),
        (17, 'Jaggery', 'jaggery', 3),
        (18, 'Traditional Sweets', 'traditional-sweets', 3),
        (19, 'Madhubani Paintings', 'madhubani-paintings', 4),
        (20, 'Bhagalpuri Silk', 'bhagalpuri-silk', 4),
        (21, 'Sikki Grass Craft', 'sikki-grass-craft', 4),
        (22, 'Diwali Puja Kit', 'diwali-puja-kit', 5),
        (23, 'Durga Puja Kit', 'durga-puja-kit', 5),
        (24, 'Satyanarayan Puja Kit', 'satyanarayan-puja-kit', 5)
    ]

    for cat in categories_data:
        cursor.execute("""
        INSERT OR IGNORE INTO categories (id, category_name, slug, parent_id)
        VALUES (?, ?, ?, ?)
        """, cat)

    # Seed Sample Products
    products_data = [
        ('USE-SHA-001', 'Premium Shahi Litchi (GI Tagged)', 'shahi-litchi', 'Fresh, hand-picked GI-tagged Shahi Litchi from Muzaffarpur orchards.', 6, 'Muzaffarpur, Bihar', 'Box of 1kg', 250.00, 1, 1, 1, 1, 'summer', 'assets/shahi_litchi.jpg'),
        ('USE-JAR-001', 'Bhagalpur Jardalu Mango (GI Tagged)', 'jardalu-mango', 'Rich aroma, sweet fiberless pulp, and bright yellow color.', 7, 'Bhagalpur, Bihar', 'Box of 3kg', 280.00, 1, 1, 1, 1, 'summer', 'assets/jardalu_mango.jpg'),
        ('USE-MIT-001', 'Premium Mithila Makhana (GI Tagged)', 'mithila-makhana', 'Grade A hand-popped Mithila Lotus seeds.', 12, 'Darbhanga, Bihar', 'Pack of 250g', 320.00, 1, 1, 1, 0, 'autumn', 'assets/mithila_makhana.jpg'),
        ('USE-KAT-001', 'Aromatic Katarni Rice (GI Tagged)', 'katarni-rice', 'Finest scent, extremely soft grain. Traditional heirloom variety.', 8, 'Bhagalpur, Bihar', 'Pack of 1kg', 110.00, 1, 1, 1, 0, 'autumn', 'assets/katarni_rice.jpg'),
        ('USE-CHA-001', 'Traditional Stone-Ground Chana Sattu', 'chana-sattu', '100% roasted gram flour ground in traditional stone mills.', 10, 'Gaya, Bihar', 'Pack of 500g', 90.00, 1, 1, 0, 0, 'winter', 'assets/traditional_sattu.jpg'),
        ('USE-SIL-001', 'Famous Silao Khaja (GI Tagged)', 'silao-khaja', 'GI-certified 52-layered wafer-thin crispy sweet from Silao.', 14, 'Silao, Nalanda', 'Pack of 500g', 220.00, 1, 0, 1, 0, 'winter', 'assets/silao_khaja.jpg'),
        ('USE-GAY-001', 'Gaya Special Sesame Tilkut', 'gaya-sesame-tilkut', 'Authentic winter delicacy made from premium sesame seeds and jaggery.', 15, 'Gaya, Bihar', 'Pack of 400g', 160.00, 1, 1, 0, 1, 'winter', 'assets/gaya_tilkut.jpg'),
        ('USE-DIW-001', 'Diwali Shubh Labh Puja Package', 'diwali-puja-package', 'Special Diwali kit: Terracotta diyas, Gangajal, yellow cowries, lotus seeds.', 22, 'Gaya & Patna, Bihar', 'Complete Kit', 450.00, 1, 1, 0, 1, 'autumn', 'assets/puja_box.jpg')
    ]

    for prod in products_data:
        cursor.execute("""
        INSERT OR IGNORE INTO products (sku, product_title, slug, short_description, category_id, origin_region, unit, price, featured, organic, gi_tagged, seasonal, harvest_season, image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, prod)

    conn.commit()
    conn.close()
    print("Database zolofresh.db successfully initialized and seeded.")

if __name__ == '__main__':
    init_db()
