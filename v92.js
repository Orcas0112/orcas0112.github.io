'use strict';
/* V9.2 Variant Era: variant skins on existing Blooks, not new rarities or pack Blooks.
 * Pack first chooses the original Blook unchanged, then draws variant independently.
 * V9.1 Shiny counts are preserved in save.v91; newer types go in save.v92.
 * All variant copies are protected from existing sell / trade / fusion code.
 */
const PACK_VARIANT_TYPES=['shiny','shadow','glitched','golden','prismatic'];
const VARIANT_TYPES=[...PACK_VARIANT_TYPES,'ascended'];
const VARIANT_NAMES={shiny:'Shiny',shadow:'Shadow',glitched:'Glitched',golden:'Golden',prismatic:'Prismatic',ascended:'Ascended'};
const VARIANT_RATES={shiny:0.009,shadow:0.002,glitched:0.0015,golden:0.0008,prismatic:0.0002,ascended:0};
const VARIANT_PRIORITY=['ascended','prismatic','golden','glitched','shadow','shiny'];
const VARIANT_EXPLANATIONS={
 shiny:'Blook-specific alternate colors, not a standard gold effect. You can also use the classic Shiny Forge.',
 shadow:'A darker, violet-tinted alternate form with luminous eyes and muted colors.',
 glitched:'A digitally corrupted palette with displaced cyan and magenta glitch traces.',
 golden:'The true Golden Variant: a consistent metallic gold recolor with dark outlines.',
 prismatic:'An exceptionally rare multicolor finish with shifting hues and a spectral border.',
 ascended:'The prestige upgrade. Forge only, never from packs. Existing Blooks, with a distinctive awakened aura.'
};
function blankV92(){return {types:{shadow:{},glitched:{},golden:{},prismatic:{},ascended:{}},found:0,forged:0,forgeAttempts:0};}
function sanitizeV92(raw){
 const v=blankV92();if(!raw||typeof raw!=='object')return v;
 for(const type of Object.keys(v.types)){
  const map=raw.types?.[type];if(!map||typeof map!=='object'||Array.isArray(map))continue;
  for(const [id,n] of Object.entries(map))if(MAP[id]&&(MAP[id].rarity!=='Mystical'||type==='ascended'))v.types[type][id]=maxInt(n);
 }
 v.found=maxInt(raw.found);v.forged=maxInt(raw.forged);v.forgeAttempts=maxInt(raw.forgeAttempts);return v;
}
function variantCount(id,type){
 if(type==='shiny')return shinyOf(id);
 return maxInt(save.v92?.types?.[type]?.[id]);
}
function variantTotal(id){return VARIANT_TYPES.reduce((sum,t)=>sum+variantCount(id,t),0);}
function bestOwnedVariant(id){return VARIANT_PRIORITY.find(type=>variantCount(id,type)>0)||null;}
function awardVariant(f,type){
 if(!f||!VARIANT_TYPES.includes(type)||(f.rarity==='Mystical'&&type!=='ascended'))throw Error('This Blook cannot receive the requested variant');
 if(type==='shiny'){awardShiny(f);return;}
 if(!save.v92)save.v92=blankV92();
 save.v92.types[type][f.id]=maxInt(variantCount(f.id,type)+1);save.v92.found=maxInt(save.v92.found+1);
}
function rollPackVariant(f){
 if(!f||f.rarity==='Mystical')return null;
 const r=Math.random();let cumulative=0;
 for(const type of PACK_VARIANT_TYPES){cumulative+=VARIANT_RATES[type];if(r<cumulative)return type;}
 return null;
}
function variantPalette(f,type){
 const h=hash('variant-era:'+type+':'+f.id);
 const angle=h%360;
 const schemes={shadow:[225,245],glitched:[125,315],golden:[35,43],prismatic:[angle,((angle+135)%360)],ascended:[((angle+155)%360),((angle+50)%360)]};
 const [a,b]=schemes[type]||[200,300];
 return {hue:a,accent:b,seed:h%13};
}
function variantArt(f,type){
 if(type==='shiny')return shinyArt(f);
 if(!VARIANT_TYPES.includes(type))return cardArt(f);
 const c=variantPalette(f,type);
 return `<div class="v92-art v92-${type}" style="--v92-hue:${c.hue}deg;--v92-accent:hsl(${c.accent} 90% 70%);--v92-seed:${c.seed}" aria-label="${escapeHtml(VARIANT_NAMES[type])} ${escapeHtml(f.name)} alternate appearance">
 <span class="v92-color-glow" aria-hidden="true"></span>${cardArt(f)}<span class="v92-name">${escapeHtml(VARIANT_NAMES[type])}</span></div>`;
}
(() => {
 const $v=id=>document.getElementById(id);
 const prevValidator=validateSave;
 validateSave=function(raw){const out=prevValidator(raw);out.v92=sanitizeV92(raw?.v92);return out;};
 try{const raw=localStorage.getItem(WEB_KEY);save=raw?validateSave(JSON.parse(raw)):validateSave(newSave());}
 catch(e){console.warn('V9.2 variant save conversion',e);save=validateSave(newSave());}
 const target=$v('variant-target'),typeEl=$v('variant-type'),searchEl=$v('variant-search'),materialsEl=$v('variant-materials');
 let selected='king';
 function eligibleList(){const q=searchEl.value.trim().toLowerCase();return CATALOG.filter(f=>(f.rarity!=='Mystical'||typeEl.value==='ascended')&&(!q||f.name.toLowerCase().includes(q))).sort((a,b)=>a.name.localeCompare(b.name));}
 function costFor(f,type,boost){
  if(!f)return null;
  if(type==='ascended')return f.rarity==='Mystical'
    ? {copies:0,shards:2000,seals:500,chance:100,note:'Own this Mystical and complete its original Event Hall trial. It is NOT consumed. Each Mystical Ascended form can be earned once.'}
    : {copies:6,shards:1800,seals:75,chance:100,note:'Own at least one Shiny version first. The Shiny and one regular copy are never consumed.'};
  const configs={shiny:[2,100,25,15],shadow:[2,200,22,14],glitched:[3,350,16,12],golden:[4,600,10,8],prismatic:[5,900,6,6]};
  const [copies,shards,chance,bonus]=configs[type];return {copies:copies+boost,shards,seals:0,chance:chance+bonus*boost,note:'Chance displayed is exact for this attempt. Only regular duplicate copies and shards are consumed.'};
 }
 function canForge(f,type,c){
  if(!f||!c||save.shards<c.shards||save.event.seals<c.seals)return false;
  if(type==='ascended'&&f.rarity==='Mystical')return countOf(f.id)>0&&variantCount(f.id,type)===0;
  if(type==='ascended'&&variantCount(f.id,'shiny')<1)return false;
  return countOf(f.id)>=c.copies+1;
 }
 function renderGallery(){
  const types=VARIANT_TYPES;
  const found=[];for(const f of CATALOG)for(const t of types)if(variantCount(f.id,t)>0)found.push({f,t,n:variantCount(f.id,t)});
  const count=found.reduce((sum,x)=>sum+x.n,0);
  $v('variant-stats').textContent=`${found.length} distinct variant designs · ${count} variant copies · ${save.v92?.forgeAttempts||0} new-forge attempts`;
  const only=$v('variant-owned-only').checked;
  const list=only?found:eligibleList().slice(0,36).flatMap(f=>types.filter(t=>f.rarity!=='Mystical'||t==='ascended').map(t=>({f,t,n:variantCount(f.id,t)})));
  $v('variant-shelf').innerHTML=list.length?list.map(({f,t,n})=>`<button type="button" class="v92-shelf-card" data-variant-id="${escapeHtml(f.id)}" data-variant-type="${t}">${variantArt(f,t)}<strong>${escapeHtml(f.name)}</strong><small>${escapeHtml(VARIANT_NAMES[t])} · ${n?`Owned ×${n}`:'PREVIEW'}</small></button>`).join(''):'<p class="v91-empty">No variants owned yet. You can preview them above, or uncheck “Show owned only” to browse designs.</p>';
 }
 function drawPreview(){
  const f=MAP[target.value],t=typeEl.value,c=costFor(f,t,Number(materialsEl.value)||0);
  $v('variant-preview').innerHTML=f?`<div><small>ORIGINAL</small>${cardArt(f)}</div><div><small>${escapeHtml(VARIANT_NAMES[t])}</small>${variantArt(f,t)}</div>`:'<p>Search for a Blook to see its variants.</p>';
  $v('variant-description').textContent=f?`${VARIANT_EXPLANATIONS[t]} You own ${variantCount(f.id,t)} ${VARIANT_NAMES[t]} copies of ${f.name}.`:'Select another name.';
  $v('variant-forge-cost').textContent=f?`${c.copies} spare regular copies · ${c.shards.toLocaleString()} shards${c.seals?` · ${c.seals} Event Seals`:''} · ${c.chance}% success. ${c.note} Have ${countOf(f.id)} regular, ${save.shards} shards, ${save.event.seals} seals.`:'Choose a Blook';
  $v('variant-forge-go').disabled=!canForge(f,t,c);
 }
 function renderVariant(){
  const eligible=eligibleList();const wanted=target.value||selected;
  target.innerHTML=eligible.length?eligible.map(f=>`<option value="${escapeHtml(f.id)}">${escapeHtml(f.name)} · ${escapeHtml(f.rarity)}</option>`).join(''):'<option value="">No Blooks found</option>';
  target.value=eligible.some(f=>f.id===wanted)?wanted:eligible[0]?.id||'';
  selected=target.value;
  drawPreview();renderGallery();
 }
 function doForge(){
  if(busy)return;
  try{const raw=localStorage.getItem(WEB_KEY);if(raw)save=validateSave(JSON.parse(raw));}catch{return notice('Local save could not be read. Forge canceled.');}
  const f=MAP[target.value],type=typeEl.value,boost=Number(materialsEl.value)||0,c=costFor(f,type,boost);
  if(!canForge(f,type,c)){renderVariant();return notice('You need more duplicates, shards, or Event Seals to forge this variant.');}
  const prompt=`Forge ${VARIANT_NAMES[type]} ${f.name}?\n\nSpend ${c.copies} spare regular copies + ${c.shards} Shards${c.seals?` + ${c.seals} Event Seals`:''}.\nSuccess: ${c.chance}%.\nYour reserved Blook, Shiny copies and other variants are protected.\n${c.note}\n\nContinue?`;
  if(!confirm(prompt))return;
  const old=JSON.stringify(save);busy=true;
  try{
   save.inventory[f.id]=countOf(f.id)-c.copies;save.shards-=c.shards;save.event.seals-=c.seals;
   save.v92.forgeAttempts=maxInt(save.v92.forgeAttempts+1);
   const success=Math.random()*100<c.chance;
   if(success){awardVariant(f,type);save.v92.forged=maxInt(save.v92.forged+1);}
   persist();render();
   $v('variant-forge-result').innerHTML=success?`<span class="eyebrow">FORGE SUCCESS · ${escapeHtml(VARIANT_NAMES[type].toUpperCase())}</span><h3>${escapeHtml(VARIANT_NAMES[type])} ${escapeHtml(f.name)}!</h3><div class="v92-forge-result">${variantArt(f,type)}</div><p>One variant copy permanently added to your collection.</p>`:`<span class="eyebrow">FORGE MISSED</span><h3>Not this attempt</h3><p>You kept your original Blook and every variant copy, but spent the selected duplicates and materials. The success chance was ${c.chance}%.</p>`;
   $v('variant-forge-status').textContent=success?'Variant successfully saved!':'Materials spent. Your protected copies are safe.';
   notice(success?`${VARIANT_NAMES[type]} ${f.name} forged!`:'Forge failed; protected copies remain.');
  }catch(err){console.error(err);save=validateSave(JSON.parse(old));$v('variant-forge-status').textContent='Forge failed to save; no changes committed.';}
  finally{busy=false;renderVariant();}
 }
 $v('variant-odds').innerHTML=`<div class="v92-odds-head"><strong>One independent variant roll per eligible pack pull</strong><small>Normal Blook probabilities stay unchanged</small></div>`+
  PACK_VARIANT_TYPES.map(t=>`<div class="v92-odds-entry"><b>${escapeHtml(VARIANT_NAMES[t])}</b><strong>${(VARIANT_RATES[t]*100).toFixed(t==='prismatic'?3:2)}%</strong><small>~1 in ${Math.round(1/VARIANT_RATES[t]).toLocaleString()}</small></div>`).join('')+`<div class="v92-odds-entry v92-ascended-odds"><b>Ascended</b><strong>Forge only</strong><small>Guaranteed when earned</small></div>`;
 target.addEventListener('change',()=>{selected=target.value;drawPreview();});
 searchEl.addEventListener('input',()=>{selected='';renderVariant();});
 typeEl.addEventListener('change',()=>{selected=target.value;renderVariant();});
 materialsEl.addEventListener('change',drawPreview);
 $v('variant-owned-only').addEventListener('change',renderGallery);
 $v('variant-forge-go').addEventListener('click',doForge);
 $v('variant-shelf').addEventListener('click',event=>{
  const btn=event.target.closest('[data-variant-id]');if(!btn)return;
  searchEl.value='';typeEl.value=btn.dataset.variantType;selected=btn.dataset.variantId;renderVariant();
  $v('variant-preview').scrollIntoView({behavior:'smooth',block:'center'});
 });
 const prevRender=render;
 render=function(){prevRender();if($v('variants').classList.contains('active'))renderVariant();};
 const prevSwitch=switchTab;
 switchTab=function(id){prevSwitch(id);if(id==='variants')renderVariant();};
 const prevHistory=drawHistory;
 drawHistory=function(){prevHistory();const pullCounts={};for(const h of save.v6.history)for(const t of h.variants||[])if(t)pullCounts[t]=(pullCounts[t]||0)+1;
  if($v('opening-stats'))$v('opening-stats').insertAdjacentHTML('beforeend',`<div class="stat-card"><span>Recorded special variants</span><b>${fmt(Object.values(pullCounts).reduce((s,n)=>s+n,0))}</b></div>`);};
 $v('import').addEventListener('change',()=>setTimeout(()=>{try{const raw=localStorage.getItem(WEB_KEY);if(raw)save=validateSave(JSON.parse(raw));}catch{}renderVariant();},240));
 window.addEventListener('storage',e=>{if(e.key===WEB_KEY){try{if(e.newValue)save=validateSave(JSON.parse(e.newValue));}catch{}if($v('variants').classList.contains('active'))renderVariant();}});
 renderVariant();drawCollection();
})();
