const fs = require('fs');
const path = require('path');

function copyDir(src, dest, name) {
  try {
    if (fs.existsSync(dest)) {
      fs.rmSync(dest, { recursive: true, force: true });
    }
    fs.cpSync(src, dest, { recursive: true });
    console.log(`✓ Copied ${name} → ${dest}`);
  } catch (err) {
    console.error(`✗ Error copying ${name}:`, err);
    process.exit(1);
  }
}

function copyFile(src, dest, name) {
  try {
    fs.cpSync(src, dest);
    console.log(`✓ Copied ${name} → ${dest}`);
  } catch (err) {
    console.error(`✗ Error copying ${name}:`, err);
    process.exit(1);
  }
}

const DIST = path.join(__dirname, 'dist');

// Ensure dist exists
if (!fs.existsSync(DIST)) fs.mkdirSync(DIST, { recursive: true });

// Copy portal files directly to dist/ root (so dist/index.html exists for Vercel)
copyFile(
  path.join(__dirname, 'portal', 'index.html'),
  path.join(DIST, 'index.html'),
  'portal/index.html'
);
copyFile(
  path.join(__dirname, 'portal', 'stack-visualizer.html'),
  path.join(DIST, 'stack-visualizer.html'),
  'portal/stack-visualizer.html'
);
copyFile(
  path.join(__dirname, 'portal', 'favicon.svg'),
  path.join(DIST, 'favicon.svg'),
  'portal/favicon.svg'
);

// Copy built apps into subdirectories
copyDir(
  path.join(__dirname, 'apps', 'pattern', 'dist'),
  path.join(DIST, 'pattern'),
  'pattern-visualizer'
);

copyDir(
  path.join(__dirname, 'apps', 'tree', 'dist'),
  path.join(DIST, 'tree'),
  'tree-visualizer'
);

copyDir(
  path.join(__dirname, 'apps', 'graph', 'dist'),
  path.join(DIST, 'graph'),
  'graph-visualizer'
);

copyDir(
  path.join(__dirname, 'apps', 'sorting', 'dist'),
  path.join(DIST, 'sorting'),
  'sorting-visualizer'
);

console.log('\n✅ All builds copied to dist/');
console.log('   dist/index.html         → portal landing page');
console.log('   dist/stack-visualizer.html → stack visualizer');
console.log('   dist/pattern/            → pattern app');
console.log('   dist/tree/               → tree app');
console.log('   dist/graph/              → graph app');
console.log('   dist/sorting/            → sorting app');
