"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { Award, Users, Globe, Heart, Shield, Zap } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: Award,
      title: "Chất lượng",
      description: "Chúng tôi cam kết mang đến những sản phẩm laptop chất lượng cao nhất",
      color: "text-yellow-500",
    },
    {
      icon: Users,
      title: "Khách hàng là trung tâm",
      description: "Sự hài lòng của khách hàng là ưu tiên hàng đầu của chúng tôi",
      color: "text-blue-500",
    },
    {
      icon: Globe,
      title: "Đổi mới",
      description: "Luôn đi đầu trong việc áp dụng công nghệ và xu hướng mới nhất",
      color: "text-green-500",
    },
    {
      icon: Heart,
      title: "Đam mê",
      description: "Chúng tôi yêu thích công nghệ và muốn chia sẻ niềm đam mê này",
      color: "text-red-500",
    },
    {
      icon: Shield,
      title: "Tin cậy",
      description: "Xây dựng mối quan hệ dài lâu dựa trên sự tin cậy và minh bạch",
      color: "text-purple-500",
    },
    {
      icon: Zap,
      title: "Hiệu năng",
      description: "Tập trung vào hiệu năng và trải nghiệm người dùng tối ưu",
      color: "text-orange-500",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Khách hàng hài lòng" },
    { number: "5,000+", label: "Sản phẩm đã giao" },
    { number: "50+", label: "Đối tác thương hiệu" },
    { number: "24/7", label: "Hỗ trợ khách hàng" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="w-[85%] max-w-none mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Về Chúng Tôi</h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8">
              Cửa hàng laptop hàng đầu Việt Nam
            </p>
            <p className="text-lg opacity-80 max-w-2xl mx-auto">
              Chúng tôi cam kết mang đến những sản phẩm laptop chất lượng cao và dịch vụ
              tuyệt vời nhất cho khách hàng
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gray-50">
        <div className="w-[85%] max-w-none mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-16">
        <div className="w-[85%] max-w-none mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Câu Chuyện Của Chúng Tôi
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-lg text-gray-600 mb-6">
                  Được thành lập từ năm 2020, LaptopStore bắt đầu từ niềm đam mê công nghệ
                  và mong muốn mang đến những sản phẩm laptop chất lượng cao cho người
                  Việt Nam.
                </p>
                <p className="text-lg text-gray-600 mb-6">
                  Chúng tôi hiểu rằng laptop không chỉ là một công cụ làm việc mà còn là
                  người bạn đồng hành trong cuộc sống hiện đại. Vì vậy, chúng tôi luôn tìm
                  kiếm và cung cấp những sản phẩm tốt nhất từ các thương hiệu hàng đầu thế
                  giới.
                </p>
                <p className="text-lg text-gray-600">
                  Với đội ngũ chuyên gia am hiểu sâu về công nghệ, chúng tôi cam kết tư
                  vấn và hỗ trợ khách hàng tìm được chiếc laptop phù hợp nhất với nhu cầu
                  và ngân sách.
                </p>
              </div>
              <div className="relative">
                <img
                  src="/placeholder.svg?height=400&width=500"
                  alt="Our team"
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 bg-gray-50">
        <div className="w-[85%] max-w-none mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Giá Trị Cốt Lõi
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div
                    key={index}
                    className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <Icon className={`h-12 w-12 ${value.color} mb-4`} />
                    <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16">
        <div className="w-[85%] max-w-none mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Sứ Mệnh Của Chúng Tôi</h2>
            <p className="text-xl text-gray-600 mb-8">
              Mang đến những sản phẩm công nghệ tốt nhất, dịch vụ chuyên nghiệp và trải
              nghiệm mua sắm tuyệt vời cho mọi khách hàng Việt Nam.
            </p>
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Tham Gia Cùng Chúng Tôi</h3>
              <p className="text-lg opacity-90">
                Hãy cùng chúng tôi khám phá thế giới công nghệ và tìm kiếm những giải pháp
                laptop hoàn hảo cho bạn!
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
