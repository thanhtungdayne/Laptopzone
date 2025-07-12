"use client"

import { CheckCircle, Truck, RotateCcw, Phone } from "lucide-react"

export default function PromotionalFeatures() {
  const features = [
    {
      icon: CheckCircle,
      title: "Sản phẩm chất lượng",
      color: "text-green-500",
    },
    {
      icon: Truck,
      title: "Miễn phí ship",
      color: "text-blue-500",
    },
    {
      icon: RotateCcw,
      title: "Hoàn trả 14 ngày",
      color: "text-orange-500",
    },
    {
      icon: Phone,
      title: "Hỗ trợ 24/7",
      color: "text-purple-500",
    },
  ]

  return (
    <div className="bg-gray-50 py-8 mb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
                <Icon className={`h-8 w-8 ${feature.color} flex-shrink-0`} />
                <div>
                  <p className="font-medium text-sm text-gray-900">{feature.title}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
