/* =========================================================
   WALO — interacciones
   ========================================================= */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Intro ---------- */
  const intro = document.getElementById("intro");
  if (intro && !reduceMotion) {
    window.addEventListener("load", () => {
      setTimeout(() => intro.classList.add("is-done"), 1350);
      setTimeout(() => (intro.style.display = "none"), 2100);
    });
  } else if (intro) {
    intro.style.display = "none";
  }

  /* ---------- Reveal on scroll ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  /* ---------- Parallax multivelocidad (galería) ---------- */
  const tiles = Array.from(document.querySelectorAll(".tile[data-speed]"));

  if (tiles.length && !reduceMotion) {
    let vh = window.innerHeight;

    // Posición base (layout, sin transform) de cada tile
    function measure() {
      vh = window.innerHeight;
      const scy = window.scrollY;
      const mobile = window.innerWidth <= 900;
      tiles.forEach((t, i) => {
        const prev = t.style.transform;
        t.style.transform = "none";
        const rect = t.getBoundingClientRect();
        t._base = rect.top + scy + rect.height / 2; // centro absoluto
        // en móvil (tiles a ancho completo) atenúa el vertical y anula la deriva
        t._speedY = (parseFloat(t.dataset.speed) || 0) * (mobile ? 0.5 : 1);
        t._speedX = mobile ? 0 : (parseFloat(t.dataset.drift) || 0);
        t._ease = 0.065 + (i % 5) * 0.02;             // ritmo distinto por tile
        t._curY = 0;
        t._curX = 0;
        t.style.transform = prev;
      });
    }

    function frame() {
      const mid = window.scrollY + vh / 2;
      tiles.forEach((t) => {
        const rel = mid - t._base;               // distancia al centro del viewport
        const ty = rel * t._speedY;
        const tx = rel * t._speedX;
        // suavizado independiente → cada imagen "cae" a su propio ritmo
        t._curY += (ty - t._curY) * t._ease;
        t._curX += (tx - t._curX) * t._ease;
        t.style.transform =
          "translate3d(" + t._curX.toFixed(2) + "px," + t._curY.toFixed(2) + "px,0)";
      });
      requestAnimationFrame(frame);
    }

    // esperar a fuentes/imágenes para medir bien
    window.addEventListener("load", () => {
      measure();
      requestAnimationFrame(frame);
    });
    let rt;
    window.addEventListener("resize", () => {
      clearTimeout(rt);
      rt = setTimeout(measure, 150);
    });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => setTimeout(measure, 50));
    }
  }

  /* ---------- Tema del header según sección ----------
     (con mix-blend-mode: difference el header ya se adapta,
      pero mantenemos el hook por si se desactiva) */
  const sections = Array.from(document.querySelectorAll(".section[data-theme]"));
  const header = document.getElementById("header");
  function updateHeader() {
    const y = 40;
    let theme = "dark";
    for (const s of sections) {
      const r = s.getBoundingClientRect();
      if (r.top <= y && r.bottom > y) {
        theme = s.dataset.theme;
        break;
      }
    }
    header.dataset.theme = theme;
  }
  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  /* ---------- Dispositivo "O": sol / eclipse ---------- */
  const odevice = document.getElementById("odevice");
  if (odevice) {
    odevice.addEventListener("click", () => {
      odevice.dataset.mode = odevice.dataset.mode === "sol" ? "eclipse" : "sol";
    });
    // alterna solo cuando es visible, para que el usuario lo descubra
    if ("IntersectionObserver" in window && !reduceMotion) {
      let timer = null;
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            timer = setInterval(() => {
              odevice.dataset.mode = odevice.dataset.mode === "sol" ? "eclipse" : "sol";
            }, 3200);
          } else if (timer) {
            clearInterval(timer);
            timer = null;
          }
        });
      }, { threshold: 0.5 });
      io.observe(odevice);
    }
  }
})();
