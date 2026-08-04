<?php
// ==========================================
// ZOLONOW - Database Schema & Data Seeding Setup
// ==========================================

require_once 'config.php';

header('Content-Type: application/json');

try {
    // Disable foreign key checks during creation and seeding
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 0;");

    // 1. Drop existing tables if they exist to start fresh
    $tables = [
        'product_seo', 'seasonal_availability', 'product_tags', 
        'product_variants', 'product_attributes', 'product_inventory', 
        'product_images', 'products', 'categories', 'users'
    ];
    foreach ($tables as $table) {
        $pdo->exec("DROP TABLE IF EXISTS `$table`;");
    }

    // 2. Create Users Table
    $pdo->exec("CREATE TABLE `users` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `username` VARCHAR(50) NOT NULL UNIQUE,
        `password` VARCHAR(255) NOT NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

    // 3. Create Categories Table
    $pdo->exec("CREATE TABLE `categories` (
        `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
        `category_name` VARCHAR(100) NOT NULL,
        `slug` VARCHAR(100) NOT NULL UNIQUE,
        `parent_id` BIGINT DEFAULT NULL,
        `description` TEXT,
        `image` VARCHAR(255),
        `status` BOOLEAN DEFAULT TRUE,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

    // 4. Create Products Table
    $pdo->exec("CREATE TABLE `products` (
        `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
        `sku` VARCHAR(30) NOT NULL UNIQUE,
        `product_title` VARCHAR(255) NOT NULL,
        `slug` VARCHAR(255) NOT NULL UNIQUE,
        `short_description` TEXT,
        `full_description` LONGTEXT,
        `category_id` BIGINT,
        `origin_region` VARCHAR(255),
        `unit` VARCHAR(100),
        `price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        `featured` BOOLEAN DEFAULT FALSE,
        `organic` BOOLEAN DEFAULT TRUE,
        `gi_tagged` BOOLEAN DEFAULT FALSE,
        `seasonal` BOOLEAN DEFAULT FALSE,
        `harvest_season` VARCHAR(50),
        `image` VARCHAR(255),
        `status` ENUM('Active', 'Draft', 'Archived') DEFAULT 'Active',
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

    // 5. Create Product Images Table
    $pdo->exec("CREATE TABLE `product_images` (
        `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
        `product_id` BIGINT NOT NULL,
        `image_url` VARCHAR(255) NOT NULL,
        `alt_text` VARCHAR(255),
        `sort_order` INT DEFAULT 0,
        FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

    // 6. Create Product Inventory Table
    $pdo->exec("CREATE TABLE `product_inventory` (
        `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
        `product_id` BIGINT NOT NULL UNIQUE,
        `sku` VARCHAR(30) NOT NULL,
        `stock_quantity` INT NOT NULL DEFAULT 0,
        `stock_status` ENUM('In Stock', 'Low Stock', 'Out of Stock') DEFAULT 'In Stock',
        FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

    // Re-enable foreign key checks
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 1;");

    // 7. Seed Administrator Credentials
    $hashedPassword = password_hash('khetihaar2026', PASSWORD_BCRYPT);
    $stmt = $pdo->prepare("INSERT INTO `users` (`username`, `password`) VALUES (?, ?)");
    $stmt->execute(['admin', $hashedPassword]);

    // 8. Seed Categories
    $categories = [
        [1, 'Fruits & Fresh Produce', 'fruits-fresh-produce', null],
        [2, 'Staples & Grains', 'staples-grains', null],
        [3, 'Superfoods & Snacks', 'superfoods-snacks', null],
        [4, 'Handlooms & Handicrafts', 'handlooms-handicrafts', null],
        [5, 'Puja Essentials & Kits', 'puja-essentials-kits', null],
        [6, 'Shahi Litchi', 'shahi-litchi', 1],
        [7, 'Jardalu Mango', 'jardalu-mango', 1],
        [8, 'Katarni Rice', 'katarni-rice', 2],
        [9, 'Bhagalpuri Rice', 'bhagalpuri-rice', 2],
        [10, 'Chana Ka Sattu', 'chana-ka-sattu', 2],
        [11, 'Chura / Poha', 'chura-poha', 2],
        [12, 'Mithila Makhana', 'mithila-makhana', 3],
        [13, 'Bhuna Makhana', 'bhuna-makhana', 3],
        [14, 'Silao Khaja', 'silao-khaja', 3],
        [15, 'Tilkut', 'tilkut', 3],
        [16, 'Thekua', 'thekua', 3],
        [17, 'Jaggery', 'jaggery', 3],
        [18, 'Traditional Sweets', 'traditional-sweets', 3],
        [19, 'Madhubani Paintings', 'madhubani-paintings', 4],
        [20, 'Bhagalpuri Silk', 'bhagalpuri-silk', 4],
        [21, 'Sikki Grass Craft', 'sikki-grass-craft', 4],
        [22, 'Diwali Puja Kit', 'diwali-puja-kit', 5],
        [23, 'Durga Puja Kit', 'durga-puja-kit', 5],
        [24, 'Satyanarayan Puja Kit', 'satyanarayan-puja-kit', 5]
    ];

    $catStmt = $pdo->prepare("INSERT INTO `categories` (`id`, `category_name`, `slug`, `parent_id`) VALUES (?, ?, ?, ?)");
    foreach ($categories as $cat) {
        $catStmt->execute($cat);
    }

    // 9. Seed Products Details (Including Images and Descriptions)
    $products = [
        [
            'id' => 'shahi-litchi',
            'title' => 'Premium Shahi Litchi (GI Tagged)',
            'category_id' => 6,
            'is_gi' => 1,
            'is_organic' => 1,
            'is_seasonal' => 1,
            'season' => 'summer',
            'price' => 250.00,
            'unit' => 'Box of 1kg',
            'image' => 'assets/shahi_litchi.jpg',
            'origin' => 'Muzaffarpur, Bihar',
            'desc' => 'Fresh, hand-picked GI-tagged Shahi Litchi from Muzaffarpur orchards. Known for sweet translucent pulp and rose scent.'
        ],
        [
            'id' => 'jardalu-mango',
            'title' => 'Bhagalpur Jardalu Mango (GI Tagged)',
            'category_id' => 7,
            'is_gi' => 1,
            'is_organic' => 1,
            'is_seasonal' => 1,
            'season' => 'summer',
            'price' => 280.00,
            'unit' => 'Box of 3kg (Approx 10-12 Pcs)',
            'image' => 'assets/jardalu_mango.jpg',
            'origin' => 'Bhagalpur, Bihar',
            'desc' => 'Rich aroma, sweet fiberless pulp, and bright yellow color. Sourced directly from Bhagalpur heritage orchards.'
        ],
        [
            'id' => 'organic-jamun',
            'title' => 'Organic Jamun (Black Plum)',
            'category_id' => 1,
            'is_gi' => 0,
            'is_organic' => 1,
            'is_seasonal' => 1,
            'season' => 'summer',
            'price' => 180.00,
            'unit' => 'Pack of 500g',
            'image' => 'assets/jardalu_mango.jpg',
            'origin' => 'Vaishali, Bihar',
            'desc' => 'Freshly harvested organic Jamun. Rich in antioxidants and perfect for natural health management.'
        ],
        [
            'id' => 'mithila-makhana',
            'title' => 'Premium Mithila Makhana (GI Tagged)',
            'category_id' => 12,
            'is_gi' => 1,
            'is_organic' => 1,
            'is_seasonal' => 0,
            'season' => 'autumn',
            'price' => 320.00,
            'unit' => 'Pack of 250g',
            'image' => 'assets/mithila_makhana.jpg',
            'origin' => 'Darbhanga, Bihar',
            'desc' => 'Grade A hand-popped Mithila Lotus seeds. High protein, light, healthy snack option.'
        ],
        [
            'id' => 'bhuna-makhana',
            'title' => 'Organic Roasted Makhana (Salt & Pepper)',
            'category_id' => 13,
            'is_gi' => 0,
            'is_organic' => 1,
            'is_seasonal' => 0,
            'season' => 'autumn',
            'price' => 150.00,
            'unit' => 'Pack of 100g',
            'image' => 'assets/mithila_makhana.jpg',
            'origin' => 'Mithila Region, Bihar',
            'desc' => 'Crunchy, vacuum-packed organic lotus seeds roasted with natural spices for light calorie snacks.'
        ],
        [
            'id' => 'makhana-kheer-kit',
            'title' => 'Mithila Makhana Kheer Mix Kit',
            'category_id' => 18,
            'is_gi' => 0,
            'is_organic' => 1,
            'is_seasonal' => 0,
            'season' => 'winter',
            'price' => 180.00,
            'unit' => 'Pack of 200g',
            'image' => 'assets/mithila_makhana.jpg',
            'origin' => 'Darbhanga Co-op',
            'desc' => 'Instant traditional dessert kit containing premium makhana, saffron, cardamom, and pure dry fruits.'
        ],
        [
            'id' => 'katarni-rice',
            'title' => 'Aromatic Katarni Rice (GI Tagged)',
            'category_id' => 8,
            'is_gi' => 1,
            'is_organic' => 1,
            'is_seasonal' => 0,
            'season' => 'autumn',
            'price' => 110.00,
            'unit' => 'Pack of 1kg',
            'image' => 'assets/katarni_rice.jpg',
            'origin' => 'Bhagalpur, Bihar',
            'desc' => 'Finest scent, extremely soft grain. Traditional heirloom variety grown in Bhagalpur soil.'
        ],
        [
            'id' => 'bhagalpuri-rice',
            'title' => 'Bhagalpuri Basmati Rice',
            'category_id' => 9,
            'is_gi' => 0,
            'is_organic' => 1,
            'is_seasonal' => 0,
            'season' => 'autumn',
            'price' => 95.00,
            'unit' => 'Pack of 1kg',
            'image' => 'assets/katarni_rice.jpg',
            'origin' => 'Bhagalpur Region',
            'desc' => 'Locally grown premium long-grain rice with traditional aroma and excellent soft texture.'
        ],
        [
            'id' => 'chana-sattu',
            'title' => 'Traditional Stone-Ground Chana Sattu',
            'category_id' => 10,
            'is_gi' => 0,
            'is_organic' => 1,
            'is_seasonal' => 0,
            'season' => 'winter',
            'price' => 90.00,
            'unit' => 'Pack of 500g',
            'image' => 'assets/traditional_sattu.jpg',
            'origin' => 'Gaya, Bihar',
            'desc' => '100% roasted gram flour ground in traditional stone mills. Perfect for high-protein breakfast shakes and local sattu drinks.'
        ],
        [
            'id' => 'chura-poha',
            'title' => 'Aromatic Katarni Chura (Flakes)',
            'category_id' => 11,
            'is_gi' => 0,
            'is_organic' => 1,
            'is_seasonal' => 0,
            'season' => 'autumn',
            'price' => 80.00,
            'unit' => 'Pack of 500g',
            'image' => 'assets/katarni_rice.jpg',
            'origin' => 'Mithila Region, Bihar',
            'desc' => 'Crisp, flattened rice flakes prepared from premium aromatic Katarni paddy. Perfect for traditional breakfast offerings.'
        ],
        [
            'id' => 'silao-khaja',
            'title' => 'Famous Silao Khaja (GI Tagged)',
            'category_id' => 14,
            'is_gi' => 1,
            'is_organic' => 0,
            'is_seasonal' => 0,
            'season' => 'winter',
            'price' => 220.00,
            'unit' => 'Pack of 500g (12 Pieces)',
            'image' => 'assets/silao_khaja.jpg',
            'origin' => 'Silao, Nalanda',
            'desc' => 'GI-certified 52-layered wafer-thin crispy sweet from Silao. Delicately fried in ghee and sugar syrup.'
        ],
        [
            'id' => 'gaya-sesame-tilkut',
            'title' => 'Gaya Special Sesame Tilkut',
            'category_id' => 15,
            'is_gi' => 0,
            'is_organic' => 1,
            'is_seasonal' => 1,
            'season' => 'winter',
            'price' => 160.00,
            'unit' => 'Pack of 400g',
            'image' => 'assets/gaya_tilkut.jpg',
            'origin' => 'Gaya, Bihar',
            'desc' => 'Authentic winter delicacy made from premium sesame seeds and organic sugarcane jaggery.'
        ],
        [
            'id' => 'chhath-thekua',
            'title' => 'Traditional Chhath Puja Thekua',
            'category_id' => 16,
            'is_gi' => 0,
            'is_organic' => 1,
            'is_seasonal' => 1,
            'season' => 'autumn',
            'price' => 180.00,
            'unit' => 'Pack of 500g',
            'image' => 'assets/thekua.jpg',
            'origin' => 'Patna, Bihar',
            'desc' => 'Sacred prasad sweet prepared using whole wheat, jaggery, pure ghee, dry fruits, and traditional wood molds.'
        ],
        [
            'id' => 'sesame-anarsa',
            'title' => 'Traditional Sesame Anarsa (Ghee)',
            'category_id' => 18,
            'is_gi' => 0,
            'is_organic' => 1,
            'is_seasonal' => 1,
            'season' => 'monsoon',
            'price' => 240.00,
            'unit' => 'Pack of 500g',
            'image' => 'assets/anarsa.jpg',
            'origin' => 'Gaya, Bihar',
            'desc' => 'Crispy sweet pastry made from soaked rice flour and sesame seeds, cooked in pure desi ghee.'
        ],
        [
            'id' => 'organic-jaggery',
            'title' => 'Pure Sugarcane Jaggery (Gur)',
            'category_id' => 17,
            'is_gi' => 0,
            'is_organic' => 1,
            'is_seasonal' => 0,
            'season' => 'winter',
            'price' => 75.00,
            'unit' => 'Pack of 500g',
            'image' => 'assets/traditional_sattu.jpg',
            'origin' => 'Vaishali, Bihar',
            'desc' => '100% natural, chemical-free sugarcane jaggery block with rich minerals and iron.'
        ],
        [
            'id' => 'diwali-puja-package',
            'title' => 'Diwali Shubh Labh Puja Package',
            'category_id' => 22,
            'is_gi' => 0,
            'is_organic' => 1,
            'is_seasonal' => 1,
            'season' => 'autumn',
            'price' => 450.00,
            'unit' => 'Complete Kit (12 items)',
            'image' => 'assets/puja_box.jpg',
            'origin' => 'Gaya & Patna, Bihar',
            'desc' => 'Special Diwali kit: Terracotta diyas, Gangajal, yellow cowries, lotus seeds, pure cow ghee wicks, raw honey, and natural incense.'
        ],
        [
            'id' => 'durgapuja-package',
            'title' => 'Durga Puja Sacred Package',
            'category_id' => 23,
            'is_gi' => 0,
            'is_organic' => 1,
            'is_seasonal' => 1,
            'season' => 'autumn',
            'price' => 550.00,
            'unit' => 'Complete Kit (15 items)',
            'image' => 'assets/puja_box.jpg',
            'origin' => 'Mithila Region, Bihar',
            'desc' => 'Comprehensive Durga Puja items: Sandalwood paste, red chunri, barley seeds, sacred soil, dry fruits, copper kalash, and dhoop sticks.'
        ],
        [
            'id' => 'satyanarayan-puja-package',
            'title' => 'Satyanarayan Bhagwan Puja Package',
            'category_id' => 24,
            'is_gi' => 0,
            'is_organic' => 1,
            'is_seasonal' => 0,
            'season' => 'winter',
            'price' => 380.00,
            'unit' => 'Complete Kit (10 items)',
            'image' => 'assets/puja_box.jpg',
            'origin' => 'Gaya Shrine Co-op',
            'desc' => 'Sacred kit for Satyanarayan Vrat: Panchamrit honey, tulsi seeds, janeyu thread, red-yellow mauli, camphor, and ritual story book.'
        ],
        [
            'id' => 'madhubani-paintings',
            'title' => 'Madhubani Paintings (GI Tagged)',
            'category_id' => 19,
            'is_gi' => 1,
            'is_organic' => 0,
            'is_seasonal' => 0,
            'season' => 'winter',
            'price' => 650.00,
            'unit' => 'Handmade Canvas (A4 Size)',
            'image' => 'assets/mithila_makhana.jpg',
            'origin' => 'Madhubani, Mithila',
            'desc' => 'Authentic Madhubani art hand-painted by women cooperative artists using natural dye pigments on handmade paper canvas.'
        ],
        [
            'id' => 'bhagalpuri-silk',
            'title' => 'Bhagalpuri Silk (Tussar Stole)',
            'category_id' => 20,
            'is_gi' => 1,
            'is_organic' => 0,
            'is_seasonal' => 0,
            'season' => 'winter',
            'price' => 750.00,
            'unit' => 'Premium Silk Stole (2 Meters)',
            'image' => 'assets/katarni_rice.jpg',
            'origin' => 'Bhagalpur Silk Handloom',
            'desc' => '100% genuine, GI-certified Bhagalpuri Tussar Silk stole. Known for its rich texture, natural golden-beige shade, and structural resilience.'
        ],
        [
            'id' => 'sikki-grass-craft',
            'title' => 'Sikki Grass Craft Basket',
            'category_id' => 21,
            'is_gi' => 1,
            'is_organic' => 0,
            'is_seasonal' => 0,
            'season' => 'winter',
            'price' => 290.00,
            'unit' => 'Handwoven Utility Box',
            'image' => 'assets/puja_box.jpg',
            'origin' => 'Mithila Region, Bihar',
            'desc' => 'Golden Sikki Grass hand-braided utility basket. Light, organic, durable, and dyed in bright festive colors.'
        ],
        
        // National Regional Specialties
        [
            'id' => 'kashmiri-kesar',
            'title' => 'Grade A++ Kashmiri Kesar (Saffron)',
            'category_id' => 12,
            'is_gi' => 1,
            'is_organic' => 1,
            'is_seasonal' => 0,
            'season' => 'monsoon',
            'price' => 350.00,
            'unit' => 'Pack of 1 Gram',
            'image' => 'assets/puja_box.jpg',
            'origin' => 'Pampore, Kashmir',
            'desc' => 'GI-tagged Pampore Saffron (Lacha) of the highest grade. Unmatched deep color, robust aroma, and culinary potency.'
        ],
        [
            'id' => 'darjeeling-tea',
            'title' => 'Darjeeling First Flush Black Tea',
            'category_id' => 8,
            'is_gi' => 1,
            'is_organic' => 1,
            'is_seasonal' => 0,
            'season' => 'autumn',
            'price' => 450.00,
            'unit' => 'Pack of 250g',
            'image' => 'assets/katarni_rice.jpg',
            'origin' => 'Darjeeling, West Bengal',
            'desc' => 'Certified organic Darjeeling Orthodox black tea. Delicate, floral first-flush tea with signature muscatel notes.'
        ],
        [
            'id' => 'mysore-sandalwood',
            'title' => 'Pure Mysore Sandalwood Oil',
            'category_id' => 20,
            'is_gi' => 1,
            'is_organic' => 0,
            'is_seasonal' => 0,
            'season' => 'winter',
            'price' => 950.00,
            'unit' => 'Bottle of 5ml',
            'image' => 'assets/puja_box.jpg',
            'origin' => 'Mysore, Karnataka',
            'desc' => '100% pure, natural, and GI-certified Mysore Sandalwood oil. Distilled from mature heartwood with an exquisite warm-woody scent.'
        ],
        [
            'id' => 'alphonso-mango',
            'title' => 'Devgad Alphonso Hapus Mangoes',
            'category_id' => 7,
            'is_gi' => 1,
            'is_organic' => 1,
            'is_seasonal' => 1,
            'season' => 'summer',
            'price' => 850.00,
            'unit' => 'Box of 6 Pieces',
            'image' => 'assets/jardalu_mango.jpg',
            'origin' => 'Devgad, Maharashtra',
            'desc' => 'Certified organic, naturally ripened Alphonso mangoes from Devgad orchards. Rich, saffron-toned pulp and sweet aroma.'
        ]
    ];

    $prodStmt = $pdo->prepare("INSERT INTO `products` 
        (`sku`, `product_title`, `slug`, `short_description`, `full_description`, `category_id`, `origin_region`, `unit`, `price`, `featured`, `organic`, `gi_tagged`, `seasonal`, `harvest_season`, `image`) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    $imgStmt = $pdo->prepare("INSERT INTO `product_images` (`product_id`, `image_url`, `alt_text`) VALUES (?, ?, ?)");
    $invStmt = $pdo->prepare("INSERT INTO `product_inventory` (`product_id`, `sku`, `stock_quantity`) VALUES (?, ?, ?)");

    foreach ($products as $p) {
        // Generate a SKU
        $skuWords = explode(' ', preg_replace('/[^A-Z ]/g', '', strtoupper($p['title'])));
        $skuPrefix = count($skuWords) > 1 ? (substr($skuWords[0], 0, 1) . substr($skuWords[1], 0, 2)) : substr($skuWords[0], 0, 3);
        $sku = "USE-" . str_pad($skuPrefix, 3, "X") . "-001";
        
        $prodStmt->execute([
            $sku,
            $p['title'],
            $p['id'],
            $p['desc'],
            $p['desc'],
            $p['category_id'],
            $p['origin'],
            $p['unit'],
            $p['price'],
            0,
            $p['is_organic'],
            $p['is_gi'],
            $p['is_seasonal'],
            $p['season'],
            $p['image']
        ]);
        
        $dbProductId = $pdo->lastInsertId();
        
        // Seed related image
        $imgStmt->execute([$dbProductId, $p['image'], $p['title']]);
        
        // Seed initial inventory (100 in stock)
        $invStmt->execute([$dbProductId, $sku, 100]);
    }

    echo json_encode([
        'status' => 'success',
        'message' => 'ZOLONOW Database Schema created and fully seeded with 24 categories and all product details successfully!'
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database creation and seeding failed: ' . $e->getMessage()
    ]);
}
?>
