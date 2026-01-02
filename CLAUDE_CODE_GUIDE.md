# Claude Code CLI + MCP 개발 가이드

## 🚀 Quick Start

### 1. 프로젝트 초기화

```bash
# 프로젝트 폴더 생성
mkdir nhatrang-travel && cd nhatrang-travel

# Claude Code 시작
claude

# 프롬프트
> 이 PRD를 기반으로 Next.js 14 프로젝트를 초기화해줘.
> Tailwind CSS, TypeScript, App Router 사용.
> shadcn/ui 설치하고 기본 레이아웃 만들어줘.
```

---

## 📁 MCP 서버 설정

### `~/.claude/mcp_servers.json`

```json
{
  "mcpServers": {
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    },
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-puppeteer"]
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "postgresql://user:password@localhost:5432/nhatrang_travel"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/nhatrang-travel"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "ghp_xxxxxxxxxxxx"
      }
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "context7-mcp"]
    },
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-brave-search"],
      "env": {
        "BRAVE_API_KEY": "your-api-key"
      }
    }
  }
}
```

---

## 📂 프로젝트 컨텍스트 파일

### `CLAUDE.md` (프로젝트 루트에 생성)

```markdown
# 나트랑 여행 플래너 프로젝트

## 기술 스택
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- PostgreSQL + Prisma
- Zustand (상태관리)
- Leaflet (지도)

## 디자인 시스템
- Primary: #0891B2 (cyan-600)
- Secondary: #F59E0B (amber-500)
- Accent: #10B981 (emerald-500)
- 폰트: Pretendard (한글), Plus Jakarta Sans (영문)

## 개발 규칙
1. 컴포넌트는 src/components/ 에 작성
2. 페이지별 컴포넌트는 app/[route]/_components/ 에 작성
3. API는 app/api/ 에 작성
4. 공용 타입은 src/types/ 에 작성
5. 유틸리티는 src/lib/ 에 작성

## MCP 사용 규칙
- 디자인 변경 후 Puppeteer로 스크린샷 확인
- DB 스키마 변경 시 Prisma migration 실행
- 커밋 전 린트 체크

## 데이터 구조
- 장소 데이터: src/data/places.json
- 숙소 데이터: src/data/accommodations.json
```

---

## 🛠️ 개발 워크플로우

### Step 1: 데이터 시딩

```bash
claude

> 업로드한 나트랑 문서들을 파싱해서 JSON 데이터 파일로 변환해줘.
> 맛집, 볼거리, 액티비티, 숙소, 쇼핑 각각 별도 파일로.
> 좌표는 주소 기반으로 대략적으로 추정해서 넣어줘.
```

### Step 2: DB 스키마 생성

```bash
> Prisma 스키마 작성하고 PostgreSQL에 마이그레이션 해줘.
> Place, Accommodation, Itinerary, User 테이블 필요해.
> MCP PostgreSQL 사용해서 확인해줘.
```

### Step 3: 정보 페이지 구현

```bash
> 맛집 리스트 페이지 만들어줘.
> 카테고리 필터, 검색, 카드 그리드 레이아웃.
> Puppeteer로 스크린샷 찍어서 확인하고 3회 이상 개선해줘.
```

### Step 4: 지도 연동

```bash
> Leaflet으로 지도 컴포넌트 만들어줘.
> 맛집 페이지에 통합하고 마커 클릭 시 상세 정보 표시.
> Context7로 Leaflet 최신 문서 참조해줘.
```

### Step 5: 일정 플래너 구현

```bash
> 일정 플래너 페이지 만들어줘.
> 날짜 선택 → 타임라인 UI → 장소 추가 (드래그앤드롭)
> 이동시간은 직선거리 기반으로 계산해줘.
```

---

## 📋 커스텀 슬래시 커맨드

### `.claude/commands/design-review.md`

```markdown
# Design Review

현재 개발 중인 페이지를 Puppeteer로 스크린샷 찍고 분석해줘.

1. `npm run dev` 실행 확인
2. http://localhost:3000/{현재페이지} 스크린샷
3. 디자인 개선점 3가지 제안
4. 즉시 수정 적용
5. 다시 스크린샷으로 확인
```

### `.claude/commands/add-place.md`

```markdown
# Add New Place

새로운 장소를 데이터베이스에 추가해줘.

장소 정보: $ARGUMENTS

1. 카테고리 자동 분류
2. 주소로 좌표 추정
3. PostgreSQL MCP로 INSERT
4. 캐시 무효화
```

### `.claude/commands/deploy.md`

```markdown
# Deploy to Vercel

1. 린트 및 타입 체크
2. 빌드 테스트
3. GitHub에 커밋/푸시
4. Vercel 자동 배포 트리거
```

---

## 🎯 추천 프롬프트 예시

### 프로젝트 시작
```
Next.js 14 프로젝트 초기화해줘.
- App Router 사용
- TypeScript strict mode
- Tailwind CSS + shadcn/ui
- Pretendard 폰트 설정
- 기본 레이아웃 (헤더, 사이드바, 푸터)
```

### 페이지 개발
```
맛집 상세 페이지 만들어줘.
- 히어로 이미지
- 기본 정보 (주소, 전화, 영업시간)
- 추천 메뉴 리스트
- 지도 위치
- 리뷰/꿀팁 섹션
- "일정에 추가" 버튼
```

### 디자인 개선
```
현재 페이지 Puppeteer로 스크린샷 찍어줘.
트로피컬 바이브로 개선해줘:
- 그라데이션 배경
- 카드에 그림자 강화
- 아이콘 추가
- 마이크로 애니메이션
다시 스크린샷으로 확인하고 피드백 반영해줘.
```

### DB 작업
```
PostgreSQL MCP로 places 테이블 조회해줘.
category='restaurant' 필터로.
```

---

## 📦 의존성 패키지

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@prisma/client": "^5.0.0",
    "zustand": "^4.0.0",
    "leaflet": "^1.9.0",
    "react-leaflet": "^4.0.0",
    "@dnd-kit/core": "^6.0.0",
    "@dnd-kit/sortable": "^8.0.0",
    "next-auth": "^4.0.0",
    "date-fns": "^3.0.0",
    "lucide-react": "^0.300.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "prisma": "^5.0.0",
    "@types/leaflet": "^1.9.0"
  }
}
```

---

## 🔧 환경 변수 설정

### `.env.local`

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/nhatrang_travel"

# Auth
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Kakao OAuth
KAKAO_CLIENT_ID=""
KAKAO_CLIENT_SECRET=""

# Google Maps (optional)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=""
```

---

## 🎉 시작하기

1. **MCP 설정 완료 확인**
   ```bash
   claude
   > /mcp
   # 연결된 MCP 서버 목록 확인
   ```

2. **프로젝트 생성**
   ```bash
   > PRD 파일 읽고 Next.js 프로젝트 초기화해줘
   ```

3. **데이터 시딩**
   ```bash
   > 나트랑 문서 데이터를 JSON으로 변환해줘
   ```

4. **개발 시작!**
   ```bash
   > 숙소 리스트 페이지부터 만들어보자
   ```
