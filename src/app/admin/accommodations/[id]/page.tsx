'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Edit,
  MapPin,
  Star,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { accommodations, purposes, Accommodation } from '@/data/accommodations';

const priceRangeLabels: Record<string, string> = {
  '$': '~10만원',
  '$$': '10~20만원',
  '$$$': '20~40만원',
  '$$$$': '40만원~',
};

export default function AccommodationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [accommodation, setAccommodation] = useState<Accommodation | null>(null);
  const [codeVisible, setCodeVisible] = useState(false);

  useEffect(() => {
    const found = accommodations.find((a) => a.id === params.id);
    if (found) {
      setAccommodation(found);
    }
  }, [params.id]);

  if (!accommodation) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-gray-500">숙소를 찾을 수 없습니다.</p>
        <Link href="/admin/accommodations">
          <Button variant="outline">목록으로 돌아가기</Button>
        </Link>
      </div>
    );
  }

  const generateCode = () => {
    return `  {
    id: '${accommodation.id}',
    name: '${accommodation.name}',
    nameKo: '${accommodation.nameKo}',
    area: '${accommodation.area}',
    areaName: '${accommodation.areaName}',
    purpose: [${accommodation.purpose.map((p) => `'${p}'`).join(', ')}],
    priceRange: '${accommodation.priceRange}',
    priceMin: ${accommodation.priceMin},
    priceMax: ${accommodation.priceMax},
    rating: ${accommodation.rating},
    reviewCount: ${accommodation.reviewCount},
    description: '${accommodation.description.replace(/'/g, "\\'")}',
    features: [${accommodation.features.map((f) => `'${f}'`).join(', ')}],
    amenities: [${accommodation.amenities.map((a) => `'${a}'`).join(', ')}],
    image: '${accommodation.image}',
    coordinates: { lat: ${accommodation.coordinates.lat}, lng: ${accommodation.coordinates.lng} }${
      accommodation.isNew
        ? `,
    isNew: true,
    openYear: ${accommodation.openYear}`
        : ''
    }
  },`;
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generateCode());
    alert('코드가 클립보드에 복사되었습니다!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/accommodations">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold">{accommodation.nameKo}</h2>
            <p className="text-gray-500">{accommodation.name}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setCodeVisible(!codeVisible)}>
            코드 보기
          </Button>
          <Link href={`/accommodation`}>
            <Button variant="outline" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              사이트에서 보기
            </Button>
          </Link>
        </div>
      </div>

      {/* Code Preview */}
      {codeVisible && (
        <Card>
          <CardHeader>
            <CardTitle>데이터 코드</CardTitle>
            <CardDescription>
              수정이 필요하면 이 코드를 src/data/accommodations.ts 파일에서 찾아 수정하세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                {generateCode()}
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
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image */}
          <Card>
            <CardContent className="p-0">
              <div className="relative aspect-video">
                <Image
                  src={accommodation.image}
                  alt={accommodation.nameKo}
                  fill
                  className="object-cover rounded-lg"
                />
                {accommodation.isNew && (
                  <Badge className="absolute top-4 left-4 bg-green-500">
                    {accommodation.openYear}년 오픈
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>설명</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{accommodation.description}</p>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>특징</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {accommodation.features.map((feature, index) => (
                  <Badge key={index} variant="secondary">
                    {feature}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card>
            <CardHeader>
              <CardTitle>편의시설</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {accommodation.amenities.map((amenity, index) => (
                  <Badge key={index} variant="outline">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">ID</span>
                <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                  {accommodation.id}
                </code>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">지역</span>
                <Badge variant="outline" className="gap-1">
                  <MapPin className="h-3 w-3" />
                  {accommodation.areaName}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">목적</span>
                <div className="flex flex-wrap gap-1 justify-end">
                  {accommodation.purpose.map((p) => {
                    const purpose = purposes.find((pu) => pu.id === p);
                    return (
                      <Badge key={p} variant="secondary" className="text-xs">
                        {purpose?.icon}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">가격대</span>
                <span className="font-medium">{priceRangeLabels[accommodation.priceRange]}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">1박 가격</span>
                <span className="font-medium">
                  {(accommodation.priceMin / 10000).toFixed(0)}~
                  {(accommodation.priceMax / 10000).toFixed(0)}만원
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">평점</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{accommodation.rating}</span>
                  <span className="text-gray-400 text-sm">
                    ({accommodation.reviewCount.toLocaleString()})
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle>위치 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">위도</span>
                <span className="font-mono text-sm">{accommodation.coordinates.lat}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">경도</span>
                <span className="font-mono text-sm">{accommodation.coordinates.lng}</span>
              </div>
              <a
                href={`https://www.google.com/maps?q=${accommodation.coordinates.lat},${accommodation.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="w-full gap-2">
                  <MapPin className="h-4 w-4" />
                  Google Maps에서 보기
                </Button>
              </a>
            </CardContent>
          </Card>

          {/* Edit Notice */}
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Edit className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-yellow-800">수정 방법</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    숙소 정보를 수정하려면{' '}
                    <code className="bg-yellow-200 px-1 rounded">
                      src/data/accommodations.ts
                    </code>{' '}
                    파일에서 해당 숙소의 데이터를 직접 수정하세요.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
