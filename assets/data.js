/* ==========================================================================
   Kora — Seed data (bubble tea & specialty drinks)
   NOTE: placeholder menu & pricing. Swap these values for the real menu.
   The same shape is mirrored in supabase/schema.sql, so replacing the menu
   later means editing this file + re-running the seed insert. Nothing else.
   ========================================================================== */
window.KORA_SEED = {

  /* ---------------- Drinks ---------------- */
  // Each drink may carry `image: 'https://…'`. When it is set the menu shows
  // the photo; when it is missing Kora draws the cup instead, tinted with
  // `art`. Both paths work everywhere, so photos can be added one at a time.
  menu: [
    { id:'brown_sugar_boba', name:'Brown Sugar Boba', category:'Milk Tea', tagline:'Caramelised brown sugar, fresh milk, warm boba', price:85, art:'#7B1E3E',
      recipe:{ black_tea:120, milk:180, brown_sugar_syrup:35, tapioca:80 } },
    { id:'classic_milk_tea', name:'Classic Milk Tea', category:'Milk Tea', tagline:'The original — strong black tea, creamy finish', price:70, art:'#94264C',
      recipe:{ black_tea:150, milk:150, cane_sugar:25, tapioca:80 } },
    { id:'taro_milk_tea', name:'Taro Milk Tea', category:'Milk Tea', tagline:'Stone-ground taro, silky and a little nutty', price:90, art:'#8E6BAF',
      recipe:{ taro_powder:35, milk:200, cane_sugar:20, tapioca:80 } },
    { id:'matcha_latte', name:'Matcha Cloud Latte', category:'Milk Tea', tagline:'Ceremonial matcha under a cheese-foam cloud', price:95, art:'#5C8A4A',
      recipe:{ matcha:8, milk:220, cane_sugar:20, cheese_foam:40 } },
    { id:'thai_tea', name:'Thai Tea', category:'Milk Tea', tagline:'Spiced Thai leaves, condensed milk, unmistakable', price:85, art:'#C4762A',
      recipe:{ thai_tea:130, condensed_milk:45, milk:120, tapioca:80 } },

    { id:'passion_green', name:'Passion Fruit Green Tea', category:'Fruit Tea', tagline:'Jasmine green tea, real passion fruit, popping boba', price:80, art:'#D19A1D',
      recipe:{ green_tea:200, passion_puree:50, cane_sugar:20, popping_boba:60 } },
    { id:'strawberry_burst', name:'Strawberry Burst', category:'Fruit Tea', tagline:'Crushed strawberry over iced green tea', price:85, art:'#C2334D',
      recipe:{ green_tea:180, strawberry_puree:60, cane_sugar:20, popping_boba:60 } },
    { id:'mango_tango', name:'Mango Tango', category:'Fruit Tea', tagline:'Alphonso mango, light tea base, aloe bits', price:90, art:'#E09B1F',
      recipe:{ green_tea:160, mango_puree:70, cane_sugar:20, aloe:60 } },
    { id:'lychee_rose', name:'Lychee Rose', category:'Fruit Tea', tagline:'Lychee and a whisper of rose — floral and clean', price:90, art:'#D2708F',
      recipe:{ green_tea:190, lychee_syrup:45, rose_water:5, popping_boba:60 } },

    { id:'oreo_cream', name:'Cookies & Cream', category:'Specialty', tagline:'Blended cookie crumble, milk, whipped top', price:100, art:'#3A3A41',
      recipe:{ milk:220, cookie_crumble:45, cane_sugar:25, whipped_cream:35 } },
    { id:'coffee_boba', name:'Coffee Boba', category:'Specialty', tagline:'Double espresso, milk, brown sugar boba', price:95, art:'#5A3A22',
      recipe:{ espresso:40, milk:200, brown_sugar_syrup:30, tapioca:80 } },
    { id:'coconut_dream', name:'Coconut Dream', category:'Specialty', tagline:'Coconut milk, grass jelly, gently sweet', price:90, art:'#7FA5A0',
      recipe:{ coconut_milk:220, cane_sugar:20, grass_jelly:70 } }
  ],

  /* ---------------- Toppings (priced individually) ---------------- */
  toppings: [
    { key:'tapioca',      name:'Boba Pearls',  price:12, unit:'g', portion:80 },
    { key:'popping_boba', name:'Popping Boba',    price:14, unit:'g', portion:60 },
    { key:'grass_jelly',  name:'Grass Jelly',     price:12, unit:'g', portion:70 },
    { key:'pudding',      name:'Egg Pudding',     price:14, unit:'g', portion:70 },
    { key:'aloe',         name:'Aloe Vera',       price:12, unit:'g', portion:60 },
    { key:'cheese_foam',  name:'Cheese Foam',     price:18, unit:'g', portion:40 },
    { key:'red_bean',     name:'Red Bean',        price:14, unit:'g', portion:70 },
    { key:'coconut_jelly',name:'Coconut Jelly',   price:12, unit:'g', portion:70 },
    { key:'whipped_cream',name:'Whipped Cream',   price:10, unit:'g', portion:35 },
    { key:'extra_espresso',name:'Extra Espresso Shot', price:15, unit:'ml', portion:20 }
  ],

  /* ---------------- Free choices ---------------- */
  sizes: [
    { key:'regular', name:'Regular · 500ml', priceDelta:0,  scale:1 },
    { key:'large',   name:'Large · 700ml',   priceDelta:15, scale:1.4 }
  ],
  sugarLevels: [
    { key:'0',   name:'0% · No sugar' },
    { key:'25',  name:'25% · Light' },
    { key:'50',  name:'50% · Half' },
    { key:'75',  name:'75% · Less' },
    { key:'100', name:'100% · Standard' }
  ],
  iceLevels: [
    { key:'0',   name:'No ice' },
    { key:'25',  name:'Light ice' },
    { key:'50',  name:'Half ice' },
    { key:'100', name:'Regular ice' }
  ],
  milkOptions: [
    { key:'whole',    name:'Whole Milk',    priceDelta:0 },
    { key:'skim',     name:'Skim Milk',     priceDelta:0 },
    { key:'oat',      name:'Oat Milk',      priceDelta:12 },
    { key:'almond',   name:'Almond Milk',   priceDelta:12 },
    { key:'none',     name:'No Milk',       priceDelta:0 }
  ],

  /* ---------------- Build-your-own catalogue ---------------- */
  buildCatalog: {
    base: [
      { key:'black_tea',   name:'Black Tea',       price:18 },
      { key:'green_tea',   name:'Jasmine Green Tea', price:18 },
      { key:'oolong_tea',  name:'Oolong Tea',      price:20 },
      { key:'thai_tea',    name:'Thai Tea',        price:22 },
      { key:'espresso',    name:'Espresso',        price:25 },
      { key:'milk_only',   name:'Milk Base (no tea)', price:15 }
    ],
    creamer: [
      { key:'whole',        name:'Whole Milk',   price:10 },
      { key:'oat',          name:'Oat Milk',     price:18 },
      { key:'almond',       name:'Almond Milk',  price:18 },
      { key:'coconut_milk', name:'Coconut Milk', price:18 },
      { key:'none',         name:'No Creamer',   price:0 }
    ],
    flavor: [
      { key:'brown_sugar_syrup', name:'Brown Sugar', price:12 },
      { key:'taro_powder',       name:'Taro',        price:14 },
      { key:'matcha',            name:'Matcha',      price:16 },
      { key:'strawberry_puree',  name:'Strawberry',  price:14 },
      { key:'mango_puree',       name:'Mango',       price:14 },
      { key:'passion_puree',     name:'Passion Fruit', price:14 },
      { key:'lychee_syrup',      name:'Lychee',      price:14 }
    ]
  },
  craftFee: 20,

  /* ---------------- Kitchen simulation stations ---------------- */
  stations: [
    { id:'style',    title:'المشروب ده هيبقى إيه؟', hint:'اختار الشكل الأول عشان نعرف نشتغل إزاي.',
      type:'choice', options:['آيس','سموزي','ميلك شيك','ساخن'] },
    { id:'cup',      title:'اختار الكوباية',  hint:'كوباية أكبر يعني التزام أكبر 😄',
      type:'choice', options:['عادي 500 مل','كبير 700 مل'] },
    { id:'brew',     title:'اسقي الأساس',     hint:'اقلب الكتلة فوق الكوباية.. براحة على إيدك!',
      type:'range',  unit:'مل', min:80,  max:280, def:180 },
    { id:'creamer',  title:'حط اللبن',        hint:'صبّه بالراحة عشان الشكل يطلع حلو.',
      type:'range',  unit:'مل', min:0,   max:250, def:150 },
    { id:'sweet',    title:'حلّيها',           hint:'براحة على السيرب.. بيتجمّع بسرعة!',
      type:'range',  unit:'مل', min:0,   max:60,  def:25 },
    { id:'scoops',   title:'كام سكوب؟',        hint:'كل سكوب بيتقل المشروب.. متزوّدش.',
      type:'scoops', unit:'سكوب', min:0, max:5,   def:1 },
    { id:'toppings', title:'كبّ البوبا',        hint:'البوبا الأول، دايماً.',
      type:'multi',  options:['بوبا','بوبا بوبينج','جيلي عشب','بودينج','ألوفيرا','رغوة جبنة'] },
    { id:'ice',      title:'ثلّجها',           hint:'تلج كتير بيميّع الطعم.. متغرقهاش.',
      type:'range',  unit:'جم', min:0,   max:220, def:90 },
    { id:'shake',    title:'رجّها',            hint:'امسك الكوباية ورجّها يمين وشمال!',
      type:'shake' },
    { id:'seal',     title:'اقفلها وسمّيها',    hint:'سمّي اختراعك وابعته للبار.',
      type:'final' }
  ],


  /* ---------------- Inventory (starting stock) ---------------- */
  inventory: {
    black_tea:8000, green_tea:8000, oolong_tea:5000, thai_tea:5000, espresso:3000,
    milk:20000, coconut_milk:6000, condensed_milk:3000,
    tapioca:9000, popping_boba:5000, grass_jelly:4000, pudding:3500, aloe:3500,
    cheese_foam:3000, red_bean:3000, coconut_jelly:3000, whipped_cream:2500,
    brown_sugar_syrup:6000, cane_sugar:6000, taro_powder:3000, matcha:1200,
    strawberry_puree:3000, mango_puree:3000, passion_puree:3000, lychee_syrup:2500,
    rose_water:600, cookie_crumble:2500, ice:40000
  },

  /* ---------------- Human-readable ingredient labels ---------------- */
  labels: {
    black_tea:{n:'Black Tea',u:'ml'}, green_tea:{n:'Green Tea',u:'ml'}, oolong_tea:{n:'Oolong Tea',u:'ml'},
    thai_tea:{n:'Thai Tea',u:'ml'}, espresso:{n:'Espresso',u:'ml'},
    milk:{n:'Milk',u:'ml'}, coconut_milk:{n:'Coconut Milk',u:'ml'}, condensed_milk:{n:'Condensed Milk',u:'ml'},
    tapioca:{n:'Boba Pearls',u:'g'}, popping_boba:{n:'Popping Boba',u:'g'}, grass_jelly:{n:'Grass Jelly',u:'g'},
    pudding:{n:'Egg Pudding',u:'g'}, aloe:{n:'Aloe Vera',u:'g'}, cheese_foam:{n:'Cheese Foam',u:'g'},
    red_bean:{n:'Red Bean',u:'g'}, coconut_jelly:{n:'Coconut Jelly',u:'g'}, whipped_cream:{n:'Whipped Cream',u:'g'},
    brown_sugar_syrup:{n:'Brown Sugar Syrup',u:'ml'}, cane_sugar:{n:'Cane Sugar',u:'g'},
    taro_powder:{n:'Taro Powder',u:'g'}, matcha:{n:'Matcha',u:'g'},
    strawberry_puree:{n:'Strawberry Purée',u:'ml'}, mango_puree:{n:'Mango Purée',u:'ml'},
    passion_puree:{n:'Passion Fruit Purée',u:'ml'}, lychee_syrup:{n:'Lychee Syrup',u:'ml'},
    rose_water:{n:'Rose Water',u:'ml'}, cookie_crumble:{n:'Cookie Crumble',u:'g'}, ice:{n:'Ice',u:'g'},
    extra_espresso:{n:'Extra Espresso',u:'ml'}
  },

  /* ---------------- Local demo credentials (local mode only) ---------------- */
  demoAdmin: { email:'admin@kora.local', password:'kora2026', name:'Kora Admin' },
  demoStaff: [ { id:'s1', name:'Demo Barista', passcode:'1234', active:true } ],

  currency: 'EGP'
};
