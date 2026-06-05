const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'string-pattern-visualizer', 'dist');
const dest = path.join(__dirname, 'public', 'pattern');

try {
  // Remove destination if it exists
  if (fs.existsSync(dest)) {
    fs.rmSync(dest, { recursive: true, force: true });
  }

  // Copy src to dest
  fs.cpSync(src, dest, { recursive: true });
  console.log('Successfully copied build files to public/pattern');
} catch (err) {
  console.error('Error during build copy:', err);
  process.exit(1);
}
