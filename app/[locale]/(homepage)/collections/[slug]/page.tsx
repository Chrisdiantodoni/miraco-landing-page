/* eslint-disable @typescript-eslint/no-explicit-any */
import CollectionProducts from "@/components/Collections/CollectionProducts";
import PageTitle from "@/components/PageTitle/PageTitle";
import { Fragment } from "react/jsx-runtime";
import { getProducts } from "@/lib/api/queries/product";
import { getSiteData } from "@/lib/api/queries/settings";
import { Collection } from "@/lib/types";
import { ProductListResponse } from "@/lib/types/product/product";
import { getTranslations } from "next-intl/server";
import { capitalizeFirstLetter } from "../../../../../lib/util";
import { getLocale } from "next-intl/server";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<{ slug: string }>;
};

// app/[locale]/collections/[slug]/page.tsx

export async function generateStaticParams() {
  // ✅ Definisikan semua locale yang didukung
  const locales = ["en", "id", "zh"];
  const allParams: { slug: string; locale: string }[] = [];

  // ✅ Loop melalui setiap locale untuk mengambil data
  for (const locale of locales) {
    try {
      const { collections } = (await getSiteData({ locale })) as {
        collections: Collection[];
      };

      // ✅ Tambahkan params untuk setiap collection
      collections.forEach((collection) => {
        allParams.push({
          slug: collection.collection_name?.toLowerCase(),
          locale: locale,
        });
      });
    } catch (error) {
      console.error(`Error fetching collections for locale ${locale}:`, error);
    }
  }

  console.log("Generated static params:", allParams);
  return allParams;
}

const normalizeQueryParams = (params: Record<string, any>) => {
  const normalized: Record<string, any> = {};

  // ✅ Category ID - parse comma-separated atau array
  if (params.category_id) {
    if (typeof params.category_id === "string" && params.category_id.trim()) {
      // Parse "1,2,3" menjadi [1, 2, 3]
      const ids = params.category_id.split(",").map((id: string) => id);

      if (ids.length > 0) {
        normalized.category_id = ids;
      }
    } else if (Array.isArray(params.category_id)) {
      // Jika sudah array, normalize ke number[]
      const ids = params.category_id.map((id: any) => id);

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
  if (params.collection) {
    normalized.collection = params.collection;
  }

  // Page
  normalized.page = params.page ? Number(params.page) : 1;

  return normalized;
};

export const dynamicParams = false;

export default async function Page({ params, searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const { slug } = await params;
  const queryClient = new QueryClient();
  // ✅ Extract semua params
  const locale = await getLocale();
  const search = resolvedSearchParams?.search || "";
  const page = resolvedSearchParams?.page || 1;
  const categoryId = resolvedSearchParams?.category_id || "";
  const subCollectionId = resolvedSearchParams?.sub_collection_id || "";

  console.log(categoryId, "search params");
  // ✅ Normalize params
  const initialParams = normalizeQueryParams({
    collection: decodeURIComponent(slug ?? ""),
    search: search,
    page: page,
    category_id: categoryId,
    sub_collection_id: subCollectionId,
  });

  console.log("Normalized Params:", initialParams);

  const t = await getTranslations({
    locale: locale, // Ambil locale dari params
    namespace: "collections", // Namespace yang ingin diakses
  });

  const translatedPrefix = t("collections_heading");

  try {
    // ✅ Prefetch dengan params yang sudah dinormalisasi
    await queryClient.prefetchQuery({
      queryKey: ["products", initialParams],
      queryFn: async () => {
        const result = await getProducts(initialParams);

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
          showTopLine={false}
          paddingTop={80}
          pageTitle={capitalizeFirstLetter(slug)}
          pagesub={`${translatedPrefix}${capitalizeFirstLetter(slug)}`}
        />
        <HydrationBoundary state={dehydrate(queryClient)}>
          <CollectionProducts
            initialData={initialProductsData}
            collection={slug}
          />
        </HydrationBoundary>
      </Fragment>
    );
  } catch (error) {
    console.error("=== Server Side Error ===");
    console.error(error);

    // ✅ Return page dengan error handling
    return (
      <Fragment>
        <PageTitle pageTitle="Collections" pagesub="Collections" />
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
