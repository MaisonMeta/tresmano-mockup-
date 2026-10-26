/* TR3SMANO mockup — shared behaviour: chrome injection, cart, reveals, lazy media */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const C = window.TM_CONFIG, P = window.PRODUCTS, V = window.VARIANTS;
  const fmt = n => new Intl.NumberFormat(C.locale, { style:'currency', currency:C.currency, minimumFractionDigits: n % 1 ? 2 : 0 }).format(n);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const page = document.body.dataset.page || 'home';
  const byId = id => P.find(p => p.id === id);

  /* ── chrome ── */
  const nav = [['the-wine','The Wine','index.html#wines'],['vineyard','The Vineyard','index.html#vineyard'],['winery','The Winery','index.html#winery'],['history','Our History','index.html#film'],['shop','Shop','shop.html'],['visit','Visit Us','index.html#visit'],['contact','Contact','#contact']];
  const link = n => `<a href="${n[2]}" ${page===n[0]?'aria-current="page"':''}>${n[1]}</a>`;
  const navL = nav.slice(0,4).map(link).join(''), navR = nav.slice(4).map(link).join('');
  const lightTop = document.body.dataset.header === 'light';
  document.body.insertAdjacentHTML('afterbegin', `
  <header class="site-header ${lightTop?'on-light':''}" id="header">
    <nav class="nav" aria-label="Main">${navL}</nav>
    <a class="logo" href="index.html" aria-label="Tr3smano — home">
      <img class="light-logo" src="assets/logo_tr3smanox2.png" alt="TR3SMANO" width="274" height="25">
      <img class="dark-logo" src="assets/logo_tr3smano-positivox2.png" alt="" width="274" height="25">
    </a>
    <div class="header-tools">
      <nav class="nav" aria-label="Secondary" style="gap:clamp(14px,1.8vw,28px)">${navR}</nav>
      <div class="lang" aria-label="Language"><a class="on" href="#">EN</a><a href="#">ES</a><a href="#">DE</a><a href="#">中文</a></div>
      <button class="cart-btn" id="cartBtn" aria-label="Open cart"><span class="cart-label">Cart</span><span class="cart-count" id="cartCount">0</span></button>
      <button class="burger" id="burger" aria-label="Menu"><span></span><span></span></button>
    </div>
  </header>
  <div class="mobile-menu" id="mobileMenu">${nav.map(n=>`<a href="${n[2]}">${n[1]}</a>`).join('')}</div>
  <div class="scrim" id="scrim"></div>
  <aside class="drawer" id="drawer" aria-label="Cart" aria-hidden="true">
    <div class="drawer-head"><h3>Your cart</h3><button id="cartClose">Close ✕</button></div>
    <div class="ship-bar"><span id="shipMsg"></span><div class="track"><i id="shipBar"></i></div></div>
    <div class="drawer-body" id="cartBody"></div>
    <div class="drawer-foot" id="cartFoot"></div>
  </aside>
  <div class="toast" id="toast" role="status"></div>`);

  const footerHtml = `
  <section class="news" id="contact">
    <div class="wrap" data-reveal>
      <span class="eyebrow">Newsletter · Mailchimp</span>
      <h2>Letters from <em>the vineyard</em></h2>
      <p>Harvest notes, new releases and invitations to the winery. A few times a year, never more.</p>
      <form id="newsForm"><input type="email" required placeholder="Your email address" aria-label="Email"><button>Subscribe <span class="arrow"></span></button></form>
    </div>
  </section>
  <footer class="footer">
    <div class="wrap">
      <div class="footer-top">
        <div class="brandcol"><img class="lazy" loading="lazy" src="assets/logo_tr3smanox2.png" alt="TR3SMANO" width="274" height="25"><p>We honour our origin by dedicating time and heart to create unique experiences. Ribera del Duero · Denominación de Origen.</p></div>
        <div><h4>Explore</h4><ul><li><a href="index.html#wines">The Wine</a></li><li><a href="index.html#vineyard">The Vineyard</a></li><li><a href="index.html#winery">The Winery</a></li><li><a href="index.html#film">Our History</a></li></ul></div>
        <div><h4>Shop</h4><ul><li><a href="shop.html">All wines</a></li><li><a href="shop.html?cat=collection">Collections</a></li><li><a href="shop.html?cat=experience">Experiences</a></li><li><a href="#">Gift cards</a></li><li><a href="#">Club Milla</a></li></ul></div>
        <div><h4>Visit</h4><ul><li><a href="index.html#visit">Tours &amp; tastings</a></li><li><a href="#">Private events</a></li><li><a href="#">Find a retailer</a></li><li><a href="#">hello@tresmano.com</a></li></ul></div>
      </div>
    </div>
    <div class="footer-word" aria-hidden="true">TR3SMANO</div>
    <div class="wrap"><div class="footer-bottom">
      <div class="logos"><img class="lazy" loading="lazy" src="assets/logo-wine-in-moderation.png" alt="Wine in Moderation"><img class="lazy" loading="lazy" src="assets/LOGO-NOS-IMPULSA-BODEGA-TRESMANO.png" alt="Nos impulsa"><img class="lazy" loading="lazy" src="assets/LOGO_ICECYLJUNTAC_CYL-BODEGA-TRESMANO.png" alt="ICE · Junta de Castilla y León"></div>
      <div>© 2026 Bodega Tresmano · <a href="#">Legal</a> · <a href="#">Privacy</a> · <a href="#">Cookies</a> · <a href="#">Terms of sale</a></div>
    </div></div>
  </footer>`;
  const fmount = $('#footer-mount'); if (fmount) fmount.outerHTML = footerHtml;

  /* ── header behaviour ── */
  const header = $('#header'); let lastY = 0;
  const onScroll = () => {
    const y = scrollY;
    header.classList.toggle('is-solid', y > 50);
    const hide = y > lastY && y > 500 && !document.body.classList.contains('cart-open') && !document.body.classList.contains('menu-open');
    header.classList.toggle('is-hidden', hide);
    document.body.classList.toggle('header-hidden-state', hide);
    lastY = y;
    if (!reduce) $$('[data-parallax]').forEach(el => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -100 || r.top > innerHeight + 100) return;
      el.style.transform = `translate3d(0,${((r.top + r.height/2) - innerHeight/2) * parseFloat(el.dataset.parallax)}px,0)`;
    });
  };
  addEventListener('scroll', () => requestAnimationFrame(onScroll), { passive:true }); onScroll();
  $('#burger').onclick = () => document.body.classList.toggle('menu-open');
  $$('#mobileMenu a').forEach(a => a.addEventListener('click', () => document.body.classList.remove('menu-open')));

  /* ── toast ── */
  let tt; const toast = msg => { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 2600); };

  /* ── cart ── */
  const KEY = 'tm-cart-v1';
  let cart = []; try { cart = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} };
  const unit = (p, v) => +(p.price * V[v].n * (1 - V[v].off)).toFixed(2);
  const isWine = p => !['experience'].includes(p.cat);
  const open = on => { document.body.classList.toggle('cart-open', on); $('#drawer').setAttribute('aria-hidden', !on); };
  function add(id, variant = 'x1', qty = 1, openDrawer = true) {
    const l = cart.find(c => c.id === id && c.variant === variant);
    l ? l.qty += qty : cart.push({ id, variant, qty });
    save(); render(); const c = $('#cartCount'); c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');
    if (openDrawer) open(true);
  }
  function render() {
    const body = $('#cartBody'), foot = $('#cartFoot');
    const count = cart.reduce((s, l) => s + l.qty, 0);
    $('#cartCount').textContent = count;
    let sub = 0;
    body.innerHTML = cart.length ? cart.map((l, i) => {
      const p = byId(l.id); if (!p) return ''; const u = unit(p, l.variant); sub += u * l.qty;
      return `<div class="line-item" style="--d:${i*.05}s"><div class="thumb"><img src="${p.img}" alt="" style="${p.imgCover?'object-fit:cover;padding:0;mix-blend-mode:normal':''}"></div>
        <div><h4>${p.title} ${p.vintage||''}</h4><small>${isWine(p)?V[l.variant].label:p.sub}</small>
        <div class="qty"><button data-q="-1" data-i="${i}" aria-label="Less">−</button><span>${l.qty}</span><button data-q="1" data-i="${i}" aria-label="More">+</button></div>
        <button class="rm" data-rm="${i}">Remove</button></div><div class="price">${fmt(u * l.qty)}</div></div>`;
    }).join('') : `<div class="drawer-empty"><h4>Nothing here yet</h4><p>Begin with a bottle from the vineyard.</p><p style="margin-top:28px"><a class="link" href="shop.html">Browse the shop <span class="arrow"></span></a></p></div>`;
    foot.style.display = cart.length ? '' : 'none';
    foot.innerHTML = `<div class="sub-row"><span>Subtotal</span><b>${fmt(sub)}</b></div><small>IVA included · shipping calculated at checkout</small>
      <button class="btn btn--solid btn--block" id="checkoutBtn">Checkout <span class="arrow"></span></button>
      <div class="pay"><span>Stripe</span>·<span>Apple Pay</span>·<span>Visa</span>·<span>Mastercard</span></div>`;
    const left = Math.max(0, C.freeShippingFrom - sub);
    $('#shipMsg').innerHTML = left ? `You are <b>${fmt(left)}</b> away from free shipping` : `<b>Free shipping</b> unlocked ✦`;
    $('#shipBar').style.width = Math.min(100, sub / C.freeShippingFrom * 100) + '%';
    $('#checkoutBtn').onclick = () => window.TM_CHECKOUT(cart.map(l => { const p = byId(l.id); return { id:l.id, variant:l.variant, qty:l.qty, unit:unit(p,l.variant), title:p.title }; }));
  }
  $('#cartBody').addEventListener('click', e => {
    const q = e.target.closest('[data-q]'), r = e.target.closest('[data-rm]');
    if (q) { const l = cart[+q.dataset.i]; l.qty += +q.dataset.q; if (l.qty < 1) cart.splice(+q.dataset.i, 1); save(); render(); }
    if (r) { cart.splice(+r.dataset.rm, 1); save(); render(); }
  });
  $('#cartBtn').onclick = () => open(true); $('#cartClose').onclick = () => open(false); $('#scrim').onclick = () => open(false);
  addEventListener('keydown', e => { if (e.key === 'Escape') { open(false); document.body.classList.remove('menu-open'); closeModal(); } });
  render();
  const nf = $('#newsForm'); if (nf) nf.onsubmit = e => { e.preventDefault(); toast('Thank you — welcome to the vineyard ✦'); nf.reset(); };

  /* ── product card template (shop + home + related) ── */
  function card(p, i = 0) {
    const cls = (c) => c ? 'cover' : 'main';
    return `<article class="pcard" data-cat="${p.cat}" style="--d:${Math.min(i,11)*.05}s">
      <a class="pcard-media ph" href="product.html?p=${p.handle}" aria-label="${p.title} ${p.vintage||''}">
        ${p.badge ? `<span class="pcard-badge ${p.badge==='Limited'||p.badge==='New vintage'?'copper':''}">${p.badge}</span>` : ''}
        <img class="lazy main ${p.imgCover?'cover':''}" loading="lazy" decoding="async" src="${p.img}" alt="${p.title} ${p.vintage||''}">
        <img class="lazy alt ${p.altCover?'cover':''}" loading="lazy" decoding="async" src="${p.alt}" alt="">
        <button class="quick-add" data-add="${p.id}" onclick="event.preventDefault()">Quick add — ${fmt(p.price)}</button>
      </a>
      <div class="pcard-info"><h3><a href="product.html?p=${p.handle}">${p.title} <span class="serif-i" style="color:var(--copper)">${p.vintage||''}</span></a><span class="sub">${p.sub}</span></h3><span class="price">${fmt(p.price)}</span></div>
    </article>`;
  }
  document.addEventListener('click', e => { const a = e.target.closest('[data-add]'); if (a) { e.preventDefault(); add(a.dataset.add); } });

  /* ── lazy images: fade in on decode ── */
  function hookLazy(root = document) {
    $$('img.lazy:not([data-h])', root).forEach(img => {
      img.dataset.h = 1;
      const done = () => { img.classList.add('loaded'); const ph = img.closest('.ph'); if (ph) ph.classList.add('done'); };
      img.complete && img.naturalWidth ? done() : (img.addEventListener('load', done), img.addEventListener('error', done));
    });
  }

  /* ── reveals + split headlines ── */
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold:.12, rootMargin:'0px 0px -6% 0px' });
  function hookReveal(root = document) {
    $$('.split:not([data-s])', root).forEach(el => {
      el.dataset.s = 1; let i = 0;
      const walk = n => [...n.childNodes].forEach(c => {
        if (c.nodeType === 3) {
          const frag = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(t => { if (!t) return; if (/^\s+$/.test(t)) frag.append(' '); else { const w = document.createElement('span'); w.className = 'w'; w.innerHTML = `<span style="--i:${i++}">${t}</span>`; frag.append(w); } });
          c.replaceWith(frag);
        } else if (c.nodeType === 1 && c.tagName !== 'BR') walk(c);
      });
      walk(el); io.observe(el);
    });
    $$('[data-reveal]:not([data-o])', root).forEach(el => { el.dataset.o = 1; io.observe(el); });
  }

  /* ── modal film (lazy, loads only on demand) ── */
  let modal;
  function openFilm() {
    if (!modal) { modal = document.createElement('div'); modal.className = 'modal';
      modal.innerHTML = `<button class="modal-close">Close ✕</button><video controls playsinline preload="none" poster="assets/hero-poster.jpg"><source src="assets/film.mp4" type="video/mp4"></video>`;
      document.body.append(modal); modal.addEventListener('click', e => { if (e.target !== modal.querySelector('video')) closeModal(); }); }
    modal.classList.add('open'); const v = modal.querySelector('video'); v.play().catch(() => {});
  }
  function closeModal() { if (modal && modal.classList.contains('open')) { modal.classList.remove('open'); modal.querySelector('video').pause(); } }
  document.addEventListener('click', e => { if (e.target.closest('[data-film]')) { e.preventDefault(); openFilm(); } });

  /* ── draggable horizontal scrollers ── */
  function hookDrag(root = document) {
    $$('.hscroll', root).forEach(s => {
      if (s.dataset.d) return; s.dataset.d = 1; let down = false, x0 = 0, l0 = 0, moved = 0;
      s.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; moved = 0; x0 = e.clientX; l0 = s.scrollLeft; s.classList.add('dragging'); });
      addEventListener('pointermove', e => { if (!down) return; moved = Math.abs(e.clientX - x0); s.scrollLeft = l0 - (e.clientX - x0); });
      addEventListener('pointerup', () => { down = false; s.classList.remove('dragging'); });
      const bar = s.parentElement.querySelector('.h-prog i');
      if (bar) { const u = () => { const m = s.scrollWidth - s.clientWidth; const w = Math.max(10, s.clientWidth / s.scrollWidth * 100); bar.style.width = w + '%'; bar.style.transform = `translateX(${m ? s.scrollLeft / m * (100 / w * 100 - 100) : 0}%)`; }; s.addEventListener('scroll', u, { passive:true }); u(); addEventListener('load', u); }
    });
  }

  window.TM = { add, fmt, toast, card, hookLazy, hookReveal, hookDrag, byId, unit, open, reduce, isWine };
  document.dispatchEvent(new Event('tm-ready'));
  hookLazy(); hookReveal(); hookDrag();
})();
