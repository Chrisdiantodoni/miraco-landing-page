"use client";

// images
import Logo from "@/public/images/miraco/logo/logo-miraco-light.png";
import Image from "next/image";
import { useSiteSettings } from "@/lib/providers/SiteSettingProvider";
import { SocialWidget } from "./SocialWidget";
import { Link } from "@/i18n/navigation";

const ClickHandler = () => {
  window.scrollTo(10, 0);
};

const Footer = (props: { logo: string }) => {
  const data = useSiteSettings();

  console.log({ props });

  return (
    <footer className="wpo-site-footer">
      <div className="wpo-upper-footer">
        <div className="container-fluid">
          <div className="row">
            <div
              className="col col-lg-4 col-md-6 col-sm-12 col-12 scroll-text-animation"
              data-animation="fade_from_bottom"
            >
              <div className="widget about-widget">
                <div className="logo widget-title">
                  <Image src={Logo} alt="blog" width={400} height={200} />
                </div>
                <p>
                  Miraco menghadirkan High Pressure Laminates berkualitas tinggi
                  dengan standar arsitektur modern. Dibuat dengan presisi untuk
                  menghadirkan ketahanan, estetika, dan nilai jangka panjang
                  pada setiap ruang.
                </p>
                <SocialWidget
                  social={data?.site_settings}
                  onClick={ClickHandler}
                />
              </div>
            </div>
            <div
              className="col col-lg-4 col-md-6 col-sm-12 col-12 scroll-text-animation"
              data-animation="fade_from_bottom"
            >
              <div className="widget link-widget">
                <div className="widget-title">
                  <h3>Contact</h3>
                </div>
                <ul>
                  <li>{data?.site_settings?.email_contacts}</li>
                  <li>{data?.site_settings?.phone_contacts}</li>
                  <li>{data?.site_settings?.address}</li>
                </ul>
              </div>
            </div>
            <div
              className="col col-lg-4 col-md-6 col-sm-12 col-12 scroll-text-animation"
              data-animation="fade_from_bottom"
            >
              <div className="widget link-widget">
                <div className="widget-title">
                  <h3>Quick Link</h3>
                </div>
                <ul>
                  <li>
                    <Link onClick={ClickHandler} href="/request">
                      Request
                    </Link>
                  </li>
                  <li>
                    <Link onClick={ClickHandler} href="/projects">
                      Projects
                    </Link>
                  </li>
                  <li>
                    <Link onClick={ClickHandler} href="/locate-us">
                      Locate Us
                    </Link>
                  </li>
                  <li>
                    <Link onClick={ClickHandler} href="/e-catalogue">
                      E-Catalogue
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            {/* <div
              className="col col-lg-3 col-md-6 col-sm-12 col-12 scroll-text-animation"
              data-animation="fade_from_bottom"
            >
              <div className="widget newsletter-widget">
                <div className="widget-title">
                  <h3>Newsletter</h3>
                </div>
                <form>
                  <input
                    type="email"
                    className="input-fild"
                    placeholder="Your Email..."
                  />
                  <button>Subscribe</button>
                </form>
              </div>
            </div> */}
          </div>
        </div>
      </div>
      <div className="wpo-lower-footer">
        <div className="container-fluid">
          <div className="row g-0">
            <div className="col col-lg-6 col-12">
              <p className="copyright">
                {" "}
                Copyright &copy; 2025 Miraco. All Rights Reserved.
              </p>
            </div>
            {/* <div className="col col-lg-6 col-12">
              <ul className="right">
                <li>
                  <Link onClick={ClickHandler} href="/privacy">
                    <span className="rolling-text">privacy & Policy</span>{" "}
                  </Link>
                </li>
                <li>
                  <Link onClick={ClickHandler} href="/terms">
                    <span className="rolling-text">Terms</span>
                  </Link>
                </li>
                <li>
                  <Link onClick={ClickHandler} href="/about">
                    <span className="rolling-text">About us</span>
                  </Link>
                </li>
                <li>
                  <Link onClick={ClickHandler} href="/login">
                    <span className="rolling-text">Login</span>
                  </Link>
                </li>
              </ul>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
