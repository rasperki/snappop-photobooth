// ---------- Logo huruf melompat ----------
document.getElementById('logo').innerHTML = 'SNAPPOP!'.split('').map(c=>`<span class="l">${c}</span>`).join('')+' <span>⚡</span>';

// ---------- 1. Background doodle bergerak (dipertahankan + lebih lucu) ----------
const bgCanvas=document.getElementById('bg-canvas'), bgCtx=bgCanvas.getContext('2d');
let musicOn=false;
const TOTAL_DOODLES=40; let doodles=[];
function resizeBg(){bgCanvas.width=innerWidth;bgCanvas.height=innerHeight}
addEventListener('resize',resizeBg);resizeBg();
class Doodle{
  constructor(){this.reset()}
  reset(){this.x=Math.random()*bgCanvas.width;this.y=Math.random()*bgCanvas.height;this.size=Math.random()*12+10;
    this.speedY=-(Math.random()*.5+.15);this.rot=Math.random()*6.28;this.rotSpeed=(Math.random()-.5)*.02;
    this.type=Math.floor(Math.random()*5);this.phase=Math.random()*6.28}
  update(){this.y+=this.speedY*(musicOn?2.2:1);this.rot+=this.rotSpeed;this.phase+=.02;this.x+=Math.sin(this.phase)*.4;
    if(this.y<-30){this.y=bgCanvas.height+30;this.x=Math.random()*bgCanvas.width}}
  draw(col){
    const c=bgCtx,s=this.size;c.save();c.translate(this.x,this.y);c.rotate(this.rot);
    c.strokeStyle=c.fillStyle=col;c.lineWidth=2.5;c.lineCap='round';c.beginPath();
    if(this.type===0){c.moveTo(0,-s);c.quadraticCurveTo(0,0,s,0);c.quadraticCurveTo(0,0,0,s);c.quadraticCurveTo(0,0,-s,0);c.quadraticCurveTo(0,0,0,-s);c.stroke()}
    else if(this.type===1){c.moveTo(0,-s*.6);c.lineTo(0,s*.6);c.moveTo(-s*.6,0);c.lineTo(s*.6,0);c.stroke()}
    else if(this.type===2){c.arc(0,0,s*.6,.5*Math.PI,1.5*Math.PI,true);c.quadraticCurveTo(s*.3,0,0,-s*.6);c.stroke()}
    else if(this.type===3){c.arc(0,0,3,0,6.28);c.fill()}
    else{const k=s*.55;c.moveTo(0,k*.4);c.bezierCurveTo(-k*1.4,-k*.6,-k*.4,-k*1.5,0,-k*.5);c.bezierCurveTo(k*.4,-k*1.5,k*1.4,-k*.6,0,k*.4);c.stroke()} // hati
    c.restore()}
}
for(let i=0;i<TOTAL_DOODLES;i++)doodles.push(new Doodle());
(function animateBg(){
  bgCtx.clearRect(0,0,bgCanvas.width,bgCanvas.height);
  const col=getComputedStyle(document.body).getPropertyValue('--doodle').trim();
  doodles.forEach(d=>{d.update();d.draw(col)});requestAnimationFrame(animateBg)})();

// ---------- Sparkle cursor + confetti + toast ----------
let lastSpark=0;
addEventListener('pointermove',e=>{
  const now=performance.now();if(now-lastSpark<70)return;lastSpark=now;
  const s=document.createElement('div');s.className='spark';s.textContent=['✨','💖','⭐','🌸'][Math.floor(Math.random()*4)];
  s.style.left=e.clientX+'px';s.style.top=e.clientY+'px';
  s.style.setProperty('--dx',(Math.random()*50-25)+'px');s.style.setProperty('--dy',(Math.random()*50+10)+'px');
  document.body.appendChild(s);setTimeout(()=>s.remove(),800)});
function confetti(){
  const e=['🎉','💖','✨','🌸','⭐','🎀','🧁'];
  for(let i=0;i<36;i++){const c=document.createElement('div');c.className='confetti';c.textContent=e[i%e.length];
    c.style.left=Math.random()*100+'vw';c.style.setProperty('--dx',(Math.random()*200-100)+'px');
    c.style.animationDuration=(2+Math.random()*2)+'s';c.style.animationDelay=Math.random()*.5+'s';
    document.body.appendChild(c);setTimeout(()=>c.remove(),4800)}}
function toast(t){const d=document.createElement('div');d.className='toast';d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2200)}

// ---------- Dark mode ----------
const themeIcon=document.getElementById('theme-icon');
const SETTINGS_KEY='snappop-settings-v1';
function loadSettings(){
  try{return JSON.parse(localStorage.getItem(SETTINGS_KEY)||'{}')}catch(e){return {}}
}
function saveSettings(patch){
  try{localStorage.setItem(SETTINGS_KEY,JSON.stringify({...loadSettings(),...patch}))}catch(e){}
}
const savedSettings=loadSettings();
if(savedSettings.darkMode){
  document.body.classList.add('dark-mode');
  themeIcon.innerText='☀️';
}
document.getElementById('theme-toggle').addEventListener('click',()=>{
  document.body.classList.toggle('dark-mode');
  themeIcon.innerText=document.body.classList.contains('dark-mode')?'☀️':'🌙';
  saveSettings({darkMode:document.body.classList.contains('dark-mode')});renderStrip()});

// ---------- Build warna & stamp ----------
const SOLID=[['#ffffff','Classic White'],['#FFD6E5','Baby Pink'],['#D7F9F1','Mint Green'],['#FFF5BA','Butter Yellow'],['#E2D4F9','Soft Lavender'],
 ['#FFC2A1','Peach Sorbet'],['#B8E1FF','Sky Blue'],['#FF94B9','Hot Pink'],['#6C5CE7','Electric Purple'],['#70A1FF','Periwinkle'],['#4A5568','Slate Gray'],['#2D2B30','Midnight Dark']];
const GRADS=[['Cotton Candy',['#FFD6E5','#E2D4F9','#B8E1FF']],['Peach Sunset',['#FFE3A3','#FFB199','#FF8FB1']],['Mint Lemonade',['#B8F5E1','#FFF5BA']],
 ['Bubblegum',['#FF9DC2','#FFD25E']],['Ocean Breeze',['#70A1FF','#6FE3C1']],['Lavender Sky',['#E2D4F9','#9FC5FF']],['Strawberry Milk',['#FFFFFF','#FFB6D0']],
 ['Pastel Rainbow',['#FFB3C7','#FFD9A8','#FFF5BA','#C8F5D8','#BFE0FF','#DCC8FF']],['Aurora',['#6FE3C1','#7B61FF','#FF6FA3']],['Galaxy Night',['#2D2B30','#6C5CE7','#FF6FA3']],
 ['Dusk',['#4A5568','#B24E7E','#FFC83D']],['Peachy Cream',['#FFF4EC','#FFC2A1']]];
document.getElementById('colors').innerHTML=SOLID.map(([c,t],i)=>`<button class="color-dot${i?'':' active'}" data-color="${c}" style="background:${c}" title="${t}"></button>`).join('');
document.getElementById('grads').innerHTML=GRADS.map(([t,cs])=>`<button class="color-dot" data-color="g:${cs.join(',')}" style="background:linear-gradient(135deg,${cs.join(',')})" title="${t}"></button>`).join('');

const CUTE=[['Normal','none'],['Soft B&W','grayscale(100%) brightness(105%)'],['Warm Vintage','sepia(40%) saturate(140%) contrast(95%)'],
 ['Peach Pop','contrast(110%) brightness(115%) saturate(130%)'],['Dreamy Pink','hue-rotate(280deg) saturate(180%) contrast(110%)'],
 ['Cyber Neon','hue-rotate(170deg) contrast(120%) brightness(110%)'],['Retro Chrome','contrast(140%) sepia(30%) hue-rotate(-20deg)'],
 ['Moody Noir','grayscale(100%) contrast(160%) brightness(85%)'],
 ['Golden Hour','sepia(30%) saturate(160%) brightness(110%) hue-rotate(-10deg)'],['Cotton Candy','saturate(150%) brightness(115%) hue-rotate(310deg) contrast(90%)'],
 ['Matcha Latte','sepia(35%) hue-rotate(40deg) saturate(120%) brightness(108%)'],['Sakura Haze','brightness(118%) contrast(88%) saturate(125%) sepia(15%) hue-rotate(320deg)'],
 ['Lavender Haze','hue-rotate(240deg) saturate(120%) brightness(110%) contrast(92%)'],['Ocean Dream','hue-rotate(190deg) saturate(130%) brightness(108%)'],
 ['Polaroid Fade','contrast(85%) brightness(115%) sepia(20%) saturate(90%)'],['Sunset Glow','sepia(50%) saturate(200%) hue-rotate(-30deg) brightness(105%)'],
 ['Overexposed','brightness(150%) contrast(80%) saturate(80%)'],['Neon Night','contrast(130%) saturate(220%) brightness(90%) hue-rotate(300deg)']];
const UGLY=[['👃 Big Nose','saturate(120%)','bulge'],['🤏 Tiny Face','none','pinch'],['🌀 Twirl Brain','none','twirl'],['🫠 Wobbly Jelly','saturate(130%)','wavy'],
 ['🐴 Long Face','none','long'],['🥞 Pancake Face','none','squish'],['🍦 Melty Me','hue-rotate(20deg) saturate(150%)','melt'],['👯 Twin Me','none','mirror'],
 ['🥚 Big Forehead','none','forehead'],['👽 Alien','invert(100%) hue-rotate(180deg)','bulge'],['🧟 Zombie','grayscale(60%) sepia(60%) hue-rotate(60deg) contrast(130%)','pinch']];
document.getElementById('filters-cute').innerHTML=CUTE.map(([n,f],i)=>`<button class="pill${i?'':' active'}" data-filter="${f}">${n}</button>`).join('');
document.getElementById('filters-ugly').innerHTML=UGLY.map(([n,f,w])=>`<button class="pill" data-filter="${f}" data-warp="${w}">${n}</button>`).join('');
document.getElementById('filter-label').textContent=`Choose Filter (${CUTE.length+UGLY.length} Preset)`;

const STAMP_SETS={'💗 Cute':['💖','💗','💕','🎀','🧸','🌸','💌','👑','💝','🌷','🍭','🧁','🫶','🩷','🪩','🎠'],
 '🍓 Yum':['🍒','🍓','🍑','🍉','🍩','🍪','🍦','🧋','🍕','🍔','🍟','🍡','🍰','🥐','🍋','🥑'],
 '🐱 Pets':['🐱','🐰','🐶','🐻','🦊','🐼','🐸','🐥','🦄','🐙','🦋','🐝','🐧','🐹','🐨','🐷'],
 '✨ Magic':['✨','⭐','⚡','🌙','🍀','🌈','☁️','🔥','💫','🌟','🎈','🎉','🫧','🔮','💎','🎵'],
 '💬 Words':['OMG!','LOL','xoxo','BFF','slay','cute!','peace ✌','wow!','mood','uwu','yay!','boop','besties','era','y2k','pls']};
const tabsEl=document.getElementById('stamp-tabs'), stampsEl=document.getElementById('stamps');
function showStamps(name){
  const txt=name.includes('Words');
  stampsEl.innerHTML=STAMP_SETS[name].map(s=>`<button class="stamp-btn${txt?' txt':''}" data-stamp="${s}" data-kind="${txt?'txt':'emoji'}">${s}</button>`).join('');
  tabsEl.querySelectorAll('.pill').forEach(b=>b.classList.toggle('active',b.dataset.tab===name))}
tabsEl.innerHTML=Object.keys(STAMP_SETS).map(n=>`<button class="pill mini" data-tab="${n}">${n}</button>`).join('');
tabsEl.addEventListener('click',e=>{const b=e.target.closest('.pill');if(b)showStamps(b.dataset.tab)});
showStamps('💗 Cute');

// ---------- 2. Studio ----------
const video=document.getElementById('webcam'), canvas=document.getElementById('strip-canvas'), ctx=canvas.getContext('2d');
const btnSnap=document.getElementById('btn-snap'), snapBtnText=document.getElementById('snap-btn-text'), btnRetake=document.getElementById('btn-retake');
const btnDownload=document.getElementById('btn-download'), btnShare=document.getElementById('btn-share'), btnGif=document.getElementById('btn-gif'), actionButtons=document.getElementById('action-buttons');
const countdownEl=document.getElementById('countdown-layer'), flashEl=document.getElementById('flash'), progressEl=document.getElementById('progress'), emptyEl=document.getElementById('empty');
const retakeModal=document.getElementById('retake-modal'), btnConfirmRetake=document.getElementById('btn-confirm-retake'), btnCancelRetake=document.getElementById('btn-cancel-retake');

let capturedPhotos=[], photoBoxes=[], selectedPhotoIndex=-1, activeFilter='none', activeBgColor='#ffffff', activeLayout='vertical';
let activeWarp='', totalPoses=4, timerSec=3, stampsOnCanvas=[], draggedStampIndex=-1;
activeFilter=savedSettings.filter||'none';
activeBgColor=savedSettings.background||'#ffffff';
activeLayout=savedSettings.layout||'vertical';
totalPoses=savedSettings.poses||4;
timerSec=savedSettings.timer||3;

async function initCamera(){
  const cameraError=document.getElementById('camera-error');
  try{
    video.srcObject=await navigator.mediaDevices.getUserMedia({video:{width:{ideal:1280},height:{ideal:960},facingMode:'user'},audio:false});
    cameraError.classList.add('hidden');
  }catch(e){
    cameraError.classList.remove('hidden');
    toast('Kamera belum bisa diakses. Izinkan akses kamera ya 📷');
  }
}

function setActive(sel,el){document.querySelectorAll(sel).forEach(b=>b.classList.remove('active'));el.classList.add('active')}

document.querySelectorAll('.pose-btn').forEach(b=>b.addEventListener('click',e=>{
  setActive('.pose-btn',e.currentTarget);totalPoses=parseInt(e.currentTarget.dataset.poses);
  snapBtnText.innerText=`✨ Take Photos (${totalPoses}x)`;saveSettings({poses:totalPoses})}));
document.querySelectorAll('.timer-btn').forEach(b=>b.addEventListener('click',e=>{
  const cur=e.currentTarget;if(cur.classList.contains('active')){cur.classList.remove('active');timerSec=3;saveSettings({timer:3});return}
  setActive('.timer-btn',cur);timerSec=parseInt(cur.dataset.sec);saveSettings({timer:timerSec})}));

function drawProgress(done){progressEl.innerHTML=Array.from({length:totalPoses},(_,i)=>`<i class="${i<done?'on':''}"></i>`).join('')}

btnSnap.addEventListener('click',async()=>{
  capturedPhotos=[];btnSnap.disabled=true;drawProgress(0);
  for(let i=0;i<totalPoses;i++){
    await runCountdown(timerSec);triggerFlash();capturedPhotos.push(captureFrame());drawProgress(i+1);
    if(i<totalPoses-1)await new Promise(r=>setTimeout(r,500))}
  btnSnap.disabled=false;renderStrip(true);confetti();toast('Yay! Strip kamu jadi 🎉')});

function runCountdown(seconds){
  return new Promise(resolve=>{
    let cur=seconds;countdownEl.classList.remove('hidden');
    const show=n=>{const s=countdownEl.firstElementChild.cloneNode();s.textContent=n;countdownEl.replaceChildren(s)};
    show(cur);
    const t=setInterval(()=>{cur--;if(cur>0)show(cur);else{clearInterval(t);countdownEl.classList.add('hidden');resolve()}},1000)})}

function triggerFlash(){flashEl.classList.add('active');setTimeout(()=>flashEl.classList.remove('active'),150)}

function captureFrame(){
  const c=document.createElement('canvas');c.width=800;c.height=600;const t=c.getContext('2d');
  t.filter=activeFilter;t.translate(c.width,0);t.scale(-1,1);t.drawImage(video,0,0,c.width,c.height);
  t.setTransform(1,0,0,1,0,0);t.filter='none';
  if(activeWarp)warp(c,activeWarp,performance.now()/1000);return c}

// Ugly-face warp: remap tiap pixel (koordinat -1..1 dari tengah)
function warp(c,type,tm){
  const x=c.getContext('2d'),w=c.width,h=c.height,src=x.getImageData(0,0,w,h),out=x.createImageData(w,h),S=src.data,O=out.data;
  for(let y=0;y<h;y++){const ny=y/h*2-1;
    for(let px=0;px<w;px++){
      const nx=px/w*2-1;let sx=nx,sy=ny;const r=Math.hypot(nx,ny);
      switch(type){
        case 'bulge':if(r<1&&r>0){const k=Math.pow(r,.7);sx=nx*k;sy=ny*k}break;
        case 'pinch':if(r<1&&r>0){const k=Math.pow(r,-.45);sx=nx*k;sy=ny*k}break;
        case 'twirl':if(r<1){const a=(1-r)*(2.6+Math.sin(tm*2)),co=Math.cos(a),si=Math.sin(a);sx=nx*co-ny*si;sy=nx*si+ny*co}break;
        case 'wavy':sx=nx+.07*Math.sin(ny*9+tm*4);break;
        case 'melt':sy=ny+.09*Math.sin(nx*7+tm*3)-.04;break;
        case 'long':sx=nx*1.35;sy=ny*.8;break;
        case 'squish':sx=nx*.75;sy=ny*1.35;break;
        case 'mirror':sx=-Math.abs(nx);break;
        case 'forehead':if(ny<0)sy=ny*.55;break}
      const ix=Math.min(w-1,Math.max(0,((sx+1)/2*w)|0)),iy=Math.min(h-1,Math.max(0,((sy+1)/2*h)|0));
      const a=(iy*w+ix)*4,b=(y*w+px)*4;O[b]=S[a];O[b+1]=S[a+1];O[b+2]=S[a+2];O[b+3]=255}}
  x.putImageData(out,0,0)}

// Live preview untuk filter ugly (dirender ke canvas kecil biar ringan)
const warpCanvas=document.getElementById('warp-canvas'),wctx=warpCanvas.getContext('2d',{willReadFrequently:true});
(function previewLoop(){
  if(activeWarp&&video.readyState>=2){
    wctx.setTransform(1,0,0,1,0,0);wctx.filter=activeFilter;wctx.translate(warpCanvas.width,0);wctx.scale(-1,1);
    wctx.drawImage(video,0,0,warpCanvas.width,warpCanvas.height);wctx.setTransform(1,0,0,1,0,0);wctx.filter='none';
    warp(warpCanvas,activeWarp,performance.now()/1000)}
  requestAnimationFrame(previewLoop)})();

// Render engine (logika layout asli dipertahankan)
function layoutStrip(){
  const n=capturedPhotos.length,small=activeLayout==='vertical'&&n>6,photoW=small?270:360,photoH=small?203:270,padding=24,topSpace=32,bottomSpace=85;
  let W=photoW+padding*2,H=topSpace+n*photoH+(n-1)*padding+bottomSpace;
  const rows=Math.ceil(n/2);
  if(activeLayout==='grid'){W=photoW*2+padding*3;H=topSpace+rows*photoH+(rows-1)*padding+bottomSpace}
  else if(activeLayout==='polaroid'){W=photoW*2+padding*3+64;H=topSpace+rows*photoH+(rows-1)*padding+bottomSpace+40}
  const boxes=capturedPhotos.map((p,idx)=>{let x,y;
    if(activeLayout==='vertical'){x=padding;y=topSpace+idx*(photoH+padding)}
    else{const off=activeLayout==='polaroid'?32:0;x=off+padding+(idx%2)*(photoW+padding);y=off+topSpace+Math.floor(idx/2)*(photoH+padding)}
    return{index:idx,x,y,w:photoW,h:photoH}});
  return{W,H,boxes}}
function renderStrip(animate){
  if(capturedPhotos.length===0)return;
  const {W,H,boxes}=layoutStrip();
  canvas.width=W;canvas.height=H;photoBoxes=boxes;
  fillBg(W,H);
  boxes.forEach(b=>ctx.drawImage(capturedPhotos[b.index],b.x,b.y,b.w,b.h));
  drawBranding(W,H);drawStamps();
  canvas.classList.remove('hidden');emptyEl.classList.add('hidden');actionButtons.classList.remove('hidden');
  if(animate){canvas.classList.remove('print');void canvas.offsetWidth;canvas.classList.add('print')}
}
function fillBg(W,H,g=ctx){
  if(activeBgColor.startsWith('g:')){const cs=activeBgColor.slice(2).split(','),gr=g.createLinearGradient(0,0,W*.6,H);
    cs.forEach((c,i)=>gr.addColorStop(i/(cs.length-1),c));g.fillStyle=gr}else g.fillStyle=activeBgColor;
  g.fillRect(0,0,W,H)}
function isDarkBg(){
  const cs=(activeBgColor.startsWith('g:')?activeBgColor.slice(2):activeBgColor).split(',');
  const l=cs.map(h=>{const n=parseInt(h.slice(1),16);return(.2126*(n>>16)+.7152*((n>>8)&255)+.0722*(n&255))/255});
  return l.reduce((a,b)=>a+b,0)/l.length<.36}
function drawBranding(W,H,g=ctx,alpha=1){
  const dark=isDarkBg();g.save();g.globalAlpha=alpha;g.textBaseline='alphabetic';g.textAlign='center';
  g.fillStyle=dark?'#FFFFFF':'#FF4081';g.font='700 22px "Chewy", cursive';g.fillText("SNAPPOP! ⚡",W/2,H-48);
  g.fillStyle=dark?'#CCCCCC':'#718096';g.font='700 11px "Nunito", sans-serif';
  const today=new Date().toLocaleDateString('en-US',{month:'short',day:'2-digit',year:'numeric'});
  g.fillText(`by Gege's Lab • ${today}`,W/2,H-26);g.restore()}
function drawStamp(g,s,x=s.x,y=s.y,k=1,rot=0){
  g.save();g.translate(x,y);g.rotate(rot);g.scale(k,k);g.textAlign='center';g.textBaseline='middle';
  if(s.kind==='txt'){g.font=`${s.size*.9}px Chewy, cursive`;g.lineJoin='round';g.lineWidth=s.size*.22;g.strokeStyle='#fff';g.strokeText(s.text,0,0);g.fillStyle=s.color;g.fillText(s.text,0,0)}
  else{g.font=`${s.size}px serif`;g.fillText(s.text,0,0)}
  g.restore()}
function drawStamps(g=ctx){stampsOnCanvas.forEach(s=>drawStamp(g,s))}

// Retake per foto (klik) vs drag stamp: dibedakan agar tidak bentrok
let dragMoved=false;
canvas.addEventListener('click',e=>{
  if(dragMoved||capturedPhotos.length===0)return;
  const c=coords(e);
  for(const b of photoBoxes)if(c.x>=b.x&&c.x<=b.x+b.w&&c.y>=b.y&&c.y<=b.y+b.h){selectedPhotoIndex=b.index;retakeModal.classList.remove('hidden');return}});
btnConfirmRetake.addEventListener('click',async()=>{
  retakeModal.classList.add('hidden');if(selectedPhotoIndex===-1)return;
  await runCountdown(timerSec);triggerFlash();capturedPhotos[selectedPhotoIndex]=captureFrame();renderStrip();toast('Foto diganti ✨')});
btnCancelRetake.addEventListener('click',()=>{retakeModal.classList.add('hidden');selectedPhotoIndex=-1});

function coords(e){
  const r=canvas.getBoundingClientRect(),t=e.touches&&e.touches[0]?e.touches[0]:e;
  return{x:(t.clientX-r.left)*canvas.width/r.width,y:(t.clientY-r.top)*canvas.height/r.height}}
canvas.addEventListener('mousedown',startDrag);
canvas.addEventListener('touchstart',startDrag,{passive:true});
function startDrag(e){
  dragMoved=false;const c=coords(e);
  for(let i=stampsOnCanvas.length-1;i>=0;i--){const s=stampsOnCanvas[i];
    if(Math.hypot(c.x-s.x,c.y-s.y)<s.size*(s.kind==='txt'?1.2:.7)){draggedStampIndex=i;const [st]=stampsOnCanvas.splice(i,1);stampsOnCanvas.push(st);draggedStampIndex=stampsOnCanvas.length-1;return}}}
function drag(e){
  if(draggedStampIndex===-1)return;dragMoved=true;
  if(e.cancelable&&e.touches)e.preventDefault();
  const c=coords(e);stampsOnCanvas[draggedStampIndex].x=c.x;stampsOnCanvas[draggedStampIndex].y=c.y;renderStrip()}
addEventListener('mousemove',drag);addEventListener('touchmove',drag,{passive:false});
const endDrag=()=>{draggedStampIndex=-1;setTimeout(()=>dragMoved=false,0)};
addEventListener('mouseup',endDrag);addEventListener('touchend',endDrag);

stampsEl.addEventListener('click',e=>{
  const b=e.target.closest('.stamp-btn');if(!b)return;
  if(capturedPhotos.length===0){toast('Ambil foto dulu ya 📸');return}
  const txt=b.dataset.kind==='txt',cols=['#FF4081','#7B61FF','#FF8A3D','#1FB98F','#3D8BFF'];
  stampsOnCanvas.push({text:b.dataset.stamp,kind:b.dataset.kind,color:cols[Math.floor(Math.random()*cols.length)],x:canvas.width/2+(Math.random()*40-20),y:canvas.height/2+(Math.random()*40-20),size:txt?40:44});
  renderStrip();canvas.classList.remove('bump');void canvas.offsetWidth;canvas.classList.add('bump')});

// Extra: undo / clear / resize stamp
document.getElementById('btn-undo').addEventListener('click',()=>{stampsOnCanvas.pop();renderStrip()});
document.getElementById('btn-clear-stamps').addEventListener('click',()=>{stampsOnCanvas=[];renderStrip()});
document.getElementById('btn-bigger').addEventListener('click',()=>{const s=stampsOnCanvas.at(-1);if(s){s.size=Math.min(160,s.size+10);renderStrip()}});
document.getElementById('btn-smaller').addEventListener('click',()=>{const s=stampsOnCanvas.at(-1);if(s){s.size=Math.max(20,s.size-10);renderStrip()}});

// GIF
btnGif.addEventListener('click',()=>{
  if(capturedPhotos.length===0)return;
  btnGif.innerText="⏳ Generating GIF...";btnGif.disabled=true;
  gifshot.createGIF({images:capturedPhotos.map(p=>p.toDataURL('image/png')),gifWidth:800,gifHeight:600,interval:.5,numFrames:10},obj=>{
    if(!obj.error){const a=document.createElement('a');a.download=`snappop-gif-${Date.now()}.gif`;a.href=obj.image;a.click();confetti()}
    else alert("Gagal membuat GIF. Silakan coba lagi.");
    btnGif.innerText="🎞️ Photo Flipbook GIF";btnGif.disabled=false})});

// Layout, filter, warna
document.querySelectorAll('.layout-pills .pill').forEach(b=>b.addEventListener('click',e=>{
  setActive('.layout-pills .pill',e.currentTarget);activeLayout=e.currentTarget.dataset.layout;saveSettings({layout:activeLayout});renderStrip(true)}));
document.querySelectorAll('.filter-pills .pill').forEach(b=>b.addEventListener('click',e=>{
  setActive('.filter-pills .pill',e.currentTarget);activeFilter=e.currentTarget.dataset.filter;activeWarp=e.currentTarget.dataset.warp||'';
  video.style.filter=activeWarp?'none':activeFilter;video.style.opacity=activeWarp?0:1;warpCanvas.classList.toggle('hidden',!activeWarp);
  saveSettings({filter:activeFilter,warp:activeWarp||''});renderStrip()}));
document.querySelectorAll('.color-dot').forEach(d=>d.addEventListener('click',e=>{
  setActive('.color-dot',e.currentTarget);activeBgColor=e.currentTarget.dataset.color;saveSettings({background:activeBgColor});renderStrip()}));

btnRetake.addEventListener('click',()=>{
  capturedPhotos=[];stampsOnCanvas=[];ctx.clearRect(0,0,canvas.width,canvas.height);
  canvas.classList.add('hidden');emptyEl.classList.remove('hidden');actionButtons.classList.add('hidden');drawProgress(0)});
function renderCanvasAtScale(source,scale){
  const hd=document.createElement('canvas');
  hd.width=Math.round(source.width*scale);
  hd.height=Math.round(source.height*scale);
  hd.getContext('2d').drawImage(source,0,0,hd.width,hd.height);
  return hd;
}
btnDownload.addEventListener('click',()=>{
  const hd=renderCanvasAtScale(canvas,2);
  hd.toBlob(blob=>{
    if(!blob)return;
    const a=document.createElement('a');a.download=`snappop-strip-hd-${Date.now()}.png`;
    a.href=URL.createObjectURL(blob);a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);confetti();
  },'image/png');
});
btnShare.addEventListener('click',async()=>{
  const hd=renderCanvasAtScale(canvas,2);
  hd.toBlob(async blob=>{
    if(!blob)return;
    const file=new File([blob],`snappop-strip-${Date.now()}.png`,{type:'image/png'});
    try{
      if(navigator.canShare?.({files:[file]})){
        await navigator.share({title:'SNAPPOP! Photo Strip',text:'Lihat hasil strip fotoku ✨',files:[file]});
        confetti();
      }else if(navigator.share){
        await navigator.share({title:'SNAPPOP! Photo Strip',text:'Hasil strip fotoku dari SNAPPOP! ✨',url:location.href});
      }else{
        await navigator.clipboard.writeText(location.href);
        toast('Link website berhasil disalin 📋');
      }
    }catch(e){
      if(e.name!=='AbortError')toast('Berbagi belum tersedia di browser ini');
    }
  },'image/png',1);
});


// ---------- ANIMATED STRIP (GIF) ----------
const btnAnimGif=document.getElementById('btn-anim-gif');
const clamp01=v=>Math.min(1,Math.max(0,v)), easeBack=p=>1+2.9*Math.pow(p-1,3)+1.9*Math.pow(p-1,2);
const animStep=n=>n>6?.28:.45, animDuration=()=>capturedPhotos.length*animStep(capturedPhotos.length)+3;
// satu frame animasi: foto jatuh satu-satu, stamp pop & goyang, glitter berkedip
function drawAnim(g,t){
  const {W,H,boxes}=layoutStrip(),n=boxes.length,st=animStep(n);
  fillBg(W,H,g);
  boxes.forEach((b,i)=>{
    const p=clamp01((t-i*st)/.55);if(p<=0)return;
    const e=easeBack(p),k=.3+.7*e+(p>=1?.012*Math.sin(t*3+i):0);
    g.save();g.translate(b.x+b.w/2,b.y+b.h/2-(1-e)*90);g.rotate((1-e)*(i%2?.25:-.25));g.scale(k,k);g.globalAlpha=clamp01(p*3);
    g.drawImage(capturedPhotos[i],-b.w/2,-b.h/2,b.w,b.h);
    if(p<1){g.fillStyle=`rgba(255,255,255,${(1-p)*.7})`;g.fillRect(-b.w/2,-b.h/2,b.w,b.h)}
    g.restore()});
  const tEnd=n*st+.3;
  drawBranding(W,H,g,clamp01((t-tEnd)/.5));
  stampsOnCanvas.forEach((s,j)=>{const p=clamp01((t-tEnd-j*.15)/.5);if(p>0)drawStamp(g,s,s.x,s.y+Math.sin(t*3+j)*6,easeBack(p),Math.sin(t*2.5+j)*.15)});
  const em=['✨','💖','⭐','🌸'];g.save();g.textAlign='center';g.textBaseline='middle';
  for(let i=0;i<16;i++){
    const rx=Math.abs((Math.sin(i*12.9898)*43758.5453)%1),ry=Math.abs((Math.sin(i*78.233)*12345.678)%1),a=.5+.5*Math.sin(t*4+i*1.7);
    g.globalAlpha=a*.85*clamp01((t-.4)/.6);g.font=`${14+14*a}px serif`;g.fillText(em[i%4],rx*W,ry*H)}
  g.restore()}
function newFrameCanvas(){const {W,H}=layoutStrip(),c=document.createElement('canvas');c.width=W;c.height=H;return c}
const tick=()=>new Promise(r=>setTimeout(r,0));

btnAnimGif.addEventListener('click',async()=>{
  if(capturedPhotos.length===0)return;
  btnAnimGif.disabled=true;
  const D=animDuration(),fps=8,N=Math.round(D*fps),c=newFrameCanvas(),g=c.getContext('2d');
  const gw=Math.min(1080,Math.max(720,Math.round(c.width*2))),gh=Math.round(c.height*gw/c.width);
  const sm=document.createElement('canvas');sm.width=gw;sm.height=gh;const sg=sm.getContext('2d'),frames=[];
  for(let i=0;i<N;i++){btnAnimGif.innerText=`🎨 Rendering ${i+1}/${N}`;drawAnim(g,i/fps);sg.drawImage(c,0,0,gw,gh);frames.push(sm.toDataURL('image/png'));await tick()}
  gifshot.createGIF({images:frames,gifWidth:gw,gifHeight:gh,interval:1/fps,numFrames:N,progressCallback:p=>btnAnimGif.innerText=`⏳ Encoding ${Math.round(p*100)}%`},obj=>{
    if(!obj.error){const a=document.createElement('a');a.download=`snappop-animated-${Date.now()}.gif`;a.href=obj.image;a.click();confetti()}
    else alert('Gagal membuat GIF. Coba lagi ya.');
    btnAnimGif.innerText='✨ Animated Strip (GIF)';btnAnimGif.disabled=false})});

// ---------- LO-FI VINYL PLAYER (lagu digenerate langsung di browser, tanpa file mp3) ----------
const TRACKS=[
  {name:'Rainy Window',bpm:72,root:48,prog:[[2,'m7'],[7,'d7'],[0,'M7'],[9,'m7']],lab:'#FF6FA3'},
  {name:'Peach Tea',bpm:80,root:53,prog:[[0,'M7'],[4,'m7'],[9,'m7'],[7,'d7']],lab:'#FFB38A'},
  {name:'Midnight Bus',bpm:68,root:45,prog:[[0,'m7'],[5,'m7'],[3,'M7'],[7,'d7']],lab:'#7B61FF'},
  {name:'Sunday Nap',bpm:76,root:51,prog:[[0,'M7'],[5,'M7'],[2,'m7'],[7,'d7']],lab:'#6FE3C1'}
  // Mau pakai lagu sendiri? Tambah baris: {name:'Judul Lagu',src:'music/lagu.mp3',lab:'#FFD25E'}
];
const CH={M7:[0,4,7,11],m7:[0,3,7,10],d7:[0,4,7,10]}, mtof=m=>440*Math.pow(2,(m-69)/12);
const vinylEl=document.getElementById('vinyl'), armEl=document.getElementById('tonearm'), trackNameEl=document.getElementById('track-name'), btnPlay=document.getElementById('btn-play');
let AC,bus,master,lfoG,nbuf,timer=null,stepN=0,nextT=0,trackIdx=0,playing=false,vol=savedSettings.volume??.7;
const audioEl=new Audio();audioEl.addEventListener('ended',()=>changeTrack(1));

function initAudio(){
  if(AC)return;
  AC=new(window.AudioContext||window.webkitAudioContext)();
  master=AC.createGain();master.gain.value=0;master.connect(AC.destination);
  const lp=AC.createBiquadFilter();lp.type='lowpass';lp.frequency.value=2600;lp.connect(master);
  const dl=AC.createDelay(1);dl.delayTime.value=.4;const fb=AC.createGain();fb.gain.value=.32;const dg=AC.createGain();dg.gain.value=.25;
  dl.connect(fb);fb.connect(dl);dl.connect(dg);dg.connect(lp);
  bus=AC.createGain();bus.connect(lp);bus.connect(dl);
  nbuf=AC.createBuffer(1,AC.sampleRate,AC.sampleRate);const nd=nbuf.getChannelData(0);for(let i=0;i<nd.length;i++)nd[i]=Math.random()*2-1;
  // suara crackle piringan hitam
  const len=AC.sampleRate*4,cb=AC.createBuffer(1,len,AC.sampleRate),cd=cb.getChannelData(0);
  for(let i=0;i<len;i++)cd[i]=(Math.random()*2-1)*.012+(Math.random()<.0006?(Math.random()*2-1)*.5:0);
  const cs=AC.createBufferSource();cs.buffer=cb;cs.loop=true;const hp=AC.createBiquadFilter();hp.type='highpass';hp.frequency.value=900;
  cs.connect(hp);hp.connect(master);cs.start();
  // tape wobble
  const lfo=AC.createOscillator();lfo.frequency.value=.6;lfoG=AC.createGain();lfoG.gain.value=14;lfo.connect(lfoG);lfo.start()}
function note(m,t,dur,vel,type='triangle'){
  const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.value=mtof(m);lfoG.connect(o.detune);
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vel,t+.015);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  o.connect(g);g.connect(bus);o.start(t);o.stop(t+dur+.05)}
function noise(t,dur,vel,ft,ff){
  const s=AC.createBufferSource();s.buffer=nbuf;const f=AC.createBiquadFilter();f.type=ft;f.frequency.value=ff;const g=AC.createGain();
  g.gain.setValueAtTime(vel,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);s.connect(f);f.connect(g);g.connect(bus);s.start(t);s.stop(t+dur+.02)}
function kick(t){
  const o=AC.createOscillator(),g=AC.createGain();o.frequency.setValueAtTime(130,t);o.frequency.exponentialRampToValueAtTime(42,t+.14);
  g.gain.setValueAtTime(.8,t);g.gain.exponentialRampToValueAtTime(.0001,t+.3);o.connect(g);g.connect(bus);o.start(t);o.stop(t+.32)}
function schedule(){
  const T=TRACKS[trackIdx],spb=60/T.bpm/4;
  while(nextT<AC.currentTime+.3){
    const s=stepN%16,[off,type]=T.prog[Math.floor(stepN/16)%T.prog.length],chord=CH[type].map(x=>T.root+off+x),t=nextT+(s%2?spb*.3:0),r=Math.random;
    if(s===0||s===6||s===10)chord.forEach((m,i)=>note(m+12,t+i*.018+r()*.012,s===0?1.8:.9,.075,'triangle'));
    if(s===0||s===10){let b=T.root+off;while(b>47)b-=12;while(b<36)b+=12;note(b,t,s===0?1.3:.6,.4,'sine')}
    if(s===0||s===10||(s===7&&r()<.4))kick(t);
    if(s===4||s===12)noise(t,.16,.28,'bandpass',1800);
    if(s%2===0&&s!==4&&s!==12)noise(t,.04,(s%4===2?.09:.05)*(.6+r()*.6),'highpass',7000);
    if(s%2===0&&r()<.14)note(chord[Math.floor(r()*chord.length)]+24,t,1,.05,'sine');
    stepN++;nextT+=spb}}
function updateLabel(){const T=TRACKS[trackIdx];document.documentElement.style.setProperty('--lab',T.lab);trackNameEl.textContent=`♪ ${T.name} — Gege's Lab (lofi)`}
function startTrack(){
  clearInterval(timer);audioEl.pause();updateLabel();const T=TRACKS[trackIdx];
  if(T.src){audioEl.src=T.src;audioEl.volume=vol;audioEl.play().catch(()=>toast('File lagu tidak ditemukan 😢'));return}
  initAudio();AC.resume();master.gain.cancelScheduledValues(AC.currentTime);master.gain.setTargetAtTime(vol*.6,AC.currentTime,.05);
  stepN=0;nextT=AC.currentTime+.1;timer=setInterval(schedule,50)}
function stopMusic(){clearInterval(timer);audioEl.pause();if(AC)master.gain.setTargetAtTime(0,AC.currentTime,.05)}
function setPlaying(p){
  playing=p;musicOn=p;vinylEl.classList.toggle('playing',p);armEl.classList.toggle('on',p);document.body.classList.toggle('music-on',p);btnPlay.textContent=p?'⏸':'▶';
  p?startTrack():stopMusic()}
function changeTrack(d){trackIdx=(trackIdx+d+TRACKS.length)%TRACKS.length;playing?startTrack():updateLabel()}
vinylEl.addEventListener('click',()=>setPlaying(!playing));
btnPlay.addEventListener('click',()=>setPlaying(!playing));
document.getElementById('btn-next').addEventListener('click',()=>changeTrack(1));
document.getElementById('btn-prev').addEventListener('click',()=>changeTrack(-1));
const volInput=document.getElementById('vol');
volInput.value=vol;
volInput.addEventListener('input',e=>{vol=+e.target.value;audioEl.volume=vol;saveSettings({volume:vol});if(AC&&playing)master.gain.setTargetAtTime(vol*.6,AC.currentTime,.05)});
setInterval(()=>{if(!playing)return;const n=document.createElement('span');n.className='note';n.textContent=['♪','♫','♡','✦'][Math.floor(Math.random()*4)];
  n.style.setProperty('--dx',(Math.random()*120-20)+'px');n.style.left=(60+Math.random()*70)+'px';vinylEl.parentElement.appendChild(n);setTimeout(()=>n.remove(),2000)},650);

document.getElementById('btn-camera-retry').addEventListener('click',initCamera);

function applySavedSettings(){
  document.querySelectorAll('.pose-btn').forEach(b=>b.classList.toggle('active',parseInt(b.dataset.poses)===totalPoses));
  snapBtnText.innerText=`✨ Take Photos (${totalPoses}x)`;
  document.querySelectorAll('.timer-btn').forEach(b=>b.classList.toggle('active',parseInt(b.dataset.sec)===timerSec));
  document.querySelectorAll('.layout-pills .pill').forEach(b=>b.classList.toggle('active',b.dataset.layout===activeLayout));
  document.querySelectorAll('.color-dot').forEach(b=>b.classList.toggle('active',b.dataset.color===activeBgColor));
  document.querySelectorAll('.filter-pills .pill').forEach(b=>{
    const warp=savedSettings.warp||'';
    b.classList.toggle('active',b.dataset.filter===activeFilter&&(b.dataset.warp||'')===warp);
  });
  activeWarp=savedSettings.warp||'';
  video.style.filter=activeWarp?'none':activeFilter;
  video.style.opacity=activeWarp?0:1;
  warpCanvas.classList.toggle('hidden',!activeWarp);
  drawProgress(0);
}

addEventListener('DOMContentLoaded',()=>{
  applySavedSettings();
  initCamera();
});

if('serviceWorker'in navigator){
  addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
}