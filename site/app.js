// Renders the roadmap grid, the detail panel and the shipped list from projects.js.
(function () {
  const { stages, tracks, projects } = window.ROADMAP;
  const shipped = projects.filter((p) => p.shipped);

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const status = (p) => (p.shipped ? "Shipped" : "Planned");

  // Detail panel
  const panel = document.getElementById("detail");
  function showDetail(p) {
    panel.replaceChildren();
    panel.dataset.track = p.track;
    const stage = stages.find((s) => s.id === p.stage);
    const head = el("p", "detail-meta",
      `Project ${p.n}, ${tracks[p.track].toLowerCase()}, ${stage.name.toLowerCase()} stage${p.flagship ? ", flagship" : ""}`);
    const title = el("h3", "detail-title", p.title);
    const body = el("p", "detail-body",
      p.shipped ? p.summary : "Not built yet. This cell fills in when it ships.");
    panel.append(head, title, body);
    if (p.shipped && p.repo) {
      const link = el("a", "detail-link", "Read the code on GitHub");
      link.href = p.repo;
      panel.append(link);
    }
  }

  // Grid
  const grid = document.getElementById("grid");
  stages.forEach((stage, stageIndex) => {
    const row = el("div", "stage");
    row.style.setProperty("--stage", stageIndex);
    const label = el("p", "stage-label");
    label.append(el("span", "stage-name", stage.name), el("span", "stage-weeks", ` ${stage.weeks}`));
    const cells = el("ol", "cells");
    projects.filter((p) => p.stage === stage.id).forEach((p, i) => {
      const li = el("li");
      const btn = el("button", "cell");
      btn.type = "button";
      btn.dataset.track = p.track;
      btn.style.setProperty("--i", i);
      if (p.shipped) btn.classList.add("is-shipped");
      if (p.flagship) btn.classList.add("is-flagship");
      btn.setAttribute("aria-label", `${p.n}. ${p.title}. ${tracks[p.track]}. ${status(p)}.`);
      btn.append(el("span", "cell-num", String(p.n)));
      const select = () => {
        grid.querySelectorAll(".cell.is-active").forEach((c) => c.classList.remove("is-active"));
        btn.classList.add("is-active");
        showDetail(p);
      };
      btn.addEventListener("mouseenter", select);
      btn.addEventListener("focus", select);
      btn.addEventListener("click", select);
      li.append(btn);
      cells.append(li);
    });
    row.append(label, cells);
    grid.append(row);
  });

  // Progress line
  document.getElementById("progress").textContent =
    `${shipped.length} of ${projects.length} shipped`;

  // Shipped list
  const list = document.getElementById("shipped-list");
  shipped.slice().reverse().forEach((p) => {
    const item = el("li", "shipped-item");
    item.dataset.track = p.track;
    item.append(el("span", "shipped-num", String(p.n)));
    const text = el("div");
    const h = el("h3", "shipped-title");
    const a = el("a", null, p.title);
    a.href = p.repo;
    h.append(a);
    text.append(h, el("p", "shipped-summary", p.summary), el("p", "shipped-track", tracks[p.track]));
    item.append(text);
    list.append(item);
  });

  // Start with the latest shipped project selected
  const latest = shipped[shipped.length - 1] || projects[0];
  showDetail(latest);
  const latestCell = grid.querySelectorAll(".cell")[projects.indexOf(latest)];
  if (latestCell) latestCell.classList.add("is-active");

  document.documentElement.classList.add("is-ready");
})();
