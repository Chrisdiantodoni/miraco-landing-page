import { ENDPOINTS } from "./endpoints";

// Fetch Site Settings
export async function getSiteSettings() {
  const res = await fetch(ENDPOINTS.SITE_SETTINGS, {
    next: { revalidate: 3600 }, // Cache 1 jam
  });

  if (!res.ok) throw new Error("Failed to fetch site settings");
  return res.json();
}

// // Fetch Hero Section
// export async function getHeroSection() {
//   const res = await fetch(ENDPOINTS.HERO_SECTION, {
//     next: { revalidate: 3600 },
//   });

//   if (!res.ok) throw new Error("Failed to fetch hero");
//   return res.json();
// }

// // Fetch Projects
// export async function getProjects() {
//   const res = await fetch(ENDPOINTS.PROJECTS, {
//     next: { revalidate: 3600 },
//   });

//   if (!res.ok) throw new Error("Failed to fetch projects");
//   return res.json();
// }

// export async function getProducts(params?: Record<string, any>) {
//   const url = new URL(ENDPOINTS.PRODUCTS);

//   // Tambah query kalau ada
//   if (params) {
//     Object.entries(params).forEach(([key, value]) => {
//       if (value !== undefined && value !== null) {
//         url.searchParams.append(key, String(value));
//       }
//     });
//   }

//   const res = await fetch(url.toString(), {
//     next: { revalidate: 3600 },
//   });

//   if (!res.ok) throw new Error("Failed to fetch products");

//   return res.json();
// }

// export async function getProducts(params?) {
//   const qs = new URLSearchParams(params).toString();
//   const url = params ? `${ENDPOINTS.PRODUCTS}?${qs}` : ENDPOINTS.PRODUCTS;

//   const res = await fetch(url);
//   return res.json();
// }
