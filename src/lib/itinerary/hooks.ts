'use client';

import { useState, useCallback } from 'react';
import type { Itinerary as FrontendItinerary } from '@/data/itinerary';

interface SavedItinerary {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string;
  days: unknown;
  total_places: number;
  thumbnail: string | null;
}

export function useItineraries() {
  const [itineraries, setItineraries] = useState<SavedItinerary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItineraries = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/itineraries');
      if (!response.ok) {
        throw new Error('Failed to fetch itineraries');
      }
      const data = await response.json();
      setItineraries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  return { itineraries, loading, error, fetchItineraries };
}

export function useSaveItinerary() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveItinerary = useCallback(
    async (
      itinerary: FrontendItinerary,
      password: string,
      description?: string
    ): Promise<SavedItinerary | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/itineraries', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            password,
            itinerary: {
              title: itinerary.title,
              description: description || null,
              start_date: itinerary.startDate,
              end_date: itinerary.endDate,
              days: itinerary.days,
            },
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to save itinerary');
        }

        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateItinerary = useCallback(
    async (
      id: string,
      itinerary: FrontendItinerary,
      password: string,
      description?: string
    ): Promise<SavedItinerary | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/itineraries/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            password,
            itinerary: {
              title: itinerary.title,
              description: description || null,
              start_date: itinerary.startDate,
              end_date: itinerary.endDate,
              days: itinerary.days,
            },
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to update itinerary');
        }

        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteItinerary = useCallback(
    async (id: string, password: string): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/itineraries/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to delete itinerary');
        }

        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { saveItinerary, updateItinerary, deleteItinerary, loading, error };
}

export function useFetchItinerary() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItinerary = useCallback(
    async (id: string): Promise<SavedItinerary | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/itineraries/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch itinerary');
        }
        return await response.json();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { fetchItinerary, loading, error };
}
