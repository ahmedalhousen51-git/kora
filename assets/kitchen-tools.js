/* ==========================================================================
   Kora — the things you actually pick up in the kitchen.
   Each tool is drawn so its pouring lip sits at the coordinates given in
   `spout` (fraction of the tool's width/height), which is what the pour
   detection uses to know where the liquid comes out.
   ========================================================================== */
(function (global) {
  'use strict';

  const steel = '#D9DEE4', steelDark = '#A8B1BC', steelLight = '#F2F5F8';

  /* --- kettle of brewed tea --- */
  function kettle() {
    return `<svg viewBox="0 0 130 110">
      <path d="M96 44c14-6 24 2 22 14s-14 16-24 10" fill="none" stroke="${steelDark}" stroke-width="7" stroke-linecap="round"/>
      <path d="M30 34h58a10 10 0 0 1 10 10v34a16 16 0 0 1-16 16H36a16 16 0 0 1-16-16V44a10 10 0 0 1 10-10Z"
            fill="${steel}" stroke="${steelDark}" stroke-width="2.6"/>
      <rect x="30" y="42" width="12" height="38" rx="6" fill="#fff" opacity=".5"/>
      <rect x="40" y="24" width="38" height="12" rx="6" fill="${steelDark}"/>
      <circle cx="59" cy="20" r="6" fill="${steelLight}" stroke="${steelDark}" stroke-width="2"/>
      <!-- spout, bottom-left -->
      <path d="M20 58 L2 82 l12 8 14-20Z" fill="${steel}" stroke="${steelDark}" stroke-width="2.4" stroke-linejoin="round"/>
      <rect x="46" y="56" width="28" height="14" rx="4" fill="#8A5525" opacity=".65"/>
    </svg>`;
  }

  /* --- jug of milk --- */
  function jug() {
    return `<svg viewBox="0 0 130 110">
      <path d="M92 46c12-4 20 2 19 12s-12 14-21 9" fill="none" stroke="#C9D3DD" stroke-width="7" stroke-linecap="round"/>
      <path d="M28 30h60a8 8 0 0 1 8 8v40a16 16 0 0 1-16 16H36a16 16 0 0 1-16-16V38a8 8 0 0 1 8-8Z"
            fill="#FFFFFF" stroke="#C9D3DD" stroke-width="2.6"/>
      <rect x="28" y="60" width="60" height="26" rx="6" fill="#F2F7FB"/>
      <rect x="30" y="38" width="11" height="36" rx="5.5" fill="#EAF2F9"/>
      <!-- pouring lip, bottom-left -->
      <path d="M20 54 L3 78 l13 9 14-21Z" fill="#FFFFFF" stroke="#C9D3DD" stroke-width="2.4" stroke-linejoin="round"/>
      <rect x="34" y="20" width="26" height="12" rx="5" fill="#6FA8DC"/>
    </svg>`;
  }

  /* --- syrup bottle with a press pump --- */
  function pump(color) {
    return `<svg viewBox="0 0 90 130">
      <g class="pump-head">
        <rect x="30" y="6" width="30" height="12" rx="6" fill="${steelDark}"/>
        <rect x="40" y="16" width="10" height="20" rx="4" fill="#8E97A3"/>
      </g>
      <path d="M22 62 L6 74 l7 10 14-12Z" fill="#8E97A3"/>
      <rect x="24" y="36" width="42" height="80" rx="12" fill="${color || '#8A5525'}"
            stroke="rgba(0,0,0,.18)" stroke-width="2"/>
      <rect x="30" y="46" width="10" height="46" rx="5" fill="#fff" opacity=".38"/>
      <rect x="28" y="76" width="34" height="20" rx="3" fill="#fff" opacity=".9"/>
      <rect x="24" y="30" width="42" height="10" rx="5" fill="#B6BEC8"/>
    </svg>`;
  }

  /* --- scoop, used for ice and for toppings --- */
  function scoop(fill, kind) {
    let bits = '';
    if (kind === 'ice') {
      bits = `<rect x="30" y="52" width="15" height="15" rx="4" fill="#EAF6FF" stroke="#C6DEEE" stroke-width="1.4"/>
              <rect x="47" y="56" width="14" height="14" rx="4" fill="#EAF6FF" stroke="#C6DEEE" stroke-width="1.4" transform="rotate(14 54 63)"/>
              <rect x="38" y="66" width="13" height="13" rx="4" fill="#DCEFFC" stroke="#C6DEEE" stroke-width="1.4"/>`;
    } else {
      bits = `<circle cx="36" cy="60" r="6.5" fill="${fill}"/><circle cx="50" cy="62" r="6.5" fill="${fill}"/>
              <circle cx="43" cy="72" r="6" fill="${fill}"/><circle cx="56" cy="72" r="5.6" fill="${fill}"/>`;
    }
    return `<svg viewBox="0 0 120 110">
      <path d="M22 44h48a6 6 0 0 1 6 6v14a24 24 0 0 1-24 24H40a24 24 0 0 1-24-24V50a6 6 0 0 1 6-6Z"
            fill="${steel}" stroke="${steelDark}" stroke-width="2.6"/>
      ${bits}
      <rect x="70" y="30" width="44" height="11" rx="5.5" fill="${steelDark}" transform="rotate(-18 70 30)"/>
    </svg>`;
  }

  /* --- lid you press onto the finished cup --- */
  function lid() {
    return `<svg viewBox="0 0 140 70">
      <rect x="10" y="26" width="120" height="18" rx="9" fill="#C7C7CD"/>
      <rect x="10" y="26" width="120" height="7" rx="3.5" fill="#E4E4E9"/>
      <ellipse cx="70" cy="26" rx="60" ry="10" fill="#D6D6DC"/>
      <rect x="96" y="-6" width="14" height="40" rx="7" fill="var(--wine-500)" transform="rotate(11 96 -6)"/>
    </svg>`;
  }

  global.KoraTools = {
    // spout: where the liquid leaves the tool, as a fraction of its box
    kettle: { art: kettle,                 w: 150, spout: { x: .06, y: .80 }, tilt: -52, color: '#B4763C' },
    jug:    { art: jug,                    w: 150, spout: { x: .06, y: .78 }, tilt: -52, color: '#F3E3CB' },
    pump:   { art: pump,                   w: 84,  spout: { x: .10, y: .62 }, tilt: 0,   color: '#7A3F14' },
    iceScoop:  { art: () => scoop(null, 'ice'), w: 130, spout: { x: .38, y: .82 }, tilt: 62, color: '#DCEAF5' },
    pearlScoop:{ art: () => scoop('#2A1017'),   w: 130, spout: { x: .38, y: .82 }, tilt: 62, color: '#2A1017' },
    lid:    { art: lid,                    w: 150, spout: { x: .5, y: .5 },   tilt: 0,   color: '#C7C7CD' }
  };
})(window);
