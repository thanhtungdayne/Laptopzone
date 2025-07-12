"use client"

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { BlogPost } from '@/types/blog'

interface BlogNavigationProps {
  previousPost?: BlogPost
  nextPost?: BlogPost
  relatedPosts?: BlogPost[]
}

export default function BlogNavigation({ 
  previousPost, 
  nextPost, 
  relatedPosts = [] 
}: BlogNavigationProps) {
  return (
    <div className="space-y-12">
      {/* Previous/Next Navigation */}
      {(previousPost || nextPost) && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Previous Post */}
          <div>
            {previousPost ? (
              <Link href={`/blog/${previousPost.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                      <ArrowLeft className="h-4 w-4" />
                      <span>Bài trước</span>
                    </div>
                    <div className="flex space-x-4">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={previousPost.image}
                          alt={previousPost.title}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm line-clamp-2 hover:text-blue-600 transition-colors">
                          {previousPost.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {previousPost.publishDate}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ) : (
              <div className="h-full" />
            )}
          </div>

          {/* Next Post */}
          <div>
            {nextPost ? (
              <Link href={`/blog/${nextPost.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-end space-x-2 text-sm text-gray-500 mb-3">
                      <span>Bài tiếp</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                    <div className="flex space-x-4">
                      <div className="flex-1 min-w-0 text-right">
                        <h4 className="font-semibold text-sm line-clamp-2 hover:text-blue-600 transition-colors">
                          {nextPost.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {nextPost.publishDate}
                        </p>
                      </div>
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={nextPost.image}
                          alt={nextPost.title}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ) : (
              <div className="h-full" />
            )}
          </div>
        </div>
      )}

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold mb-6">Bài viết liên quan</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-0">
                    <div className="relative w-full h-48">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-sm line-clamp-2 mb-2 hover:text-blue-600 transition-colors">
                        {post.title}
                      </h4>
                      <p className="text-xs text-gray-500 mb-2">
                        {post.publishDate} • {post.readTime}
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Back to Blog Button */}
      <div className="text-center">
        <Button asChild variant="outline" size="lg">
          <Link href="/blog">
            Xem tất cả bài viết
          </Link>
        </Button>
      </div>
    </div>
  )
}