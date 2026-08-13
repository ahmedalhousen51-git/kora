/* ==========================================================================
   Kora — kitchen artwork
   Every machine behind the bar, drawn as inline SVG with gradients, shading
   and a cast shadow so the scene reads as a real (game-style) kitchen.
   Each one is 120×140 so they share the same rail above the cup.
   ========================================================================== */
(function (global) {
  'use strict';

  let uid = 0;
  const nid = () => 'g' + (++uid);

  /* shared bits ---------------------------------------------------------- */
  function defsMetal(id) {
    return `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0"   stop-color="#AFB8C3"/>
      <stop offset=".18" stop-color="#EDF1F5"/>
      <stop offset=".5"  stop-color="#D4DBE3"/>
      <stop offset=".82" stop-color="#EDF1F5"/>
      <stop offset="1"   stop-color="#A8B1BC"/>
    </linearGradient>`;
  }
  function shadow() {
    return `<ellipse cx="60" cy="127" rx="46" ry="6" fill="rgba(38,22,28,.22)"/>`;
  }
  function base() {   // the shelf each machine stands on
    return `<rect x="6" y="122" width="108" height="11" rx="5" fill="#A8703C"/>
            <rect x="6" y="122" width="108" height="4" rx="2" fill="#C9924F"/>`;
  }
  function led(x, y, c) {
    return `<circle cx="${x}" cy="${y}" r="3.4" fill="${c}"/>
            <circle cx="${x}" cy="${y}" r="6" fill="${c}" opacity=".28"><animate attributeName="opacity"
              values=".28;.06;.28" dur="1.8s" repeatCount="indefinite"/></circle>`;
  }

  /* --- 0. Tea brewer --- */
  function teaUrn() {
    const m = nid(), t = nid();
    return `<svg viewBox="0 0 120 140">
      <defs>${defsMetal(m)}
        <linearGradient id="${t}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#C98F4C"/><stop offset="1" stop-color="#7A4A1E"/>
        </linearGradient>
      </defs>
      ${shadow()}
      <rect x="24" y="14" width="72" height="72" rx="12" fill="url(#${m})" stroke="#98A2AE" stroke-width="2"/>
      <rect x="33" y="22" width="54" height="34" rx="7" fill="#4A3324"/>
      <rect x="36" y="25" width="48" height="28" rx="5" fill="url(#${t})"/>
      <rect x="36" y="25" width="48" height="7" rx="3" fill="#fff" opacity=".18"/>
      ${led(78, 66, '#E0533F')}
      <circle cx="45" cy="66" r="6.5" fill="#EDF1F5" stroke="#98A2AE" stroke-width="1.8"/>
      <rect x="43.6" y="61" width="2.8" height="6" rx="1.4" fill="#5B6675"/>
      <path d="M52 86h16v13H52z" fill="#B6BEC8"/>
      <rect x="46" y="97" width="28" height="10" rx="4" fill="#98A2AE"/>
      <rect x="30" y="108" width="60" height="8" rx="4" fill="#7E8896"/>
      <rect x="34" y="110" width="52" height="3" rx="1.5" fill="#5B6675"/>
      ${base()}
    </svg>`;
  }

  /* --- 1. Milk dispenser --- */
  function milkDispenser() {
    const m = nid();
    return `<svg viewBox="0 0 120 140">
      <defs>${defsMetal(m)}</defs>
      ${shadow()}
      <rect x="28" y="10" width="64" height="76" rx="11" fill="url(#${m})" stroke="#98A2AE" stroke-width="2"/>
      <rect x="36" y="20" width="48" height="52" rx="8" fill="#F7FAFD" stroke="#C9D3DD" stroke-width="1.6"/>
      <rect x="36" y="44" width="48" height="28" rx="6" fill="#FFFFFF"/>
      <rect x="40" y="26" width="9" height="34" rx="4.5" fill="#fff" opacity=".8"/>
      <rect x="42" y="2" width="36" height="12" rx="5" fill="#6FA8DC"/>
      <rect x="46" y="4" width="12" height="4" rx="2" fill="#fff" opacity=".5"/>
      ${led(78, 78, '#4FA3E3')}
      <path d="M52 86h16v13H52z" fill="#B6BEC8"/>
      <rect x="46" y="97" width="28" height="10" rx="4" fill="#98A2AE"/>
      <rect x="30" y="108" width="60" height="8" rx="4" fill="#7E8896"/>
      ${base()}
    </svg>`;
  }

  /* --- 2. Syrup pumps --- */
  function syrupPumps() {
    const bottle = (x, c1, c2) => {
      const g = nid();
      return `<defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="${c2}"/><stop offset=".4" stop-color="${c1}"/>
          <stop offset="1" stop-color="${c2}"/></linearGradient></defs>
        <rect x="${x}" y="34" width="26" height="58" rx="8" fill="url(#${g})" stroke="rgba(0,0,0,.18)" stroke-width="1.6"/>
        <rect x="${x + 4}" y="42" width="7" height="34" rx="3.5" fill="#fff" opacity=".42"/>
        <rect x="${x + 3}" y="60" width="20" height="12" rx="2" fill="#fff" opacity=".9"/>
        <rect x="${x + 9}" y="20" width="8" height="16" rx="3" fill="#8E97A3"/>
        <rect x="${x + 2}" y="11" width="22" height="10" rx="5" fill="#B6BEC8"/>
        <rect x="${x + 6}" y="13" width="8" height="3" rx="1.5" fill="#fff" opacity=".6"/>`;
    };
    return `<svg viewBox="0 0 120 140">
      ${shadow()}
      ${bottle(8, '#8A5525', '#5E3616')}
      ${bottle(46, '#C2334D', '#8E2038')}
      ${bottle(84, '#5C8A4A', '#3E6431')}
      <rect x="4" y="92" width="112" height="10" rx="5" fill="#98A2AE"/>
      <rect x="4" y="92" width="112" height="3.4" rx="1.7" fill="#C9D3DD"/>
      ${base()}
    </svg>`;
  }

  /* --- 3. Topping bins --- */
  function toppingBins() {
    const m = nid();
    return `<svg viewBox="0 0 120 140">
      <defs>${defsMetal(m)}</defs>
      ${shadow()}
      <path d="M8 52h48l-4 44a6 6 0 0 1-6 5.4H18a6 6 0 0 1-6-5.4L8 52Z" fill="url(#${m})" stroke="#98A2AE" stroke-width="2"/>
      <path d="M64 52h48l-4 44a6 6 0 0 1-6 5.4H74a6 6 0 0 1-6-5.4L64 52Z" fill="url(#${m})" stroke="#98A2AE" stroke-width="2"/>
      <g fill="#2A1017">
        <circle cx="21" cy="84" r="5.4"/><circle cx="33" cy="88" r="5.4"/><circle cx="44" cy="83" r="5.4"/>
        <circle cx="27" cy="75" r="4.8"/><circle cx="39" cy="76" r="4.8"/>
        <circle cx="24" cy="93" r="4.4"/><circle cx="38" cy="94" r="4.4"/>
      </g>
      <g fill="#E77FA4">
        <circle cx="77" cy="84" r="5.4"/><circle cx="89" cy="88" r="5.4"/><circle cx="100" cy="83" r="5.4"/>
        <circle cx="83" cy="75" r="4.8"/><circle cx="95" cy="76" r="4.8"/>
        <circle cx="80" cy="93" r="4.4"/><circle cx="94" cy="94" r="4.4"/>
      </g>
      <rect x="4" y="44" width="56" height="10" rx="5" fill="#98A2AE"/>
      <rect x="60" y="44" width="56" height="10" rx="5" fill="#98A2AE"/>
      <rect x="8" y="46" width="20" height="3" rx="1.5" fill="#fff" opacity=".5"/>
      <rect x="64" y="46" width="20" height="3" rx="1.5" fill="#fff" opacity=".5"/>
      ${base()}
    </svg>`;
  }

  /* --- 4. Ice machine --- */
  function iceMachine() {
    const g = nid();
    return `<svg viewBox="0 0 120 140">
      <defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#B9D4E8"/><stop offset=".3" stop-color="#EDF6FC"/>
        <stop offset=".75" stop-color="#D3E6F3"/><stop offset="1" stop-color="#AFCADF"/>
      </linearGradient></defs>
      ${shadow()}
      <rect x="22" y="10" width="76" height="76" rx="12" fill="url(#${g})" stroke="#9BBBD3" stroke-width="2"/>
      <rect x="32" y="20" width="56" height="36" rx="7" fill="#F4FAFF" stroke="#C6DEEE" stroke-width="1.6"/>
      <g fill="#BFDCF0" stroke="#A6CBE4" stroke-width="1.2">
        <rect x="38" y="26" width="14" height="14" rx="4"/>
        <rect x="55" y="30" width="14" height="14" rx="4" transform="rotate(12 62 37)"/>
        <rect x="71" y="24" width="13" height="13" rx="4" transform="rotate(-9 77 30)"/>
      </g>
      ${led(80, 68, '#4FA3E3')}
      <rect x="34" y="64" width="30" height="8" rx="4" fill="#CFE3F1"/>
      <path d="M52 86h16v13H52z" fill="#A9C4DA"/>
      <rect x="46" y="97" width="28" height="10" rx="4" fill="#9BBBD3"/>
      <rect x="30" y="108" width="60" height="8" rx="4" fill="#88A9C2"/>
      ${base()}
    </svg>`;
  }

  /* --- 5. Shaker --- */
  function shaker() {
    const m = nid();
    return `<svg viewBox="0 0 120 140">
      <defs>${defsMetal(m)}</defs>
      ${shadow()}
      <path d="M42 30h36l7 62a13 13 0 0 1-13 14.5H48A13 13 0 0 1 35 92l7-62Z"
            fill="url(#${m})" stroke="#98A2AE" stroke-width="2.2"/>
      <rect x="38" y="18" width="44" height="14" rx="6" fill="#B6BEC8" stroke="#98A2AE" stroke-width="1.6"/>
      <rect x="44" y="21" width="16" height="4" rx="2" fill="#fff" opacity=".65"/>
      <rect x="49" y="42" width="10" height="46" rx="5" fill="#fff" opacity=".55"/>
      <path d="M40 74h40" stroke="#98A2AE" stroke-width="2" opacity=".6"/>
      ${base()}
    </svg>`;
  }

  /* --- 6. Sealing machine --- */
  function sealer() {
    const m = nid();
    return `<svg viewBox="0 0 120 140">
      <defs>${defsMetal(m)}</defs>
      ${shadow()}
      <rect x="18" y="6" width="84" height="34" rx="9" fill="url(#${m})" stroke="#98A2AE" stroke-width="2"/>
      <rect x="30" y="14" width="60" height="16" rx="5" fill="#7B1E3E"/>
      <rect x="34" y="17" width="20" height="4" rx="2" fill="#fff" opacity=".28"/>
      ${led(94, 23, '#39B06B')}
      <rect x="50" y="40" width="20" height="28" fill="#B6BEC8"/>
      <rect x="54" y="40" width="5" height="28" fill="#98A2AE"/>
      <rect x="22" y="68" width="76" height="14" rx="6" fill="#98A2AE"/>
      <rect x="26" y="70" width="26" height="4" rx="2" fill="#fff" opacity=".45"/>
      <rect x="32" y="82" width="56" height="30" rx="6" fill="#EDF1F5" stroke="#98A2AE" stroke-width="2"/>
      <circle cx="60" cy="97" r="10" fill="#D4DBE3" stroke="#98A2AE" stroke-width="1.6"/>
      ${base()}
    </svg>`;
  }

  /* --- the working cup on the counter --- */
  function workCup() {
    return `<svg viewBox="0 0 150 200" class="wc">
      <ellipse cx="75" cy="186" rx="52" ry="7" fill="rgba(38,22,28,.2)"/>
      <g class="wc-lid">
        <rect x="18" y="24" width="114" height="16" rx="8" fill="#C7C7CD"/>
        <rect x="18" y="24" width="114" height="6" rx="3" fill="#E2E2E7"/>
        <rect x="96" y="-18" width="14" height="56" rx="7" fill="var(--wine-500)" transform="rotate(11 96 -18)"/>
      </g>
      <path d="M28 44h94l-9 116a16 16 0 0 1-16 14H53a16 16 0 0 1-16-14L28 44Z"
            fill="rgba(255,255,255,.55)" stroke="#C2C6CD" stroke-width="3"/>
      <clipPath id="wcClip">
        <path d="M28 44h94l-9 116a16 16 0 0 1-16 14H53a16 16 0 0 1-16-14L28 44Z"/>
      </clipPath>
      <g clip-path="url(#wcClip)">
        <rect class="wc-syrup"  x="20" y="0" width="112" height="220" fill="#7A3F14"/>
        <rect class="wc-tea"    x="20" y="0" width="112" height="220" fill="#B4763C"/>
        <rect class="wc-milk"   x="20" y="0" width="112" height="220" fill="#F3E3CB" opacity=".92"/>
        <g class="wc-ice"></g>
        <g class="wc-pearls"></g>
        <rect x="20" y="0" width="112" height="220" fill="url(#wcSheen)"/>
      </g>
      <defs>
        <linearGradient id="wcSheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0"   stop-color="#fff" stop-opacity=".22"/>
          <stop offset=".28" stop-color="#fff" stop-opacity="0"/>
          <stop offset=".82" stop-color="#000" stop-opacity="0"/>
          <stop offset="1"   stop-color="#000" stop-opacity=".12"/>
        </linearGradient>
      </defs>
      <rect x="40" y="56" width="13" height="98" rx="6.5" fill="#fff" opacity=".55"/>
    </svg>`;
  }

  global.KoraKitchen = {
    machines: [
      { id: 'brew',     name: 'Tea Brewer',      art: teaUrn,        color: '#B4763C', steam: true },
      { id: 'creamer',  name: 'Milk Dispenser',  art: milkDispenser, color: '#F3E3CB' },
      { id: 'sweet',    name: 'Syrup Pumps',     art: syrupPumps,    color: '#7A3F14' },
      { id: 'toppings', name: 'Topping Bins',    art: toppingBins,   color: '#2A1017' },
      { id: 'ice',      name: 'Ice Machine',     art: iceMachine,    color: '#DCEAF5' },
      { id: 'shake',    name: 'Shaker',          art: shaker,        color: '#D9DEE4' },
      { id: 'seal',     name: 'Sealing Machine', art: sealer,        color: '#7B1E3E' }
    ],
    workCup
  };
})(window);
