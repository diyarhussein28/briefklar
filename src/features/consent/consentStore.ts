import { useSyncExternalStore } from "react";

/** The value is the ISO timestamp of when consent was given (kept on this device only). */
export const CONSENT_STORAGE_KEY = "briefklar.consent.v1";

const listeners = new Set<() => void>();
/** Fallback when localStorage cannot be written: consent lasts for this page view. */
let unsavedConsent = false;

function emit() {
  listeners.forEach((listener) => listener());
}

function onStorage(event: StorageEvent) {
  if (event.key === CONSENT_STORAGE_KEY || event.key === null) emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

export function hasConsent(): boolean {
  try {
    return localStorage.getItem(CONSENT_STORAGE_KEY) !== null || unsavedConsent;
  } catch {
    return unsavedConsent;
  }
}

export function giveConsent(): void {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, new Date().toISOString());
    unsavedConsent = false;
  } catch {
    unsavedConsent = true;
  }
  emit();
}

export function withdrawConsent(): void {
  unsavedConsent = false;
  try {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    // Nothing stored.
  }
  emit();
}

/** true/false on the client; null during SSR and hydration (consent is unknown on the server). */
export function useConsent(): boolean | null {
  return useSyncExternalStore<boolean | null>(subscribe, hasConsent, () => null);
}
