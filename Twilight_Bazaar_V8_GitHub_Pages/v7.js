'use strict';
// V7 upgrade layer. Uses exactly the v5/v6 browser storage key and version.
// Official pack probabilities are untouched; bonuses are independent extra rolls.
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
  const p=PACKS.find(p=>p.id===f.pack);
  if(p?.free)return 'Starter';
  if(f.unreleased)return 'Unreleased';
  if(f.rarity==='Mystical')return 'Mystical';
  if(f.catalogOnly||f.pack==='event'||p?.special)return sourceCategory(f)==='Pack'?'Pack archive':sourceCategory(f);
  return null;
 };
 const shopItems=CATALOG.filter(f=>{const group=specialGroup(f);return group && group!=='Mystical';});
 const shopPrice=(f)=>{
  const group=specialGroup(f);
  if(group==='Starter')return 0;
  if(group==='Seasonal')return 6500;
  if(group==='Event')return 30000;
  if(group==='Retired')return 26000;
  if(group==='Unique')return 42000;
  if(group==='Unreleased')return 75000;
  if(group==='Pack archive')return 18000;
  return f.rarity==='Chroma'?16000:10000;
 };
 const groupLabel=f=>specialGroup(f)==='Unreleased'?'Historical / unreleased':specialGroup(f)||'Special';
 function drawShop(){
  const target=$('shop-grid');if(!target)return;
  const query=$('shop-search').value.toLowerCase().trim(),selected=$('shop-filter').value,missing=$('shop-missing').checked;
  const list=shopItems.filter(f=>(selected==='All'||specialGroup(f)===selected)&&f.name.toLowerCase().includes(query)&&(!missing||countOf(f.id)===0));
  $('shop-wallet').textContent=fmt(save.tokens)+' ✦';
  const owned=shopItems.filter(f=>countOf(f.id)>0).length;
  $('shop-stats').innerHTML=`<b>${owned} / ${shopItems.length}</b> special and starter Blooks collected <button id="claim-starters" ${shopItems.some(f=>specialGroup(f)==='Starter'&&!countOf(f.id))?'':'disabled'}>Claim all free starters</button>`;
  target.innerHTML=list.length?list.map(f=>{
   const owned=countOf(f.id)>0,price=shopPrice(f),can=save.tokens>=price;
   const group=groupLabel(f);
   return `<article class="shop-card ${owned?'shop-owned':''}">
    <button class="shop-art" data-blook-info="${f.id}" aria-label="How to obtain ${escapeHtml(f.name)}">${cardArt(f)}</button>
    <div class="shop-card-text">${labelRarity(f.rarity)}<h3>${escapeHtml(f.name)}</h3><p>${escapeHtml(group)}${f.unreleased?' · Fan-simulator collectible':''}</p><small>${owned?'Already in your collection':price===0?'Free starter':fmt(price)+' local tokens'}</small></div>
    <div class="shop-card-actions"><button data-blook-info="${f.id}">Details</button><button class="primary" data-shop-buy="${f.id}" ${owned||!can?'disabled':''}>${owned?'Collected':price===0?'Claim free':'Buy · '+fmt(price)+' ✦'}</button></div>
   </article>`;
  }).join(''):'<p class="history-empty">No Blooks match your filters.</p>';
 }
 const baseRender=render;
 render=function(){baseRender();if($('shop').classList.contains('active'))drawShop();};
 const baseSwitch=switchTab;
 switchTab=function(id){baseSwitch(id);if(id==='shop')drawShop();};
 const baseStatus=obtainmentStatus;
 obtainmentStatus=function(f){
  const group=specialGroup(f);
  if(group && group!=='Mystical')return {status:countOf(f.id)?'Owned':'Available in Special Shop',title:shopPrice(f)?`Special Shop · ${fmt(shopPrice(f))} local tokens`:'Special Shop · free starter',action:'shop'};
  return baseStatus(f);
 };
 const baseDetails=infoDetailsHtml;
 infoDetailsHtml=function(f){
  const group=specialGroup(f);
  if(!group || group==='Mystical')return baseDetails(f);
  const price=shopPrice(f),owned=countOf(f.id)>0;
  const status=owned?`Owned · ${fmt(countOf(f.id))}`:price===0?'Free starter available':'Available to purchase';
  return `<div class="info-heading"><div class="info-art">${cardArt(f)}</div><div><span class="eyebrow">BLOOK INFORMATION · V7</span><h2 id="blook-dialog-title">${escapeHtml(f.name)}</h2>${labelRarity(f.rarity)}<div class="obtain-status">${status}</div></div></div>
   <div class="info-separator"></div><div class="info-origin"><span>Original Blooket context</span><strong>${escapeHtml(sourceDescription(f))} · ${escapeHtml(sourceCategory(f))}${f.unreleased?' · Not officially released':''}</strong></div>
   <div class="info-origin"><span>Twilight Bazaar method</span><strong>Always available in the Special Shop</strong></div>
   <div class="info-directions"><p>${f.unreleased?'This is a documented historical/unreleased reference, <strong>not a released OG market Blook</strong>. In this independent simulator you may collect it in the Special Shop.':'Buy or claim this Blook directly in the Special Shop. There is no waiting for a daily rotation.'}</p><div class="info-step"><span>Price</span><b>${price===0?'FREE':fmt(price)+' local tokens'}</b></div>${price?progressBar(save.tokens,price):''}<div class="info-step"><span>Your current tokens</span><b>${fmt(save.tokens)} ✦</b></div><p class="info-tip">This is a fan-simulator purchase—not an official Blooket drop rate, shop listing, or account reward.</p></div>
   <div class="info-actions"><button class="primary" data-blook-shortcut="shop">Visit Special Shop →</button><button data-close-blook>Close</button></div>`;
 };
 function buySpecial(id){
  const f=MAP[id],group=f&&specialGroup(f);if(!f||!group||group==='Mystical'||busy)return;
  // V5/V6/V7-compatible save read right before a currency mutation.
  try{const raw=localStorage.getItem(WEB_KEY);if(raw)save=validateSave(JSON.parse(raw));}catch(e){return notice('Save could not be read. Purchase canceled.');}
  const price=shopPrice(f);
  if(countOf(f.id)>0)return notice(`${f.name} is already collected.`);
  if(save.tokens<price)return notice(`Need ${fmt(price)} tokens for ${f.name}.`);
  save.tokens-=price;award(f);save.v7.shopBuys[f.id]=true;
  persist();render();if($('collection').classList.contains('active'))drawCollection();
  notice(`${f.name} added to your local collection!`);
 }
 // No new Blooks get invented or added to original pack odds for bonus discovery.
 const BONUS_TIERS=[
  {tier:'Secret Find',threshold:1/5000,group:['Unique','Unreleased']},
  {tier:'Ultra Rare',threshold:1/1000,group:['Event','Retired']},
  {tier:'Rare Find',threshold:1/250,group:['Seasonal','Pack archive']}
 ];
 function rollBonus(){
  // One extra discovery at most, independent of the regular pack pull. Marginal probabilities:
  // Secret 0.02%, Ultra 0.08%, Rare 0.30%, no bonus 99.60%.
  const roll=Math.random();const tier=BONUS_TIERS.find(t=>roll<t.threshold);
  if(!tier)return null;
  const pool=shopItems.filter(f=>tier.group.includes(specialGroup(f)));
  if(!pool.length)return null;
  return {tier:tier.tier,id:pool[Math.floor(Math.random()*pool.length)].id};
 }
 // V6 attached the original function as a click handler during its setup.
 // Capture and route pack-button clicks through V7 exactly once.
 $('open-pack').addEventListener('click',event=>{event.stopImmediatePropagation();openPacks();},true);
 const baseOpen=openPacks;
 openPacks=function(){
  if(busy)return;let pending=[],opened=false;
  const before=save.v6.history[0]?.id;
  const originalChoose=chooseWeighted;
  chooseWeighted=function(pack){const normal=originalChoose(pack);const bonus=rollBonus();if(bonus)pending.push(bonus);return normal;};
  try{baseOpen();}finally{chooseWeighted=originalChoose;}
  const h=save.v6.history[0];if(!h||h.id===before)return;
  h.bonus=pending;opened=true;
  if(opened){
   for(const bonus of pending){const f=MAP[bonus.id];if(!f)continue;award(f);save.v7.bonusCount++;
    if(bonus.tier==='Secret Find')save.v7.secret++;
    else if(bonus.tier==='Ultra Rare')save.v7.ultra++;
    else save.v7.rare++;
   }
   persist();render();
   if(!$('results-dialog').hidden){$('results-dialog-body').innerHTML=resultsHtml(h);}
   if(pending.length && !$('reveal-overlay').hidden){
    const best=pending.slice().sort((a,b)=>BONUS_TIERS.findIndex(t=>t.tier===a.tier)-BONUS_TIERS.findIndex(t=>t.tier===b.tier))[0];
    const blook=MAP[best.id];
    $('reveal-overlay').dataset.bonus='yes';$('reveal-overlay').dataset.rarity=blook.rarity.toLowerCase();
    $('reveal-kicker').textContent=`BONUS DISCOVERY · ${best.tier.toUpperCase()}`;
    $('reveal-art').innerHTML=cardArt(blook);$('reveal-title').textContent=blook.name;
    $('reveal-rarity').textContent=blook.rarity;
    $('reveal-subtitle').textContent=`Extra reward! Your ${h.ids.length} regular pulls were also saved.`;
   }else {$('reveal-overlay').dataset.bonus='no';}
   if(pending.length)notice(`${h.ids.length} regular pulls + ${pending.length} EXTRA special Blook${pending.length===1?'':'s'}!`);
  }
 };
 const baseResults=resultsHtml;
 resultsHtml=function(h){
  const initial=baseResults(h),bonuses=sanitizeBonuses(h.bonus);
  const summary=`<div class="v7-bonus-summary"><strong>Independent bonus discoveries</strong><p>These never replace a normal pack pull. Separate Twilight Bazaar-only chances per paid pack: Rare Find 0.30%, Ultra Rare 0.08%, Secret Find 0.02%.</p>${bonuses.length?`<div class="v7-bonus-grid">${bonuses.map(b=>{const f=MAP[b.id];return `<div class="v7-bonus-card">${cardArt(f)}<b>${escapeHtml(f.name)}</b><span>${escapeHtml(b.tier)} · +1 extra</span></div>`;}).join('')}</div>`:'<p>No bonus discoveries in this opening.</p>'}</div>`;
  return initial.replace('<div class="result-actions">',summary+'<div class="result-actions">');
 };
 const baseHistory=drawHistory;
 drawHistory=function(){baseHistory();if(!$('history'))return;const stat=$('opening-stats');if(stat){const total=save.v7?.bonusCount||0;stat.insertAdjacentHTML('beforeend',`<div class="stat-card"><span>V7 bonus finds</span><b>${fmt(total)}</b></div>`);}};
 // Update descriptions only; do not alter any rates in PACKS.
 const note=document.createElement('div');note.className='v7-pack-notice';note.innerHTML='<b>V7 Surprise Finds</b> · Every paid pack has a separate, tiny chance of an <strong>extra</strong> special Blook (0.4% combined per pack). The 50-token price and normal pack probabilities remain unchanged.';
 $('pack-note').insertAdjacentElement('afterend',note);
 for(const name of ['shop-search','shop-filter','shop-missing'])$(name).addEventListener(name==='shop-search'?'input':'change',drawShop);
 $('shop-grid').addEventListener('click',e=>{const button=e.target.closest('[data-shop-buy]');if(button)buySpecial(button.dataset.shopBuy);});
 $('shop-stats').addEventListener('click',e=>{
  if(!e.target.closest('#claim-starters'))return;
  const pending=shopItems.filter(f=>specialGroup(f)==='Starter'&&countOf(f.id)===0);
  if(!pending.length)return notice('All free starters collected.');
  for(const f of pending){award(f);save.v7.shopBuys[f.id]=true;}
  persist();render();notice(`${pending.length} starter Blooks claimed for free!`);
 });
 $('import').addEventListener('change',()=>setTimeout(()=>{try{const raw=localStorage.getItem(WEB_KEY);if(raw)save=validateSave(JSON.parse(raw));render();}catch(err){console.warn(err);}},120));
 $('brand')?.setAttribute('data-version','v7');
 // V7's shop is always accessible; don't count Uniques or historical entries as pack rewards.
 drawShop();render();
})();
