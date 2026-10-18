import { useSyncExternalStore } from "react";
import { SavedDeadlineSchema, type NewDeadline, type SavedDeadline } from "./types";

/** Deadlines live only in this browser's localStorage — never on a server. */
export const STORAGE_KEY = "briefklar.deadlines";

const EMPTY: SavedDeadline[] = [];
const listeners = new Set<() => void>();

// Snapshot cache: re-parse only when the stored string changes, so getSnapshot stays referentially stable.
let cachedRaw: string | null = null;
let cachedList: SavedDeadline[] = EMPTY;

function readRaw(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/** Parses stored JSON, dropping anything that is not a valid deadline. */
function parse(raw: string | null): SavedDeadline[] {
  if (!raw) return EMPTY;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return EMPTY;
  }
  if (!Array.isArray(data)) return EMPTY;
  return data.flatMap((item) => {
    const result = SavedDeadlineSchema.safeParse(item);
    return result.success ? [result.data] : [];
  });
}

function byDate(a: SavedDeadline, b: SavedDeadline): number {
  return a.date.localeCompare(b.date) || a.createdAt.localeCompare(b.createdAt);
}

/** All saved deadlines, sorted by date (earliest first). Returns the same array until storage changes. */
export function listDeadlines(): SavedDeadline[] {
  const raw = readRaw();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedList = parse(raw).sort(byDate);
  }
  return cachedList;
}

/** Throws when storage is unavailable or full, so the UI can tell the user it was not saved. */
function write(list: SavedDeadline[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  listeners.forEach((listener) => listener());
}

export function addDeadline(input: NewDeadline): SavedDeadline {
  const deadline: SavedDeadline = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    done: false,
  };
  write([...listDeadlines(), deadline]);
  return deadline;
}

export function removeDeadline(id: string): void {
  write(listDeadlines().filter((d) => d.id !== id));
}

export function setDone(id: string, done: boolean): void {
  write(listDeadlines().map((d) => (d.id === id ? { ...d, done } : d)));
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  // Keep other open tabs in sync.
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** Saved deadlines, sorted by date. Empty during server rendering and before hydration. */
export function useDeadlines(): SavedDeadline[] {
  return useSyncExternalStore(subscribe, listDeadlines, () => EMPTY);
}
