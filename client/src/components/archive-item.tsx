import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";

export type ArchiveType = "text" | "image" | "audio" | "poetry";

export interface ArchiveItemProps {
  id: string;
  type: ArchiveType;
  title: string;
  content: string;
  date?: string;
  className?: string;
  imageSrc?: string;
}

export function ArchiveItem({ id, type, title, content, date, className, imageSrc }: ArchiveItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "relative group border border-border bg-card p-4 hover:z-10 transition-all duration-300",
        isHovered ? "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1 -translate-x-1" : "shadow-none",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-start mb-2 border-b border-border/20 pb-2">
        <span className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
          {type}
        </span>
        <span className="text-xs font-mono text-muted-foreground">{id}</span>
      </div>

      <div className="space-y-4">
        {type === "image" && imageSrc && (
          <div className="relative aspect-square overflow-hidden bg-muted">
            <img 
              src={imageSrc} 
              alt={title}
              className="object-cover w-full h-full grayscale contrast-125 group-hover:contrast-150 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 mix-blend-multiply transition-opacity" />
          </div>
        )}

        <div>
          <h3 className="text-lg font-bold font-sans uppercase tracking-tight mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          {type === "poetry" ? (
            <pre className="font-mono text-xs md:text-sm whitespace-pre-wrap leading-relaxed opacity-80">
              {content}
            </pre>
          ) : (
            <p className="font-mono text-sm leading-relaxed opacity-80 line-clamp-6">
              {content}
            </p>
          )}
        </div>

        {date && (
          <div className="pt-4 mt-2 border-t border-dashed border-border/30">
            <span className="text-[10px] font-mono uppercase text-muted-foreground">
              Archived: {date}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
