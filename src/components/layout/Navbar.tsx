import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X, Globe, Lock } from "lucide-react";
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
            <Link to="/admin/login" className="hover:underline flex items-center gap-1">
              <Lock className="h-3 w-3" /> Admin Login
            </Link>
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
        <div className="gov-container py-3 md:py-4">
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 md:gap-6">
            {/* Left: Tripura emblem + label */}
            <Link to="/" className="flex items-center gap-2 md:gap-3 min-w-0">
              <img src={logoTripura} alt="Government of Tripura emblem" className="h-14 w-14 md:h-20 md:w-20 shrink-0" width={80} height={80} />
              <div className="hidden sm:block leading-tight">
                <div className="text-sm md:text-base text-foreground/80">Government of</div>
                <div className="text-xl md:text-3xl font-extrabold text-primary tracking-tight -mt-0.5">Tripura</div>
                <div className="text-[11px] md:text-xs text-primary/80 font-medium mt-0.5">ত্রিপুরা সরকার</div>
              </div>
            </Link>

            {/* Center: ELEMENT title */}
            <div className="text-center min-w-0">
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-primary tracking-wide leading-none">ELEMENT</h1>
              <p className="mt-1 md:mt-2 text-xs sm:text-sm md:text-base font-semibold text-foreground/80">
                {t("site.full")}
              </p>
              <div className="mx-auto mt-1 md:mt-2 max-w-md border-t border-border pt-1 md:pt-1.5">
                <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground italic">
                  A Joint Initiative of Government of Tripura and The World Bank
                </p>
              </div>
            </div>

            {/* Right: World Bank logo + label */}
            <div className="hidden md:flex items-center gap-2 md:gap-3 shrink-0">
              <img src={logoWorldBank} alt="The World Bank logo" className="h-14 md:h-20 w-auto" width={80} height={80} />
              <div className="leading-tight">
                <div className="text-lg md:text-2xl font-extrabold text-primary tracking-tight">THE WORLD BANK</div>
                <div className="text-[10px] md:text-xs text-muted-foreground tracking-wider">IBRD · IDA  |  WORLD BANK GROUP</div>
              </div>
            </div>

            {/* Mobile menu */}
            <button
              className="lg:hidden p-2 rounded-md border border-border focus-ring justify-self-end"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
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
