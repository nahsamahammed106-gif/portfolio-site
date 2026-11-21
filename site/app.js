// Renders the roadmap grid, the detail panel and the shipped list from projects.js.
(function () {
  const { stages, tracks, projects, disciplines, domains } = window.ROADMAP;
  const shipped = projects.filter((p) => p.shipped);
  const stageById = Object.fromEntries(stages.map((s) => [s.id, s]));
  const kindLabel = { ai: "applied AI", ml: "ML", both: "applied AI and ML" };

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const metaLine = (p) =>
    `Project ${p.n}, ${kindLabel[p.kind]}, ${tracks[p.track].toLowerCase()}, ${stageById[p.stage].name.toLowerCase()} stage${p.flagship ? ", flagship" : ""}`;

  // Everything a screen reader needs is in the button's own label,
  // so the detail panel doesn't have to announce itself on every hover.
  const cellLabel = (p) =>
    [`${p.n}. ${p.title}.`, `${tracks[p.track]}, ${kindLabel[p.kind]}.`, p.flagship ? "Flagship." : "",
     p.shipped ? `Shipped. ${p.summary}` : "Planned."].filter(Boolean).join(" ");

  // Detail panel
  const panel = document.getElementById("detail");
  function showDetail(p) {
    panel.replaceChildren();
    panel.dataset.track = p.track;
    panel.append(
      el("p", "detail-meta", metaLine(p)),
      el("h3", "detail-title", p.title),
      el("p", "detail-body", p.shipped ? p.summary : "Not built yet. This square fills in when it ships."),
    );
    if (p.shipped && p.repo) {
      const link = el("a", "detail-link", "Read the code on GitHub");
      link.href = p.repo;
      panel.append(link);
    }
  }

  // Grid: one tab stop for the whole grid ("roving tabindex"); arrow keys move inside it.
  const grid = document.getElementById("grid");
  const rows = []; // rows[stageIndex] = [button, ...]
  let active = null;

  function select(btn, { focus = false, reveal = false } = {}) {
    if (active) {
      active.classList.remove("is-active");
      active.tabIndex = -1;
    }
    active = btn;
    btn.classList.add("is-active");
    btn.tabIndex = 0;
    if (focus) btn.focus();
    showDetail(projects[Number(btn.dataset.index)]);
    if (reveal) revealPanel();
  }

  // On narrow screens the panel sits under the grid; bring it into view after a tap.
  function revealPanel() {
    const box = panel.getBoundingClientRect();
    if (box.bottom > window.innerHeight || box.top < 0) {
      const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      panel.scrollIntoView({ block: "nearest", behavior: smooth ? "smooth" : "auto" });
    }
  }

  function move(btn, key) {
    const r = Number(btn.dataset.row);
    const c = Number(btn.dataset.col);
    const flat = rows.flat();
    const i = flat.indexOf(btn);
    switch (key) {
      case "ArrowRight": return flat[Math.min(i + 1, flat.length - 1)];
      case "ArrowLeft": return flat[Math.max(i - 1, 0)];
      case "ArrowDown": return r < rows.length - 1 ? rows[r + 1][Math.min(c, rows[r + 1].length - 1)] : btn;
      case "ArrowUp": return r > 0 ? rows[r - 1][Math.min(c, rows[r - 1].length - 1)] : btn;
      case "Home": return flat[0];
      case "End": return flat[flat.length - 1];
      default: return null;
    }
  }

  stages.forEach((stage, stageIndex) => {
    const row = el("div", "stage");
    row.style.setProperty("--stage", stageIndex);
    const label = el("p", "stage-label");
    label.append(el("span", "stage-name", stage.name), el("span", "stage-weeks", ` ${stage.weeks}`));
    const cells = el("ol", "cells");
    rows[stageIndex] = [];

    projects.forEach((p, index) => {
      if (p.stage !== stage.id) return;
      const col = rows[stageIndex].length;
      const btn = el("button", "cell");
      btn.type = "button";
      btn.tabIndex = -1;
      btn.dataset.track = p.track;
      btn.dataset.index = index;
      btn.dataset.row = stageIndex;
      btn.dataset.col = col;
      btn.style.setProperty("--i", col);
      if (p.shipped) btn.classList.add("is-shipped");
      if (p.flagship) btn.classList.add("is-flagship");
      btn.setAttribute("aria-label", cellLabel(p));
      btn.append(el("span", "cell-num", String(p.n)));

      btn.addEventListener("mouseenter", () => select(btn));
      btn.addEventListener("focus", () => { if (active !== btn) select(btn); });
      btn.addEventListener("click", () => select(btn, { reveal: true }));
      btn.addEventListener("keydown", (event) => {
        const next = move(btn, event.key);
        if (!next) return;
        event.preventDefault();
        select(next, { focus: true });
      });

      rows[stageIndex].push(btn);
      const li = el("li");
      li.append(btn);
      cells.append(li);
    });

    row.append(label, cells);
    grid.append(row);
  });

  // What I work on: each discipline or domain filters the grid.
  // Hover previews a filter; click pins it (click again, or "Show all", to clear).
  const progress = document.getElementById("progress");
  const clearButton = document.getElementById("filter-clear");
  const focusItems = [];
  let pinned = null; // { type: "kind" | "track", value, name }

  const matches = (p, f) =>
    f.type === "track" ? p.track === f.value
      : f.value === "ai" ? p.kind !== "ml" : p.kind !== "ai";

  function setProgress(text) {
    if (progress.textContent !== text) progress.textContent = text;
  }

  function applyFilter(f) {
    grid.classList.toggle("is-filtered", Boolean(f));
    rows.flat().forEach((btn) => {
      btn.classList.toggle("is-match", Boolean(f) && matches(projects[Number(btn.dataset.index)], f));
    });
  }

  function pin(f) {
    pinned = f;
    applyFilter(f);
    focusItems.forEach((b) => b.setAttribute("aria-pressed", String(Boolean(f) && b.dataset.value === f.value)));
    clearButton.hidden = !f;
    if (!f) {
      setProgress(`${shipped.length} of ${projects.length} shipped`);
      return;
    }
    const subset = projects.filter((p) => matches(p, f));
    const done = subset.filter((p) => p.shipped).length;
    setProgress(`Showing ${subset.length} ${f.name} projects, ${done} shipped`);
  }

  // On a phone the grid is far below this section: after pinning a filter, bring the
  // roadmap into view if none of it is on screen.
  function revealGrid() {
    const box = grid.getBoundingClientRect();
    if (box.top < window.innerHeight && box.bottom > 0) return;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("roadmap-heading").scrollIntoView({ block: "start", behavior: smooth ? "smooth" : "auto" });
  }

  function buildFocusList(listId, entries, type) {
    const list = document.getElementById(listId);
    entries.forEach((entry) => {
      const f = { type, value: entry.id, name: entry.label };
      const count = projects.filter((p) => matches(p, f)).length;
      const btn = el("button", "focus-item");
      btn.type = "button";
      btn.dataset.value = entry.id;
      btn.setAttribute("aria-pressed", "false");
      const countEl = el("span", "focus-count", String(count));
      countEl.append(el("span", "focus-unit", count === 1 ? "project" : "projects"));
      btn.append(el("span", "focus-name", entry.name), countEl, el("span", "focus-text", entry.text));
      btn.addEventListener("click", () => {
        pin(pinned && pinned.value === entry.id ? null : f);
        if (pinned) revealGrid();
      });
      btn.addEventListener("mouseenter", () => applyFilter(f));
      btn.addEventListener("mouseleave", () => applyFilter(pinned));
      focusItems.push(btn);
      const li = el("li");
      li.append(btn);
      list.append(li);
    });
  }

  buildFocusList("focus-disciplines", disciplines, "kind");
  buildFocusList("focus-domains", domains, "track");
  clearButton.addEventListener("click", () => pin(null));
  pin(null);

  // Shipped list, newest first
  const list = document.getElementById("shipped-list");
  shipped.slice().reverse().forEach((p) => {
    const item = el("li", "shipped-item");
    item.dataset.track = p.track;
    item.append(el("span", "shipped-num", String(p.n)));
    const text = el("div");
    const heading = el("h3", "shipped-title");
    const link = el("a", null, p.title);
    link.href = p.repo;
    heading.append(link);
    text.append(heading, el("p", "shipped-summary", p.summary), el("p", "shipped-track", tracks[p.track]));
    item.append(text);
    list.append(item);
  });

  // Start with the latest shipped project selected (it also holds the grid's tab stop)
  const latest = shipped[shipped.length - 1] || projects[0];
  select(rows.flat().find((b) => Number(b.dataset.index) === projects.indexOf(latest)));

  document.documentElement.classList.add("is-ready");
})();
