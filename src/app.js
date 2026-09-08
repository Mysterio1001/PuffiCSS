import { animations, categories, easings, defaultSettings, settingsStyle, demoClass, demoCSS, generateCode, filterAnimations } from './catalog.js';
import { icon, logo } from './icons.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
function readSaved(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }
function save(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; } }
// Keep existing collections and theme when upgrading from the previous name.
const savedFavorites = readSaved('pufficss-favorites', readSaved('motionkit-favorites', []));
const state = {
  category: 'all', query: '', favoritesOnly: false, sort: 'featured',
  favorites: Array.isArray(savedFavorites) ? savedFavorites.filter(id => animations.some(a => a.id === id)) : [],
  theme: readSaved('pufficss-theme', readSaved('motionkit-theme', 'light')) === 'dark' ? 'dark' : 'light',
  paused: matchMedia('(prefers-reduced-motion: reduce)').matches,
};
save('pufficss-favorites', state.favorites);
save('pufficss-theme', state.theme);
let activeItem = null;
let activeSettings = null;
let activeFormat = 'html';
let editorPaused = false;
let toastTimer;
const previewStyle = document.createElement('style');
const interactivePreviewCSS = css => css.replaceAll(':hover, :focus-visible', ':hover, :focus-visible, .is-replaying');
previewStyle.textContent = animations.map(a => interactivePreviewCSS(a.css)).join('\n');
document.head.append(previewStyle);
document.documentElement.dataset.theme = state.theme;

$('#app').innerHTML = `
  <div class="sidebar-overlay" data-action="close-menu"></div>
  <aside class="sidebar" aria-label="主要導覽">
    <a class="brand" href="#" data-action="home" aria-label="PuffiCSS 首頁">${logo}<span>Puffi<span class="brand-css">CSS</span></span></a>
    <div class="workspace-label"><span class="workspace-symbol">P</span><div>輕巧的網頁動效庫<small>A little puff of motion</small></div><span class="version">v1.0</span></div>
    <div class="nav-label">探索靈感 <span>EXPLORE</span></div>
    <nav class="category-nav">${categories.map(c => `<button class="nav-item ${c.id === 'all' ? 'active' : ''}" data-category="${c.id}">${icon(c.icon)}<span>${c.name}</span><small>${c.id === 'all' ? animations.length : animations.filter(a => a.category === c.id).length}</small></button>`).join('')}</nav>
    <div class="nav-divider"></div>
    <div class="nav-label">我的工作空間 <span>WORKSPACE</span></div>
    <button class="nav-item" data-action="favorites">${icon('bookmark')}<span>我的收藏</span><small id="favorite-count">${state.favorites.length}</small></button>
    <button class="nav-item" data-action="guide">${icon('book')}<span>使用指南</span>${icon('arrowUp', 'nav-external')}</button>
    <div class="sidebar-bottom">
      <div class="sidebar-note"><span class="note-mascot">${logo}</span><strong>小小動效，大大不同。</strong><p>讓介面多一點個性，<br>讓靈感少一點距離。</p><button data-action="random">給我一點靈感 ${icon('arrow')}</button></div>
      <div class="sidebar-footer"><span><i></i> Made for makers</span><button class="icon-button theme-button" data-action="theme" aria-label="${state.theme === 'dark' ? '切換淺色模式' : '切換深色模式'}">${icon(state.theme === 'dark' ? 'sun' : 'moon')}</button></div>
    </div>
  </aside>
  <div class="page">
    <header class="topbar">
      <div class="breadcrumb"><button class="icon-button mobile-menu" data-action="menu" aria-label="開啟導覽" aria-expanded="false">${icon('menu')}</button><span class="breadcrumb-home">資源庫</span><span class="breadcrumb-slash">/</span><strong id="breadcrumb-current">全部動畫</strong></div>
      <div class="topbar-right"><span class="free-note"><span></span> 免費使用，持續更新</span><button class="guide-link" data-action="guide">快速開始 ${icon('arrowUp')}</button></div>
    </header>
    <main id="main">
      <section class="hero" aria-labelledby="hero-title">
        <div class="hero-copy"><div class="eyebrow"><span class="eyebrow-dot"></span> A LITTLE MOTION. A LOT OF POSSIBILITIES.</div><h1 id="hero-title">讓好設計，<br><span>動起來。</span><svg class="hero-underline" viewBox="0 0 230 15" fill="none" aria-hidden="true"><path d="M3 11Q105 -4 224 7" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></svg></h1><p>找到剛剛好的動效，為你的網頁注入個性。<br>即時預覽、自由調整，一鍵帶走程式碼。</p><div class="hero-actions"><button class="primary-button" data-action="explore">探索動畫 ${icon('arrowDown')}</button><span>靈感到實作，只差一個 copy。</span></div></div>
        <div class="hero-art" aria-hidden="true"><div class="orbit-ring ring-one"></div><div class="orbit-ring ring-two"></div><span class="art-spark spark-one">✦</span><span class="art-spark spark-two">✧</span><div class="art-motion-card"><div class="art-card-top"><span><i></i>puffi.play</span><span>•••</span></div><div class="art-shape">${logo}</div><div class="art-card-bottom"><span>Make it move.</span><span>↗</span></div></div><div class="art-code-card"><div><i></i><i></i><i></i><small>just add motion</small></div><code><em>transform</em>: translateY(<b>−8px</b>);<br><em>transition</em>: all <b>0.3s</b> ease;</code></div><div class="art-hover-button">hover me ${icon('pointer')}</div><div class="art-caption"><i></i> Small details. Big feelings.</div></div>
      </section>
      <div class="benefits"><span>${icon('bolt')} 輕量，零套件依賴</span><span>${icon('sliders')} 即時調整，所見即所得</span><span>${icon('code')} HTML / CSS / React / Vue</span><span>${icon('check')} 自由使用，包含商業專案</span></div>
      <section class="library" id="library" aria-labelledby="library-title">
        <div class="library-heading"><div><div class="section-eyebrow">THE MOTION COLLECTION</div><h2 id="library-title">一點動態，無限靈感<span id="result-total">${animations.length}</span></h2><p id="library-description">挑一個喜歡的，讓你的下一個作品與眾不同。</p></div><label class="search-box">${icon('search')}<input id="search" type="search" placeholder="搜尋動畫、效果、關鍵字…" aria-label="搜尋動畫" autocomplete="off"><kbd>⌘ K</kbd></label></div>
        <div class="filter-bar"><div class="filter-tabs" role="group" aria-label="動畫分類">${categories.map(c => `<button class="filter-tab ${c.id === 'all' ? 'selected' : ''}" data-category="${c.id}" aria-pressed="${c.id === 'all'}">${c.id === 'all' ? icon('grid') : ''}${c.id === 'all' ? '全部' : c.name}</button>`).join('')}</div><div class="sort-wrap"><label for="sort">排序</label><select id="sort" aria-label="動畫排序"><option value="featured">精選推薦</option><option value="newest">最新加入</option><option value="name">名稱 A–Z</option></select>${icon('chevron')}</div></div>
        <div class="library-status"><span id="result-label">為你的介面，找到剛剛好的動感</span><button class="play-toggle" data-action="pause" aria-pressed="${state.paused}">${icon(state.paused ? 'play' : 'pause')}<span>${state.paused ? '播放動畫' : '暫停動畫'}</span></button></div>
        <div class="animation-grid ${state.paused ? 'is-paused' : ''}" id="animation-grid"></div>
        <div class="collection-end"><span class="collection-mascot">${logo}</span><p>好設計，藏在每一個細節裡。</p><span>KEEP EXPLORING. KEEP CREATING.</span></div>
      </section>
      <footer class="main-footer">
        <a class="footer-brand" href="#" data-action="home">${logo}<span>Puffi<span class="brand-css">CSS</span></span></a>
        <span>用一點點動態，創造多一點驚喜。</span>
        <button data-action="guide">如何使用 ${icon('arrowUp')}</button>
        <div class="developer-info" aria-label="開發者與聯繫方式">
          <div class="developer-credit"><span class="developer-label">開發者</span><strong>交給我科技工作室</strong><span class="developer-english" lang="en">handlebyme.tech</span></div>
          <div class="developer-contact"><span class="developer-label">聯繫方式</span><a href="mailto:handlebyme.tech@gmail.com">handlebyme.tech@gmail.com</a></div>
        </div>
      </footer>
    </main>
  </div>`;

function toast(message) {
  const el = $('#toast');
  el.innerHTML = `${icon('check')}<span>${escape(message)}</span>`;
  el.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('visible'), 3000);
}

function card(item) {
  const saved = state.favorites.includes(item.id);
  return `<article class="animation-card" data-id="${item.id}">
    <div class="card-preview" style="background:${item.color}; ${settingsStyle(defaultSettings(item))}">
      <div class="card-badges">${item.badge ? `<span class="badge ${item.badge === '熱門' ? 'badge-hot' : ''}">${item.badge === '熱門' ? icon('bolt') : icon('sparkles')}${item.badge}</span>` : ''}</div>
      <button class="favorite-button ${saved ? 'saved' : ''}" data-action="save" data-id="${item.id}" aria-pressed="${saved}" aria-label="${saved ? '取消收藏' : '收藏'}${item.name}">${icon('bookmark')}</button>
      <div class="demo-content">${item.html}</div>
      <span class="preview-hint">${icon(item.trigger === 'hover' ? 'pointer' : 'play')}${item.trigger === 'hover' ? '移入試試' : '即時預覽'}</span>
      <button class="replay-button" data-action="replay" data-id="${item.id}" aria-label="重播${item.name}">${icon('replay')}</button>
    </div>
    <div class="card-details"><div class="card-title-row"><button class="card-title" data-action="edit" data-id="${item.id}"><h3>${item.name}</h3><span>${item.english}</span></button><button class="quick-copy" data-action="quick-copy" data-id="${item.id}" aria-label="複製${item.name}程式碼" title="複製 HTML + CSS">${icon('copy')}</button></div><div class="card-bottom"><div class="tags">${item.tags.map(t => `<span>${t}</span>`).join('')}</div><button class="code-link" data-action="edit" data-id="${item.id}">${icon('code')}<span>取得程式碼</span>${icon('arrow', 'code-arrow')}</button></div></div>
  </article>`;
}

const observer = new IntersectionObserver(entries => {
  for (const entry of entries) entry.target.classList.toggle('offscreen', !entry.isIntersecting);
}, { rootMargin: '140px' });

function renderCards() {
  observer.disconnect();
  const items = filterAnimations(state);
  $('#animation-grid').innerHTML = items.length ? items.map(card).join('') : `<div class="empty-state">${icon(state.favoritesOnly ? 'bookmark' : 'search')}<h3>${state.favoritesOnly && !state.favorites.length ? '把喜歡的靈感，留在這裡。' : '還沒找到符合的動畫'}</h3><p>${state.favoritesOnly && !state.favorites.length ? '點擊動畫右上角的收藏圖示，建立你的專屬靈感庫。' : '換個關鍵字，或看看其他分類的靈感。'}</p><button class="secondary-button" data-action="reset-filters">探索全部動畫 ${icon('arrow')}</button></div>`;
  $$('.animation-card').forEach(el => observer.observe(el));
  $('#result-total').textContent = items.length;
  $('#result-label').textContent = state.query || state.category !== 'all' || state.favoritesOnly ? `共 ${items.length} 個動畫${state.query ? ` · 搜尋「${state.query}」` : ''}` : '為你的介面，找到剛剛好的動感';
  $('#favorite-count').textContent = state.favorites.length;
  $('#library-title').firstChild.textContent = state.favoritesOnly ? '你的專屬靈感庫' : state.category === 'all' ? '一點動態，無限靈感' : categories.find(c => c.id === state.category).name;
  $('#library-description').textContent = state.favoritesOnly ? '喜歡的動效，隨時回來接著探索。' : '挑一個喜歡的，讓你的下一個作品與眾不同。';
  $('#breadcrumb-current').textContent = state.favoritesOnly ? '我的收藏' : categories.find(c => c.id === state.category).name;
  $$('.nav-item[data-category]').forEach(el => { const active = el.dataset.category === state.category && !state.favoritesOnly; el.classList.toggle('active', active); el.setAttribute('aria-current', active ? 'page' : 'false'); });
  $('.nav-item[data-action="favorites"]').classList.toggle('active', state.favoritesOnly);
  $$('.filter-tab').forEach(el => { el.classList.toggle('selected', el.dataset.category === state.category); el.setAttribute('aria-pressed', el.dataset.category === state.category); });
}

function scrollLibrary() { $('#library').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' }); }

const mobileLayout = matchMedia('(max-width: 700px)');
function setMenu(open) {
  const wasOpen = document.body.classList.contains('menu-open');
  document.body.classList.toggle('menu-open', open);
  $('.sidebar').inert = mobileLayout.matches && !open;
  $('.mobile-menu').setAttribute('aria-expanded', open);
  if (open) $('.brand').focus();
  else if (wasOpen) $('.mobile-menu').focus();
}
mobileLayout.addEventListener('change', () => setMenu(false));
setMenu(false);

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.cssText = 'position:fixed;left:0;top:0;opacity:0;pointer-events:none;';
    const parent = $('#editor').open ? $('#editor') : document.body;
    parent.append(textarea); textarea.select();
    const copied = document.execCommand('copy'); textarea.remove();
    if (copied) return true;
    toast('無法存取剪貼簿，請選取程式碼後手動複製。');
    return false;
  }
}

function toggleFavorite(id) {
  state.favorites = state.favorites.includes(id) ? state.favorites.filter(x => x !== id) : [...state.favorites, id];
  const persisted = save('pufficss-favorites', state.favorites);
  renderCards();
  if (activeItem?.id === id && $('#editor').open) updateEditorFavorite();
  toast(`${state.favorites.includes(id) ? '已加入我的收藏' : '已從收藏移除'}${persisted ? '' : '（目前僅保留在本次瀏覽）'}`);
}

function openEditor(id) {
  activeItem = animations.find(item => item.id === id);
  activeSettings = defaultSettings(activeItem);
  activeFormat = 'html'; editorPaused = false;
  const item = activeItem;
  $('#editor').innerHTML = `<div class="editor-header"><div><span class="section-eyebrow">MAKE IT YOURS</span><h2 id="editor-title">${item.name}<span>${item.english}</span></h2></div><button class="icon-button close-dialog" data-action="close-editor" aria-label="關閉編輯器">${icon('close')}</button></div>
    <div class="editor-body"><section class="editor-controls"><div class="editor-preview-toolbar"><span><i></i> 即時預覽</span><div><button class="icon-button" data-action="editor-pause" aria-label="暫停預覽" aria-pressed="false">${icon('pause')}</button><button class="icon-button" data-action="editor-replay" aria-label="重播預覽">${icon('replay')}</button><button class="icon-button" id="editor-favorite" data-action="save" data-id="${id}"></button></div></div><div id="editor-preview" class="mk-demo"></div><p class="editor-description">${item.description}</p><div class="controls-title">${icon('sliders')} 調整動畫<button data-action="reset-settings">重設</button></div><div class="settings-grid"><label class="range-label" for="duration">動畫時間 <output id="duration-output">${item.duration}s</output></label><input id="duration" type="range" min="0.1" max="12" step="0.1" value="${item.duration}"><div class="range-extents"><span>0.1s · 俐落</span><span>12s · 從容</span></div><label class="range-label" for="delay">延遲時間 <output id="delay-output">0s</output></label><input id="delay" type="range" min="0" max="3" step="0.1" value="0"><label class="range-label" for="easing">緩動曲線</label><select id="easing" ${item.id === 'typewriter' ? 'disabled' : ''}>${Object.entries(easings).map(([value, name]) => `<option value="${value}" ${activeSettings.easing === value ? 'selected' : ''}>${name}</option>`).join('')}</select>${item.id === 'typewriter' ? '<small class="control-note">打字機使用固定 steps(15) 逐字顯示。</small>' : ''}<div class="settings-bottom"><label class="color-label" for="accent">主題色 <span><input type="color" id="accent" value="${item.accent}"><output id="accent-output">${item.accent}</output></span></label>${item.trigger === 'auto' ? '<label class="switch-label" for="loop">循環播放<input id="loop" type="checkbox" checked><span class="switch"></span></label>' : '<span class="control-note">移入或聚焦即可觸發</span>'}</div></div></section>
    <section class="editor-code"><div class="code-panel-header"><span>${icon('code')} 帶走這個動效</span><span class="dependency-badge">零依賴</span></div><div class="code-tabs" role="tablist" aria-label="程式碼格式">${[['html', 'HTML + CSS'], ['css', 'CSS'], ['react', 'React'], ['vue', 'Vue']].map(([value, label]) => `<button role="tab" id="tab-${value}" aria-controls="code-panel" aria-selected="${value === 'html'}" tabindex="${value === 'html' ? 0 : -1}" data-format="${value}" class="${value === 'html' ? 'active' : ''}">${label}</button>`).join('')}</div><div class="code-filename"><span id="code-filename">index.html</span><button data-action="copy" class="small-copy">${icon('copy')} 複製</button></div><pre id="code-panel" role="tabpanel" aria-labelledby="tab-html" tabindex="0"><code id="generated-code"></code></pre><div class="code-help" id="code-help"></div><div class="code-panel-footer"><button class="secondary-button" data-action="download">${icon('download')} 下載</button><button class="primary-button" data-action="copy">${icon('copy')} 複製程式碼</button></div><p class="accessibility-note">${icon('check')} 已內建「減少動態效果」偏好支援</p></section></div>`;
  updateEditorPreview(); updateEditorCode(); updateEditorFavorite();
  $('#editor').append($('#toast'));
  $('#editor').showModal();
  document.body.classList.add('dialog-open');
}

function updateEditorFavorite() {
  const saved = state.favorites.includes(activeItem.id);
  $('#editor-favorite').innerHTML = icon('bookmark');
  $('#editor-favorite').classList.toggle('saved', saved);
  $('#editor-favorite').setAttribute('aria-pressed', saved);
  $('#editor-favorite').setAttribute('aria-label', saved ? '取消收藏' : '收藏動畫');
}

function updateEditorPreview() {
  const scoped = interactivePreviewCSS(demoCSS(activeItem, activeSettings)).replaceAll(`.${demoClass(activeItem, activeSettings)}`, '#editor-preview');
  $('#editor-preview').innerHTML = `<style>${scoped}</style>${activeItem.html}`;
  $('#editor-preview').classList.toggle('is-paused', editorPaused);
}

function highlight(code) {
  return escape(code).split('\n').map(line => {
    if (/^\s*(\/\/|&lt;!--)/.test(line)) return `<span class="syntax-comment">${line}</span>`;
    return line.replace(/(&lt;\/?[\w-]+|&gt;)/g, '<span class="syntax-tag">$1</span>').replace(/(&quot;[^&]*?&quot;)/g, '<span class="syntax-string">$1</span>').replace(/(^\s*[\w-]+)(:)/g, '<span class="syntax-property">$1</span>$2');
  }).join('\n');
}

function updateEditorCode() {
  $('#generated-code').innerHTML = highlight(generateCode(activeItem, activeSettings, activeFormat));
  $('#code-filename').textContent = { html: 'index.html', css: 'animation.css', react: 'MotionDemo.jsx', vue: 'MotionDemo.vue' }[activeFormat];
  $('#code-help').textContent = { html: '完整 HTML 範例，另存為 .html 即可用瀏覽器開啟。', css: '將這段 CSS 搭配「HTML + CSS」分頁中的 body 內容使用。', react: '存成 MotionDemo.jsx，在 React 專案中 import 並使用 <MotionDemo />。', vue: '存成 MotionDemo.vue，在 Vue 專案中 import 並使用 <MotionDemo />。' }[activeFormat];
  $$('.code-tabs button').forEach(el => { const selected = el.dataset.format === activeFormat; el.classList.toggle('active', selected); el.setAttribute('aria-selected', selected); el.tabIndex = selected ? 0 : -1; });
  $('#code-panel').setAttribute('aria-labelledby', `tab-${activeFormat}`);
}

function closeDialog(id) { $(`#${id}`).close(); }

function replayHover(root, duration, delay = 0) {
  const target = root.querySelector('button, a');
  if (!target) return;
  target.classList.add('is-replaying');
  setTimeout(() => target.classList.remove('is-replaying'), (duration + delay) * 1000 + 650);
}
for (const id of ['editor', 'guide']) {
  const dialog = $(`#${id}`);
  dialog.addEventListener('close', () => { document.body.append($('#toast')); if (!$('dialog[open]')) document.body.classList.remove('dialog-open'); });
  dialog.addEventListener('click', e => { if (e.target !== dialog) return; const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); });
}

function openGuide() {
  setMenu(false);
  $('#guide').innerHTML = `<div class="guide-header"><div>${logo}<span class="section-eyebrow">FROM INSPIRATION TO INTERACTION</span><h2 id="guide-title">好動效，三步就到位。</h2></div><button class="icon-button" data-action="close-guide" aria-label="關閉使用指南">${icon('close')}</button></div><p class="guide-intro">每個範例都能獨立使用，挑個喜歡的，放進你的下一個作品。</p><div class="guide-steps"><div><span>01</span><section><h3>找到你的靈感</h3><p>依分類瀏覽或用中英文搜尋。標示「移入試試」的動畫，將滑鼠移到元素上或以鍵盤聚焦即可體驗；其他動畫會自動播放。</p></section></div><div><span>02</span><section><h3>調成你的樣子</h3><p>點擊「取得程式碼」，調整動畫時間、延遲、緩動曲線與顏色。預覽與程式碼會同步更新；關閉循環後可用重播按鈕再看一次。</p></section></div><div><span>03</span><section><h3>複製，貼上，動起來</h3><p>選擇 HTML + CSS、CSS、React 或 Vue 格式，再按「複製程式碼」。完整 HTML 可直接另存開啟；React 與 Vue 範例可匯入現有專案。</p></section></div></div><div class="guide-note">${icon('info')}<div><strong>自由創作，也照顧每一位使用者。</strong><p>本站自製動畫以 MIT 授權提供，可用於商業專案。匯出內容支援減少動態效果偏好。收藏與主題保存在目前瀏覽器，不需帳號。</p></div></div><button class="primary-button guide-start" data-action="guide-explore">開始探索 ${icon('arrow')}</button>`;
  $('#guide').append($('#toast'));
  $('#guide').showModal(); document.body.classList.add('dialog-open');
}

document.addEventListener('click', async event => {
  const category = event.target.closest('[data-category]');
  if (category) {
    state.category = category.dataset.category;
    if (category.classList.contains('nav-item')) state.favoritesOnly = false;
    renderCards(); setMenu(false); scrollLibrary(); return;
  }
  const format = event.target.closest('[data-format]');
  if (format) { activeFormat = format.dataset.format; updateEditorCode(); return; }
  if (event.target.closest('.demo-content a, #editor-preview a')) event.preventDefault();
  const trigger = event.target.closest('[data-action]');
  if (!trigger) return;
  const { action, id } = trigger.dataset;
  if (action === 'explore') scrollLibrary();
  if (action === 'guide') openGuide();
  if (action === 'close-guide') closeDialog('guide');
  if (action === 'guide-explore') { closeDialog('guide'); scrollLibrary(); }
  if (action === 'menu') setMenu(true);
  if (action === 'close-menu') setMenu(false);
  if (action === 'home') { event.preventDefault(); state.category = 'all'; state.query = ''; state.favoritesOnly = false; $('#search').value = ''; renderCards(); setMenu(false); window.scrollTo({top:0, behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'}); }
  if (action === 'favorites') { state.favoritesOnly = true; state.category = 'all'; state.query = ''; $('#search').value = ''; renderCards(); setMenu(false); scrollLibrary(); }
  if (action === 'reset-filters') { state.category = 'all'; state.query = ''; state.favoritesOnly = false; $('#search').value = ''; renderCards(); }
  if (action === 'save') toggleFavorite(id);
  if (action === 'edit') openEditor(id);
  if (action === 'random') { const candidates = animations.filter(a => a.id !== activeItem?.id); setMenu(false); openEditor(candidates[Math.floor(Math.random() * candidates.length)].id); }
  if (action === 'close-editor') closeDialog('editor');
  if (action === 'theme') { state.theme = state.theme === 'light' ? 'dark' : 'light'; save('pufficss-theme', state.theme); document.documentElement.dataset.theme = state.theme; trigger.innerHTML = icon(state.theme === 'dark' ? 'sun' : 'moon'); trigger.setAttribute('aria-label', state.theme === 'dark' ? '切換淺色模式' : '切換深色模式'); }
  if (action === 'pause') { state.paused = !state.paused; $('#animation-grid').classList.toggle('is-paused', state.paused); trigger.innerHTML = `${icon(state.paused ? 'play' : 'pause')}<span>${state.paused ? '播放動畫' : '暫停動畫'}</span>`; trigger.setAttribute('aria-pressed', state.paused); }
  if (action === 'replay') { const demo = $(`[data-id="${id}"] .demo-content`); const item = animations.find(a => a.id === id); if (item.trigger === 'hover') replayHover(demo, item.duration); else demo.getAnimations({ subtree: true }).forEach(a => { a.currentTime = 0; }); }
  if (action === 'editor-replay') { updateEditorPreview(); if (activeItem.trigger === 'hover') replayHover($('#editor-preview'), activeSettings.duration, activeSettings.delay); }
  if (action === 'editor-pause') { editorPaused = !editorPaused; $('#editor-preview').classList.toggle('is-paused', editorPaused); trigger.innerHTML = icon(editorPaused ? 'play' : 'pause'); trigger.setAttribute('aria-label', editorPaused ? '播放預覽' : '暫停預覽'); trigger.setAttribute('aria-pressed', editorPaused); }
  if (action === 'reset-settings') { activeSettings = defaultSettings(activeItem); $('#duration').value = activeSettings.duration; $('#duration-output').textContent = `${activeSettings.duration}s`; $('#delay').value = 0; $('#delay-output').textContent = '0s'; $('#easing').value = activeSettings.easing; $('#accent').value = activeSettings.accent; $('#accent-output').textContent = activeSettings.accent; if ($('#loop')) $('#loop').checked = true; updateEditorPreview(); updateEditorCode(); toast('已還原預設效果'); }
  if (action === 'quick-copy') { const item = animations.find(a => a.id === id); if (await copyText(generateCode(item))) toast(`已複製「${item.name}」HTML + CSS`); }
  if (action === 'copy') { if (await copyText(generateCode(activeItem, activeSettings, activeFormat))) toast('程式碼已複製，讓靈感動起來！'); }
  if (action === 'download') { const code = generateCode(activeItem, activeSettings, activeFormat); const blob = new Blob([code], { type: activeFormat === 'html' ? 'text/html;charset=utf-8' : 'text/plain;charset=utf-8' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = { html: `${activeItem.id}.html`, css: `${activeItem.id}.css`, react: 'MotionDemo.jsx', vue: 'MotionDemo.vue' }[activeFormat]; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); toast('已下載程式碼'); }
});

$('#search').addEventListener('input', event => { state.query = event.target.value; renderCards(); });
$('#sort').addEventListener('change', event => { state.sort = event.target.value; renderCards(); });
$('#editor').addEventListener('input', event => {
  const { id, value, checked } = event.target;
  if (id === 'duration' || id === 'delay') { activeSettings[id] = Number(value); $(`#${id}-output`).textContent = `${value}s`; }
  else if (id === 'easing') activeSettings.easing = value;
  else if (id === 'accent') { activeSettings.accent = value; $('#accent-output').textContent = value; }
  else if (id === 'loop') activeSettings.loop = checked;
  else return;
  updateEditorPreview(); updateEditorCode();
});

document.addEventListener('keydown', event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); if (!$('dialog[open]')) { $('#search').focus(); scrollLibrary(); } }
  if (event.key === 'Escape') setMenu(false);
  if (event.target.matches('.code-tabs [role="tab"]') && ['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) {
    event.preventDefault(); const tabs = $$('.code-tabs button'); const index = tabs.indexOf(event.target); const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    activeFormat = tabs[next].dataset.format; updateEditorCode(); tabs[next].focus();
  }
});

renderCards();
