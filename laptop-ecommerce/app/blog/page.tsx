"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, Clock, User } from "lucide-react";
import { blogPosts } from "@/data/blog-posts";

const categories = ["Tất cả", "Tin tức", "Đánh giá", "Thủ thuật", "Tư vấn"];

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Filter posts based on search and category
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "Tất cả" || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  const featuredPost = blogPosts.find((post) => post.featured);
  const regularPosts = paginatedPosts.filter((post) => !post.featured);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <span className="text-4xl mr-3">📚</span>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Blog Công Nghệ
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Chia sẻ kiến thức, mẹo vặt và những xu hướng mới nhất trong thế giới công nghệ
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Tìm kiếm bài viết..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPage(1);
                }}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300">
            Tìm thấy {filteredPosts.length} bài viết
            {selectedCategory !== "Tất cả" && ` trong danh mục "${selectedCategory}"`}
            {searchQuery && ` với từ khóa "${searchQuery}"`}
          </p>
        </div>

        {/* Featured Post */}
        {featuredPost &&
          currentPage === 1 &&
          selectedCategory === "Tất cả" &&
          !searchQuery && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Bài viết nổi bật</h2>
              <Link href={`/blog/${featuredPost.slug}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-0">
                    <div className="grid md:grid-cols-2 gap-0">
                      <div className="relative h-64 md:h-80">
                        <Image
                          src={featuredPost.image}
                          alt={featuredPost.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-blue-600 hover:bg-blue-700 text-white">
                            {featuredPost.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-6 flex flex-col justify-center">
                        <h3 className="text-2xl font-bold mb-3 hover:text-blue-600 transition-colors">
                          {featuredPost.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          {featuredPost.excerpt}
                        </p>
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>{featuredPost.author.name}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{featuredPost.publishDate}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{featuredPost.readTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          )}

        {/* Blog Posts Grid */}
        {paginatedPosts.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {(currentPage === 1 && selectedCategory === "Tất cả" && !searchQuery
                ? regularPosts
                : paginatedPosts
              ).map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-0">
                      <div className="relative h-48">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge
                            variant="secondary"
                            className="bg-white/90 text-gray-800"
                          >
                            {post.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg line-clamp-2 mb-2 hover:text-blue-600 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-3">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center space-x-2">
                            <span>{post.author.name}</span>
                            <span>•</span>
                            <span>{post.publishDate}</span>
                          </div>
                          <span>{post.readTime}</span>
                        </div>
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mt-3">
                          {post.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Trước
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                    className="min-w-10"
                  >
                    {page}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Sau
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold mb-2">Không tìm thấy bài viết nào</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Thử thay đổi từ khóa tìm kiếm hoặc danh mục
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("Tất cả");
                setCurrentPage(1);
              }}
            >
              Xóa bộ lọc
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
