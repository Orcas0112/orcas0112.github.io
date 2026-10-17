'use strict';
/* V9.0 Rarity Fusion / local-only admin. Preserve V1 save key and all V4–V8 fields. */
(() => {
 const HISTORY_LIMIT=40;
 const ADMIN_PASSWORD='Orcas0112'; // GitHub Pages is public; this is a UI gate, NOT secure auth.
 const RATES=[
  {key:'rare',label:'Random Rare',chance:50,rarity:'Rare',shade:'#55b7f9'},
  {key:'epic',label:'Random Epic',chance:35,rarity:'Epic',shade:'#ac8eff'},
  {key:'legendary',label:'Other Legendary',chance:9.8,rarity:'Legendary',shade:'#f5ba5d'},
  {key:'king',label:'King',chance:5,rarity:'Legendary',shade:'#ffe09b'},
  {key:'chroma',label:'Random Chroma',chance:0.2,rarity:'Chroma',shade:'#fb88dd'}
 ];
 // Reward candidates are existing regular Market pack entries (not simulator packs,
 // event/Mystical Blooks, unreleased refs or unofficial TD2 variant artwork).
 const standardPacks=PACKS.filter(p=>!p.free&&!p.special&&!p.fanMade&&!p.original);
 const candidates=[...new Set(standardPacks.flatMap(p=>p.items.filter(([n,,weight])=>Number(weight)>0).map(([name])=>slug(name))))]
  .map(id=>MAP[id]).filter(f=>f&&!f.catalogOnly&&!f.unreleased);
 const pools={
  rare:candidates.filter(f=>f.rarity==='Rare'),
  epic:candidates.filter(f=>f.rarity==='Epic'),
  legendary:candidates.filter(f=>f.rarity==='Legendary'&&f.id!=='king'),
  king:MAP.king?[MAP.king]:[],
  chroma:candidates.filter(f=>f.rarity==='Chroma')
 };
 if(RATES.reduce((sum,r)=>sum+r.chance,0)!==100||RATES.some(x=>!pools[x.key].length)) throw Error('Fusion pools or published odds are invalid');
 const blankV9=()=>({total:0,history:[],showArchived:false});
 function sanitizeV9(raw){
  const empty=blankV9();if(!raw||typeof raw!=='object')return empty;
  empty.total=maxInt(raw.total);empty.showArchived=false;
  if(Array.isArray(raw.history))empty.history=raw.history.slice(0,HISTORY_LIMIT).map(h=>{
   if(!h||typeof h!=='object'||!MAP[h.rare]||!MAP[h.epic]||!MAP[h.reward]||!RATES.some(r=>r.key===h.outcome))return null;
   return {rare:h.rare,epic:h.epic,reward:h.reward,outcome:h.outcome,date:typeof h.date==='string'?h.date.slice(0,32):'',lastCopyOverride:!!h.lastCopyOverride};
  }).filter(Boolean);
  empty.total=Math.max(empty.total,empty.history.length);
  return empty;
 }
 // Existing save validation has V7 layered on top; add only our new namespace.
 const previousValidate=validateSave;
 validateSave=function(raw){const v=previousValidate(raw);v.v9=sanitizeV9(raw?.v9);return v;};
 try{const raw=localStorage.getItem(WEB_KEY);save=raw?validateSave(JSON.parse(raw)):validateSave(newSave());}
 catch(e){console.warn('V9 save recovery',e);save=validateSave(newSave());}
 let rareId='',epicId='',adminUnlocked=false;
 const $el=id=>document.getElementById(id);
 const usable=(f,r)=>f&&f.rarity===r&&countOf(f.id)>0;
 function selectedArt(id){return id&&MAP[id]?cardArt(MAP[id]):'<div class="v9-empty-art">?</div>';}
 function fillChoice(id,rarity,selected){
  const el=$el(id),items=CATALOG.filter(f=>usable(f,rarity)).sort((a,b)=>a.name.localeCompare(b.name));
  if(!items.some(f=>f.id===selected))selected=items[0]?.id||'';
  el.innerHTML=items.length?items.map(f=>`<option value="${escapeHtml(f.id)}">${escapeHtml(f.name)} · owned ${fmt(countOf(f.id))}</option>`).join(''):'<option value="">No eligible Blooks owned</option>';
  el.value=selected;el.disabled=!items.length;return selected;
 }
 function syncLegacyOptions(){
  const packSelect=$el('pack-select'),current=packSelect.value;
  packSelect.innerHTML=PACKS.filter(p=>!p.fanMade&&!p.original).map(p=>`<option value="${escapeHtml(p.id)}">${escapeHtml(p.name)}${p.free?' · gallery':(p.fanMade||p.original)?' · archived':''}</option>`).join('');
  if([...packSelect.options].some(o=>o.value===current))packSelect.value=current;
  else{selectedPack='medieval';packSelect.value=selectedPack;}
  drawPackOdds();
  $el('v8-pack-search').dispatchEvent(new Event('input'));
 }
 function renderFusion(){
  rareId=fillChoice('fusion-rare','Rare',rareId);epicId=fillChoice('fusion-epic','Epic',epicId);
  $el('fusion-rare-art').innerHTML=selectedArt(rareId);
  $el('fusion-epic-art').innerHTML=selectedArt(epicId);
  $el('fusion-rare-owned').textContent=rareId?`${fmt(countOf(rareId))} in collection`:'Open a pack to obtain a Rare';
  $el('fusion-epic-owned').textContent=epicId?`${fmt(countOf(epicId))} in collection`:'Open a pack to obtain an Epic';
  const last=rareId&&epicId&&(countOf(rareId)<=1||countOf(epicId)<=1);
  const protect=$el('fusion-protect').checked;
  $el('fusion-warning').textContent=!rareId||!epicId?'You need one owned Rare and one owned Epic to use Fusion.':last?(protect?'One or both selections are your last copy. Choose duplicates, or turn off protection for an explicit last-copy confirmation.':'WARNING: This fusion will consume your last copy of at least one Blook.'): 'Both ingredients are ready. Your originals will be consumed.';
  $el('fusion-go').disabled=!(rareId&&epicId)||!!(last&&protect);
  const v=save.v9||blankV9(),hist=v.history;
  $el('fusion-stats').innerHTML=`<div class="stat-card"><span>Fusions completed</span><b>${fmt(v.total)}</b></div><div class="stat-card"><span>Legendary rewards</span><b>${fmt(hist.filter(x=>MAP[x.reward]?.rarity==='Legendary').length)}</b></div><div class="stat-card"><span>Chroma rewards</span><b>${fmt(hist.filter(x=>MAP[x.reward]?.rarity==='Chroma').length)}</b></div><div class="stat-card"><span>Entries saved</span><b>${fmt(hist.length)}</b></div>`;
  $el('fusion-history').innerHTML=hist.length?hist.map((h,i)=>{
   const a=MAP[h.rare],b=MAP[h.epic],r=MAP[h.reward];
   return `<div class="v9-journal-row"><span class="v9-journal-number">#${fmt(v.total-i)}</span><span class="v9-journal-input">${escapeHtml(a.name)} + ${escapeHtml(b.name)}</span><span class="v9-journal-arrow">→</span><span class="v9-journal-reward">${cardArt(r)}<strong>${escapeHtml(r.name)}</strong> ${labelRarity(r.rarity)}</span><small>${escapeHtml(h.date?new Date(h.date).toLocaleString():'Earlier fusion')}</small></div>`;
  }).join(''):'<div class="history-empty">No fusions yet. Your first experiment will be recorded here.</div>';
 }
 function getOutcome(){
  const roll=Math.random()*100;let cumulative=0;
  for(const row of RATES){cumulative+=row.chance;if(roll<cumulative)return row;}
  return RATES[RATES.length-1];
 }
 function executeFusion(){
  if(busy)return;
  // Read fresh storage to avoid overwriting an imported or parallel-tab save.
  try{const raw=localStorage.getItem(WEB_KEY);if(raw)save=validateSave(JSON.parse(raw));}
  catch(e){notice('Cannot safely read your save. Fusion canceled.');return;}
  const a=MAP[rareId],b=MAP[epicId];
  if(!usable(a,'Rare')||!usable(b,'Epic')){renderFusion();return notice('You no longer own both selected ingredients.');}
  const consumeLast=countOf(a.id)===1||countOf(b.id)===1;
  if(consumeLast&&$el('fusion-protect').checked){renderFusion();return notice('Last-copy protection is enabled.');}
  const warning=consumeLast?'\nWARNING: At least one is your LAST COPY and will disappear from your collection.':'';
  if(!confirm(`Fuse 1 × ${a.name} (Rare) and 1 × ${b.name} (Epic)?\nBoth will be consumed permanently.${warning}\n\nReceive ONE random Blook from the published prize pool?`))return;
  const before=JSON.stringify(save);
  const outcome=getOutcome(),pool=pools[outcome.key],reward=pool[Math.floor(Math.random()*pool.length)];
  if(!reward||reward.rarity==='Mystical')return notice('Fusion reward unavailable; nothing consumed.');
  busy=true;
  try{
   save.inventory[a.id]=countOf(a.id)-1;save.inventory[b.id]=countOf(b.id)-1;
   award(reward);
   save.v9=save.v9||blankV9();save.v9.total=maxInt(save.v9.total+1);
   save.v9.history.unshift({rare:a.id,epic:b.id,reward:reward.id,outcome:outcome.key,date:new Date().toISOString(),lastCopyOverride:consumeLast});
   save.v9.history=save.v9.history.slice(0,HISTORY_LIMIT);
   persist();
   $el('fusion-result').innerHTML=`<span class="eyebrow">FUSION COMPLETE · ${escapeHtml(outcome.label)}</span><div class="v9-result-art">${cardArt(reward)}</div>${labelRarity(reward.rarity)}<h3>${escapeHtml(reward.name)}</h3><p>Consumed <b>${escapeHtml(a.name)}</b> + <b>${escapeHtml(b.name)}</b> · Won 1 ${escapeHtml(reward.name)}.</p><p class="fine-print">This result was drawn from the ${outcome.chance}% category, then uniformly among its eligible Blooks.</p>`;
   notice(`Fusion success! Received ${reward.name}.`);
  }catch(e){console.error('Fusion failed',e);try{save=validateSave(JSON.parse(before));}catch{}notice('Fusion could not be saved; try again.');}
  finally{busy=false;render();}
 }
 function adminVisible(show){
  adminUnlocked=show;$el('admin-gate').hidden=show;$el('admin-tools').hidden=!show;
  $el('admin-pass').value='';$el('admin-login-status').textContent='';
  if(show)renderAdmin();
 }
 function renderAdmin(){
  if(!adminUnlocked)return;
  $el('admin-tokens').value=save.tokens;$el('admin-shards').value=save.shards;$el('admin-seals').value=save.event.seals;
  const select=$el('admin-blook'),keep=select.value;
  select.innerHTML=CATALOG.filter(f=>f.rarity!=='Mystical').sort((a,b)=>a.name.localeCompare(b.name))
   .map(f=>`<option value="${escapeHtml(f.id)}">${escapeHtml(f.name)} (${escapeHtml(f.rarity)})</option>`).join('');
  if([...select.options].some(x=>x.value===keep))select.value=keep;
 }
 function withFreshSave(action){
  try{const raw=localStorage.getItem(WEB_KEY);if(raw)save=validateSave(JSON.parse(raw));}
  catch(e){$el('admin-status').textContent='Could not read save. No changes made.';return;}
  const prior=JSON.stringify(save);
  try{action();persist();render();$el('admin-status').textContent='Saved to this browser. Export your save if you want a backup.';}
  catch(e){console.error(e);save=validateSave(JSON.parse(prior));$el('admin-status').textContent='Could not save changes. Please try again.';}
 }
 function readAmount(id,minimum,maximum){
  const s=$el(id).value.trim(),n=Number(s);
  if(!/^\d+$/.test(s)||!Number.isSafeInteger(n)||n<minimum||n>maximum)throw Error(`Enter a whole number from ${minimum} to ${maximum}.`);
  return n;
 }
 // Initial render and bindings after existing V8 wrappers have been installed.
 $el('fusion-odds').innerHTML=RATES.map(r=>`<div class="v9-odds-row"><div class="v9-odds-line"><span>${escapeHtml(r.label)}</span><b>${r.chance}%</b></div><div class="v9-odds-track"><div style="width:${r.chance}%;background:${r.shade}"></div></div></div>`).join('');
 $el('fusion-rare').addEventListener('change',e=>{rareId=e.target.value;renderFusion();});
 $el('fusion-epic').addEventListener('change',e=>{epicId=e.target.value;renderFusion();});
 $el('fusion-protect').addEventListener('change',renderFusion);
 $el('fusion-go').addEventListener('click',executeFusion);
 $el('admin-login').addEventListener('submit',e=>{
  e.preventDefault();
  if($el('admin-pass').value===ADMIN_PASSWORD)adminVisible(true);
  else{$el('admin-login-status').textContent='Incorrect password.';$el('admin-pass').value='';}
 });
 $el('admin-lock').addEventListener('click',()=>adminVisible(false));
 $el('admin-save-balances').addEventListener('click',()=>{
  if(!adminUnlocked)return;
  let vals;
  try{vals=[readAmount('admin-tokens',0,1000000000),readAmount('admin-shards',0,1000000000),readAmount('admin-seals',0,1000000000)];}
  catch(e){$el('admin-status').textContent=e.message;return;}
  if(!confirm('Set the tokens, shards, and seals in this browser to the values shown?'))return;
  withFreshSave(()=>{[save.tokens,save.shards,save.event.seals]=vals;});
 });
 $el('admin-grant').addEventListener('click',()=>{
  if(!adminUnlocked)return;
  const f=MAP[$el('admin-blook').value];let n;
  try{n=readAmount('admin-amount',1,100);if(!f||f.rarity==='Mystical')throw Error('That Blook cannot be granted.');}
  catch(e){$el('admin-status').textContent=e.message;return;}
  if(!confirm(`Add ${n} copy/copies of ${f.name} to THIS browser's save?`))return;
  withFreshSave(()=>award(f,n));
 });
 const beforeRender=render;
 render=function(){beforeRender();syncLegacyOptions();renderFusion();};
 const beforeSwitch=switchTab;
 switchTab=function(id){beforeSwitch(id);if(id==='fusion')renderFusion();if(id==='admin')renderAdmin();};
 // Changing saves by import/reset/sync automatically uses the updated validateSave.
 $el('import').addEventListener('change',()=>setTimeout(()=>{try{const raw=localStorage.getItem(WEB_KEY);if(raw)save=validateSave(JSON.parse(raw));}catch{}renderFusion();if(adminUnlocked)renderAdmin();},180));
 window.addEventListener('storage',e=>{if(e.key===WEB_KEY){try{if(e.newValue)save=validateSave(JSON.parse(e.newValue));}catch{}renderFusion();if(adminUnlocked)renderAdmin();}});
 syncLegacyOptions();
 renderFusion();
})();
