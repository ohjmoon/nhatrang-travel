# TODO - 남은 작업 목록

## 완료된 작업 (최근)

### 1. 관리자 페이지 - 숙소 관리 기능 추가 ✅
- [x] `/admin/accommodations` 페이지 생성
- [x] 숙소 CRUD 기능 구현
- [x] Google Places 검색으로 숙소 정보 자동 입력

### 2. 홈페이지 Supabase 연동 ✅
- [x] 홈페이지 숙소 섹션 Supabase 데이터 사용
- [x] 홈페이지 추천 장소 섹션 동적 데이터로 변경

### 3. 숙소 이미지 개선 ✅
- [x] Google Places API로 실제 호텔 이미지 가져오기
- [x] Supabase Storage에 이미지 저장
- [x] 현재 Unsplash 임시 이미지 교체

## 우선순위 높음

## 우선순위 중간

### 4. 검색 기능 개선 ✅
- [x] 통합 검색 기능 (모든 카테고리) - `/search` 페이지
- [x] 검색 결과 페이지 - `useGlobalSearch` 훅

### 5. 필터 기능 개선 ✅
- [x] URL 쿼리 파라미터로 필터 상태 유지 - `useUrlFilters` 훅
- [x] 필터 공유 가능하게 변경 - 공유 버튼 + URL 복사

### 6. 일정 기능 개선 ✅
- [x] 일정에 Supabase 데이터 연동 (숙소, 맛집, 볼거리, 액티비티, 쇼핑)
- [x] 일정 공유 기능 (URL 복사)

## 우선순위 낮음

### 7. 성능 최적화 ✅
- [x] 이미지 lazy loading (`OptimizedImage`, `LazyImage` 컴포넌트)
- [x] 데이터 캐싱 (SWR - `swr-hooks.ts`)
- [x] Next.js Image 최적화 설정

### 8. SEO 개선 ✅
- [x] 메타데이터 동적 생성 (각 페이지별 layout.tsx)
- [x] sitemap.xml 생성 (`sitemap.ts`)
- [x] robots.txt 생성 (`robots.ts`)
- [x] OpenGraph, Twitter Card 메타데이터

---

## 완료된 작업 ✅

- [x] 맛집 페이지 Supabase 연동 (69개)
- [x] 볼거리 페이지 Supabase 연동 (28개)
- [x] 액티비티 페이지 Supabase 연동 (21개)
- [x] 쇼핑 페이지 Supabase 연동 (10개)
- [x] 숙소 페이지 Supabase 연동 (40개)
- [x] Google Places API 연동 (관리자 검색)
- [x] 일정 저장/관리 기능
- [x] Google Maps/Calendar 링크 생성
- [x] 성능 최적화 (이미지 lazy loading, SWR 데이터 캐싱)
- [x] SEO 개선 (메타데이터, sitemap.xml, robots.txt)
