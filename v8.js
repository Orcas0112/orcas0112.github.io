'use strict';
/* V8 original visual upgrade. No changes to save format, odds, trials, shop prices, or catalog. */
(() => {
 const icons = {
  home:'<path d="m3 10 9-7 9 7v10H3z"/><path d="M9 20v-6h6v6"/>',
  packs:'<path d="M3 7 12 3l9 4v10l-9 4-9-4z"/><path d="m3 7 9 4 9-4M12 11v10"/>',
  shiny:'<path d="m12 2 2.8 7.2L22 12l-7.2 2.8L12 22l-2.8-7.2L2 12l7.2-2.8z"/>',
  fusion:'<path d="M9 3h6m-3 0v8l7 8a2 2 0 0 1-2 3H7a2 2 0 0 1-2-3l7-8"/><path d="M8 17h8"/>',
  admin:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  collection:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  shop:'<path d="M4 9h16l-1.2 12H5.2L4 9Zm2 0V7a6 6 0 0 1 12 0v2"/><path d="M9 13v1m6-1v1"/>',
  events:'<path d="m13 2-9 12h7l-1 8 10-12h-7z"/>',
  desk:'<path d="M4 7h16m-4-4 4 4-4 4M20 17H4m4-4-4 4 4 4"/>',
  progress:'<path d="M8 21h8m-4-4v4M5 4h14v6a7 7 0 0 1-14 0V4Zm0 2H2v3a4 4 0 0 0 4 4m13-7h3v3a4 4 0 0 1-4 4"/>',
  history:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  market:'<path d="M3 10h18M4 10l2-7h12l2 7M5 10v11h14V10M9 21v-7h6v7"/>',
  trade:'<path d="M10 3h4m-2 0v8l7 8a2 2 0 0 1-2 3H7a2 2 0 0 1-2-3l7-8"/><path d="M8 17h8"/>',
  vault:'<circle cx="12" cy="12" r="3"/><path d="M10 2h4l1 3 3 1 3-1 2 4-2 2v3l2 2-2 4-3-1-3 1-1 3h-4l-1-3-3-1-3 1-2-4 2-2v-3l-2-2 2-4 3 1 3-1z"/>'
 };
 for (const btn of document.querySelectorAll('#nav [data-tab]')) {
  const mark=document.createElement('span');mark.className='v8-nav-glyph';mark.setAttribute('aria-hidden','true');
  mark.innerHTML=`<svg viewBox="0 0 24 24" aria-hidden="true">${icons[btn.dataset.tab]||icons.home}</svg>`;
  btn.prepend(mark);
 }
 const packContainer=document.getElementById('featured-packs');
 const packSearch=document.getElementById('v8-pack-search');
 const packCategory=document.getElementById('v8-pack-category');
 const hues=[292,32,215,228,181,266,35,197,177,98,26,208,163,257,52,28,291,32,205,332,119,81,177,221,139,295,190];
 function packPicture(pack) {
  const list=pack.items.filter(item=>Number(item[2])>0);
  const entry=[...list].sort((a,b)=>(RARITY_RANK[b[1]]??0)-(RARITY_RANK[a[1]]??0))[0]||pack.items[0];
  return MAP[slug(entry[0])]||MAP[slug(pack.items[0][0])];
 }
 function showPackWall() {
  const term=packSearch.value.toLowerCase().trim(),kind=packCategory.value;
  const matches=PACKS.filter(p=>(!p.fanMade&&!p.original)&&p.name.toLowerCase().includes(term)&&(kind==='all'||(kind==='original'?Boolean(p.original):kind==='fan'?Boolean(p.fanMade):kind==='free'?p.wasStarter:kind==='archive'?p.simulatorVault:!p.simulatorVault&&!p.wasStarter)));
  packContainer.innerHTML=matches.length?matches.map(p=>{
   const art=packPicture(p), hue=hues[PACKS.indexOf(p)]||216;
   return `<button class="v8-pack-card" data-feature="${escapeHtml(p.id)}" style="--pack-hue:${hue}" aria-label="Open ${escapeHtml(p.name)} details"><div class="v8-pack-banner">${cardArt(art)}</div><span class="v8-pack-tag">${p.wasStarter?'STARTER · 50 ✦':p.simulatorVault?'ARCHIVE · 50 ✦':p.original?'ORIGINAL · 50 ✦':p.fanMade?'NEW · 50 ✦':'50 ✦'}</span><div class="v8-pack-info"><strong>${escapeHtml(p.name)}</strong><small>${p.items.length} collectible Blooks${p.wasStarter?' · starter pack':p.simulatorVault?' · simulator-only odds':p.fanMade?' · simulator-only odds':''}</small></div><span class="v8-pack-go">${'View pack & odds'} <span aria-hidden="true">→</span></span></button>`;
  }).join(''):'<p class="v8-pack-empty">No packs found. Try another search.</p>';
 }
 packSearch.addEventListener('input',showPackWall);
 packCategory.addEventListener('change',showPackWall);
 showPackWall();
 const tally=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value;};
 function updateDashboard(){
  const uniques=CATALOG.reduce((n,f)=>n+(countOf(f.id)>0?1:0),0);
  tally('v8-hero-unique',`${uniques} / ${CATALOG.length}`);
  tally('v8-hero-packs',fmt(save.event?.stats?.packsOpened||0));
  tally('v8-stat-percent',`${Math.round(100*uniques/CATALOG.length)}%`);
  tally('v8-stat-seals',fmt(save.event?.seals||0));
  tally('v8-stat-bonus',fmt(save.v7?.bonusCount||0));
 }
 // Keep V6/V7 obtainment panels accurate when existing Blooks can ALSO be pulled
 // from a Twilight Bazaar-only pack. Their original Blooket pack origin is unchanged.
 const baseInfoDetails=infoDetailsHtml;
 infoDetailsHtml=function(f){
  const html=baseInfoDetails(f);
  const available=[]; // Custom pack shortcuts removed; preserve old Blook details.
  if(!available.length)return html;
  const lines=available.map(p=>{
   const row=p.items.find(([name])=>slug(name)===f.id);
   const sum=p.items.reduce((total,x)=>total+x[2],0);
   return `<div class="v8-fan-route"><span>${escapeHtml(p.name)} · ${(100*row[2]/sum).toFixed(3)}% simulator chance</span><button data-blook-shortcut="packs" data-select-pack="${escapeHtml(p.id)}">See pack →</button></div>`;
  }).join('');
  const section=`<div class="v8-fan-paths"><strong>Also obtainable from NEW Twilight Bazaar packs</strong><p>These are fan-made random packs using local tokens, not official Blooket offers or probabilities.</p>${lines}</div>`;
  return html.replace('<div class="info-actions">',section+'<div class="info-actions">');
 };
 const oldRender=render;
 render=function(){oldRender();updateDashboard();};
 // Cross-tab inventory changes are already processed by V6's storage event.
 window.addEventListener('storage',e=>{if(e.key===WEB_KEY)updateDashboard();});
 // Make the home badge accurate after an imported save is applied.
 document.getElementById('import')?.addEventListener('change',()=>setTimeout(updateDashboard,250));
 updateDashboard();
})();
