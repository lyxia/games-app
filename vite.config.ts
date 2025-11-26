import path from 'path';
import fs from 'fs';
import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// 自定义插件：在开发模式下提供静态游戏文件
function serveStaticGames(): Plugin {
  return {
    name: 'serve-static-games',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // 处理 /science/ear/index.html 等静态游戏请求
        if (req.url?.startsWith('/science/') || req.url?.startsWith('/english/') || req.url?.startsWith('/math/')) {
          const filePath = path.join(__dirname, req.url);
          if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath);
            const ext = path.extname(filePath);
            const mimeTypes: Record<string, string> = {
              '.html': 'text/html',
              '.js': 'application/javascript',
              '.css': 'text/css',
              '.json': 'application/json',
              '.png': 'image/png',
              '.jpg': 'image/jpeg',
              '.jpeg': 'image/jpeg',
              '.gif': 'image/gif',
              '.svg': 'image/svg+xml',
            };
            res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
            res.end(content);
            return;
          }
        }
        next();
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: '/games-app/',
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react(), serveStaticGames()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
      // 确保所有模块使用同一个 React 实例（去重）
      dedupe: ['react', 'react-dom'],
    },
    optimizeDeps: {
      // 强制预构建这些依赖，确保使用同一个实例
      include: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'framer-motion',
        'lucide-react',
      ],
      // 排除子目录的 node_modules
      exclude: [],
    },
  };
});

