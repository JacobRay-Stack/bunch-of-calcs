import sharp from "sharp";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { mkdirSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public", "blog");
mkdirSync(publicDir, { recursive: true });

const categories = {
  taxes: {
    bg: "#9f1239",
    bgEnd: "#6b0f28",
    accent: "#fecdd3",
    icon: `<rect x="340" y="120" width="220" height="280" rx="20" fill="none" stroke="${"#fecdd350"}" stroke-width="3"/>
      <rect x="370" y="155" width="160" height="55" rx="8" fill="${"#fecdd320"}"/>
      <rect x="370" y="230" width="45" height="35" rx="6" fill="${"#fecdd318"}"/>
      <rect x="427" y="230" width="45" height="35" rx="6" fill="${"#fecdd318"}"/>
      <rect x="484" y="230" width="45" height="35" rx="6" fill="${"#fecdd318"}"/>
      <rect x="370" y="275" width="45" height="35" rx="6" fill="${"#fecdd318"}"/>
      <rect x="427" y="275" width="45" height="35" rx="6" fill="${"#fecdd318"}"/>
      <rect x="484" y="275" width="45" height="35" rx="6" fill="${"#fecdd318"}"/>
      <rect x="370" y="320" width="45" height="35" rx="6" fill="${"#fecdd318"}"/>
      <rect x="427" y="320" width="103" height="35" rx="6" fill="${"#fecdd325"}"/>
      <text x="450" y="192" font-family="sans-serif" font-size="28" font-weight="bold" fill="${"#fecdd360"}">$1,099</text>`,
    label: "Taxes",
  },
  pricing: {
    bg: "#0D9488",
    bgEnd: "#065f56",
    accent: "#ccfbf1",
    icon: `<circle cx="450" cy="260" r="100" fill="none" stroke="${"#ccfbf140"}" stroke-width="3"/>
      <text x="450" y="245" font-family="sans-serif" font-size="52" font-weight="bold" fill="${"#ccfbf150"}" text-anchor="middle">$</text>
      <text x="450" y="295" font-family="sans-serif" font-size="20" fill="${"#ccfbf140"}" text-anchor="middle">/hour</text>
      <line x1="370" y1="180" x2="530" y2="340" stroke="${"#ccfbf115"}" stroke-width="2"/>
      <line x1="390" y1="160" x2="510" y2="360" stroke="${"#ccfbf110"}" stroke-width="1.5"/>`,
    label: "Pricing",
  },
  profit: {
    bg: "#d97706",
    bgEnd: "#92400e",
    accent: "#fef3c7",
    icon: `<polyline points="340,340 400,280 450,310 520,200 570,220" fill="none" stroke="${"#fef3c750"}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="570" cy="220" r="6" fill="${"#fef3c760"}"/>
      <line x1="340" y1="340" x2="340" y2="180" stroke="${"#fef3c720"}" stroke-width="1.5"/>
      <line x1="340" y1="340" x2="580" y2="340" stroke="${"#fef3c720"}" stroke-width="1.5"/>
      <rect x="365" y="300" width="25" height="40" rx="3" fill="${"#fef3c718"}"/>
      <rect x="400" y="270" width="25" height="70" rx="3" fill="${"#fef3c722"}"/>
      <rect x="435" y="285" width="25" height="55" rx="3" fill="${"#fef3c718"}"/>
      <rect x="470" y="250" width="25" height="90" rx="3" fill="${"#fef3c722"}"/>
      <rect x="505" y="230" width="25" height="110" rx="3" fill="${"#fef3c726"}"/>
      <rect x="540" y="245" width="25" height="95" rx="3" fill="${"#fef3c722"}"/>`,
    label: "Profit",
  },
  planning: {
    bg: "#7c3aed",
    bgEnd: "#5b21b6",
    accent: "#ede9fe",
    icon: `<rect x="350" y="160" width="200" height="200" rx="16" fill="none" stroke="${"#ede9fe30"}" stroke-width="3"/>
      <line x1="350" y1="210" x2="550" y2="210" stroke="${"#ede9fe20"}" stroke-width="2"/>
      <line x1="410" y1="160" x2="410" y2="360" stroke="${"#ede9fe15"}" stroke-width="1.5"/>
      <line x1="470" y1="160" x2="470" y2="360" stroke="${"#ede9fe15"}" stroke-width="1.5"/>
      <circle cx="440" cy="250" r="6" fill="${"#ede9fe40"}"/>
      <circle cx="500" cy="290" r="6" fill="${"#ede9fe40"}"/>
      <circle cx="380" cy="330" r="6" fill="${"#ede9fe40"}"/>
      <rect x="370" y="232" width="20" height="4" rx="2" fill="${"#ede9fe25"}"/>
      <rect x="370" y="272" width="20" height="4" rx="2" fill="${"#ede9fe25"}"/>
      <rect x="370" y="312" width="20" height="4" rx="2" fill="${"#ede9fe25"}"/>`,
    label: "Planning",
  },
};

for (const [key, cat] of Object.entries(categories)) {
  const svg = `
<svg width="1200" height="400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg-${key}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${cat.bg}"/>
      <stop offset="100%" stop-color="${cat.bgEnd}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="400" fill="url(#bg-${key})"/>

  <!-- Subtle grid pattern -->
  <pattern id="grid-${key}" width="40" height="40" patternUnits="userSpaceOnUse">
    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="${cat.accent}" stroke-opacity="0.06" stroke-width="1"/>
  </pattern>
  <rect width="1200" height="400" fill="url(#grid-${key})"/>

  <!-- Decorative circles -->
  <circle cx="100" cy="350" r="180" fill="${cat.accent}" fill-opacity="0.04"/>
  <circle cx="700" cy="-50" r="250" fill="${cat.accent}" fill-opacity="0.03"/>

  <!-- Category icon area -->
  ${cat.icon}

  <!-- Bottom fade -->
  <rect y="360" width="1200" height="40" fill="url(#bg-${key})" opacity="0.5"/>
</svg>`;

  await sharp(Buffer.from(svg)).png({ quality: 90 }).toFile(join(publicDir, `hero-${key}.png`));
  console.log(`Created hero-${key}.png`);
}
