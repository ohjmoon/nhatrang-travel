'use client';

import { MapPin, Search, Navigation, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GoogleLinksButtonProps {
  name: string;
  nameKo?: string;
  address?: string;
  googlePlaceId?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  variant?: 'default' | 'compact' | 'icon-only';
  className?: string;
}

export function GoogleLinksButton({
  name,
  nameKo,
  address,
  googlePlaceId,
  latitude,
  longitude,
  variant = 'default',
  className = '',
}: GoogleLinksButtonProps) {
  // Google Maps URL 생성
  const getGoogleMapsUrl = () => {
    if (googlePlaceId) {
      return `https://www.google.com/maps/place/?q=place_id:${googlePlaceId}`;
    }
    if (latitude && longitude) {
      return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    }
    // Fallback: 이름과 주소로 검색
    const searchQuery = encodeURIComponent(`${name} ${address || 'Nha Trang Vietnam'}`);
    return `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;
  };

  // Google 검색 URL 생성
  const getGoogleSearchUrl = () => {
    const searchQuery = encodeURIComponent(`${nameKo || name} ${name} Nha Trang`);
    return `https://www.google.com/search?q=${searchQuery}`;
  };

  // 길찾기 URL
  const getDirectionsUrl = () => {
    if (latitude && longitude) {
      return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    }
    const destination = encodeURIComponent(`${name} ${address || 'Nha Trang Vietnam'}`);
    return `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
  };

  if (variant === 'icon-only') {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <a
          href={getGoogleMapsUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-ocean-600 hover:text-ocean-700 transition-colors shadow-sm"
          title="Google 지도에서 보기"
        >
          <MapPin className="w-4 h-4" />
        </a>
        <a
          href={getGoogleSearchUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-ocean-600 hover:text-ocean-700 transition-colors shadow-sm"
          title="Google에서 검색"
        >
          <Search className="w-4 h-4" />
        </a>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <a
          href={getGoogleMapsUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-ocean-50 text-ocean-600 hover:bg-ocean-100 transition-colors"
        >
          <MapPin className="w-3 h-3" />
          지도
        </a>
        <a
          href={getGoogleSearchUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <Search className="w-3 h-3" />
          검색
        </a>
      </div>
    );
  }

  // Default variant - full buttons
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <a
        href={getGoogleMapsUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-ocean-500 text-white hover:bg-ocean-600 transition-colors"
      >
        <MapPin className="w-4 h-4" />
        지도 보기
      </a>
      <a
        href={getDirectionsUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-palm-500 text-white hover:bg-palm-600 transition-colors"
      >
        <Navigation className="w-4 h-4" />
        길찾기
      </a>
      <a
        href={getGoogleSearchUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <ExternalLink className="w-4 h-4" />
        상세 검색
      </a>
    </div>
  );
}

// 간단한 지도 링크 아이콘 버튼 (카드 이미지 위에 사용)
export function MapLinkIcon({
  name,
  address,
  googlePlaceId,
  latitude,
  longitude,
  className = '',
}: Omit<GoogleLinksButtonProps, 'variant' | 'nameKo'>) {
  const getGoogleMapsUrl = () => {
    if (googlePlaceId) {
      return `https://www.google.com/maps/place/?q=place_id:${googlePlaceId}`;
    }
    if (latitude && longitude) {
      return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    }
    const searchQuery = encodeURIComponent(`${name} ${address || 'Nha Trang Vietnam'}`);
    return `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;
  };

  return (
    <a
      href={getGoogleMapsUrl()}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className={`w-9 h-9 rounded-full bg-ocean-500 hover:bg-ocean-600 flex items-center justify-center text-white transition-colors shadow-md ${className}`}
      title="Google 지도에서 보기"
    >
      <MapPin className="w-5 h-5" />
    </a>
  );
}

export default GoogleLinksButton;
