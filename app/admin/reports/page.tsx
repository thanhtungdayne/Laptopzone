"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
} from "recharts"
import { Download, Calendar, TrendingUp, FileText } from "lucide-react"
import AdminSidebar from "@/components/admin/admin-sidebar"

// Mock report data
const salesReportData = [
  { period: "Q1 2024", revenue: 186000000, orders: 425, customers: 245 },
  { period: "Q2 2024", revenue: 205000000, orders: 512, customers: 298 },
  { period: "Q3 2024", revenue: 225000000, orders: 618, customers: 356 },
  { period: "Q4 2024", revenue: 248000000, orders: 702, customers: 401 },
]

const inventoryReportData = [
  { category: "Gaming", inStock: 45, lowStock: 12, outOfStock: 3 },
  { category: "Ultrabook", inStock: 32, lowStock: 8, outOfStock: 2 },
  { category: "Doanh nghiệp", inStock: 28, lowStock: 6, outOfStock: 1 },
  { category: "Workstation", inStock: 15, lowStock: 4, outOfStock: 0 },
]

const customerReportData = [
  { segment: "VIP", count: 45, revenue: 125000000 },
  { segment: "Thường xuyên", count: 128, revenue: 89000000 },
  { segment: "Mới", count: 234, revenue: 34000000 },
  { segment: "Không hoạt động", count: 67, revenue: 0 },
]

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value)
}

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("quarter")
  const [dateFrom, setDateFrom] = useState("2024-01-01")
  const [dateTo, setDateTo] = useState("2024-12-31")

  const handleExportReport = (reportType: string) => {
    console.log(`Exporting ${reportType} report...`)
    // Implementation for export functionality
  }

  return (
    <AdminSidebar>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Báo cáo</h1>
            <p className="text-gray-600 mt-2">Tạo và xuất báo cáo chi tiết</p>
          </div>
        </div>

        {/* Report Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Bộ lọc báo cáo</CardTitle>
            <CardDescription>Chọn khoảng thời gian và loại báo cáo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Khoảng thời gian</Label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Tuần này</SelectItem>
                    <SelectItem value="month">Tháng này</SelectItem>
                    <SelectItem value="quarter">Quý này</SelectItem>
                    <SelectItem value="year">Năm này</SelectItem>
                    <SelectItem value="custom">Tùy chỉnh</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Từ ngày</Label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Đến ngày</Label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button className="w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  Tạo báo cáo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Tabs */}
        <Tabs defaultValue="sales" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="sales">Doanh số</TabsTrigger>
            <TabsTrigger value="inventory">Kho hàng</TabsTrigger>
            <TabsTrigger value="customers">Khách hàng</TabsTrigger>
            <TabsTrigger value="financial">Tài chính</TabsTrigger>
          </TabsList>

          <TabsContent value="sales">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Báo cáo doanh số</h3>
                <Button onClick={() => handleExportReport("sales")}>
                  <Download className="mr-2 h-4 w-4" />
                  Xuất Excel
                </Button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Doanh thu theo quý</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={salesReportData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                        <Tooltip formatter={(value) => [formatCurrency(Number(value)), "Doanh thu"]} />
                        <Bar dataKey="revenue" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Số lượng đơn hàng</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={salesReportData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis />
                        <Tooltip formatter={(value) => [value, "Đơn hàng"]} />
                        <Line type="monotone" dataKey="orders" stroke="#82ca9d" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Chi tiết báo cáo doanh số</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-4">Kỳ</th>
                          <th className="text-left p-4">Doanh thu</th>
                          <th className="text-left p-4">Đơn hàng</th>
                          <th className="text-left p-4">Khách hàng</th>
                          <th className="text-left p-4">Giá trị TB/đơn</th>
                        </tr>
                      </thead>
                      <tbody>
                        {salesReportData.map((row, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="p-4 font-medium">{row.period}</td>
                            <td className="p-4">{formatCurrency(row.revenue)}</td>
                            <td className="p-4">{row.orders.toLocaleString("vi-VN")}</td>
                            <td className="p-4">{row.customers.toLocaleString("vi-VN")}</td>
                            <td className="p-4">{formatCurrency(row.revenue / row.orders)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="inventory">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Báo cáo kho hàng</h3>
                <Button onClick={() => handleExportReport("inventory")}>
                  <Download className="mr-2 h-4 w-4" />
                  Xuất Excel
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Tình trạng kho theo danh mục</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={inventoryReportData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="inStock" stackId="a" fill="#22c55e" name="Còn hàng" />
                      <Bar dataKey="lowStock" stackId="a" fill="#f59e0b" name="Sắp hết" />
                      <Bar dataKey="outOfStock" stackId="a" fill="#ef4444" name="Hết hàng" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="customers">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Báo cáo khách hàng</h3>
                <Button onClick={() => handleExportReport("customers")}>
                  <Download className="mr-2 h-4 w-4" />
                  Xuất Excel
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Phân khúc khách hàng</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={customerReportData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {customerReportData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`hsl(${index * 90}, 70%, 50%)`} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Doanh thu theo phân khúc</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={customerReportData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="segment" />
                        <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                        <Tooltip formatter={(value) => [formatCurrency(Number(value)), "Doanh thu"]} />
                        <Bar dataKey="revenue" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="financial">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Báo cáo tài chính</h3>
                <Button onClick={() => handleExportReport("financial")}>
                  <Download className="mr-2 h-4 w-4" />
                  Xuất PDF
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Tổng doanh thu</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">
                      {formatCurrency(864000000)}
                    </div>
                    <div className="flex items-center text-sm text-green-600 mt-2">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +15.3% so với kỳ trước
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Chi phí vận hành</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-600">
                      {formatCurrency(125000000)}
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                      14.5% tổng doanh thu
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Lợi nhuận ròng</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">
                      {formatCurrency(739000000)}
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                      85.5% tổng doanh thu
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminSidebar>
  )
}