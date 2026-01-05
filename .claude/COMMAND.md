# COMMAND - 자주 사용하는 명령어

## 개발 서버

```bash
# 개발 서버 시작
npm run dev

# 빌드
npm run build

# 프로덕션 서버 시작
npm start

# 타입 체크
npx tsc --noEmit
```

## Git 명령어

```bash
# 상태 확인
git status

# 변경사항 커밋
git add . && git commit -m "커밋 메시지"

# 푸시 (Vercel 자동 배포)
git push origin main

# 최근 커밋 로그
git log --oneline -10
```

## Supabase CLI

```bash
# Supabase 상태 확인
npx supabase status

# 마이그레이션 생성
npx supabase migration new [migration_name]

# 마이그레이션 적용
npx supabase db push
```

## 프로젝트 URL

- **로컬 개발**: http://localhost:3000
- **프로덕션**: https://nhatrang-travel.vercel.app
- **Supabase Dashboard**: https://supabase.com/dashboard

## 자주 사용하는 파일 경로

```
# 페이지
src/app/accommodation/page.tsx    # 숙소
src/app/restaurants/page.tsx      # 맛집
src/app/attractions/page.tsx      # 볼거리
src/app/activities/page.tsx       # 액티비티
src/app/shopping/page.tsx         # 쇼핑
src/app/admin/                    # 관리자

# Supabase 관련
src/lib/supabase/client.ts        # Supabase 클라이언트
src/lib/supabase/types.ts         # 타입 정의
src/lib/supabase/hooks.ts         # 데이터 fetching 훅

# 스키마
supabase/schema.sql               # DB 스키마
supabase/seed-accommodations.sql  # 숙소 시드 데이터
```

## Claude Code 작업 시작 명령 예시

```
# 새 기능 추가
"관리자 페이지에 숙소 관리 기능 추가해줘"

# 버그 수정
"숙소 페이지에서 필터가 안 되는 문제 수정해줘"

# 코드 리뷰
".claude/TODO.md 확인하고 다음 작업 진행해줘"

# 현재 상태 확인
".claude/WORKSPACE.md 읽고 프로젝트 구조 파악해줘"
```

## 환경 변수 (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_google_api_key
```
