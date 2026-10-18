// On-demand image audit. Results are local to this browser. No art is copied or bundled.
(function(){
 'use strict';
 const q=id=>document.getElementById(id);
 let runId=0, results=[];
 function sourceList(f){return imageSources(f,{ignoreFailed:true});}
 function testImage(url,ms=4500){return new Promise(resolve=>{
  const img=new Image();let done=false;
  const finish=result=>{if(done)return;done=true;clearTimeout(timer);img.onload=null;img.onerror=null;resolve(result)};
  const timer=setTimeout(()=>finish('timeout'),ms);
  img.onload=()=>finish('loaded');img.onerror=()=>finish('failed');img.referrerPolicy='no-referrer';img.src=url;
 });}
 async function check(f,token){
  const list=sourceList(f);
  if(!list.length)return {f,status:'no URL'};
  let timedOut=false;
  for(const url of list){if(token!==runId)return null;
   const verdict=await testImage(url);
   if(verdict==='loaded'){SUCCESSFUL_IMAGE_URLS.set(f.id,url);return {f,status:'working'}};
   if(verdict==='timeout')timedOut=true;
  }
  return {f,status:timedOut?'timed out':'broken URL'};
 }
 function reportRows(items){
  const missing=items.filter(x=>x.status!=='working');
  q('image-check-results').innerHTML=missing.slice(0,180).map(({f,status})=>
   `<button type="button" data-art-fix-id="${escapeHtml(f.id)}" title="Select this Blook for image URL repair">${escapeHtml(f.name)} · ${escapeHtml(status)}</button>`).join('');
  q('image-copy-report').disabled=!missing.length;
 }
 const button=q('image-check-start');if(!button)return;
 q('image-check-results').addEventListener('click',e=>{
  const el=e.target.closest('[data-art-fix-id]');if(!el)return;
  q('art-blook').value=el.dataset.artFixId;syncArtworkInput();q('art-blook').scrollIntoView({behavior:'smooth',block:'center'});q('art-url').focus();
 });
 q('image-copy-report').addEventListener('click',async()=>{
  const line=results.filter(x=>x.status!=='working').map(x=>`${x.f.name} — ${x.status}`);
  if(!line.length)return;
  try{await navigator.clipboard.writeText('Twilight Bazaar image check\n'+line.join('\n'));q('image-check-status').textContent='Copied '+line.length+' missing-image entries.'}
  catch{q('image-check-status').textContent='Clipboard unavailable. Select the missing Blooks shown below.'}
 });
 q('image-check-stop').addEventListener('click',()=>{runId++;button.disabled=false;q('image-check-stop').disabled=true;q('image-check-status').textContent='Scan stopped. Partial results are shown.';reportRows(results);});
 button.addEventListener('click',async()=>{
  const scope=q('image-check-scope').value;
  const items=CATALOG.filter(f=>scope==='all'||(scope==='owned'?countOf(f.id)>0:PACKS.some(p=>p.id===f.pack&&!p.free)));
  const token=++runId;let cursor=0,completed=0;
  results=[];button.disabled=true;q('image-check-stop').disabled=false;q('image-check-results').innerHTML='';
  q('image-check-status').textContent=`Checking ${items.length} Blooks…`;
  async function worker(){while(token===runId){let ix=cursor++;if(ix>=items.length)break;
   let answer=await check(items[ix],token);if(!answer||token!==runId)return;
   results.push(answer);completed++;
   if(completed%4===0||completed===items.length){let missing=results.filter(x=>x.status!=='working');q('image-check-status').textContent=`Checked ${completed}/${items.length} · ${missing.length} need attention`;if(completed%20===0)reportRows(results);}
  }}
  await Promise.all(Array.from({length:Math.min(12,items.length)},worker));
  if(token!==runId)return;
  button.disabled=false;q('image-check-stop').disabled=true;reportRows(results);
  let c=Object.fromEntries(['working','no URL','broken URL','timed out'].map(k=>[k,results.filter(x=>x.status===k).length]));
  q('image-check-status').textContent=`Finished: ${c.working} working · ${c['no URL']} without URLs · ${c['broken URL']} broken links · ${c['timed out']} timeouts. Click a missing Blook to edit its image URL.`;
 });
})();
