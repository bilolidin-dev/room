/**
 * Generates responsive AVIF/WebP derivatives + blur placeholders for the
 * bedroom renders, and writes a manifest consumed by the app.
 *
 *   npm run images
 *
 * Source:  public/images/bedroom/angle-0X.jpg   (originals, never modified)
 * Output:  public/images/bedroom/optimized/*    (derivatives)
 *          src/data/image-manifest.json         (sizes, srcsets, blur data)
 *
 * Images are never upscaled: the largest derivative equals the source width.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC_DIR = path.join(ROOT, "public/images/bedroom");
const OUT_DIR = path.join(SRC_DIR, "optimized");
const MANIFEST = path.join(ROOT, "src/data/image-manifest.json");
const PUBLIC_BASE = "/images/bedroom";

const TARGET_WIDTHS = [480, 768, 1080, 1600, 2400];
const AVIF = { quality: 64, effort: 6, chromaSubsampling: "4:4:4" };
const WEBP = { quality: 90, effort: 6, smartSubsample: true };

await fs.mkdir(OUT_DIR, { recursive: true });

const files = (await fs.readdir(SRC_DIR))
  .filter((f) => /^angle-\d+\.(jpe?g|png)$/i.test(f))
  .sort();

if (files.length === 0) {
  console.error("No source images found in", SRC_DIR);
  process.exit(1);
}

const manifest = {};

for (const file of files) {
  const id = path.parse(file).name;
  const input = path.join(SRC_DIR, file);
  const meta = await sharp(input).metadata();
  const { width, height } = meta;

  const widths = [...new Set(TARGET_WIDTHS.filter((w) => w < width).concat(width))].sort(
    (a, b) => a - b,
  );

  const avif = [];
  const webp = [];

  for (const w of widths) {
    const base = sharp(input).resize({ width: w, withoutEnlargement: true });
    const avifName = `${id}-${w}.avif`;
    const webpName = `${id}-${w}.webp`;
    await base.clone().avif(AVIF).toFile(path.join(OUT_DIR, avifName));
    await base.clone().webp(WEBP).toFile(path.join(OUT_DIR, webpName));
    avif.push({ w, src: `${PUBLIC_BASE}/optimized/${avifName}` });
    webp.push({ w, src: `${PUBLIC_BASE}/optimized/${webpName}` });
  }

  const blurBuf = await sharp(input).resize(24).blur(0.6).webp({ quality: 50 }).toBuffer();

  manifest[id] = {
    width,
    height,
    original: `${PUBLIC_BASE}/${file}`,
    blurDataURL: `data:image/webp;base64,${blurBuf.toString("base64")}`,
    avif,
    webp,
  };

  console.log(`✓ ${file}  ${width}×${height}  → ${widths.join(", ")}px`);
}

await fs.mkdir(path.dirname(MANIFEST), { recursive: true });
await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`Manifest written: ${path.relative(ROOT, MANIFEST)}`);

// Social preview image (Open Graph / Telegram / WhatsApp): 1200×630, the size
// every network crops to. Built from the first render.
const OG_FILE = path.join(ROOT, "public/og-image.jpg");
await sharp(path.join(SRC_DIR, files[0]))
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .jpeg({ quality: 86, progressive: true, mozjpeg: true })
  .toFile(OG_FILE);
console.log(`✓ ${path.relative(ROOT, OG_FILE)}  1200×630`);

// Apple touch icon (iOS home screen / Safari): 180×180 PNG from the SVG icon.
const APPLE_ICON = path.join(ROOT, "src/app/apple-icon.png");
await sharp(path.join(ROOT, "src/app/icon.svg"), { density: 300 })
  .resize(180, 180)
  .png()
  .toFile(APPLE_ICON);
console.log(`✓ ${path.relative(ROOT, APPLE_ICON)}  180×180`);
