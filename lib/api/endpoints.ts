export const API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL;

export const ENDPOINTS = {
  LOGIN: `${API_URL}/member/login`,
  REGISTER: `${API_URL}/member/register`,
  FAVOURITE_ALL: `${API_URL}/member/favorites`,
  TOGGLE_FAVOURITE: (productId: string | number) =>
    `${API_URL}/member/products/${productId}/favorite`,

  ORDERS: `${API_URL}/member/orders`,
  ORDERS_DETAIL: (orderId: string | number) =>
    `${API_URL}/member/orders/${orderId}`,
  ORDERS_INVOICE: (orderId: string | number) =>
    `${API_URL}/member/orders/${orderId}/invoice`,
  SUBMIT_ORDER: `${API_URL}/member/orders`,

  CHECK_USERNAME: `${API_URL}/member/check-username`,
  CHECK_REFERRAL_USERNAME: `${API_URL}/member/check-referral`,
  VOUCHERS: `${API_URL}/member/vouchers`,
  VOUCHER_VALIDATE: `${API_URL}/member/vouchers/validate`,
  ME: `${API_URL}/member/me`,
  DASHBOARD: `${API_URL}/member/dashboard`,
  REFERRER: `${API_URL}/member/referrer`,
  CHANGE_PASSWORD: `${API_URL}/member/change-password`,

  SITE_SETTINGS: `${API_URL}/sites/settings`,
  POSITION: `${API_URL}/positions/list`,
  HOME: `${API_URL}/sites/home`,
  HERO: `${API_URL}/sites/hero`,
  COLLECTION_PAGE: `${API_URL}/sites/collection-page`,
  COLLECTION: `${API_URL}/sites/products/list`,
  COLLECTION_ALL: `${API_URL}/products/list`,
  COLLECTION_BY_ID: (id: string | number) => `${API_URL}/sites/products/${id}`,
  PROJECT: `${API_URL}/sites/projects/list`,
  PROJECT_BY_ID: (id: string | number) => `${API_URL}/sites/projects/${id}`,
  LOCATE_US: `${API_URL}/sites/locate-us`,
  DOWNLOAD: (id: string | number) => `${API_URL}/media/download/${id}`,
  DOWNLOAD_ALL: (id: string | number) => `${API_URL}/media/bulk-download/${id}`,
  REQUESTS: `${API_URL}/sites/requests`,
  FORMSPREE: `https://formspree.io/f/xnneovpz`,
  FORMSPREE_DONI: `https://formspree.io/f/xwpobnlr`,
  SUB_COLLECTION: `${API_URL}/sites/sub-collections`,
  COLLECTION_MASTER: `${API_URL}/sites/collections`,
  TRACKING: `${API_URL}/analytics/track`,
};
