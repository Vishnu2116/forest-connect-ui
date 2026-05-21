import { useEffect, useMemo, useRef, useState } from "react";
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
import { navItems as baseNavItems } from "@/data/navigation";
import { useLang, LANGUAGES } from "@/contexts/LanguageContext";
import { useA11y } from "@/contexts/AccessibilityContext";
import { getNavComponentsOnce } from "@/lib/projects";
import { searchSite, type SearchEntry } from "@/data/searchIndex";
import logoTripura from "@/assets/logo-tripura.png";
import logoTheWorldBank from "@/assets/logo-theworldbankOrg.jpg";
import logoTripuraForestDept from "@/assets/logo-tripuraforestdept.png";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileSubOpen, setMobileSubOpen] = useState<string | null>(null);
  const [langOpen, setLangOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [searchActiveIdx, setSearchActiveIdx] = useState(0);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const searchTriggerRef = useRef<HTMLButtonElement | null>(null);
  const searchResults: SearchEntry[] = useMemo(
    () => (searchOpen ? searchSite(searchQ, 8) : []),
    [searchOpen, searchQ],
  );
  const searchListboxId = "global-search-listbox";
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

  const [componentChildren, setComponentChildren] = useState<
    { label: string; to: string }[] | null
  >(null);

  useEffect(() => {
    let alive = true;
    getNavComponentsOnce()
      .then((items) => {
        if (!alive || !Array.isArray(items) || items.length === 0) return;
        setComponentChildren(
          items.map((c) => ({
            label: c.name || c.label || `Component ${c.component_number ?? ""}`,
            to: `/components/${c.id}`,
          })),
        );
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const navItems = useMemo(() => {
    if (!componentChildren) return baseNavItems;
    return baseNavItems.map((item) =>
      item.labelKey === "nav.components"
        ? { ...item, children: componentChildren }
        : item,
    );
  }, [componentChildren]);

  const isActive = (to?: string) =>
    to && (to === "/" ? pathname === "/" : pathname.startsWith(to));
  const isDropdownActive = (item: (typeof navItems)[0]) =>
    item.children?.some((c) => pathname.startsWith(c.to));
  const currentLangLabel =
    LANGUAGES.find((l) => l.code === lang)?.label ?? "English";

  // Global Escape: close transient menus and restore focus.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (searchOpen) {
        setSearchOpen(false);
        searchTriggerRef.current?.focus();
      }
      if (langOpen) setLangOpen(false);
      if (openDropdown) setOpenDropdown(null);
      if (mobileOpen) setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [searchOpen, langOpen, openDropdown, mobileOpen]);

  // Focus search input when opened; reset highlighted result when query changes.
  useEffect(() => {
    if (searchOpen) {
      // Slight delay so the input is mounted.
      const t = setTimeout(() => searchInputRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [searchOpen]);
  useEffect(() => {
    setSearchActiveIdx(0);
  }, [searchQ, searchOpen]);

  const goToSearchResult = (entry?: SearchEntry) => {
    const target = entry ?? searchResults[searchActiveIdx];
    if (!target) {
      if (searchQ.trim()) navigate(`/sitemap?q=${encodeURIComponent(searchQ.trim())}`);
    } else {
      navigate(target.to);
    }
    setSearchOpen(false);
    setSearchQ("");
  };


  return (
    <header className="sticky top-0 z-50 shadow-card">
      <a href="#main" className="skip-link focus-ring">
        {t("common.skipMain")}
      </a>

      {/* ── TOP UTILITY BAR — always visible ── */}
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
              ref={searchTriggerRef}
              onClick={() => setSearchOpen((v) => !v)}
              aria-label={searchOpen ? "Close site search" : "Open site search"}
              aria-expanded={searchOpen}
              aria-controls="global-search-panel"
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
                        className={`w-full text-left px-3 py-2 text-xs hover:bg-surface ${
                          lang === l.code
                            ? "bg-surface text-primary font-semibold"
                            : ""
                        }`}
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
          <div
            id="global-search-panel"
            className="bg-primary border-t border-primary-dark/40"
            role="search"
            aria-label="Search the ELEMENT portal"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                goToSearchResult();
              }}
              className="gov-container py-2 flex items-center gap-2 relative"
            >
              <label htmlFor="site-search" className="sr-only">
                Search the portal
              </label>
              <Search className="h-4 w-4 opacity-80" aria-hidden="true" />
              <input
                id="site-search"
                ref={searchInputRef}
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                onKeyDown={(e) => {
                  if (searchResults.length === 0) return;
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setSearchActiveIdx((i) => (i + 1) % searchResults.length);
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setSearchActiveIdx((i) =>
                      (i - 1 + searchResults.length) % searchResults.length,
                    );
                  } else if (e.key === "Home") {
                    e.preventDefault();
                    setSearchActiveIdx(0);
                  } else if (e.key === "End") {
                    e.preventDefault();
                    setSearchActiveIdx(searchResults.length - 1);
                  }
                }}
                placeholder="Search pages — try 'About', 'Tenders', 'Knowledge Hub'…"
                className="flex-1 bg-transparent border-b border-primary-foreground/40 focus:outline-none focus:border-accent text-sm py-1 placeholder:text-primary-foreground/60"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={searchResults.length > 0}
                aria-controls={searchListboxId}
                aria-activedescendant={
                  searchResults.length > 0
                    ? `search-result-${searchActiveIdx}`
                    : undefined
                }
                autoComplete="off"
              />
              <button
                type="submit"
                className="bg-accent hover:bg-accent-hover text-accent-foreground text-xs font-semibold px-3 py-1 rounded focus-ring"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false);
                  searchTriggerRef.current?.focus();
                }}
                aria-label="Close search"
                className="p-1 hover:bg-primary-dark rounded focus-ring"
              >
                <X className="h-4 w-4" />
              </button>

              {searchQ.trim() && (
                <div className="absolute left-0 right-0 top-full z-50 px-4 sm:px-6 lg:px-8">
                  <ul
                    id={searchListboxId}
                    role="listbox"
                    aria-label="Search results"
                    className="mt-1 bg-background text-foreground rounded-md shadow-elevated border border-border max-h-[60vh] overflow-y-auto"
                  >
                    {searchResults.length === 0 ? (
                      <li
                        className="px-4 py-3 text-sm text-muted-foreground"
                        role="option"
                        aria-selected="false"
                      >
                        No results for &ldquo;{searchQ}&rdquo;.
                      </li>
                    ) : (
                      searchResults.map((r, idx) => {
                        const selected = idx === searchActiveIdx;
                        return (
                          <li
                            key={`${r.to}-${idx}`}
                            id={`search-result-${idx}`}
                            role="option"
                            aria-selected={selected}
                          >
                            <button
                              type="button"
                              onMouseEnter={() => setSearchActiveIdx(idx)}
                              onClick={() => goToSearchResult(r)}
                              className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between gap-3 focus-ring ${
                                selected ? "bg-surface text-primary" : "hover:bg-surface"
                              }`}
                            >
                              <span className="font-medium truncate">{r.title}</span>
                              {r.group && (
                                <span className="text-[11px] uppercase tracking-wide text-muted-foreground shrink-0">
                                  {r.group}
                                </span>
                              )}
                            </button>
                          </li>
                        );
                      })
                    )}
                  </ul>
                </div>
              )}
            </form>
          </div>
        )}
      </div>


      {/* ── MOBILE HEADER — below lg (< 1024px) ── */}
      <div className="lg:hidden bg-background border-b border-border">
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

          {/* Right Logo — World Bank (kept on smaller widths, hidden on the smallest) */}
          <img
            src={logoTheWorldBank}
            alt="The World Bank"
            className="hidden sm:block h-10 w-auto object-contain shrink-0 mr-2"
          />

          {/* Hamburger */}
          <button
            className="p-2 rounded-md border border-border focus-ring shrink-0"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* ── DESKTOP LOGO HEADER — lg and above (≥ 1024px) ──
          ELEMENT stays absolutely centered to the viewport. Logos scale up
          progressively at lg / xl / 2xl. Forest Dept logo hides below xl
          to keep alignment clean on tighter laptop widths.
      */}
      <div className="hidden lg:block relative w-full py-4 xl:py-6 px-4 xl:px-10 min-h-[112px] xl:min-h-[148px]">
        {/* Left edge — Tripura Govt emblem */}
        <div className="absolute left-4 xl:left-10 top-1/2 -translate-y-1/2 flex items-center">
          <img
            src={logoTripura}
            alt="Government of Tripura"
            className="h-[80px] w-[80px] xl:h-[100px] xl:w-[100px] 2xl:h-[116px] 2xl:w-[116px] object-contain"
          />
        </div>

        {/* Center — ELEMENT (truly screen-centered) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center">
          <h1 className="text-4xl xl:text-5xl 2xl:text-6xl font-extrabold text-primary tracking-widest leading-none">
            ELEMENT
          </h1>
          <p className="mt-2 text-xs xl:text-sm font-semibold text-foreground/80 whitespace-nowrap">
            {t("site.full")}
          </p>
          <div className="w-full border-t border-border mt-2 pt-1.5">
            <p className="text-[11px] xl:text-xs text-muted-foreground italic whitespace-nowrap">
              {t("site.joint")}
            </p>
          </div>
        </div>

        {/* Right edge — World Bank always visible, Forest Dept from xl up */}
        <div className="absolute right-4 xl:right-10 top-1/2 -translate-y-1/2 flex items-center gap-3 xl:gap-5">
          <img
            src={logoTheWorldBank}
            alt="The World Bank"
            className="h-[70px] xl:h-[88px] 2xl:h-[100px] w-auto object-contain"
          />
          <img
            src={logoTripuraForestDept}
            alt="Tripura Forest Department"
            className="hidden xl:block xl:h-[100px] xl:w-[100px] 2xl:h-[116px] 2xl:w-[116px] object-contain"
          />
        </div>
      </div>

      {/* ── DESKTOP NAV BAR — only at xl and above (≥ 1280px) ── */}
      {/*
          Must match the logo header breakpoint exactly.
          Was: hidden lg:block (caused the gap between 1024–1279px)
          Now: hidden xl:block
      */}
      <nav
        className="bg-primary text-primary-foreground hidden lg:block"
        aria-label="Primary"
      >
        <div className="gov-container-wide">
          <ul className="flex items-stretch justify-between w-full">
            {navItems.map((item) => {
              const dropActive = isDropdownActive(item);
              const isOpen = openDropdown === item.labelKey;
              return (
                <li
                  key={item.labelKey}
                  className="relative flex"
                  onMouseEnter={() =>
                    item.children && setOpenDropdown(item.labelKey)
                  }
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  {item.children ? (
                    <button
                      type="button"
                      aria-haspopup="menu"
                      aria-expanded={isOpen}
                      aria-current={dropActive ? "page" : undefined}
                      onClick={() => setOpenDropdown(isOpen ? null : item.labelKey)}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setOpenDropdown(item.labelKey);
                        } else if (e.key === "Escape") {
                          setOpenDropdown(null);
                        }
                      }}
                      className={`flex items-center justify-center gap-1 whitespace-nowrap px-2.5 lg:px-3 xl:px-5 py-3 xl:py-3.5 text-[13px] xl:text-sm font-medium hover:bg-primary-dark transition-colors border-b-2 focus-ring ${
                        dropActive ? "bg-primary-dark border-accent" : "border-transparent"
                      }`}
                    >
                      {t(item.labelKey)}
                      <ChevronDown className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    </button>
                  ) : (
                    <NavLink
                      to={item.to!}
                      className={({ isActive: a }) =>
                        `flex items-center justify-center whitespace-nowrap px-2.5 lg:px-3 xl:px-5 py-3 xl:py-3.5 text-[13px] xl:text-sm font-medium hover:bg-primary-dark transition-colors border-b-2 ${
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
                    <div
                      role="menu"
                      aria-label={t(item.labelKey)}
                      className="absolute left-0 top-full min-w-[260px] bg-background text-foreground shadow-elevated border border-border rounded-b-md overflow-hidden animate-fade-in z-50"
                    >
                      {item.children.map((c) => (
                        <NavLink
                          key={c.to}
                          to={c.to}
                          end
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

      {/* ── MOBILE NAV DRAWER — only below xl (< 1280px) ── */}
      {/*
          Was: lg:hidden (caused the gap between 1024–1279px where nav
          was visible but mobile drawer was already hidden)
          Now: xl:hidden — perfectly mirrors the mobile header
      */}
      {mobileOpen && (
        <nav className="lg:hidden bg-primary text-primary-foreground max-h-[70vh] overflow-y-auto">
          <ul className="divide-y divide-primary-dark">
            {navItems.map((item) => (
              <li key={item.labelKey}>
                {item.children ? (
                  <>
                    <button
                      className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium`}
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
                        className={`h-4 w-4 transition-transform ${
                          mobileSubOpen === item.labelKey ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {mobileSubOpen === item.labelKey && (
                      <ul className="bg-primary-dark">
                        {item.children.map((c) => (
                          <li key={c.to}>
                            <NavLink
                              to={c.to}
                              end
                              onClick={() => setMobileOpen(false)}
                              className={({ isActive: a }) =>
                                `block px-8 py-2.5 text-sm hover:bg-primary ${
                                  a ? "text-accent font-semibold" : ""
                                }`
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
                      `block px-4 py-3 text-sm font-medium ${
                        a ? "bg-primary-dark text-accent" : ""
                      }`
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
