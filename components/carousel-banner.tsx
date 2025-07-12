"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

interface BannerSlide {
  id: number
  category: string
  backgroundClass: string
  imageUrl: string
  title: string
  subtitle: string
  description: string
  cta: string
}

const bannerSlides: BannerSlide[] = [
  {
    id: 1,
    category: "gaming",
    backgroundClass: "bg-gradient-to-r from-purple-600 to-blue-600",
    imageUrl: "/placeholder.svg?height=400&width=600",
    title: "Trải Nghiệm Gaming Tuyệt Vời",
    subtitle: "Laptop Gaming Hiệu Suất Cao",
    description: "Khám phá các laptop gaming mạnh mẽ với đồ họa tiên tiến và bộ xử lý siêu nhanh.",
    cta: "Mua Gaming",
  },
  {
    id: 2,
    category: "business",
    backgroundClass: "bg-gradient-to-r from-gray-700 to-gray-900",
    imageUrl: "/placeholder.svg?height=400&width=600",
    title: "Sự Xuất Sắc Chuyên Nghiệp",
    subtitle: "Laptop Doanh Nghiệp & Năng Suất",
    description: "Laptop đáng tin cậy, bảo mật và hiệu quả được thiết kế cho các chuyên gia kinh doanh.",
    cta: "Mua Doanh Nghiệp",
  },
  {
    id: 3,
    category: "creative",
    backgroundClass: "bg-gradient-to-r from-orange-500 to-red-600",
    imageUrl: "/placeholder.svg?height=400&width=600",
    title: "Sức Mạnh Sáng Tạo",
    subtitle: "Workstation Cho Nhà Sáng Tạo",
    description: "Workstation hiệu suất cao cho chỉnh sửa video, kết xuất 3D và công việc sáng tạo.",
    cta: "Mua Workstation",
  },
  {
    id: 4,
    category: "student",
    backgroundClass: "bg-gradient-to-r from-green-500 to-teal-600",
    imageUrl: "/placeholder.svg?height=400&width=600",
    title: "Thiết Yếu Cho Sinh Viên",
    subtitle: "Giá Cả Phải Chăng & Đáng Tin Cậy",
    description: "Laptop thân thiện với ngân sách hoàn hảo cho sinh viên và nhu cầu máy tính hàng ngày.",
    cta: "Mua Ultrabook",
  },
]

export default function CarouselBanner() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const getCategoryLink = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      gaming: "gaming",
      business: "business",
      creative: "workstations",
      student: "ultrabooks",
    }
    return `/?category=${categoryMap[category] || category}`
  }

  return (
    <div className="relative w-full mb-8">
      <div
        className="relative overflow-hidden rounded-lg shadow-lg"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* Slides Container */}
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {bannerSlides.map((slide) => (
            <div key={slide.id} className={`w-full flex-shrink-0 ${slide.backgroundClass} text-white`}>
              <div className="container mx-auto px-4 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  {/* Content */}
                  <div className="space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold">{slide.title}</h2>
                    <h3 className="text-xl md:text-2xl font-semibold opacity-90">{slide.subtitle}</h3>
                    <p className="text-lg opacity-80 max-w-md">{slide.description}</p>
                    <Link href={getCategoryLink(slide.category)}>
                      <Button size="lg" variant="secondary" className="mt-4 bg-white text-gray-900 hover:bg-gray-100">
                        {slide.cta}
                      </Button>
                    </Link>
                  </div>

                  {/* Image */}
                  <div className="flex justify-center">
                    <img
                      src={slide.imageUrl || "/placeholder.svg"}
                      alt={slide.title}
                      className="max-w-full h-auto rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-colors"
          aria-label="Slide trước"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-colors"
          aria-label="Slide tiếp theo"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {bannerSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? "bg-white" : "bg-white/50"
              }`}
              aria-label={`Đi đến slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20">
          <div
            className="h-full bg-white transition-all duration-5000 ease-linear"
            style={{
              width: isAutoPlaying ? "100%" : "0%",
              animation: isAutoPlaying ? "progress 5s linear infinite" : "none",
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}
