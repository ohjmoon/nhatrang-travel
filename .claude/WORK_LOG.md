# Nha Trang Travel - 작업 기록

## 최근 업데이트: 2025-01-06

### 완료된 작업

#### 1. Supabase 연동 완료된 페이지
- **맛집 (restaurants)**: 69개 항목 - Supabase `places` 테이블 (type='restaurant')
- **볼거리 (attractions)**: 28개 항목 - Supabase `places` 테이블 (type='attraction')
- **액티비티 (activities)**: 21개 항목 - Supabase `places` 테이블 (type='activity')
- **쇼핑 (shopping)**: 10개 항목 - Supabase `places` 테이블 (type='shopping')
- **숙소 (accommodation)**: 40개 항목 - Supabase `accommodations` 테이블

#### 2. 숙소 페이지 Supabase 연동 (2025-01-06)
- `accommodations` 테이블 스키마 생성
  - `accommodation_area` enum: camranh, city, vinpearl, honchong, ninhvan
  - `accommodation_purpose` enum: family, couple, allinclusive, budget, residence
  - `accommodation_price_range` enum: $, $$, $$$, $$$$
- 타입 정의 추가: `src/lib/supabase/types.ts`
  - `AccommodationArea`, `AccommodationPurpose`, `AccommodationPriceRange`
  - `Accommodation`, `AccommodationInsert`, `AccommodationUpdate`
  - `ACCOMMODATION_AREAS`, `ACCOMMODATION_PURPOSES`, `ACCOMMODATION_PRICE_RANGES`
- 훅 추가: `src/lib/supabase/hooks.ts`
  - `useAccommodations()` - 숙소 목록 조회
  - `useAccommodationAreaCounts()` - 지역별 카운트
  - `useAccommodationPurposeCounts()` - 목적별 카운트
- 페이지 업데이트: `src/app/accommodation/page.tsx`
  - 정적 데이터에서 Supabase 데이터로 전환
  - 로딩/에러 상태 UI 추가
  - 신상 호텔 배지 표시 기능

#### 3. Google Places API 연동
- 관리자 페이지에서 Google Places 검색 기능
- 장소 정보 자동 가져오기 (rating, reviews, phone, website, coordinates)

#### 4. 일정 저장/관리 기능
- `itineraries` 테이블로 일정 저장
- Google Maps/Calendar 링크 생성

### 프로젝트 구조

```
src/
├── app/
│   ├── accommodation/     # 숙소 페이지 (Supabase 연동 완료)
│   ├── restaurants/       # 맛집 페이지 (Supabase 연동 완료)
│   ├── attractions/       # 볼거리 페이지 (Supabase 연동 완료)
│   ├── activities/        # 액티비티 페이지 (Supabase 연동 완료)
│   ├── shopping/          # 쇼핑 페이지 (Supabase 연동 완료)
│   ├── itinerary/         # 일정 페이지
│   └── admin/             # 관리자 페이지
├── lib/
│   └── supabase/
│       ├── client.ts      # Supabase 클라이언트
│       ├── types.ts       # 타입 정의
│       └── hooks.ts       # 데이터 fetching 훅
└── data/
    └── accommodations.ts  # (레거시 - 더 이상 사용하지 않음)

supabase/
├── schema.sql             # 전체 DB 스키마
└── seed-accommodations.sql # 숙소 시드 데이터
```

### Supabase 테이블 구조

1. **places** - 맛집, 볼거리, 액티비티, 쇼핑
   - type: 'restaurant' | 'attraction' | 'activity' | 'shopping'
   - Google Places 연동 필드 포함

2. **accommodations** - 숙소
   - area: 지역 (깜란, 시내, 빈펄, 혼총, 닌반베이)
   - purposes: 목적 배열 (가족, 커플, 올인클루시브, 가성비, 레지던스)
   - price_range: 가격대 ($, $$, $$$, $$$$)

3. **itineraries** - 저장된 일정
4. **categories** - 카테고리 정의
5. **place_images** - 장소 이미지

### 배포 정보
- Vercel 자동 배포: main 브랜치 push 시 자동 배포
- URL: https://nhatrang-travel.vercel.app

### 다음 작업 제안
1. 관리자 페이지에서 숙소 관리 기능 추가
2. 숙소 Google Places 연동 (이미지, 평점 자동 가져오기)
3. 홈페이지 숙소 섹션 Supabase 데이터 연동
4. 검색 기능 개선
