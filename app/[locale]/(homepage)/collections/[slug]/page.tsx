import CollectionProducts from "@/components/Collections/CollectionProducts";
import Hero9 from "@/components/Hero/Hero9";
import PageTitle from "@/components/PageTitle/PageTitle";
import { Fragment } from "react/jsx-runtime";
import api from "@/api";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { slug } = await params;

  const productsArray = api();
  const currentProducts = productsArray.slice(8, 16);

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
        products={currentProducts}
      />
    </Fragment>
  );
}
