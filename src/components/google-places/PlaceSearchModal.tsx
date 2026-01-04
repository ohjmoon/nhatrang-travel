'use client';

import { useState, useCallback, useEffect } from 'react';
import { Search, X, MapPin, Star, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { usePlaceSearch, usePlaceDetails } from '@/lib/google-places/hooks';
import { getPhotoUrl, type PlaceSearchResult, type PlaceDetails } from '@/lib/google-places/types';

interface PlaceSearchModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (place: PlaceDetails) => void;
  placeType?: string;
  title?: string;
}

export default function PlaceSearchModal({
  open,
  onClose,
  onSelect,
  placeType,
  title = 'Google Places 검색',
}: PlaceSearchModalProps) {
  const [query, setQuery] = useState('');
  const { results, loading: searchLoading, error: searchError, search, clear } = usePlaceSearch();
  const { loading: detailsLoading, fetchDetails } = usePlaceDetails();

  // 모달 닫힐 때 초기화
  useEffect(() => {
    if (!open) {
      setQuery('');
      clear();
    }
  }, [open, clear]);

  // 검색 실행
  const handleSearch = useCallback(() => {
    if (query.trim()) {
      search({ query, type: placeType });
    }
  }, [query, placeType, search]);

  // Enter 키로 검색
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 장소 선택
  const handleSelect = async (place: PlaceSearchResult) => {
    const details = await fetchDetails(place.place_id);
    if (details) {
      onSelect(details);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            {title}
          </DialogTitle>
        </DialogHeader>

        {/* 검색 입력 */}
        <div className="flex gap-2">
          <Input
            placeholder="장소명을 입력하세요 (예: Lac Canh Restaurant)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
            autoFocus
          />
          <Button onClick={handleSearch} disabled={searchLoading || !query.trim()}>
            {searchLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            <span className="ml-2">검색</span>
          </Button>
        </div>

        {/* 에러 메시지 */}
        {searchError && (
          <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">
            {searchError}
          </div>
        )}

        {/* 검색 결과 */}
        <div className="flex-1 overflow-y-auto space-y-2 min-h-[300px]">
          {searchLoading && (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          )}

          {!searchLoading && results.length === 0 && query && (
            <div className="flex items-center justify-center h-32 text-gray-500">
              검색 결과가 없습니다.
            </div>
          )}

          {!searchLoading && results.length === 0 && !query && (
            <div className="flex items-center justify-center h-32 text-gray-400">
              장소명을 입력하고 검색하세요.
            </div>
          )}

          {results.map((place) => (
            <PlaceResultCard
              key={place.place_id}
              place={place}
              onSelect={() => handleSelect(place)}
              loading={detailsLoading}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// 검색 결과 카드
interface PlaceResultCardProps {
  place: PlaceSearchResult;
  onSelect: () => void;
  loading: boolean;
}

function PlaceResultCard({ place, onSelect, loading }: PlaceResultCardProps) {
  const photoUrl = place.photos?.[0]?.photo_reference
    ? getPhotoUrl(place.photos[0].photo_reference, 100)
    : null;

  return (
    <div
      className="flex gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={onSelect}
    >
      {/* 썸네일 */}
      <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={place.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <MapPin className="h-8 w-8" />
          </div>
        )}
      </div>

      {/* 정보 */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 truncate">{place.name}</h4>

        {/* 평점 */}
        {place.rating && (
          <div className="flex items-center gap-1 mt-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-gray-600">
              {place.rating}
              {place.user_ratings_total && (
                <span className="text-gray-400 ml-1">
                  ({place.user_ratings_total.toLocaleString()})
                </span>
              )}
            </span>
          </div>
        )}

        {/* 주소 */}
        <p className="text-sm text-gray-500 mt-1 truncate">
          <MapPin className="h-3 w-3 inline mr-1" />
          {place.formatted_address}
        </p>

        {/* 영업 상태 */}
        {place.opening_hours && (
          <p className="text-xs mt-1">
            <Clock className="h-3 w-3 inline mr-1" />
            <span className={place.opening_hours.open_now ? 'text-green-600' : 'text-red-600'}>
              {place.opening_hours.open_now ? '영업 중' : '영업 종료'}
            </span>
          </p>
        )}
      </div>

      {/* 선택 버튼 */}
      <div className="flex-shrink-0 self-center">
        <Button size="sm" variant="outline" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : '선택'}
        </Button>
      </div>
    </div>
  );
}
