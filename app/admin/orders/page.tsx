"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  MoreHorizontal,
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle,
  Package,
  Truck,
  RotateCcw,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import AdminSidebar from "@/components/admin/admin-sidebar";

// Interface cho dữ liệu đơn hàng
interface OrderItem {
  productVariantId: string;
  quantity: number;
  price: number;
  productName: string;
  productImage: string;
  attributes: { name: string; value: string; _id?: string }[];
  _id?: string;
}

interface ShippingAddress {
  fullName?: string;
  phone?: string;
  address?: string;
}

interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  shippingAddress?: ShippingAddress;
  status: "pending" | "confirmed" | "shipping" | "delivered" | "cancelled" | "returned";
  paymentMethod: "cash" | "momo";
  orderCode?: string;
  isPaid: boolean;
  paidAt?: string;
  totalAmount: number;
  createdAt: string;
  __v?: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString("vi-VN");
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "delivered":
      return <Badge className="bg-green-100 text-green-800">Đã giao</Badge>;
    case "shipping":
      return <Badge className="bg-purple-100 text-purple-800">Đang giao</Badge>;
    case "confirmed":
      return <Badge className="bg-blue-100 text-blue-800">Đã xác nhận</Badge>;
    case "pending":
      return <Badge className="bg-yellow-100 text-yellow-800">Chờ xác nhận</Badge>;
    case "cancelled":
      return <Badge variant="destructive">Đã hủy</Badge>;
    // case "returned":
    //   return <Badge className="bg-gray-100 text-gray-800">Đã trả hàng</Badge>;
    default:
      return <Badge variant="secondary">Không xác định</Badge>;
  }
};

const getPaymentBadge = (isPaid: boolean, paymentMethod: string) => {
  if (isPaid) {
    return <Badge className="bg-green-100 text-green-800">Đã thanh toán ({paymentMethod})</Badge>;
  }
  return <Badge className="bg-yellow-100 text-yellow-800">Chưa thanh toán ({paymentMethod})</Badge>;
};

const getTotalQuantity = (items: OrderItem[]) => {
  return items.reduce((sum, item) => sum + item.quantity, 0);
};

// Hàm gọi API để cập nhật trạng thái
const updateOrderStatus = async (orderId: string, status: string) => {
  console.log("Gửi yêu cầu cập nhật trạng thái:", { orderId, status });
  console.log("URL:", `http://localhost:5000/order/status/${orderId}`);
  try {
    const response = await fetch(`http://localhost:5000/order/status/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
    console.log("Response status:", response.status);
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: response.statusText || "Không thể phân tích lỗi từ server" };
      }
      console.log("Error response:", errorData);
      throw new Error(`Cập nhật trạng thái thất bại: ${errorData.message || response.statusText}`);
    }
    const updatedOrder = await response.json();
    console.log("Updated order:", updatedOrder);
    return updatedOrder;
  } catch (error: any) {
    console.error("Lỗi khi cập nhật trạng thái:", error.message);
    throw error;
  }
};

// Hàm gọi API để cập nhật trạng thái thanh toán
const updateOrderPaymentStatus = async (orderId: string, isPaid: boolean) => {
  console.log("Gửi yêu cầu cập nhật trạng thái thanh toán:", { orderId, isPaid });
  console.log("URL:", `http://localhost:5000/order/update-ispaid/${orderId}`);
  try {
    const response = await fetch(`http://localhost:5000/order/update-ispaid/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isPaid }),
    });
    console.log("Response status:", response.status);
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: response.statusText || "Không thể phân tích lỗi từ server" };
      }
      console.log("Error response:", errorData);
      throw new Error(`Cập nhật trạng thái thanh toán thất bại: ${errorData.message || response.statusText}`);
    }
    const updatedOrder = await response.json();
    console.log("Updated order:", updatedOrder);
    return updatedOrder.order || updatedOrder;
  } catch (error: any) {
    console.error("Lỗi khi cập nhật trạng thái thanh toán:", error.message);
    throw error;
  }
};

// Mapping trạng thái với icon và nhãn
const statusOptions = [
  { value: "pending", label: "Chờ xác nhận", icon: Clock },
  { value: "confirmed", label: "Đã xác nhận", icon: CheckCircle },
  { value: "shipping", label: "Đang giao", icon: Truck },
  { value: "delivered", label: "Đã giao", icon: Package },
  { value: "cancelled", label: "Đã hủy", icon: XCircle },
  // { value: "returned", label: "Đã trả hàng", icon: RotateCcw },
];

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Gọi API để lấy dữ liệu đơn hàng
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/order/get/all");
        console.log("Response status (get all):", response.status);
        if (!response.ok) {
          const errorData = await response.json();
          console.log("Error response (get all):", errorData);
          throw new Error(`Không thể lấy dữ liệu đơn hàng: ${errorData.message || response.statusText}`);
        }
        const data = await response.json();
        console.log("Dữ liệu từ API:", data);
        console.log("Danh sách đơn hàng:", data.orders);
        const ordersArray = Array.isArray(data.orders) ? data.orders : [];
        setOrders(ordersArray);
        setLoading(false);
      } catch (err: any) {
        console.error("Lỗi khi lấy dữ liệu đơn hàng:", err.message);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Hàm xử lý cập nhật trạng thái
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    let timeoutId: NodeJS.Timeout;
    const order = orders.find((o) => o._id === orderId);
    if (!order) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy đơn hàng",
        variant: "destructive",
      });
      return;
    }

    // Kiểm tra trạng thái thanh toán trước khi chuyển sang "delivered"
    if (newStatus === "delivered" && !order.isPaid) {
      toast({
        title: "Lỗi",
        description: "Không thể giao hàng khi đơn hàng chưa được thanh toán",
        variant: "destructive",
      });
      return;
    }

    // Hiển thị toast với tùy chọn hủy
    const toastId = toast({
      title: "Xác nhận cập nhật trạng thái",
      description: `Đơn hàng sẽ được cập nhật thành "${statusOptions.find((opt) => opt.value === newStatus)?.label}" sau 5 giây.`,
      action: (
        <Button
          variant="outline"
          onClick={() => clearTimeout(timeoutId)}
        >
          Hủy
        </Button>
      ),
      duration: 5000,
    });

    // Chờ 5 giây để thực hiện hành động, trừ khi người dùng nhấn Hủy
    timeoutId = setTimeout(async () => {
      console.log("Bắt đầu cập nhật trạng thái:", { orderId, newStatus });
      try {
        // Nếu trạng thái mới là "cancelled" hoặc "returned", tự động đặt isPaid = false
        if (newStatus === "cancelled" || newStatus === "returned") {
          if (order.isPaid) {
            await updateOrderPaymentStatus(orderId, false);
          }
        }

        const updatedOrder = await updateOrderStatus(orderId, newStatus);
        const newOrderStatus = updatedOrder.status || updatedOrder.order?.status || newStatus;
        if (!statusOptions.some((option) => option.value === newOrderStatus)) {
          throw new Error(`Trạng thái không hợp lệ trong phản hồi API: ${newOrderStatus}`);
        }

        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  status: newOrderStatus as Order["status"],
                  isPaid: newStatus === "cancelled" || newStatus === "returned" ? false : order.isPaid,
                }
              : order
          )
        );
        console.log("Cập nhật trạng thái thành công:", { orderId, newStatus });
        toast({
          title: "Thành công",
          description: `Cập nhật trạng thái thành công: ${newStatus}`,
        });
      } catch (error: any) {
        console.error("Lỗi trong handleUpdateStatus:", error.message);
        setError(error.message);
        toast({
          title: "Lỗi",
          description: error.message,
          variant: "destructive",
        });
      }
    }, 5000);
  };

  // Hàm xử lý cập nhật trạng thái thanh toán
  const handleUpdatePaymentStatus = async (orderId: string, isPaid: boolean) => {
    let timeoutId: NodeJS.Timeout;
    const order = orders.find((o) => o._id === orderId);
    if (!order) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy đơn hàng",
        variant: "destructive",
      });
      return;
    }

    // Kiểm tra trạng thái đơn hàng trước khi cập nhật thanh toán
    if (isPaid && (order.status === "cancelled" || order.status === "returned")) {
      toast({
        title: "Lỗi",
        description: "Không thể đánh dấu đã thanh toán cho đơn hàng đã hủy hoặc trả hàng",
        variant: "destructive",
      });
      return;
    }

    // Hiển thị toast với tùy chọn hủy
    const toastId = toast({
      title: "Xác nhận cập nhật thanh toán",
      description: `Đơn hàng sẽ được đánh dấu là "${isPaid ? "Đã thanh toán" : "Chưa thanh toán"}" sau 5 giây.`,
      action: (
        <Button
          variant="outline"
          onClick={() => clearTimeout(timeoutId)}
        >
          Hủy
        </Button>
      ),
      duration: 5000,
    });

    // Chờ 5 giây để thực hiện hành động, trừ khi người dùng nhấn Hủy
    timeoutId = setTimeout(async () => {
      console.log("Bắt đầu cập nhật trạng thái thanh toán:", { orderId, isPaid });
      try {
        const updatedOrder = await updateOrderPaymentStatus(orderId, isPaid);
        const newIsPaid = updatedOrder.isPaid ?? isPaid;
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, isPaid: newIsPaid } : order
          )
        );
        console.log("Cập nhật trạng thái thanh toán thành công:", { orderId, isPaid });
        toast({
          title: "Thành công",
          description: `Cập nhật trạng thái thanh toán thành công: ${isPaid ? "Đã thanh toán" : "Chưa thanh toán"}`,
        });
      } catch (error: any) {
        console.error("Lỗi trong handleUpdatePaymentStatus:", error.message);
        setError(error.message);
        toast({
          title: "Lỗi",
          description: error.message,
          variant: "destructive",
        });
      }
    }, 5000);
  };

  const filteredOrders = Array.isArray(orders)
    ? orders.filter((order) => {
        const matchesSearch =
          (order.orderCode ? order.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
          (order.shippingAddress?.fullName ? order.shippingAddress.fullName.toLowerCase().includes(searchTerm.toLowerCase()) : false);
        const matchesStatus = selectedStatus === "all" || order.status === selectedStatus;
        return matchesSearch && matchesStatus;
      })
    : [];

  const totalOrders = orders.length;
  const deliveredOrders = Array.isArray(orders)
    ? orders.filter((o) => o.status === "delivered").length
    : 0;
  const shippingOrders = Array.isArray(orders)
    ? orders.filter((o) => o.status === "shipping").length
    : 0;
  const pendingOrders = Array.isArray(orders)
    ? orders.filter((o) => o.status === "pending").length
    : 0;
  const totalRevenue = Array.isArray(orders)
    ? orders
        .filter((o) => o.status === "delivered")
        .reduce((sum, order) => sum + order.totalAmount, 0)
    : 0;

  if (loading) {
    return (
      <AdminSidebar>
        <div className="p-6">Đang tải dữ liệu...</div>
      </AdminSidebar>
    );
  }

  if (error) {
    return (
      <AdminSidebar>
        <div className="p-6 text-red-500">Lỗi: {error}</div>
      </AdminSidebar>
    );
  }

  return (
    <AdminSidebar>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý đơn hàng</h1>
            <p className="text-gray-600 mt-2">Theo dõi và quản lý tất cả đơn hàng</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng đơn hàng</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đã giao</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{deliveredOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đang giao</CardTitle>
              <Truck className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{shippingOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chờ xác nhận</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{formatCurrency(totalRevenue)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm mã đơn hàng, khách hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Filter className="h-4 w-4" />
                    <span>Trạng thái</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSelectedStatus("all")}>
                    Tất cả
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus("pending")}>
                    Chờ xác nhận
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus("confirmed")}>
                    Đã xác nhận
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus("shipping")}>
                    Đang giao
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus("delivered")}>
                    Đã giao
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus("cancelled")}>
                    Đã hủy
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem onClick={() => setSelectedStatus("returned")}>
                    Đã trả hàng
                  </DropdownMenuItem> */}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách đơn hàng</CardTitle>
            <CardDescription>
              Quản lý chi tiết từng đơn hàng và trạng thái
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã đơn hàng</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead>Tổng tiền</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thanh toán</TableHead>
                  <TableHead>Ngày đặt</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">{order.orderCode || "N/A"}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.shippingAddress?.fullName || "N/A"}</p>
                        <p className="text-sm text-gray-500">{order.shippingAddress?.phone || "N/A"}</p>
                        <p className="text-sm text-gray-500">{order.shippingAddress?.address || "N/A"}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {order.items.slice(0, 2).map((item, index) => (
                          <div key={index}>
                            {item.productName} (x{item.quantity})
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <div className="text-gray-500">
                            +{order.items.length - 2} khác
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getTotalQuantity(order.items)}</TableCell>
                    <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>{getPaymentBadge(order.isPaid, order.paymentMethod)}</TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {statusOptions.map((option) => {
                            const isDisabled =
                              order.status === option.value ||
                              (option.value === "delivered" && !order.isPaid) ||
                              ((option.value === "cancelled" || option.value === "returned") && order.isPaid);
                            return (
                              <DropdownMenuItem
                                key={option.value}
                                onClick={() => handleUpdateStatus(order._id, option.value)}
                                disabled={isDisabled}
                              >
                                <option.icon className="mr-2 h-4 w-4" />
                                {option.label}
                              </DropdownMenuItem>
                            );
                          })}
                          <DropdownMenuItem
                            onClick={() => handleUpdatePaymentStatus(order._id, true)}
                            disabled={order.isPaid || order.status === "cancelled" || order.status === "returned"}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Đã thanh toán
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleUpdatePaymentStatus(order._id, false)}
                            disabled={!order.isPaid}
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Chưa thanh toán
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminSidebar>
  );
}