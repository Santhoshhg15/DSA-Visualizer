const fs = require('fs');
const path = require('path');

function copyDir(src, dest, name) {
  try {
    // Remove destination if it exists
    if (fs.existsSync(dest)) {
      fs.rmSync(dest, { recursive: true, force: true });
    }

    // Copy src to dest
    fs.cpSync(src, dest, { recursive: true });
    console.log(`Successfully copied ${name} build files to ${dest}`);
  } catch (err) {
    console.error(`Error during build copy for ${name}:`, err);
    process.exit(1);
  }
}

// Copy String Pattern Visualizer
copyDir(
  path.join(__dirname, 'string-pattern-visualizer', 'dist'),
  path.join(__dirname, 'public', 'pattern'),
  'string-pattern-visualizer'
);

// Copy Tree Visualizer
copyDir(
  path.join(__dirname, 'tree-visualizer', 'dist'),
  path.join(__dirname, 'public', 'tree-visualizer'),
  'tree-visualizer'
);
