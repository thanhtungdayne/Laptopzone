"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import CheckoutProgress from "@/components/checkout-progress";
import CartReview from "@/components/checkout/cart-review";
import ShippingForm from "@/components/checkout/shipping-form";
import PaymentForm from "@/components/checkout/payment-form";
import OrderConfirmation from "@/components/checkout/order-confirmation";
import { useCheckout } from "@/context/checkout-context";
import { useCart } from "@/context/cart-context";
import Footer from "@/components/footer";

export default function CheckoutPage() {
  const { state } = useCheckout();
  const { state: cartState } = useCart();
  const router = useRouter();

  useEffect(() => {
    // Redirect to home if cart is empty and not on confirmation step
    if (cartState.items.length === 0 && state.currentStep < 4) {
      router.push("/");
    }
  }, [cartState.items.length, state.currentStep, router]);

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

      <div className="w-[85%] max-w-none mx-auto px-4 py-8">
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
