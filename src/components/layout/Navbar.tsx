import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X, Search, Phone } from "lucide-react";
import { navItems } from "@/data/navigation";
import logo from "@/assets/logo.png";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileSubOpen, setMobileSubOpen] = useState<string | null>(null);
  const { pathname } = useLocation();

  const isActive = (to?: string) => to && (to === "/" ? pathname === "/" : pathname.startsWith(to));

  return (
    <header className="sticky top-0 z-50 shadow-card">
      {/* Top utility bar */}
      <div className="bg-primary-dark text-primary-foreground text-xs">
        <div className="gov-container flex items-center justify-between h-9">
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">Government of Assam</span>
            <span className="hidden md:inline opacity-70">|</span>
            <span className="hidden md:inline">अरण्य भवन, गुवाहाटी</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#main" className="hover:underline hidden sm:inline">Skip to Main</a>
            <span className="hidden sm:inline opacity-70">|</span>
            <button className="hover:underline">A-</button>
            <button className="hover:underline">A</button>
            <button className="hover:underline">A+</button>
            <span className="opacity-70">|</span>
            <button className="hover:underline">English</button>
            <span className="opacity-70">|</span>
            <button className="hover:underline">অসমীয়া</button>
          </div>
        </div>
      </div>

      {/* Brand band */}
      <div className="bg-background border-b border-border">
        <div className="gov-container flex items-center justify-between py-3 gap-4">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Assam Forest Department emblem" className="h-14 w-14" width={56} height={56} />
            <div>
              <div className="text-lg md:text-xl font-bold text-primary leading-tight">Assam Forest Department</div>
              <div className="text-xs md:text-sm text-muted-foreground">Government of Assam · অসম বন বিভাগ</div>
            </div>
          </Link>
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4 text-primary" />
              <span>Helpline: 1800-345-3666</span>
            </div>
            <button className="ml-2 p-2 rounded-md border border-border hover:bg-surface focus-ring" aria-label="Search">
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
                key={item.label}
                className="relative"
                onMouseEnter={() => item.children && setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                {item.children ? (
                  <button
                    className={`flex items-center gap-1 px-3 py-3 text-sm font-medium hover:bg-primary-dark transition-colors ${
                      item.children.some((c) => isActive(c.to)) ? "bg-primary-dark" : ""
                    }`}
                  >
                    {item.label}
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
                    {item.label}
                  </NavLink>
                )}
                {item.children && openDropdown === item.label && (
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
              <li key={item.label}>
                {item.children ? (
                  <>
                    <button
                      className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium"
                      onClick={() => setMobileSubOpen(mobileSubOpen === item.label ? null : item.label)}
                    >
                      {item.label}
                      <ChevronDown className={`h-4 w-4 transition-transform ${mobileSubOpen === item.label ? "rotate-180" : ""}`} />
                    </button>
                    {mobileSubOpen === item.label && (
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
                    {item.label}
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
