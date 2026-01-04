import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Use untyped client for itineraries table
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const createAdminClient = () =>
  createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

// GET - Get single itinerary
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('itineraries')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Itinerary not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching itinerary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch itinerary' },
      { status: 500 }
    );
  }
}

// PUT - Update itinerary (requires password)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { password, itinerary } = body;

    // Verify admin password
    const adminPassword = process.env.ITINERARY_ADMIN_PASSWORD;
    if (!adminPassword || password !== adminPassword) {
      return NextResponse.json(
        { error: '비밀번호가 올바르지 않습니다' },
        { status: 401 }
      );
    }

    // Calculate total places
    const totalPlaces = itinerary.days?.reduce(
      (sum: number, day: { items: unknown[] }) => sum + (day.items?.length || 0),
      0
    ) || 0;

    // Get first item's image as thumbnail
    let thumbnail: string | null = null;
    if (itinerary.days) {
      for (const day of itinerary.days) {
        if (day.items && day.items.length > 0) {
          thumbnail = day.items[0].image;
          break;
        }
      }
    }

    const adminClient = createAdminClient();

    const { data, error } = await adminClient
      .from('itineraries')
      .update({
        title: itinerary.title,
        description: itinerary.description || null,
        start_date: itinerary.start_date,
        end_date: itinerary.end_date,
        days: itinerary.days,
        total_places: totalPlaces,
        thumbnail,
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: '일정 수정에 실패했습니다' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating itinerary:', error);
    return NextResponse.json(
      { error: '일정 수정에 실패했습니다' },
      { status: 500 }
    );
  }
}

// DELETE - Delete itinerary (requires password)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { password } = body;

    // Verify admin password
    const adminPassword = process.env.ITINERARY_ADMIN_PASSWORD;
    if (!adminPassword || password !== adminPassword) {
      return NextResponse.json(
        { error: '비밀번호가 올바르지 않습니다' },
        { status: 401 }
      );
    }

    const adminClient = createAdminClient();

    const { error } = await adminClient
      .from('itineraries')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: '일정 삭제에 실패했습니다' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting itinerary:', error);
    return NextResponse.json(
      { error: '일정 삭제에 실패했습니다' },
      { status: 500 }
    );
  }
}
