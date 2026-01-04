// Google Places API 타입 정의

export interface PlacePhoto {
  photo_reference: string;
  height: number;
  width: number;
  html_attributions?: string[];
}

export interface PlaceGeometry {
  location: {
    lat: number;
    lng: number;
  };
  viewport?: {
    northeast: { lat: number; lng: number };
    southwest: { lat: number; lng: number };
  };
}

export interface PlaceOpeningHours {
  open_now?: boolean;
  weekday_text?: string[];
  periods?: Array<{
    open: { day: number; time: string };
    close?: { day: number; time: string };
  }>;
}

export interface PlaceReview {
  author_name: string;
  rating: number;
  text: string;
  time: number;
  relative_time_description: string;
}

export interface PlaceSearchResult {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: PlaceGeometry;
  rating?: number;
  user_ratings_total?: number;
  photos?: PlacePhoto[];
  types?: string[];
  opening_hours?: {
    open_now?: boolean;
  };
  price_level?: number;
}

export interface PlaceDetails {
  place_id: string;
  name: string;
  formatted_address: string;
  formatted_phone_number?: string;
  international_phone_number?: string;
  website?: string;
  url?: string; // Google Maps URL
  geometry: PlaceGeometry;
  rating?: number;
  user_ratings_total?: number;
  photos?: PlacePhoto[];
  opening_hours?: PlaceOpeningHours;
  reviews?: PlaceReview[];
  types?: string[];
  price_level?: number;
  business_status?: string;
}

export interface SearchPlacesParams {
  query: string;
  type?: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface SearchPlacesResponse {
  results: PlaceSearchResult[];
  status: string;
  error?: string;
}

export interface PlaceDetailsResponse {
  result: PlaceDetails;
  error?: string;
}

// Place Type 매핑
export const PLACE_TYPE_MAP: Record<string, string> = {
  restaurant: 'restaurant',
  attraction: 'tourist_attraction',
  activity: 'point_of_interest',
  shopping: 'shopping_mall',
  accommodation: 'lodging',
};

// 사진 URL 생성
export function getPhotoUrl(photoReference: string, maxWidth: number = 400): string {
  return `/api/google-places/photo?reference=${encodeURIComponent(photoReference)}&maxwidth=${maxWidth}`;
}

// Google 검색 URL 생성
export function getGoogleSearchUrl(placeName: string, location: string = 'Nha Trang'): string {
  return `https://www.google.com/search?q=${encodeURIComponent(`${placeName} ${location}`)}`;
}

// Google Maps URL 생성
export function getGoogleMapsUrl(placeId: string): string {
  return `https://www.google.com/maps/place/?q=place_id:${placeId}`;
}

// Google Maps 길찾기 URL 생성
export function getGoogleDirectionsUrl(
  lat: number,
  lng: number,
  placeId?: string
): string {
  let url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  if (placeId) {
    url += `&destination_place_id=${placeId}`;
  }
  return url;
}
