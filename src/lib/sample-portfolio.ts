import type { PortfolioCategory, PortfolioItem } from "@/lib/types";

export const categoryLabels: Record<PortfolioCategory, string> = {
  residential: "주거공간",
  commercial: "상업공간",
};

export const categoryEnglishLabels: Record<PortfolioCategory, string> = {
  residential: "Residential",
  commercial: "Commercial",
};

export const samplePortfolios: PortfolioItem[] = [
  {
    id: "sample-01",
    title: "대동장어 여의도점",
    slug: "daedong-eel-yeouido",
    category: "commercial",
    subtitle: "Daedong Eel Yeouido",
    location: "서울 여의도",
    area: "60PY",
    scope: "올수리",
    duration: "8주",
    year: 2025,
    description: "상업공간의 회전 동선과 좌석 밀도를 정리하고, 식당의 분위기가 오래 유지되도록 마감과 조명을 계획한 프로젝트입니다.",
    coverImage:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=88",
    gallery: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=88",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=88",
    ],
    featured: true,
    published: true,
    order: 1,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "sample-02",
    title: "상도동 롯베캐슬비엔아파트 38PY",
    slug: "sangdo-lotte-castle-vien-38py",
    category: "residential",
    subtitle: "Sangdo Apartment Renovation",
    location: "서울 동작구",
    area: "38PY",
    scope: "올수리",
    duration: "6주 소요",
    year: 2025,
    description: "가족의 생활 패턴에 맞춰 수납, 조명, 주방 동선을 단순하고 오래 쓰기 좋은 구조로 정리한 주거공간입니다.",
    coverImage:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=88",
    gallery: [
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1600&q=88",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1600&q=88",
    ],
    featured: true,
    published: true,
    order: 2,
    createdAt: "2025-12-01T00:00:00.000Z",
  },
  {
    id: "sample-03",
    title: "광명역 도심공항 LOUNGE 투썸플레이스",
    slug: "gwangmyeong-airport-lounge-twosome",
    category: "commercial",
    subtitle: "Gwangmyeong Lounge Cafe",
    location: "경기도 광명시",
    area: "12PY",
    scope: "카페 라운지 조성",
    duration: "2주 소요",
    year: 2024,
    description: "짧은 공사기간 안에서 카페 운영 동선과 라운지 체류감을 함께 정리한 상업공간 프로젝트입니다.",
    coverImage:
      "https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1600&q=88",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=88",
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1600&q=88",
    ],
    featured: true,
    published: true,
    order: 3,
    createdAt: "2025-11-01T00:00:00.000Z",
  },
  {
    id: "sample-04",
    title: "Hannam Residence",
    slug: "hannam-residence",
    category: "residential",
    subtitle: "Minimal Residence",
    location: "서울 용산구",
    area: "42PY",
    scope: "전체 리모델링",
    duration: "7주",
    year: 2024,
    description: "밝은 바탕과 정돈된 선을 중심으로 생활의 흐름이 오래 유지되도록 계획한 주거공간입니다.",
    coverImage:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=88",
    gallery: [
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=88",
      "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1600&q=88",
    ],
    featured: false,
    published: true,
    order: 4,
    createdAt: "2025-10-01T00:00:00.000Z",
  },
];

export function getPublishedSamplePortfolios() {
  return samplePortfolios
    .filter((portfolio) => portfolio.published)
    .sort((current, next) => {
      if (current.order !== next.order) {
        return current.order - next.order;
      }

      return (next.createdAt || "").localeCompare(current.createdAt || "");
    });
}

export function getFeaturedSamplePortfolios() {
  return getPublishedSamplePortfolios().filter((portfolio) => portfolio.featured);
}

export function getPortfolioSampleBySlug(slug: string) {
  return getPublishedSamplePortfolios().find((portfolio) => portfolio.slug === slug);
}
