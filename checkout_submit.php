<?php
// ==========================================
// ZOLOFRESH - Order Checkout Submission Controller
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

// Get POST content input (JSON payload)
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

if (!$input) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid payload. JSON expected.'
    ]);
    exit;
}

// Retrieve shipping and order parameters
$name = isset($input['name']) ? trim($input['name']) : '';
$email = isset($input['email']) ? trim($input['email']) : '';
$phone = isset($input['phone']) ? trim($input['phone']) : '';
$pincode = isset($input['pincode']) ? trim($input['pincode']) : '';
$city = isset($input['city']) ? trim($input['city']) : '';
$address = isset($input['address']) ? trim($input['address']) : '';
$paymentMethod = isset($input['paymentMethod']) ? trim($input['paymentMethod']) : 'COD';
$deliveryTier = isset($input['deliveryTier']) ? trim($input['deliveryTier']) : 'standard';
$totalAmount = isset($input['totalAmount']) ? floatval($input['totalAmount']) : 0.00;
$cartItems = isset($input['cartItems']) ? $input['cartItems'] : [];

if (empty($name) || empty($email) || empty($phone) || empty($pincode) || empty($city) || empty($address) || empty($cartItems)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Please fill in all shipping details and add items to your cart.'
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

// Establish database connection via config.php
require_once 'config.php';

try {
    // Generate Unique Order ID: ZF-YYYYMMDD-XXXXX
    $datePart = date('Ymd');
    $randomPart = str_pad(mt_rand(10000, 99999), 5, '0', STR_PAD_LEFT);
    $orderId = "ZF-" . $datePart . "-" . $randomPart;

    // Start database transaction
    $pdo->beginTransaction();

    // 1. Insert order details
    $orderStmt = $pdo->prepare("INSERT INTO `orders` 
        (`order_id`, `customer_name`, `customer_email`, `customer_phone`, `shipping_address`, `shipping_city`, `shipping_zip`, `payment_method`, `delivery_tier`, `total_amount`, `status`) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')");
    
    $orderStmt->execute([
        $orderId,
        $name,
        $email,
        $phone,
        $address,
        $city,
        $pincode,
        strtoupper($paymentMethod),
        strtolower($deliveryTier),
        $totalAmount
    ]);

    // 2. Insert each cart item
    $itemStmt = $pdo->prepare("INSERT INTO `order_items` 
        (`order_id`, `product_id`, `product_title`, `price`, `quantity`, `subtotal`) 
        VALUES (?, ?, ?, ?, ?, ?)");

    foreach ($cartItems as $item) {
        $itemId = isset($item['id']) ? $item['id'] : '';
        $itemTitle = isset($item['title']) ? $item['title'] : '';
        $itemPrice = isset($item['price']) ? floatval($item['price']) : 0.00;
        $itemQty = isset($item['quantity']) ? intval($item['quantity']) : 1;
        $itemSubtotal = $itemPrice * $itemQty;

        $itemStmt->execute([
            $orderId,
            $itemId,
            $itemTitle,
            $itemPrice,
            $itemQty,
            $itemSubtotal
        ]);
    }

    // Commit transaction
    $pdo->commit();

    // 3. Prepare HTML Email for Store Owner & Customer
    $to = 'zolofreshofficial@gmail.com';
    $emailSubject = "New ZOLOFRESH Order Placed: " . $orderId;

    // Generate cart items HTML table
    $itemsTableRows = '';
    foreach ($cartItems as $item) {
        $itemTitle = htmlspecialchars($item['title']);
        $itemPrice = floatval($item['price']);
        $itemQty = intval($item['quantity']);
        $itemSub = $itemPrice * $itemQty;
        
        $itemsTableRows .= "
        <tr>
            <td style='padding: 10px; border-bottom: 1px solid #eaeaea;'>{$itemTitle}</td>
            <td style='padding: 10px; border-bottom: 1px solid #eaeaea; text-align: center;'>₹{$itemPrice}</td>
            <td style='padding: 10px; border-bottom: 1px solid #eaeaea; text-align: center;'>{$itemQty}</td>
            <td style='padding: 10px; border-bottom: 1px solid #eaeaea; text-align: right;'>₹{$itemSub}</td>
        </tr>
        ";
    }

    $emailBody = "
    <html>
    <head>
        <title>ZOLOFRESH Order Placed</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #242424; background-color: #faf7f0; }
            .container { max-width: 600px; margin: 20px auto; padding: 25px; border: 1px solid #e4ded2; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(24,60,43,0.05); }
            .header { border-bottom: 3px solid #183c2b; padding-bottom: 12px; margin-bottom: 24px; text-align: center; }
            .header h2 { color: #183c2b; margin: 0; font-family: 'Georgia', serif; }
            .order-id { font-size: 1.1rem; font-weight: bold; color: #d99a24; margin-top: 8px; }
            .section-title { font-size: 1rem; font-weight: bold; color: #183c2b; border-bottom: 1px solid #e4ded2; padding-bottom: 6px; margin: 20px 0 10px 0; text-transform: uppercase; letter-spacing: 0.5px; }
            .detail-row { margin-bottom: 10px; font-size: 0.95rem; }
            .detail-label { font-weight: bold; color: #66635d; width: 140px; display: inline-block; }
            .table-wrapper { margin-top: 20px; }
            table { width: 100%; border-collapse: collapse; font-size: 0.95rem; }
            th { background-color: #f2ebdd; color: #183c2b; padding: 10px; text-align: left; font-weight: bold; }
            .total-row { font-size: 1.1rem; font-weight: bold; color: #183c2b; }
            .footer { font-size: 0.85rem; color: #66635d; border-top: 1px solid #e4ded2; margin-top: 30px; padding-top: 15px; text-align: center; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>Order Placement Confirmed</h2>
                <div class='order-id'>Order ID: {$orderId}</div>
            </div>
            
            <div class='section-title'>Customer Shipping Details</div>
            <div class='detail-row'><span class='detail-label'>Full Name:</span> " . htmlspecialchars($name) . "</div>
            <div class='detail-row'><span class='detail-label'>Phone Number:</span> " . htmlspecialchars($phone) . "</div>
            <div class='detail-row'><span class='detail-label'>Email Address:</span> " . htmlspecialchars($email) . "</div>
            <div class='detail-row'><span class='detail-label'>Pincode:</span> " . htmlspecialchars($pincode) . "</div>
            <div class='detail-row'><span class='detail-label'>City / Town:</span> " . htmlspecialchars($city) . "</div>
            <div class='detail-row'><span class='detail-label'>Delivery Address:</span> " . htmlspecialchars($address) . "</div>

            <div class='section-title'>Logistics & Payment</div>
            <div class='detail-row'><span class='detail-label'>Delivery Method:</span> " . htmlspecialchars(ucfirst($deliveryTier)) . "</div>
            <div class='detail-row'><span class='detail-label'>Payment Mode:</span> " . htmlspecialchars(strtoupper($paymentMethod)) . "</div>

            <div class='section-title'>Order Breakdown</div>
            <div class='table-wrapper'>
                <table>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th style='text-align: center;'>Price</th>
                            <th style='text-align: center;'>Qty</th>
                            <th style='text-align: right;'>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {$itemsTableRows}
                        <tr class='total-row'>
                            <td colspan='3' style='padding: 15px 10px 10px 10px; text-align: right;'>Grand Total:</td>
                            <td style='padding: 15px 10px 10px 10px; text-align: right; color: #183c2b;'>₹{$totalAmount}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div class='footer'>
                <p>Processed securely by the ZOLOFRESH Checkout Engine</p>
                <p>Sender IP: " . htmlspecialchars($_SERVER['REMOTE_ADDR']) . "</p>
            </div>
        </div>
    </body>
    </html>
    ";

    // Setup email headers
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: ZoloFresh Portal <webmaster@zolofresh.in>" . "\r\n";
    $headers .= "Reply-To: " . $name . " <" . $email . ">" . "\r\n";
    
    // Send email copy to owner and optionally CC the customer
    $emailSent = mail($to, $emailSubject, $emailBody, $headers);
    if (!empty($email)) {
        mail($email, "ZoloFresh Order Confirmation: " . $orderId, $emailBody, $headers);
    }

    echo json_encode([
        'status' => 'success',
        'message' => 'Order placed successfully.',
        'orderId' => $orderId
    ]);

} catch (Exception $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo json_encode([
        'status' => 'error',
        'message' => 'Order processing failed: ' . $e->getMessage()
    ]);
}
?>
