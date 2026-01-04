import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ placeId: string }> }
) {
  try {
    const { placeId } = await params;

    if (!placeId) {
      return NextResponse.json(
        { error: 'Place ID is required' },
        { status: 400 }
      );
    }

    if (!GOOGLE_PLACES_API_KEY) {
      return NextResponse.json(
        { error: 'Google Places API key not configured' },
        { status: 500 }
      );
    }

    // Place Details API
    const detailsUrl = new URL('https://maps.googleapis.com/maps/api/place/details/json');
    detailsUrl.searchParams.set('place_id', placeId);
    detailsUrl.searchParams.set('fields', [
      'place_id',
      'name',
      'formatted_address',
      'formatted_phone_number',
      'international_phone_number',
      'website',
      'url',
      'geometry',
      'rating',
      'user_ratings_total',
      'photos',
      'opening_hours',
      'reviews',
      'types',
      'price_level',
      'business_status',
    ].join(','));
    detailsUrl.searchParams.set('language', 'ko');
    detailsUrl.searchParams.set('key', GOOGLE_PLACES_API_KEY);

    const response = await fetch(detailsUrl.toString());
    const data = await response.json();

    if (data.status !== 'OK') {
      console.error('Google Places API error:', data.status, data.error_message);
      return NextResponse.json(
        { error: data.error_message || 'Failed to get place details' },
        { status: 500 }
      );
    }

    const place = data.result;

    // 결과 정제
    const result = {
      place_id: place.place_id,
      name: place.name,
      formatted_address: place.formatted_address,
      formatted_phone_number: place.formatted_phone_number,
      international_phone_number: place.international_phone_number,
      website: place.website,
      url: place.url, // Google Maps URL
      geometry: place.geometry,
      rating: place.rating,
      user_ratings_total: place.user_ratings_total,
      photos: place.photos?.slice(0, 10).map((photo: any) => ({
        photo_reference: photo.photo_reference,
        height: photo.height,
        width: photo.width,
        html_attributions: photo.html_attributions,
      })),
      opening_hours: place.opening_hours ? {
        open_now: place.opening_hours.open_now,
        weekday_text: place.opening_hours.weekday_text,
        periods: place.opening_hours.periods,
      } : null,
      reviews: place.reviews?.slice(0, 5).map((review: any) => ({
        author_name: review.author_name,
        rating: review.rating,
        text: review.text,
        time: review.time,
        relative_time_description: review.relative_time_description,
      })),
      types: place.types,
      price_level: place.price_level,
      business_status: place.business_status,
    };

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Details error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
