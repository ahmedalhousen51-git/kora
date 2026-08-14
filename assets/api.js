/* ==========================================================================
   Kora — data layer
   Talks to Supabase when assets/supabase-config.js is filled in, and falls
   back to browser storage ("local demo mode") when it isn't, so the site is
   always clickable. Every page uses this file only — no page touches storage
   or the network directly.
   ========================================================================== */
(function (global) {
  'use strict';

  const CFG = global.KORA_SUPABASE || {};
  const SEED = global.KORA_SEED || {};
  const LIVE = !!(CFG.url && CFG.anonKey);

  const LS = {
    orders: 'kora_orders',
    inventory: 'kora_inventory',
    staff: 'kora_staff',
    session: 'kora_session',
    creations: 'kora_creations',
    challenges: 'kora_challenges',
    myOrder: 'kora_my_order'
  };

  let sb = null;

  /* ------------------------------------------------------------ helpers -- */
  const read = (k, d) => { try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : d; } catch (e) { return d; } };
  const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  const uid = (p) => (p || 'id') + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  function seedLocal() {
    if (!localStorage.getItem(LS.orders)) write(LS.orders, []);
    if (!localStorage.getItem(LS.inventory)) {
      const inv = Object.keys(SEED.inventory || {}).map(k => ({
        key: k,
        name: (SEED.labels[k] || {}).n || k,
        unit: (SEED.labels[k] || {}).u || 'g',
        qty: SEED.inventory[k],
        low_threshold: Math.round(SEED.inventory[k] * 0.1)
      }));
      write(LS.inventory, inv);
    }
    if (!localStorage.getItem(LS.staff)) {
      write(LS.staff, (SEED.demoStaff || []).map(s => ({
        id: s.id, name: s.name, passcode: s.passcode, is_active: s.active
      })));
    }
  }

  /* ------------------------------------------------------- catalogue ----- */
  const catalog = {
    menu: SEED.menu || [],
    toppings: SEED.toppings || [],
    sizes: SEED.sizes || [],
    sugarLevels: SEED.sugarLevels || [],
    iceLevels: SEED.iceLevels || [],
    milkOptions: SEED.milkOptions || [],
    buildCatalog: SEED.buildCatalog || {},
    stations: SEED.stations || [],
    craftFee: SEED.craftFee || 20,
    currency: SEED.currency || 'EGP',
    labels: SEED.labels || {}
  };

  async function loadCatalogFromSupabase() {
    const [menu, tops, settings] = await Promise.all([
      sb.from('menu_items').select('*').eq('is_active', true).order('sort_order'),
      sb.from('toppings').select('*').eq('is_active', true),
      sb.from('settings').select('*')
    ]);
    if (menu.error || tops.error || settings.error) {
      throw (menu.error || tops.error || settings.error);
    }
    catalog.menu = (menu.data || []).map(m => ({
      id: m.id, name: m.name, category: m.category, tagline: m.tagline,
      price: Number(m.price), art: m.art, image: m.image_url || '', recipe: m.recipe || {}
    }));
    catalog.toppings = (tops.data || []).map(t => ({
      key: t.key, name: t.name, price: Number(t.price), unit: t.unit, portion: Number(t.portion)
    }));
    const S = {};
    (settings.data || []).forEach(r => { S[r.key] = r.value; });
    if (S.sizes) catalog.sizes = S.sizes;
    if (S.sugar_levels) catalog.sugarLevels = S.sugar_levels;
    if (S.ice_levels) catalog.iceLevels = S.ice_levels;
    if (S.milk_options) catalog.milkOptions = S.milk_options;
    if (S.build_catalog) catalog.buildCatalog = S.build_catalog;
    if (S.stations) catalog.stations = S.stations;
    if (S.pricing) {
      catalog.craftFee = Number(S.pricing.craft_fee || 20);
      catalog.currency = S.pricing.currency || 'EGP';
    }
  }

  /* --------------------------------------------------- price calculator -- */
  // Mirrors place_order() in schema.sql so the UI can preview the same total
  // the server will independently compute.
  function priceItem(item) {
    let line = 0;
    if ((item.kind || 'menu') === 'menu') {
      const m = catalog.menu.find(x => x.id === item.menu_id);
      if (!m) return 0;
      line = m.price;
      const size = catalog.sizes.find(s => s.key === item.size);
      if (size) line += Number(size.priceDelta || 0);
      const milk = catalog.milkOptions.find(s => s.key === item.milk);
      if (milk) line += Number(milk.priceDelta || 0);
    } else {
      line = catalog.craftFee + Number(item.build_price || 0);
    }
    (item.toppings || []).forEach(key => {
      const t = catalog.toppings.find(x => x.key === key);
      if (t) line += t.price;
    });
    return line * (item.qty || 1);
  }
  function priceCart(items) { return (items || []).reduce((s, i) => s + priceItem(i), 0); }

  /* --------------------------------------------------------- guest ------- */
  async function placeOrder(payload) {
    if (LIVE) {
      const { data, error } = await sb.rpc('place_order', { payload });
      if (error) throw new Error(error.message);
      write(LS.myOrder, data);
      return data;
    }
    seedLocal();
    const orders = read(LS.orders, []);
    const total = priceCart(payload.items);
    const row = {
      id: uid('ord'),
      order_number: 'K-' + String(orders.length + 1).padStart(4, '0'),
      public_token: uid('tok'),
      order_type: payload.order_type,
      table_number: payload.table_number || null,
      customer_name: payload.customer_name,
      customer_phone: payload.customer_phone || null,
      address: payload.address || null,
      lat: payload.lat || null, lng: payload.lng || null,
      items: payload.items,
      total_price: total,
      status: 'received',
      eta_minutes: null, eta_set_at: null, shortage_flag: null,
      created_at: new Date().toISOString()
    };
    orders.push(row);
    write(LS.orders, orders);
    const res = { id: row.id, order_number: row.order_number, token: row.public_token, total_price: total };
    write(LS.myOrder, res);
    return res;
  }

  async function orderStatus(token) {
    if (LIVE) {
      const { data, error } = await sb.rpc('order_status', { p_token: token });
      if (error) throw new Error(error.message);
      return data;
    }
    const o = read(LS.orders, []).find(x => x.public_token === token);
    if (!o) return null;
    return {
      order_number: o.order_number, status: o.status,
      eta_minutes: o.eta_minutes, eta_set_at: o.eta_set_at,
      shortage: o.shortage_flag, total_price: o.total_price
    };
  }

  /* --------------------------------------------------------- staff ------- */
  function staffToken() { const s = read(LS.session, null); return s && s.role === 'staff' ? s.token : null; }

  async function staffLogin(name, passcode) {
    if (LIVE) {
      const { data, error } = await sb.rpc('staff_login', { p_name: name, p_pass: passcode });
      if (error) throw new Error(error.message);
      if (!data.ok) return data;
      write(LS.session, { role: 'staff', token: data.token, name: data.name });
      return data;
    }
    seedLocal();
    const s = read(LS.staff, []).find(x => x.name === name && x.passcode === passcode);
    if (!s) return { ok: false, error: 'Wrong name or passcode' };
    if (!s.is_active) return { ok: false, error: 'This account is disabled' };
    write(LS.session, { role: 'staff', token: s.id, name: s.name });
    return { ok: true, token: s.id, name: s.name };
  }

  async function staffOrders() {
    if (LIVE) {
      const { data, error } = await sb.rpc('staff_orders', { p_token: staffToken() });
      if (error) throw new Error(error.message);
      return data || [];
    }
    return read(LS.orders, [])
      .filter(o => ['received', 'preparing', 'ready'].includes(o.status))
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  }

  function localPatchOrder(id, patch) {
    const orders = read(LS.orders, []);
    const i = orders.findIndex(o => o.id === id);
    if (i === -1) return;
    orders[i] = Object.assign({}, orders[i], patch);
    write(LS.orders, orders);
  }

  async function staffSetStatus(id, status) {
    if (LIVE) {
      const { error } = await sb.rpc('staff_set_status', { p_token: staffToken(), p_order: id, p_status: status });
      if (error) throw new Error(error.message);
      return;
    }
    localPatchOrder(id, { status });
  }

  async function staffSetEta(id, minutes) {
    if (LIVE) {
      const { error } = await sb.rpc('staff_set_eta', { p_token: staffToken(), p_order: id, p_minutes: minutes });
      if (error) throw new Error(error.message);
      return;
    }
    localPatchOrder(id, { eta_minutes: minutes, eta_set_at: new Date().toISOString() });
  }

  async function staffFlagShortage(id, item) {
    if (LIVE) {
      const { error } = await sb.rpc('staff_flag_shortage', { p_token: staffToken(), p_order: id, p_item: item || '' });
      if (error) throw new Error(error.message);
      return;
    }
    localPatchOrder(id, { shortage_flag: item || null });
  }

  async function staffInventory() {
    if (LIVE) {
      const { data, error } = await sb.rpc('staff_inventory', { p_token: staffToken() });
      if (error) throw new Error(error.message);
      return data || [];
    }
    seedLocal();
    return read(LS.inventory, []);
  }

  async function staffAdjustInventory(key, delta) {
    if (LIVE) {
      const { error } = await sb.rpc('staff_adjust_inventory', { p_token: staffToken(), p_key: key, p_delta: delta });
      if (error) throw new Error(error.message);
      return;
    }
    const inv = read(LS.inventory, []);
    const i = inv.findIndex(x => x.key === key);
    if (i > -1) { inv[i].qty = Math.max(0, inv[i].qty + delta); write(LS.inventory, inv); }
  }

  /* --------------------------------------------------------- admin ------- */
  async function adminLogin(email, password) {
    if (LIVE) {
      const { data, error } = await sb.auth.signInWithPassword({ email, password });
      if (error) return { ok: false, error: error.message };
      const { data: adm } = await sb.from('admins').select('full_name, is_active').eq('user_id', data.user.id).maybeSingle();
      if (!adm || !adm.is_active) {
        await sb.auth.signOut();
        return { ok: false, error: 'This account has no admin access' };
      }
      write(LS.session, { role: 'admin', name: adm.full_name || email });
      return { ok: true, name: adm.full_name || email };
    }
    const a = SEED.demoAdmin || {};
    if (email === a.email && password === a.password) {
      write(LS.session, { role: 'admin', name: a.name });
      return { ok: true, name: a.name };
    }
    return { ok: false, error: 'Wrong email or password' };
  }

  async function adminSession() {
    const s = read(LS.session, null);
    if (!s || s.role !== 'admin') return null;
    if (LIVE) {
      const { data } = await sb.auth.getSession();
      if (!data.session) { localStorage.removeItem(LS.session); return null; }
    }
    return s;
  }

  async function logout() {
    if (LIVE) { try { await sb.auth.signOut(); } catch (e) {} }
    localStorage.removeItem(LS.session);
  }

  async function adminStats() {
    if (LIVE) {
      const { data, error } = await sb.rpc('admin_stats');
      if (error) throw new Error(error.message);
      return data;
    }
    const orders = read(LS.orders, []);
    const today = new Date().toDateString();
    const isToday = o => new Date(o.created_at).toDateString() === today;
    return {
      orders_total: orders.length,
      revenue_total: orders.reduce((s, o) => s + o.total_price, 0),
      orders_today: orders.filter(isToday).length,
      revenue_today: orders.filter(isToday).reduce((s, o) => s + o.total_price, 0),
      active: orders.filter(o => ['received', 'preparing', 'ready'].includes(o.status)).length,
      invented: orders.reduce((s, o) => s + (o.items || []).filter(i => i.kind === 'custom').length, 0)
    };
  }

  async function adminOrders(limit) {
    if (LIVE) {
      const { data, error } = await sb.from('orders').select('*')
        .order('created_at', { ascending: false }).limit(limit || 100);
      if (error) throw new Error(error.message);
      return data || [];
    }
    return read(LS.orders, []).slice().reverse();
  }

  async function adminStaff() {
    if (LIVE) {
      const { data, error } = await sb.from('staff')
        .select('id, name, is_active, created_at').order('created_at');
      if (error) throw new Error(error.message);
      return data || [];
    }
    seedLocal();
    return read(LS.staff, []);
  }

  async function adminCreateStaff(name, passcode) {
    if (LIVE) {
      const { data, error } = await sb.rpc('admin_create_staff', { p_name: name, p_pass: passcode });
      if (error) throw new Error(error.message);
      return data;
    }
    const list = read(LS.staff, []);
    if (list.some(s => s.name === name)) return { ok: false, error: 'That name is already taken' };
    list.push({ id: uid('stf'), name, passcode, is_active: true });
    write(LS.staff, list);
    return { ok: true };
  }

  async function adminSetStaffActive(id, active) {
    if (LIVE) {
      const { error } = await sb.from('staff').update({ is_active: active, session_token: null }).eq('id', id);
      if (error) throw new Error(error.message);
      return;
    }
    const list = read(LS.staff, []);
    const i = list.findIndex(s => s.id === id);
    if (i > -1) { list[i].is_active = active; write(LS.staff, list); }
  }

  async function adminDeleteStaff(id) {
    if (LIVE) {
      const { error } = await sb.from('staff').delete().eq('id', id);
      if (error) throw new Error(error.message);
      return;
    }
    write(LS.staff, read(LS.staff, []).filter(s => s.id !== id));
  }

  async function adminInventory() {
    if (LIVE) {
      const { data, error } = await sb.from('inventory').select('*').order('name');
      if (error) throw new Error(error.message);
      return data || [];
    }
    seedLocal();
    return read(LS.inventory, []);
  }

  async function adminSetInventory(key, qty) {
    if (LIVE) {
      const { error } = await sb.from('inventory').update({ qty }).eq('key', key);
      if (error) throw new Error(error.message);
      return;
    }
    const inv = read(LS.inventory, []);
    const i = inv.findIndex(x => x.key === key);
    if (i > -1) { inv[i].qty = Math.max(0, qty); write(LS.inventory, inv); }
  }


  /* ------------------------------------------------- creations & fame --- */
  /** A finished custom drink is filed so it can be rated and, one day, promoted. */
  async function recordCreation(c) {
    if (LIVE) {
      const { error } = await sb.from('creations').insert({
        order_id: c.order_id || null, name: c.name, customer_name: c.customer_name || null,
        recipe: c.recipe || {}, build: c.build || {}, price: c.price || 0
      });
      if (error) throw new Error(error.message);
      return;
    }
    const list = read(LS.creations, []);
    list.push(Object.assign({ id: uid('cr'), rating_sum: 0, rating_count: 0,
                              promoted: false, created_at: new Date().toISOString() }, c));
    write(LS.creations, list);
  }

  async function listCreations() {
    if (LIVE) {
      const { data, error } = await sb.from('creations').select('*')
        .order('rating_count', { ascending: false }).limit(100);
      if (error) throw new Error(error.message);
      return data || [];
    }
    return read(LS.creations, []).slice().reverse();
  }

  async function rateCreation(id, stars) {
    if (LIVE) {
      const { data, error } = await sb.rpc('rate_creation', { p_id: id, p_stars: stars });
      if (error) throw new Error(error.message);
      return data;
    }
    const list = read(LS.creations, []);
    const i = list.findIndex(c => c.id === id);
    if (i === -1) return null;
    list[i].rating_sum += stars; list[i].rating_count += 1;
    write(LS.creations, list);
    return { avg: +(list[i].rating_sum / list[i].rating_count).toFixed(2), count: list[i].rating_count };
  }

  async function promoteCreation(id, menuName, price) {
    if (LIVE) {
      const { data, error } = await sb.rpc('admin_promote_creation',
        { p_id: id, p_menu_name: menuName, p_price: price });
      if (error) throw new Error(error.message);
      await loadCatalogFromSupabase();
      return data;
    }
    const list = read(LS.creations, []);
    const c = list.find(x => x.id === id);
    if (!c) return null;
    c.promoted = true;
    write(LS.creations, list);
    catalog.menu.push({
      id: 'signature_' + id, name: menuName, category: 'Signature',
      tagline: 'ابتكار ' + (c.customer_name || 'أحد عملائنا') + ' — دلوقتي على المنيو',
      price: price || c.price || 0, art: '#7B1E3E', recipe: c.recipe || {}
    });
    write('kora_menu_extra', catalog.menu.filter(m => m.category === 'Signature'));
    return { ok: true };
  }

  /* ---------------------------------------------------- challenges ----- */
  async function listChallenges(all) {
    if (LIVE) {
      let q = sb.from('challenges').select('*').order('created_at', { ascending: false });
      if (!all) q = q.eq('is_active', true);
      const { data, error } = await q;
      if (error) throw new Error(error.message);
      return data || [];
    }
    const list = read(LS.challenges, []);
    return all ? list : list.filter(c => c.is_active);
  }

  async function saveChallenge(c) {
    if (LIVE) {
      const { error } = c.id
        ? await sb.from('challenges').update(c).eq('id', c.id)
        : await sb.from('challenges').insert(c);
      if (error) throw new Error(error.message);
      return;
    }
    const list = read(LS.challenges, []);
    if (c.id) {
      const i = list.findIndex(x => x.id === c.id);
      if (i > -1) list[i] = Object.assign(list[i], c);
    } else {
      list.push(Object.assign({ id: uid('ch'), is_active: true, created_at: new Date().toISOString() }, c));
    }
    write(LS.challenges, list);
  }

  async function deleteChallenge(id) {
    if (LIVE) {
      const { error } = await sb.from('challenges').delete().eq('id', id);
      if (error) throw new Error(error.message);
      return;
    }
    write(LS.challenges, read(LS.challenges, []).filter(c => c.id !== id));
  }

  /* ----------------------------------------------------------- boot ------ */
  let readyPromise = null;
  function ready() {
    if (readyPromise) return readyPromise;
    readyPromise = (async () => {
      if (LIVE) {
        if (!global.supabase || !global.supabase.createClient) {
          throw new Error('supabase-js failed to load');
        }
        sb = global.supabase.createClient(CFG.url, CFG.anonKey);
        await loadCatalogFromSupabase();
      } else {
        seedLocal();
        const extra = read('kora_menu_extra', []);
        extra.forEach(m => { if (!catalog.menu.some(x => x.id === m.id)) catalog.menu.push(m); });
      }
      return true;
    })();
    return readyPromise;
  }

  global.KoraAPI = {
    LIVE, mode: LIVE ? 'supabase' : 'local',
    ready, catalog,
    priceItem, priceCart,
    placeOrder, orderStatus,
    staffLogin, staffOrders, staffSetStatus, staffSetEta, staffFlagShortage,
    staffInventory, staffAdjustInventory, staffToken,
    adminLogin, adminSession, adminStats, adminOrders, adminStaff,
    adminCreateStaff, adminSetStaffActive, adminDeleteStaff,
    adminInventory, adminSetInventory,
    recordCreation, listCreations, rateCreation, promoteCreation,
    listChallenges, saveChallenge, deleteChallenge,
    logout,
    session: () => read(LS.session, null),
    myOrder: () => read(LS.myOrder, null),
    money: (n) => Math.round(Number(n) || 0) + ' ' + catalog.currency,
    LS
  };
})(window);
