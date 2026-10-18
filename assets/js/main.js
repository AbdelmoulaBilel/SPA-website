// Shared behaviour: mobile nav, scroll reveal, booking form, "book this" buttons, tabs.
(() => {
  const root = document.documentElement;
  const cfg = window.SITE || {};

  // Mobile navigation
  const toggle = document.querySelector(".menu-toggle");
  toggle?.addEventListener("click", () => {
    const open = root.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", open);
  });
  document.querySelectorAll(".nav-links a").forEach((a) =>
    a.addEventListener("click", () => {
      root.classList.remove("nav-open");
      toggle?.setAttribute("aria-expanded", "false");
    })
  );

  // Reveal sections as they scroll into view
  const io = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
      }), { threshold: 0.12 })
    : null;
  document.querySelectorAll(".reveal").forEach((el) => (io ? io.observe(el) : el.classList.add("visible")));

  // Tabs (menu categories, price lists)
  document.querySelectorAll("[data-tabs]").forEach((tabs) => {
    const buttons = tabs.querySelectorAll("[role=tab]");
    buttons.forEach((btn) => btn.addEventListener("click", () => {
      buttons.forEach((b) => {
        const on = b === btn;
        b.setAttribute("aria-selected", on);
        document.getElementById(b.getAttribute("aria-controls")).hidden = !on;
      });
    }));
  });

  // "Book this" buttons pre-select the service in the booking form
  const form = document.querySelector("form[data-booking]");
  document.querySelectorAll("[data-book]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const select = form?.querySelector("[name=service]");
      if (select) select.value = btn.dataset.book;
    })
  );

  // Dates: no past days
  const today = new Date().toISOString().slice(0, 10);
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
