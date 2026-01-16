// A.M.G. Bakery & Cafe - Professional Bakery Platform

let currentAdmin = null;
let currentTestimonialRating = 0;

// FORGOT PASSWORD FUNCTIONS
function openForgotPasswordModal(){
  document.getElementById('forgot-email').value = '';
  document.getElementById('forgot-step1').style.display = 'block';
  document.getElementById('forgot-step2').style.display = 'none';
  document.getElementById('forgot-password-modal').classList.add('active');
}

function verifyEmailForPassword(){
  const email = document.getElementById('forgot-email').value.trim();
  if(!email){ alert('Please enter your email'); return; }
  
  const users = getAllUsers();
  if(!users[email]){ 
    alert('❌ Email not found. Please check and try again');
    return;
  }
  
  document.getElementById('forgot-step1').style.display = 'none';
  document.getElementById('forgot-step2').style.display = 'block';
  document.getElementById('security-question').textContent = 'What is your favorite bakery item?'; // You can make this dynamic
}

function resetPassword(){
  const email = document.getElementById('forgot-email').value.trim();
  const answer = document.getElementById('security-answer').value.trim().toLowerCase();
  const newPass = document.getElementById('new-password').value;
  const confirmPass = document.getElementById('confirm-password').value;
  
  if(!answer || !newPass || !confirmPass){ alert('Please fill all fields'); return; }
  if(newPass !== confirmPass){ alert('Passwords do not match'); return; }
  if(newPass.length < 6){ alert('Password must be at least 6 characters'); return; }
  
  // Simple verification - in production, use secure backend
  if(answer !== 'cake' && answer !== 'bread' && answer !== 'pastry'){
    alert('❌ Incorrect answer');
    return;
  }
  
  const users = getAllUsers();
  users[email].password = simpleHash(newPass);
  saveUsers(users);
  
  alert('✓ Password reset successfully! You can now login with your new password.');
  document.getElementById('forgot-password-modal').classList.remove('active');
  openLoginModal();
}

// ADMIN FUNCTIONS
function openAdminModal(){
  document.getElementById('admin-email').value = '';
  document.getElementById('admin-password').value = '';
  document.getElementById('admin-modal').classList.add('active');
}

function doAdminLogin(){
  const email = document.getElementById('admin-email').value.trim();
  const password = document.getElementById('admin-password').value;
  
  if(!email || !password){ alert('Please fill all fields'); return; }
  
  // Simple admin authentication (in production, use secure backend)
  if(email === 'admin@amgbakery.com' && password === 'password123'){
    currentAdmin = { email, name: 'Admin' };
    localStorage.setItem('amg_admin', JSON.stringify(currentAdmin));
    alert('✓ Admin login successful!');
    document.getElementById('admin-modal').classList.remove('active');
    showAdminDashboard();
  } else {
    alert('❌ Invalid admin credentials');
  }
}

function showAdminDashboard(){
  document.querySelectorAll('section').forEach(s=> s.style.display = 'none');
  document.getElementById('admin-dashboard').style.display = 'block';
  
  // Load admin data
  document.getElementById('admin-btn').style.display = 'inline-block';
  showAdminTab('overview');
  loadAdminOverview();
  
  window.scrollTo(0, 0);
}

function showAdminTab(tab){
  document.querySelectorAll('[id^="admin-"]').forEach(el=> {
    if(el.id.startsWith('admin-overview') || el.id.startsWith('admin-testimonials') || el.id.startsWith('admin-popular') || el.id.startsWith('admin-orders') || el.id.startsWith('admin-customers') || el.id.startsWith('admin-sales')){
      el.style.display = 'none';
    }
  });
  
  document.querySelectorAll('[id^="tab-"]').forEach(btn=> btn.classList.remove('primary'));
  
  if(tab === 'overview'){
    document.getElementById('admin-overview').style.display = 'block';
    document.getElementById('tab-overview').classList.add('primary');
    loadAdminOverview();
  } else if(tab === 'testimonials'){
    document.getElementById('admin-testimonials').style.display = 'block';
    document.getElementById('tab-testimonials').classList.add('primary');
    loadAdminTestimonials();
  } else if(tab === 'popular'){
    document.getElementById('admin-popular').style.display = 'block';
    document.getElementById('tab-popular').classList.add('primary');
    loadAdminPopular();
  } else if(tab === 'orders'){
    document.getElementById('admin-orders').style.display = 'block';
    document.getElementById('tab-orders').classList.add('primary');
    loadAdminOrders();
  } else if(tab === 'customers'){
    document.getElementById('admin-customers').style.display = 'block';
    document.getElementById('tab-customers').classList.add('primary');
    loadAdminCustomers();
  } else if(tab === 'sales'){
    document.getElementById('admin-sales').style.display = 'block';
    document.getElementById('tab-sales').classList.add('primary');
    loadAdminSales();
  }
}

function loadAdminOverview(){
  const users = getAllUsers();
  const customerCount = Object.keys(users).length;
  
  let totalOrders = 0, totalRevenue = 0;
  Object.values(users).forEach(user=>{
    totalOrders += user.orders?.length || 0;
    totalRevenue += user.totalSpent || 0;
  });
  
  let subscribers = [];
  try{ subscribers = JSON.parse(localStorage.getItem('amg_newsletter')) || []; }catch(e){}
  
  document.getElementById('admin-total-orders').textContent = totalOrders;
  document.getElementById('admin-total-customers').textContent = customerCount;
  document.getElementById('admin-total-subscribers').textContent = subscribers.length;
  document.getElementById('admin-total-revenue').textContent = `Rs ${totalRevenue}`;
}

function loadAdminTestimonials(){
  let testimonials = [];
  try{ testimonials = JSON.parse(localStorage.getItem('amg_testimonials')) || []; }catch(e){}
  
  let html = '';
  if(testimonials.length === 0){
    html = '<p style="color:var(--muted)">No testimonials yet</p>';
  } else {
    testimonials.forEach((t, idx)=>{
      const stars = '⭐'.repeat(Math.round(t.rating));
      html += `
        <div style="background:var(--light-bg);padding:1rem;border-radius:6px;margin-bottom:1rem;border-left:4px solid var(--accent)">
          <div style="display:flex;justify-content:space-between;align-items:start">
            <div>
              <div>${stars}</div>
              <p style="margin:0.5rem 0;font-weight:600">${t.name}</p>
              <p style="margin:0;color:var(--muted)">"${t.text}"</p>
            </div>
            <button onclick="deleteTestimonial(${idx})" style="background:#ef4444;color:white;border:none;padding:0.4rem 0.8rem;border-radius:4px;cursor:pointer;font-size:0.85rem">Delete</button>
          </div>
        </div>
      `;
    });
  }
  document.getElementById('admin-testimonials-list').innerHTML = html;
}

function loadAdminPopular(){
  const allItems = [...cakes, ...products];
  let popular = [];
  try{ popular = JSON.parse(localStorage.getItem('amg_popular_items')) || []; }catch(e){}
  
  let html = '';
  allItems.forEach(item=>{
    const isPopular = popular.includes(item.id);
    html += `
      <div style="display:flex;align-items:center;gap:1rem;padding:1rem;background:var(--light-bg);border-radius:6px;margin-bottom:0.5rem">
        <input type="checkbox" ${isPopular ? 'checked' : ''} onchange="togglePopularItem('${item.id}', this.checked)" style="cursor:pointer;width:20px;height:20px">
        <span style="flex:1">${item.name} (Rs ${item.price})</span>
        <span style="color:var(--muted);font-size:0.85rem">${isPopular ? '✓ Popular' : 'Not popular'}</span>
      </div>
    `;
  });
  
  document.getElementById('admin-popular-items').innerHTML = html || '<p style="color:var(--muted)">No items available</p>';
}

function togglePopularItem(itemId, isPopular){
  let popular = [];
  try{ popular = JSON.parse(localStorage.getItem('amg_popular_items')) || []; }catch(e){}
  
  if(isPopular){
    if(!popular.includes(itemId)) popular.push(itemId);
  } else {
    popular = popular.filter(id=> id !== itemId);
  }
  
  localStorage.setItem('amg_popular_items', JSON.stringify(popular));
  displayPopularItems(); // Refresh popular section
}

function loadAdminOrders(){
  const users = getAllUsers();
  let allOrders = [];
  
  Object.values(users).forEach(user=>{
    (user.orders || []).forEach(order=>{
      allOrders.push({ ...order, customerName: user.name, customerEmail: user.email });
    });
  });
  
  allOrders.sort((a,b)=> new Date(b.date) - new Date(a.date));
  
  let html = '';
  if(allOrders.length === 0){
    html = '<p style="color:var(--muted)">No orders yet</p>';
  } else {
    allOrders.slice(0, 10).forEach(order=>{
      const date = new Date(order.date).toLocaleDateString('en-US', {year:'numeric', month:'short', day:'numeric'});
      html += `
        <div style="background:var(--light-bg);padding:1rem;border-radius:6px;margin-bottom:1rem">
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem">
            <div>
              <span style="color:var(--muted);font-size:0.9rem">Order ID</span>
              <p style="margin:0.3rem 0;font-weight:600;font-family:monospace">${order.id}</p>
            </div>
            <div>
              <span style="color:var(--muted);font-size:0.9rem">Customer</span>
              <p style="margin:0.3rem 0;font-weight:600">${order.customerName}</p>
            </div>
            <div>
              <span style="color:var(--muted);font-size:0.9rem">Amount & Date</span>
              <p style="margin:0;font-weight:600;color:var(--primary)">Rs ${order.total} • ${date}</p>
            </div>
          </div>
        </div>
      `;
    });
  }
  
  document.getElementById('admin-orders-list').innerHTML = html;
}

function loadAdminCustomers(){
  const users = getAllUsers();
  
  let html = '';
  if(Object.keys(users).length === 0){
    html = '<p style="color:var(--muted)">No customers yet</p>';
  } else {
    Object.values(users).forEach(user=>{
      const joined = new Date(user.createdAt).toLocaleDateString('en-US', {year:'numeric', month:'short', day:'numeric'});
      html += `
        <div style="background:var(--light-bg);padding:1rem;border-radius:6px;margin-bottom:1rem">
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem">
            <div>
              <span style="color:var(--muted);font-size:0.9rem">Name & Email</span>
              <p style="margin:0.3rem 0;font-weight:600">${user.name}</p>
              <p style="margin:0;font-size:0.85rem;color:var(--muted)">${user.email}</p>
            </div>
            <div>
              <span style="color:var(--muted);font-size:0.9rem">Phone & Address</span>
              <p style="margin:0.3rem 0;font-weight:600">${user.phone || '—'}</p>
            </div>
            <div>
              <span style="color:var(--muted);font-size:0.9rem">Loyalty & Orders</span>
              <p style="margin:0;font-weight:600">⭐ ${user.loyaltyPoints} points • ${user.orders?.length || 0} orders</p>
              <p style="margin:0;font-size:0.85rem;color:var(--accent)">Joined: ${joined}</p>
            </div>
          </div>
        </div>
      `;
    });
  }
  
  document.getElementById('admin-customers-list').innerHTML = html;
}

function doAdminLogout(){
  currentAdmin = null;
  localStorage.removeItem('amg_admin');
  alert('Admin logged out');
  document.getElementById('admin-btn').style.display = 'none';
  document.querySelectorAll('section').forEach(s=> s.style.display = 'block');
  document.getElementById('admin-dashboard').style.display = 'none';
  window.scrollTo(0, 0);
}

// TESTIMONIALS FUNCTIONS
function openTestimonialModal(){
  document.getElementById('testimonial-name').value = '';
  document.getElementById('testimonial-text').value = '';
  currentTestimonialRating = 0;
  document.getElementById('rating-display').textContent = 'Select rating';
  document.getElementById('testimonial-modal').classList.add('active');
}

function setRating(rating){
  currentTestimonialRating = rating;
  document.getElementById('rating-display').textContent = '⭐'.repeat(rating) + ` ${rating} stars`;
}

function submitTestimonial(){
  const name = document.getElementById('testimonial-name').value.trim();
  const text = document.getElementById('testimonial-text').value.trim();
  const rating = currentTestimonialRating;
  
  if(!name || !text || !rating){ alert('Please fill all fields'); return; }
  
  let testimonials = [];
  try{ testimonials = JSON.parse(localStorage.getItem('amg_testimonials')) || []; }catch(e){}
  
  testimonials.push({ name, text, rating, date: new Date().toISOString() });
  localStorage.setItem('amg_testimonials', JSON.stringify(testimonials));
  
  alert('✓ Thank you for your review!');
  document.getElementById('testimonial-modal').classList.remove('active');
  displayTestimonials();
}

function deleteTestimonial(idx){
  if(!currentAdmin){ alert('❌ Only admin can delete testimonials'); return; }
  if(!confirm('Delete this testimonial?')) return;
  
  let testimonials = [];
  try{ testimonials = JSON.parse(localStorage.getItem('amg_testimonials')) || []; }catch(e){}
  
  testimonials.splice(idx, 1);
  localStorage.setItem('amg_testimonials', JSON.stringify(testimonials));
  
  alert('✓ Testimonial deleted');
  if(currentAdmin){
    loadAdminTestimonials();
  } else {
    displayTestimonials();
  }
}

// ABOUT SECTION FUNCTIONS
function openEditAboutModal(){
  if(!currentAdmin){ alert('❌ Only admin can edit about section'); return; }
  
  let aboutContent = localStorage.getItem('amg_about_content');
  if(!aboutContent){
    aboutContent = `<p>Welcome to <strong style="color:var(--text)">A.M.G. Bakery & Cafe</strong>, your trusted destination for freshly baked goodness. We specialize in a wide variety of bakery items tailored to your needs:</p>
<ul style="list-style:none;padding:0">
<li>🍞 <strong>Breads & Buns</strong> — Fresh, soft, and delicious daily</li>
<li>🧁 <strong>Pastries & Donuts</strong> — Variety of flavors and styles</li>
<li>🎂 <strong>Cakes</strong> — Birthday, celebration, and custom orders</li>
<li>☕ <strong>Coffee & Tea</strong> — Premium beverages</li>
<li>🍦 <strong>Ice Cream</strong> — Seasonal flavors</li>
</ul>
<p style="margin-top:2rem"><strong>Our Promise:</strong> Quality ingredients, freshness, and friendly service in every bite. Open whenever you need us!</p>`;
  }
  
  document.getElementById('about-text-edit').value = aboutContent;
  document.getElementById('edit-about-modal').classList.add('active');
}

function saveAboutChanges(){
  const aboutText = document.getElementById('about-text-edit').value.trim();
  if(!aboutText){ alert('Please enter about text'); return; }
  
  localStorage.setItem('amg_about_content', aboutText);
  alert('✓ About section updated!');
  document.getElementById('edit-about-modal').classList.remove('active');
  displayAboutSection();
}

function displayAboutSection(){
  let aboutContent = localStorage.getItem('amg_about_content');
  if(!aboutContent){
    aboutContent = `<p>Welcome to <strong style="color:var(--text)">A.M.G. Bakery & Cafe</strong>, your trusted destination for freshly baked goodness. We specialize in a wide variety of bakery items tailored to your needs:</p>
<ul style="list-style:none;padding:0">
<li>🍞 <strong>Breads & Buns</strong> — Fresh, soft, and delicious daily</li>
<li>🧁 <strong>Pastries & Donuts</strong> — Variety of flavors and styles</li>
<li>🎂 <strong>Cakes</strong> — Birthday, celebration, and custom orders</li>
<li>☕ <strong>Coffee & Tea</strong> — Premium beverages</li>
<li>🍦 <strong>Ice Cream</strong> — Seasonal flavors</li>
</ul>
<p style="margin-top:2rem"><strong>Our Promise:</strong> Quality ingredients, freshness, and friendly service in every bite. Open whenever you need us!</p>`;
  }
  
  document.getElementById('about-content').innerHTML = aboutContent;
  
  // Show edit button and hint only for admin
  const editBtn = document.getElementById('edit-about-btn');
  const hintText = document.getElementById('admin-edit-hint');
  if(currentAdmin){
    editBtn.style.display = 'inline-block';
    hintText.textContent = '✏️ You can edit this section anytime';
  } else {
    editBtn.style.display = 'none';
    hintText.textContent = '';
  }
}

// SALES HISTORY FUNCTIONS
function trackSale(items, total){
  let sales = [];
  try{ sales = JSON.parse(localStorage.getItem('amg_sales_history')) || []; }catch(e){}
  
  const sale = {
    id: 'SALE-' + Date.now(),
    date: new Date().toISOString(),
    items: items,
    total: total
  };
  
  sales.push(sale);
  localStorage.setItem('amg_sales_history', JSON.stringify(sales));
}

function loadAdminSales(){
  let sales = [];
  try{ sales = JSON.parse(localStorage.getItem('amg_sales_history')) || []; }catch(e){}
  
  if(sales.length === 0){
    document.getElementById('admin-sales-items').innerHTML = '<p style="color:var(--muted)">No sales yet</p>';
    document.getElementById('admin-sales-history').innerHTML = '<p style="color:var(--muted)">No sales history</p>';
    return;
  }
  
  // Calculate totals
  let totalRevenue = 0;
  let totalItems = 0;
  let itemSales = {};
  
  sales.forEach(sale=>{
    totalRevenue += sale.total;
    sale.items.forEach(item=>{
      totalItems += item.qty;
      if(!itemSales[item.name]){
        itemSales[item.name] = { qty: 0, total: 0, price: item.price };
      }
      itemSales[item.name].qty += item.qty;
      itemSales[item.name].total += item.qty * item.price;
    });
  });
  
  document.getElementById('sales-total-revenue').textContent = `Rs ${totalRevenue}`;
  document.getElementById('sales-total-items').textContent = totalItems;
  
  // Top selling items
  let topItems = Object.entries(itemSales)
    .map(([name, data])=> ({ name, ...data }))
    .sort((a,b)=> b.qty - a.qty)
    .slice(0, 10);
  
  let html = '';
  topItems.forEach(item=>{
    html += `
      <div style="background:var(--light-bg);padding:1rem;border-radius:6px;margin-bottom:0.5rem">
        <div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:1rem">
          <div><strong>${item.name}</strong></div>
          <div><span style="color:var(--muted);font-size:0.85rem">Qty: </span><strong>${item.qty}</strong></div>
          <div><span style="color:var(--muted);font-size:0.85rem">Price: </span><strong>Rs ${item.price}</strong></div>
          <div><span style="color:var(--muted);font-size:0.85rem">Total: </span><strong style="color:var(--primary)">Rs ${item.total}</strong></div>
        </div>
      </div>
    `;
  });
  document.getElementById('admin-sales-items').innerHTML = html;
  
  // Recent sales
  html = '';
  sales.slice(-10).reverse().forEach(sale=>{
    const date = new Date(sale.date).toLocaleDateString('en-US', {year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'});
    const itemsList = sale.items.map(i=> `${i.name}×${i.qty}`).join(', ');
    html += `
      <div style="background:var(--light-bg);padding:1rem;border-radius:6px;margin-bottom:0.5rem;border-left:4px solid var(--accent)">
        <div style="display:flex;justify-content:space-between;align-items:start">
          <div>
            <p style="margin:0;font-weight:600">${itemsList}</p>
            <p style="margin:0.3rem 0;font-size:0.85rem;color:var(--muted)">${date}</p>
          </div>
          <p style="margin:0;font-size:1.1rem;font-weight:700;color:var(--primary)">Rs ${sale.total}</p>
        </div>
      </div>
    `;
  });
  document.getElementById('admin-sales-history').innerHTML = html;
}

// ============ USER AUTHENTICATION SYSTEM ============
function loadCurrentUser(){
  try{
    const stored = localStorage.getItem('amg_currentUser');
    currentUser = stored ? JSON.parse(stored) : null;
  }catch(e){
    currentUser = null;
  }
}

function getAllUsers(){
  try{
    return JSON.parse(localStorage.getItem('amg_users')) || {};
  }catch(e){
    return {};
  }
}

function saveUsers(users){
  localStorage.setItem('amg_users', JSON.stringify(users));
}

function simpleHash(str){
  let hash = 0;
  for(let i = 0; i < str.length; i++){
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

function registerUser(name, phone, email, password, address, birthday){
  const users = getAllUsers();
  if(users[email]){ return { success: false, message: 'Email already registered' } }
  
  users[email] = {
    name: name,
    phone: phone,
    email: email,
    password: simpleHash(password),
    address: address || '',
    birthday: birthday || '',
    loyaltyPoints: 0,
    totalSpent: 0,
    createdAt: new Date().toISOString(),
    orders: []
  };
  
  saveUsers(users);
  return { success: true, message: 'Registration successful!' };
}

function loginUser(email, password){
  const users = getAllUsers();
  const user = users[email];
  
  if(!user) return { success: false, message: 'Email not found' };
  if(user.password !== simpleHash(password)) return { success: false, message: 'Wrong password' };
  
  currentUser = { ...user };
  delete currentUser.password;
  localStorage.setItem('amg_currentUser', JSON.stringify(currentUser));
  
  return { success: true, message: 'Login successful!' };
}

function logoutUser(){
  currentUser = null;
  localStorage.removeItem('amg_currentUser');
}

function updateUserProfile(email, updates){
  const users = getAllUsers();
  if(users[email]){
    users[email] = { ...users[email], ...updates };
    saveUsers(users);
    currentUser = { ...users[email] };
    delete currentUser.password;
    localStorage.setItem('amg_currentUser', JSON.stringify(currentUser));
    return { success: true };
  }
  return { success: false };
}

function addOrder(orderData){
  if(!currentUser) return false;
  
  const users = getAllUsers();
  const user = users[currentUser.email];
  if(!user) return false;
  
  const order = {
    id: 'ORD-' + Date.now(),
    date: new Date().toISOString(),
    items: orderData.items,
    total: orderData.total,
    status: 'Confirmed',
    method: orderData.method,
    address: orderData.address,
    phone: orderData.phone
  };
  
  // Calculate loyalty points (1 point per Rs 100)
  const points = Math.floor(orderData.total / 100);
  user.orders.push(order);
  user.loyaltyPoints += points;
  user.totalSpent += orderData.total;
  
  saveUsers(users);
  currentUser = { ...user };
  delete currentUser.password;
  localStorage.setItem('amg_currentUser', JSON.stringify(currentUser));
  
  return order;
}

function getOrderHistory(){
  if(!currentUser) return [];
  const users = getAllUsers();
  return (users[currentUser.email]?.orders || []).reverse();
}

// UTILITY FUNCTIONS
function formatPrice(n){ return `Rs ${n}` }

function fileToDataUri(file){
  return new Promise((resolve)=>{
    const reader = new FileReader();
    reader.onload = (e)=> resolve(e.target.result);
    reader.readAsDataURL(file);
  });
}

function generateCakeId(){
  return 'cake-' + Date.now() + Math.random().toString(36).substr(2, 9);
}

// CAKES STORAGE
function loadCakes(){
  try{
    cakes = JSON.parse(localStorage.getItem('amg_cakes')) || [];
  }catch(e){
    cakes = [];
  }
}

function saveCakes(){
  localStorage.setItem('amg_cakes', JSON.stringify(cakes));
}

function addCake(name, price, desc, imageDataUri){
  const cake = {
    id: generateCakeId(),
    name: name,
    price: price,
    desc: desc,
    image: imageDataUri || null
  };
  cakes.push(cake);
  saveCakes();
  return cake;
}

function updateCake(id, name, price, desc, imageDataUri){
  const cake = cakes.find(c=>c.id===id);
  if(cake){
    cake.name = name;
    cake.price = price;
    cake.desc = desc;
    if(imageDataUri) cake.image = imageDataUri;
    saveCakes();
  }
}

function deleteCake(id){
  cakes = cakes.filter(c=>c.id!==id);
  saveCakes();
}

// PRODUCTS STORAGE (same structure as cakes)
function loadProducts(){
  try{
    products = JSON.parse(localStorage.getItem('amg_products')) || [];
  }catch(e){
    products = [];
  }
}

function saveProducts(){
  localStorage.setItem('amg_products', JSON.stringify(products));
}

function addProduct(name, price, desc, imageDataUri){
  const product = {
    id: generateCakeId(),
    name: name,
    price: price,
    desc: desc,
    image: imageDataUri || null
  };
  products.push(product);
  saveProducts();
  return product;
}

function updateProduct(id, name, price, desc, imageDataUri){
  const product = products.find(p=>p.id===id);
  if(product){
    product.name = name;
    product.price = price;
    product.desc = desc;
    if(imageDataUri) product.image = imageDataUri;
    saveProducts();
  }
}

function deleteProduct(id){
  products = products.filter(p=>p.id!==id);
  saveProducts();
}

// RENDER CAKE GALLERY
function renderCakeGallery(){
  const menu = document.getElementById('menu-content');
  menu.innerHTML = '';

  // Filter cakes by search query
  const filtered = cakes.filter(cake=>
    cake.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if(filtered.length === 0){
    if(searchQuery){
      menu.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--muted)">No cakes found matching "' + searchQuery + '"</p>';
    } else {
      menu.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--muted)">No cakes added yet. Click "+ Add New Cake" to get started!</p>';
    }
    return;
  }

  filtered.forEach(cake=>{
    const card = document.createElement('div');
    card.className = 'card';

    // IMAGE
    const img = document.createElement('img');
    img.className = 'product-img';
    img.alt = cake.name;
    img.src = cake.image || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect fill="%23f0f0f0" width="100%25" height="100%25"/><text x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle" font-size="16" fill="%23999">No image</text></svg>';
    card.appendChild(img);

    // NAME
    const h = document.createElement('h3');
    h.textContent = cake.name;
    card.appendChild(h);

    // PRICE
    const priceDiv = document.createElement('div');
    priceDiv.className = 'price';
    priceDiv.style.fontSize = '1.3rem';
    priceDiv.textContent = formatPrice(cake.price);
    card.appendChild(priceDiv);

    // DESCRIPTION
    if(cake.desc){
      const descDiv = document.createElement('p');
      descDiv.className = 'desc';
      descDiv.style.whiteSpace = 'pre-line';
      descDiv.textContent = cake.desc;
      card.appendChild(descDiv);
    }

    // EDIT & DELETE BUTTONS
    const editRow = document.createElement('div');
    editRow.style.display = 'flex';
    editRow.style.gap = '0.5rem';
    editRow.style.marginBottom = '0.8rem';

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-price';
    editBtn.textContent = '✏️ Edit';
    editBtn.type = 'button';
    editBtn.style.flex = '1';
    editBtn.addEventListener('click', ()=> openEditCakeModal(cake));
    editRow.appendChild(editBtn);

    const delBtn = document.createElement('button');
    delBtn.className = 'edit-price';
    delBtn.textContent = '🗑️ Delete';
    delBtn.type = 'button';
    delBtn.style.color = 'red';
    delBtn.addEventListener('click', ()=>{
      if(confirm(`Delete "${cake.name}"?`)){
        deleteCake(cake.id);
        renderCakeGallery();
        updateCartUI();
      }
    });
    editRow.appendChild(delBtn);

    card.appendChild(editRow);

    // ADD TO CART
    const actions = document.createElement('div');
    actions.className = 'actions';

    const add = document.createElement('button');
    add.className = 'btn primary small';
    add.textContent = 'Add to Cart';
    add.type = 'button';
    add.addEventListener('click', (e)=>{ e.preventDefault(); addToCart(cake.id, 'cake') });
    actions.appendChild(add);

    card.appendChild(actions);
    menu.appendChild(card);
  });
}

// RENDER PRODUCTS GALLERY
function renderProductGallery(){
  const basicMenu = document.getElementById('basic-menu-content');
  basicMenu.innerHTML = '';

  // Filter products by search query
  const filtered = products.filter(prod=>
    prod.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if(filtered.length === 0){
    if(searchQuery){
      basicMenu.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--muted)">No products found matching "' + searchQuery + '"</p>';
    } else {
      basicMenu.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--muted)">No products added yet. Click "+ Add Product" to get started!</p>';
    }
    return;
  }

  filtered.forEach(prod=>{
    const card = document.createElement('div');
    card.className = 'card';

    // IMAGE
    const img = document.createElement('img');
    img.className = 'product-img';
    img.alt = prod.name;
    img.src = prod.image || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect fill="%23f0f0f0" width="100%25" height="100%25"/><text x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle" font-size="16" fill="%23999">No image</text></svg>';
    card.appendChild(img);

    // NAME
    const h = document.createElement('h3');
    h.textContent = prod.name;
    card.appendChild(h);

    // PRICE
    const priceDiv = document.createElement('div');
    priceDiv.className = 'price';
    priceDiv.style.fontSize = '1.3rem';
    priceDiv.textContent = formatPrice(prod.price);
    card.appendChild(priceDiv);

    // DESCRIPTION
    if(prod.desc){
      const descDiv = document.createElement('p');
      descDiv.className = 'desc';
      descDiv.style.whiteSpace = 'pre-line';
      descDiv.textContent = prod.desc;
      card.appendChild(descDiv);
    }

    // EDIT & DELETE BUTTONS
    const editRow = document.createElement('div');
    editRow.style.display = 'flex';
    editRow.style.gap = '0.5rem';
    editRow.style.marginBottom = '0.8rem';

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-price';
    editBtn.textContent = '✏️ Edit';
    editBtn.type = 'button';
    editBtn.style.flex = '1';
    editBtn.addEventListener('click', ()=> openEditProductModal(prod));
    editRow.appendChild(editBtn);

    const delBtn = document.createElement('button');
    delBtn.className = 'edit-price';
    delBtn.textContent = '🗑️ Delete';
    delBtn.type = 'button';
    delBtn.style.color = 'red';
    delBtn.addEventListener('click', ()=>{
      if(confirm(`Delete "${prod.name}"?`)){
        deleteProduct(prod.id);
        renderProductGallery();
        updateCartUI();
      }
    });
    editRow.appendChild(delBtn);

    card.appendChild(editRow);

    // ADD TO CART
    const actions = document.createElement('div');
    actions.className = 'actions';

    const add = document.createElement('button');
    add.className = 'btn primary small';
    add.textContent = 'Add to Cart';
    add.type = 'button';
    add.addEventListener('click', (e)=>{ e.preventDefault(); addToCart(prod.id, 'product') });
    actions.appendChild(add);

    card.appendChild(actions);
    basicMenu.appendChild(card);
  });
}

// CART FUNCTIONS
function addToCart(id, type){
  let item = null;
  let name = '';
  
  if(type === 'cake'){
    item = cakes.find(c=>c.id===id);
    if(!item){ alert('Cake not found'); return }
    name = item.name;
  } else if(type === 'product'){
    item = products.find(p=>p.id===id);
    if(!item){ alert('Product not found'); return }
    name = item.name;
  }

  const existing = cart.find(ci=>ci.id===id);
  if(existing){
    existing.qty++;
  } else {
    cart.push({id: id, type: type, name: name, price: item.price, qty: 1});
  }

  saveCart();
  updateCartUI();
  alert(`${name} added to cart!`);
}

function saveCart(){ localStorage.setItem('amg_cart', JSON.stringify(cart)); }
function loadCart(){ try{ cart = JSON.parse(localStorage.getItem('amg_cart')) || [] }catch(e){ cart = [] } }

function updateCartUI(){
  const count = cart.reduce((s,i)=>s+i.qty,0);
  document.getElementById('cart-count').textContent = count;

  const list = document.getElementById('cart-items');
  list.innerHTML = '';

  const emptyMsg = document.getElementById('empty-cart-msg');
  if(cart.length===0){
    emptyMsg.style.display = 'block';
    document.getElementById('cart-summary').hidden = true;
    return;
  }

  emptyMsg.style.display = 'none';

  cart.forEach(item=>{
    const li = document.createElement('li');
    li.className = 'cart-item';
    li.innerHTML = `
      <div>
        <strong>${item.name}</strong><br>
        <small class="muted">Qty: ${item.qty} × Rs ${item.price}</small>
      </div>
      <div style="text-align:right">
        <div><strong>Rs ${item.qty * item.price}</strong></div>
        <button class="btn outline small remove" data-id="${item.id}">Remove</button>
      </div>
    `;
    list.appendChild(li);
  });

  document.getElementById('cart-summary').hidden = false;
  const subtotal = cart.reduce((s,i)=>s + i.qty * i.price, 0);
  document.getElementById('cart-subtotal').textContent = `Rs ${subtotal}`;
}

function removeFromCart(id){ cart = cart.filter(i=>i.id!==id); saveCart(); updateCartUI(); }
function clearCart(){ cart=[]; saveCart(); updateCartUI(); }

// SEND ORDER
function sendOrder(){
  if(cart.length===0){ alert('Your cart is empty.'); return }

  const name = document.getElementById('cust-name').value.trim();
  const phone = document.getElementById('cust-phone').value.trim();
  if(!name || !phone){ alert('Please enter name and phone.'); return }

  const address = document.getElementById('cust-address').value.trim();
  const method = document.getElementById('cust-method').value;
  const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
  const notes = document.getElementById('cust-notes').value.trim();

  const lines = [];
  lines.push('='.repeat(60));
  lines.push('A.M.G. BAKERY & CAFE - ORDER');
  lines.push('='.repeat(60));
  lines.push('');
  lines.push(`CUSTOMER:  ${name}`);
  lines.push(`PHONE:     ${phone}`);
  lines.push(`METHOD:    ${method === 'delivery' ? 'DELIVERY' : 'PICKUP'}`);
  if(address) lines.push(`ADDRESS:   ${address}`);
  
  // Payment method details
  let paymentDisplay = '';
  if(paymentMethod === 'cod'){
    paymentDisplay = 'CASH ON DELIVERY';
  } else if(paymentMethod === 'esewa'){
    paymentDisplay = 'eSEWA PAYMENT';
    const esewaId = document.getElementById('esewa-id').value.trim();
    if(esewaId) lines.push(`ESEWA ID: ${esewaId}`);
  } else if(paymentMethod === 'bank'){
    paymentDisplay = 'BANK TRANSFER';
    const bankName = document.getElementById('bank-name').value.trim();
    const bankAcc = document.getElementById('bank-account').value.trim();
    if(bankName) lines.push(`BANK: ${bankName}`);
    if(bankAcc) lines.push(`ACCOUNT: ${bankAcc}`);
  } else if(paymentMethod === 'online'){
    paymentDisplay = 'ONLINE PAYMENT';
  }
  lines.push(`PAYMENT:   ${paymentDisplay}`);
  lines.push('');
  lines.push('ITEMS ORDERED:');
  lines.push('-'.repeat(60));

  cart.forEach(i=>{
    const typeLabel = i.type === 'cake' ? '[CAKE]' : '[PRODUCT]';
    lines.push(`  ${i.name} ${typeLabel}`);
    lines.push(`  Quantity: ${i.qty}  |  Unit Price: Rs ${i.price}  |  Total: Rs ${i.qty * i.price}`);
    lines.push('');
  });

  lines.push('-'.repeat(60));
  const subtotal = cart.reduce((s,i)=>s + i.qty * i.price, 0);
  lines.push(`TOTAL AMOUNT: Rs ${subtotal}`.padStart(60));
  lines.push('');

  if(notes) lines.push(`SPECIAL NOTES: ${notes}`);

  lines.push('');
  lines.push('STATUS: Pending confirmation');
  lines.push(`CONTACT: 9848551921 / 9826542784`);
  lines.push('='.repeat(60));

  const body = encodeURIComponent(lines.join('\n'));
  const subject = encodeURIComponent(`ORDER from ${name} - A.M.G. Bakery`);
  
  // Track sale in history
  trackSale(cart, subtotal);
  
  // Track order for logged-in users
  if(currentUser){
    const orderData = {
      items: cart,
      total: subtotal,
      method: method,
      address: address,
      phone: phone
    };
    addOrder(orderData);
  }
  
  // Clear cart and show success
  clearCart();
  alert('✅ Order sent! Check your email inbox for confirmation.\n\nLoyalty Points: +'+ Math.floor(subtotal/100));
  
  window.location.href = `mailto:ordersamgbakery@gmail.com?subject=${subject}&body=${body}`;
}

// LOGIN/REGISTER MODAL FUNCTIONS
function openLoginModal(){
  document.getElementById('login-email').value = '';
  document.getElementById('login-password').value = '';
  document.getElementById('auth-modal').dataset.mode = 'login';
  document.getElementById('auth-modal').querySelector('h3').textContent = 'Login to Your Account';
  document.getElementById('login-form').style.display = 'block';
  document.getElementById('register-form').style.display = 'none';
  document.getElementById('auth-modal').classList.add('active');
}

function openRegisterModal(){
  document.getElementById('register-name').value = '';
  document.getElementById('register-phone').value = '';
  document.getElementById('register-email').value = '';
  document.getElementById('register-password').value = '';
  document.getElementById('register-address').value = '';
  document.getElementById('register-birthday').value = '';
  document.getElementById('auth-modal').dataset.mode = 'register';
  document.getElementById('auth-modal').querySelector('h3').textContent = 'Create New Account';
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('register-form').style.display = 'block';
  document.getElementById('auth-modal').classList.add('active');
}

function doLogin(){
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  if(!email || !password){ alert('Please fill all fields'); return }
  
  const result = loginUser(email, password);
  if(result.success){
    alert(result.message);
    document.getElementById('auth-modal').classList.remove('active');
    updateAuthUI();
    location.reload();
  } else {
    alert('❌ ' + result.message);
  }
}

function doRegister(){
  const name = document.getElementById('register-name').value.trim();
  const phone = document.getElementById('register-phone').value.trim();
  const email = document.getElementById('register-email').value.trim();
  const password = document.getElementById('register-password').value;
  const address = document.getElementById('register-address').value.trim();
  const birthday = document.getElementById('register-birthday').value;
  
  if(!name || !phone || !email || !password){ 
    alert('Please fill all required fields');
    return;
  }
  
  const result = registerUser(name, phone, email, password, address, birthday);
  if(result.success){
    alert(result.message + '\nNow logging you in...');
    loginUser(email, password);
    document.getElementById('auth-modal').classList.remove('active');
    updateAuthUI();
    location.reload();
  } else {
    alert('❌ ' + result.message);
  }
}

function updateAuthUI(){
  const authBtn = document.getElementById('auth-btn');
  const signupBtn = document.getElementById('signup-btn');
  const loyaltyBtn = document.getElementById('loyalty-btn');
  const adminBtn = document.getElementById('admin-btn');
  
  // Check if admin is logged in
  let admin = null;
  try{ admin = JSON.parse(localStorage.getItem('amg_admin')); }catch(e){}
  
  if(admin){
    authBtn.style.display = 'none';
    signupBtn.style.display = 'none';
    adminBtn.style.display = 'inline-block';
    adminBtn.innerHTML = '⚙️ Admin Dashboard';
    adminBtn.onclick = ()=> showAdminDashboard();
    loyaltyBtn.style.display = 'none';
    currentAdmin = admin;
  } else if(currentUser){
    authBtn.innerHTML = `👤 ${currentUser.name.split(' ')[0]} | Account`;
    authBtn.onclick = ()=>{ goToProfile(); };
    authBtn.style.display = 'inline-block';
    signupBtn.style.display = 'none';
    adminBtn.style.display = 'none';
    
    if(loyaltyBtn){
      loyaltyBtn.style.display = 'inline-block';
      loyaltyBtn.innerHTML = `⭐ ${currentUser.loyaltyPoints} Points`;
      loyaltyBtn.onclick = ()=> goToProfile();
    }
  } else {
    authBtn.innerHTML = `👤 Login`;
    authBtn.onclick = ()=>{ openLoginModal(); };
    authBtn.style.display = 'inline-block';
    signupBtn.style.display = 'inline-block';
    adminBtn.style.display = 'none';
    
    if(loyaltyBtn) loyaltyBtn.style.display = 'none';
  }
}

// PROFILE PAGE FUNCTIONS
function goToProfile(){
  if(!currentUser){ alert('Please login first'); return; }
  
  // Hide all main sections
  document.querySelectorAll('section').forEach(s=> s.style.display = 'none');
  document.getElementById('profile-page').style.display = 'block';
  
  // Populate profile info
  document.getElementById('profile-name').textContent = currentUser.name;
  document.getElementById('profile-email').textContent = currentUser.email;
  document.getElementById('profile-phone').textContent = currentUser.phone || '(Not provided)';
  document.getElementById('profile-points').textContent = currentUser.loyaltyPoints;
  document.getElementById('profile-order-count').textContent = currentUser.orders?.length || 0;
  document.getElementById('profile-total-spent').textContent = `Rs ${currentUser.totalSpent || 0}`;
  
  const joined = currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('en-US', {year:'numeric', month:'short', day:'numeric'}) : 'Unknown';
  document.getElementById('profile-joined').textContent = joined;
  
  // Populate edit fields
  document.getElementById('profile-phone-edit').value = currentUser.phone || '';
  document.getElementById('profile-birthday-edit').value = currentUser.birthday || '';
  document.getElementById('profile-address-edit').value = currentUser.address || '';
  
  window.scrollTo(0, 0);
}

function goToOrderHistory(){
  if(!currentUser){ alert('Please login first'); return; }
  
  // Hide all main sections
  document.querySelectorAll('section').forEach(s=> s.style.display = 'none');
  document.getElementById('order-history-page').style.display = 'block';
  
  displayOrderHistory();
  window.scrollTo(0, 0);
}

function displayOrderHistory(){
  const ordersList = document.getElementById('orders-list');
  const orders = getOrderHistory();
  
  if(orders.length === 0){
    ordersList.innerHTML = `
      <div style="text-align:center;padding:2rem;background:white;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1)">
        <div style="font-size:3rem;margin-bottom:1rem">📭</div>
        <p style="color:var(--muted);font-size:1.1rem">No orders yet</p>
        <p style="color:var(--muted);margin-bottom:1.5rem">Start ordering delicious cakes and products!</p>
        <button class="btn primary" onclick="goToOrders()">🛒 Go to Order Menu</button>
      </div>
    `;
    return;
  }
  
  let html = '';
  orders.forEach(order=>{
    const orderDate = new Date(order.date).toLocaleDateString('en-US', {year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'});
    const itemsHtml = order.items.map(item=> `<li>${item.name} × ${item.qty} = Rs ${item.qty * item.price}</li>`).join('');
    const points = Math.floor(order.total / 100);
    
    html += `
      <div style="background:white;padding:1.5rem;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);margin-bottom:1rem">
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin-bottom:1rem;padding-bottom:1rem;border-bottom:1px solid var(--border)">
          <div>
            <span style="color:var(--muted);font-size:0.9rem">Order ID</span>
            <p style="margin:0.3rem 0;font-weight:600;font-family:monospace">${order.id}</p>
          </div>
          <div>
            <span style="color:var(--muted);font-size:0.9rem">Date</span>
            <p style="margin:0.3rem 0;font-weight:600">${orderDate}</p>
          </div>
          <div>
            <span style="color:var(--muted);font-size:0.9rem">Status</span>
            <p style="margin:0.3rem 0;font-weight:600;color:var(--accent)">✓ ${order.status}</p>
          </div>
        </div>
        
        <div style="margin-bottom:1rem">
          <span style="color:var(--muted);font-size:0.9rem">Items</span>
          <ul style="list-style:none;padding:0;margin:0.5rem 0">${itemsHtml}</ul>
        </div>
        
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;padding:1rem;background:var(--light-bg);border-radius:6px;margin-bottom:1rem">
          <div>
            <span style="color:var(--muted);font-size:0.9rem">Total Amount</span>
            <p style="margin:0;font-size:1.3rem;font-weight:700;color:var(--primary)">Rs ${order.total}</p>
          </div>
          <div>
            <span style="color:var(--muted);font-size:0.9rem">Loyalty Points Earned</span>
            <p style="margin:0;font-size:1.3rem;font-weight:700;color:var(--accent)">⭐ +${points}</p>
          </div>
        </div>
        
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
          <div>
            <span style="color:var(--muted);font-size:0.9rem">Delivery Method</span>
            <p style="margin:0.3rem 0;font-weight:600">${order.method === 'delivery' ? '🚗 Delivery' : '🏪 Pickup'}</p>
          </div>
          <div>
            <span style="color:var(--muted);font-size:0.9rem">Delivery Address</span>
            <p style="margin:0.3rem 0;font-weight:600">${order.address || 'N/A'}</p>
          </div>
        </div>
      </div>
    `;
  });
  
  ordersList.innerHTML = html;
}

function saveProfileChanges(){
  const phone = document.getElementById('profile-phone-edit').value.trim();
  const address = document.getElementById('profile-address-edit').value.trim();
  const birthday = document.getElementById('profile-birthday-edit').value;
  
  if(!phone){ alert('Phone is required'); return; }
  
  const updates = { phone, address, birthday };
  const result = updateUserProfile(currentUser.email, updates);
  
  if(result.success){
    alert('✓ Profile updated successfully!');
    goToProfile(); // Refresh profile display
  } else {
    alert('❌ Failed to update profile');
  }
}

function doLogoutAndReload(){
  if(confirm('Are you sure you want to logout?')){
    logoutUser();
    alert('Logged out successfully');
    location.reload();
  }
}

function goToOrders(){
  // Hide profile/order-history, show order section
  document.querySelectorAll('section').forEach(s=> s.style.display = 'block');
  document.getElementById('profile-page').style.display = 'none';
  document.getElementById('order-history-page').style.display = 'none';
  document.getElementById('order').scrollIntoView({behavior:'smooth'});
}

// QUICK WINS FUNCTIONS
function displayPopularItems(){
  const allItems = [...cakes, ...products];
  let popular = [];
  try{ popular = JSON.parse(localStorage.getItem('amg_popular_items')) || []; }catch(e){}
  
  // If no items marked as popular, use first 3 items
  let itemsToShow = popular.length > 0 
    ? allItems.filter(item=> popular.includes(item.id))
    : allItems.slice(0, 3);
  
  if(itemsToShow.length === 0){
    document.getElementById('popular-grid').innerHTML = '<p style="text-align:center;grid-column:1/-1;color:var(--muted)">Popular items will appear here</p>';
    return;
  }
  
  let html = '';
  itemsToShow.forEach(item=>{
    html += `
      <div style="background:white;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);transition:transform 0.3s" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
        <div style="width:100%;height:200px;background:${item.photo ? `url('${item.photo}') center/cover` : 'linear-gradient(135deg, var(--light-bg), var(--border))'};display:flex;align-items:center;justify-content:center;color:var(--muted)">
          ${!item.photo ? '📷' : ''}
        </div>
        <div style="padding:1rem">
          <h4 style="margin:0 0 0.5rem 0;color:var(--primary)">${item.name}</h4>
          <p style="margin:0 0 1rem 0;color:var(--muted);font-size:0.9rem;min-height:2.1em">${(item.desc || 'Premium bakery item').substring(0, 60)}...</p>
          <div style="display:flex;justify-content:space-between;align-items:center">
            <span style="font-size:1.3rem;font-weight:700;color:var(--accent)">Rs ${item.price}</span>
            <button class="btn primary" onclick="addToCart({...item})" style="padding:0.5rem 1rem;font-size:0.9rem">Add</button>
          </div>
        </div>
      </div>
    `;
  });
  
  document.getElementById('popular-grid').innerHTML = html;
}

function displayTestimonials(){
  let testimonials = [];
  try{ testimonials = JSON.parse(localStorage.getItem('amg_testimonials')) || []; }catch(e){}
  
  // Add default testimonials if none exist
  if(testimonials.length === 0){
    testimonials = [
      {name: 'Ram Sharma', rating: 5, text: 'Best bakery in Surkhet! Fresh cakes every time. Highly recommend! 🎂'},
      {name: 'Priya Thapa', rating: 5, text: 'Amazing quality and quick delivery. Their chocolate cake is to die for! 😋'},
      {name: 'Arjun KC', rating: 4.5, text: 'Great variety of products. Love their breads and pastries. Will order again!'},
      {name: 'Anjali Negi', rating: 5, text: 'Professional service and delicious food. Perfect for parties! 🎉'}
    ];
  }
  
  let html = '';
  testimonials.forEach((review, idx)=>{
    const stars = '⭐'.repeat(Math.round(review.rating)) + (review.rating % 1 ? '✨' : '');
    html += `
      <div style="background:white;padding:1.5rem;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);position:relative">
        <div style="margin-bottom:0.5rem">${stars}</div>
        <p style="margin:0 0 1rem 0;font-style:italic;color:var(--text)">"${review.text}"</p>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <p style="margin:0;font-weight:600;color:var(--primary)">— ${review.name}</p>
          ${currentAdmin ? `<button onclick="deleteTestimonial(${idx})" style="background:#ef4444;color:white;border:none;padding:0.3rem 0.6rem;border-radius:4px;cursor:pointer;font-size:0.8rem">Delete</button>` : ''}
        </div>
      </div>
    `;
  });
  
  document.getElementById('testimonials-grid').innerHTML = html;
}

function subscribeNewsletter(){
  const email = document.getElementById('newsletter-email').value.trim();
  if(!email){ alert('Please enter your email'); return; }
  
  // Save to localStorage
  let subscribers = [];
  try{
    subscribers = JSON.parse(localStorage.getItem('amg_newsletter')) || [];
  }catch(e){}
  
  if(!subscribers.includes(email)){
    subscribers.push(email);
    localStorage.setItem('amg_newsletter', JSON.stringify(subscribers));
  }
  
  document.getElementById('newsletter-email').value = '';
  alert(`✓ Thanks for subscribing ${email}!\nWe'll send you weekly specials and baking tips.`);
}

// MODAL FUNCTIONS
function openAddCakeModal(){
  document.getElementById('cake-name').value = '';
  document.getElementById('cake-price').value = '';
  document.getElementById('cake-desc').value = '';
  document.getElementById('cake-photo').value = '';
  document.getElementById('add-cake-modal').dataset.editId = '';
  document.getElementById('add-cake-modal').querySelector('h3').textContent = 'Add New Cake';
  document.getElementById('add-cake-modal').classList.add('active');
}

function openEditCakeModal(cake){
  document.getElementById('cake-name').value = cake.name;
  document.getElementById('cake-price').value = cake.price;
  document.getElementById('cake-desc').value = cake.desc || '';
  document.getElementById('cake-photo').value = '';
  document.getElementById('add-cake-modal').dataset.editId = cake.id;
  document.getElementById('add-cake-modal').querySelector('h3').textContent = 'Edit Cake';
  document.getElementById('add-cake-modal').classList.add('active');
}

async function saveCake(){
  const name = document.getElementById('cake-name').value.trim();
  const price = parseInt(document.getElementById('cake-price').value);
  const desc = document.getElementById('cake-desc').value.trim();
  const photoInput = document.getElementById('cake-photo');

  if(!name || !price){ alert('Name and price are required'); return }

  let imageUri = null;
  if(photoInput.files.length > 0){
    imageUri = await fileToDataUri(photoInput.files[0]);
  }

  const editId = document.getElementById('add-cake-modal').dataset.editId;
  if(editId){
    // Update existing cake
    updateCake(editId, name, price, desc, imageUri);
  } else {
    // Add new cake
    addCake(name, price, desc, imageUri);
  }

  renderCakeGallery();
  document.getElementById('add-cake-modal').classList.remove('active');
}

// PRODUCT MODAL FUNCTIONS
function openAddProductModal(){
  document.getElementById('product-name').value = '';
  document.getElementById('product-price').value = '';
  document.getElementById('product-desc').value = '';
  document.getElementById('product-photo').value = '';
  document.getElementById('add-product-modal').dataset.editId = '';
  document.getElementById('add-product-modal').querySelector('h3').textContent = 'Add New Product';
  document.getElementById('add-product-modal').classList.add('active');
}

function openEditProductModal(product){
  document.getElementById('product-name').value = product.name;
  document.getElementById('product-price').value = product.price;
  document.getElementById('product-desc').value = product.desc || '';
  document.getElementById('product-photo').value = '';
  document.getElementById('add-product-modal').dataset.editId = product.id;
  document.getElementById('add-product-modal').querySelector('h3').textContent = 'Edit Product';
  document.getElementById('add-product-modal').classList.add('active');
}

async function saveProduct(){
  const name = document.getElementById('product-name').value.trim();
  const price = parseInt(document.getElementById('product-price').value);
  const desc = document.getElementById('product-desc').value.trim();
  const photoInput = document.getElementById('product-photo');

  if(!name || !price){ alert('Name and price are required'); return }

  let imageUri = null;
  if(photoInput.files.length > 0){
    imageUri = await fileToDataUri(photoInput.files[0]);
  }

  const editId = document.getElementById('add-product-modal').dataset.editId;
  if(editId){
    // Update existing product
    updateProduct(editId, name, price, desc, imageUri);
  } else {
    // Add new product
    addProduct(name, price, desc, imageUri);
  }

  renderProductGallery();
  document.getElementById('add-product-modal').classList.remove('active');
}

// GALLERY MODAL FUNCTIONS
function openAddGalleryModal(){
  document.getElementById('gallery-title').value = '';
  document.getElementById('gallery-desc').value = '';
  document.getElementById('gallery-photo').value = '';
  document.getElementById('add-gallery-modal').dataset.editId = '';
  document.getElementById('add-gallery-modal').querySelector('h3').textContent = 'Add Gallery Photo';
  document.getElementById('add-gallery-modal').classList.add('active');
}

function openEditGalleryModal(photo){
  document.getElementById('gallery-title').value = photo.title;
  document.getElementById('gallery-desc').value = photo.description || '';
  document.getElementById('gallery-photo').value = '';
  document.getElementById('add-gallery-modal').dataset.editId = photo.id;
  document.getElementById('add-gallery-modal').querySelector('h3').textContent = 'Edit Gallery Photo';
  document.getElementById('add-gallery-modal').classList.add('active');
}

async function saveGalleryPhoto(){
  const title = document.getElementById('gallery-title').value.trim();
  const desc = document.getElementById('gallery-desc').value.trim();
  const photoInput = document.getElementById('gallery-photo');

  if(!title){ alert('Title is required'); return }

  let imageUri = null;
  if(photoInput.files.length > 0){
    imageUri = await fileToDataUri(photoInput.files[0]);
  }

  const editId = document.getElementById('add-gallery-modal').dataset.editId;
  if(editId){
    // Update existing photo
    updateGalleryPhoto(editId, title, desc, imageUri);
  } else {
    // Add new photo
    addGalleryPhoto(title, desc, imageUri);
  }

  renderGallery();
  document.getElementById('add-gallery-modal').classList.remove('active');
}

// LOGO
function getLogo(){
  return localStorage.getItem('amg_logo') || null;
}

function setLogo(dataUri){
  localStorage.setItem('amg_logo', dataUri);
  const display = document.getElementById('logo-display');
  const img = document.createElement('img');
  img.src = dataUri;
  img.style.height = '50px';
  img.style.width = 'auto';
  display.innerHTML = '';
  display.appendChild(img);
}

function saveLogo(){
  const file = document.getElementById('logo-file').files[0];
  if(!file){ alert('Please select a file'); return }
  fileToDataUri(file).then(uri=>{ setLogo(uri); document.getElementById('logo-modal').classList.remove('active'); });
}

// PAYMENT FIELDS
function updatePaymentFields(){
  const cod = document.getElementById('cod-fields');
  const esewa = document.getElementById('esewa-fields');
  const bank = document.getElementById('bank-fields');
  const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

  cod.style.display = 'none';
  if(esewa) esewa.style.display = 'none';
  if(bank) bank.style.display = 'none';

  if(paymentMethod === 'cod'){
    cod.style.display = 'block';
  } else if(paymentMethod === 'esewa' && esewa){
    esewa.style.display = 'block';
  } else if(paymentMethod === 'bank' && bank){
    bank.style.display = 'block';
  }
}

// GALLERY STORAGE - Dynamic system
let galleryPhotos = [];

function loadGalleryPhotos(){
  try{
    galleryPhotos = JSON.parse(localStorage.getItem('amg_gallery_photos')) || [];
  }catch(e){
    galleryPhotos = [];
  }
}

function saveGalleryPhotos(){
  localStorage.setItem('amg_gallery_photos', JSON.stringify(galleryPhotos));
}

function addGalleryPhoto(title, description, imageDataUri){
  const photo = {
    id: generateCakeId(),
    title: title,
    description: description,
    image: imageDataUri || null
  };
  galleryPhotos.push(photo);
  saveGalleryPhotos();
  return photo;
}

function updateGalleryPhoto(id, title, description, imageDataUri){
  const photo = galleryPhotos.find(p=>p.id===id);
  if(photo){
    photo.title = title;
    photo.description = description;
    if(imageDataUri) photo.image = imageDataUri;
    saveGalleryPhotos();
  }
}

function deleteGalleryPhoto(id){
  galleryPhotos = galleryPhotos.filter(p=>p.id!==id);
  saveGalleryPhotos();
}

function getGalleryImage(id){
  const images = JSON.parse(localStorage.getItem('amg_gallery_images')||'{}');
  return images[id] || null;
}

function setGalleryImage(id, dataUri){
  const images = JSON.parse(localStorage.getItem('amg_gallery_images')||'{}');
  images[id] = dataUri;
  localStorage.setItem('amg_gallery_images', JSON.stringify(images));
}

// RENDER GALLERY
function renderGallery(){
  const gallery = document.getElementById('gallery-grid');
  if(!gallery) return;
  
  gallery.innerHTML = '';
  
  if(galleryPhotos.length === 0){
    gallery.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--muted)">No gallery photos yet. Click "+ Add Gallery Photo" to get started!</p>';
    return;
  }
  
  galleryPhotos.forEach(photo=>{
    const div = document.createElement('div');
    div.className = 'gallery-item';
    div.style.display = 'flex';
    div.style.flexDirection = 'column';
    div.style.position = 'relative';
    
    const img = document.createElement('img');
    img.src = photo.image || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="250"><rect fill="%23f0f0f0" width="100%25" height="100%25"/><text x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle" font-size="14" fill="%23999">No image</text></svg>';
    img.alt = photo.title;
    img.style.cursor = 'pointer';
    img.style.width = '100%';
    img.style.height = '200px';
    img.style.objectFit = 'cover';
    img.style.borderRadius = '10px';
    
    div.appendChild(img);
    
    // TITLE
    const title = document.createElement('h4');
    title.textContent = photo.title;
    title.style.margin = '0.8rem 0 0.3rem 0';
    title.style.fontSize = '1rem';
    title.style.color = 'var(--primary)';
    div.appendChild(title);
    
    // DESCRIPTION
    if(photo.description){
      const desc = document.createElement('p');
      desc.className = 'desc';
      desc.textContent = photo.description;
      desc.style.margin = '0.3rem 0 0.8rem 0';
      desc.style.fontSize = '0.9rem';
      desc.style.color = 'var(--muted)';
      desc.style.whiteSpace = 'pre-wrap';
      div.appendChild(desc);
    }
    
    // EDIT & DELETE BUTTONS
    const actions = document.createElement('div');
    actions.style.display = 'flex';
    actions.style.gap = '0.5rem';
    actions.style.marginBottom = '0.5rem';
    
    const editBtn = document.createElement('button');
    editBtn.className = 'edit-price';
    editBtn.textContent = '✏️ Edit';
    editBtn.type = 'button';
    editBtn.style.flex = '1';
    editBtn.addEventListener('click', ()=> openEditGalleryModal(photo));
    actions.appendChild(editBtn);
    
    const delBtn = document.createElement('button');
    delBtn.className = 'edit-price';
    delBtn.textContent = '🗑️ Delete';
    delBtn.type = 'button';
    delBtn.style.color = 'red';
    delBtn.style.flex = '1';
    delBtn.addEventListener('click', ()=>{
      if(confirm(`Delete "${photo.title}"?`)){
        deleteGalleryPhoto(photo.id);
        renderGallery();
      }
    });
    actions.appendChild(delBtn);
    
    div.appendChild(actions);
    gallery.appendChild(div);
  });
}

// INIT
window.addEventListener('DOMContentLoaded', ()=>{
  // Load current user
  loadCurrentUser();
  
  // Logo
  const logoDisplay = document.getElementById('logo-display');
  logoDisplay.style.cursor = 'pointer';
  logoDisplay.addEventListener('click', ()=>{
    document.getElementById('logo-modal').classList.add('active');
  });

  const logoFile = document.getElementById('logo-file');
  logoFile.addEventListener('change', async (e)=>{
    if(e.target.files.length > 0){
      const dataUri = await fileToDataUri(e.target.files[0]);
      setLogo(dataUri);
      setTimeout(()=>{ document.getElementById('logo-modal').classList.remove('active'); }, 500);
    }
  });

  const savedLogo = getLogo();
  if(savedLogo){
    const img = document.createElement('img');
    img.src = savedLogo;
    img.style.height = '50px';
    img.style.width = 'auto';
    logoDisplay.innerHTML = '';
    logoDisplay.appendChild(img);
  }

  // Cakes & Products & Cart & Gallery
  loadCakes();
  loadProducts();
  loadGalleryPhotos();
  renderCakeGallery();
  renderProductGallery();
  renderGallery();
  loadCart();
  updateCartUI();

  // Search functionality
  const searchInput = document.getElementById('search-input');
  if(searchInput){
    searchInput.addEventListener('input', (e)=>{
      searchQuery = e.target.value;
      renderCakeGallery();
      renderProductGallery();
    });
  }

  // Cart item removal
  document.getElementById('cart-items').addEventListener('click', (e)=>{
    if(e.target.classList.contains('remove')){
      removeFromCart(e.target.dataset.id);
    }
  });

  document.getElementById('clear-cart').addEventListener('click', ()=> clearCart());
  document.getElementById('send-order').addEventListener('click', (e)=>{ e.preventDefault(); sendOrder(); });

  // Payment method visibility
  const paymentRadios = document.querySelectorAll('input[name="payment"]');
  paymentRadios.forEach(radio=>{
    radio.addEventListener('change', ()=> updatePaymentFields());
  });
  updatePaymentFields();

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const target = document.querySelector(a.getAttribute('href'));
      if(target){ e.preventDefault(); target.scrollIntoView({behavior:'smooth'}); }
    });
  });
  
  // Initialize quick wins
  displayPopularItems();
  displayTestimonials();
  displayAboutSection();
  
  // Update auth UI
  updateAuthUI();
});