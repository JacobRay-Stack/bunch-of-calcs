import sharp from "sharp";
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");
const svgBuffer = readFileSync(join(publicDir, "icon.svg"));

const sizes = [
  { name: "favicon-16x16.png", size: 16 },
  { name: "favicon-32x32.png", size: 32 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
];

for (const { name, size } of sizes) {
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(join(publicDir, name));
  console.log(`Created ${name} (${size}x${size})`);
}

// Create favicon.ico from 32x32 PNG (just use the PNG — browsers handle it fine)
const favicon32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
writeFileSync(join(publicDir, "favicon.ico"), favicon32);
console.log("Created favicon.ico");

console.log("Done!");
