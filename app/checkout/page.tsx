// app/checkout/page.tsx
"use client";

import Header from "@/components/header";
import CheckoutProgress from "@/components/checkout-progress";
import CartReview from "@/components/checkout/cart-review";
import ShippingForm from "@/components/checkout/shipping-form";
import PaymentForm from "@/components/checkout/payment-form";
import OrderConfirmation from "@/components/checkout/order-confirmation";
import Footer from "@/components/footer";
import { useCheckout } from "@/context/checkout-context";
import { useCart } from "@/context/cart-context";
import { useEffect } from "react";
import axios from "axios";
export default function CheckoutPage() {
  const { state, dispatch } = useCheckout();
  const { items } = useCart();

  // Nếu giỏ hàng trống, đặt về bước 1
  useEffect(() => {
    if (items?.length === 0) {
      dispatch({ type: "SET_STEP", payload: 1 });
    }
  }, [items, dispatch]);

  const renderStep = () => {
    switch (state.currentStep) {
      case 1:
        return <CartReview />;
      case 2:
        return <ShippingForm />;
      case 3:
        return <PaymentForm />;
      case 4:
        return <OrderConfirmation />;
      default:
        return <CartReview />;
    }
  };

  const getStepTitle = () => {
    switch (state.currentStep) {
      case 1:
        return "Xem lại đơn hàng";
      case 2:
        return "Thông tin vận chuyển";
      case 3:
        return "Chi tiết thanh toán";
      case 4:
        return "Xác nhận đơn hàng";
      default:
        return "Thanh toán";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="w-[85%] mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">{getStepTitle()}</h1>
            {state.currentStep < 4 && (
              <p className="text-muted-foreground">
                Hoàn tất việc mua hàng một cách an toàn
              </p>
            )}
          </div>
          <CheckoutProgress currentStep={state.currentStep} />
          <div className="mt-8">{renderStep()}</div>
        </div>
      </div>
      <Footer />
    </div>
  );
}