import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "./queryClient";
import type {
  Property,
  Booking,
  Destination,
  PropertyType,
  Testimonial,
  InsertBooking,
  InsertContactMessage,
} from "@shared/schema";

// Property queries
export function useProperties() {
  return useQuery({
    queryKey: ["/api/properties"],
  });
}

export function useFeaturedProperties() {
  return useQuery({
    queryKey: ["/api/properties/featured"],
  });
}

export function useProperty(id: number) {
  return useQuery({
    queryKey: [`/api/properties/${id}`],
  });
}

export function usePropertySearch(query: string) {
  return useQuery({
    queryKey: [`/api/properties/search?query=${query}`],
    enabled: Boolean(query),
  });
}

export function usePropertyFilter(filters: Record<string, string>) {
  const queryParams = new URLSearchParams(filters).toString();
  return useQuery({
    queryKey: [`/api/properties/filter?${queryParams}`],
    enabled: Object.keys(filters).length > 0,
  });
}

// Booking queries and mutations
export function useCreateBooking() {
  return useMutation({
    mutationFn: async (booking: InsertBooking) => {
      const res = await apiRequest("POST", "/api/bookings", booking);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
    },
  });
}

export function useUserBookings(userId: number) {
  return useQuery({
    queryKey: [`/api/bookings/user/${userId}`],
    enabled: Boolean(userId),
  });
}

export function usePropertyBookings(propertyId: number) {
  return useQuery({
    queryKey: [`/api/bookings/property/${propertyId}`],
    enabled: Boolean(propertyId),
  });
}

// Destination queries
export function useDestinations() {
  return useQuery({
    queryKey: ["/api/destinations"],
  });
}

// Property Type queries
export function usePropertyTypes() {
  return useQuery({
    queryKey: ["/api/property-types"],
  });
}

// Testimonial queries
export function useTestimonials() {
  return useQuery({
    queryKey: ["/api/testimonials"],
  });
}

// Contact message mutation
export function useSendContactMessage() {
  return useMutation({
    mutationFn: async (message: InsertContactMessage) => {
      const res = await apiRequest("POST", "/api/contact", message);
      return res.json();
    },
  });
}
