/* ==========================================================================
   Kora — kitchen artwork
   Every machine behind the bar, drawn as inline SVG. Each one is 120×130 so
   they can sit on the same rail and slide into place above the cup.
   ========================================================================== */
(function (global) {
  'use strict';

  const steel = '#D9DEE4', steelDark = '#B6BEC8', steelLight = '#F0F3F6';
  const wood = '#C08A52';

  /* --- 0. Tea brewer --- */
  function teaUrn() {
    return `<svg viewBox="0 0 120 130">
      <rect x="26" y="18" width="68" height="66" rx="10" fill="${steel}" stroke="${steelDark}" stroke-width="2.5"/>
      <rect x="34" y="26" width="52" height="26" rx="6" fill="#8A5525"/>
      <rect x="34" y="26" width="52" height="8" rx="4" fill="#A86A33"/>
      <circle cx="60" cy="66" r="7" fill="${steelLight}" stroke="${steelDark}" stroke-width="2"/>
      <circle cx="60" cy="66" r="2.6" fill="#C2334D"/>
      <path d="M54 84h12v14H54z" fill="${steelDark}"/>
      <rect x="48" y="96" width="24" height="9" rx="3" fill="${steelDark}"/>
      <rect x="30" y="105" width="60" height="7" rx="3.5" fill="#9AA3AE"/>
      <rect x="10" y="112" width="100" height="9" rx="4" fill="${wood}"/>
    </svg>`;
  }

  /* --- 1. Milk dispenser --- */
  function milkDispenser() {
    return `<svg viewBox="0 0 120 130">
      <rect x="30" y="14" width="60" height="70" rx="9" fill="#FFFFFF" stroke="${steelDark}" stroke-width="2.5"/>
      <rect x="38" y="24" width="44" height="46" rx="6" fill="#EAF1F7"/>
      <rect x="38" y="46" width="44" height="24" rx="4" fill="#F7FAFD"/>
      <rect x="44" y="6" width="32" height="12" rx="5" fill="#6FA8DC"/>
      <path d="M54 84h12v14H54z" fill="${steelDark}"/>
      <rect x="48" y="96" width="24" height="9" rx="3" fill="${steelDark}"/>
      <rect x="30" y="105" width="60" height="7" rx="3.5" fill="#9AA3AE"/>
      <rect x="10" y="112" width="100" height="9" rx="4" fill="${wood}"/>
    </svg>`;
  }

  /* --- 2. Syrup pumps --- */
  function syrupPumps() {
    const bottle = (x, c) => `
      <rect x="${x}" y="34" width="24" height="52" rx="7" fill="${c}" stroke="rgba(0,0,0,.14)" stroke-width="1.6"/>
      <rect x="${x + 4}" y="40" width="7" height="30" rx="3.5" fill="#fff" opacity=".34"/>
      <rect x="${x + 8}" y="22" width="8" height="14" rx="3" fill="${steelDark}"/>
      <rect x="${x + 2}" y="14" width="20" height="9" rx="4" fill="${steel}"/>`;
    return `<svg viewBox="0 0 120 130">
      ${bottle(14, '#8A5525')}${bottle(48, '#C2334D')}${bottle(82, '#5C8A4A')}
      <rect x="10" y="86" width="100" height="8" rx="4" fill="${steelDark}"/>
      <rect x="10" y="112" width="100" height="9" rx="4" fill="${wood}"/>
    </svg>`;
  }

  /* --- 3. Topping bins --- */
  function toppingBins() {
    return `<svg viewBox="0 0 120 130">
      <rect x="8" y="46" width="48" height="44" rx="8" fill="${steelLight}" stroke="${steelDark}" stroke-width="2.4"/>
      <rect x="64" y="46" width="48" height="44" rx="8" fill="${steelLight}" stroke="${steelDark}" stroke-width="2.4"/>
      <g fill="#2A1017">
        <circle cx="20" cy="76" r="5"/><circle cx="32" cy="80" r="5"/><circle cx="44" cy="76" r="5"/>
        <circle cx="26" cy="68" r="4.4"/><circle cx="38" cy="69" r="4.4"/>
      </g>
      <g fill="#D98BA9">
        <circle cx="76" cy="76" r="5"/><circle cx="88" cy="80" r="5"/><circle cx="100" cy="76" r="5"/>
        <circle cx="82" cy="68" r="4.4"/><circle cx="94" cy="69" r="4.4"/>
      </g>
      <rect x="6" y="38" width="52" height="9" rx="4" fill="${steelDark}"/>
      <rect x="62" y="38" width="52" height="9" rx="4" fill="${steelDark}"/>
      <rect x="10" y="112" width="100" height="9" rx="4" fill="${wood}"/>
    </svg>`;
  }

  /* --- 4. Ice machine --- */
  function iceMachine() {
    return `<svg viewBox="0 0 120 130">
      <rect x="24" y="16" width="72" height="66" rx="10" fill="#DCEAF5" stroke="#A9C4DA" stroke-width="2.5"/>
      <rect x="34" y="26" width="52" height="30" rx="6" fill="#F2F9FF"/>
      <g fill="#BFDCF0">
        <rect x="40" y="32" width="12" height="12" rx="3"/>
        <rect x="56" y="34" width="12" height="12" rx="3"/>
        <rect x="70" y="30" width="11" height="11" rx="3"/>
      </g>
      <path d="M54 82h12v14H54z" fill="#A9C4DA"/>
      <rect x="48" y="94" width="24" height="9" rx="3" fill="#A9C4DA"/>
      <rect x="28" y="103" width="64" height="7" rx="3.5" fill="#9AA3AE"/>
      <rect x="10" y="112" width="100" height="9" rx="4" fill="${wood}"/>
    </svg>`;
  }

  /* --- 5. Shaker --- */
  function shaker() {
    return `<svg viewBox="0 0 120 130">
      <path d="M44 26h32l6 58a12 12 0 0 1-12 13H50a12 12 0 0 1-12-13l6-58Z"
            fill="${steel}" stroke="${steelDark}" stroke-width="2.6"/>
      <rect x="40" y="16" width="40" height="12" rx="5" fill="${steelDark}"/>
      <rect x="50" y="38" width="9" height="42" rx="4" fill="#fff" opacity=".55"/>
      <rect x="10" y="112" width="100" height="9" rx="4" fill="${wood}"/>
    </svg>`;
  }

  /* --- 6. Sealing machine --- */
  function sealer() {
    return `<svg viewBox="0 0 120 130">
      <rect x="22" y="10" width="76" height="30" rx="8" fill="${steel}" stroke="${steelDark}" stroke-width="2.5"/>
      <rect x="34" y="18" width="52" height="12" rx="4" fill="#7B1E3E"/>
      <rect x="52" y="40" width="16" height="26" fill="${steelDark}"/>
      <rect x="26" y="66" width="68" height="12" rx="5" fill="${steelDark}"/>
      <rect x="34" y="78" width="52" height="26" rx="5" fill="${steelLight}" stroke="${steelDark}" stroke-width="2"/>
      <rect x="10" y="112" width="100" height="9" rx="4" fill="${wood}"/>
    </svg>`;
  }

  /* --- the working cup on the counter --- */
  function workCup() {
    return `<svg viewBox="0 0 150 190" class="wc">
      <!-- lid, only after sealing -->
      <g class="wc-lid">
        <rect x="20" y="26" width="110" height="15" rx="7" fill="#C7C7CD"/>
        <rect x="96" y="-16" width="13" height="52" rx="6" fill="var(--wine-500)" transform="rotate(11 96 -16)"/>
      </g>
      <!-- glass -->
      <path d="M28 44h94l-9 116a16 16 0 0 1-16 14H53a16 16 0 0 1-16-14L28 44Z"
            fill="rgba(255,255,255,.5)" stroke="#C7C7CD" stroke-width="3"/>
      <clipPath id="wcClip">
        <path d="M28 44h94l-9 116a16 16 0 0 1-16 14H53a16 16 0 0 1-16-14L28 44Z"/>
      </clipPath>
      <g clip-path="url(#wcClip)">
        <rect class="wc-syrup"  x="20" y="0" width="112" height="200" fill="#7A3F14"/>
        <rect class="wc-tea"    x="20" y="0" width="112" height="200" fill="#B4763C"/>
        <rect class="wc-milk"   x="20" y="0" width="112" height="200" fill="#F3E3CB" opacity=".92"/>
        <g class="wc-ice"></g>
        <g class="wc-pearls"></g>
      </g>
      <!-- glass shine -->
      <rect x="38" y="54" width="12" height="96" rx="6" fill="#fff" opacity=".5"/>
    </svg>`;
  }

  global.KoraKitchen = {
    machines: [
      { id: 'brew',     name: 'Tea Brewer',      art: teaUrn,        spout: 60, color: '#B4763C' },
      { id: 'creamer',  name: 'Milk Dispenser',  art: milkDispenser, spout: 60, color: '#F3E3CB' },
      { id: 'sweet',    name: 'Syrup Pumps',     art: syrupPumps,    spout: 60, color: '#7A3F14' },
      { id: 'toppings', name: 'Topping Bins',    art: toppingBins,   spout: 60, color: '#2A1017' },
      { id: 'ice',      name: 'Ice Machine',     art: iceMachine,    spout: 60, color: '#DCEAF5' },
      { id: 'shake',    name: 'Shaker',          art: shaker,        spout: 60, color: '#D9DEE4' },
      { id: 'seal',     name: 'Sealing Machine', art: sealer,        spout: 60, color: '#7B1E3E' },
      { id: 'cup',      name: 'Cup Stack',       art: shaker,        spout: 60, color: '#C7C7CD' }
    ],
    workCup
  };
})(window);
