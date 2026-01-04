import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

// 나트랑 중심 좌표
const NHA_TRANG_CENTER = {
  lat: 12.2388,
  lng: 109.1967,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, type, location } = body;

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    if (!GOOGLE_PLACES_API_KEY) {
      return NextResponse.json(
        { error: 'Google Places API key not configured' },
        { status: 500 }
      );
    }

    // 검색 위치 (기본: 나트랑)
    const searchLocation = location || NHA_TRANG_CENTER;

    // Text Search API 사용
    const searchUrl = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
    searchUrl.searchParams.set('query', `${query} Nha Trang Vietnam`);
    searchUrl.searchParams.set('location', `${searchLocation.lat},${searchLocation.lng}`);
    searchUrl.searchParams.set('radius', '20000'); // 20km 반경
    searchUrl.searchParams.set('language', 'ko');
    searchUrl.searchParams.set('key', GOOGLE_PLACES_API_KEY);

    if (type) {
      searchUrl.searchParams.set('type', type);
    }

    const response = await fetch(searchUrl.toString());
    const data = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Google Places API error:', data.status, data.error_message);
      return NextResponse.json(
        { error: data.error_message || 'Failed to search places' },
        { status: 500 }
      );
    }

    // 결과 정제
    const results = (data.results || []).map((place: any) => ({
      place_id: place.place_id,
      name: place.name,
      formatted_address: place.formatted_address,
      geometry: place.geometry,
      rating: place.rating,
      user_ratings_total: place.user_ratings_total,
      photos: place.photos?.slice(0, 3).map((photo: any) => ({
        photo_reference: photo.photo_reference,
        height: photo.height,
        width: photo.width,
      })),
      types: place.types,
      opening_hours: place.opening_hours,
      price_level: place.price_level,
    }));

    return NextResponse.json({
      results,
      status: data.status,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
