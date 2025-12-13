// types/pagination.ts
import { PaginationLink } from "./base";

// Definisikan PaginationMeta sebagai tipe generik <T>
// T adalah tipe data untuk setiap item dalam array 'data'
export type PaginationMeta<T> = {
  current_page: number;
  data: T[]; // Sekarang 'data' adalah array dari T
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
};

// Pastikan Anda juga mendefinisikan tipe untuk PaginationLink dan base types lainnya
// (atau impornya jika sudah didefinisikan)
// Contoh jika PaginationLink belum didefinisikan:
/*
export type PaginationLink = {
  url: string | null;
  label: string;
  active: boolean;
};
*/
