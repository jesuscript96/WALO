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
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

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
  // punto de aterrizaje en la O del footer (scroll en px y progreso) y arranque del tramo final
  let land = { scroll: Infinity, t: 1, tFooter: 1 };

  // Relevo: cuando la bola ha encajado, se oculta y se enciende la O real del footer, que
  // se desplaza con el scroll nativo (en móvil el footer es más alto que la pantalla).
  // Mientras tanto la capa sigue al scroll para que la bola no se quede atrás.
  const syncDock = () => {
    if (!tl) return;
    const y = window.scrollY;
    const docked = tl.progress() >= land.t - 0.0005 && y >= land.scroll - 1;
    const shift = Math.max(0, y - land.scroll);
    lc.style.transform = shift > 0 && !docked ? `translate3d(0,${(-shift).toFixed(2)}px,0)` : "";
    lc.classList.toggle("is-docked", docked);
    footerO.classList.toggle("is-docked", docked);
    footerO.classList.toggle("is-waiting", !docked && tl.progress() >= land.tFooter);
  };

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

    // Destino final: la O del footer. Si con el scroll al 100% la O se ve entera bajo el
    // header, se aterriza al final; si no (móvil: footer más alto que la pantalla), se
    // aterriza cuando la O está al 40% del alto de la pantalla.
    // Se centra respecto a la capa fija (clientWidth/Height, sin la barra de scroll),
    // no respecto a innerWidth: si no, la bola aterriza desplazada media barra.
    const lc0 = lc.style.transform;
    lc.style.transform = "";
    const fr = footerO.getBoundingClientRect();
    lc.style.transform = lc0;
    const fcY = fr.top + window.scrollY + fr.height / 2; // centro de la O en la página
    const headerH = document.querySelector<HTMLElement>(".site-header")?.offsetHeight ?? 0;
    const oTopAtEnd = fcY - fr.height / 2 - max;
    const scrollLand = oTopAtEnd >= headerH ? max : Math.max(0, fcY - lc.clientHeight * 0.4);
    const target = {
      x: fr.left + fr.width / 2 - lc.clientWidth / 2,
      y: fcY - scrollLand - lc.clientHeight / 2,
      s: fr.width / o.offsetWidth,
    };
    land = { scroll: scrollLand, t: scrollLand / max, tFooter };

    const k0 = KEYS[pts[0].key];
    gsap.set(o, { xPercent: -50, yPercent: -50, x: vw(k0.x), y: vh(k0.y), scale: k0.s });
    gsap.set(disc, { opacity: 1, scale: 1 });
    gsap.set(ring, { opacity: 0 });
    gsap.set(cone, { opacity: 0 });
    gsap.set(root, { "--ball": pts[0].color });

    tl = gsap.timeline({
      defaults: { ease: "none" },
      onUpdate: syncDock,
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
          // visible solo entre el hero y el pie (no pisa "↓ Desliza" ni "Volver arriba")
          indicator?.classList.toggle("is-visible", window.scrollY > winH * 0.45 && p < Math.min(0.97, land.t));
        },
      },
    });

    // Cono de luz que barre el titular al empezar a bajar
    tl.to(cone, { opacity: 0.9, duration: tWork * 0.25, ease: "power1.out" }, 0)
      .to(cone, { opacity: 0, duration: tWork * 0.35, ease: "power1.in" }, tWork * 0.3);

    // Recorrido: una sola curva suave hero → secciones → centro (eclipse) → O del footer,
    // a velocidad constante respecto al scroll: sin paradas en los cambios de sección y
    // sin depender de lo larga que sea cada sección.
    const route = [
      ...pts.map((p) => {
        const k = KEYS[p.key] ?? KEYS.work;
        return { x: vw(k.x), y: vh(k.y), s: k.s };
      }),
      { x: 0, y: vh(-4), s: 0.9 }, // noche: el eclipse pasa por el centro
      target,
    ];
    // longitud de cada tramo = desplazamiento + cambio de radio (el tamaño también se percibe como movimiento)
    const size = o.offsetWidth;
    const lens = route.slice(1).map((b, i) => {
      const a = route[i];
      return Math.hypot(b.x - a.x, b.y - a.y) + (Math.abs(b.s - a.s) * size) / 2;
    });
    const total = lens.reduce((sum, l) => sum + l, 0) || 1;
    const tEnd = Math.max(0.01, land.t);
    tl.to(
      o,
      {
        motionPath: { path: route.map(({ x, y }) => ({ x, y })), curviness: 1, fromCurrent: false },
        duration: tEnd,
      },
      0,
    );
    // el tamaño cambia al mismo ritmo: cada tramo ocupa su parte proporcional del recorrido
    let acc = 0;
    for (let i = 0; i < lens.length; i++) {
      const d = (lens[i] / total) * tEnd;
      tl.to(o, { scale: route[i + 1].s, duration: Math.max(0.001, d) }, (acc / total) * tEnd);
      acc += lens[i];
    }

    // Color: cambia al entrar en cada sección (independiente del recorrido)
    for (let i = 1; i < pts.length; i++) {
      const d = Math.max(0.001, pts[i].t - pts[i - 1].t);
      tl.to(root, { "--ball": pts[i].color, duration: d * 0.55 }, pts[i].t - d * 0.55);
    }

    // Noche: la O se abre en eclipse (disco → anillo) al entrar en contacto, antes de llegar
    // al formulario: sobre los campos solo pasa el anillo y el hueco deja leer y escribir.
    // Empieza cuando la sección asoma (85% del alto) y acaba con su borde al 35%.
    const cTop = pageTop(contact.el);
    const tEclipse = clamp01((cTop - winH * 0.85) / max);
    const dEclipse = Math.max(0.01, clamp01((cTop - winH * 0.35) / max) - tEclipse);
    tl.to(disc, { opacity: 0, scale: 0.5, duration: dEclipse, ease: "power2.in" }, tEclipse)
      .to(ring, { opacity: 1, duration: dEclipse, ease: "power2.out" }, tEclipse);

    // Cierre: toma el último color mientras encaja en la O del footer
    const dLand = Math.max(0.01, land.t - tFooter);
    tl.to(root, { "--ball": COLORS[footer.dataset.ball || "aurora"], duration: dLand * 0.8 }, tFooter);

    tl.set({}, {}, 1); // la timeline dura exactamente 1 → progreso de scroll 0..1
    syncDock();
  };

  build();
  window.addEventListener("scroll", syncDock, { passive: true });
  let lastW = window.innerWidth;
  let lastVH = window.innerHeight;
  const touch = window.matchMedia("(pointer: coarse)").matches;
  let rt: number | undefined;
  const rebuild = () => {
    clearTimeout(rt);
    rt = window.setTimeout(() => {
      build();
      ScrollTrigger.refresh();
    }, 180);
  };
  window.addEventListener("resize", () => {
    // en táctil se ignora el cambio de alto (barra del navegador móvil);
    // en escritorio el alto también mueve el punto de aterrizaje en el footer
    const heightChanged = !touch && window.innerHeight !== lastVH;
    if (window.innerWidth === lastW && !heightChanged) return;
    lastW = window.innerWidth;
    lastVH = window.innerHeight;
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
