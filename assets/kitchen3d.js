/* ==========================================================================
   Kora — the bar as a real 3D room (three.js)

   Built to the shop's own photos: beige subway tile, a marble worktop, wood
   cabinets, a dark wood shelf overhead, and the actual machines in the places
   they stand — La Cimbali and the grinder on the right, the JTC blender, the
   hotplate and the ice machine on the left run, the 1883/Monin pumps by the
   grinder, matcha tins on the shelf.

   You walk the barista with the arrow keys or by clicking the floor. Reaching
   a station eases the camera in on it and reports which one you are at, so the
   page around it can show that machine's controls.
   ========================================================================== */
(function (global) {
  'use strict';

  const SRC = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js';
  let THREE = null, loading = null;

  function webglOK() {
    try {
      const c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext &&
        (c.getContext('webgl2') || c.getContext('webgl')));
    } catch (e) { return false; }
  }
  function load() {
    if (loading) return loading;
    if (!webglOK()) { loading = Promise.resolve(null); return loading; }
    loading = import(SRC).then(m => (THREE = m)).catch(() => null);
    return loading;
  }

  /* Colours sampled off the photographs. */
  const C = {
    tile:   0xE6E2D8, grout: 0xC9C2B4, wallTop: 0xF3F1EC,
    marble: 0xE4D8B4, marbleEdge: 0xC8B98D,
    wood:   0xA9835A, woodDark: 0x6E4A2C, shelf: 0x7A5231,
    steel:  0xB9BCC0, steelDark: 0x6E7276, black: 0x24262A,
    green:  0x4E7A52, floor: 0xB9AC97
  };

  function build(host, opts) {
    const o = opts || {};
    const W = host.clientWidth || 900, H = host.clientHeight || 560;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(W, H, false);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xEDE9E0);
    scene.fog = new THREE.Fog(0xEDE9E0, 18, 34);

    const cam = new THREE.PerspectiveCamera(46, W / H, 0.1, 100);
    const camLook = new THREE.Vector3(0, 2.9, -3);
    cam.position.set(0, 6.4, 14.5);

    // warm ceiling light plus a soft fill, the way the room actually reads
    scene.add(new THREE.HemisphereLight(0xfff4e2, 0x8a7f6d, 0.85));
    const lamp = new THREE.DirectionalLight(0xfff0d8, 1.25);
    lamp.position.set(4, 9, 6);
    lamp.castShadow = true;
    lamp.shadow.mapSize.set(1024, 1024);
    lamp.shadow.camera.left = -12; lamp.shadow.camera.right = 12;
    lamp.shadow.camera.top = 12; lamp.shadow.camera.bottom = -12;
    scene.add(lamp);
    const bulb = new THREE.PointLight(0xffd9a0, 22, 14, 2);
    bulb.position.set(-4.5, 4.2, 2);
    scene.add(bulb);

    const M = (c, r, m) => new THREE.MeshStandardMaterial({ color: c, roughness: r == null ? .8 : r, metalness: m || 0 });
    const box = (w, h, d, mat) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);

    /* ---------- the room shell ---------- */
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(26, 22), M(C.floor, .95));
    floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true;
    scene.add(floor);

    // a tile texture drawn once on a canvas, then repeated
    function tileTex(rw, rh) {
      const cv = document.createElement('canvas');
      cv.width = 256; cv.height = 128;
      const g = cv.getContext('2d');
      g.fillStyle = '#C9C2B4'; g.fillRect(0, 0, 256, 128);
      g.fillStyle = '#E6E2D8';
      for (let row = 0; row < 2; row++) {
        const off = row % 2 ? -64 : 0;
        for (let i = -1; i < 3; i++) g.fillRect(off + i * 128 + 3, row * 64 + 3, 122, 58);
      }
      const t = new THREE.CanvasTexture(cv);
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(rw, rh);
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    }
    const tiled = new THREE.MeshStandardMaterial({ map: tileTex(7, 4), roughness: .55 });
    const backWall = box(24, 9, .3, tiled);
    backWall.position.set(0, 4.5, -6); backWall.receiveShadow = true;
    scene.add(backWall);
    const sideWall = box(.3, 9, 12, new THREE.MeshStandardMaterial({ map: tileTex(4, 4), roughness: .55 }));
    sideWall.position.set(-11.5, 4.5, 0); sideWall.receiveShadow = true;
    scene.add(sideWall);

    /* ---------- counters ---------- */
    function counterRun(x, z, w, d, rot) {
      const g = new THREE.Group();
      const cab = box(w, 2.6, d, M(C.wood, .85));
      cab.position.y = 1.3; cab.castShadow = cab.receiveShadow = true;
      // door seams
      const n = Math.max(1, Math.round(w / 2));
      for (let i = 0; i < n; i++) {
        const seam = box(.06, 2.2, .04, M(C.woodDark, .9));
        seam.position.set(-w / 2 + (i + 1) * (w / n), 1.3, d / 2 + .01);
        g.add(seam);
      }
      const top = box(w + .3, .22, d + .3, M(C.marble, .5));
      top.position.y = 2.72; top.castShadow = top.receiveShadow = true;
      const edge = box(w + .34, .07, d + .34, M(C.marbleEdge, .6));
      edge.position.y = 2.6;
      g.add(cab, top, edge);
      g.position.set(x, 0, z); g.rotation.y = rot || 0;
      return g;
    }
    scene.add(counterRun(-3.6, -5, 11, 2.2, 0));          // the long back run
    scene.add(counterRun(-10.4, -0.4, 8.4, 2.2, Math.PI / 2)); // the left return
    scene.add(counterRun(7.0, -3.4, 9.2, 2.4, 0));        // the espresso bar

    /* ---------- the shelf overhead ---------- */
    const shelf = box(13, .22, 1, M(C.shelf, .8));
    shelf.position.set(-2.5, 5.4, -5.4); shelf.castShadow = true;
    scene.add(shelf);
    for (let i = 0; i < 9; i++) {                       // matcha tins
      const tin = new THREE.Mesh(new THREE.CylinderGeometry(.22, .22, .62, 20), M(C.green, .6));
      tin.position.set(-7.6 + i * 1.15, 5.85, -5.4); tin.castShadow = true;
      scene.add(tin);
    }

    /* ---------- the machines, where they actually stand ---------- */
    const stations = {};
    function station(id, label, mesh, x, y, z, stand) {
      mesh.position.set(x, y, z);
      mesh.traverse(n => { if (n.isMesh) { n.castShadow = true; n.receiveShadow = true; } });
      scene.add(mesh);
      stations[id] = { id, label, at: new THREE.Vector3(stand[0], 0, stand[1]), obj: mesh };
    }

    // La Cimbali: wide body, three group heads, portafilters
    const cim = new THREE.Group();
    const body = box(4.4, 1.5, 1.5, M(C.steel, .35, .6));
    body.position.y = .75; cim.add(body);
    const badge = box(1.5, .2, .02, M(0xB4232B, .5));
    badge.position.set(0, 1.05, .77); cim.add(badge);
    for (let i = -1; i <= 1; i++) {
      const head = box(.62, .34, .62, M(C.steelDark, .4, .7));
      head.position.set(i * 1.3, .2, .62); cim.add(head);
      const pf = new THREE.Mesh(new THREE.CylinderGeometry(.24, .24, .16, 16), M(C.steelDark, .4, .7));
      pf.position.set(i * 1.3, .02, .62); cim.add(pf);
      const handle = new THREE.Mesh(new THREE.CylinderGeometry(.07, .07, .5, 10), M(C.black, .6));
      handle.rotation.x = Math.PI / 2; handle.position.set(i * 1.3, .02, 1.0); cim.add(handle);
    }
    station('espresso', 'ماكينة الإسبريسو', cim, 5.4, 2.85, -3.9, [5.4, -1.2]);

    // the grinder
    const grp = new THREE.Group();
    const gbody = box(.8, 1.5, .8, M(C.black, .5, .3)); gbody.position.y = .75; grp.add(gbody);
    const hop = new THREE.Mesh(new THREE.CylinderGeometry(.42, .3, .9, 20),
      new THREE.MeshPhysicalMaterial({ color: 0x6b4a2c, transmission: .5, roughness: .2, transparent: true, opacity: .75 }));
    hop.position.y = 1.9; grp.add(hop);
    const scr = box(.42, .22, .03, M(0x2E6F9E, .3)); scr.position.set(0, .95, .42); grp.add(scr);
    station('grinder', 'المطحنة', grp, 8.4, 2.85, -3.9, [8.4, -1.2]);

    // the 1883 / Monin pump rack
    const rack = new THREE.Group();
    const rackBase = box(2.4, .1, .6, M(C.black, .6)); rack.add(rackBase);
    for (let i = 0; i < 6; i++) {
      const b = new THREE.Mesh(new THREE.CylinderGeometry(.13, .13, 1.0, 14),
        new THREE.MeshPhysicalMaterial({ color: [0xD9A6B4, 0x8E2F45, 0x3E5C8A, 0xC2334D, 0xEDE7DC, 0xEDE7DC][i],
          transmission: .35, roughness: .25, transparent: true, opacity: .9 }));
      b.position.set(-1 + i * .4, .55, 0); rack.add(b);
      const pump = box(.08, .5, .08, M(C.black, .5));
      pump.position.set(-1 + i * .4, 1.3, 0); rack.add(pump);
    }
    station('syrup', 'مضخات السيرب', rack, 10.4, 2.85, -3.9, [10.2, -1.2]);

    // the JTC blender and the ice machine on the left run
    const bl = new THREE.Group();
    const blBase = box(.9, .5, .9, M(C.black, .5)); blBase.position.y = .25; bl.add(blBase);
    const dome = new THREE.Mesh(new THREE.SphereGeometry(.55, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshPhysicalMaterial({ color: 0x9aa0a6, transmission: .6, roughness: .15, transparent: true, opacity: .5 }));
    dome.position.y = .5; bl.add(dome);
    station('blender', 'الخلاط', bl, -6.4, 2.85, -5, [-6.4, -2.4]);

    const iceG = new THREE.Group();
    const ice = box(1.5, 1.8, 1.3, M(0xE6E8EA, .6)); ice.position.y = .9; iceG.add(ice);
    const iceLid = box(1.55, .12, 1.35, M(0xB9BCC0, .5)); iceLid.position.y = 1.84; iceG.add(iceLid);
    const iceScr = box(.5, .18, .03, M(0x1b1d20, .4)); iceScr.position.set(0, 1.2, .66); iceG.add(iceScr);
    const iceSlot = box(.7, .28, .06, M(0x2b2e31, .7)); iceSlot.position.set(0, .45, .66); iceG.add(iceSlot);
    station('ice', 'ماكينة التلج', iceG, -8.0, 2.85, -5, [-8.0, -2.4]);

    // the hotplate with its pot — where the tea and the tapioca happen
    const hp = new THREE.Group();
    const plate = box(1.6, .18, 1.0, M(C.black, .5)); hp.add(plate);
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(.45, .42, .55, 22), M(0xC8CBCE, .3, .8));
    pot.position.y = .36; hp.add(pot);
    const potLid = new THREE.Mesh(new THREE.SphereGeometry(.45, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), M(0xC8CBCE, .3, .8));
    potLid.position.y = .62; hp.add(potLid);
    station('brew', 'السخّان والحلة', hp, -0.6, 2.9, -5, [-0.6, -2.4]);

    /* ---------- the barista ---------- */
    const chef = new THREE.Group();
    const skin = M(0xEBC9A4, .8), denim = M(0x2E3D2C, .9);
    const arms = [], legsM = [];
    [-1, 1].forEach(s => {
      const leg = new THREE.Mesh(new THREE.CapsuleGeometry(.16, .9, 6, 12), denim);
      leg.position.set(s * .17, .75, 0); chef.add(leg); legsM.push(leg);
    });
    for (let i = 0; i < 2; i++) {                 // shoes
      const sh = box(.26, .14, .44, M(0x1A1A1A, .8));
      sh.position.set((i ? 1 : -1) * .17, .07, .07); chef.add(sh);
    }
    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(.34, .72, 6, 14), M(0xF3EFE6, .85));
    torso.position.y = 1.86; chef.add(torso);
    const apron = box(.6, .9, .14, denim); apron.position.set(0, 1.7, .3); chef.add(apron);
    [-1, 1].forEach(s => {                        // arms, hanging with a slight swing
      const pivot = new THREE.Group();
      pivot.position.set(s * .42, 2.16, 0); chef.add(pivot); arms.push(pivot);
      const arm = new THREE.Mesh(new THREE.CapsuleGeometry(.11, .62, 6, 12), M(0xF3EFE6, .85));
      arm.position.y = -.36; pivot.add(arm);
      const hand = new THREE.Mesh(new THREE.SphereGeometry(.12, 12, 10), skin);
      hand.position.y = -.76; pivot.add(hand);
    });

    const head = new THREE.Mesh(new THREE.SphereGeometry(.35, 24, 18), skin);
    head.position.y = 2.66; chef.add(head);
    // hair: a cap that stops above the eyes, plus a fringe, so the face reads
    const hair = new THREE.Mesh(
      new THREE.SphereGeometry(.37, 24, 18, 0, Math.PI * 2, 0, Math.PI / 2.35), M(0x1A1A1A, .9));
    hair.position.y = 2.68; chef.add(hair);
    const fringe = new THREE.Mesh(new THREE.SphereGeometry(.372, 24, 8, -0.9, 1.8, 0.55, .42), M(0x1A1A1A, .9));
    fringe.position.y = 2.68; chef.add(fringe);
    const eyeM = M(0x1F1B18, .4);
    [-1, 1].forEach(s => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(.055, 12, 10), eyeM);
      eye.position.set(s * .13, 2.68, .3); chef.add(eye);
      const brow = box(.13, .03, .02, eyeM); brow.position.set(s * .13, 2.79, .31); chef.add(brow);
    });
    const smile = new THREE.Mesh(new THREE.TorusGeometry(.09, .022, 8, 16, Math.PI), eyeM);
    smile.rotation.set(0, 0, Math.PI); smile.position.set(0, 2.53, .3); chef.add(smile);
    [-1, 1].forEach(s => {                        // the headphones he never takes off
      const cupE = new THREE.Mesh(new THREE.CylinderGeometry(.13, .13, .1, 16), M(0x1A2330, .6));
      cupE.rotation.z = Math.PI / 2; cupE.position.set(s * .37, 2.68, 0); chef.add(cupE);
    });
    const band = new THREE.Mesh(new THREE.TorusGeometry(.37, .035, 8, 20, Math.PI), M(0x1A2330, .6));
    band.rotation.y = Math.PI / 2; band.position.y = 2.68; chef.add(band);
    chef.traverse(n => { if (n.isMesh) n.castShadow = true; });
    chef.position.set(0, 0, 0.5);
    scene.add(chef);

    /* ---------- walking ---------- */
    const goal = chef.position.clone();
    const keys = {};
    let current = null;                       // the station he is standing at
    const SPEED = 4.2;

    addEventListener('keydown', e => { keys[e.key] = true; });
    addEventListener('keyup',   e => { keys[e.key] = false; });

    const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
    renderer.domElement.addEventListener('pointerdown', e => {
      const r = renderer.domElement.getBoundingClientRect();
      ndc.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      ndc.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      ray.setFromCamera(ndc, cam);
      const hit = ray.intersectObject(floor);
      if (hit.length) { goal.copy(hit[0].point); goal.y = 0; }
    });

    function nearestStation() {
      let best = null, bd = 2.4;                // you have to actually walk up to it
      Object.values(stations).forEach(s => {
        const d = chef.position.distanceTo(s.at);
        if (d < bd) { bd = d; best = s; }
      });
      return best;
    }

    const tmp = new THREE.Vector3();
    let last = performance.now(), raf = 0;
    function tick() {
      const now = performance.now(), dt = Math.min(.05, (now - last) / 1000);
      last = now;

      // arrows drive him directly; a click sets a goal he walks to
      let ix = 0, iz = 0;
      if (keys.ArrowLeft  || keys.a) ix -= 1;
      if (keys.ArrowRight || keys.d) ix += 1;
      if (keys.ArrowUp    || keys.w) iz -= 1;
      if (keys.ArrowDown  || keys.s) iz += 1;
      if (ix || iz) {
        tmp.set(ix, 0, iz).normalize().multiplyScalar(SPEED * dt);
        chef.position.add(tmp); goal.copy(chef.position);
      } else if (chef.position.distanceTo(goal) > .08) {
        tmp.copy(goal).sub(chef.position); tmp.y = 0;
        const step = Math.min(tmp.length(), SPEED * dt);
        chef.position.add(tmp.normalize().multiplyScalar(step));
      }
      // keep him behind the counters and inside the room
      chef.position.x = Math.max(-9.5, Math.min(10.8, chef.position.x));
      chef.position.z = Math.max(-3.2, Math.min(4.2, chef.position.z));
      if (ix || iz || chef.position.distanceTo(goal) > .08) {
        chef.rotation.y = Math.atan2(
          (goal.x - chef.position.x) || ix, (goal.z - chef.position.z) || iz);
        chef.position.y = Math.abs(Math.sin(now * .012)) * .07;   // a little bob
        const sw = Math.sin(now * .012) * .5;                     // arms and legs swing
        arms[0].rotation.x = sw; arms[1].rotation.x = -sw;
        legsM[0].rotation.x = -sw * .7; legsM[1].rotation.x = sw * .7;
      } else {
        chef.position.y = 0;
        arms[0].rotation.x = arms[1].rotation.x = 0;
        legsM[0].rotation.x = legsM[1].rotation.x = 0;
      }

      // arriving at a machine pulls the camera in on it
      const near = nearestStation();
      if (near !== current) {
        current = near;
        if (o.onStation) o.onStation(near ? { id: near.id, label: near.label } : null);
      }
      if (current) {
        camLook.lerp(current.obj.position, .05);
        tmp.copy(current.obj.position).add(new THREE.Vector3(0, 2.6, 7));
        cam.position.lerp(tmp, .045);
      } else {
        // the wide shot: the whole bar, drifting a little with him
        camLook.lerp(new THREE.Vector3(chef.position.x * .45, 2.9, -3), .04);
        tmp.set(chef.position.x * .3, 6.4, 14.5);
        cam.position.lerp(tmp, .035);
      }
      cam.lookAt(camLook);

      renderer.render(scene, cam);
      raf = requestAnimationFrame(tick);
    }
    tick();

    function resize() {
      const w = host.clientWidth || W, h = host.clientHeight || H;
      renderer.setSize(w, h, false);
      cam.aspect = w / h; cam.updateProjectionMatrix();
    }
    const ro = ('ResizeObserver' in window) ? new ResizeObserver(resize) : null;
    if (ro) ro.observe(host);
    addEventListener('resize', resize);

    return {
      stations: Object.keys(stations),
      /** Send the barista to a station by id. */
      goTo(id) { const s = stations[id]; if (s) goal.copy(s.at); },
      at() { return current ? current.id : null; },
      destroy() {
        cancelAnimationFrame(raf); if (ro) ro.disconnect();
        renderer.dispose(); renderer.domElement.remove();
      }
    };
  }

  function mount(host, opts) {
    return load().then(m => (m && host) ? build(host, opts) : null);
  }
  global.KoraKitchen3D = { mount, supported: webglOK };
})(window);
