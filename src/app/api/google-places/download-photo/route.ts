import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/client';
import { optimizeImage, generateImageFilename, getContentType } from '@/lib/image/optimizer';

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const STORAGE_BUCKET = 'place-images';

export async function POST(request: NextRequest) {
  try {
    const { photoReference, placeName, maxWidth = 1200 } = await request.json();

    if (!photoReference) {
      return NextResponse.json({ error: 'Photo reference is required' }, { status: 400 });
    }

    if (!GOOGLE_PLACES_API_KEY) {
      return NextResponse.json({ error: 'Google Places API key not configured' }, { status: 500 });
    }

    // 1. Download from Google Places
    const googlePhotoUrl = new URL('https://maps.googleapis.com/maps/api/place/photo');
    googlePhotoUrl.searchParams.set('photo_reference', photoReference);
    googlePhotoUrl.searchParams.set('maxwidth', String(maxWidth));
    googlePhotoUrl.searchParams.set('key', GOOGLE_PLACES_API_KEY);

    const photoResponse = await fetch(googlePhotoUrl.toString(), { redirect: 'follow' });

    if (!photoResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch photo from Google' }, { status: 502 });
    }

    const originalBuffer = Buffer.from(await photoResponse.arrayBuffer());

    // 2. Optimize image (WebP, max 300KB)
    const optimized = await optimizeImage(originalBuffer, {
      maxWidth: 1200,
      maxHeight: 1200,
      maxSizeKB: 300,
      format: 'webp',
      quality: 85,
    });

    // 3. Upload to Supabase Storage
    const supabase = createAdminClient();
    const filename = generateImageFilename(
      placeName ? placeName.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30) : 'place',
      'webp'
    );
    const filePath = `places/${filename}`;

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, optimized.buffer, {
        contentType: getContentType('webp'),
        cacheControl: '31536000', // 1 year cache
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload to storage', details: uploadError.message },
        { status: 500 }
      );
    }

    // 4. Get public URL
    const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      metadata: {
        format: optimized.format,
        width: optimized.width,
        height: optimized.height,
        sizeKB: optimized.sizeKB,
        filename,
      },
    });
  } catch (error) {
    console.error('Download photo error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
