'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  Save,
  Loader2,
  Plus,
  X,
  Search,
  MapPin,
  Star,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import {
  Accommodation,
  AccommodationArea,
  AccommodationPurpose,
  AccommodationPriceRange,
  ACCOMMODATION_AREAS,
  ACCOMMODATION_PURPOSES,
  ACCOMMODATION_PRICE_RANGES,
} from '@/lib/supabase/types';
import { ImageUpload } from '@/components/admin/image-upload';
import { PlaceSearchModal } from '@/components/google-places';
import { PlaceDetails } from '@/lib/google-places/types';

interface AccommodationImage {
  id: string;
  created_at: string;
  place_id: string;
  url: string;
  alt: string | null;
  sort_order: number;
  is_thumbnail: boolean;
}

interface AccommodationFormData {
  slug: string;
  name: string;
  name_ko: string;
  area: AccommodationArea | '';
  area_name: string;
  purposes: AccommodationPurpose[];
  price_range: AccommodationPriceRange | '';
  price_min: number | null;
  price_max: number | null;
  rating: number;
  review_count: number;
  description: string;
  features: string[];
  amenities: string[];
  latitude: number | null;
  longitude: number | null;
  is_new: boolean;
  open_year: number | null;
  is_published: boolean;
  // Google Places
  google_place_id: string;
  google_rating: number | null;
  google_reviews_count: number | null;
  phone: string;
  website: string;
}

const defaultFormData: AccommodationFormData = {
  slug: '',
  name: '',
  name_ko: '',
  area: '',
  area_name: '',
  purposes: [],
  price_range: '',
  price_min: null,
  price_max: null,
  rating: 0,
  review_count: 0,
  description: '',
  features: [],
  amenities: [],
  latitude: null,
  longitude: null,
  is_new: false,
  open_year: null,
  is_published: true,
  google_place_id: '',
  google_rating: null,
  google_reviews_count: null,
  phone: '',
  website: '',
};

export default function AccommodationEditPage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === 'new';

  const [formData, setFormData] = useState<AccommodationFormData>(defaultFormData);
  const [images, setImages] = useState<AccommodationImage[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [featureInput, setFeatureInput] = useState('');
  const [amenityInput, setAmenityInput] = useState('');
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Google Places 검색 결과 선택 시 자동 입력
  async function handleGooglePlaceSelect(place: PlaceDetails) {
    // 영업시간 포맷팅
    let hoursText = '';
    if (place.opening_hours?.weekday_text) {
      hoursText = place.opening_hours.weekday_text[0] || '';
    }

    setFormData((prev) => ({
      ...prev,
      name: place.name,
      slug: generateSlug(place.name),
      phone: place.formatted_phone_number || '',
      website: place.website || '',
      google_place_id: place.place_id,
      latitude: place.geometry?.location?.lat || null,
      longitude: place.geometry?.location?.lng || null,
      google_rating: place.rating || null,
      google_reviews_count: place.user_ratings_total || null,
    }));

    setSearchModalOpen(false);

    // 사진 다운로드 및 Supabase Storage 업로드 (최대 5개)
    if (place.photos && place.photos.length > 0 && images.length === 0) {
      setUploadingImages(true);
      const photosToDownload = place.photos.slice(0, 5);
      const uploadedImages: AccommodationImage[] = [];

      for (let idx = 0; idx < photosToDownload.length; idx++) {
        const photo = photosToDownload[idx];
        try {
          const response = await fetch('/api/google-places/download-photo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              photoReference: photo.photo_reference,
              placeName: place.name,
              maxWidth: 1200,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            uploadedImages.push({
              id: `google-${idx}`,
              place_id: '',
              url: data.url,
              alt: place.name,
              sort_order: idx,
              is_thumbnail: idx === 0,
              created_at: new Date().toISOString(),
            });
            setImages([...uploadedImages]);
          }
        } catch (err) {
          console.error(`Failed to download photo ${idx}:`, err);
        }
      }

      setUploadingImages(false);
    }
  }

  useEffect(() => {
    if (!isNew) {
      fetchAccommodation();
    }
  }, [params.id]);

  async function fetchAccommodation() {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('accommodations')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;

      if (data) {
        const acc = data as Accommodation;
        setFormData({
          slug: acc.slug,
          name: acc.name,
          name_ko: acc.name_ko,
          area: acc.area,
          area_name: acc.area_name,
          purposes: acc.purposes || [],
          price_range: acc.price_range,
          price_min: acc.price_min,
          price_max: acc.price_max,
          rating: acc.rating,
          review_count: acc.review_count,
          description: acc.description || '',
          features: acc.features || [],
          amenities: acc.amenities || [],
          latitude: acc.latitude,
          longitude: acc.longitude,
          is_new: acc.is_new,
          open_year: acc.open_year,
          is_published: acc.is_published,
          google_place_id: acc.google_place_id || '',
          google_rating: acc.google_rating,
          google_reviews_count: acc.google_reviews_count,
          phone: acc.phone || '',
          website: acc.website || '',
        });

        // 이미지가 있다면 썸네일로 설정
        if (acc.thumbnail) {
          setImages([{
            id: 'thumbnail',
            place_id: acc.id,
            url: acc.thumbnail,
            alt: acc.name_ko,
            sort_order: 0,
            is_thumbnail: true,
            created_at: acc.created_at,
          }]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch accommodation:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // 필수 필드 검증
    if (!formData.name_ko || !formData.name || !formData.area || !formData.price_range || formData.purposes.length === 0) {
      alert('필수 필드를 모두 입력해주세요: 한글 이름, 영문 이름, 지역, 가격대, 목적');
      return;
    }

    setSaving(true);

    try {
      const thumbnail = images.find((img) => img.is_thumbnail)?.url || images[0]?.url || null;

      const accommodationData = {
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
        name: formData.name,
        name_ko: formData.name_ko,
        area: formData.area,
        area_name: formData.area_name,
        purposes: formData.purposes,
        price_range: formData.price_range,
        price_min: formData.price_min,
        price_max: formData.price_max,
        rating: formData.rating,
        review_count: formData.review_count,
        description: formData.description || null,
        features: formData.features.length > 0 ? formData.features : null,
        amenities: formData.amenities.length > 0 ? formData.amenities : null,
        thumbnail,
        latitude: formData.latitude,
        longitude: formData.longitude,
        is_new: formData.is_new,
        open_year: formData.open_year,
        is_published: formData.is_published,
        google_place_id: formData.google_place_id || null,
        google_rating: formData.google_rating,
        google_reviews_count: formData.google_reviews_count,
        phone: formData.phone || null,
        website: formData.website || null,
        google_synced_at: formData.google_place_id ? new Date().toISOString() : null,
      };

      console.log('Saving accommodation:', accommodationData);

      if (isNew) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
          .from('accommodations')
          .insert(accommodationData)
          .select();

        console.log('Insert result:', { data, error });
        if (error) throw error;
        router.push('/admin/accommodations');
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
          .from('accommodations')
          .update(accommodationData)
          .eq('id', params.id)
          .select();

        console.log('Update result:', { data, error });
        if (error) throw error;
        router.push('/admin/accommodations');
      }
    } catch (err) {
      console.error('Failed to save accommodation:', err);
      const errorMessage = err instanceof Error ? err.message : JSON.stringify(err);
      alert('저장에 실패했습니다: ' + errorMessage);
    } finally {
      setSaving(false);
    }
  }

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  function handleAreaChange(areaId: string) {
    const area = ACCOMMODATION_AREAS.find((a) => a.id === areaId);
    setFormData((prev) => ({
      ...prev,
      area: areaId as AccommodationArea,
      area_name: area?.name || '',
    }));
  }

  function togglePurpose(purposeId: AccommodationPurpose) {
    setFormData((prev) => ({
      ...prev,
      purposes: prev.purposes.includes(purposeId)
        ? prev.purposes.filter((p) => p !== purposeId)
        : [...prev.purposes, purposeId],
    }));
  }

  function addFeature() {
    if (featureInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, featureInput.trim()],
      }));
      setFeatureInput('');
    }
  }

  function removeFeature(index: number) {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  }

  function addAmenity() {
    if (amenityInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, amenityInput.trim()],
      }));
      setAmenityInput('');
    }
  }

  function removeAmenity(index: number) {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index),
    }));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/accommodations">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h2 className="text-2xl font-bold">
            {isNew ? '새 숙소 추가' : '숙소 수정'}
          </h2>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => setSearchModalOpen(true)}
          className="gap-2"
        >
          <Search className="h-4 w-4" />
          Google Places에서 검색
        </Button>
      </div>

      {/* Google Places 검색 모달 */}
      <PlaceSearchModal
        open={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelect={handleGooglePlaceSelect}
        placeType="lodging"
        title="숙소 검색"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>기본 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name_ko">한글 이름 *</Label>
                  <Input
                    id="name_ko"
                    value={formData.name_ko}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        name_ko: e.target.value,
                        slug: prev.slug || generateSlug(e.target.value),
                      }))
                    }
                    placeholder="예: 알마 리조트"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">영문 이름 *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="예: Alma Resort Cam Ranh"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">슬러그 (URL)</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    placeholder="예: alma-resort"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">설명</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="숙소에 대한 설명을 입력하세요."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>분류</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>지역 *</Label>
                    <Select
                      value={formData.area}
                      onValueChange={handleAreaChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="지역 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {ACCOMMODATION_AREAS.filter((a) => a.id !== 'all').map(
                          (area) => (
                            <SelectItem key={area.id} value={area.id}>
                              {area.name} ({area.nameEn})
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>가격대 *</Label>
                    <Select
                      value={formData.price_range}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          price_range: value as AccommodationPriceRange,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="가격대 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {ACCOMMODATION_PRICE_RANGES.filter((p) => p.id !== 'all').map(
                          (range) => (
                            <SelectItem key={range.id} value={range.id}>
                              {range.id} ({range.name})
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>목적 (복수 선택 가능) *</Label>
                  <div className="flex flex-wrap gap-2">
                    {ACCOMMODATION_PURPOSES.filter((p) => p.id !== 'all').map(
                      (purpose) => (
                        <Badge
                          key={purpose.id}
                          variant={
                            formData.purposes.includes(purpose.id as AccommodationPurpose)
                              ? 'default'
                              : 'outline'
                          }
                          className="cursor-pointer"
                          onClick={() => togglePurpose(purpose.id as AccommodationPurpose)}
                        >
                          {purpose.icon} {purpose.name}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>가격 및 평점</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="price_min">최소 가격 (원)</Label>
                    <Input
                      id="price_min"
                      type="number"
                      placeholder="200000"
                      value={formData.price_min || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          price_min: e.target.value
                            ? parseInt(e.target.value)
                            : null,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price_max">최대 가격 (원)</Label>
                    <Input
                      id="price_max"
                      type="number"
                      placeholder="350000"
                      value={formData.price_max || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          price_max: e.target.value
                            ? parseInt(e.target.value)
                            : null,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="rating">평점</Label>
                    <Input
                      id="rating"
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      placeholder="4.5"
                      value={formData.rating || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          rating: parseFloat(e.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="review_count">리뷰 수</Label>
                    <Input
                      id="review_count"
                      type="number"
                      placeholder="1000"
                      value={formData.review_count || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          review_count: parseInt(e.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>특징 및 편의시설</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>특징 (Features)</Label>
                  <div className="flex gap-2">
                    <Input
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      placeholder="예: 12개 수영장, 워터파크 무료"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addFeature();
                        }
                      }}
                    />
                    <Button type="button" variant="outline" onClick={addFeature}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.features.map((feature, idx) => (
                      <Badge key={idx} variant="secondary" className="gap-1">
                        {feature}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeFeature(idx)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>편의시설 (Amenities)</Label>
                  <div className="flex gap-2">
                    <Input
                      value={amenityInput}
                      onChange={(e) => setAmenityInput(e.target.value)}
                      placeholder="예: 수영장, 스파, 피트니스"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addAmenity();
                        }
                      }}
                    />
                    <Button type="button" variant="outline" onClick={addAmenity}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.amenities.map((amenity, idx) => (
                      <Badge key={idx} variant="outline" className="gap-1">
                        {amenity}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeAmenity(idx)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>위치 및 연락처</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">위도 (Latitude)</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="0.0001"
                      placeholder="12.2"
                      value={formData.latitude || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          latitude: e.target.value
                            ? parseFloat(e.target.value)
                            : null,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">경도 (Longitude)</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="0.0001"
                      placeholder="109.2"
                      value={formData.longitude || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          longitude: e.target.value
                            ? parseFloat(e.target.value)
                            : null,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">전화번호</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      placeholder="+84 258 123 4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">웹사이트</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, website: e.target.value }))
                      }
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>신규 오픈</Label>
                    <p className="text-sm text-gray-500">
                      최근 오픈한 숙소인 경우 체크
                    </p>
                  </div>
                  <Switch
                    checked={formData.is_new}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, is_new: checked }))
                    }
                  />
                </div>

                {formData.is_new && (
                  <div className="space-y-2">
                    <Label htmlFor="open_year">오픈 연도</Label>
                    <Input
                      id="open_year"
                      type="number"
                      placeholder="2024"
                      value={formData.open_year || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          open_year: e.target.value
                            ? parseInt(e.target.value)
                            : null,
                        }))
                      }
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>게시 설정</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="is_published">공개 상태</Label>
                  <Switch
                    id="is_published"
                    checked={formData.is_published}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, is_published: checked }))
                    }
                  />
                </div>
                <p className="text-xs text-gray-500">
                  비공개 상태의 숙소는 사이트에 표시되지 않습니다.
                </p>

                <Button type="submit" className="w-full gap-2" disabled={saving}>
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {saving ? '저장 중...' : '저장'}
                </Button>
              </CardContent>
            </Card>

            {/* Google Places 정보 */}
            {formData.google_place_id && (
              <Card className="border-blue-200 bg-blue-50/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    Google Places 연동
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {formData.google_rating && (
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>
                        {formData.google_rating}
                        {formData.google_reviews_count && (
                          <span className="text-gray-500 ml-1">
                            ({formData.google_reviews_count.toLocaleString()} 리뷰)
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                  {formData.latitude && formData.longitude && (
                    <div className="text-gray-600 text-xs">
                      {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                    </div>
                  )}
                  {formData.phone && (
                    <div className="text-gray-600 text-xs">{formData.phone}</div>
                  )}
                  <div className="text-gray-400 text-xs pt-2 border-t">
                    Place ID: {formData.google_place_id.slice(0, 20)}...
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  이미지
                  {uploadingImages && (
                    <span className="text-sm font-normal text-blue-600 flex items-center gap-1">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Google에서 다운로드 중...
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  images={images}
                  onImagesChange={setImages as (images: { id: string; created_at: string; place_id: string; url: string; alt: string | null; sort_order: number; is_thumbnail: boolean; }[]) => void}
                  placeId={isNew ? undefined : (params.id as string)}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
