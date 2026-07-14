import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Pencil, Trash2, X, Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AdminPageHeader } from "./AdminLayout";
import {
  fetchGisSitesAdmin, createGisSite, updateGisSite, deleteGisSite,
  uploadKml, deleteKml, formatKmlSize, TRIPURA_DISTRICTS, GisSite, GisSitePayload,
} from "@/lib/gis";

const blank: GisSitePayload = {
  sl_no: null,
  district: "",
  sub_division: "",
  range: "",
  beat: "",
  jfmc_name: "",
  area_sanction: null,
  area_kobo: null,
  remarks: "",
  overlapping_area: "",
  display_order: 0,
  is_active: true,
};

export default function GisAdmin() {
  const [sites, setSites] = useState<GisSite[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<(GisSitePayload & { id?: string }) | null>(null);
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  const [districtFilter, setDistrictFilter] = useState<string>("All");
  const [subDivisionFilter, setSubDivisionFilter] = useState<string>("All");
  const [rangeFilter, setRangeFilter] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchGisSitesAdmin();
      setSites(data);
    } catch (e: any) {
      if (e?.message !== "Session expired") toast.error("Failed to load sites");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  // Group by District -> Sub-Division -> Range
  const grouped = useMemo(() => {
    const districtMap = new Map<string, Map<string, Map<string, GisSite[]>>>();
    sites.forEach((s) => {
      const d = s.district || "Unspecified";
      const sd = s.sub_division || "—";
      const rg = s.range || "—";
      if (!districtMap.has(d)) districtMap.set(d, new Map());
      const subMap = districtMap.get(d)!;
      if (!subMap.has(sd)) subMap.set(sd, new Map());
      const rangeMap = subMap.get(sd)!;
      if (!rangeMap.has(rg)) rangeMap.set(rg, []);
      rangeMap.get(rg)!.push(s);
    });
    return Array.from(districtMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([d, subMap]) => [
        d,
        Array.from(subMap.entries())
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([sd, rangeMap]) => [
            sd,
            Array.from(rangeMap.entries()).sort((a, b) => a[0].localeCompare(b[0])),
          ] as [string, [string, GisSite[]][]]),
      ] as [string, [string, [string, GisSite[]][]][]]);
  }, [sites]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    try {
      const { id, ...payload } = editing;
      if (id) await updateGisSite(id, payload); else await createGisSite(payload);
      toast.success(id ? "Site updated" : "Site created");
      setEditing(null);
      load();
    } catch (e: any) {
      if (e?.message !== "Session expired") toast.error("Save failed");
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this site and all its KML files?")) return;
    try { await deleteGisSite(id); toast.success("Deleted"); load(); }
    catch (e: any) { if (e?.message !== "Session expired") toast.error("Delete failed"); }
  };

  const onUpload = async (siteId: string, file: File) => {
    try { await uploadKml(siteId, file); toast.success("KML uploaded"); load(); }
    catch (e: any) { if (e?.message !== "Session expired") toast.error("Upload failed"); }
  };

  const onDeleteKml = async (kmlId: string) => {
    if (!confirm("Delete this KML file?")) return;
    try { await deleteKml(kmlId); toast.success("KML deleted"); load(); }
    catch (e: any) { if (e?.message !== "Session expired") toast.error("Delete failed"); }
  };

  const setField = <K extends keyof (GisSitePayload & { id?: string })>(k: K, v: any) =>
    setEditing((prev) => (prev ? { ...prev, [k]: v } : prev));

  return (
    <>
      <AdminPageHeader
        title="GIS / MIS Management"
        subtitle="Manage plantation sites and KML overlays."
        action={<Button onClick={() => setEditing({ ...blank })} className="bg-accent hover:bg-accent/90 text-accent-foreground"><Plus className="h-4 w-4" /> Add Site</Button>}
      />

      {loading && <div className="text-sm text-muted-foreground">Loading…</div>}
      {!loading && sites.length === 0 && (
        <div className="text-sm text-muted-foreground bg-card border border-border rounded p-6 text-center">No sites yet.</div>
      )}

      <div className="space-y-6">
        {grouped.map(([district, subDivs]) => (
          <div key={district} className="bg-card border border-border rounded-md shadow-card">
            <div className="px-4 py-2 border-b border-border bg-surface font-semibold text-primary">
              {district}
            </div>
            <div className="divide-y divide-border">
              {subDivs.map(([sd, ranges]) => (
                <div key={sd} className="p-3">
                  <div className="text-sm font-semibold text-foreground mb-2">Sub-Division: <span className="text-primary">{sd}</span></div>
                  <div className="space-y-3 pl-3 border-l-2 border-accent/40">
                    {ranges.map(([rg, list]) => (
                      <div key={rg}>
                        <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">Range: {rg}</div>
                        <ul className="divide-y divide-border rounded border border-border">
                          {list.map((s) => (
                            <li key={s.id} className="p-3">
                              <div className="flex items-start justify-between gap-3 flex-wrap">
                                <div className="min-w-0 flex-1">
                                  <div className="font-semibold text-foreground">{s.jfmc_name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    Sl. No. {s.sl_no ?? "—"} · Beat: {s.beat || "—"} · Area (Sanction): {s.area_sanction ?? "—"} · Area (KOBO): {s.area_kobo ?? "—"}
                                  </div>
                                  {(s.remarks || s.overlapping_area) && (
                                    <div className="text-xs text-muted-foreground mt-1">
                                      {s.remarks && <span>Remarks: {s.remarks}</span>}
                                      {s.remarks && s.overlapping_area && " · "}
                                      {s.overlapping_area && <span>Overlapping: {s.overlapping_area}</span>}
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-1">
                                  <button onClick={() => setEditing({
                                    id: s.id,
                                    sl_no: s.sl_no ?? null,
                                    district: s.district,
                                    sub_division: s.sub_division || "",
                                    range: s.range || "",
                                    beat: s.beat || "",
                                    jfmc_name: s.jfmc_name,
                                    area_sanction: s.area_sanction ?? null,
                                    area_kobo: s.area_kobo ?? null,
                                    remarks: s.remarks || "",
                                    overlapping_area: s.overlapping_area || "",
                                    display_order: s.display_order ?? 0,
                                    is_active: s.is_active ?? true,
                                  })} className="p-1.5 hover:bg-surface rounded text-primary" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
                                  <button onClick={() => onDelete(s.id)} className="p-1.5 hover:bg-surface rounded text-destructive" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                                </div>
                              </div>

                              <div className="mt-3 border-t border-border pt-3">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="text-xs font-semibold text-primary flex items-center gap-1"><FileText className="h-3.5 w-3.5" /> KML Files ({s.kml_files?.length ?? 0})</div>
                                  <label className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded border border-border hover:bg-surface cursor-pointer">
                                    <Upload className="h-3.5 w-3.5" /> Upload KML
                                    <input
                                      ref={(el) => (fileInputs.current[s.id] = el)}
                                      type="file" accept=".kml" className="hidden"
                                      onChange={(e) => {
                                        const f = e.target.files?.[0];
                                        if (f) onUpload(s.id, f);
                                        e.target.value = "";
                                      }}
                                    />
                                  </label>
                                </div>
                                {(s.kml_files?.length ?? 0) === 0 ? (
                                  <div className="text-xs text-muted-foreground">No KML files</div>
                                ) : (
                                  <ul className="space-y-1">
                                    {s.kml_files!.map((k) => (
                                      <li key={k.id} className="flex items-center justify-between text-xs bg-surface rounded px-2 py-1.5">
                                        <span className="truncate">{k.file_name} {k.file_size != null && <span className="text-muted-foreground">({formatKmlSize(k.file_size)})</span>}</span>
                                        <button onClick={() => onDeleteKml(k.id)} className="p-1 hover:bg-card rounded text-destructive" aria-label="Delete KML"><Trash2 className="h-3.5 w-3.5" /></button>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-card rounded-lg shadow-elevated max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <h3 className="font-semibold text-primary">{editing.id ? "Edit" : "Add"} Site</h3>
              <button onClick={() => setEditing(null)} className="p-1 hover:bg-surface rounded"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={onSubmit} className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Sl. No.</Label>
                <Input type="number" value={editing.sl_no ?? ""} onChange={(e) => setField("sl_no", e.target.value === "" ? null : Number(e.target.value))} className="mt-1" />
              </div>
              <div>
                <Label>District</Label>
                <select value={editing.district} onChange={(e) => setField("district", e.target.value)} className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm" required>
                  <option value="">Select</option>
                  {TRIPURA_DISTRICTS.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <Label>Sub-Division</Label>
                <Input value={editing.sub_division || ""} onChange={(e) => setField("sub_division", e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Range</Label>
                <Input value={editing.range || ""} onChange={(e) => setField("range", e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Beat</Label>
                <Input value={editing.beat || ""} onChange={(e) => setField("beat", e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>JFMC Name *</Label>
                <Input value={editing.jfmc_name} onChange={(e) => setField("jfmc_name", e.target.value)} className="mt-1" required />
              </div>
              <div>
                <Label>Area (Sanction)</Label>
                <Input type="number" step="any" value={editing.area_sanction ?? ""} onChange={(e) => setField("area_sanction", e.target.value === "" ? null : Number(e.target.value))} className="mt-1" />
              </div>
              <div>
                <Label>Area (KOBO)</Label>
                <Input type="number" step="any" value={editing.area_kobo ?? ""} onChange={(e) => setField("area_kobo", e.target.value === "" ? null : Number(e.target.value))} className="mt-1" />
              </div>
              <div className="md:col-span-2">
                <Label>Remarks</Label>
                <Input value={editing.remarks || ""} onChange={(e) => setField("remarks", e.target.value)} className="mt-1" />
              </div>
              <div className="md:col-span-2">
                <Label>Overlapping Area</Label>
                <Input value={editing.overlapping_area || ""} onChange={(e) => setField("overlapping_area", e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Display Order</Label>
                <Input type="number" value={editing.display_order ?? 0} onChange={(e) => setField("display_order", Number(e.target.value))} className="mt-1" />
              </div>
              <div className="flex items-center gap-2 mt-6">
                <input id="is_active" type="checkbox" checked={editing.is_active ?? true} onChange={(e) => setField("is_active", e.target.checked)} />
                <Label htmlFor="is_active" className="cursor-pointer">Is Active</Label>
              </div>
              <div className="md:col-span-2 flex justify-end gap-2 border-t border-border pt-3">
                <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary-dark">Save Site</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
