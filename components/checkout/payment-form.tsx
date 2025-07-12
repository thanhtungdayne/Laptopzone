"use client"

import { useState } from "react"
import { CreditCard, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCheckout, type PaymentInfo } from "@/context/checkout-context"
import { useCart } from "@/context/cart-context"

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

export default function PaymentForm() {
  const { state, dispatch } = useCheckout()
  const { state: cartState, dispatch: cartDispatch } = useCart()
  const [errors, setErrors] = useState<Partial<PaymentInfo>>({})

  const handleInputChange = (field: keyof PaymentInfo, value: string | boolean) => {
    if (field === "sameAsShipping" && value === true) {
      // Auto-fill billing address with shipping address
      dispatch({
        type: "SET_PAYMENT",
        payload: {
          [field]: value,
          billingAddress: {
            address: state.shipping.address || "",
            city: state.shipping.city || "",
            state: state.shipping.state || "",
            zipCode: state.shipping.zipCode || "",
            country: state.shipping.country || "",
          },
        },
      })
    } else {
      dispatch({ type: "SET_PAYMENT", payload: { [field]: value } })
    }

    // Clear error when user starts typing
    if (errors[field as keyof PaymentInfo]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleBillingAddressChange = (field: keyof PaymentInfo["billingAddress"], value: string) => {
    dispatch({
      type: "SET_PAYMENT",
      payload: {
          [field]: value,
          billingAddress: {
            address: state.shipping.address || "",
            city: state.shipping.city || "",
            state: state.shipping.state || "",
            zipCode: state.shipping.zipCode || "",
            country: state.shipping.country || "",
          },
        },
    })
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }
    return v
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<PaymentInfo> = {}
    const payment = state.payment

    if (!payment.cardNumber?.replace(/\s/g, "")) newErrors.cardNumber = "Card number is required"
    else if (payment.cardNumber.replace(/\s/g, "").length < 13) newErrors.cardNumber = "Card number is invalid"

    if (!payment.expiryDate) newErrors.expiryDate = "Expiry date is required"
    else if (!/^\d{2}\/\d{2}$/.test(payment.expiryDate)) newErrors.expiryDate = "Expiry date is invalid"

    if (!payment.cvv) newErrors.cvv = "CVV is required"
    else if (payment.cvv.length < 3) newErrors.cvv = "CVV is invalid"

    if (!payment.cardholderName?.trim()) newErrors.cardholderName = "Cardholder name is required"

    if (!payment.sameAsShipping) {
      if (!payment.billingAddress?.address?.trim()) {
        newErrors.billingAddress = {
          address: "Address is required",
          city: newErrors.billingAddress?.city ?? "",
          state: newErrors.billingAddress?.state ?? "",
          zipCode: newErrors.billingAddress?.zipCode ?? "",
          country: newErrors.billingAddress?.country ?? "",
        }
      }
      if (!payment.billingAddress?.city?.trim()) {
        newErrors.billingAddress = {
          address: newErrors.billingAddress?.address ?? "",
          city: "City is required",
          state: newErrors.billingAddress?.state ?? "",
          zipCode: newErrors.billingAddress?.zipCode ?? "",
          country: newErrors.billingAddress?.country ?? "",
        }
      }
      if (!payment.billingAddress?.state?.trim()) {
        newErrors.billingAddress = {
          address: newErrors.billingAddress?.address ?? "",
          city: newErrors.billingAddress?.city ?? "",
          state: "State is required",
          zipCode: newErrors.billingAddress?.zipCode ?? "",
          country: newErrors.billingAddress?.country ?? "",
        }
      }
      if (!payment.billingAddress?.zipCode?.trim()) {
        newErrors.billingAddress = {
          address: newErrors.billingAddress?.address ?? "",
          city: newErrors.billingAddress?.city ?? "",
          state: newErrors.billingAddress?.state ?? "",
          zipCode: "ZIP code is required",
          country: newErrors.billingAddress?.country ?? "",
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const processPayment = async () => {
    dispatch({ type: "SET_PROCESSING", payload: true })
    dispatch({ type: "SET_ERROR", payload: null })

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Create order
      const subtotal = cartState.total
      const shippingCost = subtotal > 500 ? 0 : 29.99
      const tax = subtotal * 0.08
      const total = subtotal + shippingCost + tax

      const order = {
        id: `ORD-${Date.now()}`,
        items: cartState.items.map((item) => ({
          id: item.laptop.id,
          name: item.laptop.name,
          price: item.laptop.price,
          quantity: item.quantity,
          image: item.laptop.image,
        })),
        shipping: state.shipping as any,
        payment: {
          ...state.payment,
          cardLast4: state.payment.cardNumber?.slice(-4) || "",
          cardNumber: undefined,
          cvv: undefined,
        } as any,
        subtotal,
        shipping_cost: shippingCost,
        tax,
        total,
        status: "confirmed" as const,
        createdAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      }

      dispatch({ type: "SET_ORDER", payload: order })
      cartDispatch({ type: "CLEAR_CART" })
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Payment failed. Please try again." })
    } finally {
      dispatch({ type: "SET_PROCESSING", payload: false })
    }
  }

  const handleSubmit = () => {
    if (validateForm()) {
      processPayment()
    }
  }

  const handleBack = () => {
    dispatch({ type: "SET_STEP", payload: 2 })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Payment Information</span>
            <Lock className="h-4 w-4 text-green-600" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="cardNumber">Card Number *</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={state.payment.cardNumber || ""}
              onChange={(e) => handleInputChange("cardNumber", formatCardNumber(e.target.value))}
              maxLength={19}
              className={errors.cardNumber ? "border-red-500" : ""}
            />
            {errors.cardNumber && <p className="text-sm text-red-500 mt-1">{errors.cardNumber}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiryDate">Expiry Date *</Label>
              <Input
                id="expiryDate"
                placeholder="MM/YY"
                value={state.payment.expiryDate || ""}
                onChange={(e) => handleInputChange("expiryDate", formatExpiryDate(e.target.value))}
                maxLength={5}
                className={errors.expiryDate ? "border-red-500" : ""}
              />
              {errors.expiryDate && <p className="text-sm text-red-500 mt-1">{errors.expiryDate}</p>}
            </div>
            <div>
              <Label htmlFor="cvv">CVV *</Label>
              <Input
                id="cvv"
                placeholder="123"
                value={state.payment.cvv || ""}
                onChange={(e) => handleInputChange("cvv", e.target.value.replace(/\D/g, ""))}
                maxLength={4}
                className={errors.cvv ? "border-red-500" : ""}
              />
              {errors.cvv && <p className="text-sm text-red-500 mt-1">{errors.cvv}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="cardholderName">Cardholder Name *</Label>
            <Input
              id="cardholderName"
              value={state.payment.cardholderName || ""}
              onChange={(e) => handleInputChange("cardholderName", e.target.value)}
              className={errors.cardholderName ? "border-red-500" : ""}
            />
            {errors.cardholderName && <p className="text-sm text-red-500 mt-1">{errors.cardholderName}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="sameAsShipping"
              checked={state.payment.sameAsShipping || false}
              onCheckedChange={(checked) => handleInputChange("sameAsShipping", checked as boolean)}
            />
            <Label htmlFor="sameAsShipping">Billing address same as shipping address</Label>
          </div>

          {!state.payment.sameAsShipping && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-medium">Billing Address</h3>

              <div>
                <Label htmlFor="billingAddress">Street Address *</Label>
                <Input
                  id="billingAddress"
                  value={state.payment.billingAddress?.address || ""}
                  onChange={(e) => handleBillingAddressChange("address", e.target.value)}
                  className={errors.billingAddress?.address ? "border-red-500" : ""}
                />
                {errors.billingAddress?.address && (
                  <p className="text-sm text-red-500 mt-1">{errors.billingAddress.address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="billingCity">City *</Label>
                  <Input
                    id="billingCity"
                    value={state.payment.billingAddress?.city || ""}
                    onChange={(e) => handleBillingAddressChange("city", e.target.value)}
                    className={errors.billingAddress?.city ? "border-red-500" : ""}
                  />
                  {errors.billingAddress?.city && (
                    <p className="text-sm text-red-500 mt-1">{errors.billingAddress.city}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="billingState">State *</Label>
                  <Select
                    value={state.payment.billingAddress?.state || ""}
                    onValueChange={(value) => handleBillingAddressChange("state", value)}
                  >
                    <SelectTrigger className={errors.billingAddress?.state ? "border-red-500" : ""}>
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
                  {errors.billingAddress?.state && (
                    <p className="text-sm text-red-500 mt-1">{errors.billingAddress.state}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="billingZipCode">ZIP Code *</Label>
                  <Input
                    id="billingZipCode"
                    value={state.payment.billingAddress?.zipCode || ""}
                    onChange={(e) => handleBillingAddressChange("zipCode", e.target.value)}
                    className={errors.billingAddress?.zipCode ? "border-red-500" : ""}
                  />
                  {errors.billingAddress?.zipCode && (
                    <p className="text-sm text-red-500 mt-1">{errors.billingAddress.zipCode}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {state.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">{state.error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack} disabled={state.isProcessing}>
          Back to Shipping
        </Button>
        <Button onClick={handleSubmit} disabled={state.isProcessing} size="lg">
          {state.isProcessing ? "Processing..." : "Complete Order"}
        </Button>
      </div>
    </div>
  )
}
