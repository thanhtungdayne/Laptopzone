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
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Package,
} from "lucide-react";
import AdminSidebar from "@/components/admin/admin-sidebar";
import { laptops } from "@/data/laptops";
import { formatPrice } from "@/lib/utils";

// Convert laptop data to admin format with sales data
const productsData = laptops.map((laptop) => ({
  id: laptop.id,
  name: laptop.name,
  brand: laptop.brand,
  category: laptop.category,
  price: laptop.price,
  originalPrice: laptop.originalPrice,
  stock: laptop.stock,
  status: laptop.stock === 0 ? "out_of_stock" : laptop.stock <= 5 ? "low_stock" : "active",
  sales: Math.floor(Math.random() * 200) + 50, // Random sales data for demo
  image: laptop.image,
  inStock: laptop.inStock,
}));

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-100 text-green-800">Đang bán</Badge>;
    case "out_of_stock":
      return <Badge variant="destructive">Hết hàng</Badge>;
    case "low_stock":
      return <Badge className="bg-yellow-100 text-yellow-800">Sắp hết</Badge>;
    default:
      return <Badge variant="secondary">Không xác định</Badge>;
  }
};

const getCategoryDisplayName = (category: string) => {
  const categoryMap: { [key: string]: string } = {
    gaming: "Gaming",
    ultrabook: "Ultrabook",
    business: "Doanh nghiệp",
    workstation: "Workstation",
  };
  return categoryMap[category] || category;
};

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredProducts = productsData.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalProducts = productsData.length;
  const activeProducts = productsData.filter((p) => p.status === "active").length;
  const outOfStock = productsData.filter((p) => p.status === "out_of_stock").length;
  const lowStock = productsData.filter((p) => p.status === "low_stock").length;

  return (
    <AdminSidebar>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý sản phẩm</h1>
            <p className="text-gray-600 mt-2">Quản lý danh sách sản phẩm và kho hàng</p>
          </div>
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Thêm sản phẩm</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng sản phẩm</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đang bán</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeProducts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hết hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{outOfStock}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sắp hết</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{lowStock}</div>
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
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Filter className="h-4 w-4" />
                    <span>Danh mục</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSelectedCategory("all")}>
                    Tất cả
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedCategory("gaming")}>
                    Gaming
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedCategory("ultrabook")}>
                    Ultrabook
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedCategory("business")}>
                    Doanh nghiệp
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedCategory("workstation")}>
                    Workstation
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách sản phẩm</CardTitle>
            <CardDescription>
              Quản lý thông tin chi tiết của từng sản phẩm
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead>Thương hiệu</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Giá</TableHead>
                  <TableHead>Kho</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Đã bán</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <span className="font-medium">{product.name}</span>
                          {product.originalPrice && (
                            <div className="text-sm text-red-600 font-medium">
                              Sale: {formatPrice(product.originalPrice - product.price)} off
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.brand}</Badge>
                    </TableCell>
                    <TableCell>{getCategoryDisplayName(product.category)}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{formatPrice(product.price)}</div>
                        {product.originalPrice && (
                          <div className="text-sm text-gray-500 line-through">
                            {formatPrice(product.originalPrice)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          product.stock <= 5
                            ? "text-red-600 font-medium"
                            : product.stock <= 10
                            ? "text-yellow-600 font-medium"
                            : "text-green-600 font-medium"
                        }
                      >
                        {product.stock}
                      </span>
                    </TableCell>
                    <TableCell>{getStatusBadge(product.status)}</TableCell>
                    <TableCell>{product.sales.toLocaleString("vi-VN")}</TableCell>
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
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Xóa
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
