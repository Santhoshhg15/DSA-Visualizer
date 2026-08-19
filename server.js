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

// DP Visualizer Suite
app.use('/dp',
  express.static(path.join(DIST, 'dp')));
app.get('/dp/*any', (req, res) =>
  res.sendFile(path.join(DIST, 'dp', 'index.html')));

// Binary Search Visualizer
app.use('/binary-search',
  express.static(path.join(DIST, 'binary-search')));
app.get('/binary-search/*any', (req, res) =>
  res.sendFile(path.join(DIST, 'binary-search', 'index.html')));

// Sliding Window Visualizer
app.use('/sliding-window',
  express.static(path.join(DIST, 'sliding-window')));
app.get('/sliding-window/*any', (req, res) =>
  res.sendFile(path.join(DIST, 'sliding-window', 'index.html')));

// Portal root
app.get('/', (req, res) =>
  res.sendFile(path.join(DIST, 'portal', 'index.html')));

// Stack Visualizer
app.get('/stack', (req, res) =>
  res.sendFile(path.join(DIST, 'portal', 'stack-visualizer.html')));
app.get('/stack-visualizer', (req, res) =>
  res.sendFile(path.join(DIST, 'portal', 'stack-visualizer.html')));


app.listen(PORT, () => {
  console.log(`\n🚀 DSA Visualizer Suite`);
  console.log(`   Portal:   http://localhost:${PORT}`);
  console.log(`   Graph:    http://localhost:${PORT}/graph`);
  console.log(`   Sorting:  http://localhost:${PORT}/sorting`);
  console.log(`   Tree:     http://localhost:${PORT}/tree`);
  console.log(`   Pattern:  http://localhost:${PORT}/pattern`);
  console.log(`   Stack:    http://localhost:${PORT}/stack`);
  console.log(`   DP:       http://localhost:${PORT}/dp`);
  console.log(`   Binary Search: http://localhost:${PORT}/binary-search`);
  console.log(`   Sliding Window: http://localhost:${PORT}/sliding-window`);
});
