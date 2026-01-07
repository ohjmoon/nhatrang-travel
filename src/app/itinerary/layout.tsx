import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '나트랑 일정 만들기',
  description: '나트랑 여행 일정을 쉽게 계획하세요 - 숙소, 맛집, 볼거리, 액티비티, 쇼핑을 드래그 앤 드롭으로 일정에 추가하고 관리하세요.',
  keywords: ['나트랑 일정', '나트랑 여행 계획', '나트랑 여행 플래너', '나트랑 일정 관리', '베트남 여행 계획'],
  openGraph: {
    title: '나트랑 일정 만들기 | 나트랑 여행 플래너',
    description: '나트랑 여행 일정을 쉽게 계획하세요 - 드래그 앤 드롭으로 일정 관리!',
    type: 'website',
  },
};

export default function ItineraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
