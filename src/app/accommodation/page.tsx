'use client';

import { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Palmtree,
  Search,
  Star,
  Filter,
  X,
  ChevronDown,
  Heart,
  ArrowLeft,
  Sparkles,
  Share2,
  Check,
} from 'lucide-react';
import { MapLinkIcon, GoogleLinksButton } from '@/components/google-links';
import { useAccommodations, useAccommodationAreaCounts, useAccommodationPurposeCounts, type AccommodationData } from '@/lib/supabase/hooks';
import {
  ACCOMMODATION_AREAS,
  ACCOMMODATION_PURPOSES,
  ACCOMMODATION_PRICE_RANGES,
  type AccommodationPurpose,
} from '@/lib/supabase/types';
import { useUrlFilters } from '@/lib/hooks/useUrlFilters';

const defaultFilters = {
  q: '',
  area: 'all',
  purpose: 'all',
  price: 'all',
};

function AccommodationContent() {
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
  const { accommodations, loading, error } = useAccommodations();
  const { counts: areaCounts } = useAccommodationAreaCounts();
  const { counts: purposeCounts } = useAccommodationPurposeCounts();

  // Build areas with counts
  const areasWithCounts = useMemo(() => {
    return ACCOMMODATION_AREAS.map(area => ({
      ...area,
      count: area.id === 'all' ? accommodations.length : (areaCounts[area.id] || 0),
    })).filter(area => area.id === 'all' || area.count > 0);
  }, [accommodations.length, areaCounts]);

  // Build purposes with counts
  const purposesWithCounts = useMemo(() => {
    return ACCOMMODATION_PURPOSES.map(purpose => ({
      ...purpose,
      count: purpose.id === 'all' ? accommodations.length : (purposeCounts[purpose.id] || 0),
    })).filter(purpose => purpose.id === 'all' || purpose.count > 0);
  }, [accommodations.length, purposeCounts]);

  // Filter accommodations
  const filteredAccommodations = useMemo(() => {
    return accommodations.filter((acc) => {
      // Area filter
      if (filters.area !== 'all' && acc.area !== filters.area) {
        return false;
      }

      // Purpose filter
      if (filters.purpose !== 'all' && !acc.purposes.includes(filters.purpose as AccommodationPurpose)) {
        return false;
      }

      // Price filter
      if (filters.price !== 'all') {
        const range = ACCOMMODATION_PRICE_RANGES.find(r => r.id === filters.price);
        if (range && (acc.priceMin > range.max || acc.priceMax < range.min)) {
          return false;
        }
      }

      // Search filter
      if (filters.q) {
        const query = filters.q.toLowerCase();
        return (
          acc.name.toLowerCase().includes(query) ||
          acc.nameKo.toLowerCase().includes(query) ||
          acc.areaName.includes(filters.q) ||
          acc.description.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [accommodations, filters]);

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-ocean-50 via-white to-palm-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-ocean-100">
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
            <Link href="/accommodation" className="text-ocean-500 font-medium">숙소</Link>
            <Link href="/restaurants" className="text-ocean-700 hover:text-ocean-500 transition-colors">맛집</Link>
            <Link href="/attractions" className="text-ocean-700 hover:text-ocean-500 transition-colors">볼거리</Link>
            <Link href="/activities" className="text-ocean-700 hover:text-ocean-500 transition-colors">액티비티</Link>
          </div>
          <Link href="/itinerary">
            <Button variant="ocean" size="sm">
              일정 만들기
            </Button>
          </Link>
        </div>
      </nav>

      {/* Header */}
      <header className="pt-24 pb-8 px-4 bg-gradient-to-r from-ocean-500 to-ocean-600">
        <div className="container mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-ocean-100 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>홈으로</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">숙소</h1>
          <p className="text-ocean-100">나트랑 최고의 호텔과 리조트를 찾아보세요</p>
        </div>
      </header>

      {/* Search & Filters */}
      <div className="sticky top-16 z-40 bg-white border-b border-ocean-100 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          {/* Search Bar */}
          <div className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ocean-400" />
              <input
                type="text"
                placeholder="호텔명, 지역으로 검색..."
                value={filters.q}
                onChange={(e) => setFilter('q', e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-ocean-200 focus:border-ocean-500 focus:ring-2 focus:ring-ocean-500/20 outline-none transition-all"
              />
            </div>
            <Button
              variant="outline"
              className="flex items-center gap-2 border-ocean-200"
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
                className="flex items-center gap-2 border-ocean-200"
                onClick={handleShare}
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
                <span className="hidden sm:inline">{copied ? '복사됨' : '공유'}</span>
              </Button>
            )}
          </div>

          {/* Quick Filters - Area Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {areasWithCounts.map((area) => (
              <button
                key={area.id}
                onClick={() => setFilter('area', area.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  filters.area === area.id
                    ? 'bg-ocean-500 text-white'
                    : 'bg-ocean-50 text-ocean-700 hover:bg-ocean-100'
                }`}
              >
                <span>{area.name}</span>
                {area.id !== 'all' && (
                  <span className={`text-xs ${filters.area === area.id ? 'text-ocean-200' : 'text-ocean-400'}`}>
                    {area.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-ocean-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Purpose Filter */}
                <div>
                  <label className="block text-sm font-medium text-ocean-700 mb-2">
                    여행 목적
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {purposesWithCounts.map((purpose) => (
                      <button
                        key={purpose.id}
                        onClick={() => setFilter('purpose', purpose.id)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                          filters.purpose === purpose.id
                            ? 'bg-sunset-500 text-white'
                            : 'bg-sunset-50 text-sunset-700 hover:bg-sunset-100'
                        }`}
                      >
                        {purpose.icon} {purpose.name}
                        {purpose.id !== 'all' && (
                          <span className={`ml-1 text-xs ${filters.purpose === purpose.id ? 'text-sunset-200' : 'text-sunset-400'}`}>
                            ({purpose.count})
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div>
                  <label className="block text-sm font-medium text-ocean-700 mb-2">
                    가격대 (1박)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ACCOMMODATION_PRICE_RANGES.map((range) => (
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
                      className="text-ocean-600"
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-500" />
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
            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-ocean-600">
                <span className="font-semibold text-ocean-800">{filteredAccommodations.length}</span>개의 숙소
              </p>
              <div className="flex items-center gap-2 text-sm text-ocean-600">
                <span>정렬:</span>
                <button className="flex items-center gap-1 font-medium text-ocean-800">
                  추천순 <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Accommodation Grid */}
            {filteredAccommodations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAccommodations.map((accommodation) => (
                  <AccommodationCard
                    key={accommodation.id}
                    accommodation={accommodation}
                    isFavorite={favorites.includes(accommodation.id)}
                    onToggleFavorite={() => toggleFavorite(accommodation.id)}
                    formatPrice={formatPrice}
                    purposes={purposesWithCounts}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-ocean-100 flex items-center justify-center">
                  <Search className="w-10 h-10 text-ocean-400" />
                </div>
                <h3 className="text-xl font-semibold text-ocean-800 mb-2">
                  검색 결과가 없습니다
                </h3>
                <p className="text-ocean-600 mb-4">
                  다른 검색어나 필터를 사용해 보세요
                </p>
                <Button variant="ocean" onClick={clearFilters}>
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

// Accommodation Card Component
function AccommodationCard({
  accommodation,
  isFavorite,
  onToggleFavorite,
  formatPrice,
  purposes,
}: {
  accommodation: AccommodationData;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  formatPrice: (price: number) => string;
  purposes: { id: string; name: string; icon: string; count: number }[];
}) {
  return (
    <Link href={`/accommodation/${accommodation.slug}`}>
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={accommodation.image}
          alt={accommodation.nameKo}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <MapLinkIcon
            name={accommodation.name}
            address={`${accommodation.areaName}, Nha Trang`}
            latitude={accommodation.coordinates?.lat}
            longitude={accommodation.coordinates?.lng}
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite();
            }}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              isFavorite
                ? 'bg-sunset-500 text-white'
                : 'bg-white/80 text-ocean-600 hover:bg-white'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* New Badge */}
        {accommodation.isNew && (
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 rounded-full bg-sunset-500 text-white text-sm font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {accommodation.openYear}년 신상
            </span>
          </div>
        )}

        {/* Area Badge */}
        <div className="absolute bottom-3 left-3">
          <span className="px-3 py-1 rounded-full bg-white/90 text-ocean-700 text-sm font-medium">
            📍 {accommodation.areaName}
          </span>
        </div>

        {/* Price Badge */}
        <div className="absolute bottom-3 right-3">
          <span className="px-3 py-1 rounded-full bg-ocean-500 text-white text-sm font-medium">
            ₩{formatPrice(accommodation.priceMin)}~
          </span>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Rating */}
        {accommodation.rating > 0 && (
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1 text-sunset-500">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-semibold">{accommodation.rating}</span>
            </div>
            {accommodation.reviewCount > 0 && (
              <span className="text-ocean-400 text-sm">
                ({accommodation.reviewCount.toLocaleString()}개 리뷰)
              </span>
            )}
          </div>
        )}

        {/* Name */}
        <h3 className="font-bold text-lg text-ocean-800 mb-1 group-hover:text-ocean-600 transition-colors">
          {accommodation.nameKo}
        </h3>
        <p className="text-sm text-ocean-500 mb-3">{accommodation.name}</p>

        {/* Features */}
        {accommodation.features.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {accommodation.features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-ocean-50 text-ocean-600 text-xs rounded-md"
              >
                {feature}
              </span>
            ))}
          </div>
        )}

        {/* Purpose Tags */}
        <div className="flex gap-1 mb-3">
          {accommodation.purposes.map((p) => {
            const purpose = purposes.find((pur) => pur.id === p);
            return purpose ? (
              <span key={p} className="text-sm" title={purpose.name}>
                {purpose.icon}
              </span>
            ) : null;
          })}
        </div>

        {/* Google Links */}
        <GoogleLinksButton
          name={accommodation.name}
          nameKo={accommodation.nameKo}
          address={`${accommodation.areaName}, Nha Trang`}
          latitude={accommodation.coordinates?.lat}
          longitude={accommodation.coordinates?.lng}
          variant="compact"
        />
      </CardContent>
    </Card>
    </Link>
  );
}

// Export with Suspense wrapper for useSearchParams
export default function AccommodationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-ocean-50 via-white to-palm-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-500" />
      </div>
    }>
      <AccommodationContent />
    </Suspense>
  );
}
