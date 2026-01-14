import { getProductById } from "@/lib/api/queries/product";
import Product from "./product";
import { Product as ProductDetail } from "@/lib/types/product/product";
import { Meta } from "@/lib/types";
import { getLocale } from "next-intl/server";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string; id?: string }>;
};
interface productDetailProps {
  data: ProductDetail;
}
// Generate metadata untuk SEO
export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const product = (await getProductById(id)) as productDetailProps;
  const locale = await getLocale();
  if (!product) {
    return {
      title: "Product Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  // ✅ Extract images dengan absolute URL
  const imageUrls =
    product?.data.media?.map((item) => item?.image_url).filter(Boolean) || [];

  // ✅ Pastikan URL absolute (jika belum)
  const absoluteImages = imageUrls.map((url) =>
    url.startsWith("http") ? url : `https://miracohpl.com${url}`
  );

  const products = product?.data;
  const description =
    products.description?.substring(0, 160) ||
    `${products.name} - ${
      products.design?.design_name || "HPL Product"
    } by Miraco`;
  return {
    title: `${products.name} | Miraco HPL ${products?.design?.design_name}`,
    description: description,
    keywords: `${products.name}, ${products.design?.design_name}, ${products.type?.type_name} HPL, high pressure laminate`,
    openGraph: {
      title: products.name,
      description: products.description.substring(0, 160),
      images:
        absoluteImages.length > 0
          ? [
              {
                url: absoluteImages[0],
                width: 1200,
                height: 630,
                alt: products.name,
              },
            ]
          : [],
      type: "website",
      locale: locale,
    },
    twitter: {
      card: "summary_large_image",
      title: products.name,
      description: description,
      images: absoluteImages,
      creator: "@miracohpl", // Optional: Twitter handle Anda
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
