import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ConceptPreviewPage } from "@/components/design-preview/concept-preview-page";
import { designPreviewConcepts, getDesignPreviewConcept } from "@/lib/design-preview";
import { getPublishedPortfolios } from "@/lib/portfolio";

export const revalidate = 600;
export const dynamicParams = false;

type DesignConceptPageProps = {
  params: Promise<{
    concept: string;
  }>;
};

export function generateStaticParams() {
  return designPreviewConcepts.map((concept) => ({
    concept: concept.slug,
  }));
}

export async function generateMetadata({ params }: DesignConceptPageProps): Promise<Metadata> {
  const { concept: conceptSlug } = await params;
  const concept = getDesignPreviewConcept(conceptSlug);

  return {
    title: concept ? `${concept.name} Preview` : "Design Preview",
  };
}

export default async function DesignConceptPage({ params }: DesignConceptPageProps) {
  const { concept: conceptSlug } = await params;
  const concept = getDesignPreviewConcept(conceptSlug);

  if (!concept) {
    notFound();
  }

  const projects = await getPublishedPortfolios();

  return <ConceptPreviewPage concept={concept} pageKind="home" projects={projects} />;
}
