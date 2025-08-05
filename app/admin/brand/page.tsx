"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, MoreHorizontal, Eye, EyeOff, Edit } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import AdminSidebar from "@/components/admin/admin-sidebar";

// Interface cho dữ liệu thương hiệu
interface Brand {
  _id: string;
  name: string;
  description?: string;
  productCount?: number;
  status?: boolean; // Thay isHidden thành status
}

// Interface cho phản hồi API
interface ApiResponse<T> {
  success?: boolean;
  result?: T;
  message?: string;
}

// Hàm gọi API chung
const apiRequest = async <T>(
  url: string,
  method: string = "GET",
  body?: any,
): Promise<T> => {
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error(`Lỗi ${method} ${url}:`, {
      status: response.status,
      statusText: response.statusText,
      body: errorData,
    });
    let errorMessage = errorData.message || response.statusText || "Lỗi không xác định";
    if (response.status === 404) {
      errorMessage = `Endpoint không đúng hoặc tài nguyên không tồn tại`;
    }
    throw new Error(errorMessage);
  }

  const data: ApiResponse<T> = await response.json();
  console.log(`API Response from ${url}:`, JSON.stringify(data, null, 2));
  return data.result || data;
};

export default function BrandsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<{ name: string; description: string }>({
    name: "",
    description: "",
  });
  const [editingBrandId, setEditingBrandId] = useState<string | null>(null);

  // Hàm lấy danh sách thương hiệu và số sản phẩm
  const fetchBrands = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Gửi yêu cầu lấy thương hiệu: http://localhost:5000/brand/getbrand");

      // Lấy danh sách thương hiệu
      const brandsData = await apiRequest<Brand[]>(
        "http://localhost:5000/brand/getbrand",
      );
      const brandsArray = Array.isArray(brandsData) ? brandsData : [];
      console.log("Danh sách thương hiệu:", brandsArray);

      // Kiểm tra _id không hợp lệ
      const invalidBrands = brandsArray.filter((brand) => !brand._id);
      if (invalidBrands.length > 0) {
        console.warn("Thương hiệu có _id không hợp lệ:", invalidBrands);
      }

      // Lấy số sản phẩm cho từng thương hiệu
      const brandsWithProductCount = await Promise.all(
        brandsArray.map(async (brand) => {
          try {
            console.log(`Gửi yêu cầu lấy sản phẩm cho thương hiệu ${brand._id}: http://localhost:5000/product/brand/${brand._id}`);
            const productsData = await apiRequest<any[]>(
              `http://localhost:5000/product/brand/${brand._id}`,
            );
            const productsArray = Array.isArray(productsData) ? productsData : [];
            console.log(`Số sản phẩm cho thương hiệu ${brand.name}: ${productsArray.length}`);
            return { ...brand, productCount: productsArray.length };
          } catch {
            console.warn(`Lỗi khi lấy sản phẩm cho thương hiệu ${brand._id}`);
            return { ...brand, productCount: 0 };
          }
        }),
      );

      console.log("Thương hiệu đã tải:", brandsWithProductCount);
      setBrands(brandsWithProductCount);
    } catch (err: any) {
      console.error("Lỗi tổng:", {
        message: err.message,
        stack: err.stack,
      });
      setError(err.message || "Đã xảy ra lỗi khi tải thương hiệu");
    } finally {
      setLoading(false);
    }
  }, []);

  // Gọi lấy thương hiệu khi component mount
  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  // Hàm xử lý thêm hoặc chỉnh sửa thương hiệu
  const handleSaveBrand = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Lỗi",
        description: "Tên thương hiệu không được để trống",
        variant: "destructive",
      });
      return;
    }

    try {
      const url = editingBrandId
        ? `http://localhost:5000/brand/updatebrand/${editingBrandId}`
        : "http://localhost:5000/brand/addbrand";
      const method = editingBrandId ? "PUT" : "POST";

      console.log(`Gửi yêu cầu ${method} thương hiệu:`, { url, data: formData });
      const updatedBrand = await apiRequest<Brand>(url, method, formData);

    //  
      // Cập nhật state trực tiếp
      setBrands((prevBrands) => {
        if (editingBrandId) {
          return prevBrands.map((brand) =>
            brand._id === editingBrandId ? { ...brand, ...formData } : brand,
          );
        }
        return [
          ...prevBrands,
          {
            ...formData,
            _id: updatedBrand._id,
            productCount: 0,
            status: true, // Thương hiệu mới mặc định hiện
          },
        ];
      });

      toast({
        title: "Thành công",
        description: editingBrandId
          ? "Cập nhật thương hiệu thành công"
          : "Thêm thương hiệu thành công",
      });

      setIsDialogOpen(false);
      setFormData({ name: "", description: "" });
      setEditingBrandId(null);
    } catch (error: any) {
      console.error(`Lỗi khi ${editingBrandId ? "cập nhật" : "thêm"} thương hiệu:`, error.message);
      toast({
        title: "Lỗi",
        description:
          error.message || `Không thể ${editingBrandId ? "cập nhật" : "thêm"} thương hiệu`,
        variant: "destructive",
      });
    }
  };

  // Hàm xử lý mở form chỉnh sửa
  const handleEditBrand = (brand: Brand) => {
    console.log("Chỉnh sửa thương hiệu:", brand);
    setFormData({
      name: brand.name,
      description: brand.description || "",
    });
    setEditingBrandId(brand._id);
    setIsDialogOpen(true);
  };

  // Hàm xử lý ẩn/hiện thương hiệu
  const handleToggleStatus = async (brandId: string, status: boolean) => {
    try {
      console.log(`Gửi yêu cầu cập nhật trạng thái cho thương hiệu ${brandId}:`, { status: !status });
      const response = await apiRequest(
        `http://localhost:5000/brand/toggle-status/${brandId}`,
        "PUT",
        { status: !status },
      );

      // Cập nhật state trực tiếp
      setBrands((prevBrands) =>
        prevBrands.map((brand) =>
          brand._id === brandId ? { ...brand, status: !status } : brand,
        ),
      );

      toast({
        title: "Thành công",
        description: `Thương hiệu đã được ${status ? "ẩn" : "hiện"}`,
      });
    } catch (error: any) {
      console.error("Lỗi cập nhật trạng thái:", error.message);
      toast({
        title: "Lỗi",
        description: error.message || "Cập nhật trạng thái thất bại",
        variant: "destructive",
      });
    }
  };

  // Lọc thương hiệu theo tìm kiếm
  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <AdminSidebar>
        <div className="p-6">Đang tải dữ liệu...</div>
      </AdminSidebar>
    );
  }

  if (error) {
    return (
      <AdminSidebar>
        <div className="p-6 text-red-500">
          Lỗi: {error}
          <Button className="ml-4" onClick={fetchBrands}>
            Thử lại
          </Button>
        </div>
      </AdminSidebar>
    );
  }

  return (
    <AdminSidebar>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý thương hiệu</h1>
            <p className="text-gray-600 mt-2">
              Theo dõi và quản lý tất cả thương hiệu sản phẩm
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingBrandId(null)}>Thêm thương hiệu</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingBrandId ? "Chỉnh sửa thương hiệu" : "Thêm thương hiệu"}
                </DialogTitle>
                <DialogDescription>
                  Nhập thông tin thương hiệu. Nhấn Lưu để hoàn tất.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Tên thương hiệu
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="col-span-3"
                    placeholder="Nhập tên thương hiệu"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Mô tả
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="col-span-3"
                    placeholder="Nhập mô tả thương hiệu"
                  />
                </div>
              </div>
              <Button onClick={handleSaveBrand}>Lưu</Button>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm thương hiệu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Brands Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách thương hiệu</CardTitle>
            <CardDescription>Quản lý chi tiết từng thương hiệu</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên thương hiệu</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Số sản phẩm</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBrands.map((brand, index) => (
                  <TableRow key={brand._id || index}>
                    <TableCell className="font-medium">{brand.name}</TableCell>
                    <TableCell>{brand.description || "N/A"}</TableCell>
                    <TableCell>{brand.productCount ?? 0}</TableCell>
                    <TableCell>
                      {brand.status ? (
                        <span className="text-green-600">Hiện</span>
                      ) : (
                        <span className="text-red-600">Ẩn</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditBrand(brand)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleToggleStatus(brand._id, brand.status || false)
                            }
                          >
                            {brand.status ? (
                              <>
                                <EyeOff className="mr-2 h-4 w-4" />
                                Ẩn
                              </>
                            ) : (
                              <>
                                <Eye className="mr-2 h-4 w-4" />
                                Hiện
                              </>
                            )}
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
      </div>
    </AdminSidebar>
  );
}