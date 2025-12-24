/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from "next/link";
// import Services from "../../api/Services";
import Image from "next/image";
import Services from "@/app/api/templates-api/Services";
import { useSiteSettings } from "@/lib/providers/SiteSettingProvider";
import AntiBacteria from "@/public/images/key-features/anti-bacteria.jpg";
import AntiFingerprint from "@/public/images/key-features/anti-fingerprint.jpg";
import SoftTouch from "@/public/images/key-features/soft-touch.jpg";
import Miracore from "@/public/images/key-features/miracore.jpg";
import { useTranslations } from "next-intl";

const ClickHandler = () => {
  window.scrollTo(10, 0);
};

const imageMap: Record<string, any> = {
  "anti-bacteria": AntiBacteria,
  "anti-fingerprint": AntiFingerprint,
  "soft-touch": SoftTouch,
  miracore: Miracore,
};
const ServiceSectionS6 = (props: { hclass: string }) => {
  const data = useSiteSettings();

  const t = useTranslations("home");

  const features = t.raw("features") as [
    { title: string; description: string; image: string; id: string }
  ];

  return (
    <section className={"mt-3 " + props.hclass}>
      <div className="container">
        <div className="service-wrap">
          <div className="title fade_bottom">
            <h2>{t("key_features.title")}</h2>
            <p>{t("key_features.description")}</p>
          </div>
          <div className="row ms-lg-3 ms-0">
            {features.slice(0, 4).map((service, item) => (
              <div className="col-md-6 col-12 fade_bottom" key={item}>
                <div className="service-card">
                  <div className="content">
                    <div className="icon">
                      <Image
                        width={600}
                        height={500}
                        src={imageMap[service?.id]} // Now TypeScript knows this is safe
                        alt="Oak collection icon"
                      />
                    </div>
                    <h2>
                      <Link href={"#"}>{service.title}</Link>
                    </h2>
                    <p>{service.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceSectionS6;
