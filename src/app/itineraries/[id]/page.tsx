'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Palmtree,
  CalendarDays,
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  Loader2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  Car,
  Footprints,
  Bus,
  ArrowDown,
  Navigation,
  Map,
} from 'lucide-react';
import { GoogleMapsProvider, ItineraryMap } from '@/components/google-maps';
import { useFetchItinerary } from '@/lib/itinerary';
import {
  type TravelMode,
  getTravelTimeBetweenItems,
  travelModeInfo,
  type TravelTimeResult,
} from '@/lib/maps';
import { categoryInfo, type ItemCategory } from '@/data/itinerary';

interface ItineraryDayData {
  id: string;
  date: string;
  dayNumber: number;
  items: ItineraryItemData[];
}

interface ItineraryItemData {
  id: string;
  itemId: string;
  category: ItemCategory;
  name: string;
  nameKo: string;
  image: string;
  time: string;
  duration?: string;
  notes?: string;
}

export default function ItineraryViewPage() {
  const params = useParams();
  const { fetchItinerary, loading, error } = useFetchItinerary();
  const [itinerary, setItinerary] = useState<{
    id: string;
    title: string;
    description: string | null;
    start_date: string;
    end_date: string;
    days: ItineraryDayData[];
    total_places: number;
    created_at: string;
  } | null>(null);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [showMap, setShowMap] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchItinerary(params.id as string).then((data) => {
        if (data) {
          setItinerary({
            ...data,
            days: data.days as ItineraryDayData[],
          });
        }
      });
    }
  }, [params.id, fetchItinerary]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-ocean-50 via-white to-palm-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-ocean-500 animate-spin mx-auto mb-4" />
          <p className="text-ocean-600">일정을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-ocean-50 via-white to-palm-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            일정을 찾을 수 없습니다
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/itineraries">
            <Button variant="ocean">목록으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <GoogleMapsProvider>
      <div className="min-h-screen bg-gradient-to-b from-ocean-50 via-white to-palm-50">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-ocean-100">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ocean-500 to-palm-500 flex items-center justify-center">
                <Palmtree className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl text-ocean-800 hidden sm:block">나트랑 트래블</span>
            </Link>
            <Link href="/itinerary">
              <Button variant="ocean" size="sm" className="gap-2">
                <CalendarDays className="w-4 h-4" />
                일정 만들기
              </Button>
            </Link>
          </div>
        </nav>

        {/* Header */}
        <header className="pt-24 pb-8 px-4 bg-gradient-to-r from-ocean-500 via-palm-500 to-sunset-500">
          <div className="container mx-auto">
            <Link
              href="/itineraries"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>일정 목록</span>
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {itinerary.title}
            </h1>
            <p className="text-white/80">
              {formatDate(itinerary.start_date)} - {formatDate(itinerary.end_date)}
            </p>
            {itinerary.description && (
              <p className="text-white/90 mt-2">{itinerary.description}</p>
            )}
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Button
              variant={showMap ? 'ocean' : 'outline'}
              size="sm"
              className="gap-2"
              onClick={() => setShowMap(!showMap)}
            >
              <Map className="w-4 h-4" />
              지도 {showMap ? '숨기기' : '보기'}
            </Button>
          </div>

          {/* Map View */}
          {showMap && itinerary.days[activeDayIndex] && (
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-ocean-800 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Day {itinerary.days[activeDayIndex].dayNumber} 지도
                  </h3>
                  <span className="text-sm text-ocean-600">
                    {itinerary.days[activeDayIndex].items.length}개 장소
                  </span>
                </div>
                <ItineraryMap
                  items={itinerary.days[activeDayIndex].items}
                  className="h-[350px]"
                />
              </CardContent>
            </Card>
          )}

          {/* Day Navigation */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveDayIndex(Math.max(0, activeDayIndex - 1))}
              disabled={activeDayIndex === 0}
              className="p-2 rounded-lg bg-ocean-100 text-ocean-600 hover:bg-ocean-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {itinerary.days.map((day, index) => (
              <button
                key={day.id}
                onClick={() => setActiveDayIndex(index)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeDayIndex === index
                    ? 'bg-ocean-500 text-white'
                    : 'bg-ocean-50 text-ocean-700 hover:bg-ocean-100'
                }`}
              >
                Day {day.dayNumber}
                <span className="ml-1 text-xs opacity-75">
                  ({day.items.length})
                </span>
              </button>
            ))}

            <button
              onClick={() =>
                setActiveDayIndex(Math.min(itinerary.days.length - 1, activeDayIndex + 1))
              }
              disabled={activeDayIndex === itinerary.days.length - 1}
              className="p-2 rounded-lg bg-ocean-100 text-ocean-600 hover:bg-ocean-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Day Content */}
          {itinerary.days[activeDayIndex] && (
            <DayViewReadOnly day={itinerary.days[activeDayIndex]} />
          )}
        </main>

        {/* Footer */}
        <footer className="bg-ocean-900 text-white py-8 mt-12">
          <div className="container mx-auto px-4 text-center text-ocean-400 text-sm">
            &copy; 2024 Nha Trang Travel. All rights reserved.
          </div>
        </footer>
      </div>
    </GoogleMapsProvider>
  );
}

// Read-only Day View Component
function DayViewReadOnly({ day }: { day: ItineraryDayData }) {
  const [selectedTravelMode, setSelectedTravelMode] = useState<TravelMode>('DRIVING');

  const getTimeIcon = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 5 && hour < 9) return <Sunrise className="w-4 h-4 text-sunset-500" />;
    if (hour >= 9 && hour < 17) return <Sun className="w-4 h-4 text-yellow-500" />;
    if (hour >= 17 && hour < 20) return <Sunset className="w-4 h-4 text-orange-500" />;
    return <Moon className="w-4 h-4 text-indigo-500" />;
  };

  // Calculate travel times
  const travelTimes: (TravelTimeResult | null)[] = [];
  for (let i = 0; i < day.items.length - 1; i++) {
    const fromItem = day.items[i];
    const toItem = day.items[i + 1];
    const travelTime = getTravelTimeBetweenItems(fromItem.itemId, toItem.itemId);
    travelTimes.push(travelTime);
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        {/* Day Header */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-ocean-800">Day {day.dayNumber}</h3>
          <p className="text-ocean-600 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {formatDate(day.date)}
          </p>
        </div>

        {/* Travel Mode Selector */}
        {day.items.length > 1 && (
          <div className="mb-6 p-3 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
              <Navigation className="w-4 h-4" />
              이동 수단 선택
            </p>
            <div className="flex gap-2">
              {(['WALKING', 'DRIVING', 'TRANSIT'] as TravelMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSelectedTravelMode(mode)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedTravelMode === mode
                      ? mode === 'WALKING'
                        ? 'bg-green-500 text-white'
                        : mode === 'DRIVING'
                        ? 'bg-blue-500 text-white'
                        : 'bg-purple-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {mode === 'WALKING' && <Footprints className="w-4 h-4" />}
                  {mode === 'DRIVING' && <Car className="w-4 h-4" />}
                  {mode === 'TRANSIT' && <Bus className="w-4 h-4" />}
                  {travelModeInfo[mode].name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Items List */}
        {day.items.length > 0 ? (
          <div className="space-y-2">
            {day.items.map((item, index) => (
              <div key={item.id}>
                {/* Item Card */}
                <div className="flex gap-4">
                  {/* Time */}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-ocean-100 flex items-center justify-center">
                      {getTimeIcon(item.time)}
                    </div>
                    <span className="text-sm font-medium text-ocean-600 mt-1">
                      {item.time}
                    </span>
                  </div>

                  {/* Item Card */}
                  <div className="flex-1 bg-white rounded-xl border border-ocean-100 overflow-hidden">
                    <div className="flex">
                      <img
                        src={item.image}
                        alt={item.nameKo}
                        className="w-24 h-24 object-cover"
                      />
                      <div className="flex-1 p-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xs font-medium mb-1 ${
                            categoryInfo[item.category].color === 'ocean'
                              ? 'bg-ocean-100 text-ocean-700'
                              : categoryInfo[item.category].color === 'sunset'
                              ? 'bg-sunset-100 text-sunset-700'
                              : 'bg-palm-100 text-palm-700'
                          }`}
                        >
                          {categoryInfo[item.category].icon} {categoryInfo[item.category].name}
                        </span>
                        <h4 className="font-semibold text-gray-800">{item.nameKo}</h4>
                        <p className="text-xs text-gray-500">{item.name}</p>
                        {item.duration && (
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.duration}
                          </p>
                        )}
                        {item.notes && (
                          <p className="text-xs text-ocean-600 mt-1 italic">{item.notes}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Travel Time Indicator */}
                {index < day.items.length - 1 && travelTimes[index] && (
                  <TravelTimeIndicator
                    travelTime={travelTimes[index]!}
                    selectedMode={selectedTravelMode}
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-ocean-50 rounded-xl">
            <CalendarDays className="w-16 h-16 text-ocean-300 mx-auto mb-4" />
            <p className="text-ocean-600">이 날에는 일정이 없습니다</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Travel Time Indicator Component
function TravelTimeIndicator({
  travelTime,
  selectedMode,
}: {
  travelTime: TravelTimeResult;
  selectedMode: TravelMode;
}) {
  const currentTime =
    selectedMode === 'WALKING'
      ? travelTime.walking
      : selectedMode === 'DRIVING'
      ? travelTime.driving
      : travelTime.transit;

  if (!currentTime) return null;

  const getModeColor = (mode: TravelMode) => {
    switch (mode) {
      case 'WALKING':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'DRIVING':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'TRANSIT':
        return 'bg-purple-100 text-purple-700 border-purple-200';
    }
  };

  const getModeIcon = (mode: TravelMode) => {
    switch (mode) {
      case 'WALKING':
        return <Footprints className="w-4 h-4" />;
      case 'DRIVING':
        return <Car className="w-4 h-4" />;
      case 'TRANSIT':
        return <Bus className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex items-center gap-4 my-3 ml-6">
      <div className="flex flex-col items-center w-12">
        <div className="w-0.5 h-4 bg-gray-300" />
        <ArrowDown className="w-4 h-4 text-gray-400" />
        <div className="w-0.5 h-4 bg-gray-300" />
      </div>

      <div
        className={`flex-1 flex items-center gap-3 px-4 py-2 rounded-lg border ${getModeColor(
          selectedMode
        )}`}
      >
        {getModeIcon(selectedMode)}
        <div className="flex items-center gap-4">
          <span className="font-medium">{currentTime.duration}</span>
          <span className="text-sm opacity-75">({currentTime.distance})</span>
        </div>
      </div>
    </div>
  );
}
