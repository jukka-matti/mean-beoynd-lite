# Storage Operations

## Settings Operations

```typescript
// Get setting
async function getSetting<T>(key: string): Promise<T | undefined> {
  const setting = await db.settings.get(key);
  return setting?.value;
}

// Set setting
async function setSetting<T>(key: string, value: T): Promise<void> {
  await db.settings.put({ key, value });
}
```

---

## Project Operations

### Save Project

```typescript
async function saveProject(project: Project): Promise<number> {
  const now = new Date();

  if (project.id) {
    // Update existing
    await db.projects.update(project.id, {
      ...project,
      updated: now,
    });
    return project.id;
  } else {
    // Create new
    return db.projects.add({
      ...project,
      created: now,
      updated: now,
    });
  }
}
```

### Load Project

```typescript
async function loadProject(id: number): Promise<Project | undefined> {
  return db.projects.get(id);
}
```

### List Projects

```typescript
async function listProjects(): Promise<Project[]> {
  return db.projects.orderBy('updated').reverse().toArray();
}
```

### Delete Project

```typescript
async function deleteProject(id: number): Promise<void> {
  await db.projects.delete(id);
}
```

---

## Recent Files

```typescript
async function addRecentFile(file: Omit<RecentFile, 'id'>): Promise<void> {
  // Keep only last 10
  const recent = await db.recentFiles.orderBy('lastOpened').reverse().toArray();
  if (recent.length >= 10) {
    await db.recentFiles.delete(recent[recent.length - 1].id);
  }

  await db.recentFiles.add({
    ...file,
    lastOpened: new Date(),
  });
}
```

---

## See Also

- [OVERVIEW](./OVERVIEW.md) - Storage overview
- [Database](./DATABASE.md) - Schema
