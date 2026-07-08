import { MetadataRoute } from "next";
import { getProductsAll } from "@/lib/api/queries/product";
import { getProjects } from "@/lib/api/queries/project";
import { getSiteData } from "@/lib/api/queries/settings";

const SITE_URL = "https://miracohpl.com";
const LOCALES = ["en", "id", "zh"];

export const dynamic = "force-dynamic";

function localize(path: string, locale: string) {
  return `${SITE_URL}/${locale}${path}`;
}

function alternates(path: string) {
  const languages: Record<string, string> = {};
  for (const locale of LOCALES) {
    languages[locale] = localize(path, locale);
  }
  return { languages };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  const staticPaths = [
    "/",
    "/collections",
    "/request",
    "/projects",
    "/locate-us",
    "/e-catalogue",
  ];

  for (const path of staticPaths) {
    entries.push({
      url: localize(path, "en"),
      changeFrequency: path === "/" ? "weekly" : "monthly",
      priority: path === "/" ? 1.0 : 0.8,
      alternates: alternates(path),
    });
  }

  try {
    const siteData = await getSiteData({ locale: "en" });
    const collections = siteData?.collections || [];

    for (const col of collections) {
      const slug = col.collection_name.toLowerCase().replace(/\s+/g, "-");
      entries.push({
        url: localize(`/collections/${slug}`, "en"),
        changeFrequency: "weekly",
        priority: 0.7,
        alternates: alternates(`/collections/${slug}`),
      });
    }
  } catch {}

  try {
    const productsResponse = await getProductsAll({
      page: 1,
      per_page: 1000,
    });
    const products = productsResponse?.data?.data || [];

    for (const product of products) {
      if (product.id) {
        entries.push({
          url: localize(`/collections/products/${product.id}`, "en"),
          lastModified: product.updated_at
            ? new Date(product.updated_at)
            : undefined,
          changeFrequency: "weekly",
          priority: 0.6,
          alternates: alternates(`/collections/products/${product.id}`),
        });
      }
    }
  } catch {}

  try {
    const projectsResponse = await getProjects({ page: 1, per_page: 500 });
    const projects = projectsResponse?.data?.data || [];

    for (const project of projects) {
      if (project.id) {
        entries.push({
          url: localize(`/projects/${project.id}`, "en"),
          lastModified: project.updated_at
            ? new Date(project.updated_at)
            : undefined,
          changeFrequency: "monthly",
          priority: 0.5,
          alternates: alternates(`/projects/${project.id}`),
        });
      }
    }
  } catch {}

  return entries;
}
