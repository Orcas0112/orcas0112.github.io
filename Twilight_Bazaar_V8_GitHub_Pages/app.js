'use strict';
// Twilight Bazaar Web Edition. Independently coded local simulator; no Blooket account integration.
const $ = id => document.getElementById(id);
const WEB_KEY = 'twilightBazaarWebSaveV1';
const ART_KEY = 'twilightBazaarWebImageOverridesV1';
const LEGACY_KEY = 'twilightBazaarOfficialSaveV2';
const TOKEN_PRICE = 50;
const SELL_PRICES = {Common:0,Uncommon:5,Rare:20,Epic:75,Legendary:200,Chroma:1000,Unique:0,Mystical:2500};
const RARITY_RANK = {Common:0,Uncommon:1,Rare:2,Epic:3,Legendary:4,Chroma:5,Unique:6,Mystical:7};
const MILESTONE_TOTAL=CATALOG.length; // V7 Special Shop now makes all archival references collectible in this simulator
const maxInt = n => Math.max(0, Math.min(1e9, Math.floor(Number(n) || 0)));
const countOf = id => maxInt(save.inventory[id]);
const fmt = n => maxInt(n).toLocaleString('en-US');
const dateKey = () => new Date().toISOString().slice(0,10);
const escapeHtml = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const blankEvents = () => ({seals:0,stats:{packsOpened:0,packsById:{}},daily:{date:dateKey(),opens:0,salvaged:0,spins:0,trades:0,claimed:{}},claimedTrials:{},archiveBuys:{}});
const V6_HISTORY_LIMIT=30;
const blankV6=()=>({prefs:{mode:'Fast'},history:[]});
const blankV5=()=>({trade:{date:dateKey(),deals:{},customDeals:{},proposals:0,accepted:0},progress:{favorites:{},achievements:{},milestones:{},sold:0}});
const newSave = () => ({version:1,tokens:500,shards:250,inventory:{witch:5,wizard:4,elf:3,dragon:2,jester:2,unicorn:1},lastSpin:0,purchases:{},event:blankEvents(),...blankV5(),v6:blankV6(),v7:{bonusCount:0,rare:0,ultra:0,secret:0,shopBuys:{}}});
function safeFlags(obj,allowed){const out={};if(!obj||typeof obj!=='object')return out;for(const id of allowed)if(obj[id]===true)out[id]=true;return out;}
function sanitizeEvents(raw){
 const base=blankEvents();if(!raw||typeof raw!=='object')return base;
 const stats=raw.stats&&typeof raw.stats==='object'?raw.stats:{};
 const packed=stats.packsById&&typeof stats.packsById==='object'?stats.packsById:{};
 const packsById=Object.fromEntries(PACKS.map(p=>[p.id,maxInt(packed[p.id])]));
 const d=raw.daily&&typeof raw.daily==='object'?raw.daily:{};
 const today=dateKey();
 const daily=d.date===today?{date:today,opens:maxInt(d.opens),salvaged:maxInt(d.salvaged),spins:maxInt(d.spins),trades:maxInt(d.trades),claimed:safeFlags(d.claimed,EVENT_MISSIONS.map(m=>m.id))}:base.daily;
 return {seals:maxInt(raw.seals),stats:{packsOpened:maxInt(stats.packsOpened),packsById},daily,claimedTrials:safeFlags(raw.claimedTrials,EVENT_TRIALS.map(t=>t.id)),archiveBuys:safeFlags(raw.archiveBuys,CATALOG.filter(f=>(f.catalogOnly&&!f.unreleased) || f.id==='spooky-mummy').map(f=>f.id))};
}
function sanitizeTrade(t){
 const d=blankV5().trade;if(!t||typeof t!=='object')return d;
 const today=dateKey();
 const deals=safeFlags(t.deals,TRADE_PARTNERS.map(x=>x.id));
 const customDeals=safeFlags(t.customDeals,CATALOG.filter(eligibleToTrade).map(x=>x.id));
 return {date:today,deals:t.date===today?deals:{},customDeals:t.date===today?customDeals:{},proposals:t.date===today?Math.min(3,maxInt(t.proposals)):0,accepted:maxInt(t.accepted)};
}
function sanitizeProgress(p){
 const d=blankV5().progress;if(!p||typeof p!=='object')return d;
 return {favorites:safeFlags(p.favorites,CATALOG.map(f=>f.id)),achievements:safeFlags(p.achievements,ACHIEVEMENTS.map(a=>a.id)),milestones:safeFlags(p.milestones,MILESTONE_PERCENTS.map(String)),sold:maxInt(p.sold)};
}
let save = newSave(), userArt = {}, selectedPack='medieval', selectedQty=1, filter='All', sourceFilter='All', search='', busy=false;
let collectionSort='name',onlyOwned=false,onlyFaves=false;
let revealTimer=null, toastTimer=null;
const randomOne = a => a[Math.floor(Math.random()*a.length)];
function hash(str){let h=2166136261;for(const ch of str){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0;}
function validateSave(s){
 if(!s || typeof s!=='object' || s.version!==1 || !s.inventory || typeof s.inventory!=='object' || !s.purchases || typeof s.purchases!=='object') throw Error('Invalid save format');
 const inv={};for(const f of CATALOG)inv[f.id]=maxInt(s.inventory[f.id])+(f.id==='dink'?maxInt(s.inventory.ding):0);
 const purchases={};for(const [k,v] of Object.entries(s.purchases).slice(-1000)) if(/^\d{4}-\d{2}-\d{2}:[a-z0-9-]+$/.test(k) && v===true) purchases[k]=true;
 return {version:1,tokens:maxInt(s.tokens),shards:maxInt(s.shards),inventory:inv,lastSpin:Math.max(0,Math.min(Date.now(),Number(s.lastSpin)||0)),purchases,event:sanitizeEvents(s.event),trade:sanitizeTrade(s.trade),progress:sanitizeProgress(s.progress),v6:sanitizeV6(s.v6)};
}
function persist(){localStorage.setItem(WEB_KEY,JSON.stringify(save));}
function loadSave(){try{const raw=localStorage.getItem(WEB_KEY);if(raw)save=validateSave(JSON.parse(raw));else persist();}catch(e){console.warn('Save could not be read',e);notice('Local storage unavailable or save invalid. Export backups regularly.');}}
function imageSources(f){return [...new Set([userArt[f.id],CDN_IMAGE_URLS[f.name],IMAGE_URLS[f.name]].filter(Boolean))];}
function cardArt(f){
 const urls=imageSources(f),url=urls[0];
 return `<div class="art ${f.rarity==='Mystical'?`mystical-art mystic-${f.id}`:''}" aria-label="Artwork for ${escapeHtml(f.name)}">${url ? `<img loading="lazy" alt="${escapeHtml(f.name)}" src="${escapeHtml(url)}" data-image-urls="${escapeHtml(JSON.stringify(urls))}" data-next-image="1" referrerpolicy="no-referrer"><div class="image-error" hidden>OG image unavailable</div>` : `<div class="image-error">OG image unavailable</div>`}</div>`;
}
document.addEventListener('error',event=>{
 const img=event.target;
 if(!(img instanceof HTMLImageElement) || !img.closest('.art'))return;
 let sources=[];try{sources=JSON.parse(img.dataset.imageUrls||'[]');}catch{}
 const next=Number(img.dataset.nextImage||1);
 if(next<sources.length){img.dataset.nextImage=String(next+1);img.src=sources[next];return;}
 img.hidden=true;img.style.display='none';const label=img.nextElementSibling;if(label)label.hidden=false;
},true);
function labelRarity(r){return `<span class="rarity-label rarity-${escapeHtml(r.toLowerCase())}">${escapeHtml(r)}</span>`;}
function notice(msg){const t=$('toast');t.textContent=msg;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),3500);}
function switchTab(id){
 document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p.id===id));
 document.querySelectorAll('#nav [data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===id));
 window.scrollTo({top:0,behavior:'instant'});
 if(id==='collection')drawCollection();
 if(id==='history')drawHistory();
 if(id==='market')drawMarket();
 if(id==='packs')drawPackOdds();
 if(id==='desk')renderTradeDesk();
 if(id==='progress')renderProgress();
 if(id==='vault')drawVault();
 if(id==='events')drawEvents();
}
function availableItems(p){
 if(p.id!=='space')return p.items;
 const days=['Green Astronaut','Pink Astronaut','Yellow Astronaut','Black Astronaut','Orange Astronaut','Red Astronaut','Brown Astronaut'];
 const today=days[new Date().getUTCDay()];
 return p.items.map(x=>x[1]==='Chroma'?[x[0],x[1],x[0]===today?.05:0]:x);
}
function getSelectedPack(){return PACKS.find(p=>p.id===selectedPack)||PACKS[0];}
function chooseWeighted(p){const items=availableItems(p).filter(row=>Number(row[2])>0);const total=items.reduce((sum,row)=>sum+row[2],0);if(total<=0)throw Error('This pack has no available entries');let roll=Math.random()*total;for(const row of items){roll-=row[2];if(roll<0)return MAP[slug(row[0])];}return MAP[slug(items[items.length-1][0])];}
function buildFeatures(){
 const featured=['medieval','space','bot','spooky'];
 $('featured-packs').innerHTML=featured.map(id=>{
  const p=PACKS.find(x=>x.id===id), f=MAP[slug(p.items[0][0])];
  return `<button class="feature-card" data-feature="${id}"><span class="tag">50 tokens</span>${cardArt(f)}<strong>${escapeHtml(p.name)}</strong><small>View pack & odds →</small></button>`;
 }).join('');
 const hero=MAP['spooky-ghost']||MAP['king'];$('hero-preview').innerHTML=cardArt(hero);
}
function buildPackSelector(){
 $('pack-select').innerHTML=PACKS.map(p=>`<option value="${p.id}">${escapeHtml(p.name)}${p.free?' · gallery':''}</option>`).join('');
 $('pack-select').value=selectedPack;
 $('pack-select').addEventListener('change',e=>{selectedPack=e.target.value;drawPackOdds();});
 $('buy-amount').addEventListener('change',e=>{selectedQty=Math.max(1,Math.min(100,Number(e.target.value)||1));drawPackOdds();});
 drawPackOdds();
}
function drawPackOdds(){
 const p=getSelectedPack(),items=availableItems(p);
 const weighted=items.reduce((a,x)=>a+x[2],0);
 $('pack-name').textContent=p.name;
 $('pack-poster-name').textContent=p.name;
 $('pack-count').textContent=`${items.length} blooks`;
 $('pack-poster-art').innerHTML=cardArt(MAP[slug(items.find(i=>i[2]>0)?.[0]||items[0][0])]);
 $('odds').innerHTML=(p.free?'<p class="fine-print">Free starter Blooks: gallery only.</p>':'')+items.map(([name,r,rate])=>{
  const b=MAP[slug(name)];const shown=p.free?'Starter':`${weighted ? (rate/weighted*100).toFixed(3) : '0.000'}%`;
  return `<div class="odds-line">${cardArt(b)}<div class="odds-text"><strong>${escapeHtml(name)}</strong><small>${escapeHtml(r)}</small></div><span class="chance">${shown}</span><button class="odds-info" data-blook-info="${b.id}">How to obtain</button></div>`;
 }).join('');
 $('total-cost').textContent=`${fmt(TOKEN_PRICE*selectedQty)} ✦`;
 $('open-pack').textContent=p.free?'Starter gallery only':`Open ${selectedQty} pack${selectedQty>1?'s':''} →`;
 $('open-pack').disabled=Boolean(p.free)||busy||save.tokens<TOKEN_PRICE*selectedQty;
 $('pack-note').textContent=p.free?'These starter Blooks are viewable in the gallery.':`${selectedQty} pack${selectedQty>1?'s':''} × 50 local tokens. Each draw uses the shown snapshot odds.`;
}
function offerDefs(){
 const k=dateKey(),choices=[['king',450],['red-astronaut',1750],['pink-astronaut',1750],['green-astronaut',1750],['unicorn',250],['mad-hatter',250],['rainbow-panda',8500],['mega-bot',700],['astronaut',850],['yeti',600],['ice-slime',2400],['baby-shark',650],['spooky-pumpkin',1950],['teal-platypus',2200],['dragon',100],['chameleon',250]];
 const arr=choices.filter(([id])=>Boolean(MAP[id]));let seed=hash('bazaar:'+k);
 for(let i=arr.length-1;i>0;i--){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const j=seed%(i+1);[arr[i],arr[j]]=[arr[j],arr[i]];}
 return arr.slice(0,6).map(([id,price])=>({id,price,key:`${k}:${id}`}));
}
function drawMarket(){
 $('rotation').textContent=`Rotation: ${dateKey()} UTC`;
 $('offers').innerHTML=offerDefs().map(o=>{
  const f=MAP[o.id],bought=save.purchases[o.key];return `<article class="card">${cardArt(f)}${labelRarity(f.rarity)}<h3>${escapeHtml(f.name)}</h3><p>A one-time daily deal. Yours to keep in this local collection.</p><div class="details"><strong>◈ ${fmt(o.price)} shards</strong><span>${bought?'Sold out':'Available'}</span></div><button data-offer="${escapeHtml(o.key)}" ${bought||save.shards<o.price?'disabled':''}>${bought?'Purchased':'Claim offer'}</button></article>`;
 }).join('');
}
function drawRecipes(){
 $('recipes').innerHTML=RECIPES.filter(r=>r.id!=='mystic').map(r=>{
  const f=MAP[r.rewardPool.find(x=>MAP[x])];if(!f)return '';
  const can=save.shards>=r.shards&&r.requires.every(([id,n])=>countOf(id)>=n);
  return `<article class="card">${cardArt(f)}${labelRarity(f.rarity)}<h3>${escapeHtml(r.title)}</h3><p>${escapeHtml(r.desc)}</p><div class="details"><strong>◈ ${fmt(r.shards)} shards</strong><span>${can?'Ready':'Need ingredients'}</span></div><p>${r.requires.map(([id,n])=>`${n}× ${escapeHtml(MAP[id]?.name||id)} (own ${countOf(id)})`).join(' · ')}</p><button data-recipe="${escapeHtml(r.id)}" ${can?'':'disabled'}>Trade at the altar</button></article>`;
 }).join('');
}
function sourceCategory(f){
 if(f.source)return f.source;
 if(f.rarity==='Mystical')return 'Mystical';
 const p=PACKS.find(p=>p.id===f.pack);
 if(p?.free)return 'Starter';
 if(p?.special)return 'Seasonal';
 return 'Pack';
}
function sourceDescription(f){
 if(f.sourceDetail)return f.sourceDetail;
 const p=PACKS.find(p=>p.id===f.pack);
 return p ? p.name : 'Historical event';
}
function drawCollection(){
 const fs=CATALOG.filter(f=>(filter==='All'||f.rarity===filter)&&(sourceFilter==='All'||sourceCategory(f)===sourceFilter)&&f.name.toLowerCase().includes(search)&&(!onlyOwned||countOf(f.id)>0)&&(!onlyFaves||save.progress.favorites[f.id]));
 fs.sort((a,b)=>collectionSort==='rarity'?RARITY_RANK[b.rarity]-RARITY_RANK[a.rarity]||a.name.localeCompare(b.name):collectionSort==='owned'?countOf(b.id)-countOf(a.id)||a.name.localeCompare(b.name):collectionSort==='duplicates'?Math.max(0,countOf(b.id)-1)-Math.max(0,countOf(a.id)-1)||a.name.localeCompare(b.name):a.name.localeCompare(b.name));
 const total=CATALOG.reduce((sum,f)=>sum+countOf(f.id),0), owned=CATALOG.filter(f=>countOf(f.id)>0), unique=owned.length;
 const top=owned.reduce((best,f)=>RARITY_RANK[f.rarity]>RARITY_RANK[best||'']?f.rarity:best,'');
 $('stat-unique').textContent=fmt(unique);$('stat-total').textContent=fmt(total);$('stat-top').textContent=top||'—';$('stat-worth').textContent=fmt(collectionWorth());
 $('collection-grid').innerHTML=fs.length ? fs.map(f=>{
  const n=countOf(f.id),price=SELL_PRICES[f.rarity]??0,lockedReward=f.catalogOnly||f.pack==='event';
  return `<article class="card ${!n?'empty-card':''}"><button class="favorite-btn ${save.progress.favorites[f.id]?'on':''}" data-favorite="${f.id}" aria-label="${save.progress.favorites[f.id]?'Remove favorite':'Add favorite'}: ${escapeHtml(f.name)}" title="Favorite">${save.progress.favorites[f.id]?'♥':'♡'}</button><button class="catalog-art-button" data-blook-info="${f.id}" aria-label="View how to obtain ${escapeHtml(f.name)}">${cardArt(f)}</button>${labelRarity(f.rarity)}<h3>${escapeHtml(f.name)}</h3><p class="catalog-source">${escapeHtml(sourceCategory(f))} · ${escapeHtml(sourceDescription(f))}${f.catalogOnly?' · Event reward':''}</p><div class="details"><span>${n?'Discovered':'Undiscovered'}</span><strong>Owned: ${fmt(n)}</strong></div><div class="item-actions"><button class="obtain-btn" data-blook-info="${f.id}">How to obtain →</button>${n&&price&&!lockedReward ? `<button data-sell-one="${f.id}">Sell 1 · ${price}✦</button><button data-sell-extra="${f.id}" ${n<2?'disabled':''}>Sell extras</button>` : '<span class="fine-print">'+(lockedReward?'Event Hall collectible · not sellable':'Not sellable')+'</span>'}</div></article>`;
 }).join('') : '<p>No Blooks match this filter.</p>';
}
function drawVault(){
 const remaining=3600000-(Date.now()-save.lastSpin);
 $('spin').disabled=remaining>0||busy;
 $('spin-status').textContent=remaining>0?`Next spin in ${Math.floor(remaining/60000)}m ${Math.ceil(remaining%60000/1000)}s`:'Your hourly spin is ready!';
}
function render(){
 $('tokens').textContent=fmt(save.tokens);$('shards').textContent=fmt(save.shards);
 drawPackOdds();drawVault();drawRecipes();
 if($('events').classList.contains('active'))drawEvents();
 if($('collection').classList.contains('active'))drawCollection();
 if($('market').classList.contains('active'))drawMarket();
 if($('desk').classList.contains('active'))renderTradeDesk();
 if($('progress').classList.contains('active'))renderProgress();
 if($('history').classList.contains('active'))drawHistory();
}
function award(f,n=1){save.inventory[f.id]=countOf(f.id)+n;}
function showReveal(f,count){
 const over=$('reveal-overlay'),curtain=$('stripe-curtain');
 $('reveal-kicker').textContent=count===1?'A NEW DISCOVERY':`${count} PACKS OPENED`;
 $('reveal-art').innerHTML=cardArt(f);
 $('reveal-rarity').textContent=f.rarity;
 $('reveal-rarity').className=`rarity-label rarity-${f.rarity.toLowerCase()}`;
 $('reveal-title').textContent=f.name;
 $('reveal-subtitle').textContent=count===1?'Added to your local collection':'Featured pull · See all results below';
 $('reveal-done').hidden=true;
 curtain.className='stripe-curtain';
 curtain.innerHTML=Array.from({length:8},(_,i)=>`<span class="stripe" style="--i:${i}"></span>`).join('');
 over.hidden=false;
 clearTimeout(revealTimer);
 revealTimer=setTimeout(()=>{curtain.classList.add('fading');$('reveal-done').hidden=false;},1550);
}
function closeReveal(){
 clearTimeout(revealTimer);$('reveal-overlay').hidden=true;$('stripe-curtain').innerHTML='';
}
function showResults(results,p){
 if(results.length===1){const f=results[0];$('pull-result').innerHTML=`<span class="eyebrow">LATEST PULL</span><div class="result-art">${cardArt(f)}</div>${labelRarity(f.rarity)}<h3>${escapeHtml(f.name)}</h3><p>Discovered in the ${escapeHtml(p.name)} · +1 to your collection</p>`;}
 else{
  const groups=new Map();for(const f of results){const entry=groups.get(f.id)||{f,n:0};entry.n++;groups.set(f.id,entry);}
  const items=[...groups.values()].sort((a,b)=>RARITY_RANK[b.f.rarity]-RARITY_RANK[a.f.rarity]||b.n-a.n);
  $('pull-result').innerHTML=`<span class="eyebrow">BULK OPENING COMPLETE</span><h3>${results.length} packs opened · ${items.length} unique Blooks</h3><p>All ${results.length} items were saved to your local collection.</p><div class="result-grid">${items.map(({f,n})=>`<div class="result-card">${cardArt(f)}<strong>${escapeHtml(f.name)}</strong><small>${escapeHtml(f.rarity)} · ×${n}</small></div>`).join('')}</div>`;
 }
}
function openPacks(){
 if(busy)return;
 const p=getSelectedPack();if(p.free)return notice('This is a starter gallery, not a purchasable pack.');
 const n=selectedQty,cost=n*TOKEN_PRICE;
 try{const current=localStorage.getItem(WEB_KEY);if(current)save=validateSave(JSON.parse(current));}catch(e){console.warn('Could not refresh local save',e);}
 if(save.tokens<cost)return notice(`Need ${fmt(cost)} local tokens; you have ${fmt(save.tokens)}.`);
 busy=true;let results=[];
 try{
  for(let i=0;i<n;i++){const f=chooseWeighted(p);if(!f)throw Error('Pack entry unavailable');results.push(f);}
  save.tokens-=cost;
  for(const f of results)award(f);
  recordPackOpen(p.id,n);
  persist();
  showResults(results,p);
  render();
  const top=[...results].sort((a,b)=>RARITY_RANK[b.rarity]-RARITY_RANK[a.rarity])[0];
  showReveal(top,n);
  notice(`Opened ${n} pack${n>1?'s':''} and saved ${n} item${n>1?'s':''}!`);
 }catch(e){notice(`Could not open pack: ${e.message}`);}finally{busy=false;drawPackOdds();drawVault();}
}
function fillArtworkSettings(){
 $('art-blook').innerHTML=CATALOG.slice().sort((a,b)=>a.name.localeCompare(b.name)).map(f=>`<option value="${f.id}">${escapeHtml(f.name)}</option>`).join('');
 $('art-blook').addEventListener('change',syncArtworkInput);syncArtworkInput();
}
function syncArtworkInput(){const f=MAP[$('art-blook').value];$('art-url').value=userArt[f?.id]||'';}
function validImageUrl(s){try{const u=new URL(s);return u.protocol==='https:' && u.username==='' && u.password==='';}catch{return false;}}
function saveArtwork(){
 const id=$('art-blook').value,url=$('art-url').value.trim();if(!MAP[id])return;
 if(!validImageUrl(url))return notice('Please enter a valid HTTPS image URL.');
 if(url.length>2000)return notice('Image URL is too long.');
 userArt[id]=url;localStorage.setItem(ART_KEY,JSON.stringify(userArt));
 buildFeatures();render();if($('collection').classList.contains('active'))drawCollection();notice('Artwork URL saved for '+MAP[id].name);
}
function resetArtwork(){const id=$('art-blook').value;delete userArt[id];localStorage.setItem(ART_KEY,JSON.stringify(userArt));syncArtworkInput();buildFeatures();render();notice('Restored original artwork URL for '+MAP[id].name);}
function exportSave(){
 const payload=JSON.stringify(save,null,2),file=new Blob([payload],{type:'application/json'}),url=URL.createObjectURL(file),a=document.createElement('a');a.href=url;a.download='twilight-bazaar-v6-save.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),2500);
}
async function importSave(event){
 const file=event.target.files?.[0];if(!file)return;
 try{if(file.size>450000)throw Error('The save file is too large.');const incoming=validateSave(JSON.parse(await file.text()));if(!confirm('Replace your current website collection with this imported save?'))return;save=incoming;persist();render();drawCollection();drawMarket();notice('Save imported!');}
 catch(e){notice('Import failed: '+e.message);}finally{event.target.value='';}
}
function ensureEventDay(){
 if(save.event.daily.date===dateKey())return false;
 save.event.daily={date:dateKey(),opens:0,salvaged:0,spins:0,trades:0,claimed:{}};
 return true;
}
function recordDaily(stat,amount){ensureEventDay();save.event.daily[stat]=maxInt(save.event.daily[stat]+amount);}
function recordPackOpen(packId,amount){
 const stats=save.event.stats,before=stats.packsOpened;
 stats.packsOpened=maxInt(stats.packsOpened+amount);
 stats.packsById[packId]=maxInt((stats.packsById[packId]||0)+amount);
 recordDaily('opens',amount);
 const reward=Math.floor(stats.packsOpened/10)-Math.floor(before/10);
 if(reward>0)save.event.seals=maxInt(save.event.seals+reward);
}
function progressBar(current,target){const percent=Math.min(100,Math.round(current/target*100));return `<div class="progress-track" role="progressbar" aria-valuenow="${Math.min(current,target)}" aria-valuemin="0" aria-valuemax="${target}"><div class="progress-fill" style="width:${percent}%"></div></div>`;}
function renderDailyMissions(){
 const d=save.event.daily;
 $('mission-date').textContent=`${d.date} UTC · Resets at 00:00 UTC`;
 $('daily-missions').innerHTML=EVENT_MISSIONS.map(m=>{
  const n=Math.min(m.goal,d[m.stat]||0),done=n>=m.goal,claimed=!!d.claimed[m.id];
  return `<article class="mission-card"><div class="mission-top"><span class="mission-icon">✧</span><span class="mission-reward">+${m.reward} seals</span></div><h3>${escapeHtml(m.name)}</h3><p>${escapeHtml(m.description)}</p>${progressBar(n,m.goal)}<div class="mission-foot"><small>${n} / ${m.goal}</small><button data-claim-mission="${m.id}" ${claimed||!done?'disabled':''}>${claimed?'Claimed':done?'Claim reward':'In progress'}</button></div></article>`;
 }).join('');
}
function renderTrials(){
 const e=save.event;
 $('mystical-trials').innerHTML=EVENT_TRIALS.map(t=>{
  const f=MAP[t.id],p=PACKS.find(x=>x.id===t.pack),have=Math.min(t.opens,e.stats.packsById[t.pack]||0),owns=countOf(t.required)>0;
  const claimed=!!e.claimedTrials[t.id] || countOf(t.id)>0;
  const ready=have>=t.opens && owns && e.seals>=t.seals;
  return `<article class="trial-card ${claimed?'trial-complete':''}"><div class="trial-visual">${cardArt(f)}<span class="trial-status">${claimed?'UNLOCKED':'MYSTICAL TRIAL'}</span></div><div class="trial-details"><span class="eyebrow">${escapeHtml(t.subtitle)}</span><h3>${escapeHtml(f.name)}</h3><div class="trial-task"><span>${escapeHtml(p.name)} opened</span><strong>${have} / ${t.opens}</strong></div>${progressBar(have,t.opens)}<div class="trial-task"><span>Own ${escapeHtml(MAP[t.required].name)}</span><strong>${owns?'✓ Ready':'Needed'}</strong></div><div class="trial-task"><span>Event seals</span><strong>${Math.min(e.seals,t.seals)} / ${t.seals} ✧</strong></div>${progressBar(e.seals,t.seals)}${t.hint?`<small class="trial-hint">${escapeHtml(t.hint)}</small>`:''}<button class="primary wide" data-claim-trial="${t.id}" ${claimed||!ready?'disabled':''}>${claimed?'Already unlocked':ready?'Unlock Mystical →':'Complete requirements first'}</button><small>No pack odds changed. Required Blooks are not consumed.</small></div></article>`;
 }).join('');
}
function archiveOffers(){
 const categories=['Seasonal','Event','Retired','Unique','Pack archive'];
 const eligible=CATALOG.filter(f=>(f.catalogOnly||f.id==='spooky-mummy')&&!f.unreleased&&f.rarity!=='Mystical');
 const today=dateKey(),offset=hash('event-categories:'+today)%categories.length;
 // Four different categories each day, with deterministic choices across browsers.
 const selected=Array.from({length:4},(_,i)=>categories[(offset+i)%categories.length]);
 return selected.map(cat=>{
  const pool=eligible.filter(f=>sourceCategory(f)===cat||(f.id==='spooky-mummy'&&cat==='Event'));
  if(!pool.length)return null;
  const pos=hash('archive:'+today+':'+cat)%pool.length;
  return {f:pool[pos],category:cat,price:EVENT_EXCHANGE_PRICES[cat]||25};
 }).filter(Boolean);
}
function renderArchiveOffers(){
 $('archive-reset').textContent=`Rotating offers · ${dateKey()} UTC`;
 $('archive-offers').innerHTML=archiveOffers().map(({f,category,price})=>{
  const obtained=!!save.event.archiveBuys[f.id]||countOf(f.id)>0;
  const enough=save.event.seals>=price;
  return `<article class="card archive-card">${cardArt(f)}${labelRarity(f.rarity)}<span class="archive-tag">${escapeHtml(category)}</span><h3>${escapeHtml(f.name)}</h3><p>Independent simulator archive reward. One per collection; not a real Blooket offer.</p><div class="details"><strong>✧ ${price} event seals</strong><span>${obtained?'Collected':'Daily offer'}</span></div><button data-claim-archive="${f.id}" ${obtained||!enough?'disabled':''}>${obtained?'In collection':enough?'Exchange seals →':'Not enough seals'}</button></article>`;
 }).join('');
}
function drawEvents(){
 ensureEventDay();
 $('event-seals').textContent=fmt(save.event.seals);
 const won=EVENT_TRIALS.filter(t=>save.event.claimedTrials[t.id]||countOf(t.id)>0).length;
 $('trial-count').textContent=`${won} / ${EVENT_TRIALS.length}`;
 renderDailyMissions();renderTrials();renderArchiveOffers();
}
function bindEventHall(){
 $('daily-missions').addEventListener('click',ev=>{
  const b=ev.target.closest('[data-claim-mission]');if(!b||busy)return;
  ensureEventDay();const m=EVENT_MISSIONS.find(x=>x.id===b.dataset.claimMission);if(!m)return;
  const d=save.event.daily;
  if(d.claimed[m.id] || d[m.stat]<m.goal)return;
  d.claimed[m.id]=true;save.event.seals=maxInt(save.event.seals+m.reward);persist();drawEvents();notice(`Mission complete: +${m.reward} event seals!`);
 });
 $('mystical-trials').addEventListener('click',ev=>{
  const b=ev.target.closest('[data-claim-trial]');if(!b||busy)return;
  const t=EVENT_TRIALS.find(x=>x.id===b.dataset.claimTrial),e=save.event;
  if(!t||e.claimedTrials[t.id]||countOf(t.id)>0||countOf(t.required)<1 || (e.stats.packsById[t.pack]||0)<t.opens || e.seals<t.seals)return;
  e.seals-=t.seals;e.claimedTrials[t.id]=true;award(MAP[t.id]);persist();drawEvents();notice('Unlocked '+MAP[t.id].name+' in your local collection!');
 });
 $('archive-offers').addEventListener('click',ev=>{
  const b=ev.target.closest('[data-claim-archive]');if(!b||busy)return;
  const offer=archiveOffers().find(x=>x.f.id===b.dataset.claimArchive);if(!offer)return;
  const {f,price}=offer,e=save.event;
  if(e.archiveBuys[f.id]||countOf(f.id)>0||e.seals<price)return;
  e.seals-=price;e.archiveBuys[f.id]=true;award(f);persist();drawEvents();notice(`${f.name} added to your local collection!`);
 });
}
function bindEvents(){
 $('nav').addEventListener('click',e=>{const b=e.target.closest('[data-tab]');if(b)switchTab(b.dataset.tab);});
 document.addEventListener('click',e=>{
  const b=e.target.closest('[data-go]');if(b)switchTab(b.dataset.go);
  const ft=e.target.closest('[data-feature]');if(ft){selectedPack=ft.dataset.feature;$('pack-select').value=selectedPack;drawPackOdds();switchTab('packs');}
 });
 $('open-pack').addEventListener('click',openPacks);
 $('reveal-skip').addEventListener('click',closeReveal);
 $('reveal-done').addEventListener('click',closeReveal);
 $('reveal-overlay').addEventListener('click',e=>{if(e.target===$('reveal-overlay'))closeReveal();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape' && !$('reveal-overlay').hidden)closeReveal();});
 $('filters').addEventListener('click',e=>{const b=e.target.closest('[data-filter]');if(!b)return;filter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>x.classList.toggle('active',x===b));drawCollection();});
 $('collection-search').addEventListener('input',e=>{search=e.target.value.toLowerCase().trim();drawCollection();});
 $('source-filter').addEventListener('change',e=>{sourceFilter=e.target.value;drawCollection();});
 bindEventHall();
 $('collection-grid').addEventListener('click',e=>{
  const b=e.target.closest('[data-sell-one],[data-sell-extra]');if(!b)return;
  const id=b.dataset.sellOne||b.dataset.sellExtra,f=MAP[id];if(!f||f.catalogOnly||f.pack==='event')return;const n=countOf(id),amt=b.dataset.sellExtra?Math.max(0,n-1):1,price=SELL_PRICES[f.rarity]||0;
  if(n<amt||!amt||!price)return;
  if(amt>=10&&!confirm(`Sell ${amt} copies of ${f.name} for ${fmt(amt*price)} local tokens?`))return;
  save.inventory[id]-=amt;save.tokens+=amt*price;save.progress.sold=maxInt(save.progress.sold+amt);persist();render();drawCollection();notice(`Sold ${amt} × ${f.name} for ${fmt(amt*price)} tokens.`);
 });
 $('offers').addEventListener('click',e=>{const b=e.target.closest('[data-offer]');if(!b||busy)return;const o=offerDefs().find(x=>x.key===b.dataset.offer);if(!o||save.purchases[o.key]||save.shards<o.price)return;save.shards-=o.price;award(MAP[o.id]);save.purchases[o.key]=true;persist();render();drawMarket();notice('Claimed '+MAP[o.id].name);});
 $('recipes').addEventListener('click',e=>{const b=e.target.closest('[data-recipe]');if(!b||busy)return;const r=RECIPES.find(x=>x.id===b.dataset.recipe);if(!r||save.shards<r.shards||r.requires.some(([id,n])=>countOf(id)<n))return;const reward=MAP[randomOne(r.rewardPool.filter(id=>MAP[id]))];if(!reward)return;for(const [id,n]of r.requires)save.inventory[id]-=n;save.shards-=r.shards;award(reward);recordDaily('trades',1);persist();render();notice('Traded for '+reward.name);});
 $('spin').addEventListener('click',()=>{if(busy)return;if(Date.now()-save.lastSpin<3600000)return notice('Spin is on cooldown.');const amount=10000+Math.floor(Math.random()*10001);save.tokens+=amount;save.lastSpin=Date.now();recordDaily('spins',1);persist();render();notice('Lantern spin: +'+fmt(amount)+' tokens!');});
 $('salvage').addEventListener('click',()=>{let count=0,gain=0;for(const f of CATALOG){const unit=f.rarity==='Uncommon'?15:f.rarity==='Rare'?45:0,n=Math.max(0,countOf(f.id)-1);if(unit&&n){save.inventory[f.id]-=n;gain+=n*unit;count+=n;}}if(!count)return notice('No spare Uncommon or Rare Blooks to salvage.');save.shards+=gain;recordDaily('salvaged',count);persist();render();notice(`Salvaged ${count} extras for ${fmt(gain)} shards.`);});
 $('export').addEventListener('click',exportSave);
 $('import').addEventListener('change',importSave);
 $('reset').addEventListener('click',()=>{if(!confirm('Erase your ENTIRE local Twilight Bazaar collection? Export a backup first.'))return;save=newSave();persist();$('pull-result').innerHTML='<span class="eyebrow">YOUR NEXT DISCOVERY</span><p>Start a new collection with a pack.</p>';render();drawCollection();drawMarket();notice('Local collection reset.');});
 $('save-art').addEventListener('click',saveArtwork);
 $('clear-art').addEventListener('click',resetArtwork);
 window.addEventListener('storage',e=>{if(e.key!==WEB_KEY||!e.newValue||busy)return;try{save=validateSave(JSON.parse(e.newValue));render();}catch(err){console.warn('Save sync failed',err);}});
 setInterval(()=>{if($('vault').classList.contains('active'))drawVault();if($('events').classList.contains('active') && ensureEventDay()){persist();drawEvents();}},15000);
}
function setup(){
 try{userArt=JSON.parse(localStorage.getItem(ART_KEY)||'{}');if(!userArt||typeof userArt!=='object'||Array.isArray(userArt))userArt={};}catch{userArt={};}
 loadSave();buildFeatures();buildPackSelector();fillArtworkSettings();bindEvents();bindV5();bindV6();render();drawMarket();drawCollection();
}
// v5: local-only trade studio, collectible achievements, collection milestones.
// The "partner" is a deterministic simulator, not a real other person.
const TRADE_VALUES={Common:0,Uncommon:12,Rare:42,Epic:140,Legendary:480,Chroma:2100,Unique:0,Mystical:0};
const TRADE_PARTNERS=[
 {id:'witch-dragon',name:'Moonlight Merchant',request:'witch',qty:3,reward:'dragon'},
 {id:'alien-ufo',name:'Nebula Navigator',request:'alien',qty:4,reward:'ufo'},
 {id:'wizard-jester',name:'Royal Archivist',request:'wizard',qty:4,reward:'jester'},
 {id:'toast-waffle',name:'Breakfast Trader',request:'toast',qty:4,reward:'waffle'},
 {id:'panda-elephant',name:'Safari Collector',request:'panda',qty:4,reward:'elephant'},
 {id:'crab-pufferfish',name:'Deep Sea Diver',request:'crab',qty:4,reward:'pufferfish'}
];
const ACHIEVEMENTS=[
 {id:'starter',name:'First steps',desc:'Own 10 distinct Blooks',target:10,reward:{tokens:500},progress:()=>uniqueOwned()},
 {id:'collector',name:'Treasure keeper',desc:'Own 30 distinct Blooks',target:30,reward:{shards:250},progress:()=>uniqueOwned()},
 {id:'pack-10',name:'Pack explorer',desc:'Open 10 paid packs',target:10,reward:{tokens:1000},progress:()=>save.event.stats.packsOpened},
 {id:'pack-100',name:'Pack master',desc:'Open 100 paid packs',target:100,reward:{seals:10},progress:()=>save.event.stats.packsOpened},
 {id:'trade-1',name:'Deal maker',desc:'Complete 1 simulated trade',target:1,reward:{tokens:750},progress:()=>save.trade.accepted},
 {id:'trade-10',name:'Trading legend',desc:'Complete 10 simulated trades',target:10,reward:{seals:8},progress:()=>save.trade.accepted},
 {id:'seller',name:'Bazaar business',desc:'Sell 10 duplicate Blooks',target:10,reward:{shards:300},progress:()=>save.progress.sold},
 {id:'mystical',name:'Beyond the stars',desc:'Own a Mystical Blook',target:1,reward:{seals:12},progress:()=>CATALOG.filter(f=>f.rarity==='Mystical'&&countOf(f.id)>0).length}
];
const MILESTONE_PERCENTS=[25,50,75,100];
const MILESTONE_REWARDS={25:{tokens:2500},50:{shards:2000},75:{seals:30},100:{tokens:20000,seals:50}};
function uniqueOwned(){return CATALOG.filter(f=>countOf(f.id)>0).length;}
function collectionWorth(){return CATALOG.reduce((sum,f)=>sum+countOf(f.id)*(SELL_PRICES[f.rarity]||0),0);}
function eligibleToTrade(f){return Boolean(f&&!f.catalogOnly&&f.pack!=='event'&&f.rarity!=='Mystical'&&f.rarity!=='Unique'&&f.rarity!=='Common');}
function rewardText(reward){return Object.entries(reward).map(([k,v])=>`${fmt(v)} ${k==='tokens'?'✦ tokens':k==='shards'?'◈ shards':'✧ event seals'}`).join(' · ');}
function creditReward(reward){if(reward.tokens)save.tokens=maxInt(save.tokens+reward.tokens);if(reward.shards)save.shards=maxInt(save.shards+reward.shards);if(reward.seals)save.event.seals=maxInt(save.event.seals+reward.seals);}
function v5Clock(){if(save.trade.date===dateKey())return false;save.trade.date=dateKey();save.trade.deals={};save.trade.customDeals={};save.trade.proposals=0;return true;}
function tradeScore(f){return TRADE_VALUES[f?.rarity]||0;}
function dailyPartnerStock(){
 const ids=['dragon','jester','queen','unicorn','ufo','planet','spaceship','waffle','pancakes','pufferfish','elephant','velociraptor','kraken','taco','lion','mega-bot'];
 const eligible=ids.filter(id=>eligibleToTrade(MAP[id]));const seed=hash('partner:'+dateKey());
 return eligible.map((id,i)=>({id,order:hash('partner:'+seed+':'+id)})).sort((a,b)=>a.order-b.order).slice(0,10).map(o=>MAP[o.id]);
}
let pendingTrade=null;
function fillTradeSelectors(){
 const offered=CATALOG.filter(f=>eligibleToTrade(f)&&countOf(f.id)>0).sort((a,b)=>a.name.localeCompare(b.name));
 const wanted=dailyPartnerStock();
 const gave=$('trade-give').value,requested=$('trade-get').value;
 $('trade-give').innerHTML=offered.length?offered.map(f=>`<option value="${f.id}">${escapeHtml(f.name)} (${countOf(f.id)} owned)</option>`).join(''):'<option value="">No eligible Blooks</option>';
 $('trade-get').innerHTML=wanted.map(f=>`<option value="${f.id}">${escapeHtml(f.name)} · ${f.rarity}</option>`).join('');
 if(offered.some(f=>f.id===gave))$('trade-give').value=gave;
 if(wanted.some(f=>f.id===requested))$('trade-get').value=requested;
}
function estimateTrade(){
 const f=MAP[$('trade-give').value],g=MAP[$('trade-get').value],qty=Math.max(1,Math.min(20,Math.floor(Number($('trade-qty').value)||1)));
 const valid=eligibleToTrade(f)&&dailyPartnerStock().some(x=>x.id===g?.id)&&countOf(f.id)>=qty&&g.id!==f.id;
 const yours=qty*tradeScore(f),theirs=tradeScore(g);
 $('trade-estimate').innerHTML= !f||!g ? '<p>Collect pack Blooks to start proposing trades.</p>' : `<div class="value-pair"><div><small>Your offer</small><strong>${fmt(yours)} pts</strong></div><div><small>Partner item</small><strong>${fmt(theirs)} pts</strong></div></div><p>${!valid?'Choose different Blooks and make sure you own enough.':yours>=theirs?'Your offer meets the simulated partner’s minimum.':'The partner is likely to decline this offer.'} Values are illustrative, not official Blooket values.</p>`;
 $('trade-propose').disabled=!valid||save.trade.proposals>=3||!!pendingTrade||!!save.trade.customDeals[g?.id];
 $('trade-propose').textContent=save.trade.proposals>=3?'Daily proposal limit reached':save.trade.customDeals[g?.id]?'Already traded today':'Propose a trade →';
}
function renderTradeDesk(){
 v5Clock();
 $('trade-date').textContent=`${dateKey()} UTC · Daily reset`;
 $('trade-count').textContent=`${save.trade.accepted} trades completed · ${Math.max(0,3-save.trade.proposals)} custom proposals left today`;
 $('trade-board').innerHTML=TRADE_PARTNERS.map(t=>{
 const give=MAP[t.request],get=MAP[t.reward];if(!give||!get)return '';
 const done=!!save.trade.deals[t.id],qty=countOf(give.id),can=qty>=t.qty;
 return `<article class="trade-offer card"><span class="eyebrow">${escapeHtml(t.name)}</span><div class="trade-images"><div>${cardArt(give)}<small>Give ${t.qty} × ${escapeHtml(give.name)}</small></div><span class="trade-arrow">⇄</span><div>${cardArt(get)}<small>Receive 1 × ${escapeHtml(get.name)}</small></div></div><div class="details"><span>Owned: ${qty}</span><span>${done?'Completed today':'NPC trade'}</span></div><div class="inline-actions"><button data-trade-accept="${t.id}" ${done||!can?'disabled':''}>${done?'Completed':can?'Accept trade':'Need more Blooks'}</button><button class="ghost" data-trade-decline="${t.id}" ${done?'disabled':''}>Pass</button></div></article>`;
 }).join('');
 fillTradeSelectors();estimateTrade();
 $('trade-pending').innerHTML=pendingTrade?`<strong>Offer ${pendingTrade.accepted?'accepted':'declined'} by the simulated partner</strong><p>${escapeHtml(pendingTrade.summary)}</p>${pendingTrade.accepted?'<button class="primary" id="confirm-custom-trade">Confirm exchange →</button> ':''}<button class="ghost" id="cancel-custom-trade">${pendingTrade.accepted?'Cancel offer':'Dismiss'}</button>`:'<p>Select two Blooks to compare their estimated trading values. You can approve an accepted offer before any Blooks move.</p>';
}
function claimTrade(t){
 v5Clock();if(!t||save.trade.deals[t.id])return;
 const f=MAP[t.request],g=MAP[t.reward];if(!eligibleToTrade(f)||!eligibleToTrade(g)||countOf(f.id)<t.qty)return;
 save.inventory[f.id]-=t.qty;award(g);save.trade.deals[t.id]=true;save.trade.accepted=maxInt(save.trade.accepted+1);recordDaily('trades',1);
 persist();render();renderTradeDesk();notice('Simulated trade complete: received '+g.name);
}
function sendCustomOffer(){
 v5Clock();if(pendingTrade||save.trade.proposals>=3)return;
 const give=MAP[$('trade-give').value],get=MAP[$('trade-get').value],qty=Math.max(1,Math.min(20,Math.floor(Number($('trade-qty').value)||1)));
 if(!eligibleToTrade(give)||!dailyPartnerStock().some(f=>f.id===get?.id)||give.id===get.id||countOf(give.id)<qty||save.trade.customDeals[get.id])return;
 save.trade.proposals++;const accepted=tradeScore(give)*qty>=tradeScore(get);
 pendingTrade={give:give.id,get:get.id,qty,accepted,summary:`Give ${qty} × ${give.name} in exchange for 1 × ${get.name}. ${accepted?'The partner agreed. Confirm to complete the exchange.':'The partner wants a higher-value offer.'}`};
 persist();renderTradeDesk();notice(accepted?'Partner accepted your proposal!':'Partner declined; try another offer.');
}
function confirmCustomTrade(){
 if(!pendingTrade?.accepted)return;
 const t=pendingTrade;const give=MAP[t.give],get=MAP[t.get];
 if(!eligibleToTrade(give)||!eligibleToTrade(get)||countOf(give.id)<t.qty||save.trade.customDeals[get.id])return notice('Offer expired; check your collection.');
 save.inventory[give.id]-=t.qty;award(get);save.trade.customDeals[get.id]=true;save.trade.accepted=maxInt(save.trade.accepted+1);recordDaily('trades',1);pendingTrade=null;
 persist();render();renderTradeDesk();notice('Trade completed! '+get.name+' is in your collection.');
}
function renderProgress(){
 const owned=uniqueOwned(),total=MILESTONE_TOTAL,percent=Math.floor(100*owned/total);
 $('progress-count').textContent=`${owned} / ${total} discovered · ${percent}% complete`;
 $('progress-overall').innerHTML=progressBar(owned,total);
 $('achievement-list').innerHTML=ACHIEVEMENTS.map(a=>{
  const now=Math.min(a.target,a.progress()),done=now===a.target,claimed=save.progress.achievements[a.id];
  return `<article class="milestone-card"><div class="milestone-header"><h3>${escapeHtml(a.name)}</h3><span>${claimed?'✓ Claimed':`${now}/${a.target}`}</span></div><p>${escapeHtml(a.desc)}</p>${progressBar(now,a.target)}<div class="milestone-bottom"><small>${rewardText(a.reward)}</small><button data-claim-achievement="${a.id}" ${claimed||!done?'disabled':''}>${claimed?'Claimed':done?'Claim →':'Locked'}</button></div></article>`;
 }).join('');
 $('milestone-list').innerHTML=MILESTONE_PERCENTS.map(n=>{
  const goal=Math.ceil(total*n/100),done=owned>=goal,claimed=save.progress.milestones[n];
  return `<article class="milestone-card"><div class="milestone-header"><h3>${n}% Collection</h3><span>${claimed?'✓ Claimed':`${owned}/${goal}`}</span></div>${progressBar(Math.min(owned,goal),goal)}<div class="milestone-bottom"><small>${rewardText(MILESTONE_REWARDS[n])}</small><button data-claim-milestone="${n}" ${claimed||!done?'disabled':''}>${claimed?'Claimed':done?'Claim →':'Locked'}</button></div></article>`;
 }).join('');
}
function bindV5(){
 $('collection-sort').addEventListener('change',e=>{collectionSort=e.target.value;drawCollection();});
 $('only-owned').addEventListener('change',e=>{onlyOwned=e.target.checked;drawCollection();});
 $('only-faves').addEventListener('change',e=>{onlyFaves=e.target.checked;drawCollection();});
 $('collection-grid').addEventListener('click',e=>{
  const b=e.target.closest('[data-favorite]');if(!b)return;const id=b.dataset.favorite;if(!MAP[id])return;
  if(save.progress.favorites[id])delete save.progress.favorites[id];else save.progress.favorites[id]=true;
  persist();drawCollection();
 });
 $('trade-board').addEventListener('click',e=>{
  const accept=e.target.closest('[data-trade-accept]');if(accept)claimTrade(TRADE_PARTNERS.find(t=>t.id===accept.dataset.tradeAccept));
  const decline=e.target.closest('[data-trade-decline]');if(decline){const t=TRADE_PARTNERS.find(t=>t.id===decline.dataset.tradeDecline);if(t)notice('You passed on '+t.name+'’s offer. No Blooks moved.');}
 });
 for(const id of ['trade-give','trade-get','trade-qty'])$(id).addEventListener('change',estimateTrade);
 $('trade-propose').addEventListener('click',sendCustomOffer);
 $('trade-pending').addEventListener('click',e=>{
  if(e.target.closest('#confirm-custom-trade'))confirmCustomTrade();
  if(e.target.closest('#cancel-custom-trade')){pendingTrade=null;renderTradeDesk();}
 });
 $('achievement-list').addEventListener('click',e=>{
  const b=e.target.closest('[data-claim-achievement]');if(!b)return;const a=ACHIEVEMENTS.find(a=>a.id===b.dataset.claimAchievement);
  if(!a||save.progress.achievements[a.id]||a.progress()<a.target)return;
  save.progress.achievements[a.id]=true;creditReward(a.reward);persist();render();renderProgress();notice('Achievement claimed: '+a.name);
 });
 $('milestone-list').addEventListener('click',e=>{
  const b=e.target.closest('[data-claim-milestone]');if(!b)return;const n=Number(b.dataset.claimMilestone),goal=Math.ceil(MILESTONE_TOTAL*n/100);
  if(!MILESTONE_REWARDS[n]||save.progress.milestones[n]||uniqueOwned()<goal)return;
  save.progress.milestones[n]=true;creditReward(MILESTONE_REWARDS[n]);persist();render();renderProgress();notice(n+'% collection milestone claimed!');
 });
}

// V6 — obtainment clarity and opening history. All economy mechanisms remain local.
// Same storage key/schema version as V5: no destructive migration.
function sanitizeV6(raw){
 const out=blankV6();if(!raw||typeof raw!=='object')return out;
 if(['Classic','Fast','Instant'].includes(raw.prefs?.mode))out.prefs.mode=raw.prefs.mode;
 if(!Array.isArray(raw.history))return out;
 out.history=raw.history.slice(0,V6_HISTORY_LIMIT).map(h=>{
  if(!h||typeof h!=='object'||!PACKS.some(p=>p.id===h.pack)||!Array.isArray(h.ids))return null;
  const ids=h.ids.filter(id=>typeof id==='string'&&Boolean(MAP[id])).slice(0,100);
  if(!ids.length)return null;
  return {id:typeof h.id==='string'?h.id.slice(0,48):'',date:typeof h.date==='string'?h.date.slice(0,32):'',pack:h.pack,ids,cost:ids.length*TOKEN_PRICE,firsts:Array.isArray(h.firsts)?h.firsts.filter(x=>typeof x==='string'&&MAP[x]).slice(0,100):[]};
 }).filter(Boolean);
 return out;
}
let lastOpening=null;
let showingResults=null;
let showingMode='grouped';
function newSession(p,results,firsts){
 return {id:`${Date.now()}-${Math.floor(Math.random()*100000)}`,date:new Date().toISOString(),pack:p.id,ids:results.map(f=>f.id),cost:results.length*TOKEN_PRICE,firsts:[...firsts]};
}
function drawHistory(){
 const histories=save.v6.history;
 const all=histories.flatMap(h=>h.ids.map(id=>MAP[id]).filter(Boolean));
 const stars=all.filter(f=>f.rarity==='Legendary').length,chromas=all.filter(f=>f.rarity==='Chroma').length;
 $('opening-stats').innerHTML=[['V6 sessions',histories.length],['Recorded pulls',all.length],['Tokens spent',histories.reduce((s,h)=>s+h.cost,0)],['Legendary pulls',stars],['Chroma pulls',chromas]].map(([k,v])=>`<div class="stat-card"><span>${k}</span><b>${fmt(v)}</b></div>`).join('');
 $('opening-history').innerHTML=histories.length?histories.map((h,i)=>{
  const p=PACKS.find(p=>p.id===h.pack),fs=h.ids.map(id=>MAP[id]).filter(Boolean),top=fs.slice().sort((a,b)=>RARITY_RANK[b.rarity]-RARITY_RANK[a.rarity])[0];
  return `<article class="history-entry"><div class="history-icon">${cardArt(top)}</div><div class="history-copy"><strong>${escapeHtml(p.name)} · ${fs.length} pulls</strong><small>${escapeHtml(h.date?new Date(h.date).toLocaleString():'Saved session')} · ${fmt(h.cost)} tokens · Best: ${escapeHtml(top.name)}</small></div><button data-history-index="${i}">View every pull →</button></article>`;
 }).join(''):'<div class="history-empty">No V6 openings yet. Open any paid pack and its complete results will appear here, even after you close the popup.</div>';
}
function obtainmentStatus(f){
 const p=PACKS.find(p=>p.id===f.pack),trial=EVENT_TRIALS.find(t=>t.id===f.id);
 if(f.unreleased)return {status:'Not obtainable',title:'Unreleased archival Blook',action:null};
 if(trial)return {status:save.event.claimedTrials[f.id]||countOf(f.id)?'Unlocked':'Trial',title:'Event Hall trial',action:'events'};
 if(p?.free)return {status:'Starter gallery',title:'Free starter Blook',action:'packs',pack:p.id};
 const archive=archiveOffers().find(o=>o.f.id===f.id);
 if(archive)return {status:'Available today',title:`Archive exchange · ${archive.price} event seals`,action:'events'};
 if(f.catalogOnly||f.pack==='event')return {status:countOf(f.id)?'Owned':'Not offered today',title:'Rotating Event Hall archive',action:'events'};
 if(p){
  const entry=availableItems(p).find(x=>slug(x[0])===f.id),total=availableItems(p).reduce((sum,x)=>sum+x[2],0),rate=entry?.[2]||0;
  if(rate>0)return {status:'Available to pull',title:`${p.name} · ${(100*rate/total).toFixed(3)}% shown chance`,action:'packs',pack:p.id};
  return {status:'Not available in packs now',title:p.id==='space'?'Space daily color rotation':'No active drop rate in this simulator',action:p.id==='space'?'packs':null,pack:p.id};
 }
 return {status:'Currently unavailable',title:'No simulator unlock method',action:null};
}
function infoDetailsHtml(f){
 const n=countOf(f.id),o=obtainmentStatus(f),trial=EVENT_TRIALS.find(t=>t.id===f.id),p=PACKS.find(p=>p.id===f.pack);
 let parts='';
 if(f.unreleased){
  parts='<p>This Blook is listed as unreleased by the fan-maintained Blooket Wiki. It is a <strong>gallery-only reference</strong> in Twilight Bazaar. It cannot be bought, traded, rolled, or exchanged here. No artwork or probability is invented.</p>';
 }else if(trial){
  const count=save.event.stats.packsById[trial.pack]||0,owns=countOf(trial.required)>0;
  const claimed=Boolean(save.event.claimedTrials[f.id]);
  parts=`<p>Complete all three steps in the Event Hall, then claim the Mystical. Required Blooks are <strong>not consumed</strong>.</p>
   <div class="info-step"><span>Open ${trial.opens} packs from ${escapeHtml(PACKS.find(p=>p.id===trial.pack).name)}</span><b>${Math.min(count,trial.opens)} / ${trial.opens}</b></div>${progressBar(count,trial.opens)}
   <div class="info-step"><span>Own ${escapeHtml(MAP[trial.required].name)}</span><b>${owns?'✓ Ready':'Not owned yet'}</b></div>
   <div class="info-step"><span>Have ${trial.seals} event seals</span><b>${Math.min(save.event.seals,trial.seals)} / ${trial.seals}</b></div>${progressBar(save.event.seals,trial.seals)}
   <p class="info-tip">Seals: every 10 paid pack openings gives 1 seal; daily missions, some achievements, and collection milestones can also reward seals. ${trial.hint?escapeHtml(trial.hint)+' ':''}${claimed?'This trial was already claimed.':''}</p>`;
 }else if(p?.free){
  parts=`<p>This is a free starter/gallery Blook. It is displayed in the <strong>${escapeHtml(p.name)}</strong> gallery and is not obtainable from a paid pack in this simulator. Starter Blooks are viewable without an inventory quantity.</p>`;
 }else if(f.catalogOnly||f.pack==='event'){
  const offer=archiveOffers().find(x=>x.f.id===f.id);
  parts=offer?`<p><strong>Available today!</strong> Find this Blook in the rotating Event Hall Archive Exchange for <strong>${offer.price} event seals</strong>.</p>${progressBar(save.event.seals,offer.price)}<p class="info-tip">Your seals: ${fmt(save.event.seals)} / ${offer.price}. Archive rewards are one per save and don't enter ordinary pack odds.</p>`:'<p>This Blook is in the Event Hall archive pool. The exchange offers <strong>four rotating selections per UTC day</strong>. It is <strong>not offered today</strong> and there is no guaranteed date when it will reappear.</p><p class="info-tip">You can check the Event Hall tomorrow (UTC). It cannot be pulled from ordinary packs.</p>';
 }else if(p){
  const items=availableItems(p),weighted=items.reduce((a,x)=>a+x[2],0),entry=items.find(x=>slug(x[0])===f.id),rate=entry?.[2]||0;
  parts=rate>0?`<p>Open <strong>${escapeHtml(p.name)}</strong> for 50 local tokens each. The simulator's currently displayed probability for this Blook is <strong>${(100*rate/weighted).toFixed(3)}% per opening</strong>.</p><p class="info-tip">Chance is not a guarantee. Pack odds are snapshot simulator values, not live Blooket odds. ${p.id==='space'?'Space Chromas rotate by UTC day.':''}</p>`:p.id==='space'?'<p>Space Chromas rotate daily (UTC). This color has <strong>0% chance today</strong>. Check the Space Pack on another day. All other pack rates remain unchanged.</p>':'<p>This Blook is listed in the historical pack data but has <strong>0% chance</strong> in this simulator. We have not invented an alternate unlock method.</p>';
 }else parts='<p>No unlock method is currently configured for this Blook.</p>';
 const alternatives=[];
 if(!f.unreleased&&!trial&&!f.catalogOnly&&p&&!p.free){
  const night=offerDefs().find(x=>x.id===f.id);
  if(night)alternatives.push(`Night Market today: ${night.price} shards (one daily purchase).`);
  const recipes=RECIPES.filter(r=>r.id!=='mystic'&&r.rewardPool.includes(f.id));
  for(const r of recipes)alternatives.push(`Trading Altar: ${escapeHtml(r.title)}${r.rewardPool.length>1?' (random possible reward)':''}.`);
  const npcs=TRADE_PARTNERS.filter(t=>t.reward===f.id);
  if(npcs.length)alternatives.push(`Trade Desk: available from ${npcs.map(t=>escapeHtml(t.name)).join(', ')} (simulated NPC exchange).`);
 }
 if(alternatives.length)parts+=`<div class="info-alt"><strong>Other simulator methods</strong><ul>${alternatives.map(t=>`<li>${t}</li>`).join('')}</ul></div>`;
 const label=n?`Owned · ${fmt(n)} cop${n===1?'y':'ies'}`:o.status;
 const cmd=o.action?`<button class="primary" data-blook-shortcut="${o.action}" ${o.pack?`data-select-pack="${o.pack}"`:''}>${o.action==='events'?'Go to Event Hall →':'Go to pack →'}</button>`:'<span class="info-unavailable">No unlock shortcut available</span>';
 const trialPackShortcut=trial?`<button data-blook-shortcut="packs" data-select-pack="${trial.pack}">Open required pack →</button>`:'';
 return `<div class="info-heading"><div class="info-art">${cardArt(f)}</div><div><span class="eyebrow">BLOOK INFORMATION</span><h2 id="blook-dialog-title">${escapeHtml(f.name)}</h2>${labelRarity(f.rarity)}<div class="obtain-status">${escapeHtml(label)}</div></div></div>
 <div class="info-separator"></div><div class="info-origin"><span>Original Blooket context</span><strong>${escapeHtml(sourceDescription(f))} · ${escapeHtml(sourceCategory(f))}</strong></div>
 <div class="info-origin"><span>Twilight Bazaar obtainment</span><strong>${escapeHtml(o.title)}</strong></div><div class="info-directions">${parts}</div>
 <div class="info-actions">${cmd}${trialPackShortcut}<button data-close-blook>Close</button></div>
 <p class="fine-print">Original Blooket availability and this independent simulator's rules are different. Your inventory and rewards here never transfer to a Blooket account.</p>`;
}
function openBlookInfo(id){const f=MAP[id];if(!f)return;const dialog=$('blook-dialog');$('blook-dialog-body').innerHTML=infoDetailsHtml(f);dialog.hidden=false;document.body.classList.add('dialog-open');dialog.querySelector('[data-close-blook]').focus();}
function closeBlookInfo(){ $('blook-dialog').hidden=true;document.body.classList.remove('dialog-open'); }
function resultTotals(h){const fs=h.ids.map(id=>MAP[id]).filter(Boolean),groups=new Map();for(const f of fs){const g=groups.get(f.id)||{f,n:0};g.n++;groups.set(f.id,g);}return {fs,groups:[...groups.values()].sort((a,b)=>RARITY_RANK[b.f.rarity]-RARITY_RANK[a.f.rarity]||b.n-a.n),firsts:new Set(h.firsts||[])};}
function resultsHtml(h){
 const {fs,groups,firsts}=resultTotals(h),p=PACKS.find(p=>p.id===h.pack);
 const top=groups[0]?.f,dupes=fs.length-firsts.size,rarities=['Uncommon','Rare','Epic','Legendary','Chroma','Mystical'];
 const counts=Object.fromEntries(rarities.map(r=>[r,fs.filter(f=>f.rarity===r).length]));
 const rows=showingMode==='all'?fs.slice().sort((a,b)=>RARITY_RANK[b.rarity]-RARITY_RANK[a.rarity]).map(f=>({f,n:1})):groups;
 return `<span class="eyebrow">COMPLETE OPENING RESULTS</span><h2 id="results-dialog-title">${fs.length} ${escapeHtml(p.name)} pull${fs.length>1?'s':''}</h2>
 <p class="result-summary">${fmt(h.cost)} local tokens spent · ${groups.length} distinct Blooks · ${dupes} pulls not new discoveries · Rarest: <strong>${escapeHtml(top?.name||'—')}</strong>${h.firsts.length?` · ${firsts.size} first-time discover${firsts.size===1?'y':'ies'}`:''}</p>
 <div class="rarity-totals">${rarities.map(r=>`<div class="rarity-tile rarity-tone-${r.toLowerCase()}"><b>${counts[r]}</b><small>${r}</small></div>`).join('')}</div>
 <div class="result-switch"><button class="${showingMode==='grouped'?'selected':''}" data-results-view="grouped">Grouped · ${groups.length}</button><button class="${showingMode==='all'?'selected':''}" data-results-view="all">All ${fs.length} individual pulls</button></div>
 <div class="v6-result-grid">${rows.map(({f,n})=>`<div class="v6-pull">${cardArt(f)}${firsts.has(f.id)?'<span class="discovery">NEW</span>':''}<b>${escapeHtml(f.name)}</b><small>${escapeHtml(f.rarity)}${showingMode==='grouped'?' · ×'+n:''}</small></div>`).join('')}</div>
 <div class="result-actions"><button class="primary" data-open-again="100">Open 100 more →</button><button data-close-results>Close results</button><button data-go-history>See opening history</button></div>`;
}
function openResults(h,view='grouped'){
 if(!h)return;showingResults=h;showingMode=view;
 $('results-dialog-body').innerHTML=resultsHtml(h);$('results-dialog').hidden=false;document.body.classList.add('dialog-open');
 $('results-dialog').querySelector('[data-close-results]').focus();
}
function closeResults(){ $('results-dialog').hidden=true;document.body.classList.remove('dialog-open'); }
function closeReveal(){
 clearTimeout(revealTimer);$('reveal-overlay').hidden=true;$('stripe-curtain').innerHTML='';
 if(lastOpening)openResults(lastOpening);
}
function showReveal(f,count){
 const mode=save.v6.prefs.mode;
 if(mode==='Instant'){openResults(lastOpening);return;}
 const over=$('reveal-overlay'),curtain=$('stripe-curtain');
 $('reveal-kicker').textContent=count===1?'A NEW DISCOVERY':`${count} PACKS OPENED`;
 $('reveal-art').innerHTML=cardArt(f);
 $('reveal-rarity').textContent=f.rarity;
 $('reveal-rarity').className=`rarity-label rarity-${f.rarity.toLowerCase()}`;
 $('reveal-title').textContent=f.name;
 $('reveal-subtitle').textContent=count===1?'Tap Skip or View all pulls to see the result':`Best pull shown · All ${count} pulls are waiting`;
 $('reveal-done').hidden=true;
 over.dataset.rarity=f.rarity.toLowerCase();
 curtain.className='stripe-curtain';
 curtain.innerHTML=Array.from({length:8},(_,i)=>`<span class="stripe" style="--i:${i}"></span>`).join('');
 over.hidden=false;clearTimeout(revealTimer);
 if(mode==='Fast')revealTimer=setTimeout(()=>closeReveal(),1000);
 else revealTimer=setTimeout(()=>{curtain.classList.add('fading');$('reveal-done').hidden=false;},1950);
}
function showResults(results,p){
 const groups=new Map();for(const f of results){const g=groups.get(f.id)||{f,n:0};g.n++;groups.set(f.id,g);}
 const ranked=[...groups.values()].sort((a,b)=>RARITY_RANK[b.f.rarity]-RARITY_RANK[a.f.rarity]);
 $('pull-result').innerHTML=`<span class="eyebrow">LATEST OPENING · SAVED TO HISTORY</span><h3>${results.length} ${escapeHtml(p.name)} pull${results.length>1?'s':''} · ${groups.size} different Blooks</h3><p>Top pull: <strong>${escapeHtml(ranked[0]?.f.name||'—')}</strong>. All ${results.length} pulls are saved.</p><button class="primary" id="reopen-last-results">View the complete ${results.length}-pull results →</button>`;
}
function openPacks(){
 if(busy)return;const p=getSelectedPack();if(p.free)return notice('Starter galleries cannot be purchased.');
 const n=selectedQty,cost=n*TOKEN_PRICE;
 try{const raw=localStorage.getItem(WEB_KEY);if(raw)save=validateSave(JSON.parse(raw));}catch(e){console.warn('Could not refresh local save',e);}
 if(save.tokens<cost)return notice(`Need ${fmt(cost)} tokens. Available: ${fmt(save.tokens)}.`);
 busy=true;
 try{
  const results=Array.from({length:n},()=>chooseWeighted(p));
  if(results.some(x=>!x))throw Error('A pack item is missing from the catalog');
  const firsts=[...new Set(results.filter(f=>countOf(f.id)===0).map(f=>f.id))];
  save.tokens-=cost;for(const f of results)award(f);
  recordPackOpen(p.id,n);
  const history=newSession(p,results,firsts);save.v6.history.unshift(history);save.v6.history=save.v6.history.slice(0,V6_HISTORY_LIMIT);
  persist();lastOpening=history;showResults(results,p);render();
  const top=results.slice().sort((a,b)=>RARITY_RANK[b.rarity]-RARITY_RANK[a.rarity])[0];
  showReveal(top,n);
  notice(`${n} Blooks saved. View all pulls in the results screen.`);
 }catch(e){notice('Opening failed: '+e.message);}finally{busy=false;drawPackOdds();drawVault();}
}
function bindV6(){
 $('open-mode').value=save.v6.prefs.mode;
 $('open-mode').addEventListener('change',e=>{save.v6.prefs.mode=e.target.value;persist();notice(e.target.value+' opening mode saved.');});
 document.addEventListener('click',e=>{
  const info=e.target.closest('[data-blook-info]');if(info){openBlookInfo(info.dataset.blookInfo);return;}
  if(e.target.closest('#reopen-last-results')){openResults(lastOpening);return;}
  const hist=e.target.closest('[data-history-index]');if(hist){openResults(save.v6.history[Number(hist.dataset.historyIndex)]);return;}
  if(e.target.closest('[data-close-blook]')){closeBlookInfo();return;}
  if(e.target.closest('[data-close-results]')){closeResults();return;}
  const shortcut=e.target.closest('[data-blook-shortcut]');if(shortcut){closeBlookInfo();if(shortcut.dataset.selectPack){selectedPack=shortcut.dataset.selectPack;$('pack-select').value=selectedPack;}switchTab(shortcut.dataset.blookShortcut);return;}
  const views=e.target.closest('[data-results-view]');if(views&&showingResults){showingMode=views.dataset.resultsView;$('results-dialog-body').innerHTML=resultsHtml(showingResults);return;}
  if(e.target.closest('[data-go-history]')){closeResults();switchTab('history');return;}
  if(e.target.closest('[data-open-again]')){
   const p=PACKS.find(p=>p.id===showingResults?.pack);closeResults();
   if(p){selectedPack=p.id;$('pack-select').value=p.id;}selectedQty=100;$('buy-amount').value='100';switchTab('packs');openPacks();return;
  }
 });
 for(const id of ['blook-dialog','results-dialog'])$(id).addEventListener('click',e=>{if(e.target===$(id)){if(id==='blook-dialog')closeBlookInfo();else closeResults();}});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!$('blook-dialog').hidden)closeBlookInfo();else if(!$('results-dialog').hidden)closeResults();}});
 // Shared storage import path already handles V6; sync controls and history after import.
 $('import').addEventListener('change',()=>setTimeout(()=>{ $('open-mode').value=save.v6.prefs.mode;drawHistory();},80));
}

setup();
