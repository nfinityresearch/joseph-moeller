import { GenerativeStream } from "@/components/generative-stream";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-background selection:bg-primary/10 selection:text-primary transition-colors duration-1000">
      
      {/* Navigation / Header - Extremely Minimal */}
      <header className="w-full max-w-4xl mx-auto p-8 flex justify-between items-baseline opacity-0 animate-[fade-in_2s_ease-out_forwards]">
        <h1 className="text-base font-serif tracking-wide text-foreground">
          Richard Hell
        </h1>
        <nav className="flex gap-6 text-sm italic text-muted-foreground">
          <span className="cursor-pointer hover:text-foreground transition-colors">Archive</span>
          <span className="cursor-pointer hover:text-foreground transition-colors">Index</span>
          <span className="cursor-pointer hover:text-foreground transition-colors">About</span>
        </nav>
      </header>

      {/* Main Generative Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto flex flex-col justify-center relative">
        <GenerativeStream className="w-full" />
        
        {/* Subtle decorative element */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground/40 font-serif tracking-widest uppercase"
        >
          Fig. 1 — The Living Text
        </motion.div>
      </main>

      {/* Footer Status */}
      <footer className="w-full max-w-4xl mx-auto p-8 flex justify-center text-xs text-muted-foreground/50 font-serif italic">
        <span className="animate-pulse mr-2">●</span> Live Archive
      </footer>
    </div>
  );
}
