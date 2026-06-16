# DSA Visualizer Suite

Interactive step-by-step visualization engine for Data Structures and Algorithms.

## Architecture

```
dsa-visualizer/
├── apps/           # All visualizer sub-apps
│   ├── graph/      # Graph algorithms (BFS, DFS, Dijkstra...)
│   ├── sorting/    # Sorting algorithms (Bubble, Merge, Quick...)
│   ├── tree/       # Tree visualizer (BST operations)
│   └── pattern/    # String pattern matching (KMP, Rabin-Karp)
├── portal/         # Main landing page (static HTML)
├── dist/           # Built output (generated, do not edit)
├── server.js       # Express server
├── copy-dist.js    # Build copy script
└── package.json    # Root orchestrator
```

## Routes

| URL | App/Portal |
|---|---|
| `/` | Portal landing page |
| `/graph` | Graph Visualizer |
| `/sorting` | Sorting Visualizer |
| `/tree` | Tree Visualizer |
| `/pattern` | Pattern Matching Visualizer |
| `/stack` | Stack Visualizer |

## Development

Install all dependencies:
```bash
npm run install:all
```

Build all apps:
```bash
npm run build
```

Run server:
```bash
npm run dev
```

Build individual app:
```bash
npm run build:graph
npm run build:sorting
npm run build:tree
npm run build:pattern
```

## Tech Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- Zustand 5
- Express 5 (server)
