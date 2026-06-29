# Portfolio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `portfolio.html` 단일 파일로 개인 포트폴리오 사이트 구현 (소개 · 프로젝트 갤러리 · 링크)

**Architecture:** HTML/CSS/JS 모두 단일 `portfolio.html`에 인라인. 외부 의존성은 Google Fonts CDN(Inter, Noto Sans KR)만 허용. 빌드 시스템 없음 — 브라우저로 직접 열면 동작해야 함.

**Tech Stack:** HTML5, CSS3 (CSS Variables, Grid, Flexbox, @keyframes), Vanilla JS (scroll event, smooth scroll), Google Fonts CDN

## Global Constraints

- 단일 파일: `portfolio.html` (프로젝트 루트)
- JS 프레임워크 금지 — Vanilla JS만
- 외부 CSS/JS 라이브러리 금지 — Google Fonts CDN만 허용
- 색상: `#0d0d0d` 배경, `#2563eb` 블루 액센트 (CSS 변수로 정의)
- 폰트: Inter (영문), Noto Sans KR (한글)
- 반응형: 768px 기준 breakpoint

---

### Task 1: HTML 뼈대 + CSS 변수 + 네비게이션

**Files:**
- Create: `portfolio.html`

**Interfaces:**
- Produces: `<nav id="navbar">`, CSS 변수 (`--bg`, `--surface`, `--text-primary`, `--text-secondary`, `--blue`, `--blue-glow`), 섹션 앵커 `#about` · `#projects` · `#links`

- [ ] **Step 1: `portfolio.html` 생성 — HTML 뼈대 + CSS 변수 + 네비**

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Portfolio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Noto+Sans+KR:wght@400;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #0d0d0d;
      --surface: #141414;
      --text-primary: #e8e8e8;
      --text-secondary: #6b6b6b;
      --blue: #2563eb;
      --blue-glow: rgba(37, 99, 235, 0.2);
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html { scroll-behavior: smooth; }

    body {
      background: var(--bg);
      color: var(--text-primary);
      font-family: 'Inter', 'Noto Sans KR', system-ui, sans-serif;
      font-size: 1rem;
      line-height: 1.75;
    }

    /* Navigation */
    nav {
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 100;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      transition: background 0.3s, backdrop-filter 0.3s;
    }

    nav.scrolled {
      background: rgba(13, 13, 13, 0.8);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }

    .nav-brand {
      font-weight: 700;
      font-size: 1rem;
      color: var(--text-primary);
      text-decoration: none;
      letter-spacing: 0.05em;
    }

    .nav-links {
      display: flex;
      gap: 2rem;
      list-style: none;
    }

    .nav-links a {
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 0.875rem;
      transition: color 0.2s;
    }

    .nav-links a:hover { color: var(--text-primary); }

    @media (max-width: 768px) {
      nav { padding: 1rem; }
      .nav-links { gap: 1rem; }
      .nav-links a { font-size: 0.75rem; }
    }
  </style>
</head>
<body>

<nav id="navbar">
  <a href="#about" class="nav-brand">SST</a>
  <ul class="nav-links">
    <li><a href="#about">소개</a></li>
    <li><a href="#projects">프로젝트</a></li>
    <li><a href="#links">링크</a></li>
  </ul>
</nav>

<main>
  <!-- Sections will be added in subsequent tasks -->
</main>

<script>
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });
</script>

</body>
</html>
```

- [ ] **Step 2: 브라우저로 열어 확인**

`portfolio.html`을 브라우저로 열어 다음을 확인:
- 검정 배경 ✓
- 상단 네비("SST" 브랜드 + 소개·프로젝트·링크) 보임 ✓
- 스크롤해도 별 내용 없지만 콘솔 에러 없음 ✓

- [ ] **Step 3: 커밋**

```bash
git add portfolio.html
git commit -m "feat: add portfolio HTML skeleton, nav, CSS variables"
```

---

### Task 2: Hero / 소개 섹션

**Files:**
- Modify: `portfolio.html`

**Interfaces:**
- Consumes: CSS 변수, `<main>` 태그
- Produces: `<section id="about">`, `.hero-title`, `.hero-sub`, `.hero-cta`, `.scroll-arrow`

- [ ] **Step 1: `<main>` 안에 Hero 섹션 HTML 추가**

`<main>` 태그 안에 아래 내용을 삽입:

```html
<section id="about">
  <div class="hero-content">
    <p class="hero-eyebrow">안녕하세요.</p>
    <h1 class="hero-title">
      수학 선생님이자<br>
      vibe coding으로<br>
      웹 도구를 만드는 사람입니다.
    </h1>
    <p class="hero-sub">Math teacher · Vibe coder · Tool builder</p>
    <a href="#projects" class="hero-cta">프로젝트 보기 →</a>
  </div>
  <div class="scroll-arrow" aria-hidden="true">↓</div>
</section>
```

- [ ] **Step 2: `<style>` 블록에 Hero CSS 추가**

기존 `</style>` 바로 앞에 삽입:

```css
/* Hero */
#about {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 8rem 2rem 4rem;
  max-width: 900px;
  margin: 0 auto;
  position: relative;
}

.hero-eyebrow {
  color: var(--text-secondary);
  font-size: 1rem;
  margin-bottom: 1rem;
}

.hero-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  line-height: 1.25;
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
}

.hero-sub {
  color: var(--text-secondary);
  font-size: 0.9rem;
  letter-spacing: 0.05em;
  margin-bottom: 2.5rem;
}

.hero-cta {
  color: var(--blue);
  text-decoration: none;
  font-size: 0.95rem;
  border-bottom: 1px solid var(--blue);
  padding-bottom: 2px;
  transition: opacity 0.2s;
}

.hero-cta:hover { opacity: 0.7; }

.scroll-arrow {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  color: var(--text-secondary);
  font-size: 1.25rem;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(8px); }
}

@media (max-width: 768px) {
  #about { padding: 7rem 1.25rem 4rem; }
}
```

- [ ] **Step 3: 브라우저로 열어 확인**

- 검정 배경에 큰 한글 타이포그래피 ✓
- 서브텍스트 회색으로 표시 ✓
- "프로젝트 보기 →" 블루 링크 ✓
- 하단에 ↓ 화살표 bounce 애니메이션 ✓
- 네비에서 "소개" 클릭 시 부드럽게 스크롤 ✓

- [ ] **Step 4: 커밋**

```bash
git add portfolio.html
git commit -m "feat: add hero/about section"
```

---

### Task 3: Projects 갤러리 섹션

**Files:**
- Modify: `portfolio.html`

**Interfaces:**
- Consumes: CSS 변수, `<section id="about">` 다음 위치
- Produces: `<section id="projects">`, `.project-grid`, `.project-card`, `.card-thumb`, `.card-coming-soon`

- [ ] **Step 1: Hero 섹션 아래에 Projects 섹션 HTML 추가**

`</section>` (about 섹션 닫는 태그) 바로 아래에 삽입:

```html
<section id="projects">
  <div class="section-inner">
    <h2 class="section-title">Projects</h2>
    <div class="project-grid">

      <a href="https://sonthingspecial.vercel.app/math-type.html" target="_blank" rel="noopener" class="project-card">
        <div class="card-thumb" style="--thumb-hue: 220;">
          <span class="card-initial">MT</span>
        </div>
        <div class="card-body">
          <h3 class="card-name">Math Type</h3>
          <p class="card-desc">수학 수식 타이핑 도구</p>
          <span class="card-link">바로가기 →</span>
        </div>
      </a>

      <a href="https://sonthingspecial.vercel.app/" target="_blank" rel="noopener" class="project-card">
        <div class="card-thumb" style="--thumb-hue: 200;">
          <span class="card-initial">SA</span>
        </div>
        <div class="card-body">
          <h3 class="card-name">섹터 분석</h3>
          <p class="card-desc">미국 주식 섹터 점수판</p>
          <span class="card-link">바로가기 →</span>
        </div>
      </a>

      <div class="project-card card-coming-soon">
        <div class="card-thumb card-thumb--empty"></div>
        <div class="card-body">
          <h3 class="card-name">Coming Soon</h3>
          <p class="card-desc">준비 중입니다</p>
        </div>
      </div>

      <div class="project-card card-coming-soon">
        <div class="card-thumb card-thumb--empty"></div>
        <div class="card-body">
          <h3 class="card-name">Coming Soon</h3>
          <p class="card-desc">준비 중입니다</p>
        </div>
      </div>

    </div>
  </div>
</section>
```

- [ ] **Step 2: `<style>` 블록에 Projects CSS 추가**

기존 `</style>` 바로 앞에 삽입:

```css
/* Sections common */
.section-inner {
  max-width: 900px;
  margin: 0 auto;
  padding: 6rem 2rem;
}

.section-title {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--blue);
  margin-bottom: 3rem;
}

/* Project Grid */
.project-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .project-grid { grid-template-columns: 1fr; }
  .section-inner { padding: 4rem 1.25rem; }
}

/* Project Card */
.project-card {
  background: var(--surface);
  border: 1px solid #1e1e1e;
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  color: var(--text-primary);
  transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
  display: block;
}

a.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 0 0 1px var(--blue), 0 8px 32px var(--blue-glow);
  border-color: var(--blue);
}

.card-thumb {
  height: 140px;
  background: linear-gradient(135deg,
    hsl(var(--thumb-hue, 220), 70%, 12%),
    hsl(var(--thumb-hue, 220), 80%, 22%));
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-initial {
  font-size: 2rem;
  font-weight: 700;
  color: rgba(255,255,255,0.15);
  letter-spacing: 0.1em;
}

.card-thumb--empty {
  background: repeating-linear-gradient(
    45deg,
    #1a1a1a,
    #1a1a1a 4px,
    #141414 4px,
    #141414 16px
  );
}

.card-body { padding: 1.25rem; }

.card-name {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.card-desc {
  font-size: 0.825rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.card-link {
  font-size: 0.8rem;
  color: var(--blue);
  letter-spacing: 0.03em;
}

/* Coming Soon card */
.card-coming-soon {
  opacity: 0.45;
  cursor: default;
  border-style: dashed;
}
```

- [ ] **Step 3: 브라우저로 열어 확인**

- 2열 그리드로 카드 4장 표시 ✓
- Math Type, 섹터 분석 카드에 블루 그라디언트 썸네일 + 이니셜 ✓
- Coming Soon 카드 2장은 흐릿하게 점선 테두리 ✓
- Math Type / 섹터 분석 카드 호버 시 블루 글로우 + 위로 이동 ✓
- 모바일 폭(375px)으로 창 좁히면 1열로 변환 ✓

- [ ] **Step 4: 커밋**

```bash
git add portfolio.html
git commit -m "feat: add projects gallery section"
```

---

### Task 4: Links + Footer 섹션

**Files:**
- Modify: `portfolio.html`

**Interfaces:**
- Consumes: CSS 변수, projects 섹션 다음 위치
- Produces: `<section id="links">`, `<footer>`, `.link-card`

- [ ] **Step 1: Projects 섹션 아래에 Links + Footer HTML 추가**

```html
<section id="links">
  <div class="section-inner">
    <h2 class="section-title">Links</h2>
    <a href="https://sonthingspecial.vercel.app/" target="_blank" rel="noopener" class="link-card">
      <span class="link-icon">▲</span>
      <span class="link-text">
        <span class="link-name">Vercel</span>
        <span class="link-url">sonthingspecial.vercel.app</span>
      </span>
      <span class="link-arrow">→</span>
    </a>
  </div>
</section>

<footer>
  <p>© 2026 · Made with vibe coding</p>
</footer>
```

- [ ] **Step 2: `<style>` 블록에 Links + Footer CSS 추가**

```css
/* Links */
.link-card {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  background: var(--surface);
  border: 1px solid #1e1e1e;
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  text-decoration: none;
  color: var(--text-primary);
  max-width: 480px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.link-card:hover {
  border-color: var(--blue);
  box-shadow: 0 0 0 1px var(--blue), 0 4px 16px var(--blue-glow);
}

.link-icon {
  font-size: 1.25rem;
  color: var(--blue);
  flex-shrink: 0;
}

.link-text {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.link-name {
  font-weight: 700;
  font-size: 0.9rem;
}

.link-url {
  font-size: 0.78rem;
  color: var(--text-secondary);
}

.link-arrow {
  color: var(--text-secondary);
  font-size: 1rem;
  transition: color 0.2s;
}

.link-card:hover .link-arrow { color: var(--blue); }

/* Footer */
footer {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
  font-size: 0.8rem;
  border-top: 1px solid #1e1e1e;
}
```

- [ ] **Step 3: 브라우저로 열어 확인**

- Links 섹션에 Vercel 카드 표시 ✓
- 카드 호버 시 블루 테두리 글로우 ✓
- Footer `© 2026 · Made with vibe coding` 표시 ✓
- 네비에서 "링크" 클릭 시 Links 섹션으로 부드럽게 스크롤 ✓

- [ ] **Step 4: 커밋**

```bash
git add portfolio.html
git commit -m "feat: add links and footer sections"
```

---

### Task 5: 최종 점검 및 완성

**Files:**
- Modify: `portfolio.html`

**Interfaces:**
- Consumes: 완성된 모든 섹션
- Produces: 배포 준비 완료된 `portfolio.html`

- [ ] **Step 1: 전체 페이지 순서대로 점검**

브라우저로 열어 아래 체크리스트 확인:

| 항목 | 확인 |
|---|---|
| 배경색 `#0d0d0d` (짙은 블랙) | |
| 네비 스크롤 시 blur 처리 | |
| Hero 타이포그래피 — 큰 한글 문구 | |
| 서브텍스트 회색 표시 | |
| "프로젝트 보기 →" 블루 링크 | |
| ↓ 화살표 bounce 애니메이션 | |
| Math Type 카드 → 링크 이동 | |
| 섹터 분석 카드 → 링크 이동 | |
| Coming Soon 카드 — 흐릿 + 점선 + 클릭 무반응 | |
| 카드 호버 블루 글로우 | |
| Vercel 링크 카드 작동 | |
| Footer 텍스트 | |
| 모바일 375px 폭 — 1열, 네비 정상 | |
| 콘솔 에러 없음 | |

- [ ] **Step 2: `<title>` 및 meta 설명 업데이트**

`<head>` 내 `<title>` 태그와 meta description을 확인:

```html
<title>Portfolio — 수학 선생님의 vibe coding</title>
<meta name="description" content="수학 선생님이자 vibe coding으로 웹 도구를 만드는 사람의 포트폴리오">
```

- [ ] **Step 3: 최종 커밋**

```bash
git add portfolio.html
git commit -m "feat: complete portfolio site"
```
