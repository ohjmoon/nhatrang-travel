// Google Maps Distance Matrix API Integration

export type TravelMode = 'DRIVING' | 'WALKING' | 'TRANSIT';

export interface TravelTime {
  mode: TravelMode;
  duration: string; // e.g., "15분"
  durationValue: number; // seconds
  distance: string; // e.g., "2.5 km"
  distanceValue: number; // meters
}

export interface TravelTimeResult {
  driving?: TravelTime;
  walking?: TravelTime;
  transit?: TravelTime;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

// Nha Trang location data with coordinates
export const locationCoordinates: Record<string, Coordinates> = {
  // Accommodations
  'sheraton': { lat: 12.2380, lng: 109.1967 },
  'intercontinental': { lat: 12.2156, lng: 109.2127 },
  'vinpearl-resort': { lat: 12.2089, lng: 109.2289 },
  'mia-resort': { lat: 12.1893, lng: 109.2201 },
  'amiana-resort': { lat: 12.1756, lng: 109.2098 },
  'evason-ana': { lat: 12.1523, lng: 109.1845 },
  'novotel': { lat: 12.2445, lng: 109.1923 },
  'havana': { lat: 12.2398, lng: 109.1934 },
  'liberty-central': { lat: 12.2367, lng: 109.1945 },
  'galina-hotel': { lat: 12.2423, lng: 109.1912 },
  'azure-hotel': { lat: 12.2389, lng: 109.1956 },
  'seashells': { lat: 12.2356, lng: 109.1967 },

  // Restaurants
  'lanterns': { lat: 12.2398, lng: 109.1923 },
  'lac-canh': { lat: 12.2456, lng: 109.1889 },
  'louisiane': { lat: 12.2378, lng: 109.1945 },
  'nha-trang-xua': { lat: 12.2412, lng: 109.1901 },
  'yen-restaurant': { lat: 12.2445, lng: 109.1878 },
  'pho-hong': { lat: 12.2467, lng: 109.1867 },
  'quan-oc-thuy': { lat: 12.2489, lng: 109.1845 },
  'mix-restaurant': { lat: 12.2356, lng: 109.1956 },
  'truc-linh-2': { lat: 12.2423, lng: 109.1889 },
  'alpaca-homestyle': { lat: 12.2401, lng: 109.1934 },
  'sailing-club': { lat: 12.2345, lng: 109.1967 },
  'skylight': { lat: 12.2378, lng: 109.1945 },
  'altitude': { lat: 12.2367, lng: 109.1956 },
  'nha-trang-seafood': { lat: 12.2512, lng: 109.1834 },
  'boke-seafood': { lat: 12.2534, lng: 109.1823 },
  'au-lac': { lat: 12.2423, lng: 109.1901 },
  'ganesh': { lat: 12.2389, lng: 109.1923 },
  'rainforest': { lat: 12.2156, lng: 109.2127 },

  // Attractions
  'vinpearl-island': { lat: 12.2089, lng: 109.2289 },
  'hon-tam': { lat: 12.1812, lng: 109.2234 },
  'hon-mun': { lat: 12.1689, lng: 109.2456 },
  'nha-trang-beach': { lat: 12.2356, lng: 109.1967 },
  'doc-let-beach': { lat: 12.4512, lng: 109.2234 },
  'jungle-beach': { lat: 12.3523, lng: 109.2567 },
  'bai-dai-beach': { lat: 12.1089, lng: 109.1789 },
  'yang-bay': { lat: 12.1234, lng: 108.9567 },
  'ba-ho-waterfall': { lat: 12.3423, lng: 109.2234 },
  'fairy-spring': { lat: 12.3689, lng: 109.2123 },
  'long-son-pagoda': { lat: 12.2534, lng: 109.1823 },
  'ponagar-tower': { lat: 12.2656, lng: 109.1956 },
  'cathedral': { lat: 12.2456, lng: 109.1889 },
  'alexandre-yersin': { lat: 12.2478, lng: 109.1867 },
  'dam-market': { lat: 12.2489, lng: 109.1856 },
  'oceanographic-museum': { lat: 12.2189, lng: 109.2134 },
  'vinwonders': { lat: 12.2089, lng: 109.2289 },
  'i-resort': { lat: 12.2823, lng: 109.1567 },
  'thap-ba-hot-spring': { lat: 12.2712, lng: 109.1723 },
  '100-egg': { lat: 12.2756, lng: 109.1689 },

  // Activities
  'scuba-diving': { lat: 12.1689, lng: 109.2456 },
  'snorkeling-tour': { lat: 12.1812, lng: 109.2234 },
  'parasailing': { lat: 12.2356, lng: 109.1967 },
  'jet-ski': { lat: 12.2345, lng: 109.1978 },
  'banana-boat': { lat: 12.2367, lng: 109.1956 },
  'kayaking': { lat: 12.2378, lng: 109.1945 },
  'sup': { lat: 12.2389, lng: 109.1934 },
  'cliff-jumping': { lat: 12.1689, lng: 109.2456 },
  'zipline': { lat: 12.2089, lng: 109.2289 },
  'canyoning': { lat: 12.1234, lng: 108.9567 },
  'rock-climbing': { lat: 12.3234, lng: 109.1234 },
  'mud-bath': { lat: 12.2712, lng: 109.1723 },
  'hot-spring': { lat: 12.2712, lng: 109.1723 },
  'spa-massage': { lat: 12.2398, lng: 109.1923 },
  'yoga-retreat': { lat: 12.2356, lng: 109.1967 },
  'island-hopping': { lat: 12.2234, lng: 109.2134 },
  'fishing-trip': { lat: 12.2234, lng: 109.2134 },
  'food-tour': { lat: 12.2456, lng: 109.1889 },
  'cooking-class': { lat: 12.2423, lng: 109.1901 },
  'pottery-class': { lat: 12.2512, lng: 109.1834 },

  // Shopping
  'dam-market': { lat: 12.2489, lng: 109.1856 },
  'xom-moi-market': { lat: 12.2534, lng: 109.1789 },
  'night-market': { lat: 12.2378, lng: 109.1945 },
  'cho-dam-seafood': { lat: 12.2489, lng: 109.1856 },
  'vinh-hai-market': { lat: 12.2623, lng: 109.1734 },
  'nha-trang-center': { lat: 12.2356, lng: 109.1967 },
  'vincom-plaza': { lat: 12.2412, lng: 109.1878 },
  'lotte-mart': { lat: 12.2534, lng: 109.1823 },
  'big-c': { lat: 12.2456, lng: 109.1867 },
  'nha-trang-souvenir-street': { lat: 12.2423, lng: 109.1889 },
  'shell-handicraft': { lat: 12.2378, lng: 109.1945 },
  'ao-dai-shop': { lat: 12.2389, lng: 109.1923 },
  'lacquerware-shop': { lat: 12.2401, lng: 109.1912 },
  'trung-nguyen-coffee': { lat: 12.2412, lng: 109.1901 },
  'pearl-island': { lat: 12.2378, lng: 109.1945 },
  'bird-nest-shop': { lat: 12.2445, lng: 109.1867 },
  'local-fashion-street': { lat: 12.2467, lng: 109.1845 },
  'tailor-made': { lat: 12.2423, lng: 109.1889 },
};

// Get coordinates for an item
export function getCoordinates(itemId: string): Coordinates | null {
  return locationCoordinates[itemId] || null;
}

// Calculate distance between two points (Haversine formula) - fallback when API is unavailable
export function calculateDistance(from: Coordinates, to: Coordinates): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Estimate travel times based on distance (fallback when API is unavailable)
export function estimateTravelTime(distanceKm: number): TravelTimeResult {
  // Average speeds
  const walkingSpeed = 5; // km/h
  const drivingSpeed = 30; // km/h (accounting for traffic in Nha Trang)
  const transitSpeed = 20; // km/h (including waiting time)

  const walkingMinutes = Math.round((distanceKm / walkingSpeed) * 60);
  const drivingMinutes = Math.round((distanceKm / drivingSpeed) * 60);
  const transitMinutes = Math.round((distanceKm / transitSpeed) * 60);

  return {
    walking: {
      mode: 'WALKING',
      duration: formatDuration(walkingMinutes),
      durationValue: walkingMinutes * 60,
      distance: formatDistance(distanceKm),
      distanceValue: distanceKm * 1000,
    },
    driving: {
      mode: 'DRIVING',
      duration: formatDuration(drivingMinutes),
      durationValue: drivingMinutes * 60,
      distance: formatDistance(distanceKm),
      distanceValue: distanceKm * 1000,
    },
    transit: {
      mode: 'TRANSIT',
      duration: formatDuration(transitMinutes),
      durationValue: transitMinutes * 60,
      distance: formatDistance(distanceKm),
      distanceValue: distanceKm * 1000,
    },
  };
}

function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}분`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours}시간`;
  }
  return `${hours}시간 ${mins}분`;
}

function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`;
  }
  return `${km.toFixed(1)}km`;
}

// Google Maps Distance Matrix API call
export async function getTravelTimeFromAPI(
  origin: Coordinates,
  destination: Coordinates,
  mode: TravelMode,
  apiKey: string
): Promise<TravelTime | null> {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?` +
      `origins=${origin.lat},${origin.lng}` +
      `&destinations=${destination.lat},${destination.lng}` +
      `&mode=${mode.toLowerCase()}` +
      `&language=ko` +
      `&key=${apiKey}`
    );

    const data = await response.json();

    if (data.status === 'OK' && data.rows[0]?.elements[0]?.status === 'OK') {
      const element = data.rows[0].elements[0];
      return {
        mode,
        duration: element.duration.text,
        durationValue: element.duration.value,
        distance: element.distance.text,
        distanceValue: element.distance.value,
      };
    }

    return null;
  } catch (error) {
    console.error('Google Maps API error:', error);
    return null;
  }
}

// Get travel times for all modes
export async function getAllTravelTimes(
  origin: Coordinates,
  destination: Coordinates,
  apiKey?: string
): Promise<TravelTimeResult> {
  // If no API key, use estimation based on distance
  if (!apiKey) {
    const distance = calculateDistance(origin, destination);
    return estimateTravelTime(distance);
  }

  // Call API for all modes
  const [driving, walking, transit] = await Promise.all([
    getTravelTimeFromAPI(origin, destination, 'DRIVING', apiKey),
    getTravelTimeFromAPI(origin, destination, 'WALKING', apiKey),
    getTravelTimeFromAPI(origin, destination, 'TRANSIT', apiKey),
  ]);

  // Fallback to estimation if API fails
  if (!driving && !walking && !transit) {
    const distance = calculateDistance(origin, destination);
    return estimateTravelTime(distance);
  }

  return {
    driving: driving || undefined,
    walking: walking || undefined,
    transit: transit || undefined,
  };
}

// Get travel time between two itinerary items
export function getTravelTimeBetweenItems(
  fromItemId: string,
  toItemId: string
): TravelTimeResult | null {
  const fromCoords = getCoordinates(fromItemId);
  const toCoords = getCoordinates(toItemId);

  if (!fromCoords || !toCoords) {
    return null;
  }

  const distance = calculateDistance(fromCoords, toCoords);
  return estimateTravelTime(distance);
}

// Travel mode display info
export const travelModeInfo: Record<TravelMode, { name: string; icon: string; color: string }> = {
  WALKING: { name: '도보', icon: '🚶', color: 'green' },
  DRIVING: { name: '차량', icon: '🚗', color: 'blue' },
  TRANSIT: { name: '대중교통', icon: '🚌', color: 'purple' },
};
