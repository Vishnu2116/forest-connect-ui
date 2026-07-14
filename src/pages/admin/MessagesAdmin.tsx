import { useEffect, useState } from "react";
import { Eye, Trash2, Mail, MailOpen, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "./AdminLayout";
import { API_BASE_URL, getAuthHeaders, handleApiResponse } from "@/config/api";
import { useToast } from "@/hooks/use-toast";

type Base = {
  id: number | string;
  name: string;
  email: string;
  message: string;
  is_read?: boolean;
  read?: boolean;
  created_at?: string;
  date?: string;
};

type Contact = Base & { subject?: string };
type Feedback = Base & { mobile?: string; category?: string };

const CATEGORY_LABELS: Record<string, string> = {
  general: "General",
  website_issue: "Website Issue",
  content_suggestion: "Content Suggestion",
  accessibility: "Accessibility",
  project_information: "Project Information",
  other: "Other",
};

function fmtDate(d?: string) {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleString();
  } catch {
    return d;
  }
}

function truncate(s: string, n = 80) {
  if (!s) return "";
  return s.length > n ? s.slice(0, n) + "…" : s;
}

function MessagesModule<T extends Base>({
  title,
  subtitle,
  endpoint,
  kind,
}: {
  title: string;
  subtitle: string;
  endpoint: string; // e.g. "/api/admin/contact-messages"
  kind: "contact" | "feedback";
}) {
  const { toast } = useToast();
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [view, setView] = useState<T | null>(null);
  const [confirmDel, setConfirmDel] = useState<T | null>(null);

  const isRead = (r: T) => Boolean(r.is_read ?? r.read);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, { headers: getAuthHeaders() });
      await handleApiResponse(res);
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      const list: T[] = Array.isArray(data) ? data : data.data || data.items || [];
      setRows(list);
    } catch {
      toast({ title: "Failed to load messages", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markRead = async (r: T) => {
    if (isRead(r)) return;
    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}/${r.id}/read`, {
        method: "PUT",
        headers: getAuthHeaders(),
      });
      await handleApiResponse(res);
      if (res.ok) {
        setRows((prev) => prev.map((x) => (x.id === r.id ? { ...x, is_read: true, read: true } : x)));
      }
    } catch {
      // ignore
    }
  };

  const remove = async (r: T) => {
    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}/${r.id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      await handleApiResponse(res);
      if (res.ok) {
        setRows((prev) => prev.filter((x) => x.id !== r.id));
        toast({ title: "Deleted" });
      } else {
        toast({ title: "Delete failed", variant: "destructive" });
      }
    } catch {
      toast({ title: "Delete failed", variant: "destructive" });
    } finally {
      setConfirmDel(null);
    }
  };

  const openView = (r: T) => {
    setView(r);
    markRead(r);
  };

  const query = q.toLowerCase();
  const filtered = rows.filter((r) => {
    const hay = [
      r.name,
      r.email,
      r.message,
      (r as unknown as Contact).subject,
      (r as unknown as Feedback).mobile,
      (r as unknown as Feedback).category,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return hay.includes(query);
  });

  const isContact = kind === "contact";

  return (
    <>
      <AdminPageHeader title={title} subtitle={subtitle} />
      <div className="bg-card border border-border rounded-md p-3 mb-4 flex gap-3 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search messages..." className="pl-9" />
        </div>
        <div className="text-sm text-muted-foreground">{filtered.length} entries</div>
      </div>

      <div className="overflow-x-auto rounded-md border border-border bg-card shadow-card">
        <table className="data-table">
          <thead>
            <tr>
              <th className="w-6"></th>
              <th>Name</th>
              <th>Email</th>
              {isContact ? <th>Subject</th> : (<><th>Mobile</th><th>Category</th></>)}
              <th>Message</th>
              <th>Date</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={isContact ? 8 : 9} className="text-center py-6 text-muted-foreground">Loading…</td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={isContact ? 8 : 9} className="text-center py-6 text-muted-foreground">No messages</td></tr>
            )}
            {!loading && filtered.map((r) => {
              const unread = !isRead(r);
              return (
                <tr
                  key={r.id}
                  className={`cursor-pointer ${unread ? "font-semibold" : ""}`}
                  onClick={() => openView(r)}
                >
                  <td>
                    {unread ? (
                      <span className="inline-block h-2 w-2 rounded-full bg-accent" aria-label="Unread" />
                    ) : null}
                  </td>
                  <td>{r.name}</td>
                  <td className="text-xs">{r.email}</td>
                  {isContact ? (
                    <td className="max-w-[220px] truncate">{(r as unknown as Contact).subject || "—"}</td>
                  ) : (
                    <>
                      <td className="whitespace-nowrap">{(r as unknown as Feedback).mobile || "—"}</td>
                      <td>
                        <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">
                          {CATEGORY_LABELS[(r as unknown as Feedback).category || ""] || (r as unknown as Feedback).category || "—"}
                        </span>
                      </td>
                    </>
                  )}
                  <td className="max-w-[280px] truncate">{truncate(r.message)}</td>
                  <td className="whitespace-nowrap text-xs">{fmtDate(r.created_at || r.date)}</td>
                  <td>
                    {unread ? (
                      <span className="text-xs px-2 py-0.5 rounded bg-accent/15 text-accent font-medium">Unread</span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground font-medium">Read</span>
                    )}
                  </td>
                  <td className="text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => openView(r)} className="p-1.5 hover:bg-surface rounded text-primary" aria-label="View">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => markRead(r)}
                      className="p-1.5 hover:bg-surface rounded text-primary"
                      aria-label={unread ? "Mark as read" : "Read"}
                      disabled={!unread}
                    >
                      {unread ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4 opacity-40" />}
                    </button>
                    <button
                      onClick={() => setConfirmDel(r)}
                      className="p-1.5 hover:bg-surface rounded text-destructive"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {view && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setView(null)}>
          <div className="bg-card rounded-lg shadow-elevated max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-primary mb-3">{title}</h3>
            <dl className="space-y-2 text-sm">
              <div><dt className="text-xs text-muted-foreground">Name</dt><dd>{view.name}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Email</dt><dd>{view.email}</dd></div>
              {isContact && (
                <div><dt className="text-xs text-muted-foreground">Subject</dt><dd>{(view as unknown as Contact).subject || "—"}</dd></div>
              )}
              {!isContact && (
                <>
                  <div><dt className="text-xs text-muted-foreground">Mobile</dt><dd>{(view as unknown as Feedback).mobile || "—"}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">Category</dt><dd>{CATEGORY_LABELS[(view as unknown as Feedback).category || ""] || (view as unknown as Feedback).category || "—"}</dd></div>
                </>
              )}
              <div><dt className="text-xs text-muted-foreground">Message</dt><dd className="whitespace-pre-wrap">{view.message}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Date</dt><dd>{fmtDate(view.created_at || view.date)}</dd></div>
            </dl>
            <div className="flex justify-end pt-4">
              <Button variant="outline" onClick={() => setView(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {confirmDel && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setConfirmDel(null)}>
          <div className="bg-card rounded-lg shadow-elevated max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-primary mb-2">Delete message?</h3>
            <p className="text-sm text-muted-foreground mb-4">This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setConfirmDel(null)}>Cancel</Button>
              <Button variant="destructive" onClick={() => remove(confirmDel)}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export const ContactMessagesAdmin = () => (
  <MessagesModule
    title="Contact Messages"
    subtitle="Messages submitted via the Contact Us form."
    endpoint="/api/admin/contact-messages"
    kind="contact"
  />
);

export const FeedbackMessagesAdmin = () => (
  <MessagesModule
    title="Feedback Messages"
    subtitle="Feedback submitted via the Feedback form."
    endpoint="/api/admin/feedback-messages"
    kind="feedback"
  />
);
