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
  MapPin,
  Star,
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
  Accommodation,
  AccommodationArea,
  ACCOMMODATION_AREAS,
  ACCOMMODATION_PURPOSES,
  ACCOMMODATION_PRICE_RANGES,
} from '@/lib/supabase/types';

const priceRangeLabels: Record<string, string> = {
  '$': '~10만원',
  '$$': '10~20만원',
  '$$$': '20~40만원',
  '$$$$': '40만원~',
};

function AccommodationsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const areaFilter = searchParams.get('area') as AccommodationArea | null;

  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [areaCounts, setAreaCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchAccommodations();
    fetchAreaCounts();
  }, [areaFilter]);

  async function fetchAccommodations() {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let query = (supabase as any)
        .from('accommodations')
        .select('*')
        .order('area')
        .order('sort_order');

      if (areaFilter) {
        query = query.eq('area', areaFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setAccommodations((data as Accommodation[]) || []);
    } catch (err) {
      console.error('Failed to fetch accommodations:', err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchAreaCounts() {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('accommodations')
        .select('area');

      if (error) throw error;

      const counts: Record<string, number> = {};
      (data || []).forEach((acc: { area: string }) => {
        counts[acc.area] = (counts[acc.area] || 0) + 1;
      });
      setAreaCounts(counts);
    } catch (err) {
      console.error('Failed to fetch area counts:', err);
    }
  }

  async function togglePublish(id: string, currentState: boolean) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('accommodations')
        .update({ is_published: !currentState })
        .eq('id', id);

      if (error) throw error;
      fetchAccommodations();
    } catch (err) {
      console.error('Failed to toggle publish:', err);
    }
  }

  async function deleteAccommodation(id: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('accommodations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setDeleteId(null);
      fetchAccommodations();
      fetchAreaCounts();
    } catch (err) {
      console.error('Failed to delete accommodation:', err);
    }
  }

  const filteredAccommodations = accommodations.filter(
    (acc) =>
      acc.name.toLowerCase().includes(search.toLowerCase()) ||
      acc.name_ko.toLowerCase().includes(search.toLowerCase())
  );

  const getPurposeLabel = (purposeId: string) => {
    const purpose = ACCOMMODATION_PURPOSES.find((p) => p.id === purposeId);
    return purpose ? `${purpose.icon} ${purpose.name}` : purposeId;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">
            {areaFilter
              ? ACCOMMODATION_AREAS.find((a) => a.id === areaFilter)?.name || '숙소'
              : '전체 숙소'}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            총 {filteredAccommodations.length}개
          </p>
        </div>
        <Link href="/admin/accommodations/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            새 숙소 추가
          </Button>
        </Link>
      </div>

      {/* Area Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        {ACCOMMODATION_AREAS.filter((a) => a.id !== 'all').map((area) => (
          <Card
            key={area.id}
            className={`cursor-pointer hover:shadow-md transition-shadow ${
              areaFilter === area.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => {
              const params = new URLSearchParams();
              if (areaFilter !== area.id) params.set('area', area.id);
              router.push(`/admin/accommodations?${params.toString()}`);
            }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {area.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{areaCounts[area.id] || 0}</div>
              <p className="text-xs text-gray-500">{area.nameEn}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="숙소 검색..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={areaFilter || 'all'}
              onValueChange={(value) => {
                const params = new URLSearchParams();
                if (value !== 'all') params.set('area', value);
                router.push(`/admin/accommodations?${params.toString()}`);
              }}
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="지역 선택" />
              </SelectTrigger>
              <SelectContent>
                {ACCOMMODATION_AREAS.map((area) => (
                  <SelectItem key={area.id} value={area.id}>
                    {area.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : filteredAccommodations.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>등록된 숙소가 없습니다.</p>
              <Link href="/admin/accommodations/new">
                <Button variant="outline" className="mt-4 gap-2">
                  <Plus className="h-4 w-4" />
                  첫 숙소 추가하기
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>숙소명</TableHead>
                    <TableHead>지역</TableHead>
                    <TableHead>목적</TableHead>
                    <TableHead>가격대</TableHead>
                    <TableHead>평점</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAccommodations.map((acc) => (
                    <TableRow key={acc.id}>
                      <TableCell>
                        {acc.thumbnail ? (
                          <img
                            src={acc.thumbnail}
                            alt={acc.name_ko}
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
                          <p className="font-medium">{acc.name_ko}</p>
                          <p className="text-sm text-gray-500">{acc.name}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1">
                          <MapPin className="h-3 w-3" />
                          {acc.area_name}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {(acc.purposes || []).slice(0, 2).map((p) => (
                            <Badge key={p} variant="secondary" className="text-xs">
                              {getPurposeLabel(p)}
                            </Badge>
                          ))}
                          {(acc.purposes || []).length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{acc.purposes.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {priceRangeLabels[acc.price_range]}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{acc.google_rating || acc.rating || '-'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {acc.is_published ? (
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
                              <Link href={`/admin/accommodations/${acc.id}`}>
                                <Edit className="h-4 w-4 mr-2" />
                                수정
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                togglePublish(acc.id, acc.is_published)
                              }
                            >
                              {acc.is_published ? (
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
                              onClick={() => setDeleteId(acc.id)}
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
              이 작업은 되돌릴 수 없습니다. 숙소와 관련된 모든 이미지도 함께 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => deleteId && deleteAccommodation(deleteId)}
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function AccommodationsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      }
    >
      <AccommodationsContent />
    </Suspense>
  );
}
