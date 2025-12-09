"use client";
import React from "react";
import Link from "next/link";
import Projects from "../../api/projects";

import Shape from "@/public/images/right-arrow-2.svg";
import Image from "next/image";

const ClickHandler = () => {
  window.scrollTo(10, 0);
};

const ProjectSection = (props) => {
  return (
    <section className={"" + props.hclass}>
      <div className="container-fulid">
        {/* <div className="title">
          <h2 className="fade_bottom">Our Works</h2>
        </div> */}
        <div className="project-wrap">
          {Projects.slice(0, 2).map((project, item) => (
            <div className="project-card fade_bottom" key={item}>
              <Image src={project.pimg} alt="project-1" />
              <Image src={project.pimg} alt="project-1" />
              <div className="content">
                <h2>
                  <Link
                    onClick={ClickHandler}
                    href={"/project-single/[slug]"}
                    as={`/project-single/${project.slug}`}
                  >
                    {project.title}
                  </Link>
                </h2>
                <span>{project.subtitle}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="project-allBtn fade_bottom">
          <Link onClick={ClickHandler} href="/projects" className="theme-btn">
            <span>See All Projects</span>
            <Image src={Shape} alt="" />
          </Link>
        </div>
      </div>
    </section>
  );
};
export default ProjectSection;
