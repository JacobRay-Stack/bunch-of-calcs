import sharp from "sharp";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");

// Homepage hero: abstract freelancer desk illustration
const svg = `
<svg width="600" height="500" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="desk-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f0fdfa"/>
      <stop offset="100%" stop-color="#ccfbf1"/>
    </linearGradient>
    <linearGradient id="screen-bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0D9488"/>
      <stop offset="100%" stop-color="#065f56"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="600" height="500" fill="url(#desk-bg)" rx="24"/>

  <!-- Subtle dot pattern -->
  <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
    <circle cx="10" cy="10" r="1" fill="#0D9488" opacity="0.1"/>
  </pattern>
  <rect width="600" height="500" fill="url(#dots)" rx="24"/>

  <!-- Desk surface -->
  <rect x="40" y="340" width="520" height="8" rx="4" fill="#0D9488" opacity="0.15"/>

  <!-- Laptop body -->
  <rect x="140" y="140" width="320" height="200" rx="12" fill="#1e293b"/>
  <!-- Laptop screen -->
  <rect x="152" y="152" width="296" height="172" rx="4" fill="url(#screen-bg)"/>

  <!-- Screen content - calculator UI -->
  <rect x="170" y="170" width="180" height="28" rx="6" fill="white" opacity="0.2"/>
  <text x="185" y="191" font-family="sans-serif" font-size="16" font-weight="bold" fill="white" opacity="0.7">$85 /hr</text>

  <!-- Screen bars/chart -->
  <rect x="170" y="210" width="40" height="50" rx="4" fill="#f59e0b" opacity="0.6"/>
  <rect x="218" y="225" width="40" height="35" rx="4" fill="#f59e0b" opacity="0.4"/>
  <rect x="266" y="195" width="40" height="65" rx="4" fill="#f59e0b" opacity="0.7"/>
  <rect x="314" y="215" width="40" height="45" rx="4" fill="#f59e0b" opacity="0.5"/>

  <!-- Screen - tax estimate box -->
  <rect x="170" y="272" width="190" height="36" rx="6" fill="white" opacity="0.15"/>
  <text x="185" y="296" font-family="sans-serif" font-size="13" fill="white" opacity="0.6">SE Tax: $4,280</text>

  <!-- Checkmark badges on screen -->
  <circle cx="410" cy="185" r="14" fill="white" opacity="0.2"/>
  <path d="M403 185 L408 190 L418 180" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.7"/>

  <!-- Laptop base -->
  <path d="M120 340 L140 340 L140 340 L460 340 L480 340 L490 355 L110 355 Z" fill="#334155"/>
  <rect x="250" y="340" width="100" height="4" rx="2" fill="#475569"/>

  <!-- Coffee mug -->
  <rect x="500" y="295" width="50" height="45" rx="8" fill="#f59e0b"/>
  <rect x="500" y="290" width="50" height="12" rx="6" fill="#d97706"/>
  <path d="M550 305 Q570 305 570 320 Q570 335 550 335" fill="none" stroke="#d97706" stroke-width="3"/>
  <!-- Steam -->
  <path d="M515 280 Q518 270 515 260" fill="none" stroke="#0D9488" stroke-width="1.5" opacity="0.3"/>
  <path d="M530 280 Q533 268 530 255" fill="none" stroke="#0D9488" stroke-width="1.5" opacity="0.25"/>

  <!-- Notepad -->
  <rect x="50" y="260" width="70" height="80" rx="4" fill="white" stroke="#e2e8f0" stroke-width="1.5"/>
  <line x1="60" y1="278" x2="110" y2="278" stroke="#cbd5e1" stroke-width="1"/>
  <line x1="60" y1="290" x2="105" y2="290" stroke="#cbd5e1" stroke-width="1"/>
  <line x1="60" y1="302" x2="100" y2="302" stroke="#cbd5e1" stroke-width="1"/>
  <line x1="60" y1="314" x2="108" y2="314" stroke="#cbd5e1" stroke-width="1"/>
  <!-- Pen -->
  <line x1="85" y1="250" x2="95" y2="268" stroke="#0D9488" stroke-width="2.5" stroke-linecap="round"/>

  <!-- Floating dollar signs -->
  <text x="480" y="180" font-family="sans-serif" font-size="24" font-weight="bold" fill="#0D9488" opacity="0.15">$</text>
  <text x="510" y="150" font-family="sans-serif" font-size="18" font-weight="bold" fill="#0D9488" opacity="0.1">$</text>
  <text x="90" y="170" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0D9488" opacity="0.12">$</text>
  <text x="60" y="210" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0D9488" opacity="0.08">$</text>

  <!-- Calculator on desk -->
  <rect x="60" y="365" width="50" height="70" rx="6" fill="#1e293b" opacity="0.7"/>
  <rect x="66" y="372" width="38" height="16" rx="3" fill="#0D9488" opacity="0.4"/>
  <circle cx="74" cy="398" r="4" fill="white" opacity="0.15"/>
  <circle cx="86" cy="398" r="4" fill="white" opacity="0.15"/>
  <circle cx="98" cy="398" r="4" fill="white" opacity="0.15"/>
  <circle cx="74" cy="412" r="4" fill="white" opacity="0.15"/>
  <circle cx="86" cy="412" r="4" fill="white" opacity="0.15"/>
  <circle cx="98" cy="412" r="4" fill="#f59e0b" opacity="0.4"/>
  <circle cx="74" cy="426" r="4" fill="white" opacity="0.15"/>
  <circle cx="86" cy="426" r="4" fill="white" opacity="0.15"/>
  <circle cx="98" cy="426" r="4" fill="white" opacity="0.15"/>

  <!-- Plant -->
  <rect x="500" y="370" width="40" height="50" rx="6" fill="#0D9488" opacity="0.3"/>
  <ellipse cx="520" cy="370" rx="25" ry="20" fill="#0D9488" opacity="0.25"/>
  <ellipse cx="510" cy="358" rx="15" ry="18" fill="#0D9488" opacity="0.2"/>
  <ellipse cx="530" cy="355" rx="18" ry="20" fill="#0D9488" opacity="0.22"/>
</svg>`;

await sharp(Buffer.from(svg)).png({ quality: 90 }).toFile(join(publicDir, "hero-illustration.png"));
console.log("Created hero-illustration.png (600x500)");
