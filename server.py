import http.server
import socketserver
import json
import sqlite3
import os
import random
import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import urllib.parse
import sys

PORT = 8000
DB_FILE = os.path.join(os.path.dirname(__file__), 'zolofresh.db')

# Ensure DB is initialized
if not os.path.exists(DB_FILE):
    import init_db
    init_db.init_db()

MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.avif': 'image/avif',
    '.ico': 'image/x-icon',
    '.woff2': 'font/woff2'
}

def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def generate_order_id():
    date_str = datetime.datetime.now().strftime('%Y%m%d')
    random_num = str(random.randint(10000, 99999))
    return f"ZF-{date_str}-{random_num}"

def send_order_email(order_id, customer_name, customer_email, customer_phone, address, city, pincode, delivery_tier, payment_method, total_amount, cart_items):
    admin_email = "zolofreshofficial@gmail.com"
    subject = f"New ZOLOFRESH Order Placed: {order_id}"

    # Build HTML Rows for Cart Items
    items_rows_html = ""
    for item in cart_items:
        title = item.get('title', 'Product')
        price = float(item.get('price', 0))
        qty = int(item.get('quantity', 1))
        subtotal = price * qty
        items_rows_html += f"""
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eaeaea;">{title}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eaeaea; text-align: center;">₹{price:.2f}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eaeaea; text-align: center;">{qty}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eaeaea; text-align: right;">₹{subtotal:.2f}</td>
        </tr>
        """

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>ZOLOFRESH Order Confirmation</title>
        <style>
            body {{ font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #242424; background-color: #faf7f0; margin: 0; padding: 20px; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e4ded2; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(24,60,43,0.05); }}
            .header {{ border-bottom: 3px solid #183c2b; padding-bottom: 12px; margin-bottom: 24px; text-align: center; }}
            .header h2 {{ color: #183c2b; margin: 0; font-size: 24px; }}
            .order-badge {{ font-size: 1.1rem; font-weight: bold; color: #d99a24; margin-top: 8px; font-family: monospace; letter-spacing: 1px; }}
            .section-title {{ font-size: 0.95rem; font-weight: bold; color: #183c2b; border-bottom: 1px solid #e4ded2; padding-bottom: 6px; margin: 20px 0 10px 0; text-transform: uppercase; letter-spacing: 0.5px; }}
            .detail-row {{ margin-bottom: 8px; font-size: 0.95rem; }}
            .detail-label {{ font-weight: bold; color: #66635d; width: 140px; display: inline-block; }}
            table {{ width: 100%; border-collapse: collapse; font-size: 0.95rem; margin-top: 15px; }}
            th {{ background-color: #f2ebdd; color: #183c2b; padding: 10px; text-align: left; font-weight: bold; }}
            .total-row {{ font-size: 1.1rem; font-weight: bold; color: #183c2b; }}
            .footer {{ font-size: 0.85rem; color: #66635d; border-top: 1px solid #e4ded2; margin-top: 30px; padding-top: 15px; text-align: center; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>🌿 Order Placement Confirmed</h2>
                <div class="order-badge">Order ID: {order_id}</div>
            </div>
            
            <div class="section-title">Customer Shipping Details</div>
            <div class="detail-row"><span class="detail-label">Full Name:</span> {customer_name}</div>
            <div class="detail-row"><span class="detail-label">Phone Number:</span> {customer_phone}</div>
            <div class="detail-row"><span class="detail-label">Email Address:</span> {customer_email}</div>
            <div class="detail-row"><span class="detail-label">Pincode:</span> {pincode}</div>
            <div class="detail-row"><span class="detail-label">City / Town:</span> {city}</div>
            <div class="detail-row"><span class="detail-label">Delivery Address:</span> {address}</div>

            <div class="section-title">Logistics & Payment</div>
            <div class="detail-row"><span class="detail-label">Delivery Method:</span> {delivery_tier.capitalize()}</div>
            <div class="detail-row"><span class="detail-label">Payment Mode:</span> {payment_method.upper()}</div>

            <div class="section-title">Order Product Breakdown</div>
            <table>
                <thead>
                    <tr>
                        <th>Product Title</th>
                        <th style="text-align: center;">Price</th>
                        <th style="text-align: center;">Qty</th>
                        <th style="text-align: right;">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {items_rows_html}
                    <tr class="total-row">
                        <td colspan="3" style="padding: 15px 10px 10px 10px; text-align: right;">Grand Total:</td>
                        <td style="padding: 15px 10px 10px 10px; text-align: right; color: #183c2b;">₹{total_amount:.2f}</td>
                    </tr>
                </tbody>
            </table>
            
            <div class="footer">
                <p>Processed securely by the ZOLOFRESH Relational Database Engine</p>
                <p>Thank you for choosing ZOLOFRESH for your organic Bihari specialties!</p>
            </div>
        </div>
    </body>
    </html>
    """

    # Check for SMTP settings in environment variables or configuration
    smtp_host = os.environ.get('SMTP_HOST', '')
    smtp_port = int(os.environ.get('SMTP_PORT', 587))
    smtp_user = os.environ.get('SMTP_USER', '')
    smtp_pass = os.environ.get('SMTP_PASS', '')

    email_sent = False

    if smtp_host and smtp_user and smtp_pass:
        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = f"ZOLOFRESH Orders <{smtp_user}>"
            msg['To'] = customer_email
            msg['Cc'] = admin_email
            msg.attach(MIMEText(html_content, 'html', 'utf-8'))

            recipients = [customer_email, admin_email]
            
            with smtplib.SMTP(smtp_host, smtp_port, timeout=10) as server:
                server.starttls()
                server.login(smtp_user, smtp_pass)
                server.sendmail(smtp_user, recipients, msg.as_string())
            email_sent = True
            print(f"Order email successfully dispatched via SMTP to {customer_email} and {admin_email}")
        except Exception as e:
            print(f"SMTP Dispatch Error: {e}")
            email_sent = False
    else:
        # Save order confirmation email locally to email_outbox folder for testing/verification
        outbox_dir = os.path.join(os.path.dirname(__file__), 'email_outbox')
        os.makedirs(outbox_dir, exist_ok=True)
        email_file = os.path.join(outbox_dir, f"email_{order_id}.html")
        with open(email_file, 'w', encoding='utf-8') as f:
            f.write(html_content)
        print(f"Order email logged to outbox: {email_file}")
        email_sent = True

    return email_sent

class ZoloRequestHandler(http.server.BaseHTTPRequestHandler):

    def log_message(self, format, *args):
        # Keep logs clean
        sys.stderr.write("%s - - [%s] %s\n" % (self.address_string(), self.log_date_time_string(), format%args))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path

        if path == '/api/orders':
            self.handle_get_orders()
            return
        elif path == '/api/products':
            self.handle_get_products()
            return

        # Serve static files
        if path == '/':
            path = '/index.html'

        file_path = os.path.join(os.path.dirname(__file__), path.lstrip('/'))

        if os.path.exists(file_path) and os.path.isfile(file_path):
            ext = os.path.splitext(file_path)[1].lower()
            content_type = MIME_TYPES.get(ext, 'application/octet-stream')

            try:
                with open(file_path, 'rb') as f:
                    content = f.read()
                self.send_response(200)
                self.send_header('Content-Type', content_type)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Content-Length', str(len(content)))
                self.end_headers()
                self.wfile.write(content)
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(f"Server Error: {e}".encode('utf-8'))
        else:
            self.send_response(404)
            self.send_header('Content-Type', 'text/html')
            self.end_headers()
            self.wfile.write(b"<h1>404 Not Found</h1>")

    def do_POST(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path

        if path in ['/checkout_submit.php', '/api/checkout']:
            self.handle_checkout_submit()
        else:
            self.send_response(404)
            self.end_headers()

    def handle_checkout_submit(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)

        try:
            payload = json.loads(post_data.decode('utf-8'))
        except Exception as e:
            self.send_json_response({'status': 'error', 'message': f'Invalid JSON payload: {e}'}, status_code=400)
            return

        name = payload.get('name', '').strip()
        email = payload.get('email', '').strip()
        phone = payload.get('phone', '').strip()
        pincode = payload.get('pincode', '').strip()
        city = payload.get('city', '').strip()
        address = payload.get('address', '').strip()
        payment_method = payload.get('paymentMethod', 'COD').strip()
        delivery_tier = payload.get('deliveryTier', 'standard').strip()
        total_amount = float(payload.get('totalAmount', 0.0))
        cart_items = payload.get('cartItems', [])

        if not (name and email and phone and pincode and city and address and cart_items):
            self.send_json_response({
                'status': 'error',
                'message': 'Please fill in all required shipping details and add items to your cart.'
            }, status_code=400)
            return

        # Generate Order ID
        order_id = generate_order_id()

        # Database transaction
        conn = get_db_connection()
        try:
            cursor = conn.cursor()
            cursor.execute("""
            INSERT INTO orders (order_id, customer_name, customer_email, customer_phone, shipping_address, shipping_city, shipping_zip, payment_method, delivery_tier, total_amount, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
            """, (order_id, name, email, phone, address, city, pincode, payment_method, delivery_tier, total_amount))

            for item in cart_items:
                item_id = str(item.get('id', ''))
                item_title = str(item.get('title', 'Product'))
                price = float(item.get('price', 0.0))
                qty = int(item.get('quantity', 1))
                subtotal = price * qty

                cursor.execute("""
                INSERT INTO order_items (order_id, product_id, product_title, price, quantity, subtotal)
                VALUES (?, ?, ?, ?, ?, ?)
                """, (order_id, item_id, item_title, price, qty, subtotal))

            conn.commit()
        except Exception as e:
            conn.rollback()
            conn.close()
            self.send_json_response({'status': 'error', 'message': f'Database save failed: {e}'}, status_code=500)
            return

        conn.close()

        # Send HTML Email Notification
        email_sent = send_order_email(
            order_id=order_id,
            customer_name=name,
            customer_email=email,
            customer_phone=phone,
            address=address,
            city=city,
            pincode=pincode,
            delivery_tier=delivery_tier,
            payment_method=payment_method,
            total_amount=total_amount,
            cart_items=cart_items
        )

        self.send_json_response({
            'status': 'success',
            'message': 'Order successfully submitted and saved to database.',
            'orderId': order_id,
            'emailSent': email_sent
        })

    def handle_get_orders(self):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM orders ORDER BY created_at DESC")
        orders_rows = cursor.fetchall()

        orders_list = []
        for o in orders_rows:
            order_dict = dict(o)
            cursor.execute("SELECT * FROM order_items WHERE order_id = ?", (order_dict['order_id'],))
            items_rows = cursor.fetchall()
            order_dict['items'] = [dict(i) for i in items_rows]
            orders_list.append(order_dict)

        conn.close()
        self.send_json_response({'status': 'success', 'orders': orders_list})

    def handle_get_products(self):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM products WHERE status = 'Active'")
        products_rows = cursor.fetchall()
        conn.close()

        self.send_json_response({'status': 'success', 'products': [dict(p) for p in products_rows]})

    def send_json_response(self, data, status_code=200):
        response_bytes = json.dumps(data).encode('utf-8')
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-Length', str(len(response_bytes)))
        self.end_headers()
        self.wfile.write(response_bytes)

def run_server():
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), ZoloRequestHandler) as httpd:
        print(f"ZOLOFRESH Database & Order Server running at http://localhost:{PORT}/")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")

if __name__ == '__main__':
    run_server()
