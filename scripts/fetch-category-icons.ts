/**
 * One-shot: pull Champions/HOME category marks, punch black to transparent.
 * Run: npx tsx scripts/fetch-category-icons.ts
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(process.cwd());
const OUT = path.join(ROOT, "public", "categories");

const SOURCES: { name: string; url: string }[] = [
  {
    name: "physical",
    url: "https://archives.bulbagarden.net/media/upload/a/a4/Physical_icon_HOME.png",
  },
  {
    name: "special",
    url: "https://archives.bulbagarden.net/media/upload/c/c4/Special_icon_HOME.png",
  },
  {
    name: "status",
    url: "https://archives.bulbagarden.net/media/upload/3/34/Status_icon_HOME.png",
  },
];

async function main() {
  await mkdir(OUT, { recursive: true });
  for (const { name, url } of SOURCES) {
    const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
    const { data, info } = await sharp(buf)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    for (let i = 0; i < data.length; i += 4) {
      const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
      if (lum < 18) data[i + 3] = 0;
    }
    const out = await sharp(data, {
      raw: { width: info.width, height: info.height, channels: 4 },
    })
      .png()
      .toBuffer();
    await writeFile(path.join(OUT, `${name}.png`), out);
    console.log(`${name}: ${info.width}x${info.height} → ${out.length} bytes`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
