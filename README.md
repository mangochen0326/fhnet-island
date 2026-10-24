# 富鴻網解決方案島（Demo）

以 3D 島嶼逛遍富鴻網（FHNet）的六大解決方案與延伸服務。概念參考 [桃園政策島](https://quinnyhuang.github.io/taoyuan-policy-island/)，程式碼為獨立撰寫（原站未附授權條款，因此沒有複製其原始碼）。

- 線上展示：https://mangochen0326.github.io/fhnet-island/
- 內容來源：富鴻網官網知識庫（與官網 AI 小幫手「小Paul」相同的資料，`fhnet-static-site` 的 `kb/fhnet-site.json`），整理在 `src/data/`
- 標示為 **Demo 展示**，詳細資訊以 [富鴻網官網](https://www.fhnet.com.tw) 為準

## 技術

React 19、three.js（`@react-three/fiber` + `drei`）、zustand、Vite；Vitest 單元測試、Playwright 端對端測試；GitHub Actions 部署到 GitHub Pages。

| 目錄 | 內容 |
|---|---|
| `src/data/` | 島嶼、服務重點、小Paul 問答、導覽文字 |
| `src/lib/world.ts` | 純幾何：可行走區域、島嶼判定、跨橋路徑（有單元測試） |
| `src/store/useGame.ts` | zustand 狀態：選取、護照集章、時段、對話（進度存 localStorage） |
| `src/scene/` | 3D 場景：島嶼、主題建築、橋、玩家、小Paul |
| `src/ui/` | 標題卡、索引面板、護照、對話框 |
| `e2e/` | Playwright 測試（桌機與手機尺寸） |

## 開發

需要 Node 24 與 pnpm。

```bash
pnpm install
pnpm dev          # http://localhost:5173/fhnet-island/
pnpm test         # Vitest
pnpm e2e          # Playwright（首次先 pnpm exec playwright install chromium）
pnpm build
```

## 部署

推到 `main` 後，`.github/workflows/pages.yml` 會跑型別檢查、單元與 E2E 測試，再部署到 GitHub Pages（repo 的 Settings → Pages → Source 需設為 GitHub Actions）。若 repo 名稱不是 `fhnet-island`，以 `BASE_PATH=/<repo>/` 建置。

## 修改內容

服務文字在 `src/data/islands.ts`（每座島的 `goals`）；新增服務時，`src/scene/props.tsx` 的 `GoalProp` 以 goal id 對應 3D 模型，沒有對應時會顯示預設方塊。
