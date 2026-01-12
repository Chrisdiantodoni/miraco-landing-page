"use client";

import PageTitle from "@/components/PageTitle/PageTitle";
import Error from "next/error";
import Image from "next/image";
import error from "@/public/images/error-404.png";
import Link from "next/link";

// Render the default Next.js 404 page when a route
// is requested that doesn't match the middleware and
// therefore doesn't have a locale associated with it.

export default function NotFound() {
  return (
    <html lang="en">
      <body>
        {/* <Error statusCode={404} /> */}
        <section className="error-404-section section-padding pt-0">
          {/* <PageTitle pageTitle={"Error"} pagesub={"Error 404"} /> */}
          <div className="container">
            <div className="row">
              <div className="col col-xs-12">
                <div className="content clearfix">
                  <div className="error">
                    <Image src={error} alt="" />
                  </div>
                  <div className="error-message">
                    <h3>Oops! Page Not Found!</h3>
                    <p>
                      We’re sorry but we can’t seem to find the page you
                      requested. This might be because you have typed the web
                      address incorrectly.
                    </p>
                    <Link
                      href="/"
                      className="theme-btn"
                      style={{
                        color: "#FEFEFE",
                      }}
                    >
                      Back to home
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </body>
    </html>
  );
}
