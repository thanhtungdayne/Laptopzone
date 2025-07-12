export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  publishDate: string;
  updatedDate?: string;
  category: string;
  tags: string[];
  image: string;
  readTime: string;
  featured?: boolean;
  status: "published" | "draft";
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
}

export interface BlogFilter {
  category?: string;
  tag?: string;
  author?: string;
  search?: string;
}
