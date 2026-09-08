# PuffiCSS｜輕巧的網頁動效庫

繁體中文的網頁動畫靈感庫。使用原生 HTML、CSS 與 JavaScript，無需安裝前端套件。

## 本機啟動

需要 Node.js 18 或以上版本。在本資料夾執行：

```sh
npm run dev
```

開啟 http://localhost:4173。伺服器僅綁定本機，不會公開網站。

若要更換連接埠：

```sh
PORT=5173 npm run dev
```

## 提供的功能

- 18 種本專案撰寫的動畫範例，分為微互動、文字、進場、背景、載入與強調效果。
- 即時預覽、暫停、重播，以及中英文關鍵字搜尋。
- 分類、排序、收藏、隨機靈感與使用指南。
- 編輯動畫時間、延遲、緩動曲線、主題色及循環播放；打字機使用固定 steps 節奏。
- 複製或下載完整 HTML + CSS、CSS、React JSX 或 Vue SFC。
- 同頁引用不同設定的動效時，樣式彼此隔離。
- 關閉循環後，進場與文字動畫保留最後的可見內容。
- 淺色／深色主題、手機導覽、鍵盤操作、減少動態效果偏好支援。
- 收藏與主題儲存在目前瀏覽器，不需帳號；沒有後端與跨裝置同步。

## 引用動畫

點擊卡片的「取得程式碼」，調整參數並選擇格式。

| 格式 | 使用方式 |
| --- | --- |
| HTML + CSS | 完整獨立頁面，儲存為 `.html` 即可開啟；嵌入既有頁面時取出 style 與 body 內容。 |
| CSS | 搭配 HTML + CSS 分頁中的 body 標記，保留完整的容器 class。 |
| React | 儲存為 `MotionDemo.jsx`，匯入後使用 `<MotionDemo />`。需要既有 React 專案。 |
| Vue | 儲存為 `MotionDemo.vue`，匯入後使用 `<MotionDemo />`。需要既有 Vue 專案。 |

動畫範例本身不連線至任何 CDN。網站字型使用 Google Fonts，無網路時會使用系統字型。

## 發布靜態網站

```sh
npm run build
```

將 `dist/` 的全部內容交給支援 HTTPS 的靜態網站服務即可。此交付版本沒有部署到公開網址。

## 驗證

```sh
npm test
```

8 項自動化測試涵蓋搜尋、分類、收藏篩選、排序、72 種匯出組合、參數、自訂版本隔離與單次進場。

啟動網站後可開啟 http://localhost:4173/tests/browser-exports.html，執行 24 項瀏覽器驗證：18 個獨立 HTML 範例、5 種單次進場結尾，以及同頁不同參數的隔離。減少動態效果驗證會將匯出媒體查詢的實際宣告套用至測試頁，檢查靜態回退。

已實測搜尋、分類、收藏重新載入後保存、React／Vue 剪貼簿內容、HTML 下載、重設、手機指南操作，以及 320／390／768／1280px 響應式尺寸。React／Vue 已完成產出內容檢查，未執行框架編譯或框架執行環境測試；額外驗證套件的網路安裝遭自動核准檢查拒絕。

## 檔案

- `src/catalog.js`：動畫資料、CSS、篩選邏輯與各格式匯出。
- `src/app.js`：介面、編輯器、收藏、剪貼簿與下載操作。
- `src/styles.css`：介面樣式與響應式版面。
- `src/icons.js`：介面 SVG 圖示。
- `src/brand.js`：河豚品牌圖示的共用向量來源。
- `assets/pufficss-mark.svg`：可獨立使用的河豚標誌，建置時同步產生分頁圖示。
- `server.mjs`：本機開發伺服器。
- `build.mjs`：靜態網站輸出。
- `tests/`：可重跑的資料與瀏覽器測試。

新增動畫時，在 `src/catalog.js` 的 `animations` 加入定義即可。CSS 使用 `--mk-duration`、`--mk-delay`、`--mk-easing`、`--mk-accent` 變數，根 class 需為 `mk-` 加動畫 id。

## 授權

MIT License；可用於個人與商業專案，完整條款見 `LICENSE`。

開發者：交給我科技工作室 handlebyme.tech  
聯繫方式：handlebyme.tech@gmail.com
