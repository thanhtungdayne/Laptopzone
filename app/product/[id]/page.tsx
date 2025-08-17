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
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/${id}`, {
      next: { revalidate: 60 },
    });
    console.log("Response status:", res.status);

    if (!res.ok) {
      console.error("API trả về lỗi với status:", res.status);
      return null;
    }

    const data = await res.json();
    console.log("Kết quả từ API:", data);

    if (!data.status || !data.pro) {
      console.error("Không tìm thấy sản phẩm trong dữ liệu API:", data);
      return null;
    }

    const laptop = data.pro;
    return {
      id: laptop._id,
      name: laptop.name || "",
      description: laptop.description || "",
      brand: {
        brandId: laptop.brand?.brandId || "",
        brandName: laptop.brand?.brandName || "Unknown",
      },
      price: Number(laptop.price) || 0,
      originalPrice: laptop.originalprice
        ? typeof laptop.originalprice === "string"
          ? parseFloat(laptop.originalprice)
          : laptop.originalprice
        : undefined,
      image: laptop.image || "",
      images: Array.isArray(laptop.images) ? laptop.images : [],
      processor: Array.isArray(laptop.processor) ? laptop.processor.join(", ") : laptop.processor || "",
      ram: Array.isArray(laptop.ram) ? laptop.ram.join(", ") : laptop.ram || "",
      storage: Array.isArray(laptop.storage) ? laptop.storage.join(", ") : laptop.storage || "",
      display: laptop.display || "",
      graphics: laptop.graphics || "", // Xử lý graphics như chuỗi
      stock: Number(laptop.stock) || 0,
      inStock: laptop.inStock ?? true,
      category: {
        categoryId: laptop.category?.categoryId || "",
        categoryName: laptop.category?.categoryName || "Unknown",
      },
      features: Array.isArray(laptop.features) ? laptop.features : [],
      rating: Number(laptop.rating) || 0,
      color: Array.isArray(laptop.color) ? laptop.color : [],
      new: laptop.new ?? false,
      hot: laptop.hot ?? false,
      view: Number(laptop.view) || 0,
      status: laptop.status ?? true,
    };
  } catch (err) {
    console.error("Lỗi trong getLaptop:", err);
    return null;
  }
}

async function getProductVariant(productId: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/product-variant/by-product/${productId}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) {
      console.error("API product-variant trả về lỗi với status:", res.status);
      return [];
    }

    const data = await res.json();
    const raw = data.result || [];
    const flattened = raw.flatMap((entry: any) => entry.variants || []).map((variant: any) => ({
      ...variant,
      price: Number(variant.price) || 0,
      originalPrice: variant.originalprice
        ? typeof variant.originalprice === "string"
          ? parseFloat(variant.originalprice)
          : variant.originalprice
        : undefined,
      graphics: variant.graphics , // Giả định productVariant cũng có graphics là chuỗi
    }));

    return flattened;
  } catch (err) {
    console.error("Lỗi trong getProductVariant:", err);
    return [];
  }
}

async function getRelatedProducts(categoryId: string, excludeId: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/product/category/${categoryId}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) {
      console.error("API related products trả về lỗi với status:", res.status);
      return [];
    }

    const data = await res.json();
    if (!data.status || !data.result) {
      console.error("Không tìm thấy sản phẩm liên quan trong dữ liệu API:", data);
      return [];
    }

    const products = data.result || [];
    return products
      .filter((item: any) => item._id !== excludeId)
      .slice(0, 2)
      .map((item: any) => ({
        id: item._id,
        name: item.name || "",
        description: item.description || "",
        brand: {
          brandId: item.brand?.brandId || "",
          brandName: item.brand?.brandName || "Unknown",
        },
        price: Number(item.price) || 0,
        originalPrice: item.originalprice
          ? typeof item.originalprice === "string"
            ? parseFloat(item.originalprice)
            : item.originalprice
          : undefined,
        image: item.image || "",
        images: Array.isArray(item.images) ? item.images : [],
        processor: Array.isArray(item.processor) ? item.processor.join(", ") : item.processor || "",
        ram: Array.isArray(item.ram) ? item.ram.join(", ") : item.ram || "",
        storage: Array.isArray(item.storage) ? item.storage.join(", ") : item.storage || "",
        display: item.display || "",
        graphics: item.graphics || "", // Xử lý graphics như chuỗi
        stock: Number(item.stock) || 0,
        inStock: item.inStock ?? true,
        category: {
          categoryId: item.category?.categoryId || "",
          categoryName: item.category?.categoryName || "Unknown",
        },
        features: Array.isArray(item.features) ? item.features : [],
        rating: Number(item.rating) || 0,
        color: Array.isArray(item.color) ? item.color : [],
        new: item.new ?? false,
        hot: item.hot ?? false,
        view: Number(item.view) || 0,
        status: item.status ?? true,
      }));
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm liên quan:", error);
    return [];
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  if (!params || !params.id) {
    console.error("Thiếu params hoặc params.id");
    return notFound();
  }

  const { id } = params;
  const laptop = await getLaptop(id);
  if (!laptop) {
    console.error("Không tìm thấy laptop với ID:", id);
    return notFound();
  }

  const variants = await getProductVariant(laptop.id);
  laptop.productVariant = variants;

  const related = await getRelatedProducts(laptop.category.categoryId, laptop.id);

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