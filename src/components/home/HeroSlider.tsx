import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import hero1 from "@/assets/hero-forest.jpg";
import hero2 from "@/assets/hero-plantation.jpg";
import hero3 from "@/assets/hero-wildlife.jpg";
import hero4 from "@/assets/hero-watershed.jpg";
import hero5 from "@/assets/hero-nrm.jpg";
import { API_BASE_URL, USE_REAL_API } from "@/config/api";

type Slide = {
  img: string;
  title: string;
  subtitle: string;
  badge: string;
  cta1: { label: string; to: string };
  cta2: { label: string; to: string };
};

const dummySlides: Slide[] = [
  {
    img: hero1,
    title: "Enhancing Landscape and Ecosystem Management",
    subtitle:
      "ELEMENT — a joint initiative of the Government of Tripura and The World Bank for livelihood transformation and economic growth.",
    badge: "PROJECT ELEMENT",
    cta1: { label: "Explore Projects", to: "/projects" },
    cta2: { label: "View Plantation Map", to: "/plantation-map" },
  },
  {
    img: hero2,
    title: "Transforming Rural Livelihoods Across Tripura",
    subtitle:
      "Community-led value chain development, enterprise support and sustainable landscape management.",
    badge: "Government of Tripura",
    cta1: { label: "Learn More", to: "/about" },
    cta2: { label: "View Activities", to: "/activities" },
  },
  {
    img: hero3,
    title: "Building Resilient Communities & Landscapes",
    subtitle:
      "Empowering 25,000+ households through livelihood generation, skill development and community participation.",
    badge: "The World Bank",
    cta1: { label: "Explore Projects", to: "/projects" },
    cta2: { label: "Knowledge Hub", to: "/knowledge-hub/iec" },
  },
  {
    img: hero4,
    title: "Watershed Management",
    subtitle:
      "Strengthening water conservation, irrigation support, and sustainable rural landscapes through integrated watershed management.",
    badge: "PROJECT ELEMENT",
    cta1: { label: "Learn More", to: "/about" },
    cta2: { label: "View Plantation Map", to: "/plantation-map" },
  },
  {
    img: hero5,
    title: "Natural Resource Management",
    subtitle:
      "Promoting soil conservation, plantation, land improvement, and community-led environmental restoration.",
    badge: "Government of Tripura",
    cta1: { label: "Explore Projects", to: "/projects" },
    cta2: { label: "Knowledge Hub", to: "/knowledge-hub/iec" },
  },
];

export default function HeroSlider() {
  // When using the real API, start empty so we don't flash dummy data over real slides.
  const [slides, setSlides] = useState<Slide[]>(USE_REAL_API ? [] : dummySlides);
  const [i, setI] = useState(0);
  const [loading, setLoading] = useState(USE_REAL_API);

  // Fetch hero slides from API; fall back to dummy data only on failure / empty response.
  useEffect(() => {
    if (!USE_REAL_API) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/hero-slides`);
        if (!res.ok) throw new Error("bad status");
        const data = await res.json();
        if (cancelled) return;
        if (Array.isArray(data) && data.length > 0) {
          const mapped: Slide[] = data
            .filter((s: any) => s.is_active !== false)
            .sort((a: any, b: any) => (a.display_order ?? 0) - (b.display_order ?? 0))
            .map((s: any) => ({
              img: `${API_BASE_URL}${s.image_path}`,
              title: s.title ?? "",
              subtitle: s.subtitle ?? "",
              badge: s.badge_text ?? "",
              cta1: { label: s.cta1_label ?? "", to: s.cta1_link ?? "#" },
              cta2: { label: s.cta2_label ?? "", to: s.cta2_link ?? "#" },
            }));
          if (mapped.length > 0) {
            setSlides(mapped);
            setI(0);
          } else {
            setSlides(dummySlides);
          }
        } else {
          setSlides(dummySlides);
        }
      } catch {
        if (!cancelled) setSlides(dummySlides);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Pause auto-rotate on hover, keyboard focus, or reduced-motion preference.
  const [paused, setPaused] = useState(false);
  const regionRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (slides.length === 0 || paused || prefersReducedMotion) return;
    const t = setInterval(() => setI((p) => (p + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides.length, paused, prefersReducedMotion]);

  // Clamp index whenever the slide set shrinks (e.g. API returns fewer than dummy).
  useEffect(() => {
    if (slides.length > 0 && i >= slides.length) setI(0);
  }, [slides.length, i]);

  const next = () => setI((p) => (p + 1) % slides.length);
  const prev = () => setI((p) => (p - 1 + slides.length) % slides.length);

  return (
    <section
      ref={regionRef}
      className="relative bg-primary-dark overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Featured highlights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          next();
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          prev();
        }
      }}
    >
      <div
        className="relative h-[420px] sm:h-[460px] md:h-[480px] lg:h-[540px]"
        aria-live={paused ? "polite" : "off"}
      >
        {slides.map((s, idx) => (
          <div
            key={idx}
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${idx + 1} of ${slides.length}: ${s.title}`}
            className={`absolute inset-0 transition-opacity duration-700 ${idx === i ? "opacity-100" : "opacity-0"}`}
            aria-hidden={idx !== i}
          >
            <img
              src={s.img}
              alt=""
              className="w-full h-full object-cover"
              width={1920}
              height={1024}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 via-primary-dark/70 to-primary-dark/30 md:to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="gov-container">
                <div className="max-w-2xl text-primary-foreground pb-16 sm:pb-0">
                  <span className="inline-block bg-accent text-accent-foreground text-[11px] sm:text-xs font-semibold px-3 py-1 rounded">
                    {s.badge}
                  </span>
                  <h2 className="mt-4 text-2xl sm:text-3xl md:text-5xl font-bold leading-tight mb-0 text-white">
                    {s.title}
                  </h2>
                  <p className="mt-3 text-sm sm:text-base md:text-lg opacity-90 leading-relaxed mb-0">
                    {s.subtitle}
                  </p>
                  <div className="mt-6 flex flex-col sm:flex-row flex-wrap gap-3">
                    <Link
                      to={s.cta1.to}
                      className="bg-accent hover:bg-accent-hover text-accent-foreground px-5 py-2.5 rounded font-semibold focus-ring text-center"
                    >
                      {s.cta1.label}
                    </Link>
                    <Link
                      to={s.cta2.to}
                      className="bg-background/10 backdrop-blur border border-primary-foreground/30 text-primary-foreground px-5 py-2.5 rounded font-semibold hover:bg-background/20 focus-ring text-center"
                    >
                      {s.cta2.label}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Left Arrow — bottom-left on mobile/tablet, centered on desktop */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 bottom-3 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 bg-background/20 hover:bg-background/40 text-primary-foreground p-2.5 rounded-full backdrop-blur-md focus-ring z-30 transition-all"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Right Arrow — bottom-right on mobile/tablet, centered on desktop */}
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 bottom-3 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 bg-background/20 hover:bg-background/40 text-primary-foreground p-2.5 rounded-full backdrop-blur-md focus-ring z-30 transition-all"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Bottom Center Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              idx === i
                ? "bg-accent w-8"
                : "bg-primary-foreground/60 hover:bg-primary-foreground/80 w-2.5"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
