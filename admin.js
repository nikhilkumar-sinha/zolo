/*
   Khaliyar Khetihaar (खलियार खेतिहर) - Admin Dashboard Controller
   Author: Antigravity Code Assistant
   Features: Admin Authentication, Normalized Table Operations, Relational CRUD, Auto-SKUs, CSV Export
*/

// --- INITIAL STATE & SECURITY ---
document.addEventListener('DOMContentLoaded', () => {
  checkSession();
  setupSidebarNavigation();
  setupFilters();
  setupSKUAutoSuggest();
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
      
      menuItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

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
        title.textContent = 'Inventory & CRUD';
        subtitle.textContent = 'Manage normalized database records, edit attributes, variants, and SEO details.';
        renderInventory();
      } else if (targetPaneId === 'pane-categories') {
        title.textContent = 'Category Setup';
        subtitle.textContent = 'Add and manage main product taxonomy classes.';
        renderCategories();
      }
    });
  });
}

function setupFilters() {
  const filterSelect = document.getElementById('order-status-filter');
  if (filterSelect) {
    filterSelect.addEventListener('change', renderOrders);
  }
}

// --- DATA LOADER ---
function loadDashboardData() {
  populateCategoriesSelector();
  renderAnalytics();
  renderOrders();
  renderInventory();
  renderCategories();
}

// --- PANE 1: ANALYTICS RENDER ---
function renderAnalytics() {
  const orders = JSON.parse(localStorage.getItem('kk_orders')) || [];
  const inventory = JSON.parse(localStorage.getItem('kk_product_inventory')) || [];
  const products = JSON.parse(localStorage.getItem('kk_products')) || [];
  
  // Calculate revenue from non-cancelled orders
  const activeOrders = orders.filter(o => o.status !== 'Cancelled');
  const grossSales = activeOrders.reduce((sum, o) => sum + o.pricing.total, 0);
  const totalCount = orders.length;
  const averageValue = totalCount > 0 ? (grossSales / totalCount) : 0;

  // Calculate low stock items count
  const lowStockCount = inventory.filter(i => i.stock_quantity <= i.minimum_stock).length;

  document.getElementById('stat-revenue').textContent = `₹${grossSales.toFixed(2)}`;
  document.getElementById('stat-orders-count').textContent = totalCount;
  document.getElementById('stat-average-order').textContent = `₹${averageValue.toFixed(2)}`;
  document.getElementById('stat-low-stock-count').textContent = lowStockCount;

  // Render Low Stock Alert Table
  const lowStockTbody = document.getElementById('low-stock-tbody');
  lowStockTbody.innerHTML = '';
  const lowStockItems = inventory.filter(i => i.stock_quantity <= i.minimum_stock);

  if (lowStockItems.length === 0) {
    lowStockTbody.innerHTML = `<tr><td colspan="3" style="text-align:center; color:var(--color-success); font-weight:600;">✅ All items fully stocked!</td></tr>`;
  } else {
    lowStockItems.forEach(item => {
      const prod = products.find(p => p.id === item.product_id) || {};
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><strong style="color:var(--color-primary-dark);">${item.sku}</strong><br><span style="font-size:0.75rem;">${prod.product_title || 'N/A'}</span></td>
        <td style="font-weight:700; color:var(--color-danger);">${item.stock_quantity} units</td>
        <td><span class="status-badge status-low">Low Stock</span></td>
      `;
      lowStockTbody.appendChild(row);
    });
  }

  // Calculate Category demand stats
  const catSales = { fruits: 0, makhana: 0, grains: 0, sweets: 0, puja: 0, crafts: 0 };
  let grandTotalUnits = 0;

  activeOrders.forEach(order => {
    order.items.forEach(item => {
      // Find category slug dynamically
      const prod = products.find(p => p.slug === item.id);
      if (prod) {
        const categories = JSON.parse(localStorage.getItem('kk_categories')) || [];
        const cat = categories.find(c => c.id === prod.category_id);
        const catSlug = cat ? cat.slug : 'fruits';
        if (catSales[catSlug] !== undefined) {
          catSales[catSlug] += item.quantity;
          grandTotalUnits += item.quantity;
        }
      }
    });
  });

  const chartHolder = document.getElementById('bar-chart-holder');
  chartHolder.innerHTML = '';

  const categoriesText = {
    fruits: 'Orchard Fruits',
    makhana: 'Mithila Makhana',
    grains: 'Heritage Grains',
    sweets: 'Sweets & Delicacies',
    puja: 'Puja Packages',
    crafts: 'Handlooms & Crafts'
  };

  Object.keys(catSales).forEach(cat => {
    const units = catSales[cat];
    const percentage = grandTotalUnits > 0 ? Math.round((units / grandTotalUnits) * 100) : 0;
    
    const row = document.createElement('div');
    row.className = 'bar-row';
    row.innerHTML = `
      <div class="bar-label">${categoriesText[cat] || cat}</div>
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
    renderOrders();
    renderAnalytics();
  }
}

// --- PANE 3: INVENTORY CRUD RENDER ---
function renderInventory() {
  const products = JSON.parse(localStorage.getItem('kk_products')) || [];
  const inventory = JSON.parse(localStorage.getItem('kk_product_inventory')) || [];
  const categories = JSON.parse(localStorage.getItem('kk_categories')) || [];
  const tbody = document.getElementById('products-tbody');
  
  tbody.innerHTML = '';

  products.forEach(p => {
    const inv = inventory.find(i => i.product_id === p.id) || {};
    const cat = categories.find(c => c.id === p.category_id) || {};
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td><strong style="color:var(--color-primary-dark);">${p.sku}</strong></td>
      <td>
        <strong>${p.product_title}</strong><br>
        <span style="font-size:0.75rem; color:var(--color-text-muted);">${p.package_size}</span>
      </td>
      <td><span style="font-size:0.85rem;">${cat.category_name || 'N/A'}</span></td>
      <td style="font-weight: 700;">₹${p.price}</td>
      <td style="font-weight: 700;">${inv.stock_quantity} units</td>
      <td><span style="font-size:0.85rem; color:var(--color-text-muted);">${inv.warehouse || 'N/A'}</span></td>
      <td>
        <span class="status-badge status-${inv.stock_quantity > inv.minimum_stock ? 'instock' : 'low'}">
          ${inv.stock_quantity > inv.minimum_stock ? 'In Stock' : 'Low Stock'}
        </span>
      </td>
      <td>
        <button class="btn-row-action" onclick="openProductModal('edit', ${p.id})" title="Edit"><i data-lucide="edit-3" style="width:16px; height:16px;"></i></button>
        <button class="btn-row-action" onclick="duplicateProduct(${p.id})" title="Duplicate"><i data-lucide="copy" style="width:16px; height:16px;"></i></button>
        <button class="btn-row-action" onclick="deleteProduct(${p.id})" title="Delete" style="color:var(--color-danger);"><i data-lucide="trash-2" style="width:16px; height:16px;"></i></button>
      </td>
    `;
    tbody.appendChild(row);
  });
  
  lucide.createIcons();
}

// --- PANE 4: CATEGORY MANAGER ---
function renderCategories() {
  const categories = JSON.parse(localStorage.getItem('kk_categories')) || [];
  const tbody = document.getElementById('categories-tbody');
  tbody.innerHTML = '';

  categories.forEach(c => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${c.id}</td>
      <td><strong>${c.category_name}</strong></td>
      <td><code>${c.slug}</code></td>
      <td style="font-size:0.85rem; color:var(--color-text-muted);">${c.description}</td>
      <td><span class="status-badge status-delivered">${c.status ? 'Active' : 'Inactive'}</span></td>
    `;
    tbody.appendChild(row);
  });
}

function handleAddCategory() {
  const name = document.getElementById('new-cat-name').value.trim();
  const desc = document.getElementById('new-cat-desc').value.trim();
  
  if (!name || !desc) return;
  
  const categories = JSON.parse(localStorage.getItem('kk_categories')) || [];
  const nextId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  categories.push({
    id: nextId,
    category_name: name,
    slug: slug,
    description: desc,
    status: true
  });

  localStorage.setItem('kk_categories', JSON.stringify(categories));
  document.getElementById('add-category-form').reset();
  alert(`Category "${name}" added successfully!`);
  renderCategories();
  populateCategoriesSelector();
}

function populateCategoriesSelector() {
  const categories = JSON.parse(localStorage.getItem('kk_categories')) || [];
  const select = document.getElementById('form-category');
  if (select) {
    select.innerHTML = '';
    categories.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = c.category_name;
      select.appendChild(opt);
    });
  }
}

// --- SKU AUTO SUGGEST ENGINE ---
function setupSKUAutoSuggest() {
  // Suggests SKU as the user is typing title
  window.suggestSKU = function() {
    const title = document.getElementById('form-title').value.trim();
    if (!title) return;
    
    const words = title.toUpperCase().replace(/[^A-Z ]/g, '').split(' ');
    let prefix = 'USE';
    if (words.length > 1) {
      prefix = (words[0].substring(0, 1) + words[1].substring(0, 2));
    } else {
      prefix = words[0].substring(0, 3);
    }
    prefix = prefix.padEnd(3, 'X');

    // Find highest count for this SKU identifier prefix in DB to avoid collisions
    const products = JSON.parse(localStorage.getItem('kk_products')) || [];
    const prefixRegex = new RegExp(`^USE-${prefix}-(\\d+)`);
    let maxNum = 0;
    
    products.forEach(p => {
      const match = p.sku.match(prefixRegex);
      if (match) {
        const num = parseInt(match[1]);
        if (num > maxNum) maxNum = num;
      }
    });

    const nextNumString = String(maxNum + 1).padStart(3, '0');
    document.getElementById('form-sku').value = `USE-${prefix}-${nextNumString}`;
  };
}

// --- PRODUCT CRUD MODAL LOGIC ---
window.openProductModal = function(mode, productId = null) {
  const modal = document.getElementById('product-modal');
  const modalTitle = document.getElementById('modal-product-title');
  const form = document.getElementById('product-form');
  
  form.reset();
  document.getElementById('form-action-mode').value = mode;
  document.getElementById('form-product-db-id').value = productId || '';

  if (mode === 'create') {
    modalTitle.textContent = 'Add New Product Record';
  } else if (mode === 'edit' && productId) {
    modalTitle.textContent = 'Edit Product Registry';
    
    // Load existing relational records
    const products = JSON.parse(localStorage.getItem('kk_products')) || [];
    const inventory = JSON.parse(localStorage.getItem('kk_product_inventory')) || [];
    const seo = JSON.parse(localStorage.getItem('kk_product_seo')) || [];
    const seasonal = JSON.parse(localStorage.getItem('kk_seasonal_availability')) || [];
    const tags = JSON.parse(localStorage.getItem('kk_product_tags')) || [];

    const p = products.find(prod => prod.id === productId);
    const inv = inventory.find(i => i.product_id === productId) || {};
    const s = seo.find(x => x.product_id === productId) || {};
    const sea = seasonal.find(y => y.product_id === productId) || {};
    const pt = tags.filter(t => t.product_id === productId).map(t => t.tag).join(', ');

    if (p) {
      document.getElementById('form-title').value = p.product_title;
      document.getElementById('form-sku').value = p.sku;
      document.getElementById('form-category').value = p.category_id;
      document.getElementById('form-origin').value = p.origin_region;
      document.getElementById('form-unit').value = p.unit;
      document.getElementById('form-size').value = p.package_size;
      document.getElementById('form-price').value = p.price;
      document.getElementById('form-sale-price').value = p.sale_price || '';
      document.getElementById('form-cost-price').value = p.cost_price || '';
      document.getElementById('form-tax').value = p.tax;
      document.getElementById('form-short-desc').value = p.short_description;
      document.getElementById('form-full-desc').value = p.full_description;

      document.getElementById('form-stock').value = inv.stock_quantity || 0;
      document.getElementById('form-min-stock').value = inv.minimum_stock || 15;
      document.getElementById('form-max-stock').value = inv.maximum_stock || 1000;
      document.getElementById('form-warehouse').value = inv.warehouse || 'Warehouse A';

      document.getElementById('form-tags').value = pt;
      document.getElementById('form-is-organic').checked = p.organic;
      document.getElementById('form-is-gi').checked = p.gi_tagged;
      document.getElementById('form-is-featured').checked = p.featured;

      document.getElementById('form-season-from').value = sea.available_from || '2026-04-01';
      document.getElementById('form-season-to').value = sea.available_to || '2026-09-30';
      document.getElementById('form-preorder').checked = sea.preorder_allowed || false;

      document.getElementById('form-seo-title').value = s.meta_title || '';
      document.getElementById('form-seo-keywords').value = s.meta_keywords || '';
      document.getElementById('form-seo-desc').value = s.meta_description || '';
    }
  }

  modal.classList.add('open');
};

window.closeProductModal = function() {
  document.getElementById('product-modal').classList.remove('open');
};

window.saveProductAction = function() {
  const mode = document.getElementById('form-action-mode').value;
  const productId = parseInt(document.getElementById('form-product-db-id').value);

  const title = document.getElementById('form-title').value.trim();
  const sku = document.getElementById('form-sku').value.trim();
  const categoryId = parseInt(document.getElementById('form-category').value);
  const origin = document.getElementById('form-origin').value.trim();
  const unit = document.getElementById('form-unit').value.trim();
  const size = document.getElementById('form-size').value.trim();
  const price = parseFloat(document.getElementById('form-price').value);
  const salePrice = parseFloat(document.getElementById('form-sale-price').value) || null;
  const costPrice = parseFloat(document.getElementById('form-cost-price').value) || null;
  const tax = parseFloat(document.getElementById('form-tax').value) || 5.00;
  const shortDesc = document.getElementById('form-short-desc').value.trim();
  const fullDesc = document.getElementById('form-full-desc').value.trim();

  const stock = parseInt(document.getElementById('form-stock').value) || 0;
  const minStock = parseInt(document.getElementById('form-min-stock').value) || 15;
  const maxStock = parseInt(document.getElementById('form-max-stock').value) || 1000;
  const warehouse = document.getElementById('form-warehouse').value.trim();

  const tagsInput = document.getElementById('form-tags').value.trim();
  const isOrganic = document.getElementById('form-is-organic').checked;
  const isGI = document.getElementById('form-is-gi').checked;
  const isFeatured = document.getElementById('form-is-featured').checked;

  const seasonFrom = document.getElementById('form-season-from').value;
  const seasonTo = document.getElementById('form-season-to').value;
  const preorderAllowed = document.getElementById('form-preorder').checked;

  const seoTitle = document.getElementById('form-seo-title').value.trim();
  const seoKeywords = document.getElementById('form-seo-keywords').value.trim();
  const seoDesc = document.getElementById('form-seo-desc').value.trim();

  // Pull local stores
  const products = JSON.parse(localStorage.getItem('kk_products')) || [];
  const inventory = JSON.parse(localStorage.getItem('kk_product_inventory')) || [];
  const seo = JSON.parse(localStorage.getItem('kk_product_seo')) || [];
  const seasonal = JSON.parse(localStorage.getItem('kk_seasonal_availability')) || [];
  let tags = JSON.parse(localStorage.getItem('kk_product_tags')) || [];

  let targetId = productId;
  if (mode === 'create') {
    targetId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    
    // Create new core product record
    products.push({
      id: targetId,
      sku,
      product_title: title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      short_description: shortDesc,
      full_description: fullDesc,
      category_id: categoryId,
      origin_region: origin,
      unit,
      package_size: size,
      price,
      sale_price: salePrice,
      cost_price: costPrice,
      tax,
      brand: 'UseMadi',
      featured: isFeatured,
      organic: isOrganic,
      gi_tagged: isGI,
      seasonal: seasonFrom !== '',
      harvest_season: 'Winter',
      shelf_life: '15 Days',
      weight: 1.00,
      image: '',
      status: 'Active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    // Create related inventory record
    inventory.push({
      id: targetId,
      product_id: targetId,
      sku,
      stock_quantity: stock,
      reserved_stock: 0,
      minimum_stock: minStock,
      maximum_stock: maxStock,
      stock_status: stock > minStock ? 'In Stock' : (stock === 0 ? 'Out of Stock' : 'Low Stock'),
      availability: stock > 0,
      warehouse,
      updated_at: new Date().toISOString()
    });

    // Create related seasonal record
    seasonal.push({
      id: targetId,
      product_id: targetId,
      available_from: seasonFrom,
      available_to: seasonTo,
      season: 'Winter',
      preorder_allowed: preorderAllowed
    });

    // Create related SEO record
    seo.push({
      id: targetId,
      product_id: targetId,
      meta_title: seoTitle,
      meta_description: seoDesc,
      meta_keywords: seoKeywords,
      canonical_url: `https://usemadi.com/products/${targetId}`
    });
  } else {
    // Update existing core record
    const pIdx = products.findIndex(prod => prod.id === targetId);
    if (pIdx !== -1) {
      products[pIdx].product_title = title;
      products[pIdx].sku = sku;
      products[pIdx].category_id = categoryId;
      products[pIdx].origin_region = origin;
      products[pIdx].unit = unit;
      products[pIdx].package_size = size;
      products[pIdx].price = price;
      products[pIdx].sale_price = salePrice;
      products[pIdx].cost_price = costPrice;
      products[pIdx].tax = tax;
      products[pIdx].short_description = shortDesc;
      products[pIdx].full_description = fullDesc;
      products[pIdx].organic = isOrganic;
      products[pIdx].gi_tagged = isGI;
      products[pIdx].featured = isFeatured;
      products[pIdx].updated_at = new Date().toISOString();
    }

    // Update inventory record
    const iIdx = inventory.findIndex(inv => inv.product_id === targetId);
    if (iIdx !== -1) {
      inventory[iIdx].sku = sku;
      inventory[iIdx].stock_quantity = stock;
      inventory[iIdx].minimum_stock = minStock;
      inventory[iIdx].maximum_stock = maxStock;
      inventory[iIdx].warehouse = warehouse;
      inventory[iIdx].stock_status = stock > minStock ? 'In Stock' : (stock === 0 ? 'Out of Stock' : 'Low Stock');
      inventory[iIdx].availability = stock > 0;
      inventory[iIdx].updated_at = new Date().toISOString();
    }

    // Update seasonal record
    const sIdx = seasonal.findIndex(se => se.product_id === targetId);
    if (sIdx !== -1) {
      seasonal[sIdx].available_from = seasonFrom;
      seasonal[sIdx].available_to = seasonTo;
      seasonal[sIdx].preorder_allowed = preorderAllowed;
    }

    // Update SEO record
    const seoIdx = seo.findIndex(se => se.product_id === targetId);
    if (seoIdx !== -1) {
      seo[seoIdx].meta_title = seoTitle;
      seo[seoIdx].meta_keywords = seoKeywords;
      seo[seoIdx].meta_description = seoDesc;
    }
  }

  // Update tag records
  tags = tags.filter(t => t.product_id !== targetId);
  if (tagsInput) {
    tagsInput.split(',').forEach(tagStr => {
      tags.push({
        id: tags.length + 1,
        product_id: targetId,
        tag: tagStr.trim()
      });
    });
  }

  // Sync back to local storage
  localStorage.setItem('kk_products', JSON.stringify(products));
  localStorage.setItem('kk_product_inventory', JSON.stringify(inventory));
  localStorage.setItem('kk_product_seo', JSON.stringify(seo));
  localStorage.setItem('kk_seasonal_availability', JSON.stringify(seasonal));
  localStorage.setItem('kk_product_tags', JSON.stringify(tags));

  closeProductModal();
  alert(`Product "${title}" successfully synced with relational tables!`);
  renderInventory();
  renderAnalytics();
};

window.duplicateProduct = function(productId) {
  const products = JSON.parse(localStorage.getItem('kk_products')) || [];
  const inventory = JSON.parse(localStorage.getItem('kk_product_inventory')) || [];
  const seo = JSON.parse(localStorage.getItem('kk_product_seo')) || [];
  const seasonal = JSON.parse(localStorage.getItem('kk_seasonal_availability')) || [];
  const tags = JSON.parse(localStorage.getItem('kk_product_tags')) || [];

  const sourceProd = products.find(p => p.id === productId);
  if (!sourceProd) return;

  const nextId = Math.max(...products.map(p => p.id)) + 1;
  const newSku = sourceProd.sku + '-DUP';
  const newTitle = `Copy of ${sourceProd.product_title}`;

  // Duplicate core product
  const newProd = { ...sourceProd, id: nextId, sku: newSku, product_title: newTitle, created_at: new Date().toISOString() };
  products.push(newProd);

  // Duplicate inventory
  const sourceInv = inventory.find(i => i.product_id === productId) || {};
  inventory.push({ ...sourceInv, id: nextId, product_id: nextId, sku: newSku });

  // Duplicate SEO
  const sourceSeo = seo.find(s => s.product_id === productId) || {};
  seo.push({ ...sourceSeo, id: nextId, product_id: nextId });

  // Duplicate seasonal
  const sourceSeason = seasonal.find(s => s.product_id === productId) || {};
  seasonal.push({ ...sourceSeason, id: nextId, product_id: nextId });

  // Duplicate tags
  const sourceTags = tags.filter(t => t.product_id === productId);
  sourceTags.forEach(t => {
    tags.push({ id: tags.length + 1, product_id: nextId, tag: t.tag });
  });

  localStorage.setItem('kk_products', JSON.stringify(products));
  localStorage.setItem('kk_product_inventory', JSON.stringify(inventory));
  localStorage.setItem('kk_product_seo', JSON.stringify(seo));
  localStorage.setItem('kk_seasonal_availability', JSON.stringify(seasonal));
  localStorage.setItem('kk_product_tags', JSON.stringify(tags));

  alert(`Duplicated as "${newTitle}"!`);
  renderInventory();
  renderAnalytics();
};

window.deleteProduct = function(productId) {
  if (!confirm('Are you sure you want to permanently delete this product and its variants, inventory, and SEO mappings?')) return;

  let products = JSON.parse(localStorage.getItem('kk_products')) || [];
  let inventory = JSON.parse(localStorage.getItem('kk_product_inventory')) || [];
  let seo = JSON.parse(localStorage.getItem('kk_product_seo')) || [];
  let seasonal = JSON.parse(localStorage.getItem('kk_seasonal_availability')) || [];
  let tags = JSON.parse(localStorage.getItem('kk_product_tags')) || [];

  products = products.filter(p => p.id !== productId);
  inventory = inventory.filter(i => i.product_id !== productId);
  seo = seo.filter(s => s.product_id !== productId);
  seasonal = seasonal.filter(s => s.product_id !== productId);
  tags = tags.filter(t => t.product_id !== productId);

  localStorage.setItem('kk_products', JSON.stringify(products));
  localStorage.setItem('kk_product_inventory', JSON.stringify(inventory));
  localStorage.setItem('kk_product_seo', JSON.stringify(seo));
  localStorage.setItem('kk_seasonal_availability', JSON.stringify(seasonal));
  localStorage.setItem('kk_product_tags', JSON.stringify(tags));

  alert('Product record deleted successfully.');
  renderInventory();
  renderAnalytics();
};

// --- BULK INVENTORY CSV EXPORT ---
window.triggerCSVExport = function() {
  const products = JSON.parse(localStorage.getItem('kk_products')) || [];
  const inventory = JSON.parse(localStorage.getItem('kk_product_inventory')) || [];
  const categories = JSON.parse(localStorage.getItem('kk_categories')) || [];

  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "SKU,Product Title,Category,Regular Price,Stock Quantity,Warehouse,Stock Status\r\n";

  products.forEach(p => {
    const inv = inventory.find(i => i.product_id === p.id) || {};
    const cat = categories.find(c => c.id === p.category_id) || {};
    
    const titleClean = p.product_title.replace(/"/g, '""');
    const catClean = (cat.category_name || 'N/A').replace(/"/g, '""');
    const status = inv.stock_quantity > inv.minimum_stock ? 'In Stock' : 'Low Stock';
    
    csvContent += `"${p.sku}","${titleClean}","${catClean}",${p.price},${inv.stock_quantity},"${inv.warehouse || 'N/A'}","${status}"\r\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `usemadi_inventory_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
