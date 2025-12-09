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
        paddingTop: props.paddingTop ?? 100,
      }}
    >
      <div className="container">
        <div className="row">
          <div className="col col-xs-12">
            <div className="wpo-breadcumb-wrap">
              <ol>
                <li>{props.pagesub}</li>
              </ol>
              <h2 className="fade_bottom">{props.pageTitle}</h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PageTitle;
