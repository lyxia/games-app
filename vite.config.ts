import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: '/games-app/',
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
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

