<?php
// ==========================================
// ZOLOFRESH - Hostinger MySQL Database Configuration
// ==========================================

define('DB_HOST', 'localhost');
define('DB_USER', 'u790143531_admin');
define('DB_PASS', 'zolo_secure_pass_2026');
define('DB_NAME', 'u790143531_zolofresh');

// Establish PDO connection
try {
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4", DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    // Return connection error
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'error',
        'message' => 'Database connection failed: ' . $e->getMessage()
    ]);
    exit;
}
?>
