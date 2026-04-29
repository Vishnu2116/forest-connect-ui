import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import { Send, AlertCircle } from "lucide-react";

export default function Grievance() {
  return (
    <PageLayout>
      <PageHeader title="Grievance Redressal" subtitle="Submit your grievance to the Department" breadcrumb={["Home", "Grievance"]} />
      <section className="py-10">
        <div className="gov-container grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-card border border-border rounded-md p-6 shadow-card">
            <h2 className="section-title mb-6">Submit a Grievance</h2>
            <form className="grid md:grid-cols-2 gap-4" onSubmit={(e) => e.preventDefault()}>
              <Field label="Full Name *"><input className="form-input" placeholder="Enter your full name" /></Field>
              <Field label="Email *"><input type="email" className="form-input" placeholder="you@example.com" /></Field>
              <Field label="Mobile Number"><input className="form-input" placeholder="+91" /></Field>
              <Field label="District">
                <select className="form-input"><option>Select district</option><option>West Tripura</option><option>Sepahijala</option><option>Khowai</option><option>Gomati</option><option>South Tripura</option><option>Dhalai</option><option>Unakoti</option><option>North Tripura</option></select>
              </Field>
              <Field label="Category" full>
                <select className="form-input"><option>Forest Encroachment</option><option>Wildlife Issue</option><option>Plantation Concern</option><option>Service Matter</option><option>Other</option></select>
              </Field>
              <Field label="Subject *" full><input className="form-input" placeholder="Brief subject of your grievance" /></Field>
              <Field label="Details *" full>
                <textarea rows={6} className="form-input" placeholder="Describe your grievance in detail" />
              </Field>
              <Field label="Attachments (optional)" full>
                <input type="file" className="form-input file:mr-3 file:bg-primary file:text-primary-foreground file:border-0 file:px-3 file:py-1 file:rounded" />
              </Field>
              <div className="md:col-span-2 flex items-center gap-3 mt-2">
                <button className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-accent-foreground px-5 py-2.5 rounded font-semibold focus-ring">
                  <Send className="h-4 w-4" /> Submit Grievance
                </button>
                <button type="reset" className="px-5 py-2.5 rounded font-semibold border border-border hover:bg-surface">Reset</button>
              </div>
            </form>
          </div>

          <aside className="space-y-4">
            <div className="bg-primary text-primary-foreground rounded-md p-5">
              <h3 className="font-semibold flex items-center gap-2"><AlertCircle className="h-5 w-5 text-accent" /> Quick Help</h3>
              <p className="text-sm opacity-90 mt-2">For urgent wildlife or forest emergencies, please call the toll-free helpline.</p>
              <div className="mt-3 text-2xl font-bold text-accent">1800-345-3666</div>
            </div>
            <div className="bg-card border border-border rounded-md p-5">
              <h3 className="font-semibold text-primary">How it works</h3>
              <ol className="mt-3 text-sm space-y-2 text-muted-foreground list-decimal list-inside">
                <li>Submit your grievance via this form.</li>
                <li>Receive acknowledgement number on email/SMS.</li>
                <li>Track status using the acknowledgement number.</li>
                <li>Resolution within 30 working days.</li>
              </ol>
            </div>
          </aside>
        </div>
      </section>
    </PageLayout>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`block text-sm ${full ? "md:col-span-2" : ""}`}>
      <span className="font-medium text-foreground">{label}</span>
      <div className="mt-1 [&>*]:w-full [&>*]:border [&>*]:border-input [&>*]:rounded [&>*]:px-3 [&>*]:py-2 [&>*]:text-sm [&>*]:bg-background">
        {children}
      </div>
    </label>
  );
}
