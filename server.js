const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const DIST = path.join(__dirname, 'dist');

app.use(cors());
app.use(express.json());

// Portal (main landing page)
app.use(express.static(path.join(DIST, 'portal')));

// Pattern Visualizer
app.use('/pattern',
  express.static(path.join(DIST, 'pattern')));
app.get('/pattern/*any', (req, res) =>
  res.sendFile(path.join(DIST, 'pattern', 'index.html')));

// Tree Visualizer
app.use('/tree',
  express.static(path.join(DIST, 'tree')));
app.get('/tree/*any', (req, res) =>
  res.sendFile(path.join(DIST, 'tree', 'index.html')));

// Graph Visualizer
app.use('/graph',
  express.static(path.join(DIST, 'graph')));
app.get('/graph/*any', (req, res) =>
  res.sendFile(path.join(DIST, 'graph', 'index.html')));

// Sorting Visualizer (NOW STANDALONE)
app.use('/sorting',
  express.static(path.join(DIST, 'sorting')));
app.get('/sorting/*any', (req, res) =>
  res.sendFile(path.join(DIST, 'sorting', 'index.html')));

// Portal root
app.get('/', (req, res) =>
  res.sendFile(path.join(DIST, 'portal', 'index.html')));

// Stack Visualizer
app.get('/stack', (req, res) =>
  res.sendFile(path.join(DIST, 'portal', 'stack-visualizer.html')));
app.get('/stack-visualizer', (req, res) =>
  res.sendFile(path.join(DIST, 'portal', 'stack-visualizer.html')));

// Translation API
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
  console.log(`\n🚀 DSA Visualizer Suite`);
  console.log(`   Portal:   http://localhost:${PORT}`);
  console.log(`   Graph:    http://localhost:${PORT}/graph`);
  console.log(`   Sorting:  http://localhost:${PORT}/sorting`);
  console.log(`   Tree:     http://localhost:${PORT}/tree`);
  console.log(`   Pattern:  http://localhost:${PORT}/pattern`);
  console.log(`   Stack:    http://localhost:${PORT}/stack`);
});
