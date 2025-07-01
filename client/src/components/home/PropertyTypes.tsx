import { usePropertyTypes } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";
import { PropertyType } from "@shared/schema";
import { Link } from "wouter";

export default function PropertyTypes() {
  const { data: propertyTypes, isLoading, error } = usePropertyTypes();

  return (
    <section className="py-12 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-serif font-bold text-primary dark:text-white mb-8">
          Find your perfect stay
        </h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <Skeleton key={index} className="h-48 rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-destructive">Error loading property types. Please try again later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {propertyTypes?.map((type: PropertyType) => (
              <Link key={type.id} href={`/properties?type=${encodeURIComponent(type.name)}`}>
                <div className="property-type-card bg-neutral-100 dark:bg-gray-800 dark:text-white">
                  <div className="property-type-icon">
                    <i className={`fas ${type.icon} text-primary dark:text-accent text-2xl`}></i>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-primary dark:text-white mb-2">
                    {type.name}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                    {type.description}
                  </p>
                  <p className="text-accent font-medium">{type.propertyCount} properties</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
