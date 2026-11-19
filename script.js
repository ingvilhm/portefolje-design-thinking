'use strict';
const personas = {
  emma:{name:'Emma (24 år)',image:'images/persona_emma.png',details:[
    'Nyutdannet lærer med grunnskolelærerutdanning',
    'Kontaktlærer på en barneskole 4. trinn',
    'Har overtatt en klasse som fungerer greit, men det er noen utfordringer med lærevansker og ulike diagnoser i klassen.',
    'Hun føler hun ikke aner hva hun driver med, selv om hun har fem år utdanning bak seg.',
    'Hun har fine kollegaer hun kan spørre om hjelp, men syns det er litt skummelt å spørre ledelsen.'
  ]},
  petter:{name:'Petter (29 år)',image:'images/persona_petter.png',details:[
    'Nyansatt på ungdomstrinnet med to års erfaring fra en annen skole.',
    'Har PPU, idrettsutdanning og et utvekslingsår i Berlin.',
    'Faglærer i tysk, kroppsøving og fysisk aktivitet og helse.',
    'Har veldig mange elever, er på alle trinn og tilhører derfor flere team. Trives med kroppsøving og mye aktivitet, og er ganske faglig trygg.',
    'I tysk har han utfordringer med umotiverte elever og mye uro. Synes det er vanskelig å bli godt kjent med så mange elever og få oversikt over deres ulike forutsetninger og utfordringer.',
    'Syns det er enkelt å spørre KRØ- og språkkollegaer om hjelp, men har lite kontakt med kontaktlærerne.',
    'Har lite oversikt over hvordan "vanlige" timer i klassene er, og hvilke systemer som brukes på skolen.'
  ]},
  pelle:{name:'Pelle (58 år)',image:'images/persona_pelle.png',details:[
    'Assisterende rektor',
    'Har jobbet mange år i skolen, de siste åtte på samme skole. Var lærer før han ble leder.',
    'Trygg i rollen, god pedagog og godt likt.',
    'Han er komfortabel, men har begynt å se framover mot en pensjonisttilværelse som ikke er så langt unna lenger.',
    'Syns det er mye å gjøre, men føler det er overkommelig og regner stort sett med at ting ordner seg.',
    'For en stund siden ble det opprettet en mentorordning for nyutdannede som ruller og går. Og da føler han at han har gjort sitt for de nyansatte.'
  ]}
};
const personaOrder=['emma','petter','pelle'];
const personaDialog=document.getElementById('persona-dialog'), imageDialog=document.getElementById('image-dialog');
let personaIndex=0,activeGallery=[],activeImageIndex=0,lastTrigger=null;
// Lås bakgrunnens scroll mens et dialogvindu vises, og gjenopprett
// nøyaktig samme posisjon når det lukkes (også ved Escape).
let preservedScrollY=0;
function openDialog(dialog){
 if(dialog.open)return;
 preservedScrollY=window.scrollY;
 document.body.style.position='fixed';
 document.body.style.top=`-${preservedScrollY}px`;
 document.body.style.left='0';
 document.body.style.right='0';
 document.body.style.width='100%';
 dialog.showModal();
}
function releaseDialogScroll(){
 document.body.style.position='';document.body.style.top='';
 document.body.style.left='';document.body.style.right='';document.body.style.width='';
 window.scrollTo({top:preservedScrollY,left:0,behavior:'instant'});
 if(lastTrigger?.isConnected)lastTrigger.focus({preventScroll:true});
}
function renderPersona(){
 const p=personas[personaOrder[personaIndex]];
 document.getElementById('persona-dialog-title').textContent=p.name;
 const im=document.getElementById('persona-dialog-image');im.src=p.image;im.alt='Illustrasjon av '+p.name;
 const content=document.getElementById('persona-dialog-content');content.replaceChildren();
 p.details.forEach(line=>{const para=document.createElement('p');para.textContent=line;content.appendChild(para)});
 document.getElementById('persona-counter').textContent=(personaIndex+1)+' / '+personaOrder.length;
}
document.querySelectorAll('[data-persona]').forEach(button=>button.addEventListener('click',()=>{
 lastTrigger=button;personaIndex=personaOrder.indexOf(button.dataset.persona);renderPersona();openDialog(personaDialog)
}));
function movePersona(step){personaIndex=(personaIndex+step+personaOrder.length)%personaOrder.length;renderPersona()}
document.querySelectorAll('[data-persona-nav]').forEach(btn=>btn.addEventListener('click',()=>movePersona(btn.dataset.personaNav==='next'?1:-1)));
function renderLightbox(){
 const btn=activeGallery[activeImageIndex];if(!btn)return;
 const image=document.getElementById('image-dialog-img');image.src=btn.dataset.full;image.alt=btn.dataset.alt||'';
 document.getElementById('image-dialog-label').textContent=btn.dataset.alt||'Bilde';
 const multiple=activeGallery.length>1;
 document.querySelectorAll('[data-image-nav]').forEach(b=>b.hidden=!multiple);
 const counter=document.getElementById('lightbox-counter');counter.hidden=!multiple;
 if(multiple)counter.textContent=(activeImageIndex+1)+' / '+activeGallery.length;
}
document.querySelectorAll('[data-full]').forEach(button=>button.addEventListener('click',()=>{
 lastTrigger=button;const group=button.dataset.gallery;
 activeGallery=group?[...document.querySelectorAll('[data-gallery]')].filter(b=>b.dataset.gallery===group):[button];
 activeImageIndex=activeGallery.indexOf(button);renderLightbox();openDialog(imageDialog)
}));
function moveImage(step){if(activeGallery.length<2)return;activeImageIndex=(activeImageIndex+step+activeGallery.length)%activeGallery.length;renderLightbox()}
document.querySelectorAll('[data-image-nav]').forEach(b=>b.addEventListener('click',()=>moveImage(b.dataset.imageNav==='next'?1:-1)));
document.querySelectorAll('[data-close-dialog]').forEach(button=>button.addEventListener('click',()=>button.closest('dialog').close()));
[personaDialog,imageDialog].forEach(dialog=>{
 dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
 dialog.addEventListener('close',releaseDialogScroll);
});
document.addEventListener('keydown',event=>{
 if(event.key!=='ArrowRight'&&event.key!=='ArrowLeft')return;
 if(imageDialog.open){event.preventDefault();moveImage(event.key==='ArrowRight'?1:-1)}
 else if(personaDialog.open){event.preventDefault();movePersona(event.key==='ArrowRight'?1:-1)}
});
const tabs=[...document.querySelectorAll('.step-tab')],panels=[...document.querySelectorAll('.step-panel')];let current=0;
function setStep(index,focus=false){current=Math.max(0,Math.min(index,tabs.length-1));tabs.forEach((tab,i)=>{const active=i===current;tab.classList.toggle('active',active);tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;if(focus&&active)tab.focus()});panels.forEach((panel,i)=>{panel.hidden=i!==current;panel.classList.toggle('active',i===current)});document.getElementById('step-count').textContent=`Trinn ${current+1} av 4`;document.getElementById('prev-step').disabled=current===0;document.getElementById('next-step').disabled=current===3;}
tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>setStep(i));tab.addEventListener('keydown',event=>{if(event.key==='ArrowRight'){event.preventDefault();setStep((i+1)%4,true)}else if(event.key==='ArrowLeft'){event.preventDefault();setStep((i+3)%4,true)}else if(event.key==='Home'){event.preventDefault();setStep(0,true)}else if(event.key==='End'){event.preventDefault();setStep(3,true)}})});
document.getElementById('prev-step').addEventListener('click',()=>setStep(current-1));document.getElementById('next-step').addEventListener('click',()=>setStep(current+1));setStep(0);
const menu=document.querySelector('.menu-toggle'),navigation=document.getElementById('main-nav');menu.addEventListener('click',()=>{const expanded=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!expanded));navigation.classList.toggle('open',!expanded)});
navigation.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{navigation.classList.remove('open');menu.setAttribute('aria-expanded','false')}));
if('IntersectionObserver' in window){const sections=[...document.querySelectorAll('main > section[id]')].filter(el=>el.id!=='topp');const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){navigation.querySelectorAll('a').forEach(a=>a.classList.toggle('active',a.hash==='#'+entry.target.id))}})},{rootMargin:'-25% 0px -65% 0px'});sections.forEach(section=>observer.observe(section))}

// Før/etter P48: native range-input gir dra, touch og piltaster.
document.querySelectorAll('.p48-comparison').forEach(comparison=>{
 const range=comparison.querySelector('.p48-range');
 const update=()=>comparison.style.setProperty('--split',`${range.value}%`);
 range.addEventListener('input',update);update();
});
