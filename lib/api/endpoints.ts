export const API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL;

export const ENDPOINTS = {
  SITE_SETTINGS: `${API_URL}/sites/settings`,
  HOME: `${API_URL}/sites/home`,
  HERO: `${API_URL}/sites/hero`,
  COLLECTION: `${API_URL}/sites/products/list`,
  COLLECTION_ALL: `${API_URL}/products/list`,
  COLLECTION_BY_ID: (id: string | number) => `${API_URL}/sites/products/${id}`,
  PROJECT: `${API_URL}/sites/projects/list`,
  PROJECT_BY_ID: (id: string | number) => `${API_URL}/sites/projects/${id}`,
  LOCATE_US: `${API_URL}/sites/locate-us`,
  DOWNLOAD: (id: string | number) => `${API_URL}/media/download/${id}`,
  REQUESTS: `${API_URL}/sites/requests`,
  FORMSPREE: `https://formspree.io/f/xnneovpz`,
};
