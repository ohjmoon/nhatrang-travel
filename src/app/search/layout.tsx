import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '검색',
  description: '나트랑 여행 정보 통합 검색 - 맛집, 숙소, 볼거리, 액티비티, 쇼핑 등 모든 정보를 한 번에 검색하세요.',
  keywords: ['나트랑 검색', '나트랑 여행 검색', '나트랑 정보'],
  openGraph: {
    title: '검색 | 나트랑 여행 플래너',
    description: '나트랑 여행 정보 통합 검색 - 모든 정보를 한 번에 검색하세요.',
    type: 'website',
  },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
