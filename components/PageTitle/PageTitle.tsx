/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

const PageTitle = (props: {
  pagesub: string;
  pageTitle: string;
  paddingTop?: number;
}) => {
  return (
    <section
      className={`wpo-page-title`}
      style={{
        paddingTop: props.paddingTop ?? 120,
      }}
    >
      {/* Minimal floating dots */}
      <div className="minimal-dot"></div>
      <div className="minimal-dot"></div>
      <div className="minimal-dot"></div>

      <div className="container">
        <div className="row">
          <div className="col col-xs-12">
            <div className="wpo-breadcumb-wrap">
              <h2 className="fade_bottom">{props.pageTitle}</h2>
              <ol>
                <li>{props.pagesub}</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PageTitle;
