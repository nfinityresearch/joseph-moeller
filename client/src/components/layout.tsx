import React from "react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function Layout({ children, className }: LayoutProps) {
  return (
    <div className="min-h-screen w-full bg-background p-4 md:p-8 lg:p-12 transition-colors duration-1000">
      <div className="mx-auto max-w-5xl border border-border/40 bg-card p-8 md:p-16 lg:p-24 shadow-2xl relative overflow-hidden min-h-[90vh]">
        {/* Decorative corner flourishes (CSS only) */}
        <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-primary/20 opacity-50" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-primary/20 opacity-50" />
        
        {/* Inner margin line for that book feel */}
        <div className="absolute inset-4 md:inset-8 border border-border/20 pointer-events-none" />

        <div className={cn("relative z-10", className)}>
          {children}
        </div>
      </div>
    </div>
  );
}
