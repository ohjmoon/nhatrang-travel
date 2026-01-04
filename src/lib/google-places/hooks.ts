'use client';

import { useState, useCallback } from 'react';
import type {
  PlaceSearchResult,
  PlaceDetails,
  SearchPlacesParams,
  SearchPlacesResponse,
  PlaceDetailsResponse,
} from './types';

// 장소 검색 훅
export function usePlaceSearch() {
  const [results, setResults] = useState<PlaceSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (params: SearchPlacesParams) => {
    if (!params.query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/google-places/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      const data: SearchPlacesResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to search places');
      }

      setResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return { results, loading, error, search, clear };
}

// 장소 상세 정보 훅
export function usePlaceDetails() {
  const [details, setDetails] = useState<PlaceDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = useCallback(async (placeId: string) => {
    if (!placeId) {
      setDetails(null);
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/google-places/details/${placeId}`);
      const data: PlaceDetailsResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get place details');
      }

      setDetails(data.result);
      return data.result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get details');
      setDetails(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setDetails(null);
    setError(null);
  }, []);

  return { details, loading, error, fetchDetails, clear };
}

// 검색 디바운스 훅
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useState(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  });

  return debouncedValue;
}
