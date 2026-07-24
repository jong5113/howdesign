export type DesignPreviewSlug = "concept-2" | "concept-4";
export type DesignPreviewPageKind = "home" | "project" | "contact";

export type DesignPreviewConcept = {
  slug: DesignPreviewSlug;
  number: "02" | "04";
  name: string;
  description: string;
  benchmark: string;
};

export const designPreviewConcepts: DesignPreviewConcept[] = [
  {
    slug: "concept-2",
    number: "02",
    name: "Dark Luxury Editorial Portfolio",
    description:
      "강한 첫인상과 프리미엄 상업공간 포트폴리오에 적합한 다크 에디토리얼 방향",
    benchmark: "Dark editorial · boutique hospitality",
  },
  {
    slug: "concept-4",
    number: "04",
    name: "Structured Architecture Grid",
    description:
      "명확한 정보 구조와 전문성을 강조하는 밝은 아키텍처 스튜디오 방향",
    benchmark: "Architecture office · structured Swiss grid",
  },
];

export const designPreviewPageCopy: Record<
  DesignPreviewPageKind,
  { label: string; title: string; description: string }
> = {
  home: {
    label: "HOME PREVIEW",
    title: "Home",
    description: "브랜드 첫인상과 주요 프로젝트를 보여주는 홈 화면입니다.",
  },
  project: {
    label: "PROJECT DETAIL PREVIEW",
    title: "Project Detail",
    description: "실제 프로젝트 정보와 상세 이미지를 적용한 현장 상세 화면입니다.",
  },
  contact: {
    label: "CONTACT PREVIEW",
    title: "Contact",
    description: "문의에 필요한 회사 정보를 각 콘셉트의 언어로 정리한 화면입니다.",
  },
};

export function getDesignPreviewConcept(slug: string) {
  return designPreviewConcepts.find((concept) => concept.slug === slug);
}

export function getDesignPreviewPagePath(
  conceptSlug: DesignPreviewSlug,
  pageKind: DesignPreviewPageKind,
) {
  return pageKind === "home"
    ? `/design-preview/${conceptSlug}`
    : `/design-preview/${conceptSlug}/${pageKind}`;
}
