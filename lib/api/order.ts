// lib/api/order.ts
import axios from "axios";
import { Order, ShippingInfo, PaymentInfo } from "@/context/checkout-context";

export async function placeOrderApi({
  userId,
  shippingAddress,
  paymentMethod,
}: {
  userId: string;
  shippingAddress: Partial<ShippingInfo>;
  paymentMethod: string;
}): Promise<Order> {
  const res = await axios.post("/api/order/place", {
    userId,
    shippingAddress,
    paymentMethod,
  });

  return res.data.result;
}
