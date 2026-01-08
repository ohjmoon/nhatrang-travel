'use client';

import { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Palmtree,
  Search,
  Star,
  X,
  ChevronDown,
  Clock,
  Heart,
  ArrowLeft,
  ShoppingBag,
  MapPin,
  Tag,
  Lightbulb,
  BadgePercent,
  CreditCard,
  Share2,
  Check,
} from 'lucide-react';
import { MapLinkIcon, GoogleLinksButton } from '@/components/google-links';
import { useShopping, useShoppingCategoryCounts, type ShoppingData } from '@/lib/supabase/hooks';
import { CATEGORY_OPTIONS } from '@/lib/supabase/types';
import { useUrlFilters } from '@/lib/hooks/useUrlFilters';

const priceLevels = [
  { id: 'all', name: '전체' },
  { id: 'budget', name: '저렴' },
  { id: 'moderate', name: '보통' },
  { id: 'premium', name: '고급' },
];

const defaultFilters = {
  q: '',
  category: 'all',
  price: 'all',
};

function ShoppingContent() {
  const {
    filters,
    setFilter,
    clearFilters,
    hasActiveFilters,
    copyShareableUrl,
  } = useUrlFilters(defaultFilters);

  const [favorites, setFavorites] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  // Fetch from Supabase
  const { shopping, loading, error } = useShopping();
  const { counts: categoryCounts } = useShoppingCategoryCounts();

  // Build categories with counts
  const categories = useMemo(() => {
    const baseCategories = [
      { id: 'all', name: '전체', icon: '🛒', count: shopping.length },
      ...CATEGORY_OPTIONS.shopping.map(cat => ({
        id: cat.value,
        name: cat.label,
        icon: cat.icon,
        count: categoryCounts[cat.value] || 0,
      })),
    ];
    return baseCategories.filter(cat => cat.id === 'all' || cat.count > 0);
  }, [shopping.length, categoryCounts]);

  // Filter shopping places
  const filteredPlaces = useMemo(() => {
    return shopping.filter((p) => {
      // Category filter
      if (filters.category !== 'all' && p.category !== filters.category) {
        return false;
      }
      // Price level filter
      if (filters.price !== 'all' && p.priceLevel !== filters.price) {
        return false;
      }
      // Search filter
      if (filters.q) {
        const query = filters.q.toLowerCase();
        return (
          p.name.toLowerCase().includes(query) ||
          p.nameKo.toLowerCase().includes(query) ||
          p.popularItems.some((item) => item.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [shopping, filters]);

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
            <Link href="/restaurants" className="text-ocean-700 hover:text-ocean-500 transition-colors">맛집</Link>
            <Link href="/attractions" className="text-ocean-700 hover:text-ocean-500 transition-colors">볼거리</Link>
            <Link href="/activities" className="text-ocean-700 hover:text-ocean-500 transition-colors">액티비티</Link>
            <Link href="/shopping" className="text-sunset-500 font-medium">쇼핑</Link>
          </div>
          <Link href="/itinerary">
            <Button variant="ocean" size="sm">
              일정 만들기
            </Button>
          </Link>
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
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">쇼핑</h1>
          <p className="text-sunset-100">나트랑에서 특별한 쇼핑을 즐겨보세요</p>
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
                placeholder="상점명, 상품으로 검색..."
                value={filters.q}
                onChange={(e) => setFilter('q', e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-sunset-200 focus:border-sunset-500 focus:ring-2 focus:ring-sunset-500/20 outline-none transition-all"
              />
            </div>
            {hasActiveFilters && (
              <>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-sunset-200"
                  onClick={handleShare}
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
                  <span className="hidden sm:inline">{copied ? '복사됨' : '공유'}</span>
                </Button>
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="text-sunset-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-3">
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

          {/* Price Level Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <span className="text-sm text-sunset-600 flex items-center gap-1 mr-2">
              <Tag className="w-4 h-4" />
              가격대:
            </span>
            {priceLevels.map((level) => (
              <button
                key={level.id}
                onClick={() => setFilter('price', level.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  filters.price === level.id
                    ? 'bg-palm-500 text-white'
                    : 'bg-palm-50 text-palm-700 hover:bg-palm-100'
                }`}
              >
                {level.name}
              </button>
            ))}
          </div>
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

        {/* Results Count & Grid */}
        {!loading && !error && (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sunset-600">
                <span className="font-semibold text-sunset-800">{filteredPlaces.length}</span>개의 쇼핑 장소
              </p>
              <div className="flex items-center gap-2 text-sm text-sunset-600">
                <span>정렬:</span>
                <button className="flex items-center gap-1 font-medium text-sunset-800">
                  인기순 <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Shopping Places Grid */}
            {filteredPlaces.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlaces.map((place) => (
                  <ShoppingCard
                    key={place.id}
                    place={place}
                    isFavorite={favorites.includes(place.id)}
                    onToggleFavorite={() => toggleFavorite(place.id)}
                    categories={categories}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-sunset-100 flex items-center justify-center">
                  <ShoppingBag className="w-10 h-10 text-sunset-400" />
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

// Shopping Card Component
function ShoppingCard({
  place,
  isFavorite,
  onToggleFavorite,
  categories,
}: {
  place: ShoppingData;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  categories: { id: string; name: string; icon: string; count: number }[];
}) {
  const category = categories.find((c) => c.id === place.category);

  const getPriceLevelDisplay = (level: string) => {
    switch (level) {
      case 'budget':
        return { text: '저렴', color: 'bg-green-500' };
      case 'moderate':
        return { text: '보통', color: 'bg-yellow-500' };
      case 'premium':
        return { text: '고급', color: 'bg-purple-500' };
      default:
        return { text: level, color: 'bg-gray-500' };
    }
  };

  const priceDisplay = getPriceLevelDisplay(place.priceLevel);

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={place.image}
          alt={place.nameKo}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <MapLinkIcon
            name={place.name}
            address={place.address}
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

        {/* Bargain Badge */}
        {place.bargainOk && (
          <div className="absolute bottom-3 right-3">
            <span className="px-3 py-1 rounded-full bg-palm-500 text-white text-sm font-medium flex items-center gap-1">
              <BadgePercent className="w-3.5 h-3.5" />
              흥정 가능
            </span>
          </div>
        )}

        {/* Name on Image */}
        <div className="absolute bottom-3 left-3 right-20">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex items-center gap-1 bg-sunset-500 text-white px-2 py-0.5 rounded text-sm">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-medium">{place.rating}</span>
            </div>
            <span className="text-white/80 text-sm">
              ({place.reviewCount.toLocaleString()})
            </span>
          </div>
          <h3 className="font-bold text-lg text-white truncate">
            {place.nameKo}
          </h3>
          <p className="text-sm text-white/80 truncate">{place.name}</p>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-sunset-500 flex-shrink-0" />
            <span className="truncate">{place.hours || '영업시간 문의'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className={`px-2 py-0.5 rounded text-white text-xs font-medium ${priceDisplay.color}`}>
              {priceDisplay.text}
            </span>
            {!place.bargainOk && (
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <CreditCard className="w-3 h-3" />
                정찰제
              </span>
            )}
          </div>
          <div className="col-span-2 flex items-start gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 mt-0.5 text-sunset-500 flex-shrink-0" />
            <span className="truncate">{place.address || '주소 정보 없음'}</span>
          </div>
        </div>

        {/* Popular Items */}
        {place.popularItems && place.popularItems.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-sunset-500 font-medium mb-1.5">인기 상품</p>
            <div className="flex flex-wrap gap-1.5">
              {place.popularItems.slice(0, 4).map((item, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-sunset-50 text-sunset-700 text-xs rounded-md"
                >
                  {item}
                </span>
              ))}
              {place.popularItems.length > 4 && (
                <span className="px-2 py-1 text-sunset-400 text-xs">
                  +{place.popularItems.length - 4}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Highlights */}
        {place.highlights && place.highlights.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1.5">
              {place.highlights.slice(0, 3).map((highlight, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-palm-50 text-palm-700 text-xs rounded-md"
                >
                  {highlight}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        {place.tips && (
          <div className="flex items-start gap-2 p-2 bg-ocean-50 rounded-lg mb-3">
            <Lightbulb className="w-4 h-4 text-ocean-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-ocean-700 line-clamp-2">{place.tips}</p>
          </div>
        )}

        {/* Google Links */}
        <GoogleLinksButton
          name={place.name}
          nameKo={place.nameKo}
          address={place.address}
          variant="compact"
        />
      </CardContent>
    </Card>
  );
}

// Export with Suspense wrapper for useSearchParams
export default function ShoppingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-sunset-50 via-white to-palm-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sunset-500" />
      </div>
    }>
      <ShoppingContent />
    </Suspense>
  );
}
