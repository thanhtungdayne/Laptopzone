import { notFound } from "next/navigation";
import { laptops } from "@/data/laptops";
import ProductPageClient from "@/components/product-page-client";
import Footer from "@/components/footer";
import Header from "@/components/header";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  // Properly await the params Promise
  const { id } = await params;
  const laptop = laptops.find((l) => l.id === Number.parseInt(id));

  if (!laptop) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="w-[85%] max-w-none mx-auto px-4">
        <ProductPageClient laptop={laptop} />
      </div>
      <Footer />
    </div>
  );
}
