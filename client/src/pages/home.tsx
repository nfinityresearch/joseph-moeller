import { GenerativeGrid } from "@/components/generative-grid";
import { ArchiveItemProps } from "@/components/archive-item";
import { motion } from "framer-motion";

const MOCK_ARCHIVE: ArchiveItemProps[] = [
  {
    id: "RH-001",
    type: "poetry",
    title: "Blank Generation",
    content: "I was saying let me out of here before I was\neven born—it's such a gamble when you get a face\nIt's fascinating to observe what the mirror does\nbut when I dine it's for the wall that I set a place",
    date: "1977"
  },
  {
    id: "RH-002",
    type: "text",
    title: "The Voidoid",
    content: "The aesthetic was always about removal. Taking away the excess until only the nerve endings remained. We didn't want to be polished; we wanted to be true.",
    date: "1980"
  },
  {
    id: "RH-003",
    type: "image",
    title: "CBGB Exterior",
    content: "Original photograph of the Bowery frontage, pre-gentrification. Note the layers of flyers.",
    imageSrc: "/xerox-noise.png",
    date: "1976"
  },
  {
    id: "RH-004",
    type: "poetry",
    title: "Time",
    content: "Time is a flat circle,\ncut from paper,\nburned at the edges.",
    date: "1992"
  },
  {
    id: "RH-005",
    type: "text",
    title: "Notebook Fragment #33",
    content: "Walking down 2nd Avenue. The heat rising from the subway grates smells like electricity and old hair. I miss the danger but not the fear.",
    date: "2001"
  },
  {
    id: "RH-006",
    type: "image",
    title: "Torn Flyer",
    content: "Scan of a gig flyer found in a pocket.",
    imageSrc: "/torn-edge.png",
    date: "1978"
  },
  {
    id: "RH-007",
    type: "text",
    title: "On Formatting",
    content: "The page is a constraint. Break the page.",
    date: "1985"
  },
  {
    id: "RH-008",
    type: "poetry",
    title: "Go Now",
    content: "Go now.\nBefore the light changes.\nBefore the ink dries.\nBefore you forget why you came.",
    date: "1996"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto">
      <header className="mb-12 md:mb-24 pt-12">
        <div className="border-b-4 border-foreground pb-4 mb-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-sans font-black tracking-tighter uppercase glitch-hover"
            data-text="RICHARD HELL"
          >
            Richard Hell
          </motion.h1>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <p className="font-mono text-sm max-w-md text-muted-foreground">
            LIVING ARCHIVE v2.0 <br/>
            GENERATIVE SEQUENCE <br/>
            EST. 1949
          </p>
          <div className="font-mono text-xs uppercase text-right">
            <p>System Status: ONLINE</p>
            <p className="text-primary animate-pulse">Scanning database...</p>
          </div>
        </div>
      </header>

      <main>
        <GenerativeGrid items={MOCK_ARCHIVE} />
      </main>

      <footer className="mt-24 pt-12 border-t border-border flex justify-between items-end">
        <div className="text-9xl font-sans font-black text-border opacity-20 select-none pointer-events-none -mb-8 -ml-4">
          VOID
        </div>
        <p className="font-mono text-xs text-muted-foreground">
          © {new Date().getFullYear()} Richard Hell Archive
        </p>
      </footer>
    </div>
  );
}
