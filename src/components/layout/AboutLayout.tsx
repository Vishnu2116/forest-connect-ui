import { Link } from "react-router-dom";
import PageLayout, { PageHeader } from "@/components/layout/PageLayout";

const links = [
  { to: "/about/organization", title: "Organization Structure", desc: "Hierarchy and structure of the Department." },
  { to: "/about/memorandum", title: "Memorandum of Association", desc: "Founding documents and governance." },
  { to: "/about/directory", title: "Official Directory", desc: "Contact details of officials." },
  { to: "/about/objectives", title: "Objectives", desc: "Key objectives of the Project." },
];

export default function AboutPage({ title, subtitle, children }: { title: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <PageLayout>
      <PageHeader title={title} subtitle={subtitle} breadcrumb={["Home", "About Us", title]} />
      <section className="py-10">
        <div className="gov-container grid lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <h3 className="text-sm font-semibold text-primary mb-3 uppercase">About Us</h3>
            <nav className="space-y-1">
              {links.map((l) => (
                <Link key={l.to} to={l.to} className="block px-3 py-2 text-sm rounded hover:bg-surface hover:text-primary border-l-2 border-transparent hover:border-accent">
                  {l.title}
                </Link>
              ))}
            </nav>
          </aside>
          <div className="lg:col-span-3">
            {children}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
