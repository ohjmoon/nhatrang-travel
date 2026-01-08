import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// POST - Create new accommodation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 이미지 데이터 분리
    const { images, ...accommodationData } = body;

    const supabase = createAdminClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('accommodations')
      .insert(accommodationData)
      .select()
      .single();

    if (error) {
      console.error('Failed to create accommodation:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // 이미지가 있으면 accommodation_images 테이블에 저장
    if (images && images.length > 0 && data?.id) {
      const imageInserts = images.map((img: { url: string; alt: string | null; sort_order: number; is_thumbnail: boolean }) => ({
        accommodation_id: data.id,
        url: img.url,
        alt: img.alt,
        sort_order: img.sort_order,
        is_thumbnail: img.is_thumbnail,
      }));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: imagesError } = await (supabase as any)
        .from('accommodation_images')
        .insert(imageInserts);

      if (imagesError) {
        console.error('Failed to save accommodation images:', imagesError);
        // 이미지 저장 실패는 경고만 하고 진행 (테이블이 없을 수 있음)
      }
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
