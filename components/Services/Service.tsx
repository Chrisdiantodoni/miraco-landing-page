"use client";
import Link from "next/link";
// import Services from "../../api/Services";
import Image from "next/image";
import Services from "@/app/api/templates-api/Services";
import { useSiteSettings } from "@/lib/providers/SiteSettingProvider";

const ClickHandler = () => {
  window.scrollTo(10, 0);
};
const ServiceSectionS6 = (props: { hclass: string }) => {
  const data = useSiteSettings();

  // console.log();
  return (
    <section className={"" + props.hclass}>
      <div className="container">
        <div className="service-wrap">
          <div className="title fade_bottom">
            <h2>Our Services For You</h2>
            <p>
              Blaze is a trailblazing architecture agency renowned for its
              innovative approach to design, where creativity meets
              functionality. From futuristic skyscrapers to timeless cultural
              landmarks, Blaze specializes in crafting spaces that inspire and
              endure.
            </p>
          </div>
          <div className="row">
            {Services.slice(0, 4).map((service, item) => (
              <div className="col-md-6 col-12 fade_bottom" key={item}>
                <div className="service-card">
                  <div className="content">
                    <div className="icon">
                      {(() => {
                        const oakCollection = data?.collections?.find(
                          (find) => find.collection_name == "Oak"
                        );

                        return oakCollection?.image_url ? (
                          <Image
                            width={600}
                            height={500}
                            src={service.SImg} // Now TypeScript knows this is safe
                            alt="Oak collection icon"
                          />
                        ) : (
                          <div className="placeholder">No Image Available</div>
                        );
                      })()}
                    </div>
                    <h2>
                      <Link
                        onClick={ClickHandler}
                        href={"/service-single/[slug]"}
                        as={`/service-single/${service.slug}`}
                      >
                        {service.title}
                      </Link>
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
