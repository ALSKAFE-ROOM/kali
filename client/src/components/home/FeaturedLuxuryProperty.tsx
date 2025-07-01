import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { generateStarRating } from "@/lib/utils";
import { useFeaturedProperties } from "@/lib/data";
import { Property } from "@shared/schema";

export default function FeaturedLuxuryProperty() {
  const { data: properties, isLoading, error } = useFeaturedProperties();
  
  // Get the most expensive featured property
  const luxuryProperty = properties?.reduce((max, property: Property) => 
    property.price > max.price ? property : max
  , { price: 0 } as Property);

  return (
    <section className="py-12 bg-neutral-100 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        {isLoading ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <Skeleton className="h-80 lg:h-full" />
              <div className="p-8">
                <Skeleton className="h-10 w-3/4 mb-4" />
                <Skeleton className="h-5 w-1/2 mb-4" />
                <Skeleton className="h-20 w-full mb-6" />
                <div className="flex flex-wrap gap-3 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-8 w-20" />
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between">
                  <Skeleton className="h-12 w-40 mb-4 sm:mb-0" />
                  <Skeleton className="h-12 w-full sm:w-48" />
                </div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-destructive">Error loading luxury property. Please try again later.</p>
          </div>
        ) : luxuryProperty ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-80 lg:h-auto">
                <img
                  src={luxuryProperty.imageUrl}
                  alt={luxuryProperty.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-secondary text-white px-3 py-1 rounded-full text-sm font-medium">
                  Featured Luxury
                </div>
              </div>
              <div className="p-8 flex flex-col justify-center">
                <h2 className="text-3xl font-serif font-bold text-primary dark:text-white mb-4">
                  {luxuryProperty.name}
                </h2>
                <div className="flex items-center mb-4">
                  <div className="flex items-center mr-4">
                    <div className="flex items-center">
                      {generateStarRating(luxuryProperty.rating || 0)}
                    </div>
                    <span className="font-medium ml-1">{luxuryProperty.rating?.toFixed(1)}</span>
                    <span className="text-neutral-500 dark:text-neutral-400 ml-1">({luxuryProperty.reviewCount} reviews)</span>
                  </div>
                  <div className="text-neutral-600 dark:text-neutral-300">
                    <i className="fas fa-map-marker-alt mr-1"></i>
                    {luxuryProperty.location}
                  </div>
                </div>
                <p className="text-neutral-600 dark:text-neutral-300 mb-6">
                  {luxuryProperty.description}
                </p>
                <div className="flex flex-wrap gap-3 mb-6">
                  {luxuryProperty.amenities.slice(0, 5).map((amenity, index) => (
                    <span key={index} className="px-3 py-1 bg-neutral-100 dark:bg-gray-800 text-neutral-800 dark:text-neutral-200 rounded-md text-sm">
                      {amenity}
                    </span>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between">
                  <div className="mb-4 sm:mb-0">
                    <p className="text-3xl font-bold text-primary dark:text-white">
                      ${luxuryProperty.price} <span className="text-neutral-500 dark:text-neutral-400 text-lg font-normal">/ night</span>
                    </p>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm">Minimum 3 nights stay</p>
                  </div>
                  <Link href={`/property/${luxuryProperty.id}`}>
                    <a className="px-6 py-3 bg-secondary text-white rounded-lg hover:bg-opacity-90 transition text-center sm:text-left w-full sm:w-auto">
                      View Details & Book
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
