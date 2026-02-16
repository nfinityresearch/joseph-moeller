import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { storage } from "./storage";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.resolve(__dirname, "../content");

function readJSON<T>(filename: string): T {
  const filePath = path.join(contentDir, filename);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

interface QuoteData {
  text: string;
  source: string;
  year: string;
}

interface EssayData {
  title: string;
  year: string;
  publisher: string;
  description: string;
  coverImage: string | null;
  link: string | null;
  body: string | null;
}

interface SectionData {
  slug: string;
  title: string;
  content: string | null;
  sortOrder: number;
}

export async function seedFromJSON() {
  const quotes = readJSON<QuoteData[]>("quotes.json");
  const essays = readJSON<EssayData[]>("essays.json");
  const sections = readJSON<SectionData[]>("sections.json");

  await storage.clearQuotes();
  for (const q of quotes) {
    await storage.insertQuote(q);
  }
  console.log(`[seed] Synced ${quotes.length} quotes from quotes.json`);

  await storage.clearBooks();
  for (const e of essays) {
    await storage.insertBook(e);
  }
  console.log(`[seed] Synced ${essays.length} essays from essays.json`);

  await storage.clearSections();
  for (const s of sections) {
    await storage.insertSection(s);
  }
  console.log(`[seed] Synced ${sections.length} sections from sections.json`);
}
