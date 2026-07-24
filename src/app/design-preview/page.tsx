import { DesignPreviewIndex } from "@/components/design-preview/design-preview-index";
import { getPublishedPortfolios } from "@/lib/portfolio";

export const revalidate = 600;

export default async function DesignPreviewPage() {
  const projects = await getPublishedPortfolios();

  return <DesignPreviewIndex projects={projects} />;
}
