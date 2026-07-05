import { PortfolioGrid } from "@/components/portfolio-grid";
import { getFeaturedPortfolios } from "@/lib/portfolio";

export const revalidate = 600;

export default async function HomePage() {
  const featuredPortfolios = await getFeaturedPortfolios();

  return (
    <div className="px-5 pb-20 pt-8 sm:px-10 sm:pt-12 lg:px-12">
      <div className="mx-auto grid max-w-[1440px] gap-9 sm:gap-11 lg:gap-12">
        <section className="grid max-w-3xl gap-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Interior Design & Construction</p>
          <h1 className="max-w-2xl text-[28px] font-normal uppercase leading-tight tracking-[0.08em] sm:text-[38px] lg:text-[46px]">
            WORK
          </h1>
          <p className="max-w-xl text-[14px] leading-7 text-muted sm:text-[15px]">
            HOW DESIGN creates calm residential and commercial spaces through detail-led planning, material balance,
            and practical construction.
          </p>
        </section>
        <PortfolioGrid items={featuredPortfolios} />
      </div>
    </div>
  );
}
