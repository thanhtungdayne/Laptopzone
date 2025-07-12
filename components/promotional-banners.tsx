"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PromotionalBanners() {
  return (
    <div className="container mx-auto px-4 mb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Laptop Banner */}
        <div className="relative bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-8 overflow-hidden">
          <div className="relative z-10">
            <p className="text-sm text-purple-600 font-medium mb-2">GIẢM 30% CHO TẤT CẢ CÁC ĐƠN HÀNG</p>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Laptop Asus</h3>
            <Link href="/?category=business">
              <Button variant="outline" className="bg-white hover:bg-gray-50">
                Mua ngay
              </Button>
            </Link>
          </div>
          <div className="absolute right-4 top-4 bottom-4 w-32 opacity-80">
            <img
              src="/placeholder.svg?height=200&width=250"
              alt="Laptop Asus"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Accessories Banner */}
        <div className="relative bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl p-8 overflow-hidden">
          <div className="relative z-10">
            <p className="text-sm text-red-600 font-medium mb-2">GIẢM 10% CHO TẤT CẢ CÁC ĐƠN HÀNG</p>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Phụ kiện</h3>
            <Link href="/accessories">
              <Button variant="outline" className="bg-white hover:bg-gray-50">
                Mua ngay
              </Button>
            </Link>
          </div>
          <div className="absolute right-4 top-4 bottom-4 w-32 opacity-80">
            <img
              src="/placeholder.svg?height=200&width=200"
              alt="Headphones"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
