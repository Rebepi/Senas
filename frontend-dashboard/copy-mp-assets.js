// copy-mp-assets.js
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'node_modules', '@mediapipe', 'hands');
const destDir = path.join(__dirname, 'public', 'mediapipe', 'hands');

// Archivos necesarios
const files = [
  'hands_solution_packed_assets.data',
  'hands_solution_packed_assets_loader.js',
  'hands_solution_simd_wasm_bin.js'
];

// Crear carpeta destino si no existe
fs.mkdirSync(destDir, { recursive: true });

// Copiar cada archivo
files.forEach(file => {
  const src = path.join(srcDir, file);
  const dest = path.join(destDir, file);
  fs.copyFileSync(src, dest);
  console.log(`Copiado: ${file}`);
});

console.log('Todos los archivos de MediaPipe Hands se copiaron correctamente.');
