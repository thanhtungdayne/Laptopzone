"use client";

import Link from "next/link";
import {
  MapPin,
  Phone,
  Facebook,
  Youtube,
  MessageCircle,
  Send,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="w-[85%] max-w-none mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Social Media */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">LZ</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent">
                LaptopZone
              </span>
            </div>
            <div className="flex space-x-3">
              <Link
                href="#"
                className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                <Facebook className="h-4 w-4 text-white" />
              </Link>
              <Link
                href="#"
                className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
              >
                <Youtube className="h-4 w-4 text-white" />
              </Link>
              <Link
                href="#"
                className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <MessageCircle className="h-4 w-4 text-white" />
              </Link>
              <Link
                href="#"
                className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <Send className="h-4 w-4 text-white" />
              </Link>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-white">Hotline</h3>
            <div className="flex items-center space-x-2 text-blue-400">
              <Phone className="h-4 w-4" />
              <span className="font-semibold">1900.555.888</span>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-white">Cửa hàng Hà Nội</h4>
              <div className="flex items-start space-x-2 text-sm">
                <MapPin className="h-4 w-4 mt-0.5 text-gray-400" />
                <div>
                  <p className="text-gray-300">123 Trần Duy Hưng, Cầu Giấy, Hà Nội</p>
                  <Link href="#" className="text-blue-400 hover:underline">
                    (Chỉ đường)
                  </Link>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-white">Cửa hàng TP. HCM</h4>
              <div className="space-y-2">
                <div className="flex items-start space-x-2 text-sm">
                  <MapPin className="h-4 w-4 mt-0.5 text-gray-400" />
                  <div>
                    <p className="text-gray-300">
                      456 Nguyễn Văn Cừ, Q.1, TP. Hồ Chí Minh
                    </p>
                    <Link href="#" className="text-blue-400 hover:underline">
                      (Chỉ đường)
                    </Link>
                  </div>
                </div>
                <div className="flex items-start space-x-2 text-sm">
                  <MapPin className="h-4 w-4 mt-0.5 text-gray-400" />
                  <div>
                    <p className="text-gray-300">789 Lê Văn Việt, Q.9, TP. Hồ Chí Minh</p>
                    <Link href="#" className="text-blue-400 hover:underline">
                      (Chỉ đường)
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Useful Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-white">Thông tin hữu ích</h3>
            <div className="space-y-2">
              <Link
                href="#"
                className="block text-sm text-gray-300 hover:text-blue-400 transition-colors"
              >
                Chính sách bảo hành
              </Link>
              <Link
                href="#"
                className="block text-sm text-gray-300 hover:text-blue-400 transition-colors"
              >
                Chính sách đổi trả
              </Link>
              <Link
                href="#"
                className="block text-sm text-gray-300 hover:text-blue-400 transition-colors"
              >
                Chính sách vận chuyển
              </Link>
              <Link
                href="#"
                className="block text-sm text-gray-300 hover:text-blue-400 transition-colors"
              >
                Chính sách bảo mật
              </Link>
              <Link
                href="#"
                className="block text-sm text-gray-300 hover:text-blue-400 transition-colors"
              >
                Chính sách thanh toán
              </Link>
              <Link
                href="#"
                className="block text-sm text-gray-300 hover:text-blue-400 transition-colors"
              >
                Hướng dẫn mua laptop
              </Link>
              <Link
                href="#"
                className="block text-sm text-gray-300 hover:text-blue-400 transition-colors"
              >
                Tư vấn cấu hình
              </Link>
              <Link
                href="#"
                className="block text-sm text-gray-300 hover:text-blue-400 transition-colors"
              >
                Về chúng tôi
              </Link>
            </div>
          </div>

          {/* Feedback Section with Map */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-white">Hỗ trợ khách hàng</h3>
            <p className="text-sm text-gray-300">
              Đội ngũ tư vấn chuyên nghiệp sẵn sàng hỗ trợ bạn 24/7.
            </p>
            <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <Mail className="h-4 w-4 mr-2" />
              Liên hệ tư vấn
            </Button>

            {/* Google Maps Embed */}
            <div className="w-full h-64 rounded-lg overflow-hidden border border-gray-700">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.4557027310693!2d106.62699417602707!3d10.852902757776452!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529466247deb7%3A0x837f6cf22372ab7e!2sFPT%20PolySchool%20TP.HCM!5e0!3m2!1svi!2s!4v1751528971690!5m2!1svi!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="LaptopZone Store Location"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="text-sm text-gray-400 space-y-2">
            <p>© LaptopZone 2024 - Chuyên gia laptop hàng đầu Việt Nam</p>
            <p>
              Công ty TNHH LaptopZone Việt Nam - GPDKKD: 0123456789 do sở KH & ĐT TP Hà
              Nội cấp ngày 15/05/2020
            </p>
            <p>Địa chỉ: 123 Trần Duy Hưng, Cầu Giấy, Hà Nội. Điện thoại: 1900555888</p>
          </div>

          {/* Certification Badges */}
          <div className="flex space-x-4 mt-4">
            <div className="bg-blue-600 px-3 py-2 rounded">
              <span className="text-xs font-semibold text-white">CHÍNH HÃNG</span>
            </div>
            <div className="bg-green-600 px-3 py-2 rounded">
              <span className="text-xs font-semibold text-white">BẢO HÀNH</span>
            </div>
            <div className="bg-red-600 px-3 py-2 rounded">
              <span className="text-xs font-semibold text-white">UY TÍN</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
