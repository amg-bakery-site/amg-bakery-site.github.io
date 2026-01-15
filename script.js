// A.M.G. Bakery & Cafe - Dynamic Cake & Product Ordering System

let cart = [];
let cakes = [];
let products = [];
let searchQuery = '';

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
  window.location.href = `mailto:ordersamgbakery@gmail.com?subject=${subject}&body=${body}`;
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
});