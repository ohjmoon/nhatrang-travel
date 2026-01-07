// Import all data sources
import { accommodations } from './accommodations';
import { restaurants } from './restaurants';
import { attractions } from './attractions';
import { activities } from './activities';
import { shoppingPlaces } from './shopping';

export type ItemCategory = 'accommodation' | 'restaurant' | 'attraction' | 'activity' | 'shopping';

export interface ItineraryItem {
  id: string;
  itemId: string;
  category: ItemCategory;
  name: string;
  nameKo: string;
  image: string;
  time: string;
  duration?: string;
  notes?: string;
  coordinates?: { lat: number; lng: number } | null;
}

export interface ItineraryDay {
  id: string;
  date: string;
  dayNumber: number;
  items: ItineraryItem[];
}

export interface Itinerary {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  days: ItineraryDay[];
  createdAt: string;
  updatedAt: string;
}

// Category display info
export const categoryInfo: Record<ItemCategory, { name: string; icon: string; color: string }> = {
  accommodation: { name: '숙소', icon: '🏨', color: 'ocean' },
  restaurant: { name: '맛집', icon: '🍜', color: 'sunset' },
  attraction: { name: '볼거리', icon: '📸', color: 'palm' },
  activity: { name: '액티비티', icon: '🎯', color: 'ocean' },
  shopping: { name: '쇼핑', icon: '🛍️', color: 'sunset' },
};

// Get all available items for adding to itinerary
export interface AvailableItem {
  id: string;
  category: ItemCategory;
  name: string;
  nameKo: string;
  image: string;
  rating?: number;
  duration?: string;
  hours?: string;
  price?: string;
  coordinates?: { lat: number; lng: number } | null;
}

export function getAllAvailableItems(): AvailableItem[] {
  const items: AvailableItem[] = [];

  // Add accommodations
  accommodations.forEach((item) => {
    items.push({
      id: item.id,
      category: 'accommodation',
      name: item.name,
      nameKo: item.nameKo,
      image: item.image,
      rating: item.rating,
      price: `${item.priceMin.toLocaleString()}~${item.priceMax.toLocaleString()}원`,
    });
  });

  // Add restaurants
  restaurants.forEach((item) => {
    items.push({
      id: item.id,
      category: 'restaurant',
      name: item.name,
      nameKo: item.nameKo,
      image: item.image,
      rating: item.rating,
      hours: item.hours,
    });
  });

  // Add attractions
  attractions.forEach((item) => {
    items.push({
      id: item.id,
      category: 'attraction',
      name: item.name,
      nameKo: item.nameKo,
      image: item.image,
      rating: item.rating,
      duration: item.duration,
      hours: item.hours,
    });
  });

  // Add activities
  activities.forEach((item) => {
    items.push({
      id: item.id,
      category: 'activity',
      name: item.name,
      nameKo: item.nameKo,
      image: item.image,
      rating: item.rating,
      duration: item.duration,
      price: item.price,
    });
  });

  // Add shopping places
  shoppingPlaces.forEach((item) => {
    items.push({
      id: item.id,
      category: 'shopping',
      name: item.name,
      nameKo: item.nameKo,
      image: item.image,
      rating: item.rating,
      hours: item.hours,
    });
  });

  return items;
}

// Helper to generate unique IDs
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Create a new itinerary
export function createItinerary(title: string, startDate: string, numDays: number): Itinerary {
  const days: ItineraryDay[] = [];
  const start = new Date(startDate);

  for (let i = 0; i < numDays; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    days.push({
      id: generateId(),
      date: date.toISOString().split('T')[0],
      dayNumber: i + 1,
      items: [],
    });
  }

  const endDate = new Date(start);
  endDate.setDate(endDate.getDate() + numDays - 1);

  return {
    id: generateId(),
    title,
    startDate,
    endDate: endDate.toISOString().split('T')[0],
    days,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// Add item to a day
export function addItemToDay(
  itinerary: Itinerary,
  dayId: string,
  item: AvailableItem,
  time: string,
  notes?: string
): Itinerary {
  const newItinerary = { ...itinerary };
  const dayIndex = newItinerary.days.findIndex((d) => d.id === dayId);

  if (dayIndex !== -1) {
    const newItem: ItineraryItem = {
      id: generateId(),
      itemId: item.id,
      category: item.category,
      name: item.name,
      nameKo: item.nameKo,
      image: item.image,
      time,
      duration: item.duration,
      notes,
      coordinates: item.coordinates || null,
    };

    newItinerary.days[dayIndex].items.push(newItem);
    // Sort items by time
    newItinerary.days[dayIndex].items.sort((a, b) => a.time.localeCompare(b.time));
    newItinerary.updatedAt = new Date().toISOString();
  }

  return newItinerary;
}

// Remove item from a day
export function removeItemFromDay(
  itinerary: Itinerary,
  dayId: string,
  itemId: string
): Itinerary {
  const newItinerary = { ...itinerary };
  const dayIndex = newItinerary.days.findIndex((d) => d.id === dayId);

  if (dayIndex !== -1) {
    newItinerary.days[dayIndex].items = newItinerary.days[dayIndex].items.filter(
      (item) => item.id !== itemId
    );
    newItinerary.updatedAt = new Date().toISOString();
  }

  return newItinerary;
}

// Format date for display
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  };
  return date.toLocaleDateString('ko-KR', options);
}

// Suggested time slots
export const timeSlots = [
  '06:00', '06:30', '07:00', '07:30', '08:00', '08:30',
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
  '21:00', '21:30', '22:00', '22:30', '23:00',
];
