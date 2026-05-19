import { useEffect, useRef, useState } from "react";
import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import { Download, MapPin, Layers, Filter, FileText, Map as MapIcon } from "lucide-react";
import {
  fetchMapKey, fetchGisYears, fetchGisDistricts, fetchGisSites,
  loadGoogleMaps, resolveGisUrl, formatKmlSize, GisSite, GisKmlFile,
} from "@/lib/gis";

const TRIPURA_CENTER = { lat: 23.9408, lng: 91.9882 };

function cleanKmlName(name: string): string {
  // strip leading uuid- prefix if present
  return name.replace(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}[-_]?/i, "");
}

export default function PlantationMap() {
  const [years, setYears] = useState<number[]>([]);
  const [districts, setDistricts] = useState<string[]>(["All Districts"]);
  const [year, setYear] = useState<number | null>(null);
  const [district, setDistrict] = useState("All Districts");
  const [sites, setSites] = useState<GisSite[]>([]);
  const [selected, setSelected] = useState<GisSite | null>(null);
  const [selectedKml, setSelectedKml] = useState<GisKmlFile | null>(null);
  const [loading, setLoading] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [mapMsg, setMapMsg] = useState<string | null>(null);

  const mapEl = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const layerRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [ys, ds, key] = await Promise.all([fetchGisYears(), fetchGisDistricts(), fetchMapKey()]);
      if (cancelled) return;
      setYears(ys);
      setDistricts(["All Districts", ...ds]);
      if (ys.length) setYear(ys[0]);

      if (key && mapEl.current) {
        const g = await loadGoogleMaps(key);
        if (cancelled) return;
        if (g?.maps) {
          mapRef.current = new g.maps.Map(mapEl.current, {
            center: TRIPURA_CENTER, zoom: 8, mapTypeControl: true, streetViewControl: false,
          });
          setMapReady(true);
          if (window.location.hostname === "localhost") {
            setMapMsg("KML overlay requires a public URL — will render on deployed server.");
          }
        } else {
          setMapMsg("Could not load Google Maps.");
        }
      } else if (!key) {
        setMapMsg("Map key unavailable.");
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (year == null) return;
    let cancelled = false;
    setLoading(true);
    fetchGisSites(year, district).then((data) => {
      if (cancelled) return;
      setSites(data);
      const first = data[0] || null;
      setSelected(first);
      setSelectedKml(first?.kml_files?.[0] || null);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [year, district]);

  // Draw single selected KML layer
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const g = (window as any).google;
    if (layerRef.current) { layerRef.current.setMap(null); layerRef.current = null; }
    if (!selectedKml || window.location.hostname === "localhost") {
      mapRef.current.setCenter(TRIPURA_CENTER);
      mapRef.current.setZoom(8);
      return;
    }
    const url = resolveGisUrl(selectedKml.file_path);
    if (!url) return;
    layerRef.current = new g.maps.KmlLayer({ url, map: mapRef.current, preserveViewport: false });
  }, [selectedKml, mapReady]);

  const handleSelectSite = (s: GisSite) => {
    setSelected(s);
    setSelectedKml(s.kml_files?.[0] || null);
  };

  return (
    <PageLayout>
      <PageHeader title="MIS / GIS — Plantation Sites" subtitle="Interactive map of plantation sites across Tripura" breadcrumb={["Home", "MIS / GIS"]} />
      <section className="py-8">
        <div className="gov-container grid lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1 space-y-4">
            <div className="bg-card border border-border rounded-md p-4 shadow-card">
              <h3 className="font-semibold text-primary flex items-center gap-2 mb-3"><Layers className="h-4 w-4" /> Select Year</h3>
              <div className="flex flex-wrap gap-2">
                {years.length === 0 && <span className="text-xs text-muted-foreground">No years available</span>}
                {years.map((y) => (
                  <button key={y} onClick={() => setYear(y)}
                    className={`px-3 py-1.5 rounded-md border text-sm font-medium transition ${
                      year === y ? "border-accent bg-accent text-accent-foreground" : "border-border hover:border-accent hover:bg-accent/5 text-foreground"
                    }`}>{y}</button>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-md p-4 shadow-card">
              <h3 className="font-semibold text-primary flex items-center gap-2 mb-3"><Filter className="h-4 w-4" /> District</h3>
              <select value={district} onChange={(e) => setDistrict(e.target.value)} className="w-full border border-input rounded px-3 py-2 text-sm bg-background focus-ring">
                {districts.map((d) => <option key={d}>{d}</option>)}
              </select>
              <div className="mt-3 text-xs text-muted-foreground">{sites.length} site{sites.length === 1 ? "" : "s"}</div>
            </div>

            <div className="bg-card border border-border rounded-md p-4 shadow-card max-h-[32rem] overflow-y-auto">
              <h3 className="font-semibold text-primary mb-3">Sites</h3>
              {loading && <div className="text-xs text-muted-foreground">Loading…</div>}
              {!loading && sites.length === 0 && (
                <div className="text-xs text-muted-foreground">No sites found for this year</div>
              )}
              <ul className="space-y-1">
                {sites.map((s) => {
                  const isOpen = selected?.id === s.id;
                  const files = s.kml_files || [];
                  return (
                    <li key={s.id}>
                      <button onClick={() => handleSelectSite(s)}
                        className={`w-full text-left px-2 py-2 rounded text-sm hover:bg-surface flex items-start gap-2 ${isOpen ? "bg-primary/10 text-primary" : ""}`}>
                        <MapPin className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                        <span className="flex-1">
                          <span className="block font-medium">{s.name}</span>
                          <span className="block text-[11px] text-muted-foreground">
                            {s.district} · {files.length} KML file{files.length === 1 ? "" : "s"}
                          </span>
                        </span>
                      </button>
                      {isOpen && files.length > 0 && (
                        <ul className="mt-1 ml-6 space-y-1 border-l border-border pl-2">
                          {files.map((k) => {
                            const active = selectedKml?.id === k.id;
                            return (
                              <li key={k.id}>
                                <button onClick={() => setSelectedKml(k)}
                                  className={`w-full text-left px-2 py-1.5 rounded text-xs flex items-center gap-2 transition ${
                                    active ? "bg-accent text-accent-foreground" : "hover:bg-surface text-foreground"
                                  }`}>
                                  <MapIcon className="h-3.5 w-3.5 shrink-0" />
                                  <span className="flex-1 truncate" title={k.file_name}>{cleanKmlName(k.file_name)}</span>
                                  {k.file_size != null && (
                                    <span className={`text-[10px] ${active ? "opacity-90" : "text-muted-foreground"}`}>{formatKmlSize(k.file_size)}</span>
                                  )}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                      {isOpen && files.length === 0 && (
                        <div className="ml-6 mt-1 text-[11px] text-muted-foreground">No KML files</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          <div className="lg:col-span-3 space-y-4">
            <div className="bg-card border border-border rounded-md overflow-hidden shadow-card">
              <div ref={mapEl} className="w-full h-[460px] bg-surface" />
              {mapMsg && (
                <div className="px-4 py-2 text-xs text-muted-foreground border-t border-border bg-surface">{mapMsg}</div>
              )}
            </div>

            {selected && (
              <div className="bg-card border border-border rounded-md p-6 shadow-card">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-accent/10 text-accent">{selected.year}</span>
                    <h3 className="mt-1 text-xl font-semibold text-primary">{selected.name}</h3>
                    <p className="text-sm text-muted-foreground">{selected.district} District, Tripura</p>
                  </div>
                </div>
                <dl className="mt-5 grid sm:grid-cols-3 gap-3 text-sm">
                  <div className="bg-surface rounded p-3"><dt className="text-xs text-muted-foreground">Area Covered</dt><dd className="font-semibold mt-1">{selected.area_covered || "—"}</dd></div>
                  <div className="bg-surface rounded p-3"><dt className="text-xs text-muted-foreground">Species / Products</dt><dd className="font-semibold mt-1">{selected.species_products || "—"}</dd></div>
                  <div className="bg-surface rounded p-3"><dt className="text-xs text-muted-foreground">Year</dt><dd className="font-semibold mt-1">{selected.year}</dd></div>
                </dl>
                {selected.description && (
                  <p className="mt-4 text-sm text-foreground/90 whitespace-pre-line">{selected.description}</p>
                )}
                {selectedKml && (
                  <div className="mt-5 border border-border rounded p-3 bg-surface flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2 text-sm min-w-0">
                      <FileText className="h-4 w-4 text-accent shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs text-muted-foreground">Currently selected KML</div>
                        <div className="font-medium truncate" title={selectedKml.file_name}>
                          {cleanKmlName(selectedKml.file_name)}
                          {selectedKml.file_size != null && (
                            <span className="ml-2 text-xs text-muted-foreground">({formatKmlSize(selectedKml.file_size)})</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {resolveGisUrl(selectedKml.file_path) && (
                      <a href={resolveGisUrl(selectedKml.file_path)!} target="_blank" rel="noreferrer"
                         className="inline-flex items-center gap-1 text-accent hover:underline text-xs">
                        <Download className="h-3.5 w-3.5" /> Download
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
