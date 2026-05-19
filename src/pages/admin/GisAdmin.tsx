import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Pencil, Trash2, X, Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { AdminPageHeader } from "./AdminLayout";
import {
  fetchGisSitesAdmin, createGisSite, updateGisSite, deleteGisSite,
  uploadKml, deleteKml, formatKmlSize, TRIPURA_DISTRICTS, GisSite, GisSitePayload,
} from "@/lib/gis";

const blank: GisSitePayload = {
  name: "", district: "", year: new Date().getFullYear(),
  area_covered: "", species_products: "", description: "",
};

export default function GisAdmin() {
  const [sites, setSites] = useState<GisSite[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<(GisSitePayload & { id?: string }) | null>(null);
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

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

  const grouped = useMemo(() => {
    const map = new Map<number, GisSite[]>();
    sites.forEach((s) => {
      const arr = map.get(s.year) || [];
      arr.push(s);
      map.set(s.year, arr);
    });
    return Array.from(map.entries()).sort((a, b) => b[0] - a[0]);
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
        {grouped.map(([yr, list]) => (
          <div key={yr} className="bg-card border border-border rounded-md shadow-card">
            <div className="px-4 py-2 border-b border-border bg-surface font-semibold text-primary">Year {yr} <span className="text-xs text-muted-foreground font-normal">({list.length})</span></div>
            <ul className="divide-y divide-border">
              {list.map((s) => (
                <li key={s.id} className="p-4">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-foreground">{s.name}</div>
                      <div className="text-xs text-muted-foreground">{s.district} · {s.area_covered || "—"} · {s.species_products || "—"}</div>
                      {s.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{s.description}</p>}
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setEditing({
                        id: s.id, name: s.name, district: s.district, year: s.year,
                        area_covered: s.area_covered || "", species_products: s.species_products || "", description: s.description || "",
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

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-card rounded-lg shadow-elevated max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <h3 className="font-semibold text-primary">{editing.id ? "Edit" : "Add"} Site</h3>
              <button onClick={() => setEditing(null)} className="p-1 hover:bg-surface rounded"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={onSubmit} className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label>Name</Label>
                <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="mt-1" required />
              </div>
              <div>
                <Label>District</Label>
                <select value={editing.district} onChange={(e) => setEditing({ ...editing, district: e.target.value })} className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm" required>
                  <option value="">Select</option>
                  {TRIPURA_DISTRICTS.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <Label>Year</Label>
                <Input type="number" value={editing.year} onChange={(e) => setEditing({ ...editing, year: Number(e.target.value) })} className="mt-1" required />
              </div>
              <div>
                <Label>Area Covered</Label>
                <Input value={editing.area_covered || ""} onChange={(e) => setEditing({ ...editing, area_covered: e.target.value })} className="mt-1" placeholder="e.g. 130 hectares" />
              </div>
              <div>
                <Label>Species / Products</Label>
                <Input value={editing.species_products || ""} onChange={(e) => setEditing({ ...editing, species_products: e.target.value })} className="mt-1" placeholder="e.g. Mehogoni, Teak" />
              </div>
              <div className="md:col-span-2">
                <Label>Description</Label>
                <Textarea value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="mt-1" rows={4} />
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
