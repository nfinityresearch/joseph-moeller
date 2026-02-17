import type { Express, Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { seedFromJSON } from "./seed";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.resolve(__dirname, "../content");

function readContent(filename: string) {
  return JSON.parse(fs.readFileSync(path.join(contentDir, filename), "utf-8"));
}

function writeContent(filename: string, data: unknown) {
  fs.writeFileSync(path.join(contentDir, filename), JSON.stringify(data, null, 2) + "\n");
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token || token !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

export function registerAdminRoutes(app: Express) {
  app.post("/api/admin/login", (req, res) => {
    const { password } = req.body;
    if (password === process.env.ADMIN_PASSWORD) {
      return res.json({ success: true });
    }
    return res.status(401).json({ message: "Wrong password" });
  });

  app.get("/api/admin/site", requireAdmin, (_req, res) => {
    res.json(readContent("site.json"));
  });

  app.put("/api/admin/site", requireAdmin, async (req, res) => {
    writeContent("site.json", req.body);
    await seedFromJSON();
    res.json({ success: true });
  });

  app.get("/api/admin/quotes", requireAdmin, (_req, res) => {
    res.json(readContent("quotes.json"));
  });

  app.put("/api/admin/quotes", requireAdmin, async (req, res) => {
    writeContent("quotes.json", req.body);
    await seedFromJSON();
    res.json({ success: true });
  });

  app.get("/api/admin/essays", requireAdmin, (_req, res) => {
    res.json(readContent("essays.json"));
  });

  app.put("/api/admin/essays", requireAdmin, async (req, res) => {
    writeContent("essays.json", req.body);
    await seedFromJSON();
    res.json({ success: true });
  });

  app.get("/api/admin/sections", requireAdmin, (_req, res) => {
    res.json(readContent("sections.json"));
  });

  app.put("/api/admin/sections", requireAdmin, async (req, res) => {
    writeContent("sections.json", req.body);
    await seedFromJSON();
    res.json({ success: true });
  });
}
