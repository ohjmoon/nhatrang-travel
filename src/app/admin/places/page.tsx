'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ImageIcon,
  MoreHorizontal,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/lib/supabase/client';
import {
  PlaceType,
  Place,
  PLACE_TYPE_LABELS,
  CATEGORY_OPTIONS,
} from '@/lib/supabase/types';

function PlacesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeFilter = searchParams.get('type') as PlaceType | null;
  const categoryFilter = searchParams.get('category');

  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchPlaces();
  }, [typeFilter, categoryFilter]);

  async function fetchPlaces() {
    try {
      let query = supabase
        .from('places')
        .select('*')
        .order('type')
        .order('category')
        .order('sort_order');

      if (typeFilter) {
        query = query.eq('type', typeFilter);
      }
      if (categoryFilter) {
        query = query.eq('category', categoryFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPlaces(data || []);
    } catch (err) {
      console.error('Failed to fetch places:', err);
    } finally {
      setLoading(false);
    }
  }

  async function togglePublish(id: string, currentState: boolean) {
    try {
      const { error } = await supabase
        .from('places')
        .update({ is_published: !currentState })
        .eq('id', id);

      if (error) throw error;
      fetchPlaces();
    } catch (err) {
      console.error('Failed to toggle publish:', err);
    }
  }

  async function deletePlace(id: string) {
    try {
      const { error } = await supabase.from('places').delete().eq('id', id);

      if (error) throw error;
      setDeleteId(null);
      fetchPlaces();
    } catch (err) {
      console.error('Failed to delete place:', err);
    }
  }

  const filteredPlaces = places.filter(
    (place) =>
      place.name.toLowerCase().includes(search.toLowerCase()) ||
      place.name_ko.toLowerCase().includes(search.toLowerCase())
  );

  const getCategoryLabel = (type: PlaceType, category: string) => {
    const options = CATEGORY_OPTIONS[type];
    const found = options?.find((opt) => opt.value === category);
    return found ? `${found.icon} ${found.label}` : category;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">
            {typeFilter ? PLACE_TYPE_LABELS[typeFilter].nameKo : '전체 장소'}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            총 {filteredPlaces.length}개
          </p>
        </div>
        <Link href={`/admin/places/new${typeFilter ? `?type=${typeFilter}` : ''}`}>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            새 장소 추가
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="장소 검색..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={typeFilter || 'all'}
              onValueChange={(value) => {
                const params = new URLSearchParams();
                if (value !== 'all') params.set('type', value);
                router.push(`/admin/places?${params.toString()}`);
              }}
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="유형 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="restaurant">맛집</SelectItem>
                <SelectItem value="attraction">볼거리</SelectItem>
                <SelectItem value="activity">액티비티</SelectItem>
                <SelectItem value="shopping">쇼핑</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : filteredPlaces.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>등록된 장소가 없습니다.</p>
              <Link href="/admin/places/new">
                <Button variant="outline" className="mt-4 gap-2">
                  <Plus className="h-4 w-4" />
                  첫 장소 추가하기
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>이름</TableHead>
                    <TableHead>유형</TableHead>
                    <TableHead>카테고리</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlaces.map((place) => (
                    <TableRow key={place.id}>
                      <TableCell>
                        {place.thumbnail ? (
                          <img
                            src={place.thumbnail}
                            alt={place.name_ko}
                            className="w-10 h-10 object-cover rounded"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                            <ImageIcon className="h-4 w-4 text-gray-400" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{place.name_ko}</p>
                          <p className="text-sm text-gray-500">{place.name}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {PLACE_TYPE_LABELS[place.type as PlaceType]?.icon}{' '}
                          {PLACE_TYPE_LABELS[place.type as PlaceType]?.nameKo}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {getCategoryLabel(place.type as PlaceType, place.category)}
                      </TableCell>
                      <TableCell>
                        {place.is_published ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            공개
                          </Badge>
                        ) : (
                          <Badge variant="secondary">비공개</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/places/${place.id}`}>
                                <Edit className="h-4 w-4 mr-2" />
                                수정
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                togglePublish(place.id, place.is_published)
                              }
                            >
                              {place.is_published ? (
                                <>
                                  <EyeOff className="h-4 w-4 mr-2" />
                                  비공개로 전환
                                </>
                              ) : (
                                <>
                                  <Eye className="h-4 w-4 mr-2" />
                                  공개로 전환
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => setDeleteId(place.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              삭제
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다. 장소와 관련된 모든 이미지도 함께 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => deleteId && deletePlace(deleteId)}
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function PlacesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      }
    >
      <PlacesContent />
    </Suspense>
  );
}
