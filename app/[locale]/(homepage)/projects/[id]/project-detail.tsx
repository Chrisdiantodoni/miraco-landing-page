"use client";
import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "@/i18n/navigation";

// --- INTERFACE Definitions (Dibiarkan tetap di sini atau dipindah ke file types) ---

interface Media {
  id: number;
  path: string;
  type: string;
  image_url: string;
}

interface ProjectType {
  id: number;
  name: string;
}

interface FeaturedProduct {
  id: number;
  product_id: number;
  project_id: number;
  product?: {
    id: number;
    name: string;
    image_url?: string;
  };
}

interface Project {
  id: number;
  project_name: string;
  caption?: string;
  project_type_id: string;
  project_type?: ProjectType;
  country: string;
  designed_by?: string;
  link_designed_by?: string;
  photos_by?: string;
  link_photos_by?: string;
  created_at: string;
  media?: Media[];
  featured_products?: FeaturedProduct[];
}

interface RelatedProject {
  id: number;
  project_name: string;
  slug: string;
  thumbnail_url: string;
  project_type?: ProjectType;
}

interface ProjectDetailProps {
  project: Project;
  relatedProjects?: RelatedProject[];
}

// --- Komponen Utama ---

const ProjectDetail = ({
  project,
  relatedProjects = [],
}: ProjectDetailProps) => {
  const router = useRouter();

  const ClickHandler = () => {
    window.scrollTo(10, 0);
  };

  // ✅ Menggunakan useMemo untuk memproses data media hanya sekali
  const { projectThumbnail, contentImage, additionalImages } = useMemo(() => {
    const mediaList = project?.media || [];
    return {
      projectThumbnail: mediaList.find(
        (media) => media?.type === "project_thumbnail"
      )?.image_url,
      contentImage: mediaList.find((media) => media?.type === "content_image")
        ?.image_url,
      additionalImages: mediaList.filter(
        (media) => media?.type === "additional_image_projects"
      ),
    };
  }, [project?.media]);

  const hasAdditionalImages = additionalImages.length > 0;
  const hasFeaturedProducts =
    project?.featured_products && project.featured_products.length > 0;
  const hasRelatedProjects = relatedProjects.length > 0;

  // Helper untuk render info dengan link
  const renderInfoLink = (
    label: string,
    name: string | undefined,
    link: string | undefined
  ) => {
    if (!name) return null;
    return (
      <li>
        <span>{label}:</span>
        <span>
          {link ? (
            <a href={link} target="_blank" rel="noopener noreferrer">
              {name}
            </a>
          ) : (
            name
          )}
        </span>
      </li>
    );
  };

  return (
    <>
      {/* 1. Project Header & Info Section */}
      <section className="project-single-page">
        <div className="container">
          {/* Project Image */}
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
                style={{ width: "100%", height: "auto" }} // ✅ CSS: Image full width
              />
            )}
          </div>

          <div className="row align-items-start">
            {" "}
            {/* ✅ Align items start agar info box tidak ikut memanjang */}
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
                    // ✅ Catatan: Penggunaan dangerouslySetInnerHTML harus hati-hati.
                    dangerouslySetInnerHTML={{ __html: project.caption }}
                    className="caption-content"
                  />
                )}
              </div>
            </div>
            {/* Project Description / Info Box */}
            <div
              className="col-lg-4 col-12 scroll-text-animation"
              data-animation="fade_from_bottom"
            >
              <div className="description">
                <h3>Project Info:</h3>
                <ul>
                  <li>
                    <span>Project:</span>
                    <span>{project?.project_name}</span>
                  </li>
                  {project?.project_type?.name && (
                    <li>
                      <span>Type:</span>
                      <span>{project.project_type.name}</span>
                    </li>
                  )}

                  {renderInfoLink(
                    "Designed By",
                    project.designed_by,
                    project.link_designed_by
                  )}
                  {renderInfoLink(
                    "Photos By",
                    project.photos_by,
                    project.link_photos_by
                  )}

                  <li>
                    <span>Location:</span>
                    <span>{project?.country}</span>
                  </li>
                  {project?.created_at && (
                    <li>
                      <span>Date:</span>
                      <span>
                        {/* ✅ Formatting tanggal yang lebih bersih */}
                        {new Date(project.created_at).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "long", day: "numeric" }
                        )}
                      </span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Project Gallery / Additional Images Section */}
      {hasAdditionalImages && (
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
                <div className="col-lg-6 col-12">
                  <p
                    className="scroll-text-animation"
                    data-animation="fade_from_bottom"
                  >
                    Explore more details and perspectives of this project
                    through our carefully curated gallery.
                  </p>
                </div>
              </div>
            </div>
            <div className="image-wrap">
              <div className="row">
                {/* ✅ Batasi tampilan max 6, tapi render semua jika perlu */}
                {additionalImages.map((media, index) => (
                  <div
                    // ✅ Menggunakan col-12 untuk mobile agar tampilan rapi
                    className="col-lg-4 col-md-6 col-12 scroll-text-animation"
                    data-animation="fade_from_bottom"
                    key={media.id || index}
                  >
                    <div className="image">
                      <Image
                        src={media.image_url}
                        alt={`${project.project_name} - Image ${index + 1}`}
                        width={600}
                        height={400}
                        style={{ width: "100%", height: "auto" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. Project Highlight / Content Image Section */}
      {contentImage && (
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
            {/* ✅ Style latar dipindahkan ke inline */}
            <div
              className="wraper"
              style={{
                backgroundImage: `url(${contentImage})`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Tempatkan Video Button di sini jika diperlukan */}
              <div className="video-wrap">
                <div className="video-holder"></div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Featured Products Section */}
      {hasFeaturedProducts && (
        <section className="featured-products-section solve-section">
          {" "}
          {/* ✅ Reuse style solve-section untuk padding/background */}
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
                {project.featured_products!.map((featured, index) => (
                  <div
                    // ✅ Grid yang lebih fleksibel
                    className="col-lg-3 col-md-4 col-6 scroll-text-animation"
                    data-animation="fade_from_bottom"
                    key={featured.id || index}
                  >
                    <div className="product-item">
                      {featured.product?.image_url && (
                        <div className="image">
                          <Image
                            src={featured.product.image_url}
                            alt={featured.product.name || "Product"}
                            width={300}
                            height={300}
                            style={{ width: "100%", height: "auto" }}
                          />
                        </div>
                      )}
                      <div className="content">
                        <h3>
                          {featured.product?.name || `Product ${index + 1}`}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. Related Projects Section */}
      {hasRelatedProjects && (
        <section className="RelatedProject-section">
          <div className="container-fluid">
            <div className="project-title">
              <div className="row align-items-center">
                <div className="col-lg-6 col-12">
                  <h2
                    className="scroll-text-animation"
                    data-animation="fade_from_bottom"
                  >
                    Related Projects
                  </h2>
                </div>
                <div className="col-lg-6 col-12">
                  <p
                    className="scroll-text-animation"
                    data-animation="fade_from_bottom"
                  >
                    Explore more of our work with similar design approaches and
                    architectural styles.
                  </p>
                </div>
              </div>
            </div>
            <div className="item-wrap">
              <div className="row">
                {relatedProjects.slice(0, 3).map((relatedProject, index) => (
                  <div
                    // ✅ col-lg-4 untuk 3 item per baris
                    className="col-lg-4 col-md-6 col-12 scroll-text-animation"
                    data-animation="fade_from_bottom"
                    key={relatedProject.id || index}
                  >
                    <div className="item">
                      <div className="image">
                        <Image
                          src={relatedProject.thumbnail_url}
                          alt={relatedProject.project_name}
                          width={600}
                          height={400}
                          style={{ width: "100%", height: "auto" }}
                        />
                      </div>
                      <div className="content">
                        <h2>
                          <Link
                            onClick={ClickHandler}
                            href={`/project/${relatedProject.slug}`}
                          >
                            {relatedProject.project_name}
                          </Link>
                        </h2>
                        {relatedProject.project_type?.name && (
                          <span>{relatedProject.project_type.name}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default ProjectDetail;
