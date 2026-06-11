import { contactLinks, siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Contact",
};

const contactItems = [
  {
    label: "Company",
    value: siteConfig.name,
  },
  {
    label: "Email",
    value: siteConfig.email,
    href: contactLinks.email,
  },
  {
    label: "Phone",
    value: siteConfig.phone,
    href: contactLinks.phone,
  },
  {
    label: "Address",
    value: siteConfig.address,
  },
];

const contactHeroImage = "/contact-hero.png";

export default function ContactPage() {
  return (
    <main className="px-5 pb-20 pt-44 sm:px-10 sm:pt-52 lg:px-12 lg:pt-56">
      <div className="mx-auto grid max-w-[1180px] gap-12">
        <header className="grid gap-6">
          <h1 className="text-[34px] font-normal uppercase tracking-[0.08em] sm:text-[46px] lg:text-[56px]">
            Contact
          </h1>
          <p className="max-w-xl whitespace-pre-line text-[15px] leading-8 text-muted sm:text-[16px]">
            프로젝트 문의는 아래의 연락처로{"\n"}연락 주시면 빠르게 답변드리겠습니다.
          </p>
        </header>

        <div className="h-px w-full bg-line" />

        <section className="grid gap-7">
          {contactItems.map((item) => (
            <div key={item.label} className="grid gap-2 border-b border-line pb-7 sm:grid-cols-[180px_1fr] sm:gap-8">
              <p className="text-[12px] font-medium uppercase tracking-[0.12em]">{item.label}</p>
              {item.href ? (
                <a href={item.href} className="text-[15px] leading-7 underline-offset-4 hover:underline sm:text-[16px]">
                  {item.value}
                </a>
              ) : (
                <p className="text-[15px] leading-7 sm:text-[16px]">{item.value}</p>
              )}
            </div>
          ))}
        </section>

        {contactHeroImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={contactHeroImage}
            alt="HOW DESIGN interior"
            className="h-[260px] w-full object-cover object-center sm:h-[380px] lg:h-[460px]"
          />
        ) : (
          <div className="grid h-[260px] w-full place-items-center bg-[#f5f5f5] text-[12px] uppercase tracking-[0.12em] text-muted sm:h-[380px] lg:h-[460px]">
            HOW DESIGN
          </div>
        )}

      </div>
    </main>
  );
}
