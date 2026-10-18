'use strict';
// V7 upgrade layer. Uses exactly the v5/v6 browser storage key and version.
// Original pack probabilities are untouched; all bonus-only finds now appear in named packs.
(() => {
 const blankV7 = () => ({bonusCount:0,rare:0,ultra:0,secret:0,shopBuys:{}});
 const sanitizeV7 = raw => {
  const out=blankV7();if(!raw||typeof raw!=='object')return out;
  for(const field of ['bonusCount','rare','ultra','secret'])out[field]=maxInt(raw[field]);
  if(raw.shopBuys && typeof raw.shopBuys==='object')for(const [id,owned] of Object.entries(raw.shopBuys))if(MAP[id]&&owned===true)out.shopBuys[id]=true;
  return out;
 };
 const sanitizeBonuses=raw => Array.isArray(raw)?raw.slice(0,100).filter(b=>b&&MAP[b.id]&&['Rare Find','Ultra Rare','Secret Find'].includes(b.tier)).map(b=>({id:b.id,tier:b.tier})):[];
 const baseValidate=validateSave;
 validateSave=function(s){
  const value=baseValidate(s);value.v7=sanitizeV7(s?.v7);
  const sourceHistory=Array.isArray(s?.v6?.history)?s.v6.history:[];
  value.v6.history.forEach((h,i)=>{
   const source=sourceHistory.find(x=>x?.id===h.id)||sourceHistory[i];
   h.bonus=sanitizeBonuses(source?.bonus);
  });
  return value;
 };
 // Restore an existing V7 save before any V6-render path could strip new fields.
 try{const raw=localStorage.getItem(WEB_KEY);save=raw?validateSave(JSON.parse(raw)):newSave();}catch(err){console.warn('V7 save load recovery:',err);save=newSave();}
 const specialGroup=f=>{
  const p=PACKS.find(x=>x.id===f.pack);
  if(p?.wasStarter)return 'Starter';
  if(p?.simulatorVault)return f.source||'Archive';
  return null;
 };
 const shopItems=CATALOG.filter(f=>PACKS.find(p=>p.id===f.pack)?.simulatorVault);
 const groupLabel=f=>specialGroup(f)||'Archive';
 function drawShop(){
  const target=$('shop-grid');if(!target)return;
  const query=$('shop-search').value.toLowerCase().trim(),selected=$('shop-filter').value,missing=$('shop-missing').checked;
  const list=shopItems.filter(f=>(selected==='All'||specialGroup(f)===selected)&&f.name.toLowerCase().includes(query)&&(!missing||countOf(f.id)===0));
  $('shop-wallet').textContent=fmt(save.tokens)+' ✦';
  const owned=shopItems.filter(f=>countOf(f.id)>0).length;
  $('shop-stats').innerHTML=`<b>${owned} / ${shopItems.length}</b> archive Blooks found through packs · All are obtainable`;
  target.innerHTML=list.length?list.map(f=>{
   const p=PACKS.find(x=>x.id===f.pack),n=countOf(f.id);
   return `<article class="shop-card ${n?'shop-owned':''}">
    <button class="shop-art" data-blook-info="${f.id}" aria-label="How to obtain ${escapeHtml(f.name)}">${cardArt(f)}</button>
    <div class="shop-card-text">${labelRarity(f.rarity)}<h3>${escapeHtml(f.name)}</h3><p>${escapeHtml(groupLabel(f))}${f.unreleased?' · archival simulation':f.source==='Game Mode'?' · game-mode appearance':''}</p><small>${n?`${fmt(n)} owned`:escapeHtml(p.name)}</small></div>
    <div class="shop-card-actions"><button data-blook-info="${f.id}">Details</button><button class="primary" data-feature="${escapeHtml(p.id)}">Open ${escapeHtml(p.name)} →</button></div>
   </article>`;
  }).join(''):'<p class="history-empty">No Blooks match your filters.</p>';
 }
 const baseRender=render;
 render=function(){baseRender();if($('shop').classList.contains('active'))drawShop();};
 const baseSwitch=switchTab;
 switchTab=function(id){baseSwitch(id);if(id==='shop')drawShop();};
 const baseStatus=obtainmentStatus;
 obtainmentStatus=function(f){
  const p=PACKS.find(x=>x.id===f.pack);
  if(p?.simulatorVault||p?.wasStarter){
   const chance=p.items.find(x=>slug(x[0])===f.id)?.[2]||0;
   return {status:countOf(f.id)?'Owned':'Available to pull',title:`${p.name} · ${chance.toFixed(3)}% simulator chance`,action:'packs',pack:p.id};
  }
  return baseStatus(f);
 };
 const baseDetails=infoDetailsHtml;
 infoDetailsHtml=function(f){
  const p=PACKS.find(x=>x.id===f.pack);
  if(!p?.simulatorVault&&!p?.wasStarter)return baseDetails(f);
  const chance=p.items.find(x=>slug(x[0])===f.id)?.[2]||0;
  const status=countOf(f.id)>0?`Owned · ${fmt(countOf(f.id))}`:'Available from pack';
  return `<div class="info-heading"><div class="info-art">${cardArt(f)}</div><div><span class="eyebrow">BLOOK INFORMATION</span><h2 id="blook-dialog-title">${escapeHtml(f.name)}</h2>${labelRarity(f.rarity)}<div class="obtain-status">${status}</div></div></div>
   <div class="info-separator"></div><div class="info-origin"><span>Original context</span><strong>${escapeHtml(sourceDescription(f))}${f.unreleased?' · Unreleased reference':''}</strong></div>
   <div class="info-origin"><span>Twilight Bazaar obtainment</span><strong>${escapeHtml(p.name)}</strong></div>
   <div class="info-directions"><p>Open the <b>${escapeHtml(p.name)}</b> to randomly collect this Blook. The displayed chance is <b>${chance.toFixed(3)}%</b> per opening (50 virtual tokens). ${p.simulatorVault?'This is a fan-simulator archive pack, not an official Blooket product or probability table.':''} ${f.unreleased?'This archived reference was not an officially released collectible.':''} ${f.source==='Game Mode'?'The game-mode appearance is not an official Market collectible, and its preview art may differ from the exact variant.':''}</p></div>
   <div class="info-actions"><button class="primary" data-blook-shortcut="packs" data-select-pack="${escapeHtml(p.id)}">Open pack →</button><button data-close-blook>Close</button></div>`;
 };
 const baseResults=resultsHtml;
 resultsHtml=function(h){
  const initial=baseResults(h),bonuses=sanitizeBonuses(h.bonus);
  if(!bonuses.length)return initial;
  const summary=`<div class="v7-bonus-summary"><strong>Legacy V7 discoveries</strong><p>These rewards came from openings in an earlier version. Extra finds are no longer added automatically; their Blooks now have dedicated pack routes.</p><div class="v7-bonus-grid">${bonuses.map(b=>{const f=MAP[b.id];return `<div class="v7-bonus-card">${cardArt(f)}<b>${escapeHtml(f.name)}</b><span>${escapeHtml(b.tier)}</span></div>`;}).join('')}</div></div>`;
  return initial.replace('<div class="result-actions">',summary+'<div class="result-actions">');
 };
 const baseHistory=drawHistory;
 drawHistory=function(){baseHistory();const stat=$('opening-stats');if(stat&&save.v7?.bonusCount){stat.insertAdjacentHTML('beforeend',`<div class="stat-card"><span>Legacy bonus finds</span><b>${fmt(save.v7.bonusCount)}</b></div>`);}};
 // No bonus drops from normal pack openings. Rare/Ultra/Secret Finds live in named packs.
 for(const name of ['shop-search','shop-filter','shop-missing'])$(name).addEventListener(name==='shop-search'?'input':'change',drawShop);
 $('import').addEventListener('change',()=>setTimeout(()=>{try{const raw=localStorage.getItem(WEB_KEY);if(raw)save=validateSave(JSON.parse(raw));render();}catch(err){console.warn(err);}},120));
 $('brand')?.setAttribute('data-version','v7');
 // Preserve V7 history metadata while moving archive rewards into openable packs.
 drawShop();render();
})();
