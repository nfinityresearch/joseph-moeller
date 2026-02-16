import { GenerativeStream } from "@/components/generative-stream";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

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
    <nav className="flex flex-wrap gap-x-8 gap-y-2 text-sm italic text-muted-foreground justify-center md:justify-end">
      {NAV_ITEMS.map((item) => (
        <Link key={item.path} href={item.path}>
          <span
            data-testid={`link-${item.label.toLowerCase()}`}
            className={`cursor-pointer transition-colors duration-300 ${
              location === item.path ? "text-foreground font-medium" : "hover:text-foreground"
            }`}
          >
            {item.label}
          </span>
        </Link>
      ))}
    </nav>
  );
}

function BooksPage() {
  const { data: books, isLoading } = useQuery<Book[]>({
    queryKey: ["/api/books"],
    queryFn: () => fetch("/api/books").then(r => r.json()),
  });

  if (isLoading) return <LoadingState />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 max-w-3xl mx-auto">
      <h2 className="text-xl font-serif mb-12 text-center italic text-muted-foreground">Books</h2>
      <div className="space-y-12">
        {books?.map((book) => (
          <div key={book.id} className="group cursor-pointer border-b border-border/30 pb-8" data-testid={`card-book-${book.id}`}>
            <div className="flex justify-between items-baseline mb-2">
              <h3 className="font-serif text-xl group-hover:text-primary transition-colors">{book.title}</h3>
              <span className="text-xs text-muted-foreground">{book.year}</span>
            </div>
            <p className="text-sm text-muted-foreground italic mb-1">{book.publisher}</p>
            <p className="text-sm text-muted-foreground/80 leading-relaxed">{book.description}</p>
          </div>
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

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 max-w-3xl mx-auto">
      <h2 className="text-xl font-serif mb-12 text-center italic text-muted-foreground">Discography</h2>
      <div className="space-y-0">
        {albums?.map((album) => (
          <div key={album.id} className="flex justify-between items-baseline border-b border-border/30 py-6 group cursor-pointer" data-testid={`row-album-${album.id}`}>
            <div>
              <h3 className="font-serif text-lg group-hover:text-primary transition-colors">{album.title}</h3>
              <p className="text-sm text-muted-foreground italic">{album.artist}</p>
            </div>
            <div className="text-right text-xs text-muted-foreground">
              <p>{album.year}</p>
              <p>{album.label} / {album.format}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function SectionPage({ slug }: { slug: string }) {
  const { data: section, isLoading } = useQuery<Section>({
    queryKey: ["/api/sections", slug],
    queryFn: () => fetch(`/api/sections/${slug}`).then(r => r.json()),
  });

  if (isLoading) return <LoadingState />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 max-w-2xl mx-auto text-center">
      <h2 className="text-xl font-serif mb-8 italic text-muted-foreground">{section?.title}</h2>
      <div className="border-t border-b border-border/30 py-12">
        <p className="font-serif text-base leading-relaxed text-muted-foreground">
          {section?.content}
        </p>
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

      <main className="flex-1 w-full max-w-5xl mx-auto flex flex-col justify-center relative p-4">
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
  if (["/journalism", "/film", "/art", "/store", "/contact"].includes(location)) {
    return <SectionPage slug={location.slice(1)} />;
  }
  return null;
}
