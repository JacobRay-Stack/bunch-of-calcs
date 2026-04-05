import sharp from "sharp";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");

// OG image: 1200x630, teal background with branding
const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="1200" height="630" fill="#0D9488"/>

  <!-- Subtle grid pattern -->
  <defs>
    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
      <rect width="60" height="60" fill="none" stroke="white" stroke-opacity="0.06" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="url(#grid)"/>

  <!-- Calculator icon (simplified) -->
  <g transform="translate(100, 160)">
    <rect width="120" height="160" rx="16" fill="white" opacity="0.2"/>
    <rect x="16" y="16" width="88" height="36" rx="8" fill="white" opacity="0.15"/>
    <rect x="16" y="68" width="22" height="18" rx="4" fill="#F59E0B" opacity="0.8"/>
    <rect x="48" y="68" width="22" height="18" rx="4" fill="#F59E0B" opacity="0.8"/>
    <rect x="80" y="68" width="22" height="18" rx="4" fill="white" opacity="0.3"/>
    <rect x="16" y="96" width="22" height="18" rx="4" fill="white" opacity="0.3"/>
    <rect x="48" y="96" width="22" height="18" rx="4" fill="white" opacity="0.3"/>
    <rect x="80" y="96" width="22" height="18" rx="4" fill="white" opacity="0.3"/>
    <rect x="16" y="124" width="22" height="18" rx="4" fill="white" opacity="0.3"/>
    <rect x="48" y="124" width="22" height="18" rx="4" fill="white" opacity="0.3"/>
    <rect x="80" y="124" width="22" height="18" rx="4" fill="#F59E0B" opacity="0.8"/>
  </g>

  <!-- Brand name -->
  <text x="280" y="280" font-family="system-ui, sans-serif" font-weight="800" font-size="80" fill="white">Bunch</text>
  <text x="580" y="280" font-family="system-ui, sans-serif" font-weight="800" font-size="80" fill="#F59E0B">of</text>
  <text x="670" y="280" font-family="system-ui, sans-serif" font-weight="800" font-size="80" fill="white">Calcs</text>

  <!-- Tagline -->
  <text x="280" y="340" font-family="system-ui, sans-serif" font-weight="400" font-size="32" fill="white" opacity="0.85">Free calculators for freelancers and solopreneurs</text>

  <!-- URL -->
  <text x="280" y="480" font-family="system-ui, sans-serif" font-weight="500" font-size="24" fill="white" opacity="0.5">bunchofcalcs.com</text>
</svg>`;

await sharp(Buffer.from(svg))
  .resize(1200, 630)
  .png()
  .toFile(join(publicDir, "og-default.png"));

console.log("Created og-default.png (1200x630)");
