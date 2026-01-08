import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/client';

// Force dynamic rendering for admin API routes
export const dynamic = 'force-dynamic';

// PATCH - Update accommodation (publish status, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const supabase = createAdminClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('accommodations')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Failed to update accommodation:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete accommodation
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const supabase = createAdminClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('accommodations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Failed to delete accommodation:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Full update accommodation
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // 이미지 데이터 분리
    const { images, ...accommodationData } = body;

    const supabase = createAdminClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('accommodations')
      .update(accommodationData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Failed to update accommodation:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // 이미지 업데이트: 기존 이미지 삭제 후 새로 저장
    if (images !== undefined) {
      // 기존 이미지 삭제
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('accommodation_images')
        .delete()
        .eq('accommodation_id', id);

      // 새 이미지 저장
      if (images && images.length > 0) {
        const imageInserts = images.map((img: { url: string; alt: string | null; sort_order: number; is_thumbnail: boolean }) => ({
          accommodation_id: id,
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
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
