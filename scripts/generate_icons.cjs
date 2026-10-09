const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Exact, high-precision SVG vector matching the user's uploaded Oase Muslim logo
function buildOaseEmblemSvg(size = 512, background = 'none') {
  let bgMarkup = '';
  if (background === 'white') {
    // Elegant rounded app icon squircle with clean white background
    bgMarkup = `
      <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="#ffffff"/>
      <rect width="${size - 4}" height="${size - 4}" x="2" y="2" rx="${size * 0.22 - 2}" fill="none" stroke="#e2e8f0" stroke-width="2"/>
    `;
  } else if (background === 'emerald') {
    bgMarkup = `
      <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="url(#bg-emerald)"/>
      <rect width="${size - 4}" height="${size - 4}" x="2" y="2" rx="${size * 0.22 - 2}" fill="none" stroke="#10b981" stroke-width="2" stroke-opacity="0.3"/>
    `;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="${size}" height="${size}">
  <defs>
    <!-- Teal-Emerald Gradient for the Crescent Moon -->
    <linearGradient id="oase-teal-grad" x1="20%" y1="0%" x2="80%" y2="100%">
      <stop offset="0%" stop-color="#0f766e"/>
      <stop offset="30%" stop-color="#0d9488"/>
      <stop offset="65%" stop-color="#059669"/>
      <stop offset="100%" stop-color="#064e3b"/>
    </linearGradient>

    <!-- Warm Golden Gradient for Inner Spiritual Flame -->
    <linearGradient id="oase-gold-grad" x1="25%" y1="0%" x2="75%" y2="100%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="30%" stop-color="#f59e0b"/>
      <stop offset="70%" stop-color="#d97706"/>
      <stop offset="100%" stop-color="#b45309"/>
    </linearGradient>

    <!-- Emerald Dark Gradient for alternative dark app icon -->
    <linearGradient id="bg-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#064e3b"/>
      <stop offset="60%" stop-color="#022c22"/>
      <stop offset="100%" stop-color="#011b15"/>
    </linearGradient>

    <filter id="icon-soft-shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#064e3b" flood-opacity="0.16"/>
    </filter>
  </defs>

  ${bgMarkup}

  <!-- Emblem Center Group (scaled to breathe inside squircle or stand alone) -->
  <g transform="translate(256, 256) scale(${background !== 'none' ? '0.82' : '0.94'}) translate(-256, -256)" filter="${background !== 'none' ? 'url(#icon-soft-shadow)' : 'none'}">
    <!-- CRESCENT MOON (HILAL) -->
    <!-- Elegantly wraps around from top slender tip down and around to right tapered tip -->
    <path d="
      M 276, 28
      C 272, 28 266, 31 261, 35
      C 152, 62 70, 160 70, 276
      C 70, 396 166, 492 286, 492
      C 362, 492 430, 452 468, 392
      C 469, 390 467, 386 464, 384
      C 453, 376 439, 356 439, 338
      C 439, 332 443, 325 448, 318
      C 450, 315 446, 312 443, 314
      C 418, 334 386, 346 352, 348
      C 232, 356 138, 260 138, 148
      C 138, 102 154, 62 186, 32
      C 192, 26 204, 21 216, 20
      C 220, 19 278, 27 276, 28 Z
    " fill="url(#oase-teal-grad)"/>

    <!-- INNER GOLDEN FLAME MOTIF (Spiritual Light / Water-drop) -->
    <!-- Left swirling golden wing -->
    <path d="
      M 288, 86
      C 288, 86 258, 168 244, 210
      C 234, 238 230, 266 238, 294
      C 248, 328 276, 354 310, 362
      C 342, 370 376, 358 398, 334
      C 384, 340 366, 342 348, 338
      C 316, 328 294, 304 286, 274
      C 278, 246 286, 216 302, 186
      C 316, 160 322, 128 318, 102
      C 316, 92 300, 82 288, 86 Z
    " fill="url(#oase-gold-grad)"/>

    <!-- Center golden flame petal -->
    <path d="
      M 312, 136
      C 312, 136 286, 194 282, 230
      C 278, 260 290, 290 314, 308
      C 334, 322 360, 320 378, 308
      C 364, 308 350, 302 338, 290
      C 322, 274 316, 248 322, 224
      C 328, 198 346, 180 352, 156
      C 356, 142 348, 130 334, 130
      C 324, 130 318, 132 312, 136 Z
    " fill="url(#oase-gold-grad)"/>

    <!-- Right base accent of the flame -->
    <path d="
      M 230, 232
      C 220, 256 218, 282 226, 308
      C 236, 350 272, 382 316, 392
      C 350, 400 388, 394 416, 374
      C 388, 386 354, 388 324, 380
      C 286, 368 256, 332 248, 296
      C 244, 278 244, 258 248, 240
      C 249, 236 233, 226 230, 232 Z
    " fill="url(#oase-gold-grad)" opacity="0.9"/>
  </g>
</svg>`;
}

// Full Logo with clean typography (Oase Muslim)
function buildFullLogoSvg(width = 600, height = 720) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 720" width="${width}" height="${height}">
  <defs>
    <linearGradient id="full-teal-grad" x1="20%" y1="0%" x2="80%" y2="100%">
      <stop offset="0%" stop-color="#0f766e"/>
      <stop offset="30%" stop-color="#0d9488"/>
      <stop offset="65%" stop-color="#059669"/>
      <stop offset="100%" stop-color="#064e3b"/>
    </linearGradient>
    <linearGradient id="full-gold-grad" x1="25%" y1="0%" x2="75%" y2="100%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="30%" stop-color="#f59e0b"/>
      <stop offset="70%" stop-color="#d97706"/>
      <stop offset="100%" stop-color="#b45309"/>
    </linearGradient>
  </defs>

  <!-- Centered Logo Emblem -->
  <g transform="translate(68, 12) scale(0.9)">
    <!-- Crescent Moon -->
    <path d="
      M 276, 28
      C 272, 28 266, 31 261, 35
      C 152, 62 70, 160 70, 276
      C 70, 396 166, 492 286, 492
      C 362, 492 430, 452 468, 392
      C 469, 390 467, 386 464, 384
      C 453, 376 439, 356 439, 338
      C 439, 332 443, 325 448, 318
      C 450, 315 446, 312 443, 314
      C 418, 334 386, 346 352, 348
      C 232, 356 138, 260 138, 148
      C 138, 102 154, 62 186, 32
      C 192, 26 204, 21 216, 20
      C 220, 19 278, 27 276, 28 Z
    " fill="url(#full-teal-grad)"/>

    <!-- Inner Flame -->
    <path d="
      M 288, 86
      C 288, 86 258, 168 244, 210
      C 234, 238 230, 266 238, 294
      C 248, 328 276, 354 310, 362
      C 342, 370 376, 358 398, 334
      C 384, 340 366, 342 348, 338
      C 316, 328 294, 304 286, 274
      C 278, 246 286, 216 302, 186
      C 316, 160 322, 128 318, 102
      C 316, 92 300, 82 288, 86 Z
    " fill="url(#full-gold-grad)"/>

    <path d="
      M 312, 136
      C 312, 136 286, 194 282, 230
      C 278, 260 290, 290 314, 308
      C 334, 322 360, 320 378, 308
      C 364, 308 350, 302 338, 290
      C 322, 274 316, 248 322, 224
      C 328, 198 346, 180 352, 156
      C 356, 142 348, 130 334, 130
      C 324, 130 318, 132 312, 136 Z
    " fill="url(#full-gold-grad)"/>

    <path d="
      M 230, 232
      C 220, 256 218, 282 226, 308
      C 236, 350 272, 382 316, 392
      C 350, 400 388, 394 416, 374
      C 388, 386 354, 388 324, 380
      C 286, 368 256, 332 248, 296
      C 244, 278 244, 258 248, 240
      C 249, 236 233, 226 230, 232 Z
    " fill="url(#full-gold-grad)" opacity="0.9"/>
  </g>

  <!-- Typography -->
  <text x="300" y="565" text-anchor="middle" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-weight="800" font-size="94" fill="#044e39" letter-spacing="-1">Oase</text>
  <text x="300" y="665" text-anchor="middle" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-weight="500" font-size="70" fill="#065f46" letter-spacing="1">Muslim</text>
</svg>`;
}

async function generateAll() {
  const publicDir = path.join(__dirname, '../public');

  // 1. Save SVG files
  fs.writeFileSync(path.join(publicDir, 'logo.svg'), buildFullLogoSvg());
  fs.writeFileSync(path.join(publicDir, 'logo-icon.svg'), buildOaseEmblemSvg(512, 'none'));
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), buildOaseEmblemSvg(512, 'none'));
  console.log('✓ SVGs written');

  // 2. Desktop & PWA App Icons (512x512, 192x192, 180x180) with clean rounded squircle
  const appIconSvg = buildOaseEmblemSvg(512, 'white');
  const appIconBuffer = Buffer.from(appIconSvg);

  await sharp(appIconBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'icon-512.png'));
  console.log('✓ icon-512.png created');

  await sharp(appIconBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'icon-192.png'));
  console.log('✓ icon-192.png created');

  await sharp(appIconBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('✓ apple-touch-icon.png created');

  // 3. Transparent Favicon PNG (64x64 & 32x32)
  const faviconSvg = buildOaseEmblemSvg(128, 'none');
  const faviconBuffer = Buffer.from(faviconSvg);
  await sharp(faviconBuffer)
    .resize(64, 64)
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));
  console.log('✓ favicon.png created');
}

generateAll().catch(err => {
  console.error(err);
  process.exit(1);
});
