import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '나트랑 여행 플래너 | Nha Trang Travel Planner',
  description: '나트랑 여행의 모든 것 - 맛집, 숙소, 볼거리, 액티비티, 쇼핑 정보와 일정 관리',
  keywords: ['나트랑', 'Nha Trang', '베트남 여행', '여행 플래너', '나트랑 맛집', '나트랑 호텔'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
