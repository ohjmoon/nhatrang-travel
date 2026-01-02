'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
  Plus,
  X,
  Copy,
  AlertCircle,
} from 'lucide-react';
import { areas, purposes, Accommodation } from '@/data/accommodations';

const priceRanges = [
  { id: '$', name: '~10만원' },
  { id: '$$', name: '10~20만원' },
  { id: '$$$', name: '20~40만원' },
  { id: '$$$$', name: '40만원~' },
];

export default function NewAccommodationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    nameKo: '',
    area: '' as Accommodation['area'] | '',
    areaName: '',
    purpose: [] as Accommodation['purpose'],
    priceRange: '' as Accommodation['priceRange'] | '',
    priceMin: 0,
    priceMax: 0,
    rating: 4.5,
    reviewCount: 0,
    description: '',
    features: [] as string[],
    amenities: [] as string[],
    image: '',
    coordinates: { lat: 12.2, lng: 109.2 },
    isNew: false,
    openYear: new Date().getFullYear(),
  });

  const [newFeature, setNewFeature] = useState('');
  const [newAmenity, setNewAmenity] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');

  const generateId = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 30);
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      id: generateId(name),
    }));
  };

  const handleAreaChange = (areaId: string) => {
    const area = areas.find((a) => a.id === areaId);
    setFormData((prev) => ({
      ...prev,
      area: areaId as Accommodation['area'],
      areaName: area?.name || '',
    }));
  };

  const togglePurpose = (purposeId: string) => {
    setFormData((prev) => ({
      ...prev,
      purpose: prev.purpose.includes(purposeId as any)
        ? prev.purpose.filter((p) => p !== purposeId)
        : [...prev.purpose, purposeId as any],
    }));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const addAmenity = () => {
    if (newAmenity.trim()) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()],
      }));
      setNewAmenity('');
    }
  };

  const removeAmenity = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index),
    }));
  };

  const generateCode = () => {
    const code = `  {
    id: '${formData.id}',
    name: '${formData.name}',
    nameKo: '${formData.nameKo}',
    area: '${formData.area}',
    areaName: '${formData.areaName}',
    purpose: [${formData.purpose.map((p) => `'${p}'`).join(', ')}],
    priceRange: '${formData.priceRange}',
    priceMin: ${formData.priceMin},
    priceMax: ${formData.priceMax},
    rating: ${formData.rating},
    reviewCount: ${formData.reviewCount},
    description: '${formData.description.replace(/'/g, "\\'")}',
    features: [${formData.features.map((f) => `'${f}'`).join(', ')}],
    amenities: [${formData.amenities.map((a) => `'${a}'`).join(', ')}],
    image: '${formData.image}',
    coordinates: { lat: ${formData.coordinates.lat}, lng: ${formData.coordinates.lng} }${
      formData.isNew
        ? `,
    isNew: true,
    openYear: ${formData.openYear}`
        : ''
    }
  },`;
    setGeneratedCode(code);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    alert('코드가 클립보드에 복사되었습니다!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/accommodations">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold">새 숙소 추가</h2>
          <p className="text-gray-500">숙소 정보를 입력하고 코드를 생성하세요.</p>
        </div>
      </div>

      {/* Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-800">데이터 저장 방법</h3>
              <p className="text-sm text-blue-700 mt-1">
                현재 숙소 데이터는 정적 파일로 관리됩니다. 아래 폼을 작성한 후 &quot;코드 생성&quot; 버튼을 눌러
                생성된 코드를 <code className="bg-blue-200 px-1 rounded">src/data/accommodations.ts</code> 파일의
                accommodations 배열에 추가하세요.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">영문명 *</Label>
                  <Input
                    id="name"
                    placeholder="Alma Resort Cam Ranh"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nameKo">한글명 *</Label>
                  <Input
                    id="nameKo"
                    placeholder="알마 리조트"
                    value={formData.nameKo}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, nameKo: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="id">ID (자동 생성)</Label>
                <Input id="id" value={formData.id} disabled className="bg-gray-50" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">설명 *</Label>
                <Textarea
                  id="description"
                  placeholder="숙소에 대한 상세 설명을 입력하세요."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
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
                  <Select value={formData.area} onValueChange={handleAreaChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="지역 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {areas
                        .filter((a) => a.id !== 'all')
                        .map((area) => (
                          <SelectItem key={area.id} value={area.id}>
                            {area.name} ({area.nameEn})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>가격대 *</Label>
                  <Select
                    value={formData.priceRange}
                    onValueChange={(v) =>
                      setFormData((prev) => ({
                        ...prev,
                        priceRange: v as Accommodation['priceRange'],
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="가격대 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {priceRanges.map((range) => (
                        <SelectItem key={range.id} value={range.id}>
                          {range.id} ({range.name})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>목적 (복수 선택 가능) *</Label>
                <div className="flex flex-wrap gap-2">
                  {purposes
                    .filter((p) => p.id !== 'all')
                    .map((purpose) => (
                      <Badge
                        key={purpose.id}
                        variant={
                          formData.purpose.includes(purpose.id as any)
                            ? 'default'
                            : 'outline'
                        }
                        className="cursor-pointer"
                        onClick={() => togglePurpose(purpose.id)}
                      >
                        {purpose.icon} {purpose.name}
                      </Badge>
                    ))}
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
                  <Label htmlFor="priceMin">최소 가격 (원)</Label>
                  <Input
                    id="priceMin"
                    type="number"
                    placeholder="200000"
                    value={formData.priceMin || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        priceMin: parseInt(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priceMax">최대 가격 (원)</Label>
                  <Input
                    id="priceMax"
                    type="number"
                    placeholder="350000"
                    value={formData.priceMax || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        priceMax: parseInt(e.target.value) || 0,
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
                    min="1"
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
                  <Label htmlFor="reviewCount">리뷰 수</Label>
                  <Input
                    id="reviewCount"
                    type="number"
                    placeholder="1000"
                    value={formData.reviewCount || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        reviewCount: parseInt(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>특징 및 시설</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>특징 (Features)</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="예: 12개 수영장, 워터파크 무료"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                  />
                  <Button type="button" onClick={addFeature}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {feature}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeFeature(index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>편의시설 (Amenities)</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="예: 수영장, 스파, 피트니스"
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addAmenity()}
                  />
                  <Button type="button" onClick={addAmenity}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.amenities.map((amenity, index) => (
                    <Badge key={index} variant="outline" className="gap-1">
                      {amenity}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeAmenity(index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>추가 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image">이미지 URL</Label>
                <Input
                  id="image"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, image: e.target.value }))
                  }
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="lat">위도 (Latitude)</Label>
                  <Input
                    id="lat"
                    type="number"
                    step="0.0001"
                    placeholder="12.2"
                    value={formData.coordinates.lat || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        coordinates: {
                          ...prev.coordinates,
                          lat: parseFloat(e.target.value) || 0,
                        },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lng">경도 (Longitude)</Label>
                  <Input
                    id="lng"
                    type="number"
                    step="0.0001"
                    placeholder="109.2"
                    value={formData.coordinates.lng || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        coordinates: {
                          ...prev.coordinates,
                          lng: parseFloat(e.target.value) || 0,
                        },
                      }))
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>신규 오픈</Label>
                  <p className="text-sm text-gray-500">최근 오픈한 숙소인 경우 체크</p>
                </div>
                <Switch
                  checked={formData.isNew}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, isNew: checked }))
                  }
                />
              </div>

              {formData.isNew && (
                <div className="space-y-2">
                  <Label htmlFor="openYear">오픈 연도</Label>
                  <Input
                    id="openYear"
                    type="number"
                    placeholder="2024"
                    value={formData.openYear || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        openYear: parseInt(e.target.value) || new Date().getFullYear(),
                      }))
                    }
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Code Preview */}
        <div className="space-y-6">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>생성된 코드</CardTitle>
              <CardDescription>
                이 코드를 src/data/accommodations.ts 파일에 추가하세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={generateCode} className="w-full gap-2">
                <Save className="h-4 w-4" />
                코드 생성
              </Button>

              {generatedCode && (
                <>
                  <div className="relative">
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                      {generatedCode}
                    </pre>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute top-2 right-2 gap-1"
                      onClick={copyCode}
                    >
                      <Copy className="h-3 w-3" />
                      복사
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    위 코드를 복사하여{' '}
                    <code className="bg-gray-100 px-1 rounded">
                      src/data/accommodations.ts
                    </code>{' '}
                    파일의 <code className="bg-gray-100 px-1 rounded">accommodations</code> 배열
                    끝에 붙여넣으세요.
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
