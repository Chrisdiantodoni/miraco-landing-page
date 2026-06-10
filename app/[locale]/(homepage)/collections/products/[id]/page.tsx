import { getProductById } from "@/lib/api/queries/product";
import Product from "./product";
import { Product as ProductDetail } from "@/lib/types/product/product";
import { getLocale } from "next-intl/server";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string; id?: string }>;
};

export const revalidate = 60;

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const locale = await getLocale();

  try {
    const response = await getProductById(id);
    const product = response?.data as ProductDetail | undefined;

    if (!product) {
      return {
        title: "Product Not Found",
        robots: { index: false, follow: false },
      };
    }

    const imageUrls =
      product.media?.map((item) => item?.image_url).filter(Boolean) || [];

    const absoluteImages = imageUrls.map((url) =>
      url.startsWith("http") ? url : `https://miracohpl.com${url}`,
    );

    const description =
      product.description?.substring(0, 160) ||
      `${product.name} - ${product.design?.design_name || "HPL Product"} by Miraco`;

    return {
      title: `${product.name} | Miraco HPL ${product.design?.design_name || ""}`,
      description,
      keywords: `${product.name}, ${product.design?.design_name}, ${product.type?.type_name} HPL, high pressure laminate`,
      openGraph: {
        title: product.name,
        description: product.description?.substring(0, 160),
        images:
          absoluteImages.length > 0
            ? [
                {
                  url: absoluteImages[0],
                  width: 1200,
                  height: 630,
                  alt: product.name,
                },
              ]
            : [],
        type: "website",
        locale,
      },
      twitter: {
        card: "summary_large_image",
        title: product.name,
        description,
        images: absoluteImages,
        creator: "@miracohpl",
      },
      alternates: {
        canonical: `https://miracohpl.com/${locale}/collections/products/${id}`,
      },
    };
  } catch {
    return {
      title: "Product | Miraco HPL",
      robots: { index: false, follow: false },
    };
  }
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const locale = await getLocale();
  const response = await getProductById(id);
  const productData = response?.data as ProductDetail | undefined;

  const jsonLd = productData
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: productData.name,
        description:
          productData.description?.substring(0, 500) || productData.name,
        image:
          productData.media
            ?.filter((m) => m?.image_url)
            .map((m) => m.image_url.startsWith("http")
              ? m.image_url
              : `https://miracohpl.com${m.image_url}`) || [],
        sku: productData.code || productData.id,
        brand: {
          "@type": "Brand",
          name: "Miraco HPL",
        },
        offers: {
          "@type": "Offer",
          price: productData.promo_price || productData.price || 0,
          priceCurrency: "IDR",
          availability: "https://schema.org/InStock",
          url: `https://miracohpl.com/${locale}/collections/products/${id}`,
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <section className="wpo-shop-single-section section-padding">
        <div className="container">
          <Product data={response} />
        </div>
      </section>
    </>
  );
}
