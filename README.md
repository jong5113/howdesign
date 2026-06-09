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
- `/admin/projects/new`
- `/admin/projects`
- `/admin/projects/[id]/edit`

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
- `http://localhost:3000/api/debug/portfolio`

`/portfolio/[slug]` 상세페이지는 Supabase의 `portfolio_projects.slug` 값을 그대로 사용합니다. 예를 들어 `slug`가 `daedong-eel-yeouido`이면 상세 주소는 `http://localhost:3000/portfolio/daedong-eel-yeouido`입니다.

## 환경변수

`.env.example`을 참고해 `.env.local`을 만들고 아래 값을 입력합니다.

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ADMIN_PASSWORD=your_admin_password
```

Supabase 환경변수가 있고 공개된 데이터가 존재하면 Supabase 데이터가 우선 표시됩니다. 환경변수가 없거나 Supabase 연결에 실패하거나 데이터가 비어 있을 때만 `src/lib/sample-portfolio.ts`의 샘플 데이터로 화면이 표시됩니다.

`.env.local`은 로컬 개발 전용 파일입니다. GitHub에 올라가지 않으며 Vercel에도 자동 적용되지 않습니다. Vercel 배포 사이트에서 Supabase 데이터를 보려면 Vercel 프로젝트의 Environment Variables에 직접 입력해야 합니다.

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

관리 업로드 페이지는 `portfolio` bucket을 사용합니다. 현재는 운영자용 개발 페이지이며, 추후 인증을 붙일 수 있도록 `/admin` 경로로 분리되어 있습니다. Supabase RLS를 사용하는 경우 `portfolio_projects`, `portfolio_images`, Storage `portfolio` bucket에 운영자가 insert/upload 할 수 있는 정책이 필요합니다.

## 관리자 업로드 페이지

새 프로젝트는 아래 페이지에서 등록할 수 있습니다.

- 목록 관리: `http://localhost:3000/admin/projects`
- 로컬: `http://localhost:3000/admin/projects/new`
- 배포: `https://howdesign.vercel.app/admin/projects/new`

관리자 페이지는 비밀번호로 보호됩니다. 로컬에서는 `.env.local`에 아래 값을 추가합니다.

```bash
ADMIN_PASSWORD=원하는관리자비밀번호
```

Vercel에서도 `Settings → Environment Variables`에 `ADMIN_PASSWORD`를 직접 추가해야 합니다. 환경변수 추가 또는 변경 후에는 `Deployments → Redeploy`를 실행합니다.

입력 항목은 아래와 같습니다.

- `title`: 현장명
- `category`: `residential` 또는 `commercial`
- `subtitle`
- `location`
- `area`
- `scope`
- `duration`
- `year`
- `description`
- `featured`
- `published`
- `slug`: `title` 기준으로 자동 생성되며, 필요하면 직접 수정할 수 있습니다.

사용 순서는 아래와 같습니다.

1. `/admin/projects` 또는 `/admin/projects/new` 접속
2. 관리자 비밀번호 입력
3. 새 프로젝트는 `/admin/projects/new`에서 프로젝트 정보 입력
4. 이미지 여러 장 업로드
5. 대표 이미지 선택
6. `Save Project` 클릭
7. 기존 프로젝트는 `/admin/projects`에서 `Edit` 클릭 후 정보와 이미지를 수정

`/admin/projects`에서는 등록된 프로젝트의 `title`, `category`, `published`, `featured`, `year`를 확인할 수 있습니다. `Published`, `Featured` 값을 바로 on/off 할 수 있고, `Edit`으로 수정 페이지에 들어가거나 `Delete`로 프로젝트를 삭제할 수 있습니다.

수정 페이지에서는 기존 프로젝트 정보 수정, 대표 이미지 변경, 이미지 추가 업로드, 이미지 순서 변경, 이미지 삭제를 할 수 있습니다. 저장 후 `View Project` 링크로 공개 상세페이지를 확인합니다.

이미지는 업로드 영역을 클릭하거나 이미지 파일을 드래그해서 여러 장을 한 번에 추가합니다. 미리보기 목록에서 `대표 이미지`를 선택할 수 있고, 선택하지 않으면 첫 번째 이미지가 대표 이미지가 됩니다. `Up`, `Down` 버튼으로 업로드 순서를 바꿀 수 있습니다.

저장 버튼을 누르면 아래 작업이 자동으로 실행됩니다.

1. Supabase Storage `portfolio` bucket에 `portfolio/{slug}` 구조로 이미지 업로드
2. 업로드된 이미지의 public URL 생성
3. `portfolio_projects`에 프로젝트 기본 정보 저장
4. 대표 이미지 URL을 `cover_image_url`에 저장
5. `portfolio_images`에 모든 이미지 URL 저장
6. `display_order`를 업로드 순서대로 저장
7. 저장 후 `/portfolio/{slug}` 상세페이지 링크 표시

## 데이터 노출 기준

- `/portfolio`: `portfolio_projects`에서 `published = true`인 데이터만 노출합니다.
- `/portfolio/residential`: `category = 'residential'`인 데이터만 노출합니다.
- `/portfolio/commercial`: `category = 'commercial'`인 데이터만 노출합니다.
- `/`: `featured = true`이고 `published = true`인 데이터만 노출합니다.
- 정렬: `display_order` 오름차순, 그다음 `created_at` 내림차순입니다.
- `/portfolio/[slug]`: 해당 `slug`의 프로젝트와 `portfolio_images` 목록을 함께 가져옵니다.
- Supabase에 `published = true` 데이터가 1개라도 있으면 샘플 데이터와 섞지 않습니다.
- 샘플 데이터는 Supabase 환경변수가 없거나, Supabase 조회가 실패하거나, 공개 데이터가 완전히 비어 있을 때만 사용합니다.

## 개발 확인용 Debug API

Supabase 연결과 이미지 URL 반영 여부를 확인하기 위해 개발 확인용 API를 제공합니다.

- 로컬: `http://localhost:3000/api/debug/portfolio`
- 배포: `https://howdesign.vercel.app/api/debug/portfolio`
- 특정 slug 확인: `https://howdesign.vercel.app/api/debug/portfolio?slug=daedong-eel-yeouido`

이 API는 아래 정보를 JSON으로 보여줍니다.

- Supabase URL 존재 여부와 URL 앞부분
- Supabase anon key 존재 여부
- 공개 프로젝트 수 `publicProjectsCount`
- 최대 10개 프로젝트 미리보기 `allProjectsPreview`
- slug 조건만 적용한 `rawProjectBySlug`
- slug와 `published = true` 조건을 함께 적용한 `publishedProjectBySlug`
- 조회된 상세 이미지의 `image_url`, `display_order`
- Supabase 조회 에러 메시지

보안을 위해 Supabase anon key 전체 값은 절대 노출하지 않고 존재 여부만 표시합니다.

디버그 결과는 아래 기준으로 확인합니다.

- `publicProjectsCount`가 `0`이면 Vercel이 다른 Supabase 프로젝트를 보고 있거나 RLS/환경변수 문제일 가능성이 큽니다.
- `rawProjectBySlug`는 있는데 `publishedProjectBySlug`가 `null`이면 해당 프로젝트의 `published` 값이 `false`일 가능성이 큽니다.
- `rawProjectBySlug`도 `null`이면 `slug` 값이 다르거나 Vercel이 다른 Supabase 프로젝트를 보고 있을 가능성이 큽니다.
- `allProjectsPreview`에 데이터가 보이면 실제로 Vercel에서 접근 가능한 프로젝트의 `slug`, `published`, `category` 값을 확인합니다.
- `error` 또는 `errors`에 메시지가 있으면 RLS 정책, 테이블명, 컬럼명, 환경변수를 우선 확인합니다.

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
3. Vercel `Settings → Environment Variables`에 아래 값을 직접 추가합니다.

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ADMIN_PASSWORD=your_admin_password
```

4. `.env.local`은 로컬 전용이므로 Vercel에는 자동 반영되지 않습니다.
5. 환경변수 입력 또는 수정 후 `Deployments → Redeploy`를 반드시 실행합니다.
6. Build Command는 `npm run build`를 사용합니다.
7. 배포 후 아래 주소에서 Supabase 데이터와 이미지 URL이 정상 표시되는지 확인합니다.

- `https://howdesign.vercel.app`
- `https://howdesign.vercel.app/portfolio`
- `https://howdesign.vercel.app/portfolio/commercial`
- `https://howdesign.vercel.app/portfolio/daedong-eel-yeouido`
- `https://howdesign.vercel.app/api/debug/portfolio`

## 다음 단계

- Supabase 프로젝트 생성
- SQL 실행으로 테이블 생성
- Supabase Storage bucket 생성
- 기존 howdesign.kr 자료를 새 포트폴리오 구조에 맞게 선별 등록
- 실제 현장 사진 URL을 `cover_image_url`, `portfolio_images.image_url`에 입력
- GitHub 저장소 생성 후 Vercel 배포
