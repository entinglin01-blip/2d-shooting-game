# 2D射擊遊戲

一個使用Phaser 3開發的2D俯視角射擊遊戲，具有敵人、多個關卡、積分系統和完整的中文UI界面。

## 功能特性

- ✅ 俯視角射擊遊戲
- ✅ 敵人AI系統
- ✅ 多個關卡
- ✅ 積分系統
- ✅ 完整的中文UI
- ✅ 血量系統
- ✅ 難度遞增

## 安裝和運行

### 前置要求
- Node.js (v14 或更高版本)
- npm 或 yarn

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

然後在瀏覽器中打開 `http://localhost:8080`

### 構建生產版本

```bash
npm run build
```

## 游戲控制

- **移動**: 方向鍵 或 WASD
- **射擊**: 鼠標點擊 或 空格鍵
- **開始/重新開始**: 空格鍵

## 游戲玩法

1. 使用方向鍵或WASD移動玩家（綠色方塊）
2. 用鼠標或空格鍵射擊敵人（紅色方塊）
3. 消滅所有敵人以進入下一關
4. 每升一關難度會增加
5. 當血量降到0時遊戲結束

## 項目結構

```
2d-shooting-game/
├── src/
│   ├── index.js              # 主入口文件
│   └── scenes/
│       ├── BootScene.js      # 資源加載場景
│       ├── MenuScene.js      # 菜單場景
│       ├── GameScene.js      # 主遊戲場景
│       └── GameOverScene.js  # 遊戲結束場景
├── dist/
│   └── index.html            # HTML入口
├── package.json
├── webpack.config.js
└── README.md
```

## 技術棧

- **Phaser 3**: 遊戲框架
- **Webpack**: 模塊打包工具
- **Babel**: JavaScript轉譯器
- **ES6+**: 現代JavaScript

## 許可證

MIT
