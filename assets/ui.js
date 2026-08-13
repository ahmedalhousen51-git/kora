/* ==========================================================================
   Kora — shared UI bits: logo, toast, cup artwork, mascot
   ========================================================================== */
(function (global) {
  'use strict';

  /* ------------------------------------------------------------- logo ---- */
  function logoSVG(size, color) {
    const c = color || 'var(--wine-700)';
    const h = size || 36;
    return `<svg class="brand-logo" style="height:${h}px;width:auto" viewBox="0 0 34 42" fill="none" aria-hidden="true">
      <path d="M6.5 11h21l-2.2 25.4A4.6 4.6 0 0 1 20.7 41h-7.4a4.6 4.6 0 0 1-4.6-4.6L6.5 11Z" fill="${c}"/>
      <rect x="4" y="7.5" width="26" height="5" rx="2.5" fill="${c}" opacity=".55"/>
      <rect x="19.5" y="0.5" width="3.4" height="11" rx="1.7" transform="rotate(11 19.5 .5)" fill="${c}" opacity=".8"/>
      <circle cx="12.5" cy="33" r="2.1" fill="#fff" opacity=".92"/>
      <circle cx="18.4" cy="35.4" r="2.1" fill="#fff" opacity=".92"/>
      <circle cx="23.2" cy="32.4" r="1.8" fill="#fff" opacity=".8"/>
      <circle cx="15.6" cy="28.6" r="1.6" fill="#fff" opacity=".65"/>
    </svg>`;
  }

  function brandMark(opts) {
    const o = opts || {};
    return `<a class="brand" href="index.html">
      ${logoSVG(o.size || 32, o.color)}
      <span>
        <span class="brand-name${o.onDark ? ' on-dark' : ''}">Kora</span>
        ${o.tagline === false ? '' : `<span class="brand-sub" style="display:block;margin-top:-4px">Bubble Tea Bar</span>`}
      </span>
    </a>`;
  }

  /* ------------------------------------------------------------ toast ---- */
  let toastEl, toastTimer;
  function toast(msg, kind) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      document.body.appendChild(toastEl);
    }
    toastEl.className = 'toast show' + (kind ? ' ' + kind : '');
    toastEl.textContent = msg;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toastEl.className = 'toast'; }, 3000);
  }

  /* -------------------------------------------------------- cup art ------ */
  // Simple layered cup used on menu cards — colour comes from the drink.
  function cupArt(color, size) {
    const s = size || 74;
    return `<svg viewBox="0 0 60 76" style="width:${s}px;height:auto" aria-hidden="true">
      <defs><clipPath id="cupclip${(color||'').replace(/[^a-z0-9]/gi,'')}">
        <path d="M11 19h38l-3.6 44a7 7 0 0 1-7 6.4H21.6a7 7 0 0 1-7-6.4L11 19Z"/>
      </clipPath></defs>
      <path d="M11 19h38l-3.6 44a7 7 0 0 1-7 6.4H21.6a7 7 0 0 1-7-6.4L11 19Z" fill="#F1F1F3"/>
      <g clip-path="url(#cupclip${(color||'').replace(/[^a-z0-9]/gi,'')})">
        <rect x="8" y="30" width="44" height="46" fill="${color}" opacity=".9"/>
        <rect x="8" y="30" width="44" height="7" fill="#fff" opacity=".28"/>
        <circle cx="21" cy="60" r="3.4" fill="#2A1A22" opacity=".62"/>
        <circle cx="30" cy="65" r="3.4" fill="#2A1A22" opacity=".62"/>
        <circle cx="39" cy="60" r="3.4" fill="#2A1A22" opacity=".62"/>
        <circle cx="25.5" cy="69" r="3" fill="#2A1A22" opacity=".5"/>
        <circle cx="35" cy="70" r="3" fill="#2A1A22" opacity=".5"/>
      </g>
      <path d="M11 19h38l-3.6 44a7 7 0 0 1-7 6.4H21.6a7 7 0 0 1-7-6.4L11 19Z" fill="none" stroke="#D8D8DE" stroke-width="1.4"/>
      <rect x="7.5" y="14" width="45" height="7" rx="3.5" fill="#C7C7CD"/>
      <rect x="34" y="1" width="5" height="16" rx="2.5" transform="rotate(12 34 1)" fill="${color}" opacity=".75"/>
    </svg>`;
  }

  /* ------------------------------------------------------- mascot -------- */
  const LINES = {
    greeting: [
      "Welcome to Kora. Let's get you something with pearls in it.",
      "Hey! Pick a drink, or go rogue and build your own.",
      "Good choice coming here. Now make a harder one — the menu."
    ],
    tooMuch: [
      "Easy there. That's a dessert now, not a drink.",
      "That much syrup and the cup files a complaint.",
      "Bold. Slightly illegal. Dial it back a touch.",
      "Your dentist just felt a disturbance."
    ],
    tooLittle: [
      "That's basically flavoured water. Give it something.",
      "Shy pour. The drink can barely feel it."
    ],
    working: [
      "Nice, this one's shaping up.",
      "Pearls are ready when you are.",
      "Taking notes — the bar gets all of this exactly as you set it.",
      "Solid instincts. Keep going."
    ],
    buildStart: [
      "Build mode. Every step counts — no skipping this one.",
      "You're behind the counter now. Measure like you mean it."
    ],
    submitted: [
      "Sent to the bar. Sit tight.",
      "Order's in. The shaker is already moving.",
      "Locked in. We'll ping you the moment it's up."
    ],
    blocked: [
      "Set this step first, then we move on.",
      "Can't skip that one — it's part of the recipe."
    ]
  };
  const pick = a => a[Math.floor(Math.random() * a.length)];

  function mascotFace() {
    return `<svg viewBox="0 0 44 44" style="width:100%;height:100%" aria-hidden="true">
      <circle cx="22" cy="22" r="21" fill="var(--wine-700)"/>
      <circle cx="15.5" cy="19" r="3.2" fill="#fff"/>
      <circle cx="28.5" cy="19" r="3.2" fill="#fff"/>
      <circle cx="16.3" cy="19.8" r="1.5" fill="var(--wine-950)"/>
      <circle cx="29.3" cy="19.8" r="1.5" fill="var(--wine-950)"/>
      <path d="M15 28c2.4 2.6 11.6 2.6 14 0" stroke="#fff" stroke-width="2.2" stroke-linecap="round" fill="none"/>
      <circle cx="9" cy="25" r="2.4" fill="var(--wine-300)" opacity=".65"/>
      <circle cx="35" cy="25" r="2.4" fill="var(--wine-300)" opacity=".65"/>
    </svg>`;
  }

  let bubbleTimer;
  function ensureMascot() {
    let el = document.getElementById('koraMascot');
    if (el) return el;
    const style = document.createElement('style');
    style.textContent = `
      #koraMascot { position:fixed; left:18px; bottom:18px; z-index:420;
        display:flex; align-items:flex-end; gap:10px; pointer-events:none; }
      #koraMascot .m-face { width:52px; height:52px; flex-shrink:0;
        filter: drop-shadow(0 6px 16px rgba(123,30,62,.34));
        animation: kora-float 3.2s ease-in-out infinite; }
      @keyframes kora-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
      #koraMascot .m-bubble { max-width:230px; background:var(--gray-900); color:#fff;
        padding:10px 14px; border-radius:14px 14px 14px 4px;
        font-size:.82rem; line-height:1.5; font-weight:500;
        box-shadow:var(--sh-3); margin-bottom:6px;
        opacity:0; transform:translateY(6px) scale(.94); transition:all .2s ease; }
      #koraMascot .m-bubble.on { opacity:1; transform:translateY(0) scale(1); }
      @media (max-width:560px){ #koraMascot{ left:12px; bottom:12px; }
        #koraMascot .m-face{ width:42px;height:42px; } #koraMascot .m-bubble{ max-width:160px; font-size:.76rem; } }
    `;
    document.head.appendChild(style);
    el = document.createElement('div');
    el.id = 'koraMascot';
    el.innerHTML = `<div class="m-bubble" id="koraBubble"></div><div class="m-face">${mascotFace()}</div>`;
    document.body.appendChild(el);
    return el;
  }

  const mascot = {
    say(text, ms) {
      ensureMascot();
      const b = document.getElementById('koraBubble');
      b.textContent = text;
      b.classList.add('on');
      clearTimeout(bubbleTimer);
      bubbleTimer = setTimeout(() => b.classList.remove('on'), ms || 4200);
    },
    greet() { this.say(pick(LINES.greeting)); },
    tooMuch() { this.say(pick(LINES.tooMuch)); },
    tooLittle() { this.say(pick(LINES.tooLittle)); },
    working() { this.say(pick(LINES.working)); },
    buildStart() { this.say(pick(LINES.buildStart), 5200); },
    submitted() { this.say(pick(LINES.submitted), 5200); },
    blocked() { this.say(pick(LINES.blocked)); }
  };

  global.KoraUI = { logoSVG, brandMark, toast, cupArt, mascot };
})(window);
