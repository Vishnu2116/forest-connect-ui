import { useEffect, useRef, useState } from "react";
import { AdminPageHeader } from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Pencil, Trash2, Upload, X, FileText } from "lucide-react";
import { toast } from "sonner";
import {
  TYPE_OPTIONS, STATUS_OPTIONS, type ProcType, type ProcStatus, type ApiProcurement,
  fetchProcAdmin, createProcAdmin, updateProcAdmin, deleteProcAdmin,
  formatDate, formatSize, statusClass, statusLabel, typeLabel, resolveUrl,
} from "@/lib/procurements";

interface FormState {
  id: string | null;
  title: string;
  type: ProcType;
  published_date: string;
  deadline: string;
  status: ProcStatus;
  file: File | null;
  existing_file_path: string | null;
}

function emptyForm(): FormState {
  return {
    id: null, title: "", type: "tender",
    published_date: "", deadline: "", status: "open",
    file: null, existing_file_path: null,
  };
}

export default function ProcurementsAdmin() {
  const [items, setItems] = useState<ApiProcurement[]>([]);
  const [typeFilter, setTypeFilter] = useState<ProcType | "all">("all");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchProcAdmin(typeFilter);
      setItems(data);
    } catch (e: any) {
      toast.error(`Failed to load: ${e?.message || "request failed"}`);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [typeFilter]);

  const openCreate = () => setEditing(emptyForm());
  const openEdit = (i: ApiProcurement) => setEditing({
    id: i.id,
    title: i.title || "",
    type: (i.type as ProcType) || "tender",
    published_date: (i.published_date || "").slice(0, 10),
    deadline: (i.deadline || "").slice(0, 10),
    status: (i.status as ProcStatus) || "open",
    file: null,
    existing_file_path: i.file_path || null,
  });

  const remove = async (i: ApiProcurement) => {
    if (!confirm(`Delete "${i.title}"?`)) return;
    try {
      await deleteProcAdmin(i.id);
      toast.success("Deleted");
      await load();
    } catch (e: any) {
      toast.error(`Failed to delete: ${e?.message || "error"}`);
    }
  };

  const save = async () => {
    if (!editing) return;
    if (!editing.title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", editing.title.trim());
      fd.append("type", editing.type);
      if (editing.published_date) fd.append("published_date", editing.published_date);
      if (editing.deadline) fd.append("deadline", editing.deadline);
      fd.append("status", editing.status);
      if (editing.file) fd.append("file", editing.file, editing.file.name);

      if (editing.id) await updateProcAdmin(editing.id, fd);
      else await createProcAdmin(fd);
      toast.success(editing.id ? "Updated" : "Created");
      setEditing(null);
      await load();
    } catch (e: any) {
      toast.error(`Failed to save: ${e?.message || "error"}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <AdminPageHeader
        title="Procurements"
        subtitle="Manage tenders and RFPs."
        action={
          <div className="flex items-center gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as ProcType | "all")}
              className="h-10 px-2 border border-input rounded text-sm bg-background"
            >
              <option value="all">All Types</option>
              {TYPE_OPTIONS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <Button onClick={openCreate} className="gap-1.5"><Plus className="h-4 w-4" /> Add Procurement</Button>
          </div>
        }
      />

      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      )}

      <div className="overflow-x-auto rounded-md border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-surface">
            <tr className="text-left text-xs uppercase text-muted-foreground">
              <th className="py-2 px-3">Title</th>
              <th className="py-2 px-3">Type</th>
              <th className="py-2 px-3">Published</th>
              <th className="py-2 px-3">Deadline</th>
              <th className="py-2 px-3">Status</th>
              <th className="py-2 px-3 w-28">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id} className="border-t border-border align-top">
                <td className="py-2 px-3 font-semibold">{i.title}</td>
                <td className="py-2 px-3 text-muted-foreground">{typeLabel(i.type)}</td>
                <td className="py-2 px-3 text-muted-foreground">{formatDate(i.published_date)}</td>
                <td className="py-2 px-3 text-muted-foreground">{formatDate(i.deadline)}</td>
                <td className="py-2 px-3">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${statusClass(i.status)}`}>
                    {statusLabel(i.status)}
                  </span>
                </td>
                <td className="py-2 px-3">
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => openEdit(i)}><Pencil className="h-3 w-3" /></Button>
                    <Button size="sm" variant="outline" className="text-destructive" onClick={() => remove(i)}><Trash2 className="h-3 w-3" /></Button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && items.length === 0 && (
              <tr><td colSpan={6} className="text-center text-muted-foreground py-6">No procurements yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <Editor form={editing} setForm={setEditing} onSave={save} onCancel={() => setEditing(null)} saving={saving} />
      )}
    </>
  );
}

function Editor({
  form, setForm, onSave, onCancel, saving,
}: {
  form: FormState; setForm: (f: FormState) => void;
  onSave: () => void; onCancel: () => void; saving: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm({ ...form, [k]: v });

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center p-4 overflow-y-auto" onClick={onCancel}>
      <div className="bg-card rounded-xl shadow-elevated w-full max-w-2xl my-8 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-primary">{form.id ? "Edit Procurement" : "New Procurement"}</h3>
          <button onClick={onCancel} className="p-1 rounded hover:bg-surface"><X className="h-4 w-4" /></button>
        </div>

        <div className="space-y-3">
          <Field label="Title *">
            <Input value={form.title} onChange={(e) => set("title", e.target.value)} />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Type *">
              <select
                value={form.type}
                onChange={(e) => set("type", e.target.value as ProcType)}
                className="w-full border border-input rounded h-10 px-2 text-sm bg-background"
              >
                {TYPE_OPTIONS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value as ProcStatus)}
                className="w-full border border-input rounded h-10 px-2 text-sm bg-background"
              >
                {STATUS_OPTIONS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Published date">
              <Input type="date" value={form.published_date} onChange={(e) => set("published_date", e.target.value)} />
            </Field>
            <Field label="Deadline">
              <Input type="date" value={form.deadline} onChange={(e) => set("deadline", e.target.value)} />
            </Field>
          </div>

          <Field label="PDF File">
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={(e) => set("file", e.target.files?.[0] ?? null)}
            />
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" type="button" onClick={() => fileRef.current?.click()} className="gap-1">
                <Upload className="h-3 w-3" /> {form.file ? "Replace" : (form.existing_file_path ? "Replace file" : "Choose file")}
              </Button>
              <div className="text-xs text-muted-foreground flex items-center gap-1 min-w-0 truncate">
                <FileText className="h-3 w-3 shrink-0" />
                <span className="truncate">{form.file?.name || form.existing_file_path?.split("/").pop() || "No file selected"}</span>
              </div>
              {form.existing_file_path && (
                <a
                  href={resolveUrl(form.existing_file_path) || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-primary underline shrink-0"
                >View</a>
              )}
            </div>
          </Field>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <Button variant="outline" onClick={onCancel} disabled={saving}>Cancel</Button>
          <Button onClick={onSave} disabled={saving} className="gap-1.5">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save
          </Button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[11px] font-semibold text-muted-foreground uppercase block mb-1">{label}</label>
      {children}
    </div>
  );
}
