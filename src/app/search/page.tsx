'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Palmtree,
  Search,
  Star,
  X,
  ArrowLeft,
  Building2,
  UtensilsCrossed,
  Landmark,
  Compass,
  ShoppingBag,
  Filter,
  Loader2,
} from 'lucide-react';
import { useGlobalSearch, type SearchResult, type SearchResultType } from '@/lib/supabase/hooks';

const typeConfig: Record<SearchResultType, {
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  href: string;
}> = {
  accommodation: {
    label: '숙소',
    icon: Building2,
    color: 'text-ocean-600',
    bgColor: 'bg-ocean-100',
    href: '/accommodation',
  },
  restaurant: {
    label: '맛집',
    icon: UtensilsCrossed,
    color: 'text-sunset-600',
    bgColor: 'bg-sunset-100',
    href: '/restaurants',
  },
  attraction: {
    label: '볼거리',
    icon: Landmark,
    color: 'text-palm-600',
    bgColor: 'bg-palm-100',
    href: '/attractions',
  },
  activity: {
    label: '액티비티',
    icon: Compass,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    href: '/activities',
  },
  shopping: {
    label: '쇼핑',
    icon: ShoppingBag,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    href: '/shopping',
  },
};

// Loading fallback component
function SearchPageLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-ocean-50 via-white to-palm-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-ocean-500 animate-spin mx-auto mb-4" />
        <p className="text-ocean-600">로딩 중...</p>
      </div>
    </div>
  );
}

// Main search page wrapper with Suspense
export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageLoading />}>
      <SearchPageContent />
    </Suspense>
  );
}

// Actual search page content
function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedType, setSelectedType] = useState<SearchResultType | 'all'>('all');

  const { results, loading, error } = useGlobalSearch(searchQuery);

  // Filter results by type
  const filteredResults = useMemo(() => {
    if (selectedType === 'all') return results;
    return results.filter(r => r.type === selectedType);
  }, [results, selectedType]);

  // Group results by type for counts
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = { all: results.length };
    results.forEach(r => {
      counts[r.type] = (counts[r.type] || 0) + 1;
    });
    return counts;
  }, [results]);

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
            <Link href="/accommodation" className="text-ocean-700 hover:text-ocean-500 transition-colors">숙소</Link>
            <Link href="/restaurants" className="text-ocean-700 hover:text-ocean-500 transition-colors">맛집</Link>
            <Link href="/attractions" className="text-ocean-700 hover:text-ocean-500 transition-colors">볼거리</Link>
            <Link href="/activities" className="text-ocean-700 hover:text-ocean-500 transition-colors">액티비티</Link>
          </div>
          <Button variant="ocean" size="sm">
            일정 만들기
          </Button>
        </div>
      </nav>

      {/* Header */}
      <header className="pt-24 pb-8 px-4 bg-gradient-to-r from-ocean-500 to-palm-500">
        <div className="container mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-ocean-100 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>홈으로</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">통합 검색</h1>

          {/* Search Input */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ocean-400" />
            <input
              type="text"
              placeholder="숙소, 맛집, 볼거리, 액티비티, 쇼핑 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full pl-12 pr-4 py-4 rounded-xl border-0 shadow-lg focus:ring-2 focus:ring-white/50 outline-none text-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="sticky top-16 z-40 bg-white border-b border-ocean-100 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedType === 'all'
                  ? 'bg-ocean-500 text-white'
                  : 'bg-ocean-50 text-ocean-700 hover:bg-ocean-100'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>전체</span>
              {typeCounts.all > 0 && (
                <span className={`text-xs ${selectedType === 'all' ? 'text-ocean-200' : 'text-ocean-400'}`}>
                  {typeCounts.all}
                </span>
              )}
            </button>

            {(Object.keys(typeConfig) as SearchResultType[]).map(type => {
              const config = typeConfig[type];
              const count = typeCounts[type] || 0;
              const Icon = config.icon;

              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    selectedType === type
                      ? 'bg-ocean-500 text-white'
                      : 'bg-ocean-50 text-ocean-700 hover:bg-ocean-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{config.label}</span>
                  {count > 0 && (
                    <span className={`text-xs ${selectedType === type ? 'text-ocean-200' : 'text-ocean-400'}`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results */}
      <main className="container mx-auto px-4 py-8">
        {/* Initial State */}
        {!searchQuery && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-ocean-100 flex items-center justify-center">
              <Search className="w-10 h-10 text-ocean-400" />
            </div>
            <h3 className="text-xl font-semibold text-ocean-800 mb-2">검색어를 입력하세요</h3>
            <p className="text-ocean-600">
              숙소, 맛집, 볼거리, 액티비티, 쇼핑 정보를 한 번에 검색할 수 있습니다
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && searchQuery && (
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
            <h3 className="text-xl font-semibold text-red-800 mb-2">검색 중 오류가 발생했습니다</h3>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Results */}
        {!loading && !error && searchQuery && searchQuery.length >= 2 && (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-ocean-600">
                <span className="font-semibold text-ocean-800">{filteredResults.length}</span>개의 검색 결과
                {searchQuery && <span className="text-ocean-500"> &quot;{searchQuery}&quot;</span>}
              </p>
            </div>

            {filteredResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResults.map((result) => (
                  <SearchResultCard key={`${result.type}-${result.id}`} result={result} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-ocean-100 flex items-center justify-center">
                  <Search className="w-10 h-10 text-ocean-400" />
                </div>
                <h3 className="text-xl font-semibold text-ocean-800 mb-2">검색 결과가 없습니다</h3>
                <p className="text-ocean-600 mb-4">다른 검색어를 사용해 보세요</p>
                {selectedType !== 'all' && (
                  <Button variant="ocean" onClick={() => setSelectedType('all')}>
                    전체 결과 보기
                  </Button>
                )}
              </div>
            )}
          </>
        )}

        {/* Too short query */}
        {searchQuery && searchQuery.length < 2 && !loading && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-ocean-100 flex items-center justify-center">
              <Search className="w-10 h-10 text-ocean-400" />
            </div>
            <h3 className="text-xl font-semibold text-ocean-800 mb-2">2글자 이상 입력해주세요</h3>
            <p className="text-ocean-600">더 정확한 검색 결과를 위해 2글자 이상 입력이 필요합니다</p>
          </div>
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

// Search Result Card Component
function SearchResultCard({ result }: { result: SearchResult }) {
  const config = typeConfig[result.type];
  const Icon = config.icon;

  // Get detail link based on type
  const getDetailLink = () => {
    switch (result.type) {
      case 'accommodation':
        return `/accommodation#${result.id}`;
      case 'restaurant':
        return `/restaurants#${result.id}`;
      case 'attraction':
        return `/attractions#${result.id}`;
      case 'activity':
        return `/activities#${result.id}`;
      case 'shopping':
        return `/shopping#${result.id}`;
      default:
        return '#';
    }
  };

  return (
    <Link href={getDetailLink()}>
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={result.image}
            alt={result.nameKo}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Type Badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-3 py-1 rounded-full ${config.bgColor} ${config.color} text-sm font-medium inline-flex items-center gap-1`}>
              <Icon className="w-3.5 h-3.5" />
              {config.label}
            </span>
          </div>

          {/* Rating */}
          {result.rating > 0 && (
            <div className="absolute top-3 right-3">
              <span className="px-2 py-1 rounded-full bg-white/90 text-ocean-700 text-sm font-medium inline-flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                {result.rating.toFixed(1)}
              </span>
            </div>
          )}

          {/* Name on Image */}
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="font-bold text-lg text-white truncate">{result.nameKo}</h3>
            <p className="text-sm text-white/80 truncate">{result.name}</p>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Category or Area */}
          <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
            {result.area && <span>{result.area}</span>}
            {result.category && <span>{result.category}</span>}
            {result.price && (
              <>
                <span className="text-gray-300">|</span>
                <span>{result.price}</span>
              </>
            )}
          </div>

          {/* Description */}
          {result.description && (
            <p className="text-sm text-gray-600 line-clamp-2">{result.description}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
