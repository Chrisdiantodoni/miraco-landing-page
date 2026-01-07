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
import { getCollection } from "@/lib/api/queries/product";
import { normalizeQueryParams } from "../../../../../lib/util";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const locales = ["en", "id", "zh"];
  const allParams: { slug: string; locale: string }[] = [];

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

export const dynamicParams = false;
export default async function Page({ params, searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const { slug } = await params;
  const queryClient = new QueryClient();
  const locale = await getLocale();

  // ✅ Extract params dengan safe handling
  const rawParams: Record<string, any> = {
    collection: slug,
    page: resolvedSearchParams?.page || 1,
  };

  // Helper untuk add param hanya jika ada
  const addIfExists = (key: string, value: string | string[] | undefined) => {
    if (value) {
      rawParams[key] = value;
    }
  };

  addIfExists("search", resolvedSearchParams?.search as string);
  addIfExists("category_id", resolvedSearchParams?.category_id as string);

  addIfExists("types", resolvedSearchParams?.types as string);
  addIfExists("finishing", resolvedSearchParams?.finishing as string);
  addIfExists("features", resolvedSearchParams?.features as string);
  addIfExists("complementary", resolvedSearchParams?.complementary as string);
  addIfExists("sizes", resolvedSearchParams?.sizes as string);
  addIfExists("thicknesses", resolvedSearchParams?.thicknesses as string);
  addIfExists("sort_by", resolvedSearchParams?.sort_by as string);
  addIfExists("is_soft_touch", resolvedSearchParams?.is_soft_touch as string);
  addIfExists(
    "is_anti_fingerprint",
    resolvedSearchParams?.is_anti_fingerprint as string
  );
  addIfExists("is_miraedge", resolvedSearchParams?.is_miraedge as string);

  // ✅ Normalize semua params
  const normalizedParams = normalizeQueryParams(rawParams);

  console.log("🔍 Server Side Params:", {
    raw: rawParams,
    normalized: normalizedParams,
  });

  // ✅ Get translations
  const t = await getTranslations({
    locale: locale,
    namespace: "collections",
  });
  const translatedPrefix = t("collections_heading");

  // ✅ Fetch sidebar data
  const { data: sideBarData } = await getCollection();

  // ✅ Prefetch products dengan normalized params
  await queryClient.prefetchQuery({
    queryKey: ["products", normalizedParams],
    queryFn: async () => {
      const result = await getProducts(normalizedParams);
      return result;
    },
  });

  // ✅ Get initial data
  const initialProductsData = queryClient.getQueryData([
    "products",
    normalizedParams,
  ]) as ProductListResponse;

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
          sidebar_data={sideBarData}
          initialData={initialProductsData}
          collection={slug}
        />
      </HydrationBoundary>
    </Fragment>
  );
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
