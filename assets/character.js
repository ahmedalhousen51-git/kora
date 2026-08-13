/* ==========================================================================
   Kora — "Captain Kora", the barista mascot
   A proper filled cartoon character (not line art), drawn in a few poses so
   the same face shows up in the corner helper, behind the kitchen counter,
   and lying under the pour on the landing page.
   ========================================================================== */
(function (global) {
  'use strict';

  const SKIN = '#F2C9A0', SKIN_SH = '#E0AF83';
  const HAIR = '#2E1A20';
  const CAP = '#7B1E3E', CAP_DARK = '#5E1730';
  const SHIRT = '#94264C', SHIRT_DARK = '#7B1E3E';
  const APRON = '#F4EFE7', APRON_SH = '#E2D9CC';
  const EYE = '#26161C', BLUSH = '#E98CA8';

  /* Shared face. cx/cy centre of the head. */
  function face(o) {
    o = o || {};
    const mouth = o.mouth || 'smile';
    const mouths = {
      smile: `<path d="M52 62q8 8 16 0" fill="none" stroke="${EYE}" stroke-width="3" stroke-linecap="round"/>`,
      grin:  `<path d="M50 60q10 13 20 0z" fill="${EYE}"/><path d="M53.5 62q6.5 3 13 0" fill="#F27E9B"/>`,
      oh:    `<ellipse cx="60" cy="64" rx="6" ry="7.5" fill="${EYE}"/>`,
      flat:  `<path d="M53 63h14" fill="none" stroke="${EYE}" stroke-width="3" stroke-linecap="round"/>`
    };
    const eyes = o.eyes === 'happy'
      ? `<path d="M42 50q6-7 12 0" fill="none" stroke="${EYE}" stroke-width="3.4" stroke-linecap="round"/>
         <path d="M66 50q6-7 12 0" fill="none" stroke="${EYE}" stroke-width="3.4" stroke-linecap="round"/>`
      : `<ellipse cx="48" cy="50" rx="6.4" ry="7.4" fill="#fff"/>
         <ellipse cx="72" cy="50" rx="6.4" ry="7.4" fill="#fff"/>
         <circle cx="${48 + (o.look || 0)}" cy="51.5" r="4.1" fill="${EYE}"/>
         <circle cx="${72 + (o.look || 0)}" cy="51.5" r="4.1" fill="${EYE}"/>
         <circle cx="${46.4 + (o.look || 0)}" cy="49.4" r="1.5" fill="#fff"/>
         <circle cx="${70.4 + (o.look || 0)}" cy="49.4" r="1.5" fill="#fff"/>`;
    return `
      <ellipse cx="36" cy="54" rx="4.6" ry="6" fill="${SKIN_SH}"/>
      <ellipse cx="84" cy="54" rx="4.6" ry="6" fill="${SKIN_SH}"/>
      <rect x="30" y="24" width="60" height="56" rx="26" fill="${SKIN}"/>
      <path d="M30 44a30 30 0 0 1 60 0v-4a30 30 0 0 0-60 0z" fill="${SKIN_SH}" opacity=".35"/>
      <!-- hair peeking under the cap -->
      <path d="M32 42q4-16 28-16t28 16q-6-6-28-6t-28 6z" fill="${HAIR}"/>
      <!-- cap -->
      <path d="M30 40a30 26 0 0 1 60 0q-30-9-60 0z" fill="${CAP}"/>
      <path d="M30 40q30-9 60 0l2 6q-32-8-64 0z" fill="${CAP_DARK}"/>
      <circle cx="60" cy="17" r="4" fill="${CAP_DARK}"/>
      <circle cx="60" cy="33" r="5.5" fill="#fff" opacity=".9"/>
      <circle cx="60" cy="33" r="2.4" fill="${CAP}"/>
      <g class="c-eyes">${eyes}</g>
      <circle class="c-blush" cx="41" cy="63" r="5.2" fill="${BLUSH}" opacity=".55"/>
      <circle class="c-blush" cx="79" cy="63" r="5.2" fill="${BLUSH}" opacity=".55"/>
      <g class="c-mouth">${mouths[mouth] || mouths.smile}</g>`;
  }

  /* A small boba cup the character can hold. */
  function heldCup(x, y, s, color) {
    return `<g transform="translate(${x},${y}) scale(${s || 1})">
      <path d="M0 6h26l-2.6 30a5 5 0 0 1-5 4.4H7.6a5 5 0 0 1-5-4.4L0 6Z" fill="#EFEFF2"/>
      <path d="M2 16h22l-2.1 20a5 5 0 0 1-5 4.4H9.1a5 5 0 0 1-5-4.4L2 16Z" fill="${color || '#B4763C'}"/>
      <circle cx="9" cy="33" r="2.6" fill="#2A1017"/><circle cx="17" cy="35" r="2.6" fill="#2A1017"/>
      <rect x="-2" y="1" width="30" height="6" rx="3" fill="#C7C7CD"/>
      <rect x="18" y="-11" width="4.4" height="16" rx="2.2" fill="${CAP}" transform="rotate(12 18 -11)"/>
    </g>`;
  }

  /* ---------- pose: bust, for the floating corner helper ---------- */
  function bust(o) {
    o = o || {};
    return `<svg viewBox="0 0 120 132" class="kora-char">
      <ellipse class="c-shadow" cx="60" cy="126" rx="30" ry="5" fill="rgba(38,22,28,.16)"/>
      <g class="c-body">
        <!-- torso -->
        <path d="M34 132v-24a26 26 0 0 1 52 0v24z" fill="${SHIRT}"/>
        <path d="M46 132v-26a14 14 0 0 1 28 0v26z" fill="${APRON}"/>
        <path d="M46 116h28v3H46z" fill="${APRON_SH}"/>
        <path d="M52 106l8-8 8 8" fill="none" stroke="${APRON_SH}" stroke-width="2.4"/>
        <!-- arms -->
        <path d="M34 116q-10 4-11 16" fill="none" stroke="${SHIRT_DARK}" stroke-width="10" stroke-linecap="round"/>
        <path class="c-arm" d="M86 116q12 2 14 12" fill="none" stroke="${SHIRT_DARK}" stroke-width="10" stroke-linecap="round"/>
        <circle cx="100" cy="128" r="6" fill="${SKIN}"/>
        <g class="c-head">${face(o)}</g>
      </g>
    </svg>`;
  }

  /* ---------- pose: full body behind the counter ---------- */
  function chef(o) {
    o = o || {};
    return `<svg viewBox="0 0 120 150" class="kora-char">
      <g class="c-body">
        <path d="M30 150v-38a30 30 0 0 1 60 0v38z" fill="${SHIRT}"/>
        <path d="M44 150v-40a16 16 0 0 1 32 0v40z" fill="${APRON}"/>
        <path d="M44 128h32v3.4H44z" fill="${APRON_SH}"/>
        <circle cx="60" cy="118" r="5" fill="${APRON_SH}"/>
        <!-- left arm resting on the counter -->
        <path d="M30 122q-13 6-14 22" fill="none" stroke="${SHIRT_DARK}" stroke-width="11" stroke-linecap="round"/>
        <circle cx="16" cy="146" r="6.4" fill="${SKIN}"/>
        <!-- right arm raised, holding a cup -->
        <path class="c-arm" d="M90 122q14-2 18-16" fill="none" stroke="${SHIRT_DARK}" stroke-width="11" stroke-linecap="round"/>
        ${heldCup(96, 84, .82)}
        <g class="c-head">${face(o)}</g>
      </g>
    </svg>`;
  }

  /* ---------- pose: lying back, catching the pour ---------- */
  function catcher() {
    return `<svg viewBox="0 0 300 150" class="kora-char">
      <ellipse cx="150" cy="142" rx="86" ry="7" fill="rgba(38,22,28,.13)"/>
      <g class="c-body">
        <!-- legs, knees up -->
        <path d="M196 120 L232 92 L258 126" fill="none" stroke="${SHIRT}" stroke-width="17"
              stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M192 132 L222 108 L246 136" fill="none" stroke="${SHIRT_DARK}" stroke-width="16"
              stroke-linecap="round" stroke-linejoin="round"/>
        <!-- torso lying back -->
        <path d="M150 118q28 2 48 10l-4 16q-24-8-46-8z" fill="${SHIRT}"/>
        <path d="M150 116q22 2 38 8l-3 12q-20-7-36-7z" fill="${APRON}"/>
        <!-- arm propping up behind -->
        <path d="M126 122q-22 8-26 24" fill="none" stroke="${SHIRT_DARK}" stroke-width="12" stroke-linecap="round"/>
        <circle cx="99" cy="144" r="7" fill="${SKIN}"/>
        <!-- arm reaching up toward the stream -->
        <path class="c-arm" d="M168 108q10-22 26-30" fill="none" stroke="${SHIRT_DARK}" stroke-width="12" stroke-linecap="round"/>
        <circle cx="196" cy="76" r="7.4" fill="${SKIN}"/>
        <!-- head, tilted back, mouth open at the top -->
        <g transform="translate(90,44) rotate(-8 60 52)">
          <ellipse cx="36" cy="54" rx="4.6" ry="6" fill="${SKIN_SH}"/>
          <ellipse cx="84" cy="54" rx="4.6" ry="6" fill="${SKIN_SH}"/>
          <rect x="30" y="24" width="60" height="56" rx="26" fill="${SKIN}"/>
          <path d="M32 42q4-16 28-16t28 16q-6-6-28-6t-28 6z" fill="${HAIR}"/>
          <path d="M30 40a30 26 0 0 1 60 0q-30-9-60 0z" fill="${CAP}"/>
          <path d="M30 40q30-9 60 0l2 6q-32-8-64 0z" fill="${CAP_DARK}"/>
          <circle cx="60" cy="33" r="5.5" fill="#fff" opacity=".9"/>
          <circle cx="60" cy="33" r="2.4" fill="${CAP}"/>
          <path d="M42 52q6-7 12 0" fill="none" stroke="${EYE}" stroke-width="3.4" stroke-linecap="round"/>
          <path d="M66 52q6-7 12 0" fill="none" stroke="${EYE}" stroke-width="3.4" stroke-linecap="round"/>
          <circle cx="41" cy="64" r="5" fill="${BLUSH}" opacity=".55"/>
          <circle cx="79" cy="64" r="5" fill="${BLUSH}" opacity=".55"/>
          <ellipse class="c-gulp" cx="60" cy="66" rx="11" ry="9" fill="${EYE}"/>
          <ellipse class="c-gulp" cx="60" cy="69" rx="6" ry="4" fill="#F27E9B"/>
        </g>
      </g>
    </svg>`;
  }

  global.KoraChar = { bust, chef, catcher, face, heldCup, colors: { SKIN, CAP, SHIRT, APRON, EYE } };
})(window);
