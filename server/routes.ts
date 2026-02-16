import type { Express } from "express";
import { createServer, type Server } from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { storage } from "./storage";
import { insertContactMessageSchema } from "@shared/schema";
import { seedFromJSON } from "./seed";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  await seedFromJSON();

  app.get("/api/site", (_req, res) => {
    const sitePath = path.resolve(__dirname, "../content/site.json");
    const site = JSON.parse(fs.readFileSync(sitePath, "utf-8"));
    res.json(site);
  });

  app.get("/api/quotes", async (_req, res) => {
    const quotes = await storage.getQuotes();
    res.json(quotes);
  });

  app.get("/api/quotes/random", async (_req, res) => {
    const quote = await storage.getRandomQuote();
    if (!quote) return res.status(404).json({ message: "No quotes found" });
    res.json(quote);
  });

  app.get("/api/books", async (_req, res) => {
    const books = await storage.getBooks();
    res.json(books);
  });

  app.get("/api/books/:id", async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    const book = await storage.getBook(id);
    if (!book) return res.status(404).json({ message: "Essay not found" });
    res.json(book);
  });

  app.get("/api/sections", async (_req, res) => {
    const sections = await storage.getSections();
    res.json(sections);
  });

  app.get("/api/sections/:slug", async (req, res) => {
    const section = await storage.getSection(req.params.slug);
    if (!section) return res.status(404).json({ message: "Section not found" });
    res.json(section);
  });

  app.post("/api/contact", async (req, res) => {
    const parsed = insertContactMessageSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Please fill in all required fields.", errors: parsed.error.flatten().fieldErrors });
    }
    const message = await storage.insertContactMessage(parsed.data);
    res.status(201).json({ message: "Thank you for your message. We will be in touch." });
  });

  return httpServer;
}
