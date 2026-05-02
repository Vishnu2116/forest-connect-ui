import { useState, useMemo } from "react";
import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import MapPreview from "@/components/common/MapPreview";
import { plantations, districts } from "@/data/content";
import { Layers, Filter, MapPin, Globe, Map, Database } from "lucide-react";

type MapProvider = {
  id: string;
  name: string;
  icon: React.ReactNode;
  years: string[];
};

const mapProviders: MapProvider[] = [
  { id: "bhuvan", name: "Bhuvan", icon: <Globe className="h-5 w-5" />, years: ["2022", "2023", "2024", "2025"] },
  { id: "google", name: "Google Maps", icon: <Map className="h-5 w-5" />, years: ["2023", "2024"] },
  { id: "esri", name: "ESRI", icon: <Database className="h-5 w-5" />, years: ["2021", "2022", "2023"] },
];

export default function PlantationMap() {
  const [district, setDistrict] = useState("All Districts");
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selected, setSelected] = useState(plantations[0]);

  const activeProvider = mapProviders.find(p => p.id === selectedProvider);

  const filtered = useMemo(() => {
    return plantations.filter(p =>
      (district === "All Districts" || p.district === district) &&
      (!selectedYear || String(p.year) === selectedYear)
    );
  }, [district, selectedYear]);

  const handleProviderSelect = (id: string) => {
    setSelectedProvider(id);
    setSelectedYear(null);
  };

  return (
    <PageLayout>
      <PageHeader title="Plantation Locations" subtitle="Interactive map of plantation and livelihood sites across Tripura" breadcrumb={["Home", "Plantation Map"]} />
      <section className="py-8">
        <div className="gov-container grid lg:grid-cols-4 gap-6">
          {/* Filters & list */}
          <aside className="lg:col-span-1 space-y-4">
            {/* Step 1: Select Map Provider */}
            <div className="bg-card border border-border rounded-md p-4 shadow-card">
              <h3 className="font-semibold text-primary flex items-center gap-2 mb-3">
                <Layers className="h-4 w-4" /> Step 1: Select Map Provider
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {mapProviders.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => handleProviderSelect(provider.id)}
                    className={`flex flex-col items-center gap-1.5 px-2 py-3 rounded-lg border text-xs font-medium transition-all ${
                      selectedProvider === provider.id
                        ? "border-accent bg-accent/10 text-accent ring-2 ring-accent/30"
                        : "border-border hover:border-primary/40 hover:bg-surface text-foreground"
                    }`}
                  >
                    {provider.icon}
                    <span>{provider.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Select Year (only visible when provider selected) */}
            {activeProvider && (
              <div className="bg-card border border-border rounded-md p-4 shadow-card animate-fade-in">
                <h3 className="font-semibold text-primary flex items-center gap-2 mb-1">
                  <Filter className="h-4 w-4" /> Step 2: Select Year
                </h3>
                <p className="text-[11px] text-muted-foreground mb-3">
                  Available years for <strong className="text-foreground">{activeProvider.name}</strong>
                </p>
                <div className="flex flex-wrap gap-2">
                  {activeProvider.years.map((y) => (
                    <button
                      key={y}
                      onClick={() => setSelectedYear(selectedYear === y ? null : y)}
                      className={`px-3 py-1.5 rounded-md border text-sm font-medium transition ${
                        selectedYear === y
                          ? "border-accent bg-accent text-accent-foreground"
                          : "border-border hover:border-accent hover:bg-accent/5 text-foreground"
                      }`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* District filter */}
            <div className="bg-card border border-border rounded-md p-4 shadow-card">
              <h3 className="font-semibold text-primary flex items-center gap-2 mb-3"><Filter className="h-4 w-4" /> Filter by District</h3>
              <select value={district} onChange={(e) => setDistrict(e.target.value)} className="w-full border border-input rounded px-3 py-2 text-sm bg-background focus-ring">
                {districts.map(d => <option key={d}>{d}</option>)}
              </select>
              <div className="mt-3 text-xs text-muted-foreground">{filtered.length} sites match</div>
            </div>

            {/* Sites list */}
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
            {/* Status bar */}
            {selectedProvider && selectedYear && (
              <div className="bg-surface border border-border rounded-md px-4 py-2.5 flex flex-wrap items-center gap-2 text-sm">
                <span className="text-muted-foreground">Showing plantation data for</span>
                <span className="font-semibold text-primary">{activeProvider?.name}</span>
                <span className="text-muted-foreground">–</span>
                <span className="font-semibold text-accent">{selectedYear}</span>
                {district !== "All Districts" && (
                  <>
                    <span className="text-muted-foreground">→ District:</span>
                    <span className="font-semibold text-foreground">{district}</span>
                  </>
                )}
              </div>
            )}

            <MapPreview title="Tripura Plantation & Livelihood Sites" interactive />
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
                <div className="bg-surface rounded p-3"><dt className="text-xs text-muted-foreground">Area Covered</dt><dd className="font-semibold mt-1">{selected.area} hectares</dd></div>
                <div className="bg-surface rounded p-3"><dt className="text-xs text-muted-foreground">Species / Products</dt><dd className="font-semibold mt-1">{selected.species}</dd></div>
                <div className="bg-surface rounded p-3"><dt className="text-xs text-muted-foreground">Year</dt><dd className="font-semibold mt-1">{selected.year}</dd></div>
              </dl>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
