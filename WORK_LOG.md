# 나트랑 트래블 작업 내역

## 2026-01-08: 일정 지도 위치/경로 표시 기능 수정

### 문제 상황
- 일정에 숙소/맛집/볼거리/액티비티/쇼핑을 추가해도 지도에 위치가 표시되지 않음
- 경로(route) 표시가 되지 않음

### 원인 분석
1. **Places 테이블**: 128개 장소 중 좌표가 있는 곳이 0개
2. **Accommodations 테이블**: 40개 숙소 모두 좌표 보유 (정상)

### 해결 방법

#### 1. Places 좌표 동기화 API 생성
- **파일**: `src/app/api/admin/places/route.ts`
  - GET: 장소 목록 및 좌표 상태 조회
  - POST: google_place_id가 있는 장소의 좌표 동기화

- **파일**: `src/app/api/admin/places/search-coordinates/route.ts`
  - POST: Google Places Text Search API를 사용하여 좌표가 없는 장소 검색 및 업데이트
  - 배치 처리 지원 (batchSize 파라미터)

#### 2. Accommodations 좌표 관리 API 추가
- **파일**: `src/app/api/admin/accommodations/route.ts`
  - GET 메서드 추가: 숙소 목록 및 좌표 상태 조회

- **파일**: `src/app/api/admin/accommodations/sync-coordinates/route.ts` (신규)
  - POST: 숙소 좌표 동기화 API

#### 3. Places 좌표 동기화 실행
- Google Places Text Search API 사용
- 검색 쿼리: `{장소명} Nha Trang Vietnam`
- 128개 장소 모두 좌표 업데이트 완료
- 업데이트 필드: `coordinates`, `google_place_id`, `google_rating`, `google_reviews_count`, `google_synced_at`

### 테스트 결과
1. **숙소 추가 테스트** (알마 리조트)
   - 지도에 파란색 마커 표시 ✅
   - 좌표: lat 12.0714173, lng 109.1952569 (깜란)

2. **맛집 추가 테스트** (인디스키친)
   - 지도에 주황색 마커 표시 ✅
   - 좌표: lat 12.2807814, lng 109.2004504 (나트랑 시내)

3. **경로 표시 테스트**
   - 두 장소 간 파란색 폴리라인 연결 ✅
   - 지도 자동 줌 (모든 마커 포함) ✅

### 데이터 현황
| 테이블 | 총 개수 | 좌표 있음 | 좌표 없음 | google_place_id |
|--------|---------|-----------|-----------|-----------------|
| places | 128 | 128 | 0 | 128 |
| accommodations | 40 | 40 | 0 | 1 |

### 관련 컴포넌트
- `src/components/google-maps/ItineraryMap.tsx`: 일정 지도 컴포넌트
- `src/lib/supabase/hooks.ts`: `useItineraryItems` 훅 (좌표 데이터 fetch)
- `src/data/itinerary.ts`: `addItemToDay` 함수 (좌표 저장)
- `src/app/itinerary/page.tsx`: 일정 페이지

### 기술 스택
- Google Places API (Text Search, Place Details)
- Supabase (PostgreSQL)
- Google Maps JavaScript API
- Next.js API Routes

---

## 이전 작업 내역

### 일정 만들기 링크 수정
- 네비게이션 바의 "일정 만들기" 링크가 `/itinerary`로 올바르게 연결되도록 수정

### 이미지 갤러리 라이트박스 추가
- 숙소/맛집/볼거리/액티비티/쇼핑 페이지에 이미지 클릭 시 라이트박스 표시 기능 추가
