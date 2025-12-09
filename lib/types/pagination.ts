/* eslint-disable @typescript-eslint/no-explicit-any */
// types/pagination.ts

/**
 * Meta information dari Laravel paginate response
 */
export interface PaginationMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number;
  to: number;
  path: string;
  first_page_url: string;
  last_page_url: string;
  next_page_url: string | null;
  prev_page_url: string | null;
}

/**
 * Generic Laravel Paginate Response
 * Bisa digunakan untuk semua model (Product, Collection, Category, dll)
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
  links: {
    first: null;
    last: null;
    prev: null;
    next: null;
  };
}

/**
 * Props untuk Pagination Component
 */
export interface PaginationProps {
  paginationData: any;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
}
