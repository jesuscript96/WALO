/* =========================================================
   PHOTOMETRY v2 · "De la fotometría a la realidad"
   Hero sticky: scroll dibuja las luminarias y enciende el circuito.
   IES sticky: la curva despliega, florece y se vuelve luz.
   Work: cada foto se enciende al cruzar el centro (wall-wash).
   Footer: el haz colapsa en el LED.
   ========================================================= */

(function () {
  "use strict";
  if (!window.gsap || !window.ScrollTrigger) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  gsap.registerPlugin(ScrollTrigger);

  const docEl = document.documentElement;
  const hero  = document.querySelector(".pm--hero");
  const led   = document.querySelector(".pm-led");
  const burst = document.querySelector(".pm-burst");
  if (!hero) return;

  /* ----- estado del haz (posiciones en %) ----- */
  const beam  = { y: 50 };
  const beamOp = { v: 0 };
  const setBeamY  = () => docEl.style.setProperty("--beam-y",  beam.y.toFixed(2) + "%");
  const setBeamOp = () => docEl.style.setProperty("--beam-op", beamOp.v.toFixed(3));

  /* =========================================================
     01 · HERO — las luminarias se encienden una a una con el scroll
     ========================================================= */
  const N_LAMPS = 5;

  const heroTL = gsap.timeline({
    scrollTrigger: { trigger: "#pm-hero-wrap", start: "top top", end: "bottom bottom", scrub: 0.5 }
  });

  for (let i = 1; i <= N_LAMPS; i++) {
    const sel = `.pm-lamp[data-lamp="${i}"]`;
    const t = 0.18 + (i - 1) * 0.11;           // secuencia: una lámpara por tramo
    heroTL
      .to(`${sel} .pm-fix`,  { stroke: "#ffce8a", duration: 0.05, ease: "none" }, t)   // trazo → cálido
      .to(`${sel} .pm-glow`, { opacity: 1, duration: 0.08, ease: "none" }, t)          // aparece el haz
      .to(`${sel} .pm-pool`, { opacity: 1, duration: 0.08, ease: "none" }, t + 0.02)   // aparece la piscina
      .to(`${sel} .pm-label`,{ fill: "rgba(255,206,138,.85)", duration: 0.05, ease: "none" }, t + 0.02);
  }

  // transición de salida
  heroTL
    .to(".pm-lamps", { scale: 1.06, duration: 0.25, ease: "power2.in" }, 0.82)
    .to(".pm-lamps", { opacity: 0, duration: 0.2, ease: "power2.in" }, 0.86)
    .to([".pm-hero-top", ".pm-hero-foot"], { opacity: 0, duration: 0.2 }, 0.86);

  /* =========================================================
     02 · IES — despliegue + florece → se vuelve luz
     ========================================================= */
  gsap.set(".pm-grid circle, .pm-grid line, .pm-curve", { strokeDashoffset: 1 });

  gsap.timeline({
    scrollTrigger: { trigger: "#pm-ies-wrap", start: "top top", end: "bottom bottom", scrub: 0.5 }
  })
  .to(".pm-grid circle, .pm-grid line", { strokeDashoffset: 0, duration: 0.3, stagger: 0.02, ease: "none" }, 0)
  .to(".pm-curve",     { strokeDashoffset: 0, duration: 0.35, ease: "none" }, 0.12)
  .to(".pm-ies-stage", { scale: 1.3, duration: 0.3, ease: "power2.in" }, 0.5)            // florece
  .to(".pm-ies-stage", { opacity: 0, duration: 0.25, ease: "power2.in" }, 0.62)
  .to(beamOp, { v: 1, duration: 0.35, ease: "none", onUpdate: setBeamOp }, 0.5);         // aparece el haz

  /* =========================================================
     03 · WORK — cada foto se enciende al cruzar el centro
     ========================================================= */
  gsap.utils.toArray(".pm--work .tile").forEach(tile => {
    const img = tile.querySelector("img");
    if (!img) return;
    const st = { b: 0.05, s: 0.55 };
    const apply = () => { img.style.filter = "brightness(" + st.b.toFixed(3) + ") saturate(" + st.s.toFixed(3) + ")"; };
    apply();
    gsap.timeline({ scrollTrigger: { trigger: tile, start: "top bottom", end: "bottom top", scrub: true } })
      .to(st, { b: 1, s: 1,    duration: 0.5, ease: "none", onUpdate: apply })   // entra → centro (enciende)
      .to(st, { b: 0.45, s: 0.8, duration: 0.5, ease: "none", onUpdate: apply }); // centro → sale (atenúa)
  });

  /* =========================================================
     04 · FOOTER — el haz colapsa en el LED
     ========================================================= */
  ScrollTrigger.create({
    trigger: ".pm--footer", start: "center center",
    onEnter: () => {
      const r = led.getBoundingClientRect();
      const ledY = (r.top + r.height / 2) / window.innerHeight * 100;
      gsap.to(beam,   { y: ledY, duration: 0.8, ease: "power2.inOut", onUpdate: setBeamY, overwrite: "auto" });
      gsap.to(beamOp, { v: 1, duration: 0.4, onUpdate: setBeamOp });
      docEl.style.setProperty("--beam-h", "7vh");
      burst.classList.add("is-on");
    },
    onLeaveBack: () => {
      docEl.style.setProperty("--beam-h", "40vh");
      burst.classList.remove("is-on");
      gsap.to(beam, { y: 50, duration: 0.5, onUpdate: setBeamY });
    }
  });

  window.addEventListener("load", () => ScrollTrigger.refresh());
})();
