"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCheckout, type ShippingInfo } from "@/context/checkout-context"

const US_STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
]

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
    const newErrors: Partial<ShippingInfo> = {}
    const shipping = state.shipping

    if (!shipping.firstName?.trim()) newErrors.firstName = "First name is required"
    if (!shipping.lastName?.trim()) newErrors.lastName = "Last name is required"
    if (!shipping.email?.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(shipping.email)) newErrors.email = "Email is invalid"
    if (!shipping.phone?.trim()) newErrors.phone = "Phone number is required"
    if (!shipping.address?.trim()) newErrors.address = "Address is required"
    if (!shipping.city?.trim()) newErrors.city = "City is required"
    if (!shipping.state?.trim()) newErrors.state = "State is required"
    if (!shipping.zipCode?.trim()) newErrors.zipCode = "ZIP code is required"
    if (!shipping.country?.trim()) newErrors.country = "Country is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

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
          <CardTitle>Shipping Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={state.shipping.firstName || ""}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className={errors.firstName ? "border-red-500" : ""}
              />
              {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={state.shipping.lastName || ""}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className={errors.lastName ? "border-red-500" : ""}
              />
              {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email Address *</Label>
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
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={state.shipping.phone || ""}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
          </div>

          <div>
            <Label htmlFor="address">Street Address *</Label>
            <Input
              id="address"
              value={state.shipping.address || ""}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className={errors.address ? "border-red-500" : ""}
            />
            {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={state.shipping.city || ""}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className={errors.city ? "border-red-500" : ""}
              />
              {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
            </div>
            <div>
              <Label htmlFor="state">State *</Label>
              <Select value={state.shipping.state || ""} onValueChange={(value) => handleInputChange("state", value)}>
                <SelectTrigger className={errors.state ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.state && <p className="text-sm text-red-500 mt-1">{errors.state}</p>}
            </div>
            <div>
              <Label htmlFor="zipCode">ZIP Code *</Label>
              <Input
                id="zipCode"
                value={state.shipping.zipCode || ""}
                onChange={(e) => handleInputChange("zipCode", e.target.value)}
                className={errors.zipCode ? "border-red-500" : ""}
              />
              {errors.zipCode && <p className="text-sm text-red-500 mt-1">{errors.zipCode}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="country">Country *</Label>
            <Select value={state.shipping.country || ""} onValueChange={(value) => handleInputChange("country", value)}>
              <SelectTrigger className={errors.country ? "border-red-500" : ""}>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="CA">Canada</SelectItem>
                <SelectItem value="MX">Mexico</SelectItem>
              </SelectContent>
            </Select>
            {errors.country && <p className="text-sm text-red-500 mt-1">{errors.country}</p>}
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
