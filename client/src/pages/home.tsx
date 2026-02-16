import { GenerativeStream } from "@/components/generative-stream";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface Book {
  id: number;
  title: string;
  year: string;
  publisher: string;
  description: string;
  coverImage: string | null;
}

interface Album {
  id: number;
  title: string;
  artist: string;
  year: string;
  label: string;
  format: string;
}

interface Section {
  id: number;
  slug: string;
  title: string;
  content: string | null;
  sortOrder: number | null;
}

const ALBUM_COVERS: Record<string, string> = {
  "Blank Generation": "/images/covers/blank-generation.png",
  "Destiny Street": "/images/covers/destiny-street.png",
};

const NAV_ITEMS = [
  { label: "Books", path: "/books" },
  { label: "Journalism", path: "/journalism" },
  { label: "Music", path: "/music" },
  { label: "Film", path: "/film" },
  { label: "Art", path: "/art" },
  { label: "Store", path: "/store" },
  { label: "Contact", path: "/contact" },
];

function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground justify-center md:justify-end">
      {NAV_ITEMS.map((item) => (
        <Link key={item.path} href={item.path}>
          <span
            data-testid={`link-${item.label.toLowerCase()}`}
            className={`cursor-pointer transition-colors duration-300 hover:text-foreground ${
              location === item.path ? "text-foreground" : ""
            }`}
          >
            {item.label}
          </span>
        </Link>
      ))}
    </nav>
  );
}

function BookCard({ book }: { book: Book }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="border-b border-border/30 py-6 first:pt-0"
      data-testid={`card-book-${book.id}`}
    >
      <button
        type="button"
        className="w-full text-left cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20 rounded-sm"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-controls={`book-detail-${book.id}`}
        data-testid={`button-expand-book-${book.id}`}
      >
        <div className="flex items-baseline justify-between gap-4">
          <div className="flex items-baseline gap-3 min-w-0">
            <h3 className="font-serif text-lg italic text-foreground/90 truncate">{book.title}</h3>
            <span className="text-xs text-muted-foreground/50 shrink-0">{book.year}</span>
          </div>
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground/40 shrink-0"
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </motion.svg>
        </div>
        <p className="text-xs text-muted-foreground/40 mt-1">{book.publisher}</p>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            id={`book-detail-${book.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="flex gap-8 mt-6">
              {book.coverImage && (
                <div className="shrink-0">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-28 md:w-36 h-auto shadow-md border border-border/10"
                    loading="lazy"
                    data-testid={`img-cover-${book.id}`}
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground/70 leading-relaxed">{book.description}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BooksPage() {
  const { data: books, isLoading } = useQuery<Book[]>({
    queryKey: ["/api/books"],
    queryFn: () => fetch("/api/books").then(r => r.json()),
  });

  if (isLoading) return <LoadingState />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 max-w-3xl mx-auto w-full">
      <h2 className="text-lg font-serif mb-2 text-center text-muted-foreground">Books</h2>
      <p className="text-xs text-center text-muted-foreground/60 mb-16">Novels, poetry, essays, notebooks</p>
      <div>
        {books?.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </motion.div>
  );
}

function MusicPage() {
  const { data: albums, isLoading } = useQuery<Album[]>({
    queryKey: ["/api/music"],
    queryFn: () => fetch("/api/music").then(r => r.json()),
  });

  if (isLoading) return <LoadingState />;

  const grouped: Record<string, Album[]> = {};
  albums?.forEach((album) => {
    const key = album.artist;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(album);
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 max-w-3xl mx-auto w-full">
      <h2 className="text-lg font-serif mb-2 text-center text-muted-foreground">Discography</h2>
      <p className="text-xs text-center text-muted-foreground/60 mb-16">Neon Boys, Television, Heartbreakers, Voidoids, Dim Stars</p>
      {Object.entries(grouped).map(([artist, items]) => (
        <div key={artist} className="mb-14">
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground/50 mb-6 border-b border-border/20 pb-2">{artist}</h3>
          <div>
            {items.map((album) => {
              const cover = ALBUM_COVERS[album.title];
              return (
                <div key={album.id} className="flex items-center gap-5 py-4 border-b border-border/15 group" data-testid={`row-album-${album.id}`}>
                  {cover ? (
                    <img src={cover} alt={album.title} className="w-14 h-14 object-cover shadow-sm border border-border/10 shrink-0" loading="lazy" />
                  ) : (
                    <div className="w-14 h-14 bg-muted/30 border border-border/10 shrink-0 flex items-center justify-center">
                      <span className="text-[8px] text-muted-foreground/30 uppercase tracking-wider">{album.format}</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-baseline md:justify-between gap-1">
                    <div className="flex items-baseline gap-3">
                      <h4 className="font-serif text-base italic group-hover:text-primary transition-colors">{album.title}</h4>
                    </div>
                    <div className="text-xs text-muted-foreground/50 shrink-0">
                      {album.year} · {album.label} · {album.format}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </motion.div>
  );
}

function SectionPage({ slug }: { slug: string }) {
  const { data: section, isLoading } = useQuery<Section>({
    queryKey: ["/api/sections", slug],
    queryFn: () => fetch(`/api/sections/${slug}`).then(r => r.json()),
  });

  if (isLoading) return <LoadingState />;
  if (!section) return <LoadingState />;

  const blocks = section.content?.split('\n\n') || [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 max-w-3xl mx-auto w-full">
      <h2 className="text-lg font-serif mb-16 text-center text-muted-foreground">{section.title}</h2>
      <div className="space-y-8">
        {blocks.map((block, i) => {
          const trimmed = block.trim();
          const isHeading = trimmed === trimmed.toUpperCase() && trimmed.length < 80 && !trimmed.includes('—') && trimmed.length > 2;
          const lines = trimmed.split('\n').filter(l => l.trim());
          const isList = lines.length > 1 && lines.every(line =>
            line.startsWith('"') || line.startsWith('—') || line.match(/^\d/) || line.match(/^[A-Z].*—/) || line.match(/^[A-Z].*\(/)
          );

          if (isHeading) {
            return (
              <h3 key={i} className="text-xs uppercase tracking-widest text-muted-foreground/50 border-b border-border/20 pb-2 mt-12 first:mt-0">
                {trimmed}
              </h3>
            );
          }

          if (isList) {
            return (
              <div key={i} className="space-y-3">
                {lines.map((line, j) => {
                  const hasEm = line.includes('—');
                  const [main, ...rest] = hasEm ? line.split('—') : [line];
                  return (
                    <div key={j} className="pl-4 border-l border-border/20 py-1">
                      <p className="text-sm text-foreground/70">{main.trim()}</p>
                      {rest.length > 0 && (
                        <p className="text-xs text-muted-foreground/50 mt-0.5">{rest.join('—').trim()}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          }

          return (
            <p key={i} className="text-sm text-muted-foreground/70 leading-relaxed">
              {trimmed}
            </p>
          );
        })}
      </div>
    </motion.div>
  );
}

function LoadingState() {
  return (
    <div className="py-24 text-center">
      <span className="text-sm italic text-muted-foreground animate-pulse">loading...</span>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-background selection:bg-primary/10 selection:text-primary transition-colors duration-1000">
      <header className="w-full max-w-5xl mx-auto p-8 md:p-12 flex flex-col md:flex-row justify-between items-center md:items-baseline gap-6 opacity-0 animate-[fade-in_2s_ease-out_forwards]">
        <Link href="/">
          <h1 className="text-lg font-serif tracking-wide text-foreground cursor-pointer hover:opacity-70 transition-opacity" data-testid="link-home">
            Richard Hell
          </h1>
        </Link>
        <Navigation />
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto flex flex-col justify-center relative px-6 md:px-8">
        <HomeRouter />
      </main>

      <footer className="w-full max-w-5xl mx-auto p-8 flex justify-center text-xs text-muted-foreground/50 font-serif italic">
        <span className="animate-pulse mr-2">●</span> Live Archive
      </footer>
    </div>
  );
}

function HomeRouter() {
  const [location] = useLocation();

  if (location === "/") {
    return (
      <>
        <GenerativeStream className="w-full py-12" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground/40 font-serif tracking-widest uppercase"
        >
          Fig. 1 — The Living Text
        </motion.div>
      </>
    );
  }
  if (location === "/books") return <BooksPage />;
  if (location === "/music") return <MusicPage />;
  if (["/journalism", "/film", "/art", "/store", "/contact", "/links"].includes(location)) {
    return <SectionPage slug={location.slice(1)} />;
  }
  return null;
}
