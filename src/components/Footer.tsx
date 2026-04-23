import { Link } from "react-router-dom";
import { Scale, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Legal Help", href: "/legal-help" },
    { name: "Constitution", href: "/constitution/articles" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const resources = [
    { name: "Fundamental Rights", href: "/constitution/articles" },
    { name: "Fundamental Duties", href: "/constitution/articles" },
    { name: "Directive Principles", href: "/constitution/articles" },
    { name: "What If Scenarios", href: "/constitution/what-happens-if" },
  ];

  return (
    <footer className="bg-foreground text-accent py-6">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-3">
              <Scale className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">LegalEase India</span>
            </Link>
            <p className="text-accent/80 leading-relaxed text-sm">
              Making Indian law accessible, understandable, and actionable for everyone.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-base mb-3">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-accent/80 hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold text-base mb-3">Resources</h4>
            <ul className="space-y-2">
              {resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-accent/80 hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-base mb-3">Contact Us</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-accent/80 text-sm">
                <Mail className="h-4 w-4" />
                <span>support@legaleaseindia.com</span>
              </li>
              <li className="flex items-center gap-2 text-accent/80 text-sm">
                <Phone className="h-4 w-4" />
                <span>+91 1800-XXX-XXXX</span>
              </li>
              <li className="flex items-start gap-2 text-accent/80 text-sm">
                <MapPin className="h-4 w-4 mt-1" />
                <span>Pune, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-accent/20 mt-6 pt-4 text-center text-accent/60">
          <p className="text-sm">© {new Date().getFullYear()} LegalEase India. All rights reserved.</p>
          <p className="mt-1 text-xs">
            Disclaimer: This platform provides general legal information, not legal advice.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
