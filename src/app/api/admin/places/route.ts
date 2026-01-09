import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/client';

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

// GET: List all places
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const withoutCoordinates = searchParams.get('without_coordinates') === 'true';

  const supabase = createAdminClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (supabase as any)
    .from('places')
    .select('id, type, category, name, name_ko, google_place_id, coordinates, is_published')
    .order('type')
    .order('sort_order');

  if (type) {
    query = query.eq('type', type);
  }

  if (withoutCoordinates) {
    query = query.is('coordinates', null);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    places: data,
    summary: {
      total: data.length,
      withCoordinates: data.filter((p: { coordinates: unknown }) => p.coordinates).length,
      withoutCoordinates: data.filter((p: { coordinates: unknown }) => !p.coordinates).length,
      withGooglePlaceId: data.filter((p: { google_place_id: string | null }) => p.google_place_id).length,
    }
  });
}

// POST: Sync coordinates from Google Places for places with google_place_id
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { placeId, syncAll } = body;

    if (!GOOGLE_PLACES_API_KEY) {
      return NextResponse.json(
        { error: 'Google Places API key not configured' },
        { status: 500 }
      );
    }

    const supabase = createAdminClient();

    // Get places to sync
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (supabase as any)
      .from('places')
      .select('id, name, google_place_id, coordinates');

    if (placeId) {
      query = query.eq('id', placeId);
    } else if (syncAll) {
      // Sync all places that have google_place_id but no coordinates
      query = query.not('google_place_id', 'is', null).is('coordinates', null);
    } else {
      return NextResponse.json(
        { error: 'Either placeId or syncAll=true is required' },
        { status: 400 }
      );
    }

    const { data: places, error: fetchError } = await query;

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!places || places.length === 0) {
      return NextResponse.json({
        message: 'No places to sync',
        synced: 0
      });
    }

    const results: { id: string; name: string; success: boolean; error?: string }[] = [];

    for (const place of places) {
      if (!place.google_place_id) {
        results.push({
          id: place.id,
          name: place.name,
          success: false,
          error: 'No google_place_id'
        });
        continue;
      }

      try {
        // Fetch place details from Google
        const detailsUrl = new URL('https://maps.googleapis.com/maps/api/place/details/json');
        detailsUrl.searchParams.set('place_id', place.google_place_id);
        detailsUrl.searchParams.set('fields', 'geometry,rating,user_ratings_total');
        detailsUrl.searchParams.set('key', GOOGLE_PLACES_API_KEY);

        const response = await fetch(detailsUrl.toString());
        const data = await response.json();

        if (data.status !== 'OK' || !data.result?.geometry?.location) {
          results.push({
            id: place.id,
            name: place.name,
            success: false,
            error: data.error_message || 'Failed to get location'
          });
          continue;
        }

        const { lat, lng } = data.result.geometry.location;

        // Update place with coordinates
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: updateError } = await (supabase as any)
          .from('places')
          .update({
            coordinates: { lat, lng },
            google_rating: data.result.rating || null,
            google_reviews_count: data.result.user_ratings_total || null,
            google_synced_at: new Date().toISOString(),
          })
          .eq('id', place.id);

        if (updateError) {
          results.push({
            id: place.id,
            name: place.name,
            success: false,
            error: updateError.message
          });
        } else {
          results.push({
            id: place.id,
            name: place.name,
            success: true
          });
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (err) {
        results.push({
          id: place.id,
          name: place.name,
          success: false,
          error: String(err)
        });
      }
    }

    const synced = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    return NextResponse.json({
      message: `Synced ${synced} places, ${failed} failed`,
      synced,
      failed,
      results,
    });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
