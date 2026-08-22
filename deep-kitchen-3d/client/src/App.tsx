/* Design reminder: Neo-Folk Editorial — navigation stays sparse so the kitchen remains the hero. */
import { useMemo, useState } from "react";
import { Route, Switch, useLocation } from "wouter";
import { ArrowUpLeft, ChefHat, Clock3, Gauge, Layers3, LockKeyhole, Play, Settings2, Sparkles } from "lucide-react";
import GameCanvas from "./components/GameCanvas";
import "./index.css";

const modes = [
  { path: "/", label: "المطبخ", sub: "المشهد الرئيسي" },
  { path: "/kitchen-sim", label: "المحاكاة", sub: "وردية الصباح" },
  { path: "/barista", label: "الباريستا", sub: "ملف نورة" },
  { path: "/guest", label: "الضيف", sub: "واجهة الطلب" },
  { path: "/admin-dashboard", label: "الإدارة", sub: "لوحة التشغيل" },
];

function AppShell() {
  const [location, navigate] = useLocation();
  const [activeStation, setActiveStation] = useState("espresso");
  const [isPlaying, setIsPlaying] = useState(false);
  const active = useMemo(() => modes.find((m) => m.path === location) ?? modes[0], [location]);

  return (
    <main dir="rtl" className="app-shell">
      <GameCanvas />
      <div className="scene-wash" />
      <header className="topbar">
        <button className="brand" onClick={() => navigate("/")} aria-label="العودة للمطبخ">
          <span className="brand-mark"><span /></span>
          <span><b>DEEP</b><small>KITCHEN / 3D</small></span>
        </button>
        <nav className="mode-nav" aria-label="التنقل الرئيسي">
          {modes.slice(0, 4).map((mode) => <button key={mode.path} className={location === mode.path ? "active" : ""} onClick={() => navigate(mode.path)}>{mode.label}</button>)}
        </nav>
        <button className="icon-button" aria-label="الإعدادات"><Settings2 size={18} /></button>
      </header>

      <section className="hero-copy">
        <div className="eyebrow"><span className="status-dot" /> وردية 01 / المطبخ مفتوح</div>
        <h1>كل لقطة<br /><em>لها وزنها</em></h1>
        <p>تجربة مطبخ ثلاثية الأبعاد تتعلّم فيها الإيقاع، الحرارة، واللمسة الأخيرة — مع نورة إلى جوارك.</p>
        <div className="hero-actions">
          <button className="primary-action" onClick={() => setIsPlaying((v) => !v)}><Play size={16} fill="currentColor" /> {isPlaying ? "الوردية جارية" : "ادخل وردية الصباح"}</button>
          <button className="text-action" onClick={() => navigate("/barista")}>تعرّف على نورة <ArrowUpLeft size={16} /></button>
        </div>
      </section>

      <aside className="right-rail">
        <div className="rail-tab">{active.label}<span>{active.sub}</span></div>
        <div className="profile-card">
          <div className="portrait-wrap" aria-label="نورة، باريستا المطبخ"><div className="css-character"><span className="char-scarf" /><span className="char-head" /><span className="char-body" /><span className="char-apron" /><span className="char-arm char-arm-left" /><span className="char-arm char-arm-right" /><span className="char-tray" /></div><span className="portrait-tag">الشخصية الجديدة</span></div>
          <div className="profile-copy"><span className="mono">BARISTA / 01</span><h2>نورة</h2><p>تضبط الإيقاع قبل أن تضبط الطحن.</p></div>
          <div className="stats"><div><b>84</b><span>دقّة</span></div><div><b>12</b><span>وصفة</span></div><div><b>03</b><span>مراحل</span></div></div>
        </div>
        <div className="station-list">
          <div className="section-kicker"><span>01 — محطات اليوم</span><span className="mono">3 / 5</span></div>
          {[{id:"espresso", n:"01", t:"محطة الإسبريسو", d:"استخلاص متوازن"}, {id:"pour", n:"02", t:"صبّ الحليب", d:"ميكروفوم ناعم"}, {id:"serve", n:"03", t:"التقديم", d:"اللمسة الأخيرة"}].map((s) => <button key={s.id} className={`station ${activeStation === s.id ? "selected" : ""}`} onClick={() => setActiveStation(s.id)}><span className="station-no">{s.n}</span><span><b>{s.t}</b><small>{s.d}</small></span><span className="station-status" /></button>)}
        </div>
      </aside>

      <footer className="bottom-console">
        <div className="console-label"><Layers3 size={16} /><span>المشهد<br /><b>01 / 05</b></span></div>
        <div className="progress-line"><span style={{ width: isPlaying ? "64%" : "22%" }} /></div>
        <div className="console-metrics"><span><Clock3 size={15} /> 08:42</span><span><Gauge size={15} /> 68°C</span><span><ChefHat size={15} /> {activeStation === "espresso" ? "طحن متوسط" : activeStation === "pour" ? "صب دائري" : "جاهز للتقديم"}</span></div>
        <button className="console-lock"><LockKeyhole size={14} /> حفظ المشهد</button>
      </footer>
      <div className="corner-note"><Sparkles size={14} /> اسحب للمشاهدة · انقر لتثبيت المحطة</div>
    </main>
  );
}

export default function App() {
  return <Switch><Route path="/:rest*" component={AppShell} /><Route component={AppShell} /></Switch>;
}
