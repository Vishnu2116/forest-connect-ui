import { useState } from "react";
import { AdminPageHeader } from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, Trash2, Plus, Save, Image as ImageIcon, Upload, GripVertical } from "lucide-react";

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  cta1Label: string;
  cta1Link: string;
  cta2Label: string;
  cta2Link: string;
  image: string;
}

const initialSlides: Slide[] = [
  { id: 1, title: "Enhancing Landscape and Ecosystem Management", subtitle: "ELEMENT — a joint initiative of the Government of Tripura and The World Bank.", badge: "PROJECT ELEMENT", cta1Label: "Explore Projects", cta1Link: "/projects", cta2Label: "View Plantation Map", cta2Link: "/plantation-map", image: "hero-forest.jpg" },
  { id: 2, title: "Transforming Rural Livelihoods Across Tripura", subtitle: "Community-led value chain development and sustainable landscape management.", badge: "Government of Tripura", cta1Label: "Learn More", cta1Link: "/about", cta2Label: "View Activities", cta2Link: "/activities", image: "hero-plantation.jpg" },
  { id: 3, title: "Building Resilient Communities & Landscapes", subtitle: "Empowering 25,000+ households through livelihood generation.", badge: "The World Bank", cta1Label: "Explore Projects", cta1Link: "/projects", cta2Label: "Knowledge Hub", cta2Link: "/knowledge-hub/iec", image: "hero-wildlife.jpg" },
  { id: 4, title: "Watershed Development", subtitle: "Strengthening water conservation and sustainable rural landscapes.", badge: "PROJECT ELEMENT", cta1Label: "Learn More", cta1Link: "/about", cta2Label: "View Plantation Map", cta2Link: "/plantation-map", image: "hero-watershed.jpg" },
  { id: 5, title: "Natural Resource Management", subtitle: "Promoting soil conservation and community-led environmental restoration.", badge: "Government of Tripura", cta1Label: "Explore Projects", cta1Link: "/projects", cta2Label: "Knowledge Hub", cta2Link: "/knowledge-hub/iec", image: "hero-nrm.jpg" },
];

export default function HeroManagementAdmin() {
  const [slides, setSlides] = useState<Slide[]>(initialSlides);
  const [editing, setEditing] = useState<number | null>(null);

  const moveSlide = (index: number, direction: "up" | "down") => {
    const newSlides = [...slides];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newSlides.length) return;
    [newSlides[index], newSlides[swapIndex]] = [newSlides[swapIndex], newSlides[index]];
    setSlides(newSlides);
  };

  const removeSlide = (index: number) => {
    setSlides(slides.filter((_, i) => i !== index));
  };

  const updateField = (index: number, field: keyof Slide, value: string) => {
    const newSlides = [...slides];
    (newSlides[index] as any)[field] = value;
    setSlides(newSlides);
  };

  const addSlide = () => {
    const newId = Math.max(...slides.map(s => s.id), 0) + 1;
    setSlides([...slides, {
      id: newId, title: "New Slide", subtitle: "Enter subtitle here", badge: "PROJECT ELEMENT",
      cta1Label: "Explore Projects", cta1Link: "/projects", cta2Label: "Learn More", cta2Link: "/about", image: "",
    }]);
  };

  return (
    <>
      <AdminPageHeader
        title="Hero Content Management"
        subtitle="Manage homepage hero slides, text, and call-to-action buttons."
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={addSlide} className="gap-1.5"><Plus className="h-4 w-4" /> Add Slide</Button>
            <Button className="gap-1.5"><Save className="h-4 w-4" /> Save Changes</Button>
          </div>
        }
      />

      <div className="space-y-4">
        {slides.map((slide, index) => (
          <div key={slide.id} className="bg-card border border-border rounded-md overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-surface flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">Slide {index + 1}</span>
                <span className="text-sm font-medium text-primary truncate max-w-xs">{slide.title}</span>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => moveSlide(index, "up")} disabled={index === 0}>
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => moveSlide(index, "down")} disabled={index === slides.length - 1}>
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setEditing(editing === index ? null : index)}>
                  <span className="text-xs">{editing === index ? "Close" : "Edit"}</span>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => removeSlide(index)} className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {editing === index && (
              <div className="p-4 grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Title</label>
                    <input value={slide.title} onChange={(e) => updateField(index, "title", e.target.value)} className="w-full border border-input rounded px-3 py-2 text-sm bg-card focus-ring mt-1" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Subtitle</label>
                    <textarea value={slide.subtitle} onChange={(e) => updateField(index, "subtitle", e.target.value)} rows={2} className="w-full border border-input rounded px-3 py-2 text-sm bg-card focus-ring mt-1" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Badge Text</label>
                    <input value={slide.badge} onChange={(e) => updateField(index, "badge", e.target.value)} className="w-full border border-input rounded px-3 py-2 text-sm bg-card focus-ring mt-1" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase">CTA 1 Label</label>
                      <input value={slide.cta1Label} onChange={(e) => updateField(index, "cta1Label", e.target.value)} className="w-full border border-input rounded px-3 py-2 text-sm bg-card focus-ring mt-1" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase">CTA 1 Link</label>
                      <input value={slide.cta1Link} onChange={(e) => updateField(index, "cta1Link", e.target.value)} className="w-full border border-input rounded px-3 py-2 text-sm bg-card focus-ring mt-1" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase">CTA 2 Label</label>
                      <input value={slide.cta2Label} onChange={(e) => updateField(index, "cta2Label", e.target.value)} className="w-full border border-input rounded px-3 py-2 text-sm bg-card focus-ring mt-1" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase">CTA 2 Link</label>
                      <input value={slide.cta2Link} onChange={(e) => updateField(index, "cta2Link", e.target.value)} className="w-full border border-input rounded px-3 py-2 text-sm bg-card focus-ring mt-1" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Hero Image</label>
                  <div className="mt-1 h-48 border-2 border-dashed border-border rounded-md flex flex-col items-center justify-center bg-surface group hover:border-primary/40 transition cursor-pointer">
                    {slide.image ? (
                      <div className="text-center">
                        <ImageIcon className="h-8 w-8 text-primary mx-auto mb-2" />
                        <p className="text-xs font-medium text-foreground">{slide.image}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">Recommended: 1920 × 1080 px</p>
                        <Button variant="outline" size="sm" className="mt-2 gap-1 text-xs">
                          <Upload className="h-3 w-3" /> Replace Image
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground">Click to upload image</p>
                        <p className="text-[10px] text-muted-foreground mt-1">Recommended: 1920 × 1080 px</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
