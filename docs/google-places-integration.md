# Google Places API 연동 기획서

## 1. 개요

### 목표
- 관리자 페이지에서 Google Places API로 장소 검색 및 자동 입력
- 사용자 페이지에서 상세 정보 표시 및 Google 링크 제공

### API 사용 범위
- **Places API**: 장소 검색, 상세 정보, 사진
- **Maps JavaScript API**: 지도 표시, 마커

---

## 2. 기능 명세

### 2.1 관리자 기능

#### 장소 검색 모달
```
┌─────────────────────────────────────────────────────────┐
│  🔍 Google Places 검색                              [X] │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────┐        │
│  │ 🔍 나트랑 씨푸드 레스토랑...                │ [검색] │
│  └─────────────────────────────────────────────┘        │
│                                                         │
│  📍 검색 결과 (5건)                                     │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🖼️ │ Lac Canh Restaurant                        │   │
│  │    │ ⭐ 4.2 (1,234) · 베트남 음식               │   │
│  │    │ 📍 44 Nguyen Binh Khiem, Nha Trang        │   │
│  │    │                                    [선택] │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🖼️ │ Lanterns Restaurant                        │   │
│  │    │ ⭐ 4.5 (892) · 베트남 음식                 │   │
│  │    │ 📍 34/6 Nguyen Thien Thuat, Nha Trang     │   │
│  │    │                                    [선택] │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### 자동 입력 필드 매핑
| Google Places 필드 | 앱 필드 | 자동입력 |
|-------------------|---------|----------|
| `name` | 이름 (영문) | ✅ |
| `name` | 이름 (한글) | ⚠️ 수동 입력 필요 |
| `formatted_address` | 주소 | ✅ |
| `geometry.location` | 위도/경도 | ✅ |
| `rating` | 평점 | ✅ |
| `user_ratings_total` | 리뷰 수 | ✅ |
| `photos` | 대표 이미지 | ✅ (URL) |
| `opening_hours` | 영업시간 | ✅ |
| `formatted_phone_number` | 전화번호 | ✅ |
| `website` | 웹사이트 | ✅ |
| `place_id` | Google Place ID | ✅ (신규 필드) |
| `types` | 카테고리 | ✅ (참고용) |

#### 관리자 폼 UI 변경
```
┌─────────────────────────────────────────────────────────┐
│  새 장소 추가                                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [🔍 Google Places에서 검색]  ← 버튼 추가              │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  기본 정보                                              │
│  ┌─────────────────────┐ ┌─────────────────────┐       │
│  │ 이름 (영문)         │ │ 이름 (한글)         │       │
│  │ Lac Canh Restaurant │ │ 락칸 레스토랑       │       │
│  └─────────────────────┘ └─────────────────────┘       │
│                            ↑ 수동 입력                  │
│  ┌─────────────────────────────────────────────┐       │
│  │ 주소                                        │       │
│  │ 44 Nguyen Binh Khiem, Nha Trang, Vietnam   │       │
│  └─────────────────────────────────────────────┘       │
│                                                         │
│  위치 정보                                              │
│  ┌──────────────┐ ┌──────────────┐                     │
│  │ 위도         │ │ 경도         │                     │
│  │ 12.2456      │ │ 109.1889     │                     │
│  └──────────────┘ └──────────────┘                     │
│                                                         │
│  ┌─────────────────────────────────────────────┐       │
│  │ 🗺️ [지도 미리보기]                          │       │
│  │                   📍                        │       │
│  │                                             │       │
│  └─────────────────────────────────────────────┘       │
│                                                         │
│  Google 연동 정보                                       │
│  ┌─────────────────────────────────────────────┐       │
│  │ Place ID: ChIJxxxxxxxxxxxxxxx               │       │
│  └─────────────────────────────────────────────┘       │
│  ⭐ 4.2 (1,234 리뷰) · 마지막 동기화: 2024-01-04      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### 2.2 사용자 페이지 기능

#### 장소 상세 카드
```
┌─────────────────────────────────────────────────────────┐
│  🖼️🖼️🖼️ [이미지 갤러리]                               │
├─────────────────────────────────────────────────────────┤
│  Lac Canh Restaurant                                    │
│  락칸 레스토랑                                          │
│                                                         │
│  ⭐ 4.2 (1,234 리뷰)                                   │
│                                                         │
│  📍 44 Nguyen Binh Khiem, Nha Trang                    │
│  🕐 11:00 - 22:00                                       │
│  📞 +84 258 382 1391                                    │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  베트남 나트랑의 유명한 해산물 BBQ 레스토랑...         │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  [🗺️ Google 지도]  [🔍 Google 검색]  [📝 리뷰 보기]   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### Google 링크 생성 규칙
```typescript
// Google Maps 링크
`https://www.google.com/maps/place/?q=place_id:${placeId}`

// Google 검색 링크
`https://www.google.com/search?q=${encodeURIComponent(placeName + ' Nha Trang')}`

// Google Maps 길찾기
`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${placeId}`
```

---

## 3. 데이터베이스 스키마 변경

### places 테이블 추가 필드
```sql
ALTER TABLE places ADD COLUMN IF NOT EXISTS google_place_id TEXT;
ALTER TABLE places ADD COLUMN IF NOT EXISTS google_rating DECIMAL(2,1);
ALTER TABLE places ADD COLUMN IF NOT EXISTS google_reviews_count INTEGER;
ALTER TABLE places ADD COLUMN IF NOT EXISTS google_photos JSONB;
ALTER TABLE places ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE places ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE places ADD COLUMN IF NOT EXISTS opening_hours JSONB;
ALTER TABLE places ADD COLUMN IF NOT EXISTS google_synced_at TIMESTAMPTZ;
```

### accommodations 테이블 추가 필드
```sql
ALTER TABLE accommodations ADD COLUMN IF NOT EXISTS google_place_id TEXT;
ALTER TABLE accommodations ADD COLUMN IF NOT EXISTS google_rating DECIMAL(2,1);
ALTER TABLE accommodations ADD COLUMN IF NOT EXISTS google_reviews_count INTEGER;
ALTER TABLE accommodations ADD COLUMN IF NOT EXISTS google_photos JSONB;
ALTER TABLE accommodations ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE accommodations ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE accommodations ADD COLUMN IF NOT EXISTS opening_hours JSONB;
ALTER TABLE accommodations ADD COLUMN IF NOT EXISTS google_synced_at TIMESTAMPTZ;
```

---

## 4. API 구조

### 4.1 백엔드 API Routes

```
/api/google-places/
├── search          POST  - 장소 검색
├── details/[id]    GET   - 장소 상세 정보
└── photo           GET   - 사진 프록시 (CORS 우회)
```

#### POST /api/google-places/search
```typescript
// Request
{
  query: string;        // 검색어
  type?: string;        // restaurant, lodging, tourist_attraction 등
  location?: {          // 검색 중심점 (나트랑 기본)
    lat: number;
    lng: number;
  };
}

// Response
{
  results: [
    {
      place_id: string;
      name: string;
      formatted_address: string;
      geometry: { location: { lat, lng } };
      rating?: number;
      user_ratings_total?: number;
      photos?: [{ photo_reference: string }];
      types: string[];
      opening_hours?: { open_now: boolean };
    }
  ];
  status: string;
}
```

#### GET /api/google-places/details/[placeId]
```typescript
// Response
{
  result: {
    place_id: string;
    name: string;
    formatted_address: string;
    formatted_phone_number?: string;
    website?: string;
    geometry: { location: { lat, lng } };
    rating?: number;
    user_ratings_total?: number;
    photos?: [{ photo_reference, height, width }];
    opening_hours?: {
      weekday_text: string[];
      periods: [...];
    };
    reviews?: [...];
    types: string[];
  };
}
```

### 4.2 사진 URL 생성
```typescript
// Google Places Photo API (프록시 필요)
`/api/google-places/photo?reference=${photoReference}&maxwidth=400`

// 내부적으로 호출
`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${ref}&key=${API_KEY}`
```

---

## 5. 컴포넌트 구조

```
src/components/
├── google-places/
│   ├── PlaceSearchModal.tsx      # 검색 모달
│   ├── PlaceSearchInput.tsx      # 검색 입력
│   ├── PlaceSearchResults.tsx    # 검색 결과 목록
│   ├── PlaceResultCard.tsx       # 개별 결과 카드
│   ├── PlacePreviewMap.tsx       # 지도 미리보기
│   └── GoogleMapsScript.tsx      # Maps JS 로더
│
├── place-detail/
│   ├── PlaceDetailCard.tsx       # 사용자용 상세 카드
│   ├── PlaceGallery.tsx          # 이미지 갤러리
│   ├── PlaceMap.tsx              # 임베디드 지도
│   └── PlaceActions.tsx          # 외부 링크 버튼들
```

---

## 6. 구현 단계

### Phase 1: 기반 구축 (Day 1)
- [ ] API Route 생성 (`/api/google-places/*`)
- [ ] Google Maps Script 로더 컴포넌트
- [ ] 환경 변수 설정

### Phase 2: 관리자 검색 기능 (Day 2)
- [ ] PlaceSearchModal 컴포넌트
- [ ] 검색 결과 표시
- [ ] 장소 선택 → 폼 자동 입력

### Phase 3: 관리자 폼 연동 (Day 3)
- [ ] places/new, places/[id] 페이지 수정
- [ ] accommodations/new 페이지 수정
- [ ] 지도 미리보기 추가

### Phase 4: DB 스키마 & 저장 (Day 4)
- [ ] Supabase 스키마 마이그레이션
- [ ] 타입 정의 업데이트
- [ ] 저장/수정 로직 업데이트

### Phase 5: 사용자 페이지 (Day 5)
- [ ] 상세 카드 컴포넌트
- [ ] Google 링크 버튼들
- [ ] 이미지 갤러리

### Phase 6: 테스트 & 배포 (Day 6)
- [ ] API 테스트
- [ ] UI/UX 테스트
- [ ] Vercel 환경 변수 설정
- [ ] 배포

---

## 7. 환경 변수

```env
# .env.local
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyDqqPVGcyCxQGPWO1jDLwZ0uWoRIPt4c1Y
GOOGLE_PLACES_API_KEY=AIzaSyDqqPVGcyCxQGPWO1jDLwZ0uWoRIPt4c1Y
```

---

## 8. 비용 예측

### Google Places API 무료 티어 ($200/월)
| API | 가격 | 무료 호출 수 |
|-----|------|-------------|
| Place Search | $17/1000 | ~11,700회 |
| Place Details | $17/1000 | ~11,700회 |
| Place Photos | $7/1000 | ~28,500회 |

### 예상 사용량 (소규모)
- 관리자 검색: ~100회/월
- 상세 조회: ~200회/월
- 사진: ~500회/월
- **총 비용: $0** (무료 범위 내)

---

## 9. 보안 고려사항

1. **API 키 보호**
   - 클라이언트: Maps JavaScript API만 노출
   - 서버: Places API 키는 서버 사이드에서만 사용

2. **API 키 제한 설정** (Google Cloud Console)
   - HTTP 리퍼러 제한: `*.vercel.app/*`, `localhost:*`
   - API 제한: Maps JavaScript API, Places API만 허용

3. **Rate Limiting**
   - API Route에 요청 제한 구현

---

## 10. 일정짜기 지도 연동

### 기능 개요
- 일정별 장소를 지도에 마커로 표시
- 장소 간 경로 연결 (Polyline 또는 Directions API)
- 이동 시간/거리 표시

### 와이어프레임

```
┌─────────────────────────────────────────────────────────────────────┐
│  📅 Day 1 - 1월 15일 (수)                              [지도 보기] │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─ 일정 목록 ──────────┐  ┌─ 지도 ─────────────────────────────┐ │
│  │                      │  │                                     │ │
│  │ ① 09:00             │  │    ①────────────②                  │ │
│  │ 🏨 쉐라톤 호텔       │  │     \          /                   │ │
│  │    체크아웃          │  │      \   30분 /                    │ │
│  │         ↓ 🚗 15분    │  │       \      /                     │ │
│  │                      │  │        \    /                      │ │
│  │ ② 10:00             │  │         \  /                       │ │
│  │ 📸 포나가르 타워     │  │          ③                        │ │
│  │    2시간 관광        │  │           \                        │ │
│  │         ↓ 🚗 10분    │  │            \ 15분                  │ │
│  │                      │  │             \                      │ │
│  │ ③ 12:30             │  │              ④                     │ │
│  │ 🍜 락칸 레스토랑     │  │                                     │ │
│  │    점심 식사         │  │  [━━━━━━━━━━━] 축소/확대           │ │
│  │         ↓ 🚶 5분     │  │                                     │ │
│  │                      │  │  📍 ① 쉐라톤    📍 ② 포나가르     │ │
│  │ ④ 14:00             │  │  📍 ③ 락칸      📍 ④ 담 마켓      │ │
│  │ 🛍️ 담 마켓          │  │                                     │ │
│  │    쇼핑              │  │  총 이동: 🚗 25분 + 🚶 5분          │ │
│  │                      │  │  총 거리: 8.5km                     │ │
│  └──────────────────────┘  └─────────────────────────────────────┘ │
│                                                                     │
│  [+ 장소 추가]                              [📥 일정 저장/공유]    │
└─────────────────────────────────────────────────────────────────────┘
```

### 지도 마커 스타일
```
① ② ③ ④ ...  숫자 순서 마커
🏨 숙소: 파란색
🍜 맛집: 주황색
📸 볼거리: 초록색
🎯 액티비티: 보라색
🛍️ 쇼핑: 분홍색
```

### 경로 표시 옵션

#### Option A: 직선 연결 (무료)
```typescript
// Polyline으로 직선 연결
new google.maps.Polyline({
  path: [point1, point2, point3],
  strokeColor: '#3B82F6',
  strokeWeight: 3,
  strokeOpacity: 0.8,
});
```
- 장점: 무료, 빠름
- 단점: 실제 경로 아님

#### Option B: Directions API (유료)
```typescript
// 실제 도로 경로
directionsService.route({
  origin: point1,
  destination: point3,
  waypoints: [{ location: point2 }],
  travelMode: 'DRIVING',
});
```
- 장점: 실제 경로, 정확한 시간
- 단점: API 호출 비용 ($5/1000건)

### 추천: 하이브리드 방식
```
1. 기본: 직선 연결 (Polyline) - 무료
2. 사용자 요청 시: Directions API - 정확한 경로
   [🗺️ 실제 경로 보기] 버튼 클릭 시만 호출
```

### 이동 시간 계산
```typescript
// 현재 maps.ts의 estimateTravelTime 활용
import { getTravelTimeBetweenItems } from '@/lib/maps';

// 예시 결과
{
  driving: { duration: "15분", distance: "3.2km" },
  walking: { duration: "45분", distance: "3.0km" },
}
```

### 컴포넌트 구조
```
src/components/itinerary/
├── ItineraryMap.tsx           # 메인 지도 컴포넌트
├── ItineraryMarker.tsx        # 커스텀 마커
├── ItineraryRoute.tsx         # 경로 라인
├── ItineraryLegend.tsx        # 범례
├── TravelTimeInfo.tsx         # 이동 시간 표시
└── ItineraryMapToggle.tsx     # 지도/목록 토글
```

### 모바일 뷰
```
┌─────────────────────────┐
│ Day 1 - 1월 15일    [≡] │
├─────────────────────────┤
│  ┌───────────────────┐  │
│  │                   │  │
│  │    ①──②──③──④   │  │
│  │      지도         │  │
│  │                   │  │
│  └───────────────────┘  │
│                         │
│  [목록 보기] [지도 보기] │  ← 탭 전환
│                         │
│ ┌─────────────────────┐ │
│ │ ① 09:00 쉐라톤     │ │
│ │      ↓ 🚗 15분     │ │
│ │ ② 10:00 포나가르   │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

### 구현 단계 추가

#### Phase 7: 일정 지도 연동 (Day 7-8)
- [ ] ItineraryMap 컴포넌트
- [ ] 커스텀 숫자 마커
- [ ] Polyline 경로 연결
- [ ] 이동 시간 표시
- [ ] 모바일 반응형

#### Phase 8: 고급 기능 (Optional)
- [ ] Directions API 연동 (실제 경로)
- [ ] 드래그로 순서 변경 시 경로 업데이트
- [ ] 일정 최적화 제안 (거리순 정렬)

---

## 11. 일정 저장/관리 기능

### 기능 개요 (간소화)
- Supabase에 일정 저장
- 전체 일정 목록 공개
- 등록/수정/삭제 시 비밀번호 검증
- 보기만 허용 (복제 없음)

### 플로우
```
[일정 목록] ────────────────────────────────────────┐
     │                                              │
     ▼                                              ▼
[일정 보기] (누구나)              [새 일정 등록] (비밀번호)
     │                                    │
     │                                    ▼
     │                           ┌─ 비밀번호 입력 ─┐
     │                           │ ************   │
     │                           │    [확인]      │
     │                           └────────────────┘
     │                                    │
     ▼                                    ▼
[상세 보기 + 지도]              [일정 편집/저장]
```

### 와이어프레임

#### 전체 일정 목록 (`/itinerary`)
```
┌─────────────────────────────────────────────────────────┐
│  📋 나트랑 여행 일정                   [+ 새 일정 등록] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ 🏝️ 나트랑 3박 4일 가족여행                        │ │
│  │ 📅 2024-03-15 ~ 2024-03-18 (4일)                 │ │
│  │ 📍 12개 장소                                      │ │
│  │                                          [보기]   │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ 🌴 신혼여행 5박 6일 코스                          │ │
│  │ 📅 2024-05-01 ~ 2024-05-06 (6일)                 │ │
│  │ 📍 18개 장소                                      │ │
│  │                                          [보기]   │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ 🎯 액티비티 중심 3일 코스                         │ │
│  │ 📅 2024-06-10 ~ 2024-06-12 (3일)                 │ │
│  │ 📍 8개 장소                                       │ │
│  │                                          [보기]   │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### 비밀번호 입력 모달 (등록/수정/삭제 시)
```
┌─────────────────────────────────────────────────────────┐
│  🔐 관리자 인증                                     [X] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  일정을 등록/수정하려면 비밀번호를 입력하세요.         │
│                                                         │
│  비밀번호                                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │ ••••••••                                        │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ⚠️ 비밀번호가 틀렸습니다.  (에러 시 표시)             │
│                                                         │
│                          [취소]  [🔓 확인]              │
└─────────────────────────────────────────────────────────┘
```

#### 일정 저장 폼 (비밀번호 인증 후)
```
┌─────────────────────────────────────────────────────────┐
│  📝 일정 등록                                       [X] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  일정 이름 *                                            │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 나트랑 3박 4일 가족여행                         │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  여행 기간 *                                            │
│  ┌──────────────┐  ~  ┌──────────────┐                 │
│  │ 2024-03-15   │     │ 2024-03-18   │                 │
│  └──────────────┘     └──────────────┘                 │
│                                                         │
│  설명 (선택)                                            │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 아이들과 함께하는 첫 해외여행 코스입니다.       │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  📅 Day 1 - 3월 15일                    [+ 장소 추가]  │
│  ┌───────────────────────────────────────────────────┐ │
│  │ ① 14:00 깜란 국제공항                    [x 삭제] │ │
│  │ ② 15:00 쉐라톤 호텔                      [x 삭제] │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  📅 Day 2 - 3월 16일                    [+ 장소 추가]  │
│  ┌───────────────────────────────────────────────────┐ │
│  │ (장소를 추가해주세요)                             │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│                          [취소]  [💾 저장]              │
└─────────────────────────────────────────────────────────┘
```

#### 일정 상세 보기 (`/itinerary/[id]`)
```
┌─────────────────────────────────────────────────────────┐
│  🏝️ 나트랑 3박 4일 가족여행                            │
│  📅 2024-03-15 ~ 2024-03-18                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  아이들과 함께하는 첫 해외여행 코스입니다.             │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  ┌─ 일정 ───────────────┐  ┌─ 지도 ─────────────────┐  │
│  │                      │  │                        │  │
│  │ Day 1 - 3월 15일     │  │   ①───②              │  │
│  │ ① 14:00 공항 도착    │  │        \              │  │
│  │      ↓ 🚗 30분       │  │         ③───④        │  │
│  │ ② 15:00 호텔 체크인  │  │                        │  │
│  │      ↓ 🚶 10분       │  │  총 이동: 45분         │  │
│  │ ③ 18:00 비치 산책    │  │  총 거리: 12km         │  │
│  │      ↓ 🚗 5분        │  │                        │  │
│  │ ④ 19:00 저녁 식사    │  │                        │  │
│  │                      │  │                        │  │
│  └──────────────────────┘  └────────────────────────┘  │
│                                                         │
│                [◀ 목록으로]  [✏️ 수정] [🗑️ 삭제]       │
│                              ↑ 비밀번호 필요            │
└─────────────────────────────────────────────────────────┘
```

### 데이터베이스 스키마

#### itineraries 테이블 (Supabase)
```sql
CREATE TABLE itineraries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- 기본 정보
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,

  -- 일정 데이터 (JSON)
  days JSONB NOT NULL,
  -- days 구조:
  -- [
  --   {
  --     "dayNumber": 1,
  --     "date": "2024-03-15",
  --     "items": [
  --       { "id": "...", "time": "14:00", "placeId": "...", "placeName": "...", "category": "..." }
  --     ]
  --   }
  -- ]

  -- 메타 정보
  total_places INTEGER DEFAULT 0,
  thumbnail TEXT,

  -- 타임스탬프
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: 누구나 읽기 가능
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read" ON itineraries FOR SELECT USING (true);
CREATE POLICY "Anyone can insert" ON itineraries FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update" ON itineraries FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete" ON itineraries FOR DELETE USING (true);
```

#### 비밀번호 저장
```typescript
// 환경 변수로 관리
// .env.local
ITINERARY_ADMIN_PASSWORD=your_secret_password
```

### API 구조

```
/api/itineraries/
├── GET     /              - 전체 일정 목록
├── GET     /[id]          - 일정 상세
├── POST    /              - 새 일정 저장 (비밀번호 필요)
├── PUT     /[id]          - 일정 수정 (비밀번호 필요)
├── DELETE  /[id]          - 일정 삭제 (비밀번호 필요)
└── POST    /verify        - 비밀번호 검증
```

### 비밀번호 검증 로직
```typescript
// /api/itineraries/verify
export async function POST(request: Request) {
  const { password } = await request.json();
  const adminPassword = process.env.ITINERARY_ADMIN_PASSWORD;

  if (password === adminPassword) {
    // 세션 토큰 발급 (1시간 유효)
    const token = generateToken();
    return Response.json({ success: true, token });
  }

  return Response.json({ success: false }, { status: 401 });
}

// 등록/수정/삭제 API에서 토큰 검증
const token = request.headers.get('Authorization');
if (!verifyToken(token)) {
  return Response.json({ error: 'Unauthorized' }, { status: 401 });
}
```

### 컴포넌트 구조

```
src/components/itinerary/
├── ItineraryList.tsx         # 전체 일정 목록
├── ItineraryCard.tsx         # 일정 카드
├── ItineraryDetail.tsx       # 일정 상세 + 지도
├── ItineraryForm.tsx         # 일정 등록/수정 폼
├── PasswordModal.tsx         # 비밀번호 입력 모달
└── ItineraryDayEditor.tsx    # 일별 장소 편집

src/app/itinerary/
├── page.tsx                  # 전체 일정 목록 + 만들기
└── [id]/page.tsx             # 일정 상세 보기
```

### 구현 단계

#### Phase 9: 일정 저장 기본 (Day 9)
- [ ] Supabase 스키마 생성
- [ ] API Routes 구현 (CRUD)
- [ ] 비밀번호 검증 로직

#### Phase 10: UI 구현 (Day 10)
- [ ] 전체 일정 목록 페이지
- [ ] 일정 상세 페이지 (지도 포함)
- [ ] 비밀번호 모달

#### Phase 11: 일정 편집 (Day 11)
- [ ] 일정 등록/수정 폼
- [ ] 장소 추가/삭제
- [ ] 드래그 순서 변경

---

## 12. 와이어프레임 요약

### 관리자 플로우
```
[새 장소 추가] → [Google Places 검색 클릭]
     ↓
[검색 모달 열림] → [검색어 입력] → [결과 표시]
     ↓
[장소 선택] → [폼 필드 자동 입력] → [한글 이름 수동 입력]
     ↓
[지도 미리보기 확인] → [저장]
```

### 사용자 플로우
```
[장소 목록] → [장소 클릭] → [상세 페이지]
     ↓
[정보 확인] → [Google 지도/검색 링크 클릭] → [외부 이동]
```
