import CollectionProducts from "@/components/Collections/CollectionProducts";
import PageTitle from "@/components/PageTitle/PageTitle";
import { Fragment } from "react/jsx-runtime";
import { getProducts } from "@/lib/api/queries/product";
import { getSiteData } from "@/lib/api/queries/settings";
import { Collection } from "@/lib/types";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const { collections } = (await getSiteData()) as {
    collections: Collection[];
  };

  return collections.map((collection) => ({
    slug: collection.collection_name,
  }));
}

export const dynamicParams = false;

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const products = await getProducts({
    collection_slug: slug,
  });

  return (
    <Fragment>
      {/* <PageTitle
        pageTitle={"Selected Collections by Miraco"}
        pagesub={"Collections"}
      /> */}
      {/* <Hero9 /> */}
      <PageTitle pageTitle="Collections" pagesub="Collections" paddingTop={0} />
      <CollectionProducts
        // hclass={"wpo-product-section-s2 section-padding"}
        data={products}
      />
    </Fragment>
  );
}
