import { useState } from "react";
import { AdminPageHeader } from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Upload, ChevronUp, ChevronDown, Trash2, Plus, Save } from "lucide-react";

const imageSections = [
  {
    section: "Hero Slides",
    recommended: "1920 × 1080 px",
    items: [
      { name: "Slide 1 — Landscape Management", file: "hero-forest.jpg" },
      { name: "Slide 2 — Rural Livelihoods", file: "hero-plantation.jpg" },
      { name: "Slide 3 — Resilient Communities", file: "hero-wildlife.jpg" },
      { name: "Slide 4 — Watershed Development", file: "hero-watershed.jpg" },
      { name: "Slide 5 — Natural Resource Management", file: "hero-nrm.jpg" },
    ],
  },
  {
    section: "Project Thumbnails",
    recommended: "800 × 500 px",
    items: [
      { name: "Landscape Restoration Project", file: "" },
      { name: "HVFP Value Chain Development", file: "" },
      { name: "Climate-Resilient Infrastructure", file: "" },
    ],
  },
  {
    section: "Knowledge Hub Images",
    recommended: "600 × 400 px",
    items: [
      { name: "IEC Materials Cover", file: "" },
      { name: "Newsletter Banner", file: "" },
    ],
  },
  {
    section: "Activities & Outputs",
    recommended: "800 × 500 px",
    items: [
      { name: "Activity Banner Image", file: "" },
    ],
  },
  {
    section: "About Section",
    recommended: "1200 × 800 px",
    items: [
      { name: "About ELEMENT Banner", file: "" },
      { name: "Organization Structure", file: "" },
    ],
  },
];

export default function ImageManagementAdmin() {
  return (
    <>
      <AdminPageHeader
        title="Image Management"
        subtitle="Upload and manage images for all public-facing sections."
      />

      <div className="space-y-6">
        {imageSections.map((section) => (
          <div key={section.section} className="bg-card border border-border rounded-md">
            <div className="px-4 py-3 border-b border-border bg-surface flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-primary">{section.section}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Recommended: <span className="font-medium text-accent">{section.recommended}</span></p>
              </div>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Add Image
              </Button>
            </div>
            <div className="p-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.items.map((item) => (
                <div key={item.name} className="border border-border rounded-md overflow-hidden">
                  <div className="h-32 bg-gradient-to-br from-primary/20 to-primary-light/20 flex items-center justify-center relative group">
                    {item.file ? (
                      <div className="text-xs text-primary font-medium">{item.file}</div>
                    ) : (
                      <div className="flex flex-col items-center text-muted-foreground">
                        <ImageIcon className="h-8 w-8 mb-1 opacity-40" />
                        <span className="text-[10px]">No image uploaded</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-primary-dark/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                      <Button size="sm" variant="secondary" className="text-xs gap-1">
                        <Upload className="h-3 w-3" /> Replace
                      </Button>
                    </div>
                  </div>
                  <div className="p-3 bg-surface">
                    <p className="text-xs font-medium text-foreground truncate">{item.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Size: {section.recommended}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
