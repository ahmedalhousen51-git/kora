/* ==========================================================================
   Kora — the drink in real 3D (WebGL)

   A genuine three.js cup: glass you can see through, liquid that stacks in
   layers, boba that settles at the bottom, ice that floats. It renders on top
   of the existing scene and is driven by the same state the game already
   tracks — so every mechanic (pouring, shaking, sealing) keeps working exactly
   as before and this is purely what you look at.

   The canvas never takes pointer events: dragging the cup to shake it still
   hits the DOM element underneath. If WebGL or the CDN is unavailable,
   mount() resolves to false and the caller keeps the CSS cup.
   ========================================================================== */
(function (global) {
  'use strict';

  const SRC = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js';
  let THREE = null, ready = null;

  function webglOK() {
    try {
      const c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext &&
        (c.getContext('webgl2') || c.getContext('webgl')));
    } catch (e) { return false; }
  }

  function load() {
    if (ready) return ready;
    if (!webglOK()) { ready = Promise.resolve(null); return ready; }
    ready = import(SRC).then(m => { THREE = m; return m; }).catch(() => null);
    return ready;
  }

  function makeScene(el, opts) {
    const o = opts || {};
    const w = el.clientWidth || 160, h = el.clientHeight || 220;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(w, h, false);
    renderer.domElement.style.cssText =
      'position:absolute;inset:0;width:100%;height:100%;pointer-events:none';
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(32, w / h, 0.1, 100);
    cam.position.set(0, 1.15, 7.2);
    cam.lookAt(0, 0.15, 0);

    // key, fill and a rim light so the plastic reads round
    scene.add(new THREE.AmbientLight(0xffffff, 0.65));
    const key = new THREE.DirectionalLight(0xfff2e0, 1.5);
    key.position.set(3, 5, 4); scene.add(key);
    const rim = new THREE.DirectionalLight(0xbfd6ff, 0.9);
    rim.position.set(-4, 2, -3); scene.add(rim);

    const group = new THREE.Group();
    scene.add(group);

    // ---- the cup: a tapered, translucent shell ----
    const RT = 0.92, RB = 0.66, H = 2.5;
    const cupMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, roughness: 0.18, metalness: 0,
      transparent: true, opacity: 0.3, side: THREE.DoubleSide,
      clearcoat: 1, clearcoatRoughness: 0.1
    });
    const cup = new THREE.Mesh(
      new THREE.CylinderGeometry(RT, RB, H, 48, 1, true), cupMat);
    group.add(cup);

    // the rolled rim
    const rimRing = new THREE.Mesh(
      new THREE.TorusGeometry(RT, 0.055, 12, 48),
      new THREE.MeshPhysicalMaterial({ color: 0xf2f2f4, roughness: 0.35 }));
    rimRing.rotation.x = Math.PI / 2;
    rimRing.position.y = H / 2;
    group.add(rimRing);

    const base = new THREE.Mesh(
      new THREE.CircleGeometry(RB, 40),
      new THREE.MeshStandardMaterial({ color: 0xe8e8ec, roughness: 0.6 }));
    base.rotation.x = -Math.PI / 2;
    base.position.y = -H / 2 + 0.001;
    group.add(base);

    // ---- things that change with the drink ----
    const liquids = new THREE.Group(); group.add(liquids);
    const pearls  = new THREE.Group(); group.add(pearls);
    const ices    = new THREE.Group(); group.add(ices);
    const capG    = new THREE.Group(); group.add(capG);

    const lidMat = new THREE.MeshPhysicalMaterial({ color: 0xf6f6f8, roughness: 0.3, clearcoat: 1 });
    const lid = new THREE.Mesh(new THREE.CylinderGeometry(RT + 0.06, RT + 0.06, 0.16, 40), lidMat);
    lid.position.y = H / 2 + 0.06;
    const dome = new THREE.Mesh(new THREE.SphereGeometry(RT * 0.72, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2), lidMat);
    dome.position.y = H / 2 + 0.13;
    const straw = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.11, 2.1, 16),
      new THREE.MeshStandardMaterial({ color: 0x7b1e3e, roughness: 0.45 }));
    straw.position.set(0.22, H / 2 + 0.75, 0.1);
    straw.rotation.z = -0.16;
    capG.add(lid, dome, straw);
    capG.visible = false;

    // radius of the shell at a given height fraction, so contents never poke out
    const radAt = f => RB + (RT - RB) * f;

    const state = { layers: [], ice: 0, pearls: 0, sealed: false };

    function rebuild() {
      [liquids, pearls, ices].forEach(g => {
        while (g.children.length) {
          const c = g.children.pop();
          c.geometry.dispose(); c.material.dispose(); g.remove(c);
        }
      });

      // stacked layers, each sitting on the one below
      let base_ = 0;
      state.layers.forEach(L => {
        const a = Math.max(0, Math.min(1, L.amount || 0));
        if (a < 0.004) return;
        const y0 = base_, y1 = Math.min(1, base_ + a);
        const hh = (y1 - y0) * H;
        if (hh <= 0) return;
        const m = new THREE.Mesh(
          new THREE.CylinderGeometry(radAt(y1) * 0.965, radAt(y0) * 0.965, hh, 40),
          new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(L.color || '#B4763C'),
            roughness: 0.22, transmission: 0.25, thickness: 0.6,
            transparent: true, opacity: 0.96
          }));
        m.position.y = -H / 2 + y0 * H + hh / 2;
        liquids.add(m);
        base_ = y1;
      });

      // boba settling on the bottom
      const pn = Math.max(0, Math.min(16, Math.round(state.pearls)));
      const pMat = new THREE.MeshStandardMaterial({ color: 0x2c1a13, roughness: 0.35 });
      for (let i = 0; i < pn; i++) {
        const s = new THREE.Mesh(new THREE.SphereGeometry(0.15, 14, 12), pMat.clone());
        const row = Math.floor(i / 5), ang = (i % 5) / 5 * Math.PI * 2 + row * 0.7;
        const rr = radAt(0.06) * (0.3 + 0.42 * ((i % 5) / 4));
        s.position.set(Math.cos(ang) * rr, -H / 2 + 0.17 + row * 0.27, Math.sin(ang) * rr);
        pearls.add(s);
      }

      // ice riding on the surface of whatever is in the cup
      const inN = Math.round(Math.max(0, Math.min(1, state.ice)) * 7);
      const top = Math.max(0.1, base_);
      const iMat = new THREE.MeshPhysicalMaterial({
        color: 0xeaf6ff, roughness: 0.05, transmission: 0.75,
        thickness: 0.4, transparent: true, opacity: 0.75
      });
      for (let i = 0; i < inN; i++) {
        const c = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), iMat.clone());
        const ang = i / inN * Math.PI * 2 + 0.6;
        const rr = radAt(top) * 0.42;
        c.position.set(Math.cos(ang) * rr, -H / 2 + top * H - 0.1 + (i % 2) * 0.2, Math.sin(ang) * rr);
        c.rotation.set(Math.random(), Math.random(), Math.random());
        ices.add(c);
      }

      capG.visible = !!state.sealed;
    }

    // slow idle turn, and a nudge from the pointer if the host asks for it
    let spin = 0, target = 0, raf = 0;
    function tick() {
      spin += (target - spin) * 0.08;
      group.rotation.y = spin + performance.now() * 0.00012;
      renderer.render(scene, cam);
      raf = requestAnimationFrame(tick);
    }
    tick();

    function resize() {
      const W = el.clientWidth || w, Hh = el.clientHeight || h;
      renderer.setSize(W, Hh, false);
      cam.aspect = W / Hh; cam.updateProjectionMatrix();
    }
    const ro = ('ResizeObserver' in window) ? new ResizeObserver(resize) : null;
    if (ro) ro.observe(el);

    rebuild();
    return {
      set(next) { Object.assign(state, next || {}); rebuild(); },
      nudge(v) { target = v || 0; },
      destroy() {
        cancelAnimationFrame(raf);
        if (ro) ro.disconnect();
        renderer.dispose();
        if (renderer.domElement.parentNode) renderer.domElement.remove();
      }
    };
  }

  /** Mount a 3D cup inside `el`. Resolves to an API, or null if unsupported. */
  function mount(el, opts) {
    return load().then(m => (m && el) ? makeScene(el, opts) : null);
  }

  global.KoraGL = { mount, supported: webglOK };
})(window);
