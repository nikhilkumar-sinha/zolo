<?php
// ==========================================
// ZOLOFRESH - Analytics Events Submission API
// ==========================================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid request method.'
    ]);
    exit;
}

$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

if (!$input) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid JSON payload.'
    ]);
    exit;
}

$sessionId = isset($input['sessionId']) ? trim($input['sessionId']) : 'unknown';
$eventType = isset($input['eventType']) ? trim($input['eventType']) : '';
$eventValue = isset($input['eventValue']) ? trim($input['eventValue']) : '';

if (empty($eventType)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Event type is required.'
    ]);
    exit;
}

require_once 'config.php';

try {
    $visitorIp = $_SERVER['REMOTE_ADDR'];
    $userAgent = isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : 'unknown';

    $stmt = $pdo->prepare("INSERT INTO `analytics_events` 
        (`session_id`, `visitor_ip`, `user_agent`, `event_type`, `event_value`) 
        VALUES (?, ?, ?, ?, ?)");
    
    $stmt->execute([
        $sessionId,
        $visitorIp,
        $userAgent,
        $eventType,
        $eventValue
    ]);

    echo json_encode([
        'status' => 'success',
        'message' => 'Event logged successfully.'
    ]);

} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to log event: ' . $e->getMessage()
    ]);
}
?>
