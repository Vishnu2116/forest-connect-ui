import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import { FileText, Download } from "lucide-react";

export default function RTI() {
  const sections = [
    {
      title: "1. Particulars of the Organization",
      body: "The Tripura Forest Department is headed by the Principal Chief Conservator of Forests & Head of Forest Force, with offices across all forest divisions of the State.",
    },
    {
      title: "2. Powers and Duties of Officers",
      body: "Officers exercise statutory powers under the Indian Forest Act 1927, the Wild Life (Protection) Act 1972, and the Forest (Conservation) Act 1980.",
    },
    {
      title: "3. Procedure for Decision Making",
      body: "Decisions are taken in accordance with the Office Procedure Manual and rules of business of the Government of Tripura.",
    },
    {
      title: "4. Norms set for Discharge of Functions",
      body: "Service standards are published in the Citizen's Charter of the Department.",
    },
    {
      title: "5. Rules, Regulations and Manuals",
      body: "All applicable rules, instructions and manuals are listed and available for download.",
    },
    {
      title: "6. Directory of Officers",
      body: "Refer to the Official Directory under the About Us section.",
    },
  ];

  return (
    <PageLayout>
      <PageHeader title="Right to Information (RTI)" subtitle="Information disclosed under Section 4(1)(b) of the RTI Act, 2005" breadcrumb={["Home", "RTI"]} />
      <section className="py-10">
        <div className="gov-container grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {sections.map(s => (
              <article key={s.title} className="bg-card border border-border rounded-md p-5 shadow-card">
                <h3 className="font-semibold text-primary">{s.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{s.body}</p>
              </article>
            ))}
          </div>
          <aside className="space-y-4">
            <div className="bg-primary text-primary-foreground rounded-md p-5">
              <h3 className="font-semibold">Public Information Officer</h3>
              <p className="text-sm opacity-90 mt-2">Shri B. Chakma, IFS<br/>CCF (Administration)<br/>Aranya Bhawan, Agartala</p>
              <p className="text-sm opacity-90 mt-2">📞 +91 381 2416480<br/>✉ pio-forest@tripura.gov.in</p>
            </div>
            <div className="bg-card border border-border rounded-md p-5">
              <h3 className="font-semibold text-primary">RTI Documents</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {["RTI Application Form", "RTI First Appeal Form", "Fee Structure", "Annual RTI Report 2024-25"].map(d => (
                  <li key={d} className="flex items-center justify-between gap-2 border-b border-border pb-2 last:border-0">
                    <span className="flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> {d}</span>
                    <button className="text-accent hover:text-accent-hover" aria-label="Download"><Download className="h-4 w-4" /></button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </PageLayout>
  );
}
