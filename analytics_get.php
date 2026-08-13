<?php
// ==========================================
// ZOLOFRESH - Analytics Events Retrieval API
// ==========================================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'config.php';

try {
    // 1. Total Page Views
    $viewsQuery = $pdo->query("SELECT COUNT(*) as count FROM `analytics_events` WHERE `event_type` = 'page_view'");
    $views = $viewsQuery->fetch()['count'];

    // 2. Unique Visitors (distinct sessions)
    $visitorsQuery = $pdo->query("SELECT COUNT(DISTINCT `session_id`) as count FROM `analytics_events`");
    $visitors = $visitorsQuery->fetch()['count'];

    // 3. WhatsApp Join Actions
    $sharesQuery = $pdo->query("SELECT COUNT(*) as count FROM `analytics_events` WHERE `event_type` = 'whatsapp_join'");
    $shares = $sharesQuery->fetch()['count'];

    // 4. Search Interactions
    $searchesQuery = $pdo->query("SELECT COUNT(*) as count FROM `analytics_events` WHERE `event_type` = 'search'");
    $searches = $searchesQuery->fetch()['count'];

    echo json_encode([
        'status' => 'success',
        'page_views' => intval($views),
        'unique_visitors' => intval($visitors),
        'whatsapp_joins' => intval($shares),
        'searches_count' => intval($searches)
    ]);

} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to fetch analytics: ' . $e->getMessage()
    ]);
}
?>
