# Portfolio Site Design Spec
**Date:** 2026-06-29  
**Status:** Approved

---

## Overview

수학 선생님이자 vibe coding으로 웹 도구를 만드는 사람의 개인 포트폴리오 사이트.  
HTML · CSS · JS 기반 단일 페이지(`portfolio.html`)로 제작.  
만든 프로젝트들을 한 곳에 모아 보여주는 것이 핵심 목적.

---

## Architecture

- **파일 형태:** 단일 `portfolio.html` (CSS · JS 인라인 포함, 외부 의존 없음)
- **Google Fonts CDN:** Noto Sans KR, Inter (유일한 외부 리소스)
- **배포 위치:** `my-first-vibe` 프로젝트 루트에 위치, 별도 빌드 불필요

---

## Color System

| 역할 | 값 |
|---|---|
| 배경 | `#0d0d0d` |
| 카드 표면 | `#141414` |
| 주 텍스트 | `#e8e8e8` |
| 보조 텍스트 | `#6b6b6b` |
| 블루 액센트 | `#2563eb` |
| 블루 글로우 | `rgba(37, 99, 235, 0.2)` |

---

## Typography

- 영문 제목: `Inter`, `system-ui` 폴백
- 한글: `Noto Sans KR`
- Hero 이름: `3rem`, `font-weight: 700`
- 본문: `1rem`, `line-height: 1.75`

---

## Sections

### 1. Navigation (고정)
- 상단 고정 (`position: fixed`)
- 스크롤 시 `backdrop-filter: blur(12px)` + 반투명 배경
- 좌: 이름(또는 이니셜), 우: 소개 · 프로젝트 · 링크 앵커

### 2. Hero / 소개 (`#about`)
- `min-height: 100vh`, 수직 중앙 정렬
- 메인 문구 (정적, 타이핑 애니메이션 없음):
  ```
  안녕하세요.
  수학 선생님이자
  vibe coding으로
  웹 도구를 만드는 사람입니다.
  ```
- 서브텍스트: `Math teacher · Vibe coder · Tool builder` (보조색)
- CTA: `프로젝트 보기 →` 블루 언더라인 스타일 링크
- 하단 스크롤 유도 화살표 (subtle, bounce 애니메이션)

### 3. Projects (`#projects`)
- 섹션 제목: `Projects`
- 2열 그리드 (모바일: 1열)
- **카드 구성:**
  - 상단: 블루 그라디언트 배경 + 프로젝트명 이니셜/아이콘
  - 프로젝트명, 한 줄 설명
  - `바로가기 →` 링크
  - 호버: `translateY(-4px)` + 블루 글로우 테두리
- **프로젝트 목록:**

| # | 이름 | 설명 | URL |
|---|---|---|---|
| 1 | Math Type | 수학 수식 타이핑 도구 | https://sonthingspecial.vercel.app/math-type.html |
| 2 | 섹터 분석 | 미국 주식 섹터 점수판 | https://sonthingspecial.vercel.app/ |
| 3 | Coming Soon | — | (비활성) |
| 4 | Coming Soon | — | (비활성) |

- **빈 슬롯:** 점선 테두리, `Coming Soon` 텍스트, 클릭 불가, 흐린 색상

### 4. Links (`#links`)
- 섹션 제목: `Links`
- Vercel 링크 카드 1개: 아이콘 + `sonthingspecial.vercel.app` + 호버 시 블루 언더라인

### 5. Footer
- `© 2026 · Made with vibe coding`
- 최소한의 한 줄

---

## Interactions

| 요소 | 동작 |
|---|---|
| 네비 링크 | 부드러운 스크롤 (`scroll-behavior: smooth`) |
| 프로젝트 카드 | hover: `translateY(-4px)` + 블루 글로우 (`box-shadow`) |
| CTA / 링크 | hover: 블루 언더라인 |
| 스크롤 화살표 | CSS `@keyframes` bounce |

---

## Responsive

- **Desktop (≥768px):** 2열 프로젝트 그리드
- **Mobile (<768px):** 1열, 네비 간소화

---

## Out of Scope

- 다크/라이트 모드 토글
- 연락처 폼
- 블로그/글 섹션
- 빌드 시스템 (Webpack, Vite 등)
