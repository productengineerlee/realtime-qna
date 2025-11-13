# Real-time Q&A 배포 가이드

## 📋 배포 준비 체크리스트

### 1. 환경 변수 설정

```bash
# .env.production 파일 생성
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. 빌드 확인

```bash
npm run build
# ✅ 빌드 성공 확인
```

### 3. 로컬 테스트

```bash
npm run preview
# http://localhost:4173에서 프로덕션 빌드 테스트
```

---

## 🚀 Vercel 배포

### 방법 1: Vercel CLI를 사용한 배포

```bash
# Vercel CLI 설치
npm install -g vercel

# 배포
vercel --prod
```

### 방법 2: GitHub 연동

1. GitHub에 리포지토리 푸시
2. [vercel.com](https://vercel.com)에서 계정 생성
3. `Import Project` → GitHub 선택
4. 리포지토리 선택
5. 환경 변수 설정:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. `Deploy` 클릭

### 방법 3: Vercel Dashboard

1. [vercel.com/dashboard](https://vercel.com/dashboard)에 로그인
2. `Add New...` → `Project` → `Import`
3. GitHub 리포지토리 선택
4. 프레임워크: `Vite` (자동 감지)
5. 빌드 설정 확인:
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. 환경 변수 추가
7. `Deploy` 클릭

---

## 🔧 배포 후 설정

### 1. 도메인 설정

Vercel 대시보드에서:
- `Settings` → `Domains`
- 커스텀 도메인 추가
- DNS 설정 완료

### 2. 환경 변수 관리

```bash
# Vercel CLI로 환경 변수 추가
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

### 3. 모니터링

- Vercel Analytics 활성화
- Supabase 모니터링 대시보드 확인
- 에러 로깅 설정 (선택)

---

## 📊 성능 최적화

### 1. 번들 최적화

현재 번들 크기:
- CSS: 47.10 KB (gzip: 8.91 KB)
- JS: 578.25 KB (gzip: 175.01 KB)

권장 사항:
```javascript
// vite.config.ts에서 수동 청크 설정
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui': ['@radix-ui/react-select', '@radix-ui/react-alert-dialog'],
        }
      }
    }
  }
}
```

### 2. 이미지 최적화

- WebP 포맷 사용 (자동으로 Vercel에서 처리)
- 이미지 크기 최적화

### 3. 캐싱 전략

Vercel에서 자동으로 처리:
- 정적 자산: 1년 캐시
- HTML: 캐시 없음 (항상 fresh)

---

## 🔒 보안 체크리스트

- [x] Supabase RLS 정책 설정
- [x] 환경 변수 노출 방지
- [x] HTTPS 활성화 (Vercel 자동)
- [ ] 콘텐츠 보안 정책 (CSP) 설정 (선택)
- [ ] CORS 설정 확인

---

## 📱 배포 후 테스트

### 1. 기능 테스트
- [ ] 로그인/회원가입
- [ ] 세션 생성 및 참가
- [ ] 질문 작성/수정/삭제
- [ ] 좋아요 기능
- [ ] 실시간 업데이트
- [ ] 다크 모드 전환

### 2. 호환성 테스트
- [ ] Chrome/Firefox/Safari
- [ ] iOS/Android
- [ ] 태블릿 뷰

### 3. 성능 테스트
- [ ] Lighthouse 점수 확인
- [ ] 로딩 시간 측정
- [ ] 모바일 성능 확인

---

## 🆘 문제 해결

### 배포 실패

1. 빌드 로그 확인
   ```bash
   vercel logs --follow
   ```

2. 환경 변수 확인
   ```bash
   vercel env ls
   ```

3. 캐시 클리어
   ```bash
   vercel rebuild
   ```

### 런타임 에러

1. Vercel 함수 로그 확인
2. Supabase 로그 확인
3. 브라우저 콘솔 확인

---

## 📞 지원 리소스

- [Vercel 문서](https://vercel.com/docs)
- [Supabase 문서](https://supabase.com/docs)
- [React 문서](https://react.dev)
- [Vite 문서](https://vite.dev)

---

## 📈 배포 후 모니터링

### 1. 에러 추적
- Sentry 또는 LogRocket 설정 (선택)

### 2. 성능 모니터링
- Vercel Analytics
- Core Web Vitals 추적

### 3. 사용자 행동 분석
- Google Analytics 설정 (선택)

---

**배포 완료! 🎉**

프로덕션 URL: `https://your-domain.vercel.app`

이제 사용자들이 접근할 수 있습니다!

