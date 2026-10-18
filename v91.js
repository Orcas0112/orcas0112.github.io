'use strict';
/* Twilight Bazaar V9.1 — non-destructive Shiny variants + targeted forge.
 * The pack first chooses its original Blook (unchanged odds), then independently
 * rolls 0.9% Shiny. Shiny copies are stored separately and never sacrificed.
 */
const SHINY_PACK_RATE=0.009;
const blankV91=()=>({shinies:{},found:0,forged:0,forgeAttempts:0});
function sanitizeV91(raw){
 const v=blankV91();if(!raw||typeof raw!=='object')return v;
 if(raw.shinies&&typeof raw.shinies==='object'&&!Array.isArray(raw.shinies)){
  for(const [id,n] of Object.entries(raw.shinies)){if(MAP[id]&&MAP[id].rarity!=='Mystical')v.shinies[id]=maxInt(n);}
 }
 v.found=maxInt(raw.found);v.forged=maxInt(raw.forged);v.forgeAttempts=maxInt(raw.forgeAttempts);
 return v;
}
function awardShiny(f){
 if(!f||f.rarity==='Mystical')throw Error('Not eligible for Shiny variants');
 if(!save.v91)save.v91=blankV91();
 save.v91.shinies[f.id]=shinyOf(f.id)+1;
 save.v91.found=maxInt(save.v91.found+1);
}
function rollShinyPack(f){return !!f&&f.rarity!=='Mystical'&&Math.random()<SHINY_PACK_RATE;}
/* Each Blook receives a stable, individual alternate palette. We apply the recolor
 * to the actual image with an SVG color matrix; unlike a gold overlay, the Blook's
 * artwork pixels change, while the silhouette and existing line work are retained.
 * No image pixels are read or exported (important for third-party CDN CORS).
 */
const SHINY_COLOR_FAMILIES=[
 ['Aurora Mint',157,174,231],['Coral Mist',17,344,214],['Frostberry',229,284,175],
 ['Ocean Ember',193,8,308],['Lavender Lime',267,96,278],['Blue Flame',207,29,202],
 ['Rose Quartz',334,183,336],['Forest Violet',127,285,145],['Copper Ice',29,187,28],
 ['Electric Orchid',295,184,300],['Sunset Teal',5,177,23],['Polar Peach',189,18,190],
 ['Indigo Bloom',242,327,263],['Cherry Frost',349,199,342],['Jade Moon',146,250,154],
 ['Amethyst Sky',281,201,278]
];
const SHINY_HAND_PICKED={
 'king':['Ivory Sapphire',217,206,211],
 'dragon':['Glacier Dragon',194,271,189],
 'witch':['Cobalt Witch',211,19,214],
 'wizard':['Crimson Wizard',355,151,355],
 'elf':['Lavender Elf',273,78,268],
 'fairy':['Coral Fairy',21,211,19],
 'unicorn':['Midnight Unicorn',230,295,229],
 'astronaut':['Emerald Astronaut',155,295,150],
 'red-astronaut':['Ice Astronaut',188,170,190],
 'green-astronaut':['Orchid Astronaut',282,203,282],
 'pink-astronaut':['Azure Astronaut',215,136,214],
 'yellow-astronaut':['Violet Astronaut',274,194,277],
 'black-astronaut':['Sunset Astronaut',10,171,14],
 'ghost':['Twilight Ghost',245,158,245],
 'panda':['Cerulean Panda',200,95,199],
 'rainbow-panda':['Shadow Rainbow',252,210,252],
 'cat':['Moonlight Cat',231,181,233],
 'dog':['Rosewood Dog',345,145,346],
 'mega-bot':['Arctic Bot',191,298,189],
 'king-of-hearts':['Royal Jade',147,274,147],
 'orange-astronaut':['Teal Astronaut',179,155,183],
 'lovely-frog':['Rose Mint Frog',138,235,135]
};
function shinyPalette(f){
 const h=hash('shiny-color-v1:'+f.id), selected=SHINY_COLOR_FAMILIES[h%SHINY_COLOR_FAMILIES.length];
 const curated=SHINY_HAND_PICKED[f.id];
 const family=curated||selected;
 // The small ID-specific offset gives every Blook its own palette, not 16 global presets.
 const shade=(h>>>9)%25-12;
 const hue=((family[1]+(curated?0:shade))%360+360)%360;
 const shift=(family[2]+((h>>>16)%41)-20+360)%360;
 const border=((family[3]+(curated?0:shade))%360+360)%360;
 return {name:family[0],hue,shift,border,boost:1.15+((h>>>22)%31)/100};
}
function shinyHslToRgb(h,s,l){
 const a=s*Math.min(l,1-l);
 const k=n=>(n+h/30)%12;
 const channel=n=>l-a*Math.max(-1,Math.min(k(n)-3,9-k(n),1));
 return [channel(0),channel(8),channel(4)];
}
function shinyFilterId(f){return 'v91-color-'+f.id;}
function installShinyColorFilter(f){
 const id=shinyFilterId(f);
 if(document.getElementById(id))return id;
 let root=document.getElementById('v91-color-svgs');
 if(!root){
  root=document.createElementNS('http://www.w3.org/2000/svg','svg');
  root.setAttribute('id','v91-color-svgs');root.setAttribute('aria-hidden','true');
  root.style.cssText='position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';
  const defs=document.createElementNS('http://www.w3.org/2000/svg','defs');root.append(defs);document.body.append(root);
 }
 const p=shinyPalette(f);
 const tint=shinyHslToRgb(p.hue,.93,.63);
 const mixing=.84;
 const lum=[.299,.587,.114];
 const row=(i)=>[0,1,2].map(j=>((i===j?1-mixing:0)+mixing*tint[i]*lum[j]).toFixed(5)).join(' ')+' 0 0.015';
 const matrix=[row(0),row(1),row(2),'0 0 0 1 0'].join(' ');
 const ns='http://www.w3.org/2000/svg';
 const filter=document.createElementNS(ns,'filter');filter.setAttribute('id',id);
 filter.setAttribute('color-interpolation-filters','sRGB');
 filter.setAttribute('x','-10%');filter.setAttribute('y','-10%');
 filter.setAttribute('width','120%');filter.setAttribute('height','120%');
 const rotate=document.createElementNS(ns,'feColorMatrix');rotate.setAttribute('type','hueRotate');rotate.setAttribute('values',String(p.shift));rotate.setAttribute('in','SourceGraphic');filter.append(rotate);
 const saturation=document.createElementNS(ns,'feColorMatrix');saturation.setAttribute('type','saturate');saturation.setAttribute('values',String(p.boost));filter.append(saturation);
 const tintMatrix=document.createElementNS(ns,'feColorMatrix');tintMatrix.setAttribute('type','matrix');tintMatrix.setAttribute('values',matrix);filter.append(tintMatrix);
 const lift=document.createElementNS(ns,'feComponentTransfer');
 for(const key of ['R','G','B']){const channel=document.createElementNS(ns,'feFunc'+key);channel.setAttribute('type','gamma');channel.setAttribute('amplitude','1');channel.setAttribute('exponent','.72');channel.setAttribute('offset','0');lift.append(channel);}
 filter.append(lift);
 root.firstChild.append(filter);return id;
}
function shinyArt(f){
 const p=shinyPalette(f),filterId=installShinyColorFilter(f);
 const accent=`hsl(${p.border} 84% 70%)`,deep=`hsl(${p.hue} 44% 24%)`;
 return `<div class="v91-shiny-art" style="--v91-accent:${accent};--v91-deep:${deep};--v91-recolor:url('#${filterId}')" aria-label="Shiny ${escapeHtml(f.name)}, ${escapeHtml(p.name)} alternate colors"><span class="v91-sheen" aria-hidden="true"></span>${cardArt(f)}<span class="v91-shiny-label">✦ SHINY</span></div>`;
}
function originalVsShiny(f){
 return `<div class="v91-compare"><div class="v91-compare-panel"><span>ORIGINAL</span>${cardArt(f)}</div><div class="v91-compare-panel"><span>SHINY · ${escapeHtml(shinyPalette(f).name)}</span>${shinyArt(f)}</div></div>`;
}

(() => {
 const $el=id=>document.getElementById(id);
 const priorValidate=validateSave;
 validateSave=function(raw){const v=priorValidate(raw);v.v91=sanitizeV91(raw?.v91);return v;};
 try{const stored=localStorage.getItem(WEB_KEY);save=stored?validateSave(JSON.parse(stored)):validateSave(newSave());}
 catch(e){console.warn('V9.1 save migration',e);save=validateSave(newSave());}
 const target=$el('shiny-target'),extras=$el('shiny-extras'),btn=$el('shiny-forge-go');
 let highlighted='';
 function forgeCandidates(){return CATALOG.filter(f=>f.rarity!=='Mystical'&&countOf(f.id)>=3).sort((a,b)=>RARITY_RANK[b.rarity]-RARITY_RANK[a.rarity]||a.name.localeCompare(b.name));}
 function renderForge(){
  const candidates=forgeCandidates();const previous=target.value||highlighted;
  target.innerHTML=candidates.length?candidates.map(f=>`<option value="${escapeHtml(f.id)}">${escapeHtml(f.name)} · ${f.rarity} · ${fmt(countOf(f.id))} regular</option>`).join(''):'<option value="">Need 3 copies of one Blook</option>';
  target.value=candidates.some(f=>f.id===previous)?previous:(candidates[0]?.id||'');
  highlighted=target.value;const f=MAP[target.value], extra=Number(extras.value);
  $el('shiny-target-art').innerHTML=f?originalVsShiny(f):'<div class="v91-empty">Open packs to collect duplicates!</div>';
  const consumed=2+extra, chance=25+15*extra;
  $el('shiny-cost').textContent=f?`${consumed} spare regular ${f.name} copies + 100 Shards · ${chance}% success · 1 protected base copy stays. You have ${fmt(countOf(f.id))} regular and ${fmt(save.shards)} Shards.`:'Need three regular copies of the same Blook. Shiny and Mystical copies never count as forge ingredients.';
  btn.disabled=!f||countOf(f.id)<consumed+1||save.shards<100;
  const entries=Object.entries(save.v91?.shinies||{}).filter(([id,n])=>MAP[id]&&n>0).sort(([a],[b])=>MAP[a].name.localeCompare(MAP[b].name));
  const total=entries.reduce((sum,[,n])=>sum+n,0);
  $el('shiny-stats').textContent=`${entries.length} unique Shinies · ${total} Shiny copies · ${save.v91?.forgeAttempts||0} forge attempts`;
  $el('shiny-collection').innerHTML=entries.length?entries.map(([id,n])=>`<div class="v91-shelf-card">${shinyArt(MAP[id])}<strong>${escapeHtml(MAP[id].name)}</strong><small>${escapeHtml(shinyPalette(MAP[id]).name)} · ${escapeHtml(MAP[id].rarity)} · ×${n}</small></div>`).join(''):'<div class="history-empty">No Shinies yet. Open packs or try the Forge!</div>';
 }
 function forge(){
  if(busy)return;
  try{const raw=localStorage.getItem(WEB_KEY);if(raw)save=validateSave(JSON.parse(raw));}catch{return notice('Cannot read your local save. Forge canceled.');}
  const f=MAP[target.value], extra=Number(extras.value),cost=2+extra,chance=25+15*extra;
  if(!f||f.rarity==='Mystical'||countOf(f.id)<cost+1||save.shards<100){renderForge();return notice('Not enough spare copies or Twilight Shards.');}
  if(!confirm(`Forge Shiny ${f.name}?\n\nSpend ${cost} EXTRA regular copies and 100 Twilight Shards.\nSuccess chance: ${chance}%.\nFailure consumes the materials, but your last regular copy and all existing Shiny copies remain safe.\n\nContinue?`))return;
  const prior=JSON.stringify(save);busy=true;
  try{
   save.inventory[f.id]=countOf(f.id)-cost;
   save.shards-=100;
   save.v91=save.v91||blankV91();save.v91.forgeAttempts=maxInt(save.v91.forgeAttempts+1);
   const success=Math.random()*100<chance;
   if(success){save.v91.shinies[f.id]=shinyOf(f.id)+1;save.v91.forged=maxInt(save.v91.forged+1);}
   persist();render();
   $el('shiny-forge-result').innerHTML=success?`<span class="eyebrow">FORGE SUCCESS!</span><h3>✦ Shiny ${escapeHtml(f.name)}!</h3><div class="v91-forge-result-art">${shinyArt(f)}</div><p>One permanent Shiny copy added to your collection.</p>`:`<span class="eyebrow">FORGE MISSED</span><h3>Not this time</h3><p>You spent ${cost} spare regular copies and 100 shards. Your reserved ${escapeHtml(f.name)} and every Shiny remain protected. ${chance}% was the chance of success.</p>`;
   $el('shiny-forge-status').textContent=success?'Your Shiny has been saved!':'Attempt saved. Collect more duplicates to try again.';
   notice(success?`SHINY ${f.name} forged!`:'No Shiny this time. Your original copy is safe.');
  }catch(e){console.error(e);try{save=validateSave(JSON.parse(prior));}catch{}$el('shiny-forge-status').textContent='Forge failed to save. No additional changes were made.';}
  finally{busy=false;renderForge();}
 }
 target.addEventListener('change',()=>{highlighted=target.value;renderForge();});
 extras.addEventListener('change',renderForge);
 btn.addEventListener('click',forge);
 const olderRender=render;
 render=function(){olderRender();if($el('shiny')?.classList.contains('active'))renderForge();};
 const olderSwitch=switchTab;
 switchTab=function(id){olderSwitch(id);if(id==='shiny')renderForge();};
 const olderHistory=drawHistory;
 drawHistory=function(){olderHistory();const count=save.v6.history.reduce((acc,h)=>acc+(h.shinies?.length||0),0);const box=$el('opening-stats');if(box)box.insertAdjacentHTML('beforeend',`<div class="stat-card"><span>Recorded Shiny pulls</span><b>${fmt(count)}</b></div>`);};
 $el('import').addEventListener('change',()=>setTimeout(()=>{try{const raw=localStorage.getItem(WEB_KEY);if(raw)save=validateSave(JSON.parse(raw));}catch{}renderForge();},220));
 window.addEventListener('storage',ev=>{if(ev.key===WEB_KEY){try{if(ev.newValue)save=validateSave(JSON.parse(ev.newValue));}catch{}if($el('shiny')?.classList.contains('active'))renderForge();}});
 renderForge();
})();
