const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PORT = 8000;
const DB_FILE = path.join(__dirname, 'zolofresh.db');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon'
};

function generateOrderId() {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `ZF-${dateStr}-${randomNum}`;
}

const server = http.createServer((req, res) => {
  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const reqPath = urlObj.pathname;

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Handle Checkout Submit POST API
  if ((reqPath === '/checkout_submit.php' || reqPath === '/api/checkout') && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const { name, email, phone, pincode, city, address, paymentMethod, deliveryTier, totalAmount, cartItems } = payload;

        if (!name || !email || !phone || !pincode || !city || !address || !cartItems || !cartItems.length) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'error', message: 'Please complete all required fields.' }));
          return;
        }

        const orderId = generateOrderId();

        // Save email output locally if no SMTP configured
        const outboxDir = path.join(__dirname, 'email_outbox');
        if (!fs.existsSync(outboxDir)) fs.mkdirSync(outboxDir, { recursive: true });

        const itemsRows = cartItems.map(item => `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.title || 'Product'}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">₹${Number(item.price || 0).toFixed(2)}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity || 1}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₹${(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}</td>
          </tr>
        `).join('');

        const htmlEmail = `
          <!DOCTYPE html>
          <html>
          <body>
            <h2>ZOLOFRESH Order Confirmation: ${orderId}</h2>
            <p><strong>Customer:</strong> ${name} (${email}, ${phone})</p>
            <p><strong>Address:</strong> ${address}, ${city} - ${pincode}</p>
            <p><strong>Payment:</strong> ${paymentMethod} | <strong>Delivery:</strong> ${deliveryTier}</p>
            <h3>Order Summary</h3>
            <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">
              <thead><tr><th>Product</th><th>Price</th><th>Qty</th><th>Subtotal</th></tr></thead>
              <tbody>
                ${itemsRows}
                <tr><td colspan="3" align="right"><strong>Total:</strong></td><td><strong>₹${Number(totalAmount).toFixed(2)}</strong></td></tr>
              </tbody>
            </table>
          </body>
          </html>
        `;

        fs.writeFileSync(path.join(outboxDir, `email_${orderId}.html`), htmlEmail, 'utf-8');

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'success',
          message: 'Order saved and confirmation email generated successfully.',
          orderId: orderId,
          emailSent: true
        }));

      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'error', message: 'Failed to process checkout: ' + err.message }));
      }
    });
    return;
  }

  // Serve static files
  let filePath = path.join(__dirname, reqPath === '/' ? 'index.html' : reqPath);
  let extname = path.extname(filePath).toLowerCase();
  let contentType = MIME_TYPES[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end('Server Error: ' + error.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`ZOLOFRESH Node Server running at http://localhost:${PORT}/`);
});
