import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/client';

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

// POST: Search and update coordinates for accommodations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accommodationId, batchSize = 10 } = body;

    if (!GOOGLE_PLACES_API_KEY) {
      return NextResponse.json(
        { error: 'Google Places API key not configured' },
        { status: 500 }
      );
    }

    const supabase = createAdminClient();

    // Get accommodations to sync
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (supabase as any)
      .from('accommodations')
      .select('id, name, name_ko, area, google_place_id')
      .eq('is_published', true)
      .or('latitude.is.null,longitude.is.null');

    if (accommodationId) {
      query = query.eq('id', accommodationId);
    } else {
      query = query.limit(batchSize);
    }

    const { data: accommodations, error: fetchError } = await query;

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!accommodations || accommodations.length === 0) {
      return NextResponse.json({
        message: 'No accommodations to sync',
        synced: 0
      });
    }

    const results: { id: string; name: string; success: boolean; error?: string; google_place_id?: string }[] = [];

    for (const acc of accommodations) {
      try {
        let googlePlaceId = acc.google_place_id;
        let lat: number | null = null;
        let lng: number | null = null;
        let rating: number | null = null;
        let reviewsCount: number | null = null;

        // If no google_place_id, search for it
        if (!googlePlaceId) {
          // Build search query: name + area + "Nha Trang Vietnam"
          const searchQuery = `${acc.name} ${acc.area || ''} Nha Trang Vietnam`;

          const searchUrl = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
          searchUrl.searchParams.set('query', searchQuery);
          searchUrl.searchParams.set('language', 'en');
          searchUrl.searchParams.set('key', GOOGLE_PLACES_API_KEY);

          const searchResponse = await fetch(searchUrl.toString());
          const searchData = await searchResponse.json();

          if (searchData.status !== 'OK' || !searchData.results?.[0]) {
            results.push({
              id: acc.id,
              name: acc.name,
              success: false,
              error: `Search failed: ${searchData.status}`
            });
            continue;
          }

          const firstResult = searchData.results[0];
          googlePlaceId = firstResult.place_id;
          lat = firstResult.geometry?.location?.lat;
          lng = firstResult.geometry?.location?.lng;
          rating = firstResult.rating || null;
          reviewsCount = firstResult.user_ratings_total || null;
        } else {
          // Fetch place details using existing google_place_id
          const detailsUrl = new URL('https://maps.googleapis.com/maps/api/place/details/json');
          detailsUrl.searchParams.set('place_id', googlePlaceId);
          detailsUrl.searchParams.set('fields', 'geometry,rating,user_ratings_total');
          detailsUrl.searchParams.set('key', GOOGLE_PLACES_API_KEY);

          const response = await fetch(detailsUrl.toString());
          const data = await response.json();

          if (data.status !== 'OK' || !data.result?.geometry?.location) {
            results.push({
              id: acc.id,
              name: acc.name,
              success: false,
              error: data.error_message || 'Failed to get location'
            });
            continue;
          }

          lat = data.result.geometry.location.lat;
          lng = data.result.geometry.location.lng;
          rating = data.result.rating || null;
          reviewsCount = data.result.user_ratings_total || null;
        }

        // Update accommodation with coordinates
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: updateError } = await (supabase as any)
          .from('accommodations')
          .update({
            latitude: lat,
            longitude: lng,
            google_place_id: googlePlaceId,
            google_rating: rating,
            google_reviews_count: reviewsCount,
            google_synced_at: new Date().toISOString(),
          })
          .eq('id', acc.id);

        if (updateError) {
          results.push({
            id: acc.id,
            name: acc.name,
            success: false,
            error: updateError.message
          });
        } else {
          results.push({
            id: acc.id,
            name: acc.name,
            success: true,
            google_place_id: googlePlaceId || undefined
          });
        }

        // Delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 150));
      } catch (err) {
        results.push({
          id: acc.id,
          name: acc.name,
          success: false,
          error: String(err)
        });
      }
    }

    const synced = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    // Get remaining count
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { count: remaining } = await (supabase as any)
      .from('accommodations')
      .select('*', { count: 'exact', head: true })
      .or('latitude.is.null,longitude.is.null')
      .eq('is_published', true);

    return NextResponse.json({
      message: `Synced ${synced} accommodations, ${failed} failed`,
      synced,
      failed,
      remaining: remaining || 0,
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
