

import { notFound } from "next/navigation";
import ProductPageClient from "@/components/product-page-client";
import Footer from "@/components/footer";
import Header from "@/components/header";

interface ProductPageProps {
  params: {
    id: string;
  };
}

async function getLaptop(id: string) {
  try {
    console.log("Gọi API getLaptop với ID:", id);
    console.log("API_URL:", process.env.NEXT_PUBLIC_API_URL);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/${id}`);
    console.log("Response status:", res.status);

    if (!res.ok) return null;

    const data = await res.json();
    console.log("Kết quả từ API:", data);

    const laptop = data.pro;
    if (!laptop) return null;

    laptop.id = laptop._id;
    laptop.productVariant = data.pro.productVariant || [];

    return laptop;
  } catch (err) {
    console.error("Lỗi trong getLaptop:", err);
    return null;
  }
}
async function getProductVariant(productId: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product-variant/by-product/${productId}`);
    if (!res.ok) return [];

    const data = await res.json();

    
    const raw = data.result || [];
    const flattened = raw.flatMap((entry: any) => entry.variants || []);

    return flattened;
  } catch {
    return [];
  }
}


async function getRelatedProducts(categoryId: string, excludeId: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product?category=${categoryId}`);
    const data = await res.json();

    const products = data.result || [];

    return products
      .filter((item: any) => item._id !== excludeId)
      .slice(0, 2);
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm liên quan:", error);
    return [];
  }
}


export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = params;
  
  const laptop = await getLaptop(id);
  if (!laptop) return notFound();

  laptop.id = laptop._id;
  const variants = await getProductVariant(laptop._id);
  laptop.productVariant = variants;

  const related = await getRelatedProducts(
    laptop.category.categoryId,
    laptop._id
    
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="w-[85%] max-w-screen-lg mx-auto px-4">
        <ProductPageClient laptop={laptop} relatedProducts={related} />
      </div>
      <Footer />
    </div>
  );
}