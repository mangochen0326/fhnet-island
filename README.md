# 富鴻網解決方案島（Demo）

以 3D 島嶼逛遍富鴻網（FHNet）的六大解決方案與延伸服務。概念參考 [桃園政策島](https://quinnyhuang.github.io/taoyuan-policy-island/)，程式碼為獨立撰寫（原站未附授權條款，因此沒有複製其原始碼）。

- 線上展示：https://fhnet-island.vercel.app/
- 內容來源：富鴻網官網知識庫（與官網 AI 小幫手「小Paul」相同的資料，`fhnet-static-site` 的 `kb/fhnet-site.json`），整理在 `src/data/`
- 標示為 **Demo 展示**，詳細資訊以 [富鴻網官網](https://www.fhnet.com.tw) 為準

## 技術

React 19、three.js（`@react-three/fiber` + `drei`）、zustand、Vite；Vitest 單元測試、Playwright 端對端測試；Vercel 部署，GitHub Actions 只跑測試。

| 目錄 | 內容 |
|---|---|
| `src/data/` | 島嶼、服務重點、各區域 NPC 對話、小Paul 問答、導覽文字 |
| `src/lib/world.ts` | 純幾何：可行走區域、島嶼判定、跨橋路徑（有單元測試） |
| `src/store/useGame.ts` | zustand 狀態：選取、護照集章、時段、對話（進度存 localStorage） |
| `src/scene/` | 3D 場景：島嶼、主題建築、橋、玩家、小Paul |
| `src/ui/` | 標題卡、索引面板、護照、對話框 |
| `e2e/` | Playwright 測試（桌機與手機尺寸） |

## 開發

需要 Node 24 與 pnpm。

```bash
pnpm install
pnpm dev          # http://localhost:5173/
pnpm test         # Vitest
pnpm e2e          # Playwright 桌機＋手機（首次先 pnpm exec playwright install chromium）；CI 只跑桌機
pnpm build
```

## 部署

只部署到 Vercel：專案 `fhnet-island` 已連動此 repo，推到 `main` 會自動部署到 https://fhnet-island.vercel.app/ ，PR 會產生預覽網址（設定見 `vercel.json`）。

`.github/workflows/ci.yml` 只跑型別檢查、單元測試與桌機 E2E，不負責部署。網站預設放在網域根目錄；要放在子路徑時以 `BASE_PATH=/<path>/` 建置。

## 修改內容

服務文字在 `src/data/islands.ts`（每座島的 `goals`）；新增服務時，`src/scene/props.tsx` 的 `GoalProp` 以 goal id 對應 3D 模型，沒有對應時會顯示預設方塊。
