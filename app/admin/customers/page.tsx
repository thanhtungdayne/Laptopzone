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
import { Search, MoreHorizontal, Eye, Users, UserCheck, Star } from "lucide-react";
import AdminSidebar from "@/components/admin/admin-sidebar";

// Mock customers data
const customersData = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    phone: "0901234567",
    totalOrders: 5,
    totalSpent: 125000000,
    lastOrder: "2024-07-01",
    status: "active",
    joinDate: "2024-01-15",
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "tranthib@email.com",
    phone: "0902345678",
    totalOrders: 3,
    totalSpent: 87000000,
    lastOrder: "2024-06-28",
    status: "active",
    joinDate: "2024-02-20",
  },
  {
    id: 3,
    name: "Lê Văn C",
    email: "levanc@email.com",
    phone: "0903456789",
    totalOrders: 1,
    totalSpent: 28500000,
    lastOrder: "2024-07-02",
    status: "new",
    joinDate: "2024-07-02",
  },
  {
    id: 4,
    name: "Phạm Thị D",
    email: "phamthid@email.com",
    phone: "0904567890",
    totalOrders: 8,
    totalSpent: 245000000,
    lastOrder: "2024-06-25",
    status: "vip",
    joinDate: "2023-11-10",
  },
  {
    id: 5,
    name: "Hoàng Văn E",
    email: "hoangvane@email.com",
    phone: "0905678901",
    totalOrders: 2,
    totalSpent: 75000000,
    lastOrder: "2024-06-29",
    status: "active",
    joinDate: "2024-03-05",
  },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("vi-VN");
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "vip":
      return <Badge className="bg-purple-100 text-purple-800">VIP</Badge>;
    case "active":
      return <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>;
    case "new":
      return <Badge className="bg-blue-100 text-blue-800">Mới</Badge>;
    case "inactive":
      return <Badge variant="secondary">Không hoạt động</Badge>;
    default:
      return <Badge variant="secondary">Không xác định</Badge>;
  }
};

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = customersData.filter((customer) => {
    return (
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
    );
  });

  const totalCustomers = customersData.length;
  const activeCustomers = customersData.filter((c) => c.status === "active").length;
  const vipCustomers = customersData.filter((c) => c.status === "vip").length;
  const newCustomers = customersData.filter((c) => c.status === "new").length;
  const avgOrderValue =
    customersData.reduce((sum, c) => sum + c.totalSpent, 0) /
    customersData.reduce((sum, c) => sum + c.totalOrders, 0);

  return (
    <AdminSidebar>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý khách hàng</h1>
            <p className="text-gray-600 mt-2">
              Theo dõi thông tin và hoạt động khách hàng
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng khách hàng</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCustomers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hoạt động</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeCustomers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">VIP</CardTitle>
              <Star className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{vipCustomers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Khách mới</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{newCustomers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Giá trị TB/đơn</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{formatCurrency(avgOrderValue)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm khách hàng theo tên, email, số điện thoại..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách khách hàng</CardTitle>
            <CardDescription>
              Thông tin chi tiết và lịch sử mua hàng của khách hàng
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Liên hệ</TableHead>
                  <TableHead>Tổng đơn</TableHead>
                  <TableHead>Tổng chi tiêu</TableHead>
                  <TableHead>Đơn gần nhất</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tham gia</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-gray-500">ID: {customer.id}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{customer.email}</p>
                        <p className="text-gray-500">{customer.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{customer.totalOrders}</span>
                    </TableCell>
                    <TableCell>{formatCurrency(customer.totalSpent)}</TableCell>
                    <TableCell>{formatDate(customer.lastOrder)}</TableCell>
                    <TableCell>{getStatusBadge(customer.status)}</TableCell>
                    <TableCell>{formatDate(customer.joinDate)}</TableCell>
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
                          <DropdownMenuItem>Lịch sử đơn hàng</DropdownMenuItem>
                          <DropdownMenuItem>Gửi email</DropdownMenuItem>
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
