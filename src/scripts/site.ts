/* =========================================================
   WALO — comportamiento común (todas las páginas)
   Header (tema según sección + estado scroll), desplegable de
   proyectos, menú móvil y reveal on scroll.
   ========================================================= */

const root = document.documentElement;
const header = document.getElementById("site-header");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Header: tema de la sección que tiene debajo ---------- */
if (header) {
  const themed = Array.from(document.querySelectorAll<HTMLElement>("main [data-theme], #footer"));
  let ticking = false;
  const update = () => {
    ticking = false;
    const y = header.offsetHeight / 2;
    let theme = header.dataset.theme || "light";
    for (const s of themed) {
      const r = s.getBoundingClientRect();
      if (r.top <= y && r.bottom > y) {
        theme = s.dataset.theme || theme;
        break;
      }
    }
    header.dataset.theme = theme;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  window.addEventListener("scroll", () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
  window.addEventListener("resize", update);
  update();
}

/* ---------- Desplegable "Proyectos" ---------- */
document.querySelectorAll<HTMLElement>("[data-dropdown]").forEach((drop) => {
  const btn = drop.querySelector<HTMLButtonElement>("button")!;
  const panel = drop.querySelector<HTMLElement>(".dropdown")!;
  let closeTimer: number | undefined;

  const set = (open: boolean) => {
    drop.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", String(open));
  };

  btn.addEventListener("click", () => set(!drop.classList.contains("is-open")));

  const canHover = window.matchMedia("(hover: hover)").matches;
  if (canHover) {
    drop.addEventListener("mouseenter", () => {
      clearTimeout(closeTimer);
      set(true);
    });
    drop.addEventListener("mouseleave", () => {
      closeTimer = window.setTimeout(() => set(false), 180);
    });
  }

  drop.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drop.classList.contains("is-open")) {
      set(false);
      btn.focus();
    }
    if (e.key === "ArrowDown" && document.activeElement === btn) {
      e.preventDefault();
      set(true);
      panel.querySelector<HTMLElement>("a")?.focus();
    }
  });
  drop.addEventListener("focusout", (e) => {
    if (!drop.contains(e.relatedTarget as Node)) set(false);
  });
  document.addEventListener("click", (e) => {
    if (!drop.contains(e.target as Node)) set(false);
  });
  panel.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => set(false)));
});

/* ---------- Menú móvil ---------- */
const burger = document.querySelector<HTMLButtonElement>(".burger");
const mobileMenu = document.getElementById("mobile-menu");
if (burger && mobileMenu) {
  const label = burger.querySelector<HTMLElement>(".burger__label")!;
  const set = (open: boolean) => {
    root.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", String(open));
    label.textContent = open ? burger.dataset.closeLabel! : burger.dataset.openLabel!;
    if (open) mobileMenu.removeAttribute("inert");
    else mobileMenu.setAttribute("inert", "");
    document.body.style.overflow = open ? "hidden" : "";
  };
  burger.addEventListener("click", () => set(!root.classList.contains("menu-open")));
  mobileMenu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => set(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && root.classList.contains("menu-open")) {
      set(false);
      burger.focus();
    }
  });
  window.matchMedia("(min-width: 901px)").addEventListener("change", (e) => e.matches && set(false));
}

/* ---------- Reveal on scroll ---------- */
const reveals = document.querySelectorAll<HTMLElement>(".reveal");
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
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("is-in"));
}

export {};
