/* ==========================================================================
   Kora — sound effects
   Everything is synthesised with the Web Audio API: no files to download, no
   hosting, works offline, and adds nothing to the page weight.
   Browsers block audio until the first real interaction, so the context is
   created lazily on the first gesture.
   ========================================================================== */
(function (global) {
  'use strict';

  let ctx = null, master = null;
  let muted = false;
  try { muted = localStorage.getItem('kora_muted') === '1'; } catch (e) {}

  function ready() {
    if (!ctx) {
      const AC = global.AudioContext || global.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = muted ? 0 : .5;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  // unlock on the first touch/click anywhere
  ['pointerdown', 'keydown'].forEach(ev =>
    global.addEventListener(ev, () => ready(), { once: true, passive: true }));

  const now = () => ctx.currentTime;

  /* -------------------------------------------------- building blocks --- */
  function noiseBuffer(seconds) {
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }

  function blip(freq, dur, type, vol, slideTo) {
    if (!ready() || muted) return;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, now());
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, now() + dur);
    g.gain.setValueAtTime(0, now());
    g.gain.linearRampToValueAtTime(vol == null ? .3 : vol, now() + .012);
    g.gain.exponentialRampToValueAtTime(.0001, now() + dur);
    o.connect(g); g.connect(master);
    o.start(); o.stop(now() + dur + .02);
  }

  /* ================================================== the pour ========== */
  /* Filtered noise that climbs in pitch as the cup fills — like water
     rising in a vessel. Held open while the customer keeps pouring. */
  let pour = null;
  function pourStart() {
    if (!ready() || muted || pour) return;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(2);
    src.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 700;
    bp.Q.value = 2.4;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, now());
    g.gain.linearRampToValueAtTime(.16, now() + .09);
    src.connect(bp); bp.connect(g); g.connect(master);
    src.start();
    pour = { src, bp, g };
  }
  /** progress 0–1: the note rises as the cup fills */
  function pourLevel(p) {
    if (!pour) return;
    const f = 520 + Math.max(0, Math.min(1, p)) * 900;
    pour.bp.frequency.setTargetAtTime(f, now(), .08);
  }
  function pourStop() {
    if (!pour) return;
    const p = pour; pour = null;
    p.g.gain.setTargetAtTime(.0001, now(), .05);
    setTimeout(() => { try { p.src.stop(); } catch (e) {} }, 220);
  }

  /* ================================================== ice / solids ====== */
  function ice() {
    if (!ready() || muted) return;
    // a short bright click plus a tiny ring = ice hitting plastic
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(.08);
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass'; hp.frequency.value = 2600;
    const g = ctx.createGain();
    g.gain.setValueAtTime(.32, now());
    g.gain.exponentialRampToValueAtTime(.0001, now() + .09);
    src.connect(hp); hp.connect(g); g.connect(master);
    src.start(); src.stop(now() + .1);
    blip(1500 + Math.random() * 900, .09, 'triangle', .1);
  }

  function plop() {   // a boba pearl landing
    blip(320, .12, 'sine', .26, 120);
  }

  function pump() {
    if (!ready() || muted) return;
    blip(180, .07, 'square', .16, 90);
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(.05);
    const g = ctx.createGain();
    g.gain.setValueAtTime(.14, now());
    g.gain.exponentialRampToValueAtTime(.0001, now() + .06);
    src.connect(g); g.connect(master);
    src.start(); src.stop(now() + .07);
  }

  /* ================================================== the shaker ======== */
  let shake = null;
  function shakeStart() {
    if (!ready() || muted || shake) return;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(2);
    src.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass'; bp.frequency.value = 1800; bp.Q.value = 1.1;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, now());
    g.gain.linearRampToValueAtTime(.2, now() + .05);
    src.connect(bp); bp.connect(g); g.connect(master);
    src.start();
    shake = { src, g };
  }
  function shakeStop() {
    if (!shake) return;
    const s = shake; shake = null;
    s.g.gain.setTargetAtTime(.0001, now(), .04);
    setTimeout(() => { try { s.src.stop(); } catch (e) {} }, 200);
  }
  function rattle() { blip(2200 + Math.random() * 800, .05, 'triangle', .12); }

  /* ================================================== moments =========== */
  function seal() {          // the lid going on
    blip(150, .16, 'sine', .3, 70);
    setTimeout(() => blip(90, .12, 'sine', .18), 60);
  }
  function success() {       // little three-note flourish
    [523, 659, 784].forEach((f, i) => setTimeout(() => blip(f, .22, 'triangle', .22), i * 95));
  }
  function ohNo() {          // you went too far
    blip(300, .18, 'sawtooth', .16, 160);
    setTimeout(() => blip(200, .22, 'sawtooth', .14, 110), 110);
  }
  function pop() { blip(700, .07, 'sine', .18, 1200); }

  /* A cartoon giggle: a few quick rising blips. Not a human laugh — that
     would need a real recording — but it reads as the character chuckling. */
  function giggle() {
    const notes = [660, 780, 700, 880, 820];
    notes.forEach((f, i) => setTimeout(() => blip(f, .1, 'triangle', .17), i * 78));
  }

  /* ================================================== mute ============== */
  function setMuted(m) {
    muted = !!m;
    try { localStorage.setItem('kora_muted', muted ? '1' : '0'); } catch (e) {}
    if (master) master.gain.setTargetAtTime(muted ? 0 : .5, ctx.currentTime, .02);
    if (muted) { pourStop(); shakeStop(); }
  }
  const isMuted = () => muted;

  /** A speaker button you can drop into any header. */
  function mountToggle(target) {
    const b = document.createElement('button');
    b.className = 'btn btn-sm sfx-toggle';
    b.type = 'button';
    b.title = 'Sound on/off';
    const paint = () => { b.textContent = muted ? '🔇' : '🔊'; };
    paint();
    b.onclick = () => { setMuted(!muted); paint(); if (!muted) pop(); };
    (target || document.body).appendChild(b);
    return b;
  }

  global.KoraSFX = {
    pourStart, pourLevel, pourStop,
    ice, plop, pump,
    shakeStart, shakeStop, rattle,
    seal, success, ohNo, pop, giggle,
    setMuted, isMuted, mountToggle, ready
  };
})(window);
