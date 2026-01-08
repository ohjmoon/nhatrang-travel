import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/client';

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

// POST: Search and update coordinates for places without google_place_id
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { placeId, batchSize = 10, type } = body;

    if (!GOOGLE_PLACES_API_KEY) {
      return NextResponse.json(
        { error: 'Google Places API key not configured' },
        { status: 500 }
      );
    }

    const supabase = createAdminClient();

    // Get places to search
    let query = supabase
      .from('places')
      .select('id, name, name_ko, type, address')
      .is('coordinates', null)
      .eq('is_published', true);

    if (placeId) {
      query = query.eq('id', placeId);
    } else {
      if (type) {
        query = query.eq('type', type);
      }
      query = query.limit(batchSize);
    }

    const { data: places, error: fetchError } = await query;

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!places || places.length === 0) {
      return NextResponse.json({
        message: 'No places to search',
        synced: 0
      });
    }

    const results: { id: string; name: string; success: boolean; error?: string; google_place_id?: string }[] = [];

    for (const place of places) {
      try {
        // Build search query: name + "Nha Trang Vietnam"
        const searchQuery = `${place.name} Nha Trang Vietnam`;

        // Use Text Search API
        const searchUrl = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
        searchUrl.searchParams.set('query', searchQuery);
        searchUrl.searchParams.set('language', 'en');
        searchUrl.searchParams.set('key', GOOGLE_PLACES_API_KEY);

        const searchResponse = await fetch(searchUrl.toString());
        const searchData = await searchResponse.json();

        if (searchData.status !== 'OK' || !searchData.results?.[0]) {
          results.push({
            id: place.id,
            name: place.name,
            success: false,
            error: `Search failed: ${searchData.status}`
          });
          continue;
        }

        const firstResult = searchData.results[0];
        const { lat, lng } = firstResult.geometry.location;
        const googlePlaceId = firstResult.place_id;

        // Update place with coordinates and google_place_id
        const { error: updateError } = await supabase
          .from('places')
          .update({
            coordinates: { lat, lng },
            google_place_id: googlePlaceId,
            google_rating: firstResult.rating || null,
            google_reviews_count: firstResult.user_ratings_total || null,
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
            success: true,
            google_place_id: googlePlaceId
          });
        }

        // Delay to avoid rate limiting (Google allows 10 QPS for Places API)
        await new Promise(resolve => setTimeout(resolve, 150));
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

    // Get remaining count
    const { count: remaining } = await supabase
      .from('places')
      .select('*', { count: 'exact', head: true })
      .is('coordinates', null)
      .eq('is_published', true);

    return NextResponse.json({
      message: `Synced ${synced} places, ${failed} failed`,
      synced,
      failed,
      remaining: remaining || 0,
      results,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
