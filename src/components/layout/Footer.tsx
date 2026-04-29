import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, Facebook, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary-dark text-primary-foreground mt-16">
      <div className="gov-container py-12 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="text-base font-semibold mb-3 text-accent">Tripura Forest Department</h3>
          <p className="text-sm opacity-90 leading-relaxed">
            Aranya Bhawan, Gurkhabasti, Agartala, Tripura — 799006
          </p>
          <div className="mt-4 space-y-2 text-sm opacity-90">
            <div className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 shrink-0" /> Aranya Bhawan, Agartala</div>
            <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> +91 381 2416403</div>
            <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> info-forest@tripura.gov.in</div>
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold mb-3 text-accent">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {[
              ["About Us", "/about/organization"],
              ["Projects", "/projects"],
              ["Reports", "/reports"],
              ["Plantation Map", "/plantation-map"],
              ["RTI", "/rti"],
              ["Grievance", "/grievance"],
            ].map(([l, h]) => (
              <li key={h}><Link to={h} className="opacity-90 hover:opacity-100 hover:text-accent">{l}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-base font-semibold mb-3 text-accent">Policies</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/disclaimer" className="opacity-90 hover:text-accent">Disclaimer</Link></li>
            <li><a className="opacity-90 hover:text-accent" href="#">Privacy Policy</a></li>
            <li><a className="opacity-90 hover:text-accent" href="#">Terms of Use</a></li>
            <li><a className="opacity-90 hover:text-accent" href="#">Copyright Policy</a></li>
            <li><a className="opacity-90 hover:text-accent" href="#">Accessibility Statement</a></li>
            <li><a className="opacity-90 hover:text-accent" href="#">Sitemap</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-base font-semibold mb-3 text-accent">Connect</h3>
          <div className="flex gap-3">
            <a href="#" aria-label="Facebook" className="p-2 bg-primary rounded-md hover:bg-accent"><Facebook className="h-4 w-4" /></a>
            <a href="#" aria-label="Twitter" className="p-2 bg-primary rounded-md hover:bg-accent"><Twitter className="h-4 w-4" /></a>
            <a href="#" aria-label="YouTube" className="p-2 bg-primary rounded-md hover:bg-accent"><Youtube className="h-4 w-4" /></a>
          </div>
          <div className="mt-4 text-xs opacity-80">
            Visitor Count: <span className="font-semibold text-accent">12,48,936</span>
          </div>
          <div className="mt-2 text-xs opacity-80">Last updated: 28 April 2026</div>
        </div>
      </div>

      <div className="border-t border-primary/40 bg-primary">
        <div className="gov-container py-4 text-xs opacity-90 flex flex-col md:flex-row items-center justify-between gap-2">
          <div>© 2026 Tripura Forest Department, Government of Tripura. All rights reserved.</div>
          <div>Designed & Developed by NIC Tripura</div>
        </div>
      </div>
    </footer>
  );
}
