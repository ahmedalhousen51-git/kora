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

  /* Bloom, loaded separately and treated as a luxury.

     Two traps here, both of which bite quietly:
     · three's addons `import ... from 'three'` — a bare specifier the browser
       cannot resolve on its own, so the page needs an import map naming the
       exact same build URL. No map, no addons; we just render plainly.
     · never patch `renderer.render` to call `composer.render()`. RenderPass
       calls `renderer.render` itself, so the patch calls straight back into
       the composer — the first frame dies on a stack overflow. The composer
       is called from the animation loop instead, and nothing is monkeyed. */
  const ADDONS = 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/';
  let fx = null, fxLoading = null;
  function loadFX() {
    if (fxLoading) return fxLoading;
    fxLoading = Promise.all([
      import(ADDONS + 'postprocessing/EffectComposer.js'),
      import(ADDONS + 'postprocessing/RenderPass.js'),
      import(ADDONS + 'postprocessing/UnrealBloomPass.js')
    ]).then(m => (fx = {
      EffectComposer: m[0].EffectComposer,
      RenderPass: m[1].RenderPass,
      UnrealBloomPass: m[2].UnrealBloomPass
    })).catch(e => {
      console.warn('KoraKitchen3D: bloom unavailable, rendering plain —', e.message);
      return null;
    });
    return fxLoading;
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
    // film tone curve — highlights on the steel roll off instead of blowing out
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
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
    // a cool fill from the room side and a warm rim from behind, so the
    // machines and the barista read as solid instead of flat — the café stays
    // bright either way; this is edge definition, not a mood change
    const fill = new THREE.DirectionalLight(0xbcd4f0, .45);
    fill.position.set(-7, 5, 9); scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffc98a, .7);
    rim.position.set(-3, 6, -9); scene.add(rim);

    /* Bloom kept subtle and high-threshold: only the genuinely bright things
       — the steel, the grinder screen, the steam — pick up a glow. The room
       itself must stay the bright beige it is in the photographs. */
    let composer = null;
    if (fx) {
      try {
        composer = new fx.EffectComposer(renderer);
        composer.addPass(new fx.RenderPass(scene, cam));
        composer.addPass(new fx.UnrealBloomPass(new THREE.Vector2(W, H), .26, .5, .85));
      } catch (e) {
        console.warn('KoraKitchen3D: composer failed, rendering plain —', e);
        composer = null;
      }
    }

    const M = (c, r, m) => new THREE.MeshStandardMaterial({ color: c, roughness: r == null ? .8 : r, metalness: m || 0 });
    const box = (w, h, d, mat) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);

    /* Lettering is painted into a canvas and mapped onto real surfaces, not
       hung on sprites — a badge belongs on the front of the machine, and it
       has to be hidden when something stands in front of it. */
    function textTex(text, opt) {
      const cv = document.createElement('canvas');
      cv.width = 512; cv.height = opt.tall ? 256 : 128;
      const g = cv.getContext('2d');
      if (opt.bg) { g.fillStyle = opt.bg; g.fillRect(0, 0, cv.width, cv.height); }
      g.font = '700 ' + (opt.size || 64) + 'px Inter, Helvetica, Arial, sans-serif';
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillStyle = opt.fg || '#fff';
      const reps = opt.repeat || 1;
      for (let i = 0; i < reps; i++) {
        g.fillText(text, (cv.width / reps) * (i + .5), cv.height / 2);
      }
      const t = new THREE.CanvasTexture(cv);
      t.colorSpace = THREE.SRGBColorSpace;
      // wrapped labels start at the cylinder's seam, which cuts the word in
      // half from the front — turn it so a whole word faces the room
      if (opt.turn) { t.wrapS = THREE.RepeatWrapping; t.offset.x = opt.turn; }
      return t;
    }
    // a flat badge that sits on a surface and is occluded like any other mesh
    function decal(text, w, h, opt) {
      opt = opt || {};
      return new THREE.Mesh(new THREE.PlaneGeometry(w, h),
        new THREE.MeshBasicMaterial({ map: textTex(text, opt), transparent: !opt.bg }));
    }

    /* Running a machine should look like something happened: its lamp swells
       and settles, and anything steaming puts out a harder plume for a moment. */
    const pulses = [];
    function flash(mat, peak, secs) {
      pulses.push({ mat: mat, t: 0, dur: secs || .9,
                    base: mat.emissiveIntensity || 0, peak: peak });
    }
    // an indicator lamp that can be flashed; returns the mesh
    function indicator(colour, w, h, d) {
      return new THREE.Mesh(new THREE.BoxGeometry(w, h, d),
        new THREE.MeshStandardMaterial({ color: colour, emissive: colour,
          emissiveIntensity: .35, roughness: .3 }));
    }

    /* Steam that actually rises: each puff climbs, fades and restarts. */
    const steams = [];
    function steam(parent, x, y, z, spread, rise) {
      const g = new THREE.Group();
      for (let i = 0; i < 9; i++) {
        const p = new THREE.Mesh(new THREE.SphereGeometry(.07, 7, 6),
          new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false }));
        // stagger the phase and drift, or nine puffs climb as one bead string
        p.userData = {
          t: (i / 9) + Math.random() * .1,
          dx: (Math.random() - .5) * spread, dz: (Math.random() - .5) * spread,
          k: .8 + Math.random() * .45
        };
        g.add(p);
      }
      g.position.set(x, y, z);
      g.userData.rise = rise || 1.1;
      g.userData.boost = 0;                   // raised briefly when the machine runs
      parent.add(g);
      steams.push(g);
      return g;
    }

    /* ---------- the room shell ---------- */
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(26, 22), M(C.floor, .95));
    floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true;
    scene.add(floor);

    // a tile texture drawn once on a canvas, then repeated
    function tileTex(rw, rh) {
      const cv = document.createElement('canvas');
      cv.width = 256; cv.height = 128;
      const g = cv.getContext('2d');
      g.fillStyle = '#D3CCC0'; g.fillRect(0, 0, 256, 128);
      g.fillStyle = '#EDEAE3';
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
    // matcha tins — the label is wrapped round the tin, not stuck in front of it
    const tinMat = new THREE.MeshStandardMaterial({
      map: textTex('MATCHA', { bg: '#4E7A52', fg: '#EFE7D8', size: 44, repeat: 3, tall: true, turn: .17 }),
      roughness: .6
    });
    for (let i = 0; i < 9; i++) {
      const tin = new THREE.Mesh(new THREE.CylinderGeometry(.22, .22, .62, 20),
        [tinMat, M(0x3C5F40, .6), M(0x3C5F40, .6)]);
      tin.position.set(-7.6 + i * 1.15, 5.85, -5.4); tin.castShadow = true;
      scene.add(tin);
      const lid = new THREE.Mesh(new THREE.CylinderGeometry(.24, .24, .08, 20), M(0xCFC4AE, .45, .2));
      lid.position.set(-7.6 + i * 1.15, 6.19, -5.4); scene.add(lid);
    }
    // spare syrup stock standing on the shelf beside the tins
    ['1883', 'MONIN', '1883', 'MONIN'].forEach((brand, i) => {
      const col = [0xC2334D, 0x8E5A2B, 0x3E5C8A, 0xD9A6B4][i];
      const b = new THREE.Mesh(new THREE.CylinderGeometry(.13, .13, .58, 14), M(col, .35));
      b.position.set(3.9 + i * .62, 5.81, -5.4);      // sits on the shelf top (5.51)
      b.castShadow = true; scene.add(b);
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(.06, .06, .16, 10), M(C.black, .5));
      cap.position.set(3.9 + i * .62, 6.16, -5.4); scene.add(cap);
      const lab = decal(brand, .24, .1, { fg: '#2A211A', size: 74 });
      lab.position.set(3.9 + i * .62, 5.83, -5.26); scene.add(lab);
    });

    /* ---------- the machines, where they actually stand ---------- */
    const stations = {};
    const stationRoots = [];
    function station(id, label, mesh, x, y, z, stand, kit) {
      mesh.position.set(x, y, z);
      mesh.traverse(n => { if (n.isMesh) { n.castShadow = true; n.receiveShadow = true; } });
      mesh.userData.stationId = id;              // so a click can find its way back up
      scene.add(mesh);
      stationRoots.push(mesh);
      stations[id] = {
        id: id, label: label, obj: mesh,
        at: new THREE.Vector3(stand[0], 0, stand[1]),
        lamp: (kit && kit.lamp) || null,
        plume: (kit && kit.plume) || null
      };
    }

    /* Run the machine he is standing at. */
    function operate(st) {
      if (!st) return false;
      if (st.lamp) flash(st.lamp.material, 2.4, 1.0);
      if (st.plume) st.plume.userData.boost = 1;
      if (o.onOperate) o.onOperate({ id: st.id, label: st.label });
      return true;
    }

    // La Cimbali: wide body, three group heads, portafilters
    const cim = new THREE.Group();
    const body = box(4.4, 1.5, 1.5, M(C.steel, .35, .6));
    body.position.y = .75; cim.add(body);
    const badge = box(2.1, .3, .02, M(0xB4232B, .5));
    badge.position.set(0, 1.05, .76); cim.add(badge);
    const badgeText = decal('LA CIMBALI', 1.9, .24, { fg: '#FFFFFF', size: 76 });
    badgeText.position.set(0, 1.05, .78); cim.add(badgeText);
    const modelText = decal('M32', .5, .16, { fg: '#D8DDE2', size: 84 });
    modelText.position.set(1.6, 1.05, .76); cim.add(modelText);
    for (let i = -1; i <= 1; i++) {
      const head = box(.62, .34, .62, M(C.steelDark, .4, .7));
      head.position.set(i * 1.3, .2, .62); cim.add(head);
      const pf = new THREE.Mesh(new THREE.CylinderGeometry(.24, .24, .16, 16), M(C.steelDark, .4, .7));
      pf.position.set(i * 1.3, .02, .62); cim.add(pf);
      const handle = new THREE.Mesh(new THREE.CylinderGeometry(.07, .07, .5, 10), M(C.black, .6));
      handle.rotation.x = Math.PI / 2; handle.position.set(i * 1.3, .02, 1.0); cim.add(handle);
    }
    // the steam wand on the right, breathing
    const wand = new THREE.Mesh(new THREE.CylinderGeometry(.05, .035, .8, 10), M(C.steelDark, .35, .7));
    wand.position.set(2.1, .25, .55); wand.rotation.x = .35; cim.add(wand);
    const cimPlume = steam(cim, 2.2, .6, .75, .28, 1.0);
    const cimLamp = indicator(0xE23B2E, .14, .06, .04);
    cimLamp.position.set(1.05, .32, .78); cim.add(cimLamp);
    station('espresso', 'ماكينة الإسبريسو', cim, 5.4, 2.85, -3.9, [5.4, -1.2],
            { lamp: cimLamp, plume: cimPlume });

    // tamper and a small pile of ground coffee, out on the worktop where they show
    const tamper = new THREE.Mesh(new THREE.CylinderGeometry(.13, .15, .1, 16), M(0xC9A227, .3, .8));
    tamper.position.set(6.7, 2.93, -2.75); tamper.castShadow = true; scene.add(tamper);
    const tampGrip = new THREE.Mesh(new THREE.CylinderGeometry(.07, .09, .22, 12), M(0x3A2A1C, .7));
    tampGrip.position.set(6.7, 3.08, -2.75); scene.add(tampGrip);
    const grounds = new THREE.Mesh(new THREE.CylinderGeometry(.001, .3, .12, 18), M(0x4A3120, .95));
    grounds.position.set(7.5, 2.92, -2.75); scene.add(grounds);
    for (let i = 0; i < 14; i++) {                      // a few beans that spilled
      const bean = new THREE.Mesh(new THREE.SphereGeometry(.045, 7, 6), M(0x3B2318, .85));
      bean.scale.set(1, .7, 1.35);
      bean.position.set(7.5 + (Math.random() - .5) * 1.1, 2.9, -2.75 + (Math.random() - .5) * .5);
      bean.rotation.y = i * 1.1; bean.castShadow = true; scene.add(bean);
    }

    // the grinder
    const grp = new THREE.Group();
    const gbody = box(.8, 1.5, .8, M(C.black, .5, .3)); gbody.position.y = .75; grp.add(gbody);
    const hop = new THREE.Mesh(new THREE.CylinderGeometry(.42, .3, .9, 20),
      new THREE.MeshPhysicalMaterial({ color: 0x6b4a2c, transmission: .5, roughness: .2, transparent: true, opacity: .75 }));
    hop.position.y = 1.9; grp.add(hop);
    const scr = new THREE.Mesh(new THREE.BoxGeometry(.42, .22, .03),
      new THREE.MeshStandardMaterial({ color: 0x123A55, emissive: 0x1E5C86, emissiveIntensity: .8, roughness: .3 }));
    scr.position.set(0, .95, .42); grp.add(scr);
    // the dose the espresso sim actually asks for
    const dose = decal('18.0 g', .36, .12, { fg: '#BFE6FF', size: 62 });
    dose.position.set(0, .95, .445); grp.add(dose);
    const grindLamp = indicator(0x3FBF57, .16, .07, .04);
    grindLamp.position.set(0, .62, .43); grp.add(grindLamp);
    station('grinder', 'المطحنة', grp, 8.4, 2.85, -3.9, [8.4, -1.2], { lamp: grindLamp });

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
      const lab = decal(['1883', 'MONIN', '1883', 'MONIN', '1883', 'MONIN'][i], .24, .1,
        { fg: '#241C16', size: 74 });
      lab.position.set(-1 + i * .4, .6, .14); rack.add(lab);
    }
    const syrupLamp = indicator(0xE8B33A, .18, .05, .04);
    syrupLamp.position.set(1.15, .1, .28); rack.add(syrupLamp);
    station('syrup', 'مضخات السيرب', rack, 10.4, 2.85, -3.9, [10.2, -1.2], { lamp: syrupLamp });

    // the JTC blender and the ice machine on the left run
    const bl = new THREE.Group();
    const blBase = box(.9, .5, .9, M(C.black, .5)); blBase.position.y = .25; bl.add(blBase);
    const dome = new THREE.Mesh(new THREE.SphereGeometry(.55, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshPhysicalMaterial({ color: 0x9aa0a6, transmission: .6, roughness: .15, transparent: true, opacity: .5 }));
    dome.position.y = .5; bl.add(dome);
    const juice = new THREE.Mesh(new THREE.CylinderGeometry(.36, .34, .34, 18), M(0xE07A3A, .35));
    juice.position.y = .66; bl.add(juice);            // fruit still in the jug
    const bubbles = [];                                // rising inside the jug
    for (let i = 0; i < 12; i++) {
      const b = new THREE.Mesh(new THREE.SphereGeometry(.026 + (i % 3) * .012, 8, 8),
        new THREE.MeshPhysicalMaterial({ color: 0xFFD9B8, roughness: .05,
          transmission: .8, transparent: true, opacity: .55 }));
      const a = i * 2.1, r = .1 + (i % 4) * .06;
      b.userData = { x: Math.cos(a) * r, z: Math.sin(a) * r, t: i / 12, k: .6 + (i % 5) * .16 };
      bl.add(b); bubbles.push(b);
    }
    const blendLamp = indicator(0xF08A2E, .16, .06, .04);
    blendLamp.position.set(0, .16, .47); bl.add(blendLamp);
    station('blender', 'الخلاط', bl, -6.4, 2.85, -5, [-6.4, -2.4], { lamp: blendLamp });

    const iceG = new THREE.Group();
    const ice = box(1.5, 1.8, 1.3, M(0xE6E8EA, .6)); ice.position.y = .9; iceG.add(ice);
    const iceLid = box(1.55, .12, 1.35, M(0xB9BCC0, .5)); iceLid.position.y = 1.84; iceG.add(iceLid);
    const iceScr = box(.5, .18, .03, M(0x1b1d20, .4)); iceScr.position.set(0, 1.2, .66); iceG.add(iceScr);
    const iceSlot = box(.7, .28, .06, M(0x2b2e31, .7)); iceSlot.position.set(0, .45, .66); iceG.add(iceSlot);
    // an open tub of cubes in front of it — cubes sealed inside the machine
    // would be hidden by its own walls, so they live where you can see them
    const tub = new THREE.Mesh(new THREE.CylinderGeometry(.42, .36, .34, 18), M(0xB9BCC0, .45, .3));
    tub.position.set(0, .17, 1.35); iceG.add(tub);
    const iceCubes = [];
    for (let i = 0; i < 11; i++) {
      const cube = box(.13, .13, .13, new THREE.MeshPhysicalMaterial({
        color: 0xEAF6FF, transmission: .75, roughness: .12, transparent: true, opacity: .85 }));
      const a = i * 1.7;
      cube.position.set(Math.cos(a) * .2, .3 + (i % 3) * .05, 1.35 + Math.sin(a) * .2);
      cube.rotation.set(i * 1.1, i * .7, i * 1.9);
      iceG.add(cube); iceCubes.push(cube);
    }
    const iceLamp = indicator(0x49AEEF, .14, .06, .04);
    iceLamp.position.set(.45, .95, .68); iceG.add(iceLamp);
    station('ice', 'ماكينة التلج', iceG, -8.0, 2.85, -5, [-8.0, -2.4], { lamp: iceLamp });

    // the hotplate with its pot — where the tea and the tapioca happen
    const hp = new THREE.Group();
    const plate = box(1.6, .18, 1.0, M(C.black, .5)); hp.add(plate);
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(.45, .42, .55, 22), M(0xC8CBCE, .3, .8));
    pot.position.y = .36; hp.add(pot);
    const potLid = new THREE.Mesh(new THREE.SphereGeometry(.45, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), M(0xC8CBCE, .3, .8));
    potLid.position.y = .62; hp.add(potLid);
    const brewPlume = steam(hp, 0, .8, 0, .3, 1.2);
    const brewLamp = indicator(0xF2603C, .13, .05, .04);
    brewLamp.position.set(.55, .04, .52); hp.add(brewLamp);
    station('brew', 'السخّان والحلة', hp, -0.6, 2.9, -5, [-0.6, -2.4],
            { lamp: brewLamp, plume: brewPlume });

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
    const eyeM = M(0x1F1B18, .4), eyeWhiteM = M(0xFFFFFF, .25);
    [-1, 1].forEach(s => {
      const white = new THREE.Mesh(new THREE.SphereGeometry(.072, 14, 12), eyeWhiteM);
      white.position.set(s * .13, 2.68, .29); chef.add(white);
      const pupil = new THREE.Mesh(new THREE.SphereGeometry(.042, 12, 10), eyeM);
      pupil.position.set(s * .13, 2.68, .35); chef.add(pupil);
      const brow = box(.13, .03, .02, eyeM); brow.position.set(s * .13, 2.81, .31); chef.add(brow);
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
      // A machine has to be tested before the floor. The floor is one big
      // plane lying behind everything, so a ray through a machine hits it too
      // — check the floor first and you can never click a machine at all.
      const onMachine = ray.intersectObjects(stationRoots, true);
      if (onMachine.length) {
        let n = onMachine[0].object;
        while (n && !n.userData.stationId) n = n.parent;
        if (n) {
          const st = stations[n.userData.stationId];
          // standing at it already? run it. otherwise walk over first.
          if (current === st) operate(st); else goal.copy(st.at);
          return;
        }
      }
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
        // turn towards the goal the short way round — a plain lerp on the
        // angle spins him the long way whenever it crosses ±π
        const want = Math.atan2(
          (goal.x - chef.position.x) || ix, (goal.z - chef.position.z) || iz);
        let d = want - chef.rotation.y;
        while (d > Math.PI) d -= Math.PI * 2;
        while (d < -Math.PI) d += Math.PI * 2;
        chef.rotation.y += d * Math.min(1, dt * 12);
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
      // steam climbs, spreads and fades, then starts again from the spout
      for (let i = 0; i < steams.length; i++) {
        const g = steams[i], rise = g.userData.rise;
        if (g.userData.boost > 0) g.userData.boost = Math.max(0, g.userData.boost - dt / 1.6);
        const push = 1 + g.userData.boost * 1.6;
        for (let j = 0; j < g.children.length; j++) {
          const p = g.children[j], u = p.userData;
          u.t += dt * .38 * u.k * push;
          if (u.t > 1) u.t -= 1;
          p.position.set(u.dx * u.t, u.t * rise * u.k, u.dz * u.t);
          p.material.opacity = Math.sin(u.t * Math.PI) * (.3 + g.userData.boost * .45);
          const s = .5 + u.t * 1.6;
          p.scale.set(s, s, s);
        }
      }
      // lamps swell and settle back
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.t += dt;
        const k = Math.min(1, p.t / p.dur);
        p.mat.emissiveIntensity = p.base + (p.peak - p.base) * Math.sin(k * Math.PI);
        if (k >= 1) { p.mat.emissiveIntensity = p.base; pulses.splice(i, 1); }
      }

      // bubbles climb through the juice; the cubes turn slowly in their tub
      for (let i = 0; i < bubbles.length; i++) {
        const b = bubbles[i], u = b.userData;
        u.t += dt * .3 * u.k;
        if (u.t > 1) u.t -= 1;
        b.position.set(u.x, .5 + u.t * .32, u.z);
        b.material.opacity = Math.sin(u.t * Math.PI) * .55;
      }
      for (let i = 0; i < iceCubes.length; i++) {
        iceCubes[i].rotation.y += dt * .25;
      }

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

      if (composer) composer.render(); else renderer.render(scene, cam);
      raf = requestAnimationFrame(tick);
    }
    tick();

    function resize() {
      const w = host.clientWidth || W, h = host.clientHeight || H;
      renderer.setSize(w, h, false);
      cam.aspect = w / h; cam.updateProjectionMatrix();
      if (composer) composer.setSize(w, h);
    }
    const ro = ('ResizeObserver' in window) ? new ResizeObserver(resize) : null;
    if (ro) ro.observe(host);
    addEventListener('resize', resize);

    return {
      stations: Object.keys(stations),
      /** Send the barista to a station by id — he walks there. */
      goTo(id) { const s = stations[id]; if (s) goal.copy(s.at); },
      /** Put him at a station straight away, no walk. */
      place(id) {
        const s = stations[id];
        if (!s) return false;
        chef.position.set(s.at.x, 0, s.at.z);
        goal.copy(chef.position);
        return true;
      },
      at() { return current ? current.id : null; },
      /** Run a machine. Defaults to the one he is standing at. */
      use(id) { return operate(id ? stations[id] : current); },
      /** Where he is walking to right now, as {x, z} — null once he arrives. */
      goalAt() {
        return chef.position.distanceTo(goal) > .08
          ? { x: +goal.x.toFixed(2), z: +goal.z.toFixed(2) } : null;
      },
      /** false when the bloom addons could not load and we fell back to plain. */
      bloom: !!composer,
      destroy() {
        cancelAnimationFrame(raf); if (ro) ro.disconnect();
        renderer.dispose(); renderer.domElement.remove();
      }
    };
  }

  function mount(host, opts) {
    return load().then(m => {
      if (!m || !host) return null;
      return loadFX().then(() => {
        try {
          return build(host, opts);
        } catch (e) {
          // a throw in here used to leave a blank canvas and no explanation
          console.error('KoraKitchen3D: scene failed to build —', e);
          return null;
        }
      });
    });
  }
  global.KoraKitchen3D = { mount, supported: webglOK };
})(window);