/* Commerce integration switchboard.
   MODE 'mock'    → this mockup (cart in localStorage, checkout shows a toast)
   MODE 'stripe'  → POST cart to your server → returns a Stripe Checkout Session URL
   MODE 'shopify' → Shopify Storefront API cart → redirect to cart.checkoutUrl            */
window.TM_CONFIG = {
  MODE: 'mock',
  currency: 'EUR',
  locale: 'en-GB',
  freeShippingFrom: 150,           // € — mock threshold
  stripe:  { endpoint: '/api/checkout' },                                  // e.g. Netlify/Vercel function
  shopify: { domain: 'your-store.myshopify.com', token: 'STOREFRONT_TOKEN' }
};

/* Called by the cart drawer + "Buy now". `lines` = [{id, variant, qty, unit, title}] */
window.TM_CHECKOUT = async function (lines) {
  const C = window.TM_CONFIG;
  if (C.MODE === 'stripe') {
    const r = await fetch(C.stripe.endpoint, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ lines }) });
    const { url } = await r.json();            // server creates stripe.checkout.sessions.create(...)
    return (location.href = url);
  }
  if (C.MODE === 'shopify') {
    /* cartCreate mutation with merchandiseId per line, then: location.href = cart.checkoutUrl */
  }
  window.TM.toast('Mock checkout — Stripe / Shopify hand-off happens here');
};
