import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Menu,
  X,
  Globe,
  Lock,
  Search,
  Contrast,
  Map as MapIcon,
  Eye,
} from "lucide-react";
import { navItems } from "@/data/navigation";
import { useLang, LANGUAGES } from "@/contexts/LanguageContext";
import { useA11y } from "@/contexts/AccessibilityContext";
import logoTripura from "@/assets/logo-tripura.png";
import logoWorldBank from "@/assets/logo-worldbank.png";
import logoForest from "@/assets/logo.png";
import logoElement from "@/assets/logo-element.png";
import cmImage from "@/assets/dignitaries/CM.jpeg";
import ministerImage from "@/assets/dignitaries/Animesh.jpeg";
import logoTheWorldBank from "@/assets/logo-theworldbank.jpg";
import logoTripuraForestDept from "@/assets/logo-tripuraforestdept.png";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileSubOpen, setMobileSubOpen] = useState<string | null>(null);
  const [langOpen, setLangOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t, lang, setLang } = useLang();
  const {
    increaseFont,
    decreaseFont,
    resetFont,
    highContrast,
    toggleHighContrast,
  } = useA11y();

  const isActive = (to?: string) =>
    to && (to === "/" ? pathname === "/" : pathname.startsWith(to));
  const isDropdownActive = (item: (typeof navItems)[0]) =>
    item.children?.some((c) => pathname.startsWith(c.to));
  const currentLangLabel =
    LANGUAGES.find((l) => l.code === lang)?.label ?? "English";

  return (
    <header className="sticky top-0 z-50 shadow-card">
      <a href="#main" className="skip-link focus-ring">
        {t("common.skipMain")}
      </a>
      {/* Top utility bar */}
      <div className="bg-primary-dark text-primary-foreground text-xs">
        <div className="gov-container flex items-center justify-between gap-2 h-9">
          <div className="flex items-center gap-3 min-w-0">
            <span className="hidden md:inline truncate">
              {t("site.partners")}
            </span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <a
              href="#main"
              className="hover:underline focus-ring px-1 hidden md:inline"
            >
              {t("common.skipMain")}
            </a>
            <span className="hidden md:inline opacity-50">|</span>
            <Link
              to="/screen-reader"
              className="hover:underline focus-ring px-1 hidden md:inline-flex items-center gap-1"
              aria-label="Screen Reader Access"
            >
              <Eye className="h-3 w-3" /> Screen Reader
            </Link>
            <span className="hidden md:inline opacity-50">|</span>
            <div
              className="flex items-center gap-0.5"
              role="group"
              aria-label="Text size"
            >
              <button
                onClick={decreaseFont}
                aria-label="Decrease text size"
                className="px-1.5 hover:bg-primary rounded focus-ring text-[11px]"
              >
                A-
              </button>
              <button
                onClick={resetFont}
                aria-label="Reset text size"
                className="px-1.5 hover:bg-primary rounded focus-ring text-[12px]"
              >
                A
              </button>
              <button
                onClick={increaseFont}
                aria-label="Increase text size"
                className="px-1.5 hover:bg-primary rounded focus-ring text-[14px]"
              >
                A+
              </button>
            </div>
            <span className="opacity-50">|</span>
            <button
              onClick={toggleHighContrast}
              aria-pressed={highContrast}
              aria-label="Toggle high contrast"
              className="p-1 hover:bg-primary rounded focus-ring"
              title="High contrast"
            >
              <Contrast className="h-3.5 w-3.5" />
            </button>
            <span className="hidden sm:inline opacity-50">|</span>
            <Link
              to="/sitemap"
              className="hover:underline focus-ring px-1 hidden sm:inline-flex items-center gap-1"
              aria-label="Sitemap"
            >
              <MapIcon className="h-3 w-3" /> Sitemap
            </Link>
            <span className="hidden sm:inline opacity-50">|</span>
            <button
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search"
              aria-expanded={searchOpen}
              className="p-1 hover:bg-primary rounded focus-ring"
            >
              <Search className="h-3.5 w-3.5" />
            </button>
            <span className="hidden sm:inline opacity-50">|</span>
            <Link
              to="/admin/login"
              className="hover:underline focus-ring px-1 hidden sm:inline-flex items-center gap-1"
            >
              <Lock className="h-3 w-3" /> {t("common.adminLogin")}
            </Link>
            <span className="hidden sm:inline opacity-50">|</span>
            <div className="relative">
              <button
                onClick={() => setLangOpen((v) => !v)}
                onBlur={() => setTimeout(() => setLangOpen(false), 150)}
                className="flex items-center gap-1 hover:underline focus-ring px-1"
                aria-haspopup="listbox"
                aria-expanded={langOpen}
              >
                <Globe className="h-3.5 w-3.5" />
                <span className="hidden xs:inline">{currentLangLabel}</span>
                <ChevronDown className="h-3 w-3" />
              </button>
              {langOpen && (
                <ul className="absolute right-0 top-full mt-1 bg-background text-foreground rounded-md shadow-elevated border border-border min-w-[140px] z-50">
                  {LANGUAGES.map((l) => (
                    <li key={l.code}>
                      <button
                        onClick={() => {
                          setLang(l.code);
                          setLangOpen(false);
                        }}
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
        {searchOpen && (
          <div className="bg-primary border-t border-primary-dark/40">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQ.trim()) {
                  navigate(`/sitemap?q=${encodeURIComponent(searchQ.trim())}`);
                  setSearchOpen(false);
                }
              }}
              className="gov-container py-2 flex items-center gap-2"
              role="search"
            >
              <label htmlFor="site-search" className="sr-only">
                Search the portal
              </label>
              <Search className="h-4 w-4 opacity-80" />
              <input
                id="site-search"
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                placeholder="Search ELEMENT portal…"
                className="flex-1 bg-transparent border-b border-primary-foreground/40 focus:outline-none focus:border-accent text-sm py-1 placeholder:text-primary-foreground/60"
                autoFocus
              />
              <button
                type="submit"
                className="bg-accent hover:bg-accent-hover text-accent-foreground text-xs font-semibold px-3 py-1 rounded"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
                className="p-1 hover:bg-primary-dark rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Desktop layout — balanced 3-group structure */}
      <div className="hidden md:flex items-center justify-between gap-8 py-2">
        {/* Left Group — Tripura Govt + CM */}
        <div className="flex items-center justify-center gap-6 flex-1">
          {/* Tripura Govt Logo */}
          <div className="flex items-center justify-center">
            <img
              src={logoTripura}
              alt="Government of Tripura emblem"
              className="h-20 w-20 object-contain"
            />
          </div>

          {/* CM Image */}
          <div className="flex flex-col items-center justify-center">
            <img
              src={cmImage}
              alt="Hon'ble Chief Minister, Government of Tripura"
              className="h-20 w-20 rounded-full object-cover border-2 border-primary/20"
            />
            <div className="text-[10px] font-semibold text-primary mt-1 leading-tight text-center">
              Hon'ble CM
            </div>
          </div>
        </div>

        {/* Center Group — ELEMENT + World Bank */}
        <div className="flex items-center justify-center gap-6 flex-1 px-4">
          {/* ELEMENT Section */}
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-3xl lg:text-5xl font-extrabold text-primary tracking-wide leading-none">
              ELEMENT
            </h1>

            <p className="mt-2 text-xs lg:text-sm font-semibold text-foreground/80">
              {t("site.full")}
            </p>

            <div className="mx-auto mt-1.5 border-t border-border pt-1">
              <p className="text-[11px] lg:text-xs text-muted-foreground italic">
                {t("site.joint")}
              </p>
            </div>
          </div>

          {/* World Bank Logo */}
          <div className="flex items-center justify-center">
            <img
              src={logoTheWorldBank}
              alt="The World Bank logo"
              className="h-20 w-20 object-contain"
            />
          </div>
        </div>

        {/* Right Group — Forest Minister + Forest Dept */}
        <div className="flex items-center justify-center gap-6 flex-1">
          {/* Forest Minister */}
          <div className="flex flex-col items-center justify-center">
            <img
              src={ministerImage}
              alt="Hon'ble Forest & Environment Minister, Tripura"
              className="h-20 w-20 rounded-full object-cover border-2 border-primary/20"
            />
            <div className="text-[10px] font-semibold text-primary mt-1 leading-tight text-center">
              Forest Minister
            </div>
          </div>

          {/* Forest Department Logo */}
          <div className="flex items-center justify-center">
            <img
              src={logoTripuraForestDept}
              alt="Tripura Forest Department"
              className="h-20 w-20 object-contain"
            />
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 shrink-0"
            aria-label="Home"
          >
            <img
              src={logoTripura}
              alt="Government of Tripura emblem"
              className="h-12 w-12 object-contain"
            />
          </Link>

          {/* ELEMENT Title */}
          <div className="flex-1 text-center px-2">
            <h1 className="text-xl font-extrabold text-primary tracking-wide leading-none">
              ELEMENT
            </h1>
          </div>

          {/* Hamburger Button */}
          <button
            className="p-2 rounded-md border border-border focus-ring shrink-0"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Main nav — equal width and equal spacing navbar */}
      <nav className="bg-primary text-primary-foreground hidden lg:block">
        <div className="gov-container-wide">
          <ul className="flex items-stretch justify-between w-full">
            {navItems.map((item) => {
              const dropActive = isDropdownActive(item);

              return (
                <li
                  key={item.labelKey}
                  className="relative flex flex-1"
                  onMouseEnter={() =>
                    item.children && setOpenDropdown(item.labelKey)
                  }
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  {item.children ? (
                    <button
                      className={`flex items-center justify-center gap-1 w-full px-4 py-3.5 text-sm font-medium hover:bg-primary-dark transition-colors border-b-2 ${
                        dropActive
                          ? "bg-primary-dark border-accent"
                          : "border-transparent"
                      }`}
                    >
                      {t(item.labelKey)}

                      <ChevronDown className="h-3.5 w-3.5 shrink-0" />
                    </button>
                  ) : (
                    <NavLink
                      to={item.to!}
                      className={({ isActive: a }) =>
                        `flex items-center justify-center w-full px-4 py-3.5 text-sm font-medium hover:bg-primary-dark transition-colors border-b-2 ${
                          a
                            ? "bg-primary-dark border-accent"
                            : "border-transparent"
                        }`
                      }
                      end={item.to === "/"}
                    >
                      {t(item.labelKey)}
                    </NavLink>
                  )}

                  {item.children && openDropdown === item.labelKey && (
                    <div className="absolute left-0 top-full min-w-[260px] bg-background text-foreground shadow-elevated border border-border rounded-b-md overflow-hidden animate-fade-in z-50">
                      {item.children.map((c) => (
                        <NavLink
                          key={c.to}
                          to={c.to}
                          className={({ isActive: a }) =>
                            `block px-4 py-2.5 text-sm hover:bg-surface hover:text-primary border-l-2 ${
                              a
                                ? "border-accent text-primary bg-surface font-semibold"
                                : "border-transparent"
                            }`
                          }
                        >
                          {c.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
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
                      className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium ${isDropdownActive(item) ? "bg-primary-dark" : ""}`}
                      onClick={() =>
                        setMobileSubOpen(
                          mobileSubOpen === item.labelKey
                            ? null
                            : item.labelKey,
                        )
                      }
                    >
                      {t(item.labelKey)}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${mobileSubOpen === item.labelKey ? "rotate-180" : ""}`}
                      />
                    </button>
                    {mobileSubOpen === item.labelKey && (
                      <ul className="bg-primary-dark">
                        {item.children.map((c) => (
                          <li key={c.to}>
                            <NavLink
                              to={c.to}
                              onClick={() => setMobileOpen(false)}
                              className={({ isActive: a }) =>
                                `block px-8 py-2.5 text-sm hover:bg-primary ${a ? "text-accent font-semibold" : ""}`
                              }
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
                    className={({ isActive: a }) =>
                      `block px-4 py-3 text-sm font-medium ${a ? "bg-primary-dark text-accent" : ""}`
                    }
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
