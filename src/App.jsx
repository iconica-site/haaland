import { useEffect, useRef } from "react";
import {
  ArrowRight,
  CheckCircle,
  List,
  Leaf,
  Lightning,
  Play,
  PuzzlePiece,
  SealCheck,
  ShoppingCartSimple,
  Sparkle,
  Timer,
  Truck,
} from "@phosphor-icons/react";
import * as THREE from "three";

const navItems = ["Услуги", "Продукция", "Кейсы", "Дизайн", "О нас", "Контакты"];

const features = [
  { icon: Timer, title: "Срочная печать", text: "от 2-х часов" },
  { icon: Leaf, title: "Эко материалы", text: "и безопасные краски" },
  { icon: Truck, title: "Доставка по РФ", text: "и СНГ" },
  { icon: PuzzlePiece, title: "Опыт команды", text: "более 10 лет" },
];

const products = [
  { title: "Листовки", qty: "от 100 шт.", image: "assets/crops-clean/card-leaflets.png" },
  { title: "Плакаты", qty: "от 1 шт.", image: "assets/crops-clean/card-posters.png" },
  { title: "Визитки", qty: "от 50 шт.", image: "assets/crops-clean/card-cards.png" },
  { title: "Упаковка", qty: "от 100 шт.", image: "assets/crops-clean/card-package.png" },
  { title: "Брошюры", qty: "от 10 шт.", image: "assets/crops-clean/card-brochures.png" },
];

const productionSteps = [
  ["Prepress", "Проверка макета, цветовых профилей и допусков до запуска тиража."],
  ["Offset / Digital", "Подбор технологии под задачу: от коротких партий до стабильного потока."],
  ["Finishing", "Резка, фальцовка, ламинация, сборка и упаковка без потери темпа."],
];

function Logo() {
  return (
    <a className="logo" href="#top" aria-label="PrintHub">
      <span>Print</span>
      <Lightning weight="fill" />
      <span className="accent">Hub</span>
      <small>типография нового поколения</small>
    </a>
  );
}

function Header() {
  return (
    <header className="header">
      <Logo />
      <nav className="nav" aria-label="Основная навигация">
        {navItems.map((item) => (
          <a href={`#${item.toLowerCase().replaceAll(" ", "-")}`} key={item}>
            {item}
          </a>
        ))}
      </nav>
      <div className="header-actions">
        <button className="cart-button" type="button" aria-label="Корзина">
          <ShoppingCartSimple weight="regular" />
          <span>2</span>
        </button>
        <button className="outline-button" type="button">
          Рассчитать заказ
          <ArrowRight weight="bold" />
        </button>
        <button className="menu-button" type="button" aria-label="Открыть меню">
          <List weight="bold" />
        </button>
      </div>
    </header>
  );
}

function FeatureItem({ feature }) {
  const Icon = feature.icon;

  return (
    <li>
      <Icon weight="regular" />
      <span>
        <strong>{feature.title}</strong>
        {feature.text}
      </span>
    </li>
  );
}

function ProductCard({ product, index }) {
  return (
    <article className="product-card" style={{ "--card-i": index }}>
      <img src={product.image} alt="" aria-hidden="true" />
      <div className="product-copy">
        <h3>
          {product.title}
          <Sparkle weight="fill" />
        </h3>
        <p>{product.qty}</p>
      </div>
      <button className="card-arrow" type="button" aria-label={`Открыть ${product.title}`}>
        <ArrowRight weight="bold" />
      </button>
    </article>
  );
}

function ProductionFlow() {
  return (
    <section className="production-flow" aria-label="Производственный маршрут">
      <div className="flow-heading">
        <span>Контроль тиража</span>
        <h2>Процесс не заканчивается на печати</h2>
      </div>
      <div className="flow-grid">
        {productionSteps.map(([title, text], index) => (
          <article className="flow-item" key={title}>
            <CheckCircle weight="fill" />
            <small>{String(index + 1).padStart(2, "0")}</small>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
      <div className="flow-strip" aria-hidden="true">
        <span>CMYK</span>
        <span>Pantone</span>
        <span>Postpress</span>
        <span>Packaging</span>
      </div>
    </section>
  );
}

function PressModel() {
  const canvasRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return undefined;
    const visual = canvas.parentElement;
    if (!visual) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(3.95, 2.5, 5.95);
    camera.lookAt(0, 0.02, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const group = new THREE.Group();
    group.scale.setScalar(1.16);
    group.position.set(0.02, 0.18, 0);
    scene.add(group);

    const bodyLight = new THREE.MeshStandardMaterial({
      color: 0xb9b8ad,
      metalness: 0.22,
      roughness: 0.48,
    });
    const bodyDark = new THREE.MeshStandardMaterial({
      color: 0x263033,
      metalness: 0.38,
      roughness: 0.42,
    });
    const black = new THREE.MeshStandardMaterial({
      color: 0x060807,
      metalness: 0.28,
      roughness: 0.5,
    });
    const metal = new THREE.MeshStandardMaterial({
      color: 0xbfc0b8,
      metalness: 0.78,
      roughness: 0.2,
    });
    const acid = new THREE.MeshStandardMaterial({
      color: 0xdbe600,
      emissive: 0x495000,
      emissiveIntensity: 0.45,
      metalness: 0.08,
      roughness: 0.35,
    });
    const paper = new THREE.MeshStandardMaterial({
      color: 0xf6f3e6,
      metalness: 0,
      roughness: 0.38,
    });
    const blue = new THREE.MeshStandardMaterial({
      color: 0x1f7fab,
      emissive: 0x00344c,
      emissiveIntensity: 0.25,
      metalness: 0.08,
      roughness: 0.32,
    });
    const glass = new THREE.MeshPhysicalMaterial({
      color: 0x0a1112,
      metalness: 0.05,
      roughness: 0.12,
      transmission: 0.08,
      transparent: true,
      opacity: 0.72,
    });
    const rubber = new THREE.MeshStandardMaterial({
      color: 0x020202,
      metalness: 0.08,
      roughness: 0.76,
    });
    const magenta = new THREE.MeshStandardMaterial({
      color: 0xd01965,
      emissive: 0x32000f,
      emissiveIntensity: 0.2,
      metalness: 0.08,
      roughness: 0.38,
    });
    const cyan = new THREE.MeshStandardMaterial({
      color: 0x00b7e8,
      emissive: 0x003c54,
      emissiveIntensity: 0.24,
      metalness: 0.08,
      roughness: 0.36,
    });
    const yellow = new THREE.MeshStandardMaterial({
      color: 0xf2df20,
      emissive: 0x4b3d00,
      emissiveIntensity: 0.22,
      metalness: 0.06,
      roughness: 0.38,
    });
    const red = new THREE.MeshStandardMaterial({
      color: 0xd62828,
      emissive: 0x3d0404,
      emissiveIntensity: 0.25,
      metalness: 0.1,
      roughness: 0.34,
    });
    const green = new THREE.MeshStandardMaterial({
      color: 0x36d25b,
      emissive: 0x06330e,
      emissiveIntensity: 0.3,
      metalness: 0.08,
      roughness: 0.34,
    });

    const makeBox = (name, size, position, material, rotation = [0, 0, 0]) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
      mesh.name = name;
      mesh.position.set(...position);
      mesh.rotation.set(...rotation);
      group.add(mesh);
      return mesh;
    };

    const makeCylinder = (name, radius, depth, position, material, rotation = [0, 0, Math.PI / 2]) => {
      const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, depth, 32), material);
      mesh.name = name;
      mesh.position.set(...position);
      mesh.rotation.set(...rotation);
      group.add(mesh);
      return mesh;
    };

    const makeTorus = (name, radius, tube, position, material, rotation = [Math.PI / 2, 0, 0]) => {
      const mesh = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 12, 36), material);
      mesh.name = name;
      mesh.position.set(...position);
      mesh.rotation.set(...rotation);
      group.add(mesh);
      return mesh;
    };

    const makeLabelTexture = (lines, options = {}) => {
      const labelCanvas = document.createElement("canvas");
      labelCanvas.width = options.width || 512;
      labelCanvas.height = options.height || 192;
      const labelCtx = labelCanvas.getContext("2d");
      labelCtx.fillStyle = options.bg || "#f1eee0";
      labelCtx.fillRect(0, 0, labelCanvas.width, labelCanvas.height);
      labelCtx.fillStyle = options.bar || "#dbe600";
      labelCtx.fillRect(0, 0, labelCanvas.width, Math.floor(labelCanvas.height * 0.18));
      labelCtx.fillStyle = options.fg || "#111111";
      labelCtx.font = "700 44px Arial, sans-serif";
      labelCtx.textBaseline = "top";
      lines.forEach((line, index) => {
        labelCtx.font = index === 0 ? "700 44px Arial, sans-serif" : "600 28px Arial, sans-serif";
        labelCtx.fillText(line, 28, 42 + index * 42);
      });
      labelCtx.globalAlpha = 0.28;
      labelCtx.fillStyle = "#111111";
      for (let x = 26; x < labelCanvas.width - 24; x += 30) {
        labelCtx.fillRect(x, labelCanvas.height - 30, 16, 5);
      }
      labelCtx.globalAlpha = 1;
      const texture = new THREE.CanvasTexture(labelCanvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    };

    const makeLabel = (name, size, position, texture, rotation = [0, 0, 0]) => {
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(...size),
        new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide }),
      );
      mesh.name = name;
      mesh.position.set(...position);
      mesh.rotation.set(...rotation);
      group.add(mesh);
      return mesh;
    };

    makeBox("lower-cabinet", [4.45, 0.82, 2.15], [0, -1.08, 0.05], bodyLight);
    makeBox("upper-deck", [4.75, 0.34, 2.42], [0, -0.48, 0.04], bodyLight);
    makeBox("front-service-panel-left", [1.12, 0.035, 0.58], [-1.15, -0.94, 1.145], bodyLight, [-0.05, 0, 0]);
    makeBox("front-service-panel-right", [1.12, 0.035, 0.58], [0.16, -0.94, 1.145], bodyLight, [-0.05, 0, 0]);
    makeBox("front-panel-seam-left", [0.02, 0.045, 0.62], [-1.72, -0.94, 1.17], black, [-0.05, 0, 0]);
    makeBox("front-panel-seam-center", [0.02, 0.045, 0.62], [-0.5, -0.94, 1.17], black, [-0.05, 0, 0]);
    makeBox("front-panel-seam-right", [0.02, 0.045, 0.62], [0.72, -0.94, 1.17], black, [-0.05, 0, 0]);
    makeBox("front-shadow-gap", [2.2, 0.035, 0.05], [-0.52, -0.66, 1.17], black, [-0.05, 0, 0]);
    makeBox("base-plinth", [4.18, 0.22, 1.9], [0.02, -1.58, 0.04], bodyLight);
    makeBox("toe-shadow", [3.55, 0.12, 0.18], [-0.1, -1.42, 1.08], black);
    makeBox("print-bed", [3.05, 0.1, 1.5], [0.42, -0.24, 0.3], black);
    makeBox("front-lip", [3.4, 0.18, 0.28], [0.3, -0.32, 1.08], bodyDark);
    makeBox("rear-rail-bed", [4.3, 0.16, 0.18], [-0.08, 0.04, -0.55], metal);
    makeBox("registration-pin-left", [0.08, 0.06, 0.08], [-0.72, -0.08, 0.88], acid);
    makeBox("registration-pin-right", [0.08, 0.06, 0.08], [1.5, -0.08, 0.88], acid);
    makeBox("front-measure-strip", [2.75, 0.02, 0.035], [0.43, -0.1, 0.98], metal);
    for (let i = 0; i < 17; i += 1) {
      makeBox("measure-tick", [0.012, 0.024, i % 4 === 0 ? 0.085 : 0.052], [-0.86 + i * 0.16, -0.085, 1.0], black);
    }
    makeBox("vacuum-bed-left-track", [0.06, 0.035, 1.38], [-1.02, -0.155, 0.28], metal);
    makeBox("vacuum-bed-right-track", [0.06, 0.035, 1.38], [1.84, -0.155, 0.28], metal);
    for (let i = 0; i < 15; i += 1) {
      makeBox("bed-rib", [0.04, 0.025, 1.38], [-0.9 + i * 0.18, -0.135, 0.28], new THREE.MeshStandardMaterial({
        color: 0x141715,
        metalness: 0.16,
        roughness: 0.62,
      }));
    }

    const sheet = makeBox("substrate-sheet", [2.04, 0.035, 1.12], [0.38, -0.16, 0.32], paper);

    const printCanvas = document.createElement("canvas");
    printCanvas.width = 512;
    printCanvas.height = 320;
    const ctx = printCanvas.getContext("2d");
    ctx.fillStyle = "#f5f0de";
    ctx.fillRect(0, 0, printCanvas.width, printCanvas.height);
    const colors = ["#e3002b", "#00a6d6", "#e8f000", "#111111", "#7a2df1", "#00a96b"];
    for (let i = 0; i < 140; i += 1) {
      ctx.globalAlpha = 0.18 + ((i * 13) % 40) / 100;
      ctx.fillStyle = colors[i % colors.length];
      ctx.beginPath();
      ctx.ellipse(
        (i * 67) % printCanvas.width,
        (i * 41) % printCanvas.height,
        18 + ((i * 7) % 44),
        8 + ((i * 11) % 28),
        (i * 0.31) % Math.PI,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    const printedTexture = new THREE.CanvasTexture(printCanvas);
    printedTexture.colorSpace = THREE.SRGBColorSpace;
    const printedArt = new THREE.Mesh(
      new THREE.PlaneGeometry(1.72, 0.82),
      new THREE.MeshBasicMaterial({ map: printedTexture, side: THREE.DoubleSide }),
    );
    printedArt.position.set(0.38, -0.138, 0.32);
    printedArt.rotation.x = -Math.PI / 2;
    group.add(printedArt);

    makeBox("left-service-box", [0.66, 0.74, 0.72], [-2.02, 0.34, -0.54], bodyDark);
    makeBox("left-service-endcap", [0.09, 0.58, 0.6], [-2.42, 0.33, -0.54], black);
    makeBox("left-status-window", [0.018, 0.3, 0.36], [-2.47, 0.36, -0.54], glass, [0, Math.PI / 2, 0]);
    makeBox("left-warning-plate", [0.26, 0.025, 0.12], [-2.0, 0.58, -0.15], acid);
    makeBox("right-service-box", [0.86, 0.92, 0.84], [2.03, 0.42, -0.54], bodyDark);
    makeBox("right-window", [0.08, 0.58, 0.48], [2.45, 0.43, -0.47], glass);
    makeBox("right-service-door-line", [0.035, 0.68, 0.02], [2.45, 0.42, -0.14], black);
    makeBox("right-handle", [0.04, 0.22, 0.04], [2.5, 0.2, -0.24], metal);
    makeBox("gantry-beam", [4.2, 0.26, 0.26], [0.04, 0.46, -0.54], bodyDark);
    makeBox("gantry-top-cover", [4.0, 0.14, 0.22], [0.04, 0.66, -0.7], black);
    makeBox("gantry-linear-scale", [3.62, 0.035, 0.045], [0.02, 0.35, -0.18], acid);
    for (let i = 0; i < 28; i += 1) {
      makeBox("linear-scale-mark", [0.022, 0.038, 0.052], [-1.72 + i * 0.13, 0.37, -0.15], black);
    }
    makeBox("gantry-front-rail", [4.35, 0.08, 0.08], [0.02, 0.23, -0.25], metal);
    makeBox("gantry-back-rail", [4.35, 0.08, 0.08], [0.02, 0.61, -0.83], metal);
    makeCylinder("front-round-rail", 0.035, 4.2, [0.02, 0.22, -0.34], metal);
    makeCylinder("rear-round-rail", 0.035, 4.2, [0.02, 0.58, -0.72], metal);
    for (let i = 0; i < 19; i += 1) {
      makeCylinder("rail-screw", 0.018, 0.02, [-1.95 + i * 0.22, 0.28, -0.18], black, [Math.PI / 2, 0, 0]);
    }

    const carriage = new THREE.Group();
    carriage.position.set(0, 0, 0);
    group.add(carriage);
    const addToCarriage = (mesh) => {
      group.remove(mesh);
      carriage.add(mesh);
      return mesh;
    };
    addToCarriage(makeBox("print-carriage", [0.68, 0.4, 0.52], [0, 0.2, -0.28], black));
    addToCarriage(makeBox("carriage-top-cap", [0.6, 0.1, 0.42], [0, 0.46, -0.28], bodyDark));
    addToCarriage(makeBox("carriage-inspection-window", [0.44, 0.02, 0.2], [0, 0.31, -0.01], glass, [Math.PI / 2, 0, 0]));
    addToCarriage(makeBox("carriage-left-bearing", [0.12, 0.16, 0.18], [-0.42, 0.22, -0.32], metal));
    addToCarriage(makeBox("carriage-right-bearing", [0.12, 0.16, 0.18], [0.42, 0.22, -0.32], metal));
    addToCarriage(makeBox("print-head-face", [0.5, 0.08, 0.38], [0, 0.0, -0.1], bodyDark));
    addToCarriage(makeBox("nozzle-strip", [0.42, 0.03, 0.045], [0, -0.08, 0.08], metal));
    addToCarriage(makeBox("ink-module-cyan", [0.08, 0.08, 0.12], [-0.28, 0.03, -0.02], cyan));
    addToCarriage(makeBox("ink-module-magenta", [0.08, 0.08, 0.12], [-0.14, 0.03, -0.02], magenta));
    addToCarriage(makeBox("ink-module-yellow", [0.08, 0.08, 0.12], [0, 0.03, -0.02], yellow));
    addToCarriage(makeBox("ink-module-black", [0.08, 0.08, 0.12], [0.14, 0.03, -0.02], black));
    addToCarriage(makeBox("ink-module-white", [0.08, 0.08, 0.12], [0.28, 0.03, -0.02], paper));
    for (let i = 0; i < 9; i += 1) {
      addToCarriage(makeCylinder("nozzle-dot", 0.012, 0.012, [-0.2 + i * 0.05, -0.115, 0.12], black, [Math.PI / 2, 0, 0]));
    }
    for (let i = 0; i < 4; i += 1) {
      addToCarriage(makeBox("carriage-service-light", [0.04, 0.025, 0.02], [-0.24 + i * 0.16, 0.48, -0.05], i % 2 ? green : acid));
    }

    for (let i = 0; i < 22; i += 1) {
      makeBox("cable-chain", [0.09, 0.075, 0.14], [-1.55 + i * 0.12, 0.72 + Math.sin(i * 0.45) * 0.035, -0.8], black, [0, 0, Math.sin(i * 0.7) * 0.08]);
    }
    for (let i = 0; i < 5; i += 1) {
      const hoseCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.58 + i * 0.045, 0.68, -0.76),
        new THREE.Vector3(-0.86 + i * 0.035, 0.9 + i * 0.015, -0.83),
        new THREE.Vector3(-0.15 + i * 0.032, 0.56, -0.58),
      ]);
      const hose = new THREE.Mesh(
        new THREE.TubeGeometry(hoseCurve, 28, 0.012, 8, false),
        [cyan, magenta, yellow, black, paper][i],
      );
      hose.name = "ink-hose";
      group.add(hose);
    }

    for (let i = 0; i < 12; i += 1) {
      makeBox("front-vent", [0.16, 0.025, 0.02], [-1.25 + i * 0.22, -0.83, 1.14], black);
      makeBox("lower-vent", [0.13, 0.025, 0.02], [-1.55 + i * 0.2, -1.28, 1.13], black);
      makeBox("side-vent", [0.02, 0.025, 0.13], [2.28, -0.82, -0.6 + i * 0.11], black);
    }
    for (let row = 0; row < 3; row += 1) {
      for (let col = 0; col < 8; col += 1) {
        makeBox("perforated-service-hole", [0.055, 0.022, 0.012], [-1.55 + col * 0.16, -1.12 - row * 0.09, 1.16], black);
      }
    }

    makeBox("control-panel", [0.56, 0.28, 0.04], [1.52, -0.62, 1.17], blue, [-0.18, 0, 0]);
    makeBox("control-screen", [0.22, 0.11, 0.02], [1.37, -0.6, 1.205], glass, [-0.18, 0, 0]);
    makeCylinder("control-button-1", 0.045, 0.035, [1.33, -0.54, 1.2], acid, [Math.PI / 2, 0, 0]);
    makeCylinder("control-button-2", 0.035, 0.035, [1.5, -0.54, 1.2], black, [Math.PI / 2, 0, 0]);
    makeCylinder("control-button-3", 0.035, 0.035, [1.66, -0.54, 1.2], metal, [Math.PI / 2, 0, 0]);
    makeCylinder("emergency-stop", 0.055, 0.04, [1.78, -0.54, 1.2], red, [Math.PI / 2, 0, 0]);
    makeCylinder("control-green-led", 0.022, 0.025, [1.22, -0.54, 1.2], green, [Math.PI / 2, 0, 0]);
    makeCylinder("control-yellow-led", 0.018, 0.025, [1.27, -0.5, 1.2], acid, [Math.PI / 2, 0, 0]);
    makeBox("warning-left", [0.22, 0.02, 0.16], [-1.78, -0.16, 1.02], acid);
    makeBox("warning-right", [0.18, 0.02, 0.14], [2.0, 0.08, -0.08], acid);
    makeBox("brand-plate", [0.7, 0.025, 0.16], [0.92, -0.48, 1.21], bodyLight, [-0.16, 0, 0]);
    makeBox("brand-mark", [0.34, 0.03, 0.04], [0.88, -0.45, 1.23], black, [-0.16, 0, 0]);
    makeLabel(
      "front-tech-label",
      [0.58, 0.22],
      [-1.12, -0.82, 1.185],
      makeLabelTexture(["UV-FLAT 3200", "CMYK + WHITE", "VACUUM TABLE"], { width: 640, height: 260 }),
      [-0.05, 0, 0],
    );
    makeLabel(
      "right-warning-label",
      [0.34, 0.17],
      [2.04, 0.12, -0.035],
      makeLabelTexture(["CAUTION", "UV LAMP", "SERVICE LOCK"], { width: 512, height: 220, bg: "#efe300", bar: "#111111", fg: "#111111" }),
      [0, 0, 0],
    );
    for (let i = 0; i < 10; i += 1) {
      makeCylinder("front-panel-screw", 0.018, 0.018, [-1.66 + i * 0.36, -0.79, 1.18], metal, [Math.PI / 2, 0, 0]);
    }
    for (let i = 0; i < 18; i += 1) {
      makeCylinder("deck-screw", 0.014, 0.018, [-1.62 + i * 0.19, -0.22, 1.08], metal, [Math.PI / 2, 0, 0]);
    }
    makeTorus("left-service-handle-ring", 0.08, 0.01, [-2.45, 0.17, -0.28], metal, [0, Math.PI / 2, 0]);
    makeTorus("right-door-handle-ring", 0.07, 0.01, [2.5, 0.1, -0.26], metal, [0, Math.PI / 2, 0]);

    [-1.9, 1.9].forEach((x) => {
      [-0.8, 0.88].forEach((z) => {
        makeCylinder("caster", 0.11, 0.08, [x, -1.54, z], rubber, [Math.PI / 2, 0, 0]);
        makeBox("caster-fork", [0.18, 0.11, 0.04], [x, -1.44, z], metal);
        makeCylinder("caster-axle", 0.018, 0.16, [x, -1.54, z], metal, [0, 0, Math.PI / 2]);
      });
    });

    const sparkGeometry = new THREE.BufferGeometry();
    const sparkPositions = new Float32Array(130 * 3);
    for (let i = 0; i < 130; i += 1) {
      const angle = i * 1.618;
      const radius = 0.35 + ((i * 37) % 100) / 100;
      sparkPositions[i * 3] = -0.12 + Math.cos(angle) * radius * 1.8;
      sparkPositions[i * 3 + 1] = -0.12 + Math.sin(angle * 0.7) * 0.7;
      sparkPositions[i * 3 + 2] = 0.36 + Math.sin(angle) * radius * 0.8;
    }
    sparkGeometry.setAttribute("position", new THREE.BufferAttribute(sparkPositions, 3));
    const sparks = new THREE.Points(
      sparkGeometry,
      new THREE.PointsMaterial({
        color: 0xdbe600,
        size: 0.038,
        transparent: true,
        opacity: 0.72,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    group.add(sparks);

    const light = new THREE.DirectionalLight(0xffffff, 3.2);
    light.position.set(-3.2, 3.8, 4);
    scene.add(light);
    const rimLight = new THREE.DirectionalLight(0xdbe600, 2.2);
    rimLight.position.set(4, 1.8, -3);
    scene.add(rimLight);
    const acidLight = new THREE.PointLight(0xdbe600, 8.8, 7.5);
    acidLight.position.set(-0.3, 0.05, 1.35);
    scene.add(acidLight);
    scene.add(new THREE.AmbientLight(0xffffff, 0.86));

    let targetRotation = 0;
    let currentRotation = targetRotation;
    let frameId = 0;

    const resize = () => {
      const { width, height } = visual.getBoundingClientRect();
      const canvasWidth = Math.max(320, width);
      const canvasHeight = Math.max(320, height);
      renderer.setSize(canvasWidth, canvasHeight, false);
      camera.aspect = canvasWidth / canvasHeight;
      camera.updateProjectionMatrix();
    };

    const updateScroll = () => {
      const rect = section.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const progress = Math.min(1, Math.max(0, (viewport - rect.top) / (viewport + rect.height)));
      const frontProgress = viewport / (viewport + Math.max(rect.height, 1));
      targetRotation = Math.max(-2.55, Math.min(2.55, (frontProgress - progress) * 5.15));
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(section);
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", resize);
    resize();
    updateScroll();

    const animate = (time) => {
      const t = time * 0.001;
      currentRotation += (targetRotation - currentRotation) * 0.115;
      group.rotation.y = currentRotation + Math.sin(t * 0.55) * 0.035;
      group.rotation.x = -0.1 + Math.sin(t * 0.4) * 0.018;
      carriage.position.x = Math.sin(t * 1.35) * 1.34;
      sheet.position.z = 0.3 + Math.sin(t * 0.8) * 0.025;
      printedArt.position.z = sheet.position.z;
      sparks.rotation.y = -currentRotation * 0.42 + t * 0.05;
      sparks.rotation.z = Math.sin(t * 0.6) * 0.08;
      acidLight.intensity = 4.8 + Math.sin(t * 3.3) * 1.9;
      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", resize);
      resizeObserver.disconnect();
      renderer.dispose();
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) object.material.dispose();
      });
    };
  }, []);

  return (
    <section className="production-lab" id="production-lab" ref={sectionRef} aria-label="Печатный цикл">
      <div className="lab-copy">
        <span>Печатный цикл</span>
        <h2>От макета до готового тиража</h2>
        <p>
          Мы ведём проект как производственный модуль: проверяем файл, подбираем
          материал, запускаем промышленную машину и доводим изделие до упаковки.
        </p>
        <div className="lab-metrics" aria-label="Этапы производства">
          <strong>01 / препресс</strong>
          <strong>02 / печать</strong>
          <strong>03 / постобработка</strong>
        </div>
      </div>
      <div className="lab-visual">
        <canvas ref={canvasRef} aria-label="3D модель печатного модуля" />
      </div>
    </section>
  );
}

export function App() {
  return (
    <main className="page" id="top">
      <div className="site-shell">
        <Header />

        <section className="hero" aria-label="Главный экран PrintHub">
          <img
            className="hero-bg generated-bg"
            src="assets/generated/hero-clean.png"
            alt=""
            aria-hidden="true"
          />
          <img
            className="hero-bg reference-scene"
            src="assets/crops/hero-scene.png"
            alt=""
            aria-hidden="true"
          />
          <div className="hero-vignette" />
          <div className="print-sweep" aria-hidden="true" />
          <div className="grain-layer" aria-hidden="true" />
          <div className="quality-badge" aria-label="Качество в деталях, идея в реальности">
            <SealCheck weight="regular" />
            <span>Качество в деталях</span>
            <small>Идея в реальности</small>
          </div>

          <div className="hero-content">
            <div className="hand-note">Твои идеи</div>
            <h1>
              <span>Печатаем.</span>
              <strong>Впечатляем.</strong>
            </h1>
            <p>
              Мы не просто печатаем - мы создаём эмоции. Сочетаем технологичность,
              креатив и внимание к деталям, чтобы каждый оттиск был{" "}
              <b>уникальным.</b>
            </p>
            <div className="hero-actions">
              <button className="primary-button" type="button">
                Рассчитать проект
                <ArrowRight weight="bold" />
              </button>
              <button className="video-button" type="button">
                <span>
                  <Play weight="fill" />
                </span>
                Смотреть видео
              </button>
            </div>
          </div>

          <ul className="features" aria-label="Преимущества">
            {features.map((feature) => (
              <FeatureItem feature={feature} key={feature.title} />
            ))}
          </ul>
        </section>

        <section className="catalog" aria-label="Продукция">
          {products.map((product, index) => (
            <ProductCard product={product} key={product.title} index={index} />
          ))}
        </section>

        <PressModel />
        <ProductionFlow />
      </div>
    </main>
  );
}
