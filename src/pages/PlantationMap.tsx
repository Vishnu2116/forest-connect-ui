import { useEffect, useMemo, useRef, useState } from "react";
import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import { Download, MapPin, Filter, FileText, Map as MapIcon } from "lucide-react";
import {
  fetchMapKey, fetchGisDistricts, fetchGisSites,
  loadGoogleMaps, resolveGisUrl, formatKmlSize, TRIPURA_DISTRICTS, GisSite, GisKmlFile,
} from "@/lib/gis";
import { getOriginalFilename } from "@/utils/fileDownload";

const TRIPURA_CENTER = { lat: 23.9408, lng: 91.9882 };

// Approximate district centers for map focus
const DISTRICT_CENTERS: Record<string, { lat: number; lng: number; zoom: number }> = {
  "West Tripura": { lat: 23.8315, lng: 91.2868, zoom: 10 },
  "Sepahijala": { lat: 23.6710, lng: 91.3200, zoom: 10 },
  "Khowai": { lat: 24.0800, lng: 91.6000, zoom: 10 },
  "Gomati": { lat: 23.5330, lng: 91.4820, zoom: 10 },
  "South Tripura": { lat: 23.1770, lng: 91.4740, zoom: 10 },
  "Dhalai": { lat: 23.9200, lng: 91.8000, zoom: 10 },
  "Unakoti": { lat: 24.3200, lng: 92.0000, zoom: 10 },
  "North Tripura": { lat: 24.2380, lng: 92.1610, zoom: 10 },
};

function cleanKmlName(name: string): string {
  return name.replace(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}[-_]?/i, "");
}

export default function PlantationMap() {
  const [districts, setDistricts] = useState<string[]>(["All Districts", ...TRIPURA_DISTRICTS]);
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
  const infoRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [ds, key] = await Promise.all([fetchGisDistricts(), fetchMapKey()]);
      if (cancelled) return;
      if (ds && ds.length) setDistricts(["All Districts", ...ds]);

      if (key && mapEl.current) {
        const g = await loadGoogleMaps(key);
        if (cancelled) return;
        if (g?.maps) {
          mapRef.current = new g.maps.Map(mapEl.current, {
            center: TRIPURA_CENTER, zoom: 8, mapTypeControl: true, streetViewControl: false,
          });
          infoRef.current = new g.maps.InfoWindow();
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

  // Load sites when district changes
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchGisSites(district).then((data) => {
      if (cancelled) return;
      setSites(data);
      setSelected(null);
      setSelectedKml(null);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [district]);

  // Recenter map when district changes and clear previous overlay
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    if (layerRef.current) { layerRef.current.setMap(null); layerRef.current = null; }
    if (infoRef.current) infoRef.current.close();
    const center = DISTRICT_CENTERS[district];
    if (center) {
      mapRef.current.setCenter({ lat: center.lat, lng: center.lng });
      mapRef.current.setZoom(center.zoom);
    } else {
      mapRef.current.setCenter(TRIPURA_CENTER);
      mapRef.current.setZoom(8);
    }
  }, [district, mapReady]);

  // Draw single selected KML layer when a specific site is chosen
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const g = (window as any).google;
    if (layerRef.current) { layerRef.current.setMap(null); layerRef.current = null; }
    if (infoRef.current) infoRef.current.close();
    if (!selectedKml || !selected || window.location.hostname === "localhost") return;
    const url = resolveGisUrl(selectedKml.file_path);
    if (!url) return;
    const layer = new g.maps.KmlLayer({
      url, map: mapRef.current, preserveViewport: false, suppressInfoWindows: true,
    });
    layer.addListener("click", (event: any) => {
      const pos = event?.latLng;
      if (!pos || !infoRef.current) return;
      const s = selected;
      const rows: string[] = [
        `<div style="font-weight:600;color:#1b5e20;font-size:14px;margin-bottom:6px;">${escapeHtml(s.jfmc_name)}</div>`,
        row("District", s.district),
        row("Sub-Division", s.sub_division),
        row("Range", s.range),
        row("Beat", s.beat),
        row("Area (Sanction)", s.area_sanction),
        row("Area (KOBO)", s.area_kobo),
      ];
      if (s.remarks) rows.push(row("Remarks", s.remarks));
      if (s.overlapping_area) rows.push(row("Overlapping Area", s.overlapping_area));
      infoRef.current.setContent(`<div style="min-width:200px;font-family:inherit;font-size:12px;">${rows.join("")}</div>`);
      infoRef.current.setPosition(pos);
      infoRef.current.open(mapRef.current);
    });
    layerRef.current = layer;
  }, [selectedKml, selected, mapReady]);

  const handleSelectSite = (s: GisSite) => {
    setSelected(s);
    setSelectedKml(s.kml_files?.[0] || null);
  };

  // Group filtered sites by Sub-Division -> Range
  const grouped = useMemo(() => {
    const map = new Map<string, Map<string, GisSite[]>>();
    sites.forEach((s) => {
      const sd = s.sub_division || "—";
      const rg = s.range || "—";
      if (!map.has(sd)) map.set(sd, new Map());
      const inner = map.get(sd)!;
      if (!inner.has(rg)) inner.set(rg, []);
      inner.get(rg)!.push(s);
    });
    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([sd, rangeMap]) => [
        sd,
        Array.from(rangeMap.entries()).sort((a, b) => a[0].localeCompare(b[0])),
      ] as [string, [string, GisSite[]][]]);
  }, [sites]);

  return (
    <PageLayout>
      <PageHeader title="MIS / GIS — Plantation Sites" subtitle="Interactive map of plantation sites across Tripura" breadcrumb={["Home", "MIS / GIS"]} />
      <section className="py-8">
        <div className="gov-container grid lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1 space-y-4">
            {/* Legacy Year filter — removed (no year data in new schema)
            <div className="bg-card border border-border rounded-md p-4 shadow-card">
              <h3 className="font-semibold text-primary flex items-center gap-2 mb-3"><Layers className="h-4 w-4" /> Select Year</h3>
            </div>
            */}

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
                <div className="text-xs text-muted-foreground">No sites found</div>
              )}
              <div className="space-y-4">
                {grouped.map(([sd, ranges]) => (
                  <div key={sd}>
                    <div className="text-xs font-semibold text-primary uppercase mb-1">Sub-Division: {sd}</div>
                    <div className="pl-2 border-l-2 border-accent/40 space-y-2">
                      {ranges.map(([rg, list]) => (
                        <div key={rg}>
                          <div className="text-[11px] font-semibold text-muted-foreground uppercase mb-1">Range: {rg}</div>
                          <ul className="space-y-1">
                            {list.map((s) => {
                              const isOpen = selected?.id === s.id;
                              const files = s.kml_files || [];
                              return (
                                <li key={s.id}>
                                  <button onClick={() => handleSelectSite(s)}
                                    className={`w-full text-left px-2 py-2 rounded text-sm hover:bg-surface flex items-start gap-2 ${isOpen ? "bg-primary/10 text-primary" : ""}`}>
                                    <MapPin className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                                    <span className="flex-1">
                                      <span className="block font-medium">{s.jfmc_name}</span>
                                      <span className="block text-[11px] text-muted-foreground">
                                        Beat: {s.beat || "—"} · {files.length} KML file{files.length === 1 ? "" : "s"}
                                      </span>
                                    </span>
                                  </button>
                                  {isOpen && files.length > 1 && (
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
                                            </button>
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <div className="lg:col-span-3 space-y-4">
            <div className="bg-card border border-border rounded-md overflow-hidden shadow-card">
              <div ref={mapEl} className="w-full h-[460px] bg-surface" />
              {mapMsg && (
                <div className="px-4 py-2 text-xs text-muted-foreground border-t border-border bg-surface">{mapMsg}</div>
              )}
            </div>

            {!selected ? (
              <div className="bg-card border border-border rounded-md p-6 shadow-card text-sm text-muted-foreground text-center">
                Select a site from the list to view details.
              </div>
            ) : (
              <div className="bg-card border border-border rounded-md p-6 shadow-card">
                <h3 className="text-xl font-semibold text-primary">{selected.jfmc_name}</h3>
                <p className="text-sm text-muted-foreground">{selected.district} District, Tripura</p>

                <dl className="mt-5 grid sm:grid-cols-3 gap-3 text-sm">
                  <Detail label="Sub-Division" value={selected.sub_division} />
                  <Detail label="Range" value={selected.range} />
                  <Detail label="Beat" value={selected.beat} />
                  <Detail label="Area (Sanction)" value={selected.area_sanction} />
                  <Detail label="Area (KOBO)" value={selected.area_kobo} />
                  <Detail label="Sl. No." value={selected.sl_no} />
                </dl>

                {(selected.remarks || selected.overlapping_area) && (
                  <div className="mt-4 space-y-2 text-sm">
                    {selected.remarks && (
                      <div><span className="text-xs text-muted-foreground">Remarks: </span>{selected.remarks}</div>
                    )}
                    {selected.overlapping_area && (
                      <div><span className="text-xs text-muted-foreground">Overlapping Area: </span>{selected.overlapping_area}</div>
                    )}
                  </div>
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
                      <a href={resolveGisUrl(selectedKml.file_path)!}
                         download={getOriginalFilename(selectedKml.file_path)}
                         target="_blank" rel="noopener noreferrer"
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

function Detail({ label, value }: { label: string; value: any }) {
  const v = value === null || value === undefined || value === "" ? "—" : String(value);
  return (
    <div className="bg-surface rounded p-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-semibold mt-1">{v}</dd>
    </div>
  );
}

function escapeHtml(s: string): string {
  return String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string)
  );
}

function row(label: string, value: any): string {
  if (value === null || value === undefined || value === "") return "";
  return `<div style="margin:2px 0;"><span style="color:#666;">${escapeHtml(label)}:</span> <span style="color:#111;">${escapeHtml(String(value))}</span></div>`;
}
