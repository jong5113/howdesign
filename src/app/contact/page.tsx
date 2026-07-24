import Image from "next/image";

import { contactLinks, siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Contact",
};

const contactItems = [
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
    <div className="public-shell contact-page">
      <header className="contact-heading site-container contact-layout">
        <div>
          <p className="architecture-label">Contact / HOW DESIGN</p>
          <h1>
            Let&apos;s discuss
            <br />
            your space.
          </h1>
        </div>
        <p>
          프로젝트의 용도, 위치, 예상 일정과 함께 문의해 주세요.
          검토 후 상담 가능한 일정을 안내해 드립니다.
        </p>
      </header>

      <section
        className="contact-information site-container contact-layout"
        aria-label="Contact information"
      >
        {contactItems.map((item, index) => (
          <div key={item.label} className="contact-information__row">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <p>{item.label}</p>
            {item.href ? (
              <a href={item.href}>
                {item.value}
              </a>
            ) : (
              <p>{item.value}</p>
            )}
          </div>
        ))}
      </section>

      <section className="contact-image site-container contact-layout">
        <div className="contact-image__visual">
          <Image
            src={contactHeroImage}
            alt="HOW DESIGN interior"
            width={1600}
            height={900}
            priority
            sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) calc(100vw - 64px), (max-width: 1279px) calc(100vw - 96px), 1184px"
            className="contact-image__media"
          />
        </div>
        <div className="contact-image__caption">
          <span>Office / Seoul</span>
          <span>Interior design &amp; construction</span>
        </div>
      </section>

      <section className="contact-process site-container contact-layout">
        <p className="architecture-label">Consultation</p>
        <div>
          <strong>01</strong>
          <p>프로젝트 기본 정보 전달</p>
        </div>
        <div>
          <strong>02</strong>
          <p>검토 및 상담 일정 안내</p>
        </div>
        <div>
          <strong>03</strong>
          <p>현장 미팅과 설계 범위 협의</p>
        </div>
      </section>
    </div>
  );
}
