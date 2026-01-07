'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { useGoogleMaps } from './GoogleMapsScript';
import { getCoordinates, type Coordinates } from '@/lib/maps';
import { type ItineraryItem, categoryInfo } from '@/data/itinerary';
import { MapPin, AlertTriangle, Loader2 } from 'lucide-react';

interface ItineraryMapProps {
  items: ItineraryItem[];
  className?: string;
}

// Nha Trang center coordinates
const NHA_TRANG_CENTER: Coordinates = { lat: 12.2388, lng: 109.1967 };

// Category colors for markers
const categoryColors: Record<string, string> = {
  accommodation: '#0ea5e9', // ocean-500
  restaurant: '#f97316', // sunset-500
  attraction: '#22c55e', // palm-500
  activity: '#06b6d4', // cyan-500
  shopping: '#f59e0b', // amber-500
};

export function ItineraryMap({ items, className = '' }: ItineraryMapProps) {
  const { isLoaded, loadError } = useGoogleMaps();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  // Get coordinates for each item - use item's coordinates directly, fallback to static mapping
  const itemsWithCoords = useMemo(() => {
    return items.map((item) => {
      // Use coordinates from item if available, otherwise fallback to static mapping
      const coords = item.coordinates || getCoordinates(item.itemId);
      return { ...item, coords };
    }).filter((item) => item.coords !== null);
  }, [items]);

  // Calculate bounds for the map
  const bounds = useMemo(() => {
    if (itemsWithCoords.length === 0) return null;

    let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;

    itemsWithCoords.forEach((item) => {
      if (item.coords) {
        minLat = Math.min(minLat, item.coords.lat);
        maxLat = Math.max(maxLat, item.coords.lat);
        minLng = Math.min(minLng, item.coords.lng);
        maxLng = Math.max(maxLng, item.coords.lng);
      }
    });

    // Add padding
    const latPadding = (maxLat - minLat) * 0.2 || 0.01;
    const lngPadding = (maxLng - minLng) * 0.2 || 0.01;

    return {
      north: maxLat + latPadding,
      south: minLat - latPadding,
      east: maxLng + lngPadding,
      west: minLng - lngPadding,
    };
  }, [itemsWithCoords]);

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapContainerRef.current || mapRef.current) return;

    try {
      mapRef.current = new google.maps.Map(mapContainerRef.current, {
        center: NHA_TRANG_CENTER,
        zoom: 13,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
        ],
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_CENTER,
        },
      });

      infoWindowRef.current = new google.maps.InfoWindow();
    } catch (error) {
      console.error('Map initialization error:', error);
      setMapError('지도를 불러오는 중 오류가 발생했습니다');
    }
  }, [isLoaded]);

  // Update markers and route when items change
  useEffect(() => {
    if (!mapRef.current || !isLoaded) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // Clear existing polyline
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    // Close info window
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }

    if (itemsWithCoords.length === 0) {
      mapRef.current.setCenter(NHA_TRANG_CENTER);
      mapRef.current.setZoom(13);
      return;
    }

    // Create markers
    const path: google.maps.LatLngLiteral[] = [];

    itemsWithCoords.forEach((item, index) => {
      if (!item.coords) return;

      const position = { lat: item.coords.lat, lng: item.coords.lng };
      path.push(position);

      // Create custom marker label
      const markerLabel = {
        text: String(index + 1),
        color: 'white',
        fontWeight: 'bold',
        fontSize: '12px',
      };

      // Create marker
      const marker = new google.maps.Marker({
        position,
        map: mapRef.current,
        title: item.nameKo,
        label: markerLabel,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 16,
          fillColor: categoryColors[item.category] || '#6366f1',
          fillOpacity: 1,
          strokeColor: 'white',
          strokeWeight: 2,
        },
        zIndex: index + 1,
      });

      // Create info window content
      const infoContent = `
        <div style="min-width: 180px; padding: 8px;">
          <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 4px;">
            <span style="background: ${categoryColors[item.category]}; color: white; padding: 2px 6px; border-radius: 4px; font-size: 11px;">
              ${categoryInfo[item.category].icon} ${categoryInfo[item.category].name}
            </span>
          </div>
          <h4 style="font-weight: bold; font-size: 14px; margin: 0 0 2px 0;">${item.nameKo}</h4>
          <p style="color: #666; font-size: 12px; margin: 0 0 4px 0;">${item.name}</p>
          <p style="color: #0ea5e9; font-size: 12px; margin: 0;">
            🕐 ${item.time} ${item.duration ? `(${item.duration})` : ''}
          </p>
        </div>
      `;

      marker.addListener('click', () => {
        if (infoWindowRef.current) {
          infoWindowRef.current.setContent(infoContent);
          infoWindowRef.current.open(mapRef.current, marker);
        }
      });

      markersRef.current.push(marker);
    });

    // Create polyline (route)
    if (path.length > 1) {
      polylineRef.current = new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: '#0ea5e9',
        strokeOpacity: 0.8,
        strokeWeight: 3,
        icons: [
          {
            icon: {
              path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
              scale: 3,
              strokeColor: '#0ea5e9',
            },
            offset: '50%',
            repeat: '100px',
          },
        ],
        map: mapRef.current,
      });
    }

    // Fit bounds
    if (bounds) {
      mapRef.current.fitBounds(bounds);
    }
  }, [itemsWithCoords, bounds, isLoaded]);

  // Loading state
  if (!isLoaded && !loadError) {
    return (
      <div className={`bg-gray-100 rounded-xl flex items-center justify-center ${className}`}>
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-ocean-500 animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-600">지도 로딩 중...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (loadError || mapError) {
    return (
      <div className={`bg-gray-100 rounded-xl flex items-center justify-center ${className}`}>
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <p className="text-sm text-gray-600">
            {loadError?.message || mapError || '지도를 불러올 수 없습니다'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div
        ref={mapContainerRef}
        className="w-full h-full rounded-xl"
        style={{ minHeight: '300px' }}
      />

      {/* Legend */}
      {items.length > 0 && (
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg p-2 shadow-md">
          <div className="flex flex-wrap gap-2 text-xs">
            {Object.entries(categoryInfo).map(([key, info]) => {
              const hasItem = items.some((item) => item.category === key);
              if (!hasItem) return null;
              return (
                <div key={key} className="flex items-center gap-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: categoryColors[key] }}
                  />
                  <span className="text-gray-600">
                    {info.icon} {info.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state overlay */}
      {items.length === 0 && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-ocean-300 mx-auto mb-2" />
            <p className="text-ocean-600">일정을 추가하면 지도에 표시됩니다</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ItineraryMap;
