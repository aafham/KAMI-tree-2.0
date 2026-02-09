const treeWrap = document.getElementById("tree-wrap");
const treeZoom = document.getElementById("tree-zoom");
const treeCanvas = document.getElementById("tree-canvas");
const treeStatus = document.getElementById("tree-status");
const treeLines = document.getElementById("tree-lines");
const minimapCanvas = document.getElementById("minimap-canvas");
const searchInput = document.getElementById("search");
const searchResults = document.getElementById("search-results");
const searchGoBtn = document.getElementById("search-go");
const zoomInBtn = document.getElementById("zoom-in");
const zoomOutBtn = document.getElementById("zoom-out");
const zoomResetBtn = document.getElementById("zoom-reset");
const resetViewBtn = document.getElementById("reset-view");
const toggleThemeBtn = document.getElementById("toggle-theme");
const exportPngBtn = document.getElementById("export-png");
const exportPdfBtn = document.getElementById("export-pdf");
const exportMenuBtn = document.getElementById("export-menu-btn");
const exportMenu = document.getElementById("export-menu");
const exportJsonBtn = document.getElementById("export-json");
const importJsonBtn = document.getElementById("import-json");
const importJsonFile = document.getElementById("import-json-file");
const validateDataBtn = document.getElementById("validate-data");
const focusEldersBtn = document.getElementById("focus-elders");
const backTopBtn = document.getElementById("back-top");
const pathToggleBtn = document.getElementById("path-toggle");
const compactToggleBtn = document.getElementById("compact-toggle");
const validateOutput = document.getElementById("validate-output");
const modal = document.getElementById("person-modal");
const modalBody = document.getElementById("modal-body");
const app = document.getElementById("app");
const controlsToggleBtn = document.getElementById("controls-toggle");
const mobilePanelBtn = document.getElementById("mobile-panel-btn");
const generationControls = document.getElementById("generation-controls");
const branchFilter = document.getElementById("branch-filter");
const viewToggle = document.getElementById("view-toggle");
const storyPanel = document.getElementById("story-panel");
const storyTitle = document.getElementById("story-title");
const storyBody = document.getElementById("story-body");
const storyContent = document.getElementById("story-content");
const panelEditBtn = document.getElementById("panel-edit");
const panelCloseBtn = document.getElementById("panel-close");
const panelEditForm = document.getElementById("panel-edit-form");
const panelCancelBtn = document.getElementById("panel-cancel");
const panelEditName = document.getElementById("panel-edit-name");
const panelEditFirst = document.getElementById("panel-edit-first");
const panelEditLast = document.getElementById("panel-edit-last");
const panelGenderInputs = document.querySelectorAll('input[name="panel-gender"]');
const panelEditRelation = document.getElementById("panel-edit-relation");
const panelEditBirth = document.getElementById("panel-edit-birth");
const panelEditDeath = document.getElementById("panel-edit-death");
const panelEditPhoto = document.getElementById("panel-edit-photo");
const panelEditPhotoFile = document.getElementById("panel-edit-photo-file");
const panelEditNote = document.getElementById("panel-edit-note");
const panelEditStory = document.getElementById("panel-edit-story");
const timelineSection = document.getElementById("timeline-section");
const timelineList = document.getElementById("timeline-list");
const zoomFitBtn = document.getElementById("zoom-fit");
const langToggleBtn = document.getElementById("lang-toggle");
const clearCacheBtn = document.getElementById("clear-cache");
const mobileActionSelect = document.getElementById("mobile-action");
const mobileActionLabel = document.getElementById("mobile-action-label");
const mobileActionGo = document.getElementById("mobile-action-go");
const mobileQuickZoomIn = document.getElementById("m-zoom-in");
const mobileQuickZoomOut = document.getElementById("m-zoom-out");
const mobileQuickZoomFit = document.getElementById("m-zoom-fit");
const mobileSettingsBtn = document.getElementById("mobile-settings-btn");
const mobileSearchBtn = document.getElementById("mobile-search-btn");
const bottomSheetHandle = document.getElementById("sheet-handle");
const miniToolbar = document.getElementById("mini-toolbar");
const miniSearchBtn = document.getElementById("mini-search");
const miniZoomInBtn = document.getElementById("mini-zoom-in");
const miniZoomOutBtn = document.getElementById("mini-zoom-out");
const miniZoomFitBtn = document.getElementById("mini-zoom-fit");
const settingsBtn = document.getElementById("settings-btn");
const bottomSheet = document.getElementById("bottom-sheet");
const settingsModal = document.getElementById("settings-modal");
const settingsCompact = document.getElementById("settings-compact");
const settingsLines = document.getElementById("settings-lines");
const settingsCardScale = document.getElementById("setting-card-scale");
const settingsMinimap = document.getElementById("settings-minimap");
const settingsDrag = document.getElementById("settings-drag");
const settingsDefaultView = document.getElementById("settings-default-view");
const settingsReset = document.getElementById("setting-reset-settings");
const settingsShowBirthdate = document.getElementById("setting-show-birthdate");
const settingsShowAge = document.getElementById("setting-show-age");
const settingsShowTags = document.getElementById("setting-show-tags");
const settingsClearData = document.getElementById("setting-clear-data");
const settingsDataVersion = document.getElementById("settings-data-version");
const statPeople = document.getElementById("stat-people");
const statCouples = document.getElementById("stat-couples");
const statMale = document.getElementById("stat-male");
const statFemale = document.getElementById("stat-female");
const statCucu = document.getElementById("stat-cucu");
const statCicit = document.getElementById("stat-cicit");
const statUpcomingName = document.getElementById("stat-upcoming-name");
const statUpcomingMeta = document.getElementById("stat-upcoming-meta");
const themePresetSelect = document.getElementById("theme-preset");
const timelineGenSelect = document.getElementById("timeline-gen");
const timelineMonthSelect = document.getElementById("timeline-month");
const timelineGenderSelect = document.getElementById("timeline-gender");
const timelineSortSelect = document.getElementById("timeline-sort");
const timelineClearBtn = document.getElementById("timeline-clear");
const viewTreeBtn = document.getElementById("view-tree-btn");
const viewTimelineBtn = document.getElementById("view-timeline-btn");
const timelineMoreBtn = document.getElementById("timeline-more-btn");
const timelineMorePanel = document.getElementById("timeline-more-panel");
const timelineActiveFilters = document.getElementById("timeline-active-filters");


function on(el, event, handler, options) {
  if (!el) return;
  el.addEventListener(event, handler, options);
}

const layoutConfig = {
  cardWidth: 220,
  cardGap: 16,
  hGap: 40,
  vGap: 180,
  topPadding: 10,
  leftPadding: 20,
  labelColumnWidth: 120
};

const branchPalette = ["#4f8a6a", "#8bb8d4", "#c49b6c", "#c47a7a", "#6f8ac4", "#8a6cc4", "#6cc4a1"];
const BRANCH_FILTER_ENABLED = false;
const GENERATION_FILTER_ENABLED = true;
const SOFT_PEACH_ROOT_ID = "p3";
const SOFT_PEACH_COLOR = "var(--soft-peach)";
const BABY_BLUE_ROOT_ID = "p5";
const BABY_BLUE_COLOR = "var(--baby-blue)";
const MINT_GREEN_ROOT_ID = "p7";
const MINT_GREEN_COLOR = "var(--mint-green)";
const LAVENDER_ROOT_ID = "p9";
const LAVENDER_COLOR = "var(--lavender)";
const VIRTUALIZE_THRESHOLD = 1000000;
const STORAGE_KEY = "familyTreePrefs";
const DATA_KEY = "familyTreeData";
const FORCE_RESET = false;
const MOBILE_CONTROLS_KEY = "ft_controls_collapsed";

const isMobileView = () => window.matchMedia("(max-width: 720px)").matches;

let treeData = null;
let peopleById = new Map();
let layoutRoot = null;
let nodesList = [];
let maxDepth = 0;
let scale = 1;
let baseSize = { width: 0, height: 0 };
let elementByPersonId = new Map();
let elementByNodeId = new Map();
let nodeByPersonId = new Map();
let hiddenGenerations = new Set();
let virtualizationEnabled = false;
let renderQueued = false;
let lastSearchResults = [];
let selectedPersonId = "";
let viewMode = "tree";
let branchFilterValue = "all";
let softPeachPeople = new Set();
let babyBluePeople = new Set();
let mintGreenPeople = new Set();
let lavenderPeople = new Set();
let forceFreshData = false;
let recoveryAttempted = false;
let lang = "ms";
let compactMode = false;
let pathMode = false;
let controlsCollapsed = false;
let themePreset = "default";
let showLines = true;
let cardScale = 1;
let minimapEnabled = true;
let dragToPan = true;
let defaultView = "tree";
let showBirthdate = true;
let showAge = true;
let showTags = true;
let timelineFilters = {
  generation: "all",
  month: "all",
  gender: "all",
  sort: "year"
};
let timelineMoreOpen = false;

const prefs = loadPrefs();
const i18n = {
  ms: {
    appKicker: "Salasilah Keluarga",
    appTitle: "Paparan Generasi Keluarga",
    appSubtitle: "Semua ahli keluarga dalam satu pandangan yang jelas, mudah, dan mesra.",
    searchLabel: "Carian nama",
    searchGo: "Cari & Fokus",
    viewTimeline: "Lihat Timeline",
    viewTree: "Lihat Tree",
    compactOn: "Mode Penuh",
    compactOff: "Mode Ringkas",
    fit: "Fit Skrin",
    zoomIn: "Zoom +",
    zoomOut: "Zoom -",
    zoomReset: "Reset",
    themeToggle: "Cerah / Gelap",
    langToggle: "BM / EN",
    exportPng: "Image (JPEG)",
    exportPdf: "File (PDF)",
    branchLabel: "Tapis cabang",
    generationLabel: "Generasi (Lipat/Buka)",
    legendParentChild: "Garis sambungan ibu bapa \u2192 anak",
    legendCouple: "Pasangan ditunjukkan secara selari",
    storyTitle: "Cerita Keluarga",
    storyEmpty: "Klik pada mana-mana ahli keluarga untuk melihat catatan panjang.",
    spouseHusband: "Suami",
    spouseWife: "Isteri",
    timelineTitle: "Timeline Keluarga",
    modalClose: "Tutup",
    modalEdit: "Edit",
    modalRelation: "Hubungan",
    modalBirth: "Tarikh lahir",
    modalDeath: "Tarikh meninggal",
    modalNote: "Catatan",
    modalStory: "Cerita",
    modalFullName: "Nama penuh",
    modalImage: "URL gambar",
    modalShortNote: "Nota ringkas",
    modalLongStory: "Cerita panjang",
    modalCancel: "Batal",
    modalSave: "Simpan",
    modalDelete: "Padam",
    modalDeleteConfirm: "Padam ahli ini? Tindakan ini akan buang hubungan pasangan/anak.",
    legendGeneration: "Generasi",
    branchAll: "Semua cabang",
    branchName: "Cabang {n}",
    parentNone: "Tiada (jadi root)",
    genAll: "Tunjuk Semua",
    searchNone: "Tiada nama ditemui",
    datesUnknown: "Tarikh tidak dinyatakan",
    bornPrefix: "Lahir: ",
    diedPrefix: "Meninggal: ",
    loadFail: "Gagal memuatkan data keluarga.",
    exportDate: "Tarikh eksport: {date}",
    exportPngFail: "Gagal export PNG: library tidak tersedia.",
    exportPdfFail: "Gagal export PDF: library tidak tersedia.",
    ageLabel: "Umur",
    minimapTitle: "Minimap",
    minimapHint: "Klik pada kotak kecil untuk lompat lokasi. Kotak putih menunjukkan kawasan semasa.",
    minimapShow: "Buka Minimap",
    firstNameLabel: "Nama pertama",
    lastNameLabel: "Nama akhir",
    genderLabel: "Jantina",
    genderMale: "Lelaki",
    genderFemale: "Perempuan",
    controlsToggleOpen: "Buka Panel",
    controlsToggleClose: "Tutup Panel",
    resetView: "Reset View",
    loading: "Memuatkan data...",
    clearCache: "Clear Cache",
    clearCacheConfirm: "Padam cache untuk laman ini? Data tersimpan di pelayar akan dipadam.",
    okBtn: "OK",
    errStructure: "Struktur utama mesti ada `people` dan `unions`.",
    errPersonNoId: "Ada ahli tanpa id.",
    errDuplicateId: "ID berulang: {id}",
    errUnionNoId: "Ada union tanpa id.",
    errPartner1Missing: "Partner1 tidak wujud: {id}",
    errPartner2Missing: "Partner2 tidak wujud: {id}",
    errChildMissing: "Anak tidak wujud: {id}",
    errChildMultiple: "Anak {id} terikat pada lebih satu union ({unions}).",
    mobileActions: "Aksi lain",
    mobilePick: "Pilih aksi...",
    validateOk: "Data sah. Tiada ralat ditemui.",
    validateErr: "Ralat data ditemui:",
    searchPlaceholder: "Cari nama ahli keluarga...",
    statsPeople: "Jumlah Ahli",
    statsCouples: "Jumlah Pasangan",
    statsGender: "Jantina",
    statsDescendants: "Keturunan",
    statsCucu: "Cucu",
    statsCicit: "Cicit",
    statsMale: "Lelaki",
    statsFemale: "Perempuan",
    statsUpcoming: "Ulang Tahun Terdekat",
    statsUpcomingEmpty: "Tiada data",
    statsUpcomingToday: "Hari ini",
    timelineGenLabel: "Generasi",
    timelineMonth: "Bulan Lahir",
    timelineGender: "Jantina",
    timelineGenderAll: "Semua",
    timelineGenderMale: "Lelaki",
    timelineGenderFemale: "Perempuan",
    timelineSort: "Susun",
    timelineSortYear: "Ikut Tahun",
    timelineSortAge: "Ikut Umur",
    timelineSortAlpha: "Ikut Abjad",
    timelineSortMonth: "Ikut Bulan",
    timelineSortGender: "Ikut Jantina",
    timelineSortParent: "Ikut Ibu Bapa",
    timelineClear: "Reset",
    timelineMore: "Tapis lagi",
    timelineLess: "Tutup tapis",
    timelineResetAll: "Reset semua",
    themePreset: "Tema",
    themeDefault: "Default",
    themeHeritage: "Heritage",
    themeOcean: "Ocean",
    themeSunset: "Sunset",
    exportMenu: "Download",
    settingsTitle: "Tetapan",
    settingsDisplay: "Paparan",
    settingsNav: "Navigasi",
    settingsTools: "Alat",
    settingsAbout: "Tentang",
    settingsCompact: "Compact Mode",
    settingsLines: "Tunjuk Garisan",
    settingsCardSize: "Saiz Kad",
    settingsSizeSmall: "Kecil",
    settingsSizeNormal: "Normal",
    settingsSizeLarge: "Besar",
    settingsMinimap: "Minimap",
    settingsDrag: "Drag untuk Pan",
    settingsDefaultView: "Paparan Lalai",
    settingsViewTree: "Tree",
    settingsViewTimeline: "Timeline",
    settingsReset: "Reset tetapan",
    settingsShowBirthdate: "Tarikh Lahir",
    settingsShowAge: "Umur",
    settingsShowTags: "Tag/Nota",
    settingsClearData: "Padam semua data",
    settingsDataVersion: "Versi data",
    settingsClose: "Tutup"
  },
  en: {
    appKicker: "Family Lineage",
    appTitle: "Family Generation View",
    appSubtitle: "All family members in one clear, simple, friendly view.",
    searchLabel: "Name search",
    searchGo: "Search & Focus",
    viewTimeline: "Timeline View",
    viewTree: "Tree View",
    compactOn: "Full Mode",
    compactOff: "Compact Mode",
    pathOn: "Hide Path",
    pathOff: "My Lineage",
    fit: "Fit Screen",
    zoomIn: "Zoom +",
    zoomOut: "Zoom -",
    zoomReset: "Reset",
    themeToggle: "Light / Dark",
    langToggle: "EN / BM",
    exportPng: "Image (JPEG)",
    exportPdf: "File (PDF)",
    branchLabel: "Filter branch",
    generationLabel: "Generation (Collapse/Expand)",
    legendParentChild: "Parent \u2192 child connection",
    legendCouple: "Partners shown side by side",
    storyTitle: "Family Story",
    storyEmpty: "Tap any family member to see detailed notes.",
    spouseHusband: "Husband",
    spouseWife: "Wife",
    timelineTitle: "Family Timeline",
    modalClose: "Close",
    modalEdit: "Edit",
    modalRelation: "Relation",
    modalBirth: "Birth date",
    modalDeath: "Death date",
    modalNote: "Notes",
    modalStory: "Story",
    modalFullName: "Full name",
    modalImage: "Image URL",
    modalShortNote: "Short note",
    modalLongStory: "Long story",
    modalCancel: "Cancel",
    modalSave: "Save",
    modalDelete: "Delete",
    modalDeleteConfirm: "Delete this person? This will remove partner/child links.",
    legendGeneration: "Generation",
    branchAll: "All branches",
    branchName: "Branch {n}",
    parentNone: "None (as root)",
    genAll: "Show All",
    searchNone: "No names found",
    datesUnknown: "Date not specified",
    bornPrefix: "Born: ",
    diedPrefix: "Died: ",
    loadFail: "Failed to load family data.",
    exportDate: "Export date: {date}",
    exportPngFail: "PNG export failed: library not available.",
    exportPdfFail: "PDF export failed: library not available.",
    ageLabel: "Age",
    minimapTitle: "Minimap",
    minimapHint: "Tap the minimap to jump. The white box shows your current view.",
    minimapShow: "Show Minimap",
    firstNameLabel: "First name",
    lastNameLabel: "Last name",
    genderLabel: "Gender",
    genderMale: "Male",
    genderFemale: "Female",
    controlsToggleOpen: "Show Panel",
    controlsToggleClose: "Hide Panel",
    resetView: "Reset View",
    loading: "Loading data...",
    clearCache: "Clear Cache",
    clearCacheConfirm: "Clear cache for this site? This will remove data stored in your browser.",
    okBtn: "OK",
    errStructure: "Root structure must include `people` and `unions`.",
    errPersonNoId: "A person is missing an id.",
    errDuplicateId: "Duplicate ID: {id}",
    errUnionNoId: "A union is missing an id.",
    errPartner1Missing: "Partner1 not found: {id}",
    errPartner2Missing: "Partner2 not found: {id}",
    errChildMissing: "Child not found: {id}",
    errChildMultiple: "Child {id} is linked to multiple unions ({unions}).",
    mobileActions: "More actions",
    mobilePick: "Select action...",
    validateOk: "Data is valid. No issues found.",
    validateErr: "Data issues found:",
    searchPlaceholder: "Search family member...",
    statsPeople: "Total People",
    statsCouples: "Couples",
    statsGender: "Gender",
    statsDescendants: "Descendants",
    statsCucu: "Grandkids",
    statsCicit: "Great-grandkids",
    statsMale: "Male",
    statsFemale: "Female",
    statsUpcoming: "Upcoming Birthday",
    statsUpcomingEmpty: "No data",
    statsUpcomingToday: "Today",
    timelineGenLabel: "Generation",
    timelineMonth: "Birth Month",
    timelineGender: "Gender",
    timelineGenderAll: "All",
    timelineGenderMale: "Male",
    timelineGenderFemale: "Female",
    timelineSort: "Sort",
    timelineSortYear: "By Year",
    timelineSortAge: "By Age",
    timelineSortAlpha: "Alphabetical",
    timelineSortMonth: "By Month",
    timelineSortGender: "By Gender",
    timelineSortParent: "By Parent",
    timelineClear: "Reset",
    timelineMore: "More filters",
    timelineLess: "Less filters",
    timelineResetAll: "Reset all",
    themePreset: "Theme",
    themeDefault: "Default",
    themeHeritage: "Heritage",
    themeOcean: "Ocean",
    themeSunset: "Sunset",
    exportMenu: "Download",
    settingsTitle: "Settings",
    settingsDisplay: "Display",
    settingsNav: "Navigation",
    settingsTools: "Tools",
    settingsAbout: "About",
    settingsCompact: "Compact Mode",
    settingsLines: "Show Lines",
    settingsCardSize: "Card Size",
    settingsSizeSmall: "Small",
    settingsSizeNormal: "Normal",
    settingsSizeLarge: "Large",
    settingsMinimap: "Minimap",
    settingsDrag: "Drag to Pan",
    settingsDefaultView: "Default View",
    settingsViewTree: "Tree",
    settingsViewTimeline: "Timeline",
    settingsReset: "Reset settings",
    settingsShowBirthdate: "Show Birthdate",
    settingsShowAge: "Show Age",
    settingsShowTags: "Show Tags",
    settingsClearData: "Clear all data",
    settingsDataVersion: "Data version",
    settingsClose: "Close"
  }
};

function formatText(template, vars = {}) {
  return template.replace(/\{(\w+)\}/g, (_, key) => (vars[key] !== undefined ? vars[key] : ""));
}

function setTreeStatus(message = "", isError = false) {
  if (!treeStatus) return;
  treeStatus.textContent = message;
  treeStatus.hidden = !message;
  treeStatus.classList.toggle("is-error", isError);
}

async function clearSiteCache() {
  const t = i18n[lang] || i18n.ms;
  if (!confirm(t.clearCacheConfirm)) return;
  try {
    localStorage.clear();
  } catch {
    // ignore storage errors
  }
  try {
    sessionStorage.clear();
  } catch {
    // ignore storage errors
  }
  window.location.reload();
}


function applyThemePreset() {
  if (!document.body || !app) return;
  if (!themePreset || themePreset === "default") {
    document.body.removeAttribute("data-preset");
    app.removeAttribute("data-preset");
    return;
  }
  document.body.dataset.preset = themePreset;
  app.dataset.preset = themePreset;
}

function applyCardScale() {
  const next = Math.min(1.15, Math.max(0.85, Number(cardScale) || 1));
  cardScale = next;
  document.body.style.setProperty("--card-scale", String(next));
  layoutConfig.cardWidth = Math.round(220 * next);
  layoutConfig.cardGap = Math.round(16 * next);
  if (app) {
    app.style.setProperty("--card-width", `${layoutConfig.cardWidth}px`);
    app.style.setProperty("--card-gap", `${layoutConfig.cardGap}px`);
  }
}

function applyMinimapState() {
  if (!document.body) return;
  document.body.classList.toggle("minimap-disabled", !minimapEnabled);
  if (!minimapEnabled) return;
  updateMinimap();
}

function applyDragToPanState() {
  if (!treeWrap) return;
  treeWrap.classList.toggle("drag-disabled", !dragToPan);
}

function applyLinesState() {
  if (!showLines) {
    if (treeLines) treeLines.innerHTML = "";
    return;
  }
  scheduleRender();
}

function applyDetailsVisibility() {
  document.body.classList.toggle("hide-birthdate", !showBirthdate);
  document.body.classList.toggle("hide-age", !showAge);
  document.body.classList.toggle("hide-tags", !showTags);
}

function openSettingsModal() {
  if (!settingsModal) return;
  settingsModal.classList.add("is-open");
  settingsModal.setAttribute("aria-hidden", "false");
}

function closeSettingsModal() {
  if (!settingsModal) return;
  settingsModal.classList.remove("is-open");
  settingsModal.setAttribute("aria-hidden", "true");
}

function toggleControlsCollapsed(nextState) {
  const target = typeof nextState === "boolean" ? nextState : !controlsCollapsed;
  controlsCollapsed = target;
  document.body.classList.toggle("controls-collapsed", controlsCollapsed);
  applyLanguage();
  if (isMobileView()) {
    localStorage.setItem(MOBILE_CONTROLS_KEY, controlsCollapsed ? "1" : "0");
  }
  updateSheetHandleState();
  savePrefs();
}

function updateSheetHandleState() {
  if (!bottomSheetHandle) return;
  bottomSheetHandle.setAttribute("aria-expanded", (!controlsCollapsed).toString());
}

function ensureTreeVisible() {
  if (!treeCanvas || !treeData?.people?.length) return;
  if (treeCanvas.children.length > 0) return;
  scale = 1;
  hiddenGenerations.clear();
  branchFilterValue = "all";
  viewMode = "tree";
  buildLayout();
  applyViewMode();
  renderScene();
  applyZoom();
  if (treeWrap) treeWrap.scrollTo({ left: 0, top: 0 });
  setTreeStatus("");
}

function updateStats() {
  if (!treeData) return;
  const t = i18n[lang] || i18n.ms;
  const peopleCount = treeData.people.length;
  const couplesCount = treeData.unions.length;
  let maleCount = 0;
  let femaleCount = 0;
  let cucuCount = 0;
  let cicitCount = 0;
  treeData.people.forEach((person) => {
    const gender = detectGenderFromName(person.name);
    if (gender === "male") maleCount += 1;
    if (gender === "female") femaleCount += 1;
    if (person.relation === "Cucu") cucuCount += 1;
    if (person.relation === "Cicit") cicitCount += 1;
  });
  if (statPeople) statPeople.textContent = String(peopleCount);
  if (statCouples) statCouples.textContent = String(couplesCount);
  if (statMale) statMale.textContent = String(maleCount);
  if (statFemale) statFemale.textContent = String(femaleCount);
  if (statCucu) statCucu.textContent = String(cucuCount);
  if (statCicit) statCicit.textContent = String(cicitCount);

  if (statUpcomingName || statUpcomingMeta) {
    const today = new Date();
    const todayMid = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    let best = null;
    treeData.people.forEach((person) => {
      const birthDate = parseDateValue(person.birth);
      if (!birthDate) return;
      const next = new Date(todayMid.getFullYear(), birthDate.getMonth(), birthDate.getDate());
      if (next < todayMid) next.setFullYear(next.getFullYear() + 1);
      const diff = next.getTime() - todayMid.getTime();
      const name = formatDisplayName(person.name);
      if (!best || diff < best.diff || (diff === best.diff && name.localeCompare(best.name) < 0)) {
        best = { person, birthDate, next, diff, name };
      }
    });

    if (!best) {
      if (statUpcomingName) statUpcomingName.textContent = t.statsUpcomingEmpty || "-";
      if (statUpcomingMeta) statUpcomingMeta.textContent = "";
    } else {
      const monthsMs = ["Jan", "Feb", "Mac", "Apr", "Mei", "Jun", "Jul", "Ogos", "Sep", "Okt", "Nov", "Dis"];
      const monthsEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthLabels = lang === "en" ? monthsEn : monthsMs;
      const day = best.next.getDate();
      const monthLabel = monthLabels[best.next.getMonth()];
      const age = calcAge(best.birthDate, best.next);
      const daysAway = Math.round((best.next.getTime() - todayMid.getTime()) / 86400000);
      let meta = `${day} ${monthLabel}`;
      if (age !== null) {
        meta += ` | ${age} ${lang === "en" ? "yrs" : "thn"}`;
      }
      if (daysAway === 0) {
        meta += ` | ${t.statsUpcomingToday}`;
      } else if (daysAway > 0) {
        meta += ` | ${daysAway} ${lang === "en" ? "days" : "hari"} ${lang === "en" ? "to go" : "lagi"}`;
      }
      if (statUpcomingName) statUpcomingName.textContent = best.name || "-";
      if (statUpcomingMeta) statUpcomingMeta.textContent = meta;
    }
  }
}

function populateTimelineFilters() {
  if (!timelineGenSelect) return;
  const t = i18n[lang] || i18n.ms;
  const current = timelineFilters.generation;
  timelineGenSelect.innerHTML = "";
  const optAll = document.createElement("option");
  optAll.value = "all";
  optAll.textContent = t.genAll;
  timelineGenSelect.appendChild(optAll);
  for (let i = 1; i <= maxDepth; i += 1) {
    const opt = document.createElement("option");
    opt.value = String(i);
    opt.textContent = `G${i}`;
    timelineGenSelect.appendChild(opt);
  }
  timelineGenSelect.value = current && (current === "all" || Number(current) <= maxDepth) ? current : "all";
  populateTimelineMonths();
}

function populateTimelineMonths() {
  if (!timelineMonthSelect) return;
  const monthsMs = ["Jan", "Feb", "Mac", "Apr", "Mei", "Jun", "Jul", "Ogos", "Sep", "Okt", "Nov", "Dis"];
  const monthsEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthLabels = lang === "en" ? monthsEn : monthsMs;
  timelineMonthSelect.innerHTML = "";
  const optAll = document.createElement("option");
  optAll.value = "all";
  optAll.textContent = lang === "en" ? "All months" : "Semua bulan";
  timelineMonthSelect.appendChild(optAll);
  monthLabels.forEach((label, idx) => {
    const opt = document.createElement("option");
    opt.value = String(idx + 1);
    opt.textContent = label;
    timelineMonthSelect.appendChild(opt);
  });
  timelineMonthSelect.value = timelineFilters.month || "all";
}

function updateTimelineActiveFilters() {
  if (!timelineActiveFilters) return;
  const t = i18n[lang] || i18n.ms;
  const defaults = { generation: "all", month: "all", gender: "all", sort: "year" };
  const chips = [];

  const labelMap = {
    generation: t.timelineGenLabel,
    month: t.timelineMonth,
    gender: t.timelineGender,
    sort: t.timelineSort
  };

  const getSelectText = (select, value) => {
    if (!select) return value;
    const opt = select.querySelector(`option[value="${value}"]`);
    return opt ? opt.textContent : value;
  };

  if (timelineFilters.generation !== defaults.generation) {
    chips.push({
      key: "generation",
      text: `${labelMap.generation}: ${getSelectText(timelineGenSelect, timelineFilters.generation)} ✕`
    });
  }
  if (timelineFilters.month !== defaults.month) {
    chips.push({
      key: "month",
      text: `${labelMap.month}: ${getSelectText(timelineMonthSelect, timelineFilters.month)} ✕`
    });
  }
  if (timelineFilters.gender !== defaults.gender) {
    chips.push({
      key: "gender",
      text: `${labelMap.gender}: ${getSelectText(timelineGenderSelect, timelineFilters.gender)} ✕`
    });
  }
  if (timelineFilters.sort !== defaults.sort) {
    chips.push({
      key: "sort",
      text: `${labelMap.sort}: ${getSelectText(timelineSortSelect, timelineFilters.sort)} ✕`
    });
  }

  timelineActiveFilters.innerHTML = "";
  if (!chips.length) {
    timelineActiveFilters.hidden = true;
    return;
  }
  timelineActiveFilters.hidden = false;
  chips.forEach((chip) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip";
    btn.dataset.filter = chip.key;
    btn.textContent = chip.text;
    btn.addEventListener("click", () => {
      if (chip.key === "generation") {
        timelineFilters.generation = defaults.generation;
        if (timelineGenSelect) timelineGenSelect.value = defaults.generation;
      }
      if (chip.key === "month") {
        timelineFilters.month = defaults.month;
        if (timelineMonthSelect) timelineMonthSelect.value = defaults.month;
      }
      if (chip.key === "gender") {
        timelineFilters.gender = defaults.gender;
        if (timelineGenderSelect) timelineGenderSelect.value = defaults.gender;
      }
      if (chip.key === "sort") {
        timelineFilters.sort = defaults.sort;
        if (timelineSortSelect) timelineSortSelect.value = defaults.sort;
      }
      renderTimeline();
      updateTimelineActiveFilters();
    });
    timelineActiveFilters.appendChild(btn);
  });

  const resetAll = document.createElement("button");
  resetAll.type = "button";
  resetAll.className = "chip reset-all";
  resetAll.textContent = t.timelineResetAll;
  resetAll.addEventListener("click", () => {
    timelineFilters = { generation: "all", month: "all", gender: "all", sort: "year" };
    if (timelineGenSelect) timelineGenSelect.value = "all";
    if (timelineMonthSelect) timelineMonthSelect.value = "all";
    if (timelineGenderSelect) timelineGenderSelect.value = "all";
    if (timelineSortSelect) timelineSortSelect.value = "year";
    renderTimeline();
    updateTimelineActiveFilters();
  });
  timelineActiveFilters.appendChild(resetAll);
}

function updateTimelineMoreState(nextState) {
  if (!timelineMoreBtn || !timelineMorePanel) return;
  const t = i18n[lang] || i18n.ms;
  if (typeof nextState === "boolean") timelineMoreOpen = nextState;
  timelineMorePanel.classList.toggle("is-open", timelineMoreOpen);
  timelineMorePanel.setAttribute("aria-hidden", timelineMoreOpen ? "false" : "true");
  timelineMoreBtn.setAttribute("aria-expanded", timelineMoreOpen ? "true" : "false");
  timelineMoreBtn.textContent = timelineMoreOpen ? t.timelineLess : t.timelineMore;
}

function updateViewSwitch() {
  if (viewTreeBtn) viewTreeBtn.classList.toggle("is-active", viewMode === "tree");
  if (viewTimelineBtn) viewTimelineBtn.classList.toggle("is-active", viewMode === "timeline");
}

function getPersonDepthMap() {
  const map = new Map();
  nodesList.forEach((node) => {
    if (node.type === "person") map.set(node.personId, node.depth);
    if (node.type === "union") {
      if (node.partner1) map.set(node.partner1, node.depth);
      if (node.partner2) map.set(node.partner2, node.depth);
    }
  });
  return map;
}

function clearSelectionHighlight() {
  document.querySelectorAll(".person-card.is-selected, .person-card.is-parent, .person-card.is-child, .person-card.is-partner")
    .forEach((el) => el.classList.remove("is-selected", "is-parent", "is-child", "is-partner"));
}

function applySelectionHighlight(personId) {
  if (!personId) {
    clearSelectionHighlight();
    return;
  }
  clearSelectionHighlight();
  const parents = new Set();
  const partners = new Set();
  const children = new Set();

  const parentUnion = treeData.unions.find((u) => (u.children || []).includes(personId));
  if (parentUnion) {
    if (parentUnion.partner1) parents.add(parentUnion.partner1);
    if (parentUnion.partner2) parents.add(parentUnion.partner2);
  }

  treeData.unions.forEach((u) => {
    if (u.partner1 === personId || u.partner2 === personId) {
      if (u.partner1 && u.partner1 !== personId) partners.add(u.partner1);
      if (u.partner2 && u.partner2 !== personId) partners.add(u.partner2);
      (u.children || []).forEach((cid) => children.add(cid));
    }
  });

  const selectedGroup = elementByPersonId.get(personId);
  if (selectedGroup) {
    const selectedCard = selectedGroup.querySelector(`.person-card[data-person-id="${personId}"]`);
    if (selectedCard) selectedCard.classList.add("is-selected");
  }

  const applyClass = (ids, className) => {
    ids.forEach((id) => {
      const group = elementByPersonId.get(id);
      if (!group) return;
      const card = group.querySelector(`.person-card[data-person-id="${id}"]`);
      if (card) card.classList.add(className);
    });
  };

  applyClass(parents, "is-parent");
  applyClass(children, "is-child");
  applyClass(partners, "is-partner");
}



function initFromData(data) {
  treeData = data;
  peopleById = new Map(treeData.people.map((p) => [p.id, p]));
  softPeachPeople = computeBranchPeople(SOFT_PEACH_ROOT_ID);
  babyBluePeople = computeBranchPeople(BABY_BLUE_ROOT_ID);
  mintGreenPeople = computeBranchPeople(MINT_GREEN_ROOT_ID);
  lavenderPeople = computeBranchPeople(LAVENDER_ROOT_ID);
  if (storyPanel) storyPanel.hidden = true;
  if (app) app.classList.remove("story-open");

  if (prefs.theme) {
    app.dataset.theme = prefs.theme;
    document.body.dataset.theme = prefs.theme;
  } else {
    document.body.dataset.theme = app.dataset.theme || "light";
  }

  if (prefs.scale) scale = prefs.scale;
  hiddenGenerations.clear();
  if (prefs.viewMode) viewMode = prefs.viewMode;
  if (prefs.branchFilter) branchFilterValue = prefs.branchFilter;
  if (prefs.lang) lang = prefs.lang;
  if (prefs.compactMode) compactMode = true;
  if (prefs.pathMode) pathMode = true;
  if (isMobileView()) {
    const storedCollapse = localStorage.getItem(MOBILE_CONTROLS_KEY);
    if (storedCollapse === null) {
      controlsCollapsed = true;
      localStorage.setItem(MOBILE_CONTROLS_KEY, "1");
    } else {
      controlsCollapsed = storedCollapse === "1";
    }
  } else {
    const hasControlsPref = Object.prototype.hasOwnProperty.call(prefs, "controlsCollapsed");
    controlsCollapsed = hasControlsPref ? Boolean(prefs.controlsCollapsed) : false;
  }
  if (prefs.themePreset) themePreset = prefs.themePreset;
  if (prefs.showLines !== undefined) showLines = Boolean(prefs.showLines);
  if (prefs.cardScale) cardScale = Number(prefs.cardScale) || 1;
  if (prefs.minimapEnabled !== undefined) minimapEnabled = Boolean(prefs.minimapEnabled);
  if (prefs.dragToPan !== undefined) dragToPan = Boolean(prefs.dragToPan);
  if (prefs.showBirthdate !== undefined) showBirthdate = Boolean(prefs.showBirthdate);
  if (prefs.showAge !== undefined) showAge = Boolean(prefs.showAge);
  if (prefs.showTags !== undefined) showTags = Boolean(prefs.showTags);
  if (prefs.defaultView) defaultView = prefs.defaultView;
  if (!BRANCH_FILTER_ENABLED) branchFilterValue = "all";
  if (!GENERATION_FILTER_ENABLED) hiddenGenerations.clear();

  applyCardScale();
  buildLayout();
  updateStats();
  populateTimelineFilters();
  if (nodesList.length === 0) {
    forceFreshData = true;
  }
  if (branchFilterValue !== "all") {
    const maxBranch = layoutRoot?.children?.length || 0;
    if (Number(branchFilterValue) >= maxBranch) {
      branchFilterValue = "all";
      savePrefs();
    }
  }
  if (hiddenGenerations.size >= maxDepth) {
    hiddenGenerations.clear();
    savePrefs();
  }
  buildGenerationControls();
  buildBranchFilter();
  if (defaultView) viewMode = defaultView;
  applyLanguage();
  applyThemePreset();
  applyMinimapState();
  applyDragToPanState();
  applyLinesState();
  applyDetailsVisibility();
  if (themePresetSelect) themePresetSelect.value = themePreset;
  if (settingsCardScale) settingsCardScale.value = String(cardScale);
  if (settingsCompact) settingsCompact.checked = compactMode;
  if (settingsLines) settingsLines.checked = showLines;
  if (settingsMinimap) settingsMinimap.checked = minimapEnabled;
  if (settingsDrag) settingsDrag.checked = dragToPan;
  if (settingsShowBirthdate) settingsShowBirthdate.checked = showBirthdate;
  if (settingsShowAge) settingsShowAge.checked = showAge;
  if (settingsShowTags) settingsShowTags.checked = showTags;
  if (settingsDefaultView) settingsDefaultView.value = viewMode;
  if (settingsDataVersion) settingsDataVersion.textContent = treeData?.dataVersion || "-";
  document.body.classList.toggle("compact", compactMode);
  document.body.classList.toggle("controls-collapsed", controlsCollapsed);
  updateSheetHandleState();
  if (!timelineSection) viewMode = "tree";
  applyViewMode();
  renderScene();
  applyZoom();
  treeWrap.scrollTo({ left: 0, top: 0 });
  setTreeStatus("");
  ensureTreeVisible();
  restoreFromUrl();
  if (pathMode) applyLineageHighlight();
  if (treeCanvas && treeCanvas.children.length === 0) {
    recoverEmptyView();
    recoverEmptyViewAsync();
  }
  return treeCanvas && treeCanvas.children.length > 0;
}

function recoverEmptyView() {
  hiddenGenerations.clear();
  branchFilterValue = "all";
  viewMode = "tree";
  scale = 1;
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(DATA_KEY);
  } catch {
    // ignore storage errors
  }
  applyViewMode();
  renderScene();
  applyZoom();
  if (treeCanvas && treeCanvas.children.length === 0) {
    const t = i18n[lang] || i18n.ms;
    treeCanvas.textContent = t.loadFail;
    setTreeStatus(t.loadFail, true);
  }
}

async function recoverEmptyViewAsync() {
  if (recoveryAttempted) return;
  recoveryAttempted = true;
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(DATA_KEY);
  } catch {
    // ignore storage errors
  }
  try {
    const res = await fetch(`data.json?ts=${Date.now()}`);
    const data = await res.json();
    treeData = data;
    storeData();
    initFromData(data);
  } catch {
    // ignore fetch errors
  }
}

let stored = loadStoredData();
if (FORCE_RESET) {
  localStorage.removeItem(DATA_KEY);
  localStorage.removeItem(STORAGE_KEY);
  stored = null;
  hiddenGenerations.clear();
  branchFilterValue = "all";
}
if (stored) {
  const errors = validateTreeData(stored);
  if (errors.length === 0 && stored.people.length > 0) {
    const ok = initFromData(stored);
    if (forceFreshData) {
      localStorage.removeItem(DATA_KEY);
      stored = null;
      forceFreshData = false;
    }
    if (!ok) {
      localStorage.removeItem(DATA_KEY);
      stored = null;
    }
  } else {
    stored = null;
  }
}

if (!treeCanvas || !treeCanvas.children.length) {
  setTreeStatus("");
}

fetch(`data.json?v=${Date.now()}`, { cache: "no-store" })
  .then((res) => res.json())
  .then((data) => {
    treeCanvas.textContent = "";
    if (!stored) {
      treeData = data;
      storeData();
      stored = data;
      initFromData(data);
    }
    ensureTreeVisible();
    if (!treeCanvas.children.length) {
      treeData = data;
      storeData();
      initFromData(data);
      return;
    }
    if (data?.dataVersion && stored.dataVersion === data.dataVersion) {
      return;
    }
    treeData = data;
    storeData();
    initFromData(data);
  })
  .catch((err) => {
    if (!stored) {
      const t = i18n[lang] || i18n.ms;
      treeCanvas.textContent = t.loadFail;
      setTreeStatus(t.loadFail, true);
    }
    console.error(err);
  });

function loadPrefs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    return {};
  }
}

function savePrefs() {
  const payload = {
    theme: app.dataset.theme,
    scale,
    viewMode,
    branchFilter: branchFilterValue,
    lang,
    compactMode,
    pathMode,
    controlsCollapsed,
    themePreset,
    showLines,
    cardScale,
    minimapEnabled,
    dragToPan,
    showBirthdate,
    showAge,
    showTags,
    defaultView
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function loadStoredData() {
  return null;
}

function storeData() {
  // no-op: view-only mode, always use data.json
}

function buildLayout() {
  const unionsById = new Map(treeData.unions.map((u) => [u.id, u]));
  const unionsByPartner = new Map();
  const parentUnionByChild = new Map();

  treeData.unions.forEach((union) => {
    [union.partner1, union.partner2].forEach((pid) => {
      if (!pid) return;
      if (!unionsByPartner.has(pid)) unionsByPartner.set(pid, []);
      unionsByPartner.get(pid).push(union.id);
    });
    union.children.forEach((childId) => parentUnionByChild.set(childId, union.id));
  });

  const unionNodes = new Map();

  function buildUnionNode(unionId, trail = new Set()) {
    if (trail.has(unionId)) return null;
    if (unionNodes.has(unionId)) return unionNodes.get(unionId);
    const union = unionsById.get(unionId);
    if (!union) return null;
    const node = {
      id: unionId,
      type: "union",
      partner1: union.partner1,
      partner2: union.partner2,
      children: []
    };
    unionNodes.set(unionId, node);
    const nextTrail = new Set(trail);
    nextTrail.add(unionId);
    union.children.forEach((childId) => {
      const childUnions = (unionsByPartner.get(childId) || []).filter((id) => id !== unionId);
      if (childUnions.length > 0) {
        childUnions.forEach((childUnionId) => {
          const childUnionNode = buildUnionNode(childUnionId, nextTrail);
          if (childUnionNode) node.children.push(childUnionNode);
        });
      } else {
        node.children.push({ id: childId, type: "person", personId: childId, children: [] });
      }
    });
    return node;
  }

  const root = { id: "root", type: "root", children: [] };

  const rootUnions = treeData.unions.filter((u) => {
    const p1Parent = u.partner1 && parentUnionByChild.has(u.partner1);
    const p2Parent = u.partner2 && parentUnionByChild.has(u.partner2);
    return !p1Parent && !p2Parent;
  });

  rootUnions.forEach((u) => {
    const node = buildUnionNode(u.id);
    if (node) root.children.push(node);
  });

  treeData.people.forEach((person) => {
    const isChild = parentUnionByChild.has(person.id);
    const isPartner = unionsByPartner.has(person.id);
    if (!isChild && !isPartner) {
      root.children.push({ id: person.id, type: "person", personId: person.id, children: [] });
    }
  });

  function measure(node) {
    if (node.type === "root") {
      const childWidths = node.children.map((child) => measure(child));
      const total = childWidths.reduce((sum, w) => sum + w, 0) + layoutConfig.hGap * Math.max(0, childWidths.length - 1);
      node.width = total;
      node.ownWidth = 0;
      return node.width;
    }

    const ownWidth = node.type === "union" && node.partner2
      ? layoutConfig.cardWidth * 2 + layoutConfig.cardGap
      : layoutConfig.cardWidth;

    const childWidths = node.children.map((child) => measure(child));
    const childrenTotal = childWidths.reduce((sum, w) => sum + w, 0) + layoutConfig.hGap * Math.max(0, childWidths.length - 1);
    node.width = Math.max(ownWidth, childrenTotal || 0);
    node.ownWidth = ownWidth;
    return node.width;
  }

  function layout(node, x, y, depth = 0, branchId = 0) {
    node.depth = depth;
    node.branchId = branchId;
    if (node.type !== "root") {
      node.x = x + (node.width - node.ownWidth) / 2;
      node.y = y;
    }
    const childWidths = node.children.map((child) => child.width);
    const total = childWidths.reduce((sum, w) => sum + w, 0) + layoutConfig.hGap * Math.max(0, childWidths.length - 1);
    let startX = x + (node.width - total) / 2;
    node.children.forEach((child) => {
      layout(child, startX, y + layoutConfig.vGap, depth + 1, branchId);
      startX += child.width + layoutConfig.hGap;
    });
  }

  measure(root);
  root.children.forEach((child, index) => {
    const branchId = index % branchPalette.length;
    layout(child, layoutConfig.leftPadding + layoutConfig.labelColumnWidth, layoutConfig.topPadding, 1, branchId);
  });

  nodesList = [];
  maxDepth = 0;

  function collect(node) {
    if (node.type !== "root") {
      nodesList.push(node);
      maxDepth = Math.max(maxDepth, node.depth);
    }
    node.children.forEach(collect);
  }

  collect(root);
  layoutRoot = root;

  let maxX = 0;
  let maxY = 0;
  nodesList.forEach((node) => {
    const width = node.ownWidth || layoutConfig.cardWidth;
    maxX = Math.max(maxX, node.x + width);
    maxY = Math.max(maxY, node.y + layoutConfig.vGap);
  });

  baseSize = {
    width: maxX + layoutConfig.leftPadding,
    height: maxY + layoutConfig.vGap
  };

  virtualizationEnabled = nodesList.length > VIRTUALIZE_THRESHOLD;
}

function buildGenerationControls() {
  if (!generationControls || !GENERATION_FILTER_ENABLED) return;
  const t = i18n[lang] || i18n.ms;
  generationControls.innerHTML = "";
  for (let depth = 1; depth <= maxDepth; depth += 1) {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "gen-chip";
    chip.dataset.depth = depth;
    chip.textContent = `G${depth}`;
    if (hiddenGenerations.has(depth)) chip.classList.add("inactive");
    chip.addEventListener("click", () => {
      if (hiddenGenerations.has(depth)) {
        hiddenGenerations.delete(depth);
        chip.classList.remove("inactive");
      } else {
        hiddenGenerations.add(depth);
        chip.classList.add("inactive");
      }
      savePrefs();
      scheduleRender();
      updateUrlState();
    });
    generationControls.appendChild(chip);
  }

  const reset = document.createElement("button");
  reset.type = "button";
  reset.className = "gen-chip";
  reset.textContent = t.genAll;
  reset.dataset.reset = "true";
  reset.addEventListener("click", () => {
    hiddenGenerations.clear();
    generationControls.querySelectorAll(".gen-chip").forEach((chip) => {
      if (!chip.dataset.reset) chip.classList.remove("inactive");
    });
    savePrefs();
    scheduleRender();
    updateUrlState();
  });
  generationControls.appendChild(reset);
}

function buildBranchFilter() {
  if (!branchFilter || !BRANCH_FILTER_ENABLED) return;
  const t = i18n[lang] || i18n.ms;
  branchFilter.innerHTML = "";
  const optionAll = document.createElement("option");
  optionAll.value = "all";
  optionAll.textContent = t.branchAll;
  branchFilter.appendChild(optionAll);

  layoutRoot.children.forEach((child, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = formatText(t.branchName, { n: index + 1 });
    branchFilter.appendChild(option);
  });

  branchFilter.value = branchFilterValue;
  branchFilter.addEventListener("change", () => {
    branchFilterValue = branchFilter.value;
    savePrefs();
    scheduleRender();
    updateUrlState();
  });
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

function rebuildFromData() {
  peopleById = new Map(treeData.people.map((p) => [p.id, p]));
  softPeachPeople = computeBranchPeople(SOFT_PEACH_ROOT_ID);
  babyBluePeople = computeBranchPeople(BABY_BLUE_ROOT_ID);
  mintGreenPeople = computeBranchPeople(MINT_GREEN_ROOT_ID);
  lavenderPeople = computeBranchPeople(LAVENDER_ROOT_ID);
  applyCardScale();
  buildLayout();
  updateStats();
  populateTimelineFilters();
  buildGenerationControls();
  buildBranchFilter();
  renderScene();
  applyLanguage();
  if (pathMode) applyLineageHighlight();
}

function computeBranchPeople(rootId) {
  if (!treeData?.unions || !treeData?.people) return new Set();
  if (!treeData.people.some((p) => p.id === rootId)) return new Set();
  const unionsByPartner = new Map();
  treeData.unions.forEach((union) => {
    [union.partner1, union.partner2].forEach((pid) => {
      if (!pid) return;
      if (!unionsByPartner.has(pid)) unionsByPartner.set(pid, []);
      unionsByPartner.get(pid).push(union);
    });
  });

  const result = new Set();
  const queue = [rootId];
  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || result.has(current)) continue;
    result.add(current);
    const unions = unionsByPartner.get(current) || [];
    unions.forEach((union) => {
      if (union.partner1) queue.push(union.partner1);
      if (union.partner2) queue.push(union.partner2);
      (union.children || []).forEach((childId) => queue.push(childId));
    });
  }
  return result;
}

function generateId() {
  let idx = treeData.people.length + 1;
  let id = `p${idx}`;
  while (peopleById.has(id)) {
    idx += 1;
    id = `p${idx}`;
  }
  return id;
}

function generateUnionId() {
  const used = new Set(treeData.unions.map((u) => u.id));
  let idx = treeData.unions.length + 1;
  let id = `u${idx}`;
  while (used.has(id)) {
    idx += 1;
    id = `u${idx}`;
  }
  return id;
}

function applyViewMode() {
  if (!timelineSection) {
    viewMode = "tree";
    if (treeWrap) treeWrap.hidden = false;
    document.body.dataset.view = "tree";
    return;
  }
  if (viewMode === "timeline") {
    document.body.dataset.view = "timeline";
    timelineSection.hidden = false;
    treeWrap.hidden = true;
    renderTimeline();
  } else {
    document.body.dataset.view = "tree";
    timelineSection.hidden = true;
    treeWrap.hidden = false;
  }
  applyLanguage();
}

function scheduleRender() {
  if (renderQueued) return;
  renderQueued = true;
  requestAnimationFrame(() => {
    renderQueued = false;
    renderScene();
  });
}

function renderScene() {
  if (viewMode === "timeline") {
    if (!timelineSection) {
      viewMode = "tree";
    } else {
      renderTimeline();
      return;
    }
  }

  treeCanvas.innerHTML = "";
  treeLines.innerHTML = "";
  elementByPersonId.clear();
  elementByNodeId.clear();
  nodeByPersonId.clear();

  treeCanvas.style.width = `${baseSize.width}px`;
  treeCanvas.style.height = `${baseSize.height}px`;
  treeLines.setAttribute("width", baseSize.width);
  treeLines.setAttribute("height", baseSize.height);

  renderGenerationLabels();

  let visibleNodes = getVisibleNodes();
  if (visibleNodes.length === 0) {
    let changed = false;
    if (hiddenGenerations.size > 0) {
      hiddenGenerations.clear();
      changed = true;
    }
    if (branchFilterValue !== "all") {
      branchFilterValue = "all";
      changed = true;
    }
    if (changed) {
      savePrefs();
      visibleNodes = getVisibleNodes();
    }
    if (visibleNodes.length === 0 && treeData?.people?.length) {
      hiddenGenerations.clear();
      branchFilterValue = "all";
      viewMode = "tree";
      localStorage.removeItem(STORAGE_KEY);
      visibleNodes = getVisibleNodes();
    }
  }
  visibleNodes.forEach((node) => renderNode(node));

  drawLines(layoutRoot, visibleNodes);
  applyZoom();
  updateMinimap();
  if (pathMode) applyLineageHighlight();
  if (selectedPersonId) applySelectionHighlight(selectedPersonId);
  if (treeCanvas && treeCanvas.children.length > 0) {
    setTreeStatus("");
  }
}

function renderGenerationLabels() {
  const labelOffset = 20;
  const depthMap = new Map();
  nodesList.forEach((node) => {
    if (!nodeVisible(node)) return;
    if (!depthMap.has(node.depth)) depthMap.set(node.depth, node.y);
  });

  depthMap.forEach((y, depth) => {
    const divider = document.createElement("div");
    divider.className = "generation-divider";
    divider.style.top = `${y - 24}px`;
    treeCanvas.appendChild(divider);

    const label = document.createElement("div");
    label.className = "generation-label";
    label.textContent = `${i18n[lang].legendGeneration} ${depth}`;
    label.style.top = `${y + labelOffset}px`;
    label.style.left = "16px";
    treeCanvas.appendChild(label);
  });
}

function nodeVisible(node) {
  if (hiddenGenerations.has(node.depth)) return false;
  if (branchFilterValue !== "all" && String(node.branchId) !== branchFilterValue) return false;
  return true;
}

function getVisibleNodes() {
  const nodes = nodesList.filter((node) => nodeVisible(node));
  if (!virtualizationEnabled) return nodes;

  const padding = 300;
  const viewX = treeWrap.scrollLeft / scale - padding;
  const viewY = treeWrap.scrollTop / scale - padding;
  const viewW = treeWrap.clientWidth / scale + padding * 2;
  const viewH = treeWrap.clientHeight / scale + padding * 2;

  return nodes.filter((node) => {
    const width = node.ownWidth || layoutConfig.cardWidth;
    const height = 120;
    return node.x + width >= viewX && node.x <= viewX + viewW && node.y + height >= viewY && node.y <= viewY + viewH;
  });
}

function renderNode(node) {
  if (node.type === "person") {
    const person = peopleById.get(node.personId);
    const group = document.createElement("div");
    group.className = "node-group";
    group.style.left = `${node.x}px`;
    group.style.top = `${node.y}px`;
    group.dataset.nodeId = node.id;
    group.dataset.depth = node.depth;
    group.style.setProperty("--branch-color", branchPalette[node.branchId]);
    const card = createPersonCard(person, node.depth);
    const isMenantu = (person?.relation || "").toLowerCase().includes("menantu");
    if (!isMenantu && node.depth >= 2 && node.depth <= 4 && softPeachPeople.has(node.personId)) {
      card.classList.add("soft-peach");
      card.style.setProperty("--card-fill", SOFT_PEACH_COLOR);
    }
    if (!isMenantu && node.depth >= 2 && node.depth <= 4 && babyBluePeople.has(node.personId)) {
      card.classList.add("baby-blue");
      card.style.setProperty("--card-fill", BABY_BLUE_COLOR);
    }
    if (!isMenantu && node.depth >= 2 && node.depth <= 4 && mintGreenPeople.has(node.personId)) {
      card.classList.add("mint-green");
      card.style.setProperty("--card-fill", MINT_GREEN_COLOR);
    }
    if (!isMenantu && node.depth >= 2 && node.depth <= 4 && lavenderPeople.has(node.personId)) {
      card.classList.add("lavender");
      card.style.setProperty("--card-fill", LAVENDER_COLOR);
    }
    group.appendChild(card);
    treeCanvas.appendChild(group);
    elementByPersonId.set(person.id, group);
    nodeByPersonId.set(person.id, node);
    elementByNodeId.set(node.id, group);
  }

  if (node.type === "union") {
    const group = document.createElement("div");
    group.className = "node-group";
    group.style.left = `${node.x}px`;
    group.style.top = `${node.y}px`;
    group.dataset.nodeId = node.id;
    group.dataset.depth = node.depth;
    group.style.setProperty("--branch-color", branchPalette[node.branchId]);
    const partner1 = peopleById.get(node.partner1);
    const partner2 = node.partner2 ? peopleById.get(node.partner2) : null;
    if (partner1) {
      const card1 = createPersonCard(partner1, node.depth);
      card1.dataset.partner = "left";
      const isMenantu1 = (partner1?.relation || "").toLowerCase().includes("menantu");
      if (!isMenantu1 && node.depth >= 2 && node.depth <= 4 && softPeachPeople.has(node.partner1)) {
        card1.classList.add("soft-peach");
        card1.style.setProperty("--card-fill", SOFT_PEACH_COLOR);
      }
      if (!isMenantu1 && node.depth >= 2 && node.depth <= 4 && babyBluePeople.has(node.partner1)) {
        card1.classList.add("baby-blue");
        card1.style.setProperty("--card-fill", BABY_BLUE_COLOR);
      }
      if (!isMenantu1 && node.depth >= 2 && node.depth <= 4 && mintGreenPeople.has(node.partner1)) {
        card1.classList.add("mint-green");
        card1.style.setProperty("--card-fill", MINT_GREEN_COLOR);
      }
      if (!isMenantu1 && node.depth >= 2 && node.depth <= 4 && lavenderPeople.has(node.partner1)) {
        card1.classList.add("lavender");
        card1.style.setProperty("--card-fill", LAVENDER_COLOR);
      }
      group.appendChild(card1);
      elementByPersonId.set(partner1.id, group);
      nodeByPersonId.set(partner1.id, node);
    }
    if (partner2) {
      const card2 = createPersonCard(partner2, node.depth);
      card2.dataset.partner = "right";
      const isMenantu2 = (partner2?.relation || "").toLowerCase().includes("menantu");
      if (!isMenantu2 && node.depth >= 2 && node.depth <= 4 && softPeachPeople.has(node.partner2)) {
        card2.classList.add("soft-peach");
        card2.style.setProperty("--card-fill", SOFT_PEACH_COLOR);
      }
      if (!isMenantu2 && node.depth >= 2 && node.depth <= 4 && babyBluePeople.has(node.partner2)) {
        card2.classList.add("baby-blue");
        card2.style.setProperty("--card-fill", BABY_BLUE_COLOR);
      }
      if (!isMenantu2 && node.depth >= 2 && node.depth <= 4 && mintGreenPeople.has(node.partner2)) {
        card2.classList.add("mint-green");
        card2.style.setProperty("--card-fill", MINT_GREEN_COLOR);
      }
      if (!isMenantu2 && node.depth >= 2 && node.depth <= 4 && lavenderPeople.has(node.partner2)) {
        card2.classList.add("lavender");
        card2.style.setProperty("--card-fill", LAVENDER_COLOR);
      }
      group.appendChild(card2);
      elementByPersonId.set(partner2.id, group);
      nodeByPersonId.set(partner2.id, node);
    }
    treeCanvas.appendChild(group);
    elementByNodeId.set(node.id, group);
  }
}

function createPersonCard(person, depth) {
  const displayName = formatDisplayName(person.name);
  const card = document.createElement("div");
  card.className = "person-card";
  card.dataset.personId = person.id;
  card.dataset.depth = depth;
  card.style.setProperty("--enter-delay", `${Math.min(420, depth * 55)}ms`);
  card.tabIndex = 0;
  if ((person.relation || "").toLowerCase().includes("menantu")) {
    card.classList.add("is-menantu");
  }

  if (person.death) card.classList.add("deceased");

  const header = document.createElement("div");
  header.className = "person-header";

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.style.setProperty("--gen-ring", generationColor(depth));
  if (person.photo) {
    const img = document.createElement("img");
    img.src = person.photo;
    img.alt = displayName || person.name || "";
    avatar.appendChild(img);
  } else {
    avatar.textContent = initials(displayName || person.name || "");
  }

  const nameWrap = document.createElement("div");
  const name = document.createElement("div");
  name.className = "person-name";
  const split = splitNameByBin(displayName || person.name || "");
  const firstName = formatDisplayName(person.firstName || split.first || person.name || "");
  name.textContent = firstName || displayName || person.name || "";
  const meta = document.createElement("div");
  meta.className = "person-meta";
  const birthLine = document.createElement("div");
  birthLine.className = "person-birth";
  if (person.birth) {
    const birthDate = parseDateValue(person.birth);
    const age = !person.death ? calcAge(birthDate) : null;
    birthLine.textContent = `${i18n[lang].bornPrefix}${formatDateDisplay(person.birth)}`;
    if (age !== null) {
      const ageLine = document.createElement("div");
      ageLine.className = "person-age";
      ageLine.textContent = `${i18n[lang].ageLabel}: ${age}`;
      meta.appendChild(ageLine);
    }
  } else {
    birthLine.textContent = "";
  }
  const deathLine = document.createElement("div");
  deathLine.textContent = person.death ? `${i18n[lang].diedPrefix}${formatDateDisplay(person.death)}` : "";
  if (birthLine.textContent) meta.appendChild(birthLine);
  if (deathLine.textContent) meta.appendChild(deathLine);
  nameWrap.appendChild(name);
  nameWrap.appendChild(meta);

  header.appendChild(avatar);
  header.appendChild(nameWrap);

  const tags = document.createElement("div");
  tags.className = "person-tags";
  const relationText = localizeTagText(person.relation || "", lang);
  const noteText = localizeTagText(person.note || "", lang);
  const tagsQueue = [];
  if (noteText) tagsQueue.push(noteText);
  if (relationText && relationText !== noteText) tagsQueue.push(relationText);
  tagsQueue.forEach((text) => {
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = text;
    tags.appendChild(tag);
  });
  if (isPartnered(person.id)) {
    const gender = detectGenderFromName(person.name);
    const spouseLabel = gender === "male" ? i18n[lang].spouseHusband : gender === "female" ? i18n[lang].spouseWife : "";
    const existingText = tagsQueue.join(" ").toLowerCase();
    const spouseLower = spouseLabel.toLowerCase();
    const hasSpouseAlready = existingText.includes(spouseLower) || existingText.includes("suami") || existingText.includes("isteri") || existingText.includes("husband") || existingText.includes("wife");
    if (spouseLabel && !hasSpouseAlready) {
      const spouseTag = document.createElement("span");
      spouseTag.className = "tag";
      spouseTag.textContent = spouseLabel;
      tags.appendChild(spouseTag);
    }
  }
  // No Bin/Binti tag on card

  card.appendChild(header);
  card.appendChild(tags);

  card.addEventListener("click", (e) => {
    e.stopPropagation();
    openModal(person);
    updateStoryPanel(person);
    selectedPersonId = person.id;
    applySelectionHighlight(person.id);
    updateUrlState();
  });

  return card;
}

function drawLines(root, visibleNodes) {
  if (!showLines) {
    treeLines.innerHTML = "";
    return;
  }
  const visibleSet = new Set(visibleNodes.map((node) => node.id));
  treeLines.innerHTML = "";
  if (!treeCanvas) return;
  const canvasBox = treeCanvas.getBoundingClientRect();

  function drawNodeEdges(node) {
    if (node.type === "union") {
      if (!visibleSet.has(node.id)) return;
      const parentEl = elementByNodeId.get(node.id);
      if (!parentEl) return;
      const parentCenterX = parentEl.offsetLeft + parentEl.offsetWidth / 2;
      const parentBottomY = parentEl.offsetTop + parentEl.offsetHeight;
      const childPoints = [];
      node.children.forEach((child) => {
        if (!nodeVisible(child)) return;
        if (!visibleSet.has(child.id)) return;
        const childEl = elementByNodeId.get(child.id);
        if (!childEl) return;
        childPoints.push({
          x: childEl.offsetLeft + childEl.offsetWidth / 2,
          y: childEl.offsetTop
        });
      });

      if (childPoints.length > 0) {
        const midY = (parentBottomY + Math.min(...childPoints.map((p) => p.y))) / 2;
        const minX = Math.min(...childPoints.map((p) => p.x));
        const maxX = Math.max(...childPoints.map((p) => p.x));
        const stroke = `${branchPalette[node.branchId] || "#7a8a80"}CC`;
        const barPad = 14;
        const barInset = 6;

        const trunk = document.createElementNS("http://www.w3.org/2000/svg", "path");
        trunk.setAttribute("d", `M ${parentCenterX} ${parentBottomY} V ${midY}`);
        trunk.setAttribute("fill", "none");
        trunk.setAttribute("stroke", stroke);
        trunk.setAttribute("stroke-width", "2.5");
        trunk.setAttribute("stroke-linecap", "round");
        treeLines.appendChild(trunk);

        const bar = document.createElementNS("http://www.w3.org/2000/svg", "line");
        if (minX === maxX) {
          bar.setAttribute("x1", minX - barPad);
          bar.setAttribute("x2", maxX + barPad);
        } else {
          const x1 = minX + barInset;
          const x2 = maxX - barInset;
          if (x2 - x1 < barPad * 2) {
            bar.setAttribute("x1", minX - barPad);
            bar.setAttribute("x2", maxX + barPad);
          } else {
            bar.setAttribute("x1", x1);
            bar.setAttribute("x2", x2);
          }
        }
        bar.setAttribute("y1", midY);
        bar.setAttribute("y2", midY);
        bar.setAttribute("stroke", stroke);
        bar.setAttribute("stroke-width", "2.5");
        bar.setAttribute("stroke-linecap", "round");
        treeLines.appendChild(bar);

        if (childPoints.length > 1) {
          const sorted = [...childPoints].sort((a, b) => a.x - b.x);
          for (let i = 0; i < sorted.length - 1; i += 1) {
            const midX = (sorted[i].x + sorted[i + 1].x) / 2;
            const divider = document.createElementNS("http://www.w3.org/2000/svg", "line");
            divider.setAttribute("x1", midX);
            divider.setAttribute("y1", midY - 6);
            divider.setAttribute("x2", midX);
            divider.setAttribute("y2", midY + 6);
            divider.setAttribute("stroke", stroke);
            divider.setAttribute("stroke-width", "2");
            divider.setAttribute("stroke-linecap", "round");
            treeLines.appendChild(divider);
          }
        }

        childPoints.forEach((point) => {
          const stem = document.createElementNS("http://www.w3.org/2000/svg", "path");
          stem.setAttribute("d", `M ${point.x} ${midY} V ${point.y}`);
          stem.setAttribute("fill", "none");
          stem.setAttribute("stroke", stroke);
          stem.setAttribute("stroke-width", "2.5");
          stem.setAttribute("stroke-linecap", "round");
          treeLines.appendChild(stem);
        });
      }

      const partnerCards = parentEl.querySelectorAll(".person-card");
      if (partnerCards.length === 2) {
        const leftBox = partnerCards[0].getBoundingClientRect();
        const rightBox = partnerCards[1].getBoundingClientRect();
        const y = leftBox.top - canvasBox.top + leftBox.height / 2;
        const x1 = leftBox.right - canvasBox.left;
        const x2 = rightBox.left - canvasBox.left;
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", x1 + 8);
        line.setAttribute("y1", y);
        line.setAttribute("x2", x2 - 8);
        line.setAttribute("y2", y);
        line.setAttribute("stroke", `${branchPalette[node.branchId] || "#7a8a80"}CC`);
        line.setAttribute("stroke-width", "2.5");
        line.setAttribute("stroke-linecap", "round");
        treeLines.appendChild(line);
      }
    }

    node.children.forEach(drawNodeEdges);
  }

  drawNodeEdges(root);
}

function renderTimeline() {
  if (!timelineSection) return;
  timelineList.innerHTML = "";
  const depthMap = getPersonDepthMap();
  const parentKeyByChild = new Map();
  treeData.unions.forEach((union) => {
    const parents = [union.partner1, union.partner2].filter(Boolean).sort().join("|") || "unknown";
    union.children.forEach((childId) => {
      if (!parentKeyByChild.has(childId)) parentKeyByChild.set(childId, parents);
    });
  });
    const entries = treeData.people.map((person) => {
      const birth = parseYear(person.birth);
      const birthDate = parseDateValue(person.birth);
      const birthMonth = birthDate ? birthDate.getMonth() + 1 : null;
      const birthDay = birthDate ? birthDate.getDate() : null;
      const birthTime = birthDate ? birthDate.getTime() : null;
      const order = birthTime ?? Number.POSITIVE_INFINITY;
      const gender = detectGenderFromName(person.name) || "unknown";
      const nameSort = formatDisplayName(person.name).toLowerCase();
      const parentKey = parentKeyByChild.get(person.id) || "zzzz";
      return { person, birth, birthMonth, birthDay, birthTime, order, gender, nameSort, parentKey };
    });

  const filtered = entries.filter(({ person, birth, birthMonth, gender }) => {
    if (timelineFilters.generation !== "all") {
      const depth = depthMap.get(person.id);
      if (!depth || String(depth) !== String(timelineFilters.generation)) return false;
    }
    if (timelineFilters.month !== "all") {
      if (!birthMonth || String(birthMonth) !== String(timelineFilters.month)) return false;
    }
    if (timelineFilters.gender !== "all" && gender !== timelineFilters.gender) return false;
    return true;
  });

  const genderOrder = { male: 1, female: 2, unknown: 3 };
  const sortMode = timelineFilters.sort || "year";
    filtered.sort((a, b) => {
      if (sortMode === "year") {
        const ay = a.birth ?? 9999;
        const by = b.birth ?? 9999;
        if (ay !== by) return ay - by;
        const am = a.birthMonth ?? 99;
        const bm = b.birthMonth ?? 99;
        if (am !== bm) return am - bm;
        const ad = a.birthDay ?? 99;
        const bd = b.birthDay ?? 99;
        if (ad !== bd) return ad - bd;
        return a.nameSort.localeCompare(b.nameSort);
      }
      if (sortMode === "age") {
        const at = a.birthTime ?? Number.POSITIVE_INFINITY;
        const bt = b.birthTime ?? Number.POSITIVE_INFINITY;
        if (at !== bt) return at - bt;
      return a.nameSort.localeCompare(b.nameSort);
    }
    if (sortMode === "alpha") {
      return a.nameSort.localeCompare(b.nameSort);
    }
    if (sortMode === "month") {
      const am = a.birthMonth ?? 99;
      const bm = b.birthMonth ?? 99;
      if (am !== bm) return am - bm;
      const ad = a.birthDay ?? 99;
      const bd = b.birthDay ?? 99;
      if (ad !== bd) return ad - bd;
      return a.nameSort.localeCompare(b.nameSort);
    }
    if (sortMode === "gender") {
      const ag = genderOrder[a.gender] ?? 9;
      const bg = genderOrder[b.gender] ?? 9;
      if (ag !== bg) return ag - bg;
      return a.nameSort.localeCompare(b.nameSort);
    }
    if (sortMode === "parent") {
      if (a.parentKey !== b.parentKey) return a.parentKey.localeCompare(b.parentKey);
      if (a.order !== b.order) return a.order - b.order;
      return a.nameSort.localeCompare(b.nameSort);
    }
    return a.order - b.order;
  });

  const t = i18n[lang] || i18n.ms;
  filtered.forEach(({ person }) => {
    const item = document.createElement("div");
    item.className = "timeline-item";
    if (person.death) item.classList.add("deceased");
    const node = nodeByPersonId.get(person.id);
    if (node && Number.isFinite(node.branchId)) {
      item.classList.add("timeline-branch");
      item.style.setProperty("--branch-color", branchPalette[node.branchId] || "var(--primary)");
    } else {
      if (softPeachPeople.has(person.id)) item.classList.add("branch-soft-peach");
      if (babyBluePeople.has(person.id)) item.classList.add("branch-baby-blue");
      if (mintGreenPeople.has(person.id)) item.classList.add("branch-mint-green");
      if (lavenderPeople.has(person.id)) item.classList.add("branch-lavender");
    }
    const birthDate = parseDateValue(person.birth);
    const age = !person.death ? calcAge(birthDate) : null;
    const hasBirth = Boolean(person.birth);
    const hasDeath = Boolean(person.death);
    const metaLine = hasBirth && hasDeath
      ? `${formatDateDisplay(person.birth)} - ${formatDateDisplay(person.death)}`
      : hasBirth
        ? `${t.bornPrefix}${formatDateDisplay(person.birth)}`
        : t.datesUnknown;
    const ageLine = age !== null ? `${t.ageLabel}: ${age}` : "";
    item.innerHTML = `
      <div class="timeline-name">${formatDisplayName(person.name)}</div>
      <div class="timeline-meta">${metaLine}</div>
      ${ageLine ? `<div class="timeline-age">${ageLine}</div>` : ""}
      <div class="timeline-relation">${person.relation || ""}</div>
    `;
    item.addEventListener("click", () => {
      if (isMobileView()) {
        openTimelineInlineDetail(person, item);
        selectedPersonId = person.id;
        updateUrlState();
        return;
      }
      openModal(person);
      updateStoryPanel(person);
      selectedPersonId = person.id;
      applySelectionHighlight(person.id);
      updateUrlState();
    });
    timelineList.appendChild(item);
  });
  updateTimelineActiveFilters();
}

function parseYear(value) {
  if (!value) return null;
  const match = String(value).match(/(\d{4})/);
  return match ? Number(match[1]) : null;
}

function parseDateValue(value) {
  if (!value) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  const str = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    const [y, m, d] = str.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  const dmMatch = str.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
  if (dmMatch) {
    const d = Number(dmMatch[1]);
    const m = Number(dmMatch[2]);
    const y = Number(dmMatch[3]);
    return new Date(y, m - 1, d);
  }
  if (/^\d{4}$/.test(str)) {
    return new Date(Number(str), 0, 1);
  }
  const dt = new Date(str);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

function formatDateDisplay(value) {
  if (!value) return "";
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const d = String(value.getDate()).padStart(2, "0");
    const m = String(value.getMonth() + 1).padStart(2, "0");
    const y = value.getFullYear();
    return `${d}/${m}/${y}`;
  }
  const str = String(value).trim();
  if (!str) return "";
  if (/^\d{4}$/.test(str)) return str;
  const parsed = parseDateValue(str);
  if (parsed) {
    const d = String(parsed.getDate()).padStart(2, "0");
    const m = String(parsed.getMonth() + 1).padStart(2, "0");
    const y = parsed.getFullYear();
    return `${d}/${m}/${y}`;
  }
  return str;
}

function splitNameByBin(fullName) {
  const name = String(fullName || "").trim();
  if (!name) return { first: "", last: "" };
  const parts = name.split(/\s+/);
  const idx = parts.findIndex((p) => /^(bin|binti|bt)$/i.test(p));
  if (idx > 0 && idx < parts.length - 1) {
    return {
      first: parts.slice(0, idx).join(" "),
      last: parts.slice(idx + 1).join(" ")
    };
  }
  return {
    first: parts[0],
    last: parts.slice(1).join(" ")
  };
}

function detectGenderFromName(fullName) {
  const name = String(fullName || "").toLowerCase();
  if (name.includes(" binti ") || name.includes(" bt ")) return "female";
  if (name.includes(" bin ")) return "male";
  return "";
}

function isPartnered(personId) {
  if (!treeData?.unions) return false;
  return treeData.unions.some((u) => u.partner1 === personId || u.partner2 === personId);
}

function localizeTagText(text, langCode) {
  const raw = String(text || "").trim();
  if (!raw) return "";
  if (langCode !== "en") return raw;
  const map = {
    "anak sulung": "First child",
    "anak pertama": "First child",
    "anak kedua": "Second child",
    "anak ketiga": "Third child",
    "anak keempat": "Fourth child",
    "anak kelima": "Fifth child",
    "anak keenam": "Sixth child",
    "anak ketujuh": "Seventh child",
    "anak kelapan": "Eighth child",
    "anak kesembilan": "Ninth child",
    "anak kesepuluh": "Tenth child",
    "cucu": "Grandchild",
    "cicit": "Great-grandchild",
    "menantu": "In-law",
    "tok": "Grandmother",
    "wan": "Grandfather",
    "isteri": "Wife",
    "suami": "Husband"
  };
  const lower = raw.toLowerCase();
  if (map[lower]) return map[lower];
  const match = lower.match(/^anak ke-(\d+)$/);
  if (match) return `Child #${match[1]}`;
  return raw;
}

function calcAge(birthDate, refDate = new Date()) {
  if (!birthDate) return null;
  let age = refDate.getFullYear() - birthDate.getFullYear();
  const m = refDate.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && refDate.getDate() < birthDate.getDate())) {
    age -= 1;
  }
  return age >= 0 ? age : null;
}

function generationColor(depth) {
  const index = (depth - 1) % branchPalette.length;
  return branchPalette[index];
}

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatDisplayName(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const isAllUpper = raw === raw.toUpperCase();
  if (!isAllUpper) return raw;
  return raw
    .toLowerCase()
    .split(/\s+/)
    .map((part) => {
      if (!part) return "";
      if (part === "bin" || part === "binti" || part === "bt") return part;
      return part
        .split("-")
        .map((chunk) => (chunk ? chunk[0].toUpperCase() + chunk.slice(1) : ""))
        .join("-");
    })
    .join(" ");
}

function formatDates(birth, death) {
  const t = i18n[lang] || i18n.ms;
  if (!birth && !death) return t.datesUnknown;
  if (birth && death) return `${formatDateDisplay(birth)} - ${formatDateDisplay(death)}`;
  if (birth) {
    const birthDate = parseDateValue(birth);
    const age = !death ? calcAge(birthDate) : null;
    const ageText = age !== null ? ` (${t.ageLabel}: ${age})` : "";
    return `${t.bornPrefix}${formatDateDisplay(birth)}${ageText}`;
  }
  return `${t.diedPrefix}${formatDateDisplay(death)}`;
}

function setStoryPanelOpen(isOpen) {
  if (!app) return;
  app.classList.toggle("story-open", isOpen);
}

function closeStoryPanel() {
  selectedPersonId = "";
  clearSelectionHighlight();
  if (panelEditForm) panelEditForm.hidden = true;
  if (storyPanel) storyPanel.hidden = true;
  setStoryPanelOpen(false);
}

function openModal(person) {
  const t = i18n[lang] || i18n.ms;
  if (!storyContent) return;
  if (storyPanel) storyPanel.hidden = false;
  setStoryPanelOpen(true);
  const birthDate = parseDateValue(person.birth);
  const age = !person.death ? calcAge(birthDate) : null;
  const ageText = age !== null ? ` (${t.ageLabel}: ${age})` : "";
  storyTitle.textContent = formatDisplayName(person.name);
  storyContent.innerHTML = `
    <div class="story-detail"><strong>${t.modalRelation}</strong><span>${person.relation || "-"}</span></div>
    <div class="story-detail"><strong>${t.modalBirth}</strong><span>${formatDateDisplay(person.birth) || "-"}${ageText}</span></div>
    <div class="story-detail"><strong>${t.modalDeath}</strong><span>${formatDateDisplay(person.death) || "-"}</span></div>
    <div class="story-detail"><strong>${t.modalNote}</strong><span>${person.note || "-"}</span></div>
    <div class="story-detail"><strong>${t.modalStory}</strong><span>${person.story || "-"}</span></div>
  `;

  if (panelEditForm) panelEditForm.hidden = true;
  if (panelEditBtn) panelEditBtn.hidden = false;

  if (panelEditName) panelEditName.value = person.name || "";
  if (panelEditFirst && panelEditLast) {
    const split = splitNameByBin(person.name || "");
    panelEditFirst.value = split.first || "";
    panelEditLast.value = split.last || "";
  }
  if (panelEditRelation) panelEditRelation.value = person.relation || "";
  if (panelEditBirth) panelEditBirth.value = person.birth || "";
  if (panelEditDeath) panelEditDeath.value = person.death || "";
  if (panelEditPhoto) panelEditPhoto.value = person.photo || "";
  if (panelEditNote) panelEditNote.value = person.note || "";
  if (panelEditStory) panelEditStory.value = person.story || "";
  const inferredGender = detectGenderFromName(person.name);
  panelGenderInputs.forEach((input) => {
    input.checked = inferredGender === input.value;
  });

  if (panelEditName) {
    panelEditName.oninput = () => {
      const split = splitNameByBin(panelEditName.value || "");
      if (panelEditFirst) panelEditFirst.value = split.first || "";
      if (panelEditLast) panelEditLast.value = split.last || "";
      const gender = detectGenderFromName(panelEditName.value);
      panelGenderInputs.forEach((input) => {
        input.checked = gender === input.value;
      });
    };
  }

  if (panelEditPhotoFile) {
    panelEditPhotoFile.onchange = async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      try {
        const dataUrl = await fileToDataUrl(file);
        panelEditPhoto.value = dataUrl;
      } finally {
        panelEditPhotoFile.value = "";
      }
    };
  }

  if (panelEditBtn) {
    panelEditBtn.onclick = () => {
      const pw = window.prompt("Masukkan kata laluan:");
      if (pw !== "1234") return;
      if (panelEditForm) panelEditForm.hidden = false;
    };
  }

  if (panelCloseBtn) {
    panelCloseBtn.onclick = closeStoryPanel;
    panelCloseBtn.addEventListener("touchstart", closeStoryPanel, { passive: true });
  }

  if (panelCancelBtn) {
    panelCancelBtn.onclick = () => {
      if (panelEditForm) panelEditForm.hidden = true;
    };
  }


  if (panelEditForm) {
    panelEditForm.onsubmit = (event) => {
      event.preventDefault();
      const fullName = panelEditName.value.trim();
      const split = splitNameByBin(fullName);
      person.firstName = split.first || "";
      person.lastName = split.last || "";
      person.name = fullName;
      person.relation = panelEditRelation.value.trim();
      person.birth = panelEditBirth.value.trim();
      person.death = panelEditDeath.value.trim();
      person.photo = panelEditPhoto.value.trim();
      person.note = panelEditNote.value.trim();
      person.story = panelEditStory.value.trim();
      person.gender = detectGenderFromName(person.name);
      storeData();
      rebuildFromData();
      if (panelEditForm) panelEditForm.hidden = true;
      openModal(person);
    };
  }
}

function updateStoryPanel(person) {
  if (storyTitle) storyTitle.textContent = formatDisplayName(person.name);
  if (storyBody) storyBody.textContent = person.story || person.note || i18n[lang].storyEmpty;
}

function openTimelineInlineDetail(person, itemEl) {
  if (!timelineList || !itemEl) return;
  const existing = timelineList.querySelector(".timeline-detail");
  if (existing) existing.remove();
  const t = i18n[lang] || i18n.ms;
  const birthDate = parseDateValue(person.birth);
  const age = !person.death ? calcAge(birthDate) : null;
  const ageText = age !== null ? `${t.ageLabel}: ${age}` : "";
  const detail = document.createElement("div");
  detail.className = "timeline-detail";
  detail.innerHTML = `
    <div class="timeline-detail-head">
      <div class="timeline-detail-title">${formatDisplayName(person.name)}</div>
      <button type="button" class="timeline-detail-close" aria-label="${t.modalClose}">×</button>
    </div>
    <div class="timeline-detail-grid">
      <div class="timeline-detail-row"><strong>${t.modalRelation}</strong><span>${person.relation || "-"}</span></div>
      <div class="timeline-detail-row">
        <strong>${t.modalBirth}</strong>
        <span>
          <div>${formatDateDisplay(person.birth) || "-"}</div>
          ${ageText ? `<div class="timeline-detail-age">${ageText}</div>` : ""}
        </span>
      </div>
      <div class="timeline-detail-row"><strong>${t.modalDeath}</strong><span>${formatDateDisplay(person.death) || "-"}</span></div>
      <div class="timeline-detail-row"><strong>${t.modalNote}</strong><span>${person.note || "-"}</span></div>
      <div class="timeline-detail-row"><strong>${t.modalStory}</strong><span>${person.story || "-"}</span></div>
    </div>
  `;
  const closeBtn = detail.querySelector(".timeline-detail-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      detail.remove();
    });
  }
  itemEl.insertAdjacentElement("afterend", detail);
  detail.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

on(modal, "click", (event) => {
  if (!event.target.dataset.close) return;
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
});

on(panelCloseBtn, "click", closeStoryPanel);
on(panelCloseBtn, "touchstart", closeStoryPanel, { passive: true });

function applyZoom() {
  if (!treeCanvas || !treeLines || !treeZoom) return;
  if (!Number.isFinite(scale) || scale <= 0) {
    scale = 1;
  }
  treeCanvas.style.transform = `scale(${scale})`;
  treeLines.style.transform = `scale(${scale})`;
  treeZoom.style.width = `${baseSize.width * scale}px`;
  treeZoom.style.height = `${baseSize.height * scale}px`;
  updateMinimap();
}

const actionEntries = [
  ["zoom-in", zoomInBtn],
  ["zoom-out", zoomOutBtn],
  ["zoom-reset", zoomResetBtn],
  ["reset-view", resetViewBtn],
  ["zoom-fit", zoomFitBtn],
  ["toggle-theme", toggleThemeBtn],
  ["lang-toggle", langToggleBtn],
  ["view-toggle", viewToggle],
  ["export-png", exportPngBtn],
  ["export-pdf", exportPdfBtn]
];
const actionMap = new Map(actionEntries.filter(([, el]) => el));

function runAction(actionId) {
  const btn = actionMap.get(actionId);
  if (btn) btn.click();
}

document.querySelectorAll(".mobile-actions [data-action]").forEach((btn) => {
  btn.addEventListener("click", () => {
    runAction(btn.dataset.action);
  });
});

if (mobileActionSelect) {
  mobileActionSelect.addEventListener("change", () => {
    if (mobileActionGo) {
      mobileActionGo.disabled = !mobileActionSelect.value;
    }
  });
}

if (mobileActionGo) {
  mobileActionGo.addEventListener("click", () => {
    const actionId = mobileActionSelect?.value;
    if (!actionId) return;
    runAction(actionId);
    if (mobileActionSelect) mobileActionSelect.value = "";
    mobileActionGo.disabled = true;
  });
}

if (zoomInBtn) {
  zoomInBtn.addEventListener("click", () => {
    scale = Math.min(2.2, scale + 0.1);
    applyZoom();
    savePrefs();
    scheduleRender();
  });
}

if (zoomOutBtn) {
  zoomOutBtn.addEventListener("click", () => {
    scale = Math.max(0.6, scale - 0.1);
    applyZoom();
    savePrefs();
    scheduleRender();
  });
}

if (zoomResetBtn) {
  zoomResetBtn.addEventListener("click", () => {
    scale = 1;
    applyZoom();
    savePrefs();
    scheduleRender();
  });
}

if (zoomFitBtn) {
  zoomFitBtn.addEventListener("click", () => {
    fitToScreen();
    savePrefs();
  });
}

if (focusEldersBtn) {
  focusEldersBtn.addEventListener("click", () => {
    const elder = findElderPerson();
    if (elder) focusPerson(elder.id, true);
  });
}

if (backTopBtn) {
  backTopBtn.addEventListener("click", () => {
    treeWrap.scrollTo({ left: 0, top: 0, behavior: "smooth" });
  });
}

if (pathToggleBtn) {
  pathToggleBtn.addEventListener("click", () => {
    pathMode = !pathMode;
    applyLineageHighlight();
    savePrefs();
  });
}

if (compactToggleBtn) {
  compactToggleBtn.addEventListener("click", () => {
    compactMode = !compactMode;
    document.body.classList.toggle("compact", compactMode);
    applyLanguage();
    savePrefs();
  });
}

if (langToggleBtn) {
  langToggleBtn.addEventListener("change", () => {
    lang = langToggleBtn.checked ? "en" : "ms";
    applyLanguage();
    scheduleRender();
    savePrefs();
  });
}

if (themePresetSelect) {
  themePresetSelect.addEventListener("change", () => {
    themePreset = themePresetSelect.value || "default";
    applyThemePreset();
    savePrefs();
  });
}

if (controlsToggleBtn) {
  controlsToggleBtn.addEventListener("click", () => {
    toggleControlsCollapsed();
  });
}

if (mobilePanelBtn) {
  mobilePanelBtn.addEventListener("click", () => {
    toggleControlsCollapsed();
  });
}

if (bottomSheetHandle) {
  bottomSheetHandle.addEventListener("click", () => {
    toggleControlsCollapsed();
  });
}

const sheetControls = document.querySelector("#bottom-sheet .controls");
const sheetDragState = {
  active: false,
  startY: 0,
  startX: 0,
  deltaY: 0,
  deltaX: 0
};

const setSheetOffset = (offset) => {
  if (!bottomSheet) return;
  bottomSheet.style.transform = `translateY(${offset}px)`;
};

const resetSheetOffset = () => {
  if (!bottomSheet) return;
  bottomSheet.style.transform = "";
  bottomSheet.classList.remove("is-dragging");
  sheetDragState.active = false;
  sheetDragState.deltaY = 0;
  sheetDragState.deltaX = 0;
};

if (bottomSheet) {
  bottomSheet.addEventListener("touchstart", (event) => {
    if (!isMobileView()) return;
    if (event.target.closest("#mobile-panel-btn")) return;
    if (event.target.closest("#sheet-handle")) return;
    const targetInControls = sheetControls && sheetControls.contains(event.target);
    if (targetInControls && sheetControls.scrollTop > 0 && !controlsCollapsed) return;
    const touch = event.touches[0];
    sheetDragState.active = true;
    sheetDragState.startY = touch.clientY;
    sheetDragState.startX = touch.clientX;
    sheetDragState.deltaY = 0;
    sheetDragState.deltaX = 0;
    bottomSheet.classList.add("is-dragging");
  }, { passive: true });

  bottomSheet.addEventListener("touchmove", (event) => {
    if (!sheetDragState.active || !isMobileView()) return;
    const touch = event.touches[0];
    const dy = touch.clientY - sheetDragState.startY;
    const dx = touch.clientX - sheetDragState.startX;
    sheetDragState.deltaY = dy;
    sheetDragState.deltaX = dx;
    if (Math.abs(dx) > Math.abs(dy)) return;
    if (controlsCollapsed) {
      const offset = Math.min(0, dy);
      setSheetOffset(offset);
    } else {
      const offset = Math.max(0, dy);
      setSheetOffset(offset);
    }
    event.preventDefault();
  }, { passive: false });

  bottomSheet.addEventListener("touchend", () => {
    if (!sheetDragState.active) return;
    const dy = sheetDragState.deltaY;
    if (!controlsCollapsed && dy > 60) {
      toggleControlsCollapsed(true);
    } else if (controlsCollapsed && dy < -40) {
      toggleControlsCollapsed(false);
    }
    resetSheetOffset();
  });

  bottomSheet.addEventListener("touchcancel", resetSheetOffset);
}

if (mobileSettingsBtn) {
  mobileSettingsBtn.addEventListener("click", () => openSettingsModal());
  mobileSettingsBtn.addEventListener("touchstart", () => openSettingsModal(), { passive: true });
}

if (mobileSearchBtn) {
  mobileSearchBtn.addEventListener("click", () => {
    if (controlsCollapsed) {
      toggleControlsCollapsed(false);
    }
    if (searchInput) {
      setTimeout(() => {
        searchInput.focus();
      }, 50);
    }
  });
  mobileSearchBtn.addEventListener("touchstart", () => {
    if (controlsCollapsed) {
      toggleControlsCollapsed(false);
    }
  }, { passive: true });
}

if (resetViewBtn) {
  resetViewBtn.addEventListener("click", () => {
    scale = 1;
    applyZoom();
    treeWrap.scrollTo({ left: 0, top: 0, behavior: "smooth" });
    savePrefs();
  });
}

if (clearCacheBtn) {
  clearCacheBtn.addEventListener("click", () => {
    clearSiteCache();
  });
}

if (exportJsonBtn) {
  exportJsonBtn.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(treeData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);
    link.download = `salasilah-backup-${stamp}.json`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  });
}

if (importJsonBtn && importJsonFile) {
  importJsonBtn.addEventListener("click", () => {
    importJsonFile.click();
  });

  importJsonFile.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const errors = validateTreeData(parsed);
      if (errors.length > 0) {
        validateOutput.textContent = `${i18n[lang].validateErr} ${errors.join(" | ")}`;
        return;
      }
      treeData = parsed;
      storeData();
      rebuildFromData();
      validateOutput.textContent = i18n[lang].validateOk;
    } catch (err) {
      validateOutput.textContent = i18n[lang].importFail;
    } finally {
      importJsonFile.value = "";
    }
  });
}

if (validateDataBtn) {
  validateDataBtn.addEventListener("click", () => {
    const errors = validateTreeData(treeData);
    if (errors.length === 0) {
      validateOutput.textContent = i18n[lang].validateOk;
    } else {
      validateOutput.textContent = `${i18n[lang].validateErr} ${errors.join(" | ")}`;
    }
  });
}

let isPanning = false;
let panStart = { x: 0, y: 0, scrollLeft: 0, scrollTop: 0 };
let mousePanning = false;
let pinchZooming = false;
let pinchStartDistance = 0;
let pinchStartScale = 1;

const stopPointerPan = (event) => {
  if (!treeWrap) return;
  if (event && treeWrap.hasPointerCapture(event.pointerId)) {
    treeWrap.releasePointerCapture(event.pointerId);
  }
  isPanning = false;
  treeWrap.classList.remove("is-dragging");
  if (virtualizationEnabled) scheduleRender();
};

if (treeWrap) {
  treeWrap.addEventListener("touchstart", (event) => {
    if (!isMobileView()) return;
    if (event.touches.length !== 2) return;
    const [t1, t2] = event.touches;
    const dx = t2.clientX - t1.clientX;
    const dy = t2.clientY - t1.clientY;
    pinchZooming = true;
    treeWrap.classList.add("pinch-zooming");
    pinchStartDistance = Math.hypot(dx, dy) || 1;
    pinchStartScale = scale;
    isPanning = false;
    treeWrap.classList.remove("is-dragging");
  }, { passive: true });

  treeWrap.addEventListener("touchmove", (event) => {
    if (!pinchZooming) return;
    if (event.touches.length !== 2) return;
    const [t1, t2] = event.touches;
    const dx = t2.clientX - t1.clientX;
    const dy = t2.clientY - t1.clientY;
    const distance = Math.hypot(dx, dy) || 1;
    const ratio = distance / pinchStartDistance;
    const next = Math.max(0.6, Math.min(2.2, pinchStartScale * ratio));
    if (next !== scale) {
      scale = next;
      applyZoom();
      scheduleRender();
    }
    event.preventDefault();
  }, { passive: false });

  treeWrap.addEventListener("touchend", (event) => {
    if (!pinchZooming) return;
    if (event.touches.length < 2) {
      pinchZooming = false;
      treeWrap.classList.remove("pinch-zooming");
      savePrefs();
    }
  });

  treeWrap.addEventListener("touchcancel", () => {
    if (!pinchZooming) return;
    pinchZooming = false;
    treeWrap.classList.remove("pinch-zooming");
  });

  treeWrap.addEventListener("gesturestart", (event) => {
    if (!isMobileView()) return;
    pinchZooming = true;
    treeWrap.classList.add("pinch-zooming");
    pinchStartScale = scale;
    event.preventDefault();
  });

  treeWrap.addEventListener("gesturechange", (event) => {
    if (!pinchZooming) return;
    const next = Math.max(0.6, Math.min(2.2, pinchStartScale * event.scale));
    if (next !== scale) {
      scale = next;
      applyZoom();
      scheduleRender();
    }
    event.preventDefault();
  });

  treeWrap.addEventListener("gestureend", () => {
    if (!pinchZooming) return;
    pinchZooming = false;
    treeWrap.classList.remove("pinch-zooming");
    savePrefs();
  });

  treeWrap.addEventListener("pointerdown", (event) => {
    if (!dragToPan) return;
    if (event.target.closest(".person-card")) return;
    isPanning = true;
    treeWrap.setPointerCapture(event.pointerId);
    treeWrap.classList.add("is-dragging");
    panStart = {
      x: event.clientX,
      y: event.clientY,
      scrollLeft: treeWrap.scrollLeft,
      scrollTop: treeWrap.scrollTop
    };
    event.preventDefault();
  });

  treeWrap.addEventListener("pointermove", (event) => {
    if (!dragToPan) return;
    if (!isPanning) return;
    if (!treeWrap.hasPointerCapture(event.pointerId)) return;
    const dx = event.clientX - panStart.x;
    const dy = event.clientY - panStart.y;
    treeWrap.scrollLeft = panStart.scrollLeft - dx;
    treeWrap.scrollTop = panStart.scrollTop - dy;
    event.preventDefault();
  });

  treeWrap.addEventListener("pointerup", stopPointerPan);
  treeWrap.addEventListener("pointercancel", stopPointerPan);

  treeWrap.addEventListener("mousedown", (event) => {
    if (!dragToPan) return;
    if (event.button !== 0) return;
    if (event.target.closest(".person-card")) return;
    mousePanning = true;
    treeWrap.classList.add("is-dragging");
    panStart = {
      x: event.clientX,
      y: event.clientY,
      scrollLeft: treeWrap.scrollLeft,
      scrollTop: treeWrap.scrollTop
    };
    event.preventDefault();
  });

  treeWrap.addEventListener("dragstart", (event) => {
    event.preventDefault();
  });
}

window.addEventListener("mousemove", (event) => {
  if (!dragToPan) return;
  if (!mousePanning || !treeWrap) return;
  const dx = event.clientX - panStart.x;
  const dy = event.clientY - panStart.y;
  treeWrap.scrollLeft = panStart.scrollLeft - dx;
  treeWrap.scrollTop = panStart.scrollTop - dy;
});

window.addEventListener("mouseup", () => {
  if (!mousePanning || !treeWrap) return;
  mousePanning = false;
  treeWrap.classList.remove("is-dragging");
  if (virtualizationEnabled) scheduleRender();
});

let scrollStopTimer = null;
if (treeWrap) {
  treeWrap.addEventListener("scroll", () => {
    updateMinimap();
    if (scrollStopTimer) clearTimeout(scrollStopTimer);
    if (isPanning || mousePanning) return;
    if (!virtualizationEnabled) return;
    scrollStopTimer = setTimeout(() => {
      scheduleRender();
    }, 80);
  });
}

window.addEventListener("resize", () => {
  scheduleRender();
  updateMinimap();
});

if (searchInput && searchResults) {
  searchInput.addEventListener("input", (event) => {
    const query = event.target.value.trim().toLowerCase();
    if (!query) {
      searchResults.classList.remove("active");
      searchResults.innerHTML = "";
      clearHighlights();
      lastSearchResults = [];
      return;
    }

    const results = treeData.people.filter((person) => person.name.toLowerCase().includes(query));
    searchResults.innerHTML = "";
    lastSearchResults = results;

    if (results.length === 0) {
      const item = document.createElement("div");
      item.className = "search-item";
      item.textContent = i18n[lang].searchNone;
      searchResults.appendChild(item);
    } else {
      results.forEach((person) => {
        const item = document.createElement("div");
        item.className = "search-item";
        item.textContent = formatDisplayName(person.name);
        item.addEventListener("click", () => {
          searchResults.classList.remove("active");
          searchInput.value = formatDisplayName(person.name);
          focusPerson(person.id, true);
        });
        searchResults.appendChild(item);
      });
    }

    searchResults.classList.toggle("active", true);
    highlightMatches(results.map((p) => p.id));
  });
}

if (searchGoBtn) {
  searchGoBtn.addEventListener("click", () => {
    if (lastSearchResults.length === 0) return;
    const person = lastSearchResults[0];
    focusPerson(person.id, true);
  });
}

function clearHighlights() {
  document.querySelectorAll(".highlight").forEach((el) => el.classList.remove("highlight"));
}

function highlightMatches(ids) {
  clearHighlights();
  ids.forEach((id) => {
    const el = elementByPersonId.get(id);
    if (el) el.classList.add("highlight");
  });
}

function focusPerson(personId, open = false) {
  const el = elementByPersonId.get(personId);
  const person = peopleById.get(personId);
  if (!person) return;
  if (!treeWrap) return;

  if (viewMode !== "tree") {
    viewMode = "tree";
    applyViewMode();
    scheduleRender();
  }

  if (!el) {
    if (!nodeByPersonId.get(personId)) return;
    scheduleRender();
  }

  selectedPersonId = personId;
  updateStoryPanel(person);
  applySelectionHighlight(personId);

  if (open) openModal(person);

  const rect = el.getBoundingClientRect();
  const wrapRect = treeWrap.getBoundingClientRect();
  const scrollLeft = treeWrap.scrollLeft + rect.left - wrapRect.left - wrapRect.width / 2 + rect.width / 2;
  const scrollTop = treeWrap.scrollTop + rect.top - wrapRect.top - wrapRect.height / 2 + rect.height / 2;
  treeWrap.scrollTo({ left: scrollLeft, top: scrollTop, behavior: "smooth" });
  updateUrlState();
}

if (toggleThemeBtn) {
  toggleThemeBtn.addEventListener("change", () => {
    const next = toggleThemeBtn.checked ? "dark" : "light";
    app.dataset.theme = next;
    document.body.dataset.theme = next;
    savePrefs();
  });
}

if (viewToggle) {
  viewToggle.addEventListener("click", () => {
    viewMode = viewMode === "tree" ? "timeline" : "tree";
    applyViewMode();
    applyLanguage();
    updateViewSwitch();
    savePrefs();
    updateUrlState();
  });
}

if (viewTreeBtn) {
  viewTreeBtn.addEventListener("click", () => {
    if (viewMode === "tree") return;
    viewMode = "tree";
    applyViewMode();
    applyLanguage();
    updateViewSwitch();
    savePrefs();
    updateUrlState();
  });
  viewTreeBtn.addEventListener("touchstart", () => {
    if (viewMode === "tree") return;
    viewMode = "tree";
    applyViewMode();
    applyLanguage();
    updateViewSwitch();
    savePrefs();
    updateUrlState();
  }, { passive: true });
}

if (viewTimelineBtn) {
  viewTimelineBtn.addEventListener("click", () => {
    if (viewMode === "timeline") return;
    viewMode = "timeline";
    applyViewMode();
    applyLanguage();
    updateViewSwitch();
    savePrefs();
    updateUrlState();
  });
  viewTimelineBtn.addEventListener("touchstart", () => {
    if (viewMode === "timeline") return;
    viewMode = "timeline";
    applyViewMode();
    applyLanguage();
    updateViewSwitch();
    savePrefs();
    updateUrlState();
  }, { passive: true });
}

if (timelineGenSelect) {
  timelineGenSelect.addEventListener("change", () => {
    timelineFilters.generation = timelineGenSelect.value || "all";
    renderTimeline();
    updateTimelineActiveFilters();
  });
}

if (timelineMonthSelect) {
  timelineMonthSelect.addEventListener("change", () => {
    timelineFilters.month = timelineMonthSelect.value || "all";
    renderTimeline();
    updateTimelineActiveFilters();
  });
}

if (timelineGenderSelect) {
  timelineGenderSelect.addEventListener("change", () => {
    timelineFilters.gender = timelineGenderSelect.value || "all";
    renderTimeline();
    updateTimelineActiveFilters();
  });
}

if (timelineSortSelect) {
  timelineSortSelect.addEventListener("change", () => {
    timelineFilters.sort = timelineSortSelect.value || "year";
    renderTimeline();
    updateTimelineActiveFilters();
  });
}

if (timelineMoreBtn) {
  timelineMoreBtn.addEventListener("click", () => {
    updateTimelineMoreState(!timelineMoreOpen);
  });
}

if (timelineClearBtn) {
  timelineClearBtn.addEventListener("click", () => {
    timelineFilters = { generation: "all", month: "all", gender: "all", sort: "year" };
    if (timelineGenSelect) timelineGenSelect.value = "all";
    if (timelineMonthSelect) timelineMonthSelect.value = "all";
    if (timelineGenderSelect) timelineGenderSelect.value = "all";
    if (timelineSortSelect) timelineSortSelect.value = "year";
    renderTimeline();
    updateTimelineActiveFilters();
  });
}

if (settingsBtn) {
  settingsBtn.addEventListener("click", () => {
    openSettingsModal();
  });
}

if (settingsModal) {
  settingsModal.addEventListener("click", (event) => {
    if (!event.target.dataset.settingsClose) return;
    closeSettingsModal();
  });
  closeSettingsModal();
}

if (settingsCompact) {
  settingsCompact.addEventListener("change", () => {
    compactMode = settingsCompact.checked;
    document.body.classList.toggle("compact", compactMode);
    applyLanguage();
    savePrefs();
  });
}

if (settingsLines) {
  settingsLines.addEventListener("change", () => {
    showLines = settingsLines.checked;
    applyLinesState();
    savePrefs();
  });
}

if (settingsCardScale) {
  settingsCardScale.addEventListener("input", () => {
    cardScale = Number(settingsCardScale.value) || 1;
    applyCardScale();
    buildLayout();
    updateStats();
    populateTimelineFilters();
    renderScene();
    savePrefs();
  });
}

if (settingsMinimap) {
  settingsMinimap.addEventListener("change", () => {
    minimapEnabled = settingsMinimap.checked;
    applyMinimapState();
    savePrefs();
  });
}

if (settingsDrag) {
  settingsDrag.addEventListener("change", () => {
    dragToPan = settingsDrag.checked;
    applyDragToPanState();
    savePrefs();
  });
}

if (settingsShowBirthdate) {
  settingsShowBirthdate.addEventListener("change", () => {
    showBirthdate = settingsShowBirthdate.checked;
    applyDetailsVisibility();
    savePrefs();
  });
}

if (settingsShowAge) {
  settingsShowAge.addEventListener("change", () => {
    showAge = settingsShowAge.checked;
    applyDetailsVisibility();
    savePrefs();
  });
}

if (settingsShowTags) {
  settingsShowTags.addEventListener("change", () => {
    showTags = settingsShowTags.checked;
    applyDetailsVisibility();
    savePrefs();
  });
}

if (settingsDefaultView) {
  settingsDefaultView.addEventListener("change", () => {
    defaultView = settingsDefaultView.value || "tree";
    viewMode = defaultView;
    applyViewMode();
    savePrefs();
  });
}

if (settingsReset) {
  settingsReset.addEventListener("click", () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore storage errors
    }
    window.location.reload();
  });
}

if (settingsClearData) {
  settingsClearData.addEventListener("click", () => {
    clearSiteCache();
  });
}

if (exportPngBtn) {
  exportPngBtn.addEventListener("click", async () => {
    if (!window.html2canvas) {
      alert(i18n[lang].exportPngFail);
      return;
    }
    if (!treeZoom) return;
    const exportScale = Math.min(3, (window.devicePixelRatio || 1) * 1.5);
    const canvas = await window.html2canvas(treeZoom, { backgroundColor: null, scale: exportScale });
    const link = document.createElement("a");
    link.download = "salasilah-keluarga.jpg";
    link.href = canvas.toDataURL("image/jpeg", 0.92);
    link.click();
  });
}

if (exportPdfBtn) {
  exportPdfBtn.addEventListener("click", async () => {
    if (!window.html2canvas || !window.jspdf) {
      alert(i18n[lang].exportPdfFail);
      return;
    }
    if (!treeZoom) return;

    const exportScale = Math.min(3, (window.devicePixelRatio || 1) * 1.5);
    const canvas = await window.html2canvas(treeZoom, { backgroundColor: null, scale: exportScale });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new window.jspdf.jsPDF({ orientation: "landscape", unit: "px", format: [canvas.width, canvas.height] });

    const title = treeData.familyName || i18n[lang].appKicker;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(28);
    pdf.text(title, 40, 60);
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    const dateLabel = formatText(i18n[lang].exportDate, { date: formatDateDisplay(new Date()) });
    pdf.text(dateLabel, 40, 90);
    pdf.addPage([canvas.width, canvas.height], "landscape");
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("salasilah-keluarga.pdf");
  });
}

function closeExportMenu() {
  if (!exportMenu) return;
  exportMenu.hidden = true;
  if (exportMenuBtn) exportMenuBtn.setAttribute("aria-expanded", "false");
}

function positionExportMenu() {
  if (!exportMenu || !exportMenuBtn) return;
  exportMenu.style.left = "calc(100% + 8px)";
  exportMenu.style.right = "auto";
  exportMenu.style.top = "50%";
  exportMenu.style.transform = "translateY(-50%)";
  const rect = exportMenu.getBoundingClientRect();
  const vw = window.innerWidth;
  if (rect.right > vw - 8) {
    exportMenu.style.left = "auto";
    exportMenu.style.right = "calc(100% + 8px)";
    exportMenu.style.top = "50%";
    exportMenu.style.transform = "translateY(-50%)";
  }
  const updated = exportMenu.getBoundingClientRect();
  if (updated.left < 8 || updated.right > vw - 8) {
    exportMenu.style.left = "auto";
    exportMenu.style.right = "0";
    exportMenu.style.top = "calc(100% + 8px)";
    exportMenu.style.transform = "none";
  }
}

if (exportMenuBtn) {
  exportMenuBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    if (!exportMenu) return;
    const willOpen = exportMenu.hidden;
    exportMenu.hidden = !willOpen;
    exportMenuBtn.setAttribute("aria-expanded", willOpen ? "true" : "false");
    if (willOpen) {
      requestAnimationFrame(positionExportMenu);
    }
  });
}

if (exportMenu) {
  document.addEventListener("click", (event) => {
    if (exportMenu.hidden) return;
    if (exportMenu.contains(event.target) || exportMenuBtn?.contains(event.target)) return;
    closeExportMenu();
  });
}

if (exportPngBtn) {
  exportPngBtn.addEventListener("click", () => {
    closeExportMenu();
  });
}

if (exportPdfBtn) {
  exportPdfBtn.addEventListener("click", () => {
    closeExportMenu();
  });
}

function updateMiniToolbarVisibility() {
  if (!miniToolbar) return;
  if (viewMode !== "tree") {
    miniToolbar.classList.remove("is-visible");
    return;
  }
  const controlsPanel = document.querySelector(".controls");
  if (!controlsPanel) return;
  const rect = controlsPanel.getBoundingClientRect();
  const shouldShow = rect.bottom < 0;
  miniToolbar.classList.toggle("is-visible", shouldShow);
}

if (miniSearchBtn) {
  miniSearchBtn.addEventListener("click", () => {
    if (searchInput) searchInput.focus();
  });
}

if (miniZoomInBtn) {
  miniZoomInBtn.addEventListener("click", () => {
    if (zoomInBtn) zoomInBtn.click();
  });
}

if (miniZoomOutBtn) {
  miniZoomOutBtn.addEventListener("click", () => {
    if (zoomOutBtn) zoomOutBtn.click();
  });
}

if (miniZoomFitBtn) {
  miniZoomFitBtn.addEventListener("click", () => {
    if (zoomFitBtn) zoomFitBtn.click();
  });
}

window.addEventListener("scroll", () => {
  updateMiniToolbarVisibility();
}, { passive: true });

window.addEventListener("resize", () => {
  updateMiniToolbarVisibility();
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (settingsModal && settingsModal.classList.contains("is-open")) {
    settingsModal.classList.remove("is-open");
    settingsModal.setAttribute("aria-hidden", "true");
  }
});

window.addEventListener("load", () => {
  if (treeData) {
    renderScene();
    applyZoom();
  }
  updateMiniToolbarVisibility();
});

function updateMinimap() {
  if (!minimapEnabled) return;
  if (!minimapCanvas || !layoutRoot || !treeWrap) return;
  const rect = minimapCanvas.getBoundingClientRect();
  const width = Math.max(1, Math.floor(rect.width));
  const height = Math.max(1, Math.floor(rect.height));
  const dpr = window.devicePixelRatio || 1;
  minimapCanvas.width = width * dpr;
  minimapCanvas.height = height * dpr;
  const ctx = minimapCanvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const scaleX = width / baseSize.width;
  const scaleY = height / baseSize.height;
  const miniScale = Math.min(scaleX, scaleY);

  ctx.save();
  ctx.scale(miniScale, miniScale);
  nodesList.forEach((node) => {
    if (!nodeVisible(node)) return;
    const w = node.ownWidth || layoutConfig.cardWidth;
    const h = 80;
    ctx.fillStyle = branchPalette[node.branchId] + "55";
    ctx.fillRect(node.x, node.y, w, h);
  });

  const viewW = treeWrap.clientWidth / scale;
  const viewH = treeWrap.clientHeight / scale;
  const viewX = treeWrap.scrollLeft / scale;
  const viewY = treeWrap.scrollTop / scale;
  ctx.strokeStyle = "rgba(255,255,255,0.85)";
  ctx.lineWidth = 2 / miniScale;
  ctx.strokeRect(viewX, viewY, viewW, viewH);
  ctx.restore();
}

function fitToScreen() {
  if (!treeWrap || !treeCanvas) return;
  if (!treeCanvas.children.length || baseSize.width <= 0 || baseSize.height <= 0) return;
  const pad = 24;
  const targetScale = Math.min(
    (treeWrap.clientWidth - pad) / baseSize.width,
    (treeWrap.clientHeight - pad) / baseSize.height
  );
  if (!Number.isFinite(targetScale) || targetScale <= 0) return;
  scale = Math.max(0.6, Math.min(2.2, targetScale));
  applyZoom();
  treeWrap.scrollTo({ left: 0, top: 0, behavior: "smooth" });
  scheduleRender();
}

function findElderPerson() {
  const elderByRelation = treeData.people.find((p) => {
    const relation = (p.relation || "").toLowerCase();
    return relation.includes("tok") || relation.includes("wan");
  });
  if (elderByRelation) return elderByRelation;

  const firstRootUnion = treeData.unions.find((u) => u.partner1 || u.partner2);
  if (!firstRootUnion) return null;
  return peopleById.get(firstRootUnion.partner1) || peopleById.get(firstRootUnion.partner2) || null;
}

function applyLineageHighlight() {
  document.querySelectorAll(".person-card.path-on").forEach((el) => el.classList.remove("path-on"));
  if (!pathMode || !treeData.selfId) {
    applyLanguage();
    return;
  }
  const ids = getLineageIds(treeData.selfId);
  ids.forEach((id) => {
    const group = elementByPersonId.get(id);
    if (!group) return;
    group.querySelectorAll(".person-card").forEach((card) => card.classList.add("path-on"));
  });
  applyLanguage();
}

function getLineageIds(startId) {
  const result = new Set([startId]);
  let cursor = startId;
  let guard = 0;
  while (guard < 100) {
    guard += 1;
    const parentUnion = treeData.unions.find((u) => u.children.includes(cursor));
    if (!parentUnion) break;
    if (parentUnion.partner1) result.add(parentUnion.partner1);
    if (parentUnion.partner2) result.add(parentUnion.partner2);
    cursor = parentUnion.partner1 || parentUnion.partner2;
    if (!cursor) break;
  }
  return result;
}

function validateTreeData(data) {
  const errors = [];
  if (!data || !Array.isArray(data.people) || !Array.isArray(data.unions)) {
    return [i18n[lang].errStructure];
  }
  const ids = new Set();
  data.people.forEach((person) => {
    if (!person.id) errors.push(i18n[lang].errPersonNoId);
    if (ids.has(person.id)) errors.push(formatText(i18n[lang].errDuplicateId, { id: person.id }));
    ids.add(person.id);
  });

  const childMap = new Map();
  data.unions.forEach((union) => {
    if (!union.id) errors.push(i18n[lang].errUnionNoId);
    if (union.partner1 && !ids.has(union.partner1)) {
      errors.push(formatText(i18n[lang].errPartner1Missing, { id: union.partner1 }));
    }
    if (union.partner2 && !ids.has(union.partner2)) {
      errors.push(formatText(i18n[lang].errPartner2Missing, { id: union.partner2 }));
    }
    (union.children || []).forEach((childId) => {
      if (!ids.has(childId)) errors.push(formatText(i18n[lang].errChildMissing, { id: childId }));
      if (!childMap.has(childId)) childMap.set(childId, []);
      childMap.get(childId).push(union.id);
    });
  });

  childMap.forEach((unions, childId) => {
    if (unions.length > 1) {
      errors.push(formatText(i18n[lang].errChildMultiple, { id: childId, unions: unions.join(", ") }));
    }
  });
  return errors;
}

function syncMobileLabels() {
  if (mobileQuickZoomIn) mobileQuickZoomIn.textContent = zoomInBtn.textContent;
  if (mobileQuickZoomOut) mobileQuickZoomOut.textContent = zoomOutBtn.textContent;
  if (mobileQuickZoomFit) mobileQuickZoomFit.textContent = zoomFitBtn.textContent;
  if (mobileActionLabel) mobileActionLabel.textContent = i18n[lang].mobileActions;

  if (mobileActionSelect) {
    const placeholder = mobileActionSelect.querySelector('option[value=""]');
    if (placeholder) placeholder.textContent = i18n[lang].mobilePick;

    const optionMap = {
      "zoom-reset": zoomResetBtn,
      "reset-view": resetViewBtn,
      "toggle-theme": toggleThemeBtn,
      "lang-toggle": langToggleBtn,
      "export-png": exportPngBtn,
      "export-pdf": exportPdfBtn
    };

    Object.entries(optionMap).forEach(([value, btn]) => {
      const option = mobileActionSelect.querySelector(`option[value="${value}"]`);
      if (option && btn) option.textContent = btn.textContent;
    });
  }
}

function applyLanguage() {
  const t = i18n[lang];
  document.title = t.appKicker;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (key && t[key] !== undefined) el.textContent = t[key];
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    if (key && t[key] !== undefined) el.setAttribute("placeholder", t[key]);
  });
  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    const key = el.dataset.i18nTitle;
    if (key && t[key] !== undefined) el.setAttribute("title", t[key]);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    const key = el.dataset.i18nAria;
    if (key && t[key] !== undefined) el.setAttribute("aria-label", t[key]);
  });

  if (treeCanvas) treeCanvas.dataset.emptyText = "";
  if (searchInput) searchInput.placeholder = t.searchPlaceholder;
  if (viewToggle) viewToggle.textContent = viewMode === "timeline" ? t.viewTree : t.viewTimeline;
  if (compactToggleBtn) compactToggleBtn.textContent = compactMode ? t.compactOn : t.compactOff;
  if (pathToggleBtn) pathToggleBtn.textContent = pathMode ? t.pathOn : t.pathOff;
  if (focusEldersBtn) focusEldersBtn.textContent = t.focusElders;
  if (backTopBtn) backTopBtn.textContent = t.backTop;
  if (zoomFitBtn) zoomFitBtn.textContent = t.fit;
  if (zoomInBtn) zoomInBtn.textContent = t.zoomIn;
  if (zoomOutBtn) zoomOutBtn.textContent = t.zoomOut;
  if (zoomResetBtn) zoomResetBtn.textContent = t.zoomReset;
  if (exportPngBtn) {
    const label = exportPngBtn.querySelector('[data-i18n="exportPng"]');
    if (label) label.textContent = t.exportPng;
  }
  if (exportPdfBtn) {
    const label = exportPdfBtn.querySelector('[data-i18n="exportPdf"]');
    if (label) label.textContent = t.exportPdf;
  }
  if (exportJsonBtn) exportJsonBtn.textContent = t.exportJson;
  if (importJsonBtn) importJsonBtn.textContent = t.importJson;
  if (validateDataBtn) validateDataBtn.textContent = t.validateData;
  if (toggleThemeBtn) toggleThemeBtn.checked = app.dataset.theme === "dark";
  if (langToggleBtn) langToggleBtn.checked = lang === "en";
  if (controlsToggleBtn) {
    controlsToggleBtn.textContent = controlsCollapsed ? t.controlsToggleOpen : t.controlsToggleClose;
  }
  if (mobilePanelBtn) {
    mobilePanelBtn.textContent = controlsCollapsed ? t.controlsToggleOpen : t.controlsToggleClose;
  }
  if (settingsBtn) settingsBtn.textContent = t.settingsTitle;
  if (themePresetSelect) themePresetSelect.value = themePreset;
  if (settingsCardScale) settingsCardScale.value = String(cardScale);
  if (settingsCompact) settingsCompact.checked = compactMode;
  if (settingsLines) settingsLines.checked = showLines;
  if (settingsMinimap) settingsMinimap.checked = minimapEnabled;
  if (settingsDrag) settingsDrag.checked = dragToPan;
  if (settingsShowBirthdate) settingsShowBirthdate.checked = showBirthdate;
  if (settingsShowAge) settingsShowAge.checked = showAge;
  if (settingsShowTags) settingsShowTags.checked = showTags;
  if (settingsDefaultView) settingsDefaultView.value = viewMode;
  if (timelineMonthSelect) timelineMonthSelect.value = timelineFilters.month;
  if (timelineGenderSelect) timelineGenderSelect.value = timelineFilters.gender;
  if (timelineSortSelect) timelineSortSelect.value = timelineFilters.sort;
  populateTimelineFilters();
  updateTimelineMoreState();
  updateTimelineActiveFilters();
  updateViewSwitch();

  const branchOptions = branchFilter?.options || [];
  if (branchOptions.length > 0) {
    branchOptions[0].textContent = t.branchAll;
    for (let i = 1; i < branchOptions.length; i += 1) {
      branchOptions[i].textContent = formatText(t.branchName, { n: i });
    }
  }

  generationControls?.querySelectorAll(".gen-chip").forEach((chip) => {
    if (chip.dataset.reset) chip.textContent = t.genAll;
  });

  if (!selectedPersonId) {
    if (storyTitle) storyTitle.textContent = t.storyTitle;
    if (storyBody) storyBody.textContent = t.storyEmpty;
  }

  if (modal?.classList.contains("active") && selectedPersonId) {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
  }

  syncMobileLabels();
  if (minimapHandle) minimapHandle.textContent = t.minimapShow;
}

function minimapScrollTo(clientX, clientY) {
  if (!minimapCanvas || !treeWrap) return;
  const rect = minimapCanvas.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  const scaleX = rect.width / baseSize.width;
  const scaleY = rect.height / baseSize.height;
  const miniScale = Math.min(scaleX, scaleY);
  const targetX = x / miniScale - treeWrap.clientWidth / (2 * scale);
  const targetY = y / miniScale - treeWrap.clientHeight / (2 * scale);
  treeWrap.scrollTo({ left: Math.max(0, targetX * scale), top: Math.max(0, targetY * scale) });
}

if (minimapCanvas) {
  minimapCanvas.addEventListener("click", (event) => {
    minimapScrollTo(event.clientX, event.clientY);
  });
}

const minimap = document.getElementById("minimap");
const minimapWrap = document.querySelector(".brand-minimap-wrap");
const minimapHandle = document.getElementById("minimap-handle");
const minimapCloseBtn = document.getElementById("minimap-close-btn");
if (minimap) {
  const isMobileView = () => window.matchMedia("(max-width: 720px)").matches;
  const activate = () => {
    minimap.classList.add("is-active");
  };
  const deactivate = () => {
    minimap.classList.remove("is-active");
  };
  let dragging = false;
  let hovering = false;
  let hideTimer = null;

  const scheduleHide = () => {
    if (isMobileView()) return;
    if (!minimapWrap) return;
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      if (!dragging && !hovering) {
        minimapWrap.classList.add("is-collapsed");
      }
    }, 2500);
  };

  const openMinimapMobile = () => {
    if (!minimapWrap) return;
    minimapWrap.classList.add("is-open");
    minimapWrap.classList.remove("is-collapsed");
  };

  const closeMinimapMobile = () => {
    if (!minimapWrap) return;
    minimapWrap.classList.remove("is-open");
    minimapWrap.classList.add("is-collapsed");
  };

  const toggleMinimapMobile = () => {
    if (!minimapWrap) return;
    if (minimapWrap.classList.contains("is-open")) {
      closeMinimapMobile();
    } else {
      openMinimapMobile();
    }
  };

  const showMinimap = () => {
    if (!minimapWrap) return;
    if (isMobileView()) {
      toggleMinimapMobile();
      return;
    }
    minimapWrap.classList.remove("is-collapsed");
    scheduleHide();
  };

  if (minimapWrap) {
    minimapWrap.classList.add("is-collapsed");
    minimapWrap.addEventListener("mouseenter", () => {
      hovering = true;
      showMinimap();
    });
    minimapWrap.addEventListener("mouseleave", () => {
      hovering = false;
      scheduleHide();
    });
    minimapWrap.addEventListener("focusin", () => {
      hovering = true;
      showMinimap();
    });
    minimapWrap.addEventListener("focusout", () => {
      hovering = false;
      scheduleHide();
    });
    minimapWrap.addEventListener("touchstart", showMinimap, { passive: true });
    if (isMobileView()) {
      minimapWrap.classList.remove("is-open");
    }
    setTimeout(() => minimapWrap.classList.add("is-collapsed"), 50);
  }

  if (minimapHandle) {
    minimapHandle.addEventListener("click", showMinimap);
    minimapHandle.addEventListener("touchstart", showMinimap, { passive: true });
  }

  if (minimapCloseBtn) {
    minimapCloseBtn.addEventListener("click", () => {
      if (isMobileView()) closeMinimapMobile();
    });
  }

  minimap.addEventListener("pointerdown", (event) => {
    if (!minimapCanvas) return;
    dragging = true;
    minimap.setPointerCapture(event.pointerId);
    activate();
    minimapScrollTo(event.clientX, event.clientY);
    showMinimap();
    event.preventDefault();
  });

  minimap.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    minimapScrollTo(event.clientX, event.clientY);
    showMinimap();
    event.preventDefault();
  });

  const endDrag = (event) => {
    dragging = false;
    deactivate();
    if (event && minimap.hasPointerCapture(event.pointerId)) {
      minimap.releasePointerCapture(event.pointerId);
    }
  };

  minimap.addEventListener("pointerup", endDrag);
  minimap.addEventListener("pointercancel", endDrag);
  minimap.addEventListener("mouseleave", () => {
    if (dragging) endDrag();
  });
  minimap.addEventListener("mouseup", deactivate);

  scheduleHide();
  window.addEventListener("scroll", scheduleHide, true);
  window.addEventListener("touchend", scheduleHide, { passive: true });
  window.addEventListener("resize", () => {
    if (isMobileView()) {
      closeMinimapMobile();
    } else if (minimapWrap) {
      minimapWrap.classList.remove("is-open");
      scheduleHide();
    }
  });
}

function restoreFromUrl() {
  if (!GENERATION_FILTER_ENABLED) return;
  const params = new URLSearchParams(window.location.search);
  const focusId = params.get("focus");
  const genParam = params.get("gen");
  if (genParam) {
    params.delete("gen");
    history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
  }

  if (focusId && peopleById.has(focusId)) {
    setTimeout(() => {
      focusPerson(focusId, false);
    }, 200);
  }
}

function updateUrlState() {
  const params = new URLSearchParams(window.location.search);
  if (selectedPersonId) params.set("focus", selectedPersonId);

  const visible = [];
  for (let depth = 1; depth <= maxDepth; depth += 1) {
    if (!hiddenGenerations.has(depth)) visible.push(depth);
  }
  if (visible.length !== maxDepth) {
    params.set("gen", visible.join(","));
  } else {
    params.delete("gen");
  }

  history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
}
