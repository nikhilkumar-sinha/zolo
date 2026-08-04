<?php
// ==========================================
// ZOLONOW - Database Initialization Script
// ==========================================

require_once 'config.php';

header('Content-Type: application/json');

try {
    // 1. Create Users Table for Administration Login
    $createTableSQL = "CREATE TABLE IF NOT EXISTS `users` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `username` VARCHAR(50) NOT NULL UNIQUE,
        `password` VARCHAR(255) NOT NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
    
    $pdo->exec($createTableSQL);
    
    // 2. Check if default administrator exists
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM `users` WHERE `username` = ?");
    $stmt->execute(['admin']);
    $exists = $stmt->fetchColumn();
    
    if (!$exists) {
        // Hash password 'khetihaar2026' using secure bcrypt algorithm
        $hashedPassword = password_hash('khetihaar2026', PASSWORD_BCRYPT);
        
        $insertStmt = $pdo->prepare("INSERT INTO `users` (`username`, `password`) VALUES (?, ?)");
        $insertStmt->execute(['admin', $hashedPassword]);
        
        echo json_encode([
            'status' => 'success',
            'message' => 'Database initialized successfully! Default administrator user created.'
        ]);
    } else {
        echo json_encode([
            'status' => 'success',
            'message' => 'Database tables verified. Administrator user already exists.'
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database initialization failed: ' . $e->getMessage()
    ]);
}
?>
