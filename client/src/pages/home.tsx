import { GenerativeStream } from "@/components/generative-stream";
import { motion } from "framer-motion";
import { Link, Switch, Route, useLocation } from "wouter";
import contentData from "@/data/content.json";

function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="flex flex-wrap gap-x-8 gap-y-2 text-sm italic text-muted-foreground justify-center md:justify-end">
      {contentData.navigation.map((item) => (
        <Link key={item.path} href={item.path}>
          <span 
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

function SectionPlaceholder({ title }: { title: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="w-full max-w-2xl mx-auto py-12 text-center"
    >
      <h2 className="text-xl font-serif mb-8 italic text-muted-foreground">{title} Archive</h2>
      <div className="border-t border-b border-border py-12">
        <p className="font-serif text-sm text-muted-foreground/60">
          [Content for {title} section to be loaded from archive]
        </p>
      </div>
    </motion.div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-background selection:bg-primary/10 selection:text-primary transition-colors duration-1000">
      
      {/* Header */}
      <header className="w-full max-w-5xl mx-auto p-8 md:p-12 flex flex-col md:flex-row justify-between items-center md:items-baseline gap-6 opacity-0 animate-[fade-in_2s_ease-out_forwards]">
        <Link href="/">
          <h1 className="text-lg font-serif tracking-wide text-foreground cursor-pointer hover:opacity-70 transition-opacity">
            Richard Hell
          </h1>
        </Link>
        <Navigation />
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto flex flex-col justify-center relative p-4">
        <Switch>
          <Route path="/" component={() => (
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
          )} />
          
          {/* Section Routes */}
          <Route path="/books" component={() => (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-12">
              {contentData.books.map((book) => (
                <div key={book.id} className="group cursor-pointer">
                  <div className="aspect-[2/3] bg-muted mb-4 transition-colors group-hover:bg-muted/80 flex items-center justify-center text-muted-foreground/20 italic">
                    [Cover]
                  </div>
                  <h3 className="font-serif text-lg">{book.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{book.year} — {book.publisher}</p>
                </div>
              ))}
            </div>
          )} />

          <Route path="/music" component={() => (
             <div className="space-y-8 py-12 max-w-2xl mx-auto">
               {contentData.music.map((album) => (
                 <div key={album.id} className="flex justify-between items-baseline border-b border-border pb-4 group cursor-pointer hover:border-foreground/30 transition-colors">
                   <div>
                     <h3 className="font-serif text-xl">{album.title}</h3>
                     <p className="text-sm text-muted-foreground italic">{album.artist}</p>
                   </div>
                   <div className="text-right text-xs text-muted-foreground font-mono">
                     {album.year} / {album.label}
                   </div>
                 </div>
               ))}
             </div>
          )} />

          <Route path="/journalism" component={() => <SectionPlaceholder title="Journalism" />} />
          <Route path="/film" component={() => <SectionPlaceholder title="Film" />} />
          <Route path="/art" component={() => <SectionPlaceholder title="Art" />} />
          <Route path="/store" component={() => <SectionPlaceholder title="Store" />} />
          <Route path="/contact" component={() => <SectionPlaceholder title="Contact" />} />
        </Switch>
      </main>

      {/* Footer Status */}
      <footer className="w-full max-w-5xl mx-auto p-8 flex justify-center text-xs text-muted-foreground/50 font-serif italic">
        <span className="animate-pulse mr-2">●</span> Live Archive
      </footer>
    </div>
  );
}
