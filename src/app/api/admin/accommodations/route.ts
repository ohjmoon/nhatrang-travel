import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// POST - Create new accommodation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const supabase = createAdminClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('accommodations')
      .insert(body)
      .select()
      .single();

    if (error) {
      console.error('Failed to create accommodation:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
