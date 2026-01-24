import { Layout } from "@/components/layout";
import { PoemCard } from "@/components/poem-card";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <Layout>
      <header className="mb-24 md:mb-40 pt-12 text-center relative">
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="font-serif-display text-sm tracking-[0.2em] uppercase text-muted-foreground mb-4"
        >
          Charles Baudelaire
        </motion.p>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="font-serif-display text-6xl md:text-8xl lg:text-9xl font-medium tracking-tighter text-primary"
        >
          Les Fleurs<br className="md:hidden" /> <span className="italic text-foreground">du</span> Mal
        </motion.h1>
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="h-px w-32 bg-primary mx-auto mt-8"
        />
      </header>

      <section className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-40 items-start">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.4 }}
          className="md:col-span-5 relative"
        >
          <div className="relative aspect-[3/4] overflow-hidden bg-muted">
             {/* Using the generated image */}
            <img 
              src="/baudelaire-mood.png" 
              alt="Portrait mood" 
              className="object-cover w-full h-full grayscale contrast-125 hover:grayscale-0 transition-all duration-1000 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-20" />
            <div className="absolute inset-0 mix-blend-multiply bg-[#f5f0e6] opacity-30" /> {/* Texture overlay */}
          </div>
          <p className="font-script text-2xl md:text-3xl absolute -bottom-8 -right-4 text-foreground rotate-[-4deg]">
            Spleen et Idéal
          </p>
        </motion.div>
        
        <div className="md:col-span-1 hidden md:block" />

        <div className="md:col-span-6 space-y-8 pt-12">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <p className="font-serif-body text-xl md:text-2xl leading-loose first-letter:text-6xl first-letter:font-serif-display first-letter:float-left first-letter:mr-3 first-letter:text-primary">
              Plunging into the abyss, Heaven or Hell, who cares? <br/>
              To find something new in the depths of the unknown!
            </p>
            <p className="font-serif-body text-muted-foreground mt-8 italic text-lg">
              — Le Voyage (VIII)
            </p>
          </motion.div>
        </div>
      </section>

      <Separator className="bg-primary/20 my-24" />

      <section className="space-y-0">
        <PoemCard 
          number="I"
          title="L'Albatros"
          excerpt="Souvent, pour s'amuser, les hommes d'équipage
          Prennent des albatros, vastes oiseaux des mers,
          Qui suivent, indolents compagnons de voyage,
          Le navire glissant sur les gouffres amers."
          delay={0.2}
        />
        
        <PoemCard 
          number="II"
          title="Correspondances"
          excerpt="La Nature est un temple où de vivants piliers
          Laissent parfois sortir de confuses paroles;
          L'homme y passe à travers des forêts de symboles
          Qui l'observent avec des regards familiers."
          delay={0.2}
        />

        <PoemCard 
          number="LXXVIII"
          title="Spleen"
          excerpt="Quand le ciel bas et lourd pèse comme un couvercle
          Sur l'esprit gémissant en proie aux longs ennuis,
          Et que de l'horizon embrassant tout le cercle
          Il nous verse un jour noir plus triste que les nuits..."
          delay={0.2}
        />
      </section>

      <footer className="mt-40 text-center pb-12">
        <p className="font-serif-display text-primary text-2xl mb-4">Fin</p>
        <p className="font-serif-body text-sm text-muted-foreground">
          1857 — Edition Critique
        </p>
      </footer>
    </Layout>
  );
}
