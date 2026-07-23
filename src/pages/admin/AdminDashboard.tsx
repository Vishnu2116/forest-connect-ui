import { Link } from "react-router-dom";
import {
  Calendar,
  Image,
  Users,
  Activity,
  BookOpen,
  FileText,
} from "lucide-react";
import { AdminPageHeader } from "./AdminLayout";
import { Button } from "@/components/ui/button";

const quickActions = [
  { label: "Manage Events", to: "/admin/events", icon: Calendar },
  { label: "Manage Gallery", to: "/admin/gallery", icon: Image },
  { label: "Officials & Directory", to: "/admin/officials", icon: Users },
  {
    label: "Activities Content",
    to: "/admin/activities-outputs",
    icon: Activity,
  },
  { label: "Knowledge Hub", to: "/admin/knowledge-hub", icon: BookOpen },
  {
    label: "e-Tenders / Procurements",
    to: "/admin/procurements",
    icon: FileText,
  },
];

export default function AdminDashboard() {
  return (
    <>
      <AdminPageHeader
        title="Welcome to ELEMENT Admin"
        subtitle="Use the sidebar or the quick links below to manage site content."
      />
      <div className="bg-card border border-border rounded-md">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="font-semibold text-primary">Quick Actions</h3>
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickActions.map((q) => (
            <Button
              key={q.to}
              asChild
              variant="outline"
              className="w-full justify-start h-11"
            >
              <Link to={q.to}>
                <q.icon className="h-4 w-4" /> {q.label}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </>
  );
}
