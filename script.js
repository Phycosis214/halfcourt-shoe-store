/* ===== Products (PHP pricing · Davao stock) ===== */
const PRODUCTS = [
  {
    id: 'aj1-high-red',
    name: 'Air Jordan 1 High',
    colorway: 'Chicago',
    category: 'jordan',
    type: 'basketball',
    price: 10995,
    stock: 8,
    sizes: ['7','7.5','8','8.5','9','9.5','10','11','12'],
    image: 'images/air jordan high red.png',
    badge: 'Icon',
    desc: 'The original that started it all. Premium leather, classic Chicago colorway, and timeless silhouette.'
  },
  {
    id: 'aj1-low-panda',
    name: 'Air Jordan 1 Low',
    colorway: 'Panda',
    category: 'jordan',
    type: 'lifestyle',
    price: 6995,
    stock: 12,
    sizes: ['6','6.5','7','7.5','8','8.5','9','9.5','10','11'],
    image: 'images/aird Jordan 1 Low Panda.png',
    badge: null,
    desc: 'Clean black and white contrast. Everyday versatility with authentic Jordan DNA.'
  },
  {
    id: 'aj3-black-cement',
    name: 'Air Jordan 3 Retro',
    colorway: 'Black Cement',
    category: 'jordan',
    type: 'basketball',
    price: 12495,
    stock: 5,
    sizes: ['8','8.5','9','9.5','10','11','12'],
    image: 'images/Nike Air Jordan 3 Retro OG Black Cement.png',
    badge: 'OG',
    desc: 'Elephant print, visible Air, and the Jumpman that defined a generation.'
  },
  {
    id: 'aj4-bred',
    name: 'Air Jordan 4',
    colorway: 'Bred',
    category: 'jordan',
    type: 'basketball',
    price: 12995,
    stock: 6,
    sizes: ['7','7.5','8','8.5','9','9.5','10','11'],
    image: 'images/air jordan 4 bred.png',
    badge: 'Hot',
    desc: 'Mesh panels, support wings, and the legendary black/red colorway.'
  },
  {
    id: 'aj4-white-oreo',
    name: 'Air Jordan 4',
    colorway: 'White Oreo',
    category: 'jordan',
    type: 'lifestyle',
    price: 11995,
    stock: 9,
    sizes: ['6.5','7','7.5','8','8.5','9','9.5','10','11','12'],
    image: 'images/air jordan 4 white oreo.png',
    badge: null,
    desc: 'Fresh white upper with speckled midsole. Clean and modern.'
  },
  {
    id: 'aj5-fire-red',
    name: 'Air Jordan 5',
    colorway: 'Fire Red',
    category: 'jordan',
    type: 'basketball',
    price: 11995,
    stock: 4,
    sizes: ['8','8.5','9','9.5','10','11'],
    image: 'images/air jordan 5 fire red.png',
    badge: 'Limited',
    desc: 'Reflective tongue, shark-tooth midsole, and bold red accents.'
  },
  {
    id: 'aj6-infrared',
    name: 'Air Jordan 6',
    colorway: 'Infrared',
    category: 'jordan',
    type: 'basketball',
    price: 11995,
    stock: 7,
    sizes: ['7','7.5','8','8.5','9','9.5','10','11','12'],
    image: 'images/air jordan 6 ifrared.png',
    badge: null,
    desc: 'The championship silhouette. Infrared hits and translucent sole.'
  },
  {
    id: 'aj9-chile-red',
    name: 'Air Jordan 9',
    colorway: 'Chile Red',
    category: 'jordan',
    type: 'lifestyle',
    price: 11495,
    stock: 3,
    sizes: ['8','8.5','9','9.5','10'],
    image: 'images/air jordan 9 chile red.png',
    badge: 'Low Stock',
    desc: 'Speed lacing, molded panels, and striking all-red energy.'
  },
  {
    id: 'aj11-concord',
    name: 'Air Jordan 11',
    colorway: 'Concord',
    category: 'jordan',
    type: 'basketball',
    price: 13495,
    stock: 10,
    sizes: ['6','7','7.5','8','8.5','9','9.5','10','11','12'],
    image: 'images/air jordan 11 concord.png',
    badge: 'Classic',
    desc: 'Patent leather, ballistic mesh, and the most iconic Concord colorway.'
  },
  {
    id: 'aj12-flugame',
    name: 'Air Jordan 12',
    colorway: 'Flu Game',
    category: 'jordan',
    type: 'basketball',
    price: 12495,
    stock: 5,
    sizes: ['7.5','8','8.5','9','9.5','10','11'],
    image: 'images/air jordan 12 flugame.png',
    badge: 'Story',
    desc: 'Black and red legend. The pair that defined resilience and performance.'
  }
];

const ALL_SIZES = ['6','6.5','7','7.5','8','8.5','9','9.5','10','11','12'];
const SHIP_OPTIONS = [
  { id: 'metro', label: 'Metro Davao delivery', eta: '1–2 days', fee: 120 },
  { id: 'nation', label: 'Nationwide delivery', eta: '3–7 days', fee: 180 },
  { id: 'pickup', label: 'Pickup at Lanang store', eta: 'Ready in 24 hrs', fee: 0 }
];

/* ===== State (persisted) ===== */
let activeFilter = 'all';
let searchQuery = '';
let cart = JSON.parse(localStorage.getItem('nike_cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('nike_wish') || '[]');
let selectedShip = 'metro';
let selectedSize = null;

const $ = id => document.getElementById(id);
const money = n => '₱' + Number(n).toLocaleString('en-PH');
const saveCart = () => localStorage.setItem('nike_cart', JSON.stringify(cart));
const saveWish = () => localStorage.setItem('nike_wish', JSON.stringify(wishlist));

function toast(msg) {
  const root = $('toastRoot');
  root.innerHTML = `<div class="toast">${msg}</div>`;
  clearTimeout(window._toastT);
  window._toastT = setTimeout(() => root.innerHTML = '', 2800);
}

/* ===== Render Products ===== */
function renderGrid() {
  const q = searchQuery.trim().toLowerCase();
  const list = PRODUCTS.filter(p => {
    const matchFilter =
      activeFilter === 'all' ||
      p.category === activeFilter ||
      p.type === activeFilter;
    const matchSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.colorway.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const grid = $('productGrid');
  if (!list.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--text-muted)">No sneakers match your filters.</div>`;
    return;
  }

  grid.innerHTML = list.map((p, i) => `
    <article class="product-card" data-id="${p.id}" style="animation-delay:${i * 0.05}s">
      <div class="product-visual">
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
        <button class="product-wish ${wishlist.includes(p.id) ? 'saved' : ''}" data-wish="${p.id}" aria-label="Wishlist">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="${wishlist.includes(p.id) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
        <img src="${p.image}" alt="${p.name} ${p.colorway}" loading="lazy">
      </div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-meta">
          <span class="product-cat">${p.colorway}</span>
          <span class="product-price">${money(p.price)}</span>
        </div>
        <div class="product-meta" style="margin-top:4px">
          <span class="${p.stock === 0 ? 'stock-out' : p.stock <= 3 ? 'stock-low' : ''}">
            ${p.stock === 0 ? 'Sold out' : p.stock <= 3 ? `Only ${p.stock} left` : `${p.stock} in stock`}
          </span>
        </div>
      </div>
    </article>
  `).join('');

  grid.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('[data-wish]')) return;
      openDetail(PRODUCTS.find(p => p.id === card.dataset.id));
    });
  });
  grid.querySelectorAll('[data-wish]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      toggleWish(btn.dataset.wish);
    });
  });
}

function renderCarousel() {
  const items = PRODUCTS.slice(0, 6);
  $('carousel').innerHTML = items.map(p => `
    <div class="carousel-card" data-id="${p.id}">
      <img src="${p.image}" alt="${p.name}">
      <div class="carousel-info">
        <h4>${p.name}</h4>
        <span>${p.colorway} · ${money(p.price)}</span>
      </div>
    </div>
  `).join('');
  $('carousel').querySelectorAll('.carousel-card').forEach(c => {
    c.addEventListener('click', () => openDetail(PRODUCTS.find(p => p.id === c.dataset.id)));
  });
}

/* ===== Filters & Search ===== */
document.querySelectorAll('.filter-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    activeFilter = chip.dataset.filter;
    renderGrid();
  });
});

$('searchInput').addEventListener('input', e => {
  searchQuery = e.target.value;
  renderGrid();
});

$('searchBtn').addEventListener('click', () => {
  document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
  $('searchInput').focus();
});

/* ===== Wishlist ===== */
function toggleWish(id) {
  const idx = wishlist.indexOf(id);
  if (idx > -1) wishlist.splice(idx, 1);
  else wishlist.push(id);
  saveWish();
  updateWishCount();
  renderGrid();
  toast(idx > -1 ? 'Removed from wishlist' : 'Added to wishlist');
}

function updateWishCount() {
  const el = $('wishCount');
  if (wishlist.length) {
    el.hidden = false;
    el.textContent = wishlist.length;
  } else {
    el.hidden = true;
  }
}

$('wishlistBtn').addEventListener('click', openWishlist);

function openWishlist() {
  const root = $('wishRoot');
  const items = wishlist.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
  root.innerHTML = `
    <div class="drawer-backdrop" id="wishBack">
      <aside class="drawer">
        <div class="drawer-head">
          <h2>Wishlist · ${items.length}</h2>
          <button class="close-btn" id="closeWish">×</button>
        </div>
        ${items.length ? `
          <div class="drawer-items">
            ${items.map(p => `
              <div class="cart-item">
                <img src="${p.image}" alt="${p.name}">
                <div>
                  <h3>${p.name}</h3>
                  <div class="cart-meta">${p.colorway}</div>
                  <div class="cart-price">${money(p.price)}</div>
                </div>
                <button class="remove-item" data-unwish="${p.id}">×</button>
              </div>
            `).join('')}
          </div>
        ` : `<div class="empty-state">Your wishlist is empty.<br>Save pairs you love.</div>`}
      </aside>
    </div>
  `;
  $('closeWish').onclick = () => root.innerHTML = '';
  $('wishBack').onclick = e => { if (e.target.id === 'wishBack') root.innerHTML = ''; };
  root.querySelectorAll('[data-unwish]').forEach(b => {
    b.onclick = () => { toggleWish(b.dataset.unwish); openWishlist(); };
  });
}

/* ===== Cart ===== */
function updateCartCount() {
  const count = cart.reduce((s, l) => s + l.qty, 0);
  $('cartCount').textContent = count;
}

function cartSubtotal() {
  return cart.reduce((s, l) => {
    const p = PRODUCTS.find(x => x.id === l.id);
    return s + (p ? p.price * l.qty : 0);
  }, 0);
}

function addToCart(product, size) {
  const existing = cart.find(l => l.id === product.id && l.size === size);
  const currentQty = existing ? existing.qty : 0;
  if (currentQty >= product.stock) {
    toast('No more stock available for that size');
    return;
  }
  if (existing) existing.qty++;
  else cart.push({ id: product.id, size, qty: 1 });
  saveCart();
  updateCartCount();
  $('modalRoot').innerHTML = '';
  toast(`${product.name} · Size ${size} added`);
  openCart();
}

function openCart() {
  const root = $('drawerRoot');
  const sub = cartSubtotal();
  root.innerHTML = `
    <div class="drawer-backdrop" id="cartBack">
      <aside class="drawer">
        <div class="drawer-head">
          <h2>Bag · ${cart.length}</h2>
          <button class="close-btn" id="closeCart">×</button>
        </div>
        ${cart.length ? `
          <div class="drawer-items">
            ${cart.map(l => {
              const p = PRODUCTS.find(x => x.id === l.id);
              if (!p) return '';
              return `
                <div class="cart-item">
                  <img src="${p.image}" alt="${p.name}">
                  <div>
                    <h3>${p.name}</h3>
                    <div class="cart-meta">Size ${l.size} · ${p.colorway}</div>
                    <div class="cart-price">${money(p.price * l.qty)}</div>
                    <div class="qty-ctrl">
                      <button data-dec="${p.id}" data-size="${l.size}">−</button>
                      <span>${l.qty}</span>
                      <button data-inc="${p.id}" data-size="${l.size}">+</button>
                    </div>
                  </div>
                  <button class="remove-item" data-remove="${p.id}" data-size="${l.size}">×</button>
                </div>
              `;
            }).join('')}
          </div>
          <div class="drawer-foot">
            <div class="subtotal-row"><span>Subtotal</span><span>${money(sub)}</span></div>
            <p class="ship-note">Shipping calculated at checkout. Metro Davao from ₱120 · Free over ₱8,000.</p>
            <button class="btn btn-primary" style="width:100%" id="goCheckout">Checkout →</button>
          </div>
        ` : `
          <div class="empty-state">
            Your bag is empty.<br>
            <button class="btn btn-secondary" style="margin-top:16px" id="contShop">Continue shopping</button>
          </div>
        `}
      </aside>
    </div>
  `;
  $('closeCart').onclick = () => root.innerHTML = '';
  $('cartBack').onclick = e => { if (e.target.id === 'cartBack') root.innerHTML = ''; };
  if ($('contShop')) $('contShop').onclick = () => root.innerHTML = '';
  if ($('goCheckout')) $('goCheckout').onclick = openCheckout;

  const changeQty = (id, size, delta) => {
    const line = cart.find(x => x.id === id && x.size === size);
    const p = PRODUCTS.find(x => x.id === id);
    if (!line || !p) return;
    line.qty = Math.min(Math.max(line.qty + delta, 0), p.stock);
    cart = cart.filter(x => x.qty > 0);
    saveCart();
    updateCartCount();
    openCart();
  };
  root.querySelectorAll('[data-inc]').forEach(b => b.onclick = () => changeQty(b.dataset.inc, b.dataset.size, 1));
  root.querySelectorAll('[data-dec]').forEach(b => b.onclick = () => changeQty(b.dataset.dec, b.dataset.size, -1));
  root.querySelectorAll('[data-remove]').forEach(b => {
    b.onclick = () => {
      cart = cart.filter(x => !(x.id === b.dataset.remove && x.size === b.dataset.size));
      saveCart();
      updateCartCount();
      openCart();
    };
  });
}

$('cartBtn').addEventListener('click', openCart);

/* ===== Product Detail Modal ===== */
function openDetail(p) {
  selectedSize = null;
  const root = $('modalRoot');
  root.innerHTML = `
    <div class="backdrop" id="detailBack">
      <div class="modal">
        <button class="close-btn" id="closeDetail">×</button>
        <div class="modal-image">
          <img src="${p.image}" alt="${p.name}">
        </div>
        <div class="modal-content">
          <div class="eyebrow">AJ · ${p.colorway}</div>
          <h2>${p.name}</h2>
          <div class="modal-price">${money(p.price)}</div>
          <p class="modal-desc">${p.desc}</p>
          <div class="size-label">
            <span>Select Size</span>
            <span>US Men</span>
          </div>
          <div class="sizes">
            ${ALL_SIZES.map(s => `
              <button class="size-btn ${p.sizes.includes(s) ? '' : ''}" 
                data-size="${s}" 
                ${p.sizes.includes(s) ? '' : 'disabled'}>${s}</button>
            `).join('')}
          </div>
          <button class="btn btn-primary add-btn" id="addToBag" disabled>Select a size</button>
          <div class="stock-note">
            ${p.stock > 0 ? `● ${p.stock} pairs available` : '● Currently sold out'}
          </div>
        </div>
      </div>
    </div>
  `;
  $('closeDetail').onclick = () => root.innerHTML = '';
  $('detailBack').onclick = e => { if (e.target.id === 'detailBack') root.innerHTML = ''; };

  root.querySelectorAll('.size-btn:not(:disabled)').forEach(btn => {
    btn.onclick = () => {
      root.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedSize = btn.dataset.size;
      const addBtn = $('addToBag');
      addBtn.disabled = false;
      addBtn.textContent = `Add Size ${selectedSize} to Bag`;
      addBtn.onclick = () => addToCart(p, selectedSize);
    };
  });
}

/* ===== Checkout with validation ===== */
function openCheckout() {
  if (!cart.length) {
    toast('Your bag is empty');
    return;
  }
  const saved = JSON.parse(localStorage.getItem('nike_address') || 'null') || {};
  selectedShip = saved.shipping || 'metro';
  $('drawerRoot').innerHTML = '';
  const root = $('checkoutRoot');
  root.innerHTML = `
    <div class="backdrop" id="ckBack">
      <div class="modal" style="grid-template-columns:1fr; max-width:480px">
        <button class="close-btn" id="closeCk">×</button>
        <form class="checkout-form" id="ckForm" novalidate>
          <div class="eyebrow">Checkout · Davao / PH</div>
          <h2>Delivery details</h2>
          <div class="field">
            <label>Full name *</label>
            <input type="text" id="ckName" value="${saved.name || ''}" placeholder="Juan Dela Cruz" required autocomplete="name">
          </div>
          <div class="field">
            <label>Contact number *</label>
            <input type="tel" id="ckPhone" value="${saved.phone || ''}" placeholder="09XX XXX XXXX" required inputmode="tel" autocomplete="tel">
          </div>
          <div class="field">
            <label>Email</label>
            <input type="email" id="ckEmail" value="${saved.email || ''}" placeholder="you@email.com" autocomplete="email">
          </div>
          <div class="field">
            <label>Street / building, unit no. *</label>
            <input type="text" id="ckStreet" value="${saved.street || ''}" placeholder="123 Mahogany St., Sunview Subd." required>
          </div>
          <div class="field-row">
            <div class="field">
              <label>Barangay *</label>
              <input type="text" id="ckBrgy" value="${saved.brgy || ''}" placeholder="Barangay" required>
            </div>
            <div class="field">
              <label>City *</label>
              <input type="text" id="ckCity" value="${saved.city || 'Davao City'}" placeholder="City" required>
            </div>
          </div>
          <div class="field-row">
            <div class="field">
              <label>Province *</label>
              <input type="text" id="ckProvince" value="${saved.province || 'Davao del Sur'}" placeholder="Province" required>
            </div>
            <div class="field">
              <label>ZIP code *</label>
              <input type="text" id="ckZip" value="${saved.zip || '8000'}" placeholder="8000" required>
            </div>
          </div>
          <div id="ckError" class="error-msg"></div>
          <label style="display:block;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--text-muted);margin-bottom:8px">Shipping method</label>
          <div class="ship-options" id="shipOpts">
            ${SHIP_OPTIONS.map(s => `
              <div class="ship-option ${s.id === selectedShip ? 'selected' : ''}" data-ship="${s.id}">
                <span>${s.label} <span style="color:var(--text-muted)">· ${s.eta}</span></span>
                <span>${s.fee ? money(s.fee) : 'Free'}</span>
              </div>
            `).join('')}
          </div>
          <div class="order-summary">
            <h3>Summary</h3>
            <div class="summary-line"><span>Subtotal</span><span id="ckSub">${money(cartSubtotal())}</span></div>
            <div class="summary-line"><span>Estimated Delivery &amp; Handling</span><span id="ckShip">—</span></div>
            <div class="summary-line total"><span>Total</span><span id="ckTotal">—</span></div>
          </div>
          <label class="checkbox-row">
            <input type="checkbox" id="ckSave" checked>
            Save my details for next time
          </label>
          <div class="checkout-actions">
            <button type="submit" class="btn btn-primary btn-guest" id="placeOrder">Guest Checkout</button>
            <button type="button" class="btn btn-member" id="memberCk">Member Checkout</button>
          </div>
        </form>
      </div>
    </div>
  `;

  const refreshTotals = () => {
    const sub = cartSubtotal();
    const fee = SHIP_OPTIONS.find(s => s.id === selectedShip).fee;
    const freeMetro = sub >= 8000 && selectedShip === 'metro';
    const actualFee = freeMetro ? 0 : fee;
    $('ckShip').textContent = actualFee ? money(actualFee) : 'Free';
    $('ckTotal').textContent = money(sub + actualFee);
  };
  refreshTotals();

  root.querySelectorAll('[data-ship]').forEach(el => {
    el.onclick = () => {
      selectedShip = el.dataset.ship;
      root.querySelectorAll('[data-ship]').forEach(x => x.classList.remove('selected'));
      el.classList.add('selected');
      refreshTotals();
    };
  });

  if ($('memberCk')) $('memberCk').onclick = () => toast('Member sign-in coming soon — continue as Guest');
    $('closeCk').onclick = () => root.innerHTML = '';
  $('ckBack').onclick = e => { if (e.target.id === 'ckBack') root.innerHTML = ''; };

  $('ckForm').onsubmit = e => {
    e.preventDefault();
    const name = $('ckName').value.trim();
    const phone = $('ckPhone').value.trim();
    const email = $('ckEmail').value.trim();
    const street = $('ckStreet').value.trim();
    const brgy = $('ckBrgy').value.trim();
    const city = $('ckCity').value.trim();
    const province = $('ckProvince').value.trim();
    const zip = $('ckZip').value.trim();
    const err = $('ckError');

    if (!name || !phone || !street || !brgy || !city || !province || !zip) {
      err.style.display = 'block';
      err.textContent = 'Please fill in all required fields marked with *.';
      return;
    }
    if (!/^[0-9+ ]{7,15}$/.test(phone)) {
      err.style.display = 'block';
      err.textContent = 'Please enter a valid contact number (e.g. 09XX XXX XXXX).';
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      err.style.display = 'block';
      err.textContent = 'Please enter a valid email address.';
      return;
    }

    err.style.display = 'none';
    const data = { name, phone, email, street, brgy, city, province, zip, shipping: selectedShip };
    if ($('ckSave').checked) localStorage.setItem('nike_address', JSON.stringify(data));

    const sub = cartSubtotal();
    const feeOpt = SHIP_OPTIONS.find(s => s.id === selectedShip);
    const freeMetro = sub >= 8000 && selectedShip === 'metro';
    const fee = freeMetro ? 0 : feeOpt.fee;
    const total = sub + fee;
    const orderNo = 'DV-' + Math.floor(100000 + Math.random() * 899999);
    const shipLabel = selectedShip === 'pickup' ? 'Ready for pickup' : selectedShip === 'metro' ? 'Out for Metro Davao delivery' : 'In transit (nationwide)';
    const shipMeta = selectedShip === 'pickup' ? 'Lanang store · ready in 24 hrs' : selectedShip === 'metro' ? '1–2 days within Metro Davao' : '3–7 days nationwide';
    const etaText = selectedShip === 'pickup' ? 'Ready in 24 hours (Lanang)' : selectedShip === 'metro' ? '1–2 days' : '3–7 days';


    const history = JSON.parse(localStorage.getItem('nike_orders') || '[]');
    history.unshift({
      orderNo,
      date: new Date().toISOString(),
      total,
      items: [...cart],
      address: data
    });
    localStorage.setItem('nike_orders', JSON.stringify(history.slice(0, 20)));

    cart = [];
    saveCart();
    updateCartCount();

    root.innerHTML = `
      <div class="backdrop" id="doneBack">
        <div class="modal" style="grid-template-columns:1fr; max-width:460px">
          <button class="close-btn" id="closeDone">×</button>
          <div class="checkout-form order-done">
            <div class="eyebrow" style="justify-content:center">Order placed</div>
            <div class="order-num">${orderNo}</div>
            <p style="color:var(--text-muted);font-size:14px;line-height:1.55;margin-bottom:6px">
              Thanks, ${name}! We’ll text <strong style="color:var(--text)">${phone}</strong> to confirm.
            </p>

            <div class="order-summary" style="text-align:left;margin-top:16px">
              <h3>Order summary</h3>
              <div class="summary-line"><span>Subtotal</span><span>${money(sub)}</span></div>
              <div class="summary-line"><span>Delivery &amp; handling</span><span>${fee ? money(fee) : 'Free'}</span></div>
              <div class="summary-line total"><span>Total</span><span>${money(total)}</span></div>
            </div>

            <div class="order-status">
              <div class="eta-banner">
                Est. arrival: <span id="etaText">${etaText}</span>
              </div>
              <h4>Where is my order?</h4>
              <div class="status-steps">
                <div class="status-step done current">
                  <div class="status-dot">✓</div>
                  <div>
                    <div class="label">Order placed</div>
                    <div class="meta">Just now · HalfCourt Davao</div>
                  </div>
                </div>
                <div class="status-step">
                  <div class="status-dot"></div>
                  <div>
                    <div class="label">Confirmed &amp; packed</div>
                    <div class="meta">We’ll text you when ready</div>
                  </div>
                </div>
                <div class="status-step">
                  <div class="status-dot"></div>
                  <div>
                    <div class="label">${shipLabel}</div>
                    <div class="meta">${shipMeta}</div>
                  </div>
                </div>
                <div class="status-step">
                  <div class="status-dot"></div>
                  <div>
                    <div class="label">Delivered</div>
                    <div class="meta">${city}, ${province}</div>
                  </div>
                </div>
              </div>
            </div>

            <button class="btn btn-primary" style="width:100%;margin-top:8px" id="doneClose">Back to shopping</button>
          </div>
        </div>
      </div>
    `
    const close = () => root.innerHTML = '';
    $('closeDone').onclick = close;
    $('doneClose').onclick = close;
    $('doneBack').onclick = e => { if (e.target.id === 'doneBack') close(); };
  };
}

/* ===== Mobile menu ===== */
$('menuBtn').addEventListener('click', () => $('mobileNav').classList.add('open'));
$('closeMobile').addEventListener('click', () => $('mobileNav').classList.remove('open'));
$('mobileNav').addEventListener('click', e => {
  if (e.target.id === 'mobileNav') $('mobileNav').classList.remove('open');
});
document.querySelectorAll('.mobile-nav-inner a').forEach(a => {
  a.addEventListener('click', () => $('mobileNav').classList.remove('open'));
});

/* ===== Join CTA ===== */
$('joinBtn')?.addEventListener('click', () => toast('Davao member perks — coming soon'));


/* ===== Hero shoe spin / switch ===== */
function initHeroSpinner() {
  const shoes = Array.from(document.querySelectorAll('#heroStage .hero-shoe'));
  const badge = $('heroBadge');
  const dotsWrap = $('heroDots');
  if (!shoes.length) return;

  let idx = 0;
  let timer;

  dotsWrap.innerHTML = shoes.map((_, i) =>
    `<button class="hero-dot ${i === 0 ? 'active' : ''}" data-idx="${i}" aria-label="Show shoe ${i + 1}"></button>`
  ).join('');

  const dots = Array.from(dotsWrap.querySelectorAll('.hero-dot'));

  function show(i) {
    const prev = shoes[idx];
    prev.classList.remove('active');
    prev.classList.add('exit');
    setTimeout(() => prev.classList.remove('exit'), 400);

    idx = i;
    const next = shoes[idx];
    next.classList.add('active');
    badge.textContent = next.dataset.label || '';
    dots.forEach((d, di) => d.classList.toggle('active', di === idx));
  }

  function next() {
    show((idx + 1) % shoes.length);
  }

  function start() {
    clearInterval(timer);
    timer = setInterval(next, 2800);
  }

  dots.forEach(d => {
    d.addEventListener('click', () => {
      show(+d.dataset.idx);
      start();
    });
  });

  // pause on hover
  const stage = $('heroStage');
  stage.addEventListener('mouseenter', () => clearInterval(timer));
  stage.addEventListener('mouseleave', start);

  start();
}

/* ===== Boot ===== */
renderGrid();
renderCarousel();
updateCartCount();
updateWishCount();
initHeroSpinner();
