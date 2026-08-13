/* =========================================================================
   كورة - بيانات تجريبية (Placeholder Demo Data)
   ⚠️ دي بيانات وهمية للتجربة بس — هتتستبدل بالمنيو والوصفات الحقيقية
   اللي هيديها صاحب الكافيه. الأسعار والمقادير هنا مش نهائية.
   ========================================================================= */
window.KORRA_SEED = {

  // ---------------------------------------------------------------------
  // منيو المشروبات الجاهزة
  // ---------------------------------------------------------------------
  menu: [
    {
      id: 'espresso_captain',
      name: 'إسبريسو الكابتن',
      emoji: '☕',
      desc: 'شوت إسبريسو مركّز زي ضربة جزاء ماخدتش غلط',
      basePrice: 35,
      baseRecipe: { coffee: 18, water: 30 },
      category: 'ساخن'
    },
    {
      id: 'latte_stadium',
      name: 'لاتيه الملعب',
      emoji: '🥛',
      desc: 'إسبريسو + حليب مبخر ناعم، تعادل إيجابي في كل رشفة',
      basePrice: 55,
      baseRecipe: { coffee: 18, milk_full: 200, foam: 20 },
      category: 'ساخن'
    },
    {
      id: 'mocha_korra',
      name: 'كورة موكا',
      emoji: '🍫',
      desc: 'إسبريسو + شوكولاتة + حليب، هدف في الشباك من أول رشفة',
      basePrice: 60,
      baseRecipe: { coffee: 18, milk_full: 180, chocolate_syrup: 20 },
      category: 'ساخن'
    },
    {
      id: 'hibiscus_terso',
      name: 'كركديه الترسو',
      emoji: '🌺',
      desc: 'كركديه بارد منعش، بيبرد الدماغ زي مدرب هادي',
      basePrice: 40,
      baseRecipe: { hibiscus: 15, water: 200, ice: 100, sugar: 15 },
      category: 'بارد'
    },
    {
      id: 'frappe_derby',
      name: 'فرابيه الديربي',
      emoji: '🧊',
      desc: 'قهوة مثلجة مخفوقة، إثارة من أول صافرة لحد الآخر',
      basePrice: 65,
      baseRecipe: { coffee: 18, milk_full: 150, ice: 100, sugar: 20 },
      category: 'بارد'
    },
    {
      id: 'tea_korra_mint',
      name: 'شاي كورة بالنعناع',
      emoji: '🍵',
      desc: 'كلاسيكي وميعرفش يخسر، شاي أحمر بالنعناع الطازة',
      basePrice: 25,
      baseRecipe: { tea: 5, water: 200, mint: 5, sugar: 15 },
      category: 'ساخن'
    },
    {
      id: 'iced_caramel_referee',
      name: 'آيس كراميل الحكم',
      emoji: '🧑‍⚖️',
      desc: 'كراميل بالحليب البارد، القرار النهائي ومفيش اعتراض',
      basePrice: 65,
      baseRecipe: { coffee: 18, milk_full: 180, caramel_syrup: 20, ice: 100 },
      category: 'بارد'
    }
  ],

  // ---------------------------------------------------------------------
  // مكونات قابلة للتخصيص على أي مشروب جاهز (زيادة/نقصان) + سعر الوحدة
  // key لازم يطابق مفاتيح baseRecipe و ingredientCatalog
  // ---------------------------------------------------------------------
  customizations: [
    { key: 'condensed_milk', name: 'حليب مكثف', unit: 'جم', step: 10, unitPrice: 5, min: 0, max: 60 },
    { key: 'coffee', name: 'شوت إسبريسو إضافي', unit: 'شوت (18جم)', step: 18, unitPrice: 10, min: 0, max: 54 },
    { key: 'caramel_syrup', name: 'سيرب كراميل', unit: 'مل', step: 10, unitPrice: 4, min: 0, max: 50 },
    { key: 'vanilla_syrup', name: 'سيرب فانيليا', unit: 'مل', step: 10, unitPrice: 4, min: 0, max: 50 },
    { key: 'chocolate_syrup', name: 'شوكولاتة إضافية', unit: 'جم', step: 10, unitPrice: 4, min: 0, max: 50 },
    { key: 'ice', name: 'تلج إضافي', unit: 'جم', step: 50, unitPrice: 2, min: 0, max: 200 },
    { key: 'whipped_cream', name: 'كريمة توب', unit: 'جم', step: 20, unitPrice: 6, min: 0, max: 60 },
    { key: 'honey', name: 'تحلية بالعسل بدل السكر', unit: 'جم', step: 10, unitPrice: 3, min: 0, max: 30 }
  ],

  // ---------------------------------------------------------------------
  // خامات "ابتكر مشروبك" من الصفر — بيتبني منها المشروب بالكامل
  // ---------------------------------------------------------------------
  buildCatalog: {
    base: [
      { key: 'base_espresso', name: 'شوت إسبريسو', unit: 'شوت (18جم)', unitPrice: 12 },
      { key: 'base_tea', name: 'شاي أحمر', unit: 'كيس', unitPrice: 8 },
      { key: 'base_hibiscus', name: 'كركديه', unit: '15جم', unitPrice: 10 },
      { key: 'base_water', name: 'من غير قاعدة (مية بس)', unit: '-', unitPrice: 0 }
    ],
    milk: [
      { key: 'milk_full', name: 'حليب كامل الدسم', unit: '100مل', unitPrice: 5 },
      { key: 'milk_light', name: 'حليب لايت', unit: '100مل', unitPrice: 5 },
      { key: 'milk_oat', name: 'حليب شوفان (نباتي)', unit: '100مل', unitPrice: 8 },
      { key: 'milk_none', name: 'من غير حليب', unit: '-', unitPrice: 0 }
    ],
    syrup: [
      { key: 'syrup_caramel', name: 'سيرب كراميل', unit: '10مل', unitPrice: 4 },
      { key: 'syrup_vanilla', name: 'سيرب فانيليا', unit: '10مل', unitPrice: 4 },
      { key: 'syrup_hazelnut', name: 'سيرب بندق', unit: '10مل', unitPrice: 4 },
      { key: 'syrup_strawberry', name: 'سيرب فراولة', unit: '10مل', unitPrice: 4 }
    ],
    topping: [
      { key: 'top_cream', name: 'كريمة', unit: 'وحدة', unitPrice: 5 },
      { key: 'top_cocoa', name: 'رشة كاكاو', unit: 'وحدة', unitPrice: 3 },
      { key: 'top_cinnamon', name: 'رشة قرفة', unit: 'وحدة', unitPrice: 3 },
      { key: 'top_cookie', name: 'بسكويت مطحون', unit: 'وحدة', unitPrice: 5 }
    ],
    sweetener: [
      { key: 'sweet_sugar', name: 'سكر عادي', unit: '-', unitPrice: 0 },
      { key: 'sweet_diet', name: 'تحلية دايت', unit: '-', unitPrice: 0 },
      { key: 'sweet_honey', name: 'عسل نحل', unit: '10جم', unitPrice: 3 },
      { key: 'sweet_none', name: 'من غير تحلية', unit: '-', unitPrice: 0 }
    ]
  },

  // ---------------------------------------------------------------------
  // محطات محاكاة المطبخ الإجبارية (للمشروبات المبتكرة) — بالترتيب
  // ---------------------------------------------------------------------
  kitchenStations: [
    { id: 'cup', title: 'اختيار الكوب', hint: 'حدد حجم الكوب المناسب', type: 'choice', options: ['صغير', 'وسط', 'كبير'] },
    { id: 'base', title: 'محطة القاعدة', hint: 'اسكب قاعدة المشروب بالكمية الصح', type: 'range', unit: 'مل', min: 30, max: 250, default: 150 },
    { id: 'milk', title: 'محطة الحليب', hint: 'ظبط كمية الحليب بالمل', type: 'range', unit: 'مل', min: 0, max: 300, default: 150 },
    { id: 'syrup', title: 'محطة السيرب', hint: 'متزودش في السيرب.. حلاوة زيادة نكهتها بايظة', type: 'range', unit: 'مل', min: 0, max: 60, default: 15 },
    { id: 'ice', title: 'محطة التلج', hint: 'كمية التلج المناسبة', type: 'range', unit: 'جم', min: 0, max: 200, default: 80 },
    { id: 'topping', title: 'محطة التوبينج', hint: 'اختار التوبينج اللي يعجبك (اختياري)', type: 'multi', options: ['كريمة', 'كاكاو', 'قرفة', 'بسكويت'] },
    { id: 'serve', title: 'التسليم', hint: 'اكتب اسمك على الكوب وسلّم الطلب', type: 'final' }
  ],

  // ---------------------------------------------------------------------
  // المخزون الأولي (بالجرام/مل) — أرقام تجريبية
  // ---------------------------------------------------------------------
  inventory: {
    coffee: 5000,
    milk_full: 10000,
    milk_light: 6000,
    milk_oat: 3000,
    caramel_syrup: 2000,
    vanilla_syrup: 2000,
    hazelnut_syrup: 1500,
    strawberry_syrup: 1500,
    chocolate_syrup: 2000,
    hibiscus: 1000,
    tea: 1000,
    ice: 20000,
    whipped_cream: 1500,
    condensed_milk: 1000,
    honey: 800,
    sugar: 5000
  },

  // ---------------------------------------------------------------------
  // ترجمة أسماء مكونات الوصفة الأساسية (لعرضها بالعربي عند الباريستا)
  // ---------------------------------------------------------------------
  ingredientLabels: {
    coffee: { name: 'بن/إسبريسو', unit: 'جم' },
    water: { name: 'مية', unit: 'مل' },
    milk_full: { name: 'حليب كامل الدسم', unit: 'مل' },
    milk_light: { name: 'حليب لايت', unit: 'مل' },
    milk_oat: { name: 'حليب شوفان', unit: 'مل' },
    foam: { name: 'رغوة حليب', unit: 'جم' },
    chocolate_syrup: { name: 'شوكولاتة', unit: 'جم' },
    hibiscus: { name: 'كركديه', unit: 'جم' },
    ice: { name: 'تلج', unit: 'جم' },
    sugar: { name: 'سكر', unit: 'جم' },
    tea: { name: 'شاي', unit: 'جم' },
    mint: { name: 'نعناع', unit: 'جم' },
    caramel_syrup: { name: 'سيرب كراميل', unit: 'مل' },
    vanilla_syrup: { name: 'سيرب فانيليا', unit: 'مل' },
    hazelnut_syrup: { name: 'سيرب بندق', unit: 'مل' },
    strawberry_syrup: { name: 'سيرب فراولة', unit: 'مل' },
    condensed_milk: { name: 'حليب مكثف', unit: 'جم' },
    whipped_cream: { name: 'كريمة', unit: 'جم' },
    honey: { name: 'عسل', unit: 'جم' }
  },

  // ---------------------------------------------------------------------
  // حسابات ديمو (للتجربة فقط — مش نظام أمان حقيقي)
  // ---------------------------------------------------------------------
  demoAdmin: { email: 'admin@korra.demo', password: 'korra2026', name: 'أحمد (أدمن)' },
  demoBaristas: [
    { id: 'b1', name: 'باريستا تجريبي', password: '1234', active: true }
  ]
};
