/* Twilight Bazaar V7.2 front-page secret-word puzzle.
   This browser-side check is for fun, NOT a secure login or content restriction. */
'use strict';
(() => {
  const ACCESS_WORD = 'LANTERN';
  const SESSION_KEY = 'twilightBazaarEntranceV1';
  const body = document.body;
  const entrance = document.getElementById('entry-screen');
  const moon = document.getElementById('entry-moon');
  const clue = document.getElementById('entry-clue');
  const form = document.getElementById('entry-form');
  const input = document.getElementById('entry-password');
  const message = document.getElementById('entry-message');
  const leave = document.getElementById('entry-lock');
  const app = document.querySelector('.app-shell');
  const getSession = () => {try{return sessionStorage.getItem(SESSION_KEY)==='opened';}catch{return false;}};
  const setSession = value => {try{if(value)sessionStorage.setItem(SESSION_KEY,'opened');else sessionStorage.removeItem(SESSION_KEY);}catch{}};
  function setUnlocked(value){
    body.classList.toggle('site-locked',!value);
    entrance.hidden = value;
    if(app) app.inert = !value;
    if(value){setSession(true);window.scrollTo(0,0);}
    else{setSession(false);clue.hidden=true;moon.setAttribute('aria-expanded','false');input.value='';message.classList.remove('error');message.textContent='Hint: The moon knows something.';window.scrollTo(0,0);input.focus();}
  }
  form.addEventListener('submit',e => {
    e.preventDefault();
    if(input.value.trim().toUpperCase() === ACCESS_WORD){setUnlocked(true);return;}
    message.textContent='Not quite! Tap the glowing moon to discover the word.';
    message.classList.add('error');
    input.select();
  });
  moon.addEventListener('click',() => {
    const shown=clue.hidden;
    clue.hidden=!shown;
    moon.setAttribute('aria-expanded',String(shown));
    message.textContent=shown?'You found the secret. Now enter it above.':'Hint: The moon knows something.';
    message.classList.remove('error');
  });
  if(leave) leave.addEventListener('click',() => setUnlocked(false));
  setUnlocked(getSession());
})();
