import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nhatrang-travel.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: '나트랑 여행 플래너 | Nha Trang Travel Planner',
    template: '%s | 나트랑 여행 플래너',
  },
  description: '나트랑 여행의 모든 것 - 맛집, 숙소, 볼거리, 액티비티, 쇼핑 정보와 일정 관리. 베트남 나트랑 여행 계획을 쉽고 편하게!',
  keywords: ['나트랑', 'Nha Trang', '베트남 여행', '여행 플래너', '나트랑 맛집', '나트랑 호텔', '나트랑 숙소', '나트랑 볼거리', '나트랑 액티비티', '나트랑 쇼핑'],
  authors: [{ name: '나트랑 여행 플래너' }],
  creator: '나트랑 여행 플래너',
  publisher: '나트랑 여행 플래너',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: siteUrl,
    siteName: '나트랑 여행 플래너',
    title: '나트랑 여행 플래너 | Nha Trang Travel Planner',
    description: '나트랑 여행의 모든 것 - 맛집, 숙소, 볼거리, 액티비티, 쇼핑 정보와 일정 관리',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '나트랑 여행 플래너',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '나트랑 여행 플래너 | Nha Trang Travel Planner',
    description: '나트랑 여행의 모든 것 - 맛집, 숙소, 볼거리, 액티비티, 쇼핑 정보와 일정 관리',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || '',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
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
