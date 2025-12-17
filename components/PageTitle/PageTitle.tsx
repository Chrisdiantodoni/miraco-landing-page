/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

const PageTitle = (props: {
  pagesub?: string;
  pageTitle: string;
  showTopLine?: boolean;
  showBottomLine?: boolean;
  paddingTop?: number;
  paddingBottom?: number;
  className?: string;
  marginTop?: number;
  marginBottom?: number;
}) => {
  const decodedTitle = decodeURIComponent(props.pageTitle);
  const decodedPageSub = decodeURIComponent(props.pagesub ?? "");
  const showTopLine = props.showTopLine ?? true;
  const showBottomLine = props.showBottomLine ?? true;
  const paddingTop = props.paddingTop;
  const paddingBottom = props.paddingBottom;
  const className = props.className;
  const marginTop = props.marginTop;
  const marginBottom = props.marginBottom;

  const getLineClasses = () => {
    if (!showTopLine && !showBottomLine) {
      return "no-lines";
    }
    if (!showTopLine) {
      return "no-top-line";
    }
    if (!showBottomLine) {
      return "no-bottom-line";
    }
    return "";
  };

  const lineClasses = getLineClasses();
  const containerClasses = `wpo-page-title ${lineClasses} ${className}`.trim();

  const containerStyle: React.CSSProperties = {
    paddingTop: paddingTop !== undefined ? `${paddingTop}px` : undefined,
    paddingBottom:
      paddingBottom !== undefined ? `${paddingBottom}px` : undefined,
    marginTop: marginTop !== undefined ? `${marginTop}px` : undefined,
    marginBottom: marginBottom !== undefined ? `${marginBottom}px` : undefined,
  };
  return (
    <section className={`${containerClasses}`} style={containerStyle}>
      {/* Minimal floating dots */}
      {/* <div className="minimal-dot"></div>
      <div className="minimal-dot"></div>
      <div className="minimal-dot"></div> */}

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
