const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Serve the static HTML frontend from public (for stack-visualizer, index, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Serve String Pattern Visualizer static files at /pattern prefix
app.use('/pattern', express.static(path.join(__dirname, 'public', 'pattern')));

// Serve index at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve Stack Visualizer app at /stack, /stack-visualizer, and legacy /visualizer path
app.get('/stack', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'stack-visualizer.html'));
});
app.get('/stack-visualizer', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'stack-visualizer.html'));
});
app.get('/visualizer', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'stack-visualizer.html'));
});

// Fallback for String Pattern Visualizer SPA router paths
app.get('/pattern/*any', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pattern', 'index.html'));
});

// Translation API Endpoint
app.post('/api/translate', async (req, res) => {
  const { code } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!code) {
    return res.status(400).json({ error: 'No code provided for translation.' });
  }

  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API Key is not configured on the server.' });
  }

  const systemPrompt = `You are a helper that translates algorithms from any programming language into standard, trace-compatible JavaScript.
You MUST output ONLY clean, runnable JavaScript code. Do not include markdown code block tags (\`\`\`javascript or \`\`\`), do not write explanations, do not include comments.
The visualizer provides a globally defined 'stack' object. Any stack variable or stack-like container in the source code (e.g. s1, st, my_stack, etc.) MUST be aliased to the 'stack' object.
The 'stack' object supports:
- stack.push(value)
- stack.pop() // returns the popped value
- stack.peek() // returns top value without popping
- stack.isEmpty() // returns boolean
- stack.size() // returns integer
- stack.clear()
- stack.top // getter to inspect the top value

Example Translation:
Source (Python):
s = "{[]}"
for char in s:
    if char == '{':
        stack.push(char)
    elif char == '}':
        stack.pop()

Output (JS):
let s = "{[]}";
for (let char of s) {
    if (char === '{') {
        stack.push(char);
    } else if (char === '}') {
        stack.pop();
    }
}

Now, translate the following source code into visualizer-compatible JavaScript. Remember, no code block backticks or formatting, just plain text JavaScript:`;

  try {
    const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemPrompt },
              { text: code }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const errMsg = errData.error?.message || response.statusText;
      return res.status(response.status).json({ error: `Gemini API Error: ${errMsg}` });
    }

    const data = await response.json();
    let translated = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!translated) {
      return res.status(502).json({ error: 'Invalid response structure from Gemini API.' });
    }

    // Strip markdown formatting if returned
    translated = translated.replace(/^```[a-zA-Z]*\n/i, '').replace(/\n```$/i, '').trim();
    res.json({ translated });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Server error processing translation request.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} to access the Stack Visualizer securely`);
});
