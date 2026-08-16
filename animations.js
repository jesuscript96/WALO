/* =========================================================
   ANIMATIONS SANDBOX · "El Ciclo de la Luz"
   La O viaja con el scroll: Sol → Lente (difference) → Eclipse → snap footer
   + intro hero · parallax galería · indicador de fase · día→noche
   ========================================================= */

(function () {
  "use strict";

  if (!window.gsap || !window.ScrollTrigger) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  gsap.registerPlugin(ScrollTrigger);

  const lc        = document.querySelector(".light-cycle");
  const o         = document.querySelector(".lc-o");
  const disc      = document.querySelector(".lc-disc");
  const ring      = document.querySelector(".lc-ring");
  const cone      = document.querySelector(".lc-cone");
  const footerO   = document.querySelector(".footer-o");
  const indicator = document.querySelector(".cycle-indicator");
  if (!lc || !o || !footerO) return;

  /* Amarillo señal de la marca (token --signal) */
  const SIGNAL =
    (getComputedStyle(document.documentElement).getPropertyValue("--signal") || "").trim() || "#E9E700";
  const SIGNAL_GLOW = "rgba(233,231,0,.45)";

  /* ---------- Reveal (IntersectionObserver, reemplaza a main.js) ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));

  /* ---------- Intro del hero ---------- */
  gsap.timeline({ delay: 0.25 })
    .from(".sc--hero .kicker",        { opacity: 0, y: 24, duration: 0.8, ease: "power2.out" })
    .from(".sc--hero .hero__title > span",
          { opacity: 0, yPercent: 120, duration: 1.0, stagger: 0.1, ease: "power3.out" }, "-=0.45")
    .from(".sc--hero .hero__foot > *",
          { opacity: 0, y: 18, duration: 0.6, stagger: 0.1, ease: "power2.out" }, "-=0.5");

  /* ---------- Parallax suave en las fotos ---------- */
  gsap.utils.toArray(".tile").forEach((tile, i) => {
    const dir = (i % 2 === 0) ? -1 : 1;
    const amt = 40 + (i % 3) * 24;
    gsap.fromTo(tile, { y: dir * amt }, {
      y: -dir * amt, ease: "none",
      scrollTrigger: { trigger: tile, start: "top bottom", end: "bottom top", scrub: 0.6 }
    });
  });

  /* ---------- Helpers de posición ---------- */
  const vw = f => window.innerWidth * f / 100;
  const vh = f => window.innerHeight * f / 100;

  function footerTarget() {
    const r = footerO.getBoundingClientRect();
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const pageY = r.top + scrollY + r.height / 2;
    const pageX = r.left + r.width / 2;
    const docH = document.documentElement.scrollHeight;
    const winH = window.innerHeight;
    const vpYAtEnd = pageY - (docH - winH);
    const cx = window.innerWidth / 2, cy = winH / 2;
    return { x: pageX - cx, y: vpYAtEnd - cy, scale: r.width / o.offsetWidth };
  }

  /* ---------- Estado inicial: Sol ---------- */
  gsap.set(o,    { xPercent: -50, yPercent: -50, x: vw(22), y: vh(-18), scale: 1 });
  gsap.set(disc, { opacity: 1, scale: 1 });
  gsap.set(ring, { opacity: 0 });
  gsap.set(cone, { opacity: 0 });

  /* ---------- Indicador de fase ---------- */
  const phases = {
    sol:    document.querySelector('[data-phase="sol"]'),
    lens:   document.querySelector('[data-phase="lens"]'),
    eclipse:document.querySelector('[data-phase="eclipse"]')
  };
  let currentPhase = null;
  function setPhase(id) {
    if (id === currentPhase) return;
    currentPhase = id;
    Object.keys(phases).forEach(k => phases[k] && phases[k].classList.toggle("is-active", k === id));
  }
  setPhase("sol");

  /* ---------- Timeline maestra atada al scroll (0..1) ---------- */
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.6,
      invalidateOnRefresh: true,
      onUpdate: self => {
        const p = self.progress;
        setPhase(p < 0.12 ? "sol" : p < 0.62 ? "lens" : "eclipse");
        const night = p > 0.60;
        lc.classList.toggle("is-night", night);
        indicator.classList.toggle("is-night", night);
        // al unirse con la O del footer, esta adopta el amarillo de marca
        footerO.classList.toggle("is-signal", p >= 0.94);
      }
    }
  });

  tl
    // 0.00–0.12 · HERO / SOL : cono barre el titular
    .to(cone, { opacity: 0.9, duration: 0.04, ease: "power1.out" }, 0)
    .to(cone, { opacity: 0,   duration: 0.08, ease: "power1.in"  }, 0.06)
    .to(o,    { x: () => vw(20), y: () => vh(-12), scale: 1,    duration: 0.12, ease: "none" }, 0)

    // 0.12–0.42 · GALLERY : la O baja y se reduce (diafragma/lente)
    .to(o,    { x: () => vw(0),  y: () => vh(8),   scale: 0.50, duration: 0.30, ease: "none" }, 0.12)

    // 0.42–0.62 · APPROACH : continúa como lente
    .to(o,    { x: () => vw(-16),y: () => vh(-6),  scale: 0.42, duration: 0.20, ease: "none" }, 0.42)

    // 0.62–0.80 · NOCHE : sube al centro (background ya oscuro)
    .to(o,    { x: () => vw(0),  y: () => vh(-10), scale: 0.60, duration: 0.18, ease: "power1.inOut" }, 0.62)

    // 0.80–0.90 · ECLIPSE : disco se vacía, aparece el anillo
    .to(o,    { x: 0, y: 0, scale: 1, duration: 0.10, ease: "power2.inOut" }, 0.80)
    .to(disc, { opacity: 0, scale: 0.5, duration: 0.10, ease: "power2.in", transformOrigin: "50% 50%" }, 0.80)
    .to(ring, { opacity: 1, duration: 0.10, ease: "power2.out" }, 0.80)

    // 0.90–1.00 · CIERRE : el eclipse encaja en la O del footer
    // y se convierte en el amarillo señal de la marca
    .to(o,    {
      x: () => footerTarget().x,
      y: () => footerTarget().y,
      scale: () => footerTarget().scale,
      duration: 0.10,
      ease: "power3.inOut"
    }, 0.90)
    .to(ring, {
      borderColor: SIGNAL,
      boxShadow: "0 0 6vmax " + SIGNAL_GLOW,
      duration: 0.06,
      ease: "power2.inOut"
    }, 0.94);

  window.addEventListener("load", () => ScrollTrigger.refresh());
})();
