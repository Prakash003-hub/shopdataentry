const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate valid binary PNG icon with green (#16A34A) background
function createPngIcon(size, filename) {
  const png = new PNG({ width: size, height: size });

  // Green color #16A34A -> R: 22, G: 163, B: 74
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (size * y + x) << 2;

      // Rounded corners margin
      const radius = size * 0.2;
      const inCornerTL = x < radius && y < radius && Math.hypot(x - radius, y - radius) > radius;
      const inCornerTR = x > size - radius && y < radius && Math.hypot(x - (size - radius), y - radius) > radius;
      const inCornerBL = x < radius && y > size - radius && Math.hypot(x - radius, y - (size - radius)) > radius;
      const inCornerBR = x > size - radius && y > size - radius && Math.hypot(x - (size - radius), y - (size - radius)) > radius;

      if (inCornerTL || inCornerTR || inCornerBL || inCornerBR) {
        png.data[idx] = 0;
        png.data[idx + 1] = 0;
        png.data[idx + 2] = 0;
        png.data[idx + 3] = 0; // Transparent
      } else {
        // Brand Green Background (#16A34A)
        png.data[idx] = 22;
        png.data[idx + 1] = 163;
        png.data[idx + 2] = 74;
        png.data[idx + 3] = 255; // Opaque

        // Draw White Inner Badge Circle & Lettering (S)
        const centerX = size / 2;
        const centerY = size / 2;
        const distToCenter = Math.hypot(x - centerX, y - centerY);

        if (distToCenter < size * 0.35 && distToCenter > size * 0.33) {
          // White Ring
          png.data[idx] = 255;
          png.data[idx + 1] = 255;
          png.data[idx + 2] = 255;
        }

        // Draw letter S shape in center
        const relX = (x - centerX) / size;
        const relY = (y - centerY) / size;

        // Simple central logo accent
        if (Math.abs(relX) < 0.15 && Math.abs(relY) < 0.15) {
          if (
            (relY < -0.05 && relY > -0.12 && relX > -0.12 && relX < 0.12) ||
            (relY > 0.05 && relY < 0.12 && relX > -0.12 && relX < 0.12) ||
            (relY >= -0.05 && relY <= 0.05 && relX >= -0.03 && relX <= 0.03)
          ) {
            png.data[idx] = 255;
            png.data[idx + 1] = 255;
            png.data[idx + 2] = 255;
          }
        }
      }
    }
  }

  const buffer = PNG.sync.write(png);
  fs.writeFileSync(path.join(publicDir, filename), buffer);
  console.log(`Generated binary PNG: ${filename} (${size}x${size})`);
}

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
sizes.forEach((s) => createPngIcon(s, `pwa-${s}x${s}.png`));
createPngIcon(180, 'apple-touch-icon.png');
createPngIcon(512, 'maskable-icon.png');

console.log('All binary PNG icons generated successfully!');
