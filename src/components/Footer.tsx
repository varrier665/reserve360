import { Link } from "react-router-dom";
import { Heart, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => (
  <footer className="bg-foreground text-background/80">
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Heart className="h-6 w-6 text-primary fill-primary" />
            <span className="font-display text-xl font-bold text-background">Reserve360</span>
          </div>
          <p className="text-sm leading-relaxed text-background/60">
            Bridging the gap between surplus and need. We facilitate food and medicine donations across India to those who need it most.
          </p>
        </div>

        <div>
          <h4 className="font-display text-lg font-semibold text-background mb-4">Quick Links</h4>
          <div className="space-y-2">
            {[
              { label: "Donate Food", path: "/donate" },
              { label: "Donate Medicine", path: "/donate" },
              { label: "Volunteer", path: "/get-involved" },
              
            ].map((l) => (
              <Link key={l.label} to={l.path} className="block text-sm text-background/60 hover:text-primary transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-lg font-semibold text-background mb-4">Organization</h4>
          <div className="space-y-2">
            {[
              { label: "About Us", path: "/about" },
              { label: "Contact", path: "/contact" },
              { label: "FAQ", path: "/faq" },
              { label: "Partner With Us", path: "/get-involved" },
            ].map((l) => (
              <Link key={l.label} to={l.path} className="block text-sm text-background/60 hover:text-primary transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-lg font-semibold text-background mb-4">Contact</h4>
          <div className="space-y-3 text-sm text-background/60">
            <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> info@reserve360.org</div>
            <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> +91 98765 43210</div>
            <div className="flex items-start gap-2"><MapPin className="h-4 w-4 text-primary mt-0.5" /> 123 Chennai, Tamil Nadu, India 110001</div>
          </div>
        </div>
      </div>

      <div className="border-t border-background/10 mt-12 pt-8 text-center text-sm text-background/40">
        © {new Date().getFullYear()} Reserve360 Foundation. All rights reserved. Made with ❤️ for India.
      </div>
    </div>
  </footer>
);

export default Footer;
