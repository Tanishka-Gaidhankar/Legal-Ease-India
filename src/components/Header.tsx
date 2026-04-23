import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Menu, X, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    setIsMenuOpen(false);
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Legal Help", href: "/legal-help" },
    { name: "Constitution", href: "/constitution/articles" },
    { name: "Document Summary", href: "/document-summarizer" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="bg-primary sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Scale className="h-6 w-6 md:h-8 md:w-8 text-primary-foreground" />
            <span className="text-lg md:text-xl font-bold text-primary-foreground">
              LegalEase India
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-primary-foreground/90 hover:text-primary-foreground font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-primary-foreground/90 text-sm">Hello, {user.user_metadata?.full_name || user.email}</span>
                <Button variant="secondary" size="sm" onClick={handleSignOut}>Logout</Button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/auth/login" className="text-primary-foreground/90 hover:text-primary-foreground font-medium transition-colors">Login</Link>
                <Button asChild variant="secondary" size="sm">
                  <Link to="/auth/signup">Sign up</Link>
                </Button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-primary-foreground hover:bg-primary/80"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-primary-foreground/90 hover:text-primary-foreground font-medium py-2 px-4 rounded-md hover:bg-primary/80 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="border-t border-primary-foreground/20 my-2 pt-2">
                {user ? (
                  <div className="flex flex-col gap-3 px-4">
                    <span className="text-primary-foreground/90 text-sm font-medium">Signed in as {user.email}</span>
                    <Button variant="secondary" size="sm" onClick={handleSignOut} className="w-full">Logout</Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 px-2">
                    <Button asChild variant="ghost" className="w-full justify-start text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground">
                      <Link to="/auth/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
                    </Button>
                    <Button asChild variant="secondary" className="w-full">
                      <Link to="/auth/signup" onClick={() => setIsMenuOpen(false)}>Sign up</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
