# PWA 测试指南 - Chrome 浏览器

## 🚀 快速开始

### 启动测试环境
```bash
# 1. 构建生产版本
npm run build

# 2. 启动预览服务器
npm run preview

# 3. 打开浏览器访问
# http://localhost:4173/games-app/
```

## 📊 测试检查清单

### ✅ 基础检查

#### 1. Service Worker 注册
- [ ] 打开 Chrome DevTools (F12)
- [ ] 查看 Console 标签
- [ ] 确认看到：`✅ Service Worker 注册成功`

#### 2. Manifest 配置
- [ ] DevTools > Application > Manifest
- [ ] 确认应用名称：小学生专项练习游戏中心
- [ ] 确认主题色：#8B5CF6 (紫色)
- [ ] 确认图标列表已加载

#### 3. 缓存功能
- [ ] DevTools > Application > Cache Storage
- [ ] 确认看到 `games-app-v1.0.0` 缓存
- [ ] 展开查看已缓存的资源

### ✅ 离线测试

#### 方法 1：DevTools 模拟
1. **开启离线模式**
   - DevTools > Network 标签
   - 下拉菜单选择 "Offline"

2. **刷新页面**
   - 按 `Cmd+R` (Mac) 或 `Ctrl+R` (Windows)

3. **验证结果**
   - [ ] 页面正常加载
   - [ ] 可以浏览游戏列表
   - [ ] 之前访问过的游戏可以打开
   - [ ] Console 没有错误信息

#### 方法 2：真实离线测试
1. 正常浏览应用几分钟（访问多个页面）
2. 关闭浏览器标签
3. 断开网络连接（关闭 WiFi）
4. 重新打开 `http://localhost:4173/games-app/`
5. 验证缓存的内容可以访问

### ✅ Lighthouse 审计

1. **运行审计**
   - DevTools > Lighthouse 标签
   - 选择 Categories: Progressive Web App
   - 点击 "Analyze page load"

2. **检查得分**
   - [ ] PWA 得分 ≥ 90 分
   - [ ] 可安装性检查通过
   - [ ] Service Worker 检查通过
   - [ ] 离线启动检查通过

3. **常见扣分项**
   - 图标尺寸不足（需要生成真实图标）
   - Apple Touch Icon 缺失（已配置）
   - 主题色配置（已配置）

### ✅ 安装测试

#### 桌面安装
1. **Chrome 桌面**
   - [ ] 地址栏右侧显示安装图标 ➕
   - [ ] 点击安装图标
   - [ ] 确认安装对话框出现
   - [ ] 点击"安装"
   - [ ] 应用作为独立窗口打开
   - [ ] 窗口标题显示应用名称
   - [ ] 无浏览器地址栏

#### 移动设备安装 (iPad/iPhone)
1. **Safari 浏览器**
   - [ ] 点击分享按钮 ⬆️
   - [ ] 找到"添加到主屏幕"选项
   - [ ] 设置名称和图标
   - [ ] 点击"添加"
   - [ ] 主屏幕出现应用图标
   - [ ] 点击图标启动应用
   - [ ] 全屏显示，无浏览器 UI

## 🔧 DevTools 常用功能

### Application 标签功能

#### Service Workers 面板
```
功能按钮：
- Update: 手动检查更新
- Unregister: 注销 Service Worker
- Bypass for network: 跳过 SW，直接访问网络
- Update on reload: 每次刷新时更新 SW
```

#### Cache Storage 面板
```
操作：
- 右键缓存项 > Delete: 删除单个缓存
- 右键 Cache Storage > Clear: 清空所有缓存
- 点击资源查看缓存的内容
```

#### Manifest 面板
```
显示内容：
- Identity: 应用名称、简称
- Presentation: 显示模式、方向
- Icons: 图标列表预览
- Protocol handlers: 协议处理器
```

### Network 标签技巧

#### 查看缓存命中
1. 刷新页面
2. 查看 Network 列表
3. 从 Service Worker 加载的资源会显示：
   - Size 列显示 `(ServiceWorker)`
   - 或显示 `from ServiceWorker`

#### 模拟网络条件
```
下拉菜单选项：
- Online: 正常网络
- Slow 3G: 慢速 3G
- Fast 3G: 快速 3G
- Offline: 离线模式
```

## 🐛 常见问题排查

### Service Worker 未注册

**症状**：Console 显示注册失败或没有注册信息

**检查**：
1. 确保使用的是生产构建（`npm run build` + `npm run preview`）
2. 确保访问的是 `localhost` 或 HTTPS
3. 检查 `public/service-worker.js` 文件是否存在
4. 查看 Console 的错误信息

**解决**：
```bash
# 重新构建
npm run build

# 清除浏览器缓存
# DevTools > Application > Storage > Clear site data
```

### 缓存未更新

**症状**：修改代码后，页面显示旧内容

**解决**：
1. 修改 `service-worker.js` 中的版本号：
   ```javascript
   const CACHE_VERSION = 'v1.0.1'; // 递增版本号
   ```

2. 重新构建：
   ```bash
   npm run build
   npm run preview
   ```

3. 强制刷新：`Cmd+Shift+R` (Mac) 或 `Ctrl+Shift+R` (Windows)

4. 或手动清除：
   - DevTools > Application > Service Workers > Unregister
   - DevTools > Application > Cache Storage > 右键删除

### 图标不显示

**症状**：Manifest 中图标无法加载，Lighthouse 报错

**原因**：图标文件未生成

**解决**：
1. 打开 `public/generate-icons.html`
2. 生成所有尺寸的图标
3. 将图标文件放到 `public/icons/` 目录
4. 重新构建项目

### 离线不工作

**症状**：断网后页面无法访问

**检查**：
1. Service Worker 是否激活
   ```
   DevTools > Application > Service Workers
   状态应该是 "activated and is running"
   ```

2. 缓存是否包含必要资源
   ```
   DevTools > Application > Cache Storage
   检查是否有 index.html、JS、CSS 文件
   ```

3. 是否先在线访问过
   ```
   首次访问需要在线，以便 Service Worker 缓存资源
   ```

**解决**：
1. 在线访问应用，浏览各个页面
2. 等待缓存完成（查看 Cache Storage）
3. 再测试离线功能

## 📱 真实设备测试

### 使用手机/平板测试

#### 通过同一网络访问
1. 确保电脑和移动设备在同一 WiFi
2. 查看预览服务器的 Network 地址：
   ```
   ➜  Network: http://10.184.67.229:4173/games-app/
   ```
3. 在移动设备浏览器输入该地址

#### iOS (iPhone/iPad)
- 必须使用 **Safari** 浏览器
- Chrome/Firefox 不支持添加到主屏幕

#### Android
- Chrome、Edge、Firefox 都支持
- Chrome 会自动显示"添加到主屏幕"横幅

## 🎯 完美 PWA 的标准

根据 Lighthouse 审计，一个完美的 PWA 应该：

### 必须项
- [x] 注册 Service Worker
- [x] 在离线状态下响应 200
- [x] 提供 manifest.json
- [x] 设置 viewport meta 标签
- [x] 设置 theme-color

### 推荐项
- [x] 配置 Apple Touch Icon
- [ ] 提供所有尺寸的图标（需生成真实图标）
- [x] manifest 设置 display: standalone
- [x] manifest 设置 start_url
- [ ] 配置启动画面（可选）

## 🔗 有用的资源

- [Chrome DevTools Application 面板](https://developer.chrome.com/docs/devtools/progressive-web-apps/)
- [Lighthouse PWA 审计](https://developer.chrome.com/docs/lighthouse/pwa/)
- [Service Worker 生命周期](https://web.dev/service-worker-lifecycle/)
- [PWA 最佳实践](https://web.dev/pwa-checklist/)

## 💡 测试技巧

### 快速重置测试环境
```bash
# DevTools Console 执行：

// 清除所有缓存
caches.keys().then(keys => keys.forEach(key => caches.delete(key)))

// 注销 Service Worker
navigator.serviceWorker.getRegistrations().then(regs => regs.forEach(reg => reg.unregister()))

// 然后刷新页面
location.reload()
```

### 模拟首次安装体验
1. 打开隐身窗口/无痕模式（`Cmd+Shift+N` 或 `Ctrl+Shift+N`）
2. 访问应用 URL
3. 观察首次加载和安装提示

### 测试更新流程
1. 修改 `service-worker.js` 中的 `CACHE_VERSION`
2. 重新构建并刷新页面
3. 观察 Console 中的更新日志
4. 验证新版本是否正确安装

祝测试顺利！🎮
