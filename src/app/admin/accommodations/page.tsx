'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MapPin,
  Star,
  Filter,
} from 'lucide-react';
import { accommodations, areas, purposes, Accommodation } from '@/data/accommodations';

const priceRangeLabels: Record<string, string> = {
  '$': '~10만원',
  '$$': '10~20만원',
  '$$$': '20~40만원',
  '$$$$': '40만원~',
};

export default function AccommodationsAdminPage() {
  const [search, setSearch] = useState('');
  const [areaFilter, setAreaFilter] = useState('all');
  const [purposeFilter, setPurposeFilter] = useState('all');

  const filteredAccommodations = useMemo(() => {
    return accommodations.filter((item) => {
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesSearch =
          item.name.toLowerCase().includes(searchLower) ||
          item.nameKo.includes(search) ||
          item.description.includes(search);
        if (!matchesSearch) return false;
      }

      // Area filter
      if (areaFilter !== 'all' && item.area !== areaFilter) {
        return false;
      }

      // Purpose filter
      if (purposeFilter !== 'all' && !item.purpose.includes(purposeFilter as any)) {
        return false;
      }

      return true;
    });
  }, [search, areaFilter, purposeFilter]);

  const stats = useMemo(() => {
    const byArea: Record<string, number> = {};
    const byPurpose: Record<string, number> = {};

    accommodations.forEach((item) => {
      byArea[item.area] = (byArea[item.area] || 0) + 1;
      item.purpose.forEach((p) => {
        byPurpose[p] = (byPurpose[p] || 0) + 1;
      });
    });

    return { byArea, byPurpose, total: accommodations.length };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">숙소 관리</h2>
          <p className="text-gray-500">총 {stats.total}개의 숙소가 등록되어 있습니다.</p>
        </div>
        <Link href="/admin/accommodations/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            새 숙소 추가
          </Button>
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-5">
        {areas.filter(a => a.id !== 'all').map((area) => (
          <Card key={area.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {area.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.byArea[area.id] || 0}</div>
              <p className="text-xs text-gray-500">개</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="숙소 이름으로 검색..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={areaFilter} onValueChange={setAreaFilter}>
              <SelectTrigger className="w-full md:w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="지역" />
              </SelectTrigger>
              <SelectContent>
                {areas.map((area) => (
                  <SelectItem key={area.id} value={area.id}>
                    {area.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={purposeFilter} onValueChange={setPurposeFilter}>
              <SelectTrigger className="w-full md:w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="목적" />
              </SelectTrigger>
              <SelectContent>
                {purposes.map((purpose) => (
                  <SelectItem key={purpose.id} value={purpose.id}>
                    {purpose.icon} {purpose.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">숙소명</TableHead>
                <TableHead>지역</TableHead>
                <TableHead>목적</TableHead>
                <TableHead>가격대</TableHead>
                <TableHead>평점</TableHead>
                <TableHead>신규</TableHead>
                <TableHead className="text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccommodations.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.nameKo}</div>
                      <div className="text-sm text-gray-500">{item.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-1">
                      <MapPin className="h-3 w-3" />
                      {item.areaName}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {item.purpose.map((p) => {
                        const purpose = purposes.find((pu) => pu.id === p);
                        return (
                          <Badge key={p} variant="secondary" className="text-xs">
                            {purpose?.icon} {purpose?.name}
                          </Badge>
                        );
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {priceRangeLabels[item.priceRange]}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{item.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.isNew && (
                      <Badge className="bg-green-500">
                        {item.openYear}년 오픈
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/accommodations/${item.id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => {
                          alert('정적 데이터 파일에서 직접 삭제해야 합니다.\n파일: src/data/accommodations.ts');
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredAccommodations.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              검색 결과가 없습니다.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
