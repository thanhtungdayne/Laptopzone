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
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd"
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  Settings,
  Eye,
  EyeOff,
} from "lucide-react"
import AdminSidebar from "@/components/admin/admin-sidebar"

// Widget configuration
const availableWidgets = [
  {
    id: "revenue-chart",
    title: "Biểu đồ doanh thu",
    description: "Doanh thu theo thời gian",
    icon: BarChart3,
    enabled: true,
  },
  {
    id: "orders-chart",
    title: "Biểu đồ đơn hàng",
    description: "Số lượng đơn hàng",
    icon: ShoppingCart,
    enabled: true,
  },
  {
    id: "products-pie",
    title: "Phân bố sản phẩm",
    description: "Sản phẩm theo danh mục",
    icon: PieChart,
    enabled: true,
  },
  {
    id: "customers-stats",
    title: "Thống kê khách hàng",
    description: "Tổng quan khách hàng",
    icon: Users,
    enabled: false,
  },
  {
    id: "inventory-status",
    title: "Tình trạng kho",
    description: "Trạng thái tồn kho",
    icon: Package,
    enabled: false,
  },
  {
    id: "trending-products",
    title: "Sản phẩm xu hướng",
    description: "Sản phẩm bán chạy",
    icon: TrendingUp,
    enabled: true,
  },
]

export default function DashboardPage() {
  const [widgets, setWidgets] = useState(availableWidgets)
  const [layout, setLayout] = useState(["revenue-chart", "orders-chart", "products-pie", "trending-products"])

  const handleWidgetToggle = (widgetId: string) => {
    setWidgets(widgets.map(widget => 
      widget.id === widgetId 
        ? { ...widget, enabled: !widget.enabled }
        : widget
    ))
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(layout)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setLayout(items)
  }

  const enabledWidgets = widgets.filter(widget => widget.enabled)

  return (
    <AdminSidebar>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tùy chỉnh Dashboard</h1>
            <p className="text-gray-600 mt-2">Cấu hình và sắp xếp các widget hiển thị</p>
          </div>
          <Button>
            <Settings className="mr-2 h-4 w-4" />
            Lưu cấu hình
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Widget Configuration */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Cấu hình Widget</CardTitle>
                <CardDescription>Bật/tắt và sắp xếp các widget</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {widgets.map((widget) => {
                  const IconComponent = widget.icon
                  return (
                    <div key={widget.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <IconComponent className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium">{widget.title}</p>
                          <p className="text-sm text-gray-500">{widget.description}</p>
                        </div>
                      </div>
                      <Switch
                        checked={widget.enabled}
                        onCheckedChange={() => handleWidgetToggle(widget.id)}
                      />
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Layout Settings */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Cài đặt bố cục</CardTitle>
                <CardDescription>Tùy chỉnh cách hiển thị dashboard</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Hiển thị grid</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Auto-refresh</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Chế độ tối</Label>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Widget Preview */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Xem trước Dashboard</CardTitle>
                <CardDescription>Kéo thả để sắp xếp thứ tự widget</CardDescription>
              </CardHeader>
              <CardContent>
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="widgets">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        {layout.map((widgetId, index) => {
                          const widget = widgets.find(w => w.id === widgetId && w.enabled)
                          if (!widget) return null

                          const IconComponent = widget.icon
                          return (
                            <Draggable key={widgetId} draggableId={widgetId} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`p-4 border-2 border-dashed rounded-lg transition-colors ${
                                    snapshot.isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                                  }`}
                                >
                                  <div className="flex items-center space-x-3">
                                    <IconComponent className="h-8 w-8 text-gray-400" />
                                    <div>
                                      <h4 className="font-medium">{widget.title}</h4>
                                      <p className="text-sm text-gray-500">{widget.description}</p>
                                    </div>
                                  </div>
                                  <div className="mt-4 h-24 bg-gray-100 rounded flex items-center justify-center">
                                    <span className="text-gray-400">Widget Preview</span>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          )
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </CardContent>
            </Card>

            {/* Dashboard Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Widget hiển thị</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600 mt-2">
                    {enabledWidgets.length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <EyeOff className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium">Widget ẩn</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-600 mt-2">
                    {widgets.length - enabledWidgets.length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Biểu đồ</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600 mt-2">
                    {enabledWidgets.filter(w => w.id.includes('chart') || w.id.includes('pie')).length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium">Thống kê</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600 mt-2">
                    {enabledWidgets.filter(w => w.id.includes('stats') || w.id.includes('trending')).length}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AdminSidebar>
  )
}