import { useEffect, useRef, useState } from "react";
import { AdminPageHeader } from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { adminDeleteGallery, adminUploadGallery, fetchGallery, fileUrl } from "@/lib/media";
import { batchUpload } from "@/lib/batchUpload";

export default function GalleryAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ uploaded: number; total: number } | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<{ current: number; total: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    try { setItems(await fetchGallery()); } catch { toast.error("Failed to load"); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const onSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    setUploadProgress({ uploaded: 0, total: files.length });
    const result = await batchUpload(
      files,
      10,
      (batch) => adminUploadGallery(batch),
      ({ uploaded, total, batchIndex, totalBatches }) => {
        setUploadProgress({ uploaded, total });
        if (uploaded < total) {
          toast.message(`Uploading batch ${batchIndex} of ${totalBatches}…`, {
            description: `${uploaded} of ${total} images uploaded`,
            id: "gallery-batch-upload",
          });
        }
      }
    );
    if (result.errors.length) {
      result.errors.forEach((er) =>
        toast.error(`Batch ${er.batchIndex} failed`, { description: String((er.error as any)?.message || er.error) })
      );
    }
    if (result.uploaded > 0) {
      toast.success(`${result.uploaded} image${result.uploaded === 1 ? "" : "s"} uploaded successfully`);
    }
    await load();
    setUploadProgress(null);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const del = async (id: string) => {
    if (!confirm("Delete this image?")) return;
    try { await adminDeleteGallery(id); toast.success("Deleted"); await load(); }
    catch { toast.error("Delete failed"); }
  };

  const toggleSelection = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const allSelected = items.length > 0 && selectedIds.size === items.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < items.length;

  const toggleSelectAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(items.map((img) => img.id)));
  };

  const bulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} image${selectedIds.size === 1 ? "" : "s"}?`)) return;
    setBulkDeleting(true);
    setBulkProgress({ current: 0, total: selectedIds.size });
    const ids = Array.from(selectedIds);
    let deleted = 0;
    let failed = 0;
    for (let i = 0; i < ids.length; i++) {
      try {
        await adminDeleteGallery(ids[i]);
        deleted++;
      } catch {
        failed++;
      }
      setBulkProgress({ current: i + 1, total: ids.length });
    }
    setBulkDeleting(false);
    setBulkProgress(null);
    setSelectedIds(new Set());
    await load();
    if (failed > 0) {
      toast.error(`${failed} image${failed === 1 ? "" : "s"} failed to delete`, { description: `${deleted} deleted successfully` });
    } else {
      toast.success(`${deleted} image${deleted === 1 ? "" : "s"} deleted successfully`);
    }
  };

  return (
    <>
      <AdminPageHeader
        title="Gallery Management"
        subtitle="Upload and manage gallery images."
        action={
          <Button onClick={() => inputRef.current?.click()} disabled={uploading} className="gap-1.5">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Upload images
          </Button>
        }
      />
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={onSelect} />
      {uploadProgress && (
        <div className="mb-4 rounded-md border border-border bg-card p-3">
          <div className="text-xs text-muted-foreground mb-2">
            Uploading {Math.min(uploadProgress.uploaded + 1, uploadProgress.total)} of {uploadProgress.total} images…
          </div>
          <Progress value={(uploadProgress.uploaded / uploadProgress.total) * 100} />
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>
      ) : items.length === 0 ? (
        <div className="text-center text-muted-foreground py-16 text-sm">No images uploaded yet.</div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="select-all-gallery"
                checked={allSelected ? true : someSelected ? "indeterminate" : false}
                onCheckedChange={toggleSelectAll}
                disabled={bulkDeleting}
              />
              <label htmlFor="select-all-gallery" className="text-sm text-muted-foreground cursor-pointer select-none">
                Select all
              </label>
            </div>
            {selectedIds.size > 0 && (
              <Button variant="destructive" size="sm" onClick={bulkDelete} disabled={bulkDeleting} className="gap-1.5">
                {bulkDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
                <Trash2 className="h-4 w-4" />
                Delete selected ({selectedIds.size})
              </Button>
            )}
          </div>

          {bulkProgress && (
            <div className="mb-4 rounded-md border border-border bg-card p-3">
              <div className="text-xs text-muted-foreground mb-2">
                Deleting {bulkProgress.current} of {bulkProgress.total} images…
              </div>
              <Progress value={(bulkProgress.current / bulkProgress.total) * 100} />
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {items.map((img: any) => (
              <div key={img.id} className={`relative group border border-border rounded-md overflow-hidden bg-card ${selectedIds.has(img.id) ? "ring-2 ring-blue-500" : ""}`}>
                <div className={`absolute top-1.5 left-1.5 z-10 transition ${selectedIds.has(img.id) ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                  <Checkbox
                    checked={selectedIds.has(img.id)}
                    onCheckedChange={() => toggleSelection(img.id)}
                    disabled={bulkDeleting}
                    aria-label="Select image"
                  />
                </div>
                <img src={fileUrl(img.image_path)} alt={img.caption || ""} className="w-full aspect-square object-cover" loading="lazy" />
                {img.caption && <div className="px-2 py-1 text-[11px] text-muted-foreground truncate">{img.caption}</div>}
                <button
                  onClick={() => del(img.id)}
                  className="absolute top-1.5 right-1.5 p-1.5 rounded bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition"
                  aria-label="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
