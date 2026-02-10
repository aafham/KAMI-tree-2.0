
/* KAMI Tree - Focus + Full View */
(() => {
  "use strict";

  const APP_VERSION = "2026-02-10.9";
  const MAX_SEARCH_RESULTS = 8;
  const BASE_ROW_HEIGHT = 56;
  // Expand All is capped to keep performance stable on large datasets.
  const MAX_EXPAND_NODES = 500;

  // [constants/dom]
  const dom = {
    app: document.getElementById("app"),
    toolbar: document.getElementById("toolbar"),
    treeArea: document.querySelector(".tree-area"),
    focusView: document.getElementById("focus-view"),
    fullView: document.getElementById("full-view"),
    fullList: document.getElementById("full-tree-list"),
    fullListInner: document.getElementById("full-tree-inner"),
    fullTopSpacer: document.getElementById("full-tree-top"),
    fullBottomSpacer: document.getElementById("full-tree-bottom"),
    filterRelation: document.getElementById("filter-relation"),
    filterStatus: document.getElementById("filter-status"),
    filterPhoto: document.getElementById("filter-photo"),
    filterNote: document.getElementById("filter-note"),
    branchOnlyBtn: document.getElementById("branch-only"),
    expandAllBtn: document.getElementById("expand-all"),
    collapseAllBtn: document.getElementById("collapse-all"),
    zoomInBtn: document.getElementById("zoom-in"),
    zoomOutBtn: document.getElementById("zoom-out"),
    zoomResetBtn: document.getElementById("zoom-reset"),
    viewFocusBtn: document.getElementById("view-focus"),
    viewFullBtn: document.getElementById("view-full"),
    resetBtn: document.getElementById("reset-view"),
    centerBtn: document.getElementById("center-selected"),
    toggleDebugBtn: document.getElementById("toggle-debug"),
    searchInput: document.getElementById("search-input"),
    searchResults: document.getElementById("search-results"),
    searchOverlay: document.getElementById("searchOverlay"),
    searchOverlayInput: document.getElementById("search-overlay-input"),
    searchOverlayResults: document.getElementById("search-overlay-results"),
    searchOverlayClose: document.getElementById("search-overlay-close"),
    moreMenuBtn: document.getElementById("more-menu"),
    moreMenuList: document.getElementById("more-menu-list"),
    exportPngBtn: document.getElementById("export-png"),
    exportPdfBtn: document.getElementById("export-pdf"),
    mobileActionsBtn: document.getElementById("mobile-actions"),
    actionsSheet: document.getElementById("actionsSheet"),
    actionsClose: document.getElementById("actions-close"),
    actionFocus: document.getElementById("action-focus"),
    actionFull: document.getElementById("action-full"),
    actionCenter: document.getElementById("action-center"),
    actionReset: document.getElementById("action-reset"),
    actionExportPng: document.getElementById("action-export-png"),
    actionExportPdf: document.getElementById("action-export-pdf"),
    actionDebug: document.getElementById("action-debug"),
    actionInsights: document.getElementById("action-insights"),
    insightsBtn: document.getElementById("toggle-insights"),
    insightsPanel: document.getElementById("insights"),
    statsPeople: document.getElementById("stat-people"),
    statsCouples: document.getElementById("stat-couples"),
    statsMale: document.getElementById("stat-male"),
    statsFemale: document.getElementById("stat-female"),
    statsUnknown: document.getElementById("stat-unknown"),
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
    drawerLink: document.getElementById("drawer-link"),
    status: document.getElementById("tree-status"),
    toast: document.getElementById("toast"),
    backdrop: document.getElementById("backdrop"),
    fatalError: document.getElementById("fatalError"),
    fatalClose: document.getElementById("fatalClose"),
    fatalReload: document.getElementById("fatalReload"),
    fatalCopy: document.getElementById("fatalCopy")
  };

  // [state]
  const state = {
    data: null,
    peopleById: new Map(),
    unions: [],
    parentsByChild: new Map(),
    childrenByParent: new Map(),
    spousesByPerson: new Map(),
    nameCounts: new Map(),
    selectedId: "",
    viewMode: "focus",
    focusAncDepth: 1,
    focusDescDepth: 1,
    focusShowAllChildren: false,
    expandedIds: new Set(),
    branchOnly: false,
    listCache: [],
    listRowHeight: BASE_ROW_HEIGHT,
    listOverscan: 8,
    fullScale: 1,
    debugMode: false,
    searchIndex: -1,
    filters: {
      relation: "",
      status: "",
      hasPhoto: false,
      hasNote: false
    }
  };

  // [utils]
  const isMobile = () => window.matchMedia("(max-width: 960px)").matches;

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
      syncBackdrop();
    }
  }

  function closeFatalError() {
    if (!dom.fatalError) return;
    dom.fatalError.classList.remove("is-open");
    dom.fatalError.setAttribute("aria-hidden", "true");
    dom.fatalError.hidden = true;
    syncBackdrop();
  }

  function isBackdropNeeded() {
    return Boolean(
      dom.drawer?.classList.contains("is-open") ||
      dom.actionsSheet?.classList.contains("is-open") ||
      dom.insightsPanel?.classList.contains("is-open") ||
      dom.fatalError?.classList.contains("is-open")
    );
  }

  function syncBackdrop() {
    showBackdrop(isBackdropNeeded());
  }

  // [data normalize + index]
  function sanitizeString(value) {
    if (value === null || value === undefined) return null;
    const str = String(value).trim();
    return str.length ? str : null;
  }

  function normalizePerson(person) {
    const normalized = { ...person };
    normalized.id = sanitizeString(person.id);
    normalized.name = sanitizeString(person.name) || "(Tanpa nama)";
    normalized.relation = sanitizeString(person.relation);
    normalized.note = sanitizeString(person.note);
    normalized.photo = sanitizeString(person.photo);
    normalized.birth = sanitizeString(person.birth);
    normalized.death = sanitizeString(person.death);
    normalized.gender = sanitizeString(person.gender);
    if (normalized.gender) normalized.gender = normalized.gender.toLowerCase();
    if (normalized.gender !== "male" && normalized.gender !== "female") normalized.gender = null;
    normalized.gender = inferGender(normalized);
    return normalized;
  }

  function normalizeUnion(union) {
    return {
      ...union,
      id: sanitizeString(union.id),
      partner1: sanitizeString(union.partner1),
      partner2: sanitizeString(union.partner2),
      children: Array.isArray(union.children) ? union.children.map(sanitizeString).filter(Boolean) : []
    };
  }

  function inferGender(person) {
    if (person.gender === "male" || person.gender === "female") return person.gender;
    const name = String(person.name || "");
    if (name.includes(" Bin ") || name.toLowerCase().includes(" bin ")) return "male";
    if (name.includes(" Binti ") || name.toLowerCase().includes(" binti ")) return "female";
    return "unknown";
  }

  function formatName(person) {
    return person?.name || "(Tanpa nama)";
  }

  function formatYear(value) {
    if (!value) return "";
    return String(value).slice(0, 4);
  }

  function uniqueById(list) {
    const seen = new Set();
    return list.filter((p) => {
      if (!p || !p.id) return false;
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });
  }

  function buildIndex(data) {
    state.peopleById = new Map();
    state.parentsByChild = new Map();
    state.childrenByParent = new Map();
    state.spousesByPerson = new Map();
    state.unions = data.unions || [];
    state.nameCounts = new Map();

    data.people.forEach((p) => {
      state.peopleById.set(p.id, p);
      state.nameCounts.set(p.name, (state.nameCounts.get(p.name) || 0) + 1);
    });

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

  function warnValidation(data) {
    const ids = new Set(data.people.map((p) => p.id));
    data.unions.forEach((u) => {
      [u.partner1, u.partner2].forEach((pid) => {
        if (pid && !ids.has(pid)) console.warn(`[DATA] Union ${u.id} missing partner ${pid}`);
      });
      (u.children || []).forEach((cid) => {
        if (!ids.has(cid)) console.warn(`[DATA] Union ${u.id} missing child ${cid}`);
      });
    });
    data.people.forEach((p) => {
      if (p.birth && Number.isNaN(new Date(p.birth).getTime())) {
        console.warn(`[DATA] Invalid birth date for ${p.id}: ${p.birth}`);
      }
      if (p.death && Number.isNaN(new Date(p.death).getTime())) {
        console.warn(`[DATA] Invalid death date for ${p.id}: ${p.death}`);
      }
    });
  }

  // [selectors]
  function getParents(id) {
    const refs = state.parentsByChild.get(id) || [];
    const parents = [];
    refs.forEach((ref) => {
      ref.parents.forEach((pid) => {
        if (pid && state.peopleById.has(pid)) parents.push(state.peopleById.get(pid));
      });
    });
    return uniqueById(parents);
  }

  function getSpouses(id) {
    const set = state.spousesByPerson.get(id) || new Set();
    return uniqueById(Array.from(set).map((pid) => state.peopleById.get(pid)).filter(Boolean));
  }

  function getChildren(id) {
    const set = state.childrenByParent.get(id) || new Set();
    return uniqueById(Array.from(set).map((pid) => state.peopleById.get(pid)).filter(Boolean));
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
      if (!next.length) break;
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
      if (!next.length) break;
      levels.push(next.map((pid) => state.peopleById.get(pid)).filter(Boolean));
      current = next;
    }
    return levels;
  }

  function getMetaText(person) {
    const year = formatYear(person?.birth);
    const needsId = state.nameCounts.get(person?.name) > 1;
    const idText = needsId || state.debugMode ? `@${person.id}` : "";
    return [year, idText].filter(Boolean).join(" · ");
  }

  function formatGender(person) {
    return person.gender || "unknown";
  }

  // [renderers]
  function renderPersonCard(person, { compact = false, highlight = false } = {}) {
    const card = document.createElement("button");
    card.className = `person-card${compact ? " compact" : ""}${highlight ? " is-selected" : ""}`;
    card.type = "button";
    card.dataset.personId = person.id;
    card.dataset.gender = formatGender(person);
    const relationChip = person.relation ? `<span class="person-chip">${person.relation}</span>` : "";
    const meta = getMetaText(person);
    card.innerHTML = `
      ${relationChip}
      <span class="person-name">${formatName(person)}</span>
      <span class="person-meta">${meta || "-"}</span>
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
    if (parents.length === 0) {
      parentsRow.textContent = "Tiada data ibu bapa.";
    } else {
      parents.forEach((p) => parentsRow.appendChild(renderPersonCard(p)));
    }
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
    if (spouses.length === 0) {
      spousesRow.textContent = "Tiada data pasangan.";
    } else {
      spouses.forEach((s) => spousesRow.appendChild(renderPersonCard(s)));
    }
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
    const childList = state.focusShowAllChildren ? children : children.slice(0, 4);
    if (children.length === 0) {
      childrenRow.textContent = "Tiada data anak.";
    } else {
      childList.forEach((c) => childrenRow.appendChild(renderPersonCard(c)));
    }
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
  function applyFilters(list) {
    return list.filter((item) => {
      const person = state.peopleById.get(item.id);
      if (!person) return false;
      if (state.filters.relation) {
        const relation = (person.relation || "").toLowerCase();
        if (!relation.includes(state.filters.relation)) return false;
      }
      if (state.filters.status === "alive" && person.death) return false;
      if (state.filters.status === "deceased" && !person.death) return false;
      if (state.filters.hasPhoto && !person.photo) return false;
      if (state.filters.hasNote && !person.note) return false;
      return true;
    });
  }

  function buildFullList({ ignoreExpanded = false, applyFilter = true } = {}) {
    const rootId = state.branchOnly && state.selectedId ? state.selectedId : (state.data.selfId || state.data.people?.[0]?.id);
    if (!rootId) return [];
    const list = [];
    const visit = (id, depth) => {
      if (!state.peopleById.has(id)) return;
      list.push({ id, depth });
      if (!ignoreExpanded && !state.expandedIds.has(id)) return;
      const children = getChildren(id);
      children.forEach((child) => visit(child.id, depth + 1));
    };
    visit(rootId, 1);
    return applyFilter ? applyFilters(list) : list;
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

    // Virtualization is disabled when zoom != 1 to keep scrolling stable with CSS zoom.
    const useVirtual = state.fullScale === 1;
    const containerHeight = dom.fullList.clientHeight || 400;
    const rowHeight = state.listRowHeight;

    let startIndex = 0;
    let endIndex = total;
    if (useVirtual) {
      startIndex = Math.max(0, Math.floor(dom.fullList.scrollTop / rowHeight) - state.listOverscan);
      endIndex = Math.min(total, Math.ceil((dom.fullList.scrollTop + containerHeight) / rowHeight) + state.listOverscan);
    }

    const slice = state.listCache.slice(startIndex, endIndex);
    dom.fullTopSpacer.style.height = useVirtual ? `${startIndex * rowHeight}px` : "0px";
    dom.fullBottomSpacer.style.height = useVirtual ? `${(total - endIndex) * rowHeight}px` : "0px";
    dom.fullListInner.innerHTML = "";

    slice.forEach((item) => {
      const person = state.peopleById.get(item.id);
      if (!person) return;
      const row = document.createElement("div");
      row.className = "full-row";
      row.style.paddingLeft = `${(item.depth - 1) * 24}px`;
      row.dataset.personId = item.id;

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

    dom.fullListInner.style.transform = "";
    dom.fullListInner.style.zoom = state.fullScale === 1 ? "" : String(state.fullScale);
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

  function computeAge(birth, death) {
    if (!birth) return null;
    const b = new Date(birth);
    if (Number.isNaN(b.getTime())) return null;
    const end = death ? new Date(death) : new Date();
    if (Number.isNaN(end.getTime())) return null;
    let age = end.getFullYear() - b.getFullYear();
    const m = end.getMonth() - b.getMonth();
    if (m < 0 || (m === 0 && end.getDate() < b.getDate())) age -= 1;
    return age;
  }

  function formatDate(value) {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString("ms-MY", { day: "2-digit", month: "short", year: "numeric" });
  }

  function getUpcomingBirthday() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const candidates = state.data.people
      .filter((p) => p.birth)
      .map((p) => {
        const birth = new Date(p.birth);
        if (Number.isNaN(birth.getTime())) return null;
        const next = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
        if (next < today) next.setFullYear(today.getFullYear() + 1);
        return { person: p, date: next };
      })
      .filter(Boolean);
    if (!candidates.length) return null;
    candidates.sort((a, b) => a.date - b.date);
    return candidates[0];
  }

  function updateStats() {
    const people = state.data?.people || [];
    const unions = state.data?.unions || [];
    if (dom.statsPeople) dom.statsPeople.textContent = String(people.length || 0);
    if (dom.statsCouples) dom.statsCouples.textContent = String(unions.length || 0);
    let male = 0;
    let female = 0;
    let unknown = 0;
    let cucu = 0;
    let cicit = 0;

    people.forEach((p) => {
      if (p.gender === "male") male += 1;
      else if (p.gender === "female") female += 1;
      else unknown += 1;

      const relation = (p.relation || "").toLowerCase();
      if (relation.includes("cucu")) cucu += 1;
      if (relation.includes("cicit")) cicit += 1;
    });

    if (dom.statsMale) dom.statsMale.textContent = String(male);
    if (dom.statsFemale) dom.statsFemale.textContent = String(female);
    if (dom.statsUnknown) dom.statsUnknown.textContent = String(unknown);
    if (dom.statsCucu) dom.statsCucu.textContent = String(cucu);
    if (dom.statsCicit) dom.statsCicit.textContent = String(cicit);

    const upcoming = getUpcomingBirthday();
    if (upcoming) {
      const ageNext = computeAge(upcoming.person.birth, upcoming.date);
      if (dom.statsUpcomingName) dom.statsUpcomingName.textContent = formatName(upcoming.person);
      if (dom.statsUpcomingMeta) dom.statsUpcomingMeta.textContent = ageNext !== null
        ? `${formatDate(upcoming.date)} · ${ageNext} tahun`
        : `${formatDate(upcoming.date)}`;
    } else {
      if (dom.statsUpcomingName) dom.statsUpcomingName.textContent = "-";
      if (dom.statsUpcomingMeta) dom.statsUpcomingMeta.textContent = "-";
    }
  }

  function renderRelationChips(list) {
    if (!list.length) return "-";
    return list
      .map((p) => {
        const meta = getMetaText(p);
        const label = meta ? `${formatName(p)} (${meta})` : formatName(p);
        return `<button class="chip" data-id="${p.id}">${label}</button>`;
      })
      .join(" ");
  }

  function renderDrawer(id) {
    if (!dom.drawer || !dom.drawerBody) return;
    const person = state.peopleById.get(id);
    if (!person) return;

    const age = computeAge(person.birth, person.death);
    const ageLabel = age !== null ? `${age} tahun` : "-";
    const genderLabel = person.gender === "male" ? "Lelaki" : person.gender === "female" ? "Perempuan" : "Tidak diketahui";

    dom.drawerTitle.textContent = formatName(person);
    dom.drawerBody.innerHTML = `
      ${person.photo ? `<img class="drawer-photo" src="${person.photo}" alt="${formatName(person)}" />` : ""}
      <div class="drawer-meta">
        <span>${genderLabel}</span>
        <span>${person.relation || "-"}</span>
        <span>Umur: ${ageLabel}</span>
      </div>
      <div class="drawer-section">
        <strong>Tarikh Lahir</strong>
        <div>${formatDate(person.birth)}</div>
      </div>
      <div class="drawer-section">
        <strong>Tarikh Meninggal</strong>
        <div>${person.death ? formatDate(person.death) : "-"}</div>
      </div>
      ${person.note ? `<div class="drawer-note">${person.note}</div>` : ""}
      <div class="drawer-section">
        <strong>Parents</strong>
        <div class="drawer-row">${renderRelationChips(getParents(id))}</div>
      </div>
      <div class="drawer-section">
        <strong>Spouses</strong>
        <div class="drawer-row">${renderRelationChips(getSpouses(id))}</div>
      </div>
      <div class="drawer-section">
        <strong>Children</strong>
        <div class="drawer-row">${renderRelationChips(getChildren(id))}</div>
      </div>
    `;

    dom.drawer.classList.add("is-open");
    dom.drawer.setAttribute("aria-hidden", "false");
    syncBackdrop();

    dom.drawerBody.querySelectorAll("button.chip").forEach((chip) => {
      chip.addEventListener("click", () => setSelected(chip.dataset.id));
    });

    if (dom.drawerCta) {
      dom.drawerCta.onclick = () => {
        state.branchOnly = true;
        if (dom.branchOnlyBtn) dom.branchOnlyBtn.classList.add("is-active");
        expandPathToSelected(person.id);
        updateViewMode("full");
        renderFullTree();
      };
    }

    if (dom.drawerFocus) {
      dom.drawerFocus.onclick = () => {
        updateViewMode("focus");
      };
    }

    if (dom.drawerLink) {
      dom.drawerLink.onclick = () => {
        const link = `${window.location.origin}${window.location.pathname}#${person.id}`;
        navigator.clipboard?.writeText(link);
        showToast("Link disalin");
      };
    }
  }

  function closeDrawer() {
    if (!dom.drawer) return;
    dom.drawer.classList.remove("is-open");
    dom.drawer.setAttribute("aria-hidden", "true");
    syncBackdrop();
  }

  function setSelected(id, options = {}) {
    if (!id || !state.peopleById.has(id)) return;
    state.selectedId = id;
    history.replaceState(null, "", `#${id}`);
    renderFocusView();
    renderFullTree();
    renderDrawer(id);
    if (options.fromSearch) showToast("Fokus pada nama dipilih");
  }

  function expandPathToSelected(id) {
    if (!id) return;
    const chain = [];
    let cursor = id;
    let guard = 0;
    while (cursor && guard < 20) {
      guard += 1;
      chain.push(cursor);
      const parents = getParents(cursor);
      if (!parents.length) break;
      cursor = parents[0].id;
    }
    chain.reverse().forEach((pid) => state.expandedIds.add(pid));
    getChildren(id).forEach((child) => state.expandedIds.add(child.id));
  }

  function scrollToSelectedInFullList() {
    if (!dom.fullList || !state.selectedId) return;
    if (state.fullScale !== 1) {
      const row = dom.fullListInner?.querySelector(`[data-person-id="${state.selectedId}"]`);
      if (row) dom.fullList.scrollTop = row.offsetTop;
      return;
    }
    const index = state.listCache.findIndex((item) => item.id === state.selectedId);
    if (index < 0) return;
    const rowHeight = state.listRowHeight;
    dom.fullList.scrollTop = index * rowHeight;
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

    if (!matches.length) {
      const empty = document.createElement("div");
      empty.className = "search-empty";
      empty.textContent = "Tiada padanan";
      resultsEl.appendChild(empty);
      resultsEl.classList.add("is-open");
      return;
    }

    matches.slice(0, MAX_SEARCH_RESULTS).forEach((p, idx) => {
      const item = document.createElement("div");
      item.className = "search-item";
      item.dataset.index = String(idx);
      const name = formatName(p);
      const idxMatch = name.toLowerCase().indexOf(query.toLowerCase());
      const initial = name.slice(0, 1).toUpperCase();
      const relation = p.relation || "";
      const meta = getMetaText(p) || "-";
      if (idxMatch >= 0) {
        const before = name.slice(0, idxMatch);
        const mid = name.slice(idxMatch, idxMatch + query.length);
        const after = name.slice(idxMatch + query.length);
        item.innerHTML = `
          <span class="search-avatar">${initial}</span>
          <div>
            <div class="search-name">${before}<mark>${mid}</mark>${after}</div>
            <div class="search-meta">${relation}</div>
          </div>
          <span class="search-badge">${meta}</span>
        `;
      } else {
        item.innerHTML = `
          <span class="search-avatar">${initial}</span>
          <div>
            <div class="search-name">${name}</div>
            <div class="search-meta">${relation}</div>
          </div>
          <span class="search-badge">${meta}</span>
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
    resultsEl.dataset.count = String(Math.min(matches.length, MAX_SEARCH_RESULTS));
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
    syncBackdrop();
  }

  function closeActionsSheet() {
    if (!dom.actionsSheet) return;
    dom.actionsSheet.classList.remove("is-open");
    dom.actionsSheet.hidden = true;
    syncBackdrop();
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

  function closeMoreMenu() {
    if (!dom.moreMenuList || !dom.moreMenuBtn) return;
    dom.moreMenuList.hidden = true;
    dom.moreMenuBtn.setAttribute("aria-expanded", "false");
  }

  function toggleMenu(btn, menu) {
    if (!btn || !menu) return;
    const open = !menu.hidden;
    menu.hidden = open;
    btn.setAttribute("aria-expanded", String(!open));
  }

  // [export]
  async function exportToPng() {
    if (!window.html2canvas) {
      showToast("Export PNG belum tersedia");
      return;
    }
    const target = dom.fullView && !dom.fullView.hidden ? dom.fullView : dom.focusView || dom.treeArea;
    const canvas = await window.html2canvas(target, { backgroundColor: "#f6f5f0", scale: 2 });
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "family-tree.png";
    link.click();
  }

  async function exportToPdf() {
    if (!window.html2canvas || !window.jspdf) {
      showToast("Export PDF belum tersedia");
      return;
    }
    const target = dom.fullView && !dom.fullView.hidden ? dom.fullView : dom.focusView || dom.treeArea;
    const canvas = await window.html2canvas(target, { backgroundColor: "#f6f5f0", scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new window.jspdf.jsPDF({ orientation: "landscape", unit: "px", format: [canvas.width, canvas.height] });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("family-tree.pdf");
  }

  function updateExportAvailability() {
    const canPng = Boolean(window.html2canvas);
    const canPdf = Boolean(window.html2canvas && window.jspdf);
    if (dom.exportPngBtn) dom.exportPngBtn.disabled = !canPng;
    if (dom.exportPdfBtn) dom.exportPdfBtn.disabled = !canPdf;
    if (dom.actionExportPng) dom.actionExportPng.disabled = !canPng;
    if (dom.actionExportPdf) dom.actionExportPdf.disabled = !canPdf;
  }

  // [events]
  function wireEvents() {
    if (dom.viewFocusBtn) dom.viewFocusBtn.addEventListener("click", () => updateViewMode("focus"));
    if (dom.viewFullBtn) dom.viewFullBtn.addEventListener("click", () => updateViewMode("full"));

    if (dom.resetBtn) dom.resetBtn.addEventListener("click", () => {
      state.focusAncDepth = 1;
      state.focusDescDepth = 1;
      state.focusShowAllChildren = false;
      state.expandedIds.clear();
      state.branchOnly = false;
      state.fullScale = 1;
      state.filters = { relation: "", status: "", hasPhoto: false, hasNote: false };
      if (dom.filterRelation) dom.filterRelation.value = "";
      if (dom.filterStatus) dom.filterStatus.value = "";
      if (dom.filterPhoto) dom.filterPhoto.checked = false;
      if (dom.filterNote) dom.filterNote.checked = false;
      if (dom.branchOnlyBtn) dom.branchOnlyBtn.classList.remove("is-active");
      updateViewMode("focus");
    });

    if (dom.centerBtn) dom.centerBtn.addEventListener("click", () => {
      if (state.viewMode === "full") {
        scrollToSelectedInFullList();
      } else if (state.selectedId) {
        renderDrawer(state.selectedId);
      }
      closeMoreMenu();
    });

    if (dom.branchOnlyBtn) dom.branchOnlyBtn.addEventListener("click", () => {
      state.branchOnly = !state.branchOnly;
      dom.branchOnlyBtn.classList.toggle("is-active", state.branchOnly);
      renderFullTree();
    });

    if (dom.expandAllBtn) dom.expandAllBtn.addEventListener("click", () => {
      const list = buildFullList({ ignoreExpanded: true, applyFilter: false });
      const count = Math.min(list.length, MAX_EXPAND_NODES);
      for (let i = 0; i < count; i += 1) {
        state.expandedIds.add(list[i].id);
      }
      if (list.length > MAX_EXPAND_NODES) {
        showToast(`Expand terhad kepada ${MAX_EXPAND_NODES} node`);
      }
      renderFullTree();
    });

    if (dom.collapseAllBtn) dom.collapseAllBtn.addEventListener("click", () => {
      const rootId = state.branchOnly && state.selectedId ? state.selectedId : (state.data.selfId || state.data.people?.[0]?.id);
      state.expandedIds.clear();
      if (rootId) state.expandedIds.add(rootId);
      renderFullTree();
    });

    if (dom.zoomInBtn) dom.zoomInBtn.addEventListener("click", () => {
      state.fullScale = Math.min(1.4, state.fullScale + 0.1);
      renderFullTree();
    });
    if (dom.zoomOutBtn) dom.zoomOutBtn.addEventListener("click", () => {
      state.fullScale = Math.max(0.8, state.fullScale - 0.1);
      renderFullTree();
    });
    if (dom.zoomResetBtn) dom.zoomResetBtn.addEventListener("click", () => {
      state.fullScale = 1;
      renderFullTree();
    });

    if (dom.fullList) {
      dom.fullList.addEventListener("scroll", () => {
        if (state.fullScale === 1) renderFullTree();
      });
    }

    if (dom.filterRelation) dom.filterRelation.addEventListener("change", (e) => {
      state.filters.relation = e.target.value;
      renderFullTree();
    });
    if (dom.filterStatus) dom.filterStatus.addEventListener("change", (e) => {
      state.filters.status = e.target.value;
      renderFullTree();
    });
    if (dom.filterPhoto) dom.filterPhoto.addEventListener("change", (e) => {
      state.filters.hasPhoto = e.target.checked;
      renderFullTree();
    });
    if (dom.filterNote) dom.filterNote.addEventListener("change", (e) => {
      state.filters.hasNote = e.target.checked;
      renderFullTree();
    });

    if (dom.moreMenuBtn) dom.moreMenuBtn.addEventListener("click", () => toggleMenu(dom.moreMenuBtn, dom.moreMenuList));

    if (dom.exportPngBtn) dom.exportPngBtn.addEventListener("click", () => { exportToPng(); closeMoreMenu(); });
    if (dom.exportPdfBtn) dom.exportPdfBtn.addEventListener("click", () => { exportToPdf(); closeMoreMenu(); });

    if (dom.toggleDebugBtn) dom.toggleDebugBtn.addEventListener("click", () => {
      state.debugMode = !state.debugMode;
      dom.toggleDebugBtn.classList.toggle("is-active", state.debugMode);
      renderFocusView();
      renderFullTree();
      closeMoreMenu();
    });

    if (dom.mobileActionsBtn) dom.mobileActionsBtn.addEventListener("click", openActionsSheet);
    if (dom.actionsClose) dom.actionsClose.addEventListener("click", closeActionsSheet);

    if (dom.actionFocus) dom.actionFocus.addEventListener("click", () => { updateViewMode("focus"); closeActionsSheet(); });
    if (dom.actionFull) dom.actionFull.addEventListener("click", () => { updateViewMode("full"); closeActionsSheet(); });
    if (dom.actionCenter) dom.actionCenter.addEventListener("click", () => {
      if (state.viewMode === "full") scrollToSelectedInFullList();
      else if (state.selectedId) renderDrawer(state.selectedId);
      closeActionsSheet();
    });
    if (dom.actionReset) dom.actionReset.addEventListener("click", () => { state.fullScale = 1; renderFullTree(); closeActionsSheet(); });
    if (dom.actionExportPng) dom.actionExportPng.addEventListener("click", () => { exportToPng(); closeActionsSheet(); });
    if (dom.actionExportPdf) dom.actionExportPdf.addEventListener("click", () => { exportToPdf(); closeActionsSheet(); });
    if (dom.actionDebug) dom.actionDebug.addEventListener("click", () => {
      state.debugMode = !state.debugMode;
      renderFocusView();
      renderFullTree();
      closeActionsSheet();
    });
    if (dom.actionInsights) dom.actionInsights.addEventListener("click", () => {
      if (dom.insightsPanel) dom.insightsPanel.classList.toggle("is-open");
      closeActionsSheet();
    });

    if (dom.insightsBtn) dom.insightsBtn.addEventListener("click", () => {
      if (!dom.insightsPanel) return;
      dom.insightsPanel.classList.toggle("is-open");
      syncBackdrop();
    });

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
      closeFatalError();
      if (dom.insightsPanel) dom.insightsPanel.classList.remove("is-open");
      syncBackdrop();
    });
    if (dom.searchOverlay) dom.searchOverlay.addEventListener("click", (e) => {
      if (e.target === dom.searchOverlay) closeSearchOverlay();
    });

    if (dom.fatalReload) dom.fatalReload.addEventListener("click", () => window.location.reload());
    if (dom.fatalClose) dom.fatalClose.addEventListener("click", closeFatalError);
    if (dom.fatalCopy) dom.fatalCopy.addEventListener("click", () => {
      const msg = dom.fatalError?.querySelector(".msg")?.textContent || "";
      navigator.clipboard?.writeText(msg);
      showToast("Error disalin");
    });

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
        if (dom.insightsPanel) dom.insightsPanel.classList.remove("is-open");
        closeMoreMenu();
        syncBackdrop();
      }
    });

    document.addEventListener("click", (e) => {
      if (dom.moreMenuList && !dom.moreMenuList.contains(e.target) && e.target !== dom.moreMenuBtn) {
        closeMoreMenu();
      }
    });
  }

  // [init]
  async function initApp() {
    try {
      console.info("[INIT]", APP_VERSION);
      setStatus("Memuatkan data...");
      const res = await fetch("./data.json", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
      const raw = await res.json();
      if (!raw || !Array.isArray(raw.people) || !Array.isArray(raw.unions)) {
        throw new Error("Invalid data.json schema (expected people[] and unions[])");
      }
      const data = {
        ...raw,
        people: raw.people.map(normalizePerson),
        unions: raw.unions.map(normalizeUnion)
      };
      state.data = data;
      buildIndex(data);
      warnValidation(data);
      updateStats();

      state.selectedId = data.selfId || data.people?.[0]?.id || "";
      if (window.location.hash) {
        const hashId = window.location.hash.replace("#", "");
        if (state.peopleById.has(hashId)) state.selectedId = hashId;
      }

      updateViewMode("focus");
      renderFocusView();
      renderFullTree();
      setSelected(state.selectedId, { silent: true });
      setStatus("");
      updateExportAvailability();
      wireEvents();
    } catch (err) {
      setStatus(String(err), true);
      showFatalError(err);
    }
  }

  document.addEventListener("DOMContentLoaded", initApp);
})();
