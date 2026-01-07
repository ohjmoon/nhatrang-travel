import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '나트랑 숙소',
  description: '나트랑 최고의 숙소 정보 - 깜란, 시내, 빈펄, 혼총, 닌반베이 지역의 호텔, 리조트, 레지던스를 찾아보세요. 가족 여행, 허니문, 올인클루시브까지!',
  keywords: ['나트랑 호텔', '나트랑 숙소', '나트랑 리조트', '빈펄 리조트', '깜란 호텔', '나트랑 숙박'],
  openGraph: {
    title: '나트랑 숙소 | 나트랑 여행 플래너',
    description: '나트랑 최고의 숙소 정보 - 호텔, 리조트, 레지던스를 찾아보세요.',
    type: 'website',
  },
};

export default function AccommodationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
