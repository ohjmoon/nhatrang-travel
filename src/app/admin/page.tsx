'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  UtensilsCrossed,
  Compass,
  Waves,
  ShoppingBag,
  Hotel,
  Plus,
  ImageIcon,
  AlertCircle,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { PlaceType, PLACE_TYPE_LABELS } from '@/lib/supabase/types';

interface Stats {
  total: number;
  byType: Record<PlaceType, number>;
  withoutImages: number;
  unpublished: number;
}

const typeIcons: Record<PlaceType, typeof UtensilsCrossed> = {
  restaurant: UtensilsCrossed,
  attraction: Compass,
  activity: Waves,
  shopping: ShoppingBag,
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Check if Supabase is configured
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
          setError('Supabase가 설정되지 않았습니다. .env.local 파일을 확인해주세요.');
          setLoading(false);
          return;
        }

        const { data: places, error } = await supabase
          .from('places')
          .select('id, type, thumbnail, is_published');

        if (error) throw error;

        const byType: Record<PlaceType, number> = {
          restaurant: 0,
          attraction: 0,
          activity: 0,
          shopping: 0,
        };

        let withoutImages = 0;
        let unpublished = 0;

        places?.forEach((place) => {
          byType[place.type as PlaceType]++;
          if (!place.thumbnail) withoutImages++;
          if (!place.is_published) unpublished++;
        });

        setStats({
          total: places?.length || 0,
          byType,
          withoutImages,
          unpublished,
        });
      } catch (err) {
        console.error('Failed to fetch stats:', err);
        setError('데이터를 불러오는데 실패했습니다. Supabase 연결을 확인해주세요.');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-800">설정 필요</h3>
                <p className="text-sm text-yellow-700 mt-1">{error}</p>
                <div className="mt-4 space-y-2 text-sm text-yellow-700">
                  <p className="font-medium">설정 방법:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>
                      <a
                        href="https://supabase.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        Supabase
                      </a>
                      에서 새 프로젝트 생성
                    </li>
                    <li>SQL Editor에서 <code className="bg-yellow-200 px-1 rounded">supabase/schema.sql</code> 실행</li>
                    <li><code className="bg-yellow-200 px-1 rounded">.env.example</code>을 복사하여 <code className="bg-yellow-200 px-1 rounded">.env.local</code> 생성</li>
                    <li>Supabase 프로젝트 설정에서 API 키 복사하여 입력</li>
                    <li>개발 서버 재시작</li>
                  </ol>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>빠른 시작</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <Link href="/admin/places/new">
                <Button className="w-full gap-2" size="lg">
                  <Plus className="h-5 w-5" />
                  새 장소 추가
                </Button>
              </Link>
              <Link href="/admin/places">
                <Button variant="outline" className="w-full gap-2" size="lg">
                  장소 목록 보기
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">대시보드</h2>
        <Link href="/admin/places/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            새 장소 추가
          </Button>
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {(Object.keys(typeIcons) as PlaceType[]).map((type) => {
          const Icon = typeIcons[type];
          const label = PLACE_TYPE_LABELS[type];
          return (
            <Link key={type} href={`/admin/places?type=${type}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    {label.nameKo}
                  </CardTitle>
                  <Icon className="h-5 w-5 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats?.byType[type] || 0}</div>
                  <p className="text-xs text-gray-500 mt-1">개 등록됨</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Status cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className={stats?.withoutImages ? 'border-orange-200' : ''}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">이미지 없는 장소</CardTitle>
            <ImageIcon className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.withoutImages || 0}</div>
            {stats?.withoutImages ? (
              <p className="text-xs text-orange-600 mt-1">이미지 추가 필요</p>
            ) : (
              <p className="text-xs text-green-600 mt-1">모든 장소에 이미지 있음</p>
            )}
          </CardContent>
        </Card>

        <Card className={stats?.unpublished ? 'border-yellow-200' : ''}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">비공개 장소</CardTitle>
            <AlertCircle className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.unpublished || 0}</div>
            <p className="text-xs text-gray-500 mt-1">
              총 {stats?.total || 0}개 중 {stats?.total ? stats.total - (stats.unpublished || 0) : 0}개 공개됨
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <CardTitle>빠른 작업</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Link href="/admin/accommodations/new">
              <Button variant="outline" className="w-full gap-2">
                <Hotel className="h-4 w-4" />
                숙소 추가
              </Button>
            </Link>
            <Link href="/admin/places/new?type=restaurant">
              <Button variant="outline" className="w-full gap-2">
                <UtensilsCrossed className="h-4 w-4" />
                맛집 추가
              </Button>
            </Link>
            <Link href="/admin/places/new?type=attraction">
              <Button variant="outline" className="w-full gap-2">
                <Compass className="h-4 w-4" />
                볼거리 추가
              </Button>
            </Link>
            <Link href="/admin/places/new?type=activity">
              <Button variant="outline" className="w-full gap-2">
                <Waves className="h-4 w-4" />
                액티비티 추가
              </Button>
            </Link>
            <Link href="/admin/places/new?type=shopping">
              <Button variant="outline" className="w-full gap-2">
                <ShoppingBag className="h-4 w-4" />
                쇼핑 추가
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
