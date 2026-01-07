'use client';

import { useState, useEffect } from 'react';
import { supabase } from './client';
import type { Place, PlaceType, Accommodation, AccommodationArea, AccommodationPurpose, AccommodationPriceRange } from './types';

// Restaurant type for UI (mapped from Place)
export interface RestaurantData {
  id: string;
  name: string;
  nameKo: string;
  category: string;
  image: string;
  rating: number;
  reviewCount: number;
  hours: string;
  address: string;
  phone: string;
  priceRange: string;
  priceValue: { min: number; max: number };
  recommendedMenu: string[];
  description: string;
  tips?: string;
}

// Map Place to RestaurantData
function mapPlaceToRestaurant(place: Place & { google_rating?: number; google_reviews_count?: number; phone?: string }): RestaurantData {
  return {
    id: place.id,
    name: place.name,
    nameKo: place.name_ko,
    category: place.category,
    image: place.thumbnail || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    rating: place.google_rating || 4.0,
    reviewCount: place.google_reviews_count || 0,
    hours: place.hours || '',
    address: place.address || '',
    phone: place.phone || '',
    priceRange: place.price || '',
    priceValue: {
      min: place.price_min || 0,
      max: place.price_max || 0,
    },
    recommendedMenu: place.recommended_items || [],
    description: place.description || '',
    tips: place.tips || undefined,
  };
}

// Hook to fetch places by type
export function usePlaces(type: PlaceType) {
  const [data, setData] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlaces() {
      try {
        setLoading(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: places, error: fetchError } = await (supabase as any)
          .from('places')
          .select('*')
          .eq('type', type)
          .eq('is_published', true)
          .order('sort_order', { ascending: true });

        if (fetchError) throw fetchError;
        setData(places || []);
      } catch (err) {
        console.error('Failed to fetch places:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch');
      } finally {
        setLoading(false);
      }
    }

    fetchPlaces();
  }, [type]);

  return { data, loading, error };
}

// Hook to fetch restaurants (mapped to RestaurantData)
export function useRestaurants() {
  const [restaurants, setRestaurants] = useState<RestaurantData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        setLoading(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: places, error: fetchError } = await (supabase as any)
          .from('places')
          .select('*')
          .eq('type', 'restaurant')
          .eq('is_published', true)
          .order('sort_order', { ascending: true });

        if (fetchError) throw fetchError;

        const mapped = (places || []).map(mapPlaceToRestaurant);
        setRestaurants(mapped);
      } catch (err) {
        console.error('Failed to fetch restaurants:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch');
      } finally {
        setLoading(false);
      }
    }

    fetchRestaurants();
  }, []);

  return { restaurants, loading, error };
}

// Generic category counts hook
export function useCategoryCounts(type: PlaceType) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: places, error } = await (supabase as any)
          .from('places')
          .select('category')
          .eq('type', type)
          .eq('is_published', true);

        if (error) throw error;

        const categoryCounts: Record<string, number> = {};
        (places || []).forEach((place: { category: string }) => {
          categoryCounts[place.category] = (categoryCounts[place.category] || 0) + 1;
        });
        setCounts(categoryCounts);
      } catch (err) {
        console.error('Failed to fetch category counts:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCounts();
  }, [type]);

  return { counts, loading };
}

// Convenience alias for restaurant category counts
export function useRestaurantCategoryCounts() {
  return useCategoryCounts('restaurant');
}

// ============ Attraction Types & Hooks ============

export interface AttractionData {
  id: string;
  name: string;
  nameKo: string;
  category: string;
  image: string;
  rating: number;
  reviewCount: number;
  hours: string;
  location: string;
  price: string;
  duration: string;
  highlights: string[];
  tips?: string;
}

function mapPlaceToAttraction(place: Place & { google_rating?: number; google_reviews_count?: number }): AttractionData {
  return {
    id: place.id,
    name: place.name,
    nameKo: place.name_ko,
    category: place.category,
    image: place.thumbnail || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    rating: place.google_rating || 4.0,
    reviewCount: place.google_reviews_count || 0,
    hours: place.hours || '',
    location: place.address || place.location || '',
    price: place.price || '무료',
    duration: place.duration || '',
    highlights: place.features || [],
    tips: place.tips || undefined,
  };
}

export function useAttractions() {
  const [attractions, setAttractions] = useState<AttractionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAttractions() {
      try {
        setLoading(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: places, error: fetchError } = await (supabase as any)
          .from('places')
          .select('*')
          .eq('type', 'attraction')
          .eq('is_published', true)
          .order('sort_order', { ascending: true });

        if (fetchError) throw fetchError;

        const mapped = (places || []).map(mapPlaceToAttraction);
        setAttractions(mapped);
      } catch (err) {
        console.error('Failed to fetch attractions:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch');
      } finally {
        setLoading(false);
      }
    }

    fetchAttractions();
  }, []);

  return { attractions, loading, error };
}

export function useAttractionCategoryCounts() {
  return useCategoryCounts('attraction');
}

// ============ Activity Types & Hooks ============

export interface ActivityData {
  id: string;
  name: string;
  nameKo: string;
  category: string;
  image: string;
  rating: number;
  reviewCount: number;
  duration: string;
  price: string;
  difficulty: string;
  groupSize: string;
  included: string[];
  highlights: string[];
  bestTime?: string;
  tips?: string;
}

function mapPlaceToActivity(place: Place & { google_rating?: number; google_reviews_count?: number }): ActivityData {
  // Extract difficulty from features if available
  const features = place.features || [];
  let difficulty = 'moderate';
  if (features.some(f => f.toLowerCase().includes('쉬움') || f.toLowerCase().includes('easy'))) {
    difficulty = 'easy';
  } else if (features.some(f => f.toLowerCase().includes('어려움') || f.toLowerCase().includes('hard'))) {
    difficulty = 'hard';
  }

  return {
    id: place.id,
    name: place.name,
    nameKo: place.name_ko,
    category: place.category,
    image: place.thumbnail || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
    rating: place.google_rating || 4.0,
    reviewCount: place.google_reviews_count || 0,
    duration: place.duration || '',
    price: place.price || '',
    difficulty,
    groupSize: '2-10명',
    included: place.recommended_items || [],
    highlights: place.features || [],
    bestTime: undefined,
    tips: place.tips || undefined,
  };
}

export function useActivities() {
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchActivities() {
      try {
        setLoading(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: places, error: fetchError } = await (supabase as any)
          .from('places')
          .select('*')
          .eq('type', 'activity')
          .eq('is_published', true)
          .order('sort_order', { ascending: true });

        if (fetchError) throw fetchError;

        const mapped = (places || []).map(mapPlaceToActivity);
        setActivities(mapped);
      } catch (err) {
        console.error('Failed to fetch activities:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch');
      } finally {
        setLoading(false);
      }
    }

    fetchActivities();
  }, []);

  return { activities, loading, error };
}

export function useActivityCategoryCounts() {
  return useCategoryCounts('activity');
}

// ============ Shopping Types & Hooks ============

export interface ShoppingData {
  id: string;
  name: string;
  nameKo: string;
  category: string;
  image: string;
  rating: number;
  reviewCount: number;
  hours: string;
  address: string;
  priceLevel: string;
  popularItems: string[];
  highlights: string[];
  bargainOk: boolean;
  tips?: string;
}

function mapPlaceToShopping(place: Place & { google_rating?: number; google_reviews_count?: number }): ShoppingData {
  // Determine price level from price range
  let priceLevel = 'moderate';
  if (place.price_max && place.price_max < 100000) {
    priceLevel = 'budget';
  } else if (place.price_min && place.price_min > 500000) {
    priceLevel = 'premium';
  }

  // Check if bargaining is OK from features
  const features = place.features || [];
  const bargainOk = features.some(f =>
    f.toLowerCase().includes('흥정') ||
    f.toLowerCase().includes('bargain') ||
    f.toLowerCase().includes('협상')
  );

  return {
    id: place.id,
    name: place.name,
    nameKo: place.name_ko,
    category: place.category,
    image: place.thumbnail || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
    rating: place.google_rating || 4.0,
    reviewCount: place.google_reviews_count || 0,
    hours: place.hours || '',
    address: place.address || '',
    priceLevel,
    popularItems: place.recommended_items || [],
    highlights: place.features || [],
    bargainOk,
    tips: place.tips || undefined,
  };
}

export function useShopping() {
  const [shopping, setShopping] = useState<ShoppingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchShopping() {
      try {
        setLoading(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: places, error: fetchError } = await (supabase as any)
          .from('places')
          .select('*')
          .eq('type', 'shopping')
          .eq('is_published', true)
          .order('sort_order', { ascending: true });

        if (fetchError) throw fetchError;

        const mapped = (places || []).map(mapPlaceToShopping);
        setShopping(mapped);
      } catch (err) {
        console.error('Failed to fetch shopping:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch');
      } finally {
        setLoading(false);
      }
    }

    fetchShopping();
  }, []);

  return { shopping, loading, error };
}

export function useShoppingCategoryCounts() {
  return useCategoryCounts('shopping');
}

// ============ Accommodation Types & Hooks ============

export interface AccommodationData {
  id: string;
  name: string;
  nameKo: string;
  area: AccommodationArea;
  areaName: string;
  purposes: AccommodationPurpose[];
  priceRange: AccommodationPriceRange;
  priceMin: number;
  priceMax: number;
  rating: number;
  reviewCount: number;
  description: string;
  features: string[];
  amenities: string[];
  image: string;
  coordinates: { lat: number; lng: number };
  isNew: boolean;
  openYear?: number;
}

function mapAccommodationToData(acc: Accommodation): AccommodationData {
  return {
    id: acc.id,
    name: acc.name,
    nameKo: acc.name_ko,
    area: acc.area,
    areaName: acc.area_name,
    purposes: acc.purposes || [],
    priceRange: acc.price_range,
    priceMin: acc.price_min || 0,
    priceMax: acc.price_max || 0,
    rating: acc.google_rating || acc.rating || 0,
    reviewCount: acc.google_reviews_count || acc.review_count || 0,
    description: acc.description || '',
    features: acc.features || [],
    amenities: acc.amenities || [],
    image: acc.thumbnail || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    coordinates: {
      lat: acc.latitude ? Number(acc.latitude) : 0,
      lng: acc.longitude ? Number(acc.longitude) : 0,
    },
    isNew: acc.is_new || false,
    openYear: acc.open_year || undefined,
  };
}

export function useAccommodations() {
  const [accommodations, setAccommodations] = useState<AccommodationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAccommodations() {
      try {
        setLoading(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error: fetchError } = await (supabase as any)
          .from('accommodations')
          .select('*')
          .eq('is_published', true)
          .order('sort_order', { ascending: true });

        if (fetchError) throw fetchError;

        const mapped = (data || []).map(mapAccommodationToData);
        setAccommodations(mapped);
      } catch (err) {
        console.error('Failed to fetch accommodations:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch');
      } finally {
        setLoading(false);
      }
    }

    fetchAccommodations();
  }, []);

  return { accommodations, loading, error };
}

export function useAccommodationAreaCounts() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
          .from('accommodations')
          .select('area')
          .eq('is_published', true);

        if (error) throw error;

        const areaCounts: Record<string, number> = {};
        (data || []).forEach((acc: { area: string }) => {
          areaCounts[acc.area] = (areaCounts[acc.area] || 0) + 1;
        });
        setCounts(areaCounts);
      } catch (err) {
        console.error('Failed to fetch area counts:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCounts();
  }, []);

  return { counts, loading };
}

export function useAccommodationPurposeCounts() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
          .from('accommodations')
          .select('purposes')
          .eq('is_published', true);

        if (error) throw error;

        const purposeCounts: Record<string, number> = {};
        (data || []).forEach((acc: { purposes: string[] }) => {
          (acc.purposes || []).forEach((purpose: string) => {
            purposeCounts[purpose] = (purposeCounts[purpose] || 0) + 1;
          });
        });
        setCounts(purposeCounts);
      } catch (err) {
        console.error('Failed to fetch purpose counts:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCounts();
  }, []);

  return { counts, loading };
}

// ============ Global Search Hook ============

export type SearchResultType = 'accommodation' | 'restaurant' | 'attraction' | 'activity' | 'shopping';

export interface SearchResult {
  id: string;
  type: SearchResultType;
  name: string;
  nameKo: string;
  description: string;
  image: string;
  rating: number;
  category?: string;
  area?: string;
  price?: string;
}

export function useGlobalSearch(query: string) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function search() {
      if (!query || query.length < 2) {
        setResults([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const searchTerm = `%${query}%`;

        // Search accommodations
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: accommodations, error: accError } = await (supabase as any)
          .from('accommodations')
          .select('id, name, name_ko, description, thumbnail, google_rating, area, area_name, price_range')
          .eq('is_published', true)
          .or(`name.ilike.${searchTerm},name_ko.ilike.${searchTerm},description.ilike.${searchTerm}`)
          .limit(10);

        if (accError) throw accError;

        // Search places (all types)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: places, error: placesError } = await (supabase as any)
          .from('places')
          .select('id, type, name, name_ko, description, thumbnail, google_rating, category, price')
          .eq('is_published', true)
          .or(`name.ilike.${searchTerm},name_ko.ilike.${searchTerm},description.ilike.${searchTerm}`)
          .limit(30);

        if (placesError) throw placesError;

        // Map accommodations
        const accResults: SearchResult[] = (accommodations || []).map((acc: {
          id: string;
          name: string;
          name_ko: string;
          description: string;
          thumbnail: string;
          google_rating: number;
          area: string;
          area_name: string;
          price_range: string;
        }) => ({
          id: acc.id,
          type: 'accommodation' as SearchResultType,
          name: acc.name,
          nameKo: acc.name_ko,
          description: acc.description || '',
          image: acc.thumbnail || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
          rating: acc.google_rating || 0,
          area: acc.area_name,
          price: acc.price_range,
        }));

        // Map places
        const placeResults: SearchResult[] = (places || []).map((place: {
          id: string;
          type: PlaceType;
          name: string;
          name_ko: string;
          description: string;
          thumbnail: string;
          google_rating: number;
          category: string;
          price: string;
        }) => ({
          id: place.id,
          type: place.type as SearchResultType,
          name: place.name,
          nameKo: place.name_ko,
          description: place.description || '',
          image: place.thumbnail || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
          rating: place.google_rating || 0,
          category: place.category,
          price: place.price,
        }));

        setResults([...accResults, ...placeResults]);
      } catch (err) {
        console.error('Search failed:', err);
        setError(err instanceof Error ? err.message : 'Search failed');
      } finally {
        setLoading(false);
      }
    }

    const debounce = setTimeout(search, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  return { results, loading, error };
}

// ============ Itinerary Items Hook ============
// Fetch all items from Supabase for adding to itinerary

export type ItineraryItemCategory = 'accommodation' | 'restaurant' | 'attraction' | 'activity' | 'shopping';

export interface ItineraryAvailableItem {
  id: string;
  category: ItineraryItemCategory;
  name: string;
  nameKo: string;
  image: string;
  rating?: number;
  duration?: string;
  hours?: string;
  price?: string;
  coordinates?: { lat: number; lng: number } | null;
}

export function useItineraryItems() {
  const [items, setItems] = useState<ItineraryAvailableItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAllItems() {
      try {
        setLoading(true);
        const allItems: ItineraryAvailableItem[] = [];

        // Fetch accommodations
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: accommodations, error: accError } = await (supabase as any)
          .from('accommodations')
          .select('id, name, name_ko, thumbnail, google_rating, price_min, price_max, latitude, longitude')
          .eq('is_published', true)
          .order('sort_order', { ascending: true });

        if (accError) throw accError;

        (accommodations || []).forEach((acc: {
          id: string;
          name: string;
          name_ko: string;
          thumbnail: string;
          google_rating: number;
          price_min: number;
          price_max: number;
          latitude: number | null;
          longitude: number | null;
        }) => {
          allItems.push({
            id: acc.id,
            category: 'accommodation',
            name: acc.name,
            nameKo: acc.name_ko,
            image: acc.thumbnail || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
            rating: acc.google_rating || 0,
            price: acc.price_min && acc.price_max
              ? `${acc.price_min.toLocaleString()}~${acc.price_max.toLocaleString()}원`
              : undefined,
            coordinates: acc.latitude && acc.longitude
              ? { lat: acc.latitude, lng: acc.longitude }
              : null,
          });
        });

        // Fetch all places (restaurant, attraction, activity, shopping)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: places, error: placesError } = await (supabase as any)
          .from('places')
          .select('id, type, name, name_ko, thumbnail, google_rating, duration, hours, price, coordinates')
          .eq('is_published', true)
          .order('sort_order', { ascending: true });

        if (placesError) throw placesError;

        (places || []).forEach((place: {
          id: string;
          type: PlaceType;
          name: string;
          name_ko: string;
          thumbnail: string;
          google_rating: number;
          duration: string;
          hours: string;
          price: string;
          coordinates: { lat: number; lng: number } | null;
        }) => {
          allItems.push({
            id: place.id,
            category: place.type as ItineraryItemCategory,
            name: place.name,
            nameKo: place.name_ko,
            image: place.thumbnail || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
            rating: place.google_rating || 0,
            duration: place.duration || undefined,
            hours: place.hours || undefined,
            price: place.price || undefined,
            coordinates: place.coordinates || null,
          });
        });

        setItems(allItems);
      } catch (err) {
        console.error('Failed to fetch itinerary items:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch');
      } finally {
        setLoading(false);
      }
    }

    fetchAllItems();
  }, []);

  return { items, loading, error };
}
