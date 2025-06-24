import { StateCreator } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Enhanced persistence configuration with better error handling and performance
 */
export interface PersistedStoreConfig<T> {
  /** Storage key name */
  name: string;

  /** Custom storage implementation (defaults to localStorage) */
  storage?: "localStorage" | "sessionStorage" | "memory";

  /** Only persist specific parts of state */
  partialize?: (state: T) => Partial<T>;

  /** Transform state on hydration */
  onRehydrateStorage?: (state: T | undefined) => void;

  /** Skip hydration on initial load */
  skipHydration?: boolean;

  /** Custom serialization/deserialization */
  serialize?: (state: T) => string;
  deserialize?: (str: string) => T;

  /** Version for migration support */
  version?: number;
  migrate?: (persistedState: unknown, version: number) => T;
}

/**
 * Creates a persisted store with enhanced error handling and performance
 */
export function createPersistedStore<T>(
  stateCreator: StateCreator<T>,
  config: PersistedStoreConfig<T>,
): StateCreator<T> {
  const {
    name,
    storage = "localStorage",
    partialize,
    onRehydrateStorage,
    skipHydration = false,
    serialize,
    deserialize,
    version = 1,
    migrate,
  } = config;

  // Create appropriate storage implementation
  const getStorage = () => {
    try {
      switch (storage) {
        case "sessionStorage":
          return createJSONStorage(() => sessionStorage);
        case "memory":
          return createJSONStorage(() => createMemoryStorage());
        case "localStorage":
        default:
          return createJSONStorage(() => localStorage);
      }
    } catch (error) {
      console.warn(
        `Failed to access ${storage}, falling back to memory storage:`,
        error,
      );
      return createJSONStorage(() => createMemoryStorage());
    }
  };

  const persistOptions = {
    name,
    storage: getStorage(),
    partialize,
    skipHydration,
    version,
    migrate,

    // Enhanced serialization with error handling
    serialize: serialize ? { stringify: serialize } : undefined,
    deserialize: deserialize ? { parse: deserialize } : undefined,

    // Enhanced hydration with error handling
    onRehydrateStorage:
      () => (state: T | undefined, error: Error | undefined) => {
        if (error) {
          console.error(`Failed to rehydrate store "${name}":`, error);
          return;
        }

        if (onRehydrateStorage && state) {
          try {
            onRehydrateStorage(state);
          } catch (rehydrateError) {
            console.error(
              `Error in onRehydrateStorage for "${name}":`,
              rehydrateError,
            );
          }
        }
      },
  };

  return persist(
    stateCreator,
    persistOptions as any,
  ) as unknown as StateCreator<T>;
}

/**
 * Memory storage implementation for fallback scenarios
 */
function createMemoryStorage() {
  const storage = new Map<string, string>();

  return {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
    removeItem: (key: string) => storage.delete(key),
  };
}

/**
 * Date-aware serialization for stores that contain Date objects
 */
export function createDateAwareSerializer<T>() {
  return {
    serialize: (state: T): string => {
      return JSON.stringify(state, (key, value) => {
        // Convert Date objects to ISO strings
        if (value instanceof Date) {
          return { __type: "Date", value: value.toISOString() };
        }
        return value;
      });
    },

    deserialize: (str: string): T => {
      return JSON.parse(str, (key, value) => {
        // Convert ISO strings back to Date objects
        if (value && typeof value === "object" && value.__type === "Date") {
          return new Date(value.value);
        }
        return value;
      });
    },
  };
}

/**
 * Utility to check if storage is available
 */
export function isStorageAvailable(
  storageType: "localStorage" | "sessionStorage",
): boolean {
  try {
    const storage = window[storageType];
    const testKey = "__storage_test__";
    storage.setItem(testKey, "test");
    storage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}
