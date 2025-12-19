"use client";
import React from "react";
import Projects from "../../api/projects";

import Shape from "@/public/images/right-arrow-2.svg";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Project } from "@/lib/types";
import { ArrowRight } from "lucide-react";

const ClickHandler = () => {
  window.scrollTo(10, 0);
};

interface ProjectProps {
  hclass: string;
  projects: Project[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ProjectSection = (props: ProjectProps) => {
  const projects = props.projects;
  console.log({ projects });
  return (
    <section className={"" + props.hclass}>
      {/* <div className="title">
          <h2 className="fade_bottom">Our Works</h2>
        </div> */}
      <div className="project-wrap">
        {projects.map((project, item) => {
          const thumbnailImage = project?.media?.find(
            (find) => find?.type == "project_thumbnail"
          )?.image_url;

          return (
            <div className="project-card fade_bottom" key={item}>
              {thumbnailImage ? (
                <Image
                  src={thumbnailImage}
                  alt="project-1"
                  priority
                  width={500}
                  height={500}
                />
              ) : null}
              <div className="content">
                <h2 className="project-title">
                  <Link onClick={ClickHandler} href={`/projects/${project.id}`}>
                    {project?.project_name || ""}
                  </Link>
                </h2>

                <span className="project-subtitle">{`${project.country} | ${project?.project_type?.project_type}`}</span>

                <Link
                  onClick={ClickHandler}
                  href={`/projects/${project.id}`}
                  className="read-more-btn"
                >
                  Read More
                  <span className="read-more-icon">→</span>
                </Link>
                {/* 🚨 END TOMBOL READ MORE */}
              </div>
            </div>
          );
        })}
      </div>
      <div
        className="project-allBtn fade_bottom d-flex justify-content-center align-items-center"
        style={{ minHeight: "200px" }}
      >
        <Link
          onClick={ClickHandler}
          href="/projects"
          className="theme-btn"
          style={{
            border: "1px solid #000",
          }}
        >
          <span>See All Projects</span>
          {/* <span className="read-more-icon">→</span> */}
        </Link>
      </div>
    </section>
  );
};
export default ProjectSection;
