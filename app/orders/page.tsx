"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Package, Truck, CheckCircle, Clock, Eye, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useAuth } from "@/context/auth-context";
import OrderDetailsModal from "@/components/modal";

const getStatusIcon = (status) => {
  switch (status) {
    case "delivered":
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    case "shipping":
      return <Truck className="h-5 w-5 text-blue-600" />;
    case "confirmed":
      return <CheckCircle className="h-5 w-5 text-teal-600" />;
    case "pending":
      return <Clock className="h-5 w-5 text-yellow-600" />;
    case "cancelled":
      return <XCircle className="h-5 w-5 text-red-600" />;
    case "returned":
      return <Package className="h-5 w-5 text-orange-600" />;
    default:
      return <Package className="h-5 w-5 text-gray-600" />;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-800";
    case "shipping":
      return "bg-blue-100 text-blue-800";
    case "confirmed":
      return "bg-teal-100 text-teal-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "returned":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

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

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  useEffect(() => {
    async function fetchOrders() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/order/${user._id}`);
        if (!response.ok) {
          throw new Error("Không thể lấy danh sách đơn hàng");
        }
        const data = await response.json();
        console.log("API response:", data);
        data.result.forEach((order) => {
          order.items.forEach((item) => {
            console.log("Item productImage:", item.productImage);
            console.log("Item productName:", item.productName);
          });
        });
        if (Array.isArray(data.result)) {
          setOrders(data.result);
        } else {
          setOrders([]);
          setError("Dữ liệu đơn hàng không đúng định dạng, hiển thị danh sách rỗng.");
        }
      } catch (err) {
        setError(err.message);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="w-[85%] mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Đơn hàng của bạn</h1>
            <p className="text-muted-foreground">Đang tải...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="w-[85%] mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Đơn hàng của bạn</h1>
            <p className="text-red-600">Lỗi: {error}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="w-[85%] mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Đơn hàng của bạn</h1>
            <p className="text-muted-foreground">Theo dõi và quản lý đơn hàng của bạn</p>
          </div>

          <div className="space-y-6">
            {Array.isArray(orders) && orders.length > 0 ? (
              orders.map((order) => (
                <Card key={order._id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Đơn hàng {order._id}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Đặt hàng vào {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-2">
                          {getStatusIcon(order.status)}
                          <Badge className={getStatusColor(order.status)}>
                            {statusTranslations[order.status] || order.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="font-semibold">
                          {order.totalAmount?.toLocaleString("vi-VN")} ₫
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      {Array.isArray(order.items) &&
                        order.items.map((item) => (
                          <div key={item._id || item.productName} className="flex items-center space-x-4">
                            <div className="relative w-16 h-16 flex-shrink-0">
                              <Image
                                src={cleanAmazonImageUrl(item.productImage)}
                                alt={item.productName || "Sản phẩm"}
                                fill
                                className="object-cover rounded"
                                quality={100}
                                priority={false}
                                unoptimized={item.productImage?.includes("amazon")}
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{item.productName || "Không có tên"}</h4>
                              <p className="text-sm text-muted-foreground">
                                Số lượng: {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                {item.price?.toLocaleString("vi-VN")} ₫
                              </p>
                            </div>
                          </div>
                        ))}

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(order)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Xem chi tiết
                          </Button>
                          {order.status === "shipping" && (
                            <Button variant="outline" size="sm">
                              <Truck className="h-4 w-4 mr-2" />
                              Theo dõi gói hàng
                            </Button>
                          )}
                          {order.status === "delivered" && (
                            <Button size="sm">
                              <Package className="h-4 w-4 mr-2" />
                              Đặt lại
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Chưa có đơn hàng</h3>
                  <p className="text-muted-foreground mb-6">
                    Khi bạn đặt đơn hàng đầu tiên, nó sẽ xuất hiện tại đây.
                  </p>
                  <Button asChild>
                    <Link href="/">Bắt đầu mua sắm</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      <OrderDetailsModal
        order={selectedOrder}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <Footer />
    </div>
  );
}