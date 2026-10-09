import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function generate() {
  const svgPath = path.join(rootDir, 'public', 'logo-icon.svg');
  const svgBuffer = fs.readFileSync(svgPath);

  const targets = [
    { name: 'icon-192.png', size: 192 },
    { name: 'icon-512.png', size: 512 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'favicon.png', size: 64 },
  ];

  for (const t of targets) {
    const outPath = path.join(rootDir, 'public', t.name);
    await sharp(svgBuffer)
      .resize(t.size, t.size)
      .png()
      .toFile(outPath);
    console.log(`Generated: ${t.name} (${t.size}x${t.size})`);
  }
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
