/* Product catalogue — shaped like a Shopify Storefront product so it can be swapped
   for a live fetch later (see js/config.js). Prices are € incl. IVA (from the live shop). */
window.PRODUCTS = [
  { id:'vendimia-2014', handle:'tr3smano-vendimia-2014', title:'Tr3smano Vendimia', vintage:'2014', sub:'Primera Cosecha', cat:'red', price:66, badge:'First harvest',
    img:'assets/Tr3smano_2014.jpg', alt:'assets/Tr3smano-detalle-2014.jpg', altCover:true,
    blurb:'The very first vintage — Tempranillo from three subzones, 18 months in Bordeaux barrels.' },
  { id:'albillo-2024', handle:'tr3smano-albillo-mayor-2024', title:'Tr3smano Albillo Mayor', vintage:'2024', sub:'White · 1,000 bottles', cat:'white', price:47, badge:'Limited',
    img:'assets/albillo-mayor-2021-1.jpg', alt:'assets/FotoAlbillo_sinanada.jpg',
    blurb:'100% Albillo Mayor from 60–100 year-old vines. Four new French oak barrels, nine months.' },
  { id:'tm-magnum', handle:'magnum-tm-by-tr3smano', title:'Magnum Tm', vintage:'by Tr3smano', sub:'Magnum · 1.5 L', cat:'magnum', price:263, badge:'Magnum',
    img:'assets/Tm-detalle.jpg', imgCover:true, alt:'assets/albillo-mayor-2021.jpg',
    blurb:'Tinto Magistral — only in exceptional years, aged 24+ months. Presented in magnum.' },
  { id:'vh-serie-4', handle:'tr3smano-vinedos-historicos-serie-4', title:'Viñedos Históricos', vintage:'Serie 4', sub:'Collection · gift box', cat:'collection', price:70, badge:'Gift box',
    img:'assets/Tr3smano_VH_Serie4_estuche1200x1200.jpg', alt:'assets/Cepa-Antigua-Tresmano.webp', altCover:true,
    blurb:'The Historic Vineyards collection, fourth release, in its signature case.' },
  { id:'vh-serie-3', handle:'tr3smano-vinedos-historicos-serie-3', title:'Viñedos Históricos', vintage:'Serie 3', sub:'Collection · gift box', cat:'collection', price:70, badge:'Gift box',
    img:'assets/Tr3smano_VH_Serie3_Estuche1200x1200-1.jpg', alt:'assets/IMG_2223.webp', altCover:true,
    blurb:'The Historic Vineyards collection, third release, in its signature case.' },
  { id:'proventus-2021', handle:'proventus-by-tr3smano-2021', title:'Proventus by Tr3smano', vintage:'2021', sub:'Ribera del Duero', cat:'red', price:25,
    img:'assets/Proventus_detalle-4-scaled.jpg', imgCover:true, alt:'assets/PROVENTUS-scaled.jpg',
    blurb:'100% Tinta del País with light barrel ageing.' },
  { id:'proventus-2022', handle:'proventus-by-tr3smano-12-meses-2022', title:'Proventus by Tr3smano', vintage:'2022', sub:'12 months in barrel', cat:'red', price:25, badge:'New vintage',
    img:'assets/PRV2022-WEB.jpg', alt:'assets/IMG_2427.webp', altCover:true,
    blurb:'The 2022 vintage — twelve months of barrel ageing.' },
  { id:'art-milla', handle:'a-r-t-milla-2018', title:'A.R.T. Milla', vintage:'2018', sub:'Club Milla', cat:'red', price:30,
    img:'assets/artmilla-tr3smano.jpg', alt:'assets/IMG_2456.webp', altCover:true,
    blurb:'A cuvée from the Club Milla family.' },
  { id:'alvarinho', handle:'lagar-de-proventus-alvarinho-2024', title:'Lagar de Proventus', vintage:'2024', sub:'Alvarinho sobre lías', cat:'white', price:21,
    img:'assets/Alvarinho-proventus.jpg', alt:'assets/Vinedos-Tresmano-3.webp', altCover:true,
    blurb:'Alvarinho aged on its lees.' },
  { id:'casa-madero', handle:'casa-madero-ensambles-2v', title:'Casa Madero Ensambles 2V', vintage:'', sub:'Chardonnay · Chenin Blanc', cat:'selected', price:25,
    img:'assets/Casa-Madero-2V-web-1.jpg', alt:'assets/Vinedos-Tresmano-HOME.webp', altCover:true,
    blurb:'A guest producer from Mexico, selected by the winery.' },
  { id:'oporto', handle:'oporto-tawny-10-quinta-das-carvalhas', title:'Tawny 10 años', vintage:'', sub:'Quinta das Carvalhas · decanter', cat:'selected', price:42,
    img:'assets/Quinta-das-Carvalhas-Porto-Tawny-10-Anos-Decanter.jpg', alt:'assets/Bodega-Tr3smano_Barricas_Comp.webp', altCover:true,
    blurb:'Tawny Port with its decanter, from Quinta das Carvalhas.' },
  { id:'visita-cata', handle:'reserva-visita-bodega-cata-dos-personas', title:'Visit + Tasting', vintage:'for two', sub:'Winery experience', cat:'experience', price:80, badge:'Experience',
    img:'assets/a7-envelope-exterior-layout-mockup.png', imgCover:true, alt:'assets/Bodega-Tr3smano_Catas2_Comp.jpg', altCover:true,
    blurb:'A guided winery visit and tasting for two guests.' }
];
window.CATS = [
  ['all','All'],['red','Red'],['white','White'],['collection','Collections'],['magnum','Magnums'],['experience','Experiences'],['selected','Also selected']
];
window.VARIANTS = {
  x1:{ label:'1 bottle', sub:'75 cl', n:1, off:0 },
  x3:{ label:'Case of 3', sub:'−5%', n:3, off:.05 },
  x6:{ label:'Case of 6', sub:'−10%', n:6, off:.10 }
};
