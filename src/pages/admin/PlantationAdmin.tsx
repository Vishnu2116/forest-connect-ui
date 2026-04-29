import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Eye, Search, X, Upload, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdminPageHeader } from "./AdminLayout";

const districts = ["West Tripura","Sepahijala","Khowai","Gomati","South Tripura","Dhalai","Unakoti","North Tripura"];
const types = ["Mixed Species","Bamboo","Teak","Sal","Rubber","Agroforestry"];
const years = ["2022","2023","2024","2025","2026"];

interface Plant { id: number; district: string; year: string; locationName: string; type: string; area: number; saplings: number; }

const seed: Plant[] = [
  { id: 1, district: "Sepahijala", year: "2025", locationName: "Bishalgarh Range Block-3", type: "Mixed Species", area: 45, saplings: 18000 },
  { id: 2, district: "Khowai", year: "2025", locationName: "Teliamura RF", type: "Bamboo", area: 60, saplings: 24000 },
  { id: 3, district: "Dhalai", year: "2024", locationName: "Manu Block", type: "Sal", area: 80, saplings: 32000 },
  { id: 4, district: "Gomati", year: "2026", locationName: "Amarpur RF", type: "Mixed Species", area: 35, saplings: 14000 },
];

export default function PlantationAdmin() {
  const [rows, setRows] = useState<Plant[]>(seed);
  const [district, setDistrict] = useState("");
  const [year, setYear] = useState("");
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Plant | null>(null);
  const [isNew, setIsNew] = useState(false);

  const filtered = useMemo(() => rows.filter((r) =>
    (!district || r.district === district) &&
    (!year || r.year === year) &&
    (!q || r.locationName.toLowerCase().includes(q.toLowerCase()))
  ), [rows, district, year, q]);

  const blank: Plant = { id: Date.now(), district: "", year: "", locationName: "", type: "", area: 0, saplings: 0 };

  return (
    <>
      <AdminPageHeader
        title="Plantation Module"
        subtitle="Manage plantation records by district and year."
        action={<Button onClick={() => { setEditing(blank); setIsNew(true); }} className="bg-accent hover:bg-accent/90 text-accent-foreground"><Plus className="h-4 w-4" /> Add Plantation</Button>}
      />

      <div className="bg-card border border-border rounded-md p-4 mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        <div>
          <Label className="text-xs">District</Label>
          <select value={district} onChange={(e) => setDistrict(e.target.value)} className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
            <option value="">All Districts</option>
            {districts.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <Label className="text-xs">Year</Label>
          <select value={year} onChange={(e) => setYear(e.target.value)} className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
            <option value="">All Years</option>
            {years.map((y) => <option key={y}>{y}</option>)}
          </select>
        </div>
        <div className="md:col-span-2">
          <Label className="text-xs">Search by location</Label>
          <div className="relative mt-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Location name..." className="pl-9" />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-md border border-border bg-card shadow-card">
        <table className="data-table">
          <thead>
            <tr><th>District</th><th>Year</th><th>Location</th><th>Type</th><th>Area (ha)</th><th>Saplings</th><th className="text-right">Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id}>
                <td>{r.district}</td><td>{r.year}</td><td>{r.locationName}</td><td>{r.type}</td>
                <td>{r.area}</td><td>{r.saplings.toLocaleString()}</td>
                <td className="text-right whitespace-nowrap">
                  <button onClick={() => { setEditing(r); setIsNew(false); }} className="p-1.5 hover:bg-surface rounded text-primary"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => { if (confirm("Delete?")) setRows((p) => p.filter((x) => x.id !== r.id)); }} className="p-1.5 hover:bg-surface rounded text-destructive"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={7} className="text-center text-muted-foreground py-6">No records</td></tr>}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-card rounded-lg shadow-elevated max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <h3 className="font-semibold text-primary">{isNew ? "Add" : "Edit"} Plantation Record</h3>
              <button onClick={() => setEditing(null)} className="p-1 hover:bg-surface rounded"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setRows((p) => isNew ? [editing, ...p] : p.map((r) => r.id === editing.id ? editing : r)); setEditing(null); }}
                  className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>District</Label>
                <select value={editing.district} onChange={(e) => setEditing({ ...editing, district: e.target.value })} className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                  <option value="">Select</option>{districts.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <Label>Year</Label>
                <select value={editing.year} onChange={(e) => setEditing({ ...editing, year: e.target.value })} className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                  <option value="">Select</option>{years.map((y) => <option key={y}>{y}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <Label>Location Name</Label>
                <Input value={editing.locationName} onChange={(e) => setEditing({ ...editing, locationName: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label>Plantation Type</Label>
                <select value={editing.type} onChange={(e) => setEditing({ ...editing, type: e.target.value })} className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                  <option value="">Select</option>{types.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <Label>Area (hectares)</Label>
                <Input type="number" value={editing.area} onChange={(e) => setEditing({ ...editing, area: Number(e.target.value) })} className="mt-1" />
              </div>
              <div>
                <Label>Number of Saplings</Label>
                <Input type="number" value={editing.saplings} onChange={(e) => setEditing({ ...editing, saplings: Number(e.target.value) })} className="mt-1" />
              </div>
              <div>
                <Label>KML / Boundary File</Label>
                <div className="mt-1 border border-dashed border-border rounded-md p-3 text-xs bg-surface flex items-center gap-2">
                  <Upload className="h-4 w-4 text-primary" />
                  <input type="file" accept=".kml,.kmz,.zip" className="text-xs" />
                </div>
              </div>
              <div className="md:col-span-2">
                <Label>Map Preview</Label>
                <div className="mt-1 h-40 rounded-md border border-border bg-surface flex items-center justify-center text-muted-foreground">
                  <Map className="h-5 w-5 mr-2" /> Map preview placeholder
                </div>
              </div>
              <div className="md:col-span-2 flex justify-end gap-2 border-t border-border pt-3">
                <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary-dark">Save Record</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
