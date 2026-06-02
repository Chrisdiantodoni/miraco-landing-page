"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { useRouter } from "@/i18n/navigation";

export default function CartDrawer() {
  const { cart, isCartOpen, closeCart, removeFromCart, updateQuantity } =
    useCartStore();
  const router = useRouter();

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div className="cart-drawer-overlay" onClick={closeCart}>
      <div className="cart-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-drawer-header">
          <h2 className="cart-drawer-title">Your Selection</h2>
          <button
            className="cart-drawer-close"
            onClick={closeCart}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="cart-drawer-body">
          {cart.length === 0 ? (
            <div className="cart-drawer-empty">
              <p>Your selection is empty.</p>
              <p className="cart-drawer-empty-sub">
                Browse our collections and add samples to your request.
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart-drawer-item">
                <div className="cart-drawer-item-image">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      width={110}
                      height={110}
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <div className="cart-drawer-item-placeholder" />
                  )}
                </div>
                <div className="cart-drawer-item-info">
                  <div className="cart-drawer-item-details">
                    <div className="cart-drawer-item-top">
                      <h3 className="cart-drawer-item-name">{item.name}</h3>
                      <button
                        className="cart-drawer-item-remove"
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Remove"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <span className="cart-drawer-item-code">{item.code}</span>
                    <p className="cart-drawer-item-meta">
                      {item.size} &middot; {item.finishing}
                    </p>
                    <div className="cart-drawer-qty">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        aria-label="Decrease"
                      >
                        <Minus size={14} />
                      </button>
                      <span>QTY: {item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        aria-label="Increase"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    {/*
                    <div className="cart-drawer-item-price">
                      {item.promo_price && (
                        <span className="cart-drawer-item-price-old">
                          Rp {(item.price || 0).toLocaleString("id-ID")}
                        </span>
                      )}
                      <span className="cart-drawer-item-price-current">
                        Rp{" "}
                        {(
                          item.promo_price || item.price || 0
                        ).toLocaleString("id-ID")}
                      </span>
                      <span className="cart-drawer-item-price-subtotal">
                        Subtotal: Rp{" "}
                        {(
                          (item.promo_price || item.price || 0) * item.quantity
                        ).toLocaleString("id-ID")}
                      </span>
                    </div>
                    */}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="cart-drawer-footer">
            {/*
            <div className="cart-drawer-total">
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
            <button
              className="cart-drawer-review-btn"
              onClick={() => {
                closeCart();
                router.push("/checkout");
              }}
            >
              Review Selection
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
