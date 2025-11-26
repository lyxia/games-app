// 导出 App 组件供路由系统使用
export { default as App } from './App';

// 独立运行时挂载到 DOM
import { createRoot } from 'react-dom/client';
import App from './App';

if (typeof window !== 'undefined' && document.getElementById('root')) {
  const rootElement = document.getElementById('root');
  if (rootElement && !rootElement.hasChildNodes()) {
    const root = createRoot(rootElement);
    root.render(<App />);
  }
}