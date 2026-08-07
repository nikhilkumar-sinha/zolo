-- ==========================================
-- E-Commerce Database Schema Migration Script
-- Target RDBMS: MySQL / PostgreSQL Compatible
-- Author: Antigravity Code Assistant
-- Description: Normalized 9-table product schema for ZOLOFRESH
-- ==========================================

-- 1. Categories Table
CREATE TABLE IF NOT EXISTS `categories` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Products Table
CREATE TABLE IF NOT EXISTS `products` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `sku` VARCHAR(30) NOT NULL UNIQUE,
    `product_title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL UNIQUE,
    `short_description` TEXT,
    `full_description` LONGTEXT,
    `category_id` BIGINT,
    `origin_region` VARCHAR(255),
    `unit` VARCHAR(100),
    `package_size` VARCHAR(100),
    `price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    `sale_price` DECIMAL(10,2) DEFAULT NULL,
    `cost_price` DECIMAL(10,2) DEFAULT NULL,
    `tax` DECIMAL(5,2) DEFAULT 0.00,
    `brand` VARCHAR(100) DEFAULT 'UseMadi',
    `featured` BOOLEAN DEFAULT FALSE,
    `organic` BOOLEAN DEFAULT TRUE,
    `gi_tagged` BOOLEAN DEFAULT FALSE,
    `seasonal` BOOLEAN DEFAULT FALSE,
    `harvest_season` VARCHAR(50),
    `shelf_life` VARCHAR(100),
    `weight` DECIMAL(10,2),
    `image` VARCHAR(255),
    `status` ENUM('Active', 'Draft', 'Archived') DEFAULT 'Active',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Product Images Table
CREATE TABLE IF NOT EXISTS `product_images` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `product_id` BIGINT NOT NULL,
    `image_url` VARCHAR(255) NOT NULL,
    `alt_text` VARCHAR(255),
    `sort_order` INT DEFAULT 0,
    FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Product Inventory Table
CREATE TABLE IF NOT EXISTS `product_inventory` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `product_id` BIGINT NOT NULL UNIQUE,
    `sku` VARCHAR(30) NOT NULL,
    `stock_quantity` INT NOT NULL DEFAULT 0,
    `reserved_stock` INT DEFAULT 0,
    `minimum_stock` INT DEFAULT 10,
    `maximum_stock` INT DEFAULT 1000,
    `stock_status` ENUM('In Stock', 'Low Stock', 'Out of Stock', 'Pre Order') DEFAULT 'In Stock',
    `availability` BOOLEAN DEFAULT TRUE,
    `warehouse` VARCHAR(100) DEFAULT 'Patna Main Warehouse',
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Product Attributes Table
CREATE TABLE IF NOT EXISTS `product_attributes` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `product_id` BIGINT NOT NULL,
    `attribute_name` VARCHAR(100) NOT NULL,
    `attribute_value` VARCHAR(255) NOT NULL,
    FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Product Variants Table
CREATE TABLE IF NOT EXISTS `product_variants` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `product_id` BIGINT NOT NULL,
    `sku` VARCHAR(30) NOT NULL UNIQUE,
    `variant_name` VARCHAR(100) NOT NULL,
    `weight` VARCHAR(50),
    `price` DECIMAL(10,2) NOT NULL,
    `stock` INT NOT NULL DEFAULT 0,
    FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Product Tags Table
CREATE TABLE IF NOT EXISTS `product_tags` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `product_id` BIGINT NOT NULL,
    `tag` VARCHAR(50) NOT NULL,
    FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
    UNIQUE KEY `unique_prod_tag` (`product_id`, `tag`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Seasonal Availability Table
CREATE TABLE IF NOT EXISTS `seasonal_availability` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `product_id` BIGINT NOT NULL,
    `available_from` DATE NOT NULL,
    `available_to` DATE NOT NULL,
    `season` VARCHAR(50) NOT NULL,
    `preorder_allowed` BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Product SEO Table
CREATE TABLE IF NOT EXISTS `product_seo` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `product_id` BIGINT NOT NULL UNIQUE,
    `meta_title` VARCHAR(255),
    `meta_description` TEXT,
    `meta_keywords` TEXT,
    `canonical_url` VARCHAR(255),
    FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- INDEX CREATION FOR OPTIMIZED SEARCH QUERIES
CREATE INDEX idx_products_sku ON `products` (`sku`);
CREATE INDEX idx_products_slug ON `products` (`slug`);
CREATE INDEX idx_product_inventory_sku ON `product_inventory` (`sku`);
CREATE INDEX idx_product_variants_sku ON `product_variants` (`sku`);
CREATE INDEX idx_product_tags_tag ON `product_tags` (`tag`);

-- DEFAULT CATEGORIES SEED DATA
-- Insert Parent Categories
INSERT INTO categories (id, category_name, slug, parent_id, status) VALUES
(1, 'Fruits & Fresh Produce', 'fruits-fresh-produce', NULL, TRUE),
(2, 'Staples & Grains', 'staples-grains', NULL, TRUE),
(3, 'Superfoods & Snacks', 'superfoods-snacks', NULL, TRUE),
(4, 'Handlooms & Handicrafts', 'handlooms-handicrafts', NULL, TRUE),
(5, 'Puja Essentials & Kits', 'puja-essentials-kits', NULL, TRUE)
ON DUPLICATE KEY UPDATE category_name=VALUES(category_name), slug=VALUES(slug), parent_id=VALUES(parent_id);

-- Insert Subcategories (IDs 6 to 26 mapping to parent_id)
INSERT INTO categories (id, category_name, slug, parent_id, status) VALUES
-- Fruits Subcategories
(6, 'Shahi Litchi', 'shahi-litchi', 1, TRUE),
(7, 'Jardalu Mango', 'jardalu-mango', 1, TRUE),

-- Staples Subcategories
(8, 'Katarni Rice', 'katarni-rice', 2, TRUE),
(9, 'Bhagalpuri Rice', 'bhagalpuri-rice', 2, TRUE),
(10, 'Chana Ka Sattu', 'chana-ka-sattu', 2, TRUE),
(11, 'Chura / Poha', 'chura-poha', 2, TRUE),

-- Superfoods & Sweets Subcategories
(12, 'Mithila Makhana', 'mithila-makhana', 3, TRUE),
(13, 'Bhuna Makhana', 'bhuna-makhana', 3, TRUE),
(14, 'Silao Khaja', 'silao-khaja', 3, TRUE),
(15, 'Tilkut', 'tilkut', 3, TRUE),
(16, 'Thekua', 'thekua', 3, TRUE),
(17, 'Jaggery', 'jaggery', 3, TRUE),
(18, 'Traditional Sweets', 'traditional-sweets', 3, TRUE),

-- Handicrafts Subcategories
(19, 'Madhubani Paintings', 'madhubani-paintings', 4, TRUE),
(20, 'Bhagalpuri Silk', 'bhagalpuri-silk', 4, TRUE),
(21, 'Sikki Grass Craft', 'sikki-grass-craft', 4, TRUE),

-- Puja Kits Subcategories
(22, 'Diwali Puja Kit', 'diwali-puja-kit', 5, TRUE),
(23, 'Durga Puja Kit', 'durga-puja-kit', 5, TRUE),
(24, 'Satyanarayan Puja Kit', 'satyanarayan-puja-kit', 5, TRUE)
ON DUPLICATE KEY UPDATE category_name=VALUES(category_name), slug=VALUES(slug), parent_id=VALUES(parent_id);
