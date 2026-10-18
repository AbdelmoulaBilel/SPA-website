// AI assistant widget.
// <script src="assets/js/assistant.js" data-site="spa" data-knowledge="assistant.json"
//         data-endpoint="https://<worker>.workers.dev/chat" defer></script>
// With no endpoint (or if it fails) it answers from the FAQ in the knowledge file.
(() => {
  const script = document.currentScript;
  const site = script.dataset.site;
  const endpoint = script.dataset.endpoint || "";
  const storeKey = `assistant:${site}`;
  const MAX_HISTORY = 12;

  const store = {
    get() { try { return JSON.parse(sessionStorage.getItem(storeKey)) || {}; } catch { return {}; } },
    set(v) { try { sessionStorage.setItem(storeKey, JSON.stringify(v)); } catch {} },
  };

  const normalize = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

  // Styles live next to the script (assets/css/assistant.css); loading them here keeps them off the critical path.
  const css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = new URL("../css/assistant.css", script.src).href;
  document.head.append(css);

  fetch(script.dataset.knowledge).then((r) => r.json()).then(init).catch(() => {});

  function init(kb) {
    const ui = kb.ui;
    const state = store.get();
    let messages = state.messages || [];
    let online = Boolean(endpoint);

    const el = (tag, cls, text) => {
      const n = document.createElement(tag);
      if (cls) n.className = cls;
      if (text != null) n.textContent = text;
      return n;
    };

    // Launcher + teaser
    const launcher = el("button", "ai-launcher");
    launcher.type = "button";
    launcher.setAttribute("aria-label", ui.launcher); // same as the visible label
    launcher.setAttribute("aria-expanded", "false");
    launcher.setAttribute("aria-controls", "ai-panel");
    launcher.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3c5 0 9 3.6 9 8s-4 8-9 8c-1 0-2-.1-2.9-.4L4 20l1.3-3.9C3.9 14.8 3 13 3 11c0-4.4 4-8 9-8Z" fill="currentColor"/><circle cx="8.5" cy="11" r="1.2" fill="var(--ai-bubble-dot)"/><circle cx="12" cy="11" r="1.2" fill="var(--ai-bubble-dot)"/><circle cx="15.5" cy="11" r="1.2" fill="var(--ai-bubble-dot)"/></svg><span class="ai-launcher-label">${ui.launcher}</span>`;
    const teaser = el("button", "ai-teaser", ui.teaser);
    teaser.type = "button";

    // Panel
    const panel = el("section", "ai-panel");
    panel.id = "ai-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", ui.title);
    panel.hidden = true;

    const head = el("header", "ai-head");
    const avatar = el("div", "ai-avatar", "✦");
    const titles = el("div", "ai-titles");
    titles.append(el("strong", null, ui.title));
    const status = el("span", "ai-status");
    titles.append(status);
    const close = el("button", "ai-close", "×");
    close.type = "button";
    close.setAttribute("aria-label", ui.close);
    head.append(avatar, titles, close);

    const log = el("div", "ai-log");
    log.setAttribute("aria-live", "polite");

    const chips = el("div", "ai-chips");
    ui.suggestions.forEach((q) => {
      const c = el("button", "ai-chip", q);
      c.type = "button";
      c.addEventListener("click", () => send(q));
      chips.append(c);
    });

    const cta = el("a", "ai-cta", ui.cta.label);
    cta.href = ui.cta.href;
    cta.addEventListener("click", () => toggle(false));

    const formEl = el("form", "ai-form");
    const input = el("input");
    input.type = "text";
    input.maxLength = 500;
    input.placeholder = ui.placeholder;
    input.setAttribute("aria-label", ui.placeholder);
    const sendBtn = el("button", "ai-send");
    sendBtn.type = "submit";
    sendBtn.setAttribute("aria-label", ui.send);
    sendBtn.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.4 20.4 21 12 3.4 3.6 3.4 10l12.6 2-12.6 2z" fill="currentColor"/></svg>`;
    formEl.append(input, sendBtn);

    const foot = el("p", "ai-foot", ui.disclaimer);
    panel.append(head, log, chips, cta, formEl, foot);
    document.body.append(teaser, launcher, panel);

    function setStatus() { status.textContent = online ? ui.statusOnline : ui.statusOffline; }
    setStatus();

    function bubble(role, text) {
      const b = el("div", `ai-msg ai-msg--${role}`, text);
      log.append(b);
      log.scrollTop = log.scrollHeight;
      return b;
    }

    function render() {
      log.replaceChildren();
      bubble("assistant", ui.greeting);
      messages.forEach((m) => bubble(m.role, m.content));
      chips.hidden = messages.length > 0;
    }

    function toggle(open = panel.hidden) {
      panel.hidden = !open;
      launcher.setAttribute("aria-expanded", open);
      document.documentElement.classList.toggle("ai-open", open);
      teaser.hidden = true;
      if (open) {
        state.seen = true;
        store.set({ ...state, messages });
        input.focus();
      } else {
        launcher.focus();
      }
    }

    launcher.addEventListener("click", () => toggle());
    teaser.addEventListener("click", () => toggle(true));
    close.addEventListener("click", () => toggle(false));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !panel.hidden) toggle(false); });
    document.querySelectorAll("[data-open-assistant]").forEach((b) => b.addEventListener("click", (e) => { e.preventDefault(); toggle(true); }));

    // Show the teaser once per session after a short delay
    teaser.hidden = true;
    if (!state.seen) setTimeout(() => { if (panel.hidden) teaser.hidden = false; }, 12000);

    // Keyword hit: phrases match anywhere, short words (<= 3 letters) match whole words,
    // longer ones match word starts ("reserv" hits "reservation").
    function hits(q, words, keyword) {
      const k = normalize(keyword);
      if (k.includes(" ")) return q.includes(k);
      return words.some((w) => (k.length <= 3 ? w === k : w.startsWith(k)));
    }

    function offlineAnswer(question) {
      const q = normalize(question);
      const words = q.split(/[^a-z0-9]+/).filter(Boolean);
      let best = null, bestScore = 0;
      for (const item of kb.faq) {
        const score = item.keywords.reduce((s, k) => s + (hits(q, words, k) ? 1 : 0), 0);
        if (score > bestScore) { best = item; bestScore = score; }
      }
      return best ? best.a : ui.fallback;
    }

    async function askServer() {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 25000);
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ site, messages: messages.slice(-MAX_HISTORY) }),
          signal: ctrl.signal,
        });
        if (!res.ok) throw new Error(res.status);
        const data = await res.json();
        if (!data.reply) throw new Error("empty");
        return data.reply;
      } finally {
        clearTimeout(timer);
      }
    }

    let busy = false;
    async function send(text) {
      text = text.trim();
      if (!text || busy) return;
      busy = true;
      input.value = "";
      chips.hidden = true;
      messages.push({ role: "user", content: text.slice(0, 500) });
      bubble("user", text);
      const typing = bubble("assistant", "");
      typing.classList.add("ai-typing");
      typing.innerHTML = "<span></span><span></span><span></span>";

      let reply;
      if (online) {
        try { reply = await askServer(); }
        catch { online = false; setStatus(); }
      }
      if (!reply) {
        await new Promise((r) => setTimeout(r, 500));
        reply = offlineAnswer(text);
      }
      typing.remove();
      messages.push({ role: "assistant", content: reply });
      bubble("assistant", reply);
      store.set({ ...state, messages });
      busy = false;
    }

    formEl.addEventListener("submit", (e) => { e.preventDefault(); send(input.value); });
    render();
  }
})();
