"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Calendar, User, Clock, ArrowLeft, Share2, Bookmark } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { BlogPost } from '@/types/blog'

interface BlogHeaderProps {
  post: BlogPost
}

export default function BlogHeader({ post }: BlogHeaderProps) {
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
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const handleBookmark = () => {
    // Add bookmark functionality here
    console.log('Bookmark clicked')
  }

  return (
    <header className="relative">
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/blog">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại Blog
          </Link>
        </Button>
      </div>

      {/* Featured Image */}
      <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-8">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <Badge className="bg-blue-600 hover:bg-blue-700 text-white">
            {post.category}
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={handleShare}
            className="bg-white/90 hover:bg-white"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={handleBookmark}
            className="bg-white/90 hover:bg-white"
          >
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Article Info */}
      <div className="mb-8">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
          {post.title}
        </h1>

        {/* Excerpt */}
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
          {post.excerpt}
        </p>

        {/* Meta Information */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Author Info */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                {post.author.name}
              </div>
              {post.author.bio && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {post.author.bio}
                </div>
              )}
            </div>
          </div>

          {/* Article Meta */}
          <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{post.publishDate}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-6">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-sm">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}