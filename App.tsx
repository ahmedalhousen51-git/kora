/* Design reminder: Neo-Folk Editorial — the kitchen is the stage; the custom drink builder is the tactile workbench that turns play into a precise bar ticket. */
import { useMemo, useState } from "react";
import { Route, Switch, useLocation } from "wouter";
import { ArrowUpLeft, Beaker, Check, ChefHat, Clock3, Copy, Gauge, Layers3, LockKeyhole, Play, Settings2, Share2, Sparkles, Wand2 } from "lucide-react";
import GameCanvas from "./components/GameCanvas";
import { trpc } from "./lib/trpc";
import "./index.css";

type Option = { id: string; label: string; detail: string; grams: number; calories: number; price: number };
const modes = [
  { path: "/", label: "المطبخ", sub: "المشهد الرئيسي" },
  { path: "/kitchen-sim", label: "المحاكاة", sub: "وردية الصباح" },
  { path: "/barista", label: "الباريستا", sub: "ملف نورة" },
  { path: "/guest", label: "الضيف", sub: "واجهة الطلب" },
  { path: "/admin-dashboard", label: "الإدارة", sub: "لوحة التشغيل" },
];
const inventory: Record<string, Option[]> = {
  base: [
    { id: "espresso", label: "إسبريسو مزدوج", detail: "18g بن / 36g استخلاص", grams: 36, calories: 5, price: 38 },
    { id: "matcha", label: "ماتشا كورا", detail: "2g ماتشا / 60g ماء", grams: 62, calories: 12, price: 45 },
    { id: "coldbrew", label: "كولد برو", detail: "80g قهوة باردة", grams: 80, calories: 8, price: 42 },
  ],
  milk: [
    { id: "oat", label: "حليب شوفان", detail: "120g ميكروفوم", grams: 120, calories: 72, price: 12 },
    { id: "whole", label: "حليب كامل", detail: "120g ميكروفوم", grams: 120, calories: 75, price: 8 },
    { id: "coconut", label: "حليب جوز هند", detail: "110g ميكروفوم", grams: 110, calories: 54, price: 14 },
  ],
  syrup: [
    { id: "date", label: "دبس تمر", detail: "18g نكهة", grams: 18, calories: 54, price: 6 },
    { id: "pistachio", label: "فستق محمص", detail: "15g نكهة", grams: 15, calories: 88, price: 10 },
    { id: "vanilla", label: "فانيليا مدغشقر", detail: "12g نكهة", grams: 12, calories: 36, price: 7 },
  ],
  topping: [
    { id: "foam", label: "رغوة زمردية", detail: "20g finish", grams: 20, calories: 22, price: 8 },
    { id: "cocoa", label: "ككاو على الوش", detail: "4g finish", grams: 4, calories: 12, price: 5 },
    { id: "salt", label: "رشة ملح مدخن", detail: "1g finish", grams: 1, calories: 0, price: 3 },
  ],
};
const stationLabels = [
  { id: "base", label: "01 / الأساس", prompt: "اختار روح المشروب" },
  { id: "milk", label: "02 / القوام", prompt: "ظبط الإحساس" },
  { id: "syrup", label: "03 / الإفيه", prompt: "زود الشخصية" },
  { id: "topping", label: "04 / اللمسة", prompt: "اختمها على مزاجك" },
];
const jokes = ["يا سلام، هذي مو خلطة عادية… هذي بصمتك يا ذويق.", "أبشر، زوّد الرغوة وخلك على هونك.", "الخلطة لو نزلت الستوري بتاخذ الجو كله.", "البار جاهز، والجرامات ما تعرف المجاملة.", "لا تشيل هم، نورة ماسكة الميزان عنك.", "يا كفو، قربنا نطلع مشروب يسولف عن نفسه."];
function AppShell() {
  const [location, navigate] = useLocation();
  const [selections, setSelections] = useState({ base: "espresso", milk: "oat", syrup: "date", topping: "foam" });
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTicket, setShowTicket] = useState(false);
  const [jokeIndex, setJokeIndex] = useState(0);
  const [shared, setShared] = useState(false);
  const [reachedStation, setReachedStation] = useState("bar");
  const [manualStep, setManualStep] = useState(0);
  const [brewSeconds, setBrewSeconds] = useState(0);
  const [brewAngle, setBrewAngle] = useState(0);
  const [iceGrams, setIceGrams] = useState(0);
  const [pumpCount, setPumpCount] = useState(0);
  const [manualFeedback, setManualFeedback] = useState("");
  const aiDialogue = trpc.barista.dialogue.useMutation();
  const active = useMemo(() => modes.find((m) => m.path === location) ?? modes[0], [location]);
  const drink = useMemo(() => stationLabels.map((station) => inventory[station.id].find((item) => item.id === selections[station.id as keyof typeof selections])!).filter(Boolean), [selections]);
  const totals = useMemo(() => drink.reduce((acc, item) => ({ grams: acc.grams + item.grams, calories: acc.calories + item.calories, price: acc.price + item.price }), { grams: 0, calories: 0, price: 0 }), [drink]);
  const drinkName = `${drink[2]?.label.replace("محـ", "")} ${drink[0]?.label.split(" ")[0]}`;
  const generatedDrinkName = aiDialogue.data?.drinkName || drinkName;
  const stationName = reachedStation === "espresso" ? "محطة الإسبريسو" : reachedStation === "cold" ? "محطة البارد والخلط" : reachedStation === "syrup" ? "محطة السيرب" : reachedStation === "matcha" ? "محطة الماتشا" : "مساحة الخدمة";
  const manualActions = reachedStation === "espresso" ? ["وزن البن", "الطحن", "الكبس بالـ Tamper", "الاستخلاص"] : reachedStation === "cold" ? ["أضف الثلج", "قِس السائل", "شغّل JTC Blender", "راجع القوام"] : reachedStation === "matcha" ? ["وزن الماتشا", "أضف الماء", "اخفق بالـ Chasen", "راجع الرغوة"] : ["اختار زجاجة السيرب", "اضغط المضخة", "قِس الجرامات", "ثبّت النكهة"];

  const choose = (type: keyof typeof selections, id: string) => { setSelections((current) => ({ ...current, [type]: id })); setJokeIndex((i) => (i + 1) % jokes.length); const stationForType = { base: "espresso", milk: "cold", syrup: "syrup", topping: "matcha" } as const; window.dispatchEvent(new CustomEvent("kora-move-to", { detail: stationForType[type] })); };
  const shareDrink = async () => { const text = `ابتكرت مشروب ${drinkName} في Kora — ${totals.grams}g / ${totals.price} جنيه`; try { await navigator.clipboard?.writeText(text); } catch {} setShared(true); window.setTimeout(() => setShared(false), 2200); };
  const askNoura = (action: string, seconds = brewSeconds, angle = brewAngle) => aiDialogue.mutate({ station: stationName, action, ingredients: drink.map((item) => item.label), metrics: { grams: totals.grams, seconds, angle } });
  const completeManualStep = () => { const currentAction = manualActions[manualStep]; const extractionReady = reachedStation !== "espresso" || currentAction !== "الاستخلاص" || (brewSeconds >= 25 && brewSeconds <= 30); const iceReady = reachedStation !== "cold" || currentAction !== "أضف الثلج" || iceGrams >= 120; const syrupReady = reachedStation !== "syrup" || currentAction !== "اضغط المضخة" || pumpCount >= 2; const matchaReady = reachedStation !== "matcha" || currentAction !== "اخفق بالـ Chasen" || brewAngle >= 45; if (!extractionReady) return setManualFeedback("خلّي الاستخلاص بين 25 و30 ثانية — نورة مستنية الوزن المظبوط."); if (!iceReady) return setManualFeedback("نزّل على الأقل 120g ثلج قبل ما نكمل."); if (!syrupReady) return setManualFeedback("اضغط المضخة مرتين عشان النكهة توصل للجرام الصح."); if (!matchaReady) return setManualFeedback("زوّد زاوية الخفق لـ45° على الأقل عشان الرغوة تمسك."); const next = Math.min(manualStep + 1, manualActions.length - 1); setManualFeedback("تمام — الخطوة اتسجلت، نكمل على اللي بعدها."); setManualStep(next); setBrewSeconds((value) => value + (reachedStation === "espresso" ? 7 : 3)); setBrewAngle(reachedStation === "matcha" ? Math.max(45, 45 + next * 10) : next * 5); askNoura(currentAction, brewSeconds + 3, reachedStation === "matcha" ? brewAngle : next * 5); };

  // make sure to consider if you need authentication for certain routes
  return (
    <main dir="rtl" className="app-shell">
      <GameCanvas onStationReached={(station) => { setReachedStation(station); setManualStep(0); setManualFeedback(""); setIceGrams(0); setPumpCount(0); askNoura(`وصلت نورة إلى ${station}`); }} />
      <div className="scene-wash" />
      <header className="topbar">
        <button className="brand" onClick={() => navigate("/")} aria-label="العودة للمطبخ"><span className="brand-mark"><span /></span><span><b>KORA</b><small>DEEP KITCHEN / 3D</small></span></button>
        <nav className="mode-nav" aria-label="التنقل الرئيسي">{modes.slice(0, 4).map((mode) => <button key={mode.path} className={location === mode.path ? "active" : ""} onClick={() => navigate(mode.path)}>{mode.label}</button>)}</nav>
        <button className="icon-button" aria-label="الإعدادات"><Settings2 size={18} /></button>
      </header>

      <section className="hero-copy">
        <div className="eyebrow"><span className="status-dot" /> وردية 01 / المطبخ مفتوح</div>
        <h1>اعملها<br /><em>على مزاجك</em></h1>
        <p>مش لازم تختار من المنيو. اخلط من مخزون كورا، وشوف نورة بتحوّل فكرتك لتذكرة بار مظبوطة بالجرام.</p>
        <div className="hero-actions"><button className="primary-action" onClick={() => setIsPlaying((v) => !v)}><Play size={16} fill="currentColor" /> {isPlaying ? "الوردية جارية" : "ابدأ ابتكارك"}</button><button className="text-action" onClick={() => setShowTicket(true)}>شوف تذكرة البار <ArrowUpLeft size={16} /></button></div>
        <div className="mascot-line"><span className="mascot-pip"><Wand2 size={13} /></span><span>{aiDialogue.data?.line ?? jokes[jokeIndex]}</span><button onClick={() => { setJokeIndex((i) => (i + 1) % jokes.length); askNoura("عايز إفيه جديد"); }} aria-label="غيّر الإفيه">تاني؟</button></div>
        <div className="manual-controls"><div><span className="mono">LIVE STATION</span><b>{stationName}</b></div><div className="manual-step"><span>خطوة {manualStep + 1} / {manualActions.length}</span><strong>{manualActions[manualStep]}</strong></div>{reachedStation === "espresso" && <label className="measure-control">زمن الاستخلاص <b>{brewSeconds || 25}s</b><input type="range" min="20" max="35" value={brewSeconds || 25} onChange={(event) => setBrewSeconds(Number(event.target.value))} /></label>}{reachedStation === "matcha" && <label className="measure-control">زاوية الخفق <b>{brewAngle || 45}°</b><input type="range" min="0" max="90" value={brewAngle || 45} onChange={(event) => setBrewAngle(Number(event.target.value))} /></label>}{reachedStation === "cold" && <label className="measure-control">كمية الثلج <b>{iceGrams}g</b><input type="range" min="0" max="300" value={iceGrams} onChange={(event) => setIceGrams(Number(event.target.value))} /></label>}{reachedStation === "syrup" && <button className="pump-button" onClick={() => setPumpCount((value) => value + 1)}>اضغط مضخة السيرب <b>{pumpCount} / 2</b></button>}<div className="action-track">{manualActions.map((action, index) => <button key={action} className={index === manualStep ? "station-action active" : "station-action"} disabled={index !== manualStep} onClick={completeManualStep}><span>0{index + 1}</span>{action}{index === manualStep && <Check size={12} />}</button>)}</div><small>الأسهم للحركة · النقر لاختيار المكان · الخطوات مقفولة حتى تنفذ الحالية</small>{manualFeedback && <p className="manual-feedback">{manualFeedback}</p>}</div>
      </section>

      <aside className="right-rail">
        <div className="rail-tab">{active.label}<span>{active.sub}</span></div>
        <div className="profile-card"><div className="portrait-wrap" aria-label="نورة، باريستا المطبخ"><div className="css-character"><span className="char-scarf" /><span className="char-head" /><span className="char-body" /><span className="char-apron" /><span className="char-arm char-arm-left" /><span className="char-arm char-arm-right" /><span className="char-tray" /></div><span className="portrait-tag">MASCOT / نورة</span></div><div className="profile-copy"><span className="mono">BARISTA / 01</span><h2>نورة</h2><p>بتظبط الإيقاع قبل ما تظبط الطحن.</p></div></div>
        <div className="builder-panel"><div className="section-kicker"><span><Beaker size={13} /> ابتكر مشروبك</span><span className="mono">LIVE RECIPE</span></div>{stationLabels.map((station) => <div className="builder-step" key={station.id}><div className="builder-label"><span>{station.label}</span><small>{station.prompt}</small></div><div className="option-row">{inventory[station.id].map((option) => <button key={option.id} className={selections[station.id as keyof typeof selections] === option.id ? "option selected" : "option"} onClick={() => choose(station.id as keyof typeof selections, option.id)}><b>{option.label}</b><small>{option.detail}</small></button>)}</div></div>)}</div>
        <div className="recipe-summary"><div><span className="mono">YOUR BUILD</span><h3>{generatedDrinkName}</h3><p className="ai-coach">{aiDialogue.data?.coach ?? "نورة هتراجع الوزن والزمن قبل ما تبعت التذكرة."} · {aiDialogue.data?.scoreHint ?? "جاهز للتجربة"}</p></div><div className="summary-stats"><span><b>{totals.grams}g</b>الوزن</span><span><b>{totals.calories}</b>سعرة</span><span><b>{totals.price} ج</b>السعر</span></div><div className="summary-actions"><button className="ticket-action" onClick={() => setShowTicket(true)}><ChefHat size={15} /> حوّلها للمطبخ</button><button className="share-action" onClick={shareDrink}>{shared ? <Check size={15} /> : <Share2 size={15} />} {shared ? "اتنسخ" : "شارك خلقتك"}</button></div></div>
      </aside>

      <footer className="bottom-console"><div className="console-label"><Layers3 size={16} /><span>محطة الابتكار<br /><b>04 / 05</b></span></div><div className="progress-line"><span style={{ width: `${25 + Object.keys(selections).length * 15}%` }} /></div><div className="console-metrics"><span><Clock3 size={15} /> 08:42</span><span><Gauge size={15} /> 68°C</span><span><Copy size={15} /> {totals.grams}g دقيقة</span></div><button className="console-lock"><LockKeyhole size={14} /> حفظ الوصفة</button></footer>
      <div className="corner-note"><Sparkles size={14} /> اسحب للمشاهدة · اختار مكوّن · اعمل حكاية</div>

      {showTicket && <div className="ticket-backdrop" onClick={() => setShowTicket(false)}><section className="bar-ticket" onClick={(event) => event.stopPropagation()}><button className="ticket-close" onClick={() => setShowTicket(false)}>×</button><div className="ticket-head"><span className="mono">KORA / BAR TICKET</span><span className="ticket-live"><i /> جاهز للتنفيذ</span></div><h2>{generatedDrinkName}</h2><p>خلطة عميل — ابتكار رقم 0048</p><div className="ticket-list">{drink.map((item, index) => <div key={item.id}><span className="ticket-index">0{index + 1}</span><span><b>{item.label}</b><small>{item.detail}</small></span><strong>{item.grams}g</strong></div>)}</div><div className="ticket-total"><span>الإجمالي / <b>{totals.grams}g</b></span><span>{totals.price} جنيه</span></div><button className="send-to-bar" onClick={() => setShowTicket(false)}><ChefHat size={16} /> ابعت التذكرة للبار</button><div className="ticket-note">«{aiDialogue.data?.coach ?? jokes[jokeIndex]}» — نورة · {aiDialogue.data?.scoreHint ?? "مراجعة أولية"}</div></section></div>}
    </main>
  );
}

export default function App() { return <Switch><Route path="/:rest*" component={AppShell} /><Route component={AppShell} /></Switch>; }
