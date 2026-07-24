export type DesignPreviewConcept = {
  slug: `concept-${1 | 2 | 3 | 4 | 5}`;
  number: string;
  name: string;
  description: string;
  benchmark: string;
};

export const designPreviewConcepts: DesignPreviewConcept[] = [
  {
    slug: "concept-1",
    number: "01",
    name: "Light Editorial Luxury",
    description:
      "아이보리 여백과 세리프 타이포, 큰 이미지가 어우러지는 부드러운 프리미엄 에디토리얼 방향",
    benchmark: "Yabu Pushelberg · premium residential editorial",
  },
  {
    slug: "concept-2",
    number: "02",
    name: "Dark Luxury Editorial Portfolio",
    description:
      "차콜 배경과 시네마틱 이미지로 첫인상을 강화한 호텔·레스토랑·상업공간 중심의 다크 포트폴리오",
    benchmark: "Awwwards dark editorial · boutique hospitality",
  },
  {
    slug: "concept-3",
    number: "03",
    name: "Warm Minimal Studio",
    description:
      "재료의 온도와 조용한 여백을 강조해 오래 보아도 편안한 주거·스튜디오 중심의 미니멀 방향",
    benchmark: "Norm Architects · warm Scandinavian minimalism",
  },
  {
    slug: "concept-4",
    number: "04",
    name: "Structured Architecture Grid",
    description:
      "얇은 선과 명확한 정보 체계로 설계 전문성과 신뢰감을 전달하는 건축 스튜디오형 그리드",
    benchmark: "International architecture office · Swiss grid",
  },
  {
    slug: "concept-5",
    number: "05",
    name: "Cinematic Boutique Portfolio",
    description:
      "풀 스크린 프로젝트 이미지와 절제된 오버레이로 브랜드의 감도와 시각적 임팩트를 극대화한 방향",
    benchmark: "Studio KO · cinematic boutique portfolio",
  },
];

export function getDesignPreviewConcept(slug: string) {
  return designPreviewConcepts.find((concept) => concept.slug === slug);
}
