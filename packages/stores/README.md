# @repo/stores

State management package for the todo application, built with Zustand and Immer for optimal developer experience and performance.

## Architecture Overview

This package follows domain-driven design principles with clear separation between business logic and UI concerns.

```
src/
├── todo/              # Business logic domain
│   ├── useTodoStore.ts    # Core todo operations (CRUD, filtering)
│   ├── selectors.ts       # Memoized selectors for performance
│   └── types.ts           # Domain-specific types
├── ui/                # UI state domain
│   ├── useUIStore.ts      # Interface state (loading, errors, modals)
│   └── types.ts           # UI-specific types
└── utils/             # Reusable utilities
    ├── createPersistedStore.ts  # Persistence abstraction
    └── middleware.ts            # Logging and debugging
```

## Design Decisions

### Why Zustand + Immer?

- **Zustand**: Minimal boilerplate, excellent TypeScript support, built-in persistence
- **Immer**: Safe mutations, better DX, prevents common immutability bugs

### Why Domain Separation?

- **Business Logic** (`todo/`): Core app functionality, persisted, syncs with backend
- **UI State** (`ui/`): Interface interactions, ephemeral, client-side only

### Benefits

✅ **Type Safety**: Full TypeScript coverage with proper exports  
✅ **Performance**: Memoized selectors prevent unnecessary re-renders  
✅ **Testability**: Isolated domains can be tested independently  
✅ **Maintainability**: Clear boundaries and single responsibility  
✅ **Reusability**: Works across web, mobile, desktop applications

## Usage

```typescript
import { useTodoStore, useUIStore, selectFilteredTasks } from "@repo/stores";

// In components
const { tasks, addTask, toggleTask } = useTodoStore();
const { isLoading, showError } = useUIStore();

// With performance optimization
const filteredTasks = useTodoStore(selectFilteredTasks);
```

## Testing

Each store includes comprehensive tests covering:

- Business logic operations
- State persistence
- Error handling
- Performance characteristics

```bash
pnpm test          # Run all tests
pnpm test --watch  # Watch mode for development
```
