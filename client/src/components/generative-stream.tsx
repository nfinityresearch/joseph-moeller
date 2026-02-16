import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import contentData from "@/data/content.json";

interface GenerativeStreamProps {
  className?: string;
}

export function GenerativeStream({ className }: GenerativeStreamProps) {
  const [currentQuote, setCurrentQuote] = useState(contentData.quotes[0]);
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsThinking(true);
      setTimeout(() => {
        const nextQuote = contentData.quotes[Math.floor(Math.random() * contentData.quotes.length)];
        setCurrentQuote(nextQuote);
        setIsThinking(false);
      }, 1500); 
    }, 8000); 

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
