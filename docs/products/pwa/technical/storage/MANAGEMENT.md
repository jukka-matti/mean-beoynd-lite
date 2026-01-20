# Data Management

## Export Project

```typescript
async function exportProject(id: number): Promise<Blob> {
  const project = await db.projects.get(id);
  if (!project) throw new Error('Project not found');

  const json = JSON.stringify(project, null, 2);
  return new Blob([json], { type: 'application/json' });
}

// Usage
const blob = await exportProject(42);
const url = URL.createObjectURL(blob);
// Trigger download
```

---

## Import Project

```typescript
async function importProject(file: File): Promise<number> {
  const text = await file.text();
  const data = JSON.parse(text);

  // Validate structure
  if (!data.name || !data.data) {
    throw new Error('Invalid project file');
  }

  // Remove id to create new
  delete data.id;

  return db.projects.add({
    ...data,
    created: new Date(),
    updated: new Date(),
  });
}
```

---

## Storage Usage

```typescript
async function getStorageUsage(): Promise<{ used: number; quota: number }> {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    return {
      used: estimate.usage || 0,
      quota: estimate.quota || 0,
    };
  }
  return { used: 0, quota: 0 };
}
```

---

## Clear All Data

```typescript
async function clearAllData(): Promise<void> {
  await db.settings.clear();
  await db.projects.clear();
  await db.recentFiles.clear();
}
```

---

## See Also

- [OVERVIEW](./OVERVIEW.md) - Storage overview
- [Operations](./OPERATIONS.md) - CRUD operations
