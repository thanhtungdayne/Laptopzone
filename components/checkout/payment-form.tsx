"use client";

import { useCheckout } from "@/context/checkout-context";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useEffect } from "react";

export default function PaymentForm() {
  const { state, dispatch, placeOrder } = useCheckout();
  const { items } = useCart();
  const { user } = useAuth();

  // Check for payment completion when component mounts or window regains focus
  useEffect(() => {
    const handlePaymentCallback = async () => {
      const paymentStatus = localStorage.getItem("zaloPaymentStatus");
      if (paymentStatus === "completed" && user?._id && items.length > 0) {
        try {
          await placeOrder(user._id, items);
          dispatch({ type: "SET_STEP", payload: 4 }); // Move to confirmation step
          localStorage.removeItem("zaloPaymentStatus"); // Clean up
        } catch (error) {
          console.error("Error placing order after payment:", error);
          alert("Đã xảy ra lỗi khi hoàn tất đơn hàng: " + error.message);
        }
      }
    };

    // Add focus event listener to detect when user returns to the tab
    window.addEventListener("focus", handlePaymentCallback);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener("focus", handlePaymentCallback);
    };
  }, [user, items, placeOrder, dispatch]);

  const handleBack = () => {
    dispatch({ type: "SET_STEP", payload: 2 }); // Go back to ShippingForm
  };

  const handleContinue = async () => {
    if (!state.payment.paymentMethod) {
      alert("Vui lòng chọn phương thức thanh toán");
      return;
    }

    if (!user?._id) {
      alert("Vui lòng đăng nhập trước khi đặt hàng");
      return;
    }

    const confirmed = window.confirm("Bạn có chắc chắn muốn đặt hàng?");
    if (!confirmed) return;

    try {
      if (state.payment.paymentMethod === "zalopay") {
        // Calculate total amount from cart
        const totalAmount = items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );

        // Set payment status in localStorage before redirecting
        localStorage.setItem("zaloPaymentStatus", "pending");

        // Call ZaloPay API
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/payment/zalo/payment`,
          {
            userId: user._id,
            items: items.map((item) => ({
              id: item._id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
            })),
            amount: totalAmount,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const { order_url } = response.data;
        if (order_url) {
          window.open(order_url, "_blank"); // Open payment URL in new tab
          // Assume payment is completed when user returns (for simplicity)
          // In a real app, verify payment status via API callback
          localStorage.setItem("zaloPaymentStatus", "completed");
        } else {
          throw new Error("Không nhận được URL thanh toán từ ZaloPay");
        }
      } else {
        // Handle other payment methods (cash, momo)
        await placeOrder(user._id, items);
        dispatch({ type: "SET_STEP", payload: 4 }); // Move to confirmation step
      }
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error.response?.data || error.message);
      alert(
        `Đã xảy ra lỗi khi đặt hàng: ${
          error.response?.data?.details || error.message
        }`
      );
    }
  };

  const handleChange = (value) => {
    dispatch({
      type: "SET_PAYMENT",
      payload: { userId: user._id, paymentMethod: value },
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Chọn phương thức thanh toán</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            defaultValue={state.payment.paymentMethod}
            onValueChange={handleChange}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cash" id="cash" />
              <Label htmlFor="cash">Thanh toán khi nhận hàng</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="momo" id="momo" />
              <Label htmlFor="momo">Chuyển khoản qua Momo</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="zalopay" id="zalopay" />
              <Label htmlFor="zalopay">Thanh toán qua ZaloPay</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Quay lại vận chuyển
        </Button>
        <Button onClick={handleContinue}>Tiếp tục</Button>
      </div>
    </div>
  );
}