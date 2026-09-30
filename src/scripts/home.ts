/* =========================================================
   HOME · "El Ciclo de la Luz"
   · La O viaja con el scroll: Sol → Lente → Eclipse → encaja en el footer.
   · Cambia de color en cada sección según su data-ball
     (Brasa → Hora azul → Aurora → Brasa → Hora azul → Aurora).
   · De día multiplica (filtro de color); de noche suma (screen).
   + intro del hero · galería con caída multivelocidad · preview del índice
   ========================================================= */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const root = document.documentElement;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const css = getComputedStyle(root);
const COLORS: Record<string, string> = {
  ember: css.getPropertyValue("--ember").trim() || "#FF5A36",
  ultra: css.getPropertyValue("--ultra").trim() || "#6674FF",
  aurora: css.getPropertyValue("--aurora").trim() || "#3FDDA0",
};

/* Posición de la O por sección (desde el centro del viewport, en vw/vh) */
const KEYS: Record<string, { x: number; y: number; s: number }> = {
  hero: { x: 22, y: -18, s: 1 },
  work: { x: 0, y: 8, s: 0.5 },
  about: { x: -16, y: -6, s: 0.42 },
  projects: { x: 24, y: 6, s: 0.34 },
  contact: { x: -24, y: -4, s: 0.55 },
};

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const vw = (f: number) => (window.innerWidth * f) / 100;
const vh = (f: number) => (window.innerHeight * f) / 100;
const pageTop = (el: Element) => el.getBoundingClientRect().top + window.scrollY;

/* ---------------- Ciclo de la luz ---------------- */
function lightCycle() {
  const lc = document.querySelector<HTMLElement>(".light-cycle");
  const o = document.querySelector<HTMLElement>(".lc-o");
  const disc = document.querySelector<HTMLElement>(".lc-disc");
  const ring = document.querySelector<HTMLElement>(".lc-ring");
  const cone = document.querySelector<HTMLElement>(".lc-cone");
  const footer = document.getElementById("footer");
  const footerO = document.querySelector<HTMLElement>(".footer-o");
  const indicator = document.querySelector<HTMLElement>(".cycle-indicator");
  const sections = Array.from(document.querySelectorAll<HTMLElement>("main [data-cycle]"));
  if (!lc || !o || !disc || !ring || !cone || !footer || !footerO || !sections.length) return;

  const phases = Array.from(document.querySelectorAll<HTMLElement>("[data-phase]"));
  let currentPhase = "";
  const setPhase = (id: string) => {
    if (id === currentPhase) return;
    currentPhase = id;
    phases.forEach((p) => p.classList.toggle("is-active", p.dataset.phase === id));
  };

  let tl: gsap.core.Timeline | null = null;

  const build = () => {
    if (tl) {
      tl.scrollTrigger?.kill();
      tl.kill();
    }
    const winH = window.innerHeight;
    const max = Math.max(1, document.documentElement.scrollHeight - winH);
    // progreso en el que la parte superior de la sección alcanza el centro del viewport
    const at = (el: Element) => clamp01((pageTop(el) - winH * 0.5) / max);

    const pts = sections.map((el, i) => ({
      key: el.dataset.cycle!,
      color: COLORS[el.dataset.ball || "ember"],
      t: i === 0 ? 0 : at(el),
      el,
    }));
    const contact = pts[pts.length - 1];
    const tFooter = clamp01((pageTop(footer) - winH) / max); // el footer empieza a asomar
    const tNight = clamp01((pageTop(contact.el) + winH * 0.36 * 0.6 - winH * 0.5) / max);
    const tWork = pts[1]?.t ?? 0.12;

    // destino final: la O del footer con el scroll al 100%
    const fr = footerO.getBoundingClientRect();
    const target = {
      x: fr.left + fr.width / 2 - window.innerWidth / 2,
      y: fr.top + window.scrollY + fr.height / 2 - max - winH / 2,
      s: fr.width / o.offsetWidth,
    };

    const k0 = KEYS[pts[0].key];
    gsap.set(o, { xPercent: -50, yPercent: -50, x: vw(k0.x), y: vh(k0.y), scale: k0.s });
    gsap.set(disc, { opacity: 1, scale: 1 });
    gsap.set(ring, { opacity: 0 });
    gsap.set(cone, { opacity: 0 });
    gsap.set(root, { "--ball": pts[0].color });

    tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        start: 0,
        end: "max",
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress;
          const night = p >= tNight;
          lc!.classList.toggle("is-night", night);
          indicator?.classList.toggle("is-night", night);
          setPhase(p < tWork * 0.8 ? "sol" : night ? "eclipse" : "lens");
          footerO!.classList.toggle("is-lit", p >= 0.97);
          // visible solo entre el hero y el pie (no pisa "↓ Desliza" ni "Volver arriba")
          indicator?.classList.toggle("is-visible", window.scrollY > winH * 0.45 && p < 0.97);
        },
      },
    });

    // Cono de luz que barre el titular al empezar a bajar
    tl.to(cone, { opacity: 0.9, duration: tWork * 0.25, ease: "power1.out" }, 0)
      .to(cone, { opacity: 0, duration: tWork * 0.35, ease: "power1.in" }, tWork * 0.3);

    // Recorrido sección a sección + cambio de color
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1];
      const b = pts[i];
      const k = KEYS[b.key] ?? KEYS.work;
      const d = Math.max(0.001, b.t - a.t);
      tl.to(o, { x: vw(k.x), y: vh(k.y), scale: k.s, duration: d, ease: "sine.inOut" }, a.t);
      tl.to(root, { "--ball": b.color, duration: d * 0.55 }, b.t - d * 0.55);
    }

    // Noche: la O sube al centro y se abre en eclipse (disco → anillo)
    const tStart = contact.t;
    const dEclipse = Math.max(0.01, (tFooter - tStart) * 0.4);
    const tEclipse = Math.max(tStart, tFooter - dEclipse);
    tl.to(o, { x: 0, y: vh(-4), scale: 0.9, duration: dEclipse, ease: "power2.inOut" }, tEclipse)
      .to(disc, { opacity: 0, scale: 0.5, duration: dEclipse, ease: "power2.in" }, tEclipse)
      .to(ring, { opacity: 1, duration: dEclipse, ease: "power2.out" }, tEclipse);

    // Cierre: el eclipse encaja en la O del footer y toma el último color
    const dLand = Math.max(0.01, 1 - tFooter);
    tl.to(o, { x: target.x, y: target.y, scale: target.s, duration: dLand, ease: "power3.inOut" }, tFooter)
      .to(root, { "--ball": COLORS[footer.dataset.ball || "aurora"], duration: dLand * 0.8 }, tFooter);

    tl.set({}, {}, 1); // la timeline dura exactamente 1 → progreso de scroll 0..1
  };

  build();
  let lastW = window.innerWidth;
  let rt: number | undefined;
  const rebuild = () => {
    clearTimeout(rt);
    rt = window.setTimeout(() => {
      build();
      ScrollTrigger.refresh();
    }, 180);
  };
  window.addEventListener("resize", () => {
    if (window.innerWidth === lastW) return; // ignora el resize de la barra del navegador móvil
    lastW = window.innerWidth;
    rebuild();
  });
  window.addEventListener("load", rebuild);
  document.fonts?.ready.then(rebuild);
  // si cambia la altura del documento (p. ej. el formulario pasa a "enviado"), recalcula el recorrido
  let lastH = document.documentElement.scrollHeight;
  new ResizeObserver(() => {
    const hNow = document.documentElement.scrollHeight;
    if (Math.abs(hNow - lastH) < 2) return;
    lastH = hNow;
    rebuild();
  }).observe(document.body);
}

/* ---------------- Intro del hero ---------------- */
function heroIntro() {
  gsap.from("[data-hero-in]", {
    opacity: 0,
    yPercent: 60,
    duration: 1,
    stagger: 0.08,
    ease: "power3.out",
    delay: 0.15,
  });
}

/* ---------------- Galería: caída multivelocidad ---------------- */
function fallingGallery() {
  type Tile = HTMLElement & { _base: number; _sy: number; _sx: number; _ease: number; _y: number; _x: number };
  const tiles = Array.from(document.querySelectorAll<Tile>(".tile[data-speed]"));
  if (!tiles.length) return;
  let viewH = window.innerHeight;

  const measure = () => {
    viewH = window.innerHeight;
    const mobile = window.innerWidth <= 900;
    tiles.forEach((t, i) => {
      const prev = t.style.transform;
      t.style.transform = "none";
      const r = t.getBoundingClientRect();
      t._base = r.top + window.scrollY + r.height / 2;
      t._sy = (parseFloat(t.dataset.speed || "0") || 0) * (mobile ? 0.5 : 1);
      t._sx = mobile ? 0 : parseFloat(t.dataset.drift || "0") || 0;
      t._ease = 0.065 + (i % 5) * 0.02; // cada imagen cae a su propio ritmo
      t._y = t._y ?? 0;
      t._x = t._x ?? 0;
      t.style.transform = prev;
    });
  };

  const frame = () => {
    const mid = window.scrollY + viewH / 2;
    tiles.forEach((t) => {
      const rel = mid - t._base;
      t._y += (rel * t._sy - t._y) * t._ease;
      t._x += (rel * t._sx - t._x) * t._ease;
      t.style.transform = `translate3d(${t._x.toFixed(2)}px,${t._y.toFixed(2)}px,0)`;
    });
    requestAnimationFrame(frame);
  };

  measure();
  requestAnimationFrame(frame);
  window.addEventListener("load", measure);
  document.fonts?.ready.then(() => setTimeout(measure, 50));
  let rt: number | undefined;
  window.addEventListener("resize", () => {
    clearTimeout(rt);
    rt = window.setTimeout(measure, 150);
  });
}

/* ---------------- Índice: imagen que sigue al cursor ---------------- */
function rowPreview() {
  const list = document.querySelector<HTMLElement>("[data-rows]");
  const preview = document.querySelector<HTMLElement>(".row-preview");
  if (!list || !preview || !window.matchMedia("(hover: hover)").matches) return;
  const imgs = Array.from(preview.querySelectorAll("img"));
  const pos = { x: 0, y: 0, tx: 0, ty: 0 };
  let raf = 0;

  const loop = () => {
    pos.x += (pos.tx - pos.x) * 0.16;
    pos.y += (pos.ty - pos.y) * 0.16;
    preview.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%,-50%) scale(1)`;
    raf = requestAnimationFrame(loop);
  };

  list.addEventListener("mousemove", (e) => {
    pos.tx = e.clientX + 140;
    pos.ty = e.clientY;
  });
  list.querySelectorAll<HTMLElement>(".row").forEach((row) => {
    row.addEventListener("mouseenter", (e) => {
      const i = Number(row.dataset.preview);
      imgs.forEach((img, j) => img.classList.toggle("is-on", i === j));
      if (!preview.classList.contains("is-on")) {
        pos.x = pos.tx = e.clientX + 140;
        pos.y = pos.ty = e.clientY;
      }
      preview.classList.add("is-on");
    });
  });
  list.addEventListener("mouseenter", () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(loop);
  });
  list.addEventListener("mouseleave", () => {
    preview.classList.remove("is-on");
    setTimeout(() => cancelAnimationFrame(raf), 300);
  });
}

if (!reduceMotion) {
  heroIntro();
  lightCycle();
  fallingGallery();
}
rowPreview();
