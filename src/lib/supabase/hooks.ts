'use client';

import { useState, useEffect } from 'react';
import { supabase } from './client';
import type { Place, PlaceType } from './types';

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
