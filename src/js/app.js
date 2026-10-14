import { getCountdownState } from './countdown.js';
import './smooth-scroll.js';
import './faq.js';
document.documentElement.classList.add('js');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
document.body.classList.toggle('reduced-motion',reduced);
const menuButton=document.querySelector('.menu-button'),menu=document.querySelector('#menu');
function setMenu(opening){
  document.body.classList.toggle('menu-open',opening);
  menu.inert=!opening;
  document.querySelectorAll('main,footer,.skip').forEach(el=>el.inert=opening);
  menuButton.setAttribute('aria-expanded',String(opening));
  menuButton.setAttribute('aria-label',opening?'Fechar menu':'Abrir menu');
}
function closeMenu(){setMenu(false);}
menuButton.addEventListener('click',()=>setMenu(!document.body.classList.contains('menu-open')));
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.querySelectorAll('.header a').forEach(a=>a.addEventListener('click',()=>{
  if(document.body.classList.contains('menu-open'))closeMenu();
}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('menu-open')){closeMenu();menuButton.focus();}if(e.key==='Tab'&&document.body.classList.contains('menu-open')){const links=[...document.querySelectorAll('.header a,.header button'),...menu.querySelectorAll('a')].filter(el=>el.getClientRects().length);if(e.shiftKey&&document.activeElement===links[0]){e.preventDefault();links.at(-1).focus();}else if(!e.shiftKey&&document.activeElement===links.at(-1)){e.preventDefault();links[0].focus();}}});
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);}}),{threshold:.1});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
const quote=document.querySelector('.word-reveal');
function splitWords(node){[...node.childNodes].forEach(child=>{if(child.nodeType===Node.TEXT_NODE){const fragment=document.createDocumentFragment();child.textContent.split(/(\s+)/).forEach(word=>{if(/\S/.test(word)){const s=document.createElement('span');s.className='word';s.textContent=word;fragment.append(s);}else fragment.append(document.createTextNode(word));});child.replaceWith(fragment);}else splitWords(child);});}splitWords(quote);
const words=[...quote.querySelectorAll('.word')],history=document.querySelector('.history'),stage=document.querySelector('.history-stage'),photos=[...document.querySelectorAll('.chapter-photo')],copies=[...document.querySelectorAll('.chapter-copy')],progress=[...document.querySelectorAll('.chapter-progress span')];
const chapterNames=['O primeiro encontro','O pedido de namoro','A vida juntos','O pedido de casamento'];
function historyRange(){const beforeStage=document.querySelector('.history-heading').offsetHeight+parseFloat(getComputedStyle(history).paddingTop);return {start:history.offsetTop+beforeStage-82,travel:Math.max(1,history.offsetHeight-beforeStage-stage.offsetHeight)};}
const chapterButtons=progress.map((el,i)=>{const button=document.createElement('button');button.type='button';button.setAttribute('aria-label',`Capítulo ${i+1}: ${chapterNames[i]}`);button.addEventListener('click',()=>{const {start,travel}=historyRange();window.scrollTo({top:start+travel*((i+.25)/4),behavior:reduced?'instant':'smooth'});});el.replaceWith(button);return button;});
document.querySelector('.chapter-progress').removeAttribute('aria-hidden');
copies.forEach((copy,i)=>{const photo=photos[i].querySelector('img').cloneNode();photo.className='chapter-mobile-photo';copy.prepend(photo);});
let chapter=-1,ticking=false;
function updateScroll(){
  const vh=innerHeight,q=quote.getBoundingClientRect();
  const fraction=Math.max(0,Math.min(1,(vh*.9-q.top)/(vh*.48)));
  words.forEach((w,i)=>w.classList.toggle('lit',reduced||i/words.length<fraction));
  const desktop=innerWidth>800&&!reduced;
  if(desktop){
    const {start,travel}=historyRange();
    const p=Math.max(0,Math.min(.999,(scrollY-start)/travel));
    const index=Math.floor(p*4);
    chapter=index;
    photos.forEach((el,i)=>{el.classList.toggle('active',i===index);el.classList.toggle('past',i<index);el.setAttribute('aria-hidden',String(i!==index));});
    copies.forEach((el,i)=>{el.classList.toggle('active',i===index);el.setAttribute('aria-hidden',String(i!==index));});
    chapterButtons.forEach((el,i)=>{el.classList.toggle('active',i<=index);el.setAttribute('aria-current',i===index?'step':'false');});
    document.querySelector('#chapter-number').textContent=String(index+1).padStart(2,'0');
    document.querySelector('#chapter-year').textContent=['2019','2019','2023','2026'][index];
  }else copies.forEach(el=>el.removeAttribute('aria-hidden'));
  ticking=false;
}
addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(updateScroll);ticking=true;}},{passive:true});addEventListener('resize',updateScroll);updateScroll();
function updateCountdown(){
  const state=getCountdownState();
  document.querySelector('#days-left').textContent=state.days;
  const hourglass=document.querySelector('.hourglass');
  hourglass.setAttribute('aria-label',`${state.days} dias para o casamento. ${Math.round(state.fraction*100)}% da espera restante.`);
  hourglass.classList.toggle('finished',state.finished);
  document.querySelector('#sand-top').setAttribute('y',state.topY);
  document.querySelector('#sand-bottom').setAttribute('y',state.bottomY);
  document.querySelector('#sand-stream').setAttribute('y2',state.bottomY);
  document.querySelector('#sand-grains').setAttribute('y2',state.bottomY);
}
updateCountdown();
setInterval(updateCountdown,60000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)updateCountdown();});
document.querySelector('#calendar').addEventListener('click',()=>{const calendar=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Entre Nos//Wedding Demo//PT','BEGIN:VEVENT','UID:clara-tomas-demo-20270523@entre-nos','DTSTAMP:20261014T000000Z','DTSTART:20270523T190000Z','DTEND:20270524T020000Z','SUMMARY:Clara e Tomás — casamento (demonstração)','DESCRIPTION:Evento fictício de um portfólio.','LOCATION:São Paulo — local ilustrativo','END:VEVENT','END:VCALENDAR'].join('\r\n');const url=URL.createObjectURL(new Blob([calendar],{type:'text/calendar;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='clara-e-tomas-demonstracao.ics';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
const items=[...document.querySelectorAll('[data-photo]')],lightbox=document.querySelector('#lightbox');let activePhoto=0;
function showPhoto(i){activePhoto=(i+items.length)%items.length;const el=items[activePhoto];lightbox.querySelector('img').src=`assets/images/${el.dataset.photo}.webp`;lightbox.querySelector('img').alt=el.querySelector('img').alt;lightbox.querySelector('p').textContent=el.dataset.caption;}
items.forEach((el,i)=>el.addEventListener('click',()=>{showPhoto(i);lightbox.showModal();}));document.querySelector('#previous-photo').addEventListener('click',()=>showPhoto(activePhoto-1));document.querySelector('#next-photo').addEventListener('click',()=>showPhoto(activePhoto+1));lightbox.addEventListener('keydown',e=>{if(e.key==='ArrowRight')showPhoto(activePhoto+1);if(e.key==='ArrowLeft')showPhoto(activePhoto-1);});
function closeDialog(dialog){
  if(dialog.id!=='gift-dialog'||matchMedia('(prefers-reduced-motion: reduce)').matches){dialog.close();return;}
  if(!dialog.open||dialog.classList.contains('is-closing'))return;
  dialog.classList.add('is-closing');
  const finish=()=>{clearTimeout(fallback);dialog.removeEventListener('animationend',onEnd);dialog.close();dialog.classList.remove('is-closing');};
  const onEnd=event=>{if(event.target===dialog&&event.animationName==='gift-panel-out')finish();};
  const fallback=setTimeout(finish,400);
  dialog.addEventListener('animationend',onEnd);
}
document.querySelectorAll('dialog').forEach(d=>{
  d.querySelector('.dialog-close').addEventListener('click',()=>closeDialog(d));
  d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog(d);}});
  if(d.id==='gift-dialog'){
    d.addEventListener('cancel',e=>{e.preventDefault();closeDialog(d);});
    d.addEventListener('close',()=>{document.body.classList.remove('gift-dialog-open');d.classList.remove('is-closing');});
  }
});
const giftDialog=document.querySelector('#gift-dialog');const giftIdeas={casa:['Para o nosso lar',['Um jogo de xícaras para os cafés de domingo','Uma manta para as noites de filme','Cerâmicas para a nossa mesa','Um cantinho verde para a casa']],viagem:['Para novas histórias',['Um jantar especial a dois','Um passeio para descobrir um novo lugar','Um café da manhã sem pressa','Uma experiência para guardar na memória']]};
document.querySelectorAll('[data-gift]').forEach(b=>b.addEventListener('click',()=>{
  const [title,ideas]=giftIdeas[b.dataset.gift];
  giftDialog.querySelector('h2').textContent=title;
  giftDialog.querySelector('ul').replaceChildren(...ideas.map((text,index)=>{const li=document.createElement('li');li.textContent=text;li.style.setProperty('--gift-index',index);return li;}));
  giftDialog.classList.remove('is-closing');
  document.body.classList.add('gift-dialog-open');
  giftDialog.showModal();
}));
let confirmationAnimation;
document.querySelector('#rsvp-form').addEventListener('submit',event=>{
  event.preventDefault();
  const name=document.querySelector('#name');
  if(!name.value.trim()){name.setCustomValidity('Digite seu nome para testar a confirmação.');name.reportValidity();return;}
  name.setCustomValidity('');
  const result=document.querySelector('#form-result');
  const firstConfirmation=result.hidden;
  const previousHeight=firstConfirmation?0:result.getBoundingClientRect().height;
  const previousMargin=firstConfirmation?'0px':getComputedStyle(result).marginTop;
  confirmationAnimation?.cancel();
  const yes=document.querySelector('#attendance').value==='yes';
  result.textContent=`${name.value.trim().split(/\s+/)[0]}, ${yes?'que alegria ter você por perto!':'obrigado pelo carinho e por avisar.'} Esta foi uma simulação; nenhum dado foi enviado ou armazenado.`;
  result.hidden=false;
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
    const finalHeight=result.getBoundingClientRect().height;
    confirmationAnimation=result.animate([
      {height:`${previousHeight}px`,marginTop:previousMargin,opacity:0,transform:'translateY(10px)'},
      {height:`${finalHeight}px`,marginTop:'20px',opacity:1,transform:'translateY(0)'},
    ],{duration:580,easing:'cubic-bezier(.22,.65,.25,1)'});
  }
});
document.querySelector('#name').addEventListener('input',event=>event.target.setCustomValidity(''));
