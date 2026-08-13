/* =========================================================================
   كورة - الماسكوت "الكابتن كوري" ☕⚽
   شخصية كوميدية بتعليقات مصرية عامية، بتظهر جنب العميل أثناء التخصيص
   وابتكار المشروبات. المحتوى ده من كتابتي (مش من صاحب الكافيه) حسب الاتفاق.
   ========================================================================= */
(function (global) {
  'use strict';

  const PHRASES = {
    greeting: [
      'أهلاً بيك في كورة يا بطل! جاهز تسجل هدف طعم النهارده؟ ⚽',
      'إزيك يا كابتن، عايز تشرب إيه النهارده وللا هنعمل تشكيلة جديدة؟',
      'الملعب مستنيك.. يعني الكوباية مستنياك 😄'
    ],
    limitExceeded: [
      'ياعم كفاية كده! ده مشروب مش بحر إسكندرية 😅',
      'إنت عايز تعمل طوفان سيرب ولا تشرب قهوة؟ رجّعها شوية',
      'كده هتبقى حلاوة طحينية مش مشروب.. خفف شوية 🙈',
      'الحكم بيدي إنذار.. الكمية زيادة عن اللازم 🟨'
    ],
    limitTooLow: [
      'كده هتشرب مية بس يا كبير، زوّد شوية 💧',
      'فاضي أوي كده.. المشروب عايز يحس بيك'
    ],
    working: [
      'استنى بس وانا باخد أنفاسي، الشغل ده مش هزار 😌',
      'شكل حلو اللي بتعمله ده.. عندك دم فنان',
      'لسه شوية وهنبقى جاهزين، الصبر مفتاح الفرج',
      'إحنا في الوقت المستقطع للمشروب، شوية وخلاص ⏱️'
    ],
    customDrinkStart: [
      'يلا بينا مطبخ! هتعمل مشروب من مخيلتك بس لازم تتابع كل خطوة زي الكابتن الشاطر ⚽☕',
      'مفيش تخطي هنا يا نجم.. كل خطوة ليها قيمتها زي الباص الدقيق'
    ],
    orderSubmitted: [
      'تمام يا كبير! الطلب راح للباريستا، استنى الصافرة 🏁',
      'الطلب اتسجل رسمي في السجلات.. هدف نظيف مفيش تسلل! ⚽',
      'وصل الطلب بسلامة، الباريستا دلوقتي بيسخن 🔥'
    ],
    invalidStep: [
      'لأ يا كبير، لازم تظبط الخطوة دي الأول قبل ما نكمل',
      'مينفعش نستعجل.. كل حاجة في وقتها زي الماتش'
    ],
    idle: [
      'لسه واقف؟ يلا حرك القرار 😄',
      'خد وقتك بس متنساش إنك جعان 😅'
    ]
  };

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function injectStyles() {
    if (document.getElementById('korra-mascot-style')) return;
    const s = document.createElement('style');
    s.id = 'korra-mascot-style';
    s.textContent = `
      .korra-mascot-wrap {
        position: fixed; left: 16px; bottom: 16px; z-index: 9999;
        display: flex; align-items: flex-end; gap: 10px;
        font-family: 'Cairo', sans-serif; pointer-events: none;
      }
      .korra-mascot-bubble {
        max-width: 240px; background: #fff; color: #1a1a1a;
        border-radius: 16px 16px 16px 4px; padding: 10px 14px;
        font-size: 0.85rem; font-weight: 600; line-height: 1.5;
        box-shadow: 0 8px 24px rgba(0,0,0,0.18);
        opacity: 0; transform: translateY(8px) scale(0.9);
        transition: all .25s ease; margin-bottom: 6px;
      }
      .korra-mascot-bubble.show { opacity: 1; transform: translateY(0) scale(1); }
      .korra-mascot-avatar {
        width: 56px; height: 56px; border-radius: 50%;
        background: linear-gradient(135deg,#6b3f1d,#3d2412);
        display: flex; align-items: center; justify-content: center;
        font-size: 1.8rem; box-shadow: 0 6px 18px rgba(0,0,0,0.3);
        border: 3px solid #f4b942; flex-shrink: 0;
        animation: korra-bounce 2.4s ease-in-out infinite;
        pointer-events: auto;
      }
      @keyframes korra-bounce { 0%,100%{ transform: translateY(0);} 50%{ transform: translateY(-6px);} }
      @media (max-width: 480px) {
        .korra-mascot-bubble { max-width: 170px; font-size: 0.78rem; }
        .korra-mascot-avatar { width: 46px; height: 46px; font-size: 1.4rem; }
      }
    `;
    document.head.appendChild(s);
  }

  let bubbleTimer = null;

  function ensureDom() {
    injectStyles();
    let wrap = document.querySelector('.korra-mascot-wrap');
    if (wrap) return wrap;
    wrap = document.createElement('div');
    wrap.className = 'korra-mascot-wrap';
    wrap.innerHTML = `
      <div class="korra-mascot-bubble" id="korraMascotBubble"></div>
      <div class="korra-mascot-avatar" title="الكابتن كوري">☕</div>
    `;
    document.body.appendChild(wrap);
    return wrap;
  }

  const KorraMascot = {
    say(text, ms) {
      ensureDom();
      const bubble = document.getElementById('korraMascotBubble');
      bubble.textContent = text;
      bubble.classList.add('show');
      clearTimeout(bubbleTimer);
      bubbleTimer = setTimeout(() => bubble.classList.remove('show'), ms || 4200);
    },
    greet() { this.say(pick(PHRASES.greeting)); },
    limitExceeded() { this.say(pick(PHRASES.limitExceeded)); },
    limitTooLow() { this.say(pick(PHRASES.limitTooLow)); },
    working() { this.say(pick(PHRASES.working)); },
    customDrinkStart() { this.say(pick(PHRASES.customDrinkStart), 5000); },
    orderSubmitted() { this.say(pick(PHRASES.orderSubmitted), 5000); },
    invalidStep() { this.say(pick(PHRASES.invalidStep)); },
    idle() { this.say(pick(PHRASES.idle)); }
  };

  global.KorraMascot = KorraMascot;
})(window);
