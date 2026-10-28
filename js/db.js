/* TR3SMANO — mock "database" (localStorage). Shared by the storefront and /admin so the POC
   round-trips: add a product in the admin → it's in the shop; buy in the shop → order in the admin.
   In production this is replaced by Shopify / a real API; the shapes below are intentionally close. */
(function () {
  const KEY = 'tm-db-v2';
  const iso = d => d.toISOString().slice(0, 10);
  const day = n => { const d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + n); return iso(d); };
  const uid = p => p + Math.random().toString(36).slice(2, 8);
  const slug = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const WINE_CATS = ['red', 'white', 'magnum', 'collection', 'selected'];

  function seed() {
    const stock = {
      'vendimia-2014':[38,120,'TM-VEN-14'], 'albillo-2024':[62,400,'TM-ALB-24'], 'tm-magnum':[4,12,'TM-TM-MAG'], 'vh-serie-4':[24,60,'TM-VH-S4'],
      'vh-serie-3':[6,0,'TM-VH-S3'], 'proventus-2021':[140,600,'TM-PRV-21'], 'proventus-2022':[88,300,'TM-PRV-22'], 'art-milla':[41,0,'TM-ART-18'],
      'alvarinho':[52,0,'TM-ALV-24'], 'casa-madero':[30,0,'CM-2V'], 'oporto':[18,0,'QC-T10'], 'visita-cata':[null,null,'EXP-VISIT2']
    };
    const products = (window.PRODUCTS || []).map(p => {
      const [shop, cellar, sku] = stock[p.id] || [10, 0, p.id.toUpperCase()];
      return Object.assign({}, p, { sku, status:'active', type: p.cat === 'experience' ? 'experience' : 'wine', cost: Math.round(p.price * .38), description: p.blurb,
        stock: { shop, cellar }, updated: day(-Math.floor(Math.random() * 20)) });
    });
    const merch = [
      { id:'merch-tote', handle:'tr3smano-canvas-tote', title:'Tr3smano Tote', vintage:'', sub:'Organic canvas', cat:'merch', price:18, badge:'Merch', img:'assets/merch-tote.svg', alt:'assets/merch-tote.svg', sku:'MER-TOTE', cost:6, description:'Heavy organic canvas, screen-printed with the Tr3smano wordmark. Holds three bottles comfortably.', stock:{ shop:60, cellar:0 } },
      { id:'merch-glasses', handle:'tr3smano-glass-set', title:'Tasting Glass Set', vintage:'×2', sub:'Hand-blown · set of two', cat:'merch', price:32, badge:'Merch', img:'assets/merch-glasses.svg', alt:'assets/merch-glasses.svg', sku:'MER-GLS2', cost:12, description:'The glass we pour with at the winery, in a set of two.', stock:{ shop:7, cellar:24 } },
      { id:'merch-corkscrew', handle:'sommelier-corkscrew', title:'Sommelier Corkscrew', vintage:'', sub:'Olive wood', cat:'merch', price:24, badge:'Merch', img:'assets/merch-corkscrew.svg', alt:'assets/merch-corkscrew.svg', sku:'MER-CORK', cost:8, description:'A double-hinged waiter’s friend with an olive-wood handle.', stock:{ shop:0, cellar:40 } }
    ].map(m => Object.assign({ vintage:'', status:'active', type:'merch', updated:day(-4) }, m));
    const draft = { id:'vendimia-2023', handle:'tr3smano-vendimia-2023', title:'Tr3smano Vendimia', vintage:'2023', sub:'Ribera del Duero', cat:'red', price:38, badge:'New vintage', img:'assets/vendimia_tr3smano.jpg', alt:'assets/Vinedos-Tresmano-HOME.webp', altCover:true,
      sku:'TM-VEN-23', cost:13, type:'wine', status:'draft', description:'The 2023 vintage — bottled and resting. Held back until release.', stock:{ shop:0, cellar:2400 }, updated:day(-1) };
    const all = [draft, ...products, ...merch];

    /* orders */
    let s = 11; const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
    const people = [['Elena Marqués','ES','Valladolid'],['Thomas Weber','DE','Munich'],['Camille Laurent','FR','Lyon'],['Oliver Grant','GB','London'],['Sofia Rossi','IT','Milan'],['Jan de Vries','NL','Utrecht'],['Marta Vidal','ES','Barcelona'],['Liam O’Connor','IE','Dublin'],['Ana Pereira','PT','Porto'],['Henrik Larsen','DK','Aarhus']];
    const sellable = all.filter(p => p.status === 'active');
    const orders = [];
    for (let i = 0; i < 26; i++) {
      const age = Math.floor(rnd() * rnd() * 30 + rnd() * 6); const pe = people[Math.floor(rnd() * people.length)];
      const n = 1 + Math.floor(rnd() * 2.4); const lines = [];
      for (let k = 0; k < n; k++) { const p = sellable[Math.floor(rnd() * sellable.length)]; if (!lines.find(l => l.id === p.id)) lines.push({ id:p.id, title:p.title + (p.vintage ? ' ' + p.vintage : ''), qty:1 + Math.floor(rnd() * 3), unit:p.price }); }
      const sub = lines.reduce((a, l) => a + l.qty * l.unit, 0), ship = sub >= 150 ? 0 : 9;
      orders.push({ date:day(-age), lines, subtotal:sub, shipping:ship, total:sub + ship, name:pe[0], email:pe[0].toLowerCase().replace(/[^a-z]+/g, '.') + '@example.com', country:pe[1], city:pe[2],
        status: age > 6 ? 'delivered' : age > 2 ? 'shipped' : 'paid', channel:'online', source: rnd() > .8 ? 'Club Milla' : 'Web', payment:'Card (Stripe)' });
    }
    orders.sort((a, b) => a.date.localeCompare(b.date)).forEach((o, i) => { o.id = 'TM-' + (1001 + i); });
    orders[3].status = 'refunded';

    /* in-store (one winery shop, counter / POS sales) */
    const instore = [];
    const shelf = all.filter(p => p.status === 'active' && p.cat !== 'experience');
    for (let i = 0; i < 44; i++) {
      const age = Math.floor(rnd() * 30), n = 1 + Math.floor(rnd() * 2.6), lines = [];
      for (let k = 0; k < n; k++) { const p = shelf[Math.floor(rnd() * shelf.length)]; if (!lines.find(l => l.id === p.id)) lines.push({ id:p.id, title:p.title + (p.vintage ? ' ' + p.vintage : ''), qty:1 + Math.floor(rnd() * 2.2), unit:p.price }); }
      const sub = lines.reduce((a, l) => a + l.qty * l.unit, 0);
      instore.push({ date:day(-age), lines, subtotal:sub, shipping:0, total:sub, name: rnd() > .7 ? people[Math.floor(rnd() * people.length)][0] : 'Walk-in customer', email:'', country:'ES', city:'Winery shop', status:'completed', channel:'instore', source:'Counter', payment: rnd() > .3 ? 'Card' : 'Cash' });
    }
    instore.sort((a, b) => a.date.localeCompare(b.date)).forEach((o, i) => { o.id = 'POS-' + (2001 + i); });
    orders.push(...instore);

    /* tours */
    const T = [['Signature visit + tasting',40,12,'Vineyard walk, barrel hall and a guided tasting of four wines.'],['Vineyard walk & picnic',55,8,'Among the old vines with a local picnic and Albillo Mayor.'],['Private barrel tasting',90,6,'Taste from barrel with the winemaker — small groups only.'],['Harvest experience',70,10,'Pick, sort and taste during the vendimia.']];
    const guests = [['Clara Whitfield','clara@example.com',2],['Pablo Sanz','pablo@example.com',4],['Greta Hoffmann','greta@example.com',2],['Nicolas Dupont','nicolas@example.com',3],['Aiko Tanaka','aiko@example.com',2],['Rui Santos','rui@example.com',5]];
    const tours = []; let gi = 0;
    for (let d = 2; d <= 40; d += 2 + (d % 3)) {
      const t = T[(d / 2 | 0) % 4];
      const rsvps = d < 24 ? Array.from({ length: (d % 3) + 1 }, (_, j) => { const g = guests[gi++ % guests.length]; return { id:uid('r'), name:g[0], email:g[1], guests:g[2], status:['confirmed','pending','pending','confirmed'][(d + j) % 4], note:j ? '' : 'Celebrating an anniversary.', created:day(-j - 1) }; }) : [];
      tours.push({ id:uid('t'), date:day(d), time: d % 2 ? '11:00' : '17:30', type:t[0], price:t[1], capacity:t[2], notes:t[3], rsvps });
    }

    const posts = [
      { id:uid('p'), slug:'spring-in-the-old-vines', title:'Spring in the old vines', excerpt:'April brings blossom between the rows — and the first green shoots on 100-year-old Albillo.', cover:'assets/IMG_2364.webp', status:'published', date:day(-12), tags:['Vineyard'],
        body:'April is when the vineyard wakes. Almond and cherry blossom spill across the rows while the bush vines — some of them a century old — push their first green.\n\n## Why old vines matter\nOld vines give little fruit and a great deal of character. Our Albillo Mayor comes from vineyards between 60 and 100 years old in Olmedillo and La Aguilera.\n\nWe walk the rows every week from now until harvest.' },
      { id:uid('p'), slug:'inside-the-barrel-hall', title:'Inside the barrel hall', excerpt:'Fernando and Pedro taste every barrel, every month. A look at how time is built into the winery.', cover:'assets/Bodega-Tr3smano_Barricas_Comp.webp', status:'published', date:day(-26), tags:['Winery'],
        body:'Wine in this room is never hurried. Tm is made only in exceptional years and rests more than 24 months on average.\n\n## A monthly ritual\nEvery month Fernando and Pedro taste each barrel and decide together what happens next.' },
      { id:uid('p'), slug:'harvest-notes-2025', title:'Harvest notes — draft', excerpt:'Field notes from this year’s vendimia (to be completed by the team).', cover:'assets/FEED-TRen-conflicto-de-miltrescientosgramos-audiovisual-2024-07-02-44.png', status:'draft', date:day(-2), tags:['Harvest'],
        body:'Draft in progress — sample entry showing how an unpublished post looks in the admin.' }
    ];
    const messages = [
      { id:uid('m'), name:'Isabel Moreno', email:'isabel@example.com', topic:'Private event', message:'Hello, we are planning a 20-person birthday dinner in June. Do you host private events at the winery, and what packages do you offer?', date:day(0), status:'new' },
      { id:uid('m'), name:'Martin Keller', email:'martin@example.com', topic:'Trade / retailer', message:'We run a wine shop in Zürich and would like to list Proventus and Albillo Mayor. Could you send wholesale terms?', date:day(-1), status:'new' },
      { id:uid('m'), name:'Yuki Sato', email:'yuki@example.com', topic:'Order', message:'My parcel TM-1012 arrived with a damaged box. All bottles are fine, but wanted you to know.', date:day(-3), status:'read' },
      { id:uid('m'), name:'Beatriz Alonso', email:'bea@example.com', topic:'Tours', message:'Is the vineyard walk suitable for children and dogs?', date:day(-5), status:'replied', reply:'Hi Beatriz — children are very welcome and well-behaved dogs are fine on the vineyard walk. See you soon!' },
      { id:uid('m'), name:'Paul Brenner', email:'paul@example.com', topic:'Club Milla', message:'How can I request an invitation to Club Milla?', date:day(-8), status:'read' },
      { id:uid('m'), name:'Chloe Martin', email:'chloe@example.com', topic:'Press', message:'Writing a piece on Ribera del Duero newcomers — could we arrange a call this month?', date:day(-11), status:'archived' }
    ];
    return { v:1, products:all, orders, tours, posts, messages, movements:[
      { id:uid('s'), date:day(-6), product:'proventus-2022', qty:60, from:'cellar', to:'shop', note:'Spring release' },
      { id:uid('s'), date:day(-14), product:'albillo-2024', qty:40, from:'cellar', to:'shop', note:'Allocation top-up' } ] };
  }

  let db = null;
  try { db = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
  if (!db || !db.products) db = seed();
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(db)); return true; } catch (e) { alert('Browser storage is full — remove some large product images.'); return false; } };
  persist();

  /* the storefront reads active products from the DB */
  if (window.PRODUCTS) {
    window.PRODUCTS = db.products.filter(p => p.status === 'active');
    window.CATS = (window.CATS || []).filter(c => c[0] !== 'merch'); window.CATS.splice(window.CATS.length - 1, 0, ['merch', 'Merch']);
  }

  /* storefront order creation (mock checkout) */
  function placeOrder(lines, customer) {
    const sub = lines.reduce((a, l) => a + l.unit * l.qty, 0), ship = sub >= 150 ? 0 : 9;
    const n = 1001 + db.orders.filter(x => x.channel === 'online').length;
    const o = { id:'TM-' + n, date:iso(new Date()), lines:lines.map(l => ({ id:l.id, title:l.title, qty:l.qty * (l.variant === 'x3' ? 3 : l.variant === 'x6' ? 6 : 1), unit:l.variant === 'x1' || !l.variant ? l.unit : +(l.unit / (l.variant === 'x3' ? 3 : 6)).toFixed(2) })),
      subtotal:sub, shipping:ship, total:sub + ship, name:customer.name, email:customer.email, country:'ES', city:'—', status:'paid', channel:'online', source:'Web (demo checkout)', payment:'Card (Stripe)' };
    o.lines.forEach(l => { const p = db.products.find(x => x.id === l.id); if (p && p.stock && p.stock.shop != null) p.stock.shop = Math.max(0, p.stock.shop - l.qty); });
    db.orders.push(o); persist(); return o;
  }

  window.TM_DB = { db, save:persist, uid, day, iso, slug, WINE_CATS, placeOrder,
    reset() { localStorage.removeItem(KEY); location.reload(); },
    isWine: p => WINE_CATS.includes(p.cat) };
})();
