# A.M.G. Bakery & Cafe — Static Site

This repository contains a simple static site for A.M.G. Bakery & Cafe (Home, Menu, About, Order, Contact). The site is client-side only and uses localStorage for cart and price overrides.

## What I added for you
- Placeholder images (SVG) in `images/`
- Editable product prices (persist in browser localStorage)
- Two order submission options:
  - Mail: opens user's email client to `orders@amg-bakery.com` with the order prefilled
  - Online submit: posts to a form endpoint (Formspree placeholder). Replace `FORMSPREE_ENDPOINT` in `script.js` with your actual endpoint.

## Replace placeholders
- To use online submission: sign up at https://formspree.io/ (or similar) and get your form endpoint (`https://formspree.io/f/<your-id>`). Then replace `FORMSPREE_ENDPOINT` in `script.js` with your endpoint.
- To use real photos: replace files in `images/` with real JPEG/PNG/SVG files named exactly like the product id (e.g., `bread.svg`, `donut.svg`) or edit `script.js` to point to your filenames.

## Deploy to GitHub Pages (recommended)
1. Create a GitHub repository (example: `amg-bakery-site`).
2. From your project folder (PowerShell):
   - git init
   - git add .
   - git commit -m "Initial site"
   - git branch -M main
   - git remote add origin https://github.com/<your-username>/amg-bakery-site.git
   - git push -u origin main
3. On GitHub: Settings → Pages → Choose branch: `main` / folder: `/ (root)` → Save.
4. After a minute or two your site should be live at: `https://<your-username>.github.io/amg-bakery-site/`.

If you want, I can prepare the repo (create it on GitHub) and push the site there for you — I will need one of the following:
- Your GitHub username and a personal access token (PAT) that has `repo` permissions (not recommended to share here unless you want me to act with it), or
- Add me as a collaborator on a repository you create and give me permission to push, or
- You can follow the above steps and I’ll help troubleshoot.

## Optional next steps I can help with
- Add a simple form admin or connect to a database for orders (requires server or serverless functions).
- Help you set up a custom domain and SSL.
- Add analytics or simple SEO improvements.

---
If you'd like I can continue and: (A) prepare a GitHub repo and give you exact commands to push, (B) walk you step-by-step via your terminal to publish, or (C) walk you through creating a Formspree form and wire it into the site—choose which option and I’ll proceed.