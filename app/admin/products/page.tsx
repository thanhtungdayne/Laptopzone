"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Eye,
  Package,
  X,
  EyeOff,
} from "lucide-react";
import AdminSidebar from "@/components/admin/admin-sidebar";
import { toast } from "@/components/ui/use-toast";

interface Brand {
  _id: string;
  name: string;
  description?: string;
}

interface Category {
  _id: string;
  name: string;
  description?: string;
}

interface Attribute {
  _id: string;
  attributeName: string;
  value: string;
}

interface Variant {
  _id: string;
  attributes: Attribute[];
  price: number;
  originalprice: number;
  sku: string;
  stock: number;
}

interface ProductVariant {
  _id: string;
  productId: string;
  variants: Variant[];
}

interface Product {
  _id: string;
  name?: string;
  description?: string;
  image: string;
  images: string[];
  price: number;
  originalprice?: number;
  stock: number;
  inStock: boolean;
  rating: number;
  view: number;
  new?: boolean;
  hot?: boolean;
  processor?: string[];
  ram?: string;
  storage?: string;
  display?: string;
  graphics?: string[];
  color?: string[];
  features?: string[];
  brand: { brandId: string; brandName: string };
  category: { categoryId: string; categoryName: string };
  variants?: Variant[];
  status?: boolean;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    price: 0,
    originalprice: 0,
    stock: 0,
    brandId: "",
    categoryId: "",
    ram: "",
    storage: "",
    display: "",
    processor: [] as string[],
    graphics: [] as string[],
    color: [] as string[],
    variants: [] as {
      _id: string;
      attributes: { attributeId: string; attributeName: string; value: string }[];
      price: number;
      originalprice: number;
      sku: string;
      stock: number;
    }[],
  });
  const [addForm, setAddForm] = useState({
    name: "",
    description: "",
    price: 0,
    originalprice: 0,
    stock: 0,
    brandId: "",
    categoryId: "",
    ram: "",
    storage: "",
    display: "",
    image: "",
    images: [] as string[],
    processor: [],
    graphics: [],
    color: [],
    variants: [] as {
      _id: string;
      attributes: { attributeId: string; attributeName: string; value: string }[];
      price: number;
      originalprice: number;
      sku: string;
      stock: number;
    }[],
  });
  const [processorInput, setProcessorInput] = useState("");
  const [graphicsInput, setGraphicsInput] = useState("");
  const [colorInput, setColorInput] = useState("");
  const [editColorInput, setEditColorInput] = useState("");
  const [imagesInput, setImagesInput] = useState("");

  const generateRandomView = () => {
    return Math.floor(Math.random() * (10000 - 100 + 1)) + 100;
  };

  const fetchVariants = async (productId: string) => {
    try {
      if (!productId) {
        return [];
      }
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/product-variant/by-product/${productId}`, {
        validateStatus: (status) => status < 500,
      });

      if (res.status === 404 || !res.data || typeof res.data.result === "undefined") {
        return [];
      }

      const productVariants = Array.isArray(res.data.result) ? res.data.result : [];
      const variants = productVariants.reduce((acc: Variant[], pv: ProductVariant) => {
        return [...acc, ...(Array.isArray(pv.variants) ? pv.variants : [])];
      }, []).map((v: Variant) => ({
        ...v,
        attributes: Array.isArray(v.attributes) ? v.attributes : [],
      }));

      return variants;
    } catch (error: any) {
      return [];
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [productsRes, brandsRes, categoriesRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/product/getpro`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/brand`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/category`),
      ]);

      const productsWithVariants = await Promise.all(
        productsRes.data.result.map(async (product: Product) => {
          if (!product._id) {
            console.warn(`Sản phẩm không có _id: ${product.name || "Không rõ"}`);
            return { ...product, variants: [], name: product.name || "Sản phẩm không tên" };
          }
          const variants = await fetchVariants(product._id);
          return { ...product, variants, name: product.name || "Sản phẩm không tên" };
        })
      );

      setProducts(productsWithVariants);
      setBrands(brandsRes.data.result);
      setCategories(categoriesRes.data.result);

      if (!categoriesRes.data.result || categoriesRes.data.result.length === 0) {
        toast({
          title: "Cảnh báo",
          description: "Không có danh mục nào được tải. Vui lòng kiểm tra API danh mục.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Lỗi khi tải dữ liệu:", error.message);
      setError("Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.");
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu sản phẩm. Vui lòng kiểm tra kết nối hoặc server.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddArrayValue = (field: "processor" | "graphics" | "color" | "images", value: string, formType: "edit" | "add" = "add") => {
    if (value.trim() === "") return;
    if (formType === "edit") {
      setEditForm((prev) => ({
        ...prev,
        [field]: [...prev[field], value.trim()],
      }));
      if (field === "color") setEditColorInput("");
    } else {
      setAddForm((prev) => ({
        ...prev,
        [field]: [...prev[field], value.trim()],
      }));
      if (field === "processor") setProcessorInput("");
      if (field === "graphics") setGraphicsInput("");
      if (field === "color") setColorInput("");
      if (field === "images") setImagesInput("");
    }
  };

  const handleRemoveArrayValue = (field: "processor" | "graphics" | "color" | "images", index: number, formType: "edit" | "add" = "add") => {
    if (formType === "edit") {
      setEditForm((prev) => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index),
      }));
    } else {
      setAddForm((prev) => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index),
      }));
    }
  };

  const handleViewProduct = async (product: Product) => {
    if (!product._id) {
      toast({
        title: "Lỗi",
        description: "Sản phẩm không có ID hợp lệ.",
        variant: "destructive",
      });
      return;
    }
    const variants = await fetchVariants(product._id);
    setSelectedProduct({ ...product, variants });
    setIsViewOpen(true);
  };

  const handleEditProduct = async (product?: Product) => {
    const targetProduct = product || selectedProduct;
    if (targetProduct) {
      if (!targetProduct._id) {
        toast({
          title: "Lỗi",
          description: "Sản phẩm không có ID hợp lệ.",
          variant: "destructive",
        });
        return;
      }
      const variants = await fetchVariants(targetProduct._id);
      const defaultProcessor = targetProduct.processor?.[0] || "Intel Core i5-13500H";
      const defaultGraphics = targetProduct.graphics?.[0] || "Intel Iris Xe Graphics";
      const defaultColor = targetProduct.color?.[0] || "Indie Black";
      setEditForm({
        name: targetProduct.name || "",
        description: targetProduct.description || "",
        price: targetProduct.price,
        originalprice: targetProduct.originalprice || 0,
        stock: targetProduct.stock,
        brandId: targetProduct.brand?.brandId || "",
        categoryId: targetProduct.category?.categoryId || "",
        ram: targetProduct.ram || "",
        storage: targetProduct.storage || "",
        display: targetProduct.display || "",
        processor: targetProduct.processor ,
        graphics: targetProduct.graphics ,
        color: targetProduct.color ,
        variants: variants.map((v: Variant) => {
          const cpuAttr = v.attributes.find((a) => a.attributeName === "CPU") || {
            _id: `temp-cpu-${v._id}`,
            attributeName: "CPU",
            value: defaultProcessor,
          };
          const gpuAttr = v.attributes.find((a) => a.attributeName === "GPU") || {
            _id: `temp-gpu-${v._id}`,
            attributeName: "GPU",
            value: defaultGraphics,
          };
          const colorAttr = v.attributes.find((a) => a.attributeName === "Color") || {
            _id: `temp-color-${v._id}`,
            attributeName: "Color",
            value: defaultColor,
          };
          return {
            _id: v._id,
            attributes: [cpuAttr, gpuAttr, colorAttr],
            price: v.price || 0,
            originalprice: v.originalprice || 0,
            sku: v.sku || "",
            stock: v.stock || 0,
          };
        }),
      });
      setSelectedProduct({ ...targetProduct, variants });
      setIsViewOpen(false);
      setIsEditOpen(true);
    }
  };

  const handleAddVariant = (formType: "edit" | "add") => {
    const form = formType === "edit" ? editForm : addForm;
    const setForm = formType === "edit" ? setEditForm : setAddForm;
    setForm({
      ...form,
      variants: [
        ...form.variants,
        {
          _id: `temp-${Date.now()}-${Math.random()}`,
          attributes: [
            { attributeId: `temp-cpu-${Date.now()}`, attributeName: "CPU", value: form.processor[0] || "Intel Core i5-13500H" },
            { attributeId: `temp-gpu-${Date.now()}`, attributeName: "GPU", value: form.graphics[0] || "Intel Iris Xe Graphics" },
            { attributeId: `temp-color-${Date.now()}`, attributeName: "Color", value: form.color[0] || "Indie Black" },
          ],
          price: 0,
          originalprice: 0,
          sku: "",
          stock: 0,
        },
      ],
    });
  };

  const handleRemoveVariant = async (index: number, formType: "edit" | "add") => {
    const form = formType === "edit" ? editForm : addForm;
    const setForm = formType === "edit" ? setEditForm : setAddForm;
    if (formType === "edit") {
      const variantId = editForm.variants[index]._id;
      if (!variantId.startsWith("temp-")) {
        try {
          const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/product-variant/${variantId}`);
          if (response.status !== 200) {
            throw new Error(`Xóa biến thể thất bại, mã trạng thái: ${response.status}`);
          }
        } catch (error: any) {
          console.error(`Lỗi khi xóa biến thể ${variantId}:`, error.message);
          toast({
            title: "Lỗi",
            description: `Không thể xóa biến thể ${variantId}. ${error.message}`,
            variant: "destructive",
          });
          return;
        }
      }
    }
    setForm({
      ...form,
      variants: form.variants.filter((_, i) => i !== index),
    });
  };

  const handleAddProduct = async () => {
    if (!addForm.name || !addForm.brandId || !addForm.categoryId) {
      toast({
        title: "Lỗi",
        description: "Tên sản phẩm, thương hiệu và danh mục là bắt buộc.",
        variant: "destructive",
      });
      return;
    }
    const selectedCategory = categories.find((c) => c._id === addForm.categoryId);
    if (!selectedCategory) {
      toast({
        title: "Lỗi",
        description: "Danh mục không hợp lệ. Vui lòng chọn một danh mục hợp lệ.",
        variant: "destructive",
      });
      return;
    }
    const skuSet = new Set(addForm.variants.map((v) => v.sku));
    if (skuSet.size !== addForm.variants.length) {
      toast({
        title: "Lỗi",
        description: "Các biến thể chứa SKU trùng lặp. Vui lòng đảm bảo SKU là duy nhất.",
        variant: "destructive",
      });
      return;
    }
    const payload = {
      name: addForm.name,
      description: addForm.description,
      price: addForm.price,
      originalprice: addForm.originalprice,
      stock: addForm.stock,
      brandId: addForm.brandId,
      categoryId: addForm.categoryId,
      ram: addForm.ram,
      storage: addForm.storage,
      display: addForm.display,
      image: addForm.image,
      images: addForm.images,
      processor: addForm.processor,
      graphics: addForm.graphics,
      color: addForm.color,
      inStock: addForm.stock > 0,
      rating: 0,
      view: generateRandomView(),
      status: true,
    };
    try {
      const productResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/product/addpro`, payload);
      const newProduct = productResponse.data.result;
      let variants = [];
      if (addForm.variants.length > 0) {
        const validVariants = addForm.variants
          .filter((variant) => {
            const hasRequiredAttributes = ["CPU", "GPU", "Color"].every((name) =>
              variant.attributes.some((attr) => attr.attributeName === name && attr.value)
            );
            if (!hasRequiredAttributes) {
              console.warn(`Biến thể ${variant._id} thiếu hoặc có giá trị rỗng cho CPU, GPU, hoặc Color`);
              return false;
            }
            return true;
          })
          .map((variant) => ({
            attributes: variant.attributes.map(({ attributeId, attributeName, value }) => ({
              attributeId,
              attributeName,
              value,
            })),
            price: variant.price,
            originalprice: variant.originalprice,
            sku: variant.sku,
            stock: variant.stock,
          }));
        if (validVariants.length > 0) {
          const variantResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/product-variant/add`, {
            productId: newProduct._id,
            variants: validVariants,
          });
          variants = variantResponse.data.variants;
        }
      }
      // Tải lại dữ liệu sản phẩm từ cơ sở dữ liệu
      await fetchData();
      setIsAddOpen(false);
      setAddForm({
        name: "",
        description: "",
        price: 0,
        originalprice: 0,
        stock: 0,
        brandId: "",
        categoryId: "",
        ram: "",
        storage: "",
        display: "",
        image: "",
        images: [],
        processor: ["Intel Core i5-13500H", "Intel Core i7-13700H"],
        graphics: ["Intel Iris Xe Graphics", "NVIDIA RTX 3050"],
        color: ["Indie Black", "Silver"],
        variants: [],
      });
      setProcessorInput("");
      setGraphicsInput("");
      setColorInput("");
      setImagesInput("");
      toast({
        title: "Thành công",
        description: "Sản phẩm đã được thêm.",
      });
    } catch (error: any) {
      console.error("Lỗi khi thêm sản phẩm:", error.response?.data || error.message);
      toast({
        title: "Lỗi",
        description: `Không thể thêm sản phẩm: ${error.response?.data?.message || error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleUpdateProduct = async () => {
    if (!selectedProduct || !selectedProduct._id) {
      toast({
        title: "Lỗi",
        description: "Không có sản phẩm được chọn hoặc ID không hợp lệ.",
        variant: "destructive",
      });
      return;
    }
    const skuSet = new Set(editForm.variants.map((v) => v.sku));
    if (skuSet.size !== editForm.variants.length) {
      toast({
        title: "Lỗi",
        description: "Các biến thể chứa SKU trùng lặp. Vui lòng đảm bảo SKU là duy nhất.",
        variant: "destructive",
      });
      return;
    }
    try {
      const productResponse = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/product/updatepro/${selectedProduct._id}`,
        {
          name: editForm.name,
          description: editForm.description,
          price: editForm.price,
          originalprice: editForm.originalprice,
          stock: editForm.stock,
          brandId: editForm.brandId,
          categoryId: editForm.categoryId,
          ram: editForm.ram,
          storage: editForm.storage,
          display: editForm.display,
          processor: editForm.processor,
          graphics: editForm.graphics,
          color: editForm.color,
          status: selectedProduct.status,
        }
      );
      const variantsToUpdate = editForm.variants
        .filter((variant) => !variant._id.startsWith("temp-"))
        .map((variant) => {
          const validAttributes = variant.attributes
            .filter((attr) => attr.attributeId && !attr.attributeId.startsWith("temp-") && attr.attributeName && attr.value)
            .map(({ attributeId, attributeName, value }) => ({
              attributeId,
              attributeName,
              value,
            }));
          const hasRequiredAttributes = ["CPU", "GPU", "Color"].every((name) =>
            validAttributes.some((attr) => attr.attributeName === name && attr.value)
          );
          if (!hasRequiredAttributes) {
            console.warn(`Biến thể ${variant._id} thiếu hoặc có giá trị rỗng cho CPU, GPU, hoặc Color`);
            return null;
          }
          return {
            variantId: variant._id,
            attributes: validAttributes,
            price: variant.price,
            originalprice: variant.originalprice,
            sku: variant.sku,
            stock: variant.stock,
          };
        })
        .filter((v) => v !== null);
      const variantsToAdd = editForm.variants
        .filter((variant) => variant._id.startsWith("temp-"))
        .map((variant) => {
          const validAttributes = variant.attributes
            .filter((attr) => attr.attributeId && !attr.attributeId.startsWith("temp-") && attr.attributeName && attr.value)
            .map(({ attributeId, attributeName, value }) => ({
              attributeId,
              attributeName,
              value,
            }));
          const hasRequiredAttributes = ["CPU", "GPU", "Color"].every((name) =>
            validAttributes.some((attr) => attr.attributeName === name && attr.value)
          );
          if (!hasRequiredAttributes) {
            console.warn(`Biến thể ${variant._id} thiếu hoặc có giá trị rỗng cho CPU, GPU, hoặc Color`);
            return null;
          }
          return {
            attributes: validAttributes,
            price: variant.price,
            originalprice: variant.originalprice,
            sku: variant.sku,
            stock: variant.stock,
          };
        })
        .filter((v) => v !== null);
      let updatedVariants = [];
      if (variantsToUpdate.length > 0) {
        const updateResponse = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/product-variant/update-multiple`,
          {
            productId: selectedProduct._id,
            variants: variantsToUpdate,
          }
        );
        updatedVariants = updateResponse.data.result;
      }
      if (variantsToAdd.length > 0) {
        const addResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/product-variant/add`,
          {
            productId: selectedProduct._id,
            variants: variantsToAdd,
          }
        );
        updatedVariants = [...updatedVariants, ...addResponse.data.variants];
      }
      setProducts(
        products.map((p) =>
          p._id === selectedProduct._id
            ? { ...productResponse.data.result, variants: updatedVariants }
            : p
        )
      );
      setIsEditOpen(false);
      setSelectedProduct(null);
      toast({
        title: "Thành công",
        description: "Sản phẩm và biến thể đã được cập nhật.",
      });
    } catch (error: any) {
      console.error("Lỗi khi cập nhật sản phẩm hoặc biến thể:", error);
      toast({
        title: "Lỗi",
        description: `Không thể cập nhật sản phẩm: ${error.response?.data?.message || error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleToggleProductStatus = async (product: Product) => {
    if (!product._id) {
      toast({
        title: "Lỗi",
        description: "Sản phẩm không có ID hợp lệ.",
        variant: "destructive",
      });
      return;
    }
    const totalStock = product.variants
      ? product.variants.reduce((sum, v) => sum + (v.stock || 0), 0)
      : product.stock;
    if (totalStock > 0) {
      toast({
        title: "Lỗi",
        description: "Chỉ có thể ẩn sản phẩm khi đã hết hàng (tồn kho bằng 0).",
        variant: "destructive",
      });
      return;
    }
    try {
      const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/product/toggle-status/${product._id}`);
      const updatedProduct = response.data.result;
      setProducts(
        products.map((p) =>
          p._id === product._id
            ? { ...p, status: updatedProduct.status, inStock: updatedProduct.inStock }
            : p
        )
      );
      toast({
        title: "Thành công",
        description: `Sản phẩm đã được ${updatedProduct.status ? "hiện" : "ẩn"}.`,
      });
    } catch (error: any) {
      console.error("Lỗi khi ẩn/hiện sản phẩm:", error);
      toast({
        title: "Lỗi",
        description: `Không thể thay đổi trạng thái sản phẩm: ${error.response?.data?.message || error.message}`,
        variant: "destructive",
      });
    }
  };

  const transformedProducts = products.map((product) => ({
    id: product._id,
    name: product.name || "Sản phẩm không tên",
    brand: product.brand?.brandName || "Không rõ",
    category: product.category?.categoryName || "Không rõ",
    price: product.variants
      ? Math.min(...product.variants.map((v) => v.price || Infinity))
      : product.price,
    originalPrice: product.variants
      ? Math.min(...product.variants.map((v) => v.originalprice || Infinity))
      : product.originalprice,
    stock: product.variants
      ? product.variants.reduce((sum, v) => sum + (v.stock || 0), 0)
      : product.stock,
    inStock: product.inStock,
    status: product.status === false
      ? "hidden"
      : product.variants
      ? product.variants.reduce((sum, v) => sum + (v.stock || 0), 0) === 0
        ? "out_of_stock"
        : product.variants.reduce((sum, v) => sum + (v.stock || 0), 0) <= 5
        ? "low_stock"
        : "active"
      : product.stock === 0
      ? "out_of_stock"
      : product.stock <= 5
      ? "low_stock"
      : "active",
    sales: Math.floor(Math.random() * 200) + 50,
    image: product.image || product.images?.[0],
    variants: product.variants || [],
  }));

  const filteredProducts = transformedProducts.filter((product) => {
    const matchesSearch = product.name
      ? product.name.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalProducts = transformedProducts.length;
  const activeProducts = transformedProducts.filter(
    (p) => p.status === "active"
  ).length;
  const outOfStock = transformedProducts.filter(
    (p) => p.status === "out_of_stock"
  ).length;
  const lowStock = transformedProducts.filter(
    (p) => p.status === "low_stock"
  ).length;
  const hiddenProducts = transformedProducts.filter(
    (p) => p.status === "hidden"
  ).length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Đang bán</Badge>;
      case "out_of_stock":
        return <Badge variant="destructive">Hết hàng</Badge>;
      case "low_stock":
        return <Badge className="bg-yellow-100 text-yellow-800">Sắp hết</Badge>;
      case "hidden":
        return <Badge className="bg-gray-100 text-gray-800">Đã ẩn</Badge>;
      default:
        return <Badge variant="secondary">Không xác định</Badge>;
    }
  };

  const getCategoryDisplayName = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      "Laptop Văn Phòng": "Laptop Văn Phòng",
      gaming: "Gaming",
      ultrabook: "Ultrabook",
      business: "Doanh nghiệp",
      workstation: "Workstation",
    };
    return categoryMap[category] || category;
  };

  if (loading) {
    return (
      <AdminSidebar>
        <div className="p-6 text-gray-600 text-lg">
          Đang tải dữ liệu sản phẩm...
        </div>
      </AdminSidebar>
    );
  }

  if (error) {
    return (
      <AdminSidebar>
        <div className="p-6 text-red-600 text-lg">{error}</div>
      </AdminSidebar>
    );
  }

  return (
    <AdminSidebar>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Quản lý sản phẩm
            </h1>
            <p className="text-gray-600 mt-2">
              Quản lý danh sách sản phẩm và kho hàng
            </p>
          </div>
          <Button
            className="flex items-center space-x-2"
            onClick={() => setIsAddOpen(true)}
            disabled={categories.length === 0}
          >
            <Plus className="h-4 w-4" />
            <span>Thêm sản phẩm</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng sản phẩm</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đang bán</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeProducts}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hết hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{outOfStock}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sắp hết</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{lowStock}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đã ẩn</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{hiddenProducts}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Filter className="h-4 w-4" />
                    <span>Danh mục</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSelectedCategory("all")}>
                    Tất cả
                  </DropdownMenuItem>
                  {categories.map((category) => (
                    <DropdownMenuItem
                      key={category._id}
                      onClick={() => setSelectedCategory(category.name)}
                    >
                      {category.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách sản phẩm</CardTitle>
            <CardDescription>
              Quản lý thông tin chi tiết của từng sản phẩm
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead>Thương hiệu</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Giá</TableHead>
                  <TableHead>Kho</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Đã bán</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <span className="font-medium">{product.name}</span>
                          {product.originalPrice && product.originalPrice !== Infinity && (
                            <div className="text-sm text-red-600 font-medium">
                              Sale: {formatPrice(product.originalPrice - product.price)} off
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.brand}</Badge>
                    </TableCell>
                    <TableCell>{getCategoryDisplayName(product.category)}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{formatPrice(product.price)}</div>
                        {product.originalPrice && product.originalPrice !== Infinity && (
                          <div className="text-sm text-gray-500 line-through">
                            {formatPrice(product.originalPrice)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          product.stock <= 5
                            ? "text-red-600 font-medium"
                            : product.stock <= 10
                            ? "text-yellow-600 font-medium"
                            : "text-green-600 font-medium"
                        }
                      >
                        {product.stock}
                      </span>
                    </TableCell>
                    <TableCell>{getStatusBadge(product.status)}</TableCell>
                    <TableCell>{product.sales.toLocaleString("vi-VN")}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleViewProduct(products.find((p) => p._id === product.id)!)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditProduct(products.find((p) => p._id === product.id)!)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleProductStatus(products.find((p) => p._id === product.id)!)}
                            className="text-gray-600"
                          >
                            <EyeOff className="mr-2 h-4 w-4" />
                            {product.status === "hidden" ? "Hiện sản phẩm" : "Ẩn sản phẩm"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Chi tiết sản phẩm</DialogTitle>
            </DialogHeader>
            {selectedProduct && (
              <div className="space-y-6">
                <img
                  src={selectedProduct.image || selectedProduct.images[0]}
                  alt={selectedProduct.name || "Sản phẩm không tên"}
                  className="w-32 h-32 rounded-lg object-cover mx-auto"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-medium">Tên sản phẩm:</label>
                    <p>{selectedProduct.name || "Sản phẩm không tên"}</p>
                  </div>
                  {selectedProduct.description && (
                    <div>
                      <label className="font-medium">Mô tả:</label>
                      <p>{selectedProduct.description}</p>
                    </div>
                  )}
                  <div>
                    <label className="font-medium">Thương hiệu:</label>
                    <p>{selectedProduct.brand.brandName}</p>
                  </div>
                  <div>
                    <label className="font-medium">Danh mục:</label>
                    <p>{selectedProduct.category.categoryName}</p>
                  </div>
                  <div>
                    <label className="font-medium">Giá:</label>
                    <p>{formatPrice(selectedProduct.price)}</p>
                  </div>
                  {selectedProduct.originalprice && (
                    <div>
                      <label className="font-medium">Giá gốc:</label>
                      <p>{formatPrice(selectedProduct.originalprice)}</p>
                    </div>
                  )}
                  <div>
                    <label className="font-medium">Tồn kho:</label>
                    <p>{selectedProduct.stock}</p>
                  </div>
                  <div>
                    <label className="font-medium">Trạng thái:</label>
                    <p>{selectedProduct.status === false ? "Đã ẩn" : selectedProduct.inStock ? "Còn hàng" : "Hết hàng"}</p>
                  </div>
                  {selectedProduct.processor && (
                    <div>
                      <label className="font-medium">Bộ xử lý:</label>
                      <p>{selectedProduct.processor.join(", ")}</p>
                    </div>
                  )}
                  {selectedProduct.ram && (
                    <div>
                      <label className="font-medium">RAM:</label>
                      <p>{selectedProduct.ram}</p>
                    </div>
                  )}
                  {selectedProduct.storage && (
                    <div>
                      <label className="font-medium">Bộ nhớ:</label>
                      <p>{selectedProduct.storage}</p>
                    </div>
                  )}
                  {selectedProduct.display && (
                    <div>
                      <label className="font-medium">Màn hình:</label>
                      <p>{selectedProduct.display}</p>
                    </div>
                  )}
                  {selectedProduct.graphics && (
                    <div>
                      <label className="font-medium">Card đồ họa:</label>
                      <p>{selectedProduct.graphics.join(", ")}</p>
                    </div>
                  )}
                  {selectedProduct.color && (
                    <div>
                      <label className="font-medium">Màu sắc:</label>
                      <p>{selectedProduct.color.join(", ")}</p>
                    </div>
                  )}
                  {selectedProduct.features && (
                    <div>
                      <label className="font-medium">Tính năng:</label>
                      <p>{selectedProduct.features.join(", ")}</p>
                    </div>
                  )}
                  <div>
                    <label className="font-medium">Lượt xem:</label>
                    <p>{generateRandomView().toLocaleString("vi-VN")}</p>
                  </div>
                  <div>
                    <label className="font-medium">Đánh giá:</label>
                    <p>{selectedProduct.rating}/5</p>
                  </div>
                  {selectedProduct.new && (
                    <div>
                      <label className="font-medium">Sản phẩm mới:</label>
                      <p>{selectedProduct.new ? "Có" : "Không"}</p>
                    </div>
                  )}
                  {selectedProduct.hot && (
                    <div>
                      <label className="font-medium">Sản phẩm hot:</label>
                      <p>{selectedProduct.hot ? "Có" : "Không"}</p>
                    </div>
                  )}
                </div>
                {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                  <div>
                    <label className="font-medium text-lg">Biến thể:</label>
                    <div className="max-h-64 overflow-y-auto border border-blue-200 rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>#</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>Giá</TableHead>
                            <TableHead>Giá gốc</TableHead>
                            <TableHead>Tồn kho</TableHead>
                            <TableHead>Thuộc tính</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedProduct.variants.map((variant, index) => (
                            <TableRow key={variant._id} className={index % 2 === 0 ? "bg-blue-50" : ""}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{variant.sku || "N/A"}</TableCell>
                              <TableCell>{formatPrice(variant.price || 0)}</TableCell>
                              <TableCell>
                                {variant.originalprice
                                  ? formatPrice(variant.originalprice)
                                  : "N/A"}
                              </TableCell>
                              <TableCell>{variant.stock || 0}</TableCell>
                              <TableCell>
                                {Array.isArray(variant.attributes) && variant.attributes.length > 0 ? (
                                  variant.attributes.map((attr, attrIndex) => (
                                    <div key={attrIndex}>
                                      {attr.attributeName}: {attr.value}
                                    </div>
                                  ))
                                ) : (
                                  <span>Không có thuộc tính</span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => handleEditProduct()}>Chỉnh sửa</Button>
              <Button variant="outline" onClick={() => setIsViewOpen(false)}>
                Đóng
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa sản phẩm</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="font-medium">Tên sản phẩm</label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="font-medium">Mô tả</label>
                <Input
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                />
              </div>
              <div>
                <label className="font-medium">Thương hiệu</label>
                <Select
                  value={editForm.brandId}
                  onValueChange={(value) => setEditForm({ ...editForm, brandId: value })}
                >
                  <SelectTrigger>
                    <SelectValue>
                      {editForm.brandId
                        ? brands.find((b) => b._id === editForm.brandId)?.name
                        : selectedProduct?.brand.brandName || "Chọn thương hiệu"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand._id} value={brand._id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="font-medium">Danh mục</label>
                <Select
                  value={editForm.categoryId}
                  onValueChange={(value) => setEditForm({ ...editForm, categoryId: value })}
                >
                  <SelectTrigger>
                    <SelectValue>
                      {editForm.categoryId
                        ? categories.find((c) => c._id === editForm.categoryId)?.name
                        : selectedProduct?.category.categoryName || "Chọn danh mục"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="font-medium">Giá</label>
                <Input
                  type="number"
                  value={editForm.price}
                  onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="font-medium">Giá gốc</label>
                <Input
                  type="number"
                  value={editForm.originalprice}
                  onChange={(e) => setEditForm({ ...editForm, originalprice: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="font-medium">Tồn kho</label>
                <Input
                  type="number"
                  value={editForm.stock}
                  onChange={(e) => setEditForm({ ...editForm, stock: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="font-medium">RAM</label>
                <Input
                  value={editForm.ram}
                  onChange={(e) => setEditForm({ ...editForm, ram: e.target.value })}
                />
              </div>
              <div>
                <label className="font-medium">Bộ nhớ</label>
                <Input
                  value={editForm.storage}
                  onChange={(e) => setEditForm({ ...editForm, storage: e.target.value })}
                />
              </div>
              <div>
                <label className="font-medium">Màn hình</label>
                <Input
                  value={editForm.display}
                  onChange={(e) => setEditForm({ ...editForm, display: e.target.value })}
                />
              </div>
              <div>
                <label className="font-medium">Bộ xử lý (CPU)</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {editForm.processor.length > 0 ? (
                    editForm.processor.map((option) => (
                      <Badge key={option} variant="secondary">
                        {option}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-gray-500">Không có CPU</span>
                  )}
                </div>
              </div>
              <div>
                <label className="font-medium">Card đồ họa (GPU)</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {editForm.graphics.length > 0 ? (
                    editForm.graphics.map((option) => (
                      <Badge key={option} variant="secondary">
                        {option}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-gray-500">Không có GPU</span>
                  )}
                </div>
              </div>
              <div>
                <label className="font-medium">Màu sắc</label>
                <div className="flex flex-col gap-2 mt-1">
                  <div className="flex gap-2">
                    <Input
                      value={editColorInput}
                      onChange={(e) => setEditColorInput(e.target.value)}
                      placeholder="Nhập màu sắc mới"
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && editColorInput.trim()) {
                          handleAddArrayValue("color", editColorInput, "edit");
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddArrayValue("color", editColorInput, "edit")}
                      disabled={!editColorInput.trim()}
                    >
                      Thêm
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {editForm.color.length > 0 ? (
                      editForm.color.map((option, index) => (
                        <Badge key={option} variant="secondary" className="flex items-center gap-1">
                          {option}
                          <button
                            onClick={() => handleRemoveArrayValue("color", index, "edit")}
                            className="ml-1 text-red-600 hover:text-red-800"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-500">Không có màu sắc</span>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="font-medium text-lg">Biến thể</label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddVariant("edit")}
                    className="flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Thêm biến thể</span>
                  </Button>
                </div>
                {editForm.variants && editForm.variants.length > 0 ? (
                  <div className="max-h-64 overflow-y-auto">
                    {editForm.variants.map((variant, variantIndex) => (
                      <div key={variant._id} className="border border-green-200 p-4 rounded-lg mb-2 bg-green-50 relative">
                        <div className="flex justify-between items-center mb-2">
                          <label className="font-medium">Biến thể {variantIndex + 1}</label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveVariant(variantIndex, "edit")}
                            className="absolute top-2 right-2"
                          >
                            <X className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <label className="font-medium">SKU</label>
                            <Input
                              value={variant.sku}
                              onChange={(e) => {
                                const newVariants = [...editForm.variants];
                                newVariants[variantIndex].sku = e.target.value;
                                setEditForm({ ...editForm, variants: newVariants });
                              }}
                            />
                          </div>
                          <div>
                            <label className="font-medium">Giá</label>
                            <Input
                              type="number"
                              value={variant.price}
                              onChange={(e) => {
                                const newVariants = [...editForm.variants];
                                newVariants[variantIndex].price = Number(e.target.value);
                                setEditForm({ ...editForm, variants: newVariants });
                              }}
                            />
                          </div>
                          <div>
                            <label className="font-medium">Giá gốc</label>
                            <Input
                              type="number"
                              value={variant.originalprice}
                              onChange={(e) => {
                                const newVariants = [...editForm.variants];
                                newVariants[variantIndex].originalprice = Number(e.target.value);
                                setEditForm({ ...editForm, variants: newVariants });
                              }}
                            />
                          </div>
                          <div>
                            <label className="font-medium">Tồn kho</label>
                            <Input
                              type="number"
                              value={variant.stock}
                              onChange={(e) => {
                                const newVariants = [...editForm.variants];
                                newVariants[variantIndex].stock = Number(e.target.value);
                                setEditForm({ ...editForm, variants: newVariants });
                              }}
                            />
                          </div>
                          <div>
                            <label className="font-medium">Thuộc tính</label>
                            <div className="space-y-2 mt-2">
                              {variant.attributes.map((attr, attrIndex) => (
                                <div key={attrIndex} className="flex flex-col space-y-1">
                                  <label className="font-medium">{attr.attributeName}</label>
                                  <Select
                                    value={attr.value}
                                    onValueChange={(value) => {
                                      const newVariants = [...editForm.variants];
                                      newVariants[variantIndex].attributes[attrIndex].value = value;
                                      setEditForm({ ...editForm, variants: newVariants });
                                    }}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder={`Chọn ${attr.attributeName}`} />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {(attr.attributeName === "CPU"
                                        ? editForm.processor
                                        : attr.attributeName === "GPU"
                                        ? editForm.graphics
                                        : editForm.color
                                      ).map((option) => (
                                        <SelectItem key={option} value={option}>
                                          {option}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-500">Không có biến thể</span>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleUpdateProduct}>Lưu</Button>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Hủy
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Thêm sản phẩm mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="font-medium">Tên sản phẩm</label>
                <Input
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="font-medium">Mô tả</label>
                <Input
                  value={addForm.description}
                  onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                />
              </div>
              <div>
                <label className="font-medium">Thương hiệu</label>
                <Select
                  value={addForm.brandId}
                  onValueChange={(value) => setAddForm({ ...addForm, brandId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn thương hiệu" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand._id} value={brand._id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="font-medium">Danh mục</label>
                <Select
                  value={addForm.categoryId}
                  onValueChange={(value) => setAddForm({ ...addForm, categoryId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>
                        Không có danh mục nào
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="font-medium">Giá</label>
                <Input
                  type="number"
                  value={addForm.price}
                  onChange={(e) => setAddForm({ ...addForm, price: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="font-medium">Giá gốc</label>
                <Input
                  type="number"
                  value={addForm.originalprice}
                  onChange={(e) => setAddForm({ ...addForm, originalprice: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="font-medium">Tồn kho</label>
                <Input
                  type="number"
                  value={addForm.stock}
                  onChange={(e) => setAddForm({ ...addForm, stock: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="font-medium">Hình ảnh chính</label>
                <Input
                  value={addForm.image}
                  onChange={(e) => setAddForm({ ...addForm, image: e.target.value })}
                  placeholder="Nhập URL hình ảnh chính"
                />
              </div>
              <div>
                <label className="font-medium">Hình ảnh phụ</label>
                <div className="flex flex-col gap-2 mt-1">
                  <div className="flex gap-2">
                    <Input
                      value={imagesInput}
                      onChange={(e) => setImagesInput(e.target.value)}
                      placeholder="Nhập URL hình ảnh phụ"
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && imagesInput.trim()) {
                          handleAddArrayValue("images", imagesInput);
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddArrayValue("images", imagesInput)}
                      disabled={!imagesInput.trim()}
                    >
                      Thêm
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {addForm.images.length > 0 ? (
                      addForm.images.map((option, index) => (
                        <Badge key={option} variant="secondary" className="flex items-center gap-1">
                          {option}
                          <button
                            onClick={() => handleRemoveArrayValue("images", index)}
                            className="ml-1 text-red-600 hover:text-red-800"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-500">Không có hình ảnh phụ</span>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label className="font-medium">RAM</label>
                <Input
                  value={addForm.ram}
                  onChange={(e) => setAddForm({ ...addForm, ram: e.target.value })}
                />
              </div>
              <div>
                <label className="font-medium">Bộ nhớ</label>
                <Input
                  value={addForm.storage}
                  onChange={(e) => setAddForm({ ...addForm, storage: e.target.value })}
                />
              </div>
              <div>
                <label className="font-medium">Màn hình</label>
                <Input
                  value={addForm.display}
                  onChange={(e) => setAddForm({ ...addForm, display: e.target.value })}
                />
              </div>
              <div>
                <label className="font-medium">Bộ xử lý (CPU)</label>
                <div className="flex flex-col gap-2 mt-1">
                  <div className="flex gap-2">
                    <Input
                      value={processorInput}
                      onChange={(e) => setProcessorInput(e.target.value)}
                      placeholder="Nhập CPU mới"
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && processorInput.trim()) {
                          handleAddArrayValue("processor", processorInput);
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddArrayValue("processor", processorInput)}
                      disabled={!processorInput.trim()}
                    >
                      Thêm
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {addForm.processor.length > 0 ? (
                      addForm.processor.map((option, index) => (
                        <Badge key={option} variant="secondary" className="flex items-center gap-1">
                          {option}
                          <button
                            onClick={() => handleRemoveArrayValue("processor", index)}
                            className="ml-1 text-red-600 hover:text-red-800"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-500">Không có CPU</span>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label className="font-medium">Card đồ họa (GPU)</label>
                <div className="flex flex-col gap-2 mt-1">
                  <div className="flex gap-2">
                    <Input
                      value={graphicsInput}
                      onChange={(e) => setGraphicsInput(e.target.value)}
                      placeholder="Nhập GPU mới"
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && graphicsInput.trim()) {
                          handleAddArrayValue("graphics", graphicsInput);
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddArrayValue("graphics", graphicsInput)}
                      disabled={!graphicsInput.trim()}
                    >
                      Thêm
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {addForm.graphics.length > 0 ? (
                      addForm.graphics.map((option, index) => (
                        <Badge key={option} variant="secondary" className="flex items-center gap-1">
                          {option}
                          <button
                            onClick={() => handleRemoveArrayValue("graphics", index)}
                            className="ml-1 text-red-600 hover:text-red-800"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-500">Không có GPU</span>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label className="font-medium">Màu sắc</label>
                <div className="flex flex-col gap-2 mt-1">
                  <div className="flex gap-2">
                    <Input
                      value={colorInput}
                      onChange={(e) => setColorInput(e.target.value)}
                      placeholder="Nhập màu sắc mới"
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && colorInput.trim()) {
                          handleAddArrayValue("color", colorInput);
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddArrayValue("color", colorInput)}
                      disabled={!colorInput.trim()}
                    >
                      Thêm
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {addForm.color.length > 0 ? (
                      addForm.color.map((option, index) => (
                        <Badge key={option} variant="secondary" className="flex items-center gap-1">
                          {option}
                          <button
                            onClick={() => handleRemoveArrayValue("color", index)}
                            className="ml-1 text-red-600 hover:text-red-800"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-500">Không có màu sắc</span>
                    )}
                  </div>
                </div>
              </div>
              {addForm.variants && addForm.variants.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="font-medium text-lg">Biến thể</label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddVariant("add")}
                      className="flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Thêm biến thể</span>
                    </Button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {addForm.variants.map((variant, variantIndex) => (
                      <div key={variant._id} className="border border-green-200 p-4 rounded-lg mb-2 bg-green-50 relative">
                        <div className="flex justify-between items-center mb-2">
                          <label className="font-medium">Biến thể {variantIndex + 1}</label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveVariant(variantIndex, "add")}
                            className="absolute top-2 right-2"
                          >
                            <X className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <label className="font-medium">SKU</label>
                            <Input
                              value={variant.sku}
                              onChange={(e) => {
                                const newVariants = [...addForm.variants];
                                newVariants[variantIndex].sku = e.target.value;
                                setAddForm({ ...addForm, variants: newVariants });
                              }}
                            />
                          </div>
                          <div>
                            <label className="font-medium">Giá</label>
                            <Input
                              type="number"
                              value={variant.price}
                              onChange={(e) => {
                                const newVariants = [...addForm.variants];
                                newVariants[variantIndex].price = Number(e.target.value);
                                setAddForm({ ...addForm, variants: newVariants });
                              }}
                            />
                          </div>
                          <div>
                            <label className="font-medium">Giá gốc</label>
                            <Input
                              type="number"
                              value={variant.originalprice}
                              onChange={(e) => {
                                const newVariants = [...addForm.variants];
                                newVariants[variantIndex].originalprice = Number(e.target.value);
                                setAddForm({ ...addForm, variants: newVariants });
                              }}
                            />
                          </div>
                          <div>
                            <label className="font-medium">Tồn kho</label>
                            <Input
                              type="number"
                              value={variant.stock}
                              onChange={(e) => {
                                const newVariants = [...addForm.variants];
                                newVariants[variantIndex].stock = Number(e.target.value);
                                setAddForm({ ...addForm, variants: newVariants });
                              }}
                            />
                          </div>
                          <div>
                            <label className="font-medium">Thuộc tính</label>
                            <div className="space-y-2 mt-2">
                              {variant.attributes.map((attr, attrIndex) => (
                                <div key={attrIndex} className="flex flex-col space-y-1">
                                  <label className="font-medium">{attr.attributeName}</label>
                                  <Select
                                    value={attr.value}
                                    onValueChange={(value) => {
                                      const newVariants = [...addForm.variants];
                                      newVariants[variantIndex].attributes[attrIndex].value = value;
                                      setAddForm({ ...addForm, variants: newVariants });
                                    }}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder={`Chọn ${attr.attributeName}`} />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {(attr.attributeName === "CPU"
                                        ? addForm.processor
                                        : attr.attributeName === "GPU"
                                        ? addForm.graphics
                                        : addForm.color
                                      ).map((option) => (
                                        <SelectItem key={option} value={option}>
                                          {option}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button onClick={handleAddProduct} disabled={categories.length === 0}>
                Lưu
              </Button>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                Hủy
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminSidebar>
  );
}