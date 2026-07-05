/* ============================================================
   Sams Alif — Portfolio interaction engine
   Loader · Cursor · Lenis · GSAP reveals · Typing · Tilt ·
   Projects (live GitHub) · Stats · Command palette · Chat ·
   Easter egg · Contact form
   ============================================================ */
'use strict';

/* ---------- Curated fallback project data (from GitHub API) ---------- */
const FALLBACK_REPOS = [
  { name:'Medify-PRO', title:'Medify PRO', desc:'A modern healthcare / medical management platform built with a TypeScript + Python stack for smarter patient and clinic workflows.', url:'https://github.com/TheSamsAlif/Medify-PRO', homepage:'https://medify-pro-zeta.vercel.app', languages:['TypeScript','Python','JavaScript'], category:'Full Stack', featured:true },
  { name:'Live_TV_App', title:'Live TV App', desc:'A sleek live television streaming web app delivering channels through a clean, responsive interface.', url:'https://github.com/TheSamsAlif/Live_TV_App', homepage:'https://samsalif.me', languages:['JavaScript','CSS','HTML'], category:'Web App', featured:true },
  { name:'-BD', title:'Gontoboddh BD', desc:'A bus route management system for Bangladesh — plan, track and manage transit routes with ease.', url:'https://github.com/TheSamsAlif/-BD', homepage:'https://gontoboddh-bd.vercel.app/', languages:['JavaScript'], category:'Web App', featured:true },
  { name:'Study-Flow-Pro', title:'Study Flow Pro', desc:'An intelligent study-planning companion that parses content and organises focused study sessions.', url:'https://github.com/TheSamsAlif/Study-Flow-Pro', homepage:'https://content-parser-pro.preview.emergentagent.com/login', languages:['JavaScript','Python','CSS'], category:'AI' },
  { name:'StudyFlow', title:'StudyFlow', desc:'The original StudyFlow — a lightweight study organiser and content parser prototype.', url:'https://github.com/TheSamsAlif/StudyFlow', homepage:'https://content-parser-pro.preview.emergentagent.com/login', languages:['HTML'], category:'AI' },
  { name:'TheSamsAlif', title:'GitHub Profile', desc:'Configuration and README that power my GitHub profile landing page.', url:'https://github.com/TheSamsAlif/TheSamsAlif', homepage:'https://github.com/TheSamsAlif', languages:['Markdown'], category:'Config' },
];

const LANG_COLORS = { TypeScript:'#3178c6', JavaScript:'#f1e05a', Python:'#3572A5', HTML:'#e34c26', CSS:'#563d7c', Java:'#b07219', 'C++':'#f34b7d', C:'#555555', Shell:'#89e051', Markdown:'#083fa1' };

/* ============ LENIS SMOOTH SCROLL ============ */
let lenis;
function initLenis(){
  if(typeof Lenis === 'undefined' || window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  lenis = new Lenis({ duration:1.15, easing:t=>Math.min(1,1.001-Math.pow(2,-10*t)), smoothWheel:true });
  function raf(t){ lenis.raf(t); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
  if(window.gsap && window.ScrollTrigger){
    lenis.on('scroll', ScrollTrigger.update);
  }
}

/* ============ LOADER ============ */
function initLoader(){
  const loader = document.getElementById('loader');
  const bar = document.getElementById('loaderProgress');
  let p = 0;
  const tick = setInterval(()=>{
    p += Math.random()*18;
    if(p>=100){ p=100; clearInterval(tick); setTimeout(done,350); }
    bar.style.width = p+'%';
  },140);
  function done(){
    loader.classList.add('done');
    document.body.style.overflow='';
    startHero();
  }
  document.body.style.overflow='hidden';
}

/* ============ CUSTOM CURSOR ============ */
function initCursor(){
  if(window.matchMedia('(max-width:900px)').matches) return;
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let mx=innerWidth/2,my=innerHeight/2, rx=mx, ry=my;
  addEventListener('mousemove',e=>{
    mx=e.clientX; my=e.clientY;
    dot.style.transform=`translate(${mx}px,${my}px) translate(-50%,-50%)`;
    document.documentElement.style.setProperty('--mx',mx+'px');
    document.documentElement.style.setProperty('--my',my+'px');
    const sp=document.getElementById('spotlight');
    sp.style.setProperty('--mx',mx+'px'); sp.style.setProperty('--my',my+'px');
  });
  (function loop(){ rx+=(mx-rx)*.18; ry+=(my-ry)*.18; ring.style.transform=`translate(${rx}px,${ry}px) translate(-50%,-50%)`; requestAnimationFrame(loop); })();
  document.querySelectorAll('[data-cursor]').forEach(el=>{
    const t=el.getAttribute('data-cursor');
    el.addEventListener('mouseenter',()=>ring.classList.add(t));
    el.addEventListener('mouseleave',()=>ring.classList.remove('hover','view'));
  });
}

/* ============ PARTICLE BACKGROUND (canvas) ============ */
function initParticles(){
  const c=document.getElementById('bgCanvas'); const ctx=c.getContext('2d');
  let w,h,parts;
  function size(){ w=c.width=innerWidth; h=c.height=innerHeight; }
  size(); addEventListener('resize',size);
  const N = innerWidth<700?42:90;
  parts=Array.from({length:N},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35,r:Math.random()*1.6+.5,t:Math.random()<.25}));
  function draw(){
    ctx.clearRect(0,0,w,h);
    for(let i=0;i<parts.length;i++){
      const p=parts[i]; p.x+=p.vx; p.y+=p.vy;
      if(p.x<0||p.x>w)p.vx*=-1; if(p.y<0||p.y>h)p.vy*=-1;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,7); ctx.fillStyle=p.t?'rgba(37,194,195,.7)':'rgba(249,104,1,.8)'; ctx.fill();
      for(let j=i+1;j<parts.length;j++){
        const q=parts[j], dx=p.x-q.x, dy=p.y-q.y, d=Math.hypot(dx,dy);
        if(d<120){ ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y); ctx.strokeStyle=`rgba(249,104,1,${.13*(1-d/120)})`; ctx.stroke(); }
      }
    }
    requestAnimationFrame(draw);
  }
  if(!window.matchMedia('(prefers-reduced-motion:reduce)').matches) draw();
}

/* ============ HERO — split text + typing ============ */
function startHero(){
  // split name into chars for stagger
  const name=document.querySelector('[data-split]');
  if(name && !name.dataset.done){
    name.dataset.done='1';
    name.innerHTML=name.textContent.split('').map(ch=>`<span class="char">${ch===' '?'&nbsp;':ch}</span>`).join('');
    if(window.gsap){
      gsap.from(name.querySelectorAll('.char'),{yPercent:120,opacity:0,stagger:.04,duration:.9,ease:'power4.out',delay:.15});
    }
  }
  // reveal hero items
  document.querySelectorAll('.hero .reveal').forEach((el,i)=>{ setTimeout(()=>el.classList.add('in'),200+i*90); });
  typeLoop();
}
function typeLoop(){
  const el=document.getElementById('typed');
  const roles=['Junior Software Engineer','AI Developer','Full Stack Developer','Machine Learning Enthusiast','Cyber Security Learner','Open Source Contributor'];
  let ri=0,ci=0,del=false;
  (function step(){
    const word=roles[ri];
    el.textContent = del ? word.slice(0,ci--) : word.slice(0,ci++);
    let wait=del?45:90;
    if(!del && ci===word.length+1){ del=true; wait=1500; }
    else if(del && ci<0){ del=false; ci=0; ri=(ri+1)%roles.length; wait=350; }
    setTimeout(step,wait);
  })();
}

/* ============ 3D TILT (portrait) ============ */
function initTilt(){
  const wrap=document.getElementById('portraitTilt');
  if(!wrap) return;
  const card=wrap.querySelector('.portrait-card');
  wrap.addEventListener('mousemove',e=>{
    const r=wrap.getBoundingClientRect();
    const px=(e.clientX-r.left)/r.width-.5, py=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`rotateY(${px*16}deg) rotateX(${-py*16}deg)`;
  });
  wrap.addEventListener('mouseleave',()=>card.style.transform='rotateY(0) rotateX(0)');
}

/* ============ MAGNETIC BUTTONS ============ */
function initMagnetic(){
  if(window.matchMedia('(max-width:900px)').matches) return;
  document.querySelectorAll('.magnetic').forEach(el=>{
    el.addEventListener('mousemove',e=>{
      const r=el.getBoundingClientRect();
      const x=e.clientX-r.left-r.width/2, y=e.clientY-r.top-r.height/2;
      el.style.transform=`translate(${x*.3}px,${y*.4}px)`;
    });
    el.addEventListener('mouseleave',()=>el.style.transform='');
  });
}

/* ============ SCROLL REVEAL + PROGRESS + NAV ============ */
function initScroll(){
  const io=new IntersectionObserver((ents)=>{
    ents.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
  },{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>{ if(!el.closest('.hero')) io.observe(el); });

  const nav=document.getElementById('nav'), prog=document.getElementById('scrollProgress'), back=document.getElementById('backTop');
  const links=[...document.querySelectorAll('.nav__links a')];
  const secs=links.map(l=>document.querySelector(l.getAttribute('href')));
  function onScroll(){
    const y=scrollY, dh=document.body.scrollHeight-innerHeight;
    prog.style.width=(y/dh*100)+'%';
    nav.classList.toggle('scrolled',y>40);
    back.classList.toggle('show',y>500);
    let cur=0; secs.forEach((s,i)=>{ if(s && s.offsetTop-140<=y) cur=i; });
    links.forEach((l,i)=>l.classList.toggle('active',i===cur));
  }
  addEventListener('scroll',onScroll,{passive:true}); onScroll();
}

/* ============ ANIMATED COUNTERS ============ */
function initCounters(){
  const io=new IntersectionObserver((ents)=>{
    ents.forEach(e=>{
      if(!e.isIntersecting) return; io.unobserve(e.target);
      const el=e.target, target=+el.dataset.count; let n=0;
      const dur=1400, t0=performance.now();
      (function step(t){
        const k=Math.min(1,(t-t0)/dur), val=Math.floor((1-Math.pow(1-k,3))*target);
        el.textContent = target>=1000 ? val : val; if(k<1) requestAnimationFrame(step); else el.textContent=target;
      })(t0);
    });
  },{threshold:.5});
  document.querySelectorAll('[data-count]').forEach(el=>io.observe(el));
}

/* ============ TECH STACK ============ */
function renderStack(){
  const data={
    Programming:['Python','JavaScript','Java','C','C++','SQL'],
    Frontend:['React','Next.js','TailwindCSS','TypeScript','GSAP','Framer Motion','Three.js'],
    Backend:['Node.js','Express'],
    Database:['MongoDB','MySQL','PostgreSQL','Firebase'],
    'AI / ML':['TensorFlow','PyTorch','OpenCV','Scikit-Learn'],
    Tools:['Git','GitHub','Docker','Linux','VS Code'],
  };
  document.getElementById('stackGrid').innerHTML=Object.entries(data).map(([cat,tags])=>`
    <div class="stack-cat reveal">
      <h3>${cat}</h3>
      <div class="stack-cat__tags">${tags.map(t=>`<span class="tag" data-cursor="hover">${t}</span>`).join('')}</div>
    </div>`).join('');
}

/* ============ PROJECTS ============ */
function projectCard(p){
  const tags=(p.languages||[]).slice(0,4).map(l=>`<span class="tag">${l}</span>`).join('');
  const demo=p.homepage?`<a class="pc-link pc-link--demo" href="${p.homepage}" target="_blank" rel="noopener" data-cursor="hover">Live Demo ↗</a>`:'';
  const initials=(p.title||p.name).replace(/[^A-Za-z]/g,'').slice(0,2).toUpperCase()||'SA';
  return `<article class="project-card" data-cat="${p.category||'Other'}" data-cursor="hover">
    <div class="project-card__top">
      <div class="project-card__icon">${initials}</div>
      ${p.featured?'<span class="project-card__featured">FEATURED</span>':''}
    </div>
    <h3 class="project-card__title">${p.title||p.name}</h3>
    <p class="project-card__desc">${p.desc||'A project from my GitHub.'}</p>
    <div class="project-card__tags">${tags}</div>
    <div class="project-card__links">
      <a class="pc-link pc-link--code" href="${p.url}" target="_blank" rel="noopener" data-cursor="hover">Code ↗</a>
      ${demo}
    </div>
  </article>`;
}
function renderProjects(repos){
  const grid=document.getElementById('projectsGrid');
  const cats=['All',...new Set(repos.map(r=>r.category||'Other'))];
  document.getElementById('projectFilters').innerHTML=cats.map((c,i)=>`<button class="filter-btn ${i===0?'active':''}" data-cat="${c}" data-cursor="hover">${c}</button>`).join('');
  grid.innerHTML=repos.map(projectCard).join('');
  bindCardGlow();
  document.querySelectorAll('.filter-btn').forEach(b=>b.addEventListener('click',()=>{
    document.querySelectorAll('.filter-btn').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    const cat=b.dataset.cat;
    document.querySelectorAll('.project-card').forEach(card=>{
      const show = cat==='All'||card.dataset.cat===cat;
      card.style.display=show?'':'none';
    });
  }));
}
function bindCardGlow(){
  document.querySelectorAll('.project-card').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect();
      card.style.setProperty('--px',(e.clientX-r.left)+'px');
      card.style.setProperty('--py',(e.clientY-r.top)+'px');
    });
  });
}
async function loadProjects(){
  renderProjects(FALLBACK_REPOS); // instant render
  try{
    const res=await fetch('https://api.github.com/users/TheSamsAlif/repos?per_page=100&sort=updated');
    if(!res.ok) return;
    const raw=await res.json();
    if(!Array.isArray(raw)) return;
    // merge live data onto curated metadata
    const merged=FALLBACK_REPOS.map(f=>{
      const live=raw.find(r=>r.name===f.name);
      return live?{...f,homepage:live.homepage||f.homepage,url:live.html_url}:f;
    });
    renderProjects(merged);
  }catch(_){ /* offline: keep fallback */ }
}

/* ============ GITHUB LANG BARS + CONTRIB ============ */
function renderGithub(){
  const langs={ JavaScript:5, TypeScript:3, Python:3, HTML:4, CSS:3, Java:1 };
  const total=Object.values(langs).reduce((a,b)=>a+b,0);
  const bars=Object.entries(langs).sort((a,b)=>b[1]-a[1]).map(([l,v])=>{
    const pct=Math.round(v/total*100);
    return `<div class="lang-bar"><div class="lang-bar__head"><span>${l}</span><span>${pct}%</span></div>
      <div class="lang-bar__track"><div class="lang-bar__fill" data-w="${pct}" style="background:linear-gradient(90deg,var(--primary),var(--secondary))"></div></div></div>`;
  }).join('');
  document.getElementById('langBars').innerHTML=bars;
  const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ document.querySelectorAll('.lang-bar__fill').forEach(f=>f.style.width=f.dataset.w+'%'); io.disconnect(); } }),{threshold:.3});
  io.observe(document.getElementById('langBars'));

  // contribution heatmap 12x7
  const cells=Array.from({length:84},()=>{ const lv=Math.random(); const a=lv<.4?0:lv<.6?.25:lv<.8?.5:lv<.93?.75:1; return `<div class="contrib-cell" style="background:rgba(249,104,1,${a||.05})"></div>`; }).join('');
  document.getElementById('contribGraph').innerHTML=cells;
}

/* ============ ACHIEVEMENTS ============ */
function renderAchievements(){
  const data=[
    { icon:'🌐', t:'Open Source Contributor', d:'Publishing projects publicly on GitHub and learning in the open.' },
    { icon:'🚀', t:'Programming Journey', d:'From first line of C to full-stack apps across six languages.' },
    { icon:'📚', t:'Continuous Learning', d:'Constantly leveling up in web, AI, and cyber security.' },
    { icon:'🤖', t:'AI Projects', d:'Experimenting with ML models, OpenCV and applied intelligence.' },
    { icon:'🎓', t:'Academic Excellence', d:'CSE student at Green University of Bangladesh.' },
    { icon:'⚡', t:'Technology Enthusiast', d:'Chasing the edge of frontend, motion design and dev tooling.' },
    { icon:'🎯', t:'Future Software Engineer', d:'On a focused path toward building products at scale.' },
  ];
  document.getElementById('achievementsGrid').innerHTML=data.map(a=>`
    <article class="ach-card reveal" data-cursor="hover">
      <div class="ach-card__line"></div>
      <div class="ach-card__icon">${a.icon}</div>
      <h3>${a.t}</h3><p>${a.d}</p>
    </article>`).join('');
}

/* ============ CONTACT FORM ============ */
function initContact(){
  const form=document.getElementById('contactForm'), status=document.getElementById('contactStatus');
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const name=form.name.value.trim(), email=form.email.value.trim(), msg=form.message.value.trim();
    const emailOk=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if(!name||!emailOk||!msg){ status.textContent='Please fill every field with a valid email.'; status.className='contact__status err'; return; }
    // Opens the user's mail client pre-filled (no backend required)
    const body=encodeURIComponent(`${msg}\n\n— ${name} (${email})`);
    window.location.href=`mailto:samsalif852@gmail.com?subject=${encodeURIComponent('Portfolio message from '+name)}&body=${body}`;
    status.textContent='Opening your mail app… thank you!'; status.className='contact__status ok';
    form.reset();
  });
}

/* ============ COMMAND PALETTE ============ */
function initCmdk(){
  const cmdk=document.getElementById('cmdk'), input=document.getElementById('cmdkInput'), list=document.getElementById('cmdkList');
  const items=[
    {label:'Go to About',hint:'section',act:()=>go('#about')},
    {label:'Go to Tech Stack',hint:'section',act:()=>go('#stack')},
    {label:'Go to Projects',hint:'section',act:()=>go('#projects')},
    {label:'Go to GitHub',hint:'section',act:()=>go('#github')},
    {label:'Go to Achievements',hint:'section',act:()=>go('#achievements')},
    {label:'Go to Contact',hint:'section',act:()=>go('#contact')},
    {label:'Open GitHub profile',hint:'link',act:()=>open('https://github.com/TheSamsAlif','_blank')},
    {label:'Open Instagram',hint:'link',act:()=>open('https://www.instagram.com/sams_alif10/','_blank')},
    {label:'Email Sams',hint:'link',act:()=>location.href='mailto:samsalif852@gmail.com'},
  ];
  let sel=0;
  function go(h){ close(); document.querySelector(h).scrollIntoView({behavior:'smooth'}); }
  function render(q=''){
    const f=items.filter(i=>i.label.toLowerCase().includes(q.toLowerCase())); sel=0;
    list.innerHTML=f.map((i,x)=>`<li class="${x===0?'sel':''}" data-i="${items.indexOf(i)}"><span style="color:#fff">${i.label}</span><span>${i.hint}</span></li>`).join('')||'<li>No results</li>';
    list.querySelectorAll('li[data-i]').forEach(li=>li.addEventListener('click',()=>items[+li.dataset.i].act()));
  }
  function openP(){ cmdk.classList.add('open'); input.value=''; render(); setTimeout(()=>input.focus(),50); }
  function close(){ cmdk.classList.remove('open'); }
  document.getElementById('cmdkBtn').addEventListener('click',openP);
  cmdk.querySelector('.cmdk__backdrop').addEventListener('click',close);
  input.addEventListener('input',()=>render(input.value));
  addEventListener('keydown',e=>{
    if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){ e.preventDefault(); cmdk.classList.contains('open')?close():openP(); }
    if(!cmdk.classList.contains('open')) return;
    const lis=[...list.querySelectorAll('li[data-i]')];
    if(e.key==='Escape') close();
    if(e.key==='ArrowDown'){ e.preventDefault(); sel=Math.min(sel+1,lis.length-1); }
    if(e.key==='ArrowUp'){ e.preventDefault(); sel=Math.max(sel-1,0); }
    if(e.key==='Enter'&&lis[sel]){ items[+lis[sel].dataset.i].act(); }
    lis.forEach((li,i)=>li.classList.toggle('sel',i===sel));
  });
}

/* ============ AI-STYLE CHAT ASSISTANT (rule-based) ============ */
function initChat(){
  const toggle=document.getElementById('chatToggle'), panel=document.getElementById('chatPanel'),
        close=document.getElementById('chatClose'), body=document.getElementById('chatBody'),
        form=document.getElementById('chatForm'), input=document.getElementById('chatInput');
  function msg(text,who){ const d=document.createElement('div'); d.className='chat-msg chat-msg--'+who; d.textContent=text; body.appendChild(d); body.scrollTop=body.scrollHeight; }
  function bot(q){
    q=q.toLowerCase();
    if(/stack|tech|tools|language/.test(q)) return "Sams works with Python, JavaScript, TypeScript, React, Next.js, Node.js, and AI tools like TensorFlow & PyTorch. Full breakdown in the Tech Stack section!";
    if(/project|work|build|repo/.test(q)) return "Check the Projects section — highlights include Medify PRO, Live TV App, and Gontoboddh BD. All pulled live from GitHub.";
    if(/contact|email|hire|reach/.test(q)) return "You can reach Sams at samsalif852@gmail.com or via the contact form below. He's open to opportunities!";
    if(/who|about|you|sams/.test(q)) return "Sams Alif is a 25-year-old CSE student at Green University of Bangladesh — a full-stack developer and AI enthusiast from Dhaka.";
    if(/ai|machine|ml/.test(q)) return "AI/ML is a big passion — Sams explores TensorFlow, PyTorch, OpenCV and Scikit-Learn for real-world intelligent apps.";
    if(/github/.test(q)) return "GitHub: github.com/TheSamsAlif — 7 public repos and counting.";
    if(/hi|hello|hey/.test(q)) return "Hey! 👋 Ask me about Sams's stack, projects, or how to get in touch.";
    return "Great question! Try asking about Sams's tech stack, projects, AI work, or how to contact him.";
  }
  function openC(){ panel.classList.add('open'); if(!body.children.length) msg("Hi! I'm Sams's assistant ✦ Ask me anything about his skills or projects.","bot"); setTimeout(()=>input.focus(),200); }
  toggle.addEventListener('click',()=>panel.classList.contains('open')?panel.classList.remove('open'):openC());
  close.addEventListener('click',()=>panel.classList.remove('open'));
  form.addEventListener('submit',e=>{ e.preventDefault(); const q=input.value.trim(); if(!q) return; msg(q,'user'); input.value=''; setTimeout(()=>msg(bot(q),'bot'),400); });
}

/* ============ MOBILE MENU ============ */
function initMenu(){
  const b=document.getElementById('menuToggle'), l=document.querySelector('.nav__links');
  b.addEventListener('click',()=>l.classList.toggle('open'));
  l.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>l.classList.remove('open')));
}

/* ============ BACK TO TOP ============ */
function initBackTop(){ document.getElementById('backTop').addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'})); }

/* ============ TOAST ============ */
function toast(t){ const el=document.getElementById('toast'); el.textContent=t; el.classList.add('show'); clearTimeout(el._t); el._t=setTimeout(()=>el.classList.remove('show'),3000); }

/* ============ EASTER EGG — Konami code → confetti ============ */
function initEgg(){
  const seq=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let i=0;
  addEventListener('keydown',e=>{ i=(e.key.toLowerCase()===seq[i].toLowerCase())?i+1:0; if(i===seq.length){ i=0; confetti(); toast('🎉 Konami unlocked — you found the easter egg!'); } });
  document.getElementById('eggHint').addEventListener('click',()=>{ confetti(); toast('🎉 You found the easter egg!'); });
}
function confetti(){
  const c=document.createElement('canvas'); c.style.cssText='position:fixed;inset:0;z-index:9997;pointer-events:none'; document.body.appendChild(c);
  const ctx=c.getContext('2d'); c.width=innerWidth; c.height=innerHeight;
  const cols=['#F96801','#DE1B2D','#FF8A1E','#fff','#25C2C3'];
  const ps=Array.from({length:160},()=>({x:innerWidth/2,y:innerHeight/2,vx:(Math.random()-.5)*14,vy:(Math.random()-.5)*14-4,c:cols[Math.random()*cols.length|0],r:Math.random()*5+2,a:1}));
  (function f(){ ctx.clearRect(0,0,c.width,c.height); let alive=false;
    ps.forEach(p=>{ p.vy+=.22; p.x+=p.vx; p.y+=p.vy; p.a-=.012; if(p.a>0){alive=true; ctx.globalAlpha=p.a; ctx.fillStyle=p.c; ctx.fillRect(p.x,p.y,p.r,p.r);} });
    if(alive) requestAnimationFrame(f); else c.remove();
  })();
}

/* ============ INIT ============ */
document.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('year').textContent=new Date().getFullYear();
  initLenis(); initCursor(); initParticles(); initTilt(); initMagnetic();
  initScroll(); initCounters(); renderStack(); loadProjects(); renderGithub();
  renderAchievements(); initContact(); initCmdk(); initChat(); initMenu();
  initBackTop(); initEgg(); initLoader();
});
