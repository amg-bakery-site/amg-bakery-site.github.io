// AMG Bakery - cart with inline product images and editable prices
const PRODUCTS = [
  { id: 'bread', name: 'Bread', price: 50, color:'#F2D1C9' },
  { id: 'pauroti', name: 'Pauroti', price: 30, color:'#F7E5C9' },
  { id: 'donut', name: 'Donut (1 packet)', price: 70, color:'#FDEBD9' },
  { id: 'muffin', name: 'Muffin (1 packet)', price: 100, color:'#FFF1E6' },
  { id: 'cherrycake', name: 'Cherry Cake', price: 45, color:'#FFEFF2' },
  { id: 'creamroll', name: 'Cream Roll', price: null, color:'#F6EFE6' },
  { id: 'coconutroll', name: 'Coconut Roll', price: null, color:'#EEF7F3' },
  { id: 'bunburger', name: 'Bun Burger', price: null, color:'#F6ECD7' },
  { id: 'birthday', name: 'Birthday / Celebration Cake (custom)', price: null, color:'#FBEFF2' }
];

let cart = [];

function formatPrice(n){ return n==null ? 'Contact' : `Rs ${n}` }

function getPrice(id){
  const overrides = JSON.parse(localStorage.getItem('amg_price_overrides')||'{}');
  if(overrides[id] !== undefined){
    const v = overrides[id];
    return v===null? null : Number(v);
  }
  const p = PRODUCTS.find(x=>x.id===id);
  return p? p.price : null;
}

function setPriceOverride(id, value){
  const overrides = JSON.parse(localStorage.getItem('amg_price_overrides')||'{}');
  overrides[id] = value; // can be null
  localStorage.setItem('amg_price_overrides', JSON.stringify(overrides));
}

function productSVGData(name, color, id){
  // Prefer a real image in /images/{id}.svg if it exists, otherwise use generated SVG
  const imagePath = `images/${id}.svg`;
  // We'll attempt to load it by returning the path; browsers will 404 if not present, and JS fallback will handle it.
  return imagePath || (()=>{
    const text = name.split(' ').map(w=>w[0]).slice(0,2).join('');
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='100%' height='100%' fill='${color}' rx='12'/><text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' font-family='Poppins, Arial' font-size='40' fill='#8B5E3C'>${text}</text></svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  })();
}

function renderMenu(){
  const grid = document.getElementById('menu-grid'); grid.innerHTML='';
  PRODUCTS.forEach(p=>{
    const card = document.createElement('div'); card.className='card';
    const img = document.createElement('img'); img.className='product-img'; img.alt = p.name;
    // Try loading /images/{id}.svg first. If it fails, fall back to generated svg data
    img.src = `images/${p.id}.svg`;
    img.addEventListener('error', ()=> { img.src = productSVGData(p.name, p.color || '#fff', p.id) });
    card.appendChild(img);

    const h = document.createElement('h3'); h.textContent = p.name; card.appendChild(h);

    const priceRow = document.createElement('div'); priceRow.className='price-row';
    const price = document.createElement('div'); price.className='price'; price.dataset.id = p.id; price.textContent = formatPrice(getPrice(p.id));
    priceRow.appendChild(price);

    const edit = document.createElement('button'); edit.className='edit-price'; edit.textContent='Edit price';
    edit.addEventListener('click', ()=>{
      const current = getPrice(p.id);
      const val = prompt('Enter new price (leave empty for Contact):', current==null? '': current);
      if(val === null) return; // cancelled
      const trimmed = val.trim();
      if(trimmed === ''){
        setPriceOverride(p.id, null);
      } else {
        const num = Number(trimmed);
        if(Number.isNaN(num) || num < 0){ alert('Enter a valid number or leave empty for Contact'); return }
        setPriceOverride(p.id, Math.round(num));
      }
      // update UI
      document.querySelectorAll('.price').forEach(el=>{ if(el.dataset.id === p.id) el.textContent = formatPrice(getPrice(p.id)) });
      // if item in cart update prices
      cart.forEach(ci=>{ if(ci.id===p.id) ci.price = getPrice(p.id); }); saveCart(); updateCartUI();
      // re-enable/disable add button according to price
      renderMenu();
    });
    priceRow.appendChild(edit);

    card.appendChild(priceRow);

    const actions = document.createElement('div'); actions.className='actions';
    const add = document.createElement('button'); add.className='btn primary'; add.textContent='Add';
    add.disabled = getPrice(p.id)==null;
    add.addEventListener('click', ()=> addToCart(p.id));
    actions.appendChild(add);

    if(getPrice(p.id)==null){ const note = document.createElement('small'); note.className='muted'; note.textContent='Contact for price'; actions.appendChild(note); }

    card.appendChild(actions);
    grid.appendChild(card);
  })
}

function addToCart(id){
  const price = getPrice(id);
  if(price==null){ alert('Please contact us for pricing and custom cakes.'); return }
  const prod = PRODUCTS.find(p=>p.id===id);
  const found = cart.find(ci=>ci.id===id);
  if(found) found.qty++;
  else cart.push({id:id, name:prod.name, price:price, qty:1});
  saveCart(); updateCartUI();
}

function saveCart(){ localStorage.setItem('amg_cart', JSON.stringify(cart)); }
function loadCart(){ try{ cart = JSON.parse(localStorage.getItem('amg_cart')) || [] }catch(e){ cart = [] } }

function updateCartUI(){
  const count = cart.reduce((s,i)=>s+i.qty,0);
  document.getElementById('cart-count').textContent = count;
  const list = document.getElementById('cart-items'); list.innerHTML='';
  if(cart.length===0){ document.querySelector('#cart .muted').style.display='block'; document.getElementById('cart-summary').hidden=true; return }
  document.querySelector('#cart .muted').style.display='none';
  cart.forEach(item=>{
    const li = document.createElement('li'); li.className='cart-item';
    li.innerHTML = `<div>${item.name} <small class="muted">x${item.qty}</small></div><div>${formatPrice(item.price*item.qty)} <button data-id="${item.id}" class="btn outline small remove">Remove</button></div>`;
    list.appendChild(li);
  });
  document.getElementById('cart-summary').hidden=false;
  const subtotal = cart.reduce((s,i)=>s + i.price * i.qty,0);
  document.getElementById('cart-subtotal').textContent = `Rs ${subtotal}`;
}

function removeFromCart(id){ cart = cart.filter(i=>i.id!==id); saveCart(); updateCartUI(); }
function clearCart(){ cart=[]; saveCart(); updateCartUI(); }

function sendOrder(){
  if(cart.length===0){ alert('Your cart is empty.'); return }
  const name = document.getElementById('cust-name').value.trim();
  const phone = document.getElementById('cust-phone').value.trim();
  if(!name || !phone){ alert('Please enter name and phone.'); return }
  const address = document.getElementById('cust-address').value.trim();
  const method = document.getElementById('cust-method').value;
  const notes = document.getElementById('cust-notes').value.trim();

  const lines = [];
  lines.push(`A.M.G. Bakery & Cafe - New Order`);
  lines.push(`Name: ${name}`);
  lines.push(`Phone: ${phone}`);
  lines.push(`Method: ${method}`);
  if(address) lines.push(`Address: ${address}`);
  lines.push('');
  lines.push('Items:');
  cart.forEach(i=> lines.push(`- ${i.name} x${i.qty} = Rs ${i.price*i.qty}`));
  const subtotal = cart.reduce((s,i)=>s + i.price * i.qty,0);
  lines.push('');
  lines.push(`Subtotal: Rs ${subtotal}`);
  if(notes){ lines.push(''); lines.push(`Notes: ${notes}`) }
  lines.push('');
  lines.push('Thank you! Please confirm via phone if needed: 9848551921 / 9826542784');

  const body = encodeURIComponent(lines.join('\n'));
  const subject = encodeURIComponent('Order from A.M.G. Bakery & Cafe');
  // Open mail client to bakery email (placeholder)
  window.location.href = `mailto:orders@amg-bakery.com?subject=${subject}&body=${body}`;
}

// Send order online via a form endpoint (Formspree or similar). Replace FORMSPREE_ENDPOINT with your form URL.
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/{your-form-id}'; // <- replace {your-form-id}

async function sendOrderOnline(){
  if(cart.length===0){ alert('Your cart is empty.'); return }
  const name = document.getElementById('cust-name').value.trim();
  const phone = document.getElementById('cust-phone').value.trim();
  if(!name || !phone){ alert('Please enter name and phone.'); return }
  const address = document.getElementById('cust-address').value.trim();
  const method = document.getElementById('cust-method').value;
  const notes = document.getElementById('cust-notes').value.trim();

  const payload = {
    source: 'GitHub Pages - AMG Bakery',
    name, phone, address, method, notes,
    items: cart.map(i=>({id:i.id, name:i.name, qty:i.qty, price:i.price})),
    subtotal: cart.reduce((s,i)=>s+i.qty*i.price,0)
  };

  if(FORMSPREE_ENDPOINT.includes('{your-form-id}')){
    alert('Online submission endpoint not configured. Please update FORMSPREE_ENDPOINT in script.js with your Formspree form id or use email submission.');
    return;
  }

  try{
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)
    });
    if(res.ok){ alert('Order submitted successfully. We will contact you shortly.'); clearCart(); }
    else { alert('Failed to submit order online. Please try email or call us.'); }
  }catch(e){ console.error(e); alert('Network error sending order. Please try email or call.'); }
}

// wire the new button
window.addEventListener('DOMContentLoaded', ()=>{
  // existing wiring...
  document.getElementById('send-order-online').addEventListener('click', ()=> sendOrderOnline());
});

// Event wiring
window.addEventListener('DOMContentLoaded', ()=>{
  renderMenu(); loadCart(); updateCartUI();
  document.getElementById('cart-items').addEventListener('click', e=>{ if(e.target.classList.contains('remove')){ const id = e.target.getAttribute('data-id'); removeFromCart(id); } });
  document.getElementById('clear-cart').addEventListener('click', ()=> clearCart());
  document.getElementById('send-order').addEventListener('click', ()=> sendOrder());
  document.querySelectorAll('.site-nav a, .order-link, .btn.outline').forEach(a=> a.addEventListener('click', e=>{ if(a.hash){ e.preventDefault(); document.querySelector(a.hash).scrollIntoView({behavior:'smooth'}); } }));
});