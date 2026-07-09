import { Link } from "react-router-dom";
import { Bell, Calendar, FileText, FolderKanban, TreePine, MessageSquare, Users, Plus, ArrowRight } from "lucide-react";
import { AdminPageHeader } from "./AdminLayout";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "Total Notifications", value: 124, icon: Bell, to: "/admin/notifications", color: "bg-primary" },
  { label: "Upcoming Events", value: 8, icon: Calendar, to: "/admin/events", color: "bg-accent" },
  { label: "Active e-Tenders", value: 12, icon: FileText, to: "/admin/tenders", color: "bg-primary-light" },
  { label: "Reports Uploaded", value: 87, icon: FolderKanban, to: "/admin/reports", color: "bg-primary" },
  { label: "Plantation Records", value: 642, icon: TreePine, to: "/admin/plantation", color: "bg-success" },
  { label: "Pending Grievances", value: 23, icon: MessageSquare, to: "/admin/grievance", color: "bg-destructive" },
  { label: "Total Users", value: 56, icon: Users, to: "/admin/users", color: "bg-primary-dark" },
];

const recent = [
  { mod: "Notification", title: "E-Tender notice: Bamboo plantation, Khowai", date: "28 Apr 2026", by: "Content Manager" },
  { mod: "Event", title: "Stakeholder workshop on HVFPs — Agartala", date: "26 Apr 2026", by: "Admin" },
  { mod: "Report", title: "Q1 2026 Progress Report uploaded", date: "24 Apr 2026", by: "District Officer" },
  { mod: "Plantation", title: "New plantation record — Sepahijala (12 ha)", date: "22 Apr 2026", by: "District Officer" },
  { mod: "Grievance", title: "Grievance #GRV-2026-0098 resolved", date: "21 Apr 2026", by: "Admin" },
];

const quickActions = [
  { label: "Add Notification", to: "/admin/notifications" },
  { label: "Add Event", to: "/admin/events" },
  { label: "Add E-Tender", to: "/admin/tenders" },
  { label: "Add Plantation", to: "/admin/plantation" },
  { label: "Upload Report", to: "/admin/reports" },
];

export default function AdminDashboard() {
  return (
    <>
      <AdminPageHeader title="Dashboard Overview" subtitle="Summary of website content and pending actions." />

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Link key={s.label} to={s.to} className="bg-card border border-border rounded-md p-4 hover:shadow-card transition-shadow group">
            <div className="flex items-center justify-between">
              <div className={`h-10 w-10 rounded-md ${s.color} text-white flex items-center justify-center`}>
                <s.icon className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
            </div>
            <div className="mt-3 text-2xl font-bold text-primary">{s.value.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-md">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-primary">Recent Updates</h3>
            <button className="text-xs text-primary hover:underline">View all</button>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr><th>Module</th><th>Title</th><th>Date</th><th>By</th></tr>
              </thead>
              <tbody>
                {recent.map((r, i) => (
                  <tr key={i}>
                    <td><span className="text-xs px-2 py-0.5 rounded bg-surface text-primary font-medium">{r.mod}</span></td>
                    <td>{r.title}</td>
                    <td className="whitespace-nowrap">{r.date}</td>
                    <td>{r.by}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-card border border-border rounded-md">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="font-semibold text-primary">Quick Actions</h3>
          </div>
          <div className="p-3 space-y-2">
            {quickActions.map((q) => (
              <Button key={q.to} asChild variant="outline" className="w-full justify-start">
                <Link to={q.to}><Plus className="h-4 w-4" /> {q.label}</Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
