import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.resolve(__dirname, "../content");
const publicDir = path.resolve(__dirname, "../client/public");

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".json"));
for (const file of files) {
  fs.copyFileSync(path.join(contentDir, file), path.join(publicDir, file));
}
console.log(`[copy-content] Copied ${files.length} JSON files to client/public`);
