# 音樂專輯收藏網站 開發需求文件

## 專案概述

打造一個個人音樂專輯收藏展示網站，使用者可以瀏覽專輯封面、查看曲目列表，並在底部播放器播放音樂。UI 設計參考 Spotify 風格。

---

## 技術架構

### 前端
| 技術 | 版本 | 用途 |
|------|------|------|
| React | ^18 | UI 框架 |
| Vite | ^5 | 建置工具與開發伺服器 |
| Tailwind CSS | ^3 | 樣式系統 |
| React Query (TanStack Query) | ^5 | 伺服器狀態管理 |
| Axios | ^1 | HTTP 客戶端 |
| React Router | ^6 | 前端路由 |
| Zustand | ^4 | 播放器全域狀態管理 |

### 後端
| 技術 | 版本 | 用途 |
|------|------|------|
| Node.js | ^20 | 執行環境 |
| Express | ^4 | HTTP 伺服器 |
| cors | latest | 跨域處理 |

### 資料儲存
- JSON 檔案（無資料庫）
- 音樂檔案存放於 `server/public/audio/`
- 封面圖片存放於 `server/public/images/`

---

## 目錄結構

```
music/
├── docs/
│   └── spec.md
├── client/                          # 前端 React 應用
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   └── PlayerBar.jsx    # 底部播放器（全域）
│   │   │   ├── album/
│   │   │   │   ├── AlbumCard.jsx    # 瀑布流中的專輯卡片
│   │   │   │   └── TrackItem.jsx    # 曲目列表項目
│   │   │   └── ui/
│   │   │       ├── Spinner.jsx
│   │   │       └── ErrorMessage.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx         # 瀑布流首頁
│   │   │   └── AlbumPage.jsx        # 專輯詳情頁
│   │   ├── hooks/
│   │   │   └── usePlayer.js         # 播放器 Zustand store
│   │   ├── api/
│   │   │   └── albumApi.js          # Axios API 呼叫封裝
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── server/                          # 後端 Express
    ├── data/
    │   └── albums.json              # 專輯資料
    ├── public/
    │   ├── images/                  # 專輯封面圖片
    │   └── audio/                   # 音樂檔案
    ├── routes/
    │   └── albums.js                # 專輯相關路由
    ├── index.js                     # Express 入口
    └── package.json
```

---

## 資料結構

### `albums.json`

```json
[
  {
    "id": "1",
    "title": "專輯名稱",
    "artist": "藝術家",
    "year": 2024,
    "genre": "流行",
    "coverImage": "/images/album-cover-1.jpg",
    "color": "#1DB954",
    "tracks": [
      {
        "id": "1-1",
        "trackNumber": 1,
        "title": "歌曲名稱",
        "duration": 213,
        "audioFile": "/audio/track-1-1.mp3"
      }
    ]
  }
]
```

### 欄位說明

| 欄位 | 型別 | 說明 |
|------|------|------|
| `id` | string | 專輯唯一識別碼 |
| `title` | string | 專輯名稱 |
| `artist` | string | 演出者 |
| `year` | number | 發行年份 |
| `genre` | string | 音樂類型 |
| `coverImage` | string | 封面圖片路徑（相對於 server/public） |
| `color` | string | 封面主色（用於頁面漸層背景） |
| `tracks[].id` | string | 曲目唯一識別碼 |
| `tracks[].trackNumber` | number | 曲目編號 |
| `tracks[].title` | string | 歌曲名稱 |
| `tracks[].duration` | number | 時長（秒） |
| `tracks[].audioFile` | string | 音訊檔案路徑 |

---

## API 設計

Base URL: `http://localhost:3001/api`

### 專輯相關

| 方法 | 路徑 | 說明 | 回應 |
|------|------|------|------|
| GET | `/albums` | 取得所有專輯（不含 tracks） | `Album[]` |
| GET | `/albums/:id` | 取得單一專輯（含 tracks） | `Album` |

#### GET `/albums` 回應範例
```json
[
  {
    "id": "1",
    "title": "專輯名稱",
    "artist": "藝術家",
    "year": 2024,
    "genre": "流行",
    "coverImage": "/images/album-cover-1.jpg",
    "color": "#1DB954",
    "trackCount": 10
  }
]
```

#### GET `/albums/:id` 回應範例
```json
{
  "id": "1",
  "title": "專輯名稱",
  "artist": "藝術家",
  "year": 2024,
  "genre": "流行",
  "coverImage": "/images/album-cover-1.jpg",
  "color": "#1DB954",
  "tracks": [
    {
      "id": "1-1",
      "trackNumber": 1,
      "title": "歌曲名稱",
      "duration": 213,
      "audioFile": "/audio/track-1-1.mp3"
    }
  ]
}
```

#### 靜態資源
- 封面圖片：`http://localhost:3001/images/:filename`
- 音訊檔案：`http://localhost:3001/audio/:filename`

---

## 頁面設計

### 1. 首頁（`/`）

**功能：**
- 瀑布流（Masonry）排列展示所有專輯封面
- 每張卡片顯示：封面圖、專輯名稱、藝術家名稱
- Hover 效果：卡片放大、顯示播放按鈕 overlay
- 點擊卡片跳轉至 `/album/:id`

**版面：**
- 黑色背景（`#121212`）
- 響應式欄數：手機 2 欄 / 平板 3 欄 / 桌機 4~5 欄
- 卡片圓角、陰影

**互動：**
- 載入中顯示骨架屏（Skeleton）
- 載入失敗顯示錯誤訊息與重試按鈕

---

### 2. 專輯詳情頁（`/album/:id`）

**版面（參考 Spotify 專輯頁）：**

```
┌─────────────────────────────────────────────────┐
│  [← 返回]                                        │
│                                                   │
│  [封面大圖]  專輯名稱                              │
│              藝術家 • 年份 • X 首歌曲              │
│                                                   │
│  [▶ 播放全部]  [⊕ 喜愛]                           │
├─────────────────────────────────────────────────┤
│  #   標題              時長                        │
│  1   歌曲名稱          3:33                        │
│  2   歌曲名稱          4:12  ← Hover 顯示播放鍵    │
│  ...                                              │
└─────────────────────────────────────────────────┘
```

**功能：**
- 頁面頂部漸層背景使用專輯 `color` 欄位
- 點擊曲目或曲目播放鍵 → 在底部播放器播放
- 點擊「播放全部」→ 播放該專輯所有曲目（從第一首開始，自動順序播放）
- 當前播放中的曲目高亮顯示 + 顯示音波動畫圖示
- 曲目 Hover：顯示播放 icon 取代曲目編號

---

### 3. 底部播放器（全域 `PlayerBar`）

**版面（固定在頁面底部）：**

```
┌──────────────────────────────────────────────────────────────────┐
│ [封面] 歌曲名稱        [⏮] [▶/⏸] [⏭]        [🔀] [🔁] [音量]   │
│        藝術家          ←────────────────────→   進度條            │
└──────────────────────────────────────────────────────────────────┘
```

**功能：**
- 左側：當前曲目封面縮圖、歌曲名稱、藝術家
- 中間：上一首、播放/暫停、下一首、進度條（可拖曳）、時間顯示
- 右側：隨機播放、循環播放（無/單曲/全部）、音量控制
- 無歌曲時播放器隱藏或顯示為空白狀態
- 使用原生 HTML5 `<audio>` 元素控制播放

---

## 狀態管理

### 播放器 Store（Zustand）

```js
{
  // 狀態
  queue: [],           // 播放佇列（Track[]）
  currentIndex: 0,     // 當前曲目索引
  isPlaying: false,    // 播放中
  volume: 0.8,         // 音量 0~1
  progress: 0,         // 播放進度（秒）
  duration: 0,         // 總時長（秒）
  shuffleMode: false,  // 隨機播放
  repeatMode: 'none',  // 'none' | 'one' | 'all'

  // 操作
  playTrack(track, queue),  // 播放指定曲目並設定佇列
  playAlbum(tracks),        // 播放整張專輯
  pause(),
  resume(),
  next(),
  prev(),
  seek(seconds),
  setVolume(v),
  toggleShuffle(),
  toggleRepeat(),
}
```

---

## 開發階段規劃

### Phase 1 — 後端基礎
- [ ] 初始化 Express 專案
- [ ] 建立 `albums.json` 範例資料（3~5 張專輯）
- [ ] 實作 `GET /api/albums` 與 `GET /api/albums/:id`
- [ ] 設定靜態資源服務（images / audio）
- [ ] 設定 CORS

### Phase 2 — 前端基礎建設
- [ ] 初始化 Vite + React + Tailwind
- [ ] 設定 React Router
- [ ] 設定 React Query（QueryClient）
- [ ] 封裝 Axios instance（baseURL、interceptors）

### Phase 3 — 首頁瀑布流
- [ ] 實作 `AlbumCard` 元件
- [ ] 實作瀑布流版面（CSS columns 或 grid）
- [ ] 接入 API 資料（useQuery）
- [ ] Skeleton 載入狀態

### Phase 4 — 專輯詳情頁
- [ ] 實作專輯 Header（封面、資訊、漸層背景）
- [ ] 實作 `TrackItem` 元件
- [ ] 曲目播放觸發（接入播放器 store）

### Phase 5 — 播放器
- [ ] 建立 Zustand player store
- [ ] 實作 `PlayerBar` 元件
- [ ] 整合 HTML5 Audio API
- [ ] 進度條拖曳、音量控制
- [ ] 隨機/循環播放邏輯

### Phase 6 — 收尾
- [ ] 響應式調整（手機版）
- [ ] 錯誤處理與 Loading 狀態完善
- [ ] 加入範例音樂與封面圖片

---

## 開發環境設定

### 啟動方式
```bash
# 後端（port 3001）
cd server && npm install && npm run dev

# 前端（port 5173）
cd client && npm install && npm run dev
```

### 環境變數

**client/.env**
```
VITE_API_BASE_URL=http://localhost:3001/api
VITE_STATIC_BASE_URL=http://localhost:3001
```

**server/.env**
```
PORT=3001
DATA_PATH=./data/albums.json
```

---

## 非功能需求

- 所有 API 回應時間 < 200ms（本地 JSON）
- 封面圖片建議尺寸：500×500px，格式 JPG/WebP
- 音訊格式支援：MP3、AAC
- 支援瀏覽器：Chrome、Firefox、Safari 最新版
