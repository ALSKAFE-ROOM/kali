export default function WhyChooseUs() {
  return (
    <section className="py-12 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-serif font-bold text-primary dark:text-white mb-4 text-center">
          Why Choose ChalehBooking
        </h2>
        <p className="text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto text-center mb-10">
          Experience the perfect mountain getaway with our curated selection of luxury properties and premium services.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-medal text-primary dark:text-white text-2xl"></i>
            </div>
            <h3 className="text-xl font-serif font-bold text-primary dark:text-white mb-3">
              Handpicked Properties
            </h3>
            <p className="text-neutral-600 dark:text-neutral-300">
              Every property is personally vetted by our team to ensure the highest standards of quality and comfort.
            </p>
          </div>
          
          {/* Feature 2 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-concierge-bell text-primary dark:text-white text-2xl"></i>
            </div>
            <h3 className="text-xl font-serif font-bold text-primary dark:text-white mb-3">
              Concierge Service
            </h3>
            <p className="text-neutral-600 dark:text-neutral-300">
              From personal chefs to private ski instructors, our concierge team can arrange everything for your stay.
            </p>
          </div>
          
          {/* Feature 3 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-shield-alt text-primary dark:text-white text-2xl"></i>
            </div>
            <h3 className="text-xl font-serif font-bold text-primary dark:text-white mb-3">
              Secure Booking
            </h3>
            <p className="text-neutral-600 dark:text-neutral-300">
              Enjoy peace of mind with our secure payment process and flexible cancellation policies.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
