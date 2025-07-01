import { Link } from "wouter";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-800 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company */}
          <div>
            <h3 className="font-serif text-xl font-bold mb-4">ChalehBooking</h3>
            <p className="text-neutral-300 mb-4">
              Discover the finest luxury mountain retreats and chalets for your perfect getaway.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="social-icon">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-pinterest"></i>
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="footer-link">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/properties">
                  <a className="footer-link">Properties</a>
                </Link>
              </li>
              <li>
                <Link href="/properties">
                  <a className="footer-link">Destinations</a>
                </Link>
              </li>
              <li>
                <a href="#" className="footer-link">Special Offers</a>
              </li>
              <li>
                <Link href="/about">
                  <a className="footer-link">About Us</a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="footer-link">Terms & Conditions</a>
              </li>
              <li>
                <a href="#" className="footer-link">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="footer-link">Cookie Policy</a>
              </li>
              <li>
                <a href="#" className="footer-link">Booking Terms</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-3 text-secondary"></i>
                <span className="text-neutral-300">123 Mountain View Rd, Alpine Heights, CH 9876</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone mr-3 text-secondary"></i>
                <span className="text-neutral-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope mr-3 text-secondary"></i>
                <span className="text-neutral-300">info@chalehbooking.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-400 text-sm mb-4 md:mb-0">
            &copy; {currentYear} ChalehBooking. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <img
              src="https://cdn.jsdelivr.net/gh/lipis/payment-icons@master/neutral/single/visa.svg"
              alt="Visa"
              className="h-6"
            />
            <img
              src="https://cdn.jsdelivr.net/gh/lipis/payment-icons@master/neutral/single/mastercard.svg"
              alt="Mastercard"
              className="h-6"
            />
            <img
              src="https://cdn.jsdelivr.net/gh/lipis/payment-icons@master/neutral/single/amex.svg"
              alt="American Express"
              className="h-6"
            />
            <img
              src="https://cdn.jsdelivr.net/gh/lipis/payment-icons@master/neutral/single/paypal.svg"
              alt="PayPal"
              className="h-6"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
