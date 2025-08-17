"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle,
  Download,
  Truck,
  Calendar,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCheckout } from "@/context/checkout-context";
import { useCart } from "@/context/cart-context";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";

export interface Order {
  id: string;
  orderCode?: string;
  items: Array<{
    VariantId?: string;
    id?: string;
    quantity: number;
    name?: string;
    price?: number;
    image?: string;
    attributes?: Array<{ name: string; value: string }>;
  }>;
  shippingAddress: {
    fullName: string;
    address: string;
    phone: string;
  };
  paymentMethod: "cash" | "momo" | "zalopay";
  totalAmount: number;
  isPaid: boolean;
  status: string;
  createdAt: string;
}

export default function OrderConfirmation() {
  const { state, dispatch, setOrderFromFetch } = useCheckout();
  const { items, clearCart } = useCart();
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get("orderId");
  const userId = searchParams.get("userId");
  const [localOrder, setLocalOrder] = useState<Order | null>(null);

  // Fetch order if not in context
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId || !userId) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/order/orders/${orderId}/${userId}`
        );
        if (!res.ok) throw new Error("Không tìm thấy đơn hàng");
        const orderData = await res.json();

        setLocalOrder(orderData);
        setOrderFromFetch(orderData);
      } catch (error) {
        console.error("❌ Lỗi khi lấy đơn hàng:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin đơn hàng. Vui lòng thử lại.",
          variant: "destructive",
          duration: 4000,
        });
      }
    };

    fetchOrder();
  }, [orderId, userId, setOrderFromFetch]);

  // Show toast when order is confirmed or cart is empty
  useEffect(() => {
    if (state.order || localOrder) {
      toast({
        title: "Thành công!",
        description: "Đơn hàng của bạn đã được tạo thành công!",
        variant: "default",
        duration: 4000,
      });
    } else if (items.length === 0) {
      toast({
        title: "Giỏ hàng trống",
        description: "Không có sản phẩm trong giỏ hàng. Vui lòng thêm sản phẩm để đặt hàng.",
        variant: "destructive",
        duration: 4000,
      });
    }
  }, [state.order, localOrder, items]);

  // Handle empty cart and no order
  if (items.length === 0 && !state.order && !localOrder) {
    return (
      <div className="text-center p-8">
        <p className="text-lg text-muted-foreground">
          Giỏ hàng của bạn đang trống và không có đơn hàng nào được tìm thấy.
        </p>
        <Button
          onClick={() => router.push("/")}
          className="mt-4 bg-gradient-to-r from-[#923ce9] to-[#644feb] text-white hover:bg-gradient-to-r hover:from-[#7e33cc] hover:to-[#5744d3] transition"
        >
          Tiếp tục mua sắm
        </Button>
      </div>
    );
  }

  if (!state.order && !localOrder) {
    return (
      <div className="text-center p-8">
        <p className="text-lg text-muted-foreground">
          Không tìm thấy thông tin đơn hàng.
        </p>
        <Button
          onClick={() => router.push("/")}
          className="mt-4 bg-gradient-to-r from-[#923ce9] to-[#644feb] text-white hover:bg-gradient-to-r hover:from-[#7e33cc] hover:to-[#5744d3] transition"
        >
          Quay lại trang chủ
        </Button>
      </div>
    );
  }

  const order = localOrder || state.order;
  const orderItems = order.items || items;

  // Validate orderItems
  if (!Array.isArray(orderItems)) {
    return (
      <div className="text-center p-8">
        <p className="text-lg text-muted-foreground">
          Dữ liệu đơn hàng không hợp lệ.
        </p>
        <Button
          onClick={() => router.push("/")}
          className="mt-4 bg-gradient-to-r from-[#923ce9] to-[#644feb] text-white hover:bg-gradient-to-r hover:from-[#7e33cc] hover:to-[#5744d3] transition"
        >
          Quay lại trang chủ
        </Button>
      </div>
    );
  }

  const handleNewOrder = () => {
    dispatch({ type: "RESET_CHECKOUT" });
    clearCart();
    router.push("/");
  };

  const handleDownloadReceipt = () => {
    console.log("Downloading receipt for order:", order.id);
    toast({
      title: "Tải hóa đơn",
      description: "Hóa đơn đang được chuẩn bị. Vui lòng chờ trong giây lát.",
      variant: "default",
      duration: 4000,
    });
  };

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <Card className="text-center">
        <CardContent className="p-8">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">
            Đơn hàng đã được xác nhận!
          </h1>
          <p className="text-muted-foreground mb-4">
            Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xác nhận và sẽ sớm
            được giao.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 inline-block">
            <p className="text-sm text-muted-foreground">Mã đơn hàng</p>
            <p className="font-mono font-bold text-lg">{order.orderCode}</p>
          </div>
        </CardContent>
      </Card>

      {/* Order Details */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Tóm tắt đơn hàng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {orderItems.map((item, index) => (
              <div
                key={item.VariantId || item.id || item._id || `item-${index}`}
                className="flex space-x-4"
              >
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image
                    src={item.productImage || "/placeholder.svg"}
                    alt={item.name || "Ảnh sản phẩm"}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-2">
                    {item.productName || "Không có tên"}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Số lượng: {item.quantity}
                  </p>
                  {item.attributes && item.attributes.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Thuộc tính:{" "}
                      {item.attributes
                        .map((attr) => `${attr.name}: ${attr.value}`)
                        .join(", ")}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {(item.price && item.quantity
                      ? item.price * item.quantity
                      : 0
                    ).toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </p>
                </div>
              </div>
            ))}
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Tạm tính</span>
                <span>
                  {(order.totalAmount || 0).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span>Miễn phí</span>
              </div>
              <div className="flex justify-between">
                <span>Thuế</span>
                <span>0 VNĐ</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Tổng cộng là: </span>
                <span>
                  {(order.totalAmount || 0).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery & Payment Info */}
        <div className="space-y-6">
          {/* Shipping Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Truck className="h-5 w-5" />
                <span>Thông tin vận chuyển</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p className="font-medium">{order.shippingAddress?.fullName || "Không có thông tin"}</p>
                <p>{order.shippingAddress?.address || "Không có thông tin"}</p>
                <p className="text-muted-foreground">
                  {order.shippingAddress?.phone || "Không có thông tin"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Estimated Delivery */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Thời gian giao hàng dự kiến</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString("vi-VN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Không xác định"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Bạn sẽ nhận được thông tin theo dõi qua email khi đơn hàng được giao.
              </p>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Phương thức thanh toán</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">
                {order.paymentMethod === "cash"
                  ? "Thanh toán khi nhận hàng"
                  : order.paymentMethod === "momo"
                  ? "Chuyển khoản qua Momo"
                  : order.paymentMethod === "zalopay"
                  ? "Thanh toán qua ZaloPay"
                  : "Không xác định"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {/* <Button
          onClick={handleDownloadReceipt}
          variant="outline"
          className="border-gray-300 hover:bg-gray-100"
        >
          <Download className="h-4 w-4 mr-2" />
          Tải hóa đơn
        </Button> */}
        <Button
          onClick={handleNewOrder}
          className="bg-gradient-to-r from-[#923ce9] to-[#644feb] text-white hover:bg-gradient-to-r hover:from-[#7e33cc] hover:to-[#5744d3] transition"
        >
          Tiếp tục mua sắm
        </Button>
      </div>
    </div>
  );
}