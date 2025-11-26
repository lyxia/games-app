# 小学生专项练习游戏中心

一个专为小学生设计的互动学习游戏平台，包含英语语法、数学和科学专项训练游戏。

## 📚 项目简介

这是一个基于 React + Vite 构建的教育游戏平台，旨在通过有趣的互动游戏帮助小学生学习英语语法、数学和科学知识。项目采用模块化设计，每个游戏都是独立的模块，便于维护和扩展。

## ✨ 功能特性

- 🎮 **丰富的游戏内容**：包含多个英语语法、数学和科学专项训练游戏
- 🎨 **精美的界面设计**：使用 Tailwind CSS 和 Framer Motion 打造流畅的动画效果
- 📱 **响应式设计**：支持桌面端和移动端访问
- 🚀 **快速加载**：使用 Vite 构建工具，提供极速的开发体验
- 🔄 **模块化架构**：每个游戏独立开发，便于管理和扩展

## 🎯 游戏列表

### 英语游戏

1. **英语语法闯关大冒险** (`grammar-adventure-1`)
   - 学习 Be 动词和第三人称单数规则
   - 包含多个关卡和互动练习

2. **单词魔法工厂** (`word-magic-factory-2`)
   - 掌握第三人称单数动词规则
   - 魔法主题的趣味学习体验

3. **语法小侦探：第三课时** (`plural-verbs-3`)
   - 主语 -> 三单 -> 动词变形
   - 侦探主题的闯关游戏

4. **逻辑与写作构建者** (`logic-&-writing-builder-4`)
   - 学习短语、第三人称单数动词和逻辑推理
   - 建筑主题的游戏设计

### 数学游戏

1. **平行与垂直特训营** (`parallel-lines-1`)
   - 通过概念记忆卡、陷阱大扫除、图形辨析等模块
   - 全面掌握平行与垂直的知识点

2. **垂线与距离：几何探险工厂** (`parallel-lines-2`)
   - 通过实验探索、场景应用和知识检测
   - 深入学习垂线和点到直线距离的概念

### 科学游戏

1. **第4课：我们是怎样听到声音的** (`ear`)
   - 交互式耳朵解剖图、声音传播模拟
   - 听觉结构与作用配对游戏

## 🛠️ 技术栈

- **前端框架**：React 19.2.0
- **构建工具**：Vite 6.2.0
- **路由**：React Router DOM 6.28.0
- **动画**：Framer Motion 12.23.24
- **样式**：Tailwind CSS (CDN)
- **语言**：TypeScript 5.8.2
- **图标**：Lucide React 0.554.0

## 📁 项目结构

```
app/
├── src/                    # 主应用源码
│   ├── App.tsx            # 主应用组件（路由配置）
│   ├── components/        # 共享组件
│   │   ├── HomePage.tsx  # 首页
│   │   ├── GameCard.tsx  # 游戏卡片
│   │   └── GameRouter.tsx # 游戏路由
│   └── utils/
│       └── gameScanner.ts # 游戏扫描工具
├── english/               # 英语游戏目录
│   ├── grammar-adventure-1/
│   ├── word-magic-factory-2/
│   ├── plural-verbs-3/
│   └── logic-&-writing-builder-4/
├── math/                  # 数学游戏目录
│   ├── parallel-lines-1/
│   └── parallel-lines-2/
├── science/               # 科学游戏目录
│   └── ear/
├── .github/
│   └── workflows/
│       └── deploy.yml     # GitHub Actions 部署配置
├── index.html            # 主 HTML 文件
├── index.tsx             # 入口文件
├── vite.config.ts        # Vite 配置
└── package.json          # 项目依赖
```

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

启动后访问 `http://localhost:3000`

### 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist/` 目录

### 预览生产构建

```bash
npm run preview
```

## 📦 部署

### GitHub Pages 部署

项目已配置 GitHub Actions 自动部署：

1. 将代码推送到 GitHub 仓库
2. 在仓库设置中启用 GitHub Pages：
   - 进入 **Settings** > **Pages**
   - Source 选择 **GitHub Actions**
3. 每次推送到 `main` 或 `master` 分支时，GitHub Actions 会自动构建并部署
4. 部署完成后，访问地址为：`https://你的用户名.github.io/games-app/`

### 手动部署

如果需要手动部署到其他平台：

```bash
# 构建项目
npm run build

# 将 dist/ 目录的内容上传到你的服务器
```

## 🔧 配置说明

### 路由配置

项目使用 `HashRouter` 以适配 GitHub Pages 部署。URL 格式为：
- 首页：`/#/`
- 游戏页面：`/#/game/english/grammar-adventure-1`

### Base 路径

在 `vite.config.ts` 中配置了 `base: '/games-app/'`，如果部署到其他路径，需要相应修改。

### 添加新游戏

1. 在 `english/`、`math/` 或 `science/` 目录下创建新的游戏文件夹
2. 在 `src/utils/gameScanner.ts` 中添加游戏信息
3. 在 `src/components/GameRouter.tsx` 中添加路由映射

## 📝 开发规范

- 使用 TypeScript 进行类型检查
- 遵循 React Hooks 最佳实践
- 使用 Tailwind CSS 进行样式设计
- 保持代码格式统一（建议使用 Prettier）

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

本项目为私有项目。

## 📞 联系方式

如有问题或建议，请通过 GitHub Issues 联系。

---

**注意**：本项目专为小学生设计，所有游戏内容均针对四年级学生水平定制。

