'use client';

import { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Palmtree,
  Search,
  MapPin,
  Star,
  Filter,
  X,
  ChevronDown,
  Clock,
  Heart,
  ArrowLeft,
  UtensilsCrossed,
  Lightbulb,
  Share2,
  Check,
} from 'lucide-react';
import { MapLinkIcon, GoogleLinksButton } from '@/components/google-links';
import { useRestaurants, useRestaurantCategoryCounts, type RestaurantData } from '@/lib/supabase/hooks';
import { CATEGORY_OPTIONS } from '@/lib/supabase/types';
import { useUrlFilters } from '@/lib/hooks/useUrlFilters';

// Static price ranges for filtering
const priceRanges = [
  { id: 'all', name: '전체' },
  { id: 'budget', name: '~10만동', max: 100000 },
  { id: 'moderate', name: '10-25만동', min: 100000, max: 250000 },
  { id: 'premium', name: '25만동~', min: 250000 },
];

// Default filter values
const defaultFilters = {
  q: '',
  category: 'all',
  price: 'all',
};

function RestaurantsContent() {
  const {
    filters,
    setFilter,
    clearFilters,
    hasActiveFilters,
    copyShareableUrl,
  } = useUrlFilters(defaultFilters);

  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  // Fetch from Supabase
  const { restaurants, loading, error } = useRestaurants();
  const { counts: categoryCounts } = useRestaurantCategoryCounts();

  // Build categories with counts
  const categories = useMemo(() => {
    const baseCategories = [
      { id: 'all', name: '전체', icon: '🍽️', count: restaurants.length },
      ...CATEGORY_OPTIONS.restaurant.map(cat => ({
        id: cat.value,
        name: cat.label,
        icon: cat.icon,
        count: categoryCounts[cat.value] || 0,
      })),
    ];
    return baseCategories.filter(cat => cat.id === 'all' || cat.count > 0);
  }, [restaurants.length, categoryCounts]);

  // Filter restaurants
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((r) => {
      // Category filter
      if (filters.category !== 'all' && r.category !== filters.category) {
        return false;
      }
      // Price filter
      if (filters.price !== 'all') {
        const priceRange = priceRanges.find((p) => p.id === filters.price);
        if (priceRange) {
          const rangeMin = ('min' in priceRange && priceRange.min) ? priceRange.min : 0;
          const rangeMax = ('max' in priceRange && priceRange.max) ? priceRange.max : Infinity;
          const rMin = r.priceValue?.min ?? 0;
          const rMax = r.priceValue?.max ?? Infinity;
          if (rMin < rangeMin || rMax > rangeMax) {
            return false;
          }
        }
      }
      // Search filter
      if (filters.q) {
        const query = filters.q.toLowerCase();
        return (
          r.name.toLowerCase().includes(query) ||
          r.nameKo.toLowerCase().includes(query) ||
          r.recommendedMenu.some((m) => m.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [restaurants, filters]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleShare = async () => {
    const success = await copyShareableUrl();
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sunset-50 via-white to-palm-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-sunset-100">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ocean-500 to-palm-500 flex items-center justify-center">
                <Palmtree className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl text-ocean-800 hidden sm:block">나트랑 트래블</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/accommodation" className="text-ocean-700 hover:text-ocean-500 transition-colors">숙소</Link>
            <Link href="/restaurants" className="text-sunset-500 font-medium">맛집</Link>
            <Link href="/attractions" className="text-ocean-700 hover:text-ocean-500 transition-colors">볼거리</Link>
            <Link href="/activities" className="text-ocean-700 hover:text-ocean-500 transition-colors">액티비티</Link>
          </div>
          <Button variant="ocean" size="sm">
            일정 만들기
          </Button>
        </div>
      </nav>

      {/* Header */}
      <header className="pt-24 pb-8 px-4 bg-gradient-to-r from-sunset-500 to-sunset-600">
        <div className="container mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sunset-100 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>홈으로</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">맛집</h1>
          <p className="text-sunset-100">나트랑 현지인 추천 맛집을 만나보세요</p>
        </div>
      </header>

      {/* Search & Filters */}
      <div className="sticky top-16 z-40 bg-white border-b border-sunset-100 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          {/* Search Bar */}
          <div className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sunset-400" />
              <input
                type="text"
                placeholder="식당명, 메뉴로 검색..."
                value={filters.q}
                onChange={(e) => setFilter('q', e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-sunset-200 focus:border-sunset-500 focus:ring-2 focus:ring-sunset-500/20 outline-none transition-all"
              />
            </div>
            <Button
              variant="outline"
              className="flex items-center gap-2 border-sunset-200"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">필터</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-sunset-500" />
              )}
            </Button>
            {hasActiveFilters && (
              <Button
                variant="outline"
                className="flex items-center gap-2 border-sunset-200"
                onClick={handleShare}
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
                <span className="hidden sm:inline">{copied ? '복사됨' : '공유'}</span>
              </Button>
            )}
          </div>

          {/* Quick Filters - Category Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setFilter('category', category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  filters.category === category.id
                    ? 'bg-sunset-500 text-white'
                    : 'bg-sunset-50 text-sunset-700 hover:bg-sunset-100'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
                {category.id !== 'all' && (
                  <span className={`text-xs ${filters.category === category.id ? 'text-sunset-200' : 'text-sunset-400'}`}>
                    {category.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-sunset-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Price Filter */}
                <div>
                  <label className="block text-sm font-medium text-sunset-700 mb-2">
                    가격대
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {priceRanges.map((range) => (
                      <button
                        key={range.id}
                        onClick={() => setFilter('price', range.id)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                          filters.price === range.id
                            ? 'bg-palm-500 text-white'
                            : 'bg-palm-50 text-palm-700 hover:bg-palm-100'
                        }`}
                      >
                        {range.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      onClick={clearFilters}
                      className="text-sunset-600"
                    >
                      <X className="w-4 h-4 mr-2" />
                      필터 초기화
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <main className="container mx-auto px-4 py-8">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sunset-500" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <X className="w-10 h-10 text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-red-800 mb-2">데이터를 불러올 수 없습니다</h3>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Results Count */}
        {!loading && !error && (
          <>
        <div className="flex items-center justify-between mb-6">
          <p className="text-sunset-600">
            <span className="font-semibold text-sunset-800">{filteredRestaurants.length}</span>개의 맛집
          </p>
          <div className="flex items-center gap-2 text-sm text-sunset-600">
            <span>정렬:</span>
            <button className="flex items-center gap-1 font-medium text-sunset-800">
              평점순 <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Restaurant Grid */}
        {filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                isFavorite={favorites.includes(restaurant.id)}
                onToggleFavorite={() => toggleFavorite(restaurant.id)}
                categories={categories}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-sunset-100 flex items-center justify-center">
              <UtensilsCrossed className="w-10 h-10 text-sunset-400" />
            </div>
            <h3 className="text-xl font-semibold text-sunset-800 mb-2">
              검색 결과가 없습니다
            </h3>
            <p className="text-sunset-600 mb-4">
              다른 검색어나 필터를 사용해 보세요
            </p>
            <Button variant="sunset" onClick={clearFilters}>
              필터 초기화
            </Button>
          </div>
          )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-ocean-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-ocean-400 text-sm">
          &copy; 2024 Nha Trang Travel. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

// Restaurant Card Component
function RestaurantCard({
  restaurant,
  isFavorite,
  onToggleFavorite,
  categories,
}: {
  restaurant: RestaurantData;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  categories: { id: string; name: string; icon: string; count: number }[];
}) {
  const category = categories.find((c) => c.id === restaurant.category);

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.nameKo}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <MapLinkIcon
            name={restaurant.name}
            address={restaurant.address}
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite();
            }}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              isFavorite
                ? 'bg-sunset-500 text-white'
                : 'bg-white/80 text-sunset-600 hover:bg-white'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 rounded-full bg-white/90 text-sunset-700 text-sm font-medium">
            {category?.icon} {category?.name}
          </span>
        </div>

        {/* Price Badge */}
        <div className="absolute bottom-3 right-3">
          <span className="px-3 py-1 rounded-full bg-sunset-500 text-white text-sm font-medium">
            {restaurant.priceRange}
          </span>
        </div>

        {/* Name on Image */}
        <div className="absolute bottom-3 left-3 right-16">
          <h3 className="font-bold text-lg text-white truncate">
            {restaurant.nameKo}
          </h3>
          <p className="text-sm text-white/80 truncate">{restaurant.name}</p>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Rating & Reviews */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1 text-sunset-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-semibold">{restaurant.rating}</span>
          </div>
          <span className="text-sunset-400 text-sm">
            ({restaurant.reviewCount.toLocaleString()}개 리뷰)
          </span>
        </div>

        {/* Info */}
        <div className="space-y-2 mb-3">
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4 mt-0.5 text-sunset-400 flex-shrink-0" />
            <span>{restaurant.hours}</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 mt-0.5 text-sunset-400 flex-shrink-0" />
            <span className="truncate">{restaurant.address}</span>
          </div>
        </div>

        {/* Recommended Menu */}
        <div className="mb-3">
          <p className="text-xs text-sunset-500 font-medium mb-1.5">추천 메뉴</p>
          <div className="flex flex-wrap gap-1.5">
            {restaurant.recommendedMenu.slice(0, 3).map((menu, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-sunset-50 text-sunset-700 text-xs rounded-md"
              >
                {menu}
              </span>
            ))}
            {restaurant.recommendedMenu.length > 3 && (
              <span className="px-2 py-1 text-sunset-400 text-xs">
                +{restaurant.recommendedMenu.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Tips */}
        {restaurant.tips && (
          <div className="flex items-start gap-2 p-2 bg-palm-50 rounded-lg mb-3">
            <Lightbulb className="w-4 h-4 text-palm-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-palm-700 line-clamp-2">{restaurant.tips}</p>
          </div>
        )}

        {/* Google Links */}
        <GoogleLinksButton
          name={restaurant.name}
          nameKo={restaurant.nameKo}
          address={restaurant.address}
          variant="compact"
        />
      </CardContent>
    </Card>
  );
}

// Export with Suspense wrapper for useSearchParams
export default function RestaurantsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-sunset-50 via-white to-palm-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sunset-500" />
      </div>
    }>
      <RestaurantsContent />
    </Suspense>
  );
}
