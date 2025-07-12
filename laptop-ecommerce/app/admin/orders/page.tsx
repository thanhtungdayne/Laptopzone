"use client";

import { useState } from "react";
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
  Eye,
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import AdminSidebar from "@/components/admin/admin-sidebar";

// Mock orders data
const ordersData = [
  {
    id: "ORD-001",
    customer: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    products: ["MacBook Pro M3", "Mouse Magic"],
    total: 45200000,
    status: "completed",
    date: "2024-07-01T10:30:00",
    payment: "paid",
  },
  {
    id: "ORD-002",
    customer: "Trần Thị B",
    email: "tranthib@email.com",
    products: ["Dell XPS 13"],
    total: 35000000,
    status: "processing",
    date: "2024-07-01T14:15:00",
    payment: "paid",
  },
  {
    id: "ORD-003",
    customer: "Lê Văn C",
    email: "levanc@email.com",
    products: ["ASUS ROG Strix", "Gaming Keyboard"],
    total: 28500000,
    status: "pending",
    date: "2024-07-02T09:20:00",
    payment: "pending",
  },
  {
    id: "ORD-004",
    customer: "Phạm Thị D",
    email: "phamthid@email.com",
    products: ["HP Spectre x360"],
    total: 32000000,
    status: "cancelled",
    date: "2024-06-30T16:45:00",
    payment: "refunded",
  },
  {
    id: "ORD-005",
    customer: "Hoàng Văn E",
    email: "hoangvane@email.com",
    products: ["ThinkPad X1", "Docking Station"],
    total: 42000000,
    status: "shipped",
    date: "2024-06-29T11:00:00",
    payment: "paid",
  },
];

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
    case "completed":
      return <Badge className="bg-green-100 text-green-800">Hoàn thành</Badge>;
    case "processing":
      return <Badge className="bg-blue-100 text-blue-800">Đang xử lý</Badge>;
    case "shipped":
      return <Badge className="bg-purple-100 text-purple-800">Đã gửi</Badge>;
    case "pending":
      return <Badge className="bg-yellow-100 text-yellow-800">Chờ xử lý</Badge>;
    case "cancelled":
      return <Badge variant="destructive">Đã hủy</Badge>;
    default:
      return <Badge variant="secondary">Không xác định</Badge>;
  }
};

const getPaymentBadge = (payment: string) => {
  switch (payment) {
    case "paid":
      return <Badge className="bg-green-100 text-green-800">Đã thanh toán</Badge>;
    case "pending":
      return <Badge className="bg-yellow-100 text-yellow-800">Chờ thanh toán</Badge>;
    case "refunded":
      return <Badge className="bg-gray-100 text-gray-800">Đã hoàn tiền</Badge>;
    default:
      return <Badge variant="secondary">Không xác định</Badge>;
  }
};

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredOrders = ordersData.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalOrders = ordersData.length;
  const completedOrders = ordersData.filter((o) => o.status === "completed").length;
  const processingOrders = ordersData.filter((o) => o.status === "processing").length;
  const pendingOrders = ordersData.filter((o) => o.status === "pending").length;
  const totalRevenue = ordersData
    .filter((o) => o.status === "completed")
    .reduce((sum, order) => sum + order.total, 0);

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
              <CardTitle className="text-sm font-medium">Hoàn thành</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đang xử lý</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{processingOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chờ xử lý</CardTitle>
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
                  placeholder="Tìm kiếm đơn hàng, khách hàng..."
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
                    Chờ xử lý
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus("processing")}>
                    Đang xử lý
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus("shipped")}>
                    Đã gửi
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus("completed")}>
                    Hoàn thành
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus("cancelled")}>
                    Đã hủy
                  </DropdownMenuItem>
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
                  <TableHead>Tổng tiền</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thanh toán</TableHead>
                  <TableHead>Ngày đặt</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customer}</p>
                        <p className="text-sm text-gray-500">{order.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {order.products.slice(0, 2).map((product, index) => (
                          <div key={index}>{product}</div>
                        ))}
                        {order.products.length > 2 && (
                          <div className="text-gray-500">
                            +{order.products.length - 2} khác
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(order.total)}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>{getPaymentBadge(order.payment)}</TableCell>
                    <TableCell>{formatDate(order.date)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem>Cập nhật trạng thái</DropdownMenuItem>
                          <DropdownMenuItem>In hóa đơn</DropdownMenuItem>
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
