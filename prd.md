# 나트랑 여행 플래너 (Nha Trang Travel Planner)

## 📋 프로젝트 개요

나트랑 여행을 계획하는 사용자를 위한 종합 여행 플래너 웹사이트.
맛집, 숙소, 볼거리, 액티비티, 쇼핑 정보를 제공하고, 
사용자가 직접 일정을 생성/관리할 수 있는 기능 제공.

---

## 🎯 핵심 기능

### PART 1: 정보 탐색 (Read-Only)

#### 1.1 숙소 정보 (`/accommodation`)
- 지역별 분류 (깜란, 시내, 빈펄, 혼총, 닌반베이, 빈하이)
- 목적별 분류 (가족, 커플/허니문, 올인클루시브, 가성비)
- 호텔/리조트 상세 정보 (가격, 특징, 위치)
- 지도에 위치 표시
- 필터 (가격대, 평점, 시설)

#### 1.2 맛집 정보 (`/restaurants`)
- 카테고리별 분류:
  - 한식 (15곳)
  - 베트남식 (13곳)
  - 해산물/씨푸드 (6곳)
  - 카페/베이커리 (11곳)
  - 바/클럽 (5곳)
  - 양식/기타 (10곳)
  - 일식 (4곳)
  - 기타 (5곳)
- 상세 정보 (주소, 전화, 영업시간, 가격대, 추천메뉴, 꿀팁)
- 지도 연동

#### 1.3 볼거리 정보 (`/attractions`)
- 카테고리별 분류:
  - 섬/해변 (7곳)
  - 자연/폭포 (4곳)
  - 문화/역사 (11곳)
  - 테마파크/리조트 (6곳)
- 상세 정보 (위치, 운영시간, 입장료, 소요시간, 팁)

#### 1.4 액티비티 정보 (`/activities`)
- 카테고리별 분류:
  - 수상 액티비티 (8종)
  - 스파/힐링 (4종)
  - 근교 투어 (5종)
  - 파티/나이트라이프 (4종)
- 상세 정보 (가격, 소요시간, 설명)

#### 1.5 쇼핑 정보 (`/shopping`)
- 카테고리별 분류:
  - 대형 마트 (3곳)
  - 쇼핑몰 (4곳)
  - 전통시장 (2곳)
  - 야시장 (1곳)
- 추천 쇼핑 품목 리스트
- 쇼핑 팁

---

### PART 2: 일정 관리 (CRUD)

#### 2.1 여행 일정 생성 (`/planner`)
- 여행 기간 설정 (출발일 ~ 도착일)
- 일자별 일정 생성

#### 2.2 항공권 등록 (`/planner/flights`)
- 출발/도착 정보 수동 입력
- (선택) 외부 항공권 검색 API 연동 (Skyscanner, 네이버 항공)
- 일정에 자동 반영

#### 2.3 숙소 일정 등록 (`/planner/hotels`)
- 숙소 정보 DB에서 선택 또는 직접 입력
- 체크인/체크아웃 날짜 설정
- 일정에 자동 반영

#### 2.4 일정 등록 (`/planner/schedule`)
- 날짜별 시간대 블록 설정
- 장소 선택 (맛집/볼거리/액티비티/쇼핑 DB 연동)
- 이동시간 자동 계산 (Google Maps API)
- 소요시간 입력
- 드래그앤드롭 순서 변경

#### 2.5 일정표 완성 (`/planner/export`)
- 전체 일정표 미리보기
- PDF/이미지 다운로드
- 공유 링크 생성

---

## 🗂️ 데이터 구조

### 장소 (Place)
```typescript
interface Place {
  id: string;
  type: 'restaurant' | 'attraction' | 'activity' | 'shopping' | 'accommodation';
  category: string;
  name: string;
  nameKo: string;
  address: string;
  phone?: string;
  hours?: string;
  rating?: number;
  priceRange?: string;
  description: string;
  tips?: string;
  recommendedMenu?: string[];
  coordinates: { lat: number; lng: number };
  images?: string[];
  duration?: string; // 소요시간
}
```

### 일정 (Itinerary)
```typescript
interface Itinerary {
  id: string;
  userId: string;
  title: string;
  startDate: Date;
  endDate: Date;
  flights: Flight[];
  hotels: HotelBooking[];
  schedules: DaySchedule[];
  createdAt: Date;
  updatedAt: Date;
}

interface DaySchedule {
  date: Date;
  items: ScheduleItem[];
}

interface ScheduleItem {
  id: string;
  placeId?: string;
  customName?: string;
  startTime: string;
  endTime: string;
  duration: number; // minutes
  travelTime?: number; // 이전 장소에서 이동시간
  notes?: string;
}
```

---

## 🛠️ 기술 스택

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + shadcn/ui
- **State:** Zustand
- **Map:** Leaflet / Google Maps
- **Drag & Drop:** @dnd-kit/sortable

### Backend
- **Runtime:** Next.js API Routes
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma
- **Auth:** NextAuth.js (Google/Kakao 소셜 로그인)

### 외부 API
- **지도/경로:** Google Maps Distance Matrix API
- **항공권 검색:** (선택) Skyscanner API
- **이미지 저장:** Cloudinary 또는 Supabase Storage

---

## 📄 페이지 구조

```
/
├── (home)           # 랜딩 페이지
├── accommodation/   # 숙소 리스트
│   └── [id]         # 숙소 상세
├── restaurants/     # 맛집 리스트
│   └── [id]         # 맛집 상세
├── attractions/     # 볼거리 리스트
│   └── [id]         # 볼거리 상세
├── activities/      # 액티비티 리스트
│   └── [id]         # 액티비티 상세
├── shopping/        # 쇼핑 리스트
│   └── [id]         # 쇼핑 상세
├── planner/         # 일정 플래너 (인증 필요)
│   ├── new          # 새 일정 생성
│   ├── [id]         # 일정 상세/편집
│   └── [id]/export  # 일정표 내보내기
├── auth/            # 로그인/회원가입
└── api/             # API Routes
```

---

## 🎨 디자인 컨셉

- **테마:** 트로피컬 & 비치 바이브
- **주요 컬러:**
  - Primary: `#0891B2` (시안) - 바다
  - Secondary: `#F59E0B` (앰버) - 일몰
  - Accent: `#10B981` (에메랄드) - 열대우림
- **폰트:** 
  - 한글: Pretendard
  - 영문: Plus Jakarta Sans
- **특징:**
  - 카드 기반 UI
  - 지도 중심 인터랙션
  - 반응형 (모바일 우선)

---

## 📊 MVP 우선순위

### Phase 1 (MVP)
1. ✅ 정보 탐색 페이지 (숙소/맛집/볼거리/액티비티/쇼핑)
2. ✅ 지도 연동
3. ✅ 카테고리 필터링
4. ✅ 검색 기능

### Phase 2
1. 🔲 사용자 인증 (소셜 로그인)
2. 🔲 일정 생성/수정
3. 🔲 장소 추가 기능

### Phase 3
1. 🔲 이동시간 자동 계산
2. 🔲 일정표 PDF 내보내기
3. 🔲 공유 기능
4. 🔲 항공권 검색 연동

---

## 📁 콘텐츠 데이터

### 보유 데이터 (문서에서 추출)
| 카테고리 | 개수 |
|---------|------|
| 맛집 | 69곳 |
| 볼거리 | 28곳 |
| 액티비티 | 21종 |
| 숙소 (호텔/리조트) | 30+ |
| 쇼핑 | 10곳 |
| 스파/마사지 | 10+ |

---

## 🚀 Claude Code 개발 워크플로우

1. **TaskMaster로 태스크 관리**
   - 이 PRD를 기반으로 태스크 자동 생성
   - 의존성 관리

2. **Context7 MCP로 문서 참조**
   - Next.js, Tailwind, Prisma 최신 문서

3. **Puppeteer MCP로 결과 확인**
   - 스크린샷 캡처 → 디자인 반복 개선

4. **PostgreSQL MCP로 DB 관리**
   - 스키마 생성/마이그레이션
   - 데이터 시딩

5. **GitHub MCP로 버전 관리**
   - 커밋/푸시 자동화
   - PR 생성
