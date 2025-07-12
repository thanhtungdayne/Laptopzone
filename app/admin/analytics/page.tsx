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
  AreaChart,
  Area,
} from "recharts";
import { TrendingUp, TrendingDown, Users, DollarSign, Package, Eye } from "lucide-react";
import AdminSidebar from "@/components/admin/admin-sidebar";

// Mock analytics data
const revenueAnalytics = [
  { month: "T1", revenue: 45000000, orders: 120, visitors: 2500 },
  { month: "T2", revenue: 52000000, orders: 145, visitors: 2800 },
  { month: "T3", revenue: 48000000, orders: 132, visitors: 2600 },
  { month: "T4", revenue: 61000000, orders: 168, visitors: 3200 },
  { month: "T5", revenue: 55000000, orders: 155, visitors: 2900 },
  { month: "T6", revenue: 67000000, orders: 189, visitors: 3500 },
  { month: "T7", revenue: 72000000, orders: 201, visitors: 3800 },
  { month: "T8", revenue: 69000000, orders: 195, visitors: 3600 },
  { month: "T9", revenue: 78000000, orders: 220, visitors: 4100 },
  { month: "T10", revenue: 82000000, orders: 235, visitors: 4300 },
  { month: "T11", revenue: 88000000, orders: 250, visitors: 4600 },
  { month: "T12", revenue: 95000000, orders: 275, visitors: 5000 },
];

const trafficSources = [
  { name: "Tìm kiếm trực tiếp", value: 45, color: "#8884d8" },
  { name: "Google Ads", value: 25, color: "#82ca9d" },
  { name: "Social Media", value: 20, color: "#ffc658" },
  { name: "Email Marketing", value: 10, color: "#ff7300" },
];

const conversionData = [
  { stage: "Lượt xem", value: 10000, conversion: 100 },
  { stage: "Thêm vào giỏ", value: 2500, conversion: 25 },
  { stage: "Bắt đầu thanh toán", value: 1200, conversion: 12 },
  { stage: "Hoàn thành đơn", value: 800, conversion: 8 },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

export default function AnalyticsPage() {
  const currentMonth = revenueAnalytics[revenueAnalytics.length - 1];
  const previousMonth = revenueAnalytics[revenueAnalytics.length - 2];

  const revenueGrowth =
    ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue) * 100;
  const orderGrowth =
    ((currentMonth.orders - previousMonth.orders) / previousMonth.orders) * 100;
  const visitorGrowth =
    ((currentMonth.visitors - previousMonth.visitors) / previousMonth.visitors) * 100;

  return (
    <AdminSidebar>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Phân tích dữ liệu</h1>
          <p className="text-gray-600 mt-2">Báo cáo chi tiết về hiệu suất kinh doanh</p>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Doanh thu tháng này</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(currentMonth.revenue)}
              </div>
              <div className="flex items-center text-xs">
                {revenueGrowth > 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span className={revenueGrowth > 0 ? "text-green-600" : "text-red-600"}>
                  {Math.abs(revenueGrowth).toFixed(1)}%
                </span>
                <span className="text-muted-foreground ml-1">so với tháng trước</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đơn hàng</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentMonth.orders}</div>
              <div className="flex items-center text-xs">
                {orderGrowth > 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span className={orderGrowth > 0 ? "text-green-600" : "text-red-600"}>
                  {Math.abs(orderGrowth).toFixed(1)}%
                </span>
                <span className="text-muted-foreground ml-1">so với tháng trước</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lượt truy cập</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {currentMonth.visitors.toLocaleString()}
              </div>
              <div className="flex items-center text-xs">
                {visitorGrowth > 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span className={visitorGrowth > 0 ? "text-green-600" : "text-red-600"}>
                  {Math.abs(visitorGrowth).toFixed(1)}%
                </span>
                <span className="text-muted-foreground ml-1">so với tháng trước</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tỷ lệ chuyển đổi</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8.0%</div>
              <p className="text-xs text-muted-foreground">Từ lượt xem đến mua hàng</p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Charts */}
        <Tabs defaultValue="revenue" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
            <TabsTrigger value="traffic">Lưu lượng</TabsTrigger>
            <TabsTrigger value="conversion">Chuyển đổi</TabsTrigger>
            <TabsTrigger value="sources">Nguồn truy cập</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Xu hướng doanh thu</CardTitle>
                  <CardDescription>Doanh thu theo tháng trong năm</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={revenueAnalytics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis
                        tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                      />
                      <Tooltip
                        formatter={(value) => [
                          formatCurrency(Number(value)),
                          "Doanh thu",
                        ]}
                        labelFormatter={(label) => `Tháng ${label}`}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Số lượng đơn hàng</CardTitle>
                  <CardDescription>Đơn hàng theo tháng trong năm</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueAnalytics}>
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
            </div>
          </TabsContent>

          <TabsContent value="traffic">
            <Card>
              <CardHeader>
                <CardTitle>Lưu lượng truy cập website</CardTitle>
                <CardDescription>Số lượng người dùng truy cập theo tháng</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={revenueAnalytics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [value.toLocaleString(), "Lượt truy cập"]}
                      labelFormatter={(label) => `Tháng ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="visitors"
                      stroke="#ffc658"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conversion">
            <Card>
              <CardHeader>
                <CardTitle>Phễu chuyển đổi</CardTitle>
                <CardDescription>
                  Tỷ lệ chuyển đổi qua các giai đoạn mua hàng
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={conversionData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="stage" type="category" width={120} />
                    <Tooltip
                      formatter={(value, name) => [
                        name === "value" ? value.toLocaleString() : `${value}%`,
                        name === "value" ? "Số lượng" : "Tỷ lệ",
                      ]}
                    />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sources">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Nguồn lưu lượng</CardTitle>
                  <CardDescription>Phân bố nguồn truy cập website</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={trafficSources}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                        }
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {trafficSources.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, "Tỷ lệ"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Chi tiết nguồn truy cập</CardTitle>
                  <CardDescription>Thống kê chi tiết theo nguồn</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trafficSources.map((source, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: source.color }}
                          />
                          <span className="font-medium">{source.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{source.value}%</div>
                          <div className="text-sm text-gray-500">
                            {Math.round((source.value / 100) * 5000)} lượt
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminSidebar>
  );
}
