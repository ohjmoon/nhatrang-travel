'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Palmtree,
  CalendarDays,
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  Loader2,
  AlertTriangle,
  ChevronRight,
  FileText,
} from 'lucide-react';
import { useItineraries } from '@/lib/itinerary';

export default function ItinerariesPage() {
  const { itineraries, loading, error, fetchItineraries } = useItineraries();

  useEffect(() => {
    fetchItineraries();
  }, [fetchItineraries]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return diff;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-ocean-50 via-white to-palm-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-ocean-100">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ocean-500 to-palm-500 flex items-center justify-center">
              <Palmtree className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-ocean-800 hidden sm:block">나트랑 트래블</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/accommodation" className="text-ocean-700 hover:text-ocean-500 transition-colors">숙소</Link>
            <Link href="/restaurants" className="text-ocean-700 hover:text-ocean-500 transition-colors">맛집</Link>
            <Link href="/attractions" className="text-ocean-700 hover:text-ocean-500 transition-colors">볼거리</Link>
            <Link href="/activities" className="text-ocean-700 hover:text-ocean-500 transition-colors">액티비티</Link>
            <Link href="/shopping" className="text-ocean-700 hover:text-ocean-500 transition-colors">쇼핑</Link>
          </div>
          <Link href="/itinerary">
            <Button variant="ocean" size="sm" className="gap-2">
              <CalendarDays className="w-4 h-4" />
              일정 만들기
            </Button>
          </Link>
        </div>
      </nav>

      {/* Header */}
      <header className="pt-24 pb-8 px-4 bg-gradient-to-r from-ocean-500 via-palm-500 to-sunset-500">
        <div className="container mx-auto">
          <Link
            href="/itinerary"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>일정 만들기</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            저장된 일정
          </h1>
          <p className="text-white/80">
            다른 여행자들의 나트랑 일정을 참고해보세요
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-16">
            <Loader2 className="w-10 h-10 text-ocean-500 animate-spin mx-auto mb-4" />
            <p className="text-ocean-600">일정을 불러오는 중...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              일정을 불러올 수 없습니다
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button variant="ocean" onClick={fetchItineraries}>
              다시 시도
            </Button>
          </div>
        ) : itineraries.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-ocean-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-ocean-800 mb-2">
              아직 저장된 일정이 없습니다
            </h3>
            <p className="text-ocean-600 mb-6">
              첫 번째 일정을 만들어보세요!
            </p>
            <Link href="/itinerary">
              <Button variant="ocean" className="gap-2">
                <CalendarDays className="w-4 h-4" />
                일정 만들기
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <p className="text-ocean-600 mb-6">
              <span className="font-semibold text-ocean-800">{itineraries.length}</span>개의 일정
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {itineraries.map((itinerary) => (
                <Link key={itinerary.id} href={`/itineraries/${itinerary.id}`}>
                  <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                    {/* Thumbnail */}
                    <div className="relative h-40 overflow-hidden bg-ocean-100">
                      {itinerary.thumbnail ? (
                        <img
                          src={itinerary.thumbnail}
                          alt={itinerary.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <CalendarDays className="w-12 h-12 text-ocean-300" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                      {/* Duration Badge */}
                      <div className="absolute bottom-3 left-3">
                        <span className="px-3 py-1 rounded-full bg-white/90 text-ocean-700 text-sm font-medium">
                          {calculateDays(itinerary.start_date, itinerary.end_date)}일 일정
                        </span>
                      </div>

                      {/* Places Count */}
                      <div className="absolute bottom-3 right-3">
                        <span className="px-3 py-1 rounded-full bg-ocean-500 text-white text-sm font-medium">
                          {itinerary.total_places}곳
                        </span>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      {/* Title */}
                      <h3 className="font-bold text-lg text-ocean-800 mb-2 group-hover:text-ocean-600 transition-colors flex items-center justify-between">
                        {itinerary.title}
                        <ChevronRight className="w-5 h-5 text-ocean-400 group-hover:translate-x-1 transition-transform" />
                      </h3>

                      {/* Description */}
                      {itinerary.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {itinerary.description}
                        </p>
                      )}

                      {/* Date */}
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDate(itinerary.start_date)} - {formatDate(itinerary.end_date)}
                        </span>
                      </div>

                      {/* Created Date */}
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                        <Clock className="w-3 h-3" />
                        <span>
                          {new Date(itinerary.created_at).toLocaleDateString('ko-KR')} 등록
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </>
        )}
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
