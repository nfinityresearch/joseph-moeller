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
    queryKey: ["quotes"],
    queryFn: () => import("@/lib/api").then((m) => m.fetchQuotes()),
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
      <div className="relative flex flex-col justify-center items-center text-center py-8 md:py-12">
        <div className="relative w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] lg:w-[560px] lg:h-[560px]">
          <img
            src="/images/enso.png"
            alt=""
            className="w-full h-full object-contain opacity-[0.12]"
            data-testid="img-enso"
          />

          <div className="absolute inset-0 flex flex-col justify-center items-center px-12 sm:px-16 md:px-20">
            <AnimatePresence mode="wait">
              {isThinking ? (
                <motion.div
                  key="thinking"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <span className="text-sm italic text-muted-foreground animate-pulse" data-testid="status-thinking">
                    breathing...
                  </span>
                </motion.div>
              ) : currentQuote ? (
                <motion.div
                  key={currentQuote.id}
                  initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="max-w-md"
                >
                  <p className="text-lg sm:text-xl md:text-2xl leading-relaxed font-serif text-foreground/85 mb-5" data-testid="text-quote">
                    "{currentQuote.text}"
                  </p>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs italic text-muted-foreground/60" data-testid="text-source">
                      {currentQuote.source}
                    </span>
                    <span className="text-[10px] text-muted-foreground/40" data-testid="text-year">
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
                    settling into stillness...
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
