# 주식회사 하우디자인 포트폴리오 홈페이지

Next.js, TypeScript, Tailwind CSS, Supabase, Vercel 기반의 인테리어 포트폴리오 홈페이지입니다. UI는 블랙 앤 화이트로 정리하고, 포트폴리오 사진은 컬러 그대로 보여줍니다.

## 최종 기술 구성

- 소스 관리: GitHub
- 데이터베이스: Supabase
- 이미지 저장: Supabase Storage
- 배포: Vercel
- 프론트엔드: Next.js + TypeScript + Tailwind CSS

## 회사 정보

- 회사명: 주식회사 하우디자인
- 전화번호: 010-9551-5113
- 이메일: jong51133@nate.com
- 주소: 서울시 송파구 충민로66. 가든파이브라이프 제지2층 2007호

## 페이지 구조

- `/`
- `/portfolio`
- `/portfolio/residential`
- `/portfolio/commercial`
- `/portfolio/[slug]`
- `/contact`

## 실행 방법

```bash
npm install
npm run dev
```

PowerShell에서 `npm` 실행이 막히면 아래처럼 `.cmd` 명령을 사용합니다.

```bash
npm.cmd install
npm.cmd run dev
```

실행 후 아래 주소에서 확인합니다.

- `http://localhost:3000`
- `http://localhost:3000/portfolio`
- `http://localhost:3000/portfolio/commercial`
- `http://localhost:3000/portfolio/daedong-eel-yeouido`
- `http://localhost:3000/contact`

`/portfolio/[slug]` 상세페이지는 Supabase의 `portfolio_projects.slug` 값을 그대로 사용합니다. 예를 들어 `slug`가 `daedong-eel-yeouido`이면 상세 주소는 `http://localhost:3000/portfolio/daedong-eel-yeouido`입니다.

## 환경변수

`.env.example`을 참고해 `.env.local`을 만들고 아래 값을 입력합니다.

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Supabase 환경변수가 있고 공개된 데이터가 존재하면 Supabase 데이터가 우선 표시됩니다. 환경변수가 없거나 Supabase 연결에 실패하거나 데이터가 비어 있을 때만 `src/lib/sample-portfolio.ts`의 샘플 데이터로 화면이 표시됩니다.

## 로고 적용 방법

아래 경로 중 하나로 로고 파일을 넣으면 Header와 Footer에서 자동으로 사용합니다.

- `public/logo.svg`
- `public/logo.png`

로고 파일이 없으면 Header에는 `HOW DESIGN`, Footer에는 `주식회사 하우디자인` 텍스트가 표시됩니다.

## Supabase 테이블 SQL

Supabase SQL Editor에서 아래 SQL을 실행해 테이블을 생성합니다.

```sql
create table if not exists portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text not null check (category in ('residential', 'commercial')),
  subtitle text,
  location text,
  area text,
  scope text,
  duration text,
  year integer,
  description text,
  cover_image_url text,
  featured boolean not null default false,
  published boolean not null default true,
  display_order integer not null default 100,
  created_at timestamptz not null default now()
);

create table if not exists portfolio_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references portfolio_projects(id) on delete cascade,
  image_url text not null,
  alt text,
  display_order integer not null default 100,
  created_at timestamptz not null default now()
);

create index if not exists portfolio_projects_public_order_idx
  on portfolio_projects (published, featured, category, display_order, created_at desc);

create index if not exists portfolio_images_project_order_idx
  on portfolio_images (project_id, display_order, created_at);
```

## Supabase Storage 사용

1. Supabase Storage에서 포트폴리오 이미지용 bucket을 만듭니다.
2. 이미지를 업로드합니다.
3. 공개 URL을 복사해 `cover_image_url` 또는 `portfolio_images.image_url`에 입력합니다.
4. 비공개 bucket을 사용할 경우 별도 signed URL 로직이 필요합니다.

## 데이터 노출 기준

- `/portfolio`: `portfolio_projects`에서 `published = true`인 데이터만 노출합니다.
- `/portfolio/residential`: `category = 'residential'`인 데이터만 노출합니다.
- `/portfolio/commercial`: `category = 'commercial'`인 데이터만 노출합니다.
- `/`: `featured = true`이고 `published = true`인 데이터만 노출합니다.
- 정렬: `display_order` 오름차순, 그다음 `created_at` 내림차순입니다.
- `/portfolio/[slug]`: 해당 `slug`의 프로젝트와 `portfolio_images` 목록을 함께 가져옵니다.

## GitHub 업로드

```bash
git init
git add .
git commit -m "Initial portfolio website"
git branch -M main
git remote add origin https://github.com/USER/REPOSITORY.git
git push -u origin main
```

`.env.local`, `.next`, `node_modules`는 `.gitignore`에 포함되어 GitHub에 올라가지 않습니다.

## Vercel 배포

1. GitHub에 업로드한 저장소를 Vercel에서 Import합니다.
2. Framework Preset은 Next.js를 선택합니다.
3. Environment Variables에 아래 값을 추가합니다.

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Build Command는 `npm run build`를 사용합니다.
5. 배포 후 Supabase Storage 이미지 URL이 정상 표시되는지 확인합니다.

## 다음 단계

- Supabase 프로젝트 생성
- SQL 실행으로 테이블 생성
- Supabase Storage bucket 생성
- 기존 howdesign.kr 자료를 새 포트폴리오 구조에 맞게 선별 등록
- 실제 현장 사진 URL을 `cover_image_url`, `portfolio_images.image_url`에 입력
- GitHub 저장소 생성 후 Vercel 배포
