import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
/*
import { useEffect, useState } from "react";
import { fetchMapKey } from "@/lib/gis";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";
import { fetchCaptcha, submitPublicForm, honeypotStyle, Captcha } from "@/lib/publicForms";
*/

export default function Contact() {
  /*
  const { toast } = useToast();
  const [mapKey, setMapKey] = useState<string | null>(null);
  const [mapMsg, setMapMsg] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [captcha, setCaptcha] = useState<Captcha | null>(null);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMapKey().then((key) => {
      if (key) setMapKey(key);
      else setMapMsg("Map key unavailable.");
    });
  }, []);

  const loadCaptcha = async () => {
    try {
      const c = await fetchCaptcha("contact");
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
    setSubject("");
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
      const { ok, status, data } = await submitPublicForm("contact", {
        name,
        email,
        subject,
        message,
        honeypot,
        captcha_token: captcha?.token,
        captcha_answer: captchaAnswer,
      });
      if (ok) {
        toast({ title: "Message sent", description: "Thank you — we'll get back to you soon." });
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
  */

  const cards = [
    { icon: MapPin, title: "Address", body: "Aranya Bhawan, Gurkhabasti\nAgartala, Tripura — 799006" },
    { icon: Phone, title: "Phone", body: "+91 381 2416403\nHelpline: 1800-345-3666" },
    { icon: Mail, title: "Email", body: "info-forest@tripura.gov.in\npio-forest@tripura.gov.in" },
  ];

  return (
    <PageLayout>
      <PageHeader
        title="Contact Us"
        subtitle="Reach out to the Tripura Forest Department"
        breadcrumb={["Home", "Contact Us"]}
      />
      <section className="py-10">
        <div className="gov-container space-y-8">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-md p-6 shadow-card">
              <h2 className="section-title mb-6">Get in Touch</h2>
              <div className="space-y-6">
                <div className="space-y-3">
                  <p className="text-foreground">
                    For any queries, please reach out to us at:
                  </p>
                  <a
                    href="mailto:elementtripuraforest@gmail.com"
                    className="inline-block text-lg sm:text-xl font-semibold text-primary hover:text-primary/80 underline underline-offset-4 break-all"
                  >
                    elementtripuraforest@gmail.com
                  </a>
                </div>

                <div className="border-t border-border pt-5 space-y-5">
                  {cards.map((c) => (
                    <div key={c.title} className="flex items-start gap-4">
                      <div className="p-2.5 bg-primary/10 text-primary rounded shrink-0">
                        <c.icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-primary">{c.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">{c.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/*
              Previous contact form implementation:
              <form className="grid md:grid-cols-2 gap-4" onSubmit={onSubmit}>
                <input
                  className="border border-input rounded px-3 py-2 text-sm bg-background focus-ring"
                  placeholder="Your Name *"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={100}
                />
                <input
                  className="border border-input rounded px-3 py-2 text-sm bg-background focus-ring"
                  placeholder="Email *"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  maxLength={200}
                />
                <input
                  className="md:col-span-2 border border-input rounded px-3 py-2 text-sm bg-background focus-ring"
                  placeholder="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  maxLength={200}
                />
                <textarea
                  rows={5}
                  className="md:col-span-2 border border-input rounded px-3 py-2 text-sm bg-background focus-ring"
                  placeholder="Your Message *"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  maxLength={2000}
                />

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

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    {captcha ? `What is ${captcha.question}?` : "Loading captcha..."}{" "}
                    <span className="text-destructive">*</span>
                  </label>
                  <input
                    className="w-full sm:w-48 border border-input rounded px-3 py-2 text-sm bg-background focus-ring"
                    value={captchaAnswer}
                    onChange={(e) => setCaptchaAnswer(e.target.value)}
                    required
                    inputMode="numeric"
                    disabled={!captcha}
                  />
                  {captchaError && (
                    <p className="text-xs text-destructive mt-1">{captchaError}</p>
                  )}
                </div>

                {formError && (
                  <p className="md:col-span-2 text-sm text-destructive">{formError}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting || !captcha}
                  className="md:col-span-2 inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-accent-foreground px-5 py-2.5 rounded font-semibold w-fit disabled:opacity-60"
                >
                  <Send className="h-4 w-4" /> {submitting ? "Sending…" : "Send Message"}
                </button>
              </form>
              */}
            </div>

            <div>
              <h2 className="section-title mb-4">Find us on the map</h2>
              <div className="relative w-full h-[420px] rounded-md overflow-hidden border border-border bg-surface shadow-card">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3648.9639287640216!2d91.2800762!3d23.855414599999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3753f6a83bf72e67%3A0xe9d268c4fbbfd3d5!2sAranya%20Bhawan!5e0!3m2!1sen!2sin!4v1784638274309!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
                {/*
                Previous Google Maps JavaScript API / Embed API with key implementation:
                const [mapKey, setMapKey] = useState<string | null>(null);
                const [mapMsg, setMapMsg] = useState<string | null>(null);

                useEffect(() => {
                  fetchMapKey().then((key) => {
                    if (key) setMapKey(key);
                    else setMapMsg("Map key unavailable.");
                  });
                }, []);

                {mapKey ? (
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps/embed/v1/place?key=${mapKey}&q=Aranya+Bhawan,Agartala&center=23.8554146,91.2800762&zoom=16`}
                  />
                ) : null}
                {mapMsg && (
                  <div className="absolute bottom-3 left-3 bg-card/95 backdrop-blur px-3 py-2 rounded shadow-card text-[11px] text-muted-foreground">
                    {mapMsg}
                  </div>
                )}
                */}
              </div>
              <div className="mt-3 text-xs text-muted-foreground flex items-center gap-2">
                <Clock className="h-3.5 w-3.5" /> Office Hours: Mon–Fri, 10:00 AM – 5:00 PM
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((c) => (
              <div key={c.title} className="bg-card border border-border rounded-md p-5 shadow-card flex items-start gap-4">
                <div className="p-2.5 bg-primary/10 text-primary rounded shrink-0">
                  <c.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-primary">{c.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">{c.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
