import { GenerativeStream } from "@/components/generative-stream";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";

interface Book {
  id: number;
  title: string;
  year: string;
  publisher: string;
  description: string;
  coverImage: string | null;
}

interface Section {
  id: number;
  slug: string;
  title: string;
  content: string | null;
  sortOrder: number | null;
}

const NAV_ITEMS = [
  { label: "Writings", path: "/writings" },
  { label: "Biography", path: "/biography" },
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

function BookCard({ book, index }: { book: Book; index: number }) {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <motion.div
      className="border-b border-border/30 py-8 first:pt-0"
      data-testid={`card-book-${book.id}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
    >
      <div className="flex gap-6 md:gap-8">
        {book.coverImage ? (
          <div className="shrink-0">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-20 md:w-28 h-auto shadow-md border border-border/10"
              loading="lazy"
              data-testid={`img-cover-${book.id}`}
            />
          </div>
        ) : (
          <div className="w-20 md:w-28 shrink-0 bg-muted/20 border border-border/10 flex items-center justify-center aspect-[3/4]">
            <span className="text-[9px] text-muted-foreground/30 uppercase tracking-widest text-center px-2">{book.title}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-serif text-lg italic text-foreground/90">{book.title}</h3>
          <p className="text-xs text-muted-foreground/50 mt-1">{book.year} · {book.publisher}</p>

          <AnimatePresence>
            {showDetail && (
              <motion.p
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-sm text-muted-foreground/70 leading-relaxed mt-3 overflow-hidden"
              >
                {book.description}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="button"
            className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground/40 hover:text-foreground/60 transition-colors cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20 rounded-sm"
            onClick={() => setShowDetail(!showDetail)}
            aria-expanded={showDetail}
            data-testid={`button-expand-book-${book.id}`}
          >
            <span>{showDetail ? "Less" : "More"}</span>
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={{ rotate: showDetail ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9" />
            </motion.svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function WritingsPage() {
  const { data: books, isLoading } = useQuery<Book[]>({
    queryKey: ["/api/books"],
    queryFn: () => fetch("/api/books").then(r => r.json()),
  });

  if (isLoading) return <LoadingState />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 max-w-3xl mx-auto w-full">
      <h2 className="text-lg font-serif mb-2 text-center text-muted-foreground">Writings</h2>
      <p className="text-xs text-center text-muted-foreground/60 mb-16">Books on Zen practice, meditation, and contemplative living</p>
      <div>
        {books?.map((book, i) => (
          <BookCard key={book.id} book={book} index={i} />
        ))}
      </div>
    </motion.div>
  );
}

function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Something went wrong");
      }
      return res.json();
    },
    onSuccess: () => {
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    },
  });

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 max-w-xl mx-auto w-full text-center">
        <h2 className="text-lg font-serif mb-6 text-muted-foreground">Thank You</h2>
        <p className="text-sm text-muted-foreground/70 leading-relaxed mb-8">
          Your message has been received. We will be in touch.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="text-xs text-muted-foreground/50 hover:text-foreground/60 transition-colors cursor-pointer"
          data-testid="button-send-another"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 max-w-xl mx-auto w-full">
      <h2 className="text-lg font-serif mb-2 text-center text-muted-foreground">Contact</h2>
      <p className="text-xs text-center text-muted-foreground/60 mb-12">
        For inquiries regarding retreats, teachings, rights, and permissions.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate(formData);
        }}
        className="space-y-6"
      >
        <div>
          <label htmlFor="name" className="block text-xs uppercase tracking-widest text-muted-foreground/50 mb-2">
            Name
          </label>
          <input
            id="name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-transparent border-b border-border/40 focus:border-foreground/30 outline-none py-2 text-sm text-foreground/80 placeholder:text-muted-foreground/30 transition-colors font-serif"
            placeholder="Your name"
            data-testid="input-name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-xs uppercase tracking-widest text-muted-foreground/50 mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-transparent border-b border-border/40 focus:border-foreground/30 outline-none py-2 text-sm text-foreground/80 placeholder:text-muted-foreground/30 transition-colors font-serif"
            placeholder="your@email.com"
            data-testid="input-email"
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-xs uppercase tracking-widest text-muted-foreground/50 mb-2">
            Subject
          </label>
          <input
            id="subject"
            type="text"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full bg-transparent border-b border-border/40 focus:border-foreground/30 outline-none py-2 text-sm text-foreground/80 placeholder:text-muted-foreground/30 transition-colors font-serif"
            placeholder="What is this regarding?"
            data-testid="input-subject"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-xs uppercase tracking-widest text-muted-foreground/50 mb-2">
            Message
          </label>
          <textarea
            id="message"
            required
            rows={6}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full bg-transparent border border-border/30 focus:border-foreground/20 outline-none p-3 text-sm text-foreground/80 placeholder:text-muted-foreground/30 transition-colors font-serif resize-none rounded-sm"
            placeholder="Your message..."
            data-testid="input-message"
          />
        </div>

        {mutation.isError && (
          <p className="text-xs text-destructive" data-testid="text-error">
            {mutation.error?.message || "Something went wrong. Please try again."}
          </p>
        )}

        <div className="pt-4">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full py-3 border border-border/40 hover:border-foreground/30 text-sm font-serif text-muted-foreground hover:text-foreground transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
            data-testid="button-submit"
          >
            {mutation.isPending ? "Sending..." : "Send Message"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

function SectionPage({ slug, authorImage }: { slug: string; authorImage?: string }) {
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

      {authorImage && (
        <div className="flex justify-center mb-14">
          <img
            src={authorImage}
            alt="Joseph Moeller"
            className="w-64 md:w-80 h-auto shadow-md border border-border/10 grayscale-[30%]"
            data-testid="img-author-photo"
          />
        </div>
      )}

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
            Joseph Moeller
          </h1>
        </Link>
        <Navigation />
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto flex flex-col justify-center relative px-6 md:px-8">
        <HomeRouter />
      </main>

      <footer className="w-full max-w-5xl mx-auto p-8 flex justify-center text-xs text-muted-foreground/50 font-serif italic">
        <span className="animate-pulse mr-2">●</span> Zen Practice
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
          Fig. 1 — The Still Point
        </motion.div>
      </>
    );
  }
  if (location === "/writings") return <WritingsPage />;
  if (location === "/biography") return <SectionPage slug="biography" authorImage="/images/author-photo.jpg" />;
  if (location === "/contact") return <ContactPage />;
  return null;
}
