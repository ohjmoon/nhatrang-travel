'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Palmtree,
  Plus,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  Star,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  CalendarDays,
  List,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  Car,
  Footprints,
  Bus,
  Navigation,
  ArrowDown,
  Map,
} from 'lucide-react';
import { GoogleMapsProvider, ItineraryMap } from '@/components/google-maps';
import { SaveItineraryModal } from '@/components/itinerary';
import { useSaveItinerary } from '@/lib/itinerary';
import {
  type Itinerary,
  type ItineraryDay,
  type ItineraryItem,
  type AvailableItem,
  type ItemCategory,
  categoryInfo,
  getAllAvailableItems,
  createItinerary,
  addItemToDay,
  removeItemFromDay,
  formatDate,
  timeSlots,
} from '@/data/itinerary';
import {
  type TravelMode,
  type TravelTimeResult,
  getTravelTimeBetweenItems,
  travelModeInfo,
} from '@/lib/maps';

export default function ItineraryPage() {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  // Create form state
  const [title, setTitle] = useState('나트랑 여행');
  const [startDate, setStartDate] = useState('');
  const [numDays, setNumDays] = useState(3);

  // Set default start date to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setStartDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('nhatrang-itinerary');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setItinerary(parsed);
        setShowCreateForm(false);
      } catch (e) {
        console.error('Failed to load itinerary');
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (itinerary) {
      localStorage.setItem('nhatrang-itinerary', JSON.stringify(itinerary));
    }
  }, [itinerary]);

  const handleCreateItinerary = () => {
    if (!title || !startDate || numDays < 1) return;
    const newItinerary = createItinerary(title, startDate, numDays);
    setItinerary(newItinerary);
    setShowCreateForm(false);
  };

  const handleAddItem = (item: AvailableItem, time: string, notes?: string) => {
    if (!itinerary || !selectedDayId) return;
    const updated = addItemToDay(itinerary, selectedDayId, item, time, notes);
    setItinerary(updated);
    setShowAddModal(false);
    setSelectedDayId(null);
  };

  const handleRemoveItem = (dayId: string, itemId: string) => {
    if (!itinerary) return;
    const updated = removeItemFromDay(itinerary, dayId, itemId);
    setItinerary(updated);
  };

  const handleReset = () => {
    localStorage.removeItem('nhatrang-itinerary');
    setItinerary(null);
    setShowCreateForm(true);
    setActiveDayIndex(0);
  };

  const openAddModal = (dayId: string) => {
    setSelectedDayId(dayId);
    setShowAddModal(true);
  };

  // State for map visibility
  const [showMap, setShowMap] = useState(true);

  // State for save modal
  const [showSaveModal, setShowSaveModal] = useState(false);
  const { saveItinerary, loading: saveLoading } = useSaveItinerary();

  const handleSaveItinerary = async (
    password: string,
    description: string
  ): Promise<boolean> => {
    if (!itinerary) return false;

    try {
      const result = await saveItinerary(itinerary, password, description);
      return !!result;
    } catch {
      return false;
    }
  };

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
          <div className="hidden md:flex items-center gap-6">
            <Link href="/accommodation" className="text-ocean-700 hover:text-ocean-500 transition-colors">숙소</Link>
            <Link href="/restaurants" className="text-ocean-700 hover:text-ocean-500 transition-colors">맛집</Link>
            <Link href="/attractions" className="text-ocean-700 hover:text-ocean-500 transition-colors">볼거리</Link>
            <Link href="/activities" className="text-ocean-700 hover:text-ocean-500 transition-colors">액티비티</Link>
            <Link href="/shopping" className="text-ocean-700 hover:text-ocean-500 transition-colors">쇼핑</Link>
          </div>
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
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {itinerary ? itinerary.title : '일정 만들기'}
          </h1>
          <p className="text-white/80">
            {itinerary
              ? `${formatDate(itinerary.startDate)} - ${formatDate(itinerary.endDate)}`
              : '나만의 나트랑 여행 일정을 만들어보세요'}
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {showCreateForm ? (
          /* Create Itinerary Form */
          <Card className="max-w-lg mx-auto">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-ocean-800 mb-6 text-center">
                새 여행 일정 만들기
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    여행 제목
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-ocean-200 focus:border-ocean-500 focus:ring-2 focus:ring-ocean-500/20 outline-none transition-all"
                    placeholder="예: 나트랑 가족 여행"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    여행 시작일
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-ocean-200 focus:border-ocean-500 focus:ring-2 focus:ring-ocean-500/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    여행 기간 (일)
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setNumDays(Math.max(1, numDays - 1))}
                      className="w-12 h-12 rounded-xl bg-ocean-100 text-ocean-600 hover:bg-ocean-200 transition-colors text-xl font-bold"
                    >
                      -
                    </button>
                    <span className="text-2xl font-bold text-ocean-800 w-16 text-center">
                      {numDays}일
                    </span>
                    <button
                      onClick={() => setNumDays(Math.min(14, numDays + 1))}
                      className="w-12 h-12 rounded-xl bg-ocean-100 text-ocean-600 hover:bg-ocean-200 transition-colors text-xl font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <Button
                  variant="ocean"
                  className="w-full mt-6"
                  onClick={handleCreateItinerary}
                >
                  <CalendarDays className="w-5 h-5 mr-2" />
                  일정 만들기
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : itinerary ? (
          /* Itinerary View */
          <div>
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
                <Plus className="w-4 h-4" />
                새 일정
              </Button>
              <Link href="/itineraries">
                <Button variant="outline" size="sm" className="gap-2">
                  <List className="w-4 h-4" />
                  저장된 일정
                </Button>
              </Link>
              <Button
                variant={showMap ? "ocean" : "outline"}
                size="sm"
                className="gap-2"
                onClick={() => setShowMap(!showMap)}
              >
                <Map className="w-4 h-4" />
                지도 {showMap ? '숨기기' : '보기'}
              </Button>
              <Button
                variant="ocean"
                size="sm"
                className="gap-2"
                onClick={() => setShowSaveModal(true)}
              >
                <Download className="w-4 h-4" />
                저장하기
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
                onClick={() => setActiveDayIndex(Math.min(itinerary.days.length - 1, activeDayIndex + 1))}
                disabled={activeDayIndex === itinerary.days.length - 1}
                className="p-2 rounded-lg bg-ocean-100 text-ocean-600 hover:bg-ocean-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Active Day Content */}
            {itinerary.days[activeDayIndex] && (
              <DayView
                day={itinerary.days[activeDayIndex]}
                onAddItem={() => openAddModal(itinerary.days[activeDayIndex].id)}
                onRemoveItem={(itemId) =>
                  handleRemoveItem(itinerary.days[activeDayIndex].id, itemId)
                }
              />
            )}
          </div>
        ) : null}
      </main>

      {/* Add Item Modal */}
      {showAddModal && (
        <AddItemModal
          onClose={() => {
            setShowAddModal(false);
            setSelectedDayId(null);
          }}
          onAdd={handleAddItem}
        />
      )}

      {/* Save Itinerary Modal */}
      {showSaveModal && itinerary && (
        <SaveItineraryModal
          onClose={() => setShowSaveModal(false)}
          onSave={handleSaveItinerary}
          title={itinerary.title}
        />
      )}

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

// Day View Component
function DayView({
  day,
  onAddItem,
  onRemoveItem,
}: {
  day: ItineraryDay;
  onAddItem: () => void;
  onRemoveItem: (itemId: string) => void;
}) {
  const [selectedTravelMode, setSelectedTravelMode] = useState<TravelMode>('DRIVING');

  const getTimeIcon = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 5 && hour < 9) return <Sunrise className="w-4 h-4 text-sunset-500" />;
    if (hour >= 9 && hour < 17) return <Sun className="w-4 h-4 text-yellow-500" />;
    if (hour >= 17 && hour < 20) return <Sunset className="w-4 h-4 text-orange-500" />;
    return <Moon className="w-4 h-4 text-indigo-500" />;
  };

  // Calculate travel times between consecutive items
  const travelTimes = useMemo(() => {
    const times: (TravelTimeResult | null)[] = [];
    for (let i = 0; i < day.items.length - 1; i++) {
      const fromItem = day.items[i];
      const toItem = day.items[i + 1];
      const travelTime = getTravelTimeBetweenItems(fromItem.itemId, toItem.itemId);
      times.push(travelTime);
    }
    return times;
  }, [day.items]);

  return (
    <Card>
      <CardContent className="p-6">
        {/* Day Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-ocean-800">
              Day {day.dayNumber}
            </h3>
            <p className="text-ocean-600 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDate(day.date)}
            </p>
          </div>
          <Button variant="ocean" onClick={onAddItem} className="gap-2">
            <Plus className="w-4 h-4" />
            장소 추가
          </Button>
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
                  <div className="flex-1 bg-white rounded-xl border border-ocean-100 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="flex">
                      <img
                        src={item.image}
                        alt={item.nameKo}
                        className="w-24 h-24 object-cover"
                      />
                      <div className="flex-1 p-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium mb-1 ${
                              categoryInfo[item.category].color === 'ocean'
                                ? 'bg-ocean-100 text-ocean-700'
                                : categoryInfo[item.category].color === 'sunset'
                                ? 'bg-sunset-100 text-sunset-700'
                                : 'bg-palm-100 text-palm-700'
                            }`}>
                              {categoryInfo[item.category].icon} {categoryInfo[item.category].name}
                            </span>
                            <h4 className="font-semibold text-gray-800">
                              {item.nameKo}
                            </h4>
                            <p className="text-xs text-gray-500">{item.name}</p>
                          </div>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        {item.duration && (
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.duration}
                          </p>
                        )}
                        {item.notes && (
                          <p className="text-xs text-ocean-600 mt-1 italic">
                            {item.notes}
                          </p>
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
            <p className="text-ocean-600 mb-4">
              아직 일정이 없습니다
            </p>
            <Button variant="ocean" onClick={onAddItem} className="gap-2">
              <Plus className="w-4 h-4" />
              장소 추가하기
            </Button>
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
  const currentTime = selectedMode === 'WALKING'
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
      {/* Vertical connector */}
      <div className="flex flex-col items-center w-12">
        <div className="w-0.5 h-4 bg-gray-300" />
        <ArrowDown className="w-4 h-4 text-gray-400" />
        <div className="w-0.5 h-4 bg-gray-300" />
      </div>

      {/* Travel info */}
      <div className={`flex-1 flex items-center gap-3 px-4 py-2 rounded-lg border ${getModeColor(selectedMode)}`}>
        {getModeIcon(selectedMode)}
        <div className="flex items-center gap-4">
          <span className="font-medium">{currentTime.duration}</span>
          <span className="text-sm opacity-75">({currentTime.distance})</span>
        </div>

        {/* Show all modes comparison */}
        <div className="ml-auto flex items-center gap-3 text-xs opacity-75">
          {travelTime.walking && selectedMode !== 'WALKING' && (
            <span className="flex items-center gap-1">
              <Footprints className="w-3 h-3" />
              {travelTime.walking.duration}
            </span>
          )}
          {travelTime.driving && selectedMode !== 'DRIVING' && (
            <span className="flex items-center gap-1">
              <Car className="w-3 h-3" />
              {travelTime.driving.duration}
            </span>
          )}
          {travelTime.transit && selectedMode !== 'TRANSIT' && (
            <span className="flex items-center gap-1">
              <Bus className="w-3 h-3" />
              {travelTime.transit.duration}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Add Item Modal Component
function AddItemModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (item: AvailableItem, time: string, notes?: string) => void;
}) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'all'>('all');
  const [selectedItem, setSelectedItem] = useState<AvailableItem | null>(null);
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [notes, setNotes] = useState('');

  const allItems = useMemo(() => getAllAvailableItems(), []);

  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (search) {
        const searchLower = search.toLowerCase();
        return (
          item.name.toLowerCase().includes(searchLower) ||
          item.nameKo.includes(search)
        );
      }
      return true;
    });
  }, [allItems, selectedCategory, search]);

  const handleAdd = () => {
    if (selectedItem) {
      onAdd(selectedItem, selectedTime, notes || undefined);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800">장소 추가</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {selectedItem ? (
          /* Time Selection */
          <div className="p-4 flex-1 overflow-y-auto">
            <div className="flex gap-4 mb-6">
              <img
                src={selectedItem.image}
                alt={selectedItem.nameKo}
                className="w-24 h-24 rounded-xl object-cover"
              />
              <div>
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium mb-1 ${
                  categoryInfo[selectedItem.category].color === 'ocean'
                    ? 'bg-ocean-100 text-ocean-700'
                    : categoryInfo[selectedItem.category].color === 'sunset'
                    ? 'bg-sunset-100 text-sunset-700'
                    : 'bg-palm-100 text-palm-700'
                }`}>
                  {categoryInfo[selectedItem.category].icon} {categoryInfo[selectedItem.category].name}
                </span>
                <h4 className="font-bold text-lg text-gray-800">{selectedItem.nameKo}</h4>
                <p className="text-sm text-gray-500">{selectedItem.name}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{selectedItem.rating}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  방문 시간
                </label>
                <div className="grid grid-cols-6 gap-2 max-h-40 overflow-y-auto">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedTime === time
                          ? 'bg-ocean-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  메모 (선택사항)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-ocean-500 focus:ring-2 focus:ring-ocean-500/20 outline-none transition-all resize-none"
                  rows={2}
                  placeholder="예: 예약 필요, 점심 식사 등"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setSelectedItem(null)}
              >
                다른 장소 선택
              </Button>
              <Button variant="ocean" className="flex-1" onClick={handleAdd}>
                일정에 추가
              </Button>
            </div>
          </div>
        ) : (
          /* Item Selection */
          <>
            <div className="p-4 border-b border-gray-200">
              {/* Search */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="장소 검색..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-ocean-500 focus:ring-2 focus:ring-ocean-500/20 outline-none"
                />
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 overflow-x-auto">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
                    selectedCategory === 'all'
                      ? 'bg-ocean-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  전체
                </button>
                {(Object.keys(categoryInfo) as ItemCategory[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
                      selectedCategory === cat
                        ? 'bg-ocean-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {categoryInfo[cat].icon} {categoryInfo[cat].name}
                  </button>
                ))}
              </div>
            </div>

            {/* Items Grid */}
            <div className="flex-1 overflow-y-auto p-4">
              <p className="text-sm text-gray-500 mb-3">
                {filteredItems.length}개의 장소
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredItems.map((item) => (
                  <button
                    key={`${item.category}-${item.id}`}
                    onClick={() => setSelectedItem(item)}
                    className="flex gap-3 p-3 rounded-xl border border-gray-200 hover:border-ocean-300 hover:bg-ocean-50 transition-all text-left"
                  >
                    <img
                      src={item.image}
                      alt={item.nameKo}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium mb-0.5 ${
                        categoryInfo[item.category].color === 'ocean'
                          ? 'bg-ocean-100 text-ocean-700'
                          : categoryInfo[item.category].color === 'sunset'
                          ? 'bg-sunset-100 text-sunset-700'
                          : 'bg-palm-100 text-palm-700'
                      }`}>
                        {categoryInfo[item.category].icon}
                      </span>
                      <h4 className="font-medium text-gray-800 truncate">
                        {item.nameKo}
                      </h4>
                      <p className="text-xs text-gray-500 truncate">{item.name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-xs font-medium">{item.rating}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
