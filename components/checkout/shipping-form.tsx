"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCheckout, type ShippingInfo } from "@/context/checkout-context"



export default function ShippingForm() {
  const { state, dispatch } = useCheckout()
  const [errors, setErrors] = useState<Partial<ShippingInfo>>({})

  const handleInputChange = (field: keyof ShippingInfo, value: string) => {
    dispatch({ type: "SET_SHIPPING", payload: { [field]: value } })
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<ShippingInfo> = {};
    const shipping = state.shipping;

    if (!shipping.fullName?.trim()) newErrors.fullName = "Họ và tên bắt buộc";
    if (!shipping.phone?.trim()) newErrors.phone = "Số điện thoại bắt buộc";
    if (!shipping.address?.trim()) newErrors.address = "Địa chỉ bắt buộc";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      dispatch({ type: "SET_STEP", payload: 3 })
    }
  }

  const handleBack = () => {
    dispatch({ type: "SET_STEP", payload: 1 })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin vận chuyển</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols gap-4">
            <div>
              <Label htmlFor="fullName">Họ và tên *</Label>
              <Input
                id="fullName"
                value={state.shipping.fullName || ""}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className={errors.fullName ? "border-red-500" : ""}
              />

            </div>
            
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={state.shipping.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <Label htmlFor="phone">Số điện thoại *</Label>
            <Input
              id="phone"
              value={state.shipping.phone || ""}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className={errors.phone ? "border-red-500" : ""}
            />
          </div>

          <div>
            <Label htmlFor="address">Địa chỉ *</Label>
            <Input
              id="address"
              value={state.shipping.address || ""}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className={errors.address ? "border-red-500" : ""}
            />
          </div>

          
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Back to Cart
        </Button>
        <Button onClick={handleContinue}>Continue to Payment</Button>
      </div>
    </div>
  )
}
