import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { CheckCircle, Truck, Calendar, CreditCard, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const statusTranslations = {
  pending: "Chờ xử lý",
  confirmed: "Đã xác nhận",
  shipping: "Đang giao hàng",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
  returned: "Đã trả hàng",
};

const cleanAmazonImageUrl = (url) => {
  if (!url || typeof url !== "string") return "/placeholder.svg";
  let cleanedUrl = url.replace(/_AC(_US\d+_|_)?/, "");
  cleanedUrl = cleanedUrl.replace("..jpg", ".jpg");
  return cleanedUrl;
};

export default function OrderDetailsModal({ order, open, onClose }) {
  if (!order) return null;
  const orderItems = order.items || [];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Chi tiết đơn hàng {order.orderCode}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Success Header */}
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">
              Đơn hàng đã được xác nhận!
            </h1>
            <p className="text-muted-foreground mb-4">
              Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xác nhận và sẽ sớm được giao.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 inline-block">
              <p className="text-sm text-muted-foreground">Mã đơn hàng</p>
              <p className="font-mono font-bold text-lg">{order.orderCode}</p>
              <p className="text-sm text-muted-foreground mt-2">Trạng thái</p>
              <p className="font-medium">{statusTranslations[order.status] || order.status}</p>
            </div>
          </div>

          {/* Order Details */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Order Summary */}
            <div>
              <h3 className="font-semibold mb-2">Tóm tắt đơn hàng</h3>
              <div className="space-y-4">
                {orderItems.map((item) => (
                  <div key={item._id || item.productVariantId} className="flex space-x-4">
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        src={cleanAmazonImageUrl(item.productImage)}
                        alt={item.name || "Ảnh sản phẩm"}
                        fill
                        className="object-cover rounded"
                        quality={100}
                        priority={false}
                        unoptimized={item.image?.includes("amazon")}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2">
                        {item.productName || "Không có tên"}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Số lượng: {item.quantity}
                      </p>
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
              </div>
            </div>

            {/* Delivery & Payment Info */}
            <div className="space-y-6">
              {/* Shipping Info */}
              <div>
                <h3 className="font-semibold flex items-center space-x-2 mb-2">
                  <Truck className="h-5 w-5" />
                  <span>Thông tin vận chuyển</span>
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="font-medium">{order.shippingAddress?.fullName}</p>
                  <p>{order.shippingAddress?.address}</p>
                  <p className="text-muted-foreground">{order.shippingAddress?.phone}</p>
                </div>
              </div>

              {/* Estimated Delivery */}
              <div>
                <h3 className="font-semibold flex items-center space-x-2 mb-2">
                  <Calendar className="h-5 w-5" />
                  <span>Thời gian giao hàng dự kiến</span>
                </h3>
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
              </div>

              {/* Payment Method */}
              <div>
                <h3 className="font-semibold flex items-center space-x-2 mb-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Phương thức thanh toán</span>
                </h3>
                <p className="font-medium">
                  {order.paymentMethod === "cash"
                    ? "Thanh toán khi nhận hàng"
                    : order.paymentMethod === "zalopay"
                    ? "Thanh toán qua Zalopay"
                    : "Không xác định"}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-4 mt-4">
            {/* <Button
              variant="outline"
              onClick={() => alert("Tải hóa đơn sẽ bắt đầu tại đây")}
            >
              <Download className="h-4 w-4 mr-2" />
              Tải hóa đơn
            </Button> */}
            {order.status === "shipping" && (
              <Button variant="outline">
                <Truck className="h-4 w-4 mr-2" />
                Theo dõi gói hàng
              </Button>
            )}
            {order.status === "delivered" && (
              <Button>
                <Package className="h-4 w-4 mr-2" />
                Đặt lại
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}