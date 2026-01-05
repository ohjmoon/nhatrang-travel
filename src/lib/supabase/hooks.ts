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

// Category counts hook
export function useRestaurantCategoryCounts() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: places, error } = await (supabase as any)
          .from('places')
          .select('category')
          .eq('type', 'restaurant')
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
  }, []);

  return { counts, loading };
}
