import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, Facebook, Twitter, Youtube } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { useSettings } from "@/contexts/SettingsContext";

export default function Footer() {
  const { t } = useLang();
  const { settings, visitorCount } = useSettings();
  return (
    <footer className="bg-primary-dark text-primary-foreground mt-16">
      <div className="gov-container py-12 md:py-14 grid gap-10 md:gap-12 sm:grid-cols-2 lg:grid-cols-4">
        {/* Left column removed per layout update */}

        <div>
          <h3 className="text-base font-semibold mb-4 text-accent">
            {t("footer.quicklinks")}
          </h3>
          <ul className="space-y-2.5 text-sm">
            {[
              ["About PROJECT ELEMENT", "/about"],
              ["Project Components", "/project-components"],
              ["Reports", "/reports"],
              ["MIS / GIS", "/mis-gis"],
              ["Activities & Outputs", "/activities"],
              ["Contact Us", "/contact"],
            ].map(([l, h]) => (
              <li key={h}>
                <Link
                  to={h}
                  className="opacity-90 hover:opacity-100 hover:text-accent"
                >
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-base font-semibold mb-4 text-accent">
            {t("footer.policies")}
          </h3>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link to="/disclaimer" className="opacity-90 hover:text-accent">
                Disclaimer
              </Link>
            </li>
            <li>
              <Link
                to="/privacy-policy"
                className="opacity-90 hover:text-accent"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms-of-use" className="opacity-90 hover:text-accent">
                Terms &amp; Conditions
              </Link>
            </li>
            <li>
              <Link
                to="/hyperlinking-policy"
                className="opacity-90 hover:text-accent"
              >
                Hyperlinking Policy
              </Link>
            </li>
            <li>
              <Link
                to="/copyright-policy"
                className="opacity-90 hover:text-accent"
              >
                Copyright Policy
              </Link>
            </li>
            <li>
              <Link
                to="/accessibility"
                className="opacity-90 hover:text-accent"
              >
                Accessibility Statement
              </Link>
            </li>
            <li>
              <Link
                to="/screen-reader"
                className="opacity-90 hover:text-accent"
              >
                Screen Reader Access
              </Link>
            </li>
            <li>
              <Link to="/help" className="opacity-90 hover:text-accent">
                Help
              </Link>
            </li>
            <li>
              <Link to="/sitemap" className="opacity-90 hover:text-accent">
                Sitemap
              </Link>
            </li>
            <li>
              <Link to="/feedback" className="opacity-90 hover:text-accent">
                Feedback
              </Link>
            </li>
            <li>
              <Link to="/archive" className="opacity-90 hover:text-accent">
                Archive
              </Link>
            </li>
            <li>
              <Link to="/grievance" className="opacity-90 hover:text-accent">
                Grievance Redressal
              </Link>
            </li>
            <li>
              <Link to="/rti" className="opacity-90 hover:text-accent">
                RTI
              </Link>
            </li>
            <li>
              <a
                href="https://www.india.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-90 hover:text-accent"
              >
                National Portal of India ↗
              </a>
            </li>
          </ul>
        </div>

        {/* Connect section with address, contact & social */}
        <div>
          <h3 className="text-base font-semibold mb-4 text-accent">
            {t("footer.connect")}
          </h3>
          <div className="space-y-3 text-sm opacity-90">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-accent" />{" "}
              {settings.office_address}
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-accent" /> {settings.contact_phone}
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-accent" />{" "}
              {settings.contact_email}
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <a
              href="#"
              aria-label="Facebook"
              className="p-2 bg-primary rounded-md hover:bg-accent"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="p-2 bg-primary rounded-md hover:bg-accent"
            >
              <Twitter className="h-4 w-4" />
            </a>
            <a
              href="#"
              aria-label="YouTube"
              className="p-2 bg-primary rounded-md hover:bg-accent"
            >
              <Youtube className="h-4 w-4" />
            </a>
          </div>
          <div className="mt-4 text-xs opacity-80">
            {t("footer.visitor")}:{" "}
            <span className="font-semibold text-accent">
              {visitorCount.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="mt-2 text-xs opacity-80">
            {t("footer.lastUpdated")}:{" "}
            {settings.last_updated_at
              ? new Date(settings.last_updated_at).toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
              : "28 April 2026"}
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold mb-4 text-accent">
            Useful Links
          </h3>
          <ul className="space-y-2.5 text-sm">
            <li>
              <a
                href="https://tripura.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover:text-accent underline-offset-2 hover:underline"
              >
                Government of Tripura ↗
              </a>
            </li>
            <li>
              <a
                href="https://forest.tripura.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover:text-accent underline-offset-2 hover:underline"
              >
                Tripura Forest Department ↗
              </a>
            </li>
            <li>
              <a
                href="https://jica.tripura.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover:text-accent underline-offset-2 hover:underline"
              >
                JICA Tripura ↗
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary/40 bg-primary/95">
        <div className="gov-container py-3 text-sm flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-center flex-wrap">
          <Phone className="h-4 w-4 text-accent" />
          <span className="font-semibold">{t("common.helpline")}:</span>
          <span>{settings.helpline_number}</span>
          <span className="hidden sm:inline opacity-60">|</span>
          <span className="opacity-90">{t("common.helplineHours")}</span>
          <span className="hidden sm:inline opacity-60">|</span>
          <a
            href="https://pgportal.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold hover:text-accent underline-offset-2 hover:underline"
          >
            CPGRAMS ↗
          </a>
        </div>
      </div>

      <div className="border-t border-primary/40 bg-primary">
        <div className="gov-container py-4 px-4 sm:px-6 lg:px-10 text-xs opacity-90 flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
          <div className="md:text-left">
            © 2026 ELEMENT – Government of Tripura &amp; The World Bank. All
            rights reserved.
          </div>
          <div className="md:text-right">{t("footer.designed")}</div>
        </div>
      </div>
    </footer>
  );
}
