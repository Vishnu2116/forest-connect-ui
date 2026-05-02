import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function PageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main id="main" className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export function PageHeader({ title, subtitle, breadcrumb }: { title: string; subtitle?: string; breadcrumb?: string[] }) {
  return (
    <section className="bg-gradient-to-r from-primary to-primary-light text-primary-foreground">
      <div className="gov-container py-12 md:py-14">
        {breadcrumb && (
          <nav className="text-sm opacity-90 mb-4">
            {breadcrumb.map((b, i) => (
              <span key={i}>
                {i > 0 && <span className="mx-2">/</span>}
                <span>{b}</span>
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-3xl md:text-4xl font-bold mb-0">{title}</h1>
        {subtitle && <p className="mt-3 text-base md:text-lg opacity-90 max-w-3xl leading-relaxed mb-0">{subtitle}</p>}
      </div>
    </section>
  );
}
