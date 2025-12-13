// types/base.ts
export type Meta = {
  code: number;
  status: "success" | "error" | "warning";
  message: string;
};

export type ApiResponse<T> = {
  meta: Meta;
  data: T;
};

export type PaginationLink = {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
};
