# 🎮 俄羅斯方塊遊戲

一個用 Vanilla JavaScript 開發的俄羅斯方塊遊戲，採用 TDD（測試驅動開發）方法，並通過 GitHub Actions 自動部署到 GitHub Pages。

## 功能特性

- ✅ 完整的俄羅斯方塊遊戲邏輯
- ✅ 支持所有 7 種標準方塊形狀
- ✅ 行消除和分數計算
- ✅ 等級系統和難度等級
- ✅ 下一個方塊預覽
- ✅ 響應式設計，支持移動設備
- ✅ 完整的 Jest 測試套件
- ✅ GitHub Pages 自動部署

## 遊戲控制

| 按鍵 | 功能 |
|------|------|
| ⬅️ `Arrow Left` | 向左移動方塊 |
| ➡️ `Arrow Right` | 向右移動方塊 |
| ⬇️ `Arrow Down` | 加速下移 |
| `Space` | 快速放下方塊 |
| `Z` | 旋轉方塊 |

## 快速開始

### 準備環境

```bash
# 安裝依賴
npm install
```

### 開發模式

```bash
# 啟動開發伺服器
npm run dev
```

遊戲將在 http://localhost:3000 打開。

### 執行測試

```bash
# 執行所有測試
npm test

# 監視模式（開發時自動重新執行）
npm run test:watch

# 生成測試覆蓋率報告
npm run test:coverage
```

### 構建和部署

```bash
# 構建生產版本
npm run build

# 預覽生產版本
npm run preview
```

## 項目結構

```
tetris/
├── src/
│   ├── index.js           # 主入口文件
│   ├── game.js            # 核心遊戲邏輯
│   ├── board.js           # 遊戲板管理
│   ├── piece.js           # 方塊定義和邏輯
│   ├── renderer.js        # UI 渲染引擎
│   └── style.css          # 樣式表
├── __tests__/
│   ├── board.test.js      # 遊戲板測試
│   ├── piece.test.js      # 方塊測試
│   └── game.test.js       # 遊戲邏輯測試
├── index.html             # HTML 入口
├── package.json           # 項目配置
├── vite.config.js         # Vite 配置
├── jest.config.js         # Jest 配置
└── .github/workflows/
    └── build-and-deploy.yml # GitHub Actions 工作流
```

## 核心模塊

### GameBoard (board.js)
- 管理遊戲網格 (10×20)
- 檢查行是否完整
- 消除完整的行

### Piece (piece.js)
- 定義 7 種標準俄羅斯方塊
- 方塊移動和旋轉
- 碰撞檢測

### Game (game.js)
- 主遊戲循環
- 分數和等級管理
- 遊戲狀態控制

### GameRenderer (renderer.js)
- 將遊戲狀態渲染到 DOM
- 處理用戶界面更新
- 顯示遊戲結束畫面

## 分數系統

| 消除行數 | 點數 |
|---------|------|
| 1 行 | 40 × 等級 |
| 2 行 | 100 × 等級 |
| 3 行 | 300 × 等級 |
| 4 行 | 1200 × 等級 |

等級每消除 10 行自動升級。

## 難度調整

難度會根據等級自動增加。方塊下降速度隨著等級提升而提速。

## 開發工作流（TDD）

這個項目遵循 TDD 工作流：

1. **寫測試** - 先編寫描述期望行為的測試
2. **執行測試** - 測試首先會失敗（紅色）
3. **實現功能** - 編寫代碼使測試通過（綠色）
4. **重構** - 改進代碼質量（藍色）

## GitHub Actions 工作流

每當推送到 main 分支時，GitHub Actions 會自動：

1. 檢出代碼
2. 安裝依賴（使用 npm 緩存）
3. 執行所有測試
4. 生成測試覆蓋率報告
5. 構建項目
6. 部署到 GitHub Pages

### 部署配置

部署後，遊戲將在以下位置可用：
- `https://[username].github.io/tetris` (默認)
- 或自定義域名（需要修改 `.github/workflows/build-and-deploy.yml` 中的 `cname` 項）

## 技術棧

- **前端框架**: Vanilla JavaScript (ES6+)
- **構建工具**: Vite
- **測試框架**: Jest
- **CI/CD**: GitHub Actions
- **部署**: GitHub Pages

## 許可証

MIT

## 貢獻

歡迎提交問題和拉取請求！