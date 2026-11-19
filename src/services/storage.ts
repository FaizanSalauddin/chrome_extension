import { WebsiteRecord } from '../types';

const STORAGE_KEY = 'analyzed_websites';

/**
 * Checks whether chrome.storage.local is accessible.
 */
function isChromeStorageAvailable(): boolean {
  return (
    typeof chrome !== 'undefined' &&
    Boolean(chrome.storage) &&
    Boolean(chrome.storage.local)
  );
}

// Fallback in-memory / localStorage helper for browser development mode
const LocalStorageFallback = {
  get(): WebsiteRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  set(data: WebsiteRecord[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      window.dispatchEvent(new Event('storage-updated'));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }
};

/**
 * Retrieve all scanned websites.
 */
export async function getWebsites(): Promise<WebsiteRecord[]> {
  if (isChromeStorageAvailable()) {
    return new Promise((resolve) => {
      chrome.storage.local.get([STORAGE_KEY], (result) => {
        if (chrome.runtime.lastError) {
          console.error('Storage read error:', chrome.runtime.lastError);
          resolve([]);
        } else {
          resolve((result[STORAGE_KEY] as WebsiteRecord[]) || []);
        }
      });
    });
  }

  // Fallback
  return LocalStorageFallback.get();
}

/**
 * Save a new website record or update an existing one.
 * Preserves scan history.
 */
export async function saveWebsite(record: WebsiteRecord): Promise<void> {
  const current = await getWebsites();
  // Prepend newest scan
  const updated = [record, ...current.filter((item) => item.id !== record.id)];

  if (isChromeStorageAvailable()) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({ [STORAGE_KEY]: updated }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  }

  LocalStorageFallback.set(updated);
}

/**
 * Delete an individual website record by ID.
 */
export async function deleteWebsite(id: string): Promise<void> {
  const current = await getWebsites();
  const updated = current.filter((item) => item.id !== id);

  if (isChromeStorageAvailable()) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({ [STORAGE_KEY]: updated }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  }

  LocalStorageFallback.set(updated);
}

/**
 * Clear all scanned records.
 */
export async function clearWebsites(): Promise<void> {
  if (isChromeStorageAvailable()) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({ [STORAGE_KEY]: [] }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  }

  LocalStorageFallback.set([]);
}

/**
 * Get a specific website record by ID.
 */
export async function getWebsiteById(id: string): Promise<WebsiteRecord | undefined> {
  const websites = await getWebsites();
  return websites.find((item) => item.id === id);
}

/**
 * Update an existing website record.
 */
export async function updateWebsite(record: WebsiteRecord): Promise<void> {
  const current = await getWebsites();
  const updated = current.map((item) => (item.id === record.id ? record : item));

  if (isChromeStorageAvailable()) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({ [STORAGE_KEY]: updated }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  }

  LocalStorageFallback.set(updated);
}

/**
 * Subscribe to storage changes.
 * Automatically triggers whenever the extension popup extracts new data or records are deleted.
 */
export function subscribeToStorageChanges(callback: () => void): () => void {
  if (isChromeStorageAvailable()) {
    const listener = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string
    ) => {
      if (areaName === 'local' && changes[STORAGE_KEY]) {
        callback();
      }
    };

    chrome.storage.onChanged.addListener(listener);
    return () => {
      chrome.storage.onChanged.removeListener(listener);
    };
  }

  const handleCustomEvent = () => callback();
  window.addEventListener('storage-updated', handleCustomEvent);
  window.addEventListener('storage', handleCustomEvent);

  return () => {
    window.removeEventListener('storage-updated', handleCustomEvent);
    window.removeEventListener('storage', handleCustomEvent);
  };
}
