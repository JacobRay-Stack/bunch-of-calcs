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
    bgEnd: "#4c0519",
    accent: "#fecdd3",
    accentDark: "#fb7185",
    svg: `
      <!-- Receipt / 1099 form -->
      <rect x="80" y="60" width="340" height="280" rx="16" fill="white" opacity="0.95"/>
      <rect x="80" y="60" width="340" height="60" rx="16" fill="#fda4af"/>
      <rect x="80" y="104" width="340" height="16" fill="#fda4af"/>
      <text x="250" y="100" font-family="sans-serif" font-size="24" font-weight="bold" fill="#9f1239" text-anchor="middle">1099-NEC</text>
      <rect x="110" y="140" width="120" height="10" rx="4" fill="#e2e8f0"/>
      <rect x="110" y="162" width="200" height="10" rx="4" fill="#e2e8f0"/>
      <rect x="110" y="184" width="160" height="10" rx="4" fill="#e2e8f0"/>
      <line x1="110" y1="215" x2="390" y2="215" stroke="#e2e8f0" stroke-width="2"/>
      <text x="110" y="250" font-family="sans-serif" font-size="16" fill="#64748b">Total Income</text>
      <text x="390" y="250" font-family="sans-serif" font-size="22" font-weight="bold" fill="#9f1239" text-anchor="end">$87,500</text>
      <text x="110" y="280" font-family="sans-serif" font-size="16" fill="#64748b">SE Tax</text>
      <text x="390" y="280" font-family="sans-serif" font-size="22" font-weight="bold" fill="#be123c" text-anchor="end">$12,363</text>
      <text x="110" y="310" font-family="sans-serif" font-size="16" fill="#64748b">Effective Rate</text>
      <text x="390" y="310" font-family="sans-serif" font-size="22" font-weight="bold" fill="#be123c" text-anchor="end">14.1%</text>

      <!-- Calculator -->
      <rect x="780" y="80" width="200" height="260" rx="16" fill="#1e293b"/>
      <rect x="800" y="100" width="160" height="50" rx="8" fill="#0f172a"/>
      <text x="940" y="135" font-family="monospace" font-size="28" font-weight="bold" fill="#4ade80" text-anchor="end">4,280</text>
      <rect x="800" y="166" width="45" height="36" rx="6" fill="#334155"/><text x="822" y="190" font-family="sans-serif" font-size="16" fill="#94a3b8" text-anchor="middle">7</text>
      <rect x="855" y="166" width="45" height="36" rx="6" fill="#334155"/><text x="877" y="190" font-family="sans-serif" font-size="16" fill="#94a3b8" text-anchor="middle">8</text>
      <rect x="910" y="166" width="45" height="36" rx="6" fill="#334155"/><text x="932" y="190" font-family="sans-serif" font-size="16" fill="#94a3b8" text-anchor="middle">9</text>
      <rect x="800" y="210" width="45" height="36" rx="6" fill="#334155"/><text x="822" y="234" font-family="sans-serif" font-size="16" fill="#94a3b8" text-anchor="middle">4</text>
      <rect x="855" y="210" width="45" height="36" rx="6" fill="#334155"/><text x="877" y="234" font-family="sans-serif" font-size="16" fill="#94a3b8" text-anchor="middle">5</text>
      <rect x="910" y="210" width="45" height="36" rx="6" fill="#334155"/><text x="932" y="234" font-family="sans-serif" font-size="16" fill="#94a3b8" text-anchor="middle">6</text>
      <rect x="800" y="254" width="45" height="36" rx="6" fill="#334155"/><text x="822" y="278" font-family="sans-serif" font-size="16" fill="#94a3b8" text-anchor="middle">1</text>
      <rect x="855" y="254" width="45" height="36" rx="6" fill="#334155"/><text x="877" y="278" font-family="sans-serif" font-size="16" fill="#94a3b8" text-anchor="middle">2</text>
      <rect x="910" y="254" width="45" height="36" rx="6" fill="#334155"/><text x="932" y="278" font-family="sans-serif" font-size="16" fill="#94a3b8" text-anchor="middle">3</text>
      <rect x="800" y="298" width="100" height="36" rx="6" fill="#334155"/><text x="850" y="322" font-family="sans-serif" font-size="16" fill="#94a3b8" text-anchor="middle">0</text>
      <rect x="910" y="298" width="45" height="36" rx="6" fill="#f59e0b"/><text x="932" y="322" font-family="sans-serif" font-size="16" font-weight="bold" fill="white" text-anchor="middle">=</text>

      <!-- Dollar signs floating -->
      <text x="520" y="120" font-family="sans-serif" font-size="60" font-weight="bold" fill="white" opacity="0.15">$</text>
      <text x="620" y="200" font-family="sans-serif" font-size="40" font-weight="bold" fill="white" opacity="0.1">$</text>
      <text x="560" y="320" font-family="sans-serif" font-size="50" font-weight="bold" fill="white" opacity="0.12">$</text>
      <text x="680" y="100" font-family="sans-serif" font-size="35" font-weight="bold" fill="white" opacity="0.08">$</text>`,
  },
  pricing: {
    bg: "#0D9488",
    bgEnd: "#042f2e",
    accent: "#ccfbf1",
    accentDark: "#2dd4bf",
    svg: `
      <!-- Rate card -->
      <rect x="80" y="60" width="340" height="280" rx="16" fill="white" opacity="0.95"/>
      <rect x="110" y="90" width="80" height="28" rx="14" fill="#ccfbf1"/>
      <text x="150" y="110" font-family="sans-serif" font-size="14" font-weight="600" fill="#0D9488" text-anchor="middle">Hourly</text>
      <text x="250" y="175" font-family="sans-serif" font-size="72" font-weight="800" fill="#0f172a" text-anchor="middle">$85</text>
      <text x="250" y="205" font-family="sans-serif" font-size="18" fill="#64748b" text-anchor="middle">per hour</text>
      <line x1="110" y1="225" x2="390" y2="225" stroke="#e2e8f0" stroke-width="2"/>
      <text x="110" y="255" font-family="sans-serif" font-size="14" fill="#64748b">Annual (1,800 hrs)</text>
      <text x="390" y="255" font-family="sans-serif" font-size="18" font-weight="bold" fill="#0D9488" text-anchor="end">$153,000</text>
      <text x="110" y="285" font-family="sans-serif" font-size="14" fill="#64748b">After taxes</text>
      <text x="390" y="285" font-family="sans-serif" font-size="18" font-weight="bold" fill="#0D9488" text-anchor="end">$112,400</text>
      <text x="110" y="315" font-family="sans-serif" font-size="14" fill="#64748b">Monthly take-home</text>
      <text x="390" y="315" font-family="sans-serif" font-size="18" font-weight="bold" fill="#0D9488" text-anchor="end">$9,367</text>

      <!-- Slider UI -->
      <rect x="520" y="100" width="400" height="200" rx="16" fill="white" opacity="0.12"/>
      <text x="540" y="140" font-family="sans-serif" font-size="16" font-weight="600" fill="white">Your Rate</text>
      <rect x="540" y="155" width="360" height="8" rx="4" fill="white" opacity="0.2"/>
      <rect x="540" y="155" width="216" height="8" rx="4" fill="#f59e0b"/>
      <circle cx="756" cy="159" r="14" fill="#f59e0b"/>
      <circle cx="756" cy="159" r="6" fill="white"/>
      <text x="540" y="200" font-family="sans-serif" font-size="14" fill="white" opacity="0.7">$25/hr</text>
      <text x="900" y="200" font-family="sans-serif" font-size="14" fill="white" opacity="0.7" text-anchor="end">$200/hr</text>

      <text x="540" y="250" font-family="sans-serif" font-size="16" font-weight="600" fill="white">Hours / Week</text>
      <rect x="540" y="265" width="360" height="8" rx="4" fill="white" opacity="0.2"/>
      <rect x="540" y="265" width="270" height="8" rx="4" fill="#2dd4bf"/>
      <circle cx="810" cy="269" r="14" fill="#2dd4bf"/>
      <circle cx="810" cy="269" r="6" fill="white"/>`,
  },
  profit: {
    bg: "#d97706",
    bgEnd: "#451a03",
    accent: "#fef3c7",
    accentDark: "#fbbf24",
    svg: `
      <!-- Bar chart -->
      <rect x="80" y="40" width="440" height="320" rx="16" fill="white" opacity="0.95"/>
      <text x="110" y="80" font-family="sans-serif" font-size="18" font-weight="bold" fill="#0f172a">Monthly Profit</text>
      <text x="490" y="80" font-family="sans-serif" font-size="14" fill="#22c55e" font-weight="600" text-anchor="end">+12.4%</text>

      <!-- Y axis labels -->
      <text x="105" y="118" font-family="sans-serif" font-size="11" fill="#94a3b8" text-anchor="end">$10k</text>
      <text x="105" y="168" font-family="sans-serif" font-size="11" fill="#94a3b8" text-anchor="end">$7.5k</text>
      <text x="105" y="218" font-family="sans-serif" font-size="11" fill="#94a3b8" text-anchor="end">$5k</text>
      <text x="105" y="268" font-family="sans-serif" font-size="11" fill="#94a3b8" text-anchor="end">$2.5k</text>
      <text x="105" y="318" font-family="sans-serif" font-size="11" fill="#94a3b8" text-anchor="end">$0</text>

      <!-- Grid lines -->
      <line x1="115" y1="113" x2="500" y2="113" stroke="#f1f5f9" stroke-width="1"/>
      <line x1="115" y1="163" x2="500" y2="163" stroke="#f1f5f9" stroke-width="1"/>
      <line x1="115" y1="213" x2="500" y2="213" stroke="#f1f5f9" stroke-width="1"/>
      <line x1="115" y1="263" x2="500" y2="263" stroke="#f1f5f9" stroke-width="1"/>
      <line x1="115" y1="313" x2="500" y2="313" stroke="#f1f5f9" stroke-width="1"/>

      <!-- Bars -->
      <rect x="130" y="213" width="36" height="100" rx="4" fill="#fed7aa"/>
      <rect x="180" y="183" width="36" height="130" rx="4" fill="#fed7aa"/>
      <rect x="230" y="163" width="36" height="150" rx="4" fill="#fed7aa"/>
      <rect x="280" y="193" width="36" height="120" rx="4" fill="#fed7aa"/>
      <rect x="330" y="153" width="36" height="160" rx="4" fill="#fed7aa"/>
      <rect x="380" y="133" width="36" height="180" rx="4" fill="#f59e0b"/>
      <rect x="430" y="113" width="36" height="200" rx="4" fill="#d97706"/>

      <!-- Bar labels -->
      <text x="148" y="335" font-family="sans-serif" font-size="10" fill="#94a3b8" text-anchor="middle">Jan</text>
      <text x="198" y="335" font-family="sans-serif" font-size="10" fill="#94a3b8" text-anchor="middle">Feb</text>
      <text x="248" y="335" font-family="sans-serif" font-size="10" fill="#94a3b8" text-anchor="middle">Mar</text>
      <text x="298" y="335" font-family="sans-serif" font-size="10" fill="#94a3b8" text-anchor="middle">Apr</text>
      <text x="348" y="335" font-family="sans-serif" font-size="10" fill="#94a3b8" text-anchor="middle">May</text>
      <text x="398" y="335" font-family="sans-serif" font-size="10" fill="#94a3b8" text-anchor="middle">Jun</text>
      <text x="448" y="335" font-family="sans-serif" font-size="10" fill="#94a3b8" text-anchor="middle">Jul</text>

      <!-- Trend line -->
      <polyline points="148,203 198,173 248,153 298,183 348,143 398,123 448,103" fill="none" stroke="#d97706" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="448" cy="103" r="5" fill="#d97706"/>

      <!-- Stat cards on right -->
      <rect x="600" y="80" width="280" height="90" rx="12" fill="white" opacity="0.15"/>
      <text x="620" y="115" font-family="sans-serif" font-size="14" fill="white" opacity="0.8">Gross Revenue</text>
      <text x="620" y="150" font-family="sans-serif" font-size="32" font-weight="bold" fill="white">$14,200</text>

      <rect x="600" y="190" width="280" height="90" rx="12" fill="white" opacity="0.15"/>
      <text x="620" y="225" font-family="sans-serif" font-size="14" fill="white" opacity="0.8">Net Profit</text>
      <text x="620" y="260" font-family="sans-serif" font-size="32" font-weight="bold" fill="#fbbf24">$9,940</text>

      <rect x="600" y="300" width="130" height="55" rx="12" fill="#fbbf24" opacity="0.2"/>
      <text x="665" y="325" font-family="sans-serif" font-size="13" fill="white" opacity="0.8" text-anchor="middle">Margin</text>
      <text x="665" y="345" font-family="sans-serif" font-size="18" font-weight="bold" fill="#fbbf24" text-anchor="middle">70%</text>

      <rect x="745" y="300" width="135" height="55" rx="12" fill="#22c55e" opacity="0.2"/>
      <text x="812" y="325" font-family="sans-serif" font-size="13" fill="white" opacity="0.8" text-anchor="middle">Growth</text>
      <text x="812" y="345" font-family="sans-serif" font-size="18" font-weight="bold" fill="#4ade80" text-anchor="middle">+12%</text>`,
  },
  planning: {
    bg: "#7c3aed",
    bgEnd: "#2e1065",
    accent: "#ede9fe",
    accentDark: "#a78bfa",
    svg: `
      <!-- Calendar / planner -->
      <rect x="80" y="50" width="360" height="300" rx="16" fill="white" opacity="0.95"/>
      <rect x="80" y="50" width="360" height="55" rx="16" fill="#8b5cf6"/>
      <rect x="80" y="89" width="360" height="16" fill="#8b5cf6"/>
      <text x="260" y="86" font-family="sans-serif" font-size="18" font-weight="bold" fill="white" text-anchor="middle">Q2 2026 Planning</text>

      <!-- Calendar grid -->
      <text x="110" y="135" font-family="sans-serif" font-size="12" font-weight="600" fill="#64748b">Mon</text>
      <text x="160" y="135" font-family="sans-serif" font-size="12" font-weight="600" fill="#64748b">Tue</text>
      <text x="210" y="135" font-family="sans-serif" font-size="12" font-weight="600" fill="#64748b">Wed</text>
      <text x="260" y="135" font-family="sans-serif" font-size="12" font-weight="600" fill="#64748b">Thu</text>
      <text x="310" y="135" font-family="sans-serif" font-size="12" font-weight="600" fill="#64748b">Fri</text>
      <text x="360" y="135" font-family="sans-serif" font-size="12" font-weight="600" fill="#94a3b8">Sat</text>
      <text x="405" y="135" font-family="sans-serif" font-size="12" font-weight="600" fill="#94a3b8">Sun</text>

      <!-- Week 1 -->
      <text x="118" y="165" font-family="sans-serif" font-size="14" fill="#334155" text-anchor="middle">1</text>
      <text x="168" y="165" font-family="sans-serif" font-size="14" fill="#334155" text-anchor="middle">2</text>
      <text x="218" y="165" font-family="sans-serif" font-size="14" fill="#334155" text-anchor="middle">3</text>
      <text x="268" y="165" font-family="sans-serif" font-size="14" fill="#334155" text-anchor="middle">4</text>
      <text x="318" y="165" font-family="sans-serif" font-size="14" fill="#334155" text-anchor="middle">5</text>

      <!-- Highlighted day - tax deadline -->
      <circle cx="268" cy="195" r="16" fill="#7c3aed"/>
      <text x="268" y="200" font-family="sans-serif" font-size="14" font-weight="bold" fill="white" text-anchor="middle">15</text>

      <!-- Event bars -->
      <rect x="100" y="225" width="200" height="18" rx="4" fill="#ddd6fe"/>
      <text x="110" y="238" font-family="sans-serif" font-size="11" fill="#6d28d9">Client A project</text>
      <rect x="100" y="250" width="130" height="18" rx="4" fill="#fef3c7"/>
      <text x="110" y="263" font-family="sans-serif" font-size="11" fill="#92400e">Quarterly taxes</text>
      <rect x="250" y="250" width="160" height="18" rx="4" fill="#ccfbf1"/>
      <text x="260" y="263" font-family="sans-serif" font-size="11" fill="#065f46">New client onboard</text>

      <!-- Revenue goal -->
      <rect x="100" y="285" width="310" height="8" rx="4" fill="#e2e8f0"/>
      <rect x="100" y="285" width="217" height="8" rx="4" fill="#8b5cf6"/>
      <text x="100" y="312" font-family="sans-serif" font-size="11" fill="#64748b">Q2 Goal: $45k</text>
      <text x="410" y="312" font-family="sans-serif" font-size="11" font-weight="600" fill="#7c3aed" text-anchor="end">70% ($31.5k)</text>

      <!-- Checklist card -->
      <rect x="560" y="70" width="300" height="260" rx="16" fill="white" opacity="0.15"/>
      <text x="585" y="105" font-family="sans-serif" font-size="16" font-weight="bold" fill="white">Action Items</text>

      <!-- Check items -->
      <rect x="585" y="120" width="18" height="18" rx="4" fill="#4ade80"/>
      <path d="M590 129 L593 132 L599 126" stroke="white" stroke-width="2" fill="none" stroke-linecap="round"/>
      <text x="615" y="134" font-family="sans-serif" font-size="14" fill="white" opacity="0.9">Review Q1 numbers</text>

      <rect x="585" y="150" width="18" height="18" rx="4" fill="#4ade80"/>
      <path d="M590 159 L593 162 L599 156" stroke="white" stroke-width="2" fill="none" stroke-linecap="round"/>
      <text x="615" y="164" font-family="sans-serif" font-size="14" fill="white" opacity="0.9">Set quarterly rates</text>

      <rect x="585" y="180" width="18" height="18" rx="4" fill="white" opacity="0.3"/>
      <text x="615" y="194" font-family="sans-serif" font-size="14" fill="white" opacity="0.7">File estimated taxes</text>

      <rect x="585" y="210" width="18" height="18" rx="4" fill="white" opacity="0.3"/>
      <text x="615" y="224" font-family="sans-serif" font-size="14" fill="white" opacity="0.7">Update project scope</text>

      <rect x="585" y="240" width="18" height="18" rx="4" fill="white" opacity="0.3"/>
      <text x="615" y="254" font-family="sans-serif" font-size="14" fill="white" opacity="0.7">Invoice Client B</text>

      <rect x="585" y="270" width="18" height="18" rx="4" fill="white" opacity="0.3"/>
      <text x="615" y="284" font-family="sans-serif" font-size="14" fill="white" opacity="0.7">Emergency fund check</text>`,
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
  ${cat.svg}
</svg>`;

  await sharp(Buffer.from(svg)).png({ quality: 90 }).toFile(join(publicDir, `hero-${key}.png`));
  console.log(`Created hero-${key}.png`);
}
