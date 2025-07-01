import { Link, useLocation } from "wouter";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-white dark:bg-primary border-t dark:border-gray-700">
      <div className="container mx-auto px-4 py-3">
        <Link href="/">
          <a 
            className={`block py-2 transition ${isActive("/") ? "text-secondary" : "text-primary dark:text-white hover:text-secondary dark:hover:text-secondary"}`}
            onClick={onClose}
          >
            Home
          </a>
        </Link>
        <Link href="/properties">
          <a 
            className={`block py-2 transition ${isActive("/properties") ? "text-secondary" : "text-primary dark:text-white hover:text-secondary dark:hover:text-secondary"}`}
            onClick={onClose}
          >
            Properties
          </a>
        </Link>
        <Link href="/about">
          <a 
            className={`block py-2 transition ${isActive("/about") ? "text-secondary" : "text-primary dark:text-white hover:text-secondary dark:hover:text-secondary"}`}
            onClick={onClose}
          >
            About
          </a>
        </Link>
        <Link href="/contact">
          <a 
            className={`block py-2 transition ${isActive("/contact") ? "text-secondary" : "text-primary dark:text-white hover:text-secondary dark:hover:text-secondary"}`}
            onClick={onClose}
          >
            Contact
          </a>
        </Link>
        <a 
          href="#" 
          className="block py-2 text-primary dark:text-white hover:text-secondary dark:hover:text-secondary transition"
          onClick={onClose}
        >
          <i className="far fa-heart"></i> Favorites
        </a>
        <a 
          href="#" 
          className="block py-2 mt-2 text-center bg-primary dark:bg-secondary text-white rounded-lg hover:bg-opacity-90 transition"
          onClick={onClose}
        >
          Sign In
        </a>
      </div>
    </div>
  );
}
