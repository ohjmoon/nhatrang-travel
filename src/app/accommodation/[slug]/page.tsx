'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Palmtree,
  Star,
  Heart,
  ArrowLeft,
  Sparkles,
  Phone,
  Globe,
  MapPin,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { MapLinkIcon, GoogleLinksButton } from '@/components/google-links';
import { supabase } from '@/lib/supabase/client';
import {
  Accommodation,
  ACCOMMODATION_PURPOSES,
} from '@/lib/supabase/types';

interface AccommodationImage {
  id: string;
  url: string;
  alt: string | null;
  sort_order: number;
  is_thumbnail: boolean;
}

export default function AccommodationDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [accommodation, setAccommodation] = useState<Accommodation | null>(null);
  const [images, setImages] = useState<AccommodationImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imageGalleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAccommodation();
  }, [slug]);

  async function fetchAccommodation() {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('accommodations')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (error) throw error;

      setAccommodation(data as Accommodation);

      // 이미지 조회
      if (data?.id) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: imagesData } = await (supabase as any)
          .from('accommodation_images')
          .select('*')
          .eq('accommodation_id', data.id)
          .order('sort_order');

        if (imagesData && imagesData.length > 0) {
          setImages(imagesData);
        } else if (data.thumbnail) {
          setImages([{
            id: 'thumbnail',
            url: data.thumbnail,
            alt: data.name_ko,
            sort_order: 0,
            is_thumbnail: true,
          }]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch accommodation:', err);
      setError('숙소를 찾을 수 없습니다.');
    } finally {
      setLoading(false);
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const getPurposeLabel = (purposeId: string) => {
    const purpose = ACCOMMODATION_PURPOSES.find((p) => p.id === purposeId);
    return purpose ? `${purpose.icon} ${purpose.name}` : purposeId;
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const selectImageAndScroll = (index: number) => {
    setCurrentImageIndex(index);
    imageGalleryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-ocean-50 via-white to-palm-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-500" />
      </div>
    );
  }

  if (error || !accommodation) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-ocean-50 via-white to-palm-50">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-ocean-100">
          <div className="container mx-auto px-4 h-16 flex items-center">
            <Link href="/accommodation" className="flex items-center gap-2 text-ocean-700">
              <ArrowLeft className="w-5 h-5" />
              <span>숙소 목록</span>
            </Link>
          </div>
        </nav>
        <div className="pt-24 px-4 text-center">
          <h1 className="text-2xl font-bold text-ocean-800 mb-4">숙소를 찾을 수 없습니다</h1>
          <Link href="/accommodation">
            <Button variant="ocean">숙소 목록으로</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-ocean-50 via-white to-palm-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-ocean-100">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/accommodation" className="flex items-center gap-2 text-ocean-700 hover:text-ocean-500">
            <ArrowLeft className="w-5 h-5" />
            <span>숙소 목록</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ocean-500 to-palm-500 flex items-center justify-center">
                <Palmtree className="w-6 h-6 text-white" />
              </div>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Image Gallery */}
      <div ref={imageGalleryRef} className="pt-16 relative">
        <div className="relative h-[50vh] md:h-[60vh] overflow-hidden bg-ocean-100">
          {images.length > 0 ? (
            <>
              <img
                src={images[currentImageIndex]?.url}
                alt={images[currentImageIndex]?.alt || accommodation.name_ko}
                className="w-full h-full object-cover"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-lg transition-all"
                  >
                    <ChevronLeft className="w-6 h-6 text-ocean-700" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-lg transition-all"
                  >
                    <ChevronRight className="w-6 h-6 text-ocean-700" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-ocean-400">이미지 없음</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <MapLinkIcon
              name={accommodation.name}
              address={`${accommodation.area_name}, Nha Trang`}
              latitude={accommodation.latitude ?? undefined}
              longitude={accommodation.longitude ?? undefined}
            />
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isFavorite
                  ? 'bg-sunset-500 text-white'
                  : 'bg-white/80 text-ocean-600 hover:bg-white'
              }`}
            >
              <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Badges */}
          <div className="absolute bottom-4 left-4 flex gap-2">
            <span className="px-4 py-2 rounded-full bg-white/90 text-ocean-700 font-medium">
              📍 {accommodation.area_name}
            </span>
            {accommodation.is_new && (
              <span className="px-4 py-2 rounded-full bg-sunset-500 text-white font-medium flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                {accommodation.open_year}년 신상
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Rating */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-ocean-800 mb-2">
                {accommodation.name_ko}
              </h1>
              <p className="text-xl text-ocean-500 mb-4">{accommodation.name}</p>

              {(accommodation.google_rating || accommodation.rating) && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sunset-500">
                    <Star className="w-6 h-6 fill-current" />
                    <span className="text-2xl font-bold">
                      {accommodation.google_rating || accommodation.rating}
                    </span>
                  </div>
                  {(accommodation.google_reviews_count || accommodation.review_count) && (
                    <span className="text-ocean-500">
                      ({(accommodation.google_reviews_count || accommodation.review_count).toLocaleString()}개 리뷰)
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Purpose Tags */}
            <div className="flex flex-wrap gap-2">
              {(accommodation.purposes || []).map((purpose) => (
                <span
                  key={purpose}
                  className="px-4 py-2 bg-sunset-50 text-sunset-700 rounded-full font-medium"
                >
                  {getPurposeLabel(purpose)}
                </span>
              ))}
            </div>

            {/* Description */}
            {accommodation.description && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-ocean-800 mb-4">소개</h2>
                  <p className="text-ocean-600 leading-relaxed whitespace-pre-line">
                    {accommodation.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Features */}
            {accommodation.features && accommodation.features.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-ocean-800 mb-4">특징</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {accommodation.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-ocean-600">
                        <Check className="w-5 h-5 text-palm-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Amenities */}
            {accommodation.amenities && accommodation.amenities.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-ocean-800 mb-4">편의시설</h2>
                  <div className="flex flex-wrap gap-2">
                    {accommodation.amenities.map((amenity, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-ocean-50 text-ocean-700 rounded-lg"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <p className="text-ocean-500 mb-1">1박 요금</p>
                  <p className="text-3xl font-bold text-ocean-800">
                    ₩{formatPrice(accommodation.price_min || 0)}
                    {accommodation.price_max && accommodation.price_max !== accommodation.price_min && (
                      <span className="text-lg font-normal text-ocean-500">
                        ~ ₩{formatPrice(accommodation.price_max)}
                      </span>
                    )}
                  </p>
                </div>

                {/* Contact Info */}
                <div className="space-y-3 mb-6">
                  {accommodation.phone && (
                    <a
                      href={`tel:${accommodation.phone}`}
                      className="flex items-center gap-3 text-ocean-600 hover:text-ocean-800"
                    >
                      <Phone className="w-5 h-5" />
                      <span>{accommodation.phone}</span>
                    </a>
                  )}
                  {accommodation.website && (
                    <a
                      href={accommodation.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-ocean-600 hover:text-ocean-800"
                    >
                      <Globe className="w-5 h-5" />
                      <span className="truncate">웹사이트 방문</span>
                    </a>
                  )}
                  {accommodation.latitude && accommodation.longitude && (
                    <div className="flex items-center gap-3 text-ocean-600">
                      <MapPin className="w-5 h-5" />
                      <span>{accommodation.area_name}, Nha Trang</span>
                    </div>
                  )}
                </div>

                {/* Google Links */}
                <GoogleLinksButton
                  name={accommodation.name}
                  nameKo={accommodation.name_ko}
                  address={`${accommodation.area_name}, Nha Trang`}
                  latitude={accommodation.latitude ?? undefined}
                  longitude={accommodation.longitude ?? undefined}
                />
              </CardContent>
            </Card>

            {/* Image Thumbnails */}
            {images.length > 1 && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-ocean-800 mb-3">갤러리</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {images.slice(0, 6).map((img, idx) => (
                      <button
                        key={img.id}
                        onClick={() => selectImageAndScroll(idx)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          idx === currentImageIndex ? 'border-ocean-500' : 'border-transparent'
                        }`}
                      >
                        <img
                          src={img.url}
                          alt={img.alt || ''}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-ocean-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-ocean-400 text-sm">
          &copy; 2024 Nha Trang Travel. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
