/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

const PageTitle = (props: { pagesub: string; pageTitle: string }) => {
  const decodedTitle = decodeURIComponent(props.pageTitle);
  const decodedPageSub = decodeURIComponent(props.pagesub);
  return (
    <section className={`wpo-page-title`}>
      {/* Minimal floating dots */}
      <div className="minimal-dot"></div>
      <div className="minimal-dot"></div>
      <div className="minimal-dot"></div>

      <div className="container">
        <div className="row">
          <div className="col col-xs-12">
            <div className="wpo-breadcumb-wrap">
              <h2 className="fade_bottom">{decodedTitle}</h2>
              <ol>
                <li>{decodedPageSub}</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PageTitle;
