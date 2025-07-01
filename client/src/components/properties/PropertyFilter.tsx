import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { usePropertyTypes } from "@/lib/data";
import { PropertyType } from "@shared/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PropertyFilterProps {
  filters: Record<string, string>;
  onFilterChange: (filters: Record<string, string>) => void;
}

export default function PropertyFilter({ filters, onFilterChange }: PropertyFilterProps) {
  const [localFilters, setLocalFilters] = useState(filters);
  const { data: propertyTypes } = usePropertyTypes();
  const [priceRange, setPriceRange] = useState([0, 1000]);

  // Update local filters when props filters change
  useEffect(() => {
    setLocalFilters(filters);
    
    // Set price range from filters
    if (filters.price) {
      setPriceRange([0, parseInt(filters.price)]);
    } else {
      setPriceRange([0, 1000]);
    }
  }, [filters]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalFilters({ ...localFilters, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setLocalFilters({ ...localFilters, [name]: value });
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
    setLocalFilters({ ...localFilters, price: value[1].toString() });
  };

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
  };

  const handleResetFilters = () => {
    setLocalFilters({});
    setPriceRange([0, 1000]);
    onFilterChange({});
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
      <h2 className="text-xl font-serif font-bold text-primary dark:text-white mb-6">
        Filter Properties
      </h2>

      <div className="space-y-6">
        {/* Location */}
        <div>
          <Label htmlFor="location" className="mb-2 block">Location</Label>
          <Input
            id="location"
            name="location"
            placeholder="Where are you going?"
            value={localFilters.location || ""}
            onChange={handleInputChange}
          />
        </div>

        {/* Property Type */}
        <div>
          <Label htmlFor="type" className="mb-2 block">Property Type</Label>
          <Select 
            value={localFilters.type || ""} 
            onValueChange={(value) => handleSelectChange("type", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any type</SelectItem>
              {propertyTypes?.map((type: PropertyType) => (
                <SelectItem key={type.id} value={type.name}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div>
          <div className="flex justify-between mb-2">
            <Label htmlFor="price">Max Price per Night</Label>
            <span className="text-sm font-medium">${priceRange[1]}</span>
          </div>
          <Slider
            id="price"
            min={0}
            max={1000}
            step={50}
            value={priceRange}
            onValueChange={handlePriceChange}
            className="my-4"
          />
          <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <span>$0</span>
            <span>$1000+</span>
          </div>
        </div>

        {/* Bedrooms */}
        <div>
          <Label htmlFor="bedroomsCount" className="mb-2 block">Bedrooms</Label>
          <Select 
            value={localFilters.bedroomsCount || ""} 
            onValueChange={(value) => handleSelectChange("bedroomsCount", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
              <SelectItem value="5">5+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Guests */}
        <div>
          <Label htmlFor="maxGuests" className="mb-2 block">Guests</Label>
          <Select 
            value={localFilters.maxGuests || ""} 
            onValueChange={(value) => handleSelectChange("maxGuests", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
              <SelectItem value="6">6+</SelectItem>
              <SelectItem value="8">8+</SelectItem>
              <SelectItem value="10">10+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-col space-y-2 pt-4">
          <Button onClick={handleApplyFilters} className="w-full bg-primary dark:bg-primary/80">
            Apply Filters
          </Button>
          <Button 
            onClick={handleResetFilters} 
            variant="outline" 
            className="w-full border-primary text-primary dark:border-neutral-400 dark:text-white"
          >
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
