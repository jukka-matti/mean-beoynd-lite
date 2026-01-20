# Service Worker & PWA Caching

## PWA Configuration

The PWA uses Vite PWA plugin for service worker generation.

```typescript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com/,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-stylesheets' },
          },
        ],
      },
      manifest: {
        name: 'VaRiScout Lite',
        short_name: 'VaRiScout',
        theme_color: '#1e293b',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
});
```

---

## Caching Strategy

| Resource Type | Strategy             | Reason                      |
| ------------- | -------------------- | --------------------------- |
| HTML, JS, CSS | CacheFirst           | App shell must work offline |
| Fonts         | StaleWhileRevalidate | Performance + freshness     |
| Images        | CacheFirst           | Offline support             |
| API calls     | NetworkFirst         | Prefer fresh data           |

---

## Offline Capabilities

### What Works Offline

- ✅ Loading app shell
- ✅ Opening saved projects
- ✅ Running analysis
- ✅ Exporting charts (as images)
- ✅ License validation (cached)

### Requires Network

- ❌ Initial app load (first visit)
- ❌ License activation (one-time)
- ❌ App updates

---

## Update Handling

```typescript
// Notify user of updates
import { useRegisterSW } from 'virtual:pwa-register/react';

function App() {
  const { needRefresh, updateServiceWorker } = useRegisterSW();

  return (
    <>
      {needRefresh && (
        <UpdatePrompt onUpdate={() => updateServiceWorker(true)} />
      )}
    </>
  );
}
```

---

## See Also

- [OVERVIEW](./OVERVIEW.md) - Storage overview
- [Management](./MANAGEMENT.md) - Data management
