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

// GET - List all itineraries
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('itineraries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch itineraries' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching itineraries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch itineraries' },
      { status: 500 }
    );
  }
}

// POST - Create new itinerary (requires password)
export async function POST(request: NextRequest) {
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

    // Validate required fields
    if (!itinerary.title || !itinerary.start_date || !itinerary.end_date || !itinerary.days) {
      return NextResponse.json(
        { error: '필수 항목이 누락되었습니다' },
        { status: 400 }
      );
    }

    // Calculate total places
    const totalPlaces = itinerary.days.reduce(
      (sum: number, day: { items: unknown[] }) => sum + (day.items?.length || 0),
      0
    );

    // Get first item's image as thumbnail
    let thumbnail: string | null = null;
    for (const day of itinerary.days) {
      if (day.items && day.items.length > 0) {
        thumbnail = day.items[0].image;
        break;
      }
    }

    const adminClient = createAdminClient();

    const { data, error } = await adminClient
      .from('itineraries')
      .insert({
        title: itinerary.title,
        description: itinerary.description || null,
        start_date: itinerary.start_date,
        end_date: itinerary.end_date,
        days: itinerary.days,
        total_places: totalPlaces,
        thumbnail,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: '일정 저장에 실패했습니다' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating itinerary:', error);
    return NextResponse.json(
      { error: '일정 저장에 실패했습니다' },
      { status: 500 }
    );
  }
}
