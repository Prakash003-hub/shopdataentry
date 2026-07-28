const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write SVG icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" rx="120" fill="#16A34A"/>
  <circle cx="256" cy="256" r="180" fill="#ffffff" opacity="0.18"/>
  <text x="256" y="270" font-family="Arial, sans-serif" font-size="160" font-weight="900" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">SUBI</text>
  <text x="256" y="380" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="#E2E8F0" text-anchor="middle">ONLINE SERVICE</text>
</svg>`;

fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent);

// Generate placeholder HTML icon images or PNG equivalents
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
sizes.forEach(size => {
  fs.writeFileSync(path.join(publicDir, `pwa-${size}x${size}.png`), svgContent);
});
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), svgContent);
fs.writeFileSync(path.join(publicDir, 'maskable-icon.png'), svgContent);

console.log('PWA icons created successfully in public directory!');
