import Image from "next/image";

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
    <main className="px-5 pb-24 pt-10 sm:px-10 sm:pt-12 lg:px-12 lg:pt-14">
      <div className="mx-auto grid max-w-[1180px] gap-11 sm:gap-12">
        <header className="grid gap-5 sm:gap-6">
          <h1 className="text-[32px] font-normal uppercase leading-none tracking-[0.08em] sm:text-[44px] lg:text-[54px]">
            Contact
          </h1>
          <p className="max-w-2xl whitespace-pre-line text-[14px] leading-7 text-muted sm:text-[15px] sm:leading-8">
            프로젝트 문의는 아래 연락처로 남겨주세요.
            <br />
            공간의 목적과 일정에 맞춰 차분하게 안내드리겠습니다.
          </p>
        </header>

        <div className="h-px w-full bg-line" />

        <section className="grid">
          {contactItems.map((item) => (
            <div key={item.label} className="grid gap-2 border-b border-line py-6 sm:grid-cols-[180px_1fr] sm:gap-8">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">{item.label}</p>
              {item.href ? (
                <a href={item.href} className="w-fit text-[15px] leading-7 underline-offset-4 hover:underline sm:text-[16px]">
                  {item.value}
                </a>
              ) : (
                <p className="text-[15px] leading-7 sm:text-[16px]">{item.value}</p>
              )}
            </div>
          ))}
        </section>

        {contactHeroImage ? (
          <Image
            src={contactHeroImage}
            alt="HOW DESIGN interior"
            width={1400}
            height={860}
            sizes="(max-width: 1024px) 100vw, 1180px"
            className="h-[260px] w-full object-cover object-center sm:h-[360px] lg:h-[440px]"
          />
        ) : (
          <div className="grid h-[260px] w-full place-items-center bg-[#f5f5f5] text-[12px] uppercase tracking-[0.12em] text-muted sm:h-[360px] lg:h-[440px]">
            HOW DESIGN
          </div>
        )}
      </div>
    </main>
  );
}
