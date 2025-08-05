"use client";

import { useCheckout } from "@/context/checkout-context";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import axios from "axios";

export default function PaymentForm() {
  const { state, dispatch, placeOrder } = useCheckout();
  const { items } = useCart();
  const { user } = useAuth();

  const handleBack = () => {
    dispatch({ type: "SET_STEP", payload: 2 }); // Quay lại ShippingForm
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
        // Tính tổng tiền từ giỏ hàng
        const totalAmount = items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );

        // Gọi API ZaloPay
        const response = await axios.post(
          "http://localhost:5000/payment/zalo/payment",
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
          window.open(order_url, "_blank"); // Mở tab mới
        } else {
          throw new Error("Không nhận được URL thanh toán từ ZaloPay");
        }
      } else {
        // Xử lý các phương thức thanh toán khác (cash, momo)
        await placeOrder(user._id, items);
        dispatch({ type: "SET_STEP", payload: 4 }); // Sang bước xác nhận
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

  const handleChange = (value: string) => {
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