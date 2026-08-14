/* ==========================================================================
   Kora — the mascot
   Anime-styled boy: messy black hair, blue over-ear headphones, blue hoodie
   over a black tee. Drawn in a few poses so the same face shows up in the
   corner helper, behind the kitchen counter, and lying under the pour on the
   landing page.

   The coordinate system is fixed by animations that live outside this file:
     - eyes sit at y=51 centred on x=60   (ui.js blink, transform-origin 60 51)
     - the head pivots around (60, 80)    (ui.js head tilt)
     - the bust's waving arm hinges at (86, 116)
   Move those and the mascot animations go crooked.
   ========================================================================== */
(function (global) {
  'use strict';

  const SKIN = '#F2CFA6', SKIN_SH = '#DFB183';
  const HAIR = '#161B24', HAIR_HI = '#26303F';
  const HOOD = '#2B4A7D', HOOD_LT = '#33568F', HOOD_DK = '#1F3760';
  const TEE = '#15181C';
  const CAN = '#1A2330', CAN_PAD = '#2B3646', CAN_BLUE = '#2F7FE4';
  const EYE = '#161A21', BLUSH = '#E98CA8';
  const WINE = '#7B1E3E';
  const APRON = '#F4EFE7', APRON_SH = '#E2D9CC';
  const STRING = '#D9DEE6', AGLET = '#38414C';

  /* ---------- the head, headphones and all ----------
     Returned as loose SVG nodes so it can be dropped straight into .c-head. */
  function face(o) {
    o = o || {};
    const look = o.look || 0;

    const mouths = {
      smile: `<path d="M53 69q7 6 14 -1" fill="none" stroke="${EYE}" stroke-width="2.8" stroke-linecap="round"/>`,
      flat:  `<path d="M54 71h12" fill="none" stroke="${EYE}" stroke-width="2.8" stroke-linecap="round"/>`,
      grin:  `<path d="M51 67q9 13 18 0z" fill="#2A1B20"/>
              <path d="M54.5 69.5q5.5 3 11 0" fill="#C4566E"/>`,
      oh:    `<ellipse cx="60" cy="70" rx="5.2" ry="6.6" fill="#2A1B20"/>`,
      gulp:  `<ellipse class="c-gulp" cx="60" cy="70" rx="11" ry="9" fill="#2A1B20"/>
              <ellipse class="c-gulp" cx="60" cy="73" rx="6" ry="4" fill="#C4566E"/>`
    };

    /* Big almond eyes. 'happy' closes them into arcs for the pleased face. */
    const eyes = o.eyes === 'happy'
      ? `<path d="M40 53q8-9 16 0" fill="none" stroke="${EYE}" stroke-width="3.4" stroke-linecap="round"/>
         <path d="M64 53q8-9 16 0" fill="none" stroke="${EYE}" stroke-width="3.4" stroke-linecap="round"/>`
      : `<path d="M39.5 49.5q8.5-7.5 17 0 -.5 9-8.5 9.5 -8-.5-8.5-9.5z" fill="#fff"/>
         <path d="M63.5 49.5q8.5-7.5 17 0 -.5 9-8.5 9.5 -8-.5-8.5-9.5z" fill="#fff"/>
         <ellipse cx="${48 + look}" cy="51.6" rx="5" ry="6.6" fill="${EYE}"/>
         <ellipse cx="${72 + look}" cy="51.6" rx="5" ry="6.6" fill="${EYE}"/>
         <ellipse cx="${46.2 + look}" cy="48.6" rx="1.6" ry="2" fill="#fff"/>
         <ellipse cx="${70.2 + look}" cy="48.6" rx="1.6" ry="2" fill="#fff"/>
         <path d="M39 49.2q8.5-8 17 .3" fill="none" stroke="${EYE}" stroke-width="3" stroke-linecap="round"/>
         <path d="M63 49.5q8.5-8.3 17-.3" fill="none" stroke="${EYE}" stroke-width="3" stroke-linecap="round"/>`;

    return `
      <!-- Hair is one solid mass with the flicks built into its outline; the
           face is painted on top of it, so the mass only has to be right
           around the edges. Crescent-shaped hair paths render as slivers. -->
      <path fill="${HAIR}" d="M26 70C21 55 21 40 27 31C22 27 18 23 15 18C21 21 26 24 30 26
        C34 17 42 11 51 9C48 6 46 4 44 2C50 5 55 8 58 11C63 6 70 5 76 8C76 5 77 3 79 2
        C80 6 81 10 81 13C88 17 93 24 95 32C99 29 103 27 107 25C104 30 100 35 97 39
        C101 50 100 60 96 70C84 78 72 80 60 80C48 80 36 78 26 70Z"/>

      <!-- headphone band, arcing from cup to cup over the hair -->
      <path d="M27 58C24 22 40 10 60 10s36 12 33 48" fill="none" stroke="${CAN}"
            stroke-width="7" stroke-linecap="round"/>
      <path d="M27 58C24 22 40 10 60 10s36 12 33 48" fill="none" stroke="${CAN_BLUE}"
            stroke-width="1.8" stroke-linecap="round" opacity=".85"/>

      <!-- face -->
      <path fill="${SKIN}" d="M32 46C32 24 44 19 60 19s28 5 28 27c0 16-5 28-13 34-5 4-10 6-15 6
        s-10-2-15-6c-8-6-13-18-13-34z"/>
      <path fill="${SKIN_SH}" opacity=".35" d="M32 46C32 24 44 19 60 19s28 5 28 27
        c0-13-12-19-28-19s-28 6-28 19z"/>

      <!-- fringe: solid mass with a pointed bottom edge -->
      <path fill="${HAIR}" d="M30 35C31 23 44 17 60 17c17 0 29 6 30 17l-5 8-6-12-8 18-7-17
        -9 14-6-15-8 9-5-11z"/>
      <!-- strands falling in front of the ears -->
      <path fill="${HAIR}" d="M32 31c-2 12-2 22 1 30l6-4c-3-10-3-18-1-25z"/>
      <path fill="${HAIR}" d="M88 31c2 12 2 22-1 30l-6-4c3-10 3-18 1-25z"/>
      <path d="M44 24q11-4 22-2" fill="none" stroke="${HAIR_HI}" stroke-width="2"
            stroke-linecap="round" opacity=".75"/>

      <!-- sharp brows: the whole deadpan look lives here -->
      <path d="M39 42.5q9-4 17 1.5" fill="none" stroke="${HAIR}" stroke-width="3.2" stroke-linecap="round"/>
      <path d="M81 42.5q-9-4-17 1.5" fill="none" stroke="${HAIR}" stroke-width="3.2" stroke-linecap="round"/>

      <g class="c-eyes">${eyes}</g>

      <path d="M60 60q3 2.4-1 3.4" fill="none" stroke="${SKIN_SH}" stroke-width="2" stroke-linecap="round"/>
      <ellipse class="c-blush" cx="41" cy="64" rx="4.4" ry="2.8" fill="${BLUSH}" opacity=".34"/>
      <ellipse class="c-blush" cx="79" cy="64" rx="4.4" ry="2.8" fill="${BLUSH}" opacity=".34"/>

      <g class="c-mouth">${mouths[o.mouth] || mouths.smile}</g>

      <!-- ear cups, over everything -->
      <g>
        <ellipse cx="27" cy="58" rx="10.5" ry="12" fill="${CAN}"/>
        <ellipse cx="27" cy="58" rx="7.6" ry="8.8" fill="none" stroke="${CAN_BLUE}" stroke-width="2.6"/>
        <ellipse cx="27" cy="58" rx="5" ry="6" fill="${CAN_PAD}"/>
      </g>
      <g>
        <ellipse cx="93" cy="58" rx="9.4" ry="11.4" fill="${CAN}"/>
        <ellipse cx="93" cy="58" rx="6.6" ry="8.4" fill="none" stroke="${CAN_BLUE}" stroke-width="2.4"/>
        <ellipse cx="93" cy="58" rx="4.4" ry="5.8" fill="${CAN_PAD}"/>
      </g>`;
  }

  /* A small boba cup the character can hold. */
  function heldCup(x, y, s, color) {
    return `<g transform="translate(${x},${y}) scale(${s || 1})">
      <path d="M0 6h26l-2.6 30a5 5 0 0 1-5 4.4H7.6a5 5 0 0 1-5-4.4L0 6Z" fill="#EFEFF2"/>
      <path d="M2 16h22l-2.1 20a5 5 0 0 1-5 4.4H9.1a5 5 0 0 1-5-4.4L2 16Z" fill="${color || '#B4763C'}"/>
      <circle cx="9" cy="33" r="2.6" fill="#2A1017"/><circle cx="17" cy="35" r="2.6" fill="#2A1017"/>
      <rect x="-2" y="1" width="30" height="6" rx="3" fill="#C7C7CD"/>
      <rect x="18" y="-11" width="4.4" height="16" rx="2.2" fill="${WINE}" transform="rotate(12 18 -11)"/>
    </g>`;
  }

  /* The hoodie, shared by the standing poses. `h` is the bottom edge. */
  function hoodie(h) {
    return `
      <!-- hood bunched behind the neck -->
      <path d="M38 ${h - 26}q-3-19 22-21 25 2 22 21-10-9-22-9t-22 9z" fill="${HOOD_DK}"/>
      <!-- neck -->
      <path d="M53 76h14v13q-7 6-14 0z" fill="${SKIN_SH}"/>
      <!-- body -->
      <path d="M26 ${h}q0-30 16-38 18-8 36 0 16 8 16 38z" fill="${HOOD}"/>
      <!-- black tee in the opening -->
      <path d="M50 ${h - 36}q10 8 20 0l-2 36h-16z" fill="${TEE}"/>
      <!-- front panels closing over the tee -->
      <path d="M26 ${h}q0-30 16-38l12 8q-8 12-8 30z" fill="${HOOD_LT}"/>
      <path d="M94 ${h}q0-30-16-38l-12 8q8 12 8 30z" fill="${HOOD_LT}"/>
      <!-- zip and drawstrings -->
      <path d="M60 ${h - 30}v${h - (h - 30) - 2}" stroke="${AGLET}" stroke-width="1.6" opacity=".7"/>
      <path d="M53 ${h - 32}q-3 12 0 20" fill="none" stroke="${STRING}" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M67 ${h - 32}q3 12 0 20" fill="none" stroke="${STRING}" stroke-width="2.4" stroke-linecap="round"/>
      <circle cx="53" cy="${h - 10}" r="2.2" fill="${AGLET}"/>
      <circle cx="67" cy="${h - 10}" r="2.2" fill="${AGLET}"/>`;
  }

  /* ---------- pose: bust, for the floating corner helper ---------- */
  function bust(o) {
    o = o || {};
    return `<svg viewBox="0 0 120 132" class="kora-char">
      <ellipse class="c-shadow" cx="60" cy="126" rx="30" ry="5" fill="rgba(20,24,32,.16)"/>
      <g class="c-body">
        ${hoodie(132)}
        <!-- arms -->
        <path d="M34 116q-10 4-11 16" fill="none" stroke="${HOOD_DK}" stroke-width="10" stroke-linecap="round"/>
        <path class="c-arm" d="M86 116q12 2 14 12" fill="none" stroke="${HOOD_DK}" stroke-width="10" stroke-linecap="round"/>
        <circle cx="100" cy="128" r="6" fill="${SKIN}"/>
        <g class="c-head">${face(o)}</g>
      </g>
    </svg>`;
  }

  /* ---------- pose: full body behind the counter ----------
     Same guy, apron on, so he still reads as staff in the kitchen scene. */
  function chef(o) {
    o = o || {};
    return `<svg viewBox="0 0 120 150" class="kora-char">
      <g class="c-body">
        ${hoodie(150)}
        <!-- apron over the hoodie -->
        <path d="M49 150v-30a11 11 0 0 1 22 0v30z" fill="${APRON}"/>
        <path d="M49 138h22v3H49z" fill="${APRON_SH}"/>
        <circle cx="60" cy="128" r="3.6" fill="${APRON_SH}"/>
        <!-- left arm resting on the counter -->
        <path d="M30 122q-13 6-14 22" fill="none" stroke="${HOOD_DK}" stroke-width="11" stroke-linecap="round"/>
        <circle cx="16" cy="146" r="6.4" fill="${SKIN}"/>
        <!-- right arm raised, holding a cup -->
        <path class="c-arm" d="M90 122q14-2 18-16" fill="none" stroke="${HOOD_DK}" stroke-width="11" stroke-linecap="round"/>
        ${heldCup(96, 84, .82)}
        <g class="c-head">${face(o)}</g>
      </g>
    </svg>`;
  }

  /* ---------- pose: lying back, catching the pour ---------- */
  function catcher() {
    return `<svg viewBox="0 0 300 150" class="kora-char">
      <ellipse cx="150" cy="142" rx="86" ry="7" fill="rgba(20,24,32,.13)"/>
      <g class="c-body">
        <!-- legs, knees up -->
        <path d="M196 120 L232 92 L258 126" fill="none" stroke="${HOOD}" stroke-width="17"
              stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M192 132 L222 108 L246 136" fill="none" stroke="${HOOD_DK}" stroke-width="16"
              stroke-linecap="round" stroke-linejoin="round"/>
        <!-- torso lying back -->
        <path d="M150 118q28 2 48 10l-4 16q-24-8-46-8z" fill="${HOOD}"/>
        <path d="M150 116q22 2 38 8l-3 12q-20-7-36-7z" fill="${HOOD_LT}"/>
        <path d="M158 118q14 1 26 5l-2 8q-13-4-25-4z" fill="${TEE}" opacity=".9"/>
        <!-- arm propping up behind -->
        <path d="M126 122q-22 8-26 24" fill="none" stroke="${HOOD_DK}" stroke-width="12" stroke-linecap="round"/>
        <circle cx="99" cy="144" r="7" fill="${SKIN}"/>
        <!-- arm reaching up toward the stream -->
        <path class="c-arm" d="M168 108q10-22 26-30" fill="none" stroke="${HOOD_DK}" stroke-width="12" stroke-linecap="round"/>
        <circle cx="196" cy="76" r="7.4" fill="${SKIN}"/>
        <!-- head tilted back, mouth open under the pour -->
        <g transform="translate(90,42) rotate(-8 60 52)">
          ${face({ mouth: 'gulp', eyes: 'happy' })}
        </g>
      </g>
    </svg>`;
  }

  global.KoraChar = {
    bust, chef, catcher, face, heldCup,
    colors: { SKIN, HAIR, HOOD, HOOD_DK, TEE, CAN_BLUE, EYE, APRON, WINE,
              /* old names kept so nothing that read them breaks */
              CAP: HOOD, SHIRT: HOOD }
  };
})(window);
