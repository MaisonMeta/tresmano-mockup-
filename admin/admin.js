/* TR3SMANO admin POC — shell + helpers. Requires ../js/products.js and ../js/db.js first. */
(function () {
  const D = window.TM_DB, db = D.db;
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const eur = n => new Intl.NumberFormat('en-GB', { style:'currency', currency:'EUR', minimumFractionDigits: n % 1 ? 2 : 0 }).format(n || 0);
  const img = s => !s ? '' : /^(data:|https?:)/.test(s) ? s : '../' + s;
  const fdate = (d, o) => new Date(d + 'T12:00:00').toLocaleDateString('en-GB', o || { day:'numeric', month:'short' });
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const I = { home:'M3 11l9-7 9 7v9H3zM9 20v-6h6v6', box:'M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10', bag:'M5 8h14l-1 12H6zM9 8V6a3 3 0 016 0v2', cal:'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4', pen:'M4 20l1-5L16 4l4 4L9 19zM14 6l4 4', mail:'M3 6h18v13H3zM3 7l9 7 9-7', users:'M16 20v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2M9.5 10a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM21 20v-2a4 4 0 00-3-3.9M16 3.1a3.5 3.5 0 010 6.8' };
  const NAV = [['index','Dashboard','home'], ['products','Products & stock','box'], ['orders','Orders','bag'], ['tours','Tours & RSVP','cal'], ['journal','Journal','pen'], ['inbox','Inbox','mail']];

  /* ── shell ── */
  const page = document.body.dataset.page, main = document.getElementById('main');
  const unread = db.messages.filter(m => m.status === 'new').length, pending = db.tours.reduce((a, t) => a + t.rsvps.filter(r => r.status === 'pending').length, 0);
  const badge = { inbox:unread, tours:pending };
  const hr = new Date().getHours(), greeting = 'Buenas tardes, Laura';
  const wrap = document.createElement('div'); wrap.className = 'layout';
  wrap.innerHTML = `<aside class="side"><div class="brand"><img src="../assets/logo_tr3smanox2.png" alt="TR3SMANO"><small>Back office · POC</small></div>
    <nav>${NAV.map(n => `<a href="${n[0]==='index'?'./':n[0]}" class="${page === n[0] ? 'on' : ''}"><svg viewBox="0 0 24 24"><path d="${I[n[2]]}"/></svg>${n[1]}${badge[n[0]] ? `<span class="badge">${badge[n[0]]}</span>` : ''}</a>`).join('')}<span class="off" aria-disabled="true" title="Coming soon"><svg viewBox="0 0 24 24"><path d="${I.users}"/></svg>Users<span class="badge soon">Soon</span></span></nav>
    <div class="foot"><div class="poc">Proof of concept. Demo data lives in this browser only and is shared with the storefront.</div>
      <a href="../" target="_blank">View storefront ↗</a><a href="../shop" target="_blank">View shop ↗</a><a class="credit" href="https://maisonmeta.io" target="_blank" rel="noopener">Custom Backend Demo<br>by <b>Maison Meta</b> ↗</a></div></aside>
    <div class="content"><div class="top"><div><h1>${esc(document.body.dataset.title === '__greeting' ? greeting : document.body.dataset.title)}</h1><div class="sub">${esc(document.body.dataset.sub || '')}</div></div><div class="acts" id="acts"></div></div></div>`;
  document.body.prepend(wrap); $('.content', wrap).append(main);
  document.body.insertAdjacentHTML('beforeend', `<div class="scrim" id="scrim"></div><aside class="panel" id="panel"><div class="panel-h"><h2 id="panelT"></h2><button class="btn sm ghost" id="panelX">Close ✕</button></div><div class="panel-b" id="panelB"></div><div class="panel-f" id="panelF"></div></aside><div class="modal" id="modal"></div><div class="toast" id="toast"></div>`);

  const A = window.A = { esc, eur, img, fdate, $, $$, db, D };
  A.acts = html => { $('#acts').innerHTML = html; };
  let tt; A.toast = m => { const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 2400); };
  A.panel = (title, body, foot, wide) => { $('#panelT').textContent = title; $('#panelB').innerHTML = body; $('#panelF').innerHTML = foot || ''; $('#panel').classList.toggle('wide', !!wide); $('#panel').classList.add('on'); $('#scrim').classList.add('on'); $('#panelB').scrollTop = 0; return $('#panel'); };
  A.close = () => { $('#panel').classList.remove('on'); $('#modal').classList.remove('on'); $('#scrim').classList.remove('on'); };
  A.modal = html => { $('#modal').innerHTML = html; $('#modal').classList.add('on'); $('#scrim').classList.add('on'); return $('#modal'); };
  A.confirm = (msg, ok, label = 'Confirm') => { const m = A.modal(`<h2>${esc(msg)}</h2><div class="acts"><button class="btn ghost" data-x>Cancel</button><button class="btn danger" data-ok>${label}</button></div>`); $('[data-x]', m).onclick = A.close; $('[data-ok]', m).onclick = () => { A.close(); ok(); }; };
  $('#scrim').onclick = A.close; $('#panelX').onclick = A.close;
  addEventListener('keydown', e => e.key === 'Escape' && A.close());
  A.save = () => D.save();

  /* resize an uploaded photo in the browser (mock of an upload to Shopify / S3) */
  A.readImage = (file, max = 900) => new Promise((res, rej) => {
    const fr = new FileReader(); fr.onerror = rej;
    fr.onload = () => { const im = new Image(); im.onerror = rej; im.onload = () => {
      const k = Math.min(1, max / Math.max(im.width, im.height)), c = document.createElement('canvas'); c.width = im.width * k; c.height = im.height * k;
      const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(im, 0, 0, c.width, c.height); res(c.toDataURL('image/jpeg', .82)); };
      im.src = fr.result; };
    fr.readAsDataURL(file);
  });
  A.assetList = ['IMG_2213.webp','IMG_2223.webp','IMG_2230.webp','IMG_2285.webp','IMG_2345.webp','IMG_2364.webp','IMG_2396.webp','IMG_2427.webp','IMG_2456.webp','IMG_2471.webp','Shooting-TR3SMANO-abril-3.webp','Shooting-TR3SMANO-abril-72.webp','Cepa-Antigua-Tresmano.webp','Vinedos-Tresmano-3.webp','Vinedos-Tresmano-HOME.webp','Tresmano-Vinedo-fondo-1.webp','Vista-area-Bodega-Tresmano.webp','Bodega-Tr3smano_Barricas_Comp.webp','Bodega-Tr3smano_Botellero_Comp.jpg','Bodega-Tr3smano_Catas2_Comp.jpg','Bodega-Tr3smano_Depositos_Comp.jpg','53221264531_248da992a4_k.jpg','FEED-TRen-conflicto-de-miltrescientosgramos-audiovisual-2024-07-02-44.png','img-bodega01.jpg','head-home-mobile.jpg','bg-consumoresponsble-tresmano.jpg'].map(f => 'assets/' + f);
  A.productById = id => db.products.find(p => p.id === id);
  A.totalStock = p => (p.stock && p.stock.shop != null) ? p.stock.shop + (p.stock.cellar || 0) : null;
  A.thumb = p => `<div class="thumb"><img class="${p.imgCover ? 'cover' : ''}" src="${esc(img(p.img))}" alt=""></div>`;
  A.pill = (s, label) => `<span class="pill ${esc(s)}">${esc(label || s)}</span>`;
})();
