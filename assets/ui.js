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
        ${o.tagline === false ? '' : `<span class="brand-sub" style="display:block;margin-top:-4px">Coffee &amp; Boba</span>`}
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

  /* ------------------------------------------------------ drink art ------ */
  /* One decision point for "photo or drawn cup", so every surface that shows a
     drink behaves the same. A drink carries `image` only once someone attaches
     a photo to it; until then — and if the URL ever fails to load — the cup
     Kora draws in CSS stands in, so a card is never empty or broken. */
  function esc(v) {
    return String(v == null ? '' : v)
      .replace(/&/g, '&amp;').replace(/"/g, '&quot;')
      .replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function drawnCup(item, o) {
    const art = (item && item.art) || '#7B1E3E';
    if (o.cup3d && global.Kora3D) {
      return global.Kora3D.cup({ w: o.w || 120, h: o.h || 162, liquid: art, fill: .66, pearls: 6 });
    }
    return cupArt(art, o.size || 74);
  }

  /** Markup for a drink's picture: its photo when it has one, else the cup. */
  function drinkArt(item, opts) {
    const o = opts || {};
    if (!item || !item.image) return drawnCup(item, o);
    return `<img class="${o.imgClass || 'item-photo'}" src="${esc(item.image)}"
      alt="${esc(item.name)}" loading="lazy" decoding="async"
      data-art="${esc((item && item.art) || '#7B1E3E')}"
      data-cup3d="${o.cup3d ? '1' : '0'}" data-w="${o.w || 120}" data-h="${o.h || 162}"
      data-size="${o.size || 74}" onerror="KoraUI.artFallback(this)">`;
  }

  /** Swap a photo that failed to load back to the drawn cup. */
  function artFallback(img) {
    if (!img || !img.parentNode) return;
    const d = img.dataset;
    const html = drawnCup({ art: d.art }, {
      cup3d: d.cup3d === '1',
      w: +d.w || 120, h: +d.h || 162, size: +d.size || 74
    });
    const holder = document.createElement('span');
    holder.className = 'item-art-fallback';
    holder.innerHTML = html;
    img.replaceWith(holder);
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
    ],
    poke: [
      'أيوه؟ في خدمة؟ 😄',
      'بلاش زقّ بقى، أنا شغال',
      'اسحبني براحتك، أنا مش هزعل',
      'إيه يا عم، وحشتك؟'
    ]
  };
  const pick = a => a[Math.floor(Math.random() * a.length)];

  /* --- the character (see assets/character.js) --- */
  function mascotArt() {
    return (global.KoraChar ? global.KoraChar.bust({}) : '')
      .replace('class="kora-char"', 'class="kora-char kora-mascot-svg"');
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
        /* The wrapper is exactly the size of the character — the bubble floats
           above it absolutely, so it never inflates the box we use to work out
           where he is allowed to stand. */
        #koraMascot { position:fixed; left:16px; top:60vh; z-index:420;
          width:150px; pointer-events:none;
          transition: left 2.4s cubic-bezier(.45,.05,.3,1), top 2.4s cubic-bezier(.45,.05,.3,1); }
        #koraMascot.dragging { transition:none; }
        #koraMascot .kora-mascot-svg { display:block; width:100%; height:auto;
          filter: drop-shadow(0 8px 18px rgba(38,22,28,.24));
          animation: kora-bob 3.4s ease-in-out infinite; transform-origin:60px 130px;
          pointer-events:auto; cursor:grab; touch-action:none; }
        #koraMascot.dragging .kora-mascot-svg { cursor:grabbing; animation:none; }
        /* a bouncier bob while he is walking to a new spot */
        #koraMascot.walking .kora-mascot-svg { animation: kora-walk .5s ease-in-out infinite; }
        @keyframes kora-walk { 0%,100%{transform:translateY(0) rotate(-2deg)}
          50%{transform:translateY(-8px) rotate(2deg)} }
        @keyframes kora-bob { 0%,100%{transform:translateY(0) rotate(0)}
          50%{transform:translateY(-5px) rotate(-1.4deg)} }
        /* the raised arm gives a little wave now and then */
        #koraMascot .c-arm { transform-origin:86px 101px; animation: kora-wave 6s ease-in-out infinite; }
        @keyframes kora-wave { 0%,86%,100%{transform:rotate(0)} 90%{transform:rotate(-16deg)} 95%{transform:rotate(6deg)} }
        #koraMascot .m-bubble { position:absolute; bottom:calc(100% + 10px); right:0;
          width:max-content; max-width:216px;
          background:var(--gray-900); color:#fff;
          padding:10px 14px; border-radius:14px 14px 4px 14px;
          font-size:.85rem; line-height:1.55; font-weight:500; direction:rtl; text-align:right;
          box-shadow:var(--sh-3);
          opacity:0; transform:translateY(8px) scale(.9); transition:all .22s cubic-bezier(.2,.9,.3,1.3); }
        #koraMascot .m-bubble.on { opacity:1; transform:translateY(0) scale(1); }
        #koraMascot .m-bubble::after { content:''; position:absolute; right:22px; bottom:-6px;
          width:12px; height:12px; background:var(--gray-900); transform:rotate(45deg); border-radius:2px; }
        /* when he is over on the left, the bubble opens to the right instead */
        #koraMascot.flip .m-bubble { right:auto; left:0; border-radius:14px 14px 14px 4px; }
        #koraMascot.flip .m-bubble::after { right:auto; left:22px; }
        /* blinking */
        /* the drawing is single-weight line art: it takes its colour from here */
        .kora-mascot-svg { color: var(--on-bg, #F4F6F8); }
        .kora-mascot-svg .c-eyes { animation: kora-blink 5.2s infinite; transform-origin:60px 51px; }
        @keyframes kora-blink { 0%,93%,100%{transform:scaleY(1)} 96%{transform:scaleY(.1)} }
        /* reaction states */
        .kora-mascot-svg .c-head { transition: transform .22s cubic-bezier(.3,.9,.4,1.4); transform-origin:60px 80px; }
        .kora-mascot-svg.react-happy .c-head { transform: rotate(-5deg) translateY(-2px); }
        .kora-mascot-svg.react-shock { animation: kora-jolt .45s ease-out; }
        .kora-mascot-svg.react-shock .c-head { transform: translateY(-4px) scale(1.06); }
        @keyframes kora-jolt { 0%{transform:translateY(0) rotate(0)}
          30%{transform:translateY(-10px) rotate(5deg)} 60%{transform:translateY(2px) rotate(-3deg)}
          100%{transform:translateY(0) rotate(0)} }
        .kora-mascot-svg.react-sip .c-arm { animation: kora-sip 1.2s ease-in-out; transform-origin:86px 101px; }
        @keyframes kora-sip { 0%,100%{transform:rotate(0)} 45%{transform:rotate(-30deg)} }
        @media (max-width:560px){ #koraMascot{ width:112px; }
          #koraMascot .m-bubble{ max-width:158px; font-size:.78rem; } }
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
    initRoaming(el);
    return el;
  }

  /* =======================================================================
     Roaming: he strolls to a free patch of screen on his own, keeps out of
     the way of anything the customer needs to read or tap, and can be picked
     up and dropped wherever they like.
     ======================================================================= */
  const KEEP_CLEAR = '.cartbar.on, .topbar, .overlay.show .modal, .modal-foot, [data-keep-clear]';
  const PAD = 14;

  function blockedRects() {
    const out = [];
    document.querySelectorAll(KEEP_CLEAR).forEach(e => {
      const r = e.getBoundingClientRect();
      // skip anything hidden — a display:none node reports an all-zero rect
      if (r.width < 2 || r.height < 2) return;
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      out.push({ left: r.left - PAD, top: r.top - PAD, right: r.right + PAD, bottom: r.bottom + PAD });
    });
    return out;
  }
  const hits = (a, b) => !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);

  function isFree(x, y, w, h, blocked) {
    const r = { left: x, top: y, right: x + w, bottom: y + h };
    return !blocked.some(b => hits(r, b));
  }

  function initRoaming(el) {
    const S = { dragging: false, timer: null, moved: false };

    const size = () => {
      const r = el.getBoundingClientRect();     // wrapper == character box now
      return { w: r.width || 96, h: r.height || 120 };
    };

    function put(x, y) {
      const { w, h } = size();
      x = Math.max(PAD, Math.min(window.innerWidth - w - PAD, x));
      y = Math.max(PAD, Math.min(window.innerHeight - h - PAD, y));
      el.style.left = x + 'px';
      el.style.top = y + 'px';
      el.style.bottom = 'auto';
      // keep the speech bubble on screen: flip it when he is near the left edge
      el.classList.toggle('flip', x < 250);
      try { localStorage.setItem('kora_mascot_pos', JSON.stringify({ x, y })); } catch (e) {}
    }

    // He walks the empty margins either side of the content column so he
    // never ends up sitting on top of something you are trying to read.
    function laneFor(w) {
      // the tallest .container is the page body, not the one inside the top bar
      let col = null, best = 0;
      document.querySelectorAll('.container, .container-sm, main').forEach(c => {
        const h = c.getBoundingClientRect().height;
        if (h > best) { best = h; col = c; }
      });
      if (!col) return null;
      const r = col.getBoundingClientRect();
      const lanes = [];
      if (r.left - PAD * 2 >= w) lanes.push([PAD, r.left - w - PAD]);
      if (window.innerWidth - r.right - PAD * 2 >= w) lanes.push([r.right + PAD, window.innerWidth - w - PAD]);
      return lanes.length ? lanes : null;
    }

    function stroll() {
      if (S.dragging) return schedule();
      const { w, h } = size();
      const blocked = blockedRects();
      const maxY = window.innerHeight - h - PAD;
      const lanes = laneFor(w);
      let target = null;

      if (lanes) {                          // roomy screen: use the side margins
        for (let i = 0; i < 24 && !target; i++) {
          const lane = lanes[Math.floor(Math.random() * lanes.length)];
          const x = lane[0] + Math.random() * Math.max(1, lane[1] - lane[0]);
          const y = PAD + Math.random() * Math.max(1, maxY - PAD);
          if (isFree(x, y, w, h, blocked)) target = { x, y };
        }
      }
      // No free margin (narrow screen): hug a side, but always fully on
      // screen — he should never be half cut off by the edge.
      if (!target) {
        const cands = [];
        const rightX = window.innerWidth - w - PAD;
        for (let y = maxY; y > PAD; y -= 40) {
          if (isFree(PAD, y, w, h, blocked)) { cands.push({ x: PAD, y }); break; }
        }
        for (let y = maxY; y > PAD; y -= 40) {
          if (isFree(rightX, y, w, h, blocked)) { cands.push({ x: rightX, y }); break; }
        }
        target = cands.length ? cands[Math.floor(Math.random() * cands.length)]
                              : { x: PAD, y: Math.max(PAD, maxY * 0.5) };
      }

      el.classList.add('walking');
      put(target.x, target.y);
      setTimeout(() => el.classList.remove('walking'), 2400);
      schedule();
    }

    function schedule() {
      clearTimeout(S.timer);
      S.timer = setTimeout(stroll, 9000 + Math.random() * 9000);
    }

    /* --- pick him up and put him down --- */
    const svg = el.querySelector('.kora-mascot-svg');
    let offX = 0, offY = 0;
    svg.addEventListener('pointerdown', e => {
      S.dragging = true; S.moved = false;
      el.classList.add('dragging');
      const r = el.getBoundingClientRect();
      offX = e.clientX - r.left; offY = e.clientY - r.top;
      svg.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    svg.addEventListener('pointermove', e => {
      if (!S.dragging) return;
      S.moved = true;
      put(e.clientX - offX, e.clientY - offY);
    });
    const drop = e => {
      if (!S.dragging) return;
      S.dragging = false;
      el.classList.remove('dragging');
      try { svg.releasePointerCapture(e.pointerId); } catch (err) {}
      if (!S.moved) mascot.say(pick(LINES.poke), 3000, 'happy');   // a tap, not a drag
      schedule();
    };
    svg.addEventListener('pointerup', drop);
    svg.addEventListener('pointercancel', drop);

    /* --- start where we left off, then keep him out of the way --- */
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem('kora_mascot_pos') || 'null'); } catch (e) {}
    requestAnimationFrame(() => {
      const { w, h } = size();
      if (saved) put(saved.x, saved.y);
      else put(PAD, window.innerHeight - h - 110);
      // if he landed on something important, or on the content column, move
      const x0 = parseFloat(el.style.left), y0 = parseFloat(el.style.top);
      const lanes = laneFor(w);
      const inLane = !lanes || lanes.some(l => x0 >= l[0] - 1 && x0 <= l[1] + 1);
      if (!inLane || !isFree(x0, y0, w, h, blockedRects())) stroll();
      else schedule();
    });

    window.addEventListener('resize', () => {
      put(parseFloat(el.style.left) || PAD, parseFloat(el.style.top) || PAD);
    });

    // Safety net: whatever else happens — a late layout, a bar sliding in, a
    // transition we mis-timed — never leave him sitting on top of the UI.
    setInterval(() => {
      if (S.dragging || el.classList.contains('walking')) return;
      const { w, h } = size();
      const x = parseFloat(el.style.left), y = parseFloat(el.style.top);
      if (isNaN(x) || isNaN(y)) return;
      if (!isFree(x, y, w, h, blockedRects())) stroll();
    }, 2000);

    // If the layout shifts under him (cart bar appears, modal opens), move.
    if ('MutationObserver' in window) {
      let nudge;
      new MutationObserver(() => {
        clearTimeout(nudge);
        nudge = setTimeout(() => {
          if (S.dragging) return;
          const { w, h } = size();
          const x = parseFloat(el.style.left), y = parseFloat(el.style.top);
          if (!isFree(x, y, w, h, blockedRects())) stroll();
        }, 260);
      }).observe(document.body, { attributes: true, childList: true, subtree: true,
                                  attributeFilter: ['class', 'style'] });
    }
  }

  // Redraw the whole face per reaction — the simplest way to get a real
  // expression change that behaves the same in every browser.
  function react(kind) {
    const svg = document.querySelector('#koraMascot .kora-mascot-svg');
    if (!svg || !global.KoraChar) return;
    svg.classList.remove('react-happy', 'react-shock', 'react-sip');
    const head = svg.querySelector('.c-head');
    if (head) {
      const opts = kind === 'shock' ? { mouth: 'oh' }
                 : kind            ? { mouth: 'grin', eyes: 'happy' }
                 : { mouth: 'smile' };
      head.innerHTML = global.KoraChar.face(opts);
      clearTimeout(react._t);
      react._t = setTimeout(() => { head.innerHTML = global.KoraChar.face({ mouth: 'smile' }); }, 2800);
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


  /* --- press ripple on every button --- */
  function initRipples(root) {
    (root || document).addEventListener('pointerdown', e => {
      const btn = e.target.closest('.btn, .kitchen-cta, .chip, .cup-choice');
      if (!btn || btn.disabled) return;
      const r = btn.getBoundingClientRect();
      const size = Math.max(r.width, r.height);
      const sp = document.createElement('span');
      sp.className = 'ripple';
      sp.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px;`;
      if (getComputedStyle(btn).position === 'static') btn.style.position = 'relative';
      btn.appendChild(sp);
      setTimeout(() => sp.remove(), 600);
    }, { passive: true });
  }

  /* --- make a number climb to its new value instead of jumping --- */
  function countTo(el, to, opts) {
    if (!el) return;
    const o = opts || {};
    const from = Number(el.dataset.v || 0);
    const dur = o.dur || 420;
    const suffix = o.suffix || '';
    const t0 = performance.now();
    cancelAnimationFrame(el.__raf || 0);
    const step = now => {
      const k = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      const v = Math.round(from + (to - from) * eased);
      el.textContent = v + suffix;
      if (k < 1) el.__raf = requestAnimationFrame(step);
      else el.dataset.v = to;
    };
    el.__raf = requestAnimationFrame(step);
  }

  /* --- a burst of confetti, used when an order goes through --- */
  function confetti(n) {
    if (global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const box = document.createElement('div');
    box.className = 'confetti';
    const colors = ['#7B1E3E', '#AE3160', '#D98BA9', '#FFD75E', '#C4762A', '#5C8A4A'];
    for (let i = 0; i < (n || 70); i++) {
      const c = document.createElement('i');
      c.style.left = Math.random() * 100 + '%';
      c.style.background = colors[Math.floor(Math.random() * colors.length)];
      c.style.animationDuration = (1.6 + Math.random() * 1.6) + 's';
      c.style.animationDelay = (Math.random() * .5) + 's';
      c.style.transform = `scale(${.6 + Math.random() * .8})`;
      box.appendChild(c);
    }
    document.body.appendChild(box);
    setTimeout(() => box.remove(), 4200);
  }

  /* --- flash an element to draw the eye to a change --- */
  function pop(el) {
    if (!el) return;
    el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
  }

  initRipples();

  global.KoraUI = {
    logoSVG, brandMark, toast, cupArt, drinkArt, artFallback, mascot,
    initReveal, stagger, flyToCart,
    countTo, confetti, pop
  };
})(window);
