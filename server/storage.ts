import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import {
  quotes, books, sections,
  type Quote, type InsertQuote,
  type Book, type InsertBook,
  type Section, type InsertSection,
} from "@shared/schema";

export interface IStorage {
  getQuotes(): Promise<Quote[]>;
  getRandomQuote(): Promise<Quote | undefined>;
  insertQuote(quote: InsertQuote): Promise<Quote>;

  getBooks(): Promise<Book[]>;
  getBook(id: number): Promise<Book | undefined>;
  insertBook(book: InsertBook): Promise<Book>;

  getSections(): Promise<Section[]>;
  getSection(slug: string): Promise<Section | undefined>;
  insertSection(section: InsertSection): Promise<Section>;
}

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

export class DatabaseStorage implements IStorage {
  async getQuotes(): Promise<Quote[]> {
    return db.select().from(quotes);
  }

  async getRandomQuote(): Promise<Quote | undefined> {
    const all = await this.getQuotes();
    if (all.length === 0) return undefined;
    return all[Math.floor(Math.random() * all.length)];
  }

  async insertQuote(quote: InsertQuote): Promise<Quote> {
    const [result] = await db.insert(quotes).values(quote).returning();
    return result;
  }

  async getBooks(): Promise<Book[]> {
    return db.select().from(books).orderBy(desc(books.year));
  }

  async getBook(id: number): Promise<Book | undefined> {
    const [result] = await db.select().from(books).where(eq(books.id, id));
    return result;
  }

  async insertBook(book: InsertBook): Promise<Book> {
    const [result] = await db.insert(books).values(book).returning();
    return result;
  }

  async getSections(): Promise<Section[]> {
    return db.select().from(sections);
  }

  async getSection(slug: string): Promise<Section | undefined> {
    const [result] = await db.select().from(sections).where(eq(sections.slug, slug));
    return result;
  }

  async insertSection(section: InsertSection): Promise<Section> {
    const [result] = await db.insert(sections).values(section).returning();
    return result;
  }
}

export const storage = new DatabaseStorage();
