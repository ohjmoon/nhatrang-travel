import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '저장된 일정',
  description: '나트랑 여행 저장된 일정 목록 - 내가 만든 나트랑 여행 일정을 확인하고 관리하세요.',
  keywords: ['나트랑 일정', '나트랑 여행 일정', '저장된 일정'],
  openGraph: {
    title: '저장된 일정 | 나트랑 여행 플래너',
    description: '나트랑 여행 저장된 일정 목록을 확인하세요.',
    type: 'website',
  },
};

export default function ItinerariesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
