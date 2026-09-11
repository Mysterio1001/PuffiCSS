import {
  animations,
  getAnimations,
  getCategories,
  getEasings,
  defaultSettings,
  settingsStyle,
  demoClass,
  demoCSS,
  generateCode,
  filterAnimations,
} from "./catalog.js";
import { icon, logo } from "./icons.js";
import {
  getLocale,
  setLocale,
  supportedLocales,
  localeNames,
  t,
} from "./i18n.js";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
const tr = (key, params) => escape(t(key, params));
function readSaved(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}
function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
// Keep existing collections and theme when upgrading from the previous name.
const savedFavorites = readSaved(
  "pufficss-favorites",
  readSaved("motionkit-favorites", []),
);
const state = {
  category: "all",
  query: "",
  favoritesOnly: false,
  sort: "featured",
  favorites: Array.isArray(savedFavorites)
    ? savedFavorites.filter((id) => animations.some((a) => a.id === id))
    : [],
  theme:
    readSaved("pufficss-theme", readSaved("motionkit-theme", "light")) ===
    "dark"
      ? "dark"
      : "light",
  paused: matchMedia("(prefers-reduced-motion: reduce)").matches,
};
save("pufficss-favorites", state.favorites);
save("pufficss-theme", state.theme);
let activeItem = null;
let activeSettings = null;
let activeFormat = "html";
let editorPaused = false;
let toastTimer;
const previewStyle = document.createElement("style");
const interactivePreviewCSS = (css) =>
  css.replaceAll(
    ":hover, :focus-visible",
    ":hover, :focus-visible, .is-replaying",
  );
document.head.append(previewStyle);
document.documentElement.dataset.theme = state.theme;

function renderShell() {
  const items = getAnimations();
  const categories = getCategories();
  previewStyle.textContent = items
    .map((a) => interactivePreviewCSS(a.css))
    .join("\n");
  document.documentElement.lang = getLocale();
  document.title = t("documentTitle");
  $('meta[name="description"]').content = t("documentDescription");
  $(".skip-link").textContent = t("skipLink");
  $("#app").innerHTML = `
  <div class="sidebar-overlay" data-action="close-menu"></div>
  <aside class="sidebar" aria-label="${tr("navigationLabel")}">
    <a class="brand" href="#" data-action="home" aria-label="${tr("homeLabel")}">${logo}<span>Puffi<span class="brand-css">CSS</span></span></a>
    <div class="workspace-label"><span class="workspace-symbol">P</span><div>${tr("workspaceTitle")}<small>${tr("workspaceTagline")}</small></div><span class="version">v1.0</span></div>
    <div class="nav-label">${tr("exploreLabel")} <span>${tr("exploreCaption")}</span></div>
    <nav class="category-nav">${categories.map((c) => `<button class="nav-item ${c.id === "all" ? "active" : ""}" data-category="${c.id}">${icon(c.icon)}<span>${escape(c.name)}</span><small>${c.id === "all" ? animations.length : items.filter((a) => a.category === c.id).length}</small></button>`).join("")}</nav>
    <div class="nav-divider"></div>
    <div class="nav-label">${tr("workspaceLabel")} <span>${tr("workspaceCaption")}</span></div>
    <button class="nav-item" data-action="favorites">${icon("bookmark")}<span>${tr("favorites")}</span><small id="favorite-count">${state.favorites.length}</small></button>
    <button class="nav-item" data-action="guide">${icon("book")}<span>${tr("guide")}</span>${icon("arrowUp", "nav-external")}</button>
    <div class="sidebar-bottom">
      <div class="sidebar-note"><span class="note-mascot">${logo}</span><strong>${tr("sidebarTitle")}</strong><p>${tr("sidebarLineOne")}<br>${tr("sidebarLineTwo")}</p><button data-action="random">${tr("random")} ${icon("arrow")}</button></div>
      <div class="sidebar-footer"><span><i></i> ${tr("makers")}</span><button class="icon-button theme-button" data-action="theme" aria-label="${tr(state.theme === "dark" ? "lightTheme" : "darkTheme")}">${icon(state.theme === "dark" ? "sun" : "moon")}</button></div>
    </div>
  </aside>
  <div class="page">
    <header class="topbar">
      <div class="breadcrumb"><button class="icon-button mobile-menu" data-action="menu" aria-label="${tr("openNavigation")}" aria-expanded="false">${icon("menu")}</button><span class="breadcrumb-home">${tr("library")}</span><span class="breadcrumb-slash">/</span><strong id="breadcrumb-current">${escape(categories.find((c) => c.id === "all").name)}</strong></div>
      <div class="topbar-right"><label class="language-control" for="language-select"><span class="language-label">${tr("language")}</span><select id="language-select" aria-label="${tr("language")}">${supportedLocales.map((locale) => `<option value="${locale}" lang="${locale}" ${locale === getLocale() ? "selected" : ""}>${escape(localeNames[locale])}</option>`).join("")}</select></label><span class="free-note"><span></span> ${tr("freeNote")}</span><button class="guide-link" data-action="guide">${tr("quickStart")} ${icon("arrowUp")}</button></div>
    </header>
    <main id="main">
      <section class="hero" aria-labelledby="hero-title">
        <div class="hero-copy"><div class="eyebrow"><span class="eyebrow-dot"></span> ${tr("heroEyebrow")}</div><h1 id="hero-title">${tr("heroTitle")}<br><span>${tr("heroEmphasis")}</span><svg class="hero-underline" viewBox="0 0 230 15" fill="none" aria-hidden="true"><path d="M3 11Q105 -4 224 7" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></svg></h1><p>${tr("heroLineOne")}<br>${tr("heroLineTwo")}</p><div class="hero-actions"><button class="primary-button" data-action="explore">${tr("explore")} ${icon("arrowDown")}</button><span>${tr("heroActionNote")}</span></div></div>
        <div class="hero-art" aria-hidden="true"><div class="orbit-ring ring-one"></div><div class="orbit-ring ring-two"></div><span class="art-spark spark-one">✦</span><span class="art-spark spark-two">✧</span><div class="art-motion-card"><div class="art-card-top"><span><i></i>puffi.play</span><span>•••</span></div><div class="art-shape">${logo}</div><div class="art-card-bottom"><span>${tr("artMove")}</span><span>↗</span></div></div><div class="art-code-card"><div><i></i><i></i><i></i><small>${tr("artCode")}</small></div><code><em>transform</em>: translateY(<b>−8px</b>);<br><em>transition</em>: all <b>0.3s</b> ease;</code></div><div class="art-hover-button">${tr("artHover")} ${icon("pointer")}</div><div class="art-caption"><i></i> ${tr("artCaption")}</div></div>
      </section>
      <div class="benefits"><span>${icon("bolt")} ${tr("benefitLight")}</span><span>${icon("sliders")} ${tr("benefitPreview")}</span><span>${icon("code")} HTML / CSS / React / Vue</span><span>${icon("check")} ${tr("benefitLicense")}</span></div>
      <section class="library" id="library" aria-labelledby="library-title">
        <div class="library-heading"><div><div class="section-eyebrow">${tr("collectionEyebrow")}</div><h2 id="library-title">${tr("collectionTitle")}<span id="result-total">${items.length}</span></h2><p id="library-description">${tr("collectionDescription")}</p></div><label class="search-box">${icon("search")}<input id="search" type="search" placeholder="${tr("searchPlaceholder")}" aria-label="${tr("searchLabel")}" autocomplete="off"><kbd>⌘ K</kbd></label></div>
        <div class="filter-bar"><div class="filter-tabs" role="group" aria-label="${tr("categoriesLabel")}">${categories.map((c) => `<button class="filter-tab ${c.id === "all" ? "selected" : ""}" data-category="${c.id}" aria-pressed="${c.id === "all"}">${c.id === "all" ? icon("grid") : ""}${c.id === "all" ? tr("all") : escape(c.name)}</button>`).join("")}</div><div class="sort-wrap"><label for="sort">${tr("sort")}</label><select id="sort" aria-label="${tr("sortLabel")}"><option value="featured">${tr("sortFeatured")}</option><option value="newest">${tr("sortNewest")}</option><option value="name">${tr("sortName")}</option></select>${icon("chevron")}</div></div>
        <div class="library-status"><span id="result-label">${tr("resultDefault")}</span><button class="play-toggle" data-action="pause" aria-pressed="${state.paused}">${icon(state.paused ? "play" : "pause")}<span>${tr(state.paused ? "playAnimations" : "pauseAnimations")}</span></button></div>
        <div class="animation-grid ${state.paused ? "is-paused" : ""}" id="animation-grid"></div>
        <div class="collection-end"><span class="collection-mascot">${logo}</span><p>${tr("collectionEnd")}</p><span>${tr("collectionEndCaption")}</span></div>
      </section>
      <footer class="main-footer">
        <a class="footer-brand" href="#" data-action="home">${logo}<span>Puffi<span class="brand-css">CSS</span></span></a>
        <span>${tr("footerTagline")}</span>
        <button data-action="guide">${tr("howToUse")} ${icon("arrowUp")}</button>
        <div class="developer-info" aria-label="${tr("developerInfo")}">
          <div class="developer-credit"><span class="developer-label">${tr("developer")}</span><strong lang="zh-Hant">交給我科技工作室</strong><span class="developer-english" lang="en">Handle by Me Tech Studio</span></div>
          <div class="developer-contact"><span class="developer-label">${tr("contact")}</span><a href="mailto:contact@handlebyme.com">contact@handlebyme.com</a></div>
        </div>
      </footer>
    </main>
  </div>`;
  $("#search").value = state.query;
  $("#sort").value = state.sort;
  $(".sidebar").inert =
    mobileLayout.matches && !document.body.classList.contains("menu-open");
  $(".mobile-menu").setAttribute(
    "aria-expanded",
    document.body.classList.contains("menu-open"),
  );
  renderCards();
}

function toast(message) {
  const el = $("#toast");
  el.innerHTML = `${icon("check")}<span>${escape(message)}</span>`;
  el.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("visible"), 3000);
}

function card(item) {
  const saved = state.favorites.includes(item.id);
  return `<article class="animation-card" data-id="${item.id}">
    <div class="card-preview" style="background:${item.color}; ${settingsStyle(defaultSettings(item))}">
      <div class="card-badges">${item.badge ? `<span class="badge ${item.badgeType === "hot" ? "badge-hot" : ""}">${item.badgeType === "hot" ? icon("bolt") : icon("sparkles")}${escape(item.badge)}</span>` : ""}</div>
      <button class="favorite-button ${saved ? "saved" : ""}" data-action="save" data-id="${item.id}" aria-pressed="${saved}" aria-label="${tr(saved ? "unsaveItem" : "saveItem", { name: item.name })}">${icon("bookmark")}</button>
      <div class="demo-content">${item.html}</div>
      <span class="preview-hint">${icon(item.trigger === "hover" ? "pointer" : "play")}${tr(item.trigger === "hover" ? "hoverHint" : "previewHint")}</span>
      <button class="replay-button" data-action="replay" data-id="${item.id}" aria-label="${tr("replayItem", { name: item.name })}">${icon("replay")}</button>
    </div>
    <div class="card-details"><div class="card-title-row"><button class="card-title" data-action="edit" data-id="${item.id}"><h3>${escape(item.name)}</h3><span>${escape(item.tagline)}</span></button><button class="quick-copy" data-action="quick-copy" data-id="${item.id}" aria-label="${tr("copyItem", { name: item.name })}" title="${tr("copyHtml")}">${icon("copy")}</button></div><div class="card-bottom"><div class="tags">${item.tags.map((tag) => `<span>${escape(tag)}</span>`).join("")}</div><button class="code-link" data-action="edit" data-id="${item.id}" aria-label="${tr("getCodeFor", { name: item.name })}">${icon("code")}<span>${tr("getCode")}</span>${icon("arrow", "code-arrow")}</button></div></div>
  </article>`;
}

const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries)
      entry.target.classList.toggle("offscreen", !entry.isIntersecting);
  },
  { rootMargin: "140px" },
);

function renderCards() {
  observer.disconnect();
  const categories = getCategories();
  const items = filterAnimations({ ...state, locale: getLocale() });
  $("#animation-grid").innerHTML = items.length
    ? items.map(card).join("")
    : `<div class="empty-state">${icon(state.favoritesOnly ? "bookmark" : "search")}<h3>${tr(state.favoritesOnly && !state.favorites.length ? "emptyFavoritesTitle" : "emptySearchTitle")}</h3><p>${tr(state.favoritesOnly && !state.favorites.length ? "emptyFavoritesDescription" : "emptySearchDescription")}</p><button class="secondary-button" data-action="reset-filters">${tr("exploreAll")} ${icon("arrow")}</button></div>`;
  $$(".animation-card").forEach((el) => observer.observe(el));
  $("#result-total").textContent = items.length;
  $("#result-label").textContent =
    state.query || state.category !== "all" || state.favoritesOnly
      ? t(items.length === 1 ? "resultCountOne" : "resultCount", {
          count: items.length,
        }) + (state.query ? t("resultSearch", { query: state.query }) : "")
      : t("resultDefault");
  $("#favorite-count").textContent = state.favorites.length;
  $("#library-title").firstChild.textContent = state.favoritesOnly
    ? t("favoritesTitle")
    : state.category === "all"
      ? t("collectionTitle")
      : categories.find((c) => c.id === state.category).name;
  $("#library-description").textContent = state.favoritesOnly
    ? t("favoritesDescription")
    : t("collectionDescription");
  $("#breadcrumb-current").textContent = state.favoritesOnly
    ? t("favorites")
    : categories.find((c) => c.id === state.category).name;
  $$(".nav-item[data-category]").forEach((el) => {
    const active =
      el.dataset.category === state.category && !state.favoritesOnly;
    el.classList.toggle("active", active);
    el.setAttribute("aria-current", active ? "page" : "false");
  });
  $('.nav-item[data-action="favorites"]').classList.toggle(
    "active",
    state.favoritesOnly,
  );
  $$(".filter-tab").forEach((el) => {
    el.classList.toggle("selected", el.dataset.category === state.category);
    el.setAttribute("aria-pressed", el.dataset.category === state.category);
  });
}

function scrollLibrary() {
  $("#library").scrollIntoView({
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "instant"
      : "smooth",
    block: "start",
  });
}

const mobileLayout = matchMedia("(max-width: 700px)");
function setMenu(open) {
  const wasOpen = document.body.classList.contains("menu-open");
  document.body.classList.toggle("menu-open", open);
  $(".sidebar").inert = mobileLayout.matches && !open;
  $(".mobile-menu").setAttribute("aria-expanded", open);
  if (open) $(".brand").focus();
  else if (wasOpen) $(".mobile-menu").focus();
}
mobileLayout.addEventListener("change", () => setMenu(false));

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.cssText =
      "position:fixed;left:0;top:0;opacity:0;pointer-events:none;";
    const parent = $("#editor").open ? $("#editor") : document.body;
    parent.append(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    if (copied) return true;
    toast(t("clipboardError"));
    return false;
  }
}

function toggleFavorite(id) {
  state.favorites = state.favorites.includes(id)
    ? state.favorites.filter((x) => x !== id)
    : [...state.favorites, id];
  const persisted = save("pufficss-favorites", state.favorites);
  renderCards();
  if (activeItem?.id === id && $("#editor").open) updateEditorFavorite();
  toast(
    t(state.favorites.includes(id) ? "favoriteAdded" : "favoriteRemoved") +
      (persisted ? "" : t("sessionOnly")),
  );
}

function openEditor(id) {
  activeItem = getAnimations().find((item) => item.id === id);
  activeSettings = defaultSettings(activeItem);
  activeFormat = "html";
  editorPaused = false;
  renderEditor();
  $("#editor").showModal();
  document.body.classList.add("dialog-open");
}

function renderEditor() {
  const item = activeItem;
  const id = item.id;
  const easings = getEasings();
  if ($("#editor").contains($("#toast"))) document.body.append($("#toast"));
  $("#editor").innerHTML =
    `<div class="editor-header"><div><span class="section-eyebrow">${tr("editorEyebrow")}</span><h2 id="editor-title">${escape(item.name)}<span>${escape(item.tagline)}</span></h2></div><button class="icon-button close-dialog" data-action="close-editor" aria-label="${tr("closeEditor")}">${icon("close")}</button></div>
    <div class="editor-body"><section class="editor-controls"><div class="editor-preview-toolbar"><span><i></i> ${tr("previewHint")}</span><div><button class="icon-button" data-action="editor-pause" aria-label="${tr(editorPaused ? "playPreview" : "pausePreview")}" aria-pressed="${editorPaused}">${icon(editorPaused ? "play" : "pause")}</button><button class="icon-button" data-action="editor-replay" aria-label="${tr("replayPreview")}">${icon("replay")}</button><button class="icon-button" id="editor-favorite" data-action="save" data-id="${id}"></button></div></div><div id="editor-preview" class="mk-demo"></div><p class="editor-description">${escape(item.description)}</p><div class="controls-title">${icon("sliders")} ${tr("customize")}<button data-action="reset-settings">${tr("reset")}</button></div><div class="settings-grid"><label class="range-label" for="duration">${tr("duration")} <output id="duration-output">${activeSettings.duration}s</output></label><input id="duration" type="range" min="0.1" max="12" step="0.1" value="${activeSettings.duration}"><div class="range-extents"><span>${tr("fastDuration")}</span><span>${tr("slowDuration")}</span></div><label class="range-label" for="delay">${tr("delay")} <output id="delay-output">${activeSettings.delay}s</output></label><input id="delay" type="range" min="0" max="3" step="0.1" value="${activeSettings.delay}"><label class="range-label" for="easing">${tr("easing")}</label><select id="easing" ${item.id === "typewriter" ? "disabled" : ""}>${Object.entries(
      easings,
    )
      .map(
        ([value, name]) =>
          `<option value="${value}" ${activeSettings.easing === value ? "selected" : ""}>${name}</option>`,
      )
      .join(
        "",
      )}</select>${item.id === "typewriter" ? `<small class="control-note">${tr("typewriterNote", { count: item.typingSteps ?? 15 })}</small>` : ""}<div class="settings-bottom"><label class="color-label" for="accent">${tr("accent")} <span><input type="color" id="accent" value="${activeSettings.accent}"><output id="accent-output">${activeSettings.accent}</output></span></label>${item.trigger === "auto" ? `<label class="switch-label" for="loop">${tr("loop")}<input id="loop" type="checkbox" ${activeSettings.loop ? "checked" : ""}><span class="switch"></span></label>` : `<span class="control-note">${tr("hoverNote")}</span>`}</div></div></section>
    <section class="editor-code"><div class="code-panel-header"><span>${icon("code")} ${tr("exportTitle")}</span><span class="dependency-badge">${tr("zeroDependencies")}</span></div><div class="code-tabs" role="tablist" aria-label="${tr("codeFormat")}">${[
      ["html", "HTML + CSS"],
      ["css", "CSS"],
      ["react", "React"],
      ["vue", "Vue"],
    ]
      .map(
        ([value, label]) =>
          `<button role="tab" id="tab-${value}" aria-controls="code-panel" aria-selected="${value === activeFormat}" tabindex="${value === activeFormat ? 0 : -1}" data-format="${value}" class="${value === activeFormat ? "active" : ""}">${label}</button>`,
      )
      .join(
        "",
      )}</div><div class="code-filename"><span id="code-filename">index.html</span><button data-action="copy" class="small-copy">${icon("copy")} ${tr("copy")}</button></div><pre id="code-panel" role="tabpanel" aria-labelledby="tab-html" tabindex="0"><code id="generated-code"></code></pre><div class="code-help" id="code-help"></div><div class="code-panel-footer"><button class="secondary-button" data-action="download">${icon("download")} ${tr("download")}</button><button class="primary-button" data-action="copy">${icon("copy")} ${tr("copyCode")}</button></div><p class="accessibility-note">${icon("check")} ${tr("reducedMotion")}</p></section></div>`;
  updateEditorPreview();
  updateEditorCode();
  updateEditorFavorite();
  $("#editor").append($("#toast"));
}

function updateEditorFavorite() {
  const saved = state.favorites.includes(activeItem.id);
  $("#editor-favorite").innerHTML = icon("bookmark");
  $("#editor-favorite").classList.toggle("saved", saved);
  $("#editor-favorite").setAttribute("aria-pressed", saved);
  $("#editor-favorite").setAttribute(
    "aria-label",
    t(saved ? "unsaveItem" : "saveItem", { name: activeItem.name }),
  );
}

function updateEditorPreview() {
  const scoped = interactivePreviewCSS(
    demoCSS(activeItem, activeSettings),
  ).replaceAll(`.${demoClass(activeItem, activeSettings)}`, "#editor-preview");
  $("#editor-preview").innerHTML = `<style>${scoped}</style>${activeItem.html}`;
  $("#editor-preview").classList.toggle("is-paused", editorPaused);
}

function highlight(code) {
  return escape(code)
    .split("\n")
    .map((line) => {
      if (/^\s*(\/\/|&lt;!--)/.test(line))
        return `<span class="syntax-comment">${line}</span>`;
      return line
        .replace(/(&lt;\/?[\w-]+|&gt;)/g, '<span class="syntax-tag">$1</span>')
        .replace(
          /(&quot;[^&]*?&quot;)/g,
          '<span class="syntax-string">$1</span>',
        )
        .replace(
          /(^\s*[\w-]+)(:)/g,
          '<span class="syntax-property">$1</span>$2',
        );
    })
    .join("\n");
}

function updateEditorCode() {
  $("#generated-code").innerHTML = highlight(
    generateCode(activeItem, activeSettings, activeFormat),
  );
  $("#code-filename").textContent = {
    html: "index.html",
    css: "animation.css",
    react: "MotionDemo.jsx",
    vue: "MotionDemo.vue",
  }[activeFormat];
  $("#code-help").textContent = {
    html: t("helpHtml"),
    css: t("helpCss"),
    react: t("helpReact"),
    vue: t("helpVue"),
  }[activeFormat];
  $$(".code-tabs button").forEach((el) => {
    const selected = el.dataset.format === activeFormat;
    el.classList.toggle("active", selected);
    el.setAttribute("aria-selected", selected);
    el.tabIndex = selected ? 0 : -1;
  });
  $("#code-panel").setAttribute("aria-labelledby", `tab-${activeFormat}`);
}

function closeDialog(id) {
  $(`#${id}`).close();
}

function replayHover(root, duration, delay = 0) {
  const target = root.querySelector("button, a");
  if (!target) return;
  target.classList.add("is-replaying");
  setTimeout(
    () => target.classList.remove("is-replaying"),
    (duration + delay) * 1000 + 650,
  );
}
for (const id of ["editor", "guide"]) {
  const dialog = $(`#${id}`);
  dialog.addEventListener("close", () => {
    document.body.append($("#toast"));
    if (!$("dialog[open]")) document.body.classList.remove("dialog-open");
  });
  dialog.addEventListener("click", (e) => {
    if (e.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      dialog.close();
  });
}

function openGuide() {
  setMenu(false);
  renderGuide();
  $("#guide").showModal();
  document.body.classList.add("dialog-open");
}

function renderGuide() {
  if ($("#guide").contains($("#toast"))) document.body.append($("#toast"));
  $("#guide").innerHTML =
    `<div class="guide-header"><div>${logo}<span class="section-eyebrow">${tr("guideEyebrow")}</span><h2 id="guide-title">${tr("guideTitle")}</h2></div><button class="icon-button" data-action="close-guide" aria-label="${tr("closeGuide")}">${icon("close")}</button></div><p class="guide-intro">${tr("guideIntro")}</p><div class="guide-steps"><div><span>01</span><section><h3>${tr("guideFindTitle")}</h3><p>${tr("guideFind")}</p></section></div><div><span>02</span><section><h3>${tr("guideCustomizeTitle")}</h3><p>${tr("guideCustomize")}</p></section></div><div><span>03</span><section><h3>${tr("guideCopyTitle")}</h3><p>${tr("guideCopy")}</p></section></div></div><div class="guide-note">${icon("info")}<div><strong>${tr("guideNoteTitle")}</strong><p>${tr("guideNote")}</p></div></div><button class="primary-button guide-start" data-action="guide-explore">${tr("guideStart")} ${icon("arrow")}</button>`;
  $("#guide").append($("#toast"));
}

document.addEventListener("click", async (event) => {
  const category = event.target.closest("[data-category]");
  if (category) {
    state.category = category.dataset.category;
    if (category.classList.contains("nav-item")) state.favoritesOnly = false;
    renderCards();
    setMenu(false);
    scrollLibrary();
    return;
  }
  const format = event.target.closest("[data-format]");
  if (format) {
    activeFormat = format.dataset.format;
    updateEditorCode();
    return;
  }
  if (event.target.closest(".demo-content a, #editor-preview a"))
    event.preventDefault();
  const trigger = event.target.closest("[data-action]");
  if (!trigger) return;
  const { action, id } = trigger.dataset;
  if (action === "explore") scrollLibrary();
  if (action === "guide") openGuide();
  if (action === "close-guide") closeDialog("guide");
  if (action === "guide-explore") {
    closeDialog("guide");
    scrollLibrary();
  }
  if (action === "menu") setMenu(true);
  if (action === "close-menu") setMenu(false);
  if (action === "home") {
    event.preventDefault();
    state.category = "all";
    state.query = "";
    state.favoritesOnly = false;
    $("#search").value = "";
    renderCards();
    setMenu(false);
    window.scrollTo({
      top: 0,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }
  if (action === "favorites") {
    state.favoritesOnly = true;
    state.category = "all";
    state.query = "";
    $("#search").value = "";
    renderCards();
    setMenu(false);
    scrollLibrary();
  }
  if (action === "reset-filters") {
    state.category = "all";
    state.query = "";
    state.favoritesOnly = false;
    $("#search").value = "";
    renderCards();
  }
  if (action === "save") toggleFavorite(id);
  if (action === "edit") openEditor(id);
  if (action === "random") {
    const candidates = getAnimations().filter((a) => a.id !== activeItem?.id);
    setMenu(false);
    openEditor(candidates[Math.floor(Math.random() * candidates.length)].id);
  }
  if (action === "close-editor") closeDialog("editor");
  if (action === "theme") {
    state.theme = state.theme === "light" ? "dark" : "light";
    save("pufficss-theme", state.theme);
    document.documentElement.dataset.theme = state.theme;
    trigger.innerHTML = icon(state.theme === "dark" ? "sun" : "moon");
    trigger.setAttribute(
      "aria-label",
      t(state.theme === "dark" ? "lightTheme" : "darkTheme"),
    );
  }
  if (action === "pause") {
    state.paused = !state.paused;
    $("#animation-grid").classList.toggle("is-paused", state.paused);
    trigger.innerHTML = `${icon(state.paused ? "play" : "pause")}<span>${tr(state.paused ? "playAnimations" : "pauseAnimations")}</span>`;
    trigger.setAttribute("aria-pressed", state.paused);
  }
  if (action === "replay") {
    const demo = $(`[data-id="${id}"] .demo-content`);
    const item = getAnimations().find((a) => a.id === id);
    if (item.trigger === "hover") replayHover(demo, item.duration);
    else
      demo.getAnimations({ subtree: true }).forEach((a) => {
        a.currentTime = 0;
      });
  }
  if (action === "editor-replay") {
    updateEditorPreview();
    if (activeItem.trigger === "hover")
      replayHover(
        $("#editor-preview"),
        activeSettings.duration,
        activeSettings.delay,
      );
  }
  if (action === "editor-pause") {
    editorPaused = !editorPaused;
    $("#editor-preview").classList.toggle("is-paused", editorPaused);
    trigger.innerHTML = icon(editorPaused ? "play" : "pause");
    trigger.setAttribute(
      "aria-label",
      t(editorPaused ? "playPreview" : "pausePreview"),
    );
    trigger.setAttribute("aria-pressed", editorPaused);
  }
  if (action === "reset-settings") {
    activeSettings = defaultSettings(activeItem);
    $("#duration").value = activeSettings.duration;
    $("#duration-output").textContent = `${activeSettings.duration}s`;
    $("#delay").value = 0;
    $("#delay-output").textContent = "0s";
    $("#easing").value = activeSettings.easing;
    $("#accent").value = activeSettings.accent;
    $("#accent-output").textContent = activeSettings.accent;
    if ($("#loop")) $("#loop").checked = true;
    updateEditorPreview();
    updateEditorCode();
    toast(t("settingsReset"));
  }
  if (action === "quick-copy") {
    const item = getAnimations().find((a) => a.id === id);
    if (await copyText(generateCode(item)))
      toast(t("quickCopied", { name: item.name }));
  }
  if (action === "copy") {
    if (await copyText(generateCode(activeItem, activeSettings, activeFormat)))
      toast(t("codeCopied"));
  }
  if (action === "download") {
    const code = generateCode(activeItem, activeSettings, activeFormat);
    const blob = new Blob([code], {
      type:
        activeFormat === "html"
          ? "text/html;charset=utf-8"
          : "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = {
      html: `${activeItem.id}.html`,
      css: `${activeItem.id}.css`,
      react: "MotionDemo.jsx",
      vue: "MotionDemo.vue",
    }[activeFormat];
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast(t("codeDownloaded"));
  }
});

document.addEventListener("input", (event) => {
  if (event.target.id === "search") {
    state.query = event.target.value;
    renderCards();
  }
});
document.addEventListener("change", (event) => {
  if (event.target.id === "sort") {
    state.sort = event.target.value;
    renderCards();
  }
  if (event.target.id === "language-select") {
    const persisted = setLocale(event.target.value);
    toast(
      t("languageChanged", { language: localeNames[getLocale()] }) +
        (persisted ? "" : t("sessionOnly")),
    );
  }
});
document.addEventListener("pufficss:localechange", () => {
  const focused = document.activeElement;
  const focusId = focused?.id;
  const focusAction = focused?.dataset.action;
  const focusItem = focused?.dataset.id;
  const menuOpen = document.body.classList.contains("menu-open");
  const editorOpen = $("#editor").open;
  const guideOpen = $("#guide").open;
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  const editorScroll = $("#editor").scrollTop;
  const codeScroll = $("#code-panel")?.scrollTop;
  const guideScroll = $("#guide").scrollTop;
  clearTimeout(toastTimer);
  $("#toast").classList.remove("visible");
  renderShell();
  if (editorOpen && activeItem) {
    activeItem = getAnimations().find((item) => item.id === activeItem.id);
    renderEditor();
    $("#editor").scrollTop = editorScroll;
    $("#code-panel").scrollTop = codeScroll;
  }
  if (guideOpen) {
    renderGuide();
    $("#guide").scrollTop = guideScroll;
  }
  const focusRoot = editorOpen
    ? $("#editor")
    : guideOpen
      ? $("#guide")
      : document;
  const focusTarget = focusId
    ? focusRoot.querySelector("#" + CSS.escape(focusId))
    : focusAction
      ? [...focusRoot.querySelectorAll("[data-action]")].find(
          (element) =>
            element.dataset.action === focusAction &&
            element.dataset.id === focusItem,
        )
      : menuOpen
        ? $(".brand")
        : null;
  focusTarget?.focus({ preventScroll: true });
  window.scrollTo({ left: scrollX, top: scrollY, behavior: "instant" });
});
$("#editor").addEventListener("input", (event) => {
  const { id, value, checked } = event.target;
  if (id === "duration" || id === "delay") {
    activeSettings[id] = Number(value);
    $(`#${id}-output`).textContent = `${value}s`;
  } else if (id === "easing") activeSettings.easing = value;
  else if (id === "accent") {
    activeSettings.accent = value;
    $("#accent-output").textContent = value;
  } else if (id === "loop") activeSettings.loop = checked;
  else return;
  updateEditorPreview();
  updateEditorCode();
});

document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    if (!$("dialog[open]")) {
      $("#search").focus();
      scrollLibrary();
    }
  }
  if (event.key === "Escape") setMenu(false);
  if (
    event.target.matches('.code-tabs [role="tab"]') &&
    ["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)
  ) {
    event.preventDefault();
    const tabs = $$(".code-tabs button");
    const index = tabs.indexOf(event.target);
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? tabs.length - 1
          : (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) %
            tabs.length;
    activeFormat = tabs[next].dataset.format;
    updateEditorCode();
    tabs[next].focus();
  }
});

renderShell();
setMenu(false);
