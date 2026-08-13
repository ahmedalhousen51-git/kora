/* =========================================================================
   كورة - محاكاة الباك إند محلياً (Demo Store)
   ⚠️ ده مش Supabase حقيقي — تخزين محلي (localStorage) + مزامنة لحظية بين
   التابات عن طريق BroadcastChannel + storage event. غرضه إثبات الفلو بس.
   لما نربط الباك إند الحقيقي، الدوال دي هتتستبدل من غير ما تتغير الواجهات.
   ========================================================================= */
(function (global) {
  'use strict';

  const LS_KEYS = {
    menu: 'korra_menu',
    customizations: 'korra_customizations',
    buildCatalog: 'korra_build_catalog',
    stations: 'korra_stations',
    inventory: 'korra_inventory',
    orders: 'korra_orders',
    baristas: 'korra_baristas',
    admin: 'korra_admin',
    session: 'korra_session'
  };

  const channel = ('BroadcastChannel' in window) ? new BroadcastChannel('korra_channel') : null;

  function readLS(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }
  function writeLS(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function seedIfEmpty() {
    const seed = global.KORRA_SEED || {};
    if (!localStorage.getItem(LS_KEYS.menu)) writeLS(LS_KEYS.menu, seed.menu || []);
    if (!localStorage.getItem(LS_KEYS.customizations)) writeLS(LS_KEYS.customizations, seed.customizations || []);
    if (!localStorage.getItem(LS_KEYS.buildCatalog)) writeLS(LS_KEYS.buildCatalog, seed.buildCatalog || {});
    if (!localStorage.getItem(LS_KEYS.stations)) writeLS(LS_KEYS.stations, seed.kitchenStations || []);
    if (!localStorage.getItem(LS_KEYS.inventory)) writeLS(LS_KEYS.inventory, seed.inventory || {});
    if (!localStorage.getItem(LS_KEYS.orders)) writeLS(LS_KEYS.orders, []);
    if (!localStorage.getItem(LS_KEYS.baristas)) writeLS(LS_KEYS.baristas, seed.demoBaristas || []);
    if (!localStorage.getItem(LS_KEYS.admin)) writeLS(LS_KEYS.admin, seed.demoAdmin || {});
  }

  function broadcast(type, payload) {
    const msg = { type, payload, ts: Date.now() };
    if (channel) { try { channel.postMessage(msg); } catch (e) {} }
    // fallback trigger لتحديث نفس التاب كمان (storage event بيتفعل بس في التابات التانية)
    window.dispatchEvent(new CustomEvent('korra:update', { detail: msg }));
  }

  function genId(prefix) {
    return (prefix || 'ord') + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);
  }

  const KorraStore = {
    KEYS: LS_KEYS,

    init() { seedIfEmpty(); },

    // ---------- بيانات المنيو ----------
    getMenu() { return readLS(LS_KEYS.menu, []); },
    getCustomizations() { return readLS(LS_KEYS.customizations, []); },
    getBuildCatalog() { return readLS(LS_KEYS.buildCatalog, {}); },
    getStations() { return readLS(LS_KEYS.stations, []); },

    // ---------- المخزون ----------
    getInventory() { return readLS(LS_KEYS.inventory, {}); },
    setInventory(inv) { writeLS(LS_KEYS.inventory, inv); broadcast('inventory_updated', inv); },
    decrementInventory(map) {
      // map = { ingredientKey: amountUsed, ... }
      const inv = this.getInventory();
      const shortages = [];
      Object.keys(map || {}).forEach(k => {
        if (!(k in inv)) return;
        inv[k] = Math.max(0, (inv[k] || 0) - map[k]);
        if (inv[k] <= (inv[k + '_lowThreshold'] || 200)) shortages.push(k);
      });
      this.setInventory(inv);
      return shortages;
    },
    adjustInventory(key, delta) {
      const inv = this.getInventory();
      inv[key] = Math.max(0, (inv[key] || 0) + delta);
      this.setInventory(inv);
    },

    // ---------- الطلبات ----------
    getOrders() { return readLS(LS_KEYS.orders, []).sort((a, b) => b.createdAt - a.createdAt); },
    getOrder(id) { return this.getOrders().find(o => o.id === id) || null; },

    createOrder(order) {
      const orders = readLS(LS_KEYS.orders, []);
      const full = Object.assign({
        id: genId('ord'),
        status: 'received', // received -> preparing -> ready -> delivered
        createdAt: Date.now(),
        etaMinutes: null,
        etaSetAt: null,
        shortageFlag: null,
        customStepsLog: order.customStepsLog || null
      }, order);
      orders.push(full);
      writeLS(LS_KEYS.orders, orders);
      broadcast('order_created', full);
      return full;
    },

    updateOrder(id, patch) {
      const orders = readLS(LS_KEYS.orders, []);
      const idx = orders.findIndex(o => o.id === id);
      if (idx === -1) return null;
      orders[idx] = Object.assign({}, orders[idx], patch);
      writeLS(LS_KEYS.orders, orders);
      broadcast('order_updated', orders[idx]);
      return orders[idx];
    },

    setOrderStatus(id, status) { return this.updateOrder(id, { status }); },

    setOrderTimer(id, minutes) {
      return this.updateOrder(id, { etaMinutes: minutes, etaSetAt: Date.now() });
    },

    flagShortage(id, ingredientName) {
      return this.updateOrder(id, { shortageFlag: ingredientName });
    },
    clearShortage(id) { return this.updateOrder(id, { shortageFlag: null }); },

    // ---------- الباريستا ----------
    getBaristas() { return readLS(LS_KEYS.baristas, []); },
    addBarista(name, password) {
      const list = this.getBaristas();
      const b = { id: genId('bar'), name, password, active: true };
      list.push(b);
      writeLS(LS_KEYS.baristas, list);
      broadcast('baristas_updated', list);
      return b;
    },
    setBaristaActive(id, active) {
      const list = this.getBaristas();
      const idx = list.findIndex(b => b.id === id);
      if (idx === -1) return null;
      list[idx].active = active;
      writeLS(LS_KEYS.baristas, list);
      broadcast('baristas_updated', list);
      return list[idx];
    },
    removeBarista(id) {
      const list = this.getBaristas().filter(b => b.id !== id);
      writeLS(LS_KEYS.baristas, list);
      broadcast('baristas_updated', list);
    },
    baristaLogin(name, password) {
      const found = this.getBaristas().find(b => b.name === name && b.password === password);
      if (!found) return { ok: false, error: 'الاسم أو الباسورد غلط' };
      if (!found.active) return { ok: false, error: 'الحساب ده متوقف، كلم الأدمن' };
      return { ok: true, barista: found };
    },

    // ---------- الأدمن ----------
    getAdmin() { return readLS(LS_KEYS.admin, {}); },
    adminLogin(email, password) {
      const admin = this.getAdmin();
      if (email === admin.email && password === admin.password) return { ok: true, admin };
      return { ok: false, error: 'البريد أو الباسورد غلط' };
    },

    // ---------- الجلسة ----------
    setSession(role, data) { writeLS(LS_KEYS.session, { role, data, at: Date.now() }); },
    getSession() { return readLS(LS_KEYS.session, null); },
    clearSession() { localStorage.removeItem(LS_KEYS.session); },

    // ---------- الاشتراك في التحديثات اللحظية ----------
    onUpdate(cb) {
      if (channel) channel.onmessage = (e) => cb(e.data);
      window.addEventListener('korra:update', (e) => cb(e.detail));
      window.addEventListener('storage', (e) => {
        if (!e.key) return;
        if (Object.values(LS_KEYS).includes(e.key)) cb({ type: 'storage_sync', key: e.key });
      });
    },

    genId
  };

  global.KorraStore = KorraStore;
  KorraStore.init();

})(window);
