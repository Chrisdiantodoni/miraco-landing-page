"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/lib/store/cart";

export default function OrderSummary() {
  const t = useTranslations("checkout");
  const cart = useCartStore((state) => state.cart);

  return (
    <div className="checkout-summary-card">
      <div className="checkout-summary-header">
        <h2>{t("order_summary")}</h2>
      </div>

      <div className="checkout-summary-items">
        {cart.length === 0 ? (
          <div className="checkout-summary-empty">
            Your cart is empty. Add products from our collections.
          </div>
        ) : (
          <>
            {cart.map((item) => (
              <div key={item.id} className="checkout-summary-item">
                <div className="checkout-summary-image">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      width={64}
                      height={64}
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        background: "rgba(0,0,0,0.04)",
                      }}
                    />
                  )}
                </div>
                <div className="checkout-summary-details">
                  <h3>{item.name}</h3>
                  <div className="summary-code">{item.code}</div>
                  <div className="summary-meta">
                    {item.size} &middot; {item.finishing}
                  </div>
                  <div className="summary-qty">
                    {t("qty")}: {item.quantity}
                  </div>
                  {/*
                  <div className="summary-price">
                    {item.promo_price && (
                      <span className="summary-price-old">
                        Rp {(item.price || 0).toLocaleString("id-ID")}
                      </span>
                    )}
                    <span className="summary-price-current">
                      Rp{" "}
                      {(item.promo_price || item.price || 0).toLocaleString(
                        "id-ID",
                      )}
                      {" "}&times; {item.quantity} = Rp{" "}
                      {(
                        (item.promo_price || item.price || 0) * item.quantity
                      ).toLocaleString("id-ID")}
                    </span>
                  </div>
                  */}
                </div>
              </div>
            ))}
            {/*
            <div className="checkout-summary-total">
              <span>Total</span>
              <span>
                Rp{" "}
                {cart
                  .reduce(
                    (sum, item) =>
                      sum +
                      (item.promo_price || item.price || 0) * item.quantity,
                    0,
                  )
                  .toLocaleString("id-ID")}
              </span>
            </div>
            */}
          </>
        )}
      </div>
    </div>
  );
}
