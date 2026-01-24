import { ArchiveItem, ArchiveItemProps } from "./archive-item";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GenerativeGridProps {
  items: ArchiveItemProps[];
}

export function GenerativeGrid({ items: initialItems }: GenerativeGridProps) {
  const [items, setItems] = useState(initialItems);
  const [filter, setFilter] = useState<string | null>(null);

  // Generative shuffle effect
  const shuffle = () => {
    setItems((prev) => [...prev].sort(() => Math.random() - 0.5));
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-4 mb-8 sticky top-0 bg-background/95 backdrop-blur z-40 py-4 border-b border-border">
        <button 
          onClick={() => setFilter(null)}
          className={`text-xs font-mono uppercase px-3 py-1 border ${filter === null ? 'bg-foreground text-background border-foreground' : 'border-border hover:bg-border/10'}`}
        >
          All
        </button>
        {["text", "poetry", "image"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`text-xs font-mono uppercase px-3 py-1 border ${filter === type ? 'bg-foreground text-background border-foreground' : 'border-border hover:bg-border/10'}`}
          >
            {type}
          </button>
        ))}
        <button 
          onClick={shuffle}
          className="ml-auto text-xs font-mono uppercase px-3 py-1 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          Shuffle Archive
        </button>
      </div>

      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        <AnimatePresence>
          {items
            .filter((item) => filter ? item.type === filter : true)
            .map((item) => (
              <ArchiveItem key={item.id} {...item} />
            ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
