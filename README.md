# 실시간 Q&A 웹서비스 (Slido 스타일)

행사 및 수업에서 참가자들이 실시간으로 질문하고 투표할 수 있는 웹 기반 Q&A 플랫폼입니다.

## 기술 스택

- **Frontend**: React 19 + TypeScript + Vite
- **UI 컴포넌트**: shadcn/ui + Tailwind CSS
- **백엔드/DB**: Supabase (인증, DB, Realtime)
- **라우팅**: React Router
- **상태 관리**: React Context API + Hooks
- **배포**: Vercel

## 프로젝트 구조

```
src/
├── components/
│   ├── ui/              # shadcn/ui 컴포넌트
│   ├── questions/       # 질문 관련 컴포넌트
│   ├── sessions/        # 세션 관련 컴포넌트
│   ├── layout/          # 레이아웃 컴포넌트
│   └── auth/            # 인증 관련 컴포넌트
├── hooks/               # 커스텀 React 훅
├── contexts/            # React Context
├── pages/               # 페이지 컴포넌트
├── lib/
│   └── supabase.ts      # Supabase 클라이언트
├── types/               # TypeScript 타입 정의
├── utils/               # 유틸리티 함수
└── test/                # 테스트 파일
```

## 설치 및 설정

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 다음 값을 설정하세요:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 개발 서버 실행

```bash
npm run dev
# http://localhost:5174에서 실행됨
```

### 4. 프로덕션 빌드

```bash
npm run build
npm run preview
```

## 주요 기능

✅ **인증**
- 이메일/비밀번호 로그인 및 회원가입
- 익명 참가자 입장
- React Context를 통한 상태 관리

✅ **세션 관리**
- 발표자의 세션 생성 및 관리
- 고유한 세션 코드로 참가자 참가
- 실시간 세션 상태 업데이트

✅ **질문 기능**
- 참가자의 질문 작성/수정/삭제
- 질문 좋아요 기능 (Realtime)
- 발표자의 질문 상태 관리 (고정, 답변완료, 숨김)

✅ **실시간 업데이트**
- Supabase Realtime을 통한 실시간 질문 동기화
- 실시간 좋아요 수 업데이트
- 실시간 질문 상태 변경

✅ **사용자 인터페이스**
- shadcn/ui 기반 모던 디자인
- 다크/라이트 테마 지원
- 모바일 반응형 디자인
- 접근성 최적화

## API 및 데이터베이스

### Supabase 테이블

- **sessions**: 세션 정보
- **questions**: 질문 데이터
- **likes**: 좋아요 데이터

모든 테이블에 Row Level Security (RLS) 정책이 적용되어 있습니다.

### Supabase 기능

- **인증**: Email/Password, Anonymous
- **Realtime 구독**: PostgreSQL Changes
- **Row Level Security**: 데이터 보호

## 배포

자세한 배포 가이드는 [DEPLOYMENT.md](./DEPLOYMENT.md)를 참고하세요.

### Vercel 배포

```bash
vercel --prod
```

또는

1. GitHub에 리포지토리 푸시
2. Vercel Dashboard에서 "Import Project"
3. 환경 변수 설정
4. Deploy 클릭

## 개발 명령어

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview

# 테스트 실행
npm run test

# TypeScript 타입 생성
npm run generate:types

# shadcn/ui 컴포넌트 추가
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add tabs
npx shadcn@latest add badge
npx shadcn@latest add toast
```

### 3. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음을 추가하세요:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Supabase 설정:
1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. 프로젝트 설정에서 API URL과 Anonymous Key 복사
3. `.env` 파일에 붙여넣기

## 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 열기

## 빌드

```bash
npm run build
```

## 핵심 기능

### 1. 세션 관리
- 발표자가 새로운 세션 생성
- QR 코드 또는 세션 ID로 참가자 입장
- 세션 상태 관리 (활성, 종료)

### 2. 질문 관리
- 참가자가 질문 작성
- 질문 목록 실시간 표시
- 질문에 대한 좋아요 투표 (실시간 반영)

### 3. 발표자 기능
- 질문 숨김 (Hide)
- 질문 고정 (Pin)
- 질문 답변완료 표시 (Mark as Answered)

### 4. 실시간 기능
- Supabase Realtime을 사용한 실시간 업데이트
- 새 질문 추가 시 모든 사용자에게 즉시 반영
- 좋아요 수 실시간 업데이트
- 질문 상태 변경 즉시 반영

## 린트 및 타입 검사

```bash
npm run lint
```

## 배포

Vercel에 배포하려면:

```bash
npm install -g vercel
vercel login
vercel
```

## 주요 마일스톤

- [x] 프로젝트 초기 설정 및 의존성 설치
- [ ] Supabase 데이터베이스 스키마 설계
- [ ] 인증 시스템 구현
- [ ] 세션 관리 기능
- [ ] 질문 작성 및 조회
- [ ] 좋아요 기능
- [ ] 질문 상태 관리
- [ ] 발표자 대시보드 UI
- [ ] 참가자 뷰 UI
- [ ] QR 코드 기능
- [ ] 스타일링 및 반응형 디자인
- [ ] 테스트 및 배포

## 문서

- [PRD](/.taskmaster/docs/prd.txt) - 프로젝트 요구사항 문서

## 라이선스

MIT
