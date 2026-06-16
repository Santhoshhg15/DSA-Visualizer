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

// Copy portal (static HTML)
copyDir(
  path.join(__dirname, 'portal'),
  path.join(__dirname, 'dist', 'portal'),
  'portal'
);

// Copy built apps
copyDir(
  path.join(__dirname, 'apps', 'pattern', 'dist'),
  path.join(__dirname, 'dist', 'pattern'),
  'pattern-visualizer'
);

copyDir(
  path.join(__dirname, 'apps', 'tree', 'dist'),
  path.join(__dirname, 'dist', 'tree'),
  'tree-visualizer'
);

copyDir(
  path.join(__dirname, 'apps', 'graph', 'dist'),
  path.join(__dirname, 'dist', 'graph'),
  'graph-visualizer'
);

copyDir(
  path.join(__dirname, 'apps', 'sorting', 'dist'),
  path.join(__dirname, 'dist', 'sorting'),
  'sorting-visualizer'
);

console.log('\n✅ All builds copied to dist/');
