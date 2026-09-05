/**
 * The only module that touches localStorage.
 *
 * Every access is wrapped: private browsing modes, blocked site data, and
 * quota errors all throw on access rather than returning null, and the site
 * must stay fully usable when persistence is unavailable.
 */

import {
  createEmptyProgress,
  migrate,
  serializeExport,
  STORAGE_KEY,
  type ProgressState,
} from './schema';

export type StorageStatus = 'available' | 'unavailable';

export function detectStorage(): StorageStatus {
  try {
    const probe = '__ca_probe__';
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return 'available';
  } catch {
    return 'unavailable';
  }
}

export function readProgress(): { state: ProgressState; status: StorageStatus } {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return { state: createEmptyProgress(), status: 'available' };
    const result = migrate(JSON.parse(raw));
    if (result === null) return { state: createEmptyProgress(), status: 'available' };
    return { state: result.state, status: 'available' };
  } catch {
    return { state: createEmptyProgress(), status: 'unavailable' };
  }
}

export function writeProgress(state: ProgressState): StorageStatus {
  try {
    window.localStorage.setItem(STORAGE_KEY, serializeExport(state));
    return 'available';
  } catch {
    return 'unavailable';
  }
}

export function clearProgress(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* Nothing to clear when storage is unavailable. */
  }
}
