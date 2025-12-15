/* eslint-disable @typescript-eslint/no-explicit-any */
import CollectionProducts from "@/components/Collections/CollectionProducts";
import PageTitle from "@/components/PageTitle/PageTitle";
import { Fragment } from "react/jsx-runtime";
import { getProducts } from "@/lib/api/queries/product";
import { getSiteData } from "@/lib/api/queries/settings";
import { Collection } from "@/lib/types";
import { ProductListResponse } from "@/lib/types/product/product";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateStaticParams() {
  const { collections } = (await getSiteData({ locale: "en" })) as {
    collections: Collection[];
  };

  return collections.map((collection) => ({
    slug: `${collection.collection_name}?id=${collection?.id}`,
  }));
}

export const dynamicParams = false;

// ✅ PERBAIKAN: Helper function untuk normalize dengan filter support
const normalizeQueryParams = (params: Record<string, any>) => {
  const normalized: Record<string, any> = {};

  // Collection ID
  if (params.collection_id) {
    normalized.collection_id = Number(params.collection_id);
  }

  // ✅ Category ID - parse comma-separated atau array
  if (params.category_id) {
    if (typeof params.category_id === "string" && params.category_id.trim()) {
      // Parse "1,2,3" menjadi [1, 2, 3]
      const ids = params.category_id
        .split(",")
        .map((id: string) => Number(id.trim()))
        .filter((id: number) => !isNaN(id) && id > 0);

      if (ids.length > 0) {
        normalized.category_id = ids;
      }
    } else if (Array.isArray(params.category_id)) {
      // Jika sudah array, normalize ke number[]
      const ids = params.category_id
        .map((id: any) => Number(id))
        .filter((id: number) => !isNaN(id) && id > 0);

      if (ids.length > 0) {
        normalized.category_id = ids;
      }
    }
  }

  // ✅ Sub Collection ID - parse comma-separated atau array
  if (params.sub_collection_id) {
    if (
      typeof params.sub_collection_id === "string" &&
      params.sub_collection_id.trim()
    ) {
      const ids = params.sub_collection_id
        .split(",")
        .map((id: string) => Number(id.trim()))
        .filter((id: number) => !isNaN(id) && id > 0);

      if (ids.length > 0) {
        normalized.sub_collection_id = ids;
      }
    } else if (Array.isArray(params.sub_collection_id)) {
      const ids = params.sub_collection_id
        .map((id: any) => Number(id))
        .filter((id: number) => !isNaN(id) && id > 0);

      if (ids.length > 0) {
        normalized.sub_collection_id = ids;
      }
    }
  }

  // Search
  if (params.search && params.search.trim()) {
    normalized.search = params.search.trim();
  }

  // Page
  normalized.page = params.page ? Number(params.page) : 1;

  return normalized;
};

export default async function Page({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;

  const queryClient = new QueryClient();

  // ✅ Extract semua params
  const collectionId = resolvedSearchParams?.id || "";
  const search = resolvedSearchParams?.search || "";
  const page = resolvedSearchParams?.page || 1;
  const categoryId = resolvedSearchParams?.category_id || "";
  const subCollectionId = resolvedSearchParams?.sub_collection_id || "";

  console.log("=== Server Side Debug ===");
  console.log("Raw Search Params:", {
    id: collectionId,
    search,
    page,
    category_id: categoryId,
    sub_collection_id: subCollectionId,
  });

  // ✅ Normalize params
  const initialParams = normalizeQueryParams({
    collection_id: collectionId,
    search: search,
    page: page,
    category_id: categoryId,
    sub_collection_id: subCollectionId,
  });

  console.log("Normalized Params:", initialParams);

  try {
    // ✅ Prefetch dengan params yang sudah dinormalisasi
    await queryClient.prefetchQuery({
      queryKey: ["products", initialParams],
      queryFn: async () => {
        console.log("Prefetching products with:", initialParams);
        const result = await getProducts(initialParams);
        console.log("Prefetch success:", {
          total: result?.data?.total,
          count: result?.data?.data?.length,
        });
        return result;
      },
    });

    const initialProductsData = queryClient.getQueryData([
      "products",
      initialParams,
    ]) as ProductListResponse;

    console.log("Initial products data loaded:", {
      hasData: !!initialProductsData,
      productsCount: initialProductsData?.data?.data?.length || 0,
    });

    return (
      <Fragment>
        <PageTitle
          pageTitle="Collections"
          pagesub="Collections"
          paddingTop={0}
        />
        <HydrationBoundary state={dehydrate(queryClient)}>
          <CollectionProducts initialData={initialProductsData} />
        </HydrationBoundary>
      </Fragment>
    );
  } catch (error) {
    console.error("=== Server Side Error ===");
    console.error(error);

    // ✅ Return page dengan error handling
    return (
      <Fragment>
        <PageTitle
          pageTitle="Collections"
          pagesub="Collections"
          paddingTop={0}
        />
        <div className="container py-5">
          <div className="alert alert-danger">
            <h4>Error Loading Products</h4>
            <p>
              {error instanceof Error
                ? error.message
                : "Unknown error occurred"}
            </p>
            <small>Check console for details</small>
          </div>
        </div>
      </Fragment>
    );
  }
}

// ========================================
// ALTERNATIVE: Simplified Version
// ========================================

/*
export default async function Page({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const queryClient = new QueryClient();

  // Build params object
  const params: Record<string, any> = {
    collection_id: resolvedSearchParams?.id,
    page: resolvedSearchParams?.page || 1,
  };

  // Add optional params
  if (resolvedSearchParams?.search) {
    params.search = resolvedSearchParams.search;
  }

  if (resolvedSearchParams?.category_id) {
    params.category_id = resolvedSearchParams.category_id;
  }

  if (resolvedSearchParams?.sub_collection_id) {
    params.sub_collection_id = resolvedSearchParams.sub_collection_id;
  }

  // Normalize
  const normalizedParams = normalizeQueryParams(params);

  console.log("Server params:", normalizedParams);

  await queryClient.prefetchQuery({
    queryKey: ["products", normalizedParams],
    queryFn: () => getProducts(normalizedParams),
  });

  const initialData = queryClient.getQueryData([
    "products",
    normalizedParams,
  ]) as ProductListResponse;

  return (
    <Fragment>
      <PageTitle pageTitle="Collections" pagesub="Collections" paddingTop={0} />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CollectionProducts initialData={initialData} />
      </HydrationBoundary>
    </Fragment>
  );
}
*/
