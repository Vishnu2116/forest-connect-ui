import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import { CheckCircle2 } from "lucide-react";

const items = [
  "Compliant with the Guidelines for Indian Government Websites (GIGW 3.0).",
  "Aligned with the Web Content Accessibility Guidelines (WCAG) 2.1 — Level AA where feasible.",
  "Fully responsive across desktop, tablet and mobile devices.",
  "Keyboard navigable interface with visible focus indicators.",
  "Compatible with widely used screen readers such as NVDA, JAWS and VoiceOver.",
  "Adjustable text size (A-, A, A+) and a high-contrast theme for low-vision users.",
  "Multi-language support — English, Bengali (বাংলা) and Kokborok.",
  "Meaningful alt text for informative images; decorative images marked appropriately.",
  "Semantic HTML structure with proper headings, landmarks and ARIA labels.",
];

export default function Accessibility() {
  return (
    <PageLayout>
      <PageHeader title="Accessibility Statement" subtitle="Our commitment to an inclusive, accessible web experience for every citizen." breadcrumb={["Home", "Accessibility Statement"]} />
      <section className="py-10">
        <div className="gov-container max-w-4xl space-y-6">
          <p className="text-sm text-foreground/80 leading-relaxed">
            The ELEMENT portal is committed to ensuring digital accessibility for people of all abilities. The site has been designed and developed in alignment with the
            <strong> Guidelines for Indian Government Websites (GIGW 3.0)</strong> and globally recognized accessibility standards.
          </p>

          <div className="bg-card border border-border rounded-md p-6">
            <h2 className="text-lg font-bold text-primary mb-4">Accessibility Features</h2>
            <ul className="space-y-3">
              {items.map((it) => (
                <li key={it} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-surface border-l-4 border-accent p-5 rounded-r-md">
            <h3 className="text-base font-semibold text-primary mb-2">Feedback</h3>
            <p className="text-sm text-foreground/80">
              If you face any difficulty accessing content on this portal, please write to us at
              <a href="mailto:info@element.tripura.gov.in" className="text-accent font-semibold hover:underline"> info@element.tripura.gov.in</a> or use the
              <a href="/feedback" className="text-accent font-semibold hover:underline"> feedback form</a>. We endeavour to respond within 7 working days.
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
