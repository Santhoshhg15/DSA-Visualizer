# Unified Algorithm Visualizer Portal

Welcome to the **Unified Algorithm Visualizer Portal**—a premium, visually stunning, glassmorphic suite designed to animate complex computer science operations and algorithms in real time. 

The suite comprises two fully featured modules unified under a single animated portal landing page:
1. **AI-Powered Stack Visualizer**: Translates and animates code traces dynamically using Gemini AI.
2. **String & Pattern Visualizer Suite**: Renders real-time search match phases (Naive, KMP, Rabin-Karp) and a sandboxed Trie Prefix Tree playground.

---

## 🎨 Design & Aesthetics

The visualizer implements a state-of-the-art visual architecture:
* **Interactive Backdrop**: A fluid, cursor-tracking radial gradient mesh animation floating on a deep space dark canvas (`index.html`).
* **Glassmorphic Panels**: High-contrast, frosted glass surfaces (`backdrop-filter`) with harmonized accent glows for UI components.
* **Modern Typography**: Clear geometric scaling powered by the Google Fonts font family `Outfit` and `JetBrains Mono` for precise code trace rendering.
* **Smooth Micro-Animations**: Natural, spring-like layout transitions for Trie nodes and linear pathing shifts using CSS transforms.

---

## 📁 Repository structure

```
├── .env.template                # Configuration environment template
├── .gitignore                   # Git ignore files configuration
├── README.md                    # Main developer documentation
├── index.html                   # Interactive portals gateway index
├── server.js                    # Node/Express API Key reverse-proxy & server
├── stack-visualizer.html        # Interactive Stack visualizer frontend
└── string-pattern-visualizer    # React / TypeScript / Vite Client App
    ├── src/
    │   ├── components/          # Reusable layout & visualization panels
    │   ├── engines/             # Tracing algorithms (Naive, KMP, Rabin-Karp, Trie)
    │   ├── store.ts             # Global visualizer state machine (Zustand)
    │   └── main.tsx             # Entry mountpoint
    ├── package.json             # Vite application configuration
    └── tsconfig.json            # Strict TypeScript configuration
```

---

## 🚀 Module 1: AI-Powered Stack Visualizer

A visual debugger for execution traces of stack operations (Push, Pop, Peek) supporting a custom reverse proxy API design to keep keys secure.

### Key Features
* **AI Code Interpreter**: Input custom algorithms in Python, C++, Java, JS, or Go. The server proxies the request to **Gemini 2.5 Flash**, converting it into safe JavaScript execution instructions.
* **Secure Key Handshake**: Handled via backend routes (`/api/translate`) to ensure your `GEMINI_API_KEY` is never exposed to public client inspector logs.
* **Interactive Inspector**: Stepper buttons to step forward, step backward, or auto-run traces with adjustable speed.

### Installation & Run (Local)
1. Navigate to the root directory and install node modules:
   ```bash
   npm install
   ```
2. Copy `.env.template` to `.env` and paste your Google API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3000
   ```
3. Start the node server:
   ```bash
   node server.js
   ```
4. Access the portal at `http://localhost:3000`.

---

## 🚀 Module 2: String & Pattern Visualizer Suite

A responsive **React + TypeScript + Vite** application providing side-by-side pseudocode execution steps alongside visual data representations.

### Key Features
* **Interactive Trie Sandbox (`triePlayground`)**:
  * Build a Trie visually step-by-step by inserting, searching, or checking prefixes (`startsWith`) on custom words.
  * Sibling nodes recursively calculate layout offsets to prevent overlap, adjusting heights smoothly on addition.
  * Sleek debugger controls anchored directly inside the top header toolbar to ensure visual flow is never blocked.
* **String Searching Algorithms**:
  * **Naive Algorithm**: Highlights char-by-char comparisons and shifts.
  * **Knuth-Morris-Pratt (KMP)**: Displays the calculation of the Failure Function (LPS table) in sync with string comparisons.
  * **Rabin-Karp**: Displays hash matches, hashing slide formulas, and collisons in a dedicated display grid.
* **Trace Tracer Sidebar**: Features side-by-side pseudocode highlight frames and step log descriptions (`StepLog`).

### Run (Local)
1. Navigate to the client directory:
   ```bash
   cd string-pattern-visualizer
   ```
2. Install client dependencies:
   ```bash
   npm install
   ```
3. Start the Vite hot-reloading development server:
   ```bash
   npm run dev
   ```
4. Access the suite at the provided local link (usually `http://localhost:5173`).

---

## ☁️ Production Deployment

When pushing to production environments:
1. **GitHub Pushing**: Both modules reside inside the same repository. Ensure `.env` is omitted from commits (defined in `.gitignore`).
2. **Web Host Environment Variables**: Define `GEMINI_API_KEY` on your production dashboard (e.g. Render, Railway, Vercel).
3. **Vite Build Compilation**: Compile files before distribution:
   ```bash
   cd string-pattern-visualizer
   npm run build
   ```
