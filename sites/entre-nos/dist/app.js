document.documentElement.classList.add('js');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
document.body.classList.toggle('reduced-motion',reduced);
const menuButton=document.querySelector('.menu-button'),menu=document.querySelector('#menu');
function closeMenu(){document.body.classList.remove('menu-open');menu.inert=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Abrir menu');}
menuButton.addEventListener('click',()=>{const opening=!document.body.classList.contains('menu-open');document.body.classList.toggle('menu-open',opening);menu.inert=!opening;menuButton.setAttribute('aria-expanded',String(opening));menuButton.setAttribute('aria-label',opening?'Fechar menu':'Abrir menu');});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('menu-open')){closeMenu();menuButton.focus();}if(e.key==='Tab'&&document.body.classList.contains('menu-open')){const links=[menuButton,...menu.querySelectorAll('a')];if(e.shiftKey&&document.activeElement===links[0]){e.preventDefault();links.at(-1).focus();}else if(!e.shiftKey&&document.activeElement===links.at(-1)){e.preventDefault();links[0].focus();}}});
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
const weddingDate=new Date('2027-05-23T16:00:00-03:00');document.querySelector('#days-left').textContent=Math.max(0,Math.ceil((weddingDate-Date.now())/86400000));
document.querySelector('#calendar').addEventListener('click',()=>{const calendar=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Entre Nos//Wedding Demo//PT','BEGIN:VEVENT','UID:clara-tomas-demo-20270523@entre-nos','DTSTAMP:20261014T000000Z','DTSTART:20270523T190000Z','DTEND:20270524T020000Z','SUMMARY:Clara e Tomás — casamento (demonstração)','DESCRIPTION:Evento fictício de um portfólio.','LOCATION:São Paulo — local ilustrativo','END:VEVENT','END:VCALENDAR'].join('\r\n');const url=URL.createObjectURL(new Blob([calendar],{type:'text/calendar;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='clara-e-tomas-demonstracao.ics';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
const items=[...document.querySelectorAll('[data-photo]')],lightbox=document.querySelector('#lightbox');let activePhoto=0;
function showPhoto(i){activePhoto=(i+items.length)%items.length;const el=items[activePhoto];lightbox.querySelector('img').src=`images/${el.dataset.photo}.webp`;lightbox.querySelector('img').alt=el.querySelector('img').alt;lightbox.querySelector('p').textContent=el.dataset.caption;}
items.forEach((el,i)=>el.addEventListener('click',()=>{showPhoto(i);lightbox.showModal();}));document.querySelector('#previous-photo').addEventListener('click',()=>showPhoto(activePhoto-1));document.querySelector('#next-photo').addEventListener('click',()=>showPhoto(activePhoto+1));lightbox.addEventListener('keydown',e=>{if(e.key==='ArrowRight')showPhoto(activePhoto+1);if(e.key==='ArrowLeft')showPhoto(activePhoto-1);});
document.querySelectorAll('dialog').forEach(d=>{d.querySelector('.dialog-close').addEventListener('click',()=>d.close());d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}});});
const giftDialog=document.querySelector('#gift-dialog');const giftIdeas={casa:['Para o nosso lar',['Um jogo de xícaras para os cafés de domingo','Uma manta para as noites de filme','Cerâmicas para a nossa mesa','Um cantinho verde para a casa']],viagem:['Para novas histórias',['Um jantar especial a dois','Um passeio para descobrir um novo lugar','Um café da manhã sem pressa','Uma experiência para guardar na memória']]};
document.querySelectorAll('[data-gift]').forEach(b=>b.addEventListener('click',()=>{const [title,ideas]=giftIdeas[b.dataset.gift];giftDialog.querySelector('h2').textContent=title;giftDialog.querySelector('ul').replaceChildren(...ideas.map(t=>{const li=document.createElement('li');li.textContent=t;return li;}));giftDialog.showModal();}));
document.querySelector('#rsvp-form').addEventListener('submit',e=>{e.preventDefault();const name=document.querySelector('#name');if(!name.value.trim()){name.setCustomValidity('Digite seu nome para testar a confirmação.');name.reportValidity();return;}name.setCustomValidity('');const result=document.querySelector('#form-result');const yes=document.querySelector('#attendance').value==='yes';result.textContent=`${name.value.trim().split(/\s+/)[0]}, ${yes?'que alegria ter você por perto!':'obrigado pelo carinho e por avisar.'} Esta foi uma simulação; nenhum dado foi enviado ou armazenado.`;result.hidden=false;});document.querySelector('#name').addEventListener('input',e=>e.target.setCustomValidity(''));
