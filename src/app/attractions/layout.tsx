import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '나트랑 볼거리',
  description: '나트랑 최고의 관광지 정보 - 섬, 해변, 자연, 폭포, 문화유적, 테마파크 등 나트랑의 다양한 볼거리를 찾아보세요.',
  keywords: ['나트랑 관광', '나트랑 볼거리', '나트랑 섬', '나트랑 해변', '빈펄랜드', '나트랑 테마파크'],
  openGraph: {
    title: '나트랑 볼거리 | 나트랑 여행 플래너',
    description: '나트랑 최고의 관광지 정보 - 섬, 해변, 자연, 문화유적을 찾아보세요.',
    type: 'website',
  },
};

export default function AttractionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
