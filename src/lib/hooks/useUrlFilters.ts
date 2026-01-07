'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export interface FilterState {
  [key: string]: string;
}

export function useUrlFilters<T extends FilterState>(defaultValues: T) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize state from URL params or defaults
  const getInitialState = useCallback((): T => {
    const state = { ...defaultValues };
    Object.keys(defaultValues).forEach((key) => {
      const value = searchParams.get(key);
      if (value !== null) {
        (state as FilterState)[key] = value;
      }
    });
    return state;
  }, [searchParams, defaultValues]);

  const [filters, setFiltersState] = useState<T>(getInitialState);

  // Sync state with URL on mount and when URL changes
  useEffect(() => {
    setFiltersState(getInitialState());
  }, [searchParams, getInitialState]);

  // Update single filter
  const setFilter = useCallback(
    (key: keyof T, value: string) => {
      const newFilters = { ...filters, [key]: value };
      setFiltersState(newFilters);

      // Update URL
      const params = new URLSearchParams();
      Object.entries(newFilters).forEach(([k, v]) => {
        if (v && v !== defaultValues[k as keyof T]) {
          params.set(k, v as string);
        }
      });

      const queryString = params.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    },
    [filters, defaultValues, pathname, router]
  );

  // Update multiple filters at once
  const setFilters = useCallback(
    (newFilters: Partial<T>) => {
      const updated = { ...filters, ...newFilters };
      setFiltersState(updated);

      // Update URL
      const params = new URLSearchParams();
      Object.entries(updated).forEach(([k, v]) => {
        if (v && v !== defaultValues[k as keyof T]) {
          params.set(k, v as string);
        }
      });

      const queryString = params.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    },
    [filters, defaultValues, pathname, router]
  );

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFiltersState(defaultValues);
    router.push(pathname, { scroll: false });
  }, [defaultValues, pathname, router]);

  // Check if any filter is active
  const hasActiveFilters = Object.entries(filters).some(
    ([key, value]) => value !== defaultValues[key as keyof T]
  );

  // Get shareable URL
  const getShareableUrl = useCallback(() => {
    if (typeof window === 'undefined') return '';
    return window.location.href;
  }, []);

  // Copy URL to clipboard
  const copyShareableUrl = useCallback(async () => {
    const url = getShareableUrl();
    if (url && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      return true;
    }
    return false;
  }, [getShareableUrl]);

  return {
    filters,
    setFilter,
    setFilters,
    clearFilters,
    hasActiveFilters,
    getShareableUrl,
    copyShareableUrl,
  };
}
