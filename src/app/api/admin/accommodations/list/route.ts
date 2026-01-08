import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// GET - List all accommodations (including unpublished) for admin
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const area = searchParams.get('area');
    const status = searchParams.get('status');
    const countsOnly = searchParams.get('counts') === 'true';

    const supabase = createAdminClient();

    // counts만 요청하는 경우
    if (countsOnly) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: allData, error: countError } = await (supabase as any)
        .from('accommodations')
        .select('area, is_published');

      if (countError) {
        console.error('Failed to fetch counts:', countError);
        return NextResponse.json(
          { error: countError.message },
          { status: 400 }
        );
      }

      const areaCounts: Record<string, number> = {};
      let publishedCount = 0;
      let unpublishedCount = 0;

      (allData || []).forEach((acc: { area: string; is_published: boolean }) => {
        areaCounts[acc.area] = (areaCounts[acc.area] || 0) + 1;
        if (acc.is_published) {
          publishedCount++;
        } else {
          unpublishedCount++;
        }
      });

      return NextResponse.json({
        areaCounts,
        statusCounts: { published: publishedCount, unpublished: unpublishedCount }
      });
    }

    // 목록 조회
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (supabase as any)
      .from('accommodations')
      .select('*')
      .order('area')
      .order('sort_order');

    if (area && area !== 'all') {
      query = query.eq('area', area);
    }

    if (status === 'published') {
      query = query.eq('is_published', true);
    } else if (status === 'unpublished') {
      query = query.eq('is_published', false);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Failed to fetch accommodations:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
