import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GenerativeStreamProps {
  className?: string;
}

const QUOTES = [
  {
    text: "I was saying let me out of here before I was even born—it's such a gamble when you get a face.",
    source: "Blank Generation",
    year: "1977"
  },
  {
    text: "Time is a flat circle, cut from paper, burned at the edges.",
    source: "Notebooks",
    year: "1992"
  },
  {
    text: "Love comes in spurts.",
    source: "Blank Generation",
    year: "1977"
  },
  {
    text: "To me, 'blank' is a line where you can fill in anything.",
    source: "Interview",
    year: "1978"
  },
  {
    text: "I wanted to be the first one to know what it felt like to be dead.",
    source: "The Voidoid",
    year: "1996"
  },
  {
    text: "The aesthetic was always about removal. Taking away the excess until only the nerve endings remained.",
    source: "Godlike Genius",
    year: "2001"
  },
  {
    text: "Poetry is the only art form where the materials are free.",
    source: "Lecture",
    year: "1984"
  },
  {
    text: "You can't write a poem about a tree, but you can be a tree.",
    source: "Artifact",
    year: "Unknown"
  }
];

export function GenerativeStream({ className }: GenerativeStreamProps) {
  const [currentQuote, setCurrentQuote] = useState(QUOTES[0]);
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    // Simulate "living" archive - changing content periodically
    const interval = setInterval(() => {
      setIsThinking(true);
      setTimeout(() => {
        const nextQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
        setCurrentQuote(nextQuote);
        setIsThinking(false);
      }, 1500); // Thinking time
    }, 8000); // Change every 8 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={className}>
      <div className="relative min-h-[300px] flex flex-col justify-center items-center text-center p-8">
        <AnimatePresence mode="wait">
          {isThinking ? (
            <motion.div
              key="thinking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute"
            >
              <span className="text-sm italic text-muted-foreground animate-pulse">
                surfacing artifact...
              </span>
            </motion.div>
          ) : (
            <motion.div
              key={currentQuote.text}
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl"
            >
              <p className="text-2xl md:text-3xl lg:text-4xl leading-relaxed font-serif text-foreground mb-6">
                "{currentQuote.text}"
              </p>
              <div className="flex flex-col items-center gap-1">
                <span className="text-sm italic text-muted-foreground">
                  {currentQuote.source}
                </span>
                <span className="text-xs text-muted-foreground/60">
                  {currentQuote.year}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
