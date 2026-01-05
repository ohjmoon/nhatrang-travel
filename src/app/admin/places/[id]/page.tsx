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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save, Loader2, Plus, X, ImageIcon, Search, MapPin } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import {
  PlaceType,
  Place,
  PlaceImage,
  PLACE_TYPE_LABELS,
  CATEGORY_OPTIONS,
} from '@/lib/supabase/types';
import { ImageUpload } from '@/components/admin/image-upload';
import { PlaceSearchModal } from '@/components/google-places';
import { PlaceDetails } from '@/lib/google-places/types';

interface PlaceFormData {
  type: PlaceType;
  category: string;
  slug: string;
  name: string;
  name_ko: string;
  description: string;
  address: string;
  location: string;
  hours: string;
  price: string;
  price_min: number | null;
  price_max: number | null;
  duration: string;
  tips: string;
  features: string[];
  recommended_items: string[];
  is_published: boolean;
  // Google Places 추가 필드
  google_place_id: string;
  latitude: number | null;
  longitude: number | null;
  google_rating: number | null;
  google_reviews_count: number | null;
  phone: string;
  website: string;
}

const defaultFormData: PlaceFormData = {
  type: 'restaurant',
  category: '',
  slug: '',
  name: '',
  name_ko: '',
  description: '',
  address: '',
  location: '',
  hours: '',
  price: '',
  price_min: null,
  price_max: null,
  duration: '',
  tips: '',
  features: [],
  recommended_items: [],
  is_published: true,
  // Google Places 기본값
  google_place_id: '',
  latitude: null,
  longitude: null,
  google_rating: null,
  google_reviews_count: null,
  phone: '',
  website: '',
};

export default function PlaceEditPage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === 'new';

  const [formData, setFormData] = useState<PlaceFormData>(defaultFormData);
  const [images, setImages] = useState<PlaceImage[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [featureInput, setFeatureInput] = useState('');
  const [recommendedInput, setRecommendedInput] = useState('');
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Google Places 검색 결과 선택 시 자동 입력
  async function handleGooglePlaceSelect(place: PlaceDetails) {
    // 영업시간 포맷팅
    let hoursText = '';
    if (place.opening_hours?.weekday_text) {
      hoursText = place.opening_hours.weekday_text[0] || '';
    }

    // 폼 데이터 먼저 업데이트
    setFormData((prev) => ({
      ...prev,
      name: place.name,
      address: place.formatted_address,
      hours: hoursText,
      phone: place.formatted_phone_number || '',
      website: place.website || '',
      google_place_id: place.place_id,
      latitude: place.geometry?.location?.lat || null,
      longitude: place.geometry?.location?.lng || null,
      google_rating: place.rating || null,
      google_reviews_count: place.user_ratings_total || null,
      slug: generateSlug(place.name),
    }));

    setSearchModalOpen(false);

    // 사진 다운로드 및 Supabase Storage 업로드
    if (place.photos && place.photos.length > 0 && images.length === 0) {
      setUploadingImages(true);
      const photosToDownload = place.photos.slice(0, 5);
      const uploadedImages: PlaceImage[] = [];

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
            // 업로드된 이미지 바로 표시
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
      fetchPlace();
    }
  }, [params.id]);

  async function fetchPlace() {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('places')
        .select('*')
        .eq('id', params.id)
        .single();

      const place = data as Place | null;

      if (error) throw error;

      if (place) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const placeData = place as any;
        setFormData({
          type: place.type,
          category: place.category,
          slug: place.slug,
          name: place.name,
          name_ko: place.name_ko,
          description: place.description || '',
          address: place.address || '',
          location: place.location || '',
          hours: place.hours || '',
          price: place.price || '',
          price_min: place.price_min,
          price_max: place.price_max,
          duration: place.duration || '',
          tips: place.tips || '',
          features: place.features || [],
          recommended_items: place.recommended_items || [],
          is_published: place.is_published,
          // Google Places 필드
          google_place_id: placeData.google_place_id || '',
          latitude: placeData.latitude || null,
          longitude: placeData.longitude || null,
          google_rating: placeData.google_rating || null,
          google_reviews_count: placeData.google_reviews_count || null,
          phone: placeData.phone || '',
          website: placeData.website || '',
        });

        // Fetch images
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: imageData } = await (supabase as any)
          .from('place_images')
          .select('*')
          .eq('place_id', place.id)
          .order('sort_order');

        if (imageData) {
          setImages(imageData as PlaceImage[]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch place:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const thumbnail = images.find((img) => img.is_thumbnail)?.url || images[0]?.url || null;

      const placeData = {
        ...formData,
        thumbnail,
        features: formData.features.length > 0 ? formData.features : null,
        recommended_items: formData.recommended_items.length > 0 ? formData.recommended_items : null,
      };

      if (isNew) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
          .from('places')
          .insert(placeData)
          .select()
          .single();

        if (error) throw error;

        // Save images with new place id
        const newPlace = data as Place | null;
        if (images.length > 0 && newPlace) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase as any).from('place_images').insert(
            images.map((img, idx) => ({
              place_id: newPlace.id,
              url: img.url,
              alt: img.alt,
              sort_order: idx,
              is_thumbnail: img.is_thumbnail,
            }))
          );
        }

        router.push('/admin/places');
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
          .from('places')
          .update(placeData)
          .eq('id', params.id);

        if (error) throw error;

        // Update images
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any).from('place_images').delete().eq('place_id', params.id);
        if (images.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase as any).from('place_images').insert(
            images.map((img, idx) => ({
              place_id: params.id as string,
              url: img.url,
              alt: img.alt,
              sort_order: idx,
              is_thumbnail: img.is_thumbnail,
            }))
          );
        }

        router.push('/admin/places');
      }
    } catch (err) {
      console.error('Failed to save place:', err);
      alert('저장에 실패했습니다.');
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

  function addRecommended() {
    if (recommendedInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        recommended_items: [...prev.recommended_items, recommendedInput.trim()],
      }));
      setRecommendedInput('');
    }
  }

  function removeRecommended(index: number) {
    setFormData((prev) => ({
      ...prev,
      recommended_items: prev.recommended_items.filter((_, i) => i !== index),
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
          <Link href="/admin/places">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h2 className="text-2xl font-bold">
            {isNew ? '새 장소 추가' : '장소 수정'}
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
        placeType={formData.type === 'restaurant' ? 'restaurant' : undefined}
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
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="type">유형 *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: PlaceType) =>
                        setFormData((prev) => ({
                          ...prev,
                          type: value,
                          category: '',
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(PLACE_TYPE_LABELS) as PlaceType[]).map(
                          (type) => (
                            <SelectItem key={type} value={type}>
                              {PLACE_TYPE_LABELS[type].icon}{' '}
                              {PLACE_TYPE_LABELS[type].nameKo}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">카테고리 *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, category: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="카테고리 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORY_OPTIONS[formData.type]?.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.icon} {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

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
                    placeholder="예: 롱선사"
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
                    placeholder="예: Long Son Pagoda"
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
                    placeholder="예: long-son-pagoda"
                  />
                  <p className="text-xs text-gray-500">
                    URL에 사용될 고유 식별자입니다.
                  </p>
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
                    placeholder="장소에 대한 설명을 입력하세요."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>상세 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="address">주소</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                      placeholder="예: 22 Đ. 23 Tháng 10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">위치 설명</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      placeholder="예: 나트랑 시내 중심"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="hours">영업시간</Label>
                    <Input
                      id="hours"
                      value={formData.hours}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          hours: e.target.value,
                        }))
                      }
                      placeholder="예: 07:00-17:00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">소요시간</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          duration: e.target.value,
                        }))
                      }
                      placeholder="예: 30-60분"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="price">가격 표시</Label>
                    <Input
                      id="price"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          price: e.target.value,
                        }))
                      }
                      placeholder="예: 3-5만원"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price_min">최소 가격 (만원)</Label>
                    <Input
                      id="price_min"
                      type="number"
                      value={formData.price_min || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          price_min: e.target.value ? Number(e.target.value) : null,
                        }))
                      }
                      placeholder="3"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price_max">최대 가격 (만원)</Label>
                    <Input
                      id="price_max"
                      type="number"
                      value={formData.price_max || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          price_max: e.target.value ? Number(e.target.value) : null,
                        }))
                      }
                      placeholder="5"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tips">팁 / 참고사항</Label>
                  <Textarea
                    id="tips"
                    value={formData.tips}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, tips: e.target.value }))
                    }
                    placeholder="방문 시 유용한 팁을 입력하세요."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>특징 및 추천</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>특징 / 시설</Label>
                  <div className="flex gap-2">
                    <Input
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      placeholder="예: 무료 주차"
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
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-sm"
                      >
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeFeature(idx)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>추천 아이템</Label>
                  <div className="flex gap-2">
                    <Input
                      value={recommendedInput}
                      onChange={(e) => setRecommendedInput(e.target.value)}
                      placeholder="예: G7커피"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addRecommended();
                        }
                      }}
                    />
                    <Button type="button" variant="outline" onClick={addRecommended}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.recommended_items.map((item, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 bg-blue-100 px-2 py-1 rounded text-sm"
                      >
                        {item}
                        <button
                          type="button"
                          onClick={() => removeRecommended(idx)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
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
                  비공개 상태의 장소는 사이트에 표시되지 않습니다.
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
                      <span className="text-yellow-500">★</span>
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
                      📍 {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                    </div>
                  )}
                  {formData.phone && (
                    <div className="text-gray-600 text-xs">
                      📞 {formData.phone}
                    </div>
                  )}
                  {formData.website && (
                    <div className="text-gray-600 text-xs truncate">
                      🌐 <a href={formData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{formData.website}</a>
                    </div>
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
                  onImagesChange={setImages}
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
