"use client"

import { useState } from 'react'
import MarkdownRenderer from '@/components/markdown-renderer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Share2, ThumbsUp, MessageCircle, BookOpen } from 'lucide-react'
import type { BlogPost } from '@/types/blog'

interface BlogContentProps {
  post: BlogPost
}

export default function BlogContent({ post }: BlogContentProps) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(42) // Mock count

  const handleLike = () => {
    setLiked(!liked)
    setLikeCount(prev => liked ? prev - 1 : prev + 1)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    }
  }

  return (
    <article className="max-w-4xl mx-auto">
      {/* Table of Contents (if content is long) */}
      <Card className="mb-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-3">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-blue-800 dark:text-blue-200">
              Nội dung bài viết
            </h3>
          </div>
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <p>Bài viết này sẽ hướng dẫn bạn:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Các bước cơ bản để thực hiện</li>
              <li>Mẹo và thủ thuật hữu ích</li>
              <li>Các lỗi thường gặp và cách khắc phục</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="prose-container">
        <MarkdownRenderer content={post.content} />
      </div>

      {/* Article Actions */}
      <Card className="mt-12 bg-gray-50 dark:bg-gray-900">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant={liked ? "default" : "outline"}
                onClick={handleLike}
                className="flex items-center space-x-2"
              >
                <ThumbsUp className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
                <span>{likeCount}</span>
              </Button>
              
              <Button variant="outline" className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4" />
                <span>Bình luận</span>
              </Button>
            </div>

            <Button
              variant="outline"
              onClick={handleShare}
              className="flex items-center space-x-2"
            >
              <Share2 className="h-4 w-4" />
              <span>Chia sẻ</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Comments Section Placeholder */}
      <Card className="mt-8">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4">Bình luận</h3>
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Chức năng bình luận sẽ được cập nhật sớm</p>
          </div>
        </CardContent>
      </Card>
    </article>
  )
}