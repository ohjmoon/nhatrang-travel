'use client';

import useSWR from 'swr';
import { supabase } from './client';
import type { Place, PlaceType, Accommodation } from './types';

// SWR configuration
const swrConfig = {
  revalidateOnFocus: false, // Don't refetch on window focus
  revalidateOnReconnect: true, // Refetch on reconnect
  dedupingInterval: 60000, // Dedupe requests within 1 minute
  errorRetryCount: 3, // Retry failed requests 3 times
};

// ============ Fetcher Functions ============

async function fetchPlacesByType(type: PlaceType): Promise<Place[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('places')
    .select('*')
    .eq('type', type)
    .eq('is_published', true)
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data || [];
}

async function fetchAccommodations(): Promise<Accommodation[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('accommodations')
    .select('*')
    .eq('is_published', true)
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data || [];
}

async function fetchCategoryCounts(type: PlaceType): Promise<Record<string, number>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('places')
    .select('category')
    .eq('type', type)
    .eq('is_published', true);

  if (error) throw error;

  const counts: Record<string, number> = {};
  (data || []).forEach((place: { category: string }) => {
    counts[place.category] = (counts[place.category] || 0) + 1;
  });
  return counts;
}

async function fetchAccommodationAreaCounts(): Promise<Record<string, number>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('accommodations')
    .select('area')
    .eq('is_published', true);

  if (error) throw error;

  const counts: Record<string, number> = {};
  (data || []).forEach((acc: { area: string }) => {
    counts[acc.area] = (counts[acc.area] || 0) + 1;
  });
  return counts;
}

// ============ SWR Hooks ============

// Hook for fetching places by type with caching
export function usePlacesSWR(type: PlaceType) {
  const { data, error, isLoading, mutate } = useSWR(
    `places-${type}`,
    () => fetchPlacesByType(type),
    swrConfig
  );

  return {
    data: data || [],
    loading: isLoading,
    error: error?.message || null,
    refresh: mutate,
  };
}

// Hook for fetching restaurants with caching
export function useRestaurantsSWR() {
  const { data, error, isLoading, mutate } = useSWR(
    'places-restaurant',
    () => fetchPlacesByType('restaurant'),
    swrConfig
  );

  // Map to RestaurantData format
  const restaurants = (data || []).map((place) => ({
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
  }));

  return {
    restaurants,
    loading: isLoading,
    error: error?.message || null,
    refresh: mutate,
  };
}

// Hook for fetching attractions with caching
export function useAttractionsSWR() {
  const { data, error, isLoading, mutate } = useSWR(
    'places-attraction',
    () => fetchPlacesByType('attraction'),
    swrConfig
  );

  const attractions = (data || []).map((place) => ({
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
  }));

  return {
    attractions,
    loading: isLoading,
    error: error?.message || null,
    refresh: mutate,
  };
}

// Hook for fetching activities with caching
export function useActivitiesSWR() {
  const { data, error, isLoading, mutate } = useSWR(
    'places-activity',
    () => fetchPlacesByType('activity'),
    swrConfig
  );

  const activities = (data || []).map((place) => {
    const features = place.features || [];
    let difficulty = 'moderate';
    if (features.some((f: string) => f.toLowerCase().includes('쉬움') || f.toLowerCase().includes('easy'))) {
      difficulty = 'easy';
    } else if (features.some((f: string) => f.toLowerCase().includes('어려움') || f.toLowerCase().includes('hard'))) {
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
      tips: place.tips || undefined,
    };
  });

  return {
    activities,
    loading: isLoading,
    error: error?.message || null,
    refresh: mutate,
  };
}

// Hook for fetching shopping places with caching
export function useShoppingSWR() {
  const { data, error, isLoading, mutate } = useSWR(
    'places-shopping',
    () => fetchPlacesByType('shopping'),
    swrConfig
  );

  const shopping = (data || []).map((place) => {
    let priceLevel = 'moderate';
    if (place.price_max && place.price_max < 100000) {
      priceLevel = 'budget';
    } else if (place.price_min && place.price_min > 500000) {
      priceLevel = 'premium';
    }

    const features = place.features || [];
    const bargainOk = features.some((f: string) =>
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
  });

  return {
    shopping,
    loading: isLoading,
    error: error?.message || null,
    refresh: mutate,
  };
}

// Hook for fetching accommodations with caching
export function useAccommodationsSWR() {
  const { data, error, isLoading, mutate } = useSWR(
    'accommodations',
    fetchAccommodations,
    swrConfig
  );

  const accommodations = (data || []).map((acc) => ({
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
  }));

  return {
    accommodations,
    loading: isLoading,
    error: error?.message || null,
    refresh: mutate,
  };
}

// Hook for category counts with caching
export function useCategoryCountsSWR(type: PlaceType) {
  const { data, error, isLoading } = useSWR(
    `category-counts-${type}`,
    () => fetchCategoryCounts(type),
    {
      ...swrConfig,
      dedupingInterval: 300000, // Cache counts for 5 minutes
    }
  );

  return {
    counts: data || {},
    loading: isLoading,
    error: error?.message || null,
  };
}

// Hook for accommodation area counts with caching
export function useAccommodationAreaCountsSWR() {
  const { data, error, isLoading } = useSWR(
    'accommodation-area-counts',
    fetchAccommodationAreaCounts,
    {
      ...swrConfig,
      dedupingInterval: 300000, // Cache counts for 5 minutes
    }
  );

  return {
    counts: data || {},
    loading: isLoading,
    error: error?.message || null,
  };
}
