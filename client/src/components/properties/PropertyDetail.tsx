import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDate, generateStarRating } from "@/lib/utils";
import { Property } from "@shared/schema";
import BookingForm from "@/components/booking/BookingForm";

interface PropertyDetailProps {
  property: Property | undefined;
  isLoading: boolean;
}

export default function PropertyDetail({ property, isLoading }: PropertyDetailProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Skeleton className="w-full h-96 rounded-lg mb-4" />
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-6" />
            <Skeleton className="h-24 w-full mb-6" />
            <Skeleton className="h-8 w-1/4 mb-2" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="w-full h-[400px] rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Property Not Found</h2>
        <p className="text-gray-600 mb-6">The property you are looking for could not be found.</p>
      </div>
    );
  }

  // Additional placeholder images for the gallery
  const images = [
    property.imageUrl,
    "https://images.unsplash.com/photo-1542718610-a1d656d1884c", // interior
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994", // another view
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e", // landscape
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Property Gallery */}
          <div className="mb-6">
            <div className="relative w-full h-96 rounded-lg overflow-hidden mb-2">
              <img
                src={images[activeImageIndex]}
                alt={property.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`relative cursor-pointer h-20 rounded-md overflow-hidden ${
                    activeImageIndex === index ? "ring-2 ring-secondary" : ""
                  }`}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <img
                    src={image}
                    alt={`${property.name} - view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Property Details */}
          <h1 className="text-3xl font-serif font-bold text-primary dark:text-white mb-2">
            {property.name}
          </h1>
          
          <div className="flex items-center mb-4">
            <div className="flex items-center mr-4">
              <div className="flex">
                {generateStarRating(property.rating || 0)}
              </div>
              <span className="ml-1 font-medium">{property.rating}</span>
              <span className="text-neutral-500 dark:text-neutral-400 ml-1">
                ({property.reviewCount} reviews)
              </span>
            </div>
            <div className="text-neutral-600 dark:text-neutral-300">
              <i className="fas fa-map-marker-alt mr-1"></i>
              {property.location}
            </div>
          </div>

          <p className="text-neutral-600 dark:text-neutral-300 mb-6">
            {property.description}
          </p>

          {/* Property Features */}
          <div className="mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-neutral-100 dark:bg-gray-800 p-3 rounded-md text-center">
                <i className="fas fa-bed text-primary dark:text-secondary mb-1"></i>
                <p className="text-sm text-neutral-600 dark:text-neutral-300">
                  {property.bedroomsCount} Bedrooms
                </p>
              </div>
              <div className="bg-neutral-100 dark:bg-gray-800 p-3 rounded-md text-center">
                <i className="fas fa-bath text-primary dark:text-secondary mb-1"></i>
                <p className="text-sm text-neutral-600 dark:text-neutral-300">
                  {property.bathroomsCount} Bathrooms
                </p>
              </div>
              <div className="bg-neutral-100 dark:bg-gray-800 p-3 rounded-md text-center">
                <i className="fas fa-users text-primary dark:text-secondary mb-1"></i>
                <p className="text-sm text-neutral-600 dark:text-neutral-300">
                  Up to {property.maxGuests} Guests
                </p>
              </div>
              <div className="bg-neutral-100 dark:bg-gray-800 p-3 rounded-md text-center">
                <i className="fas fa-mountain text-primary dark:text-secondary mb-1"></i>
                <p className="text-sm text-neutral-600 dark:text-neutral-300">
                  {property.propertyType}
                </p>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <h2 className="text-2xl font-serif font-bold text-primary dark:text-white mb-4">
            Amenities
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {property.amenities.slice(0, showAllAmenities ? property.amenities.length : 6).map((amenity, index) => (
              <div key={index} className="flex items-center">
                <i className="fas fa-check text-secondary mr-2"></i>
                <span className="text-neutral-600 dark:text-neutral-300">{amenity}</span>
              </div>
            ))}
          </div>
          {property.amenities.length > 6 && (
            <button
              onClick={() => setShowAllAmenities(!showAllAmenities)}
              className="text-accent hover:underline mb-8"
            >
              {showAllAmenities ? "Show less" : "Show all amenities"}
            </button>
          )}

          {/* Location Map Placeholder */}
          <h2 className="text-2xl font-serif font-bold text-primary dark:text-white mb-4">
            Location
          </h2>
          <div className="bg-neutral-100 dark:bg-gray-800 h-64 rounded-lg flex items-center justify-center mb-8">
            <p className="text-neutral-600 dark:text-neutral-300">
              <i className="fas fa-map-marker-alt mr-2"></i> 
              {property.location}
            </p>
          </div>
        </div>

        {/* Booking Form */}
        <div className="lg:col-span-1">
          <BookingForm property={property} />
        </div>
      </div>
    </div>
  );
}
