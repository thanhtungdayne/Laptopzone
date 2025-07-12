"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp, Package, Users, DollarSign } from "lucide-react";
import AdminSidebar from "@/components/admin/admin-sidebar";

// Mock data for charts
const revenueData = [
  { month: "T1", revenue: 45000000, orders: 120 },
  { month: "T2", revenue: 52000000, orders: 145 },
  { month: "T3", revenue: 48000000, orders: 132 },
  { month: "T4", revenue: 61000000, orders: 168 },
  { month: "T5", revenue: 55000000, orders: 155 },
  { month: "T6", revenue: 67000000, orders: 189 },
  { month: "T7", revenue: 72000000, orders: 201 },
  { month: "T8", revenue: 69000000, orders: 195 },
  { month: "T9", revenue: 78000000, orders: 220 },
  { month: "T10", revenue: 82000000, orders: 235 },
  { month: "T11", revenue: 88000000, orders: 250 },
  { month: "T12", revenue: 95000000, orders: 275 },
];

const topProductsData = [
  { name: "MacBook Pro M3", sales: 145, revenue: 435000000 },
  { name: "Dell XPS 13", sales: 132, revenue: 264000000 },
  { name: "ASUS ROG Strix", sales: 128, revenue: 384000000 },
  { name: "HP Spectre x360", sales: 115, revenue: 287500000 },
  { name: "Lenovo ThinkPad X1", sales: 98, revenue: 294000000 },
];

const categoryData = [
  { name: "Gaming", value: 35, color: "#8884d8" },
  { name: "Doanh nghiệp", value: 28, color: "#82ca9d" },
  { name: "Ultrabook", value: 22, color: "#ffc658" },
  { name: "Workstation", value: 15, color: "#ff7300" },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

export default function AdminPage() {
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = revenueData.reduce((sum, item) => sum + item.orders, 0);
  const avgOrderValue = totalRevenue / totalOrders;

  return (
    <AdminSidebar>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bảng điều khiển quản trị</h1>
          <p className="text-gray-600 mt-2">
            Tổng quan về doanh số và hiệu suất cửa hàng
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">+12.5% so với tháng trước</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng đơn hàng</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalOrders.toLocaleString("vi-VN")}
              </div>
              <p className="text-xs text-muted-foreground">+8.2% so với tháng trước</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Giá trị đơn hàng TB</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(avgOrderValue)}</div>
              <p className="text-xs text-muted-foreground">+3.8% so với tháng trước</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sản phẩm bán chạy</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{topProductsData.length}</div>
              <p className="text-xs text-muted-foreground">Top sản phẩm trong tháng</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="revenue" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
            <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
            <TabsTrigger value="products">Sản phẩm</TabsTrigger>
            <TabsTrigger value="categories">Danh mục</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue">
            <Card>
              <CardHeader>
                <CardTitle>Doanh thu theo tháng</CardTitle>
                <CardDescription>Biểu đồ doanh thu 12 tháng gần nhất</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis
                      tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                    />
                    <Tooltip
                      formatter={(value) => [formatCurrency(Number(value)), "Doanh thu"]}
                      labelFormatter={(label) => `Tháng ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#8884d8"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Số lượng đơn hàng theo tháng</CardTitle>
                <CardDescription>
                  Biểu đồ số lượng đơn hàng 12 tháng gần nhất
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [value, "Đơn hàng"]}
                      labelFormatter={(label) => `Tháng ${label}`}
                    />
                    <Bar dataKey="orders" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Top sản phẩm bán chạy</CardTitle>
                <CardDescription>5 sản phẩm có doanh số cao nhất</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={topProductsData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(value) => `${value}`} />
                    <YAxis dataKey="name" type="category" width={120} />
                    <Tooltip
                      formatter={(value, name) => [
                        name === "sales" ? `${value} sản phẩm` : formatCurrency(Number(value)),
                        name === "sales" ? "Đã bán" : "Doanh thu",
                      ]}
                    />
                    <Bar dataKey="sales" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>Phân bố theo danh mục</CardTitle>
                <CardDescription>Tỷ lệ doanh số theo từng danh mục sản phẩm</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, "Tỷ lệ"]} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Product Performance Table */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Chi tiết hiệu suất sản phẩm</CardTitle>
            <CardDescription>
              Bảng thống kê chi tiết các sản phẩm bán chạy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Tên sản phẩm</th>
                    <th className="text-left p-4 font-medium">Số lượng bán</th>
                    <th className="text-left p-4 font-medium">Doanh thu</th>
                    <th className="text-left p-4 font-medium">Giá trung bình</th>
                  </tr>
                </thead>
                <tbody>
                  {topProductsData.map((product, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium">{product.name}</td>
                      <td className="p-4">{product.sales.toLocaleString("vi-VN")}</td>
                      <td className="p-4">{formatCurrency(product.revenue)}</td>
                      <td className="p-4">
                        {formatCurrency(product.revenue / product.sales)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminSidebar>
  );
}
