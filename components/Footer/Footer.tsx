"use client";
import Link from "next/link";

// images
import Logo from "@/public/images/logo-2.svg";
import Image from "next/image";
import { useSiteStore } from "@/lib/store/siteStore";

const ClickHandler = () => {
  window.scrollTo(10, 0);
};

const Footer = (props: { logo: string }) => {
  const { data } = useSiteStore();
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
                  {data?.site_settings?.logo_white_url && (
                    <Image
                      src={data.site_settings.logo_white_url}
                      alt="blog"
                      width={400}
                      height={200}
                    />
                  )}
                </div>
                <p>
                  Elit commodo nec urna erat morbi at hac turpis aliquam. In
                  tristique elit nibh turpis. Lacus volutpat ipsum convallis
                  tellus pellentesque etiam.
                </p>
                <div className="social-widget">
                  <ul>
                    <li>
                      <Link onClick={ClickHandler} href="#">
                        <i className="ti-facebook"></i>
                      </Link>
                      <Link onClick={ClickHandler} href="#">
                        <i className="ti-twitter-alt"></i>
                      </Link>
                      <Link onClick={ClickHandler} href="#">
                        <i className="ti-linkedin"></i>
                      </Link>
                      <Link onClick={ClickHandler} href="#">
                        <i className="ti-instagram"></i>
                      </Link>
                    </li>
                  </ul>
                </div>
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
                  <li>bliize@gmail.com</li>
                  <li>+(208) 555-0112</li>
                  <li>4517 Washington Ave.</li>
                  <li> Manchter, Kentucky 495</li>
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
                    <Link onClick={ClickHandler} href="/about">
                      <span className="rolling-text">About Us</span>{" "}
                    </Link>
                  </li>
                  <li>
                    <Link onClick={ClickHandler} href="/services">
                      <span className="rolling-text">Services</span>{" "}
                    </Link>
                  </li>
                  <li>
                    <Link onClick={ClickHandler} href="/projects">
                      <span className="rolling-text">Projects</span>
                    </Link>
                  </li>
                  <li>
                    <Link onClick={ClickHandler} href="/blog">
                      <span className="rolling-text">Blog</span>{" "}
                    </Link>
                  </li>
                  <li>
                    <Link onClick={ClickHandler} href="/contact">
                      <span className="rolling-text">Contact</span>
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
