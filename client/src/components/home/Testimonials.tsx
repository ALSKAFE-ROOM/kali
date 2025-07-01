import { useTestimonials } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";
import { Testimonial } from "@shared/schema";
import { generateStarRating } from "@/lib/utils";

export default function Testimonials() {
  const { data: testimonials, isLoading, error } = useTestimonials();

  return (
    <section className="py-12 bg-neutral-100 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-serif font-bold text-primary dark:text-white mb-8 text-center">
          What Our Guests Say
        </h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm">
                <div className="flex items-center mb-4">
                  <Skeleton className="w-12 h-12 rounded-full mr-4" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <Skeleton className="h-24 w-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-destructive">Error loading testimonials. Please try again later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials?.map((testimonial: Testimonial) => (
              <div key={testimonial.id} className="testimonial-card dark:bg-gray-900">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-neutral-300 rounded-full overflow-hidden mr-4">
                    {testimonial.avatarUrl ? (
                      <img
                        src={testimonial.avatarUrl}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary text-white">
                        {testimonial.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-primary dark:text-white">{testimonial.name}</h4>
                    <div className="flex">
                      {generateStarRating(testimonial.rating)}
                    </div>
                  </div>
                </div>
                <p className="text-neutral-600 dark:text-neutral-300 italic">
                  "{testimonial.comment}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
