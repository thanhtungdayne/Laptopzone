
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
import { Search, MoreHorizontal, Eye, Users, UserCheck } from "lucide-react";
import AdminSidebar from "@/components/admin/admin-sidebar";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  status: boolean;
  role: number;
  joinDate: string;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("vi-VN");
};

const getStatusBadge = (status: boolean) => {
  return status ? (
    <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>
  ) : (
    <Badge className="bg-red-100 text-red-800">Bị chặn</Badge>
  );
};

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/users");
        if (!response.ok) {
          throw new Error("Failed to fetch customers");
        }
        const data = await response.json();
        if (!data.status || !Array.isArray(data.users)) {
          throw new Error("Invalid response format");
        }
        const formattedData = data.users.map((customer: any) => ({
          id: customer._id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone && customer.phone !== "" ? customer.phone : "Chưa cung cấp",
          address: customer.address && customer.address !== "" ? customer.address : "Chưa cung cấp",
          status: customer.status,
          role: customer.role,
          joinDate: customer.createdAt,
        }));
        setCustomers(formattedData);
      } catch (err) {
        setError("Không thể tải dữ liệu khách hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((customer) => {
    return (
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.phone && customer.phone !== "Chưa cung cấp" && customer.phone.includes(searchTerm))
    );
  });

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.status).length;

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
              Thông tin chi tiết của khách hàng
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center">Đang tải...</div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead>Liên hệ</TableHead>
                    <TableHead>Địa chỉ</TableHead>
                    <TableHead>Vai trò</TableHead>
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
                      <TableCell>{customer.address}</TableCell>
                      <TableCell>{customer.role === 0 ? "Khách hàng" : "Quản trị"}</TableCell>
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
                            <DropdownMenuItem>Gửi email</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminSidebar>
  );
}