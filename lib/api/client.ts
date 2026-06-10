/* eslint-disable @typescript-eslint/no-explicit-any */
// Laravel standard response structure
export type LaravelResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    current_page?: number;
    last_page?: number;
    per_page?: number;
    total?: number;
    [key: string]: any;
  };
  errors?: Record<string, string[]>;
};

type ApiOptions = {
  method?: string;
  body?: any;
  token?: string;
  revalidate?: number;
  params?: Record<string, any>;
  responseType?: "json" | "blob"; // ✅ Tambahkan ini
};

// ========================================
// HELPER FUNCTIONS
// ========================================

function buildUrl(url: string, params?: Record<string, any>) {
  if (!params) return url;
  const filtered = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null),
  );
  if (Object.keys(filtered).length === 0) return url;
  const query = new URLSearchParams(filtered).toString();
  return `${url}?${query}`;
}

function getStoredToken(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return localStorage.getItem("miraco_token") || undefined;
}

async function baseFetch<T>(url: string, options?: ApiOptions): Promise<any> {
  try {
    const {
      method = "GET",
      body,
      token,
      revalidate,
      params,
      responseType = "json",
    } = options || {};
    const isFormData = body instanceof FormData;
    // Validate URL
    if (!url) {
      throw new Error("URL is required for API call");
    }

    const fullUrl = buildUrl(url, params);

    const headers: Record<string, string> = {
      Accept: "application/json",
    };

    if (body && method !== "GET" && !isFormData) {
      headers["Content-Type"] = "application/json";
    }

    const effectiveToken = token || getStoredToken();

    if (effectiveToken) {
      headers["Authorization"] = `Bearer ${effectiveToken}`;
    }

    const res = await fetch(fullUrl, {
      method,
      headers,
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
      next: revalidate ? { revalidate } : undefined,
    });
    if (responseType === "blob") {
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `API Error ${res.status}`);
      }

      const blob = await res.blob();

      const contentDisposition = res.headers.get("content-disposition");

      return {
        blob,
        contentDisposition,
      };
    }
    // Parse response
    const responseData = await res.json();

    // Check if response is OK
    if (!res.ok) {
      // Laravel error response
      const errorMessage =
        responseData.message || responseData.error || `API Error ${res.status}`;
      console.log(responseData);
      throw new Error(errorMessage);
    }
    // Return full Laravel response
    return responseData as LaravelResponse<T>;
  } catch (error) {
    console.error("API Request failed:", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error(
      typeof error === "string" ? error : "An unexpected error occurred",
    );
  }
}

// ========================================
// API CLIENT
// ========================================

export const api = {
  // GET request - returns full Laravel response
  get: <T>(
    url: string,
    opts?: { params?: any; revalidate?: number; token?: string },
  ) => baseFetch<T>(url, { method: "GET", ...opts }),

  // GET request - returns only data (convenience method)
  getData: async <T>(
    url: string,
    opts?: { params?: any; revalidate?: number; token?: string },
  ): Promise<T> => {
    const response = await baseFetch<T>(url, { method: "GET", ...opts });
    return response.data;
  },

  post: <T>(url: string, body: any, token?: string) =>
    baseFetch<T>(url, { method: "POST", body, token }),

  postFormData: <T>(url: string, body: FormData, token?: string) =>
    baseFetch<T>(url, { method: "POST", body, token }),
  // POST request - returns only data (convenience method)
  postData: async <T>(url: string, body: any, token?: string): Promise<T> => {
    const response = await baseFetch<T>(url, { method: "POST", body, token });
    return response.data;
  },
  postBlob: (url: string, body: any, token?: string) =>
    baseFetch(url, { method: "POST", body, token, responseType: "blob" }),

  getBlob: (url: string, opts?: { params?: any; token?: string }) =>
    baseFetch(url, { method: "GET", ...opts, responseType: "blob" }),
  put: <T>(url: string, body: any, token?: string) =>
    baseFetch<T>(url, { method: "PUT", body, token }),

  delete: <T>(url: string, token?: string) =>
    baseFetch<T>(url, { method: "DELETE", token }),
};
