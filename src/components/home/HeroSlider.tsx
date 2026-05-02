import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import hero1 from "@/assets/hero-forest.jpg";
import hero2 from "@/assets/hero-plantation.jpg";
import hero3 from "@/assets/hero-wildlife.jpg";
import hero4 from "@/assets/hero-watershed.jpg";
import hero5 from "@/assets/hero-nrm.jpg";

const slides = [
  { img: hero1, title: "Enhancing Landscape and Ecosystem Management", subtitle: "ELEMENT — a joint initiative of the Government of Tripura and The World Bank for livelihood transformation and economic growth.", badge: "ELEMENT Programme" },
  { img: hero2, title: "Transforming Rural Livelihoods Across Tripura", subtitle: "Community-led value chain development, enterprise support and sustainable landscape management.", badge: "Government of Tripura" },
  { img: hero3, title: "Building Resilient Communities & Landscapes", subtitle: "Empowering 25,000+ households through livelihood generation, skill development and community participation.", badge: "The World Bank" },
  { img: hero4, title: "Watershed Development", subtitle: "Strengthening water conservation, irrigation support, and sustainable rural landscapes through integrated watershed management.", badge: "ELEMENT Programme" },
  { img: hero5, title: "Natural Resource Management", subtitle: "Promoting soil conservation, plantation, land improvement, and community-led environmental restoration.", badge: "Government of Tripura" },
];

export default function HeroSlider() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, []);
  const next = () => setI((p) => (p + 1) % slides.length);
  const prev = () => setI((p) => (p - 1 + slides.length) % slides.length);

  return (
    <section className="relative bg-primary-dark overflow-hidden">
      <div className="relative h-[420px] sm:h-[460px] md:h-[480px] lg:h-[540px]">
        {slides.map((s, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-700 ${idx === i ? "opacity-100" : "opacity-0"}`}
            aria-hidden={idx !== i}
          >
            <img src={s.img} alt={s.title} className="w-full h-full object-cover" width={1920} height={1024} />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 via-primary-dark/70 to-primary-dark/30 md:to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="gov-container">
                {/* Add bottom padding on mobile to make room for nav buttons */}
                <div className="max-w-2xl text-primary-foreground pb-16 sm:pb-0">
                  <span className="inline-block bg-accent text-accent-foreground text-[11px] sm:text-xs font-semibold px-3 py-1 rounded">{s.badge}</span>
                  <h2 className="mt-4 text-2xl sm:text-3xl md:text-5xl font-bold leading-tight mb-0">{s.title}</h2>
                  <p className="mt-3 text-sm sm:text-base md:text-lg opacity-90 leading-relaxed mb-0">{s.subtitle}</p>
                  <div className="mt-6 flex flex-col sm:flex-row flex-wrap gap-3">
                    <a href="/projects" className="bg-accent hover:bg-accent-hover text-accent-foreground px-5 py-2.5 rounded font-semibold focus-ring text-center">Explore Projects</a>
                    <a href="/plantation-map" className="bg-background/10 backdrop-blur border border-primary-foreground/30 text-primary-foreground px-5 py-2.5 rounded font-semibold hover:bg-background/20 focus-ring text-center">View Plantation Map</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Nav buttons: bottom on mobile, vertically centered on md+ */}
      <button onClick={prev} aria-label="Previous slide" className="absolute left-3 bottom-12 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 bg-background/20 hover:bg-background/40 text-primary-foreground p-2 rounded-full backdrop-blur focus-ring z-10">
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button onClick={next} aria-label="Next slide" className="absolute right-3 bottom-12 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 bg-background/20 hover:bg-background/40 text-primary-foreground p-2 rounded-full backdrop-blur focus-ring z-10">
        <ChevronRight className="h-5 w-5" />
      </button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2 rounded-full transition-all ${idx === i ? "bg-accent w-8" : "bg-primary-foreground/50 w-2"}`}
          />
        ))}
      </div>
    </section>
  );
}
