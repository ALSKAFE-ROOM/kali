import { useState } from "react";
import { Link } from "wouter";
import { Property } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite 
        ? `${property.name} has been removed from your favorites.`
        : `${property.name} has been added to your favorites.`,
      variant: "default",
    });
  };

  return (
    <div className="property-card dark:bg-gray-800">
      <div className="relative">
        <img
          src={property.imageUrl}
          alt={property.name}
          className="property-card-image"
        />
        <button
          className="absolute top-4 right-4 bg-white dark:bg-gray-800 p-2 rounded-full hover:text-secondary transition"
          onClick={toggleFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <i className={`${isFavorite ? 'fas' : 'far'} fa-heart`}></i>
        </button>
        {property.isFeatured && (
          <span className="absolute bottom-4 left-4 bg-secondary text-white px-3 py-1 rounded-full text-sm font-medium">
            Featured
          </span>
        )}
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-serif text-xl font-bold text-primary dark:text-white">
            {property.name}
          </h3>
          <div className="flex items-center">
            <i className="fas fa-star text-secondary text-sm"></i>
            <span className="ml-1 text-sm font-medium">{property.rating}</span>
          </div>
        </div>
        <p className="text-neutral-600 dark:text-neutral-300 mb-3">{property.location}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {property.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-neutral-100 dark:bg-gray-700 text-neutral-800 dark:text-neutral-200 rounded-md text-xs">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-neutral-200 dark:border-gray-700">
          <p className="font-bold text-lg dark:text-white">
            {formatCurrency(property.price)} <span className="text-neutral-500 dark:text-neutral-400 text-sm font-normal">/ night</span>
          </p>
          <Link href={`/property/${property.id}`}>
            <Button className="px-4 py-2 bg-primary dark:bg-primary/80 text-white hover:bg-primary/90 text-sm">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
