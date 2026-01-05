# WORKSPACE - 프로젝트 구조 및 현황

## 프로젝트 개요

**나트랑 여행 플래너** - 베트남 나트랑 여행 정보 및 일정 관리 웹앱

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel

## 디렉토리 구조

```
nhatrang-travel/
├── .claude/                    # Claude 작업 기록
│   ├── TODO.md                 # 남은 작업 목록
│   ├── COMMAND.md              # 자주 쓰는 명령어
│   └── WORKSPACE.md            # 프로젝트 구조 (현재 파일)
│
├── src/
│   ├── app/                    # Next.js App Router 페이지
│   │   ├── page.tsx            # 홈페이지
│   │   ├── accommodation/      # 숙소 페이지 ✅
│   │   ├── restaurants/        # 맛집 페이지 ✅
│   │   ├── attractions/        # 볼거리 페이지 ✅
│   │   ├── activities/         # 액티비티 페이지 ✅
│   │   ├── shopping/           # 쇼핑 페이지 ✅
│   │   ├── itinerary/          # 일정 페이지
│   │   └── admin/              # 관리자 페이지
│   │       ├── page.tsx        # 관리자 대시보드
│   │       ├── places/         # 장소 관리
│   │       └── accommodations/ # 숙소 관리 (TODO)
│   │
│   ├── components/             # 공통 컴포넌트
│   │   ├── ui/                 # shadcn/ui 컴포넌트
│   │   └── google-links.tsx    # Google 링크 버튼
│   │
│   ├── lib/
│   │   └── supabase/
│   │       ├── client.ts       # Supabase 클라이언트
│   │       ├── types.ts        # 타입 정의
│   │       └── hooks.ts        # React 훅 (데이터 fetching)
│   │
│   └── data/                   # 정적 데이터 (레거시)
│       └── accommodations.ts   # 숙소 데이터 (더 이상 사용 안함)
│
├── supabase/
│   ├── schema.sql              # DB 스키마 전체
│   └── seed-accommodations.sql # 숙소 시드 데이터
│
├── docs/                       # 문서
│   └── google-places-integration.md
│
└── public/                     # 정적 파일
```

## Supabase 데이터베이스 구조

### 테이블 목록

| 테이블 | 설명 | 데이터 수 |
|--------|------|----------|
| `places` | 맛집, 볼거리, 액티비티, 쇼핑 | 128개 |
| `accommodations` | 숙소 | 40개 |
| `itineraries` | 저장된 일정 | - |
| `categories` | 카테고리 정의 | 20개 |
| `place_images` | 장소 이미지 | - |

### places 테이블 타입별 현황

| type | 설명 | 수량 |
|------|------|------|
| restaurant | 맛집 | 69개 |
| attraction | 볼거리 | 28개 |
| activity | 액티비티 | 21개 |
| shopping | 쇼핑 | 10개 |

### accommodations 테이블 지역별 현황

| area | 한글명 | 수량 |
|------|--------|------|
| camranh | 깜란 | 13개 |
| city | 시내 | 16개 |
| vinpearl | 빈펄 | 4개 |
| honchong | 혼총 | 4개 |
| ninhvan | 닌반베이 | 3개 |

## 주요 타입 정의

### PlaceType (places 테이블)
```typescript
type PlaceType = 'restaurant' | 'attraction' | 'activity' | 'shopping';
```

### AccommodationArea (accommodations 테이블)
```typescript
type AccommodationArea = 'camranh' | 'city' | 'vinpearl' | 'honchong' | 'ninhvan';
```

### AccommodationPurpose
```typescript
type AccommodationPurpose = 'family' | 'couple' | 'allinclusive' | 'budget' | 'residence';
```

### AccommodationPriceRange
```typescript
type AccommodationPriceRange = '$' | '$$' | '$$$' | '$$$$';
```

## 주요 React 훅 (src/lib/supabase/hooks.ts)

| 훅 | 용도 |
|----|------|
| `useRestaurants()` | 맛집 목록 조회 |
| `useAttractions()` | 볼거리 목록 조회 |
| `useActivities()` | 액티비티 목록 조회 |
| `useShopping()` | 쇼핑 목록 조회 |
| `useAccommodations()` | 숙소 목록 조회 |
| `useCategoryCounts(type)` | 카테고리별 개수 조회 |
| `useAccommodationAreaCounts()` | 지역별 숙소 개수 |
| `useAccommodationPurposeCounts()` | 목적별 숙소 개수 |

## 최근 작업 이력

| 날짜 | 작업 내용 |
|------|----------|
| 2025-01-06 | 숙소 페이지 Supabase 연동 완료 |
| 2025-01-06 | accommodations 테이블 스키마 생성 |
| 2025-01-06 | 40개 숙소 시드 데이터 추가 |
| 이전 | Google Places API 연동 |
| 이전 | 일정 저장/관리 기능 |
| 이전 | 맛집/볼거리/액티비티/쇼핑 Supabase 연동 |
