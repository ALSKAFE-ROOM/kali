import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Hero() {
  const [, setLocation] = useLocation();
  const [searchLocation, setSearchLocation] = useState("");
  const [dates, setDates] = useState("");
  const [guests, setGuests] = useState("2 adults");

  const handleSearch = () => {
    let queryParams = new URLSearchParams();
    if (searchLocation) queryParams.append("location", searchLocation);
    if (guests) queryParams.append("guests", guests);
    
    setLocation(`/properties?${queryParams.toString()}`);
  };

  return (
    <section 
      className="relative h-[500px] bg-cover bg-center" 
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1470770841072-f978cf4d019e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}
    >
      <div className="hero-overlay"></div>
      <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white font-bold max-w-2xl">
          Your Perfect Mountain Retreat Awaits
        </h1>
        <p className="text-xl text-white mt-4 max-w-xl">
          Discover luxury chalets and cabins with breathtaking views
        </p>
        <div className="mt-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-4xl">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <label className="block text-sm font-medium text-primary dark:text-white mb-1">Location</label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Where are you going?"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full pr-10"
                />
                <i className="fas fa-map-marker-alt absolute right-3 top-3 text-neutral-400"></i>
              </div>
            </div>
            <div className="flex-grow">
              <label className="block text-sm font-medium text-primary dark:text-white mb-1">Check In - Check Out</label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Add dates"
                  value={dates}
                  onChange={(e) => setDates(e.target.value)}
                  className="w-full pr-10"
                />
                <i className="far fa-calendar absolute right-3 top-3 text-neutral-400"></i>
              </div>
            </div>
            <div className="flex-grow">
              <label className="block text-sm font-medium text-primary dark:text-white mb-1">Guests</label>
              <Select value={guests} onValueChange={setGuests}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select guests" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2 adults">2 adults</SelectItem>
                  <SelectItem value="3 adults">3 adults</SelectItem>
                  <SelectItem value="4 adults">4 adults</SelectItem>
                  <SelectItem value="5+ adults">5+ adults</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                className="w-full md:w-auto px-6 py-2 bg-secondary text-white hover:bg-secondary/90"
                onClick={handleSearch}
              >
                <i className="fas fa-search mr-2"></i> Search
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}