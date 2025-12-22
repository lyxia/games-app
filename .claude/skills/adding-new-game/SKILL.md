---
name: adding-new-game
description: 向游戏应用注册新游戏，需要更新 gameScanner.ts、dev-game.cjs 和 vite.config.ts。当用户需要添加新游戏到数学、英语或科学分类时使用，或当用户提到注册、添加、集成新游戏时使用。
---

# 添加新游戏

将新游戏注册到游戏应用系统。游戏采用手动注册方式，需要更新多个配置文件。

## 游戏类型

支持三种类型：

- **iframe**: React/Vite 应用（大多数数学/英语游戏）
- **science**: 使用 JSON 驱动的科学课程
- **english**: LessonPlan JSON 格式的英语课程

## 快速工作流程

### iframe 游戏（React/Vite）

1. **在 gameScanner.ts 中注册**

在 `src/utils/gameScanner.ts` 的 `games` 数组中添加：

```typescript
{
  category: 'math',  // 或 'english', 'science'
  name: '游戏中文名称',
  description: '游戏描述，专为四年级设计。',
  path: 'category/game-folder-name',
  folderName: 'game-folder-name',
  type: 'iframe',
  devPort: 3XXX  // 下一个可用端口
}
```

**端口分配**：
- 英语游戏：3001-3004
- 数学游戏：3005-3008
- 使用下一个顺序端口

2. **添加到 dev-game.cjs**

在 `scripts/dev-game.cjs` 的 `games` 数组中添加：

```javascript
{ name: '游戏中文名称', path: 'category/game-folder-name', devPort: 3XXX },
```

3. **更新游戏的 vite.config.ts**

确保游戏的 Vite 配置包含：

```typescript
export default defineConfig(({ mode }) => {
  return {
    base: mode === 'production' ? '/games-app/games/category/game-folder-name/' : '/',
    server: {
      port: 3XXX,  // 与上面相同的端口
      host: '0.0.0.0',
    },
    build: {
      outDir: '../../dist/games/category/game-folder-name',
      emptyOutDir: true,
    },
    plugins: [react()],
    // ... 其他配置
  };
});
```

### science/english JSON 游戏

1. **在 gameScanner.ts 中注册**

```typescript
{
  category: 'science',  // 或 'english'
  name: '课程名称',
  description: '课程描述',
  path: 'science/folder-name',
  folderName: 'folder-name',
  type: 'science',  // 或 'english'
  dataPath: '/science/folder-name/data.json'  // dist 中的 JSON 文件路径
}
```

JSON 游戏不需要修改 dev-game.cjs 或 vite.config.ts。

## 命名规范

**中文名称**：遵循现有模式
- 数学："XXX学习大冒险"、"XXX特训营"、"XXX伙伴"
- 英语："XXX闯关"、"XXX工厂"、"XXX小侦探"
- 科学："第X课：XXX"

**描述**：包含目标年级和学习目标
- 示例："通过四个互动关卡学习XXX。专为四年级数学逻辑思维设计。"

## 验证步骤

注册后验证：

1. **检查游戏显示**：访问首页，确认游戏显示在正确分类中
2. **测试开发服务器**（仅 iframe 游戏）：
   - 运行 `npm run dev:game`
   - 从菜单中选择新游戏
   - 确认在正确端口启动
3. **测试构建**（仅 iframe 游戏）：
   - 验证输出在 `dist/games/category/game-folder-name/` 中
4. **刷新浏览器**：如果游戏未显示，强制刷新（Cmd+Shift+R / Ctrl+Shift+R）

## 常见问题

**首页未显示游戏**：
- 强制刷新浏览器清除缓存
- 检查 gameScanner.ts 语法（缺少逗号、括号）
- 确认分类名称匹配（'math' 不是 'maths'）

**端口冲突**：
- 检查端口是否已被占用：`lsof -i :PORT`
- 使用下一个可用的顺序端口

**构建失败**：
- 确认 vite.config.ts 有正确的 `outDir` 路径
- 检查 `base` 路径与注册路径完全匹配
