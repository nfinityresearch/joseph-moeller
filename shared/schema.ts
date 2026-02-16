import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  source: text("source").notNull(),
  year: text("year").notNull(),
});

export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  year: text("year").notNull(),
  publisher: text("publisher").notNull(),
  description: text("description").notNull(),
  coverImage: text("cover_image"),
});

export const music = pgTable("music", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  year: text("year").notNull(),
  label: text("label").notNull(),
  format: text("format").notNull(),
});

export const sections = pgTable("sections", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  content: text("content"),
  sortOrder: integer("sort_order").default(0),
});

export const insertQuoteSchema = createInsertSchema(quotes).omit({ id: true });
export const insertBookSchema = createInsertSchema(books).omit({ id: true });
export const insertMusicSchema = createInsertSchema(music).omit({ id: true });
export const insertSectionSchema = createInsertSchema(sections).omit({ id: true });

export type InsertQuote = z.infer<typeof insertQuoteSchema>;
export type Quote = typeof quotes.$inferSelect;
export type InsertBook = z.infer<typeof insertBookSchema>;
export type Book = typeof books.$inferSelect;
export type InsertMusic = z.infer<typeof insertMusicSchema>;
export type Music = typeof music.$inferSelect;
export type InsertSection = z.infer<typeof insertSectionSchema>;
export type Section = typeof sections.$inferSelect;
