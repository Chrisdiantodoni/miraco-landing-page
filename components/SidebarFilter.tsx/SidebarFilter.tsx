"use client";
import React from "react";
import Link from "next/link";
import blogs from "../../api/blogs";
import Image from "next/image";

const ClickHandler = () => {
  window.scrollTo(10, 0);
};

const SidebarFilter = () => {
  return (
    <div className="blog-sidebar">
      <div className="widget category-widget">
        <h3>Categories</h3>
        <ul>
          <li>
            <Link onClick={ClickHandler} href="/blog">
              Architecture<span>03</span>
            </Link>
          </li>
          <li>
            <Link onClick={ClickHandler} href="/blog" className="active">
              Construction
              <span>02</span>
            </Link>
          </li>
          <li>
            <Link onClick={ClickHandler} href="/blog">
              Innovation <span>04</span>
            </Link>
          </li>
          <li>
            <Link onClick={ClickHandler} href="/blog">
              Development <span>05</span>
            </Link>
          </li>
          <li>
            <Link onClick={ClickHandler} href="/blog">
              Interior <span>05</span>
            </Link>
          </li>
          <li>
            <Link onClick={ClickHandler} href="/blog">
              Furniture <span>05</span>
            </Link>
          </li>
        </ul>
      </div>
      <div className="widget recent-post-widget">
        <h3>Related Posts</h3>
        <div className="posts">
          {blogs.slice(0, 3).map((blog, bl) => (
            <div className="post" key={bl}>
              <div className="img-holder">
                <Image src={blog.screens} alt="" />
              </div>
              <div className="details">
                <h4>
                  <Link
                    onClick={ClickHandler}
                    href={"/blog-single/[slug]"}
                    as={`/blog-single/${blog.slug}`}
                  >
                    {blog.title2}
                  </Link>
                </h4>
                <span className="date">{blog.create_at}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="widget tag-widget">
        <h3>Populer Tags</h3>
        <ul>
          <li>
            <Link onClick={ClickHandler} href="#">
              Architecture
            </Link>
          </li>
          <li>
            <Link onClick={ClickHandler} href="#">
              Construction
            </Link>
          </li>
          <li>
            <Link onClick={ClickHandler} href="#">
              Interior
            </Link>
          </li>
          <li>
            <Link onClick={ClickHandler} href="#">
              Urban
            </Link>
          </li>
          <li>
            <Link onClick={ClickHandler} href="#">
              Building
            </Link>
          </li>
          <li>
            <Link onClick={ClickHandler} href="#">
              Development
            </Link>
          </li>
          <li>
            <Link onClick={ClickHandler} href="#">
              Furniture
            </Link>
          </li>
          <li>
            <Link onClick={ClickHandler} href="#">
              Space
            </Link>
          </li>
          <li>
            <Link onClick={ClickHandler} href="#">
              Room
            </Link>
          </li>
          <li>
            <Link onClick={ClickHandler} href="#">
              Chair
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SidebarFilter;
