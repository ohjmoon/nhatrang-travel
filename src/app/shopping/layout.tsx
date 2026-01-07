import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '나트랑 쇼핑',
  description: '나트랑 최고의 쇼핑 스팟 정보 - 대형마트, 쇼핑몰, 전통시장, 야시장 등 나트랑에서 쇼핑할 수 있는 곳을 찾아보세요.',
  keywords: ['나트랑 쇼핑', '나트랑 마트', '나트랑 시장', '나트랑 야시장', '나트랑 쇼핑몰', '베트남 쇼핑'],
  openGraph: {
    title: '나트랑 쇼핑 | 나트랑 여행 플래너',
    description: '나트랑 최고의 쇼핑 스팟 정보 - 마트, 시장, 쇼핑몰을 찾아보세요.',
    type: 'website',
  },
};

export default function ShoppingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
