import { useState } from "react";
import { Link, useLocation } from "wouter";
import MobileMenu from "./MobileMenu";
import { useTheme } from "@/contexts/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <header className="bg-white dark:bg-primary shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <i className="fas fa-mountain text-secondary text-2xl mr-2"></i>
            <span className="font-serif text-primary dark:text-white text-2xl font-bold">
              ChalehBooking
            </span>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <Link href="/">
            <a className={`transition ${isActive("/") ? "text-secondary" : "text-primary dark:text-white hover:text-secondary dark:hover:text-secondary"}`}>
              Home
            </a>
          </Link>
          <Link href="/properties">
            <a className={`transition ${isActive("/properties") ? "text-secondary" : "text-primary dark:text-white hover:text-secondary dark:hover:text-secondary"}`}>
              Properties
            </a>
          </Link>
          <Link href="/about">
            <a className={`transition ${isActive("/about") ? "text-secondary" : "text-primary dark:text-white hover:text-secondary dark:hover:text-secondary"}`}>
              About
            </a>
          </Link>
          <Link href="/contact">
            <a className={`transition ${isActive("/contact") ? "text-secondary" : "text-primary dark:text-white hover:text-secondary dark:hover:text-secondary"}`}>
              Contact
            </a>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-primary dark:text-white"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </Button>
          <a href="#" className="hidden md:block text-primary dark:text-white hover:text-secondary dark:hover:text-secondary transition">
            <i className="far fa-heart"></i> Favorites
          </a>
          <a
            href="#"
            className="hidden md:block px-4 py-2 bg-primary dark:bg-secondary text-white rounded-lg hover:bg-opacity-90 transition"
          >
            Sign In
          </a>
          <button
            className="md:hidden text-primary dark:text-white text-xl"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <i className={`fas ${mobileMenuOpen ? "fa-times" : "fa-bars"}`}></i>
          </button>
        </div>
      </nav>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </header>
  );
}
