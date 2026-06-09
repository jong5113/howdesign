# 주식회사 하우디자인 포트폴리오 홈페이지

Next.js, TypeScript, Tailwind CSS, Supabase, Vercel 기반의 인테리어 포트폴리오 홈페이지입니다. 공개 페이지는 미니멀한 블랙앤화이트 UI를 유지하고, 포트폴리오 사진은 컬러 원본 그대로 보여줍니다.

## 기술 구성

- 프론트엔드: Next.js App Router + TypeScript + Tailwind CSS
- 데이터베이스: Supabase
- 이미지 저장: Supabase Storage
- 배포: Vercel
- 소스 관리: GitHub

## 주요 페이지

- `/`
- `/portfolio`
- `/portfolio/residential`
- `/portfolio/commercial`
- `/portfolio/[slug]`
- `/contact`
- `/admin/projects`
- `/admin/projects/new`
- `/admin/projects/[id]/edit`
- `/api/debug/portfolio`

## 로컬 실행

```bash
npm install
npm run dev
```

PowerShell에서 `npm` 실행이 막히면 아래처럼 `.cmd` 명령을 사용합니다.

```bash
npm.cmd install
npm.cmd run dev
```

확인 주소:

- `http://localhost:3000`
- `http://localhost:3000/portfolio`
- `http://localhost:3000/portfolio/commercial`
- `http://localhost:3000/portfolio/residential`
- `http://localhost:3000/portfolio/daedong-eel-yeouido`
- `http://localhost:3000/contact`
- `http://localhost:3000/admin/projects`
- `http://localhost:3000/admin/projects/new`
- `http://localhost:3000/api/debug/portfolio`

## 환경변수

`.env.example`을 참고해 `.env.local`을 만듭니다.

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ADMIN_PASSWORD=your_admin_password
```

- `.env.local`은 로컬 전용 파일입니다.
- GitHub와 Vercel에는 자동 반영되지 않습니다.
- Vercel 배포 사이트에서도 관리자와 Supabase를 쓰려면 Vercel `Settings → Environment Variables`에 직접 입력해야 합니다.
- 환경변수 추가 또는 변경 후에는 Vercel `Deployments → Redeploy`를 실행합니다.

## Supabase 테이블 SQL

Supabase SQL Editor에서 아래 SQL을 실행합니다.

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
  year text,
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

이미 `year integer`로 테이블을 만든 상태라면 Date of Completion 텍스트 저장을 위해 아래 SQL을 한 번 실행합니다.

```sql
alter table portfolio_projects
alter column year type text
using year::text;
```

## Supabase Storage

- Storage bucket 이름은 `portfolio`를 사용합니다.
- 업로드 경로는 `{slug}/filename.jpg` 구조입니다.
- 예: `daedong-eel-yeouido/01-cover.jpg`
- `cover_image_url`과 `portfolio_images.image_url`에는 Supabase Storage Public URL이 저장됩니다.

## 관리자 페이지 사용법

관리자 페이지는 `ADMIN_PASSWORD` 환경변수와 httpOnly cookie로 보호됩니다.

### 새 프로젝트 등록

경로: `/admin/projects/new`

1. 관리자 비밀번호 입력
2. 프로젝트 정보 입력
3. 이미지 여러 장 업로드
4. 대표 이미지 선택
5. `Save Project` 클릭
6. 저장 성공 후 `View Project`로 상세페이지 확인

입력 항목:

- `title`: 현장명 한글
- `subtitle`: 현장명 영문
- `slug`: 상세페이지 주소
- `category`: `residential` 또는 `commercial`
- `location`: Site / 위치
- `area`: 예: `198.9 m2 / 60 py`
- `scope`: 공사 범위
- `duration`: 공사 기간
- `Date of Completion`: 완료 시점 입력. 예: `May. 2026`, `2026. 05`, `2026`
- `description`: 설명
- `display_order`: 낮은 숫자가 먼저 노출
- `featured`: 메인 노출 여부
- `published`: 공개 여부

`published`를 끄면 공개 페이지에는 보이지 않습니다. `featured`를 켜면 메인 화면 노출 대상이 됩니다.

### 기존 프로젝트 목록

경로: `/admin/projects`

관리자 목록에서는 `published=false` 프로젝트도 함께 보입니다.

가능한 작업:

- 커버 썸네일 확인
- `published` on/off
- `featured` on/off
- `Edit`으로 수정 페이지 이동
- `View`로 공개 상세페이지 확인
- `Delete`로 프로젝트 삭제

삭제 시 `portfolio_projects` row를 삭제합니다. `portfolio_images`는 `on delete cascade`로 함께 삭제됩니다. 가능한 경우 Supabase Storage의 이미지 파일도 함께 삭제합니다. Storage 삭제가 실패하면 화면에 에러가 표시되며, 해당 파일은 Supabase Storage에서 수동 정리할 수 있습니다.

### 기존 프로젝트 수정

경로: `/admin/projects/[id]/edit`

수정 가능 항목:

- 프로젝트 기본 정보
- `slug`
- `cover_image_url`
- `published`
- `featured`
- `display_order`
- 기존 이미지 순서
- 기존 이미지 삭제
- 새 이미지 추가 업로드
- 갤러리 이미지 중 대표 이미지 설정

이미지 순서 변경:

- 각 이미지의 `Up`, `Down` 버튼으로 순서를 바꿉니다.
- 저장하면 `portfolio_images.display_order`가 현재 순서대로 다시 저장됩니다.
- 공개 상세페이지의 masonry 이미지 배열에도 변경된 순서가 반영됩니다.

대표 이미지 변경:

- 기존 갤러리 이미지에서 `Set as cover image`를 선택하면 해당 URL이 `portfolio_projects.cover_image_url`로 저장됩니다.
- 별도 Public URL을 직접 넣고 싶으면 `cover_image_url` 입력칸을 사용하고 `Use cover image URL`을 선택합니다.

## Supabase RLS 정책 안내

현재 관리자 기능은 브라우저의 Supabase anon key로 insert/update/delete/upload/delete를 수행합니다. RLS를 켠 경우 아래 작업을 허용하는 정책이 필요합니다.

필요 권한:

- `portfolio_projects`: select, insert, update, delete
- `portfolio_images`: select, insert, update, delete
- `storage.objects`: select, insert, update, delete for bucket `portfolio`

예시 정책은 운영 방식에 맞게 더 엄격하게 조정해야 합니다. 단순 운영자용 공개 정책 예시는 다음과 같습니다.

```sql
alter table portfolio_projects enable row level security;
alter table portfolio_images enable row level security;

create policy "Allow public read portfolio projects"
on portfolio_projects for select
using (true);

create policy "Allow admin write portfolio projects"
on portfolio_projects for all
using (true)
with check (true);

create policy "Allow public read portfolio images"
on portfolio_images for select
using (true);

create policy "Allow admin write portfolio images"
on portfolio_images for all
using (true)
with check (true);
```

Storage 정책 예시는 다음과 같습니다.

```sql
create policy "Allow public read portfolio storage"
on storage.objects for select
using (bucket_id = 'portfolio');

create policy "Allow admin write portfolio storage"
on storage.objects for all
using (bucket_id = 'portfolio')
with check (bucket_id = 'portfolio');
```

실제 운영에서는 Supabase Auth 또는 서버 전용 API를 붙여 관리자만 쓰기 권한을 갖도록 강화하는 것을 권장합니다.

## 데이터 노출 기준

- `/portfolio`: `published = true` 프로젝트만 노출
- `/portfolio/residential`: `category = 'residential'` + `published = true`
- `/portfolio/commercial`: `category = 'commercial'` + `published = true`
- `/`: `featured = true` + `published = true`
- 정렬: `display_order` 오름차순, `created_at` 내림차순
- Supabase 환경변수가 없거나 조회 실패 또는 데이터가 완전히 비어 있을 때만 샘플 데이터 사용
- Supabase 데이터가 1개라도 있으면 샘플 데이터와 섞지 않음

## Debug API

Supabase 연결과 데이터 상태를 확인할 수 있습니다.

- `http://localhost:3000/api/debug/portfolio`
- `http://localhost:3000/api/debug/portfolio?slug=daedong-eel-yeouido`
- `https://howdesign.vercel.app/api/debug/portfolio`
- `https://howdesign.vercel.app/api/debug/portfolio?slug=daedong-eel-yeouido`

anon key 전체 값은 노출하지 않고, 존재 여부만 표시합니다.

## GitHub 업로드

```bash
git init
git add .
git commit -m "Update portfolio admin"
git branch -M main
git remote add origin https://github.com/USER/REPOSITORY.git
git push -u origin main
```

`.env.local`, `.next`, `node_modules`는 GitHub에 올리지 않습니다.

## Vercel 배포

1. GitHub 저장소를 Vercel에서 Import합니다.
2. Framework Preset은 Next.js를 선택합니다.
3. Vercel `Settings → Environment Variables`에 아래 값을 입력합니다.

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ADMIN_PASSWORD=your_admin_password
```

4. 환경변수 입력 후 `Deployments → Redeploy`를 실행합니다.
5. 배포 후 아래 주소를 확인합니다.

- `https://howdesign.vercel.app`
- `https://howdesign.vercel.app/portfolio`
- `https://howdesign.vercel.app/portfolio/commercial`
- `https://howdesign.vercel.app/portfolio/daedong-eel-yeouido`
- `https://howdesign.vercel.app/admin/projects`
- `https://howdesign.vercel.app/api/debug/portfolio`

## 관리자 포트폴리오 관리

- 새 등록: `/admin/projects/new`
- 기존 목록/관리: `/admin/projects`
- 기존 수정: `/admin/projects/[id]/edit`

관리자 화면은 `ADMIN_PASSWORD` 환경변수와 관리자 cookie 인증을 사용합니다. Vercel에서도 `ADMIN_PASSWORD`를 Environment Variables에 추가한 뒤 Redeploy 해야 합니다.

관리 목록에서는 `published=false` 프로젝트도 함께 표시됩니다. `published`를 끄면 공개 포트폴리오 페이지에 보이지 않고, `featured`를 켜면 메인 노출 대상이 됩니다.

수정 페이지에서는 아래 작업을 할 수 있습니다.

- 프로젝트 기본 정보 수정
- `Date of Completion` 자유 텍스트 입력: 예 `May. 2026`, `2026. 05`, `2026`
- `cover_image_url` 직접 수정
- 갤러리 이미지 중 대표 이미지 지정
- 이미지 추가 업로드
- 이미지 삭제
- 이미지 순서 `Up` / `Down` 변경
- 저장 후 `View Project`로 공개 상세페이지 확인

프로젝트 삭제 시 `portfolio_projects` row를 삭제합니다. `portfolio_images`는 `on delete cascade`로 함께 삭제됩니다. 가능한 경우 Supabase Storage의 파일도 같이 삭제합니다. Storage 삭제가 실패하면 화면에 오류가 표시되며, Supabase Storage에서 수동 정리할 수 있습니다.

RLS를 사용하는 경우 관리자 기능에는 다음 권한이 필요합니다.

- `portfolio_projects`: select, insert, update, delete
- `portfolio_images`: select, insert, update, delete
- `storage.objects`: select, insert, update, delete for bucket `portfolio`

예시 정책:

```sql
alter table portfolio_projects enable row level security;
alter table portfolio_images enable row level security;

create policy "Allow public read portfolio projects"
on portfolio_projects for select
using (true);

create policy "Allow admin write portfolio projects"
on portfolio_projects for all
using (true)
with check (true);

create policy "Allow public read portfolio images"
on portfolio_images for select
using (true);

create policy "Allow admin write portfolio images"
on portfolio_images for all
using (true)
with check (true);

create policy "Allow public read portfolio storage"
on storage.objects for select
using (bucket_id = 'portfolio');

create policy "Allow admin write portfolio storage"
on storage.objects for all
using (bucket_id = 'portfolio')
with check (bucket_id = 'portfolio');
```
