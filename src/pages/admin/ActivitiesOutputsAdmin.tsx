import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AdminPageHeader } from "./AdminLayout";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { adminFetchActivityProjects, type AdminActivityProjectRow } from "@/lib/activities";
import { resolveImage } from "@/lib/projects";

export default function ActivitiesOutputsAdmin() {
  const [rows, setRows] = useState<AdminActivityProjectRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      setRows(await adminFetchActivityProjects());
    } catch {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <AdminPageHeader
        title="Activities & Outputs"
        subtitle="Add paragraph, bullet points, stats and images for each project."
      />

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      ) : rows.length === 0 ? (
        <div className="text-center text-muted-foreground py-16 text-sm">No projects found.</div>
      ) : (
        <div className="overflow-x-auto rounded-md border border-border bg-card shadow-card">
          <table className="data-table w-full">
            <thead>
              <tr>
                <th>Thumbnail</th>
                <th>Title</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const thumb = resolveImage(r.thumbnail_image_path);
                return (
                  <tr key={r.id} className="hover:bg-surface/60">
                    <td className="w-24">
                      {thumb ? (
                        <img src={thumb} alt="" className="h-14 w-20 object-cover rounded border border-border" />
                      ) : (
                        <div className="h-14 w-20 rounded border border-border bg-surface flex items-center justify-center text-[10px] text-muted-foreground">
                          No image
                        </div>
                      )}
                    </td>
                    <td>
                      <Link to={`/admin/activities-outputs/${r.id}`} className="font-semibold text-primary hover:text-accent">
                        {r.title}
                      </Link>
                    </td>
                    <td>
                      {r.has_activity_content ? (
                        <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-success/15 text-success">
                          Content Added
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-muted text-muted-foreground">
                          No Content Yet
                        </span>
                      )}
                    </td>
                    <td className="text-right pr-4">
                      <Link
                        to={`/admin/activities-outputs/${r.id}`}
                        className="text-xs font-semibold text-primary hover:text-accent"
                      >
                        Edit →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
