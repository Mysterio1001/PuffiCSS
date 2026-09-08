[English](README.md) · **繁體中文** · [日本語](README.ja.md)

# PuffiCSS｜輕巧的網頁動效庫

網頁動畫靈感庫。使用原生 HTML、CSS 與 JavaScript，無需安裝前端套件。

## 提供的功能

- 18 種本專案撰寫的動畫範例，分為微互動、文字、進場、背景、載入與強調效果。
- 即時預覽、暫停、重播，以及英文、繁體中文與日文關鍵字搜尋。
- 分類、排序、收藏、隨機靈感與使用指南。
- 編輯動畫時間、延遲、緩動曲線、主題色及循環播放；打字機使用固定 `steps` 節奏。
- 複製或下載完整 HTML + CSS、CSS、React JSX 或 Vue SFC。
- 同頁引用不同設定的動效時，樣式彼此隔離。
- 關閉循環後，進場與文字動畫保留最後的可見內容。
- 淺色／深色主題、手機導覽、鍵盤操作、減少動態效果偏好支援。
- 預設為英文，可透過頁首的語言選單切換 English、繁體中文與日本語。
- 語言、收藏與主題偏好儲存在目前瀏覽器，不需帳號；沒有後端與跨裝置同步。

## 引用動畫

點擊卡片的「取得程式碼」，調整參數並選擇格式。

| 格式       | 使用方式 |
| ---------- | -------- |
| HTML + CSS | 完整獨立頁面，儲存為 `.html` 即可開啟；嵌入既有頁面時取出 `style` 與 `body` 內容。 |
| CSS        | 搭配 HTML + CSS 分頁中的 `body` 標記，保留完整的容器 class。 |
| React      | 儲存為 `MotionDemo.jsx`，匯入後使用 `<MotionDemo />`。需要既有 React 專案。 |
| Vue        | 儲存為 `MotionDemo.vue`，匯入後使用 `<MotionDemo />`。需要既有 Vue 專案。 |

動畫範例本身不連線至任何 CDN。網站字型使用 Google Fonts，無網路時會使用系統字型。

## 授權

MIT License；可用於個人與商業專案，完整條款見 [LICENSE](LICENSE)。

開發者：交給我科技工作室 · handlebyme.tech

聯繫方式：[contact@handlebyme.com](mailto:contact@handlebyme.com)
