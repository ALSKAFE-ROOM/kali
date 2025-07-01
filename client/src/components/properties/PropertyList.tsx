import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import PropertyCard from "./PropertyCard";
import PropertyFilter from "./PropertyFilter";
import { useProperties, usePropertyFilter } from "@/lib/data";
import { Property } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function PropertyList() {
  const [location] = useLocation();
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [displayProperties, setDisplayProperties] = useState<Property[]>([]);
  
  // Extract query parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.split('?')[1] || '');
    const newFilters: Record<string, string> = {};
    
    for (const [key, value] of searchParams.entries()) {
      if (value) newFilters[key] = value;
    }
    
    setFilters(newFilters);
  }, [location]);
  
  // Fetch all properties if no filters, or filtered properties if filters exist
  const hasFilters = Object.keys(filters).length > 0;
  const { data: allProperties, isLoading: isLoadingAll } = useProperties();
  const { data: filteredProperties, isLoading: isLoadingFiltered } = usePropertyFilter(filters);
  
  const isLoading = hasFilters ? isLoadingFiltered : isLoadingAll;
  
  // Set the properties to display based on filters
  useEffect(() => {
    if (hasFilters && filteredProperties) {
      setDisplayProperties(filteredProperties);
    } else if (!hasFilters && allProperties) {
      setDisplayProperties(allProperties);
    }
  }, [hasFilters, filteredProperties, allProperties]);

  const handleFilterChange = (newFilters: Record<string, string>) => {
    // Update URL with new filters
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(newFilters)) {
      if (value) searchParams.append(key, value);
    }
    window.history.pushState(
      {}, 
      '', 
      searchParams.toString() ? `?${searchParams.toString()}` : location.split('?')[0]
    );
    
    setFilters(newFilters);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4">
          <PropertyFilter filters={filters} onFilterChange={handleFilterChange} />
        </div>
        
        <div className="lg:w-3/4">
          <h1 className="text-3xl font-serif font-bold text-primary dark:text-white mb-6">
            {hasFilters && filters.location 
              ? `Properties in ${filters.location}`
              : hasFilters && filters.type
              ? `${filters.type}`
              : "All Properties"}
          </h1>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="property-card dark:bg-gray-800">
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
          ) : displayProperties && displayProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {displayProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center shadow">
              <i className="fas fa-search text-4xl text-neutral-400 mb-4"></i>
              <h3 className="text-xl font-medium text-primary dark:text-white mb-2">No properties found</h3>
              <p className="text-neutral-600 dark:text-neutral-300">
                Try adjusting your filters to find available properties.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
