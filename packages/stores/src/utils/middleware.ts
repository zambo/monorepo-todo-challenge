import { StateCreator } from "zustand";
import { devtools, DevtoolsOptions } from "zustand/middleware";

/**
 * Enhanced devtools configuration
 */
export interface DevtoolsConfig extends DevtoolsOptions {
  /** Store name for debugging */
  name: string;

  /** Enable only in development */
  enabled?: boolean;

  /** Custom action names */
  actionTypes?: Record<string, string>;
}

/**
 * Logger configuration
 */
export interface LoggerConfig {
  /** Enable logging */
  enabled?: boolean;

  /** Log level */
  level?: "debug" | "info" | "warn" | "error";

  /** Store name for logs */
  name?: string;

  /** Custom logger function */
  logger?: (message: string, ...args: unknown[]) => void;

  /** Actions to exclude from logging */
  excludeActions?: string[];
}

/**
 * Creates enhanced devtools middleware with better debugging
 */
export function createDevtoolsMiddleware<T>(
  config: DevtoolsConfig,
): (stateCreator: StateCreator<T>) => StateCreator<T> {
  const {
    name,
    enabled = process.env.NODE_ENV === "development",
    ...options
  } = config;

  return (stateCreator) => {
    if (!enabled) {
      return stateCreator;
    }

    return devtools(stateCreator, {
      name,
      ...options,
    });
  };
}

/**
 * Creates logging middleware for state changes
 */
export function createLoggerMiddleware<T>(
  config: LoggerConfig = {},
): (stateCreator: StateCreator<T>) => StateCreator<T> {
  const {
    enabled = process.env.NODE_ENV === "development",
    name = "Store",
    logger = console.log,
  } = config;

  return (stateCreator) => {
    if (!enabled) {
      return stateCreator;
    }

    return (set, get, api) => {
      const wrappedSet: typeof set = (partial, replace) => {
        const prevState = get();

        // Call the original set function
        set(partial, replace);

        const nextState = get();

        // Log the state change
        if (prevState !== nextState) {
          const timestamp = new Date().toISOString();
          const logMessage = `[${name}] State updated at ${timestamp}`;

          try {
            logger(logMessage, {
              previous: prevState,
              next: nextState,
              diff: getStateDiff(prevState, nextState),
            });
          } catch (error) {
            console.warn("Logger middleware error:", error);
          }
        }
      };

      return stateCreator(wrappedSet, get, api);
    };
  };
}

/**
 * Performance monitoring middleware
 */
export interface PerformanceConfig {
  /** Enable performance monitoring */
  enabled?: boolean;

  /** Store name for performance logs */
  name?: string;

  /** Threshold in ms for slow operations */
  slowThreshold?: number;

  /** Custom performance logger */
  onSlowOperation?: (operationName: string, duration: number) => void;
}

export function createPerformanceMiddleware<T>(
  config: PerformanceConfig = {},
): (stateCreator: StateCreator<T>) => StateCreator<T> {
  const {
    enabled = process.env.NODE_ENV === "development",
    name = "Store",
    slowThreshold = 16, // 16ms for 60fps
    onSlowOperation = (operation, duration) =>
      console.warn(`[${name}] Slow operation "${operation}": ${duration}ms`),
  } = config;

  return (stateCreator) => {
    if (!enabled) {
      return stateCreator;
    }

    return (set, get, api) => {
      const wrappedSet: typeof set = (partial, replace) => {
        const start = performance.now();
        set(partial, replace);
        const duration = performance.now() - start;

        if (duration > slowThreshold) {
          onSlowOperation("setState", duration);
        }
      };

      return stateCreator(wrappedSet, get, api);
    };
  };
}

/**
 * Utility to get state differences for logging
 */
function getStateDiff<T>(prev: T, next: T): Partial<T> {
  if (typeof prev !== "object" || typeof next !== "object") {
    return next;
  }

  const diff: Partial<T> = {};
  const allKeys = new Set([
    ...Object.keys(prev as object),
    ...Object.keys(next as object),
  ]);

  for (const key of allKeys) {
    const prevValue = (prev as Record<string, unknown>)[key];
    const nextValue = (next as Record<string, unknown>)[key];

    if (prevValue !== nextValue) {
      (diff as Record<string, unknown>)[key] = nextValue;
    }
  }

  return diff;
}

/**
 * Composable middleware creator
 */
export function composeMiddleware<T>(
  ...middlewares: Array<(stateCreator: StateCreator<T>) => StateCreator<T>>
): (stateCreator: StateCreator<T>) => StateCreator<T> {
  return (stateCreator) => {
    return middlewares.reduceRight(
      (acc, middleware) => middleware(acc),
      stateCreator,
    );
  };
}
