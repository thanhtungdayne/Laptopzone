import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Laptop } from "@/types/product";

interface SpecificationsProps {
  laptop: Laptop;
}

export default function Specifications({ laptop }: SpecificationsProps) {
  const specs = [
    {
      category: "Hiệu năng",
      items: [
        {
          label: "Bộ xử lý",
          value: Array.isArray(laptop.processor)
            ? laptop.processor.join(", ")
            : laptop.processor || "Đang cập nhật",
        },
        {
          label: "Bộ nhớ (RAM)",
          value: Array.isArray(laptop.ram)
            ? laptop.ram.join(", ")
            : laptop.ram || "Đang cập nhật",
        },
        {
          label: "Bộ nhớ",
          value: Array.isArray(laptop.storage)
            ? laptop.storage.join(", ")
            : laptop.storage || "Đang cập nhật",
        },
        {
          label: "Đồ họa",
          value: Array.isArray(laptop.graphics)
            ? laptop.graphics.join(", ")
            : laptop.graphics || "Đang cập nhật",
        },
      ],
    },
    {
      category: "Màn hình",
      items: [
        { label: "Kích thước màn hình", value: laptop.display || "Đang cập nhật" },
        { label: "Độ phân giải", value: laptop.resolution || "Đang cập nhật" },
        { label: "Loại tấm nền", value: laptop.panelType || "Đang cập nhật" },
        { label: "Tần số quét", value: laptop.refreshRate || "Đang cập nhật" },
      ],
    },
    {
      category: "Thiết kế & Chế tạo",
      items: [
        { label: "Trọng lượng", value: laptop.weight || "Đang cập nhật" },
        { label: "Kích thước", value: laptop.dimensions || "Đang cập nhật" },
        {
          label: "Chất liệu",
          value:
            (typeof laptop.brand === "string" ? laptop.brand : laptop.brand?.brandName) === "Apple"
              ? "Nhôm"
              : "Nhựa/Kim loại",
        },
        {
          label: "Màu sắc",
          value: Array.isArray(laptop.color)
            ? laptop.color.join(", ")
            : laptop.color || "Đang cập nhật",
        },
      ],
    },
    {
      category: "Kết nối",
      items: [
        { label: "Wi-Fi", value: "Đang cập nhật" },
        { label: "Bluetooth", value: "Đang cập nhật" },
        { label: "Cổng USB", value: "Đang cập nhật" },
        { label: "Cổng khác", value: "Đang cập nhật" },
      ],
    },
    {
      category: "Pin & Nguồn",
      items: [
        { label: "Thời lượng pin", value: "Đang cập nhật" },
        { label: "Dung lượng pin", value: "Đang cập nhật" },
        { label: "Sạc", value: "Đang cập nhật" },
        { label: "Bộ sạc", value: "Đang cập nhật" },
      ],
    },
  ];

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
                  <div
                    key={item.label}
                    className="flex justify-between items-start py-2 border-b last:border-b-0"
                  >
                    <span className="font-medium text-sm text-muted-foreground min-w-0 flex-1">
                      {item.label}
                    </span>
                    <span className="font-medium text-sm text-right ml-4">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tính năng chính</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Array.isArray(laptop.features) && laptop.features.length > 0 ? (
              laptop.features.map((feature) => (
                <Badge key={feature} variant="secondary">
                  {feature}
                </Badge>
              ))
            ) : (
              <Badge variant="outline">Đang cập nhật</Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}