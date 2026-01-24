# ☕ Brew Note

드립 커피 레시피와 원두를 기록하고 관리하는 웹 앱입니다.
서버 없이 브라우저의 **로컬 스토리지(LocalStorage)**를 사용하여 모든 데이터를 사용자의 기기에 직접 저장합니다.

## 🚀 주요 기능

- **원두 관리**: 원두 정보, 테이스팅 노트, 개인 평가 기록 (이미지 업로드 포함)
- **레시피 관리**: 유튜브 영상 연동, 드리퍼별 푸어링 레시피 저장
- **푸어링 타이머**: 레시피 기반 가이드 타이머 + 프리 타이머 (중앙 정렬 UI)
- **데이터 백업/복원**: 데이터를 파일로 내보내거나 가져와 기기 변경 시 복구 가능
- **오프라인 사용**: 서버가 없어 빠르고, 인터넷 연결 없이도 데이터 조회 가능

---

## 📁 프로젝트 구조

```
brew-note/
├── components/             # 재사용 가능한 UI 컴포넌트
│   └── BottomNav.tsx       # 하단 네비게이션
├── pages/                  # 페이지 컴포넌트
│   ├── BeanList/Detail/Form # 원두 관련 페이지
│   ├── RecipeList/Detail/Form # 레시피 관련 페이지
│   ├── PouringTimer.tsx    # 푸어링 타이머 (핵심 기능)
│   └── Settings.tsx        # 백업 및 복원 기능
├── contexts/               # 전역 상태 관리
│   └── DataContext.tsx     # 데이터(원두/레시피) 로직
├── utils/
│   └── storage.ts          # LocalStorage 입출력 및 백업/복원 유틸
├── App.tsx                 # 라우팅 설정
└── data.ts                 # 초기 샘플 데이터
```

---

## 💻 로컬 개발

```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:5173` 접속하여 확인합니다.

---

## ☁️ 배포하기 (무료)

이 프로젝트는 **Cloudflare Pages** 또는 **Vercel**과 같은 정적 호스팅 서비스에 무료로 배포할 수 있습니다.

### 추천: Cloudflare Pages
1. GitHub에 이 코드를 Push 합니다.
2. [Cloudflare Dashboard](https://dash.cloudflare.com/) > **Workers & Pages** > **Create application**
3. **Pages** > **Connect to Git** > Repo 선택
4. `npm run build` 및 `dist` 디렉토리가 자동으로 감지됩니다. **Save and Deploy** 클릭!

(자세한 방법은 `deployment.md` 파일을 참고하세요)

---

## 📱 모바일 사용 팁 (PWA)

배포된 사이트에 모바일 브라우저(Safari, Chrome)로 접속한 뒤 **"홈 화면에 추가"**를 하면, 주소창 없이 **앱처럼 전체 화면**으로 실행됩니다.

---

## 🔧 기술 스택

- **Framework**: React, Vite
- **Styling**: Tailwind CSS
- **Data**: LocalStorage, JSON Export/Import
- **Image**: React Easy Crop (1:1 이미지 크롭)

---

## 📄 라이선스

MIT License
