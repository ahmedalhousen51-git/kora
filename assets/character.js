/* ==========================================================================
   Kora — the mascot
   Single-weight line art, no fills, in the style of hand-painted café
   A-frames: one confident stroke, round caps, a loose hand-drawn wobble.

   Everything strokes with `currentColor`, so the same drawing reads cream on
   the burgundy header, ink on a light card, and cream again in the dark
   kitchen — the container sets the colour, the character never hard-codes it.

   The coordinate system is fixed by animations that live outside this file:
     - eyes sit at y=51 centred on x=60   (ui.js blink, transform-origin 60 51)
     - the head pivots around (60, 80)    (ui.js head tilt)
     - the bust's waving arm hinges at (86, 101)
   Move those and the mascot animations go crooked.
   ========================================================================== */
(function (global) {
  'use strict';

  /* One stroke weight for the whole character — that single weight is what
     makes signage line art read as signage. */
  const W = 2.6, WT = 2.1;
  const S = `fill="none" stroke="currentColor" stroke-width="${W}" stroke-linecap="round" stroke-linejoin="round"`;
  const ST = `fill="none" stroke="currentColor" stroke-width="${WT}" stroke-linecap="round" stroke-linejoin="round"`;
  const FILL = `fill="currentColor" stroke="none"`;

  /* ---------- the head ----------
     Returned as loose SVG nodes so it can be dropped straight into .c-head. */
  function face(o) {
    o = o || {};
    const look = o.look || 0;

    const mouths = {
      smile: `<path d="M53 63q7 6.5 14 -.5" ${S}/>`,
      flat:  `<path d="M54 65q6 1.5 12 0" ${S}/>`,
      grin:  `<path d="M51 61q9 12 18 0" ${S}/>
              <path d="M54 64q6 2 12 0" ${ST}/>`,
      oh:    `<ellipse cx="60" cy="65" rx="5" ry="6.2" ${S}/>`,
      gulp:  `<ellipse class="c-gulp" cx="60" cy="66" rx="10" ry="8.4" ${S}/>`
    };

    /* Dots by default; the pleased face closes them into happy arcs, the way
       the sign characters grin. */
    const eyes = o.eyes === 'happy'
      ? `<path d="M42 53q6-7 12 0" ${S}/>
         <path d="M66 53q6-7 12 0" ${S}/>`
      : `<circle cx="${48 + look}" cy="51" r="3.1" ${FILL}/>
         <circle cx="${72 + look}" cy="51" r="3.1" ${FILL}/>`;

    return `
      <!-- head: an egg, drawn slightly off-round so it looks hand-made -->
      <path d="M60 19c-13.5 0-24 10.5-24 25.5 0 10 3.8 19 10.8 25.2 4 3.6 8.4 5.8 13.2 5.8
               s9.2-2.2 13.2-5.8C80.2 63.5 84 54.5 84 44.5 84 29.5 73.5 19 60 19z" ${S}/>

      <!-- hair: a few strokes, not a shape -->
      <path d="M39 39c3.5-9.5 11-15 21-15s17.5 5.5 21 15" ${S}/>
      <path d="M50 24q-2.5-5-1-8.5" ${ST}/>
      <path d="M70 24.5q3-4.5 2-8" ${ST}/>

      <!-- headphones, the one thing he is never without -->
      <path d="M34 50C32.5 30 44 18.5 60 18.5S87.5 30 86 50" ${S}/>
      <ellipse cx="33" cy="56" rx="7" ry="9" ${S}/>
      <ellipse cx="87" cy="56" rx="7" ry="9" ${S}/>

      <path d="M42 41.5q6-3.5 12-1" ${ST}/>
      <path d="M78 41.5q-6-3.5-12-1" ${ST}/>

      <g class="c-eyes">${eyes}</g>
      <g class="c-mouth">${mouths[o.mouth] || mouths.smile}</g>`;
  }

  /* A takeaway cup, outline only — the prop from the sidewalk signs. */
  function heldCup(x, y, s) {
    return `<g transform="translate(${x},${y}) scale(${s || 1})">
      <path d="M3 8h24l-3 32a5 5 0 0 1-5 4.5h-8A5 5 0 0 1 6 40L3 8z" ${S}/>
      <path d="M0 3.5h30v5H0z" ${S}/>
      <path d="M19 3.5 21 -8" ${ST}/>
    </g>`;
  }

  /* ---------- pose: bust, for the floating corner helper ---------- */
  function bust(o) {
    o = o || {};
    return `<svg viewBox="0 0 120 132" class="kora-char">
      <g class="c-body">
        <!-- neck -->
        <path d="M52 74v9" ${S}/><path d="M68 74v9" ${S}/>
        <!-- tee: one silhouette, sleeves included -->
        <path d="M52 83c-9 2-15.5 8-18.5 17.5L30 113l8.5 3 3.5-9.5V132" ${S}/>
        <path d="M68 83c9 2 15.5 8 18.5 17.5L90 113l-8.5 3-3.5-9.5V132" ${S}/>
        <path d="M52 83q8 5 16 0" ${S}/>
        <!-- apron string, the only thing that says he works here -->
        <path d="M46 106q14 5 28 0" ${ST}/>
        <!-- arms, ending in a small mitt rather than a loose circle -->
        <path d="M34 101c-6.5 4.5-10 11.5-10 20" ${S}/>
        <path d="M24 121q-4 3-3 7t5 3 4-4" ${S}/>
        <g class="c-arm">
          <path d="M86 101c7 3.5 11 10 12 18.5" ${S}/>
          <path d="M98 120q4 3 3.5 7t-5 3-4-4" ${S}/>
        </g>
        <g class="c-head">${face(o)}</g>
      </g>
    </svg>`;
  }

  /* ---------- pose: behind the counter, cup held up ---------- */
  function chef(o) {
    o = o || {};
    return `<svg viewBox="0 0 120 150" class="kora-char">
      <g class="c-body">
        <path d="M52 74v9" ${S}/><path d="M68 74v9" ${S}/>
        <path d="M52 83c-10 2.5-17 9-20 19.5L29 150" ${S}/>
        <path d="M68 83c10 2.5 17 9 20 19.5L91 150" ${S}/>
        <path d="M52 83q8 5 16 0" ${S}/>
        <!-- apron: bib, neck strap, waist tie, hem that follows the body -->
        <path d="M49 100v34q0 9 11 9t11-9v-34" ${S}/>
        <path d="M53 100q7 4 14 0" ${ST}/>
        <path d="M53 100 56 88" ${ST}/><path d="M67 100 64 88" ${ST}/>
        <path d="M47 112q13 5 26 0" ${ST}/>
        <!-- left arm resting on the counter -->
        <path d="M32 104c-8 5-12 13-12 23" ${S}/>
        <path d="M20 127q-4.5 3-4 7.5t5.5 3.5 4-4.5" ${S}/>
        <!-- right arm up, holding the cup overhead like the sign -->
        <g class="c-arm">
          <path d="M88 104c8-3 12-11 12-21" ${S}/>
          ${heldCup(88, 56, .8)}
        </g>
        <g class="c-head" transform="translate(10.8,14) scale(.82)">${face(o)}</g>
      </g>
    </svg>`;
  }

  /* ---------- pose: lying back, catching the pour ---------- */
  function catcher() {
    return `<svg viewBox="0 0 300 150" class="kora-char">
      <g class="c-body">
        <!-- the ground he is sitting on -->
        <path d="M104 145h160" ${ST}/>

        <!-- back leg, then the front one crossed over it -->
        <path d="M194 138 232 106" ${S}/>
        <path d="M232 106 252 140" ${S}/>
        <path d="M252 140q7 4 12 2.5t3-6" ${S}/>
        <path d="M188 143 218 116" ${S}/>
        <path d="M218 116 236 144" ${S}/>

        <!-- torso: a full shirt, wide enough to read as a body -->
        <path d="M156 94q24 3 41 15 8 6 10 15l-4 20q-22-14-49-16" ${S}/>
        <path d="M199 144q-24-12-46-14" ${S}/>
        <!-- apron, still on -->
        <path d="M170 104 163 128" ${ST}/>
        <path d="M188 114 181 137" ${ST}/>

        <!-- arm propping him up behind -->
        <path d="M152 108q-21 11-27 27" ${S}/>
        <path d="M125 135q-5 3-4.5 7.5t5.5 3 3.5-4" ${S}/>

        <!-- arm reaching up toward the stream -->
        <g class="c-arm">
          <path d="M180 96q9-19 22-28" ${S}/>
          <path d="M202 68q4-3 3.5-7t-5-2.5-3 4" ${S}/>
        </g>

        <!-- head tipped back, mouth open under the pour -->
        <g transform="translate(88,30) rotate(-16 60 60)">
          ${face({ mouth: 'gulp', eyes: 'happy' })}
        </g>
      </g>
    </svg>`;
  }

  global.KoraChar = {
    bust, chef, catcher, face, heldCup,
    /* the drawing is monochrome now — the container picks the colour */
    colors: { INK: 'currentColor', stroke: W }
  };
})(window);
