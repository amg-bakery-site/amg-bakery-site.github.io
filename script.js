// A.M.G. Bakery & Cafe - Professional Bakery Platform

let currentAdmin = null;
let currentTestimonialRating = 0;
let searchQuery = ''; // Initialize search query variable

// STORAGE MANAGEMENT
function getStorageUsage(){
  let total = 0;
  for(let key in localStorage){
    if(localStorage.hasOwnProperty(key)){
      total += localStorage[key].length + key.length;
    }
  }
  return (total / 1024).toFixed(2); // KB
}

function showStorageStatus(){
  const used = getStorageUsage();
  console.log(`📊 Storage used: ${used} KB / 5000 KB (${(used/5000*100).toFixed(1)}%)`);
  if(used > 4500){
    console.warn('⚠️ WARNING: Storage nearly full! Consider clearing old data.');
  }
}

// CLEAR OLD DATA TO FREE STORAGE
function clearOldData(){
  if(!confirm('This will remove old cakes, products, and photos to free up storage.\n\nKeep only the 3 most recent of each. Continue?')) return;
  
  try {
    // Clear old cakes
    let cakes = JSON.parse(localStorage.getItem('amg_cakes')) || [];
    if(cakes.length > 3) {
      cakes = cakes.slice(-3);
      localStorage.setItem('amg_cakes', JSON.stringify(cakes));
      console.log('✓ Kept only 3 newest cakes');
    }
    
    // Clear old products
    let products = JSON.parse(localStorage.getItem('amg_products')) || [];
    if(products.length > 3) {
      products = products.slice(-3);
      localStorage.setItem('amg_products', JSON.stringify(products));
      console.log('✓ Kept only 3 newest products');
    }
    
    // Clear old gallery photos
    let gallery = JSON.parse(localStorage.getItem('amg_gallery_photos')) || [];
    if(gallery.length > 5) {
      gallery = gallery.slice(-5);
      localStorage.setItem('amg_gallery_photos', JSON.stringify(gallery));
      console.log('✓ Kept only 5 newest gallery photos');
    }
    
    showStorageStatus();
    alert('✓ Storage cleaned! Old items removed.');
    location.reload();
  } catch(e) {
    console.error('Error clearing data:', e);
    alert('Error clearing storage');
  }
}

// Run storage check on load
window.addEventListener('load', showStorageStatus);

// FLOATING SOCIAL MEDIA WIDGET
function toggleFloatingSocial(){
  const menu = document.querySelector('.floating-social-menu');
  if(menu){
    menu.classList.toggle('active');
  }
}

// Close floating social when clicking outside
document.addEventListener('DOMContentLoaded', function(){
  document.addEventListener('click', function(e){
    const social = document.querySelector('.floating-social');
    if(social && !social.contains(e.target)){
      const menu = document.querySelector('.floating-social-menu');
      if(menu) menu.classList.remove('active');
    }
  });
});

// MOBILE MENU TOGGLE
function toggleMobileMenu(){
  const nav = document.querySelector('.site-nav');
  nav.classList.toggle('mobile-open');
}

// Close mobile menu when link is clicked
document.addEventListener('DOMContentLoaded', function(){
  const navLinks = document.querySelectorAll('.site-nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', function(){
      const nav = document.querySelector('.site-nav');
      nav.classList.remove('mobile-open');
    });
  });
  
  // Show/hide mobile menu button based on screen size
  function updateMobileMenuButton(){
    const btn = document.getElementById('mobile-menu-btn');
    if(window.innerWidth <= 768){
      btn.style.display = 'inline-block';
    } else {
      btn.style.display = 'none';
      document.querySelector('.site-nav').classList.remove('mobile-open');
    }
  }
  updateMobileMenuButton();
  window.addEventListener('resize', updateMobileMenuButton);
});

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
    toggleAdminButtons();
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
  toggleAdminButtons();
  window.scrollTo(0, 0);
}

function toggleAdminButtons(){
  const addCakeBtn = document.getElementById('addCakeBtn');
  const addProductBtn = document.getElementById('addProductBtn');
  const addGalleryBtn = document.getElementById('addGalleryBtn');
  const addVideoBtn = document.getElementById('addVideoBtn');
  
  const display = currentAdmin ? 'inline-block' : 'none';
  
  if(addCakeBtn) addCakeBtn.style.display = display;
  if(addProductBtn) addProductBtn.style.display = display;
  if(addGalleryBtn) addGalleryBtn.style.display = display;
  if(addVideoBtn) addVideoBtn.style.display = display;
}

// TESTIMONIALS FUNCTIONS
function openTestimonialModal(){
  // Clear form fields
  document.getElementById('testimonial-text').value = '';
  currentTestimonialRating = 0;
  document.getElementById('rating-display').textContent = 'Select rating';
  
  // If logged in, pre-fill name; otherwise leave blank for manual entry
  if(currentUser){
    document.getElementById('testimonial-name').value = currentUser.name;
    document.getElementById('testimonial-name').readOnly = true;
  } else {
    document.getElementById('testimonial-name').value = '';
    document.getElementById('testimonial-name').readOnly = false;
  }
  
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
  
  if(!name || !text || !rating){ 
    alert('⚠️ Please fill all fields (Name, Review, and Rating)'); 
    return; 
  }
  
  let testimonials = [];
  try{ testimonials = JSON.parse(localStorage.getItem('amg_testimonials')) || []; }catch(e){}
  
  // Create review object
  const review = { 
    name, 
    text, 
    rating, 
    date: new Date().toISOString()
  };
  
  // Add userId if logged in (for edit/delete permission)
  if(currentUser){
    review.userId = currentUser.email;
  }
  
  testimonials.push(review);
  
  try {
    localStorage.setItem('amg_testimonials', JSON.stringify(testimonials));
    alert('✓ Thank you for your review!');
    
    // Clear form
    document.getElementById('testimonial-modal').classList.remove('active');
    document.getElementById('testimonial-name').value = '';
    document.getElementById('testimonial-text').value = '';
    document.getElementById('testimonial-name').readOnly = false;
    
    displayTestimonials();
  } catch(error) {
    if(error.name === 'QuotaExceededError' || error.code === 22) {
      alert('❌ Storage full! Please clear old reviews or try again later.');
    } else {
      console.error('Error saving review:', error);
      alert('Error saving review: ' + error.message);
    }
  }
}


function editTestimonial(idx){
  if(!currentUser){ alert('❌ Please login to edit your review'); return; }
  
  let testimonials = [];
  try{ testimonials = JSON.parse(localStorage.getItem('amg_testimonials')) || []; }catch(e){}
  
  const review = testimonials[idx];
  if(review.name !== currentUser.name){ alert('❌ You can only edit your own review'); return; }
  
  const newText = prompt('Edit your review:', review.text);
  if(newText === null) return;
  
  if(!newText.trim()){ alert('❌ Review cannot be empty'); return; }
  
  review.text = newText.trim();
  review.rating = prompt('Edit rating (1-5):', review.rating) || review.rating;
  review.rating = Math.min(5, Math.max(1, parseInt(review.rating)));
  
  localStorage.setItem('amg_testimonials', JSON.stringify(testimonials));
  alert('✓ Review updated successfully!');
  displayTestimonials();
}

function deleteTestimonial(idx){
  let testimonials = [];
  try{ testimonials = JSON.parse(localStorage.getItem('amg_testimonials')) || []; }catch(e){}
  
  const review = testimonials[idx];
  
  // Check if user can delete (owner or admin)
  const isOwner = currentUser && currentUser.name === review.name;
  const isAdmin = currentAdmin;
  
  if(!isAdmin && !isOwner){ 
    alert('❌ You can only delete your own review'); 
    return; 
  }
  
  if(!confirm('Delete this testimonial?')) return;
  
  testimonials.splice(idx, 1);
  localStorage.setItem('amg_testimonials', JSON.stringify(testimonials));
  
  alert('✓ Testimonial deleted');
  displayTestimonials();
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

// IMAGE COMPRESSION FOR STORAGE OPTIMIZATION - AGGRESSIVE
function compressImage(dataUri) {
  return new Promise((resolve, reject)=>{
    try {
      const img = new Image();
      img.onload = ()=> {
        const canvas = document.createElement('canvas');
        // Reduce size significantly
        let width = img.width;
        let height = img.height;
        
        // Scale down to max 400x400
        const maxDim = 400;
        if(width > maxDim || height > maxDim){
          const ratio = Math.min(maxDim / width, maxDim / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Very aggressive compression: 0.5 quality (50%)
        const compressed = canvas.toDataURL('image/jpeg', 0.5);
        console.log('✓ Compression complete. Original: ' + dataUri.length + ' chars → Compressed: ' + compressed.length + ' chars (' + ((1 - compressed.length/dataUri.length)*100).toFixed(0) + '% reduction)');
        resolve(compressed);
      };
      img.onerror = ()=> reject(new Error('Failed to load image for compression'));
      img.src = dataUri;
    } catch(e) {
      console.error('✗ Compression error:', e);
      reject(e);
    }
  });
}

function fileToDataUri(file){
  return new Promise((resolve, reject)=>{
    const reader = new FileReader();
    reader.onload = async (e)=> {
      try {
        console.log('✓ File read. Original size: ' + (file.size / 1024).toFixed(2) + ' KB');
        const dataUri = e.target.result;
        
        // Compress the image
        const compressed = await compressImage(dataUri);
        resolve(compressed);
      } catch(error) {
        console.error('✗ Compression failed:', error);
        reject(error);
      }
    };
    reader.onerror = (e)=> {
      console.error('✗ File read error:', e);
      reject(new Error('Failed to read file'));
    };
    reader.onabort = ()=> {
      console.error('✗ File read aborted');
      reject(new Error('File read was aborted'));
    };
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
    // Add sample cakes on first visit
    if(cakes.length === 0){
      addCake('Chocolate Cake', 600, 'Rich chocolate layer cake with premium chocolate frosting and ganache topping', null);
      addCake('Vanilla Cheesecake', 750, 'Creamy cheesecake with vanilla bean flavor and graham cracker crust', null);
      addCake('Red Velvet Cake', 700, 'Classic red velvet with cream cheese frosting and elegant appearance', null);
      addCake('Butterscotch Dream', 650, 'Moist butterscotch cake with butterscotch cream filling and caramel drizzle', null);
      cakes = JSON.parse(localStorage.getItem('amg_cakes')) || [];
    }
  }catch(e){
    cakes = [];
  }
}

function saveCakes(){
  try {
    localStorage.setItem('amg_cakes', JSON.stringify(cakes));
    console.log('✓ Cakes saved to storage');
  } catch(error) {
    if(error.name === 'QuotaExceededError' || error.code === 22) {
      console.error('✗ Storage quota exceeded!');
      console.log('🗑️ Attempting to free space...');
      
      // Remove oldest cakes (keep only 5 most recent)
      if(cakes.length > 5) {
        cakes = cakes.slice(-5);
        console.log('✓ Kept only 5 most recent cakes');
      }
      
      // Remove images from old cakes
      cakes.forEach(cake => {
        if(cake.image && cake.image.length > 50000) {
          console.log('🗑️ Removing large image from:', cake.name);
          cake.image = null;
        }
      });
      
      // Try saving again
      try {
        localStorage.setItem('amg_cakes', JSON.stringify(cakes));
        console.log('✓ Cakes saved after cleanup');
        alert('⚠️ Storage optimized! Kept 5 newest cakes. Some images removed.');
      } catch(err2) {
        console.error('✗ Still quota exceeded after cleanup');
        alert('❌ Storage full! Please clear browser data or delete old cakes.');
        throw err2;
      }
    } else {
      console.error('✗ Storage error:', error);
      throw error;
    }
  }
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
  if(!currentAdmin){ alert('❌ Only admin can delete cakes'); return; }
  if(!confirm('Delete this cake?')) return;
  cakes = cakes.filter(c=>c.id!==id);
  saveCakes();
  renderCakeGallery();
  alert('✓ Cake deleted');
}

// PRODUCTS STORAGE (same structure as cakes)
function loadProducts(){
  try{
    products = JSON.parse(localStorage.getItem('amg_products')) || [];
    // Add sample products on first visit
    if(products.length === 0){
      addProduct('Croissant', 80, 'Buttery, flaky croissant with layers of puff pastry', null);
      addProduct('Almond Bread', 120, 'Whole wheat bread with almond pieces and healthy grains', null);
      addProduct('Chocolate Donut', 50, 'Glazed chocolate donut with sprinkles', null);
      addProduct('Cappuccino', 150, 'Freshly brewed cappuccino with steamed milk and foam', null);
      addProduct('Blueberry Muffin', 100, 'Fresh blueberry muffin with crispy top', null);
      products = JSON.parse(localStorage.getItem('amg_products')) || [];
    }
  }catch(e){
    products = [];
  }
}

function saveProducts(){
  try {
    localStorage.setItem('amg_products', JSON.stringify(products));
    console.log('✓ Products saved to storage');
  } catch(error) {
    if(error.name === 'QuotaExceededError' || error.code === 22) {
      console.error('✗ Storage quota exceeded!');
      if(products.length > 5) {
        products = products.slice(-5);
        console.log('✓ Kept only 5 most recent products');
      }
      products.forEach(p => {
        if(p.image && p.image.length > 50000) p.image = null;
      });
      try {
        localStorage.setItem('amg_products', JSON.stringify(products));
        alert('⚠️ Storage optimized! Kept 5 newest products.');
      } catch(err2) {
        alert('❌ Storage full! Clear browser data.');
        throw err2;
      }
    } else throw error;
  }
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
  if(!currentAdmin){ alert('❌ Only admin can delete products'); return; }
  if(!confirm('Delete this product?')) return;
  products = products.filter(p=>p.id!==id);
  saveProducts();
  renderProductGallery();
  alert('✓ Product deleted');
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
    // Check if image is a valid dataURI
    if(cake.image && cake.image.startsWith('data:image')){
      img.src = cake.image;
    } else {
      img.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect fill="%23e5e7eb" width="100%25" height="100%25"/><text x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle" font-size="14" fill="%23999">🎂 ' + cake.name + '</text></svg>';
    }
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

    // EDIT & DELETE BUTTONS (ADMIN ONLY)
    if(currentAdmin){
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
    }

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
    // Check if image is a valid dataURI
    if(prod.image && prod.image.startsWith('data:image')){
      img.src = prod.image;
    } else {
      img.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect fill="%23e5e7eb" width="100%25" height="100%25"/><text x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle" font-size="14" fill="%23999">📦 ' + prod.name + '</text></svg>';
    }
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

    // EDIT & DELETE BUTTONS (ADMIN ONLY)
    if(currentAdmin){
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
    }

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
    authBtn.innerHTML = `👤 ${currentUser.name.split(' ')[0]} | Account ▼`;
    authBtn.onclick = ()=>{ showAccountMenu(); };
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
  
  toggleAdminButtons();
}

// ACCOUNT MENU DROPDOWN
function showAccountMenu(){
  const choice = confirm(`👤 ${currentUser.name}\n\n📧 ${currentUser.email}\n⭐ ${currentUser.loyaltyPoints} Points\n\nClick OK to go to Profile\nClick Cancel to Logout`);
  
  if(choice === true){
    // Go to profile
    goToProfile();
  } else if(choice === false){
    // User clicked Cancel - offer logout
    if(confirm('Logout now?')){
      doLogoutAndReload();
    }
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

function goToHome(){
  // Show all sections except profile/order-history
  document.querySelectorAll('section').forEach(s=> s.style.display = 'block');
  document.getElementById('profile-page').style.display = 'none';
  document.getElementById('order-history-page').style.display = 'none';
  document.querySelector('section').scrollIntoView({behavior:'smooth'});
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
  
  // Add default testimonials if none exist (these are DEMO only, no edit/delete)
  if(testimonials.length === 0){
    testimonials = [
      {name: 'Ram Sharma', rating: 5, text: 'Best bakery in Surkhet! Fresh cakes every time. Highly recommend! 🎂', isDemo: true},
      {name: 'Priya Thapa', rating: 5, text: 'Amazing quality and quick delivery. Their chocolate cake is to die for! 😋', isDemo: true},
      {name: 'Arjun KC', rating: 4.5, text: 'Great variety of products. Love their breads and pastries. Will order again!', isDemo: true},
      {name: 'Anjali Negi', rating: 5, text: 'Professional service and delicious food. Perfect for parties! 🎉', isDemo: true}
    ];
  }
  
  let html = '';
  testimonials.forEach((review, idx)=>{
    const stars = '⭐'.repeat(Math.round(review.rating)) + (review.rating % 1 ? '✨' : '');
    
    // Determine ownership - more lenient matching
    const isDemo = review.isDemo === true;
    const isLoggedIn = currentUser !== null && currentUser !== undefined;
    const nameMatches = currentUser && currentUser.name.trim().toLowerCase() === review.name.trim().toLowerCase();
    const userIdMatches = review.userId && currentUser && review.userId === currentUser.email;
    
    // Owner = name matches if logged in, OR userId matches
    const isOwner = isLoggedIn && (nameMatches || userIdMatches);
    const isAdmin = currentAdmin;
    
    // Can edit: only if owner of real reviews (not demo)
    const canEdit = isOwner && !isDemo;
    // Can delete: owner of real review, OR admin
    const canDelete = (isOwner && !isDemo) || isAdmin;
    
    // Display logic
    const isAnonymousReview = !review.userId && !isDemo; // User reviews without userId are anonymous
    
    html += `
      <div style="background:white;padding:1.5rem;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);position:relative;border-left:4px solid ${isOwner ? '#fbbf24' : isAnonymousReview ? '#d1d5db' : '#e5e7eb'}">
        <div style="margin-bottom:0.5rem;display:flex;justify-content:space-between;align-items:start">
          <span>${stars}</span>
          ${isOwner ? `<span style="background:#fbbf24;color:#000;padding:0.2rem 0.5rem;border-radius:4px;font-size:0.75rem;font-weight:bold">✓ YOUR REVIEW</span>` : isDemo ? `<span style="background:#10b981;color:white;padding:0.2rem 0.5rem;border-radius:4px;font-size:0.75rem;font-weight:bold">⭐ VERIFIED</span>` : isAnonymousReview ? `<span style="background:#d1d5db;color:#666;padding:0.2rem 0.5rem;border-radius:4px;font-size:0.75rem">ANONYMOUS</span>` : ''}
        </div>
        <p style="margin:0 0 1rem 0;font-style:italic;color:var(--text)">"${review.text}"</p>
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem">
          <p style="margin:0;font-weight:600;color:var(--primary)">— ${review.name}</p>
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
            ${canEdit ? `<button onclick="editTestimonial(${idx})" style="background:#3b82f6;color:white;border:none;padding:0.4rem 0.8rem;border-radius:4px;cursor:pointer;font-size:0.85rem;font-weight:600;transition:background 0.3s" onmouseover="this.style.background='#2563eb'" onmouseout="this.style.background='#3b82f6'">✏️ Edit</button>` : ''}
            ${canDelete ? `<button onclick="deleteTestimonial(${idx})" style="background:#ef4444;color:white;border:none;padding:0.4rem 0.8rem;border-radius:4px;cursor:pointer;font-size:0.85rem;font-weight:600;transition:background 0.3s" onmouseover="this.style.background='#dc2626'" onmouseout="this.style.background='#ef4444'">🗑️ Delete</button>` : ''}
          </div>
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
  if(!currentAdmin){ alert('❌ Only admin can add cakes'); return; }
  document.getElementById('cake-name').value = '';
  document.getElementById('cake-price').value = '';
  document.getElementById('cake-desc').value = '';
  document.getElementById('cake-photo').value = '';
  document.getElementById('add-cake-modal').dataset.editId = '';
  document.getElementById('add-cake-modal').querySelector('h3').textContent = 'Add New Cake';
  document.getElementById('add-cake-modal').classList.add('active');
}

function openEditCakeModal(cake){
  if(!currentAdmin){ alert('❌ Only admin can edit cakes'); return; }
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

  if(!name || !price){ alert('Name and price are required'); return; }

  let imageUri = null;
  if(photoInput.files && photoInput.files.length > 0){
    try {
      console.log('🔄 Converting cake image...');
      imageUri = await fileToDataUri(photoInput.files[0]);
      console.log('✓ Cake image converted successfully, URI length:', imageUri.length);
    } catch(error) {
      console.error('✗ Error converting image:', error);
      alert('Error uploading image: ' + error.message);
      return;
    }
  } else {
    console.log('ℹ️ No image selected for cake');
  }

  try {
    const editId = document.getElementById('add-cake-modal').dataset.editId;
    if(editId){
      console.log('🔄 Updating cake:', editId);
      updateCake(editId, name, price, desc, imageUri);
    } else {
      console.log('🔄 Adding new cake...');
      addCake(name, price, desc, imageUri);
    }
    
    console.log('✓ Cake saved. Total cakes:', cakes.length);
    renderCakeGallery();
    
    // Reset form
    document.getElementById('cake-name').value = '';
    document.getElementById('cake-price').value = '';
    document.getElementById('cake-desc').value = '';
    document.getElementById('cake-photo').value = '';
    
    // Close modal
    document.getElementById('add-cake-modal').classList.remove('active');
    
    alert('✓ Cake added successfully!');
  } catch(error) {
    console.error('✗ Error saving cake:', error);
    alert('Error saving cake: ' + error.message);
  }
}

// PRODUCT MODAL FUNCTIONS
function openAddProductModal(){
  if(!currentAdmin){ alert('❌ Only admin can add products'); return; }
  document.getElementById('product-name').value = '';
  document.getElementById('product-price').value = '';
  document.getElementById('product-desc').value = '';
  document.getElementById('product-photo').value = '';
  document.getElementById('add-product-modal').dataset.editId = '';
  document.getElementById('add-product-modal').querySelector('h3').textContent = 'Add New Product';
  document.getElementById('add-product-modal').classList.add('active');
}

function openEditProductModal(product){
  if(!currentAdmin){ alert('❌ Only admin can edit products'); return; }
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

  if(!name || !price){ alert('Name and price are required'); return; }

  let imageUri = null;
  if(photoInput.files && photoInput.files.length > 0){
    try {
      console.log('🔄 Converting product image...');
      imageUri = await fileToDataUri(photoInput.files[0]);
      console.log('✓ Product image converted successfully, URI length:', imageUri.length);
    } catch(error) {
      console.error('✗ Error converting image:', error);
      alert('Error uploading image: ' + error.message);
      return;
    }
  } else {
    console.log('ℹ️ No image selected for product');
  }

  try {
    const editId = document.getElementById('add-product-modal').dataset.editId;
    if(editId){
      console.log('🔄 Updating product:', editId);
      updateProduct(editId, name, price, desc, imageUri);
    } else {
      console.log('🔄 Adding new product...');
      addProduct(name, price, desc, imageUri);
    }

    console.log('✓ Product saved. Total products:', products.length);
    renderProductGallery();
    
    // Reset form
    document.getElementById('product-name').value = '';
    document.getElementById('product-price').value = '';
    document.getElementById('product-desc').value = '';
    document.getElementById('product-photo').value = '';
    
    // Close modal
    document.getElementById('add-product-modal').classList.remove('active');
    
    alert('✓ Product added successfully!');
  } catch(error) {
    console.error('✗ Error saving product:', error);
    alert('Error saving product: ' + error.message);
  }
}

// GALLERY MODAL FUNCTIONS
function openAddGalleryModal(){
  if(!currentAdmin){ alert('❌ Only admin can add gallery photos'); return; }
  document.getElementById('gallery-title').value = '';
  document.getElementById('gallery-desc').value = '';
  document.getElementById('gallery-photo').value = '';
  document.getElementById('add-gallery-modal').dataset.editId = '';
  document.getElementById('add-gallery-modal').querySelector('h3').textContent = 'Add Gallery Photo';
  document.getElementById('add-gallery-modal').classList.add('active');
}

function openEditGalleryModal(photo){
  if(!currentAdmin){ alert('❌ Only admin can edit gallery photos'); return; }
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

  if(!title){ alert('Title is required'); return; }

  let imageUri = null;
  if(photoInput.files && photoInput.files.length > 0){
    try {
      console.log('🔄 Converting gallery image...');
      imageUri = await fileToDataUri(photoInput.files[0]);
      console.log('✓ Gallery image converted successfully. Size:', imageUri.length, 'bytes');
    } catch(error){
      console.error('✗ Error converting image:', error);
      alert('Error uploading image: ' + error.message);
      return;
    }
  } else {
    console.log('ℹ️ No image selected for gallery');
  }

  try {
    const editId = document.getElementById('add-gallery-modal').dataset.editId;
    if(editId){
      console.log('🔄 Updating gallery photo:', editId);
      updateGalleryPhoto(editId, title, desc, imageUri);
    } else {
      console.log('🔄 Adding new gallery photo...');
      addGalleryPhoto(title, desc, imageUri);
    }

    console.log('✓ Photo saved. Total gallery photos:', galleryPhotos.length);
    
    // Render immediately
    renderGallery();
    console.log('✓ Gallery rendered successfully');
    
    // Reset form
    document.getElementById('gallery-title').value = '';
    document.getElementById('gallery-desc').value = '';
    document.getElementById('gallery-photo').value = '';
    
    // Close modal
    document.getElementById('add-gallery-modal').classList.remove('active');
    
    alert('✓ Photo added successfully!');
  } catch(error) {
    console.error('✗ Error saving photo:', error);
    alert('Error saving photo: ' + error.message);
  }
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

async function saveLogo(){
  const file = document.getElementById('logo-file').files[0];
  if(!file){ 
    alert('Please select a file'); 
    return;
  }
  
  try {
    console.log('🔄 Converting logo file to dataURI...');
    const uri = await fileToDataUri(file);
    console.log('✓ Logo converted successfully. Size:', uri.length, 'bytes');
    
    setLogo(uri);
    console.log('✓ Logo set and saved to localStorage');
    
    // Reset form
    document.getElementById('logo-file').value = '';
    
    // Close modal
    document.getElementById('logo-modal').classList.remove('active');
    
    alert('✓ Logo updated successfully!');
  } catch(error) {
    console.error('✗ Error saving logo:', error);
    alert('Error uploading logo: ' + error.message);
  }
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
    // Add sample gallery photos on first visit
    if(galleryPhotos.length === 0){
      addGalleryPhoto('Fresh Croissants', 'Golden, buttery croissants fresh from the oven every morning');
      addGalleryPhoto('Birthday Cakes', 'Custom designed cakes for your special celebrations');
      addGalleryPhoto('Pastry Display', 'Variety of fresh pastries and baked goods daily');
      addGalleryPhoto('Coffee & Cakes', 'Enjoy our premium coffee with freshly baked treats');
      galleryPhotos = JSON.parse(localStorage.getItem('amg_gallery_photos')) || [];
    }
  }catch(e){
    galleryPhotos = [];
  }
}

function saveGalleryPhotos(){
  try {
    localStorage.setItem('amg_gallery_photos', JSON.stringify(galleryPhotos));
    console.log('✓ Gallery photos saved to storage');
  } catch(error) {
    if(error.name === 'QuotaExceededError' || error.code === 22) {
      console.error('✗ Storage quota exceeded!');
      if(galleryPhotos.length > 10) {
        galleryPhotos = galleryPhotos.slice(-10);
        console.log('✓ Kept only 10 most recent gallery photos');
      }
      galleryPhotos.forEach(p => {
        if(p.image && p.image.length > 50000) p.image = null;
      });
      try {
        localStorage.setItem('amg_gallery_photos', JSON.stringify(galleryPhotos));
        alert('⚠️ Storage optimized! Kept 10 newest photos.');
      } catch(err2) {
        alert('❌ Storage full! Clear browser data.');
        throw err2;
      }
    } else throw error;
  }
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
  if(!currentAdmin){ alert('❌ Only admin can delete gallery photos'); return; }
  if(!confirm('Delete this photo?')) return;
  galleryPhotos = galleryPhotos.filter(p=>p.id!==id);
  saveGalleryPhotos();
  renderGallery();
  alert('✓ Photo deleted');
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
    gallery.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--muted);padding:2rem">No gallery photos yet. Click "+ Add Gallery Photo" to get started!</p>';
    return;
  }
  
  galleryPhotos.forEach(photo=>{
    const div = document.createElement('div');
    div.className = 'gallery-item';
    div.style.display = 'flex';
    div.style.flexDirection = 'column';
    div.style.position = 'relative';
    
    // IMAGE
    const img = document.createElement('img');
    // Use the photo.image directly if it exists (should be dataURL)
    if(photo.image && photo.image.startsWith('data:image')){
      img.src = photo.image;
    } else {
      // Fallback placeholder
      img.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="250"><rect fill="%23e5e7eb" width="100%25" height="100%25"/><text x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle" font-size="16" fill="%23999">📷 ' + (photo.title || 'No image') + '</text></svg>';
    }
    img.alt = photo.title;
    img.style.cursor = 'pointer';
    img.style.width = '100%';
    img.style.height = '200px';
    img.style.objectFit = 'cover';
    img.style.borderRadius = '10px';
    img.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
    
    div.appendChild(img);
    
    // TITLE
    const title = document.createElement('h4');
    title.textContent = photo.title;
    title.style.margin = '0.8rem 0 0.3rem 0';
    title.style.fontSize = '1rem';
    title.style.color = 'var(--primary)';
    title.style.fontWeight = '700';
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
      desc.style.lineHeight = '1.4';
      div.appendChild(desc);
    }
    
    // EDIT & DELETE BUTTONS (ADMIN ONLY)
    if(currentAdmin){
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
    }
    gallery.appendChild(div);
  });
}

// ============ VIDEO GALLERY ============
let videos = [];

function loadVideos(){
  const stored = localStorage.getItem('amg_videos');
  if(stored){
    return JSON.parse(stored);
  }
  // Sample videos on first load
  const sampleVideos = [
    {
      id: generateCakeId(),
      title: "How We Make Our Chocolate Cake",
      description: "Watch our chef prepare our famous chocolate cake from scratch!",
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      category: "tutorial",
      date: new Date().toISOString()
    }
  ];
  localStorage.setItem('amg_videos', JSON.stringify(sampleVideos));
  return sampleVideos;
}

function saveVideos(){
  localStorage.setItem('amg_videos', JSON.stringify(videos));
}

function addVideo(title, description, url, category){
  // Convert YouTube watch URL to embed URL if needed
  let embedUrl = url;
  if(url.includes('youtube.com/watch')){
    const videoId = url.split('v=')[1]?.split('&')[0];
    embedUrl = `https://www.youtube.com/embed/${videoId}`;
  } else if(url.includes('youtu.be/')){
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    embedUrl = `https://www.youtube.com/embed/${videoId}`;
  }
  
  const video = {
    id: generateCakeId(),
    title: title,
    description: description,
    url: embedUrl,
    category: category,
    date: new Date().toISOString()
  };
  videos.push(video);
  saveVideos();
  return video;
}

function deleteVideo(id){
  if(!currentAdmin){ alert('❌ Only admin can delete videos'); return; }
  if(!confirm('Delete this video?')) return;
  videos = videos.filter(v => v.id !== id);
  saveVideos();
  loadVideos();
  alert('✓ Video deleted');
}

function updateVideo(id, title, description, url, category){
  const video = videos.find(v => v.id === id);
  if(video){
    let embedUrl = url;
    if(url.includes('youtube.com/watch')){
      const videoId = url.split('v=')[1]?.split('&')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if(url.includes('youtu.be/')){
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
    
    video.title = title;
    video.description = description;
    video.url = embedUrl;
    video.category = category;
    saveVideos();
  }
}

function openAddVideoModal(){
  if(!currentAdmin){ alert('❌ Only admin can add videos'); return; }
  document.getElementById('add-video-modal').dataset.editId = '';
  document.getElementById('add-video-modal').querySelector('h3').textContent = 'Add Video';
  document.getElementById('video-title').value = '';
  document.getElementById('video-desc').value = '';
  document.getElementById('video-url').value = '';
  document.getElementById('video-category').value = 'tutorial';
  document.getElementById('add-video-modal').classList.add('active');
}

function openEditVideoModal(video){
  document.getElementById('add-video-modal').dataset.editId = video.id;
  document.getElementById('add-video-modal').querySelector('h3').textContent = 'Edit Video';
  document.getElementById('video-title').value = video.title;
  document.getElementById('video-desc').value = video.description;
  document.getElementById('video-url').value = video.url;
  document.getElementById('video-category').value = video.category;
  document.getElementById('add-video-modal').classList.add('active');
}

function saveVideo(){
  const title = document.getElementById('video-title').value.trim();
  const desc = document.getElementById('video-desc').value.trim();
  const url = document.getElementById('video-url').value.trim();
  const category = document.getElementById('video-category').value;
  
  if(!title || !url){
    alert('Please enter title and URL');
    return;
  }
  
  const editId = document.getElementById('add-video-modal').dataset.editId;
  if(editId){
    updateVideo(editId, title, desc, url, category);
  } else {
    addVideo(title, desc, url, category);
  }
  
  renderVideos();
  document.getElementById('add-video-modal').classList.remove('active');
}

function renderVideos(){
  const grid = document.getElementById('videos-grid');
  if(!grid) return;
  
  grid.innerHTML = '';
  
  if(videos.length === 0){
    grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--muted);padding:2rem">No videos yet. Click "+ Add Video" to get started!</p>';
    return;
  }
  
  videos.forEach(video => {
    const div = document.createElement('div');
    div.className = 'card';
    div.style.display = 'flex';
    div.style.flexDirection = 'column';
    
    // VIDEO PLAYER
    const player = document.createElement('div');
    player.style.position = 'relative';
    player.style.paddingBottom = '56.25%';
    player.style.height = '0';
    player.style.overflow = 'hidden';
    player.style.borderRadius = '8px';
    player.style.marginBottom = '1rem';
    
    const iframe = document.createElement('iframe');
    iframe.src = video.url;
    iframe.style.position = 'absolute';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '8px';
    iframe.setAttribute('allowFullscreen', '');
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
    
    player.appendChild(iframe);
    div.appendChild(player);
    
    // TITLE
    const title = document.createElement('h4');
    title.textContent = video.title;
    title.style.margin = '0 0 0.5rem 0';
    title.style.color = 'var(--primary)';
    title.style.fontSize = '1rem';
    div.appendChild(title);
    
    // CATEGORY BADGE
    const badge = document.createElement('span');
    badge.textContent = '🏷️ ' + video.category.replace('-', ' ');
    badge.style.display = 'inline-block';
    badge.style.fontSize = '0.75rem';
    badge.style.padding = '0.3rem 0.6rem';
    badge.style.backgroundColor = 'var(--accent)';
    badge.style.color = 'white';
    badge.style.borderRadius = '4px';
    badge.style.marginBottom = '0.5rem';
    badge.style.fontWeight = '600';
    div.appendChild(badge);
    
    // DESCRIPTION
    if(video.description){
      const desc = document.createElement('p');
      desc.className = 'desc';
      desc.textContent = video.description;
      desc.style.margin = '0.5rem 0';
      desc.style.fontSize = '0.9rem';
      desc.style.color = 'var(--muted)';
      desc.style.flex = '1';
      div.appendChild(desc);
    }
    
    // BUTTONS (ADMIN ONLY)
    if(currentAdmin){
      const actions = document.createElement('div');
      actions.style.display = 'flex';
      actions.style.gap = '0.5rem';
      actions.style.marginTop = '1rem';
      
      const editBtn = document.createElement('button');
      editBtn.className = 'edit-price';
      editBtn.textContent = '✏️ Edit';
      editBtn.type = 'button';
      editBtn.style.flex = '1';
      editBtn.addEventListener('click', () => openEditVideoModal(video));
      actions.appendChild(editBtn);
      
      const delBtn = document.createElement('button');
      delBtn.className = 'edit-price';
      delBtn.textContent = '🗑️ Delete';
      delBtn.type = 'button';
      delBtn.style.color = 'red';
      delBtn.style.flex = '1';
      delBtn.addEventListener('click', () => {
        if(confirm(`Delete "${video.title}"?`)){
          deleteVideo(video.id);
          renderVideos();
        }
      });
      actions.appendChild(delBtn);
      
      div.appendChild(actions);
    }
    grid.appendChild(div);
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

  // Cakes & Products & Cart & Gallery & Videos
  loadCakes();
  loadProducts();
  loadGalleryPhotos();
  loadVideos();
  renderCakeGallery();
  renderProductGallery();
  renderGallery();
  renderVideos();
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