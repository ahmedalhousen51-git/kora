/* ==========================================================================
   Kora — 3D helpers
   Builds the CSS-3D cup and wires up parallax / card tilting.
   ========================================================================== */
(function (global) {
  'use strict';

  const reduced = () =>
    global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -------------------------------------------------------------- cup ---- */
  /**
   * A boba cup rendered as a shaded 3D cylinder.
   * opts: { w, h, liquid, fill (0-1), ice (0-1), pearls (n), sealed }
   */
  function cup(opts) {
    const o = opts || {};
    const w = o.w || 130, h = o.h || 176;
    const liquid = o.liquid || '#B4763C';

    let ice = '';
    const iceN = Math.round((o.ice || 0) * 7);
    for (let i = 0; i < iceN; i++) {
      ice += `<i style="left:${(i % 4) * 26}%;top:calc(var(--ice-sz) * 1.32 * ${Math.floor(i / 4)});
              transform:rotate(${(i * 41) % 44 - 22}deg)"></i>`;
    }
    let pearls = '';
    for (let i = 0; i < (o.pearls || 0); i++) {
      const row = Math.floor(i / 4);
      pearls += `<i style="left:${10 + (i % 4) * 22 + (row % 2 ? 8 : 0)}%;bottom:calc(3px + var(--pearl-sz) * .9 * ${row})"></i>`;
    }

    // --level is where the surface actually is, whether the drink was set with
    // a single fill or with stacked layers; the ice floats there.
    const level = o.layers ? o.layers.reduce((t, L) => t + (L.amount || 0), 0) : (o.fill || 0);

    return `<div class="cup3d${o.sealed ? ' sealed' : ''}"
      style="--cw:${w}px;--ch:${h}px;--liquid:${liquid};--fill:${Math.round((o.fill || 0) * 100)}%;--level:${Math.round(level * 100)}%">
      <div class="cup-shadow"></div>
      <div class="cup-rim-back"></div>
      <div class="cup-wall">
        <div class="cup-layers"></div>
        <div class="cup-liquid"></div>
        <div class="cup-pearls">${pearls}</div>
        <div class="cup-ice">${ice}</div>
      </div>
      <div class="cup-rim"></div>
      <div class="cup-lid"></div>
      <div class="cup-straw"></div>
    </div>`;
  }

  /** Update a rendered cup without rebuilding it. */
  function setCup(el, o) {
    if (!el) return;
    if (o.fill !== undefined) {
      el.style.setProperty('--fill', Math.round(o.fill * 100) + '%');
      el.style.setProperty('--level', Math.round(o.fill * 100) + '%');
    }
    if (o.layers) {
      const lv = o.layers.reduce((t, L) => t + (L.amount || 0), 0);
      el.style.setProperty('--level', Math.round(Math.min(1, lv) * 100) + '%');
    }
    if (o.liquid) el.style.setProperty('--liquid', o.liquid);
    if (o.sealed !== undefined) el.classList.toggle('sealed', !!o.sealed);

    if (o.ice !== undefined) {
      const box = el.querySelector('.cup-ice');
      let html = '';
      for (let i = 0; i < Math.round(o.ice * 7); i++) {
        html += `<i style="left:${(i % 4) * 26}%;top:calc(var(--ice-sz) * 1.32 * ${Math.floor(i / 4)});
                 transform:rotate(${(i * 41) % 44 - 22}deg)"></i>`;
      }
      box.innerHTML = html;
    }
    if (o.pearls !== undefined) {
      const box = el.querySelector('.cup-pearls');
      let html = '';
      for (let i = 0; i < o.pearls; i++) {
        const row = Math.floor(i / 4);
        html += `<i style="left:${10 + (i % 4) * 22 + (row % 2 ? 8 : 0)}%;bottom:calc(3px + var(--pearl-sz) * .9 * ${row})"></i>`;
      }
      box.innerHTML = html;
    }
    // Stacked drink layers (syrup at the bottom, then tea, then creamer).
    // Each one is its own band sitting on the one below — an empty layer must
    // not paint over the drink underneath it.
    if (o.layers) {
      const box = el.querySelector('.cup-layers');
      let base = 0, html = '';
      o.layers.forEach(L => {
        const amt = Math.max(0, Math.min(1, L.amount));
        if (amt > 0.002) {
          html += `<div class="cup-layer" style="bottom:${(base * 100).toFixed(1)}%;
                   height:${(amt * 100).toFixed(1)}%;
                   background:linear-gradient(90deg,rgba(0,0,0,.26),rgba(255,255,255,.2) 34%,
                   rgba(255,255,255,.08) 62%,rgba(0,0,0,.24)),${L.color}"></div>`;
        }
        base = Math.min(1, base + amt);
      });
      box.innerHTML = html;
      el.style.setProperty('--fill', '0%');   // layers replace the plain fill
    }
  }

  /* --------------------------------------------------------- parallax ---- */
  /** The scene leans toward wherever the pointer is. */
  function parallax(sceneEl, opts) {
    if (!sceneEl || reduced()) return;
    const o = opts || {};
    const maxX = o.maxX || 7, maxY = o.maxY || 9;
    const inner = sceneEl.querySelector('.scene3d-inner') || sceneEl.firstElementChild;
    if (!inner) return;

    let raf = 0, tx = 0, ty = 0;
    const apply = () => {
      raf = 0;
      inner.style.transform = `rotateX(${ty.toFixed(2)}deg) rotateY(${tx.toFixed(2)}deg)`;
    };
    const onMove = e => {
      const r = sceneEl.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - .5;
      const py = (e.clientY - r.top) / r.height - .5;
      tx = px * maxX * 2;
      ty = -py * maxY * 2;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const reset = () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(apply); };

    sceneEl.addEventListener('pointermove', onMove);
    sceneEl.addEventListener('pointerleave', reset);

    // phones: lean with the device instead
    if (global.DeviceOrientationEvent && 'ontouchstart' in global) {
      global.addEventListener('deviceorientation', ev => {
        if (ev.gamma == null) return;
        tx = Math.max(-maxX, Math.min(maxX, ev.gamma / 4));
        ty = Math.max(-maxY, Math.min(maxY, -(ev.beta - 45) / 5));
        if (!raf) raf = requestAnimationFrame(apply);
      });
    }
  }

  /* ------------------------------------------------------ card tilting --- */
  /** Cards lift and turn toward the cursor. */
  function tiltCards(root, selector) {
    if (reduced()) return;
    const scope = root || document;
    scope.querySelectorAll(selector || '.tilt3d').forEach(card => {
      if (card.__tilted) return;
      card.__tilted = true;
      card.style.transformStyle = 'preserve-3d';
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - .5;
        const py = (e.clientY - r.top) / r.height - .5;
        card.style.transform =
          `perspective(700px) rotateY(${(px * 13).toFixed(2)}deg) rotateX(${(-py * 13).toFixed(2)}deg) translateZ(10px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  global.Kora3D = { cup, setCup, parallax, tiltCards };
})(window);
