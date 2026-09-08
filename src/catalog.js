import { getLocale, normalizeLocale, supportedLocales } from './i18n.js';
import { catalogLocales } from './locales/catalog.js';

export const categories = [
  { id: 'all', name: '全部動畫', icon: 'grid' },
  { id: 'interaction', name: '微互動', icon: 'pointer' },
  { id: 'text', name: '文字效果', icon: 'type' },
  { id: 'entrance', name: '進場動畫', icon: 'layers' },
  { id: 'background', name: '背景效果', icon: 'orb' },
  { id: 'loading', name: '載入動畫', icon: 'loader' },
  { id: 'attention', name: '強調效果', icon: 'sparkles' },
];

export const animations = [
  {
    id: 'lift-button', name: '輕盈懸浮按鈕', english: 'Lift & glow', category: 'interaction',
    description: '滑鼠移入時輕輕上浮，讓每一次點擊都有被回應的感覺。適合主要操作與行動呼籲。',
    tags: ['Hover', 'Button'], color: '#eeeaf9', accent: '#7357df', duration: 0.4, trigger: 'hover', badge: '熱門',
    html: '<button class="mk-lift-button">Hover me <span aria-hidden="true">↗</span></button>',
    css: `.mk-lift-button { display: flex; align-items: center; gap: 30px; white-space: nowrap; border: 0; border-radius: 12px; padding: 18px 26px; background: var(--mk-accent); color: white; font: 600 16px/1.3 system-ui; cursor: pointer; box-shadow: 0 5px 0 #5135b1, 0 12px 25px #7357df25; transition: transform var(--mk-duration) var(--mk-easing) var(--mk-delay), box-shadow var(--mk-duration) var(--mk-easing) var(--mk-delay); }
.mk-lift-button span { font-size: 23px; font-weight: 400; }
.mk-lift-button:is(:hover, :focus-visible) { transform: translateY(-7px); box-shadow: 0 8px 0 #5135b1, 0 20px 30px #7357df40; }
.mk-lift-button:active { transform: translateY(1px); box-shadow: 0 1px 0 #5135b1; }`,
  },
  {
    id: 'text-reveal', name: '逐字浮現', english: 'Words in motion', category: 'text',
    description: '字母依序從下方浮現，建立自然的閱讀節奏。適合首頁主標題與品牌開場。',
    tags: ['Text', 'Stagger'], color: '#f0f1f4', accent: '#33363f', duration: 3.6, trigger: 'auto', badge: '精選',
    html: '<div class="mk-text-reveal" aria-label="Make it move."><span aria-hidden="true">Make it</span><strong aria-hidden="true"><i>m</i><i>o</i><i>v</i><i>e</i><i>.</i></strong></div>',
    css: `.mk-text-reveal { text-align: center; color: var(--mk-accent); font-family: system-ui; }
.mk-text-reveal > span { display: block; font-size: 22px; font-weight: 500; letter-spacing: -1px; }
.mk-text-reveal strong { display: flex; overflow: hidden; font-size: 64px; line-height: 1.15; letter-spacing: -4px; font-weight: 800; }
.mk-text-reveal i { font-style: normal; animation: mk-word var(--mk-duration) var(--mk-easing) var(--mk-delay) infinite; }
.mk-text-reveal i:nth-child(2) { animation-delay: calc(var(--mk-delay) + .09s); }
.mk-text-reveal i:nth-child(3) { animation-delay: calc(var(--mk-delay) + .18s); }
.mk-text-reveal i:nth-child(4) { animation-delay: calc(var(--mk-delay) + .27s); }
.mk-text-reveal i:nth-child(5) { animation-delay: calc(var(--mk-delay) + .36s); color: #9479ed; }
@keyframes mk-word { 0%, 10% { transform: translateY(110%) rotate(8deg); opacity: 0; } 30%, 80% { transform: translateY(0) rotate(0); opacity: 1; } 95%, 100% { transform: translateY(-110%); opacity: 0; } }`,
  },
  {
    id: 'floating-shapes', name: '柔和漂浮', english: 'A little weightless', category: 'attention',
    description: '幾何圖形緩緩上下浮動，帶來輕盈的空間感。可套用在產品圖片、插圖與裝飾元素。',
    tags: ['Float', 'Loop'], color: '#eaf3f1', accent: '#4a9687', duration: 4, trigger: 'auto',
    html: '<div class="mk-floating-shapes" aria-label="漂浮幾何動畫"><div></div><i></i><b></b><span></span></div>',
    css: `.mk-floating-shapes { position: relative; width: 190px; height: 155px; }
.mk-floating-shapes div { position: absolute; width: 85px; height: 85px; top: 32px; left: 50px; border-radius: 22px; background: linear-gradient(145deg, #b0d8cb, var(--mk-accent)); box-shadow: 15px 18px 25px #326c6525, inset 2px 2px 3px #ffffff80; animation: mk-float var(--mk-duration) var(--mk-easing) var(--mk-delay) infinite; }
.mk-floating-shapes i { position: absolute; top: 16px; right: 0; width: 31px; height: 31px; border-radius: 50%; background: #b2d9ce; animation: mk-float var(--mk-duration) var(--mk-easing) calc(var(--mk-delay) - 1s) infinite reverse; }
.mk-floating-shapes b { position: absolute; left: 5px; bottom: 20px; width: 23px; height: 23px; border: 2px solid #7ab2a2; transform: rotate(25deg); }
.mk-floating-shapes span { position: absolute; height: 10px; width: 75px; background: #55897720; filter: blur(7px); bottom: 5px; left: 58px; }
@keyframes mk-float { 0%, 100% { transform: translateY(7px) rotate(-10deg); } 50% { transform: translateY(-12px) rotate(2deg); } }`,
  },
  {
    id: 'aurora', name: '流動極光', english: 'Aurora flow', category: 'background',
    description: '多層漸層光暈緩慢流動，讓靜態區塊充滿生命力。適合大面積的首頁背景。',
    tags: ['Gradient', 'Ambient'], color: '#171f34', accent: '#7c6aef', duration: 7, trigger: 'auto', badge: '熱門',
    html: '<div class="mk-aurora" aria-label="極光漸層背景"><i></i><i></i><i></i><span>go with the flow.</span></div>',
    css: `.mk-aurora { position: absolute; inset: 0; overflow: hidden; background: #171f34; display: grid; place-items: center; isolation: isolate; }
.mk-aurora i { position: absolute; width: 230px; height: 200px; border-radius: 50%; filter: blur(45px); opacity: .85; animation: mk-aurora var(--mk-duration) var(--mk-easing) var(--mk-delay) infinite alternate; background: var(--mk-accent); left: 10%; top: 5%; z-index: -1; }
.mk-aurora i:nth-child(2) { background: #43b3a9; left: 48%; top: 42%; animation-delay: calc(var(--mk-delay) - 3s); }
.mk-aurora i:nth-child(3) { background: #ca70ba; left: -10%; top: 65%; animation-delay: calc(var(--mk-delay) - 5s); }
.mk-aurora span { position: relative; color: #fff; font: 500 italic 25px Georgia, serif; letter-spacing: -.5px; }
@keyframes mk-aurora { from { transform: translate(-15%, -15%) scale(.9) rotate(0); } to { transform: translate(25%, 5%) scale(1.2) rotate(60deg); } }`,
  },
  {
    id: 'orbit-loader', name: '軌道載入', english: 'Stay in orbit', category: 'loading',
    description: '兩道星體沿軌道運行，讓等待更有質感。可放在資料載入或頁面切換的狀態中。',
    tags: ['Loader', 'Loop'], color: '#f4efe7', accent: '#ba8450', duration: 2.6, trigger: 'auto',
    html: '<div class="mk-orbit-loader" role="status" aria-label="載入中"><div><i></i></div><div><i></i></div><b></b></div>',
    css: `.mk-orbit-loader { position: relative; width: 120px; height: 120px; }
.mk-orbit-loader > div { position: absolute; inset: 0; border: 1px solid #c6a57b55; border-radius: 50%; animation: mk-orbit var(--mk-duration) linear var(--mk-delay) infinite; }
.mk-orbit-loader > div:nth-child(2) { inset: 22px; animation-direction: reverse; animation-duration: calc(var(--mk-duration) * .7); }
.mk-orbit-loader i { position: absolute; width: 13px; height: 13px; background: var(--mk-accent); border-radius: 50%; left: calc(50% - 6.5px); top: -6.5px; box-shadow: 0 0 0 5px #c6a57b18; }
.mk-orbit-loader > div:nth-child(2) i { width: 9px; height: 9px; top: -4.5px; background: #dfba83; }
.mk-orbit-loader b { position: absolute; width: 23px; height: 23px; inset: 0; margin: auto; border-radius: 50%; background: var(--mk-accent); box-shadow: inset 3px 3px 5px #ffffff60, 0 4px 10px #9e714430; }
@keyframes mk-orbit { to { transform: rotate(360deg); } }`,
  },
  {
    id: 'stack-reveal', name: '卡片交錯進場', english: 'One after another', category: 'entrance',
    description: '卡片帶著細微延遲依序滑入，為列表與內容區塊建立清楚的視覺層次。展示區會循環重播。',
    tags: ['Stagger', 'Cards'], color: '#edf0fa', accent: '#7687d9', duration: 4.5, trigger: 'auto',
    html: '<div class="mk-stack-reveal" aria-label="卡片依序進場"><div><i></i><span><b></b><b></b></span><em>✓</em></div><div><i></i><span><b></b><b></b></span><em>✓</em></div><div><i></i><span><b></b><b></b></span><em>✓</em></div></div>',
    css: `.mk-stack-reveal { display: flex; flex-direction: column; gap: 9px; width: 190px; }
.mk-stack-reveal > div { display: flex; gap: 10px; align-items: center; padding: 11px 13px; border: 1px solid #e0e5f1; border-radius: 10px; background: white; box-shadow: 0 4px 12px #5a6b9c07; animation: mk-stack var(--mk-duration) var(--mk-easing) var(--mk-delay) infinite; }
.mk-stack-reveal > div:nth-child(2) { animation-delay: calc(var(--mk-delay) + .16s); }
.mk-stack-reveal > div:nth-child(3) { animation-delay: calc(var(--mk-delay) + .32s); }
.mk-stack-reveal i { width: 25px; height: 25px; background: #e7eafa; border-radius: 7px; }
.mk-stack-reveal span { flex: 1; display: grid; gap: 6px; }
.mk-stack-reveal b { height: 4px; background: #d1d6e7; width: 75%; border-radius: 3px; }
.mk-stack-reveal b + b { width: 48%; background: #e9ecf4; }
.mk-stack-reveal em { font: 10px system-ui; color: var(--mk-accent); background: #f0f2fb; border-radius: 50%; padding: 4px; }
@keyframes mk-stack { 0%, 10% { opacity: 0; transform: translateY(20px) scale(.94); } 28%, 78% { opacity: 1; transform: translateY(0) scale(1); } 95%, 100% { opacity: 0; transform: translateY(-10px) scale(.98); } }`,
  },
  {
    id: 'underline', name: '滑動底線', english: 'A line of delight', category: 'interaction',
    description: '底線從左側流暢展開，離開時向右收起。讓導覽列與文字連結更有互動感。',
    tags: ['Hover', 'Link'], color: '#f5eceb', accent: '#b75f62', duration: 0.4, trigger: 'hover',
    html: '<a class="mk-underline" href="#explore">Explore more <span aria-hidden="true">↗</span></a>',
    css: `.mk-underline { position: relative; text-decoration: none; color: var(--mk-accent); padding-bottom: 10px; font: 600 24px system-ui; letter-spacing: -.8px; }
.mk-underline span { display: inline-block; margin-left: 15px; transition: transform var(--mk-duration) var(--mk-easing) var(--mk-delay); }
.mk-underline::after { content: ''; position: absolute; left: 0; bottom: 0; width: 100%; height: 2px; background: currentColor; transform: scaleX(.15); transform-origin: right; transition: transform var(--mk-duration) var(--mk-easing) var(--mk-delay); }
.mk-underline:is(:hover, :focus-visible)::after { transform: scaleX(1); transform-origin: left; }
.mk-underline:is(:hover, :focus-visible) span { transform: translate(3px, -3px); }`,
  },
  {
    id: 'gradient-text', name: '流光文字', english: 'Color in every word', category: 'text',
    description: '色彩沿著文字緩慢流動，為一句重要的話加上亮點。適合主視覺標語與數字強調。',
    tags: ['Text', 'Gradient'], color: '#f2edf8', accent: '#8c56c7', duration: 4, trigger: 'auto',
    html: '<div class="mk-gradient-text">Stay<br>curious<span>✳</span></div>',
    css: `.mk-gradient-text { font: 800 49px/.98 system-ui; letter-spacing: -3px; background: linear-gradient(110deg, var(--mk-accent), #dd8c9e, #c69847, var(--mk-accent)); background-size: 250% 100%; background-clip: text; -webkit-background-clip: text; color: transparent; animation: mk-shimmer var(--mk-duration) var(--mk-easing) var(--mk-delay) infinite alternate; }
.mk-gradient-text span { font-size: 35px; margin-left: 8px; }
@keyframes mk-shimmer { from { background-position: 0% 50%; } to { background-position: 100% 50%; } }`,
  },
  {
    id: 'pulse', name: '呼吸光環', english: 'A quiet pulse', category: 'attention',
    description: '一圈圈柔和波紋向外擴散，引導視線聚焦。適合線上狀態、地圖標記與重要提示。',
    tags: ['Pulse', 'Loop'], color: '#eaf3ee', accent: '#4c9272', duration: 2.6, trigger: 'auto',
    html: '<div class="mk-pulse" aria-label="連線中"><i></i><i></i><b>✦</b></div>',
    css: `.mk-pulse { position: relative; width: 70px; height: 70px; color: var(--mk-accent); }
.mk-pulse i { position: absolute; inset: 0; border: 1px solid currentColor; border-radius: 50%; animation: mk-pulse var(--mk-duration) var(--mk-easing) var(--mk-delay) infinite; }
.mk-pulse i:nth-child(2) { animation-delay: calc(var(--mk-delay) + var(--mk-duration) / 2); }
.mk-pulse b { display: grid; place-items: center; position: absolute; inset: 0; border-radius: 50%; background: currentColor; box-shadow: 0 8px 20px #42755b25; }
.mk-pulse b::first-letter { color: white; }
.mk-pulse b { font: 32px system-ui; background: var(--mk-accent); color: #fff; }
@keyframes mk-pulse { 0% { transform: scale(1); opacity: .5; } 100% { transform: scale(2.3); opacity: 0; } }`,
  },
  {
    id: 'dot-wave', name: '點點波浪', english: 'Good things take time', category: 'loading',
    description: '三顆圓點以交錯節奏跳動，傳達持續處理中的狀態。適合聊天輸入與小型載入指示。',
    tags: ['Loader', 'Dots'], color: '#eef0fa', accent: '#7d83c7', duration: 1.3, trigger: 'auto',
    html: '<div class="mk-dot-wave" role="status" aria-label="載入中"><i></i><i></i><i></i></div>',
    css: `.mk-dot-wave { display: flex; gap: 13px; padding: 25px 30px; background: #ffffff90; border: 1px solid #ffffff; border-radius: 22px 22px 22px 5px; }
.mk-dot-wave i { width: 13px; height: 13px; border-radius: 50%; background: var(--mk-accent); animation: mk-dot-wave var(--mk-duration) var(--mk-easing) var(--mk-delay) infinite; }
.mk-dot-wave i:nth-child(2) { animation-delay: calc(var(--mk-delay) + .15s); }
.mk-dot-wave i:nth-child(3) { animation-delay: calc(var(--mk-delay) + .3s); }
@keyframes mk-dot-wave { 0%, 70%, 100% { transform: translateY(0); opacity: .4; } 35% { transform: translateY(-12px); opacity: 1; } }`,
  },
  {
    id: 'fade-up', name: '柔和向上淡入', english: 'Hello, world', category: 'entrance',
    description: '結合透明度與小幅位移的經典進場效果。適合段落、圖片或整個內容區塊，展示區會循環重播。',
    tags: ['Fade', 'Entrance'], color: '#f6efe5', accent: '#b09360', duration: 3.8, trigger: 'auto',
    html: '<div class="mk-fade-up"><span>✺</span><strong>A fresh start.</strong><small>Something good is on the way.</small></div>',
    css: `.mk-fade-up { text-align: center; animation: mk-fade-up var(--mk-duration) var(--mk-easing) var(--mk-delay) infinite; color: #5c503e; font-family: system-ui; }
.mk-fade-up span { color: var(--mk-accent); font-size: 50px; display: block; margin-bottom: 10px; }
.mk-fade-up strong { display: block; font-size: 22px; letter-spacing: -.7px; }
.mk-fade-up small { display: block; font-size: 10px; margin-top: 8px; color: #978772; }
@keyframes mk-fade-up { 0%, 5% { opacity: 0; transform: translateY(25px); } 28%, 78% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; transform: translateY(-12px); } }`,
  },
  {
    id: 'mesh', name: '漸層呼吸背景', english: 'Soft horizons', category: 'background',
    description: '放大的漸層色彩緩緩移動，在背景創造平靜的呼吸節奏。適合橫幅與內容封面。',
    tags: ['Gradient', 'Loop'], color: '#f5dacf', accent: '#cd8fa4', duration: 8, trigger: 'auto',
    html: '<div class="mk-mesh"><span>less, but better.</span><b>✳</b></div>',
    css: `.mk-mesh { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 14px; color: #7e535e; background: linear-gradient(130deg, #f3d8bd, var(--mk-accent), #d8c9e8, #f6e3c5); background-size: 300% 300%; animation: mk-mesh var(--mk-duration) var(--mk-easing) var(--mk-delay) infinite alternate; }
.mk-mesh span { font: italic 27px Georgia, serif; letter-spacing: -.6px; }
.mk-mesh b { font: 31px system-ui; font-weight: 400; }
@keyframes mk-mesh { from { background-position: 0% 20%; } to { background-position: 100% 80%; } }`,
  },
  {
    id: 'tilt-card', name: '立體翻轉卡片', english: 'A new perspective', category: 'interaction',
    description: '滑鼠移入時卡片微微傾斜，營造柔和立體感。適合作品集封面與產品展示。',
    tags: ['Hover', '3D'], color: '#eaf0f5', accent: '#6b8ca6', duration: 0.5, trigger: 'hover',
    html: '<button class="mk-tilt-card"><small>MOTION CLUB</small><span>✳</span><strong>Made to move. <b>↗</b></strong></button>',
    css: `.mk-tilt-card { width: 180px; height: 130px; border: 1px solid #ffffffaa; padding: 17px; border-radius: 12px; text-align: left; color: #fff; background: linear-gradient(130deg, #a7c0d2, var(--mk-accent)); box-shadow: 0 15px 25px #516b8020; cursor: pointer; transition: transform var(--mk-duration) var(--mk-easing) var(--mk-delay), box-shadow var(--mk-duration) var(--mk-easing) var(--mk-delay); transform: perspective(500px) rotate(-5deg); }
.mk-tilt-card:is(:hover, :focus-visible) { transform: perspective(500px) rotateY(-18deg) rotateX(12deg) rotate(-3deg) translateY(-5px); box-shadow: 10px 20px 30px #516b8035; }
.mk-tilt-card small { font: 8px system-ui; letter-spacing: 2px; }
.mk-tilt-card span { display: block; font: 40px system-ui; margin: 2px 0; }
.mk-tilt-card strong { font: 10px system-ui; display: flex; justify-content: space-between; }`,
  },
  {
    id: 'typewriter', name: '打字機效果', english: 'Letter by letter', category: 'text',
    description: '等寬字元逐步顯示，搭配安靜的游標。適合個人網站的自我介紹與短標語。',
    tags: ['Text', 'Steps'], color: '#edf2ec', accent: '#54744d', duration: 4, trigger: 'auto',
    html: '<div class="mk-typewriter"><small>CREATIVE DEVELOPER</small><span>I build things.</span></div>',
    css: `.mk-typewriter { color: var(--mk-accent); }
.mk-typewriter small { font: 8px system-ui; letter-spacing: 2px; display: block; margin-bottom: 15px; opacity: .6; }
.mk-typewriter span { display: block; font: 500 22px/1.5 ui-monospace, monospace; width: 15ch; overflow: hidden; white-space: nowrap; border-right: 2px solid; animation: mk-type var(--mk-duration) steps(15, end) var(--mk-delay) infinite; }
@keyframes mk-type { 0%, 8% { width: 0; } 60%, 85% { width: 15ch; } 100% { width: 0; } }`,
  },
  {
    id: 'scale-in', name: '彈性縮放進場', english: 'Pop into place', category: 'entrance',
    description: '元素從小到大彈性展開，帶出輕快的完成感。適合成功訊息與確認提示，展示區會循環重播。',
    tags: ['Scale', 'Spring'], color: '#eceff8', accent: '#7987c5', duration: 3.2, trigger: 'auto',
    html: '<div class="mk-scale-in"><span>✓</span><strong>All done!</strong><small>You’re good to go.</small></div>',
    css: `.mk-scale-in { text-align: center; color: #46527e; font-family: system-ui; animation: mk-scale var(--mk-duration) var(--mk-easing) var(--mk-delay) infinite; }
.mk-scale-in span { display: grid; place-items: center; width: 52px; height: 52px; margin: 0 auto 13px; border-radius: 50%; background: var(--mk-accent); color: #fff; font-size: 25px; box-shadow: 0 0 0 7px #7987c515; }
.mk-scale-in strong { display: block; font-size: 21px; letter-spacing: -.7px; }
.mk-scale-in small { display: block; font-size: 10px; margin-top: 6px; opacity: .6; }
@keyframes mk-scale { 0%, 5% { transform: scale(.4); opacity: 0; } 23% { transform: scale(1.12); opacity: 1; } 35%, 80% { transform: scale(1); opacity: 1; } 100% { transform: scale(.9); opacity: 0; } }`,
  },
  {
    id: 'grid-drift', name: '無限網格', english: 'Beyond the grid', category: 'background',
    description: '透視網格持續向前推進，創造乾淨的科技空間感。適合科技產品與互動式主視覺。',
    tags: ['Grid', 'Perspective'], color: '#242a37', accent: '#8499bb', duration: 3, trigger: 'auto',
    html: '<div class="mk-grid-drift" aria-label="透視網格背景"><i></i><span>the next dimension.</span></div>',
    css: `.mk-grid-drift { position: absolute; inset: 0; background: #242a37; overflow: hidden; perspective: 220px; display: grid; place-items: center; }
.mk-grid-drift i { position: absolute; width: 180%; height: 200%; left: -40%; top: 0; background-image: linear-gradient(var(--mk-accent) 1px, transparent 1px), linear-gradient(90deg, var(--mk-accent) 1px, transparent 1px); background-size: 35px 35px; opacity: .25; transform: rotateX(55deg); animation: mk-grid var(--mk-duration) linear var(--mk-delay) infinite; mask-image: linear-gradient(transparent, #000 50%); }
.mk-grid-drift span { z-index: 1; color: #dce4f1; font: 500 17px system-ui; letter-spacing: -.4px; margin-top: -40px; }
@keyframes mk-grid { to { background-position: 0 35px; } }`,
  },
  {
    id: 'bars', name: '節奏載入', english: 'Find your rhythm', category: 'loading',
    description: '五條線段像音樂節拍般起伏。適合語音處理、音訊介面與資料載入中的狀態。',
    tags: ['Loader', 'Wave'], color: '#f4eaf0', accent: '#b47b9b', duration: 1.2, trigger: 'auto',
    html: '<div class="mk-bars" role="status" aria-label="處理中"><i></i><i></i><i></i><i></i><i></i></div>',
    css: `.mk-bars { display: flex; align-items: center; gap: 8px; height: 60px; }
.mk-bars i { width: 9px; height: 45px; border-radius: 8px; background: var(--mk-accent); animation: mk-bars var(--mk-duration) var(--mk-easing) var(--mk-delay) infinite; }
.mk-bars i:nth-child(2) { animation-delay: calc(var(--mk-delay) + .12s); }
.mk-bars i:nth-child(3) { animation-delay: calc(var(--mk-delay) + .24s); }
.mk-bars i:nth-child(4) { animation-delay: calc(var(--mk-delay) + .36s); }
.mk-bars i:nth-child(5) { animation-delay: calc(var(--mk-delay) + .48s); }
@keyframes mk-bars { 0%, 100% { transform: scaleY(.3); opacity: .4; } 50% { transform: scaleY(1); opacity: 1; } }`,
  },
  {
    id: 'spin-flower', name: '慢轉星芒', english: 'Keep on turning', category: 'attention',
    description: '星芒以穩定速度旋轉，替簡潔版面加上一個有個性的焦點。適合品牌裝飾與徽章。',
    tags: ['Rotate', 'Loop'], color: '#f7eee1', accent: '#c39354', duration: 10, trigger: 'auto',
    html: '<div class="mk-spin-flower" aria-label="旋轉星芒"><span>✳</span><small>A LITTLE BIT OF MAGIC</small></div>',
    css: `.mk-spin-flower { text-align: center; color: var(--mk-accent); }
.mk-spin-flower span { display: block; font: 125px/1.1 system-ui; animation: mk-flower var(--mk-duration) linear var(--mk-delay) infinite; }
.mk-spin-flower small { display: block; font: 8px system-ui; letter-spacing: 2px; margin-top: 12px; }
@keyframes mk-flower { to { transform: rotate(360deg); } }`,
  },
];

export const easings = {
  'ease-in-out': 'Ease in out · 平滑',
  'ease': 'Ease · 自然',
  'linear': 'Linear · 等速',
  'ease-in': 'Ease in · 漸快',
  'ease-out': 'Ease out · 漸慢',
  'cubic-bezier(0.34, 1.56, 0.64, 1)': 'Spring · 彈性',
};

const escapeHTML = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);

function localizedMarkup(item, demo) {
  const text = Object.fromEntries(Object.entries(demo).map(([key, value]) => [key, Array.isArray(value) ? value.map(escapeHTML) : escapeHTML(value)]));
  switch (item.id) {
    case 'lift-button': return `<button class="mk-lift-button">${text.text} <span aria-hidden="true">↗</span></button>`;
    case 'text-reveal': return `<div class="mk-text-reveal" aria-label="${text.label}"><span aria-hidden="true">${text.lead}</span><strong aria-hidden="true">${Array.from(demo.reveal).map(character => `<i>${escapeHTML(character)}</i>`).join('')}</strong></div>`;
    case 'aurora': return `<div class="mk-aurora" aria-label="${text.label}"><i></i><i></i><i></i><span>${text.text}</span></div>`;
    case 'underline': return `<a class="mk-underline" href="#explore">${text.text} <span aria-hidden="true">↗</span></a>`;
    case 'gradient-text': return `<div class="mk-gradient-text">${text.lines.join('<br>')}<span>✳</span></div>`;
    case 'fade-up': return `<div class="mk-fade-up"><span>✺</span><strong>${text.heading}</strong><small>${text.detail}</small></div>`;
    case 'mesh': return `<div class="mk-mesh"><span>${text.text}</span><b>✳</b></div>`;
    case 'tilt-card': return `<button class="mk-tilt-card"><small>${text.label}</small><span>✳</span><strong>${text.text} <b>↗</b></strong></button>`;
    case 'typewriter': return `<div class="mk-typewriter"><small>${text.label}</small><span>${text.text}</span></div>`;
    case 'scale-in': return `<div class="mk-scale-in"><span>✓</span><strong>${text.heading}</strong><small>${text.detail}</small></div>`;
    case 'grid-drift': return `<div class="mk-grid-drift" aria-label="${text.label}"><i></i><span>${text.text}</span></div>`;
    case 'spin-flower': return `<div class="mk-spin-flower" aria-label="${text.label}"><span>✳</span><small>${text.text}</small></div>`;
    default: return item.html.replace(/aria-label="[^"]*"/, `aria-label="${text.label}"`);
  }
}

function localizeAnimation(item, locale) {
  const messages = catalogLocales[locale];
  const translation = messages.animations[item.id];
  if (!translation) return item;
  // Always translate from the source so changing an already localized item is reversible.
  const source = animations.find(animation => animation.id === item.id) ?? item;
  let css = source.css;
  let typewriterWidth;
  let typingSteps;
  if (locale !== 'en') css = css.replace(/letter-spacing: -?[\d.]+px;/g, 'letter-spacing: 0;');
  if (locale !== 'en' && ['aurora', 'mesh', 'grid-drift'].includes(item.id)) {
    css = css.replace(`.mk-${item.id} span {`, `.mk-${item.id} span { max-width: calc(100% - 28px); text-align: center; overflow-wrap: anywhere;`);
  }
  if (item.id === 'text-reveal') {
    const characters = Array.from(translation.demo.reveal);
    css = css.replace(/\.mk-text-reveal i:nth-child\(\d+\) \{[^}]+\}\n/g, '');
    const delays = characters.slice(1).map((_, index) => `.mk-text-reveal i:nth-child(${index + 2}) { animation-delay: calc(var(--mk-delay) + ${((index + 1) * .09).toFixed(2)}s); }`).join('\n');
    css = css.replace('@keyframes mk-word', `${delays}\n.mk-text-reveal i:last-child { color: #9479ed; }\n@keyframes mk-word`);
    if (locale !== 'en') css = css.replace('font-size: 64px;', 'font-size: 42px;');
  }
  if (item.id === 'gradient-text' && locale !== 'en') css = css.replace('800 49px/.98', '800 42px/1.15');
  if (item.id === 'typewriter') {
    typingSteps = Array.from(translation.demo.text).length;
    typewriterWidth = `${typingSteps}${locale === 'en' ? 'ch' : 'em'}`;
    css = css.replaceAll('15ch', 'var(--mk-type-width)')
      .replace('steps(15, end)', 'steps(var(--mk-type-steps), end)')
      .replace('.mk-typewriter {', `.mk-typewriter { --mk-type-width: ${typewriterWidth}; --mk-type-steps: ${typingSteps};`);
  }
  return {
    ...item,
    locale,
    name: translation.name,
    tagline: translation.tagline,
    description: translation.description,
    tags: source.tags.map(tag => messages.tags[tag]),
    badge: source.badge ? messages.badges[source.badge] : undefined,
    badgeType: source.badge === '熱門' ? 'hot' : source.badge ? 'featured' : undefined,
    html: localizedMarkup(source, translation.demo),
    css,
    ...(typewriterWidth ? { typewriterWidth, typingSteps } : {}),
  };
}

export function getAnimations(locale = getLocale()) {
  return animations.map(item => localizeAnimation(item, normalizeLocale(locale)));
}

export function getCategories(locale = getLocale()) {
  const names = catalogLocales[normalizeLocale(locale)].categories;
  return categories.map(category => ({ ...category, name: names[category.id] }));
}

export function getEasings(locale = getLocale()) {
  return { ...catalogLocales[normalizeLocale(locale)].easings };
}

export function defaultSettings(item) {
  return { duration: item.duration, delay: 0, easing: ['orbit-loader', 'grid-drift', 'spin-flower'].includes(item.id) ? 'linear' : 'ease-in-out', accent: item.accent, loop: true };
}

export function settingsStyle(settings) {
  return `--mk-duration: ${settings.duration}s; --mk-delay: ${settings.delay}s; --mk-easing: ${settings.easing}; --mk-accent: ${settings.accent};`;
}

export function demoClass(item, settings = defaultSettings(item)) {
  const timing = `${settings.duration}-${settings.delay}`.replaceAll('.', '_');
  return `mk-demo-${item.id}-${timing}-${settings.accent.slice(1)}-${Object.keys(easings).indexOf(settings.easing)}-${settings.loop ? 'loop' : 'once'}${item.locale ? `-${item.locale.toLowerCase()}` : ''}`;
}

const singleEntrance = {
  'text-reveal': { name: 'mk-word', frames: 'from { transform: translateY(110%) rotate(8deg); opacity: 0; } to { transform: translateY(0) rotate(0); opacity: 1; }' },
  'stack-reveal': { name: 'mk-stack', frames: 'from { transform: translateY(20px) scale(.94); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; }' },
  'fade-up': { name: 'mk-fade-up', frames: 'from { transform: translateY(25px); opacity: 0; } to { transform: translateY(0); opacity: 1; }' },
  'scale-in': { name: 'mk-scale', frames: '0% { transform: scale(.4); opacity: 0; } 65% { transform: scale(1.12); opacity: 1; } 100% { transform: scale(1); opacity: 1; }' },
  'typewriter': { name: 'mk-type', frames: 'from { width: 0; } to { width: 15ch; }' },
};

export function demoCSS(item, settings = defaultSettings(item)) {
  const wrapper = `.${demoClass(item, settings)}`;
  let motion = item.css.replaceAll(' infinite', ' var(--mk-iterations) both').replaceAll(' linear var(--mk-delay)', ' var(--mk-easing) var(--mk-delay)');
  if (!settings.loop && singleEntrance[item.id]) {
    const once = singleEntrance[item.id];
    const frames = item.typewriterWidth ? once.frames.replace('15ch', 'var(--mk-type-width)') : once.frames;
    motion = motion.replace(/@keyframes[\s\S]*$/, `@keyframes ${once.name}-once { ${frames} }`)
      .replaceAll(`${once.name} var(`, `${once.name}-once var(`);
  }
  motion = motion.replaceAll(`.mk-${item.id}`, `${wrapper} .mk-${item.id}`);
  return `${wrapper} {\n  ${settingsStyle(settings).split('; ').join(';\n  ')}\n  --mk-iterations: ${settings.loop ? 'infinite' : '1'};\n  position: relative;\n  display: grid;\n  place-items: center;\n  min-height: 320px;\n  overflow: hidden;\n  border-radius: 16px;\n  background: ${item.color};\n}\n\n${motion}\n\n@media (prefers-reduced-motion: reduce) {\n  ${wrapper} *, ${wrapper} *::before, ${wrapper} *::after {\n    animation: none !important;\n    transition: none !important;\n  }\n}`;
}

export function generateCode(item, settings = defaultSettings(item), format = 'html', locale = getLocale()) {
  locale = normalizeLocale(locale);
  item = localizeAnimation(item, locale);
  const css = demoCSS(item, settings);
  const markup = `<div class="mk-demo-${item.id} ${demoClass(item, settings)}" lang="${locale}">\n  ${item.html}\n</div>`;
  if (format === 'css') return css;
  if (format === 'react') {
    const jsx = markup.replaceAll('class=', 'className=').replace(/<(br|hr|img|input)([^>]*?)(?<!\/)>(?!<\/)/g, '<$1$2 />');
    return `export default function MotionDemo() {\n  return (\n    <>\n      <style>{\`${css}\`}</style>\n      ${jsx}\n    </>\n  );\n}\n`;
  }
  if (format === 'vue') return `<template>\n  ${markup}\n</template>\n\n<style scoped>\n${css}\n</style>\n`;
  return `<!doctype html>\n<html lang="${locale}">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>${escapeHTML(item.name)} — PuffiCSS</title>\n  <style>\n${css}\n  </style>\n</head>\n<body>\n  ${markup}\n</body>\n</html>\n`;
}

const searchText = new Map(animations.map(item => [item.id, [item.id, item.english, ...supportedLocales.flatMap(locale => {
  const messages = catalogLocales[locale];
  const translation = messages.animations[item.id];
  return [translation.name, translation.tagline, translation.description, messages.categories[item.category], ...item.tags.map(tag => messages.tags[tag])];
})].join(' ').normalize('NFKC').toLocaleLowerCase()]));

export function filterAnimations({ category = 'all', query = '', favorites = [], favoritesOnly = false, sort = 'featured', locale = getLocale() } = {}) {
  locale = normalizeLocale(locale);
  const terms = query.normalize('NFKC').trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const items = getAnimations(locale).filter(item =>
    (category === 'all' || item.category === category) &&
    (!favoritesOnly || favorites.includes(item.id)) &&
    terms.every(term => searchText.get(item.id).includes(term))
  );
  if (sort === 'newest') items.reverse();
  if (sort === 'name') items.sort((a, b) => a.name.localeCompare(b.name, locale));
  return items;
}
