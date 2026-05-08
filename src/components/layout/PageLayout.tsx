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

export function PageHeader({ title, subtitle, breadcrumb, children }: { title: string; subtitle?: string; breadcrumb?: string[]; children?: ReactNode }) {
  return (
    <section className="bg-gradient-to-r from-primary to-primary-light text-primary-foreground">
      <div className="gov-container py-10">
        {breadcrumb && (
          <nav className="text-xs opacity-90 mb-3">
            {breadcrumb.map((b, i) => (
              <span key={i}>
                {i > 0 && <span className="mx-2">/</span>}
                <span>{b}</span>
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-2xl md:text-4xl font-bold">{title}</h1>
        {subtitle && <p className="mt-2 text-sm md:text-base opacity-90 max-w-3xl">{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}
