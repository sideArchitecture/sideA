// generate-manifests.js
const fs = require('fs');
const path = require('path');

const projectsDir = path.join(__dirname, 'src/assets/projects');
const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

fs.readdirSync(projectsDir).forEach(projectName => {
  const projectPath = path.join(projectsDir, projectName);
  if (!fs.statSync(projectPath).isDirectory()) return;

  const files = fs.readdirSync(projectPath);
  const images = files.filter(f => imageExtensions.includes(path.extname(f).toLowerCase()));
  const cover = images.find(f => f.toLowerCase().includes('cover')) || images[0];

  const manifest = {
    cover,
    images: images.filter(img => img !== cover)
  };

  fs.writeFileSync(
    path.join(projectPath, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );

  console.log(`Manifest created for ${projectName}`);
});

/*

// to run this file:
  node generate_manifest.js

*/
