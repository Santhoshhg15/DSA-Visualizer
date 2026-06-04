# String & Pattern Visualizer Suite (React Module)

A modular, high-performance visualization suite built with **React**, **TypeScript**, **Vite**, and **Zustand** for demonstrating core string operations and prefix-tree properties.

---

## 🎨 Architecture & Components

The application is structured into isolated layers to preserve execution integrity:

1. **State Machine (`store.ts`)**:
   - Manages state frames for algorithms, target inputs, active highlight coordinates, and logs.
   - Triggers clean Hot Module Replacement (HMR) state rehydration during local development.

2. **Core Layout Engines (`src/engines/`)**:
   - **Naive & KMP Tracers**: Generates visual action frames mapping step-by-step pointers, sub-index matches, mismatches, and LPS table updates.
   - **Rabin-Karp Engine**: Traces sliding hash calculation steps, displaying prime modulus evaluations and final validations.
   - **Trie Playground Engine**: Records recursive steps for dynamic nodes insertion, char validation, node checks, and End-of-Word path highlights.

3. **Visual Renderers (`src/components/`)**:
   - `TrieTreeCanvas.tsx`: Renders custom SVG nodes using CSS dynamic transforms to animate transition steps smoothly without sibling layout overlap.
   - `TriePseudocode.tsx` & `Pseudocode.tsx`: Highlight code tracer lines synchronized in real time with the active playback frame.
   - `TrieExplanation.tsx`: Displays active operation stats, result states, and description details.
   - `StepLog.tsx`: List logs of visual steps.

---

## 🛠️ Local Development & Build

### 1. Requirements
* Node.js (version 18+)
* npm

### 2. Install Dependencies
```bash
npm install
```

### 3. Running Dev Server (HMR)
```bash
npm run dev
```

### 4. Build for Production
This compiles the TypeScript files and bundles code:
```bash
npm run build
```
The distribution files will build into the `dist/` directory.

---

## 📝 Key Design Highlights
* **Header-Anchored Play Controls**: Trie playback controls are anchored in the top navbar (`variant="header"`) to keep the SVG visual tree canvas completely unobstructed.
* **Side-by-Side Code Tracing**: All pseudocode panel elements are laid out in a right-hand sidebar to display lines alongside the canvas layout without scrolling.
* **CSS-Animated Node Transition**: Switched SVG visual transitions to CSS transforms to animate repositioning steps smoothly when nodes are created.
