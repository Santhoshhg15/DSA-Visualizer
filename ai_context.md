# 🚀 DSA Visualizer Suite — AI Migration & Project Context

This file serves as the handover documentation for the next AI agent or development session. It outlines the codebase architecture, tech stack, implemented features, recent changes, and current development state of the **DSA Visualizer Suite**.

---

## 🏗️ Repository Architecture & Tech Stack

The project is structured as a **monorepo-style portal** serving multiple interactive data structures and algorithm visualizers.

```
d:/Dsa Visualizer/
├── .env                          # Local environment secrets (e.g. GEMINI_API_KEY)
├── .gitignore                    # Version control exclusions
├── README.md                     # General developer startup guide
├── architecture.md               # Visualizer suite architectural blueprint
├── copy-dist.js                  # Script copying build folders from apps/ to dist/
├── package.json                  # Root orchestrator and workspace scripts
├── server.js                     # Express server, static router & Gemini API proxy
│
├── portal/                       # Raw static HTML gateway pages
│   ├── index.html                # Animated Portal landing page
│   ├── stack-visualizer.html     # AI Stack Visualizer frontend layout
│   └── index.html.bak            # Backup of old portal layout (untracked)
│
├── dist/                         # Unified static files served by server.js (Git ignored)
│   ├── portal/                   # Copied from /portal
│   ├── pattern/                  # Copied production bundle from apps/pattern
│   ├── tree/                     # Copied production bundle from apps/tree
│   ├── graph/                    # Copied production bundle from apps/graph
│   └── sorting/                  # Copied production bundle from apps/sorting
│
└── apps/                         # Workspace containing individual React applications
    ├── graph/                    # Graph Pathfinding & MST visualizer
    ├── sorting/                  # Sorting algorithms + Recursion Tree visualizer
    ├── tree/                     # Binary Search Tree (BST) playground
    └── pattern/                  # String pattern matching & Trie visualization
```

### Core Technologies
*   **Monorepo Core:** Node.js, Express 5.x
*   **Sub-Apps Framework:** React 19, Vite 8, TypeScript
*   **Styling:** Tailwind CSS 4, Vanilla CSS
*   **State Management:** Zustand 5
*   **External APIs:** Gemini 2.5 Flash API (used by the Stack Visualizer via a secure backend proxy `/api/translate` in `server.js`)

---

## ⚡ Development & Build Guide

All actions should be run from the repository root (`d:/Dsa Visualizer/`):

*   **Install All Dependencies:**
    ```bash
    npm run install:all
    ```
    *(Runs `npm install` in the root and recursively inside all sub-apps in `apps/`)*
    
*   **Run Development Server:**
    ```bash
    npm run dev
    ```
    *(Starts the Express server on `http://localhost:3000`)*

*   **Build the Entire Project:**
    ```bash
    npm run build
    ```
    *(Compiles all React sub-apps and executes `node copy-dist.js` to copy static assets into `/dist`)*

*   **Build Individual Apps:**
    ```bash
    npm run build:graph
    npm run build:sorting
    npm run build:tree
    npm run build:pattern
    ```

---

## 📅 Recent Work & Commit History (Branch: `main`)

The project is currently checked out on the **`main`** branch. The working tree is clean. The latest commits include:

1.  **Commit `7b4dadb` (Latest - Santhosh HG):** *docs: add AI migration context file*
    *   Added `ai_context.md` containing full details of architecture, dev instructions, feature mappings, and UI styles.
2.  **Commit `05e51af` (Santhosh HG):** *feat: Portal landing page redesign with Magic UI grid, filters, and dashboard layout*
    *   Redesigned the gateway portal index page with a modern, cursor-tracking fluid background canvas.
    *   Implemented dashboard cards, category filters, and smooth interactive hover layouts for the sub-visualizers.
3.  **Commit `8d7b922` & `a93056d` (Santhosh HG):** *feat(sorting): implement recursion tree panel with zoom/pan, maximize view, and smooth layout transitions*
    *   Designed a live, interactive **Recursion Tree Visualizer** panel specifically for **Merge Sort** and **Quick Sort** within the Sorting Visualizer.
    *   Equipped it with custom SVG node layouts, zoom/pan controls, full-screen maximizing, and smooth step transitions.
4.  **Commit `650e96f` (Santhosh HG):** *feat: Add draggable resize handles between left/center/right panels in Sorting Visualizer*
    *   Added customized draggable split-panes to make the Sorting workspace resizable and responsive.

---

## 🔍 Detailed Feature Mapping

Here is the exact feature mapping and algorithm coverage across the current codebase:

### 1. Unified Landing Portal (`/` & `/stack`)
*   **Landing Page (`portal/index.html`):** Animated entrance portal directing users to the specific visualizers.
*   **AI Stack Visualizer (`portal/stack-visualizer.html`):**
    *   Interactive Stack (Push, Pop, Peek) animations.
    *   Accepts custom user algorithms written in Python, JS, etc.
    *   Sends user code to `/api/translate` where Gemini translates it into structured JavaScript trace objects using a predefined system instructions schema. The client then steps through this stack trace visually.

### 2. Graph Visualizer (`apps/graph` / Route: `/graph`)
Visualizes grid-based pathfinding and classic graph algorithms.
*   **Pathfinding Algorithms:**
    *   Breadth-First Search (BFS)
    *   Depth-First Search (DFS)
    *   Dijkstra's Algorithm
    *   Bellman-Ford Algorithm
    *   Floyd-Warshall Algorithm
*   **Minimum Spanning Tree (MST):**
    *   Kruskal's Algorithm
    *   Prim's Algorithm
*   **Other Graph Tasks:**
    *   Topological Sort

### 3. Sorting Visualizer (`apps/sorting` / Route: `/sorting`)
Visualizes array sorting states alongside custom trace panels.
*   **Algorithms:**
    *   Bubble Sort
    *   Selection Sort
    *   Insertion Sort
    *   Merge Sort
    *   Quick Sort
*   **Features:**
    *   Interactive array rendering with speeds & size controls.
    *   **Recursion Tree Panel:** A live interactive visualization displaying the divide-and-conquer splits of Merge/Quick Sort.
    *   Draggable workspace panels.

### 4. Tree Visualizer (`apps/tree` / Route: `/tree`)
Provides an interactive Binary Search Tree (BST) sandbox.
*   **Features:**
    *   Visual representation of node insertions, deletions, and lookups.
    *   Inorder, Preorder, and Postorder traversal tracers.
    *   Bulk insert option via a numeric comma-separated parser.

### 5. String Pattern Matching (`apps/pattern` / Route: `/pattern`)
Combines traditional string search algorithms and a Trie builder sandbox.
*   **String Search Algorithms:**
    *   Naive Brute-Force Matching
    *   Knuth-Morris-Pratt (KMP) (includes visual transition arrays/prefix table)
    *   Rabin-Karp (visualizes rolling hash values and hash matches)
*   **Data Structures:**
    *   Trie Playground (visualizes word insertion, search, and prefix search path transitions step-by-step)

---

## 🎨 UI, Theme & Style Guidelines

The UI redesign on `main` establishes a high-end, developer-centric aesthetic modeled after premium developer portals (similar to Magic UI/Linear design patterns). When modifying or building visualizer components in `apps/`, align them with these design specifications.

### 1. Typography & Hierarchy
*   **Primary Font Family:** `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
*   **Base Text Size:** `17.5px` (line-height: `1.45`, letter-spacing: `0.012em`, font-weight: `400`)
*   **Main Hero Title:** `48px` (line-height: `1.1`, letter-spacing: `-0.98px`, font-weight: `500`)
*   **Card / Panel Title:** `17px` (letter-spacing: `-0.02em`, font-weight: `600`)
*   **Dashboard Big Numbers:** `36px` (letter-spacing: `-0.04em`, font-weight: `600`)
*   **Sublabels / Small Text:** `12px` to `13.5px` (font-weight: `400` or `500`)

### 2. Color System (CSS Variables)

#### ☀️ Light Mode Theme (`data-theme="light"`)
*   **Base Background:** `#ffffff`
*   **Container Background:** `#f8f9fc`
*   **Card Background:** `#ffffff` (Hover state: `#f8f9fc`)
*   **Text (Primary):** `#121317`
*   **Text (Secondary):** `#45474d`
*   **Text (Muted):** `#808080`
*   **Borders:** `rgba(33, 34, 38, 0.12)` (Hover state: `rgba(33, 34, 38, 0.35)`)
*   **Card Shadow (No heavy drops):** `0px 0px 0px 1px rgba(33, 34, 38, 0.12)` (Hover: `0px 0px 0px 1px rgba(33, 34, 38, 0.35)`)
*   **Primary Button:** Background `#121317` with text `#ffffff`
*   **Hover Glow / Ripple:** `rgba(0, 0, 0, 0.03)`
*   **Background Grid Lines:** `rgba(0, 0, 0, 0.08)`

#### 🌙 Dark Mode Theme (`data-theme="dark"`)
*   **Base Background:** `#0D0D0F`
*   **Container Background:** `#131316`
*   **Card Background:** `#131316` (Hover state: `#1C1C21`)
*   **Text (Primary):** `#F0F0F5`
*   **Text (Secondary):** `#B8B8C8`
*   **Text (Muted):** `#6B6B80`
*   **Borders:** `rgba(255, 255, 255, 0.08)` (Hover state: `rgba(255, 255, 255, 0.18)`)
*   **Card Shadow:** `0px 0px 0px 1px rgba(255, 255, 255, 0.06)` (Hover: `0px 0px 0px 1px rgba(255, 255, 255, 0.15)`)
*   **Primary Button:** Background `#F0F0F5` with text `#0D0D0F`
*   **Hover Glow / Ripple:** `rgba(255, 255, 255, 0.04)`
*   **Background Grid Lines:** `rgba(255, 255, 255, 0.07)`

### 3. Key Layout & Interactive Patterns
*   **Glassmorphism Navbar:** Uses `backdrop-filter: blur(20px)` and semi-transparent backgrounds (`rgba(255, 255, 255, 0.85)` / `rgba(13, 13, 15, 0.85)`) to create a floating overlay.
*   **Interactive Grids:** The main portal features a dynamic cursor-tracking hover grid where cells reveal a radial gradient glow following the mouse cursor.
*   **Card Borders:** Prefer thin, 1px vector borders (`box-shadow` or standard `border`) that adapt to dark/light theme variables rather than heavy fuzzy drop shadows.
*   **Border Radii:** Standard cards, headers, and control panels use `border-radius: 16px` to `20px`. Interactive action buttons use a capsule styling `border-radius: 9999px`.
*   **Transitions:** Add `transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1)` or `transition: all 0.2s ease` to all hover interactions (cards, list items, pills, toggle switches) to ensure responsiveness and premium feel.

---

## 🚀 Where to Continue Next

The primary objective on the `main` branch is to **upgrade the user interface of all sub-apps (`apps/`) to match the premium, modern, cohesive dark-mode aesthetic introduced on the portal landing page (`portal/index.html`)**.

### Recommended Tasks:
1.  **UI/UX Alignment:**
    *   Bring the glowing dark aesthetics, modern fonts, glassmorphism containers, and smooth CSS transitions into the `apps/graph`, `apps/sorting`, `apps/tree`, and `apps/pattern` CSS systems.
2.  **State Management & Testing:**
    *   Ensure all Zustand stores handle state reset safely when switching between different algorithms on the fly.
3.  **Local Server & Gemini Testing:**
    *   Make sure a `.env` file containing `GEMINI_API_KEY` is present at the root to test the AI Stack translation logic.
