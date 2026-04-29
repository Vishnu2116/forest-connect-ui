import { useState } from "react";
import { Eye, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "./AdminLayout";

interface Item { id: string; name: string; subject: string; date: string; status: string; details?: string; }

function StatusBadge({ s }: { s: string }) {
  const map: Record<string,string> = {
    "Pending": "bg-accent/15 text-accent",
    "In Progress": "bg-primary/15 text-primary",
    "Resolved": "bg-success/15 text-success",
    "Closed": "bg-muted text-muted-foreground",
  };
  return <span className={`text-xs px-2 py-0.5 rounded font-medium ${map[s] ?? "bg-muted text-muted-foreground"}`}>{s}</span>;
}

function StatusModule({ title, subtitle, idPrefix, statuses, seed }: { title: string; subtitle: string; idPrefix: string; statuses: string[]; seed: Item[] }) {
  const [rows, setRows] = useState<Item[]>(seed);
  const [q, setQ] = useState("");
  const [view, setView] = useState<Item | null>(null);
  const filtered = rows.filter((r) => [r.id, r.name, r.subject].some((x) => x.toLowerCase().includes(q.toLowerCase())));

  const updateStatus = (id: string, status: string) => setRows((p) => p.map((r) => r.id === id ? { ...r, status } : r));

  return (
    <>
      <AdminPageHeader title={title} subtitle={subtitle} />
      <div className="bg-card border border-border rounded-md p-3 mb-4 flex gap-3 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${idPrefix} requests...`} className="pl-9" />
        </div>
        <div className="text-sm text-muted-foreground">{filtered.length} entries</div>
      </div>
      <div className="overflow-x-auto rounded-md border border-border bg-card shadow-card">
        <table className="data-table">
          <thead><tr><th>ID</th><th>Name</th><th>Subject</th><th>Date</th><th>Status</th><th className="text-right">Actions</th></tr></thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id}>
                <td className="font-mono text-xs">{r.id}</td>
                <td>{r.name}</td>
                <td className="max-w-[280px] truncate">{r.subject}</td>
                <td className="whitespace-nowrap">{r.date}</td>
                <td><StatusBadge s={r.status} /></td>
                <td className="text-right whitespace-nowrap">
                  <button onClick={() => setView(r)} className="p-1.5 hover:bg-surface rounded text-primary" aria-label="View"><Eye className="h-4 w-4" /></button>
                  <select value={r.status} onChange={(e) => updateStatus(r.id, e.target.value)} className="ml-1 text-xs h-8 rounded border border-input bg-background px-1">
                    {statuses.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} className="text-center py-6 text-muted-foreground">No entries</td></tr>}
          </tbody>
        </table>
      </div>

      {view && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setView(null)}>
          <div className="bg-card rounded-lg shadow-elevated max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-primary mb-3">{title} — {view.id}</h3>
            <dl className="space-y-2 text-sm">
              <div><dt className="text-xs text-muted-foreground">Applicant</dt><dd>{view.name}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Subject</dt><dd>{view.subject}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Date</dt><dd>{view.date}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Status</dt><dd><StatusBadge s={view.status} /></dd></div>
              {view.details && <div><dt className="text-xs text-muted-foreground">Details</dt><dd>{view.details}</dd></div>}
            </dl>
            <div className="flex justify-end pt-4"><Button variant="outline" onClick={() => setView(null)}>Close</Button></div>
          </div>
        </div>
      )}
    </>
  );
}

export const GrievanceAdmin = () => (
  <StatusModule
    title="Grievance Management"
    subtitle="Track and resolve public grievances."
    idPrefix="grievance"
    statuses={["Pending","In Progress","Resolved","Closed"]}
    seed={[
      { id: "GRV-2026-0099", name: "Ratan Debbarma", subject: "Damage to plantation in Khowai", date: "2026-04-26", status: "Pending", details: "Reported cattle damage to recent plantation site." },
      { id: "GRV-2026-0098", name: "Sumitra Tripura", subject: "Delayed wage payment for plantation labour", date: "2026-04-22", status: "In Progress", details: "Awaiting payment for 12 workers." },
      { id: "GRV-2026-0097", name: "Bikash Roy", subject: "Request for sapling supply", date: "2026-04-18", status: "Resolved", details: "Saplings supplied to applicant." },
    ]}
  />
);

export const RTIAdmin = () => (
  <StatusModule
    title="RTI Management"
    subtitle="Manage Right to Information requests."
    idPrefix="RTI"
    statuses={["Pending","In Progress","Replied","Closed"]}
    seed={[
      { id: "RTI-2026-0042", name: "Pradip Nath", subject: "Tender details for Q1 2026", date: "2026-04-25", status: "Pending", details: "Seeking copies of all tender notices." },
      { id: "RTI-2026-0041", name: "Anita Saha", subject: "Plantation expenditure 2024-25", date: "2026-04-20", status: "In Progress", details: "Requested district-wise expenditure." },
      { id: "RTI-2026-0040", name: "Mohan Reang", subject: "List of beneficiaries — HVFP", date: "2026-04-12", status: "Replied", details: "Reply sent on 2026-04-22." },
    ]}
  />
);
