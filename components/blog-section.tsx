"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { blogPosts } from "@/data/blog-posts";

const categories = ["Mới nhất", "Tin tức", "Đánh giá", "Tư vấn", "Thủ thuật"];

export default function BlogSection() {
  const [activeCategory, setActiveCategory] = useState("Mới nhất");
  const [isAnimating, setIsAnimating] = useState(false);

  const handleCategoryChange = (category: string) => {
    if (category === activeCategory) return;

    setIsAnimating(true);
    setTimeout(() => {
      setActiveCategory(category);
      setIsAnimating(false);
    }, 150);
  };

  const filteredPosts =
    activeCategory === "Mới nhất"
      ? blogPosts
      : blogPosts.filter((post) => post.category === activeCategory);

  const featuredPost = filteredPosts.find((post) => post.featured) || filteredPosts[0];
  const regularPosts = filteredPosts
    .filter((post) => post.id !== featuredPost?.id)
    .slice(0, 5);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <span className="text-3xl mr-3">🎯</span>
            <h2 className="text-3xl font-bold text-gray-900">Tin tức công nghệ</h2>
          </div>

          {/* Category Tabs */}
          <div className="flex justify-center items-center space-x-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 ${
                  activeCategory === category
                    ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Content with animation */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            isAnimating
              ? "opacity-50 transform translate-y-2"
              : "opacity-100 transform translate-y-0"
          }`}
        >
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Featured Post */}
            <div className="lg:col-span-2">
              {featuredPost && (
                <Link href={`/blog/${featuredPost.slug}`}>
                  <Card className="overflow-hidden h-full bg-gradient-to-br from-purple-200 via-purple-100 to-blue-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer relative group">
                    <CardContent className="p-0">
                      <div className="relative">
                        {/* Large watermark "BLOG" */}
                        <div className="absolute right-8 top-1/2 transform -translate-y-1/2 text-purple-300/30 font-black text-8xl rotate-12 select-none pointer-events-none z-10 group-hover:text-purple-300/40 transition-colors duration-300">
                          BLOG
                        </div>

                        <div className="p-8 relative z-20">
                          <Badge className="bg-blue-600 hover:bg-blue-700 text-white mb-4 text-xs font-medium uppercase tracking-wide">
                            TIN TỨC
                          </Badge>

                          <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight pr-20 group-hover:text-blue-600 transition-colors duration-300">
                            {featuredPost.title}
                          </h3>

                          {featuredPost.excerpt && (
                            <p className="text-gray-600 text-sm mb-4 pr-20 leading-relaxed">
                              {featuredPost.excerpt}
                            </p>
                          )}

                          <div className="flex items-center text-sm text-gray-600 mb-6">
                            <span className="font-medium">
                              {featuredPost.author.name}
                            </span>
                            <span className="mx-2">/</span>
                            <span>{featuredPost.publishDate}</span>
                          </div>
                        </div>

                        {/* Featured Image */}
                        <div className="relative h-64 mx-8 mb-8 rounded-lg overflow-hidden group-hover:scale-105 transition-transform duration-300">
                          <Image
                            src={featuredPost.image}
                            alt={featuredPost.title}
                            fill
                            className="object-cover"
                          />

                          {/* Blue circular badge with category */}
                          <div className="absolute bottom-4 left-4">
                            <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center shadow-lg">
                              <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                              {featuredPost.category}
                            </div>
                          </div>

                          {/* Title overlay */}
                          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-lg px-4 py-2 max-w-xs shadow-lg">
                            <p className="text-sm font-medium text-gray-900 text-center line-clamp-2">
                              {featuredPost.title}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )}
            </div>

            {/* Side Posts */}
            <div className="space-y-4">
              {regularPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Link href={`/blog/${post.slug}`}>
                    <Card className="overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-100 hover:border-gray-200 group">
                      <CardContent className="p-0">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <div className="relative w-24 h-24 overflow-hidden">
                              <Image
                                src={post.image}
                                alt={post.title}
                                width={100}
                                height={100}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                          </div>
                          <div className="flex-1 p-4">
                            <h4 className="font-semibold text-sm line-clamp-2 mb-2 text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                              {post.title}
                            </h4>
                            <div className="flex items-center text-xs text-gray-500">
                              <span className="text-green-600 font-medium">
                                {post.author.name}
                              </span>
                              <span className="mx-2">/</span>
                              <span>{post.publishDate}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              ))}

              {/* View All Link */}
              <div className="pt-4 border-t border-gray-200">
                <Link
                  href="/blog"
                  className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors duration-300"
                >
                  <span>Xem tất cả</span>
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
