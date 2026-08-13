/* ==========================================================================
   Kora — shared UI: logo, toast, cup artwork, mascot, animation helpers
   The mascot speaks Egyptian Arabic on purpose — the site is English, the
   character is local. That contrast is the joke.
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
  function cupArt(color, size) {
    const s = size || 74;
    const uid = 'c' + Math.random().toString(36).slice(2, 8);
    return `<svg viewBox="0 0 60 76" style="width:${s}px;height:auto" aria-hidden="true">
      <defs><clipPath id="${uid}">
        <path d="M11 19h38l-3.6 44a7 7 0 0 1-7 6.4H21.6a7 7 0 0 1-7-6.4L11 19Z"/>
      </clipPath></defs>
      <path d="M11 19h38l-3.6 44a7 7 0 0 1-7 6.4H21.6a7 7 0 0 1-7-6.4L11 19Z" fill="#F1F1F3"/>
      <g clip-path="url(#${uid})">
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

  /* =======================================================================
     MASCOT — "كابتن كورة"
     Line-art character, burgundy strokes, reacts to what you're doing.
     ======================================================================= */

  const LINES = {
    greeting: [
      'أهلاً يا نجم! اختار حاجة وابسط نفسك 🧋',
      'نوّرت. عايز إيه النهارده؟',
      'يلا بينا.. المنيو مستنيك من الصبح'
    ],
    tooMuch: [
      'ياعم كفاية بقى! ده مشروب مش تورتة 😅',
      'إنت بتعمل مشروب ولا حلويات شرقية؟ خفف شوية',
      'كده الطبيب هيزعل مني أنا مش إنت 🙈',
      'الحكم بيرفع كارت أصفر.. الكمية زيادة 🟨',
      'براحة على السكر يا وحش'
    ],
    tooLittle: [
      'كده هتشرب مية يا معلم، زوّد شوية 💧',
      'ده رشة مش مقدار.. حط بجد',
      'المشروب مش حاسس بيك خالص'
    ],
    working: [
      'شكلها هتطلع جامدة 👌',
      'ماشي يا كبير، إنت فاهم بتعمل إيه',
      'البارستا هيعملها بالمليمتر زي ما إنت ظابطها',
      'دي تركيبة محترمة والله',
      'إيدك حلوة يا فنان'
    ],
    buildStart: [
      'يلا ندخل المطبخ! كل خطوة ليها حساب — مفيش تخطي هنا 👨‍🍳',
      'دلوقتي إنت اللي ورا الكاونتر. ظبطها صح'
    ],
    submitted: [
      'الطلب راح للبار، استنى الصافرة 🏁',
      'اتسجل رسمي! الشيكر بدأ يشتغل',
      'تمام يا كبير، شوية وهتلاقيه قدامك'
    ],
    blocked: [
      'لأ يا كبير، ظبط الخطوة دي الأول',
      'مينفعش نتخطى دي.. دي أساس المشروب',
      'استنى بس، في حاجة ناقصة'
    ],
    ready: [
      'جاهز! تعالى خده وهو سخن.. يعني بارد 😄',
      'خلص! الكوباية مستنياك'
    ]
  };
  const pick = a => a[Math.floor(Math.random() * a.length)];

  /* --- the character: burgundy line-art, sitting, cup in hand --- */
  function mascotArt(id) {
    const u = id || 'm' + Math.random().toString(36).slice(2, 7);
    return `<svg viewBox="0 0 120 130" class="kora-mascot-svg" data-m="${u}" aria-hidden="true">
      <g fill="none" stroke="var(--wine-700)" stroke-width="4.4"
         stroke-linecap="round" stroke-linejoin="round">

        <!-- legs (crossed, relaxed) -->
        <path d="M44 108c-9 4-17 3-22-2" class="m-leg"/>
        <path d="M64 108c8 6 18 6 25 1"/>
        <!-- body -->
        <path d="M44 108c-3-14-2-26 3-35" class="m-body"/>
        <path d="M64 108c4-13 4-25 0-34"/>
        <!-- arm holding the cup up -->
        <path d="M66 82c9-2 15-9 16-18" class="m-arm"/>
        <!-- resting arm -->
        <path d="M45 84c-8 1-13 6-14 13"/>
        <!-- head -->
        <ellipse cx="55" cy="52" rx="24" ry="22" class="m-head"/>
        <!-- ear / hair curl -->
        <path d="M74 38c6-4 11-2 12 4s-4 10-9 8"/>
      </g>

      <!-- face -->
      <g class="m-face">
        <ellipse class="m-eye" cx="47" cy="49" rx="3.1" ry="3.6" fill="var(--wine-800)"/>
        <ellipse class="m-eye" cx="63" cy="49" rx="3.1" ry="3.6" fill="var(--wine-800)"/>
        <path class="m-mouth" d="M48 60c3.4 4 12 4 15.4 0" fill="none"
              stroke="var(--wine-700)" stroke-width="3.4" stroke-linecap="round"/>
        <circle cx="37" cy="58" r="4" fill="var(--wine-300)" opacity=".5"/>
        <circle cx="73" cy="58" r="4" fill="var(--wine-300)" opacity=".5"/>
      </g>

      <!-- the cup he's holding up -->
      <g class="m-cup">
        <path d="M76 44h18l-1.7 20a3.4 3.4 0 0 1-3.4 3.1h-7.8a3.4 3.4 0 0 1-3.4-3.1L76 44Z"
              fill="var(--wine-700)"/>
        <rect x="74.5" y="41" width="21" height="4" rx="2" fill="var(--wine-800)"/>
        <circle cx="82" cy="60" r="2" fill="#fff" opacity=".9"/>
        <circle cx="88" cy="62" r="2" fill="#fff" opacity=".9"/>
      </g>
    </svg>`;
  }

  /* --- floating corner mascot with speech bubble --- */
  let bubbleTimer;
  function ensureMascot() {
    let el = document.getElementById('koraMascot');
    if (el) return el;

    if (!document.getElementById('kora-mascot-css')) {
      const st = document.createElement('style');
      st.id = 'kora-mascot-css';
      st.textContent = `
        #koraMascot { position:fixed; left:16px; bottom:16px; z-index:420;
          display:flex; align-items:flex-end; gap:8px; pointer-events:none; }
        #koraMascot .kora-mascot-svg { width:86px; height:auto; flex-shrink:0;
          filter: drop-shadow(0 8px 18px rgba(123,30,62,.26));
          animation: kora-bob 3.4s ease-in-out infinite; transform-origin:60px 118px; }
        @keyframes kora-bob { 0%,100%{transform:translateY(0) rotate(0)}
          50%{transform:translateY(-5px) rotate(-1.4deg)} }
        #koraMascot .m-bubble { position:relative; max-width:216px;
          background:var(--gray-900); color:#fff;
          padding:10px 14px; border-radius:14px 14px 4px 14px;
          font-size:.85rem; line-height:1.55; font-weight:500; direction:rtl; text-align:right;
          box-shadow:var(--sh-3); margin-bottom:14px; order:-1;
          opacity:0; transform:translateY(8px) scale(.9); transition:all .22s cubic-bezier(.2,.9,.3,1.3); }
        #koraMascot .m-bubble.on { opacity:1; transform:translateY(0) scale(1); }
        #koraMascot .m-bubble::after { content:''; position:absolute; right:14px; bottom:-6px;
          width:12px; height:12px; background:var(--gray-900); transform:rotate(45deg); border-radius:2px; }
        /* blinking */
        .kora-mascot-svg .m-eye { animation: kora-blink 4.6s infinite; transform-origin:center; }
        @keyframes kora-blink { 0%,92%,100%{transform:scaleY(1)} 95%{transform:scaleY(.12)} }
        /* reaction states */
        .kora-mascot-svg .m-mouth { transition: d .18s ease; }
        .kora-mascot-svg.react-shock { animation: kora-jolt .42s ease-out; }
        @keyframes kora-jolt { 0%{transform:translateY(0) rotate(0)}
          30%{transform:translateY(-9px) rotate(5deg)} 60%{transform:translateY(2px) rotate(-3deg)}
          100%{transform:translateY(0) rotate(0)} }
        .kora-mascot-svg.react-sip .m-cup { animation: kora-sip 1.1s ease-in-out; transform-origin:85px 66px; }
        @keyframes kora-sip { 0%,100%{transform:rotate(0)} 45%{transform:rotate(-26deg) translate(-7px,4px)} }
        @media (max-width:560px){ #koraMascot{ left:10px; bottom:10px; }
          #koraMascot .kora-mascot-svg{ width:62px; }
          #koraMascot .m-bubble{ max-width:158px; font-size:.78rem; margin-bottom:8px; } }
        @media (prefers-reduced-motion: reduce) {
          #koraMascot .kora-mascot-svg, .kora-mascot-svg .m-eye { animation:none !important; }
        }
      `;
      document.head.appendChild(st);
    }

    el = document.createElement('div');
    el.id = 'koraMascot';
    el.innerHTML = `<div class="m-bubble" id="koraBubble"></div>${mascotArt('corner')}`;
    document.body.appendChild(el);
    return el;
  }

  // Mouth shapes, swapped by attribute so this works in every browser
  // (CSS `d: path()` is not supported everywhere).
  const MOUTH = {
    neutral: 'M48 60c3.4 4 12 4 15.4 0',
    happy:   'M46 58c4.5 8.5 16 8.5 20.5 0',
    shock:   'M51.5 59.5c0-3.4 8-3.4 8 0s-8 3.4-8 0'
  };

  function react(kind) {
    const svg = document.querySelector('#koraMascot .kora-mascot-svg');
    if (!svg) return;
    svg.classList.remove('react-happy', 'react-shock', 'react-sip');
    const mouth = svg.querySelector('.m-mouth');
    if (mouth) {
      mouth.setAttribute('d', MOUTH[kind === 'shock' ? 'shock' : (kind ? 'happy' : 'neutral')]);
      clearTimeout(react._t);
      react._t = setTimeout(() => mouth.setAttribute('d', MOUTH.neutral), 2600);
    }
    if (kind) { void svg.offsetWidth; svg.classList.add('react-' + kind); }
  }

  const mascot = {
    say(text, ms, reaction) {
      ensureMascot();
      const b = document.getElementById('koraBubble');
      b.textContent = text;
      b.classList.add('on');
      react(reaction);
      clearTimeout(bubbleTimer);
      bubbleTimer = setTimeout(() => b.classList.remove('on'), ms || 4400);
    },
    greet()       { this.say(pick(LINES.greeting), 4400, 'happy'); },
    tooMuch()     { this.say(pick(LINES.tooMuch), 4400, 'shock'); },
    tooLittle()   { this.say(pick(LINES.tooLittle), 4000, 'shock'); },
    working()     { this.say(pick(LINES.working), 3600, 'happy'); },
    buildStart()  { this.say(pick(LINES.buildStart), 5400, 'happy'); },
    submitted()   { this.say(pick(LINES.submitted), 5400, 'sip'); },
    blocked()     { this.say(pick(LINES.blocked), 4000, 'shock'); },
    ready()       { this.say(pick(LINES.ready), 6000, 'sip'); },
    art: mascotArt
  };

  /* =======================================================================
     Animation helpers
     ======================================================================= */

  // Reveal elements as they scroll into view. Add class "reveal" in markup.
  function initReveal(root) {
    const els = (root || document).querySelectorAll('.reveal:not(.seen)');
    if (!('IntersectionObserver' in window)) {
      els.forEach(e => e.classList.add('seen'));
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('seen'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .12 });
    els.forEach(e => io.observe(e));
  }

  // Stagger children of a container (used on the menu grid).
  function stagger(container, step) {
    const kids = container.children;
    for (let i = 0; i < kids.length; i++) {
      kids[i].style.setProperty('--d', (i * (step || 45)) + 'ms');
      kids[i].classList.add('rise');
    }
  }

  // Fly a small cup from an element to the cart bar.
  function flyToCart(fromEl, color) {
    const target = document.querySelector('.cartbar');
    if (!fromEl || !target) return;
    const a = fromEl.getBoundingClientRect(), b = target.getBoundingClientRect();
    const ghost = document.createElement('div');
    ghost.className = 'fly-ghost';
    ghost.innerHTML = cupArt(color || 'var(--wine-700)', 44);
    ghost.style.left = (a.left + a.width / 2 - 22) + 'px';
    ghost.style.top = (a.top + a.height / 2 - 28) + 'px';
    document.body.appendChild(ghost);
    requestAnimationFrame(() => {
      ghost.style.transform =
        `translate(${b.left + 40 - a.left - a.width / 2}px, ${b.top + 10 - a.top - a.height / 2}px) scale(.35)`;
      ghost.style.opacity = '0';
    });
    setTimeout(() => ghost.remove(), 700);
  }

  global.KoraUI = {
    logoSVG, brandMark, toast, cupArt, mascot,
    initReveal, stagger, flyToCart
  };
})(window);
