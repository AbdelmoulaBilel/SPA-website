// Shared behaviour: mobile nav, scroll reveal, booking form, "book this" buttons, tabs.
(() => {
  const root = document.documentElement;
  const cfg = window.SITE || {};

  // Mobile navigation
  const toggle = document.querySelector(".menu-toggle");
  const setNav = (open) => {
    root.classList.toggle("nav-open", open);
    toggle?.setAttribute("aria-expanded", open);
  };
  toggle?.addEventListener("click", () => setNav(!root.classList.contains("nav-open")));
  document.querySelectorAll(".nav-links a").forEach((a) => a.addEventListener("click", () => setNav(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && root.classList.contains("nav-open")) { setNav(false); toggle.focus(); }
  });
  document.addEventListener("click", (e) => {
    if (root.classList.contains("nav-open") && !e.target.closest(".nav")) setNav(false);
  });

  // Reveal sections as they scroll into view
  const io = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
      }), { threshold: 0.12 })
    : null;
  document.querySelectorAll(".reveal").forEach((el) => (io ? io.observe(el) : el.classList.add("visible")));

  // Tabs (menu categories): click or arrow keys, one tab in the Tab order
  document.querySelectorAll("[data-tabs]").forEach((tabs) => {
    const buttons = [...tabs.querySelectorAll("[role=tab]")];
    const select = (btn) => buttons.forEach((b) => {
      const on = b === btn;
      b.setAttribute("aria-selected", on);
      b.tabIndex = on ? 0 : -1;
      document.getElementById(b.getAttribute("aria-controls")).hidden = !on;
    });
    buttons.forEach((btn, i) => {
      btn.tabIndex = btn.getAttribute("aria-selected") === "true" ? 0 : -1;
      btn.addEventListener("click", () => select(btn));
      btn.addEventListener("keydown", (e) => {
        const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (!step) return;
        const next = buttons[(i + step + buttons.length) % buttons.length];
        select(next);
        next.focus();
      });
    });
  });

  // "Book this" buttons pre-fill the booking form (a select option or a radio)
  const form = document.querySelector("form[data-booking]");
  document.querySelectorAll("[data-book]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const value = btn.dataset.book;
      const select = form?.querySelector("select[name=service]");
      if (select && [...select.options].some((o) => o.value === value)) select.value = value;
      form?.querySelectorAll("input[type=radio]").forEach((r) => { if (r.value === value) r.checked = true; });
    })
  );

  // Dates: no past days (local time, not UTC)
  const now = new Date();
  const today = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  document.querySelectorAll("input[type=date]").forEach((d) => (d.min = today));

  // Booking form: validate, show confirmation, offer WhatsApp confirmation
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll("[required]").forEach((input) => {
      const field = input.closest(".field");
      const valid = input.checkValidity();
      field?.classList.toggle("invalid", !valid);
      const msg = field?.querySelector(".error");
      if (msg) msg.textContent = valid ? "" : (input.dataset.error || cfg.requiredText || "Required");
      if (!valid && ok) { input.focus(); ok = false; }
    });
    if (!ok) return;

    const data = Object.fromEntries(new FormData(form));
    const lines = Object.entries(data)
      .filter(([, v]) => String(v).trim())
      .map(([k, v]) => `${form.querySelector(`[name=${k}]`)?.dataset.label || k}: ${v}`);
    const wa = form.querySelector("[data-whatsapp-confirm]");
    if (wa && cfg.whatsapp) {
      wa.href = `https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(`${cfg.whatsappIntro || ""}\n${lines.join("\n")}`)}`;
    }
    form.classList.add("sent");
    form.querySelector(".form-success")?.focus();
  });

  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();
