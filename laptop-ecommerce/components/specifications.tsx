import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Laptop } from "@/types/product"

interface SpecificationsProps {
  laptop: Laptop
}

export default function Specifications({ laptop }: SpecificationsProps) {
  const specs = [
    {
      category: "Hiệu năng",
      items: [
        { label: "Bộ xử lý", value: laptop.processor },
        { label: "Bộ nhớ (RAM)", value: laptop.ram },
        { label: "Bộ nhớ", value: laptop.storage },
        { label: "Đồ họa", value: laptop.graphics },
      ],
    },
    {
      category: "Màn hình",
      items: [
        { label: "Kích thước màn hình", value: laptop.display },
        { label: "Độ phân giải", value: "1920 x 1080 (Full HD)" }, // You can add this to your data
        { label: "Loại tấm nền", value: "IPS LCD" }, // You can add this to your data
        { label: "Tần số quét", value: laptop.category === "gaming" ? "165Hz" : "60Hz" },
      ],
    },
    {
      category: "Thiết kế & Chế tạo",
      items: [
        { label: "Trọng lượng", value: "2.1 kg" }, // You can add this to your data
        { label: "Kích thước", value: "35.6 x 25.1 x 1.9 cm" }, // You can add this to your data
        { label: "Chất liệu", value: laptop.brand === "Apple" ? "Nhôm" : "Nhựa/Kim loại" },
        { label: "Màu sắc", value: "Xám không gian" }, // You can add this to your data
      ],
    },
    {
      category: "Kết nối",
      items: [
        { label: "Wi-Fi", value: "Wi-Fi 6E (802.11ax)" },
        { label: "Bluetooth", value: "Bluetooth 5.3" },
        { label: "Cổng USB", value: "2x USB-C, 2x USB-A" },
        { label: "Cổng khác", value: "HDMI, Cổng âm thanh" },
      ],
    },
    {
      category: "Pin & Nguồn",
      items: [
        { label: "Thời lượng pin", value: "Lên đến 12 giờ" },
        { label: "Dung lượng pin", value: "70Wh" },
        { label: "Sạc", value: "Sạc nhanh 65W" },
        { label: "Bộ sạc", value: "Bộ sạc USB-C" },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Thông số kỹ thuật</h2>
        <p className="text-muted-foreground">Thông số kỹ thuật chi tiết cho {laptop.name}</p>
      </div>

      <div className="grid gap-6">
        {specs.map((section) => (
          <Card key={section.category}>
            <CardHeader>
              <CardTitle className="text-lg">{section.category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {section.items.map((item) => (
                  <div key={item.label} className="flex justify-between items-start py-2 border-b last:border-b-0">
                    <span className="font-medium text-sm text-muted-foreground min-w-0 flex-1">{item.label}</span>
                    <span className="font-medium text-sm text-right ml-4">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Key Features */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tính năng chính</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {laptop.features.map((feature) => (
              <Badge key={feature} variant="secondary">
                {feature}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
