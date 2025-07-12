"use client";
import { useMemo } from "react";
import { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const { user } = useAuth(); // ✅ Đặt vào trong đây
  const [quantity, setQuantity] = useState(1);
  const [isSpecsDialogOpen, setIsSpecsDialogOpen] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState<{
    [key: string]: string;
  }>({});
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  // Gán mặc định variant có giá = laptop.price
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
      setSelectedAttributes(defaultAttributes);
      setSelectedVariant(defaultVariant);
    }
  }, [laptop]);

  // Cập nhật lại selectedVariant khi người dùng chọn option
  useEffect(() => {
    if (!laptop?.productVariant) return;

    const matchedVariant = laptop.productVariant.find((variant: any) =>
      variant.attributes.every(
        (attr: any) => selectedAttributes[attr.attributeName] === attr.value
      )
    );

    setSelectedVariant(matchedVariant || null);
  }, [selectedAttributes, laptop]);

  function getAvailableOptions(attribute: string): string[] {
    if (!laptop?.productVariant) return [];

    // Lọc các biến thể phù hợp với attributes đang chọn (trừ cái đang xét)
    const filteredVariants = laptop.productVariant.filter((variant: any) =>
      variant.attributes.every((attr: any) => {
        const key = attr.attributeName;
        const val = attr.value;
        return (
          key === attribute || // bỏ qua attribute đang xét
          !selectedAttributes[key] ||
          selectedAttributes[key] === val
        );
      })
    );

    // Lấy ra danh sách giá trị có thể chọn cho attribute này
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

  useEffect(() => {
    console.log("Biến thể đang chọn:", selectedVariant);
  }, [selectedVariant]);
  // const { addItem } = useCart();
  console.log("productVariant:", laptop.productVariant);
  console.log("laptop:", laptop);

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      alert("Vui lòng chọn đầy đủ CPU, GPU và Màu sắc trước khi thêm vào giỏ hàng.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?._id, // hoặc dùng context user
          variantId: selectedVariant._id,
          quantity,
        }),
      });
      console.log("User from context:", user);
      const data = await res.json();
      if (data.status) {
        alert("✅ Đã thêm vào giỏ hàng");
      } else {
        alert("❌ " + data.message);
      }
    } catch (error) {
      console.error("❌ Lỗi khi thêm vào giỏ hàng:", error);
      alert("Lỗi khi gửi yêu cầu đến server");
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
  function formatPrice(amount: number): string {
    return amount.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  }
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
        className={`px-3 py-1 rounded border text-sm transition ${isSelected
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
        <Breadcrumb items={breadcrumbItems} />

        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Image Gallery - Bigger container */}
          <div className="flex w-full flex-col space-y-4">
            <ImageGallery images={fixedImages} />
            <div className="text-sm text-gray-700 whitespace-pre-line">
              <h2 className="text-xl font-bold">Mô tả </h2>
              {laptop.description}
            </div>
          </div>

          {/* Product Info */}
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

            {/* Key Specs - Shortened */}
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

                {/*thông số chính*/}

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
                          className={`px-2 py-1 rounded border text-xs ${selectedAttributes["CPU"] === value
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
                          className={`px-2 py-1 rounded border text-xs ${selectedAttributes["GPU"] === value
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
                          className={`px-2 py-1 rounded border text-xs ${selectedAttributes["Color"] === value
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

            {/* Purchase Options */}
            <div className="space-y-4">
              {/* Variant Selection */}
              {/* <div className="flex flex-wrap items-start gap-8">
              {["CPU", "GPU", "Color"].map((attribute) => (
                <div key={attribute} className="flex flex-col items-start gap-2">
                  <span className="font-medium">{attribute}</span>
                  <div className="flex flex-wrap gap-2">
                    {getAttributeValues(attribute).map((value) => renderOption(attribute, value))}
                  </div>
                </div>
              ))}
            </div> */}

              <div className="flex items-center space-x-4">
                <label htmlFor="quantity" className="text-sm font-medium">
                  Số lượng:
                </label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Number.parseInt(e.target.value))}
                  className="border rounded px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!laptop.inStock}
                >
                  {[...Array(Math.min(10, laptop.stock || 1))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
                {laptop.stock && laptop.stock < 10 && (
                  <span className="text-sm text-muted-foreground">
                    (Còn {laptop.stock} sản phẩm)
                  </span>
                )}
              </div>
              <span className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent"></span>
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

            {/* Shipping & Returns */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2 text-sm p-3 rounded-lg bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                <Truck className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium">Miễn phí vận chuyển</div>
                  <div className="text-muted-foreground">Đơn hàng trên $500</div>
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

        {/* Product Details Tabs */}
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

                {/* thông số kỹ thuật */}
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
                        • Miễn phí vận chuyển tiêu chuẩn cho đơn hàng trên $500
                      </p>
                      <p>• Vận chuyển nhanh với phí $29.99</p>
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

        {/* Related Products */}

        {/* <RelatedProducts currentProduct={laptop} allProducts={relatedProducts} />  */}

      </div>
      <div className="w-[85%] max-w-none mx-auto px-4 pb-32">
        <RelatedProducts currentProduct={laptop} allProducts={relatedProducts} />
      </div>

    </div>


  );

}
