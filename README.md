# AI-Powered Stack Visualizer

A visually stunning, glassmorphic algorithmic trace visualization tool for stack operations. Paste algorithms written in any programming language (Python, Java, C++, JavaScript, C# etc.), and have our integrated Gemini AI translate them securely into interactive, step-by-step debugger traces.

---

## 🛠️ Technology Stack

The project is structured with a secure **Client-Server Architecture**:

### 1. Frontend (Client)
- **HTML5 & Vanilla CSS3**: Uses curated dark-mode HSL color palettes, custom glassmorphism surfaces (`backdrop-filter`), and CSS animations (`pushIn`, `popOut`, `peekPulse`) to deliver a premium, native-app feel.
- **Vanilla JavaScript**: Handles local action recording and replaying. Implements a sandboxed `MockStack` proxy simulating Java/JS stack interfaces.

### 2. Backend Proxy (Server)
- **Node.js & Express**: Serves static pages and exposes a secure translation route.
- **Dotenv**: Manages environment configurations.
- **Node-Fetch**: Communicates with Google's Generative AI API server-side.

### 3. AI Service
- **Gemini 2.5 Flash**: Google's fast generative model, which converts non-JavaScript source code snippets into visualizer-compatible JavaScript tracing commands.

---

## 🔒 Security Architecture (API Key Protection)

To deploy the visualizer publicly without exposing your personal Gemini API key:
- **No Client Exposure**: The API key is stored exclusively in a server-side `.env` file.
- **Reverse Proxying**: The browser calls the internal route `/api/translate`. The Node server appends the API key, completes the handshake with Gemini, and returns only the translated code back to the client. The key is never visible in the browser source or network inspection panels.

---

## 🚀 Local Installation & Setup

Follow these steps to run the application locally:

### 1. Clone & Install Dependencies
Navigate into your project folder and run:
```bash
npm install
```

### 2. Configure Environment Variables
Rename the `.env.template` file to `.env`:
```bash
mv .env.template .env
```
Open the `.env` file and enter your Gemini API key:
```env
GEMINI_API_KEY=AIzaSyYourValidApiKeyHere
PORT=3000
```
*(Ensure you get your key from [Google AI Studio](https://aistudio.google.com/)).*

### 3. Start the Server
Run the startup script:
```bash
node server.js
```
Open **`http://localhost:3000`** in your browser to launch the landing page.

---

## 📁 Project Structure

```
├── .env.template          # Configuration environment template
├── .gitignore             # Git ignore instructions
├── README.md              # Technical and installation documentation
├── index.html             # Premium visualizer landing page
├── package.json           # Project dependencies and script metadata
├── server.js              # Express backend server and API Proxy
└── stack-visualizer.html  # Interactive core visualizer interface
```

---

## ☁️ Deployment Guidelines

When deploying this project to hosting platforms like **Render**, **Railway**, **Heroku**, or **Vercel**:

1. **Add Environment Variable**: Add `GEMINI_API_KEY` into your host's environment settings panel.
2. **Start Command**: Set the build command to `npm install` and start command to `node server.js`.
3. **Keep `.env` Secure**: Ensure the `.env` file is excluded from your git commits (it is automatically ignored by our `.gitignore`).
