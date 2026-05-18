import { ReactNode, useEffect, useState } from "react";
import { Link, NavLink, useNavigate, Outlet } from "react-router-dom";
import {
  LayoutDashboard, Bell, Calendar, FileText, Users, Award, BookOpen, FolderKanban,
  Image as ImageIcon, Activity, Briefcase, TreePine, MessageSquare, FileQuestion,
  UserCog, Settings, LogOut, Menu, X, Home as HomeIcon, Layers, SlidersHorizontal
} from "lucide-react";
import logoTripura from "@/assets/logo-tripura.png";

export const adminMenu = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/notifications", label: "Notifications", icon: Bell },
  { to: "/admin/events", label: "Events", icon: Calendar },
  { to: "/admin/tenders", label: "Tenders / Procurements", icon: FileText },
  { to: "/admin/whoswho", label: "Who's Who", icon: Users },
  { to: "/admin/success-stories", label: "Success Stories", icon: Award },
  { to: "/admin/newsletters", label: "Newsletters", icon: BookOpen },
  { to: "/admin/thematic", label: "Thematic Studies", icon: FolderKanban },
  { to: "/admin/reports", label: "Reports", icon: FileText },
  { to: "/admin/iec", label: "IEC Materials", icon: ImageIcon },
  { to: "/admin/activities", label: "Activities & Outputs", icon: Activity },
  { to: "/admin/projects", label: "Projects", icon: Briefcase },
  { to: "/admin/hero", label: "Hero Slides", icon: SlidersHorizontal },
  
  { to: "/admin/plantation", label: "Plantation Module", icon: TreePine },
  { to: "/admin/grievance", label: "Grievance Mgmt", icon: MessageSquare },
  { to: "/admin/rti", label: "RTI Mgmt", icon: FileQuestion },
  { to: "/admin/users", label: "User Management", icon: UserCog },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const adminName = sessionStorage.getItem("element_admin") || "Admin";

  const logout = () => {
    sessionStorage.removeItem("element_admin");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-surface">
      {/* Sidebar */}
      <aside className={`${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:static z-40 inset-y-0 left-0 w-64 bg-primary-dark text-primary-foreground flex flex-col transition-transform`}>
        <div className="px-4 py-4 border-b border-primary/40 flex items-center gap-2">
          <img src={logoTripura} alt="" className="h-9 w-9 bg-white rounded p-1" />
          <div>
            <div className="font-extrabold text-accent leading-none">ELEMENT</div>
            <div className="text-[10px] opacity-80">Admin Console</div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          {adminMenu.map((m) => (
            <NavLink
              key={m.to}
              to={m.to}
              end={m.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 text-sm border-l-4 transition-colors ${
                  isActive ? "bg-primary border-accent text-white" : "border-transparent hover:bg-primary/60"
                }`
              }
            >
              <m.icon className="h-4 w-4" />
              <span>{m.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-primary/40 p-3 space-y-1">
          <Link to="/" className="flex items-center gap-2 text-xs hover:bg-primary/60 px-3 py-2 rounded">
            <HomeIcon className="h-4 w-4" /> View Public Website
          </Link>
          <button onClick={logout} className="w-full flex items-center gap-2 text-xs hover:bg-primary/60 px-3 py-2 rounded">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {open && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-card border-b border-border h-14 flex items-center justify-between px-4 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 rounded border border-border" onClick={() => setOpen(true)} aria-label="Open menu">
              <Menu className="h-4 w-4" />
            </button>
            <h1 className="font-semibold text-primary">ELEMENT Admin</h1>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden sm:inline text-muted-foreground">Welcome,</span>
            <span className="font-semibold text-primary">{adminName}</span>
            <div className="h-8 w-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold">
              {adminName.slice(0, 1).toUpperCase()}
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-x-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function AdminPageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
