import { GenerativeStream } from "@/components/generative-stream";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";

interface Essay {
  id: number;
  title: string;
  year: string;
  publisher: string;
  description: string;
  coverImage: string | null;
  link: string | null;
  body: string | null;
}

interface Section {
  id: number;
  slug: string;
  title: string;
  content: string | null;
  sortOrder: number | null;
}

interface SiteConfig {
  title: string;
  subtitle: string;
  authorName: string;
  authorImage: string;
  navigation: { label: string; path: string }[];
  contactFormEndpoint?: string;
}

function Navigation() {
  const [location] = useLocation();
  const { data: site } = useQuery<SiteConfig>({
    queryKey: ["site"],
    queryFn: () => import("@/lib/api").then((m) => m.fetchSite()),
  });

  const navItems = site?.navigation || [
    { label: "Writings", path: "/writings" },
    { label: "Biography", path: "/biography" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground justify-center md:justify-end">
      {navItems.map((item) => (
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

function EssayCard({ essay, index }: { essay: Essay; index: number }) {
  return (
    <motion.div
      className="border-b border-border/30 py-8 first:pt-0"
      data-testid={`card-essay-${essay.id}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
    >
      <div className="flex gap-6 md:gap-8">
        {essay.coverImage ? (
          <div className="shrink-0">
            <img
              src={essay.coverImage}
              alt={essay.title}
              className="w-20 md:w-28 h-auto shadow-md border border-border/10"
              loading="lazy"
              data-testid={`img-cover-${essay.id}`}
            />
          </div>
        ) : (
          <div className="w-20 md:w-28 shrink-0 bg-muted/20 border border-border/10 flex items-center justify-center aspect-[3/4]">
            <span className="text-[9px] text-muted-foreground/30 uppercase tracking-widest text-center px-2">{essay.title}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-serif text-lg italic text-foreground/90">{essay.title}</h3>
          <p className="text-xs text-muted-foreground/50 mt-1">{essay.year}</p>
          <p className="text-sm text-muted-foreground/60 leading-relaxed mt-3">
            {essay.description}
          </p>
          <Link href={`/writings/${essay.id}`}>
            <span className="inline-block mt-3 text-xs text-muted-foreground/40 hover:text-foreground/60 transition-colors cursor-pointer" data-testid={`link-read-${essay.id}`}>
              Read
            </span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function WritingsPage() {
  const { data: essays, isLoading } = useQuery<Essay[]>({
    queryKey: ["books"],
    queryFn: () => import("@/lib/api").then((m) => m.fetchBooks()),
  });

  if (isLoading) return <LoadingState />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 max-w-3xl mx-auto w-full">
      <h2 className="text-lg font-serif mb-2 text-center text-muted-foreground">Writings</h2>
      <p className="text-xs text-center text-muted-foreground/60 mb-16">Essays on Zen practice, meditation, and contemplative living</p>
      <div>
        {essays?.map((essay, i) => (
          <EssayCard key={essay.id} essay={essay} index={i} />
        ))}
      </div>
    </motion.div>
  );
}

function ReadingPage({ id }: { id: string }) {
  const { data: essay, isLoading } = useQuery<Essay>({
    queryKey: ["books", id],
    queryFn: () => import("@/lib/api").then((m) => m.fetchBook(id)),
  });

  if (isLoading) return <LoadingState />;
  if (!essay) return <LoadingState />;

  const paragraphs = essay.body?.split('\n\n').filter(p => p.trim()) || [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 max-w-2xl mx-auto w-full">
      <Link href="/writings">
        <span className="text-xs text-muted-foreground/40 hover:text-foreground/60 transition-colors cursor-pointer" data-testid="link-back-writings">
          Writings
        </span>
      </Link>

      <header className="mt-10 mb-16">
        <h1 className="text-2xl md:text-3xl font-serif italic text-foreground/90 leading-snug" data-testid="text-essay-title">
          {essay.title}
        </h1>
        <p className="text-xs text-muted-foreground/50 mt-3">{essay.year}</p>
      </header>

      <article className="space-y-6">
        {paragraphs.map((paragraph, i) => (
          <p key={i} className="text-base text-foreground/75 leading-[1.85] font-serif">
            {paragraph.trim()}
          </p>
        ))}
      </article>

      <footer className="mt-20 pt-8 border-t border-border/20">
        <Link href="/writings">
          <span className="text-xs text-muted-foreground/40 hover:text-foreground/60 transition-colors cursor-pointer" data-testid="link-back-writings-bottom">
            Back to Writings
          </span>
        </Link>
      </footer>
    </motion.div>
  );
}

function ContactPage({ contactFormEndpoint }: { contactFormEndpoint?: string }) {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const url =
        contactFormEndpoint && !contactFormEndpoint.includes("YOUR_FORM_ID")
          ? contactFormEndpoint
          : "/api/contact";
      const isFormspree = url.includes("formspree.io");

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: isFormspree
          ? JSON.stringify({ name: data.name, email: data.email, subject: data.subject, message: data.message, _replyto: data.email })
          : JSON.stringify(data),
      });

      if (!res.ok) {
        if (isFormspree) throw new Error("Something went wrong. Please try again.");
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
    queryKey: ["sections", slug],
    queryFn: () => import("@/lib/api").then((m) => m.fetchSection(slug)),
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
            className="w-80 md:w-[28rem] h-auto shadow-md border border-border/10 grayscale-[30%]"
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
  const { data: site } = useQuery<SiteConfig>({
    queryKey: ["site"],
    queryFn: () => import("@/lib/api").then((m) => m.fetchSite()),
  });

  return (
    <div className="min-h-screen w-full flex flex-col bg-background selection:bg-primary/10 selection:text-primary transition-colors duration-1000">
      <header className="w-full max-w-5xl mx-auto p-8 md:p-12 flex flex-col md:flex-row justify-between items-center md:items-baseline gap-6 opacity-0 animate-[fade-in_2s_ease-out_forwards]">
        <Link href="/">
          <h1 className="text-lg font-serif tracking-wide text-foreground cursor-pointer hover:opacity-70 transition-opacity" data-testid="link-home">
            {site?.title || "Joseph Moeller"}
          </h1>
        </Link>
        <Navigation />
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto flex flex-col justify-center relative px-6 md:px-8">
        <HomeRouter authorImage={site?.authorImage || "/images/author-photo.jpg"} site={site} />
      </main>

      <footer className="w-full max-w-5xl mx-auto p-8 flex justify-center text-xs text-muted-foreground/50 font-serif italic">
        <span className="animate-pulse mr-2">●</span> {site?.subtitle || "Zen Practice"}
      </footer>
    </div>
  );
}

function HomeRouter({ authorImage, site }: { authorImage: string; site?: SiteConfig | null }) {
  const [location] = useLocation();

  if (location === "/") {
    return <GenerativeStream className="w-full py-12" />;
  }
  if (location === "/writings") return <WritingsPage />;
  const essayMatch = location.match(/^\/writings\/(\d+)$/);
  if (essayMatch) return <ReadingPage id={essayMatch[1]} />;
  if (location === "/biography") return <SectionPage slug="biography" authorImage={authorImage} />;
  if (location === "/contact") return <ContactPage contactFormEndpoint={site?.contactFormEndpoint} />;
  return null;
}
