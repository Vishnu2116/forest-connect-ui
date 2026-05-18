import { NavLink } from "react-router-dom";
import PageLayout, { PageHeader } from "@/components/layout/PageLayout";

export const knowledgeHubCategories = [
  { label: "Publications", to: "/publications" },
  { label: "Reports", to: "/reports" },
  { label: "IEC Materials", to: "/knowledge-hub/iec" },
  { label: "Newsletters", to: "/knowledge-hub/newsletters" },
  { label: "Success Stories", to: "/knowledge-hub/success-stories" },
  { label: "Thematic Studies", to: "/knowledge-hub/thematic" },
  { label: "Documentation", to: "/knowledge-hub/documentation" },
  { label: "Case Studies", to: "/knowledge-hub/case-studies" },
  { label: "Notifications", to: "/knowledge-hub/notifications" },
  { label: "Lessons Learned", to: "/knowledge-hub/lessons" },
];

export default function KnowledgeHubLayout({
  title,
  subtitle,
  breadcrumb,
  children,
}: {
  title: string;
  subtitle?: string;
  breadcrumb?: string[];
  children: React.ReactNode;
}) {
  return (
    <PageLayout>
      <PageHeader
        title={title}
        subtitle={subtitle}
        breadcrumb={breadcrumb ?? ["Home", "Knowledge Hub", title]}
      />
      <section className="py-10">
        <div className="gov-container grid lg:grid-cols-[220px_minmax(0,1fr)] gap-6 lg:gap-8">
          <aside>
            <h3 className="text-sm font-semibold text-primary mb-3 uppercase">
              Knowledge Hub
            </h3>
            <nav className="space-y-1">
              {knowledgeHubCategories.map((c) => (
                <NavLink
                  key={c.to}
                  to={c.to}
                  end
                  className={({ isActive }) =>
                    `block px-3 py-2 text-[13px] rounded border-l-2 transition ${
                      isActive
                        ? "border-accent text-primary bg-surface font-semibold"
                        : "border-transparent hover:bg-surface hover:text-primary hover:border-accent"
                    }`
                  }
                >
                  {c.label}
                </NavLink>
              ))}
            </nav>
          </aside>
          <div className="min-w-0">{children}</div>
        </div>
      </section>
    </PageLayout>
  );
}
