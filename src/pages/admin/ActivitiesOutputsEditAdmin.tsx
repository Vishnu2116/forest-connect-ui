import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AdminPageHeader } from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Loader2, Plus, Save, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import {
  adminDeleteActivityImage,
  adminFetchActivityProject,
  adminSaveActivityProject,
  adminUploadActivityImages,
  type AdminActivityProjectDetail,
  type ActivityStat,
} from "@/lib/activities";
import { batchUpload } from "@/lib/batchUpload";
import { resolveImage } from "@/lib/projects";

export default function ActivitiesOutputsEditAdmin() {
  const { projectId } = useParams<{ projectId: string }>();
  const [data, setData] = useState<AdminActivityProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [paragraph, setParagraph] = useState("");
  const [bullets, setBullets] = useState<string[]>([]);
  const [stats, setStats] = useState<ActivityStat[]>([]);
  const [isActive, setIsActive] = useState(true);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ uploaded: number; total: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const d = await adminFetchActivityProject(projectId);
      setData(d);
      if (d) {
        setParagraph(d.paragraph || "");
        setBullets(Array.isArray(d.bullet_points) ? d.bullet_points : []);
        setStats(Array.isArray(d.stats) ? d.stats : []);
        setIsActive(d.is_active !== false);
      }
    } catch {
      toast.error("Failed to load project");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const save = async () => {
    if (!projectId) return;
    setSaving(true);
    try {
      await adminSaveActivityProject(projectId, {
        paragraph,
        bullet_points: bullets.map((b) => b.trim()).filter(Boolean),
        stats: stats.filter((s) => (s.label || "").trim() || (s.value || "").trim()),
        is_active: isActive,
      });
      toast.success("Saved");
      await load();
    } catch (e: any) {
      toast.error(e?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const triggerUpload = () => inputRef.current?.click();

  const onSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length || !projectId) return;
    setUploading(true);
    setUploadProgress({ uploaded: 0, total: files.length });
    const result = await batchUpload(
      files,
      10,
      (batch) => adminUploadActivityImages(projectId, batch),
      ({ uploaded, total, batchIndex, totalBatches }) => {
        setUploadProgress({ uploaded, total });
        if (uploaded < total) {
          toast.message(`Uploading batch ${batchIndex} of ${totalBatches}…`, {
            description: `${uploaded} of ${total} images uploaded`,
            id: "activity-batch-upload",
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
      toast.success(`${result.uploaded} image${result.uploaded === 1 ? "" : "s"} uploaded`);
    }
    await load();
    setUploadProgress(null);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const deleteImage = async (id: string) => {
    if (!confirm("Delete this image?")) return;
    try {
      await adminDeleteActivityImage(id);
      toast.success("Deleted");
      await load();
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading) {
    return (
      <>
        <AdminPageHeader title="Activities & Outputs" />
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      </>
    );
  }

  if (!data || !data.project) {
    return (
      <>
        <AdminPageHeader title="Not Found" />
        <Link to="/admin/activities-outputs" className="text-sm text-primary hover:text-accent inline-flex items-center gap-1.5">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
      </>
    );
  }

  const images = Array.isArray(data.images) ? data.images : [];

  return (
    <>
      <AdminPageHeader
        title={data.project.title}
        subtitle="Edit activity content for this project."
        action={
          <Link to="/admin/activities-outputs" className="text-sm text-primary hover:text-accent inline-flex items-center gap-1.5">
            <ArrowLeft className="h-4 w-4" /> Back to list
          </Link>
        }
      />

      <div className="bg-card border border-border rounded-md shadow-card p-5 md:p-6 space-y-6">
        <div>
          <label className="text-[11px] font-semibold text-muted-foreground uppercase">Paragraph</label>
          <textarea
            value={paragraph}
            onChange={(e) => setParagraph(e.target.value)}
            rows={6}
            className="w-full mt-1 border border-input rounded px-3 py-2 text-sm bg-card"
            placeholder="Enter the descriptive paragraph…"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase">Bullet Points</label>
            <Button size="sm" variant="outline" onClick={() => setBullets([...bullets, ""])} className="gap-1.5">
              <Plus className="h-3.5 w-3.5" /> Add Bullet
            </Button>
          </div>
          {bullets.length === 0 && <p className="text-xs text-muted-foreground">No bullet points added.</p>}
          <div className="space-y-2">
            {bullets.map((b, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={b}
                  onChange={(e) => {
                    const next = [...bullets];
                    next[i] = e.target.value;
                    setBullets(next);
                  }}
                  className="flex-1 border border-input rounded px-2 py-1.5 text-sm bg-card"
                  placeholder={`Bullet ${i + 1}`}
                />
                <button
                  onClick={() => setBullets(bullets.filter((_, j) => j !== i))}
                  className="p-1.5 rounded border border-border hover:bg-destructive/10 text-destructive"
                  aria-label="Remove bullet"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase">Stats</label>
            <Button size="sm" variant="outline" onClick={() => setStats([...stats, { label: "", value: "" }])} className="gap-1.5">
              <Plus className="h-3.5 w-3.5" /> Add Stat
            </Button>
          </div>
          {stats.length === 0 && <p className="text-xs text-muted-foreground">No stats added.</p>}
          <div className="space-y-2">
            {stats.map((s, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={s.label}
                  onChange={(e) => {
                    const next = [...stats];
                    next[i] = { ...next[i], label: e.target.value };
                    setStats(next);
                  }}
                  className="flex-1 border border-input rounded px-2 py-1.5 text-sm bg-card"
                  placeholder="Label (e.g. Households Benefited)"
                />
                <input
                  value={s.value}
                  onChange={(e) => {
                    const next = [...stats];
                    next[i] = { ...next[i], value: e.target.value };
                    setStats(next);
                  }}
                  className="w-40 border border-input rounded px-2 py-1.5 text-sm bg-card"
                  placeholder="Value (e.g. 25,000+)"
                />
                <button
                  onClick={() => setStats(stats.filter((_, j) => j !== i))}
                  className="p-1.5 rounded border border-border hover:bg-destructive/10 text-destructive"
                  aria-label="Remove stat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="activity-is-active"
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          <label htmlFor="activity-is-active" className="text-sm text-foreground select-none cursor-pointer">
            Is Active
          </label>
        </div>

        <div className="flex justify-end">
          <Button onClick={save} disabled={saving} className="gap-1.5">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save changes
          </Button>
        </div>
      </div>

      <div className="mt-6 bg-card border border-border rounded-md shadow-card p-5 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-primary">Images</h3>
          <Button onClick={triggerUpload} disabled={uploading} className="gap-1.5">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Upload images
          </Button>
          <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={onSelect} />
        </div>

        {uploadProgress && (
          <div className="mb-4 rounded-md border border-border bg-card p-3">
            <div className="text-xs text-muted-foreground mb-2">
              Uploading {Math.min(uploadProgress.uploaded + 1, uploadProgress.total)} of {uploadProgress.total} images…
            </div>
            <Progress value={(uploadProgress.uploaded / uploadProgress.total) * 100} />
          </div>
        )}

        {images.length === 0 ? (
          <div className="text-center text-muted-foreground py-8 text-sm">No images uploaded yet.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {images.map((img) => (
              <div key={img.id} className="relative group border border-border rounded-md overflow-hidden bg-card">
                <img
                  src={resolveImage(img.image_path) || ""}
                  alt={img.caption || ""}
                  className="w-full aspect-square object-cover"
                  loading="lazy"
                />
                <button
                  onClick={() => deleteImage(img.id)}
                  className="absolute top-1.5 right-1.5 p-1.5 rounded bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition"
                  aria-label="Delete image"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
