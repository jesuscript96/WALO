/* =========================================================
   WALO — formulario de contacto
   Validación: nombre obligatorio + correo O teléfono (al menos
   uno, y válidos si se rellenan) + consentimiento.
   ========================================================= */

type Messages = {
  errors: Record<"name" | "contact" | "email" | "phone" | "consent" | "summary", string>;
  sending: string;
  submit: string;
  successBody: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[\d\s().-]{6,20}$/;

function setError(form: HTMLFormElement, key: string, msg: string) {
  const field = form.querySelector<HTMLElement>(`[data-field="${key}"]`);
  const input = field?.querySelector<HTMLInputElement | HTMLTextAreaElement>("input,textarea");
  const err = form.querySelector<HTMLElement>(`#${form.id}-${key}-err`);
  field?.classList.toggle("is-invalid", !!msg);
  if (input) input.setAttribute("aria-invalid", msg ? "true" : "false");
  if (err) err.textContent = msg;
}

function validate(form: HTMLFormElement, m: Messages) {
  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const phone = String(data.get("phone") || "").trim();
  const consent = data.get("consent") === "on";
  const digits = phone.replace(/\D/g, "");

  const errs: Record<string, string> = { name: "", email: "", phone: "", consent: "" };
  if (!name) errs.name = m.errors.name;
  if (!email && !phone) {
    errs.email = m.errors.contact;
  } else {
    if (email && !EMAIL_RE.test(email)) errs.email = m.errors.email;
    if (phone && (!PHONE_RE.test(phone) || digits.length < 6)) errs.phone = m.errors.phone;
  }
  if (!consent) errs.consent = m.errors.consent;

  Object.entries(errs).forEach(([k, v]) => setError(form, k, v));
  form.querySelector("[data-hint]")?.classList.toggle("is-invalid", !email && !phone);

  const firstInvalid = (["name", "email", "phone", "consent"] as const).find((k) => errs[k]);
  return { ok: !firstInvalid, firstInvalid, payload: { name, email, phone, message: String(data.get("message") || "").trim() } };
}

async function send(form: HTMLFormElement, payload: Record<string, string>) {
  const endpoint = form.dataset.endpoint;
  const forceError = new URLSearchParams(location.search).get("form") === "error";
  if (forceError) {
    await new Promise((r) => setTimeout(r, 900));
    throw new Error("forced");
  }
  if (!endpoint) {
    // Sin integración de correo aún: simulamos el envío.
    await new Promise((r) => setTimeout(r, 900));
    return;
  }
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ ...payload, page: location.pathname, lang: document.documentElement.lang }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

function init(form: HTMLFormElement) {
  if (form.dataset.ready) return;
  form.dataset.ready = "1";
  const m: Messages = JSON.parse(form.dataset.messages || "{}");
  const wrap = form.closest<HTMLElement>("[data-form-wrap]")!;
  const success = wrap.querySelector<HTMLElement>("[data-success]")!;
  const successText = wrap.querySelector<HTMLElement>("[data-success-text]")!;
  const alertBox = form.querySelector<HTMLElement>("[data-alert]")!;
  const summary = form.querySelector<HTMLElement>(".form-summary")!;
  const submit = form.querySelector<HTMLButtonElement>("[data-submit]")!;
  const submitLabel = form.querySelector<HTMLElement>("[data-submit-label]")!;
  let attempted = false;

  // Tras el primer intento, revalidamos en vivo para que los errores desaparezcan al corregir.
  form.addEventListener("input", () => {
    if (!attempted) return;
    const r = validate(form, m);
    summary.textContent = r.ok ? "" : m.errors.summary;
  });
  form.addEventListener("change", (e) => {
    if (attempted && (e.target as HTMLInputElement).name === "consent") validate(form, m);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    attempted = true;
    alertBox.hidden = true;

    const hp = form.querySelector<HTMLInputElement>('input[name="company"]');
    const r = validate(form, m);
    if (!r.ok) {
      summary.textContent = m.errors.summary;
      const target = form.querySelector<HTMLElement>(`[data-field="${r.firstInvalid}"] input, [data-field="${r.firstInvalid}"] textarea`);
      target?.focus();
      return;
    }
    summary.textContent = "";

    submit.disabled = true;
    submitLabel.textContent = m.sending;
    try {
      if (!hp?.value) await send(form, r.payload); // bots: fingimos éxito sin enviar
      successText.textContent = m.successBody.replace("{name}", r.payload.name.split(" ")[0]);
      form.hidden = true;
      success.hidden = false;
      success.focus({ preventScroll: true });
      success.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } catch {
      alertBox.hidden = false;
    } finally {
      submit.disabled = false;
      submitLabel.textContent = m.submit;
    }
  });

  wrap.querySelector("[data-again]")?.addEventListener("click", () => {
    form.reset();
    attempted = false;
    ["name", "email", "phone", "consent"].forEach((k) => setError(form, k, ""));
    form.querySelector("[data-hint]")?.classList.remove("is-invalid");
    success.hidden = true;
    form.hidden = false;
    form.querySelector<HTMLInputElement>('input[name="name"]')?.focus();
  });
}

document.querySelectorAll<HTMLFormElement>("[data-lead-form]").forEach(init);

export {};
