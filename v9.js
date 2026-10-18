'use strict';
/* V9.1 — high-rarity fusion with bounded outcomes and protected Mysticals. */
(() => {
 const HISTORY_LIMIT=40;
 const ADMIN_PASSWORD='Orcas0112'; // Static GitHub Pages code; this is NOT secure authentication.
 // All five rows are shown before any fusion. Higher input rarities give better odds,
 // without guaranteeing any upgrade. No Mystical can be randomly pulled by fusion.
 // Fusion odds are SIMULATOR odds, not official Blooket odds. Each profile sums to 100.
 const PROFILES=[
  {max:2,title:'Starter fusion',weights:[70,22,6,1.8,.2]},
  {max:4,title:'Basic fusion',weights:[48,34,13,4,1]},
  {max:5,title:'Rare + Epic fusion',weights:[12,24,36,22,6]},
  {max:6,title:'Epic-class fusion',weights:[0,10,35,40,15]},
  {max:7,title:'Elite fusion',weights:[0,0,30,50,20]},
  {max:8,title:'Legendary fusion',weights:[0,0,10,55,35]},
  {max:9,title:'Chroma + Legendary fusion',weights:[0,0,0,25,75]},
  {max:100,title:'Chroma fusion',weights:[0,0,0,0,100]}
 ];
 const TIERS=[
  {key:'Uncommon',color:'#7fdda1'},
  {key:'Rare',color:'#55b7f9'},
  {key:'Epic',color:'#ac8eff'},
  {key:'Legendary',color:'#f5ba5d'},
  {key:'Chroma',color:'#fb88dd'}
 ];
 const POWER={Common:0,Uncommon:1,Rare:2,Epic:3,Legendary:4,Chroma:5,Mystical:6,Unique:2,'Game Mode':2,Unclassified:1};
 const standardPacks=PACKS.filter(p=>!p.free&&!p.special&&!p.fanMade&&!p.original&&!p.simulatorVault);
 const candidates=[...new Set(standardPacks.flatMap(p=>p.items.filter(([, ,weight])=>Number(weight)>0).map(([name])=>slug(name))))]
  .map(id=>MAP[id]).filter(f=>f&&!f.catalogOnly&&!f.unreleased);
 const pools=Object.fromEntries(TIERS.map(t=>[t.key,candidates.filter(f=>f.rarity===t.key)]));
 if(PROFILES.some(p=>Math.abs(p.weights.reduce((a,b)=>a+b,0)-100)>0.00001)||TIERS.some(t=>!pools[t.key].length)) throw Error('Fusion table invalid');
 const $el=id=>document.getElementById(id);
 const blankV9=()=>({total:0,history:[],showArchived:false});
 const selectedInputs=['',''];
 const boosterInputs=['','',''];
 let adminUnlocked=false;
 function sanitizeV9(raw){
  const out=blankV9();if(!raw||typeof raw!=='object')return out;
  out.total=maxInt(raw.total);
  if(Array.isArray(raw.history))out.history=raw.history.slice(0,HISTORY_LIMIT).map(h=>{
   if(!h||typeof h!=='object')return null;
   // Keep previous Rare+Epic history entries readable after this upgrade.
   const a=h.a||h.rare,b=h.b||h.epic;
   if(!MAP[a]||!MAP[b]||!MAP[h.reward])return null;
   return {a,b,boosters:Array.isArray(h.boosters)?h.boosters.slice(0,3).filter(id=>Boolean(MAP[id])):[],reward:h.reward,outcome:String(h.outcome||''),date:typeof h.date==='string'?h.date.slice(0,32):'',lastCopyOverride:!!h.lastCopyOverride,mode:h.mode==='jackpot'?'jackpot':'balanced'};
  }).filter(Boolean);
  out.total=Math.max(out.total,out.history.length);
  return out;
 }
 const priorValidate=validateSave;
 validateSave=function(raw){const v=priorValidate(raw);v.v9=sanitizeV9(raw?.v9);return v;};
 try{const raw=localStorage.getItem(WEB_KEY);save=raw?validateSave(JSON.parse(raw)):validateSave(newSave());}
 catch(e){console.warn('V9.0.2 save recovery',e);save=validateSave(newSave());}
 const owned=(id)=>Boolean(MAP[id])&&countOf(id)>0;
 function inputList(current,other){
  return CATALOG.filter(f=>f.rarity!=='Mystical'&&owned(f.id)&&(!other||f.id!==other||countOf(f.id)>=2))
   .sort((x,y)=>(POWER[y.rarity]??1)-(POWER[x.rarity]??1)||x.name.localeCompare(y.name));
 }
 function selectedArt(id){return id&&MAP[id]?cardArt(MAP[id]):'<div class="v9-empty-art">?</div>';}
 function populateInput(index){
  const select=$el(index?'fusion-epic':'fusion-rare');
  const list=inputList(selectedInputs[index],selectedInputs[1-index]);
  if(!list.some(f=>f.id===selectedInputs[index]))selectedInputs[index]=list[0]?.id||'';
  select.innerHTML=list.length?list.map(f=>`<option value="${escapeHtml(f.id)}">${escapeHtml(f.name)} · ${escapeHtml(f.rarity)} · ${fmt(countOf(f.id))} owned</option>`).join(''):'<option value="">No eligible Blooks owned</option>';
  select.value=selectedInputs[index];select.disabled=!list.length;
 }
 function choicePower(){return selectedInputs.reduce((sum,id)=>sum+(POWER[MAP[id]?.rarity]??0),0);}
 function getProfile(){const power=choicePower();return PROFILES.find(x=>power<=x.max)||PROFILES[PROFILES.length-1];}
 function allIngredients(){return [...selectedInputs,...boosterInputs.filter(Boolean)];}
 function selectionCounts(){
  const needs={};for(const id of allIngredients())if(id)needs[id]=(needs[id]||0)+1;
  return needs;
 }
 function fuseStatus(){
  const [a,b]=selectedInputs,needs=selectionCounts();
  const enough=Boolean(a&&b&&Object.entries(needs).every(([id,n])=>countOf(id)>=n));
  const touchesLast=enough&&Object.entries(needs).some(([id,n])=>countOf(id)-n===0);
  return {enough,touchesLast,same:Boolean(a&&a===b),needs};
 }
 function boosterStrength(){return boosterInputs.filter(Boolean).reduce((sum,id)=>sum+(1+(POWER[MAP[id]?.rarity]??0)),0);}
 function riskMode(){return $el('fusion-risk')?.value==='jackpot'?'jackpot':'balanced';}
 function unboostedWeights(){
  const base=[...getProfile().weights];
  if(riskMode()==='balanced'||base[4]>=100)return base;
  // Jackpot shifts 5 percentage points from the largest non-Chroma tier;
  // for high-rarity pairs this never introduces an Uncommon consolation prize.
  const donor=base.slice(0,4).map((x,i)=>({x,i})).sort((a,b)=>b.x-a.x)[0];
  const shift=Math.min(5,donor.x*.30);
  base[donor.i]-=shift;base[4]+=shift;
  return base;
 }
 function currentWeights(){
  const base=unboostedWeights(),boost=boosterStrength();
  if(!boost||base[4]>=100)return base.map(x=>Number(x.toFixed(5)));
  const result=[...base];
  // Boosters transfer probability toward Chroma, and toward Legendary only
  // if Legendary isn't already guaranteed or above. No worse tiers are added.
  const desiredChroma=Math.min(15,boost*.8), desiredLegend=Math.min(7,boost*.35);
  let remainingChroma=desiredChroma,remainingLegend=desiredLegend;
  for(const i of [0,1,2,3]){const take=Math.min(result[i],remainingChroma);result[i]-=take;result[4]+=take;remainingChroma-=take;}
  for(const i of [0,1,2]){const take=Math.min(result[i],remainingLegend);result[i]-=take;result[3]+=take;remainingLegend-=take;}
  const fixed=result.map(x=>Number(x.toFixed(5)));
  fixed[4]=Number((100-fixed.slice(0,4).reduce((a,b)=>a+b,0)).toFixed(5));
  return fixed;
 }
 function populateBoosters(){
  const root=$el('fusion-booster-list');if(!root)return;
  boosterInputs.forEach((selected,i)=>{
   const el=$el(`fusion-boost-${i}`);
   const taken=[...selectedInputs,...boosterInputs.filter((_,j)=>j!==i)].filter(Boolean);
   const required={};taken.forEach(id=>required[id]=(required[id]||0)+1);
   const eligible=CATALOG.filter(f=>f.rarity!=='Mystical'&&countOf(f.id)>(required[f.id]||0)).sort((a,b)=>a.name.localeCompare(b.name));
   if(selected&&!eligible.some(f=>f.id===selected))boosterInputs[i]='';
   el.innerHTML='<option value="">No extra Blook</option>'+eligible.map(f=>`<option value="${escapeHtml(f.id)}">${escapeHtml(f.name)} (${escapeHtml(f.rarity)}, ${fmt(countOf(f.id))} owned)</option>`).join('');
   el.value=boosterInputs[i];
  });
 }
 function renderFusion(){
  populateInput(0);populateInput(1);
  // Changing the first choice can change whether the second has enough copies.
  if(selectedInputs[0]===selectedInputs[1]&&countOf(selectedInputs[0])<2){
   const alt=inputList('',selectedInputs[0]).find(f=>f.id!==selectedInputs[0]);selectedInputs[1]=alt?.id||'';populateInput(1);
  }
  populateBoosters();
  const profile=getProfile(),[a,b]=selectedInputs,status=fuseStatus(),protect=$el('fusion-protect').checked,weights=currentWeights(),baseline=unboostedWeights();
  for(let i=0;i<2;i++){
   const art=$el(i?'fusion-epic-art':'fusion-rare-art'),ownedText=$el(i?'fusion-epic-owned':'fusion-rare-owned');
   art.innerHTML=selectedArt(selectedInputs[i]);
   ownedText.textContent=selectedInputs[i]?`${fmt(countOf(selectedInputs[i]))} copies · ${MAP[selectedInputs[i]].rarity}`:'Get Blooks from packs or the collection';
  }
  $el('fusion-odds-title').textContent=a&&b?`${profile.title} · ${MAP[a].rarity} + ${MAP[b].rarity} · ${riskMode()==='jackpot'?'Jackpot':'Balanced'}`:'Choose any two Blooks';
  $el('fusion-odds').innerHTML=TIERS.map((tier,i)=>{
   const chance=weights[i];
   return `<div class="v9-odds-row"><div class="v9-odds-line"><span>Random ${tier.key}</span><b>${chance}%</b></div><div class="v9-odds-track"><div style="width:${chance}%;background:${tier.color}"></div></div></div>`;
  }).join('');
  $el('fusion-booster-summary').textContent=boosterInputs.some(Boolean)?`${boosterInputs.filter(Boolean).length} bonus ingredients: +${Number((weights[4]-baseline[4]).toFixed(4))} percentage points Chroma, +${Number((weights[3]-baseline[3]).toFixed(4))} Legendary. ${allIngredients().length} Blooks will be consumed.`:'Optional: add up to 3 spare Blooks to improve reward chances. Original Mysticals stay protected.';
  $el('fusion-warning').textContent=!status.enough?'You need enough copies of every selected Blook to fuse.':status.touchesLast?(protect?'Last-copy protection is on. Use duplicates or turn protection off for an extra confirmation.':'CAUTION: This will consume the last copy of at least one Blook.'): 'Ready. Two ingredient Blooks will be consumed for one reward; original Mysticals are protected.';
  $el('fusion-go').disabled=!status.enough||(status.touchesLast&&protect);
  const v=save.v9||blankV9(),hist=v.history;
  $el('fusion-stats').innerHTML=`<div class="stat-card"><span>Fusions completed</span><b>${fmt(v.total)}</b></div><div class="stat-card"><span>Legendary rewards</span><b>${fmt(hist.filter(x=>MAP[x.reward]?.rarity==='Legendary').length)}</b></div><div class="stat-card"><span>Chroma rewards</span><b>${fmt(hist.filter(x=>MAP[x.reward]?.rarity==='Chroma').length)}</b></div><div class="stat-card"><span>History saved</span><b>${fmt(hist.length)}</b></div>`;
  $el('fusion-history').innerHTML=hist.length?hist.map((h,i)=>{
   const a=MAP[h.a],b=MAP[h.b],r=MAP[h.reward];
   const niceDate=h.date&&Number.isFinite(Date.parse(h.date))?new Date(h.date).toLocaleString():'Earlier fusion';
   return `<div class="v9-journal-row"><span class="v9-journal-number">#${fmt(v.total-i)}</span><span class="v9-journal-input">${escapeHtml(a.name)} + ${escapeHtml(b.name)}${h.boosters?.length?' + '+h.boosters.length+' boosters':''}${h.mode==='jackpot'?' · Jackpot':''}</span><span class="v9-journal-arrow">→</span><span class="v9-journal-reward">${cardArt(r)}<strong>${escapeHtml(r.name)}</strong> ${labelRarity(r.rarity)}</span><small>${escapeHtml(niceDate)}</small></div>`;
  }).join(''):'<div class="history-empty">No fusions yet. Your first experiment will be recorded here.</div>';
 }
 function chooseReward(weights){
  let roll=Math.random()*100,index=weights.length-1;
  for(let i=0;i<weights.length;i++){roll-=weights[i];if(roll<0){index=i;break;}}
  const tier=TIERS[index];const pool=pools[tier.key];
  return {reward:pool[Math.floor(Math.random()*pool.length)],chance:weights[index],tier};
 }
 function executeFusion(){
  if(busy)return;
  try{const raw=localStorage.getItem(WEB_KEY);if(raw)save=validateSave(JSON.parse(raw));}
  catch(e){notice('Cannot read your current save. Fusion canceled.');return;}
  const [aId,bId]=selectedInputs,status=fuseStatus(),protect=$el('fusion-protect').checked;
  if(!status.enough){renderFusion();notice('You do not have enough copies of both Blooks.');return;}
  if(status.touchesLast&&protect){renderFusion();notice('Turn off last-copy protection to fuse this pair.');return;}
  const first=MAP[aId],second=MAP[bId],profile=getProfile(),weights=currentWeights(),ingredients=allIngredients();
  const extra=status.touchesLast?'\nWARNING: At least one will disappear from your collection!':'';
  const mystical='\nOriginal Mysticals cannot be used as ingredients or won through random fusion.';
  if(!confirm(`Fuse ${first.name} (${first.rarity}) + ${second.name} (${second.rarity})?\n${ingredients.length} ingredient copies (including ${boosterInputs.filter(Boolean).length} extra boosters) will be consumed for ONE random Blook.${extra}${mystical}\n\nMode: ${riskMode()==='jackpot'?'Jackpot':'Balanced'}\nChroma: ${weights[4]}% · Legendary: ${weights[3]}%. Continue?`))return;
  const previous=JSON.stringify(save);const {reward,chance,tier}=chooseReward(weights);
  if(!reward)return notice('No reward available; fusion canceled.');
  busy=true;
  try{
   for(const [id,n] of Object.entries(status.needs))save.inventory[id]=countOf(id)-n;
   award(reward);
   save.v9=save.v9||blankV9();save.v9.total=maxInt(save.v9.total+1);
   save.v9.history.unshift({a:aId,b:bId,reward:reward.id,outcome:tier.key,date:new Date().toISOString(),lastCopyOverride:status.touchesLast,boosters:boosterInputs.filter(Boolean).slice(),mode:riskMode()});
   save.v9.history=save.v9.history.slice(0,HISTORY_LIMIT);
   persist();
   $el('fusion-result').innerHTML=`<span class="eyebrow">FUSION COMPLETE · ${escapeHtml(tier.key)} REWARD</span><div class="v9-result-art">${cardArt(reward)}</div>${labelRarity(reward.rarity)}<h3>${escapeHtml(reward.name)}</h3><p>Consumed <b>${escapeHtml(first.name)}</b> + <b>${escapeHtml(second.name)}</b>${boosterInputs.some(Boolean)?' plus '+boosterInputs.filter(Boolean).length+' boosters':''} · Won one ${escapeHtml(reward.name)}.</p><p class="fine-print">${chance}% category chance in ${riskMode()==='jackpot'?'Jackpot':'Balanced'} mode, then an equal chance among eligible ${tier.key} Blooks.</p>`;
   notice(`Fusion success: ${reward.name}!`);
  }catch(e){console.error(e);try{save=validateSave(JSON.parse(previous));}catch{}notice('Fusion could not be saved. No further action was taken.');}
  finally{busy=false;render();}
 }
 function renderAdmin(){
  if(!adminUnlocked)return;
  $el('admin-tokens').value=save.tokens;
  $el('admin-shards').value=save.shards;
  $el('admin-seals').value=save.event.seals;
  const select=$el('admin-blook'),keep=select.value;
  const eligible=CATALOG.filter(f=>f.rarity!=='Mystical'&&!PACKS.some(p=>(p.fanMade||p.original)&&p.id===f.pack));
  select.innerHTML=eligible.sort((a,b)=>a.name.localeCompare(b.name)).map(f=>`<option value="${escapeHtml(f.id)}">${escapeHtml(f.name)} (${escapeHtml(f.rarity)})</option>`).join('');
  if([...select.options].some(o=>o.value===keep))select.value=keep;
 }
 function setAdminVisible(show){
  adminUnlocked=show;$el('admin-gate').hidden=show;$el('admin-tools').hidden=!show;
  $el('admin-pass').value='';$el('admin-login-status').textContent='';
  $el('admin-status').textContent='';
  if(show){renderAdmin();$el('admin-status').textContent='Admin unlocked. Changes here affect THIS browser only.';}
 }
 function readAmount(id,min,max){
  const s=$el(id).value.trim(),n=Number(s);
  if(!/^\d+$/.test(s)||!Number.isSafeInteger(n)||n<min||n>max)throw Error(`Please enter a whole number between ${min} and ${max}.`);
  return n;
 }
 function withFreshSave(mutator){
  try{
   const raw=localStorage.getItem(WEB_KEY);
   if(raw)save=validateSave(JSON.parse(raw));
   mutator();persist();render();renderAdmin();
   $el('admin-status').textContent='Saved! Look at the wallet or Collection tab to confirm your changes.';
  }catch(e){console.error('Admin save failed',e);$el('admin-status').textContent=`Could not save: ${e.message}`;}
 }
 function syncLegacyOptions(){
  const el=$el('pack-select'),current=el.value;
  el.innerHTML=PACKS.filter(p=>!p.fanMade&&!p.original).map(p=>`<option value="${escapeHtml(p.id)}">${escapeHtml(p.name)}${p.free?' · gallery':''}</option>`).join('');
  if([...el.options].some(x=>x.value===current))el.value=current;
  else{selectedPack='medieval';el.value=selectedPack;}
  drawPackOdds();
  $el('v8-pack-search').dispatchEvent(new Event('input'));
 }
 // Controllers and initial paint.
 $el('fusion-rare').addEventListener('change',e=>{selectedInputs[0]=e.target.value;renderFusion();});
 $el('fusion-epic').addEventListener('change',e=>{selectedInputs[1]=e.target.value;renderFusion();});
 $el('fusion-protect').addEventListener('change',renderFusion);
 $el('fusion-risk').addEventListener('change',renderFusion);
 for(let i=0;i<3;i++)$el('fusion-boost-'+i).addEventListener('change',e=>{boosterInputs[i]=e.target.value;renderFusion();});
 $el('fusion-go').addEventListener('click',executeFusion);
 $el('admin-login').addEventListener('submit',e=>{
  e.preventDefault();const entered=$el('admin-pass').value.trim();
  if(entered.toLowerCase()===ADMIN_PASSWORD.toLowerCase())setAdminVisible(true);
  else{$el('admin-login-status').textContent='Incorrect password. Check spelling and try again.';$el('admin-pass').focus();}
 });
 $el('admin-show-password').addEventListener('change',e=>{$el('admin-pass').type=e.target.checked?'text':'password';});
 $el('admin-lock').addEventListener('click',()=>setAdminVisible(false));
 $el('admin-save-balances').addEventListener('click',()=>{
  if(!adminUnlocked)return;
  let values;
  try{values=[readAmount('admin-tokens',0,1000000000),readAmount('admin-shards',0,1000000000),readAmount('admin-seals',0,1000000000)];}
  catch(e){$el('admin-status').textContent=e.message;return;}
  if(!confirm('Replace this browser’s token, shard, and seal totals with the numbers shown?'))return;
  withFreshSave(()=>{[save.tokens,save.shards,save.event.seals]=values;});
 });
 $el('admin-grant').addEventListener('click',()=>{
  if(!adminUnlocked)return;
  const f=MAP[$el('admin-blook').value];let amount;
  try{amount=readAmount('admin-amount',1,100);if(!f||f.rarity==='Mystical'||PACKS.some(p=>(p.fanMade||p.original)&&p.id===f.pack))throw Error('This Blook cannot be granted from admin.');}
  catch(e){$el('admin-status').textContent=e.message;return;}
  if(!confirm(`Give this browser ${amount} copy/copies of ${f.name}?`))return;
  withFreshSave(()=>award(f,amount));
 });
 const beforeRender=render;
 render=function(){beforeRender();syncLegacyOptions();renderFusion();};
 const beforeSwitch=switchTab;
 switchTab=function(id){beforeSwitch(id);if(id==='fusion')renderFusion();if(id==='admin')renderAdmin();};
 $el('import').addEventListener('change',()=>setTimeout(()=>{try{const raw=localStorage.getItem(WEB_KEY);if(raw)save=validateSave(JSON.parse(raw));}catch{}render();if(adminUnlocked)renderAdmin();},180));
 window.addEventListener('storage',e=>{if(e.key===WEB_KEY){try{if(e.newValue)save=validateSave(JSON.parse(e.newValue));}catch{}renderFusion();if(adminUnlocked)renderAdmin();}});
 syncLegacyOptions();renderFusion();
})();
