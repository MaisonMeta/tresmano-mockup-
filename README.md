# TR3SMANO — editorial mockup
Open `index.html` (home), `shop.html` (catalogue), `product.html?p=<handle>` (product page; default = Albillo Mayor 2024).

- `js/products.js` – catalogue data (Shopify-product shaped). Swap for a Storefront API fetch.
- `js/config.js` – `TM_CONFIG.MODE` = mock | stripe | shopify, plus the `TM_CHECKOUT` hand-off stub.
- `assets/hero-loop.mp4` – 15 s caption-free cut of the brand film (2.7 MB); `assets/film.mp4` – full film, 720p (12 MB), loaded only when "Watch the film" is clicked.
- Product copy beyond what's on tresmano.com (tasting note, pairings, shipping text) is placeholder.
