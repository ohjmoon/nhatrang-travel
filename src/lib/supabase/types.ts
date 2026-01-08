// Supabase JSON type
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type PlaceType = 'restaurant' | 'attraction' | 'activity' | 'shopping';

// Accommodation types
export type AccommodationArea = 'camranh' | 'city' | 'vinpearl' | 'honchong' | 'ninhvan';
export type AccommodationPurpose = 'family' | 'couple' | 'allinclusive' | 'budget' | 'residence';
export type AccommodationPriceRange = '$' | '$$' | '$$$' | '$$$$';

export type RestaurantCategory = 'korean' | 'vietnamese' | 'seafood' | 'cafe' | 'bar' | 'western' | 'japanese' | 'etc';
export type AttractionCategory = 'island' | 'nature' | 'culture' | 'theme-park';
export type ActivityCategory = 'water' | 'spa' | 'tour' | 'party';
export type ShoppingCategory = 'mart' | 'mall' | 'market' | 'night-market';

export type PlaceCategory = RestaurantCategory | AttractionCategory | ActivityCategory | ShoppingCategory;

// Row types
export interface Place {
  id: string;
  created_at: string;
  updated_at: string;
  type: PlaceType;
  category: string;
  slug: string;
  name: string;
  name_ko: string;
  description: string | null;
  address: string | null;
  location: string | null;
  hours: string | null;
  price: string | null;
  price_min: number | null;
  price_max: number | null;
  duration: string | null;
  tips: string | null;
  features: string[] | null;
  recommended_items: string[] | null;
  coordinates: { lat: number; lng: number } | null;
  thumbnail: string | null;
  is_published: boolean;
  sort_order: number;
  // Google Places integration
  google_place_id: string | null;
  google_rating: number | null;
  google_reviews_count: number | null;
  phone: string | null;
  website: string | null;
  google_synced_at: string | null;
}

export interface PlaceImage {
  id: string;
  created_at: string;
  place_id: string;
  url: string;
  alt: string | null;
  sort_order: number;
  is_thumbnail: boolean;
}

export interface AccommodationImage {
  id: string;
  created_at: string;
  accommodation_id: string;
  url: string;
  alt: string | null;
  sort_order: number;
  is_thumbnail: boolean;
}

export type AccommodationImageInsert = Omit<AccommodationImage, 'id' | 'created_at'> & {
  id?: string;
  created_at?: string;
};

// Accommodation row type
export interface Accommodation {
  id: string;
  created_at: string;
  updated_at: string;
  slug: string;
  name: string;
  name_ko: string;
  area: AccommodationArea;
  area_name: string;
  purposes: AccommodationPurpose[];
  price_range: AccommodationPriceRange;
  price_min: number | null;
  price_max: number | null;
  rating: number;
  review_count: number;
  description: string | null;
  features: string[] | null;
  amenities: string[] | null;
  thumbnail: string | null;
  latitude: number | null;
  longitude: number | null;
  is_new: boolean;
  open_year: number | null;
  is_published: boolean;
  sort_order: number;
  // Google Places integration
  google_place_id: string | null;
  google_rating: number | null;
  google_reviews_count: number | null;
  phone: string | null;
  website: string | null;
  google_synced_at: string | null;
}

export type AccommodationInsert = Omit<Accommodation, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type AccommodationUpdate = Partial<AccommodationInsert>;

export interface Category {
  id: string;
  created_at: string;
  type: PlaceType;
  slug: string;
  name: string;
  name_ko: string;
  icon: string;
  sort_order: number;
}

// Insert types
export type PlaceInsert = Omit<Place, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type PlaceImageInsert = Omit<PlaceImage, 'id' | 'created_at'> & {
  id?: string;
  created_at?: string;
};

// Update types
export type PlaceUpdate = Partial<PlaceInsert>;

// Extended types with relations
export interface PlaceWithImages extends Place {
  images: PlaceImage[];
}

export interface AccommodationWithImages extends Accommodation {
  images: AccommodationImage[];
}

// Itinerary types for application use
export interface ItineraryDayData {
  id: string;
  date: string;
  dayNumber: number;
  items: ItineraryItemData[];
}

export interface ItineraryItemData {
  id: string;
  itemId: string;
  category: string;
  name: string;
  nameKo: string;
  image: string;
  time: string;
  duration?: string;
  notes?: string;
}

// Database row type (days stored as JSONB)
export interface ItineraryRow {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string;
  days: Json;
  total_places: number;
  thumbnail: string | null;
}

// Application type with typed days
export interface Itinerary {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string;
  days: ItineraryDayData[];
  total_places: number;
  thumbnail: string | null;
}

export type ItineraryInsert = {
  id?: string;
  created_at?: string;
  updated_at?: string;
  title: string;
  description?: string | null;
  start_date: string;
  end_date: string;
  days: Json;
  total_places: number;
  thumbnail?: string | null;
};

export type ItineraryUpdate = Partial<ItineraryInsert>;

// Database interface (must be after all table types are defined)
export interface Database {
  public: {
    Tables: {
      places: {
        Row: Place;
        Insert: PlaceInsert;
        Update: PlaceUpdate;
        Relationships: [];
      };
      place_images: {
        Row: PlaceImage;
        Insert: PlaceImageInsert;
        Update: Partial<PlaceImageInsert>;
        Relationships: [
          {
            foreignKeyName: 'place_images_place_id_fkey';
            columns: ['place_id'];
            referencedRelation: 'places';
            referencedColumns: ['id'];
          }
        ];
      };
      categories: {
        Row: Category;
        Insert: Omit<Category, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Category, 'id' | 'created_at'>>;
        Relationships: [];
      };
      itineraries: {
        Row: ItineraryRow;
        Insert: ItineraryInsert;
        Update: ItineraryUpdate;
        Relationships: [];
      };
      accommodations: {
        Row: Accommodation;
        Insert: AccommodationInsert;
        Update: AccommodationUpdate;
        Relationships: [];
      };
      accommodation_images: {
        Row: AccommodationImage;
        Insert: AccommodationImageInsert;
        Update: Partial<AccommodationImageInsert>;
        Relationships: [
          {
            foreignKeyName: 'accommodation_images_accommodation_id_fkey';
            columns: ['accommodation_id'];
            referencedRelation: 'accommodations';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      place_type: PlaceType;
      accommodation_area: AccommodationArea;
      accommodation_purpose: AccommodationPurpose;
      accommodation_price_range: AccommodationPriceRange;
    };
    CompositeTypes: Record<string, never>;
  };
}

// Category definitions for UI
export const PLACE_TYPE_LABELS: Record<PlaceType, { name: string; nameKo: string; icon: string }> = {
  restaurant: { name: 'Restaurants', nameKo: '맛집', icon: '🍽️' },
  attraction: { name: 'Attractions', nameKo: '볼거리', icon: '🏝️' },
  activity: { name: 'Activities', nameKo: '액티비티', icon: '🎯' },
  shopping: { name: 'Shopping', nameKo: '쇼핑', icon: '🛒' },
};

export const CATEGORY_OPTIONS: Record<PlaceType, { value: string; label: string; icon: string }[]> = {
  restaurant: [
    { value: 'korean', label: '한식', icon: '🍚' },
    { value: 'vietnamese', label: '베트남음식', icon: '🍜' },
    { value: 'seafood', label: '해산물', icon: '🦐' },
    { value: 'cafe', label: '카페', icon: '☕' },
    { value: 'bar', label: '바/펍', icon: '🍺' },
    { value: 'western', label: '양식', icon: '🍝' },
    { value: 'japanese', label: '일식', icon: '🍣' },
    { value: 'etc', label: '기타', icon: '🍴' },
  ],
  attraction: [
    { value: 'island', label: '섬/해변', icon: '🏖️' },
    { value: 'nature', label: '자연/폭포', icon: '🌿' },
    { value: 'culture', label: '문화/역사', icon: '🏛️' },
    { value: 'theme-park', label: '테마파크', icon: '🎢' },
  ],
  activity: [
    { value: 'water', label: '수상 액티비티', icon: '🌊' },
    { value: 'spa', label: '스파/힐링', icon: '🧖' },
    { value: 'tour', label: '근교 투어', icon: '🚗' },
    { value: 'party', label: '파티/나이트', icon: '🎉' },
  ],
  shopping: [
    { value: 'mart', label: '대형마트', icon: '🏪' },
    { value: 'mall', label: '쇼핑몰', icon: '🏬' },
    { value: 'market', label: '전통시장', icon: '🏮' },
    { value: 'night-market', label: '야시장', icon: '🌙' },
  ],
};

// Accommodation area options
export const ACCOMMODATION_AREAS: { id: AccommodationArea | 'all'; name: string; nameEn: string }[] = [
  { id: 'all', name: '전체', nameEn: 'All' },
  { id: 'camranh', name: '깜란', nameEn: 'Cam Ranh' },
  { id: 'city', name: '시내', nameEn: 'City Center' },
  { id: 'vinpearl', name: '빈펄', nameEn: 'Vinpearl' },
  { id: 'honchong', name: '혼총', nameEn: 'Hon Chong' },
  { id: 'ninhvan', name: '닌반베이', nameEn: 'Ninh Van Bay' },
];

// Accommodation purpose options
export const ACCOMMODATION_PURPOSES: { id: AccommodationPurpose | 'all'; name: string; icon: string }[] = [
  { id: 'all', name: '전체', icon: '🏨' },
  { id: 'family', name: '가족', icon: '👨‍👩‍👧‍👦' },
  { id: 'couple', name: '커플/허니문', icon: '💑' },
  { id: 'allinclusive', name: '올인클루시브', icon: '🌟' },
  { id: 'budget', name: '가성비', icon: '💰' },
  { id: 'residence', name: '레지던스', icon: '🏠' },
];

// Accommodation price range options
export const ACCOMMODATION_PRICE_RANGES: { id: AccommodationPriceRange | 'all'; name: string; min: number; max: number }[] = [
  { id: 'all', name: '전체', min: 0, max: Infinity },
  { id: '$', name: '~10만원', min: 0, max: 100000 },
  { id: '$$', name: '10~20만원', min: 100000, max: 200000 },
  { id: '$$$', name: '20~40만원', min: 200000, max: 400000 },
  { id: '$$$$', name: '40만원~', min: 400000, max: Infinity },
];
