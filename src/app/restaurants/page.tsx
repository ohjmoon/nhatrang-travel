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
  Phone,
  Heart,
  ArrowLeft,
  UtensilsCrossed,
  DollarSign,
  Lightbulb,
} from 'lucide-react';
import {
  restaurants,
  categories,
  priceRanges,
  filterRestaurants,
  type Restaurant,
} from '@/data/restaurants';

export default function RestaurantsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  const filteredRestaurants = useMemo(() => {
    return filterRestaurants(restaurants, {
      category: selectedCategory,
      priceRange: selectedPrice,
      search: searchQuery,
    });
  }, [searchQuery, selectedCategory, selectedPrice]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedPrice('all');
  };

  const hasActiveFilters =
    searchQuery || selectedCategory !== 'all' || selectedPrice !== 'all';

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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
          </div>

          {/* Quick Filters - Category Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategory === category.id
                    ? 'bg-sunset-500 text-white'
                    : 'bg-sunset-50 text-sunset-700 hover:bg-sunset-100'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
                {category.id !== 'all' && (
                  <span className={`text-xs ${selectedCategory === category.id ? 'text-sunset-200' : 'text-sunset-400'}`}>
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
                        onClick={() => setSelectedPrice(range.id)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                          selectedPrice === range.id
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
        {/* Results Count */}
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
}: {
  restaurant: Restaurant;
  isFavorite: boolean;
  onToggleFavorite: () => void;
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

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            onToggleFavorite();
          }}
          className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            isFavorite
              ? 'bg-sunset-500 text-white'
              : 'bg-white/80 text-sunset-600 hover:bg-white'
          }`}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

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
          <div className="flex items-start gap-2 p-2 bg-palm-50 rounded-lg">
            <Lightbulb className="w-4 h-4 text-palm-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-palm-700 line-clamp-2">{restaurant.tips}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
