import { notFound } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import BlogHeader from "@/components/blog/blog-header";
import BlogContent from "@/components/blog/blog-content";
import BlogNavigation from "@/components/blog/blog-navigation";
import { blogPosts } from "@/data/blog-posts";

interface BlogDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;

  // Find the blog post
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Get related posts (same category, excluding current post)
  const relatedPosts = blogPosts
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  // Get previous and next posts
  const currentIndex = blogPosts.findIndex((p) => p.id === post.id);
  const previousPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : undefined;
  const nextPost =
    currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : undefined;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <BlogHeader post={post} />
          <BlogContent post={post} />
          <div className="mt-16">
            <BlogNavigation
              previousPost={previousPost}
              nextPost={nextPost}
              relatedPosts={relatedPosts}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: "Blog không tìm thấy",
      description: "Bài viết bạn đang tìm không tồn tại.",
    };
  }

  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
    keywords: post.seo?.keywords?.join(", ") || post.tags.join(", "),
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
      type: "article",
      publishedTime: post.publishDate,
      authors: [post.author.name],
    },
  };
}

// Generate static params for static generation
export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}
