import { Link } from "wouter";
import PropertyCard from "@/components/properties/PropertyCard";
import { useFeaturedProperties } from "@/lib/data";
import { Property } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function FeaturedProperties() {
  const { data: properties, isLoading, error } = useFeaturedProperties();

  return (
    <section className="py-12 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-serif font-bold text-primary dark:text-white">
            Featured Chalets
          </h2>
          <Link href="/properties">
            <a className="text-accent hover:underline flex items-center">
              View all properties <i className="fas fa-arrow-right ml-2"></i>
            </a>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <Skeleton className="w-full h-60" />
                <div className="p-5">
                  <Skeleton className="h-7 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-3" />
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                  <Skeleton className="h-10 w-full mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-destructive">Error loading properties. Please try again later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties?.map((property: Property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
