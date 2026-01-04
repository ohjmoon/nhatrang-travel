'use client';

import { useState, useMemo } from 'react';
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
  Ticket,
  Timer,
  Heart,
  ArrowLeft,
  Camera,
  Lightbulb,
  ExternalLink,
  Navigation,
} from 'lucide-react';
import { MapLinkIcon, GoogleLinksButton } from '@/components/google-links';
import {
  attractions,
  categories,
  filterAttractions,
  type Attraction,
} from '@/data/attractions';

export default function AttractionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);

  const filteredAttractions = useMemo(() => {
    return filterAttractions(attractions, {
      category: selectedCategory,
      search: searchQuery,
    });
  }, [searchQuery, selectedCategory]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'all';

  return (
    <div className="min-h-screen bg-gradient-to-b from-palm-50 via-white to-ocean-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-palm-100">
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
            <Link href="/attractions" className="text-palm-500 font-medium">볼거리</Link>
            <Link href="/activities" className="text-ocean-700 hover:text-ocean-500 transition-colors">액티비티</Link>
          </div>
          <Button variant="ocean" size="sm">
            일정 만들기
          </Button>
        </div>
      </nav>

      {/* Header */}
      <header className="pt-24 pb-8 px-4 bg-gradient-to-r from-palm-500 to-palm-600">
        <div className="container mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-palm-100 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>홈으로</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">볼거리</h1>
          <p className="text-palm-100">나트랑의 아름다운 명소를 탐험하세요</p>
        </div>
      </header>

      {/* Search & Filters */}
      <div className="sticky top-16 z-40 bg-white border-b border-palm-100 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          {/* Search Bar */}
          <div className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-palm-400" />
              <input
                type="text"
                placeholder="명소, 키워드로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-palm-200 focus:border-palm-500 focus:ring-2 focus:ring-palm-500/20 outline-none transition-all"
              />
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="text-palm-600"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategory === category.id
                    ? 'bg-palm-500 text-white'
                    : 'bg-palm-50 text-palm-700 hover:bg-palm-100'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
                {category.id !== 'all' && (
                  <span className={`text-xs ${selectedCategory === category.id ? 'text-palm-200' : 'text-palm-400'}`}>
                    {category.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <main className="container mx-auto px-4 py-8">
        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-palm-600">
            <span className="font-semibold text-palm-800">{filteredAttractions.length}</span>개의 명소
          </p>
          <div className="flex items-center gap-2 text-sm text-palm-600">
            <span>정렬:</span>
            <button className="flex items-center gap-1 font-medium text-palm-800">
              인기순 <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Attractions Grid */}
        {filteredAttractions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAttractions.map((attraction) => (
              <AttractionCard
                key={attraction.id}
                attraction={attraction}
                isFavorite={favorites.includes(attraction.id)}
                onToggleFavorite={() => toggleFavorite(attraction.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-palm-100 flex items-center justify-center">
              <Camera className="w-10 h-10 text-palm-400" />
            </div>
            <h3 className="text-xl font-semibold text-palm-800 mb-2">
              검색 결과가 없습니다
            </h3>
            <p className="text-palm-600 mb-4">
              다른 검색어나 카테고리를 선택해 보세요
            </p>
            <Button variant="palm" onClick={clearFilters}>
              필터 초기화
            </Button>
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

// Attraction Card Component
function AttractionCard({
  attraction,
  isFavorite,
  onToggleFavorite,
}: {
  attraction: Attraction;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  const category = categories.find((c) => c.id === attraction.category);

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={attraction.image}
          alt={attraction.nameKo}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <MapLinkIcon
            name={attraction.name}
            address={attraction.location}
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite();
            }}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              isFavorite
                ? 'bg-palm-500 text-white'
                : 'bg-white/80 text-palm-600 hover:bg-white'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 rounded-full bg-white/90 text-palm-700 text-sm font-medium">
            {category?.icon} {category?.name}
          </span>
        </div>

        {/* Name & Rating on Image */}
        <div className="absolute bottom-3 left-3 right-3">
          {attraction.rating && (
            <div className="flex items-center gap-2 mb-1">
              <div className="flex items-center gap-1 bg-palm-500 text-white px-2 py-0.5 rounded text-sm">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="font-medium">{attraction.rating}</span>
              </div>
              {attraction.reviewCount && (
                <span className="text-white/80 text-sm">
                  ({attraction.reviewCount.toLocaleString()})
                </span>
              )}
            </div>
          )}
          <h3 className="font-bold text-xl text-white">
            {attraction.nameKo}
          </h3>
          <p className="text-sm text-white/80">{attraction.name}</p>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-palm-500 flex-shrink-0" />
            <span className="truncate">{attraction.hours}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Timer className="w-4 h-4 text-palm-500 flex-shrink-0" />
            <span>{attraction.duration}</span>
          </div>
          <div className="col-span-2 flex items-center gap-2 text-sm text-gray-600">
            <Ticket className="w-4 h-4 text-palm-500 flex-shrink-0" />
            <span className="truncate">{attraction.price}</span>
          </div>
        </div>

        {/* Highlights */}
        {attraction.highlights && attraction.highlights.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1.5">
              {attraction.highlights.map((highlight, index) => (
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
        {attraction.tips && (
          <div className="flex items-start gap-2 p-2 bg-ocean-50 rounded-lg mb-3">
            <Lightbulb className="w-4 h-4 text-ocean-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-ocean-700 line-clamp-2">{attraction.tips}</p>
          </div>
        )}

        {/* Google Links */}
        <GoogleLinksButton
          name={attraction.name}
          nameKo={attraction.nameKo}
          address={attraction.location}
          variant="compact"
        />
      </CardContent>
    </Card>
  );
}
