import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AdminPageHeader } from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Pencil, Trash2, Upload, X, FileText, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import {
  KH_TYPES, type KHType, type ApiKHItem,
  fetchKHAdmin, createKHAdmin, updateKHAdmin, deleteKHAdmin,
  formatMonthYear, formatSizeMB, resolveUrl, typeLabel,
} from "@/lib/knowledgeHub";

interface FormState {
  id: string | null;
  title: string;
  type: KHType;
  description: string;
  language: string;
  published_date: string;
  file: File | null;
  thumbnail: File | null;
  existing_file_path: string | null;
  existing_thumbnail_path: string | null;
}

function emptyForm(): FormState {
  return {
    id: null,
    title: "",
    type: "publication",
    description: "",
    language: "English",
    published_date: "",
    file: null,
    thumbnail: null,
    existing_file_path: null,
    existing_thumbnail_path: null,
  };
}

export default function KnowledgeHubAdmin() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlType = searchParams.get("type") as KHType | null;
  const [items, setItems] = useState<ApiKHItem[]>([]);
  const [typeFilter, setTypeFilter] = useState<KHType | "all">(urlType || "all");

  useEffect(() => {
    setTypeFilter(urlType || "all");
  }, [urlType]);

  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchKHAdmin(typeFilter);
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
  const openEdit = (i: ApiKHItem) => setEditing({
    id: i.id,
    title: i.title || "",
    type: (i.type as KHType) || "publication",
    description: i.description || "",
    language: i.language || "English",
    published_date: (i.published_date || "").slice(0, 10),
    file: null,
    thumbnail: null,
    existing_file_path: i.file_path || null,
    existing_thumbnail_path: i.thumbnail_path || null,
  });

  const remove = async (i: ApiKHItem) => {
    if (!confirm(`Delete "${i.title}"?`)) return;
    try {
      await deleteKHAdmin(i.id);
      toast.success("Deleted");
      await load();
    } catch (e: any) {
      toast.error(`Failed to delete: ${e?.message || "error"}`);
    }
  };

  const save = async () => {
    if (!editing) return;
    if (!editing.title.trim()) { toast.error("Title is required"); return; }
    if (!editing.id && !editing.file) { toast.error("PDF file is required"); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", editing.title);
      fd.append("type", editing.type);
      if (editing.description) fd.append("description", editing.description);
      if (editing.language) fd.append("language", editing.language);
      if (editing.published_date) fd.append("published_date", editing.published_date);
      if (editing.file) fd.append("file", editing.file);
      if (editing.thumbnail) fd.append("thumbnail", editing.thumbnail);
      if (editing.id) await updateKHAdmin(editing.id, fd);
      else await createKHAdmin(fd);
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
        title="Knowledge Hub"
        subtitle="Manage publications, reports, IEC materials, newsletters, notifications and more."
        action={
          <div className="flex items-center gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="h-10 px-2 border border-input rounded text-sm bg-background"
            >
              <option value="all">All Types</option>
              {KH_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <Button onClick={openCreate} className="gap-1.5"><Plus className="h-4 w-4" /> Add Document</Button>
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
              <th className="py-2 px-3">Date</th>
              <th className="py-2 px-3">File</th>
              <th className="py-2 px-3 w-28">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id} className="border-t border-border align-top">
                <td className="py-2 px-3 font-semibold">{i.title}</td>
                <td className="py-2 px-3 text-muted-foreground">{typeLabel(i.type)}</td>
                <td className="py-2 px-3 text-muted-foreground">{formatMonthYear(i.published_date)}</td>
                <td className="py-2 px-3 text-muted-foreground">
                  {i.file_type || "PDF"} · {formatSizeMB(i.file_size)}
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
              <tr><td colSpan={5} className="text-center text-muted-foreground py-6">No documents yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <Editor
          form={editing}
          setForm={setEditing}
          onSave={save}
          onCancel={() => setEditing(null)}
          saving={saving}
        />
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
  const thumbRef = useRef<HTMLInputElement>(null);
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm({ ...form, [k]: v });

  const showThumbnail = form.type !== "publication" && form.type !== "report";
  const thumbSrc = form.thumbnail ? URL.createObjectURL(form.thumbnail) : resolveUrl(form.existing_thumbnail_path);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center p-4 overflow-y-auto" onClick={onCancel}>
      <div className="bg-card rounded-xl shadow-elevated w-full max-w-2xl my-8 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-primary">{form.id ? "Edit Document" : "New Document"}</h3>
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
                onChange={(e) => set("type", e.target.value as KHType)}
                className="w-full border border-input rounded h-10 px-2 text-sm bg-background"
              >
                {KH_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </Field>
            <Field label="Language">
              <Input value={form.language} onChange={(e) => set("language", e.target.value)} />
            </Field>
          </div>

          <Field label="Published date">
            <Input type="date" value={form.published_date} onChange={(e) => set("published_date", e.target.value)} />
          </Field>

          <Field label="Description">
            <Textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} />
          </Field>

          <Field label={`PDF File ${form.id ? "" : "*"}`}>
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
            </div>
          </Field>

          {showThumbnail && (
            <Field label="Thumbnail (optional)">
              <input
                ref={thumbRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => set("thumbnail", e.target.files?.[0] ?? null)}
              />
              <div className="flex items-center gap-3">
                <div
                  onClick={() => thumbRef.current?.click()}
                  className="h-20 w-28 rounded-md border border-dashed border-border bg-surface flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary/40"
                >
                  {thumbSrc
                    ? <img src={thumbSrc} alt="Thumbnail" className="h-full w-full object-cover" />
                    : <ImageIcon className="h-5 w-5 text-muted-foreground" />}
                </div>
                <Button size="sm" variant="outline" type="button" onClick={() => thumbRef.current?.click()} className="gap-1">
                  <Upload className="h-3 w-3" /> {thumbSrc ? "Replace" : "Upload"}
                </Button>
              </div>
            </Field>
          )}
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
