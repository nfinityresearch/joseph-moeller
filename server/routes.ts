import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

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

  app.get("/api/music", async (_req, res) => {
    const albums = await storage.getMusic();
    res.json(albums);
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

  return httpServer;
}
