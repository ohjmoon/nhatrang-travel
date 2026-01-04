'use client';

import { useState, useMemo } from 'react';
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
  Zap,
  Users,
  CheckCircle,
  Lightbulb,
  Calendar,
  Gauge,
  ExternalLink,
  Navigation,
  MapPin,
} from 'lucide-react';
import { MapLinkIcon, GoogleLinksButton } from '@/components/google-links';
import {
  activities,
  categories,
  difficultyLevels,
  filterActivities,
  type Activity,
} from '@/data/activities';

export default function ActivitiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);

  const filteredActivities = useMemo(() => {
    return filterActivities(activities, {
      category: selectedCategory,
      difficulty: selectedDifficulty,
      search: searchQuery,
    });
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedDifficulty('all');
  };

  const hasActiveFilters =
    searchQuery || selectedCategory !== 'all' || selectedDifficulty !== 'all';

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-700';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-700';
      case 'hard':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '쉬움';
      case 'moderate':
        return '보통';
      case 'hard':
        return '어려움';
      default:
        return difficulty;
    }
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
            <Link href="/accommodation" className="text-ocean-700 hover:text-ocean-500 transition-colors">숙소</Link>
            <Link href="/restaurants" className="text-ocean-700 hover:text-ocean-500 transition-colors">맛집</Link>
            <Link href="/attractions" className="text-ocean-700 hover:text-ocean-500 transition-colors">볼거리</Link>
            <Link href="/activities" className="text-ocean-500 font-medium">액티비티</Link>
          </div>
          <Button variant="ocean" size="sm">
            일정 만들기
          </Button>
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
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">액티비티</h1>
          <p className="text-ocean-100">짜릿한 모험부터 힐링까지, 나트랑에서 즐기세요</p>
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
                placeholder="액티비티, 키워드로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-ocean-200 focus:border-ocean-500 focus:ring-2 focus:ring-ocean-500/20 outline-none transition-all"
              />
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="text-ocean-600"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategory === category.id
                    ? 'bg-ocean-500 text-white'
                    : 'bg-ocean-50 text-ocean-700 hover:bg-ocean-100'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
                {category.id !== 'all' && (
                  <span className={`text-xs ${selectedCategory === category.id ? 'text-ocean-200' : 'text-ocean-400'}`}>
                    {category.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Difficulty Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <span className="text-sm text-ocean-600 flex items-center gap-1 mr-2">
              <Gauge className="w-4 h-4" />
              난이도:
            </span>
            {difficultyLevels.map((level) => (
              <button
                key={level.id}
                onClick={() => setSelectedDifficulty(level.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedDifficulty === level.id
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
        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-ocean-600">
            <span className="font-semibold text-ocean-800">{filteredActivities.length}</span>개의 액티비티
          </p>
          <div className="flex items-center gap-2 text-sm text-ocean-600">
            <span>정렬:</span>
            <button className="flex items-center gap-1 font-medium text-ocean-800">
              인기순 <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Activities Grid */}
        {filteredActivities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                isFavorite={favorites.includes(activity.id)}
                onToggleFavorite={() => toggleFavorite(activity.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-ocean-100 flex items-center justify-center">
              <Zap className="w-10 h-10 text-ocean-400" />
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

// Activity Card Component
function ActivityCard({
  activity,
  isFavorite,
  onToggleFavorite,
}: {
  activity: Activity;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  const category = categories.find((c) => c.id === activity.category);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500';
      case 'moderate':
        return 'bg-yellow-500';
      case 'hard':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '쉬움';
      case 'moderate':
        return '보통';
      case 'hard':
        return '어려움';
      default:
        return difficulty;
    }
  };

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={activity.image}
          alt={activity.nameKo}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <MapLinkIcon
            name={activity.name}
            address="Nha Trang, Vietnam"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite();
            }}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              isFavorite
                ? 'bg-ocean-500 text-white'
                : 'bg-white/80 text-ocean-600 hover:bg-white'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 rounded-full bg-white/90 text-ocean-700 text-sm font-medium">
            {category?.icon} {category?.name}
          </span>
        </div>

        {/* Difficulty Badge */}
        <div className="absolute bottom-3 right-3">
          <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getDifficultyColor(activity.difficulty)}`}>
            {getDifficultyText(activity.difficulty)}
          </span>
        </div>

        {/* Name & Rating on Image */}
        <div className="absolute bottom-3 left-3 right-16">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex items-center gap-1 bg-ocean-500 text-white px-2 py-0.5 rounded text-sm">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-medium">{activity.rating}</span>
            </div>
            <span className="text-white/80 text-sm">
              ({activity.reviewCount.toLocaleString()})
            </span>
          </div>
          <h3 className="font-bold text-xl text-white">
            {activity.nameKo}
          </h3>
          <p className="text-sm text-white/80">{activity.name}</p>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-ocean-500 flex-shrink-0" />
            <span className="truncate">{activity.duration}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4 text-ocean-500 flex-shrink-0" />
            <span className="truncate">{activity.groupSize}</span>
          </div>
          <div className="col-span-2 flex items-center gap-2 text-sm font-semibold text-ocean-600">
            <span className="text-lg">{activity.price}</span>
          </div>
        </div>

        {/* Included Items */}
        <div className="mb-3">
          <p className="text-xs text-ocean-500 font-medium mb-1.5">포함 사항</p>
          <div className="flex flex-wrap gap-1.5">
            {activity.included.slice(0, 4).map((item, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-ocean-50 text-ocean-700 text-xs rounded-md flex items-center gap-1"
              >
                <CheckCircle className="w-3 h-3" />
                {item}
              </span>
            ))}
            {activity.included.length > 4 && (
              <span className="px-2 py-1 text-ocean-400 text-xs">
                +{activity.included.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Highlights */}
        <div className="mb-3">
          <div className="flex flex-wrap gap-1.5">
            {activity.highlights.slice(0, 3).map((highlight, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-palm-50 text-palm-700 text-xs rounded-md"
              >
                {highlight}
              </span>
            ))}
          </div>
        </div>

        {/* Best Time & Tips */}
        <div className="space-y-2">
          {activity.bestTime && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Calendar className="w-3.5 h-3.5 text-sunset-500" />
              <span>추천 시기: {activity.bestTime}</span>
            </div>
          )}
          {activity.tips && (
            <div className="flex items-start gap-2 p-2 bg-sunset-50 rounded-lg">
              <Lightbulb className="w-4 h-4 text-sunset-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-sunset-700 line-clamp-2">{activity.tips}</p>
            </div>
          )}
        </div>

        {/* Google Links */}
        <GoogleLinksButton
          name={activity.name}
          nameKo={activity.nameKo}
          address="Nha Trang, Vietnam"
          variant="compact"
          className="mt-3"
        />
      </CardContent>
    </Card>
  );
}
