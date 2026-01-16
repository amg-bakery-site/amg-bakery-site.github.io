# A.M.G. Bakery & Cafe — Professional Web Platform

This is a feature-rich static site for A.M.G. Bakery & Cafe with user accounts, loyalty program, dynamic product management, and professional ordering system. All data persists in browser localStorage (no backend needed for MVP).

## ✨ Key Features (Phase 1 Complete)

### 👤 User Account System
- **Registration** with name, phone, email, password, address, birthday
- **Login/Logout** with secure password hashing (client-side, basic implementation)
- **Persistent login** across page reloads via localStorage
- **User profiles** showing account details, loyalty stats, member since date
- **Edit profile** to update phone, address, birthday anytime

### ⭐ Loyalty Program
- **Automatic points** awarded on every order: 1 point per Rs 100 spent
- **Real-time display** of loyalty points in header and profile
- **Order tracking** showing total spent, total orders, points earned per order
- **Birthday tracking** (captured at registration, ready for Phase 2 birthday rewards)

### 📋 Order History
- **Per-user order tracking** with Order ID, date, items, total, status
- **Order details** including delivery method, address, phone used
- **Points breakdown** showing points earned on each order
- **Empty state** messaging for new customers

### 🛒 Enhanced Ordering
- **Auto-prefill** delivery details for logged-in customers (name, phone, address)
- **Payment options**: Cash on Delivery, eSEWA, Bank Transfer
- **Special instructions** field for custom requests
- **Order confirmation** with loyalty points earned alert
- **Order email** sent to ordersamgbakery@gmail.com with full details

### 🎯 Quick Win Features
- **Today's Special banner** highlighting featured items with discount messaging
- **Popular Items** section showing most-loved products
- **Customer testimonials** (4 sample reviews, easily customizable)
- **Newsletter signup** in footer to build email list
- **Search functionality** to find cakes and products instantly

### 📸 Product Management
- **Dynamic cake gallery** with unlimited entries, edit/delete capabilities
- **Dynamic products** (breads, pastries, ice cream, etc.)
- **Dynamic photo gallery** with titles, descriptions, edit/delete
- **All photos** stored as base64 in localStorage

### 🎨 Professional Design
- **Color scheme**: Ocean Blue (#1E3A8A), Golden Wheat (#FBBF24), Coffee Brown (#78350F)
- **Responsive layout** that works on desktop and mobile
- **Smooth animations** and transitions
- **Modern UI** with gradients, shadows, hover effects
- **Sticky header** with search and auth buttons

---

## 🚀 How to Use

### First Time Setup
1. Open `index.html` in your browser
2. Click "👤 Login" button in header
3. Click "Create Account" to register
4. Fill in all required fields (name, phone, email, password, address, birthday)
5. Click "Create Account" — you'll be logged in automatically
6. You'll see "👤 [Your Name] | Account" and loyalty points button in header

### Adding Products
1. **Cakes**: Click "🎂 Custom Cakes Gallery" → "+ Add New Cake" → Fill details + upload photo
2. **Products**: Click "Other Bakery Products" → "+ Add Product" → Fill details + upload photo
3. **Gallery**: Click "📸 Gallery" → "+ Add Gallery Photo" → Add title, description, photo

### Placing Orders
1. Browse cakes or products
2. Click "Add" button on items (or search to find items)
3. Review your cart (right side of page)
4. Scroll to "Order Online" section
5. Your delivery details are pre-filled! Edit if needed
6. Choose delivery method (Delivery or Pickup)
7. Select payment method (COD, eSEWA, Bank Transfer)
8. Click "Send Order via Email" → Opens email client with order details
9. **You earn loyalty points automatically** when order is sent!

### Viewing Your Account
1. Click "👤 [Your Name] | Account" in header (top right)
2. See your profile with:
   - Account details (name, email, phone, member since)
   - Total loyalty points, total orders, total spent
   - Edit your phone, address, birthday anytime
3. Click "📋 View Order History" to see all past orders with details

### Earning Loyalty Points
- **Automatic**: Every order awards points automatically
- **Formula**: Points = Floor(Total Amount / 100)
- **Example**: Order of Rs 550 = 5 loyalty points
- **Visible**: Check header "⭐ [Points] Points" or go to profile

### Newsletter
- Enter email in footer "📧 Subscribe to Our Newsletter"
- Click "Subscribe" to join
- Email saved for future marketing features

---

## 📁 File Structure

```
My-Coding-Journey/
├── index.html          # Main page with all sections
├── script.js           # Core logic (1284 lines)
│   ├── Auth system
│   ├── Product management
│   ├── Cart & order logic
│   ├── Profile & history
│   ├── Search & filters
│   └── UI interactions
├── style.css           # Professional styling
├── README.md           # Documentation
└── images/             # Photo storage
```

## 🔐 Security Notes

⚠️ **Current Implementation**: Client-side authentication with localStorage
- ✓ Good for: MVP, testing, local development, static hosting
- ✗ Not suitable for: Production with sensitive data, payment processing
- 🔒 Password hashing: Basic (client-side only — NOT cryptographically secure)

**For Production**: Replace with:
1. Backend API (Node.js, Django, Python, etc.)
2. Proper password hashing (bcrypt, Argon2, scrypt)
3. HTTPS only
4. Database (PostgreSQL, MongoDB, etc.)
5. Real payment integration (Khalti, eSEWA backend)
6. User authentication tokens (JWT, sessions)

---

## 🔄 Data Storage (localStorage)

All data saved automatically in browser:
- `amg_currentUser` — Logged-in user details (no password)
- `amg_users` — All registered users database
- `amg_cakes` — Cake products
- `amg_products` — Other products
- `amg_gallery_photos` — Gallery items
- `amg_cart` — Shopping cart
- `amg_newsletter` — Newsletter subscribers

**Note**: Data only persists in THIS browser on THIS computer. Clear browser data = lose all stored data.

---

## 🎯 Phase 2 Roadmap (Coming Soon)

### Marketing & Notifications
- ✓ Newsletter signup (ready)
- ⏳ Email notifications (setup needed)
- ⏳ WhatsApp integration (API needed)
- ⏳ SMS notifications (API needed)
- ⏳ Birthday reward messages

### Advanced Features
- ⏳ Payment integrations (Khalti, Fonepay)
- ⏳ Admin dashboard (order management, inventory, analytics)
- ⏳ Coupon/discount codes
- ⏳ Referral program
- ⏳ PWA/mobile app features

### Backend Setup
- ⏳ Database migration
- ⏳ Real authentication
- ⏳ Order confirmation emails
- ⏳ Payment processing
- ⏳ Admin controls

---

## 🛠️ Installation & Deployment

### Local Development
1. Clone or download this repository
2. Open `index.html` in any modern browser (Chrome, Firefox, Safari, Edge)
3. No server needed — works completely offline!
4. All data saves to your browser's localStorage

### Deploy to GitHub Pages (Free & Easy)
1. Create GitHub account (if you don't have one)
2. Create new repository named `amg-bakery-site`
3. Upload these files to the repository
4. Go to Settings → Pages → Select `main` branch → Save
5. Your site goes live at: `https://yourusername.github.io/amg-bakery-site/`

### Deploy to Netlify (Also Free)
1. Sign up at netlify.com
2. Drag and drop this folder onto Netlify
3. Site goes live immediately with custom domain option

### Deploy to Custom Domain
1. Buy domain from GoDaddy, Namecheap, etc.
2. Point domain to GitHub Pages or Netlify
3. Enable HTTPS (automatic with GitHub Pages/Netlify)

---

## 📞 Contact & Location

**A.M.G. Bakery & Cafe**
- 📍 Pipira chowk, Birendranagar, Surkhet
- 📱 9848551921 / 9826542784
- 📧 ordersamgbakery@gmail.com

---

## 📝 License & Credits

Created with ❤️ for A.M.G. Bakery & Cafe using HTML5, CSS3, and JavaScript.

---

## 🤝 Support & Customization

To customize:
- **Colors**: Edit CSS variables in `style.css` (--primary, --accent, --secondary)
- **Products**: Add via UI (no code changes needed!)
- **Photos**: Use the photo upload feature (stored in browser)
- **Text**: Edit HTML content directly

---

## ✅ Checklist for Going Live

- [ ] Add 5-10 sample cakes with real photos
- [ ] Add 5-10 sample products with real photos
- [ ] Add 5-10 gallery photos with descriptions
- [ ] Test registration → login → order flow
- [ ] Test cart, search, filters
- [ ] Test order history & loyalty points
- [ ] Set up email forwarding for ordersamgbakery@gmail.com
- [ ] Deploy to GitHub Pages or Netlify
- [ ] Test on mobile devices
- [ ] Share link on social media

Done! ✨ Your professional bakery platform is ready to use.
