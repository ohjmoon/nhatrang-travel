import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '나트랑 액티비티',
  description: '나트랑 최고의 액티비티 정보 - 스노클링, 다이빙, 스파, 투어, 파티 등 나트랑에서 즐길 수 있는 다양한 활동을 찾아보세요.',
  keywords: ['나트랑 액티비티', '나트랑 스노클링', '나트랑 다이빙', '나트랑 스파', '나트랑 투어', '나트랑 체험'],
  openGraph: {
    title: '나트랑 액티비티 | 나트랑 여행 플래너',
    description: '나트랑 최고의 액티비티 정보 - 수상 스포츠, 스파, 투어를 찾아보세요.',
    type: 'website',
  },
};

export default function ActivitiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
