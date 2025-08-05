"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";
import { useCheckout } from "@/context/checkout-context";


export default function CartReview() {
  const { items, total } = useCart();
  const { dispatch } = useCheckout();

  const handleNextStep = () => {
    console.log("👟 Chuyển qua bước 2");
    dispatch({ type: "SET_STEP", payload: 2 });
  };


  if (items.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">Giỏ hàng trống</h2>
        <Link href="/" className="text-primary underline">
          Quay lại mua sắm
        </Link>
      </div>
    );
  }
  function cleanImageUrl(url: string): string {
    // Xóa phần như _AC_..._ trước đuôi mở rộng .jpg, .png
    return url.replace(/_AC[^.]+(?=\.(jpg|jpeg|png|webp|gif))/, "");
  }


  return (
    <div className="space-y-6">
      {items.map((item) => (
        <div key={item.variantId} className="flex items-start justify-between border-b pb-4">
          {/* Image */}
          <div className="w-20 h-20 relative">
            <Image
              src={cleanImageUrl(item.productImage || "/placeholder.svg")}
              alt={item.productName}
              fill
              className="object-contain rounded"
            />

          </div>

          {/* Info */}
          <div className="flex-1 px-4">
            <h3 className="font-medium">{item.productName}</h3>
            <div className="text-sm text-muted-foreground">
              {item.attributes.map((a) => `${a.name}: ${a.value}`).join(" • ")}
            </div>
            <div className="text-sm mt-1">Số lượng: {item.quantity}</div>
          </div>

          {/* Price */}
          <div className="text-right font-semibold">
            {formatPrice(item.price * item.quantity)}
          </div>
        </div>
      ))}

      <div className="text-right mt-6 text-xl font-bold">
        Tổng cộng: {formatPrice(total)}
      </div>
      <div className="text-right mt-4">
        <button
          onClick={handleNextStep}
          className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90 transition"
        >
          Tiếp tục đến vận chuyển
        </button>
      </div>

    </div>
  );
}
