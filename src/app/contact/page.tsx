import { contactLinks, siteConfig } from "@/lib/site";

export const metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <div className="px-5 pb-16 pt-36 sm:px-10 sm:pt-44 lg:px-12">
      <section className="mx-auto flex min-h-[58vh] max-w-[1760px] flex-col justify-between gap-14">
        <header>
          <p className="text-[12px] font-normal uppercase tracking-[0.09em]">Contact</p>
        </header>

        <div className="grid max-w-4xl gap-6 text-[15px] font-normal leading-7 sm:text-[19px] sm:leading-9">
          <p>{siteConfig.name}</p>
          <div className="grid gap-1">
            <a href={contactLinks.phone} className="w-fit underline-offset-4 hover:underline">
              {siteConfig.phone}
            </a>
            <a href={contactLinks.email} className="w-fit underline-offset-4 hover:underline">
              {siteConfig.email}
            </a>
          </div>
          <address className="not-italic">{siteConfig.address}</address>
        </div>
      </section>
    </div>
  );
}
