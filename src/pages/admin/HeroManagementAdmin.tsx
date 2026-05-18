import { useEffect, useRef, useState } from "react";
import { AdminPageHeader } from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, Trash2, Plus, Save, Image as ImageIcon, Upload, GripVertical, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL, USE_REAL_API } from "@/config/api";

interface Slide {
  id: string | number;
  title: string;
  subtitle: string;
  badge: string;
  cta1Label: string;
  cta1Link: string;
  cta2Label: string;
  cta2Link: string;
  image: string;       // existing image_path (relative) OR filename for dummy
  imageFile?: File;    // newly picked file for upload
  _new?: boolean;      // not yet persisted to backend
}

// Dummy fallback data — always kept as a safety net.
const dummySlides: Slide[] = [
  { id: 1, title: "Enhancing Landscape and Ecosystem Management", subtitle: "ELEMENT — a joint initiative of the Government of Tripura and The World Bank.", badge: "PROJECT ELEMENT", cta1Label: "Explore Projects", cta1Link: "/projects", cta2Label: "View Plantation Map", cta2Link: "/plantation-map", image: "hero-forest.jpg" },
  { id: 2, title: "Transforming Rural Livelihoods Across Tripura", subtitle: "Community-led value chain development and sustainable landscape management.", badge: "Government of Tripura", cta1Label: "Learn More", cta1Link: "/about", cta2Label: "View Activities", cta2Link: "/activities", image: "hero-plantation.jpg" },
  { id: 3, title: "Building Resilient Communities & Landscapes", subtitle: "Empowering 25,000+ households through livelihood generation.", badge: "The World Bank", cta1Label: "Explore Projects", cta1Link: "/projects", cta2Label: "Knowledge Hub", cta2Link: "/knowledge-hub/iec", image: "hero-wildlife.jpg" },
  { id: 4, title: "Watershed Development", subtitle: "Strengthening water conservation and sustainable rural landscapes.", badge: "PROJECT ELEMENT", cta1Label: "Learn More", cta1Link: "/about", cta2Label: "View Plantation Map", cta2Link: "/plantation-map", image: "hero-watershed.jpg" },
  { id: 5, title: "Natural Resource Management", subtitle: "Promoting soil conservation and community-led environmental restoration.", badge: "Government of Tripura", cta1Label: "Explore Projects", cta1Link: "/projects", cta2Label: "Knowledge Hub", cta2Link: "/knowledge-hub/iec", image: "hero-nrm.jpg" },
];

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("element_admin_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function mapApiToSlide(s: any): Slide {
  return {
    id: s.id,
    title: s.title ?? "",
    subtitle: s.subtitle ?? "",
    badge: s.badge_text ?? "",
    cta1Label: s.cta1_label ?? "",
    cta1Link: s.cta1_link ?? "",
    cta2Label: s.cta2_label ?? "",
    cta2Link: s.cta2_link ?? "",
    image: s.image_path ?? "",
  };
}

function slideToFormData(s: Slide): FormData {
  const fd = new FormData();
  fd.append("title", s.title);
  fd.append("subtitle", s.subtitle);
  fd.append("badge_text", s.badge);
  fd.append("cta1_label", s.cta1Label);
  fd.append("cta1_link", s.cta1Link);
  fd.append("cta2_label", s.cta2Label);
  fd.append("cta2_link", s.cta2Link);
  if (s.imageFile) fd.append("image", s.imageFile);
  return fd;
}

export default function HeroManagementAdmin() {
  // Admin always shows real API data (no dummy fallback). Empty array = empty state.
  const [slides, setSlides] = useState<Slide[]>([]);
  const [editing, setEditing] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  const loadSlides = async () => {
    if (!USE_REAL_API) {
      // Preview mode: seed with dummy entries so the UI is explorable.
      setSlides(dummySlides);
      return;
    }
    setLoading(true);
    try {
      // Public list endpoint, but admin sends the bearer token.
      const res = await fetch(`${API_BASE_URL}/api/hero-slides`, { headers: authHeaders() });
      if (!res.ok) throw new Error("bad status");
      const data = await res.json();
      setSlides(Array.isArray(data) ? data.map(mapApiToSlide) : []);
    } catch {
      toast.error("Unable to load slides");
      setSlides([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSlides();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const moveSlide = (index: number, direction: "up" | "down") => {
    const newSlides = [...slides];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newSlides.length) return;
    [newSlides[index], newSlides[swapIndex]] = [newSlides[swapIndex], newSlides[index]];
    setSlides(newSlides);
  };

  const removeSlide = async (index: number) => {
    const slide = slides[index];
    if (USE_REAL_API && !slide._new) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/hero-slides/${slide.id}`, {
          method: "DELETE",
          headers: authHeaders(),
        });
        if (!res.ok) throw new Error();
        toast.success("Slide deleted");
        await loadSlides();
        return;
      } catch {
        toast.error("Failed to delete slide");
        return;
      }
    }
    setSlides(slides.filter((_, i) => i !== index));
  };

  const updateField = (index: number, field: keyof Slide, value: any) => {
    const newSlides = [...slides];
    (newSlides[index] as any)[field] = value;
    setSlides(newSlides);
  };

  const addSlide = () => {
    setSlides([
      ...slides,
      {
        id: `new-${Date.now()}`,
        title: "New Slide",
        subtitle: "Enter subtitle here",
        badge: "PROJECT ELEMENT",
        cta1Label: "Explore Projects",
        cta1Link: "/projects",
        cta2Label: "Learn More",
        cta2Link: "/about",
        image: "",
        _new: true,
      },
    ]);
  };

  const onImagePicked = (index: number, file: File | null) => {
    if (!file) return;
    updateField(index, "imageFile", file);
    updateField(index, "image", file.name);
  };

  const saveAll = async () => {
    if (!USE_REAL_API) {
      toast.success("Changes saved (preview only)");
      return;
    }
    setSaving(true);
    try {
      // Create new + update existing
      for (const s of slides) {
        const fd = slideToFormData(s);
        if (s._new) {
          const res = await fetch(`${API_BASE_URL}/api/admin/hero-slides`, {
            method: "POST",
            headers: authHeaders(),
            body: fd,
          });
          if (!res.ok) throw new Error("create failed");
        } else {
          const res = await fetch(`${API_BASE_URL}/api/admin/hero-slides/${s.id}`, {
            method: "PUT",
            headers: authHeaders(),
            body: fd,
          });
          if (!res.ok) throw new Error("update failed");
        }
      }
      // Reorder
      const reorderBody = {
        items: slides
          .filter((s) => !s._new)
          .map((s, i) => ({ id: s.id, display_order: i + 1 })),
      };
      if (reorderBody.items.length > 0) {
        await fetch(`${API_BASE_URL}/api/admin/hero-slides/reorder`, {
          method: "PUT",
          headers: { ...authHeaders(), "Content-Type": "application/json" },
          body: JSON.stringify(reorderBody),
        });
      }
      toast.success("Slides saved successfully");
      await loadSlides();
    } catch {
      toast.error("Failed to save slides");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <AdminPageHeader
        title="Hero Content Management"
        subtitle="Manage homepage hero slides, text, and call-to-action buttons."
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={addSlide} className="gap-1.5"><Plus className="h-4 w-4" /> Add Slide</Button>
            <Button onClick={saveAll} disabled={saving} className="gap-1.5">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Changes
            </Button>
          </div>
        }
      />

      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading slides…
        </div>
      )}

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
                  <input
                    ref={(el) => (fileInputs.current[String(slide.id)] = el)}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => onImagePicked(index, e.target.files?.[0] ?? null)}
                  />
                  <div
                    onClick={() => fileInputs.current[String(slide.id)]?.click()}
                    className="mt-1 h-48 border-2 border-dashed border-border rounded-md flex flex-col items-center justify-center bg-surface group hover:border-primary/40 transition cursor-pointer"
                  >
                    {slide.image ? (
                      <div className="text-center">
                        <ImageIcon className="h-8 w-8 text-primary mx-auto mb-2" />
                        <p className="text-xs font-medium text-foreground">{slide.image}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">Recommended: 1920 × 1080 px</p>
                        <Button variant="outline" size="sm" className="mt-2 gap-1 text-xs" type="button">
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
