// Service Worker for 小学生专项练习游戏中心
// 版本号 - 更新此版本号将触发新的缓存
const CACHE_VERSION = 'v1.1.2';
const CACHE_NAME = `games-app-${CACHE_VERSION}`;

// 需要缓存的静态资源
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/index.tsx',
];

// 需要缓存的外部资源（字体、CDN等）
const EXTERNAL_CACHE_URLS = [
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;900&family=Zcool+KuaiLe&display=swap',
  'https://fonts.googleapis.com/css2?family=Fredoka:wght@300;400;500;600;700&display=swap',
  'https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&family=Ma+Shan+Zheng&display=swap',
];

// 安装事件 - 缓存静态资源
self.addEventListener('install', (event) => {
  console.log('[Service Worker] 安装中...');

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] 缓存静态资源');
      // 分别缓存，避免外部资源失败影响安装
      return Promise.all([
        cache.addAll(STATIC_CACHE_URLS).catch(err => {
          console.warn('[Service Worker] 静态资源缓存失败:', err);
        }),
        // 外部资源逐个缓存，失败不影响整体
        ...EXTERNAL_CACHE_URLS.map(url =>
          cache.add(url).catch(err => {
            console.warn('[Service Worker] 外部资源缓存失败:', url, err);
          })
        )
      ]);
    }).then(() => {
      // 强制激活新的 Service Worker
      return self.skipWaiting();
    })
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] 激活中...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] 删除旧缓存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // 立即控制所有页面
      return self.clients.claim();
    })
  );
});

// Fetch 事件 - 缓存策略
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 跳过不支持的协议（chrome-extension, chrome:, devtools: 等）
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // 跳过非 GET 请求
  if (request.method !== 'GET') {
    return;
  }

  // 对于导航请求（页面加载），使用 Network First 策略
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // 缓存成功的响应
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // 网络失败时，返回缓存
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || caches.match('/index.html');
          });
        })
    );
    return;
  }

  // 对于其他资源
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Cache Hit - 返回缓存，同时在后台更新
        const fetchPromise = fetch(request)
          .then((response) => {
            // 更新缓存
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
            return response;
          })
          .catch(() => {
            // 更新失败也没关系，我们已经有缓存了
          });

        return cachedResponse;
      }

      // Cache Miss - 从网络获取
      return fetch(request)
        .then((response) => {
          // 只缓存成功的响应
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch((error) => {
          console.error('[Service Worker] Fetch 失败:', request.url, error);
          // 可以返回一个自定义的离线页面
          throw error;
        });
    })
  );
});

// 监听消息事件（用于手动更新缓存等）
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => {
      event.ports[0].postMessage({ success: true });
    });
  }
});
