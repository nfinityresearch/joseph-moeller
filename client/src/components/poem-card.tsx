import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PoemCardProps {
  title: string;
  number?: string;
  excerpt: string;
  className?: string;
  delay?: number;
}

export function PoemCard({ title, number, excerpt, className, delay = 0 }: PoemCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      className={cn("group cursor-pointer py-12 md:py-24 border-b border-border/30 last:border-0", className)}
    >
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-6">
        {number && (
          <span className="font-serif-display text-muted-foreground italic text-xl">
            {number}
          </span>
        )}
        <h3 className="font-serif-display text-3xl md:text-4xl lg:text-5xl font-normal group-hover:text-primary transition-colors duration-500">
          {title}
        </h3>
      </div>
      <div className="max-w-xl ml-auto">
        <p className="font-serif-body text-lg md:text-xl leading-relaxed text-muted-foreground whitespace-pre-line group-hover:text-foreground transition-colors duration-500">
          {excerpt}
        </p>
        <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <span className="font-script text-2xl text-primary transform -rotate-2 inline-block">
            lire plus &rarr;
          </span>
        </div>
      </div>
    </motion.div>
  );
}
