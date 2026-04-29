import { useMemo, useState, ReactNode } from "react";
import { Plus, Pencil, Trash2, Eye, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AdminPageHeader } from "./AdminLayout";

export type FieldType = "text" | "textarea" | "date" | "select" | "file" | "number";
export interface Field {
  key: string;
  label: string;
  type?: FieldType;
  options?: string[];
  required?: boolean;
}

interface Props {
  title: string;
  subtitle?: string;
  fields: Field[];
  initial: any[];
  columns?: string[]; // keys to show in table; defaults to first 4 fields
  searchKeys?: string[];
}

export default function CrudModule({ title, subtitle, fields, initial, columns, searchKeys }: Props) {
  const [rows, setRows] = useState<any[]>(initial.map((r, i) => ({ id: r.id ?? i + 1, ...r })));
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<any | null>(null); // object or null
  const [viewing, setViewing] = useState<any | null>(null);
  const [isNew, setIsNew] = useState(false);

  const tableCols = columns ?? fields.slice(0, 4).map((f) => f.key);
  const skeys = searchKeys ?? fields.map((f) => f.key);

  const filtered = useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.toLowerCase();
    return rows.filter((r) => skeys.some((k) => String(r[k] ?? "").toLowerCase().includes(q)));
  }, [rows, query, skeys]);

  const openNew = () => {
    const blank: any = { id: Date.now() };
    fields.forEach((f) => (blank[f.key] = ""));
    setEditing(blank);
    setIsNew(true);
  };
  const openEdit = (r: any) => { setEditing({ ...r }); setIsNew(false); };
  const remove = (id: number) => { if (confirm("Delete this record?")) setRows((p) => p.filter((r) => r.id !== id)); };
  const save = () => {
    if (!editing) return;
    setRows((p) => isNew ? [editing, ...p] : p.map((r) => (r.id === editing.id ? editing : r)));
    setEditing(null);
  };

  return (
    <>
      <AdminPageHeader
        title={title}
        subtitle={subtitle}
        action={
          <Button onClick={openNew} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Plus className="h-4 w-4" /> Add New
          </Button>
        }
      />

      <div className="bg-card border border-border rounded-md p-3 mb-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search records..." className="pl-9" />
        </div>
        <div className="text-sm text-muted-foreground">{filtered.length} records</div>
      </div>

      <div className="overflow-x-auto rounded-md border border-border bg-card shadow-card">
        <table className="data-table">
          <thead>
            <tr>
              {tableCols.map((k) => {
                const f = fields.find((x) => x.key === k);
                return <th key={k}>{f?.label ?? k}</th>;
              })}
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={tableCols.length + 1} className="text-center text-muted-foreground py-6">No records found</td></tr>
            )}
            {filtered.map((r) => (
              <tr key={r.id}>
                {tableCols.map((k) => (
                  <td key={k} className="max-w-[260px] truncate">{String(r[k] ?? "—")}</td>
                ))}
                <td className="text-right whitespace-nowrap">
                  <button onClick={() => setViewing(r)} className="p-1.5 hover:bg-surface rounded text-primary" aria-label="View"><Eye className="h-4 w-4" /></button>
                  <button onClick={() => openEdit(r)} className="p-1.5 hover:bg-surface rounded text-primary" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => remove(r.id)} className="p-1.5 hover:bg-surface rounded text-destructive" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit modal */}
      {editing && (
        <Modal title={isNew ? `Add ${title}` : `Edit ${title}`} onClose={() => setEditing(null)}>
          <form onSubmit={(e) => { e.preventDefault(); save(); }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((f) => (
              <div key={f.key} className={f.type === "textarea" ? "md:col-span-2" : ""}>
                <Label htmlFor={f.key}>{f.label}{f.required && <span className="text-destructive"> *</span>}</Label>
                <FieldInput field={f} value={editing[f.key]} onChange={(v) => setEditing({ ...editing, [f.key]: v })} />
              </div>
            ))}
            <div className="md:col-span-2 flex justify-end gap-2 pt-2 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
              <Button type="submit" className="bg-primary hover:bg-primary-dark text-primary-foreground">Save</Button>
            </div>
          </form>
        </Modal>
      )}

      {viewing && (
        <Modal title={`View ${title}`} onClose={() => setViewing(null)}>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {fields.map((f) => (
              <div key={f.key} className={f.type === "textarea" ? "md:col-span-2" : ""}>
                <dt className="text-xs text-muted-foreground">{f.label}</dt>
                <dd className="font-medium text-foreground break-words">{String(viewing[f.key] ?? "—")}</dd>
              </div>
            ))}
          </dl>
          <div className="flex justify-end pt-4 border-t border-border mt-4">
            <Button variant="outline" onClick={() => setViewing(null)}>Close</Button>
          </div>
        </Modal>
      )}
    </>
  );
}

function FieldInput({ field, value, onChange }: { field: Field; value: any; onChange: (v: any) => void }) {
  const id = field.key;
  if (field.type === "textarea") return <Textarea id={id} value={value ?? ""} onChange={(e) => onChange(e.target.value)} rows={4} className="mt-1" />;
  if (field.type === "select") return (
    <select id={id} value={value ?? ""} onChange={(e) => onChange(e.target.value)} className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
      <option value="">Select...</option>
      {field.options?.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
  if (field.type === "file") return (
    <div className="mt-1 border border-dashed border-border rounded-md p-3 text-xs text-muted-foreground bg-surface">
      <input type="file" id={id} className="block text-sm" />
      <p className="mt-1">Upload placeholder (no actual upload).</p>
    </div>
  );
  return <Input id={id} type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"} value={value ?? ""} onChange={(e) => onChange(e.target.value)} className="mt-1" />;
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-lg shadow-elevated max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-border px-5 py-3 sticky top-0 bg-card">
          <h3 className="font-semibold text-primary">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-surface rounded" aria-label="Close"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
