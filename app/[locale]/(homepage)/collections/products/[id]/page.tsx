import { getProductById } from "@/lib/api/queries/product";
import Product from "./product";
import { Product as ProductDetail } from "@/lib/types/product/product";
import { Meta } from "@/lib/types";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string; id?: string }>;
};
interface productDetailProps {
  data: {
    meta: Meta;
    data: ProductDetail;
  };
}
// Generate metadata untuk SEO
export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const product = (await getProductById(id)) as productDetailProps;

  if (!product) {
    return {
      title: "Product Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const images =
    product?.data?.data.media?.map((item) => item?.image_url).filter(Boolean) ||
    [];
  const products = product?.data?.data;
  return {
    title: `${products.name} | Miraco HPL ${products?.design?.design_name}`,
    description: products.description.substring(0, 160),
    keywords: `${products.name}, ${products.design?.design_name} HPL, high pressure laminate`,
    openGraph: {
      title: products.name,
      description: products.description.substring(0, 160),
      images: [images],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: products.name,
      description: products.description.substring(0, 160),
      images: [images],
    },
    alternates: {
      canonical: `https://miracohpl.com/en/collections/products/${id}`,
    },
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const productDetail = await getProductById(id);
  return (
    <section className="wpo-shop-single-section section-padding">
      <div className="container">
        <Product data={productDetail} />
        {/* <ProductTabs /> */}
      </div>
    </section>
  );
}
