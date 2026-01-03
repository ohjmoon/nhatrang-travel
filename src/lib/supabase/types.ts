export type PlaceType = 'restaurant' | 'attraction' | 'activity' | 'shopping';

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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      place_type: PlaceType;
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
