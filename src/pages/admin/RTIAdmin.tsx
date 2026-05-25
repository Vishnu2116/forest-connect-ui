import { useEffect, useRef, useState } from "react";
import { Loader2, Plus, Pencil, Trash2, Save, X, Upload, FileText } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { AdminPageHeader } from "./AdminLayout";
import {
  API_BASE_URL, USE_REAL_API,
  getAuthHeaders, getAuthJsonHeaders, handleApiResponse,
} from "@/config/api";

type OfficerType = "public_information_officer" | "first_appellate_officer";

interface Officer {
  id: string;
  officer_type: OfficerType;
  name: string;
  designation: string;
  address: string;
  phone: string;
  email: string;
  display_order: number;
}

interface RtiDocument {
  id: string;
  title: string;
  file_path: string;
  file_size: number;
  file_type: string;
  display_order: number;
}

const OFFICER_TYPE_LABEL: Record<OfficerType, string> = {
  public_information_officer: "Public Information Officer",
  first_appellate_officer: "First Appellate Officer",
};

const emptyOfficer = (): Omit<Officer, "id"> => ({
  officer_type: "public_information_officer",
  name: "",
  designation: "",
  address: "",
  phone: "",
  email: "",
  display_order: 0,
});

function formatSize(kb: number): string {
  if (!kb && kb !== 0) return "—";
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
}

export default function RTIAdmin() {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [docs, setDocs] = useState<RtiDocument[]>([]);
  const [loading, setLoading] = useState(false);

  // Officer form state
  const [officerOpen, setOfficerOpen] = useState(false);
  const [editingOfficerId, setEditingOfficerId] = useState<string | null>(null);
  const [officerForm, setOfficerForm] = useState<Omit<Officer, "id">>(emptyOfficer());
  const [savingOfficer, setSavingOfficer] = useState(false);

  // Document form state
  const [docOpen, setDocOpen] = useState(false);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [docTitle, setDocTitle] = useState("");
  const [docOrder, setDocOrder] = useState(0);
  const [docFile, setDocFile] = useState<File | null>(null);
  const [savingDoc, setSavingDoc] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const load = async () => {
    if (!USE_REAL_API) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/rti`, { headers: getAuthHeaders() });
      await handleApiResponse(res);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setOfficers(Array.isArray(data.officers) ? data.officers : []);
      setDocs(Array.isArray(data.documents) ? data.documents : []);
    } catch {
      toast.error("Unable to load RTI data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // -------- Officers --------
  const openNewOfficer = () => {
    setEditingOfficerId(null);
    setOfficerForm(emptyOfficer());
    setOfficerOpen(true);
  };
  const openEditOfficer = (o: Officer) => {
    setEditingOfficerId(o.id);
    setOfficerForm({
      officer_type: o.officer_type,
      name: o.name ?? "",
      designation: o.designation ?? "",
      address: o.address ?? "",
      phone: o.phone ?? "",
      email: o.email ?? "",
      display_order: Number(o.display_order ?? 0),
    });
    setOfficerOpen(true);
  };
  const saveOfficer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!officerForm.name.trim()) { toast.error("Name is required"); return; }
    if (!USE_REAL_API) { toast.success("Saved (preview only)"); setOfficerOpen(false); return; }
    setSavingOfficer(true);
    try {
      const url = editingOfficerId
        ? `${API_BASE_URL}/api/admin/rti/officers/${editingOfficerId}`
        : `${API_BASE_URL}/api/admin/rti/officers`;
      const res = await fetch(url, {
        method: editingOfficerId ? "PUT" : "POST",
        headers: getAuthJsonHeaders(),
        body: JSON.stringify(officerForm),
      });
      await handleApiResponse(res);
      if (!res.ok) throw new Error();
      toast.success(editingOfficerId ? "Officer updated" : "Officer created");
      setOfficerOpen(false);
      await load();
    } catch {
      toast.error("Failed to save officer");
    } finally {
      setSavingOfficer(false);
    }
  };
  const deleteOfficer = async (id: string) => {
    if (!confirm("Delete this officer?")) return;
    if (!USE_REAL_API) { toast.success("Deleted (preview only)"); return; }
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/rti/officers/${id}`, {
        method: "DELETE", headers: getAuthHeaders(),
      });
      await handleApiResponse(res);
      if (!res.ok) throw new Error();
      toast.success("Officer deleted");
      await load();
    } catch { toast.error("Failed to delete officer"); }
  };

  // -------- Documents --------
  const openNewDoc = () => {
    setEditingDocId(null);
    setDocTitle(""); setDocOrder(0); setDocFile(null);
    if (fileRef.current) fileRef.current.value = "";
    setDocOpen(true);
  };
  const openEditDoc = (d: RtiDocument) => {
    setEditingDocId(d.id);
    setDocTitle(d.title ?? "");
    setDocOrder(Number(d.display_order ?? 0));
    setDocFile(null);
    if (fileRef.current) fileRef.current.value = "";
    setDocOpen(true);
  };
  const saveDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim()) { toast.error("Title is required"); return; }
    if (!editingDocId && !docFile) { toast.error("Please select a PDF file"); return; }
    if (!USE_REAL_API) { toast.success("Saved (preview only)"); setDocOpen(false); return; }
    setSavingDoc(true);
    try {
      const fd = new FormData();
      fd.append("title", docTitle);
      fd.append("display_order", String(docOrder));
      if (docFile) fd.append("file", docFile);
      const url = editingDocId
        ? `${API_BASE_URL}/api/admin/rti/documents/${editingDocId}`
        : `${API_BASE_URL}/api/admin/rti/documents`;
      const res = await fetch(url, {
        method: editingDocId ? "PUT" : "POST",
        headers: getAuthHeaders(),
        body: fd,
      });
      await handleApiResponse(res);
      if (!res.ok) throw new Error();
      toast.success(editingDocId ? "Document updated" : "Document created");
      setDocOpen(false);
      await load();
    } catch {
      toast.error("Failed to save document");
    } finally {
      setSavingDoc(false);
    }
  };
  const deleteDoc = async (id: string) => {
    if (!confirm("Delete this document?")) return;
    if (!USE_REAL_API) { toast.success("Deleted (preview only)"); return; }
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/rti/documents/${id}`, {
        method: "DELETE", headers: getAuthHeaders(),
      });
      await handleApiResponse(res);
      if (!res.ok) throw new Error();
      toast.success("Document deleted");
      await load();
    } catch { toast.error("Failed to delete document"); }
  };

  return (
    <>
      <AdminPageHeader title="RTI Management" subtitle="Manage RTI officers and downloadable documents." />

      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      )}

      {/* Officers */}
      <section className="bg-card border border-border rounded-md p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-primary">RTI Officers</h3>
            <p className="text-xs text-muted-foreground">Public Information Officer & First Appellate Officer.</p>
          </div>
          <Button size="sm" onClick={openNewOfficer} className="gap-1.5">
            <Plus className="h-4 w-4" /> Add Officer
          </Button>
        </div>
        <div className="overflow-x-auto rounded border border-border">
          <table className="data-table w-full text-sm">
            <thead>
              <tr>
                <th>Type</th><th>Name</th><th>Designation</th>
                <th>Phone</th><th>Email</th><th>Order</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {officers.map((o) => (
                <tr key={o.id}>
                  <td>{OFFICER_TYPE_LABEL[o.officer_type] ?? o.officer_type}</td>
                  <td>{o.name}</td>
                  <td>{o.designation}</td>
                  <td className="whitespace-nowrap">{o.phone}</td>
                  <td>{o.email}</td>
                  <td>{o.display_order}</td>
                  <td className="text-right whitespace-nowrap">
                    <button onClick={() => openEditOfficer(o)} className="p-1.5 hover:bg-surface rounded text-primary" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => deleteOfficer(o.id)} className="p-1.5 hover:bg-surface rounded text-destructive" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
              {officers.length === 0 && (
                <tr><td colSpan={7} className="text-center py-6 text-muted-foreground">No officers added.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Documents */}
      <section className="bg-card border border-border rounded-md p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-primary">RTI Documents</h3>
            <p className="text-xs text-muted-foreground">PDF forms, reports and fee structures.</p>
          </div>
          <Button size="sm" onClick={openNewDoc} className="gap-1.5">
            <Plus className="h-4 w-4" /> Add Document
          </Button>
        </div>
        <div className="overflow-x-auto rounded border border-border">
          <table className="data-table w-full text-sm">
            <thead>
              <tr>
                <th>Title</th><th>Type</th><th>Size</th><th>Order</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {docs.map((d) => (
                <tr key={d.id}>
                  <td className="flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> {d.title}</td>
                  <td>{d.file_type}</td>
                  <td>{formatSize(d.file_size)}</td>
                  <td>{d.display_order}</td>
                  <td className="text-right whitespace-nowrap">
                    <a href={`${API_BASE_URL}${d.file_path}`} target="_blank" rel="noreferrer" className="p-1.5 hover:bg-surface rounded text-primary inline-flex" aria-label="Open">
                      <FileText className="h-4 w-4" />
                    </a>
                    <button onClick={() => openEditDoc(d)} className="p-1.5 hover:bg-surface rounded text-primary" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => deleteDoc(d.id)} className="p-1.5 hover:bg-surface rounded text-destructive" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
              {docs.length === 0 && (
                <tr><td colSpan={5} className="text-center py-6 text-muted-foreground">No documents added.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Officer modal */}
      {officerOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setOfficerOpen(false)}>
          <form onSubmit={saveOfficer} onClick={(e) => e.stopPropagation()} className="bg-card rounded-lg shadow-elevated max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-primary">{editingOfficerId ? "Edit Officer" : "Add Officer"}</h3>
              <button type="button" onClick={() => setOfficerOpen(false)} aria-label="Close" className="p-1 hover:bg-surface rounded"><X className="h-4 w-4" /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <Label>Officer Type</Label>
                <Select
                  value={officerForm.officer_type}
                  onValueChange={(v) => setOfficerForm((p) => ({ ...p, officer_type: v as OfficerType }))}
                >
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public_information_officer">Public Information Officer</SelectItem>
                    <SelectItem value="first_appellate_officer">First Appellate Officer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="of_name">Name *</Label>
                <Input id="of_name" value={officerForm.name} onChange={(e) => setOfficerForm((p) => ({ ...p, name: e.target.value }))} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="of_desig">Designation</Label>
                <Input id="of_desig" value={officerForm.designation} onChange={(e) => setOfficerForm((p) => ({ ...p, designation: e.target.value }))} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="of_phone">Phone</Label>
                <Input id="of_phone" value={officerForm.phone} onChange={(e) => setOfficerForm((p) => ({ ...p, phone: e.target.value }))} className="mt-1" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="of_email">Email</Label>
                <Input id="of_email" type="email" value={officerForm.email} onChange={(e) => setOfficerForm((p) => ({ ...p, email: e.target.value }))} className="mt-1" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="of_addr">Address</Label>
                <Textarea id="of_addr" rows={2} value={officerForm.address} onChange={(e) => setOfficerForm((p) => ({ ...p, address: e.target.value }))} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="of_order">Display Order</Label>
                <Input id="of_order" type="number" value={officerForm.display_order} onChange={(e) => setOfficerForm((p) => ({ ...p, display_order: Number(e.target.value) || 0 }))} className="mt-1" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setOfficerOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={savingOfficer} className="gap-1.5">
                {savingOfficer ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Document modal */}
      {docOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setDocOpen(false)}>
          <form onSubmit={saveDoc} onClick={(e) => e.stopPropagation()} className="bg-card rounded-lg shadow-elevated max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-primary">{editingDocId ? "Edit Document" : "Add Document"}</h3>
              <button type="button" onClick={() => setDocOpen(false)} aria-label="Close" className="p-1 hover:bg-surface rounded"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <Label htmlFor="doc_title">Title *</Label>
                <Input id="doc_title" value={docTitle} onChange={(e) => setDocTitle(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="doc_order">Display Order</Label>
                <Input id="doc_order" type="number" value={docOrder} onChange={(e) => setDocOrder(Number(e.target.value) || 0)} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="doc_file">PDF File {editingDocId ? "(optional)" : "*"}</Label>
                <input
                  ref={fileRef}
                  id="doc_file"
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={(e) => setDocFile(e.target.files?.[0] ?? null)}
                  className="mt-1 block w-full text-sm"
                />
                {docFile && (
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Upload className="h-3 w-3" /> {docFile.name}
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setDocOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={savingDoc} className="gap-1.5">
                {savingDoc ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
