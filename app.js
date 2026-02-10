
/* KAMI Tree - Refactored Tree Renderer */
(() => {
  "use strict";

  const APP_VERSION = "2026-02-10.7";
  const NODE_W = 170;
  const NODE_H = 76;
  const COL_GAP = 220;
  const ROW_GAP = 110;
  const PADDING = 60;

  const dom = {
    app: document.getElementById("app"),
    toolbar: document.getElementById("toolbar"),
    treeArea: document.querySelector(".tree-area"),
    treeViewport: document.getElementById("tree-viewport"),
    treeStage: document.getElementById("tree-stage"),
    treeCanvas: document.getElementById("tree-canvas"),
    treeLines: document.getElementById("tree-lines"),
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
    actionFit: document.getElementById("action-fit"),
    actionZoomOut: document.getElementById("action-zoom-out"),
    actionZoomIn: document.getElementById("action-zoom-in"),
    actionCenter: document.getElementById("action-center"),
    actionReset: document.getElementById("action-reset"),
    actionExportPng: document.getElementById("action-export-png"),
    actionExportPdf: document.getElementById("action-export-pdf"),
    actionDebug: document.getElementById("action-debug"),
    actionInsights: document.getElementById("action-insights"),
    viewFocusBtn: document.getElementById("view-focus"),
    viewFullBtn: document.getElementById("view-full"),
    fitBtn: document.getElementById("fit-view"),
    centerBtn: document.getElementById("center-selected"),
    resetBtn: document.getElementById("reset-view"),
    zoomInBtn: document.getElementById("zoom-in"),
    zoomOutBtn: document.getElementById("zoom-out"),
    zoomResetBtn: document.getElementById("zoom-reset"),
    moreMenuBtn: document.getElementById("more-menu"),
    moreMenuList: document.getElementById("more-menu-list"),
    exportPngBtn: document.getElementById("export-png"),
    exportPdfBtn: document.getElementById("export-pdf"),
    toggleDebugBtn: document.getElementById("toggle-debug"),
    mobileActionsBtn: document.getElementById("mobile-actions"),
    insightsBtn: document.getElementById("toggle-insights"),
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
    fatalReload: document.getElementById("fatalReload"),
    fatalCopy: document.getElementById("fatalCopy")
  };

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
    focusAncDepth: 2,
    focusDescDepth: 2,
    treeScale: 1,
    nodePositions: new Map(),
    pathHighlight: new Set(),
    debugMode: false,
    searchIndex: -1
  };

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
      showBackdrop(true);
    }
  }

  function closeFatalError() {
    if (!dom.fatalError) return;
    dom.fatalError.classList.remove("is-open");
    dom.fatalError.setAttribute("aria-hidden", "true");
    dom.fatalError.hidden = true;
    showBackdrop(false);
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

  function inferGender(person) {
    const name = String(person?.name || "").toLowerCase();
    const relation = String(person?.relation || "").toLowerCase();
    if (name.includes(" binti ") || relation.includes("isteri")) return "female";
    if (name.includes(" bin ") || relation.includes("suami")) return "male";
    return "unknown";
  }

  function getGender(person) {
    if (person?.gender === "male" || person?.gender === "female") return person.gender;
    return inferGender(person);
  }

  function formatName(person) {
    return person?.name || "(Tanpa nama)";
  }

  function formatYear(value) {
    if (!value) return "";
    return String(value).slice(0, 4);
  }

  function getMetaText(person) {
    const year = formatYear(person?.birth);
    const needsId = state.nameCounts.get(formatName(person)) > 1;
    const idText = needsId || state.debugMode ? `@${person.id}` : "";
    return [year, idText].filter(Boolean).join(" · ");
  }

  function validateData(data) {
    const errors = [];
    if (!data || !Array.isArray(data.people) || !Array.isArray(data.unions)) {
      errors.push("Invalid data.json schema (expected people[] and unions[])." +
        " Pastikan struktur mempunyai 'people' dan 'unions'.");
      throw new Error(errors.join("\n"));
    }
    const ids = new Set();
    data.people.forEach((p, idx) => {
      if (!p.id) errors.push(`Person index ${idx} missing id.`);
      if (p.id && ids.has(p.id)) errors.push(`Duplicate person id: ${p.id}`);
      if (p.id) ids.add(p.id);
    });
    data.unions.forEach((u, idx) => {
      if (!u.id) errors.push(`Union index ${idx} missing id.`);
      [u.partner1, u.partner2].forEach((pid) => {
        if (pid && !ids.has(pid)) errors.push(`Union ${u.id || idx} refers missing partner: ${pid}`);
      });
      (u.children || []).forEach((cid) => {
        if (!ids.has(cid)) errors.push(`Union ${u.id || idx} refers missing child: ${cid}`);
      });
    });
    if (errors.length) throw new Error(errors.join("\n"));
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
      const name = formatName(p);
      state.nameCounts.set(name, (state.nameCounts.get(name) || 0) + 1);
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

  function highlightPath(id) {
    state.pathHighlight = new Set(getBreadcrumbPath(id));
  }

  function buildFocusVisibleIds(id, ancDepth, descDepth) {
    const ids = new Set();
    const add = (pid) => {
      if (pid && state.peopleById.has(pid)) ids.add(pid);
    };

    add(id);
    let current = [id];
    for (let d = 0; d < ancDepth; d += 1) {
      const next = [];
      current.forEach((cid) => {
        getParents(cid).forEach((p) => {
          add(p.id);
          next.push(p.id);
        });
      });
      if (!next.length) break;
      current = next;
    }

    current = [id];
    for (let d = 0; d < descDepth; d += 1) {
      const next = [];
      current.forEach((cid) => {
        getChildren(cid).forEach((c) => {
          add(c.id);
          next.push(c.id);
        });
      });
      if (!next.length) break;
      current = next;
    }

    Array.from(ids).forEach((pid) => {
      getSpouses(pid).forEach((s) => add(s.id));
    });

    return ids;
  }

  function getVisibleIds() {
    if (state.viewMode === "full") {
      return new Set(state.data.people.map((p) => p.id));
    }
    if (!state.selectedId) return new Set();
    return buildFocusVisibleIds(state.selectedId, state.focusAncDepth, state.focusDescDepth);
  }

  function comparePeople(a, b) {
    const ay = formatYear(a?.birth) || "9999";
    const by = formatYear(b?.birth) || "9999";
    if (ay !== by) return ay.localeCompare(by);
    return formatName(a).localeCompare(formatName(b));
  }

  function buildDepthMap(visibleIds) {
    const depth = new Map();
    if (state.viewMode === "full") {
      const roots = [];
      visibleIds.forEach((id) => {
        if (!state.parentsByChild.has(id)) roots.push(id);
      });
      if (!roots.length && visibleIds.size) roots.push(Array.from(visibleIds)[0]);
      const queue = [...roots];
      roots.forEach((id) => depth.set(id, 0));
      let guard = 0;
      while (queue.length && guard < 10000) {
        guard += 1;
        const id = queue.shift();
        const d = depth.get(id) || 0;
        getChildren(id).forEach((child) => {
          if (!visibleIds.has(child.id)) return;
          const next = d + 1;
          if (!depth.has(child.id) || depth.get(child.id) < next) {
            depth.set(child.id, next);
            queue.push(child.id);
          }
        });
      }
      return depth;
    }

    if (!state.selectedId) return depth;
    const queue = [state.selectedId];
    depth.set(state.selectedId, 0);
    let guard = 0;
    while (queue.length && guard < 10000) {
      guard += 1;
      const id = queue.shift();
      const d = depth.get(id) || 0;
      getParents(id).forEach((p) => {
        if (!visibleIds.has(p.id)) return;
        if (!depth.has(p.id)) {
          depth.set(p.id, d - 1);
          queue.push(p.id);
        }
      });
      getChildren(id).forEach((c) => {
        if (!visibleIds.has(c.id)) return;
        if (!depth.has(c.id)) {
          depth.set(c.id, d + 1);
          queue.push(c.id);
        }
      });
      getSpouses(id).forEach((s) => {
        if (!visibleIds.has(s.id)) return;
        if (!depth.has(s.id)) {
          depth.set(s.id, d);
          queue.push(s.id);
        }
      });
    }
    return depth;
  }

  function buildTreeLayout(visibleIds) {
    const depthMap = buildDepthMap(visibleIds);
    const groups = new Map();
    let minDepth = 0;
    let maxDepth = 0;

    visibleIds.forEach((id) => {
      const d = depthMap.has(id) ? depthMap.get(id) : 0;
      minDepth = Math.min(minDepth, d);
      maxDepth = Math.max(maxDepth, d);
      if (!groups.has(d)) groups.set(d, []);
      groups.get(d).push(id);
    });

    const nodes = [];
    const positions = new Map();
    const depths = Array.from(groups.keys()).sort((a, b) => a - b);
    depths.forEach((depth, colIndex) => {
      const ids = groups.get(depth)
        .map((id) => state.peopleById.get(id))
        .filter(Boolean)
        .sort(comparePeople)
        .map((p) => p.id);
      ids.forEach((id, rowIndex) => {
        const x = PADDING + colIndex * COL_GAP;
        const y = PADDING + rowIndex * ROW_GAP;
        nodes.push({ id, x, y, depth });
        positions.set(id, { x, y });
      });
    });

    const width = PADDING * 2 + (depths.length ? (depths.length - 1) * COL_GAP + NODE_W : NODE_W);
    const maxRows = Math.max(1, ...depths.map((d) => groups.get(d).length));
    const height = PADDING * 2 + (maxRows - 1) * ROW_GAP + NODE_H;

    const links = [];
    const linkSet = new Set();
    visibleIds.forEach((id) => {
      getParents(id).forEach((p) => {
        if (!visibleIds.has(p.id)) return;
        const key = `${p.id}-${id}`;
        if (linkSet.has(key)) return;
        linkSet.add(key);
        links.push({ from: p.id, to: id });
      });
    });

    return { nodes, links, width, height, positions };
  }

  function renderTree() {
    if (!dom.treeCanvas || !dom.treeLines || !dom.treeStage) return;
    const visibleIds = getVisibleIds();
    const { nodes, links, width, height, positions } = buildTreeLayout(visibleIds);
    state.nodePositions = positions;

    dom.treeStage.style.width = `${width}px`;
    dom.treeStage.style.height = `${height}px`;

    dom.treeCanvas.innerHTML = "";
    dom.treeLines.setAttribute("width", String(width));
    dom.treeLines.setAttribute("height", String(height));
    dom.treeLines.innerHTML = "";

    const pathSet = state.pathHighlight;
    nodes.forEach((node) => {
      const person = state.peopleById.get(node.id);
      if (!person) return;
      const card = document.createElement("button");
      card.type = "button";
      card.className = "tree-node";
      if (node.id === state.selectedId) card.classList.add("is-selected");
      if (pathSet.size) {
        if (pathSet.has(node.id)) card.classList.add("is-path");
        else card.classList.add("is-dimmed");
      }
      card.dataset.personId = node.id;
      card.dataset.gender = getGender(person);
      card.style.transform = `translate(${node.x}px, ${node.y}px)`;

      const chip = person.relation ? `<span class="node-chip">${person.relation}</span>` : "";
      const meta = getMetaText(person);
      card.innerHTML = `
        ${chip}
        <span class="node-name">${formatName(person)}</span>
        <span class="node-meta">${meta || "-"}</span>
      `;
      card.addEventListener("click", () => setSelected(node.id));
      dom.treeCanvas.appendChild(card);
    });

    links.forEach((link) => {
      const from = positions.get(link.from);
      const to = positions.get(link.to);
      if (!from || !to) return;
      const x1 = from.x + NODE_W / 2;
      const y1 = from.y + NODE_H;
      const x2 = to.x + NODE_W / 2;
      const y2 = to.y;
      const midY = (y1 + y2) / 2;
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", `M ${x1} ${y1} V ${midY} H ${x2} V ${y2}`);
      path.setAttribute("stroke", "rgba(31, 42, 36, 0.25)");
      path.setAttribute("stroke-width", "1.6");
      path.setAttribute("fill", "none");
      if (pathSet.has(link.from) && pathSet.has(link.to)) {
        path.setAttribute("stroke", "rgba(79, 138, 106, 0.6)");
        path.setAttribute("stroke-width", "2");
      }
      dom.treeLines.appendChild(path);
    });

    updateTreeStatus(visibleIds.size);
  }

  function updateTreeStatus(count) {
    const label = state.viewMode === "full" ? "Full Tree" : "Focus View";
    setStatus(`${label}: ${count} node`, false);
  }

  function setTreeScale(scale) {
    state.treeScale = Math.min(1.6, Math.max(0.6, scale));
    if (dom.treeStage) dom.treeStage.style.transform = `scale(${state.treeScale})`;
  }

  function centerOnNode(id, animate = true) {
    if (!dom.treeViewport) return;
    const pos = state.nodePositions.get(id);
    if (!pos) return;
    const viewport = dom.treeViewport;
    const scale = state.treeScale || 1;
    const targetX = pos.x * scale + NODE_W * scale / 2 - viewport.clientWidth / 2;
    const targetY = pos.y * scale + NODE_H * scale / 2 - viewport.clientHeight / 2;
    viewport.scrollTo({ left: targetX, top: targetY, behavior: animate ? "smooth" : "auto" });
  }

  function fitToScreen() {
    if (!dom.treeViewport || !state.nodePositions.size) return;
    const viewport = dom.treeViewport;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    state.nodePositions.forEach((pos) => {
      minX = Math.min(minX, pos.x);
      minY = Math.min(minY, pos.y);
      maxX = Math.max(maxX, pos.x + NODE_W);
      maxY = Math.max(maxY, pos.y + NODE_H);
    });
    const width = maxX - minX + PADDING;
    const height = maxY - minY + PADDING;
    const scaleX = viewport.clientWidth / width;
    const scaleY = viewport.clientHeight / height;
    const scale = Math.min(1.4, Math.max(0.6, Math.min(scaleX, scaleY)));
    setTreeScale(scale);
    viewport.scrollTo({ left: 0, top: 0, behavior: "smooth" });
  }

  function setSelected(id, options = {}) {
    if (!id || !state.peopleById.has(id)) return;
    state.selectedId = id;
    highlightPath(id);
    renderTree();
    openDrawer(id);
    centerOnNode(id, !options.silent);
    if (options.fromSearch) showToast("Fokus pada nama dipilih");
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

    matches.slice(0, 8).forEach((p, idx) => {
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
    const canvas = await window.html2canvas(dom.treeArea, { backgroundColor: "#f6f5f0", scale: 2 });
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "family-tree.png";
    link.click();
  }

  async function exportToPdf() {
    if (!dom.treeArea || !window.html2canvas || !window.jspdf) return;
    const canvas = await window.html2canvas(dom.treeArea, { backgroundColor: "#f6f5f0", scale: 2 });
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

  function updateStats() {
    const people = state.data?.people || [];
    const unions = state.data?.unions || [];
    if (dom.statsPeople) dom.statsPeople.textContent = String(people.length || 0);
    if (dom.statsCouples) dom.statsCouples.textContent = String(unions.length || 0);
    let male = 0;
    let female = 0;
    people.forEach((p) => {
      if (getGender(p) === "male") male += 1;
      if (getGender(p) === "female") female += 1;
    });
    if (dom.statsMale) dom.statsMale.textContent = String(male);
    if (dom.statsFemale) dom.statsFemale.textContent = String(female);
    if (dom.statsCucu) dom.statsCucu.textContent = "-";
    if (dom.statsCicit) dom.statsCicit.textContent = "-";
    if (dom.statsUpcomingName) dom.statsUpcomingName.textContent = "-";
    if (dom.statsUpcomingMeta) dom.statsUpcomingMeta.textContent = "-";
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

  function openDrawer(id) {
    if (!dom.drawer || !dom.drawerBody) return;
    const person = state.peopleById.get(id);
    if (!person) return;
    dom.drawerTitle.textContent = formatName(person);
    dom.drawerBody.innerHTML = `
      <div class="drawer-meta">
        <span>${getGender(person) === "female" ? "?" : getGender(person) === "male" ? "?" : "•"}</span>
        <span>${person.birth ? String(person.birth).slice(0, 10) : "-"} ${person.death ? `– ${String(person.death).slice(0, 10)}` : ""}</span>
      </div>
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
    showBackdrop(true);
    dom.drawerBody.querySelectorAll("button.chip").forEach((chip) => {
      chip.addEventListener("click", () => setSelected(chip.dataset.id));
    });
    if (dom.drawerCta) {
      dom.drawerCta.onclick = () => {
        updateViewMode("full");
        renderTree();
      };
    }
    if (dom.drawerFocus) {
      dom.drawerFocus.onclick = () => {
        updateViewMode("focus");
        renderTree();
      };
    }
  }

  function closeDrawer() {
    if (!dom.drawer) return;
    dom.drawer.classList.remove("is-open");
    dom.drawer.setAttribute("aria-hidden", "true");
    showBackdrop(false);
  }

  function updateViewMode(next) {
    state.viewMode = next === "full" ? "full" : "focus";
    if (dom.viewFocusBtn) dom.viewFocusBtn.classList.toggle("is-active", state.viewMode === "focus");
    if (dom.viewFullBtn) dom.viewFullBtn.classList.toggle("is-active", state.viewMode === "full");
    renderTree();
  }

  function wireEvents() {
    if (dom.viewFocusBtn) dom.viewFocusBtn.addEventListener("click", () => updateViewMode("focus"));
    if (dom.viewFullBtn) dom.viewFullBtn.addEventListener("click", () => updateViewMode("full"));

    if (dom.fitBtn) dom.fitBtn.addEventListener("click", fitToScreen);
    if (dom.zoomInBtn) dom.zoomInBtn.addEventListener("click", () => setTreeScale(state.treeScale + 0.1));
    if (dom.zoomOutBtn) dom.zoomOutBtn.addEventListener("click", () => setTreeScale(state.treeScale - 0.1));
    if (dom.zoomResetBtn) dom.zoomResetBtn.addEventListener("click", () => setTreeScale(1));
    if (dom.centerBtn) dom.centerBtn.addEventListener("click", () => centerOnNode(state.selectedId));

    if (dom.resetBtn) dom.resetBtn.addEventListener("click", () => {
      state.focusAncDepth = 2;
      state.focusDescDepth = 2;
      setTreeScale(1);
      renderTree();
      centerOnNode(state.selectedId, true);
    });

    if (dom.moreMenuBtn) dom.moreMenuBtn.addEventListener("click", () => toggleMenu(dom.moreMenuBtn, dom.moreMenuList));

    if (dom.exportPngBtn) dom.exportPngBtn.addEventListener("click", exportToPng);
    if (dom.exportPdfBtn) dom.exportPdfBtn.addEventListener("click", exportToPdf);

    if (dom.toggleDebugBtn) dom.toggleDebugBtn.addEventListener("click", () => {
      state.debugMode = !state.debugMode;
      dom.toggleDebugBtn.classList.toggle("is-active", state.debugMode);
      renderTree();
    });

    if (dom.mobileActionsBtn) dom.mobileActionsBtn.addEventListener("click", openActionsSheet);
    if (dom.actionsClose) dom.actionsClose.addEventListener("click", closeActionsSheet);

    if (dom.actionFocus) dom.actionFocus.addEventListener("click", () => { updateViewMode("focus"); closeActionsSheet(); });
    if (dom.actionFull) dom.actionFull.addEventListener("click", () => { updateViewMode("full"); closeActionsSheet(); });
    if (dom.actionFit) dom.actionFit.addEventListener("click", () => { fitToScreen(); closeActionsSheet(); });
    if (dom.actionZoomIn) dom.actionZoomIn.addEventListener("click", () => { setTreeScale(state.treeScale + 0.1); closeActionsSheet(); });
    if (dom.actionZoomOut) dom.actionZoomOut.addEventListener("click", () => { setTreeScale(state.treeScale - 0.1); closeActionsSheet(); });
    if (dom.actionCenter) dom.actionCenter.addEventListener("click", () => { centerOnNode(state.selectedId); closeActionsSheet(); });
    if (dom.actionReset) dom.actionReset.addEventListener("click", () => { setTreeScale(1); renderTree(); closeActionsSheet(); });
    if (dom.actionExportPng) dom.actionExportPng.addEventListener("click", () => { exportToPng(); closeActionsSheet(); });
    if (dom.actionExportPdf) dom.actionExportPdf.addEventListener("click", () => { exportToPdf(); closeActionsSheet(); });
    if (dom.actionDebug) dom.actionDebug.addEventListener("click", () => {
      state.debugMode = !state.debugMode;
      renderTree();
      closeActionsSheet();
    });
    if (dom.actionInsights) dom.actionInsights.addEventListener("click", () => {
      if (dom.insightsPanel) dom.insightsPanel.classList.toggle("is-open");
      closeActionsSheet();
    });

    if (dom.insightsBtn) dom.insightsBtn.addEventListener("click", () => {
      if (!dom.insightsPanel) return;
      dom.insightsPanel.classList.toggle("is-open");
      showBackdrop(dom.insightsPanel.classList.contains("is-open"));
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
      showBackdrop(false);
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
        if (dom.moreMenuList) dom.moreMenuList.hidden = true;
      }
    });

    document.addEventListener("click", (e) => {
      if (dom.moreMenuList && !dom.moreMenuList.contains(e.target) && e.target !== dom.moreMenuBtn) {
        dom.moreMenuList.hidden = true;
      }
    });
  }

  async function initApp() {
    try {
      console.info("[INIT]", APP_VERSION);
      setStatus("Memuatkan data...");
      const res = await fetch("./data.json", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
      const data = await res.json();
      validateData(data);
      state.data = data;
      buildIndex(data);
      updateStats();
      state.selectedId = data.selfId || data.people?.[0]?.id || "";
      highlightPath(state.selectedId);
      updateViewMode("focus");
      renderTree();
      centerOnNode(state.selectedId, false);
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
