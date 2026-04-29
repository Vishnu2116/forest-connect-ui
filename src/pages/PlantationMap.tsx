import { useState } from "react";
import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import MapPreview from "@/components/common/MapPreview";
import { plantations, districts, years } from "@/data/content";
import { Layers, Filter, MapPin } from "lucide-react";

export default function PlantationMap() {
  const [district, setDistrict] = useState("All Districts");
  const [year, setYear] = useState("All Years");
  const [selected, setSelected] = useState(plantations[0]);

  const filtered = plantations.filter(p =>
    (district === "All Districts" || p.district === district) &&
    (year === "All Years" || String(p.year) === year)
  );

  return (
    <PageLayout>
      <PageHeader title="Plantation Locations" subtitle="Interactive map of plantation sites across Tripura" breadcrumb={["Home", "Plantation Map"]} />
      <section className="py-8">
        <div className="gov-container grid lg:grid-cols-4 gap-6">
          {/* Filters & list */}
          <aside className="lg:col-span-1 space-y-4">
            <div className="bg-card border border-border rounded-md p-4 shadow-card">
              <h3 className="font-semibold text-primary flex items-center gap-2 mb-3"><Filter className="h-4 w-4" /> Filters</h3>
              <label className="block text-xs font-medium text-muted-foreground mt-2">District</label>
              <select value={district} onChange={(e) => setDistrict(e.target.value)} className="mt-1 w-full border border-input rounded px-3 py-2 text-sm bg-background focus-ring">
                {districts.map(d => <option key={d}>{d}</option>)}
              </select>
              <label className="block text-xs font-medium text-muted-foreground mt-3">Year</label>
              <select value={year} onChange={(e) => setYear(e.target.value)} className="mt-1 w-full border border-input rounded px-3 py-2 text-sm bg-background focus-ring">
                {years.map(y => <option key={y}>{y}</option>)}
              </select>
              <div className="mt-3 text-xs text-muted-foreground">{filtered.length} sites match</div>
            </div>

            <div className="bg-card border border-border rounded-md p-4 shadow-card">
              <h3 className="font-semibold text-primary flex items-center gap-2 mb-3"><Layers className="h-4 w-4" /> Base Layers</h3>
              <ul className="text-sm space-y-2">
                {["Bhuvan (ISRO)", "Google Maps", "ESRI Satellite", "OpenStreetMap"].map((l, i) => (
                  <li key={l} className="flex items-center gap-2">
                    <input type="radio" name="layer" defaultChecked={i === 0} className="accent-primary" /> {l}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[11px] text-muted-foreground italic">Integration-ready · UI demo only</p>
            </div>

            <div className="bg-card border border-border rounded-md p-4 shadow-card max-h-72 overflow-y-auto">
              <h3 className="font-semibold text-primary mb-3">Sites</h3>
              <ul className="space-y-1">
                {filtered.map(p => (
                  <li key={p.id}>
                    <button
                      onClick={() => setSelected(p)}
                      className={`w-full text-left px-2 py-1.5 rounded text-sm hover:bg-surface flex items-start gap-2 ${selected.id === p.id ? "bg-primary/10 text-primary" : ""}`}
                    >
                      <MapPin className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                      <span>{p.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Map + details */}
          <div className="lg:col-span-3 space-y-4">
            <MapPreview title="Tripura Plantation Sites" interactive />
            <div className="bg-card border border-border rounded-md p-6 shadow-card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-accent/10 text-accent">{selected.year}</span>
                  <h3 className="mt-1 text-xl font-semibold text-primary">{selected.name}</h3>
                  <p className="text-sm text-muted-foreground">{selected.district} District, Tripura</p>
                </div>
                <button className="bg-accent hover:bg-accent-hover text-accent-foreground px-4 py-2 rounded text-sm font-semibold">View Details</button>
              </div>
              <dl className="mt-5 grid sm:grid-cols-3 gap-3 text-sm">
                <div className="bg-surface rounded p-3"><dt className="text-xs text-muted-foreground">Area Planted</dt><dd className="font-semibold mt-1">{selected.area} hectares</dd></div>
                <div className="bg-surface rounded p-3"><dt className="text-xs text-muted-foreground">Species</dt><dd className="font-semibold mt-1">{selected.species}</dd></div>
                <div className="bg-surface rounded p-3"><dt className="text-xs text-muted-foreground">Year</dt><dd className="font-semibold mt-1">{selected.year}</dd></div>
              </dl>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
