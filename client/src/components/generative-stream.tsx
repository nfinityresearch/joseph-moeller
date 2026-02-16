import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

interface Quote {
  id: number;
  text: string;
  source: string;
  year: string;
}

interface GenerativeStreamProps {
  className?: string;
}

export function GenerativeStream({ className }: GenerativeStreamProps) {
  const { data: quotes } = useQuery<Quote[]>({
    queryKey: ["/api/quotes"],
    queryFn: () => fetch("/api/quotes").then(r => r.json()),
  });

  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  const surfaceNext = useCallback(() => {
    if (!quotes || quotes.length === 0) return;
    setIsThinking(true);
    setTimeout(() => {
      const next = quotes[Math.floor(Math.random() * quotes.length)];
      setCurrentQuote(next);
      setIsThinking(false);
    }, 1500);
  }, [quotes]);

  useEffect(() => {
    if (quotes && quotes.length > 0 && !currentQuote) {
      setCurrentQuote(quotes[0]);
    }
  }, [quotes, currentQuote]);

  useEffect(() => {
    if (!quotes || quotes.length === 0) return;
    const interval = setInterval(surfaceNext, 8000);
    return () => clearInterval(interval);
  }, [quotes, surfaceNext]);

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
              <span className="text-sm italic text-muted-foreground animate-pulse" data-testid="status-thinking">
                surfacing artifact...
              </span>
            </motion.div>
          ) : currentQuote ? (
            <motion.div
              key={currentQuote.id}
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl"
            >
              <p className="text-2xl md:text-3xl lg:text-4xl leading-relaxed font-serif text-foreground mb-6" data-testid="text-quote">
                "{currentQuote.text}"
              </p>
              <div className="flex flex-col items-center gap-1">
                <span className="text-sm italic text-muted-foreground" data-testid="text-source">
                  {currentQuote.source}
                </span>
                <span className="text-xs text-muted-foreground/60" data-testid="text-year">
                  {currentQuote.year}
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span className="text-sm italic text-muted-foreground animate-pulse">
                opening archive...
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
