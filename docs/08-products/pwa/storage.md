# PWA Storage

Data persistence using IndexedDB.

---

## Storage Strategy

| Data Type        | Storage      | Rationale                    |
| ---------------- | ------------ | ---------------------------- |
| Datasets         | IndexedDB    | Large files, structured data |
| Statistics cache | IndexedDB    | Avoid recalculation          |
| Settings         | IndexedDB    | Complex objects              |
| Theme preference | localStorage | Simple, sync access          |
| License key      | IndexedDB    | Encrypted at rest            |

---

## IndexedDB Schema

Using Dexie.js as the wrapper:

```typescript
const db = new Dexie('variscout');

db.version(1).stores({
  projects: '++id, name, createdAt, updatedAt',
  datasets: '++id, projectId, name, data',
  settings: 'key',
  license: 'key',
});
```

---

## Data Flow

```
FILE UPLOAD                     INDEXEDDB                    UI
    │                               │                         │
    │── Parse CSV ─────────────────▶│                         │
    │                               │── Store dataset ───────▶│
    │                               │                         │
    │                               │── Calculate stats ─────▶│
    │                               │   (cached)              │
    │                               │                         │
    │                               │◀── User selects ────────│
    │                               │    dataset              │
    │                               │                         │
    │                               │── Load dataset ────────▶│
    │                               │   (from cache)          │
```

---

## Storage Limits

| Browser | Typical Limit | Notes                    |
| ------- | ------------- | ------------------------ |
| Chrome  | 60% of disk   | Persisted if user allows |
| Firefox | 50% of disk   | May be evicted           |
| Safari  | 1GB           | May prompt user          |

**Recommendation:** Warn users if approaching ~500MB.

---

## Data Persistence

```typescript
// Check if storage is persisted
const isPersisted = await navigator.storage.persisted();

// Request persistence (prompts user)
if (!isPersisted) {
  const granted = await navigator.storage.persist();
}
```

---

## Export / Backup

Users can export their data:

| Format | Contains                           | Use Case         |
| ------ | ---------------------------------- | ---------------- |
| .vrs   | Full project (datasets + settings) | Backup/restore   |
| .csv   | Single dataset                     | Data portability |
| .png   | Chart screenshot                   | Reports          |

---

## Clear Data

Clearing browser data removes:

- All projects and datasets
- Settings
- License key (must re-enter)

**Warning:** No cloud backup means data loss is permanent.

---

## See Also

- [ADR-003: IndexedDB](../../07-decisions/adr-003-indexeddb.md)
- [Offline-First Architecture](../../05-technical/architecture/offline-first.md)
