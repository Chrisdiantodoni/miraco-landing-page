import { getProductById } from "@/lib/api/queries/product";
import Product from "./product";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string; id?: string }>;
};

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
