import { useState } from "react";
import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import { useToast } from "@/hooks/use-toast";

const categories = ["General", "Website Issue", "Content Suggestion", "Accessibility", "Project Information", "Other"];

export default function Feedback() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      (e.target as HTMLFormElement).reset();
      toast({ title: "Thank you for your feedback", description: "Your response has been recorded. We'll get back to you if needed." });
    }, 600);
  };

  return (
    <PageLayout>
      <PageHeader title="Feedback" subtitle="We value your suggestions. Please share your feedback to help us improve the ELEMENT portal." breadcrumb={["Home", "Feedback"]} />
      <section className="py-10">
        <div className="gov-container max-w-3xl">
          <form onSubmit={onSubmit} className="bg-card border border-border rounded-md p-6 md:p-8 space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="fb-name" className="block text-sm font-semibold text-foreground mb-1.5">Name <span className="text-destructive">*</span></label>
                <input id="fb-name" name="name" required maxLength={100} className="w-full border border-input rounded px-3 py-2 text-sm bg-background focus-ring" />
              </div>
              <div>
                <label htmlFor="fb-email" className="block text-sm font-semibold text-foreground mb-1.5">Email <span className="text-destructive">*</span></label>
                <input id="fb-email" name="email" type="email" required maxLength={120} className="w-full border border-input rounded px-3 py-2 text-sm bg-background focus-ring" />
              </div>
              <div>
                <label htmlFor="fb-mobile" className="block text-sm font-semibold text-foreground mb-1.5">Mobile Number</label>
                <input id="fb-mobile" name="mobile" type="tel" pattern="[0-9+\- ]{6,15}" className="w-full border border-input rounded px-3 py-2 text-sm bg-background focus-ring" />
              </div>
              <div>
                <label htmlFor="fb-cat" className="block text-sm font-semibold text-foreground mb-1.5">Feedback Category <span className="text-destructive">*</span></label>
                <select id="fb-cat" name="category" required className="w-full border border-input rounded px-3 py-2 text-sm bg-background focus-ring">
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="fb-msg" className="block text-sm font-semibold text-foreground mb-1.5">Message <span className="text-destructive">*</span></label>
              <textarea id="fb-msg" name="message" required minLength={5} maxLength={1000} rows={5} className="w-full border border-input rounded px-3 py-2 text-sm bg-background focus-ring" />
              <p className="text-xs text-muted-foreground mt-1">Maximum 1000 characters.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="submit" disabled={submitting} className="bg-accent hover:bg-accent-hover text-accent-foreground px-5 py-2 rounded text-sm font-semibold disabled:opacity-60">
                {submitting ? "Submitting…" : "Submit Feedback"}
              </button>
              <button type="reset" className="border border-border px-5 py-2 rounded text-sm font-semibold hover:bg-surface">Reset</button>
            </div>
          </form>
        </div>
      </section>
    </PageLayout>
  );
}
