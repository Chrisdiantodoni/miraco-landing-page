/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "@/i18n/navigation";
import { Project } from "@/lib/types";
import { getProductFormattedCode } from "@/lib/util";

interface ProjectDetailProps {
  project: Project;
}

const ProjectDetail = ({ project }: ProjectDetailProps) => {
  const router = useRouter();

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Helper function untuk mendapatkan media berdasarkan type
  const getMediaByType = (type: string) => {
    return project?.media?.find((media) => media?.type === type)?.image_url;
  };

  const projectThumbnail = getMediaByType("project_thumbnail");
  const additionalImages =
    project?.media?.filter(
      (media) => media?.type === "additional_image_projects"
    ) || [];

  // Render project info item
  const renderInfoItem = (label: string, value: string | any) => (
    <li>
      <span>{label}</span>
      <span>{value}</span>
    </li>
  );

  // Render link atau text biasa
  const renderLinkOrText = (text: string, link?: string) => {
    if (link) {
      return (
        <a href={link} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      );
    }
    return <>{text}</>;
  };

  return (
    <>
      {/* Hero Section */}
      <section className="project-single-page mt-5">
        <div className="container-fluid">
          <div
            className="project-image scroll-text-animation"
            data-animation="fade_from_bottom"
          >
            {projectThumbnail && (
              <Image
                src={projectThumbnail}
                alt={project?.project_name || "Project"}
                width={1280}
                height={720}
                priority
              />
            )}
          </div>

          <div className="row">
            {/* Project Content */}
            <div className="col-lg-8 col-12">
              <div className="content">
                <h2
                  className="scroll-text-animation"
                  data-animation="fade_from_bottom"
                >
                  {project?.project_name}
                </h2>
                {project?.caption && (
                  <div
                    dangerouslySetInnerHTML={{ __html: project.caption }}
                    className="caption-content"
                  />
                )}
              </div>
            </div>

            {/* Project Info Sidebar */}
            <div
              className="col-lg-4 col-12 scroll-text-animation"
              data-animation="fade_from_bottom"
            >
              <div className="description">
                <h3>Project Info:</h3>
                <ul>
                  {renderInfoItem("Project", project?.project_name)}

                  {project?.project_type?.project_type &&
                    renderInfoItem("Type", project.project_type.project_type)}

                  {project?.designed_by &&
                    renderInfoItem(
                      "Designed By",
                      renderLinkOrText(
                        project.designed_by,
                        project.link_designed_by ?? "#"
                      )
                    )}

                  {project?.photos_by &&
                    renderInfoItem(
                      "Photos By",
                      renderLinkOrText(
                        project.photos_by,
                        project?.link_photos_by ?? "#"
                      )
                    )}

                  {renderInfoItem("Location", project?.country)}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Gallery */}
      {additionalImages.length > 0 && (
        <section className="solve-section">
          <div className="container-fluid">
            <div className="project-title">
              <div className="row align-items-center">
                <div className="col-lg-6 col-12">
                  <h2
                    className="scroll-text-animation"
                    data-animation="fade_from_bottom"
                  >
                    Project Gallery
                  </h2>
                </div>
                {/* <div className="col-lg-6 col-12">
                  <p
                    className="scroll-text-animation"
                    data-animation="fade_from_bottom"
                  >
                    Explore more details and perspectives of this project
                    through our carefully curated gallery.
                  </p>
                </div> */}
              </div>
            </div>

            <div className="image-wrap">
              <div className="row">
                {additionalImages.slice(0, 6).map((media, index) => (
                  <div
                    className="col-lg-4 col-md-6 col-12 scroll-text-animation"
                    data-animation="fade_from_bottom"
                    key={media.id}
                  >
                    <div className="image">
                      <Image
                        src={media.image_url}
                        alt={`${project.project_name} - Image ${index + 1}`}
                        width={600}
                        height={400}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Project Highlight */}
      {/* {contentImage && (
        <section className="summery-section">
          <div className="container-fluid">
            <div className="project-title">
              <div className="row align-items-center">
                <div className="col-lg-6 col-12">
                  <h2
                    className="scroll-text-animation"
                    data-animation="fade_from_bottom"
                  >
                    Project Highlight
                  </h2>
                </div>
                <div className="col-lg-6 col-12">
                  <p
                    className="scroll-text-animation"
                    data-animation="fade_from_bottom"
                  >
                    Featured view showcasing the key aspects and design elements
                    of this project.
                  </p>
                </div>
              </div>
            </div>

            <div
              className="wraper"
              style={{ backgroundImage: `url(${contentImage})` }}
            >
              <div className="video-wrap">
                <div className="video-holder"></div>
              </div>
            </div>
          </div>
        </section>
      )} */}

      {/* Featured Products */}
      {project?.featured_products && project.featured_products.length > 0 && (
        <section className="featured-products-section">
          <div className="container-fluid">
            <div className="project-title">
              <div className="row align-items-center">
                <div className="col-lg-6 col-12">
                  <h2
                    className="scroll-text-animation"
                    data-animation="fade_from_bottom"
                  >
                    Featured Products
                  </h2>
                </div>
                <div className="col-lg-6 col-12">
                  <p
                    className="scroll-text-animation"
                    data-animation="fade_from_bottom"
                  >
                    Products and materials used in this project.
                  </p>
                </div>
              </div>
            </div>

            <div className="item-wrap">
              <div className="row">
                {project.featured_products.map((featured) => {
                  const thumbnailProduct = featured?.media?.find(
                    (find) => find?.type == "product_thumbnail"
                  )?.image_url;
                  return (
                    <div
                      className="col-lg-3 col-md-4 col-6 scroll-text-animation"
                      data-animation="fade_from_bottom"
                      key={featured.id}
                    >
                      <div className="product-item">
                        {thumbnailProduct ? (
                          <div className="image">
                            <Image
                              src={thumbnailProduct}
                              alt={featured?.name || "Product"}
                              width={300}
                              height={300}
                            />
                          </div>
                        ) : (
                          <div className="placeholder-image-project"></div>
                        )}
                        <div className="content">
                          <h3>
                            {getProductFormattedCode(featured) || "Product"}
                          </h3>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related Projects */}
    </>
  );
};

export default ProjectDetail;
