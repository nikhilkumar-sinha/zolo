<?php
// ==========================================
// ZOLOFRESH - Contact Inquiry Form Submission Controller
// ==========================================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid request method. Only POST is allowed.'
    ]);
    exit;
}

// Get POST content input (JSON or urlencoded form)
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

if (!$input) {
    // Fallback to standard urlencoded form data
    $input = $_POST;
}

$name = isset($input['name']) ? trim($input['name']) : '';
$email = isset($input['email']) ? trim($input['email']) : '';
$phone = isset($input['phone']) ? trim($input['phone']) : '';
$subject = isset($input['subject']) ? trim($input['subject']) : 'General Farm Inquiry';
$message = isset($input['message']) ? trim($input['message']) : '';

if (empty($name) || empty($email) || empty($phone) || empty($message)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Please fill in all required fields (Name, Email, Contact No, and Message).'
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Please enter a valid email address.'
    ]);
    exit;
}

// Destination email
$to = 'zolofreshofficial@gmail.com';

// Subject line
$emailSubject = "New ZOLOFRESH Contact Inquiry: " . $subject;

// HTML Email Body
$emailBody = "
<html>
<head>
    <title>ZOLOFRESH Contact Inquiry</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px; background-color: #fdfbf7; }
        .header { border-bottom: 2px solid #1b4a35; padding-bottom: 10px; margin-bottom: 20px; }
        .header h2 { color: #1b4a35; margin: 0; }
        .detail-row { margin-bottom: 15px; }
        .detail-label { font-weight: bold; color: #78350F; }
        .message-box { background-color: #fff; padding: 15px; border-left: 4px solid #4caf50; border-radius: 4px; margin-top: 10px; }
        .footer { font-size: 0.85rem; color: #666; border-top: 1px solid #eaeaea; margin-top: 20px; padding-top: 10px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>New Inquiry Received</h2>
        </div>
        <div class='detail-row'>
            <span class='detail-label'>Customer Name:</span> " . htmlspecialchars($name) . "
        </div>
        <div class='detail-row'>
            <span class='detail-label'>Email Address:</span> " . htmlspecialchars($email) . "
        </div>
        <div class='detail-row'>
            <span class='detail-label'>Mobile Number:</span> " . htmlspecialchars($phone) . "
        </div>
        <div class='detail-row'>
            <span class='detail-label'>Inquiry Subject:</span> " . htmlspecialchars($subject) . "
        </div>
        <div class='detail-row'>
            <span class='detail-label'>Message Details:</span>
            <div class='message-box'>" . nl2br(htmlspecialchars($message)) . "</div>
        </div>
        <div class='footer'>
            <p>Sent automatically from the ZOLOFRESH Storefront Portal (https://zolofresh.in)</p>
            <p>Sender IP: " . htmlspecialchars($_SERVER['REMOTE_ADDR']) . "</p>
        </div>
    </div>
</body>
</html>
";

// Email headers
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: ZoloFresh Portal <webmaster@zolofresh.in>" . "\r\n";
$headers .= "Reply-To: " . $name . " <" . $email . ">" . "\r\n";

// Send email
if (mail($to, $emailSubject, $emailBody, $headers)) {
    echo json_encode([
        'status' => 'success',
        'message' => 'Thank you! Your inquiry has been sent successfully. We will get back to you shortly.'
    ]);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to send the email inquiry. Please try again later or email us directly at support@zolofresh.in.'
    ]);
}
?>
