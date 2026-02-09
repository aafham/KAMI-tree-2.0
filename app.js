/* KAMI Tree - Refactored Focus/Full View */
(() => {
  "use strict";

  const APP_VERSION = "2026-02-10.6";

  const dom = {
    app: document.getElementById("app"),
    toolbar: document.getElementById("toolbar"),
    treeArea: document.querySelector(".tree-area"),
    searchInput: document.getElementById("search-input"),
    searchResults: document.getElementById("search-results"),
    searchOverlay: document.getElementById("searchOverlay"),
    searchOverlayInput: document.getElementById("search-overlay-input"),
    searchOverlayResults: document.getElementById("search-overlay-results"),
    searchOverlayClose: document.getElementById("search-overlay-close"),
actionsSheet: document.getElementById("actionsSheet"),
actionsClose: document.getElementById("actions-close"),
actionFocus: document.getElementById("action-focus"),
actionFull: document.getElementById("action-full"),
actionCenter: document.getElementById("action-center"),
actionReset: document.getElementById("action-reset"),
actionExportPng: document.getElementById("action-export-png"),
actionExportPdf: document.getElementById("action-export-pdf"),
actionInsights: document.getElementById("action-insights"),
    viewFocusBtn: document.getElementById("view-focus"),
    viewFullBtn: document.getElementById("view-full"),
    centerBtn: document.getElementById("center-selected"),
    resetBtn: document.getElementById("reset-view"),
    exportMenuBtn: document.getElementById("export-menu"),
    exportMenuList: document.getElementById("export-menu-list"),
    exportPngBtn: document.getElementById("export-png"),
    exportPdfBtn: document.getElementById("export-pdf"),
    viewMenuBtn: document.getElementById("view-menu"),
    viewMenuList: document.getElementById("view-menu-list"),
    mobileActionsBtn: document.getElementById("mobile-actions"),
    insightsBtn: document.getElementById("toggle-insights"),
    focusView: document.getElementById("focus-view"),
    fullView: document.getElementById("full-view"),
    fullList: document.getElementById("full-tree-list"),
    fullListInner: document.getElementById("full-tree-inner"),
    fullTopSpacer: document.getElementById("full-tree-top"),
    fullBottomSpacer: document.getElementById("full-tree-bottom"),
    fullGenSelect: document.getElementById("full-gen"),
    branchOnlyBtn: document.getElementById("branch-only"),
    expandAllBtn: document.getElementById("expand-all"),
    collapseAllBtn: document.getElementById("collapse-all"),
    breadcrumbs: document.getElementById("breadcrumbs"),
    zoomInBtn: document.getElementById("zoom-in"),
    zoomOutBtn: document.getElementById("zoom-out"),
    zoomResetBtn: document.getElementById("zoom-reset"),
    insightsPanel: document.getElementById("insights"),
    statsPeople: document.getElementById("stat-people"),
    statsCouples: document.getElementById("stat-couples"),
    statsMale: document.getElementById("stat-male"),
    statsFemale: document.getElementById("stat-female"),
    statsCucu: document.getElementById("stat-cucu"),
    statsCicit: document.getElementById("stat-cicit"),
    statsUpcomingName: document.getElementById("stat-upcoming-name"),
    statsUpcomingMeta: document.getElementById("stat-upcoming-meta"),
    drawer: document.getElementById("detail-drawer"),
    drawerClose: document.getElementById("drawer-close"),
    drawerBody: document.getElementById("drawer-body"),
    drawerTitle: document.getElementById("drawer-title"),
    drawerCta: document.getElementById("drawer-cta"),
    drawerFocus: document.getElementById("drawer-focus"),
    status: document.getElementById("tree-status"),
    toast: document.getElementById("toast"),
    backdrop: document.getElementById("backdrop"),
    fatalError: document.getElementById("fatalError"),
    fatalClose: document.getElementById("fatalClose"),
    fatalReload: document.getElementById("fatalReload")
  };

  const state = {
    data: null,
    peopleById: new Map(),
    unions: [],
    parentsByChild: new Map(),
    childrenByParent: new Map(),
    spousesByPerson: new Map(),
    selectedId: "",
    viewMode: "focus",
    focusAncDepth: 1,
    focusDescDepth: 1,
    focusShowAllChildren: false,
    expandedIds: new Set(),
    genLimit: 3,
    branchOnly: false,
    listCache: [],
    listRowHeight: 56,
    listOverscan: 8,
    fullScale: 1,
    pathHighlight: new Set(),
    searchIndex: -1
  };

  const isMobile = () => window.matchMedia("(max-width: 960px)").matches;

  function log(...args) {
    console.log("[KAMI-tree]", ...args);
  }

  function setStatus(message, isError = false) {
    if (!dom.status) return;
    dom.status.textContent = message || "";
    dom.status.classList.toggle("is-error", Boolean(isError));
  }

  function showToast(message) {
    if (!dom.toast) return;
    dom.toast.textContent = message;
    dom.toast.classList.add("is-show");
    setTimeout(() => dom.toast.classList.remove("is-show"), 1600);
  }

  function showBackdrop(show) {
    if (!dom.backdrop) return;
    dom.backdrop.hidden = !show;
    dom.backdrop.classList.toggle("is-open", show);
  }

  function showFatalError(err) {
    console.error(err);
    if (dom.fatalError) {
      const msg = dom.fatalError.querySelector(".msg");
      if (msg) msg.textContent = String(err?.stack || err || "Unknown error");
      dom.fatalError.hidden = false;
      dom.fatalError.classList.add("is-open");
      dom.fatalError.setAttribute("aria-hidden", "false");
    }
  }

  function closeFatalError() {
    if (!dom.fatalError) return;
    dom.fatalError.classList.remove("is-open");
    dom.fatalError.setAttribute("aria-hidden", "true");
    dom.fatalError.hidden = true;
  }

  function getDataUrlCandidates() {
    const candidates = [];
    const push = (url) => {
      if (!url) return;
      if (!candidates.includes(url)) candidates.push(url);
    };
    push("./data.json");
    try {
      push(new URL("data.json", window.location.href).toString());
    } catch {}
    try {
      const path = window.location.pathname || "/";
      const parts = path.split("/").filter(Boolean);
      if (parts.length > 0) {
        push(`${window.location.origin}/${parts[0]}/data.json`);
      }
      const basePath = `${window.location.origin}${path.endsWith("/") ? path : `${path}/`}`;
      push(new URL("data.json", basePath).toString());
    } catch {}
    return candidates;
  }

  async function fetchDataJson(candidates) {
    let lastErr = null;
    for (const url of candidates) {
      try {
        console.info("[FETCH] trying", url);
        const cacheBuster = url.includes("?") ? `&ts=${Date.now()}` : `?ts=${Date.now()}`;
        const res = await fetch(`${url}${cacheBuster}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText} (${url})`);
        const data = await res.json();
        console.info("[FETCH] ok", url);
        return data;
      } catch (err) {
        console.warn("[FETCH] failed", url, err);
        lastErr = err;
      }
    }
    throw lastErr || new Error("Failed to load data.json");
  }

  function validateData(data) {
    if (!data || !Array.isArray(data.people) || !Array.isArray(data.unions)) {
      throw new Error("Invalid data.json schema (expected people[] and unions[])");
    }
  }

  function buildIndex(data) {
    state.peopleById = new Map();
    state.parentsByChild = new Map();
    state.childrenByParent = new Map();
    state.spousesByPerson = new Map();
    state.unions = data.unions || [];

    data.people.forEach((p) => state.peopleById.set(p.id, p));

    state.unions.forEach((u) => {
      const p1 = u.partner1;
      const p2 = u.partner2;
      if (p1 && p2) {
        if (!state.spousesByPerson.has(p1)) state.spousesByPerson.set(p1, new Set());
        if (!state.spousesByPerson.has(p2)) state.spousesByPerson.set(p2, new Set());
        state.spousesByPerson.get(p1).add(p2);
        state.spousesByPerson.get(p2).add(p1);
      }
      (u.children || []).forEach((childId) => {
        if (!state.parentsByChild.has(childId)) state.parentsByChild.set(childId, []);
        state.parentsByChild.get(childId).push({ union: u, parents: [p1, p2].filter(Boolean) });
        [p1, p2].filter(Boolean).forEach((pid) => {
          if (!state.childrenByParent.has(pid)) state.childrenByParent.set(pid, new Set());
          state.childrenByParent.get(pid).add(childId);
        });
      });
    });
  }

  function setSelected(id, options = {}) {
    if (!id || !state.peopleById.has(id)) return;
    state.selectedId = id;
    highlightPath(id);
    renderFocusView();
    renderFullTree();
    openDrawer(id);
    if (options.fromSearch) showToast("Fokus pada nama dipilih");
  }

  function formatName(person) {
    return person?.name || "(Tanpa nama)";
  }

  function formatGender(person) {
    if (person.gender === "male") return "male";
    if (person.gender === "female") return "female";
    return "unknown";
  }
  function getParents(id) {
    const refs = state.parentsByChild.get(id) || [];
    const parents = [];
    refs.forEach((ref) => {
      ref.parents.forEach((pid) => {
        if (pid && state.peopleById.has(pid)) parents.push(state.peopleById.get(pid));
      });
    });
    return parents;
  }

  function getSpouses(id) {
    const set = state.spousesByPerson.get(id) || new Set();
    return Array.from(set).map((pid) => state.peopleById.get(pid)).filter(Boolean);
  }

  function getChildren(id) {
    const set = state.childrenByParent.get(id) || new Set();
    return Array.from(set).map((pid) => state.peopleById.get(pid)).filter(Boolean);
  }

  function getAncestors(id, depth) {
    const levels = [];
    let current = [id];
    for (let d = 0; d < depth; d += 1) {
      const next = [];
      current.forEach((cid) => {
        getParents(cid).forEach((p) => {
          if (!next.includes(p.id)) next.push(p.id);
        });
      });
      if (next.length === 0) break;
      levels.push(next.map((pid) => state.peopleById.get(pid)).filter(Boolean));
      current = next;
    }
    return levels;
  }

  function getDescendants(id, depth) {
    const levels = [];
    let current = [id];
    for (let d = 0; d < depth; d += 1) {
      const next = [];
      current.forEach((cid) => {
        getChildren(cid).forEach((c) => {
          if (!next.includes(c.id)) next.push(c.id);
        });
      });
      if (next.length === 0) break;
      levels.push(next.map((pid) => state.peopleById.get(pid)).filter(Boolean));
      current = next;
    }
    return levels;
  }

  function getBreadcrumbPath(id) {
    const chain = [];
    let cursor = id;
    let guard = 0;
    while (cursor && guard < 12) {
      guard += 1;
      chain.push(cursor);
      const parents = getParents(cursor);
      if (!parents.length) break;
      cursor = parents[0].id;
    }
    return chain.reverse();
  }

  function updateBreadcrumbs() {
    if (!dom.breadcrumbs) return;
    dom.breadcrumbs.innerHTML = "";
    Array.from(state.pathHighlight).forEach((pid, idx) => {
      const chip = document.createElement("button");
      chip.className = "chip";
      chip.type = "button";
      chip.textContent = `${idx + 1}. ${formatName(state.peopleById.get(pid))}`;
      chip.addEventListener("click", () => setSelected(pid));
      dom.breadcrumbs.appendChild(chip);
    });
  }

  function highlightPath(id) {
    state.pathHighlight = new Set(getBreadcrumbPath(id));
    updateBreadcrumbs();
  }

  function renderPersonCard(person, { compact = false, highlight = false } = {}) {
    const card = document.createElement("button");
    card.className = `person-card${compact ? " compact" : ""}${highlight ? " is-selected" : ""}`;
    card.type = "button";
    card.dataset.personId = person.id;
    card.dataset.gender = formatGender(person);
    const relationChip = person.relation ? `<span class="person-chip">${person.relation}</span>` : "";
    const initial = formatName(person).slice(0, 1).toUpperCase();
    card.innerHTML = `
      ${relationChip}
      <span class="person-name">${formatName(person)}</span>
      <span class="person-meta">${initial} · ${person.gender === "female" ? "?" : person.gender === "male" ? "?" : "•"} ${person.birth ? String(person.birth).slice(0,4) : ""}${person.death ? `–${String(person.death).slice(0,4)}` : ""}</span>
    `;
    card.setAttribute("aria-label", `${formatName(person)}${person.relation ? `, ${person.relation}` : ""}`);
    card.addEventListener("click", () => setSelected(person.id));
    return card;
  }

  function renderFocusView() {
    if (!dom.focusView) return;
    dom.focusView.innerHTML = "";

    if (!state.selectedId) {
      dom.focusView.innerHTML = `
        <div class="empty-state">
          <h3>Mulakan dengan carian</h3>
          <p>Cari nama ahli keluarga untuk fokus dan lihat ibu bapa, pasangan, dan anak.</p>
          <div class="empty-actions">
            <button class="btn small" id="empty-self">Pilih Self</button>
            <button class="btn ghost small" id="empty-full">Lihat Full Tree</button>
          </div>
        </div>
      `;
      const selfBtn = document.getElementById("empty-self");
      const fullBtn = document.getElementById("empty-full");
      if (selfBtn && state.data?.selfId) selfBtn.addEventListener("click", () => setSelected(state.data.selfId));
      if (fullBtn) fullBtn.addEventListener("click", () => updateViewMode("full"));
      return;
    }

    const centerPerson = state.peopleById.get(state.selectedId);
    const parents = getParents(centerPerson.id);
    const spouses = getSpouses(centerPerson.id);
    const children = getChildren(centerPerson.id);

    const ancestorsLevels = getAncestors(centerPerson.id, state.focusAncDepth);
    const descLevels = getDescendants(centerPerson.id, state.focusDescDepth);

    if (isMobile()) {
      const accordion = document.createElement("div");
      accordion.className = "focus-accordion";
      accordion.appendChild(renderPersonCard(centerPerson, { highlight: true }));

      const makeSection = (title, list, onExpand, compact) => {
        const details = document.createElement("details");
        details.open = true;
        const summary = document.createElement("summary");
        summary.textContent = title;
        details.appendChild(summary);
        const row = document.createElement("div");
        row.className = "focus-row";
        list.forEach((p) => row.appendChild(renderPersonCard(p, { compact })));
        details.appendChild(row);
        if (onExpand) {
          const btn = document.createElement("button");
          btn.className = "btn ghost small";
          btn.type = "button";
          btn.textContent = "Expand";
          btn.addEventListener("click", onExpand);
          details.appendChild(btn);
        }
        return details;
      };

      accordion.appendChild(makeSection(`Parents (${parents.length})`, parents, () => {
        state.focusAncDepth = Math.min(state.focusAncDepth + 1, 4);
        renderFocusView();
        showToast("Tambah generasi ibu bapa");
      }, false));

      accordion.appendChild(makeSection(`Spouses (${spouses.length})`, spouses, null, false));

      const childList = state.focusShowAllChildren ? children : children.slice(0, 4);
      accordion.appendChild(makeSection(`Children (${children.length})`, childList, () => {
        state.focusDescDepth = Math.min(state.focusDescDepth + 1, 4);
        renderFocusView();
        showToast("Tambah generasi anak");
      }, false));

      dom.focusView.appendChild(accordion);
      return;
    }
    const focusShell = document.createElement("div");
    focusShell.className = "focus-shell";

    const ancestors = document.createElement("div");
    ancestors.className = "focus-block";
    ancestors.innerHTML = `<div class="focus-block-head"><span>Parents (${parents.length})</span><button class="btn ghost small" type="button">Expand Ancestors</button></div>`;
    const ancBtn = ancestors.querySelector("button");
    ancBtn.addEventListener("click", () => {
      state.focusAncDepth = Math.min(state.focusAncDepth + 1, 4);
      renderFocusView();
      showToast("Tambah generasi ibu bapa");
    });

    const parentsRow = document.createElement("div");
    parentsRow.className = "focus-row";
    parents.forEach((p) => parentsRow.appendChild(renderPersonCard(p)));
    ancestors.appendChild(parentsRow);

    ancestorsLevels.forEach((level) => {
      const row = document.createElement("div");
      row.className = "focus-row depth";
      level.forEach((p) => row.appendChild(renderPersonCard(p, { compact: true })));
      ancestors.appendChild(row);
    });

    const center = document.createElement("div");
    center.className = "focus-center";
    center.appendChild(renderPersonCard(centerPerson, { highlight: true }));

    const spouseBlock = document.createElement("div");
    spouseBlock.className = "focus-block";
    spouseBlock.innerHTML = `<div class="focus-block-head"><span>Spouses (${spouses.length})</span></div>`;
    const spousesRow = document.createElement("div");
    spousesRow.className = "focus-row";
    spouses.forEach((s) => spousesRow.appendChild(renderPersonCard(s)));
    spouseBlock.appendChild(spousesRow);

    const childrenBlock = document.createElement("div");
    childrenBlock.className = "focus-block";
    const childCount = children.length;
    const childHead = document.createElement("div");
    childHead.className = "focus-block-head";
    childHead.innerHTML = `<span>Children (${childCount})</span>`;
    if (childCount > 4 && !state.focusShowAllChildren) {
      const moreBtn = document.createElement("button");
      moreBtn.className = "btn ghost small";
      moreBtn.type = "button";
      moreBtn.textContent = `+${childCount - 4} lagi`;
      moreBtn.addEventListener("click", () => {
        state.focusShowAllChildren = true;
        renderFocusView();
      });
      childHead.appendChild(moreBtn);
    }
    const childExpand = document.createElement("button");
    childExpand.className = "btn ghost small";
    childExpand.type = "button";
    childExpand.textContent = "Expand Descendants";
    childExpand.addEventListener("click", () => {
        state.focusDescDepth = Math.min(state.focusDescDepth + 1, 4);
        renderFocusView();
        showToast("Tambah generasi anak");
      });
    childHead.appendChild(childExpand);
    childrenBlock.appendChild(childHead);

    const childrenRow = document.createElement("div");
    childrenRow.className = "focus-row";
    (state.focusShowAllChildren ? children : children.slice(0, 4)).forEach((c) => childrenRow.appendChild(renderPersonCard(c)));
    childrenBlock.appendChild(childrenRow);

    descLevels.forEach((level) => {
      const row = document.createElement("div");
      row.className = "focus-row depth";
      level.forEach((p) => row.appendChild(renderPersonCard(p, { compact: true })));
      childrenBlock.appendChild(row);
    });

    focusShell.appendChild(ancestors);
    focusShell.appendChild(center);
    focusShell.appendChild(spouseBlock);
    focusShell.appendChild(childrenBlock);

    dom.focusView.appendChild(focusShell);
  }

  function buildFullList() {
    const rootId = state.branchOnly && state.selectedId ? state.selectedId : (state.data.selfId || state.data.people?.[0]?.id);
    if (!rootId) return [];
    const list = [];
    const visit = (id, depth) => {
      if (!state.peopleById.has(id)) return;
      if (state.genLimit && depth > state.genLimit) return;
      list.push({ id, depth });
      if (!state.expandedIds.has(id)) return;
      const children = getChildren(id);
      children.forEach((child) => visit(child.id, depth + 1));
    };
    visit(rootId, 1);
    return list;
  }

  function renderFullTree() {
    if (!dom.fullView || !dom.fullList || !dom.fullListInner) return;
    if (state.viewMode !== "full") {
      dom.fullView.hidden = true;
      return;
    }
    dom.fullView.hidden = false;

    state.listCache = buildFullList();
    const total = state.listCache.length;
    const containerHeight = dom.fullList.clientHeight || 400;
    const startIndex = Math.max(0, Math.floor(dom.fullList.scrollTop / state.listRowHeight) - state.listOverscan);
    const endIndex = Math.min(total, Math.ceil((dom.fullList.scrollTop + containerHeight) / state.listRowHeight) + state.listOverscan);

    const slice = state.listCache.slice(startIndex, endIndex);
    dom.fullTopSpacer.style.height = `${startIndex * state.listRowHeight}px`;
    dom.fullBottomSpacer.style.height = `${(total - endIndex) * state.listRowHeight}px`;
    dom.fullListInner.innerHTML = "";

    slice.forEach((item) => {
      const person = state.peopleById.get(item.id);
      if (!person) return;
      const row = document.createElement("div");
      row.className = "full-row";
      row.style.paddingLeft = `${(item.depth - 1) * 24}px`;
      row.dataset.personId = item.id;
      if (state.pathHighlight.has(item.id)) row.classList.add("is-path");
      if (!state.pathHighlight.has(item.id) && state.pathHighlight.size) row.classList.add("is-dimmed");

      const toggle = document.createElement("button");
      toggle.className = "full-toggle";
      toggle.type = "button";
      const children = getChildren(item.id);
      if (children.length === 0) {
        toggle.textContent = "•";
        toggle.disabled = true;
      } else {
        toggle.textContent = state.expandedIds.has(item.id) ? "-" : "+";
      }
      toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        if (children.length === 0) return;
        if (state.expandedIds.has(item.id)) {
          state.expandedIds.delete(item.id);
        } else {
          state.expandedIds.add(item.id);
        }
        renderFullTree();
      });

      row.appendChild(toggle);
      row.appendChild(renderPersonCard(person, { compact: true, highlight: state.selectedId === item.id }));
      row.addEventListener("click", () => setSelected(item.id));
      dom.fullListInner.appendChild(row);
    });
  }

  function updateViewMode(next) {
    state.viewMode = next === "full" ? "full" : "focus";
    if (dom.viewFocusBtn) dom.viewFocusBtn.classList.toggle("is-active", state.viewMode === "focus");
    if (dom.viewFullBtn) dom.viewFullBtn.classList.toggle("is-active", state.viewMode === "full");
    if (dom.focusView) dom.focusView.hidden = state.viewMode !== "focus";
    if (dom.fullView) dom.fullView.hidden = state.viewMode !== "full";
    renderFocusView();
    renderFullTree();
  }

  function updateStats() {
    const people = state.data?.people || [];
    const unions = state.data?.unions || [];
    if (dom.statsPeople) dom.statsPeople.textContent = String(people.length || 0);
    if (dom.statsCouples) dom.statsCouples.textContent = String(unions.length || 0);
    let male = 0;
    let female = 0;
    people.forEach((p) => {
      if (p.gender === "male") male += 1;
      if (p.gender === "female") female += 1;
    });
    if (dom.statsMale) dom.statsMale.textContent = String(male);
    if (dom.statsFemale) dom.statsFemale.textContent = String(female);
    if (dom.statsCucu) dom.statsCucu.textContent = "-";
    if (dom.statsCicit) dom.statsCicit.textContent = "-";
    if (dom.statsUpcomingName) dom.statsUpcomingName.textContent = "-";
    if (dom.statsUpcomingMeta) dom.statsUpcomingMeta.textContent = "-";
  }

  function openDrawer(id) {
    if (!dom.drawer || !dom.drawerBody) return;
    const person = state.peopleById.get(id);
    if (!person) return;
    dom.drawerTitle.textContent = formatName(person);
    dom.drawerBody.innerHTML = `
      <div class="drawer-meta">
        <span>${person.gender === "female" ? "?" : person.gender === "male" ? "?" : "•"}</span>
        <span>${person.birth ? String(person.birth).slice(0, 10) : "-"} ${person.death ? `– ${String(person.death).slice(0, 10)}` : ""}</span>
      </div>
      <div class="drawer-section">
        <strong>Parents</strong>
        <div class="drawer-row">${getParents(id).map((p) => `<button class=\"chip\" data-id=\"${p.id}\">${formatName(p)}</button>`).join(" ") || "-"}</div>
      </div>
      <div class="drawer-section">
        <strong>Spouses</strong>
        <div class="drawer-row">${getSpouses(id).map((p) => `<button class=\"chip\" data-id=\"${p.id}\">${formatName(p)}</button>`).join(" ") || "-"}</div>
      </div>
      <div class="drawer-section">
        <strong>Children</strong>
        <div class="drawer-row">${getChildren(id).map((p) => `<button class=\"chip\" data-id=\"${p.id}\">${formatName(p)}</button>`).join(" ") || "-"}</div>
      </div>
    `;
    dom.drawer.classList.add("is-open");
    dom.drawer.setAttribute("aria-hidden", "false");
    showBackdrop(true);
    dom.drawerBody.querySelectorAll("button.chip").forEach((chip) => {
      chip.addEventListener("click", () => setSelected(chip.dataset.id));
    });
    if (dom.drawerCta) {
      dom.drawerCta.onclick = () => {
        updateViewMode("full");
        state.branchOnly = true;
        if (dom.branchOnlyBtn) dom.branchOnlyBtn.classList.add("is-active");
        renderFullTree();
      };
    }
    if (dom.drawerFocus) {
      dom.drawerFocus.onclick = () => {
        updateViewMode("focus");
        renderFocusView();
      };
    }
  }

  function closeDrawer() {
    if (!dom.drawer) return;
    dom.drawer.classList.remove("is-open");
    dom.drawer.setAttribute("aria-hidden", "true");
    showBackdrop(false);
  }

  function renderSearchResults(matches, query, target) {
    const resultsEl = target || dom.searchResults;
    if (!resultsEl) return;
    resultsEl.innerHTML = "";
state.searchIndex = -1;
    if (!query) {
      resultsEl.classList.remove("is-open");
      return;
    }
    matches.slice(0, 8).forEach((p, idx) => {
      const item = document.createElement("div");
      item.className = "search-item";
item.dataset.index = String(idx);
      const name = formatName(p);
      const idxMatch = name.toLowerCase().indexOf(query.toLowerCase());
      const initial = name.slice(0, 1).toUpperCase();
      const relation = p.relation || "";
      if (idxMatch >= 0) {
        const before = name.slice(0, idxMatch);
        const mid = name.slice(idxMatch, idxMatch + query.length);
        const after = name.slice(idxMatch + query.length);
        item.innerHTML = `
          <span class=\"search-avatar\">${initial}</span>
          <div>
            <div class=\"search-name\">${before}<mark>${mid}</mark>${after}</div>
            <div class=\"search-meta\">${relation}</div>
          </div>
          <span class=\"search-badge\">${p.birth ? String(p.birth).slice(0,4) : "-"}</span>
        `;
      } else {
        item.innerHTML = `
          <span class=\"search-avatar\">${initial}</span>
          <div>
            <div class=\"search-name\">${name}</div>
            <div class=\"search-meta\">${relation}</div>
          </div>
          <span class=\"search-badge\">${p.birth ? String(p.birth).slice(0,4) : "-"}</span>
        `;
      }
      item.addEventListener("click", () => {
        setSelected(p.id, { fromSearch: true });
        resultsEl.classList.remove("is-open");
        closeSearchOverlay();
closeActionsSheet();
      });
      resultsEl.appendChild(item);
    });
    resultsEl.dataset.count = String(Math.min(matches.length, 8));
resultsEl.classList.add("is-open");
  }

  function setActiveResult(resultsEl, index) {
    const items = Array.from(resultsEl.querySelectorAll(".search-item"));
    items.forEach((el) => el.classList.remove("active"));
    if (index < 0 || index >= items.length) return;
    items[index].classList.add("active");
    items[index].scrollIntoView({ block: "nearest" });
  }

  function handleSearchKeydown(event, inputEl, resultsEl) {
    if (!resultsEl) return;
    const count = Number(resultsEl.dataset.count || 0);
    if (count === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      state.searchIndex = Math.min(count - 1, state.searchIndex + 1);
      setActiveResult(resultsEl, state.searchIndex);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      state.searchIndex = Math.max(0, state.searchIndex - 1);
      setActiveResult(resultsEl, state.searchIndex);
    } else if (event.key === "Enter") {
      const items = resultsEl.querySelectorAll(".search-item");
      const target = items[state.searchIndex] || items[0];
      if (target) target.click();
    } else if (event.key === "Escape") {
      resultsEl.classList.remove("is-open");
      if (inputEl) inputEl.blur();
    }
  }
  function openActionsSheet() {
    if (!dom.actionsSheet) return;
    dom.actionsSheet.hidden = false;
    dom.actionsSheet.classList.add("is-open");
    showBackdrop(true);
  }

  function closeActionsSheet() {
    if (!dom.actionsSheet) return;
    dom.actionsSheet.classList.remove("is-open");
    dom.actionsSheet.hidden = true;
    showBackdrop(false);
  }
  function openSearchOverlay() {
    if (!dom.searchOverlay) return;
    dom.searchOverlay.hidden = false;
    dom.searchOverlay.classList.add("is-open");
    dom.searchOverlayInput?.focus();
  }

  function closeSearchOverlay() {
    if (!dom.searchOverlay) return;
    dom.searchOverlay.classList.remove("is-open");
    dom.searchOverlay.hidden = true;
  }

  function toggleMenu(btn, menu) {
    if (!btn || !menu) return;
    const open = !menu.hidden;
    menu.hidden = open;
    btn.setAttribute("aria-expanded", String(!open));
  }

  async function exportToPng() {
    if (!dom.treeArea || !window.html2canvas) return;
    const target = dom.fullView && !dom.fullView.hidden ? dom.fullView : dom.treeArea;
    const canvas = await window.html2canvas(target, { backgroundColor: "#f6f5f0", scale: 2 });
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "family-tree.png";
    link.click();
  }

  async function exportToPdf() {
    if (!dom.treeArea || !window.html2canvas || !window.jspdf) return;
    const target = dom.fullView && !dom.fullView.hidden ? dom.fullView : dom.treeArea;
    const canvas = await window.html2canvas(target, { backgroundColor: "#f6f5f0", scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new window.jspdf.jsPDF({ orientation: "landscape", unit: "px", format: [canvas.width, canvas.height] });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("family-tree.pdf");
  }
  function wireEvents() {
    if (dom.viewFocusBtn) dom.viewFocusBtn.addEventListener("click", () => updateViewMode("focus"));
    if (dom.viewFullBtn) dom.viewFullBtn.addEventListener("click", () => updateViewMode("full"));
    if (dom.centerBtn) dom.centerBtn.addEventListener("click", () => {
      if (state.selectedId) renderFocusView();
    });
    if (dom.resetBtn) dom.resetBtn.addEventListener("click", () => {
      state.focusAncDepth = 1;
      state.focusDescDepth = 1;
      state.focusShowAllChildren = false;
      state.expandedIds.clear();
      state.branchOnly = false;
      if (dom.branchOnlyBtn) dom.branchOnlyBtn.classList.remove("is-active");
      updateViewMode("focus");
    });
    if (dom.insightsBtn) dom.insightsBtn.addEventListener("click", () => {
      if (!dom.insightsPanel) return;
      dom.insightsPanel.classList.toggle("is-open");
      showBackdrop(dom.insightsPanel.classList.contains("is-open"));
    });
    if (dom.exportMenuBtn) dom.exportMenuBtn.addEventListener("click", () => toggleMenu(dom.exportMenuBtn, dom.exportMenuList));
    if (dom.viewMenuBtn) dom.viewMenuBtn.addEventListener("click", () => toggleMenu(dom.viewMenuBtn, dom.viewMenuList));

    if (dom.exportPngBtn) dom.exportPngBtn.addEventListener("click", exportToPng);
    if (dom.exportPdfBtn) dom.exportPdfBtn.addEventListener("click", exportToPdf);

    if (dom.mobileActionsBtn) dom.mobileActionsBtn.addEventListener("click", () => {
openActionsSheet();
});

if (dom.actionsClose) dom.actionsClose.addEventListener("click", closeActionsSheet);
if (dom.actionFocus) dom.actionFocus.addEventListener("click", () => { updateViewMode("focus"); closeActionsSheet(); });
if (dom.actionFull) dom.actionFull.addEventListener("click", () => { updateViewMode("full"); closeActionsSheet(); });
if (dom.actionCenter) dom.actionCenter.addEventListener("click", () => { if (state.selectedId) renderFocusView(); closeActionsSheet(); });
if (dom.actionReset) dom.actionReset.addEventListener("click", () => { state.focusAncDepth = 1; state.focusDescDepth = 1; state.focusShowAllChildren = false; state.expandedIds.clear(); updateViewMode("focus"); closeActionsSheet(); });
if (dom.actionExportPng) dom.actionExportPng.addEventListener("click", () => { exportToPng(); closeActionsSheet(); });
if (dom.actionExportPdf) dom.actionExportPdf.addEventListener("click", () => { exportToPdf(); closeActionsSheet(); });
if (dom.actionInsights) dom.actionInsights.addEventListener("click", () => { if (dom.insightsPanel) dom.insightsPanel.classList.toggle("is-open"); closeActionsSheet(); });

if (dom.branchOnlyBtn) dom.branchOnlyBtn.addEventListener("click", () => {
      state.branchOnly = !state.branchOnly;
      dom.branchOnlyBtn.classList.toggle("is-active", state.branchOnly);
      renderFullTree();
    });

    if (dom.expandAllBtn) dom.expandAllBtn.addEventListener("click", () => {
      state.data.people.forEach((p) => state.expandedIds.add(p.id));
      renderFullTree();
    });

    if (dom.collapseAllBtn) dom.collapseAllBtn.addEventListener("click", () => {
      state.expandedIds.clear();
      renderFullTree();
    });

    if (dom.fullGenSelect) {
      dom.fullGenSelect.addEventListener("change", (e) => {
        state.genLimit = Number(e.target.value) || 3;
        renderFullTree();
      });
    }

    if (dom.zoomInBtn) dom.zoomInBtn.addEventListener("click", () => {
      state.fullScale = Math.min(1.4, state.fullScale + 0.1);
      dom.fullListInner.style.transform = `scale(${state.fullScale})`;
    });
    if (dom.zoomOutBtn) dom.zoomOutBtn.addEventListener("click", () => {
      state.fullScale = Math.max(0.8, state.fullScale - 0.1);
      dom.fullListInner.style.transform = `scale(${state.fullScale})`;
    });
    if (dom.zoomResetBtn) dom.zoomResetBtn.addEventListener("click", () => {
      state.fullScale = 1;
      dom.fullListInner.style.transform = "scale(1)";
    });

    if (dom.fullList) {
      dom.fullList.addEventListener("scroll", () => {
        renderFullTree();
      });
    }

    if (dom.searchInput) {
dom.searchInput.addEventListener("input", (e) => {
const q = e.target.value.trim();
if (!q) return renderSearchResults([], "", dom.searchResults);
const matches = state.data.people.filter((p) => formatName(p).toLowerCase().includes(q.toLowerCase()));
renderSearchResults(matches, q, dom.searchResults);
});
dom.searchInput.addEventListener("keydown", (e) => handleSearchKeydown(e, dom.searchInput, dom.searchResults));
}

if (dom.searchOverlayInput) {
dom.searchOverlayInput.addEventListener("input", (e) => {
const q = e.target.value.trim();
if (!q) return renderSearchResults([], "", dom.searchOverlayResults);
const matches = state.data.people.filter((p) => formatName(p).toLowerCase().includes(q.toLowerCase()));
renderSearchResults(matches, q, dom.searchOverlayResults);
});
dom.searchOverlayInput.addEventListener("keydown", (e) => handleSearchKeydown(e, dom.searchOverlayInput, dom.searchOverlayResults));
}

if (dom.searchOverlayClose) dom.searchOverlayClose.addEventListener("click", closeSearchOverlay);

    if (dom.drawerClose) dom.drawerClose.addEventListener("click", closeDrawer);

    if (dom.backdrop) dom.backdrop.addEventListener("click", () => {
      closeDrawer();
closeActionsSheet();
      if (dom.insightsPanel) dom.insightsPanel.classList.remove("is-open");
      showBackdrop(false);
    });

    if (dom.fatalReload) dom.fatalReload.addEventListener("click", () => window.location.reload());
    if (dom.fatalClose) dom.fatalClose.addEventListener("click", closeFatalError);
    if (dom.fatalError) {
      dom.fatalError.addEventListener("click", (e) => {
        if (e.target === dom.fatalError) closeFatalError();
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "/") {
        e.preventDefault();
        if (isMobile()) openSearchOverlay();
        else dom.searchInput?.focus();
      }
      if (e.key === "Escape") {
        closeDrawer();
closeActionsSheet();
        closeFatalError();
        closeSearchOverlay();
closeActionsSheet();
        if (dom.exportMenuList) dom.exportMenuList.hidden = true;
        if (dom.viewMenuList) dom.viewMenuList.hidden = true;
      }
    });

    document.addEventListener("click", (e) => {
      if (dom.exportMenuList && !dom.exportMenuList.contains(e.target) && e.target !== dom.exportMenuBtn) {
        dom.exportMenuList.hidden = true;
      }
      if (dom.viewMenuList && !dom.viewMenuList.contains(e.target) && e.target !== dom.viewMenuBtn) {
        dom.viewMenuList.hidden = true;
      }
    });
  }

  async function initApp() {
    try {
      console.info("[INIT]", APP_VERSION);
      const data = await fetchDataJson(getDataUrlCandidates());
      validateData(data);
      state.data = data;
      buildIndex(data);
      updateStats();
      state.selectedId = data.selfId || data.people?.[0]?.id || "";
      highlightPath(state.selectedId);
      updateViewMode("focus");
      renderFocusView();
      renderFullTree();
      setStatus("");
      wireEvents();
      log("ready", data.people.length);
    } catch (err) {
      setStatus(String(err), true);
      showFatalError(err);
    }
  }

  document.addEventListener("DOMContentLoaded", initApp);
})();






















