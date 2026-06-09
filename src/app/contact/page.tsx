import { contactLinks, siteConfig } from "@/lib/site";

export const metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <div className="px-4 pb-14 pt-14 sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[60vh] max-w-[1760px] flex-col justify-between gap-16">
        <header className="border-b border-line pb-3">
          <p className="text-xs font-normal uppercase tracking-wide">Contact</p>
        </header>

        <div className="grid max-w-5xl gap-7 text-base font-normal leading-7 sm:text-xl sm:leading-9">
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
