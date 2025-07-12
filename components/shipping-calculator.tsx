"use client"

import { useState } from "react"
import { Truck, Calculator } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ShippingOption {
  id: string
  name: string
  price: number
  estimatedDays: string
  description: string
}

interface ShippingCalculatorProps {
  subtotal: number
  onShippingChange: (option: ShippingOption | null) => void
}

const SHIPPING_OPTIONS: ShippingOption[] = [
  {
    id: "standard",
    name: "Vận chuyển tiêu chuẩn",
    price: 0,
    estimatedDays: "5-7 ngày làm việc",
    description: "Miễn phí vận chuyển cho đơn hàng trên $500",
  },
  {
    id: "express",
    name: "Vận chuyển nhanh",
    price: 29.99,
    estimatedDays: "2-3 ngày làm việc",
    description: "Giao hàng nhanh hơn",
  },
  {
    id: "overnight",
    name: "Vận chuyển qua đêm",
    price: 59.99,
    estimatedDays: "1 ngày làm việc",
    description: "Giao hàng ngày hôm sau",
  },
]

export default function ShippingCalculator({ subtotal, onShippingChange }: ShippingCalculatorProps) {
  const [zipCode, setZipCode] = useState("")
  const [selectedOption, setSelectedOption] = useState<ShippingOption | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [showOptions, setShowOptions] = useState(false)

  const handleCalculate = async () => {
    if (!zipCode.trim()) return

    setIsCalculating(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsCalculating(false)
    setShowOptions(true)

    // Auto-select free shipping if eligible
    const freeShipping = subtotal >= 500
    if (freeShipping) {
      const standardOption = SHIPPING_OPTIONS[0]
      setSelectedOption(standardOption)
      onShippingChange(standardOption)
    }
  }

  const handleOptionSelect = (option: ShippingOption) => {
    const finalPrice = subtotal >= 500 && option.id === "standard" ? 0 : option.price
    const finalOption = { ...option, price: finalPrice }
    setSelectedOption(finalOption)
    onShippingChange(finalOption)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Truck className="h-5 w-5" />
          <span>Tính phí vận chuyển</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <div className="flex-1">
            <Label htmlFor="zipCode">Mã bưu điện</Label>
            <Input
              id="zipCode"
              placeholder="Nhập mã bưu điện"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              maxLength={5}
            />
          </div>
          <div className="flex items-end">
            <Button onClick={handleCalculate} disabled={!zipCode.trim() || isCalculating}>
              <Calculator className="h-4 w-4 mr-2" />
              {isCalculating ? "Đang tính..." : "Tính phí"}
            </Button>
          </div>
        </div>

        {showOptions && (
          <div className="space-y-3">
            <h4 className="font-medium">Các tùy chọn vận chuyển:</h4>
            {SHIPPING_OPTIONS.map((option) => {
              const finalPrice = subtotal >= 500 && option.id === "standard" ? 0 : option.price
              const isSelected = selectedOption?.id === option.id

              return (
                <div
                  key={option.id}
                  className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                    isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => handleOptionSelect({ ...option, price: finalPrice })}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-4 h-4 rounded-full border-2 ${
                            isSelected ? "border-primary bg-primary" : "border-gray-300"
                          }`}
                        >
                          {isSelected && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />}
                        </div>
                        <span className="font-medium">{option.name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground ml-6">{option.description}</p>
                      <p className="text-sm text-muted-foreground ml-6">{option.estimatedDays}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">{finalPrice === 0 ? "Miễn phí" : `$${finalPrice.toFixed(2)}`}</span>
                      {subtotal >= 500 && option.id === "standard" && option.price > 0 && (
                        <p className="text-xs text-green-600">Miễn phí vận chuyển được áp dụng!</p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
