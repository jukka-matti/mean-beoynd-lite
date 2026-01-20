import { openDB, DBSchema, IDBPDatabase } from 'idb';

// Display options for capability metrics
export interface DisplayOptions {
  showCp: boolean;
  showCpk: boolean;
  showSpecs?: boolean;
  /** Lock Y-axis to full dataset range when filtering (default: true) */
  lockYAxisToFullData?: boolean;
}

// Types for saved analysis state
export interface AnalysisState {
  version: string;
  rawData: any[];
  outcome: string | null;
  factors: string[];
  specs: { usl?: number; lsl?: number; target?: number };
  grades: { max: number; label: string; color: string }[];
  filters: Record<string, any[]>;
  axisSettings: { min?: number; max?: number };
  columnAliases?: Record<string, string>;
  valueLabels?: Record<string, Record<string, string>>;
  displayOptions?: DisplayOptions;
}

export interface SavedProject {
  id: string;
  name: string;
  state: AnalysisState;
  savedAt: string;
  rowCount: number;
}

// IndexedDB schema
interface VariScoutDB extends DBSchema {
  projects: {
    key: string;
    value: SavedProject;
    indexes: { 'by-date': string };
  };
}

const DB_NAME = 'variscout-db';
const DB_VERSION = 1;
const VERSION = '1.0.0';

let dbPromise: Promise<IDBPDatabase<VariScoutDB>> | null = null;

// Initialize IndexedDB
function getDB(): Promise<IDBPDatabase<VariScoutDB>> {
  if (!dbPromise) {
    dbPromise = openDB<VariScoutDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const store = db.createObjectStore('projects', { keyPath: 'id' });
        store.createIndex('by-date', 'savedAt');
      },
    });
  }
  return dbPromise;
}

// Generate unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Save project to IndexedDB
export async function saveProject(
  name: string,
  state: Omit<AnalysisState, 'version'>
): Promise<SavedProject> {
  const db = await getDB();
  const project: SavedProject = {
    id: generateId(),
    name,
    state: { ...state, version: VERSION },
    savedAt: new Date().toISOString(),
    rowCount: state.rawData.length,
  };
  await db.put('projects', project);
  return project;
}

// Update existing project
export async function updateProject(
  id: string,
  name: string,
  state: Omit<AnalysisState, 'version'>
): Promise<SavedProject> {
  const db = await getDB();
  const project: SavedProject = {
    id,
    name,
    state: { ...state, version: VERSION },
    savedAt: new Date().toISOString(),
    rowCount: state.rawData.length,
  };
  await db.put('projects', project);
  return project;
}

// Load project from IndexedDB
export async function loadProject(id: string): Promise<SavedProject | undefined> {
  const db = await getDB();
  return db.get('projects', id);
}

// List all saved projects
export async function listProjects(): Promise<SavedProject[]> {
  const db = await getDB();
  const projects = await db.getAllFromIndex('projects', 'by-date');
  return projects.reverse(); // Most recent first
}

// Delete project from IndexedDB
export async function deleteProject(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('projects', id);
}

// Rename project
export async function renameProject(id: string, newName: string): Promise<void> {
  const db = await getDB();
  const project = await db.get('projects', id);
  if (project) {
    project.name = newName;
    await db.put('projects', project);
  }
}

// Export state to downloadable .vrs file
export function exportToFile(state: Omit<AnalysisState, 'version'>, filename: string): void {
  const exportState: AnalysisState = { ...state, version: VERSION };
  const blob = new Blob([JSON.stringify(exportState, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.vrs') ? filename : `${filename}.vrs`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Import state from .vrs file
export function importFromFile(file: File): Promise<AnalysisState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const content = e.target?.result as string;
        const state = JSON.parse(content) as AnalysisState;
        resolve(state);
      } catch (err) {
        reject(new Error('Invalid file format'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

// Debounce utility for auto-save
export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): T & { cancel: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const debounced = ((...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  }) as T & { cancel: () => void };

  debounced.cancel = () => {
    if (timeoutId) clearTimeout(timeoutId);
  };

  return debounced;
}
