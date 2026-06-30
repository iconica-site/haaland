import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ChartLineUp,
  Confetti,
  Crosshair,
  CursorClick,
  Lightning,
  MouseSimple,
  Snowflake,
  SoccerBall,
  Sparkle,
  Trophy,
} from "@phosphor-icons/react";

const routePath = window.location.pathname.replace(/\/+$/, "");
const isTestPath = routePath.endsWith("/test");
const assetBase = isTestPath ? "../assets/" : `${import.meta.env.BASE_URL}assets/`;
const mainHref = isTestPath ? "../" : import.meta.env.BASE_URL;
const A = `${assetBase}haaland/`;
const TEST_A = `${assetBase}haaland-test/regen/`;
const runnerFrames = Array.from(
  { length: 5 },
  (_, index) => `${A}runner-norway/frame-${String(index).padStart(2, "0")}.webp`,
);
const testRunnerFrames = Array.from(
  { length: 5 },
  (_, index) => `${TEST_A}runner/frame-${String(index).padStart(2, "0")}.webp`,
);
const heroPose = `${A}hero-norway-red.webp`;
const kickFrame = `${A}kick-volley.webp`;
const memeWalkFrames = Array.from(
  { length: 8 },
  (_, index) => `${A}meme-walk-v2/frame-${String(index).padStart(2, "0")}.webp`,
);
const walkGroundOffsets = [
  { x: "-2px", y: "0px" },
  { x: "-5px", y: "2px" },
  { x: "-8px", y: "0px" },
  { x: "-6px", y: "-3px" },
  { x: "-2px", y: "0px" },
  { x: "-5px", y: "2px" },
  { x: "-8px", y: "0px" },
  { x: "-6px", y: "-3px" },
];

const rituals = [
  ["Haaland.exe", "наводится на курсор", "runner-norway/frame-03.webp"],
  ["VAR-паника", "клик = удар туда", "strike-frame.webp"],
  ["Норвежский шум", "снег, огонь, стадион", "goal-celebration.webp"],
  ["Reels-оракул", "мемы спорят со статистикой", "face-meme.webp"],
];

const eggMap = {
  h: "H",
  a: "A",
  l: "L",
  n: "N",
  d: "D",
  o: "O",
  r: "R",
  t: "T",
  u: "U",
  w: "W",
  y: "Y",
};

const getSecretKey = (event) => {
  const key = event.key.toLowerCase();
  if (eggMap[key]) return key;
  const codeMatch = event.code.match(/^Key([A-Z])$/);
  const codeKey = codeMatch?.[1].toLowerCase();
  return eggMap[codeKey] ? codeKey : "";
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function useCursorHunter() {
  const getInitialTarget = () => {
    const isNarrow = window.innerWidth < 700;
    return {
      x: isNarrow ? window.innerWidth - 76 : window.innerWidth * 0.72,
      y: isNarrow ? window.innerHeight - 118 : window.innerHeight * 0.46,
    };
  };
  const [target, setTarget] = useState(getInitialTarget);
  const [hunter, setHunter] = useState(target);
  const [frameIndex, setFrameIndex] = useState(0);
  const [dive, setDive] = useState(false);
  const [active, setActive] = useState(false);
  const hunterRef = useRef(target);
  const targetRef = useRef(target);
  const velocityRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef(0);
  const lastFrameTime = useRef(0);
  const diveTimer = useRef(null);

  const setTargetPoint = useCallback((x, y) => {
    const next = {
      x: clamp(x, 48, window.innerWidth - 48),
      y: clamp(y, 64, window.innerHeight - 44),
    };
    targetRef.current = next;
    setTarget(next);
    return next;
  }, []);

  useEffect(() => {
    const update = (x, y) => {
      setActive(true);
      setTargetPoint(x, y);
    };
    const onMouseMove = (event) => update(event.clientX, event.clientY);
    const onTouchMove = (event) => {
      const touch = event.touches[0];
      if (touch) update(touch.clientX, touch.clientY);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [setTargetPoint]);

  useEffect(() => {
    let frame = 0;
    const tick = (time) => {
      const dx = targetRef.current.x - hunterRef.current.x;
      const dy = targetRef.current.y - hunterRef.current.y;
      const distance = Math.hypot(dx, dy);
      const direction = distance > 0.001 ? { x: dx / distance, y: dy / distance } : { x: 0, y: 0 };
      const desiredSpeed = distance < 6 ? 0 : clamp(distance * 0.065, 0, 18);
      const desiredVelocity = {
        x: direction.x * desiredSpeed,
        y: direction.y * desiredSpeed,
      };

      velocityRef.current = {
        x: (velocityRef.current.x + (desiredVelocity.x - velocityRef.current.x) * 0.105) * 0.91,
        y: (velocityRef.current.y + (desiredVelocity.y - velocityRef.current.y) * 0.105) * 0.91,
      };
      hunterRef.current = {
        x: hunterRef.current.x + velocityRef.current.x,
        y: hunterRef.current.y + velocityRef.current.y,
      };

      const speed = Math.hypot(velocityRef.current.x, velocityRef.current.y);
      if (speed > 0.45 && time - lastFrameTime.current > Math.max(72, 150 - speed * 5)) {
        frameRef.current = (frameRef.current + 1) % runnerFrames.length;
        lastFrameTime.current = time;
        setFrameIndex(frameRef.current);
      } else if (speed <= 0.45 && frameRef.current !== 0) {
        frameRef.current = 0;
        setFrameIndex(0);
      }

      setHunter(hunterRef.current);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const triggerDive = useCallback(() => {
    setDive(true);
    window.clearTimeout(diveTimer.current);
    diveTimer.current = window.setTimeout(() => setDive(false), 620);
  }, []);

  const rushTo = useCallback(
    (x, y) => {
      setActive(true);
      const next = setTargetPoint(x, y);
      const dx = next.x - hunterRef.current.x;
      const dy = next.y - hunterRef.current.y;
      const distance = Math.hypot(dx, dy);
      if (distance > 0.001) {
        const speed = clamp(distance * 0.22, 16, 42);
        velocityRef.current = {
          x: (dx / distance) * speed,
          y: (dy / distance) * speed,
        };
      }
      return next;
    },
    [setTargetPoint],
  );

  const placeAt = useCallback(
    (point) => {
      const next = setTargetPoint(point.x, point.y);
      hunterRef.current = next;
      velocityRef.current = { x: 0, y: 0 };
      setHunter(next);
      setActive(true);
      return next;
    },
    [setTargetPoint],
  );

  return { target, hunter, frameIndex, dive, active, triggerDive, rushTo, placeAt };
}

function Header({ chaos, onToggle, modes }) {
  return (
    <header className="topbar">
      <a className="brand" href="#top" aria-label="Haaland World Cup 2026 meme lab">
        <span>Haaland</span>
        <Lightning weight="fill" />
        <small>ЧМ26 meme lab</small>
      </a>
      <nav className="nav" aria-label="Навигация">
        <a href="#duel">Дуэль</a>
        <a href="#stats">Таблица</a>
        <a href="#eggs">Пасхалки</a>
      </nav>
      <div className="toggles" aria-label="Режимы хаоса">
        <button type="button" className={modes.vhs ? "active" : ""} onClick={() => onToggle("vhs")} title="VHS-шум" aria-label="VHS-шум">
          <Sparkle weight="bold" />
          <span>VHS</span>
        </button>
        <button type="button" className={modes.snow ? "active" : ""} onClick={() => onToggle("snow")} title="Норвежский снег" aria-label="Норвежский снег">
          <Snowflake weight="bold" />
          <span>Снег</span>
        </button>
        <button type="button" className={modes.auto ? "active" : ""} onClick={() => onToggle("auto")} title="Автоудары 2 раза в секунду" aria-label="Автоудары 2 раза в секунду">
          <SoccerBall weight="fill" />
          <span>Авто 2/с</span>
        </button>
        <span className="chaos-meter">{chaos}%</span>
      </div>
    </header>
  );
}

function Hunter({ hunter, target, frameIndex, dive, active, isShooting }) {
  const flip = target.x < hunter.x ? -1 : 1;
  const style = {
    "--x": `${hunter.x}px`,
    "--y": `${hunter.y}px`,
    "--flip": flip,
  };
  const image = runnerFrames[dive ? runnerFrames.length - 1 : frameIndex];

  return (
    <div
      className={`hunter ${active ? "is-active" : ""} ${dive ? "is-diving" : ""} ${isShooting ? "is-shooting" : ""}`}
      style={style}
      aria-hidden="true"
    >
      <img src={image} alt="" />
      <span className="hunter-tag">tap = bicycle kick</span>
    </div>
  );
}

function ClickEffects({ shots }) {
  return (
    <div className="shot-layer" aria-hidden="true">
      {shots.map((shot) => (
        <div
          className={`shot ${shot.goal ? "is-goal" : "is-miss"}`}
          key={shot.id}
          style={{
            left: `${shot.x}px`,
            top: `${shot.y}px`,
            "--tx": `${shot.endX - shot.x}px`,
            "--ty": `${shot.endY - shot.y}px`,
            "--scale": shot.scale,
            "--spin": `${shot.spin}deg`,
            "--flip": shot.side === "left" ? "-1" : "1",
          }}
        >
          <img className="kick-cutout" src={kickFrame} alt="" />
          <div className="flying-ball">
            <SoccerBall weight="fill" />
          </div>
          <strong>{shot.text}</strong>
        </div>
      ))}
    </div>
  );
}

function Hero({ target, goalCount }) {
  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <span className="eyebrow">
          <MouseSimple weight="bold" />
          Норвегия загрузила босса
        </span>
        <h1>Эрлинг Холанд бегает за мышкой и бьет туда, куда ты кликаешь</h1>
        <p>
          Мемный ЧМ2026-сайт: курсор как защитник, клик как навес, статистика как VAR,
          который кто-то подключил к Reels в 03:00.
        </p>
        <div className="hero-actions">
          <a className="primary" href="#stats">
            <ChartLineUp weight="bold" />
            смотреть табло
          </a>
          <a className="secondary" href="#eggs">
            <CursorClick weight="bold" />
            искать пасхалки
          </a>
        </div>
      </div>
      <div className="hero-figure" aria-label="Холанд в движении без фона">
        <img src={heroPose} alt="Холанд в красной форме Норвегии" />
        <div className="target-readout">
          <Crosshair weight="bold" />
          <span>
            курсор: {Math.round(target.x)} / {Math.round(target.y)}
          </span>
        </div>
        <div className="scorebug">
          <span>NOR</span>
          <strong>{goalCount}</strong>
          <span>WORLD</span>
        </div>
      </div>
    </section>
  );
}

function MemeWalkBelt() {
  const runners = Array.from({ length: 14 }, (_, index) => index);
  const packs = [0, 1];

  return (
    <section className="walk-belt" aria-label="Бегущая строка с анимированной мемной походкой Холанда">
      <div className="walk-track">
        {packs.map((packIndex) => (
          <div className="walk-pack" key={`walk-pack-${packIndex}`}>
            {runners.map((index) => (
              <div
                className="walk-runner"
                style={{ "--walk-delay": `${((index + packIndex) % memeWalkFrames.length) * -88}ms` }}
                key={`runner-${packIndex}-${index}`}
              >
                {memeWalkFrames.map((src, frameIndex) => (
                  <img
                    src={src}
                    alt=""
                    key={src}
                    style={{
                      "--frame-delay": `${frameIndex * -88}ms`,
                      "--frame-x": walkGroundOffsets[frameIndex].x,
                      "--frame-y": walkGroundOffsets[frameIndex].y,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="walk-led">HAALAND WALK MODE // HAALAND WALK MODE // HAALAND WALK MODE //</div>
    </section>
  );
}

function DuelSection({ goalCount }) {
  return (
    <section className="duel" id="duel">
      <img src={`${A}faceoff-haaland-mbappe.webp`} alt="Холанд и Мбаппе лицом к лицу" />
      <div className="duel-copy">
        <span>goal race</span>
        <h2>Кто выиграет в противостоянии по голам?</h2>
        <p>Норвежский автонападающий против французского ускорителя. Клик по экрану — еще один удар Холанда в этом симуляторе ЧМ26.</p>
      </div>
      <div className="duel-score" aria-hidden="true">
        <strong>{goalCount}</strong>
        <span>vs</span>
        <strong>4</strong>
      </div>
    </section>
  );
}

function DataTable({ goalCount, chaos }) {
  const rows = [
    ["Голы в лиге 2025/26", "27", "25", "сезонная база"],
    ["Голы на ЧМ2026", String(goalCount), "4", "Холанд растет от голевых кликов"],
    ["Голы в квалификации ЧМ2026", "16", "—", "исторический разгон Норвегии"],
    ["Матчи на ЧМ2026", "3+", "3+", "live-мемная сетка"],
    ["Режим", "с лету", "рывок", `${chaos}% хаоса`],
  ];

  return (
    <section className="data-section" id="stats">
      <div className="section-heading">
        <span>табло</span>
        <h2>Мини-таблица для спора в комментариях</h2>
      </div>
      <div className="score-table" role="table" aria-label="Статистика Холанда и Мбаппе">
        <div className="score-row score-head" role="row">
          <span role="columnheader">метрика</span>
          <span role="columnheader">Haaland</span>
          <span role="columnheader">Mbappé</span>
          <span role="columnheader">контекст</span>
        </div>
        {rows.map(([label, haaland, mbappe, note]) => (
          <div className="score-row" role="row" key={label}>
            <span role="cell">{label}</span>
            <strong role="cell">{haaland}</strong>
            <strong role="cell">{mbappe}</strong>
            <span role="cell">{note}</span>
          </div>
        ))}
      </div>
      <p className="source-note">В этом прототипе ЧМ-счетчик Холанда интерактивный: засчитывается только голевой клик.</p>
    </section>
  );
}

function Rituals() {
  return (
    <section className="rituals" id="eggs">
      <div className="section-heading">
        <span>пасхалки</span>
        <h2>Пять способов сломать спокойный футбол</h2>
      </div>
      <div className="ritual-grid">
        {rituals.map(([title, text, image], index) => (
          <article className="ritual" key={title}>
            <img src={`${A}${image}`} alt="" />
            <div className="ritual-number">{String(index + 1).padStart(2, "0")}</div>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
      <div className="code-strip">
        <Confetti weight="fill" />
        <span>Секретные слова: HAALAND, NORWAY, AUTO. Печатай прямо на странице.</span>
      </div>
    </section>
  );
}

function PanicRoom({ eggs }) {
  return (
    <section className="panic" id="panic">
      <div className="panic-copy">
        <span>VAR-комната</span>
        <h2>Когда счетчик пасхалок растет, сайт начинает верить в невозможное</h2>
        <p>
          Здесь все намеренно чуть перегрето: пиксели из ваших роликов, табло как в трансляции,
          и Холанд, который воспринимает любой клик как мяч на дальней штанге.
        </p>
      </div>
      <div className="egg-board">
        {["HAALAND", "NORWAY", "AUTO"].map((egg) => (
          <div className={eggs.includes(egg) ? "egg unlocked" : "egg"} key={egg}>
            <Trophy weight={eggs.includes(egg) ? "fill" : "regular"} />
            <span>{egg}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function IconicaFooter() {
  return (
    <footer className="iconica-footer">
      <a href="https://iconica.site/" target="_blank" rel="noreferrer">
        <span>разработано в</span>
        <strong>iconica</strong>
      </a>
    </footer>
  );
}

function KitTestPage() {
  const originalRunner = runnerFrames;
  const regeneratedStills = [
    ["hero", "stills/hero.webp", "hero-norway-red.webp"],
    ["kick", "stills/kick.webp", "kick-volley.webp"],
    ["faceoff", "stills/faceoff.webp", "faceoff-haaland-mbappe.webp"],
  ];

  return (
    <main className="test-page">
      <header className="test-hero">
        <a className="test-back" href={mainHref}>main</a>
        <div>
          <span>kit regen test</span>
          <h1>Norway 2026 rebuild</h1>
        </div>
      </header>

      <section className="test-stage">
        <div className="test-runner-card">
          <div className="test-runner-loop" style={{ "--frames": testRunnerFrames.length }}>
            {testRunnerFrames.map((src) => (
              <img src={src} alt="" key={src} />
            ))}
          </div>
        </div>
        <div className="test-strip-card">
          <img src={`${TEST_A}runner-strip.webp`} alt="" />
        </div>
      </section>

      <section className="test-compare">
        <div className="test-section-title">
          <span>runner frames</span>
          <h2>generated vs source</h2>
        </div>
        <div className="test-frame-grid">
          {testRunnerFrames.map((src, index) => (
            <article className="test-frame" key={src}>
              <img src={src} alt="" />
              <img src={originalRunner[index % originalRunner.length]} alt="" />
              <strong>{String(index + 1).padStart(2, "0")}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="test-stills">
        <div className="test-section-title">
          <span>still candidates</span>
          <h2>regenerated national-kit shots</h2>
        </div>
        <div className="test-still-grid">
          {regeneratedStills.map(([label, generated, source]) => (
            <article className="test-still" key={label}>
              <img src={`${TEST_A}${generated}`} alt="" />
              <div>
                <span>{label}</span>
                <img src={`${A}${source}`} alt="" />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="test-sheets">
        <img src={`${TEST_A}runner-source-sheet.png`} alt="" />
        <img src={`${TEST_A}stills-source-sheet.png`} alt="" />
      </section>
    </main>
  );
}

function MainApp() {
  const { target, hunter, frameIndex, dive, active, triggerDive, rushTo, placeAt } = useCursorHunter();
  const [shots, setShots] = useState([]);
  const [chaos, setChaos] = useState(26);
  const [goalCount, setGoalCount] = useState(4);
  const [modes, setModes] = useState({ vhs: true, snow: false, auto: false });
  const [typed, setTyped] = useState("");
  const [eggs, setEggs] = useState([]);
  const chargeTimers = useRef(new Set());
  const shotTimers = useRef(new Set());
  const autoLastShot = useRef(0);

  const spawnShot = useCallback(
    (point, options = {}) => {
      const id = `${Date.now()}-${Math.random()}`;
      const side = Math.random() > 0.5 ? "left" : "right";
      const goal = options.forceGoal || Math.random() < 0.62;
      const cornerX = side === "left" ? window.innerWidth * 0.14 : window.innerWidth * 0.86;
      const missX = side === "left" ? -window.innerWidth * 0.12 : window.innerWidth * 1.12;
      const endX = goal ? cornerX + (Math.random() - 0.5) * 80 : missX;
      const endY = goal
        ? 72 + Math.random() * Math.min(180, window.innerHeight * 0.22)
        : 46 + Math.random() * Math.min(260, window.innerHeight * 0.32);
      const next = {
        id,
        x: point.x,
        y: point.y,
        endX,
        endY,
        side,
        goal,
        scale: goal ? (5.4 + Math.random() * 1.2).toFixed(2) : (4.1 + Math.random() * 0.9).toFixed(2),
        spin: (side === "left" ? -1 : 1) * (540 + Math.random() * 360),
        text: goal ? "ГОЛ В ДЕВЯТКУ" : Math.random() > 0.5 ? "МИМО" : "ШТАНГА",
      };
      setShots((items) => [...items.slice(-7), next]);
      setChaos((value) => clamp(value + (goal ? 11 : 5), 0, 999));
      if (goal) setGoalCount((value) => value + 1);
      triggerDive();

      const timer = window.setTimeout(() => {
        setShots((items) => items.filter((item) => item.id !== id));
        shotTimers.current.delete(timer);
      }, 1680);
      shotTimers.current.add(timer);
    },
    [triggerDive],
  );

  const chargeAndShoot = useCallback(
    (x, y, options = {}) => {
      const point = rushTo(x, y);
      const timer = window.setTimeout(() => {
        const anchoredPoint = placeAt(point);
        spawnShot(anchoredPoint, options);
        chargeTimers.current.delete(timer);
      }, options.delay ?? 170);
      chargeTimers.current.add(timer);
    },
    [placeAt, rushTo, spawnShot],
  );

  useEffect(() => {
    const onClick = (event) => {
      if (event.target.closest("a, button")) return;
      event.preventDefault();
      chargeAndShoot(event.clientX, event.clientY);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [chargeAndShoot]);

  useEffect(() => {
    const preventSelection = (event) => {
      if (event.target.closest("a, button, input, textarea, select")) return;
      event.preventDefault();
    };
    document.addEventListener("selectstart", preventSelection);
    document.addEventListener("dragstart", preventSelection);
    document.addEventListener("dblclick", preventSelection, { capture: true });
    document.addEventListener("mousedown", preventSelection, { capture: true });
    return () => {
      document.removeEventListener("selectstart", preventSelection);
      document.removeEventListener("dragstart", preventSelection);
      document.removeEventListener("dblclick", preventSelection, { capture: true });
      document.removeEventListener("mousedown", preventSelection, { capture: true });
    };
  }, []);

  useEffect(() => {
    if (!modes.auto) return undefined;
    let stopped = false;
    const autoShoot = () => {
      if (stopped) return;
      const now = Date.now();
      if (now - autoLastShot.current < 500) return;
      autoLastShot.current = now;
      const x = 72 + Math.random() * Math.max(1, window.innerWidth - 144);
      const y = 116 + Math.random() * Math.max(1, window.innerHeight * 0.58);
      chargeAndShoot(x, y, { forceGoal: true, delay: 100 });
    };
    const interval = window.setInterval(autoShoot, 500);
    return () => {
      stopped = true;
      window.clearInterval(interval);
    };
  }, [chargeAndShoot, modes.auto]);

  useEffect(() => {
    return () => {
      chargeTimers.current.forEach((timer) => window.clearTimeout(timer));
      shotTimers.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      const key = getSecretKey(event);
      if (!key) return;

      const unlock = (egg) => {
        setEggs((items) => (items.includes(egg) ? items : [...items, egg]));
        setChaos((value) => clamp(value + 26, 0, 999));
      };

      setTyped((current) => {
        const next = (current + key).slice(-12);
        if (next.includes("haaland")) unlock("HAALAND");
        if (next.includes("norway")) {
          unlock("NORWAY");
          setModes((items) => ({ ...items, snow: true }));
        }
        if (next.includes("auto")) {
          unlock("AUTO");
          setModes((items) => ({ ...items, auto: true, vhs: true }));
        }
        return next;
      });
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const className = useMemo(() => {
    return [
      "page",
      modes.vhs ? "mode-vhs" : "",
      modes.snow ? "mode-snow" : "",
      modes.auto ? "mode-auto" : "",
    ]
      .filter(Boolean)
      .join(" ");
  }, [modes]);

  const toggleMode = (mode) => {
    setModes((items) => ({ ...items, [mode]: !items[mode] }));
    setChaos((value) => clamp(value + 4, 0, 999));
  };

  return (
    <main className={className}>
      <Header chaos={chaos} modes={modes} onToggle={toggleMode} />
      <Hero target={target} goalCount={goalCount} />
      <MemeWalkBelt />
      <DuelSection goalCount={goalCount} />
      <DataTable goalCount={goalCount} chaos={chaos} />
      <Rituals />
      <PanicRoom eggs={eggs} />
      <IconicaFooter />
      <Hunter hunter={hunter} target={target} frameIndex={frameIndex} dive={dive} active={active} isShooting={shots.length > 0} />
      <ClickEffects shots={shots} />
      <div className="cursor-target" style={{ left: target.x, top: target.y }} aria-hidden="true" />
      <div className="noise" aria-hidden="true" />
    </main>
  );
}

export function App() {
  return isTestPath ? <KitTestPage /> : <MainApp />;
}
