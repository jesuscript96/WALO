/* =========================================================
   PROYECTO · lightbox de la galería + parallax suave del hero
   ========================================================= */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Lightbox ---------- */
const dialog = document.querySelector<HTMLDialogElement>("[data-lightbox]");
const shots = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-gallery] .p-shot"));
if (dialog && shots.length && typeof dialog.showModal === "function") {
  const img = dialog.querySelector<HTMLImageElement>("[data-lb-img]")!;
  const cap = dialog.querySelector<HTMLElement>("[data-lb-cap]")!;
  const count = dialog.querySelector<HTMLElement>("[data-lb-count]")!;
  let index = 0;
  let opener: HTMLElement | null = null;
  const pad = (n: number) => String(n).padStart(2, "0");

  const show = (i: number) => {
    index = (i + shots.length) % shots.length;
    const s = shots[index];
    img.src = s.dataset.full || "";
    img.alt = s.dataset.alt || "";
    cap.textContent = s.dataset.alt || "";
    count.textContent = `${pad(index + 1)} / ${pad(shots.length)}`;
  };

  shots.forEach((s, i) =>
    s.addEventListener("click", () => {
      opener = s;
      show(i);
      dialog.showModal();
      document.body.style.overflow = "hidden";
    })
  );
  dialog.querySelector("[data-lb-prev]")!.addEventListener("click", () => show(index - 1));
  dialog.querySelector("[data-lb-next]")!.addEventListener("click", () => show(index + 1));
  dialog.querySelector("[data-lb-close]")!.addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => {
    document.body.style.overflow = "";
    opener?.focus();
  });
  dialog.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") show(index + 1);
    if (e.key === "ArrowLeft") show(index - 1);
  });
  // clic fuera de la imagen (en el fondo del escenario) cierra
  dialog.querySelector(".lightbox__stage")!.addEventListener("click", (e) => {
    if (e.target === e.currentTarget) dialog.close();
  });
}

/* ---------- Parallax del hero ---------- */
const heroImg = document.querySelector<HTMLElement>("[data-hero-img]");
if (heroImg && !reduceMotion) {
  let ticking = false;
  const update = () => {
    ticking = false;
    const y = Math.min(window.scrollY, window.innerHeight);
    heroImg.style.transform = `translate3d(0, ${(-y * 0.12).toFixed(1)}px, 0)`;
  };
  window.addEventListener("scroll", () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
  update();
}

export {};
