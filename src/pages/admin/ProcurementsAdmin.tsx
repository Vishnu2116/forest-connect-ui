import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Upload, X, Loader2, ExternalLink, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fetchAdmin, AdminApiError } from "@/lib/api";
import { AdminPageHeader } from "./AdminLayout";

type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  display_order?: number;
  is_active?: boolean;
};

type ProcDoc = {
  id?: number;
  file_id: number;
  document_title?: string;
  document_type?: string;
  language?: string;
  is_downloadable?: boolean;
  display_order?: number;
  file_url?: string;
  original_name?: string;
  mime_type?: string;
  file_size?: number;
};

type Procurement = {
  id: string;
  category_id: string;
  category_name?: string;
  category_slug?: string;
  title: string;
  slug?: string;
  reference_number?: string | null;
  short_description?: string | null;
  description?: string | null;
  published_date?: string | null;
  deadline_date?: string | null;
  deadline_time?: string | null;
  procurement_status?: string;
  status?: "draft" | "published" | "archived";
  year?: number | null;
  show_in_whats_new?: boolean;
  is_featured?: boolean;
  display_order?: number;
  documents?: ProcDoc[];
};

type FormState = {
  category_id: string;
  title: string;
  reference_number: string;
  short_description: string;
  description: string;
  published_date: string;
  deadline_date: string;
  deadline_time: string;
  procurement_status: "open" | "closing_soon" | "closed" | "cancelled" | "awarded";
  status: "draft" | "published" | "archived";
  year: string;
  show_in_whats_new: boolean;
  is_featured: boolean;
  display_order: string;
  document: ProcDoc | null;
};

const emptyForm = (categoryId = ""): FormState => ({
  category_id: categoryId,
  title: "",
  reference_number: "",
  short_description: "",
  description: "",
  published_date: new Date().toISOString().slice(0, 10),
  deadline_date: "",
  deadline_time: "",
  procurement_status: "open",
  status: "published",
  year: String(new Date().getFullYear()),
  show_in_whats_new: false,
  is_featured: false,
  display_order: "1",
  document: null,
});

export default function ProcurementsAdmin() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Procurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterProcStatus, setFilterProcStatus] = useState<string>("");
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const reload = async () => {
    setLoading(true);
    setError(null);
    try {
      const cats = await fetchAdmin<Category[]>("/api/admin/procurements/categories");
      setCategories(cats || []);
      const params = new URLSearchParams();
      if (filterCat) params.set("category_id", filterCat);
      if (filterStatus) params.set("status", filterStatus);
      if (filterProcStatus) params.set("procurement_status", filterProcStatus);
      if (search) params.set("search", search);
      params.set("limit", "100");
      const res = await fetchAdmin<{ items: Procurement[] }>(
        `/api/admin/procurements?${params.toString()}`
      );
      setItems(res.items || []);
    } catch (e) {
      setError(e instanceof AdminApiError ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { reload(); /* eslint-disable-next-line */ }, []);

  const startCreate = () => {
    setForm(emptyForm(categories[0]?.id || ""));
    setEditingId("new");
  };

  const startEdit = async (id: string) => {
    setEditingId(id);
    try {
      const item = await fetchAdmin<Procurement>(`/api/admin/procurements/${id}`);
      const doc = item.documents?.[0] || null;
      setForm({
        category_id: String(item.category_id),
        title: item.title || "",
        reference_number: item.reference_number || "",
        short_description: item.short_description || "",
        description: item.description || "",
        published_date: item.published_date ? item.published_date.slice(0, 10) : "",
        deadline_date: item.deadline_date ? item.deadline_date.slice(0, 10) : "",
        deadline_time: item.deadline_time || "",
        procurement_status: (item.procurement_status as any) || "open",
        status: (item.status as any) || "published",
        year: item.year ? String(item.year) : "",
        show_in_whats_new: !!item.show_in_whats_new,
        is_featured: !!item.is_featured,
        display_order: String(item.display_order ?? 1),
        document: doc
          ? {
              file_id: Number(doc.file_id),
              document_title: doc.document_title || "Main Document",
              document_type: doc.document_type || "main",
              language: doc.language || "en",
              is_downloadable: doc.is_downloadable ?? true,
              display_order: doc.display_order ?? 1,
              file_url: doc.file_url,
              original_name: doc.original_name,
            }
          : null,
      });
    } catch (e) {
      setError(e instanceof AdminApiError ? e.message : "Failed to load item");
      setEditingId(null);
    }
  };

  const onUploadFile = async (file: File) => {
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) { alert("Only PDF files are allowed for procurement documents."); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("category", "procurement");
      fd.append("alt_text", form.title || "Procurement Document");
      const data = await fetchAdmin<any>("/api/admin/uploads", { method: "POST", body: fd });
      setForm((f) => ({
        ...f,
        document: {
          file_id: Number(data.id),
          document_title: f.document?.document_title || "Main Document",
          document_type: f.document?.document_type || "main",
          language: f.document?.language || "en",
          is_downloadable: f.document?.is_downloadable ?? true,
          display_order: 1,
          file_url: data.file_url,
          original_name: data.original_name,
        },
      }));
    } catch (e) {
      alert(e instanceof AdminApiError ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (!form.title.trim() || !form.category_id) {
      alert("Title and category are required.");
      return;
    }
    setSaving(true);
    try {
      const payload: any = {
        category_id: Number(form.category_id),
        title: form.title.trim(),
        reference_number: form.reference_number || null,
        short_description: form.short_description || null,
        description: form.description || null,
        published_date: form.published_date || null,
        deadline_date: form.deadline_date || null,
        deadline_time: form.deadline_time || null,
        procurement_status: form.procurement_status,
        status: form.status,
        year: form.year ? Number(form.year) : null,
        show_in_whats_new: form.show_in_whats_new,
        is_featured: form.is_featured,
        display_order: Number(form.display_order) || 1,
      };
      if (form.document?.file_id) {
        payload.documents = [{
          file_id: Number(form.document.file_id),
          document_title: form.document.document_title || "Main Document",
          document_type: form.document.document_type || "main",
          language: form.document.language || "en",
          is_downloadable: form.document.is_downloadable ?? true,
          display_order: form.document.display_order ?? 1,
        }];
      }
      if (editingId === "new") {
        await fetchAdmin("/api/admin/procurements", { method: "POST", body: JSON.stringify(payload) });
      } else if (editingId) {
        await fetchAdmin(`/api/admin/procurements/${editingId}`, { method: "PUT", body: JSON.stringify(payload) });
      }
      setEditingId(null);
      await reload();
    } catch (e) {
      alert(e instanceof AdminApiError ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this procurement? This cannot be undone.")) return;
    try {
      await fetchAdmin(`/api/admin/procurements/${id}`, { method: "DELETE" });
      await reload();
    } catch (e) {
      alert(e instanceof AdminApiError ? e.message : "Delete failed");
    }
  };

  const docTypes = ["main","corrigendum","addendum","boq","result","award_notice","other"];

  return (
    <>
      <AdminPageHeader
        title="Procurements"
        subtitle="Manage RFPs, Tenders, Corrigendum and Award Notices."
        action={
          <Button onClick={startCreate} className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Plus className="h-4 w-4" /> Add New
          </Button>
        }
      />

      {error && (
        <div className="mb-4 text-sm bg-destructive/10 text-destructive border border-destructive/30 rounded px-3 py-2">{error}</div>
      )}

      <div className="bg-card border border-border rounded-md">
        <div className="p-3 border-b border-border flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && reload()} placeholder="Search title…" className="pl-8 h-9" />
          </div>
          <select className="border border-input rounded px-2 py-1.5 text-sm bg-card h-9" value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select className="border border-input rounded px-2 py-1.5 text-sm bg-card h-9" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <select className="border border-input rounded px-2 py-1.5 text-sm bg-card h-9" value={filterProcStatus} onChange={(e) => setFilterProcStatus(e.target.value)}>
            <option value="">All Proc. Status</option>
            <option value="open">Open</option>
            <option value="closing_soon">Closing Soon</option>
            <option value="closed">Closed</option>
            <option value="cancelled">Cancelled</option>
            <option value="awarded">Awarded</option>
          </select>
          <Button variant="outline" size="sm" onClick={reload}>Apply</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3 py-2">#</th>
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2">Ref. No.</th>
                <th className="px-3 py-2">Published</th>
                <th className="px-3 py-2">Deadline</th>
                <th className="px-3 py-2">Proc. Status</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">File</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={10} className="px-3 py-6 text-center text-muted-foreground"><Loader2 className="inline h-4 w-4 animate-spin" /> Loading…</td></tr>
              )}
              {!loading && items.length === 0 && (
                <tr><td colSpan={10} className="px-3 py-6 text-center text-muted-foreground">No procurements yet.</td></tr>
              )}
              {items.map((it, idx) => {
                const doc = it.documents?.[0];
                return (
                  <tr key={it.id} className="border-t border-border">
                    <td className="px-3 py-2">{idx + 1}</td>
                    <td className="px-3 py-2">{it.category_name}</td>
                    <td className="px-3 py-2 font-medium">{it.title}</td>
                    <td className="px-3 py-2">{it.reference_number || "—"}</td>
                    <td className="px-3 py-2">{it.published_date ? new Date(it.published_date).toLocaleDateString() : "—"}</td>
                    <td className="px-3 py-2">{it.deadline_date ? new Date(it.deadline_date).toLocaleDateString() : "—"}</td>
                    <td className="px-3 py-2"><span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary">{it.procurement_status}</span></td>
                    <td className="px-3 py-2">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        it.status === "published" ? "bg-success/10 text-success" :
                        it.status === "draft" ? "bg-accent/10 text-accent" :
                        "bg-muted text-muted-foreground"
                      }`}>{it.status}</span>
                    </td>
                    <td className="px-3 py-2">
                      {doc?.file_url ? (
                        <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                          PDF <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : "—"}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button className="p-1.5 text-primary hover:bg-primary/10 rounded" onClick={() => startEdit(it.id)} aria-label="Edit"><Pencil className="h-4 w-4" /></button>
                      <button className="p-1.5 text-destructive hover:bg-destructive/10 rounded" onClick={() => remove(it.id)} aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {editingId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => !saving && setEditingId(null)}>
          <div className="bg-card rounded-md w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card">
              <h3 className="font-semibold text-primary">{editingId === "new" ? "Create" : "Edit"} Procurement</h3>
              <button onClick={() => setEditingId(null)} disabled={saving} aria-label="Close" className="p-1 hover:bg-muted rounded"><X className="h-4 w-4" /></button>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label>Category *</Label>
                <select className="mt-1 w-full border border-input rounded px-3 py-2 text-sm bg-card" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <Label>Title *</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-1" />
              </div>
              <div className="md:col-span-2">
                <Label>Reference Number</Label>
                <Input value={form.reference_number} onChange={(e) => setForm({ ...form, reference_number: e.target.value })} className="mt-1" placeholder="ELEMENT/RFP/2026/001" />
              </div>
              <div className="md:col-span-2">
                <Label>Short Description</Label>
                <Textarea rows={2} value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} className="mt-1" />
              </div>
              <div className="md:col-span-2">
                <Label>Description</Label>
                <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label>Published Date</Label>
                <Input type="date" value={form.published_date} onChange={(e) => setForm({ ...form, published_date: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label>Deadline Date</Label>
                <Input type="date" value={form.deadline_date} onChange={(e) => setForm({ ...form, deadline_date: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label>Deadline Time</Label>
                <Input value={form.deadline_time} onChange={(e) => setForm({ ...form, deadline_time: e.target.value })} className="mt-1" placeholder="05:00 PM" />
              </div>
              <div>
                <Label>Year</Label>
                <Input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label>Procurement Status</Label>
                <select className="mt-1 w-full border border-input rounded px-3 py-2 text-sm bg-card" value={form.procurement_status} onChange={(e) => setForm({ ...form, procurement_status: e.target.value as any })}>
                  <option value="open">Open</option>
                  <option value="closing_soon">Closing Soon</option>
                  <option value="closed">Closed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="awarded">Awarded</option>
                </select>
              </div>
              <div>
                <Label>Publish Status</Label>
                <select className="mt-1 w-full border border-input rounded px-3 py-2 text-sm bg-card" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div>
                <Label>Display Order</Label>
                <Input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: e.target.value })} className="mt-1" />
              </div>
              <div className="flex items-end gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} /> Featured
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.show_in_whats_new} onChange={(e) => setForm({ ...form, show_in_whats_new: e.target.checked })} /> What's New
                </label>
              </div>

              <div className="md:col-span-2 border border-dashed border-border rounded p-3 bg-surface">
                <Label className="flex items-center gap-2"><Upload className="h-4 w-4" /> Document File (PDF only)</Label>
                <input type="file" accept="application/pdf,.pdf" className="mt-2 text-xs" onChange={(e) => e.target.files?.[0] && onUploadFile(e.target.files[0])} disabled={uploading} />
                <p className="text-[11px] text-muted-foreground mt-1">Only PDF files are allowed for procurement uploads.</p>
                {uploading && <p className="text-xs mt-1"><Loader2 className="inline h-3 w-3 animate-spin" /> Uploading…</p>}
                {form.document?.file_url && (
                  <div className="mt-2 text-xs flex items-center gap-2">
                    <a className="text-primary hover:underline" href={form.document.file_url} target="_blank" rel="noopener noreferrer">{form.document.original_name || "View document"}</a>
                    <button className="text-destructive" onClick={() => setForm({ ...form, document: null })}>Remove</button>
                  </div>
                )}
                {form.document && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3">
                    <div>
                      <Label className="text-xs">Document Title</Label>
                      <Input className="mt-1 h-8 text-xs" value={form.document.document_title || ""} onChange={(e) => setForm({ ...form, document: { ...form.document!, document_title: e.target.value } })} />
                    </div>
                    <div>
                      <Label className="text-xs">Type</Label>
                      <select className="mt-1 w-full border border-input rounded px-2 py-1 text-xs bg-card h-8" value={form.document.document_type || "main"} onChange={(e) => setForm({ ...form, document: { ...form.document!, document_type: e.target.value } })}>
                        {docTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <Label className="text-xs">Language</Label>
                      <select className="mt-1 w-full border border-input rounded px-2 py-1 text-xs bg-card h-8" value={form.document.language || "en"} onChange={(e) => setForm({ ...form, document: { ...form.document!, language: e.target.value } })}>
                        <option value="en">English</option>
                        <option value="bn">Bengali</option>
                        <option value="kok">Kokborok</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-border flex justify-end gap-2 sticky bottom-0 bg-card">
              <Button variant="outline" onClick={() => setEditingId(null)} disabled={saving}>Cancel</Button>
              <Button onClick={save} disabled={saving} className="bg-accent text-accent-foreground hover:bg-accent/90">
                {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : "Save"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
