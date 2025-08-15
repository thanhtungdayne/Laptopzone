"use client";

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

// Định nghĩa giao diện cho props của thành phần ProductPageClient
interface ProductPageClientProps {
  laptop: Laptop;
  relatedProducts: Laptop[];
}

// Hook kiểm tra trạng thái đã mount (để tránh lỗi hydration)
export function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true); // Đặt trạng thái đã mount khi component được render
  }, []);
  return hasMounted;
}

// Thành phần chính: Hiển thị trang chi tiết sản phẩm
export default function ProductPageClient({
  laptop,
  relatedProducts,
}: ProductPageClientProps) {
  const { user } = useAuth(); // Lấy thông tin người dùng từ context xác thực
  const [quantity, setQuantity] = useState(1); // Số lượng sản phẩm mặc định là 1
  const [isSpecsDialogOpen, setIsSpecsDialogOpen] = useState(false); // Trạng thái mở dialog thông số chi tiết
  const [selectedAttributes, setSelectedAttributes] = useState<{
    [key: string]: string;
  }>({}); // Thuộc tính biến thể được chọn (CPU, GPU, Màu sắc)
  const [selectedVariant, setSelectedVariant] = useState<any>(null); // Biến thể sản phẩm được chọn

  // Tự động chọn biến thể mặc định dựa trên giá của laptop
  useEffect(() => {
    if (!laptop?.productVariant) return;

    const defaultVariant = laptop.productVariant.find(
      (v: any) => v.price === laptop.price
    );

    if (defaultVariant) {
      const defaultAttributes: { [key: string]: string } = {};
      defaultVariant.attributes.forEach((attr: any) => {
        defaultAttributes[attr.attributeName] = attr.value;
      });
      setSelectedAttributes(defaultAttributes); // Cập nhật thuộc tính mặc định
      setSelectedVariant(defaultVariant); // Cập nhật biến thể mặc định
    }
  }, [laptop]);

  // Cập nhật biến thể khi người dùng thay đổi thuộc tính
  useEffect(() => {
    if (!laptop?.productVariant) return;

    const matchedVariant = laptop.productVariant.find((variant: any) =>
      variant.attributes.every(
        (attr: any) => selectedAttributes[attr.attributeName] === attr.value
      )
    );

    setSelectedVariant(matchedVariant || null); // Cập nhật biến thể phù hợp
  }, [selectedAttributes, laptop]);

  // Hàm lấy danh sách giá trị có thể chọn cho một thuộc tính (CPU, GPU, Color)
  function getAvailableOptions(attribute: string): string[] {
    if (!laptop?.productVariant) return [];

    // Lọc các biến thể phù hợp với thuộc tính đang chọn
    const filteredVariants = laptop.productVariant.filter((variant: any) =>
      variant.attributes.every((attr: any) => {
        const key = attr.attributeName;
        const val = attr.value;
        return (
          key === attribute ||
          !selectedAttributes[key] ||
          selectedAttributes[key] === val
        );
      })
    );

    // Lấy danh sách giá trị duy nhất cho thuộc tính
    const values = [
      ...new Set(
        filteredVariants.flatMap((v: any) =>
          v.attributes
            .filter((attr: any) => attr.attributeName === attribute)
            .map((attr: any) => attr.value)
        )
      ),
    ];

    return values;
  }

  const { fetchCart, addItem } = useCart(); // Lấy hàm từ context giỏ hàng
  const { toast } = useToast(); // Hook để hiển thị thông báo

  // Ghi log biến thể đang chọn để debug
  useEffect(() => {
    console.log("Biến thể đang chọn:", selectedVariant);
  }, [selectedVariant]);

  // Hàm xử lý thêm sản phẩm vào giỏ hàng
  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast({
        title: "Vui lòng chọn đầy đủ biến thể",
        description: "Bạn cần chọn CPU, GPU và Màu sắc trước khi thêm vào giỏ hàng.",
      });
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

      // Thêm sản phẩm vào giỏ hàng
      await addItem(cartItem);

      toast({
        title: "Đã thêm vào giỏ hàng",
        description: "Sản phẩm đã được thêm thành công!",
      });
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      toast({
        title: "Lỗi kết nối server",
        description: "Không thể gửi yêu cầu tới server.",
      });
    }
  };

  // Tạo breadcrumb cho điều hướng
  const breadcrumbItems = [
    { label: "Laptop", href: "/" },
    { label: laptop.category.categoryName },
    { label: laptop.name },
  ];

  // Tối ưu hóa danh sách ảnh với chất lượng cao
  const fixedImages = useMemo(() => {
    return laptop.images.map(fixImageQuality);
  }, [laptop.images]);

  // Hàm sửa chất lượng ảnh
  function fixImageQuality(url: string): string {
    return url.replace(/_AC_[^_]+_/, "_AC_SL1000_");
  }

  // Hàm định dạng giá tiền sang VND
  function formatPrice(amount: number): string {
    return amount.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  }

  // Hàm lấy danh sách giá trị cho một thuộc tính
  function getAttributeValues(attribute: string): string[] {
    return [
      ...new Set(
        laptop.productVariant
          ?.flatMap((v: any) =>
            Array.isArray(v.attributes)
              ? v.attributes.filter(
                  (attr: any) => attr.attributeName === attribute
                )
              : []
          )
          .map((attr: any) => attr.value)
      ),
    ];
  }

  // Hàm render các tùy chọn thuộc tính
  function renderOption(attribute: string, value: string) {
    const isSelected = selectedAttributes[attribute] === value;
    return (
      <button
        key={value}
        type="button"
        onClick={() =>
          setSelectedAttributes((prev) => ({
            ...prev,
            [attribute]: value,
          }))
        }
        className={`px-3 py-1 rounded border text-sm transition ${
          isSelected
            ? "bg-blue-600 text-white border-blue-600"
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
        {/* Breadcrumb điều hướng */}
        <Breadcrumb items={breadcrumbItems} />

        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Phần hiển thị ảnh và mô tả */}
          <div className="flex w-full flex-col space-y-4">
            <ImageGallery images={fixedImages} />
            <div className="text-sm text-gray-700 whitespace-pre-line">
              <h2 className="text-xl font-bold">Mô tả</h2>
              {laptop.description}
            </div>
          </div>

          {/* Thông tin sản phẩm */}
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

            {/* Thông số chính */}
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

                {/* Hiển thị thông số chính */}
                <div className="grid grid-cols-1 gap-3 text-sm">
                  {/* CPU */}
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Bộ xử lý:</span>
                    <div className="flex flex-wrap justify-end gap-2 max-w-[60%]">
                      {[
                        ...new Set(
                          laptop.productVariant
                            ?.flatMap((v: any) =>
                              v.attributes.filter(
                                (a: any) => a.attributeName === "CPU"
                              )
                            )
                            .map((a: any) => a.value)
                        ),
                      ].map((value) => (
                        <button
                          key={value}
                          onClick={() =>
                            setSelectedAttributes((prev) => ({
                              ...prev,
                              CPU: value,
                            }))
                          }
                          className={`px-2 py-1 rounded border text-xs ${
                            selectedAttributes["CPU"] === value
                              ? "bg-[#5E63F2] text-white border-[#5E63F2]"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* GPU */}
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Card đồ họa:</span>
                    <div className="flex flex-wrap justify-end gap-2 max-w-[60%]">
                      {[
                        ...new Set(
                          laptop.productVariant
                            ?.flatMap((v: any) =>
                              v.attributes.filter(
                                (a: any) => a.attributeName === "GPU"
                              )
                            )
                            .map((a: any) => a.value)
                        ),
                      ].map((value) => (
                        <button
                          key={value}
                          onClick={() =>
                            setSelectedAttributes((prev) => ({
                              ...prev,
                              GPU: value,
                            }))
                          }
                          className={`px-2 py-1 rounded border text-xs ${
                            selectedAttributes["GPU"] === value
                              ? "bg-[#5E63F2] text-white border-[#5E63F2]"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* RAM + Storage */}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">RAM / Lưu trữ:</span>
                    <span className="font-medium text-right">
                      {laptop.ram} / {laptop.storage}
                    </span>
                  </div>

                  {/* Display */}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Màn hình:</span>
                    <span className="font-medium text-right">
                      {laptop.display}
                    </span>
                  </div>

                  {/* Color */}
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Màu sắc:</span>
                    <div className="flex flex-wrap justify-end gap-2 max-w-[60%]">
                      {[
                        ...new Set(
                          laptop.productVariant
                            ?.flatMap((v: any) =>
                              v.attributes.filter(
                                (a: any) => a.attributeName === "Color"
                              )
                            )
                            .map((a: any) => a.value)
                        ),
                      ].map((value) => (
                        <button
                          key={value}
                          onClick={() =>
                            setSelectedAttributes((prev) => ({
                              ...prev,
                              Color: value,
                            }))
                          }
                          className={`px-2 py-1 rounded border text-xs ${
                            selectedAttributes["Color"] === value
                              ? "bg-[#5E63F2] text-white border-[#5E63F2]"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tùy chọn mua hàng */}
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
                <div className="text-red-600 font-medium">Hết hàng</div>
              )}

              <div className="flex space-x-3">
                <Button
                  size="lg"
                  className="flex-1 bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
                  onClick={handleAddToCart}
                  disabled={
                    !laptop.inStock ||
                    !laptop.stock ||
                    !selectedAttributes["CPU"] ||
                    !selectedAttributes["GPU"] ||
                    !selectedAttributes["Color"] ||
                    !selectedVariant
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

            {/* Thông tin vận chuyển và đổi trả */}
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
                  <div className="text-muted-foreground">
                    Bảo hành nhà sản xuất
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm p-3 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
                <RotateCcw className="h-5 w-5 text-orange-600" />
                <div>
                  <div className="font-medium">Đổi trả 30 ngày</div>
                  <div className="text-muted-foreground">
                    Chính sách đổi trả dễ dàng
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab chi tiết sản phẩm */}
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
                  </Dialog>
                </div>

                {/* Hiển thị thông số kỹ thuật */}
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
                      <span className="font-medium">Card đồ họa</span>
                      <span className="text-right whitespace-normal break-words max-w-[200px]">
                        <div className="flex flex-col items-end text-right">
                          {Array.isArray(laptop.graphics) ? (
                            laptop.graphics.map((gpu, idx) => (
                              <span key={idx}>{gpu}</span>
                            ))
                          ) : (
                            <span>{laptop.graphics}</span>
                          )}
                        </div>
                      </span>
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
                      <p>
                        • Miễn phí vận chuyển 
                      </p>
                      <p>• Vận chuyển nhanh </p>
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

        {/* Sản phẩm liên quan */}
        <div className="w-[85%] max-w-none mx-auto px-4 pb-32">
          <RelatedProducts currentProduct={laptop} allProducts={relatedProducts} />
        </div>
      </div>
    </div>
  );
}