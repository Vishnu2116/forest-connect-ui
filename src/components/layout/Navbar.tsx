import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X, Phone, Globe, Lock } from "lucide-react";
import { navItems } from "@/data/navigation";
import { useLang, LANGUAGES } from "@/contexts/LanguageContext";
import logoTripura from "@/assets/logo-tripura.png";
import logoWorldBank from "@/assets/logo-worldbank.png";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileSubOpen, setMobileSubOpen] = useState<string | null>(null);
  const [langOpen, setLangOpen] = useState(false);
  const { pathname } = useLocation();
  const { t, lang, setLang } = useLang();

  const isActive = (to?: string) => to && (to === "/" ? pathname === "/" : pathname.startsWith(to));
  const currentLangLabel = LANGUAGES.find((l) => l.code === lang)?.label ?? "English";

  return (
    <header className="sticky top-0 z-50 shadow-card">
      {/* Top utility bar */}
      <div className="bg-primary-dark text-primary-foreground text-xs">
        <div className="gov-container flex items-center justify-between h-9">
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">{t("site.partners")}</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#main" className="hover:underline hidden sm:inline">{t("common.skipMain")}</a>
            <span className="hidden sm:inline opacity-70">|</span>
            <button className="hover:underline" aria-label="Decrease font">A-</button>
            <button className="hover:underline" aria-label="Reset font">A</button>
            <button className="hover:underline" aria-label="Increase font">A+</button>
            <span className="opacity-70">|</span>
            <div className="relative">
              <button
                onClick={() => setLangOpen((v) => !v)}
                onBlur={() => setTimeout(() => setLangOpen(false), 150)}
                className="flex items-center gap-1 hover:underline focus-ring"
                aria-haspopup="listbox"
                aria-expanded={langOpen}
              >
                <Globe className="h-3.5 w-3.5" />
                <span>{currentLangLabel}</span>
                <ChevronDown className="h-3 w-3" />
              </button>
              {langOpen && (
                <ul className="absolute right-0 top-full mt-1 bg-background text-foreground rounded-md shadow-elevated border border-border min-w-[140px] z-50">
                  {LANGUAGES.map((l) => (
                    <li key={l.code}>
                      <button
                        onClick={() => { setLang(l.code); setLangOpen(false); }}
                        className={`w-full text-left px-3 py-2 text-xs hover:bg-surface ${lang === l.code ? "bg-surface text-primary font-semibold" : ""}`}
                      >
                        {l.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Brand band — joint stakeholder identity */}
      <div className="bg-background border-b border-border">
        <div className="gov-container flex items-center justify-between py-3 gap-4">
          <Link to="/" className="flex items-center gap-3 md:gap-4">
            <img src={logoTripura} alt="Government of Tripura emblem" className="h-12 w-12 md:h-14 md:w-14 shrink-0" width={56} height={56} />
            <div className="border-l border-border pl-3 md:pl-4">
              <img src={logoElement} alt="ELEMENT Project logo" className="h-8 md:h-10 w-auto -mb-1" width={120} height={40} />
              <div className="hidden sm:block text-[11px] md:text-xs text-muted-foreground leading-tight mt-0.5">
                {t("site.full")}
              </div>
              <div className="text-[10px] md:text-[11px] text-primary/80 font-medium mt-0.5">
                {t("site.implementer")}
              </div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            <img src={logoWorldBank} alt="The World Bank logo" className="h-12 lg:h-14 w-auto" width={56} height={56} />
            <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground border-l border-border pl-4">
              <Phone className="h-4 w-4 text-primary" />
              <span>{t("common.helpline")}: 1800-345-3666</span>
            </div>
            <button className="ml-1 p-2 rounded-md border border-border hover:bg-surface focus-ring" aria-label={t("common.search")}>
              <Search className="h-4 w-4 text-primary" />
            </button>
          </div>

          <button
            className="lg:hidden p-2 rounded-md border border-border focus-ring"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Main nav */}
      <nav className="bg-primary text-primary-foreground hidden lg:block">
        <div className="gov-container">
          <ul className="flex items-center">
            {navItems.map((item) => (
              <li
                key={item.labelKey}
                className="relative"
                onMouseEnter={() => item.children && setOpenDropdown(item.labelKey)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                {item.children ? (
                  <button
                    className={`flex items-center gap-1 px-3 py-3 text-sm font-medium hover:bg-primary-dark transition-colors ${
                      item.children.some((c) => isActive(c.to)) ? "bg-primary-dark" : ""
                    }`}
                  >
                    {t(item.labelKey)}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <NavLink
                    to={item.to!}
                    className={({ isActive: a }) =>
                      `block px-3 py-3 text-sm font-medium hover:bg-primary-dark transition-colors ${
                        a ? "bg-primary-dark border-b-2 border-accent" : ""
                      }`
                    }
                    end={item.to === "/"}
                  >
                    {t(item.labelKey)}
                  </NavLink>
                )}
                {item.children && openDropdown === item.labelKey && (
                  <div className="absolute left-0 top-full min-w-[260px] bg-background text-foreground shadow-elevated border border-border rounded-b-md overflow-hidden animate-fade-in">
                    {item.children.map((c) => (
                      <NavLink
                        key={c.to}
                        to={c.to}
                        className={({ isActive: a }) =>
                          `block px-4 py-2.5 text-sm hover:bg-surface hover:text-primary border-l-2 ${
                            a ? "border-accent text-primary bg-surface" : "border-transparent"
                          }`
                        }
                      >
                        {c.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="lg:hidden bg-primary text-primary-foreground max-h-[70vh] overflow-y-auto">
          <ul className="divide-y divide-primary-dark">
            {navItems.map((item) => (
              <li key={item.labelKey}>
                {item.children ? (
                  <>
                    <button
                      className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium"
                      onClick={() => setMobileSubOpen(mobileSubOpen === item.labelKey ? null : item.labelKey)}
                    >
                      {t(item.labelKey)}
                      <ChevronDown className={`h-4 w-4 transition-transform ${mobileSubOpen === item.labelKey ? "rotate-180" : ""}`} />
                    </button>
                    {mobileSubOpen === item.labelKey && (
                      <ul className="bg-primary-dark">
                        {item.children.map((c) => (
                          <li key={c.to}>
                            <NavLink
                              to={c.to}
                              onClick={() => setMobileOpen(false)}
                              className="block px-8 py-2.5 text-sm hover:bg-primary"
                            >
                              {c.label}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <NavLink
                    to={item.to!}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 text-sm font-medium"
                  >
                    {t(item.labelKey)}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
