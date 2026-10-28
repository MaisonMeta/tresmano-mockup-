# TR3SMANO — editorial mockup
Open `index.html` (home), `shop.html` (catalogue), `product.html?p=<handle>` (product page; default = Albillo Mayor 2024).

- `js/products.js` – catalogue data (Shopify-product shaped). Swap for a Storefront API fetch.
- `js/config.js` – `TM_CONFIG.MODE` = mock | stripe | shopify, plus the `TM_CHECKOUT` hand-off stub.
- `assets/hero-loop.mp4` – 15 s caption-free cut of the brand film (2.7 MB); `assets/film.mp4` – full film, 720p (12 MB), loaded only when "Watch the film" is clicked.
- Product copy beyond what's on tresmano.com (tasting note, pairings, shipping text) is placeholder.

## Admin POC (back office)
Run locally with clean URLs (like GitHub Pages): `python serve.py` in this folder, then open http://localhost:8765/ and http://localhost:8765/admin/

- `admin/` – dashboard (online vs in-store), products & stock, orders + in-store sale entry, tours + RSVPs, journal, inbox.
- Public side: `/tours`, `/journal`, `/contact`; the shop checkout creates a demo online order and decrements stock.
- `js/db.js` – mock database (localStorage, seeded). No auth, no server — replace with Shopify / Stripe / a real API.
- Custom Backend Demo by Maison Meta — https://maisonmeta.io
