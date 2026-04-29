import { plantations } from "@/data/content";
import { MapPin } from "lucide-react";

export default function MapPreview({ title = "Plantation Map", interactive = false }: { title?: string; interactive?: boolean }) {
  return (
    <div className="relative w-full h-[420px] rounded-md overflow-hidden border border-border bg-surface shadow-card">
      {/* Stylized base map */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
        <defs>
          <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
            <path d="M 5 0 L 0 0 0 5" fill="none" stroke="hsl(123 30% 80%)" strokeWidth="0.15" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="hsl(120 30% 92%)" />
        <rect width="100" height="100" fill="url(#grid)" />
        {/* Faux land masses */}
        <path d="M5,40 Q20,20 45,28 T95,30 L98,55 Q70,68 50,60 T8,72 Z" fill="hsl(123 35% 78%)" opacity="0.7" />
        <path d="M10,55 Q30,50 55,58 T92,60 L92,80 Q60,88 35,82 T8,85 Z" fill="hsl(123 40% 70%)" opacity="0.6" />
        {/* River */}
        <path d="M0,50 Q25,55 50,48 T100,52" fill="none" stroke="hsl(200 60% 65%)" strokeWidth="1.2" opacity="0.7" />
      </svg>

      {/* Markers */}
      {plantations.map((p) => (
        <div
          key={p.id}
          className="absolute -translate-x-1/2 -translate-y-full group"
          style={{ left: `${p.lng}%`, top: `${p.lat}%` }}
        >
          <MapPin className="h-6 w-6 text-accent drop-shadow-md fill-accent/30" />
          {interactive && (
            <div className="absolute left-1/2 -translate-x-1/2 -top-2 -translate-y-full opacity-0 group-hover:opacity-100 transition bg-card text-card-foreground text-xs px-2 py-1 rounded shadow-elevated border border-border whitespace-nowrap pointer-events-none">
              {p.name}
            </div>
          )}
        </div>
      ))}

      {/* Overlay label */}
      <div className="absolute top-3 left-3 bg-card/95 backdrop-blur px-3 py-2 rounded shadow-card text-xs">
        <div className="font-semibold text-primary">{title}</div>
        <div className="text-muted-foreground">Tripura · {plantations.length} active sites</div>
      </div>
      <div className="absolute bottom-3 right-3 bg-card/95 backdrop-blur px-3 py-2 rounded shadow-card text-[10px] text-muted-foreground">
        Demo map · Bhuvan / Google Maps / ESRI integration ready
      </div>
    </div>
  );
}
