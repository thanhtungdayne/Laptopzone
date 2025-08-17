'use client';

import { useMemo, useState, useEffect } from "react";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Info,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ImageGallery from "@/components/image-gallery";
import Specifications from "@/components/specifications";
import RelatedProducts from "@/components/related-products";
import Breadcrumb from "@/components/breadcrumb";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";
import type { Laptop } from "@/types/product";
import { useAuth } from "@/context/auth-context";
import { useToast } from "./ui/use-toast";

interface ProductPageClientProps {
  laptop: Laptop;
  relatedProducts: Laptop[];
}

export function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  return hasMounted;
}

export default function ProductPageClient({
  laptop,
  relatedProducts,
}: ProductPageClientProps) {
  const { isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [isSpecsDialogOpen, setIsSpecsDialogOpen] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState<{
    [key: string]: string | null;
  }>({});
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  // Định nghĩa thứ tự các thuộc tính
  const attributeOrder = ["CPU", "RAM", "Storage", "Color"];

  // Tự động chọn biến thể có giá thấp nhất
  useEffect(() => {
    if (!laptop?.productVariant || !Array.isArray(laptop.productVariant) || laptop.productVariant.length === 0) return;

    // Tìm biến thể có giá thấp nhất
    const cheapestVariant = laptop.productVariant.reduce((prev: any, curr: any) =>
      Number(prev.price) < Number(curr.price) ? prev : curr
    );

    if (cheapestVariant && Array.isArray(cheapestVariant.attributes)) {
      const defaultAttributes: { [key: string]: string | null } = {};
      cheapestVariant.attributes.forEach((attr: any) => {
        defaultAttributes[attr.attributeName] = attr.value;
      });
      setSelectedAttributes(defaultAttributes);
      setSelectedVariant(cheapestVariant);
    }
  }, [laptop]);

  // Cập nhật biến thể khi thay đổi thuộc tính
  useEffect(() => {
    if (!laptop?.productVariant || !Array.isArray(laptop.productVariant)) return;

    const matchedVariant = laptop.productVariant.find((variant: any) =>
      Array.isArray(variant.attributes) &&
      variant.attributes.every(
        (attr: any) => selectedAttributes[attr.attributeName] === attr.value
      )
    );

    setSelectedVariant(matchedVariant || null);
  }, [selectedAttributes, laptop]);

  // Hàm lấy danh sách tất cả giá trị có thể có cho một thuộc tính
  function getAllOptions(attribute: string): string[] {
    if (!laptop?.productVariant || !Array.isArray(laptop.productVariant)) {
      return [];
    }

    const values = [
      ...new Set(
        laptop.productVariant.flatMap((v: any) =>
          Array.isArray(v.attributes)
            ? v.attributes
                .filter((attr: any) => attr.attributeName === attribute)
                .map((attr: any) => attr.value)
            : []
        )
      ),
    ];

    return values;
  }

  // Hàm kiểm tra xem một giá trị có khả dụng không dựa trên các thuộc tính đã chọn trước
  function isOptionAvailable(attribute: string, value: string): boolean {
    if (!laptop?.productVariant || !Array.isArray(laptop.productVariant)) {
      return false;
    }

    const currentIndex = attributeOrder.indexOf(attribute);
    if (currentIndex === -1) return false;

    // Lọc các biến thể dựa trên các thuộc tính đã chọn trước đó
    const filteredVariants = laptop.productVariant.filter((variant: any) =>
      Array.isArray(variant.attributes) &&
      variant.attributes.every((attr: any) => {
        const key = attr.attributeName;
        const val = attr.value;
        // Chỉ kiểm tra các thuộc tính trước attribute hiện tại trong attributeOrder
        const prevAttributes = attributeOrder.slice(0, currentIndex);
        return (
          !prevAttributes.includes(key) ||
          !selectedAttributes[key] ||
          selectedAttributes[key] === val
        );
      })
    );

    // Kiểm tra xem giá trị có tồn tại trong các biến thể đã lọc
    return filteredVariants.some((variant: any) =>
      variant.attributes.some(
        (attr: any) => attr.attributeName === attribute && attr.value === value
      )
    );
  }

  // Hàm xử lý khi nhấp vào một thuộc tính
  function handleAttributeClick(attribute: string, value: string) {
    setSelectedAttributes((prev) => {
      // Nếu giá trị đã được chọn, bỏ chọn nó
      if (prev[attribute] === value) {
        const newAttributes = { ...prev, [attribute]: null };
        // Reset các thuộc tính không tương thích ở các hàng sau
        const currentIndex = attributeOrder.indexOf(attribute);
        attributeOrder.slice(currentIndex + 1).forEach((key) => {
          if (newAttributes[key]) {
            const availableOptions = getAllOptions(key).filter((val) =>
              isOptionAvailable(key, val)
            );
            if (!availableOptions.includes(newAttributes[key]!)) {
              newAttributes[key] = null;
            }
          }
        });
        return newAttributes;
      }

      // Chọn giá trị mới và reset các thuộc tính không tương thích ở các hàng sau
      const newAttributes = { ...prev, [attribute]: value };
      const currentIndex = attributeOrder.indexOf(attribute);
      attributeOrder.slice(currentIndex + 1).forEach((key) => {
        if (newAttributes[key]) {
          const availableOptions = getAllOptions(key).filter((val) =>
            isOptionAvailable(key, val)
          );
          if (!availableOptions.includes(newAttributes[key]!)) {
            newAttributes[key] = null;
          }
        }
      });

      return newAttributes;
    });
  }

  const { addItem, isLoading } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    console.log("Biến thể đang chọn:", selectedVariant);
  }, [selectedVariant]);

  const handleAddToCart = async () => {
    console.log("handleAddToCart - Bắt đầu:", { isAuthenticated, isLoading, selectedVariant });
    if (!selectedVariant) {
      console.log("handleAddToCart - Chưa chọn biến thể");
      toast({
        title: "Vui lòng chọn đầy đủ biến thể",
        description: "Bạn cần chọn đầy đủ các thuộc tính trước khi thêm vào giỏ hàng.",
        variant: "destructive",
      });
      return;
    }

    if (!isAuthenticated) {
      console.log("handleAddToCart - Chưa đăng nhập, hiển thị thông báo");
      toast({
        title: "Hãy đăng nhập",
        description: "Hãy đăng nhập để mua hàng.",
        variant: "destructive",
      });
      return;
    }

    if (isLoading) {
      console.log("handleAddToCart - Đang xử lý, không gọi addItem");
      return;
    }

    try {
      const cartItem = {
        variantId: selectedVariant._id,
        quantity,
        price: selectedVariant.price,
        productName: laptop.name,
        productImage: laptop.images[0] || "",
        attributes: selectedVariant.attributes.map((attr: any) => ({
          name: attr.attributeName,
          value: attr.value,
        })),
      };

      console.log("handleAddToCart - Gọi addItem:", cartItem);
      await addItem(cartItem);
    } catch (error: any) {
      console.error("handleAddToCart - Lỗi khi gọi addItem:", error.message);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể thêm sản phẩm vào giỏ hàng",
        variant: "destructive",
      });
    }
  };

  const breadcrumbItems = [
    { label: "Laptop", href: "/" },
    { label: laptop.category.categoryName },
    { label: laptop.name },
  ];

  const fixedImages = useMemo(() => {
    return laptop.images.map(fixImageQuality);
  }, [laptop.images]);

  function fixImageQuality(url: string): string {
    return url.replace(/_AC_[^_]+_/, "_AC_SL1000_");
  }

  function renderOption(attribute: string, value: string) {
    const isSelected = selectedAttributes[attribute] === value;
    const isDisabled = !isOptionAvailable(attribute, value);

    return (
      <button
        key={value}
        type="button"
        onClick={() => handleAttributeClick(attribute, value)}
        disabled={isDisabled}
        className={`px-3 py-1 rounded border text-sm transition ${
          isSelected
            ? "bg-blue-600 text-white border-blue-600"
            : isDisabled
            ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
        }`}
      >
        {value}
      </button>
    );
  }

  return (
    <div>
      <div className="w-[85%] max-w-none mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbItems} />

        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          <div className="flex w-full flex-col space-y-4">
            <ImageGallery images={fixedImages} />
            <div className="text-sm text-gray-700 whitespace-pre-line">
              <h2 className="text-xl font-bold">Mô tả</h2>
              {laptop.description}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  {laptop.brand?.brandName}
                </Badge>
                <Badge
                  variant={laptop.inStock ? "default" : "secondary"}
                  className={
                    laptop.inStock
                      ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0"
                      : ""
                  }
                >
                  {laptop.inStock ? "Còn hàng" : "Hết hàng"}
                </Badge>
                {laptop.stock && laptop.stock <= 5 && laptop.stock > 0 && (
                  <Badge variant="destructive">
                    Chỉ còn {laptop.stock} sản phẩm
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl font-bold mb-4">{laptop.name}</h1>
            </div>

            <Card className="border-2 border-transparent bg-gradient-to-br from-blue-50 to-purple-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent">
                    Thông số chính
                  </h3>
                  <Dialog
                    open={isSpecsDialogOpen}
                    onOpenChange={setIsSpecsDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-1"
                      >
                        <Info className="h-4 w-4 mr-1" />
                        Xem chi tiết
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold">
                          Thông số kỹ thuật chi tiết - {laptop.name}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="mt-4">
                        <Specifications laptop={laptop} />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid grid-cols-1 gap-3 text-sm">
                  {/* CPU */}
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Bộ xử lý:</span>
                    <div className="flex flex-wrap justify-end gap-2 max-w-[60%]">
                      {getAllOptions("CPU").map((value) =>
                        renderOption("CPU", value)
                      )}
                    </div>
                  </div>

                  {/* RAM */}
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">RAM:</span>
                    <div className="flex flex-wrap justify-end gap-2 max-w-[60%]">
                      {getAllOptions("RAM").map((value) =>
                        renderOption("RAM", value)
                      )}
                    </div>
                  </div>

                  {/* Storage */}
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Lưu trữ:</span>
                    <div className="flex flex-wrap justify-end gap-2 max-w-[60%]">
                      {getAllOptions("Storage").map((value) =>
                        renderOption("Storage", value)
                      )}
                    </div>
                  </div>

                  {/* Color */}
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Màu sắc:</span>
                    <div className="flex flex-wrap justify-end gap-2 max-w-[60%]">
                      {getAllOptions("Color").map((value) =>
                        renderOption("Color", value)
                      )}
                    </div>
                  </div>

                  {/* Display */}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Màn hình:</span>
                    <span className="font-medium text-right">{laptop.display}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {selectedVariant ? (
                <>
                  <span className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent">
                    {formatPrice(selectedVariant.price)}
                  </span>
                  {selectedVariant.originalprice && (
                    <>
                      <span className="text-lg text-muted-foreground line-through">
                        {formatPrice(selectedVariant.originalprice)}
                      </span>
                      <Badge variant="destructive">
                        Tiết kiệm{" "}
                        {formatPrice(
                          selectedVariant.originalprice - selectedVariant.price
                        )}
                      </Badge>
                    </>
                  )}
                </>
              ) : (
                <div className="text-red-600 font-medium">
                  Vui lòng chọn đầy đủ các thuộc tính
                </div>
              )}

              <div className="flex space-x-3">
                <Button
                  size="lg"
                  className="flex-1 bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
                  onClick={handleAddToCart}
                  disabled={
                    !laptop.inStock ||
                    !laptop.stock ||
                    !selectedVariant ||
                    isLoading
                  }
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Thêm vào giỏ
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-600 hover:text-white hover:border-transparent"
                >
                  <Heart className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-600 hover:text-white hover:border-transparent"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2 text-sm p-3 rounded-lg bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                <Truck className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium">Miễn phí vận chuyển</div>
                  <div className="text-muted-foreground">Đơn hàng trên 12,500,000 ₫</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm p-3 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                <Shield className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-medium">Bảo hành 2 năm</div>
                  <div className="text-muted-foreground">Bảo hành nhà sản xuất</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm p-3 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
                <RotateCcw className="h-5 w-5 text-orange-600" />
                <div>
                  <div className="font-medium">Đổi trả 30 ngày</div>
                  <div className="text-muted-foreground">Chính sách đổi trả dễ dàng</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="specifications" className="mb-12">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="specifications">Thông số kỹ thuật</TabsTrigger>
            <TabsTrigger value="shipping">Vận chuyển & Đổi trả</TabsTrigger>
          </TabsList>

          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Thông số kỹ thuật</h3>
                  <Dialog
                    open={isSpecsDialogOpen}
                    onOpenChange={setIsSpecsDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Info className="h-4 w-4 mr-1" />
                        Xem chi tiết đầy đủ
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold">
                          Thông số kỹ thuật chi tiết - {laptop.name}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="mt-4">
                        <Specifications laptop={laptop} />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Bộ xử lý</span>
                      <span className="text-right whitespace-normal break-words max-w-[200px]">
                        <div className="flex flex-col items-end text-right">
                          {Array.isArray(laptop.processor) ? (
                            laptop.processor.map((cpu, idx) => (
                              <span key={idx}>{cpu}</span>
                            ))
                          ) : (
                            <span>{laptop.processor}</span>
                          )}
                        </div>
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Bộ nhớ RAM</span>
                      <span className="text-right">{laptop.ram}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Ổ cứng</span>
                      <span className="text-right">{laptop.storage}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Màn hình</span>
                      <span className="text-right">{laptop.display}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Tình trạng</span>
                      <span className="text-right">
                        {laptop.inStock ? "Còn hàng" : "Hết hàng"}
                        {laptop.stock && ` (${laptop.stock} sản phẩm)`}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shipping" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      Thông tin vận chuyển
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p>• Miễn phí vận chuyển</p>
                      <p>• Vận chuyển nhanh</p>
                      <p>• Giao hàng tiêu chuẩn: 3-5 ngày làm việc</p>
                      <p>• Giao hàng nhanh: 1-2 ngày làm việc</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      Chính sách đổi trả
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p>• Thời gian đổi trả 30 ngày kể từ ngày giao hàng</p>
                      <p>• Sản phẩm phải ở tình trạng và bao bì ban đầu</p>
                      <p>• Miễn phí vận chuyển đổi trả cho sản phẩm lỗi</p>
                      <p>• Có thể áp dụng phí tái kho cho phần mềm đã mở</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3 bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent">
                      Bảo hành
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p>• Bảo hành nhà sản xuất 2 năm</p>
                      <p>• Có thể mở rộng bảo hành</p>
                      <p>• Hỗ trợ kỹ thuật bao gồm</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="w-[85%] max-w-none mx-auto px-4 pb-32">
          <RelatedProducts currentProduct={laptop} allProducts={relatedProducts} />
        </div>
      </div>
    </div>
  );
}