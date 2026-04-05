import sharp from "sharp";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");

const svg = `
<svg width="560" height="460" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="card-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f0fdfa"/>
      <stop offset="100%" stop-color="#ccfbf1"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="560" height="460" fill="url(#card-bg)" rx="20"/>

  <!-- Main laptop -->
  <rect x="80" y="50" width="400" height="250" rx="14" fill="#1e293b"/>
  <rect x="94" y="64" width="372" height="222" rx="6" fill="#0D9488"/>

  <!-- Screen: rate display -->
  <rect x="114" y="84" width="200" height="40" rx="8" fill="white" opacity="0.2"/>
  <text x="134" y="112" font-family="sans-serif" font-size="24" font-weight="800" fill="white">$85 /hr</text>
  <rect x="324" y="84" width="60" height="40" rx="8" fill="#f59e0b"/>
  <text x="354" y="110" font-family="sans-serif" font-size="14" font-weight="bold" fill="white" text-anchor="middle">Calc</text>
  <rect x="394" y="84" width="52" height="40" rx="8" fill="white" opacity="0.15"/>
  <text x="420" y="110" font-family="sans-serif" font-size="14" fill="white" text-anchor="middle">Save</text>

  <!-- Screen: bar chart -->
  <rect x="114" y="140" width="52" height="80" rx="4" fill="#f59e0b" opacity="0.9"/>
  <rect x="176" y="160" width="52" height="60" rx="4" fill="#f59e0b" opacity="0.7"/>
  <rect x="238" y="130" width="52" height="90" rx="4" fill="#f59e0b"/>
  <rect x="300" y="150" width="52" height="70" rx="4" fill="#f59e0b" opacity="0.75"/>
  <rect x="362" y="120" width="52" height="100" rx="4" fill="#fbbf24"/>
  <!-- Bar labels -->
  <text x="140" y="236" font-family="sans-serif" font-size="10" fill="white" opacity="0.7" text-anchor="middle">Jan</text>
  <text x="202" y="236" font-family="sans-serif" font-size="10" fill="white" opacity="0.7" text-anchor="middle">Feb</text>
  <text x="264" y="236" font-family="sans-serif" font-size="10" fill="white" opacity="0.7" text-anchor="middle">Mar</text>
  <text x="326" y="236" font-family="sans-serif" font-size="10" fill="white" opacity="0.7" text-anchor="middle">Apr</text>
  <text x="388" y="236" font-family="sans-serif" font-size="10" fill="white" opacity="0.7" text-anchor="middle">May</text>

  <!-- Screen: bottom stat row -->
  <rect x="114" y="248" width="140" height="28" rx="6" fill="white" opacity="0.15"/>
  <text x="124" y="267" font-family="sans-serif" font-size="12" fill="white" opacity="0.8">SE Tax: $4,280</text>
  <rect x="264" y="248" width="150" height="28" rx="6" fill="white" opacity="0.15"/>
  <text x="274" y="267" font-family="sans-serif" font-size="12" fill="white" opacity="0.8">Take-home: $6,120</text>

  <!-- Laptop base -->
  <path d="M60 300 L80 300 L480 300 L500 300 L510 316 L50 316 Z" fill="#334155"/>
  <rect x="230" y="300" width="100" height="5" rx="2.5" fill="#475569"/>

  <!-- Coffee mug -->
  <rect x="460" y="240" width="50" height="48" rx="8" fill="#f59e0b"/>
  <rect x="460" y="234" width="50" height="14" rx="7" fill="#d97706"/>
  <path d="M510 250 Q530 250 530 266 Q530 282 510 282" fill="none" stroke="#d97706" stroke-width="3"/>
  <path d="M478 225 Q480 215 478 205" fill="none" stroke="#94a3b8" stroke-width="1.5" opacity="0.5"/>
  <path d="M490 225 Q492 213 490 202" fill="none" stroke="#94a3b8" stroke-width="1.5" opacity="0.4"/>

  <!-- Notepad -->
  <rect x="20" y="330" width="170" height="110" rx="8" fill="white" stroke="#e2e8f0" stroke-width="2"/>
  <text x="40" y="355" font-family="sans-serif" font-size="12" font-weight="bold" fill="#334155">To-Do</text>
  <rect x="40" y="365" width="14" height="14" rx="3" fill="#4ade80"/>
  <path d="M44 372 L46 374 L50 370" stroke="white" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <text x="62" y="376" font-family="sans-serif" font-size="11" fill="#64748b">Invoice Client A</text>
  <rect x="40" y="388" width="14" height="14" rx="3" fill="#4ade80"/>
  <path d="M44 395 L46 397 L50 393" stroke="white" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <text x="62" y="399" font-family="sans-serif" font-size="11" fill="#64748b">Update rates</text>
  <rect x="40" y="411" width="14" height="14" rx="3" fill="#e2e8f0"/>
  <text x="62" y="422" font-family="sans-serif" font-size="11" fill="#64748b">File quarterly taxes</text>

  <!-- Mini calculator -->
  <rect x="220" y="340" width="120" height="100" rx="10" fill="#1e293b"/>
  <rect x="234" y="352" width="92" height="26" rx="4" fill="#0f172a"/>
  <text x="316" y="372" font-family="monospace" font-size="16" font-weight="bold" fill="#4ade80" text-anchor="end">1,250</text>
  <rect x="234" y="384" width="26" height="20" rx="4" fill="#334155"/>
  <rect x="266" y="384" width="26" height="20" rx="4" fill="#334155"/>
  <rect x="298" y="384" width="26" height="20" rx="4" fill="#334155"/>
  <rect x="234" y="410" width="26" height="20" rx="4" fill="#334155"/>
  <rect x="266" y="410" width="26" height="20" rx="4" fill="#334155"/>
  <rect x="298" y="410" width="26" height="20" rx="4" fill="#f59e0b"/>
  <text x="311" y="424" font-family="sans-serif" font-size="12" font-weight="bold" fill="white" text-anchor="middle">=</text>

  <!-- Coins / money stack -->
  <ellipse cx="430" cy="420" rx="40" ry="12" fill="#d97706"/>
  <rect x="390" y="408" width="80" height="12" fill="#d97706"/>
  <ellipse cx="430" cy="408" rx="40" ry="12" fill="#f59e0b"/>
  <rect x="390" y="396" width="80" height="12" fill="#f59e0b"/>
  <ellipse cx="430" cy="396" rx="40" ry="12" fill="#fbbf24"/>
  <text x="430" y="400" font-family="sans-serif" font-size="12" font-weight="bold" fill="white" text-anchor="middle">$$$</text>
</svg>`;

await sharp(Buffer.from(svg)).png({ quality: 90 }).toFile(join(publicDir, "hero-illustration.png"));
console.log("Created hero-illustration.png (560x460)");
