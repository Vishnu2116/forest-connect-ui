import { useEffect, useState } from "react";
import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import { useToast } from "@/hooks/use-toast";
import { fetchCaptcha, submitPublicForm, honeypotStyle, Captcha } from "@/lib/publicForms";

const categories: { label: string; value: string }[] = [
  { label: "General", value: "general" },
  { label: "Website Issue", value: "website_issue" },
  { label: "Content Suggestion", value: "content_suggestion" },
  { label: "Accessibility", value: "accessibility" },
  { label: "Project Information", value: "project_information" },
  { label: "Other", value: "other" },
];

export default function Feedback() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [category, setCategory] = useState("general");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [captcha, setCaptcha] = useState<Captcha | null>(null);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const loadCaptcha = async () => {
    try {
      const c = await fetchCaptcha("feedback");
      setCaptcha(c);
      setCaptchaAnswer("");
    } catch {
      setCaptcha(null);
    }
  };

  useEffect(() => {
    loadCaptcha();
  }, []);

  const resetForm = () => {
    setName("");
    setEmail("");
    setMobile("");
    setCategory("general");
    setMessage("");
    setHoneypot("");
    setCaptchaAnswer("");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setCaptchaError(null);
    setFormError(null);
    try {
      const { ok, status, data } = await submitPublicForm("feedback", {
        name,
        email,
        mobile,
        category,
        message,
        honeypot,
        captcha_token: captcha?.token,
        captcha_answer: captchaAnswer,
      });
      if (ok) {
        toast({
          title: "Thank you for your feedback",
          description: "Your response has been recorded. We'll get back to you if needed.",
        });
        resetForm();
        loadCaptcha();
      } else if (status === 422) {
        const msg = data?.error || data?.message || "Validation error";
        const isCaptcha = /captcha/i.test(msg) || data?.field === "captcha";
        if (isCaptcha) {
          setCaptchaError(msg);
          loadCaptcha();
        } else {
          setFormError(msg);
        }
      } else {
        setFormError("Something went wrong, please try again.");
      }
    } catch {
      setFormError("Something went wrong, please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <PageHeader
        title="Feedback"
        subtitle="We value your suggestions. Please share your feedback to help us improve the ELEMENT portal."
        breadcrumb={["Home", "Feedback"]}
      />
      <section className="py-10">
        <div className="gov-container max-w-3xl">
          <form onSubmit={onSubmit} className="bg-card border border-border rounded-md p-6 md:p-8 space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="fb-name" className="block text-sm font-semibold text-foreground mb-1.5">
                  Name <span className="text-destructive">*</span>
                </label>
                <input
                  id="fb-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={100}
                  className="w-full border border-input rounded px-3 py-2 text-sm bg-background focus-ring"
                />
              </div>
              <div>
                <label htmlFor="fb-email" className="block text-sm font-semibold text-foreground mb-1.5">
                  Email <span className="text-destructive">*</span>
                </label>
                <input
                  id="fb-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  maxLength={120}
                  className="w-full border border-input rounded px-3 py-2 text-sm bg-background focus-ring"
                />
              </div>
              <div>
                <label htmlFor="fb-mobile" className="block text-sm font-semibold text-foreground mb-1.5">
                  Mobile Number
                </label>
                <input
                  id="fb-mobile"
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  pattern="[0-9+\- ]{6,15}"
                  className="w-full border border-input rounded px-3 py-2 text-sm bg-background focus-ring"
                />
              </div>
              <div>
                <label htmlFor="fb-cat" className="block text-sm font-semibold text-foreground mb-1.5">
                  Feedback Category <span className="text-destructive">*</span>
                </label>
                <select
                  id="fb-cat"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full border border-input rounded px-3 py-2 text-sm bg-background focus-ring"
                >
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="fb-msg" className="block text-sm font-semibold text-foreground mb-1.5">
                Message <span className="text-destructive">*</span>
              </label>
              <textarea
                id="fb-msg"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                minLength={5}
                maxLength={1000}
                rows={5}
                className="w-full border border-input rounded px-3 py-2 text-sm bg-background focus-ring"
              />
              <p className="text-xs text-muted-foreground mt-1">Maximum 1000 characters.</p>
            </div>

            {/* Honeypot */}
            <div style={honeypotStyle} aria-hidden="true">
              <label>
                Website
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                {captcha ? `What is ${captcha.question}?` : "Loading captcha..."}{" "}
                <span className="text-destructive">*</span>
              </label>
              <input
                value={captchaAnswer}
                onChange={(e) => setCaptchaAnswer(e.target.value)}
                required
                inputMode="numeric"
                disabled={!captcha}
                className="w-full sm:w-48 border border-input rounded px-3 py-2 text-sm bg-background focus-ring"
              />
              {captchaError && <p className="text-xs text-destructive mt-1">{captchaError}</p>}
            </div>

            {formError && <p className="text-sm text-destructive">{formError}</p>}

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={submitting || !captcha}
                className="bg-accent hover:bg-accent-hover text-accent-foreground px-5 py-2 rounded text-sm font-semibold disabled:opacity-60"
              >
                {submitting ? "Submitting…" : "Submit Feedback"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="border border-border px-5 py-2 rounded text-sm font-semibold hover:bg-surface"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </section>
    </PageLayout>
  );
}
