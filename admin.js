/*
   Khaliyar Khetihaar (खलियार खेतिहर) - Admin Dashboard Controller
   Author: Antigravity Code Assistant
   Features: Admin Authentication, Order Tracking, Inventory Management, Live LocalStorage Sync
*/

// --- INITIAL STATE & SECURITY ---
document.addEventListener('DOMContentLoaded', () => {
  checkSession();
  setupSidebarNavigation();
  setupFilters();
  lucide.createIcons();
});

function checkSession() {
  const isLoggedIn = sessionStorage.getItem('kk_admin_logged');
  const loginOverlay = document.getElementById('login-overlay');

  if (isLoggedIn === 'true') {
    loginOverlay.classList.add('hide');
    loadDashboardData();
  } else {
    loginOverlay.classList.remove('hide');
  }
}

function handleLogin() {
  const user = document.getElementById('username').value.trim();
  const pass = document.getElementById('password').value;
  const errorMsg = document.getElementById('login-error-msg');

  if (user === 'admin' && pass === 'khetihaar2026') {
    sessionStorage.setItem('kk_admin_logged', 'true');
    document.getElementById('login-overlay').classList.add('hide');
    errorMsg.style.display = 'none';
    
    // Clear credentials fields
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';

    loadDashboardData();
  } else {
    errorMsg.style.display = 'block';
  }
}

function handleLogout() {
  sessionStorage.removeItem('kk_admin_logged');
  document.getElementById('login-overlay').classList.remove('hide');
}

// --- TAB CONTROLLER ---
function setupSidebarNavigation() {
  const menuItems = document.querySelectorAll('.aside-menu-item');
  const panes = document.querySelectorAll('.dashboard-pane');
  const title = document.getElementById('main-pane-title');
  const subtitle = document.getElementById('main-pane-subtitle');

  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Update sidebar state
      menuItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      // Update visibility of content panes
      const targetPaneId = item.getAttribute('data-target');
      panes.forEach(pane => pane.classList.remove('active'));
      document.getElementById(targetPaneId).classList.add('active');

      // Update text titles
      if (targetPaneId === 'pane-analytics') {
        title.textContent = 'Analytics Dashboard';
        subtitle.textContent = 'Overview of sales revenue and category performance cycles.';
        renderAnalytics();
      } else if (targetPaneId === 'pane-orders') {
        title.textContent = 'Customer Orders';
        subtitle.textContent = 'Track client order dispatches, payments, and delivery milestones.';
        renderOrders();
      } else if (targetPaneId === 'pane-inventory') {
        title.textContent = 'Inventory Manager';
        subtitle.textContent = 'Toggle product availability, adjust pricing, and add seasonal harvests.';
        renderInventory();
      }
    });
  });
}

function setupFilters() {
  document.getElementById('order-status-filter').addEventListener('change', renderOrders);
}

// --- DATA LOADER ---
function loadDashboardData() {
  renderAnalytics();
  renderOrders();
  renderInventory();
}

// --- PANE 1: ANALYTICS RENDER ---
function renderAnalytics() {
  const orders = JSON.parse(localStorage.getItem('kk_orders')) || [];
  
  // Calculate revenue from non-cancelled orders
  const activeOrders = orders.filter(o => o.status !== 'Cancelled');
  const grossSales = activeOrders.reduce((sum, o) => sum + o.pricing.total, 0);
  const totalCount = orders.length;
  const averageValue = totalCount > 0 ? (grossSales / totalCount) : 0;

  document.getElementById('stat-revenue').textContent = `₹${grossSales.toFixed(2)}`;
  document.getElementById('stat-orders-count').textContent = totalCount;
  document.getElementById('stat-average-order').textContent = `₹${averageValue.toFixed(2)}`;

  // Calculate Category demand stats
  const catSales = { fruits: 0, grains: 0, puja: 0, heritage: 0 };
  let grandTotalUnits = 0;

  activeOrders.forEach(order => {
    order.items.forEach(item => {
      // Find product category from product DB to be accurate
      const products = JSON.parse(localStorage.getItem('kk_products')) || [];
      const prod = products.find(p => p.id === item.id);
      const cat = prod ? prod.category : 'grains';
      
      if (catSales[cat] !== undefined) {
        catSales[cat] += item.quantity;
        grandTotalUnits += item.quantity;
      }
    });
  });

  const chartHolder = document.getElementById('bar-chart-holder');
  chartHolder.innerHTML = '';

  const categoriesText = {
    fruits: 'Fruits (Mango/Litchi)',
    grains: 'Grains & Sattu',
    puja: 'Puja Essentials',
    heritage: 'GI Tagged Specials'
  };

  Object.keys(catSales).forEach(cat => {
    const units = catSales[cat];
    const percentage = grandTotalUnits > 0 ? Math.round((units / grandTotalUnits) * 100) : 0;
    
    const row = document.createElement('div');
    row.className = 'bar-row';
    row.innerHTML = `
      <div class="bar-label">${categoriesText[cat]}</div>
      <div class="bar-track">
        <div class="bar-fill" style="width: ${percentage}%"></div>
      </div>
      <div class="bar-val">${percentage}% (${units} units)</div>
    `;
    chartHolder.appendChild(row);
  });
}

// --- PANE 2: ORDERS MANAGER ---
function renderOrders() {
  const orders = JSON.parse(localStorage.getItem('kk_orders')) || [];
  const filter = document.getElementById('order-status-filter').value;
  const tbody = document.getElementById('orders-tbody');
  
  tbody.innerHTML = '';

  const filteredOrders = orders.filter(o => {
    if (filter === 'ALL') return true;
    return o.status.toUpperCase() === filter;
  });

  if (filteredOrders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:var(--color-text-muted);">No orders match this status.</td></tr>`;
    return;
  }

  filteredOrders.forEach(order => {
    const row = document.createElement('tr');
    
    // Format items details summary
    const itemsText = order.items.map(i => `${i.title} (${i.quantity})`).join(', ');
    const orderDate = new Date(order.date).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    });

    row.innerHTML = `
      <td style="font-weight: 700;">${order.id}</td>
      <td>${orderDate}</td>
      <td>
        <strong style="color:var(--color-primary-dark);">${order.customer.name}</strong><br>
        <span style="font-size:0.8rem; color:var(--color-text-muted);">${order.customer.phone}</span>
      </td>
      <td style="max-width: 220px; font-size:0.85rem;">
        ${order.customer.address} (Pincode: ${order.customer.pincode})
        <div class="order-items-tooltip"><strong>Items:</strong> ${itemsText}</div>
      </td>
      <td style="font-weight: 700;">₹${order.pricing.total.toFixed(2)}</td>
      <td><span style="font-size:0.75rem; font-weight:700; color:var(--color-text-muted);">${order.paymentMethod}</span></td>
      <td>
        <span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span>
      </td>
      <td>
        <select class="btn-status-action" onchange="updateOrderStatus('${order.id}', this.value)" aria-label="Change status of order ${order.id}">
          <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
          <option value="Dispatched" ${order.status === 'Dispatched' ? 'selected' : ''}>Dispatched</option>
          <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
          <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
        </select>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function updateOrderStatus(orderId, newStatus) {
  const orders = JSON.parse(localStorage.getItem('kk_orders')) || [];
  const idx = orders.findIndex(o => o.id === orderId);
  
  if (idx !== -1) {
    orders[idx].status = newStatus;
    localStorage.setItem('kk_orders', JSON.stringify(orders));
    
    // Live refresh data grids
    renderOrders();
    renderAnalytics();
  }
}

// --- PANE 3: INVENTORY CATALOG ---
function renderInventory() {
  const products = JSON.parse(localStorage.getItem('kk_products')) || [];
  const tbody = document.getElementById('products-tbody');
  
  tbody.innerHTML = '';

  products.forEach(product => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>
        <strong style="color:var(--color-primary-dark);">${product.title}</strong><br>
        <span style="font-size:0.75rem; color:var(--color-text-muted);">${product.unit}</span>
      </td>
      <td><span style="text-transform: capitalize; font-size:0.85rem;">${product.category}</span></td>
      <td style="font-weight: 700;">₹${product.price}</td>
      <td style="font-size:0.85rem;">${product.origin}</td>
      <td>
        <label class="switch">
          <input type="checkbox" ${product.inStock ? 'checked' : ''} onchange="toggleProductStock('${product.id}', this.checked)">
          <span class="slider"></span>
        </label>
        <span style="margin-left: 8px; font-size:0.8rem; font-weight:600; color: ${product.inStock ? 'var(--color-success)' : 'var(--color-danger)'}">
          ${product.inStock ? 'In Stock' : 'Out of Stock'}
        </span>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function toggleProductStock(productId, isChecked) {
  const products = JSON.parse(localStorage.getItem('kk_products')) || [];
  const idx = products.findIndex(p => p.id === productId);

  if (idx !== -1) {
    products[idx].inStock = isChecked;
    localStorage.setItem('kk_products', JSON.stringify(products));
    renderInventory(); // Update inventory panel locally
  }
}

function handleAddProduct() {
  const title = document.getElementById('new-title').value.trim();
  const category = document.getElementById('new-category').value;
  const origin = document.getElementById('new-origin').value.trim();
  const price = parseFloat(document.getElementById('new-price').value);
  const unit = document.getElementById('new-unit').value.trim();
  const desc = document.getElementById('new-desc').value.trim();
  const heritage = document.getElementById('new-heritage').value.trim();
  
  const isOrganic = document.getElementById('new-is-organic').checked;
  const isGI = document.getElementById('new-is-gi').checked;
  const isSeasonal = document.getElementById('new-is-seasonal').checked;

  if (!title || !origin || isNaN(price) || !unit || !desc || !heritage) {
    alert('Please fill out all fields correctly.');
    return;
  }

  const products = JSON.parse(localStorage.getItem('kk_products')) || [];
  
  // Generate unique slugified ID
  const slugId = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const newProduct = {
    id: slugId,
    title,
    category,
    isGI,
    isOrganic,
    isSeasonal,
    season: 'winter', // default assignment
    price,
    unit,
    image: '', // Use CSS custom SVGs fallback in app.js
    origin,
    popularity: 75,
    inStock: true,
    description: desc,
    heritageStory: heritage
  };

  products.push(newProduct);
  localStorage.setItem('kk_products', JSON.stringify(products));

  // Reset form inputs
  document.getElementById('add-product-form').reset();
  alert(`Product "${title}" has been successfully added to the catalog!`);

  // Refresh local list
  renderInventory();
}
