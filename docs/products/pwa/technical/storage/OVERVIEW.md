# PWA Storage Architecture

VaRiScout Lite is a fully offline-capable PWA. All user data stays on the user's device using IndexedDB. No server-side storage of user data.

```
STORAGE PHILOSOPHY
─────────────────────────────────────────────────────────────────

✓ 100% client-side: Data never leaves user's browser
✓ Offline-first: Works without internet after first load
✓ GDPR simple: "We don't have your data"
✓ No sync complexity: Each device is independent
```

---

## Storage Technologies

| Technology     | Use Case                    | Persistence  | Limit  |
| -------------- | --------------------------- | ------------ | ------ |
| IndexedDB      | Projects, settings, license | Permanent    | ~50MB+ |
| localStorage   | Quick preferences           | Permanent    | ~5MB   |
| sessionStorage | Temp state                  | Session only | ~5MB   |
| Cache API      | App files (PWA)             | Permanent    | Varies |

### Our Choice: IndexedDB (via Dexie.js)

- **Why**: Handles complex data (projects with multiple datasets), async, large storage
- **Library**: Dexie.js (simpler API than raw IndexedDB)

---

## Related Documentation

- [Database](./DATABASE.md) - Schema and data models
- [Operations](./OPERATIONS.md) - CRUD operations
- [Management](./MANAGEMENT.md) - Data management features
- [Service Worker](./SERVICE-WORKER.md) - PWA caching
