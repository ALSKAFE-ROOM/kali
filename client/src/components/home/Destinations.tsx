import { useDestinations } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";
import { Destination } from "@shared/schema";

export default function Destinations() {
  const { data: destinations, isLoading, error } = useDestinations();

  return (
    <section className="py-12 bg-neutral-100 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-serif font-bold text-primary dark:text-white mb-8 text-center">
          Popular Destinations
        </h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <Skeleton key={index} className="h-80 rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-destructive">Error loading destinations. Please try again later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations?.map((destination: Destination) => (
              <div key={destination.id} className="destination-card">
                <img
                  src={destination.imageUrl}
                  alt={destination.name}
                  className="destination-card-image"
                />
                <div className="destination-card-overlay"></div>
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <h3 className="text-xl font-serif font-bold mb-1">{destination.name}</h3>
                  <p className="text-sm">{destination.propertyCount} properties</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
