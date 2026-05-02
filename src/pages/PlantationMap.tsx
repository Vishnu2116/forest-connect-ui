import { useState, useMemo } from "react";
import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import MapPreview from "@/components/common/MapPreview";
import { plantations, districts } from "@/data/content";
import { Layers, Filter, MapPin, ChevronRight } from "lucide-react";

type Dataset = {
  id: string;
  name: string;
  years: string[];
  description: string;
};

const datasets: Dataset[] = [
  { id: "landscape", name: "Tripura Landscape Restoration Layer", years: ["2023", "2024", "2025"], description: "Degraded landscape restoration and productive land management sites" },
  { id: "livelihood", name: "Community Livelihood Plantation Layer", years: ["2022", "2023"], description: "Community-driven livelihood plantation and nursery sites" },
  { id: "bamboo", name: "Bamboo & High Value Forest Product Layer", years: ["2024", "2025"], description: "Bamboo corridors and high-value forest product development areas" },
];

export default function PlantationMap() {
  const [district, setDistrict] = useState("All Districts");
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selected, setSelected] = useState(plantations[0]);

  const activeDataset = datasets.find(d => d.id === selectedDataset);

  const filtered = useMemo(() => {
    return plantations.filter(p =>
      (district === "All Districts" || p.district === district) &&
      (!selectedYear || String(p.year) === selectedYear)
    );
  }, [district, selectedYear]);

  const handleDatasetSelect = (id: string) => {
    setSelectedDataset(id);
    setSelectedYear(null);
  };

  return (
    <PageLayout>
      <PageHeader title="Plantation Locations" subtitle="Interactive map of plantation and livelihood sites across Tripura" breadcrumb={["Home", "Plantation Map"]} />
      <section className="py-8">
        <div className="gov-container grid lg:grid-cols-4 gap-6">
          {/* Filters & list */}
          <aside className="lg:col-span-1 space-y-4">
            {/* Step 1: Select Base Layer / Dataset */}
            <div className="bg-card border border-border rounded-md p-4 shadow-card">
              <h3 className="font-semibold text-primary flex items-center gap-2 mb-1"><Layers className="h-4 w-4" /> Step 1: Select Base Layer</h3>
              <p className="text-[11px] text-muted-foreground mb-3">Choose a dataset to view available years</p>
              <ul className="space-y-2">
                {datasets.map((ds) => (
                  <li key={ds.id}>
                    <button
                      onClick={() => handleDatasetSelect(ds.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-md border text-sm transition ${
                        selectedDataset === ds.id
                          ? "border-accent bg-accent/10 text-primary font-semibold"
                          : "border-border hover:border-primary/40 hover:bg-surface"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="dataset"
                          checked={selectedDataset === ds.id}
                          onChange={() => handleDatasetSelect(ds.id)}
                          className="accent-accent"
                        />
                        <span>{ds.name}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1 ml-5">{ds.description}</p>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Step 2: Select Year (conditional) */}
            <div className={`bg-card border rounded-md p-4 shadow-card transition ${activeDataset ? "border-border" : "border-border opacity-50"}`}>
              <h3 className="font-semibold text-primary flex items-center gap-2 mb-1"><Filter className="h-4 w-4" /> Step 2: Select Year</h3>
              {!activeDataset ? (
                <p className="text-xs text-muted-foreground italic mt-2 flex items-center gap-1">
                  <ChevronRight className="h-3 w-3" /> Please select a base layer first
                </p>
              ) : (
                <>
                  <p className="text-[11px] text-muted-foreground mb-3">Available years for: <strong className="text-foreground">{activeDataset.name}</strong></p>
                  <div className="flex flex-wrap gap-2">
                    {activeDataset.years.map((y) => (
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
                </>
              )}
            </div>

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
            {selectedDataset && (
              <div className="bg-surface border border-border rounded-md px-4 py-2.5 flex flex-wrap items-center gap-2 text-sm">
                <span className="text-muted-foreground">Layer:</span>
                <span className="font-semibold text-primary">{activeDataset?.name}</span>
                {selectedYear && (
                  <>
                    <span className="text-muted-foreground">→ Year:</span>
                    <span className="font-semibold text-accent">{selectedYear}</span>
                  </>
                )}
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
