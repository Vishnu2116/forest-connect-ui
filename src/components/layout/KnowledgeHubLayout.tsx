import PageLayout, { PageHeader } from "@/components/layout/PageLayout";

export const knowledgeHubCategories = [
  { label: "Publications", to: "/publications" },
  { label: "Reports", to: "/reports" },
  { label: "IEC Materials", to: "/knowledge-hub/iec" },
  { label: "Newsletters", to: "/knowledge-hub/newsletters" },
  { label: "Success Stories", to: "/knowledge-hub/success-stories" },
  // { label: "Thematic Studies", to: "/knowledge-hub/thematic" }, // Removed per request — kept for future use
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
        <div className="gov-container">
          <div className="min-w-0">{children}</div>
        </div>
      </section>
    </PageLayout>
  );
}
