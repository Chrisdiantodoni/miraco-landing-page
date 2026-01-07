"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter, Link } from "@/i18n/navigation";
import { Project } from "@/lib/types";
import { getProductFormattedCode } from "@/lib/util";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import miraedge from "@/public/images/miraco/miraedge/miraedge.png";

interface ProjectDetailProps {
  project: Project;
}

const ProjectDetail = ({ project }: ProjectDetailProps) => {
  const router = useRouter();

  // Get all images (thumbnail + additional)
  const getMediaByType = (type: string) => {
    return project?.media?.find((media) => media?.type === type)?.image_url;
  };

  const projectThumbnail = getMediaByType("project_thumbnail");
  const additionalImages =
    project?.media?.filter(
      (media) => media?.type === "additional_image_projects"
    ) || [];

  // Combine thumbnail and additional images
  const allImages = [
    ...(projectThumbnail
      ? [
          {
            id: "thumbnail",
            type: "project_thumbnail",
            image_url: projectThumbnail,
          },
        ]
      : []),
    ...additionalImages,
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };

  const renderLinkOrText = (text: string, link: string | null) => {
    if (link && link !== "#") {
      return (
        <Link
          prefetch
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="credit-link"
        >
          {text}
        </Link>
      );
    }
    return <>{text}</>;
  };
  const handleBack = () => {
    router.back();
  };
  return (
    <div className="project-detail-page">
      {/* Hero Section with Gallery */}
      <section className="hero-section">
        <div className="max-width-container">
          {/* <h1 className="project-title">{project?.project_name}</h1> */}

          {/* Main Image with Navigation */}
          {allImages.length > 0 && (
            <div className="main-image-wrapper">
              <Image
                src={allImages[currentImageIndex]?.image_url}
                alt={project?.project_name || "Project"}
                width={1400}
                height={788}
                priority
                style={{ width: "100%", height: "auto" }}
              />

              {allImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="nav-button nav-button-left"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={32} />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="nav-button nav-button-right"
                    aria-label="Next image"
                  >
                    <ChevronRight size={32} />
                  </button>
                </>
              )}
            </div>
          )}

          {/* Thumbnail Gallery */}
          {allImages.length > 1 && (
            <div className="thumbnail-gallery">
              {allImages.map((img, index) => (
                <div
                  key={img.id}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`thumbnail-item ${
                    currentImageIndex === index ? "active" : ""
                  }`}
                >
                  <Image
                    src={img.image_url}
                    alt={`Thumbnail ${index + 1}`}
                    width={120}
                    height={80}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              ))}
            </div>
          )}
          <div className="project-back-btn">
            <Link href={`/projects`} prefetch>
              Back to Projects
            </Link>
          </div>
          {/* Caption */}

          {/* Project Info - Center Aligned */}
          <div className="project-info">
            <div className="info-item">
              <span className="info-label">Project</span>
              <span className="info-value">{project?.project_name}</span>
            </div>
            {project?.caption && (
              <div
                className="project-caption"
                dangerouslySetInnerHTML={{ __html: project.caption }}
              />
            )}

            {project?.project_type?.project_type && (
              <div className="info-item">
                <span className="info-label">Type</span>
                <span className="info-value">
                  {project.project_type.project_type}
                </span>
              </div>
            )}

            <div className="info-item">
              <span className="info-label">Location</span>
              <span className="info-value">{project?.country}</span>
            </div>
          </div>

          {/* Credits Section with Separator */}
          {(project?.designed_by || project?.photos_by) && (
            <div className="credits-section">
              {project?.designed_by && (
                <div className="credit-item">
                  <span className="credit-label">Designed By</span>
                  <span className="credit-value">
                    {renderLinkOrText(
                      project.designed_by,
                      project.link_designed_by
                    )}
                  </span>
                </div>
              )}

              {project?.designed_by && project?.photos_by && (
                <span className="separator">|</span>
              )}

              {project?.photos_by && (
                <div className="credit-item">
                  <span className="credit-label">Photos By</span>
                  <span className="credit-value">
                    {renderLinkOrText(
                      project.photos_by,
                      project.link_photos_by
                    )}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      {project?.featured_project_products &&
        project.featured_project_products.length > 0 && (
          <section className="products-section">
            <div className="max-width-container">
              <h2 className="section-title">Featured Products</h2>
              <p className="section-subtitle">
                Products and materials used in this project
              </p>

              <div className="products-grid">
                {project.featured_project_products.map((featured) => {
                  const thumbnailProduct = featured?.media?.find(
                    (find) => find?.type === "product_thumbnail"
                  )?.image_url;
                  return (
                    <Link
                      prefetch
                      href={`/collections/products/${featured?.id}`}
                      key={featured.id}
                    >
                      <div className="product-card-projects">
                        <div className="product-image-wrapper-projects">
                          {thumbnailProduct ? (
                            <Image
                              src={thumbnailProduct}
                              alt={featured?.name || "Product"}
                              width={300}
                              height={300}
                              className="product-image"
                              style={{ width: "100%", height: "auto" }}
                            />
                          ) : (
                            <div className="product-placeholder"></div>
                          )}
                        </div>
                        <div className="product-info">
                          <div className="product-text">
                            <h3 className="product-name">{featured?.name}</h3>
                            <h3 className="product-code">
                              {getProductFormattedCode(featured) || "Product"}
                            </h3>
                          </div>
                          {featured?.is_available_in_miraedge == 1 && (
                            <div className="product-icon">
                              <Image
                                src={miraedge}
                                alt="Product Icon"
                                width={16}
                                height={16}
                                className="product-icon"
                                style={{
                                  objectFit: "contain",
                                  flexShrink: 0,
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}
    </div>
  );
};

export default ProjectDetail;
