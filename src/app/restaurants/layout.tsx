import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '나트랑 맛집',
  description: '나트랑 최고의 맛집 정보 - 한식, 베트남 음식, 해산물, 카페, 바 등 다양한 레스토랑을 찾아보세요. 현지인 추천 맛집부터 가성비 좋은 식당까지!',
  keywords: ['나트랑 맛집', '나트랑 레스토랑', '나트랑 한식', '나트랑 해산물', '나트랑 카페', '베트남 음식'],
  openGraph: {
    title: '나트랑 맛집 | 나트랑 여행 플래너',
    description: '나트랑 최고의 맛집 정보 - 한식, 베트남 음식, 해산물, 카페, 바 등 다양한 레스토랑을 찾아보세요.',
    type: 'website',
  },
};

export default function RestaurantsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
