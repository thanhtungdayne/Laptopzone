import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/context/cart-context"
import { CheckoutProvider } from "@/context/checkout-context"
import { CouponProvider } from "@/context/coupon-context"
import { WishlistProvider } from "@/context/wishlist-context"
import { AuthProvider } from "@/context/auth-context"
import { SearchProvider } from "@/context/search-context"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LaptopStore - Cửa hàng laptop hàng đầu Việt Nam",
  description:
    "Mua laptop chính hãng với giá tốt nhất. Gaming, văn phòng, ultrabook, workstation. Bảo hành chính hãng, giao hàng toàn quốc.",
  keywords: "laptop, máy tính xách tay, gaming laptop, laptop văn phòng, ultrabook, workstation",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className} suppressHydrationWarning={true}>
        <Suspense fallback={<div>Đang tải...</div>}>
          <AuthProvider>
            <SearchProvider>
              <CartProvider>
                <WishlistProvider>
                  <CouponProvider>
                    <CheckoutProvider>
                      {children}
                      <Toaster />
                    </CheckoutProvider>
                  </CouponProvider>
                </WishlistProvider>
              </CartProvider>
            </SearchProvider>
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  )
}
