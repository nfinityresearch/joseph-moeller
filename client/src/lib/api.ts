/**
 * Data fetching with fallback: tries API first, then static JSON.
 * Enables the app to work on Cloudflare Pages (static) and with the Express server.
 */

async function fetchWithFallback<T>(
  apiUrl: string,
  staticUrl: string,
  transform?: (data: unknown) => T
): Promise<T> {
  try {
    const res = await fetch(apiUrl);
    if (res.ok) {
      const data = await res.json();
      return (transform ? transform(data) : data) as T;
    }
  } catch {
    // API failed, try static
  }

  const res = await fetch(staticUrl);
  if (!res.ok) throw new Error(`Failed to load ${staticUrl}`);
  const data = await res.json();
  return (transform ? transform(data) : data) as T;
}

export async function fetchSite() {
  return fetchWithFallback<{
    title: string;
    subtitle: string;
    authorName: string;
    authorImage: string;
    navigation: { label: string; path: string }[];
    contactFormEndpoint?: string;
  }>("/api/site", "/site.json");
}

export async function fetchQuotes() {
  return fetchWithFallback<{ id: number; text: string; source: string; year: string }[]>(
    "/api/quotes",
    "/quotes.json",
    (data) => {
      const arr = data as { text: string; source: string; year: string }[];
      return arr.map((q, i) => ({ ...q, id: i + 1 }));
    }
  );
}

interface EssayRaw {
  title: string;
  year: string;
  publisher: string;
  description: string;
  coverImage?: string | null;
  link?: string | null;
  body?: string | null;
}

export async function fetchBooks() {
  return fetchWithFallback<{ id: number; title: string; year: string; publisher: string; description: string; coverImage: string | null; link: string | null; body: string | null }[]>(
    "/api/books",
    "/essays.json",
    (data) => {
      const arr = data as EssayRaw[];
      return arr.map((e, i) => ({
        id: i + 1,
        title: e.title,
        year: e.year,
        publisher: e.publisher,
        description: e.description,
        coverImage: e.coverImage ?? null,
        link: e.link ?? null,
        body: e.body ?? null,
      }));
    }
  );
}

export async function fetchBook(id: string) {
  const books = await fetchBooks();
  const essay = books.find((b) => String(b.id) === id);
  if (!essay) throw new Error("Not found");
  return essay;
}

interface SectionRaw {
  slug: string;
  title: string;
  content: string | null;
  sortOrder?: number;
}

export async function fetchSection(slug: string) {
  try {
    const res = await fetch(`/api/sections/${slug}`);
    if (res.ok) return await res.json();
  } catch {
    // API failed
  }

  const res = await fetch("/sections.json");
  if (!res.ok) throw new Error("Failed to load sections");
  const arr = (await res.json()) as SectionRaw[];
  const section = arr.find((s) => s.slug === slug);
  if (!section) throw new Error("Not found");
  return {
    id: arr.indexOf(section) + 1,
    slug: section.slug,
    title: section.title,
    content: section.content ?? null,
    sortOrder: section.sortOrder ?? null,
  };
}
