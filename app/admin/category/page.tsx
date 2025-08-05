"use client";

import { useState, useEffect } from "react";
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

// Interface cho dữ liệu danh mục
interface Category {
  _id: string;
  name: string;
  description?: string;
  productCount?: number;
  isHidden?: boolean;
  __v?: number;
}

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<{ name: string; description: string }>({
    name: "",
    description: "",
  });
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  // Gọi API để lấy dữ liệu danh mục và số sản phẩm
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Gửi yêu cầu lấy danh mục: http://localhost:5000/category/getcate");
        const categoriesResponse = await fetch("http://localhost:5000/category/getcate", {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!categoriesResponse.ok) {
          const errorData = await categoriesResponse.json().catch(() => ({}));
          console.error("Lỗi phản hồi danh mục:", {
            status: categoriesResponse.status,
            statusText: categoriesResponse.statusText,
            body: errorData,
          });
          throw new Error(`Không thể lấy dữ liệu danh mục: ${errorData.message || categoriesResponse.statusText || "Lỗi không xác định"}`);
        }
        const categoriesData = await categoriesResponse.json();
        console.log("Dữ liệu danh mục:", categoriesData);
        const categoriesArray = Array.isArray(categoriesData.result) ? categoriesData.result : [];
        console.log("Danh sách danh mục:", categoriesArray);
        // Kiểm tra _id
        const invalidCategories = categoriesArray.filter(cat => !cat._id);
        if (invalidCategories.length > 0) {
          console.warn("Danh mục có _id không hợp lệ:", invalidCategories);
        }

        const categoriesWithProductCount = await Promise.all(
          categoriesArray.map(async (category: Category) => {
            try {
              console.log(`Gửi yêu cầu lấy sản phẩm cho danh mục ${category._id}: http://localhost:5000/product/category/${category._id}`);
              const productsResponse = await fetch(`http://localhost:5000/product/category/${category._id}`, {
                headers: {
                  "Content-Type": "application/json",
                },
              });
              if (!productsResponse.ok) {
                const errorData = await productsResponse.json().catch(() => ({}));
                console.warn(`Lỗi phản hồi sản phẩm cho danh mục ${category.name}:`, {
                  status: productsResponse.status,
                  statusText: productsResponse.statusText,
                  body: errorData,
                });
                return { ...category, productCount: 0 };
              }
              const productsData = await productsResponse.json();
              console.log(`Dữ liệu sản phẩm cho danh mục ${category._id}:`, productsData);
              const productsArray = Array.isArray(productsData.result) ? productsData.result : [];
              console.log(`Số sản phẩm cho danh mục ${category.name}: ${productsArray.length}`);
              return { ...category, productCount: productsArray.length };
            } catch (err: any) {
              console.warn(`Lỗi khi lấy sản phẩm cho danh mục ${category._id}:`, err.message);
              return { ...category, productCount: 0 };
            }
          })
        );

        setCategories(categoriesWithProductCount);
        setLoading(false);
      } catch (err: any) {
        console.error("Lỗi tổng:", {
          message: err.message,
          stack: err.stack,
        });
        setError(err.message || "Đã xảy ra lỗi khi tải danh mục");
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Hàm xử lý thêm hoặc chỉnh sửa danh mục
  const handleSaveCategory = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Lỗi",
        description: "Tên danh mục không được để trống",
        variant: "destructive",
      });
      return;
    }

    try {
      const url = editingCategoryId
        ? `http://localhost:5000/category/updatecate/${editingCategoryId}`
        : "http://localhost:5000/category/addcate";
      const method = editingCategoryId ? "PUT" : "POST";

      console.log(`Gửi yêu cầu ${method} danh mục:`, { url, data: formData });
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`Lỗi ${method} danh mục:`, {
          status: response.status,
          statusText: response.statusText,
          body: errorData,
        });
        let errorMessage = `${editingCategoryId ? "Cập nhật" : "Thêm"} danh mục thất bại: ${errorData.message || response.statusText || "Lỗi không xác định"}`;
        if (response.status === 404) {
          errorMessage = editingCategoryId 
            ? "Danh mục không tồn tại hoặc endpoint cập nhật không đúng"
            : "Endpoint thêm danh mục không đúng";
        }
        throw new Error(errorMessage);
      }

      const updatedCategory = await response.json();
      console.log(`Danh mục ${editingCategoryId ? "cập nhật" : "thêm"}:`, updatedCategory);

   

      setCategories((prevCategories) => {
        if (editingCategoryId) {
          return prevCategories.map((cat) =>
            cat._id === editingCategoryId ? { ...cat, ...formData } : cat
          );
        } else {
          return [...prevCategories, { ...formData, _id: updatedCategory._id, productCount: 0, isHidden: false }];
        }
      });

      toast({
        title: "Thành công",
        description: editingCategoryId ? "Cập nhật danh mục thành công" : "Thêm danh mục thành công",
      });

      setIsDialogOpen(false);
      setFormData({ name: "", description: "" });
      setEditingCategoryId(null);
    } catch (error: any) {
      console.error(`Lỗi khi ${editingCategoryId ? "cập nhật" : "thêm"} danh mục:`, error.message);
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Hàm xử lý mở form chỉnh sửa
  const handleEditCategory = (category: Category) => {
    console.log("Chỉnh sửa danh mục:", category);
    setFormData({
      name: category.name,
      description: category.description || "",
    });
    setEditingCategoryId(category._id);
    setIsDialogOpen(true);
  };

  // Hàm xử lý ẩn/hiện danh mục
  const handleToggleHidden = async (categoryId: string, isHidden: boolean) => {
    try {
      console.log(`Gửi yêu cầu cập nhật trạng thái ẩn/hiện cho danh mục ${categoryId}:`, { isHidden: !isHidden });
      const response = await fetch(`http://localhost:5000/category/updatestatus/${categoryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isHidden: !isHidden }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Lỗi cập nhật trạng thái ẩn/hiện:", {
          status: response.status,
          statusText: response.statusText,
          body: errorData,
        });
        throw new Error(`Cập nhật trạng thái thất bại: ${errorData.message || response.statusText || "Lỗi không xác định"}`);
      }

      setCategories((prevCategories) =>
        prevCategories.map((cat) =>
          cat._id === categoryId ? { ...cat, isHidden: !isHidden } : cat
        )
      );

      toast({
        title: "Thành công",
        description: `Danh mục đã được ${isHidden ? "hiện" : "ẩn"}`,
      });
    } catch (error: any) {
      console.error("Lỗi cập nhật trạng thái ẩn/hiện:", error.message);
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
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
          <Button
            className="ml-4"
            onClick={() => {
              setLoading(true);
              setError(null);
              const fetchCategories = async () => {
                try {
                  setLoading(true);
                  console.log("Thử lại yêu cầu lấy danh mục: http://localhost:5000/category/getcate");
                  const categoriesResponse = await fetch("http://localhost:5000/category/getcate", {
                    headers: {
                      "Content-Type": "application/json",
                    },
                  });
                  if (!categoriesResponse.ok) {
                    const errorData = await categoriesResponse.json().catch(() => ({}));
                    console.error("Lỗi phản hồi danh mục:", {
                      status: categoriesResponse.status,
                      statusText: categoriesResponse.statusText,
                      body: errorData,
                    });
                    throw new Error(`Không thể lấy dữ liệu danh mục: ${errorData.message || categoriesResponse.statusText || "Lỗi không xác định"}`);
                  }
                  const categoriesData = await categoriesResponse.json();
                  console.log("Dữ liệu danh mục:", categoriesData);
                  const categoriesArray = Array.isArray(categoriesData.result) ? categoriesData.result : [];
                  const invalidCategories = categoriesArray.filter(cat => !cat._id);
                  if (invalidCategories.length > 0) {
                    console.warn("Danh mục có _id không hợp lệ:", invalidCategories);
                  }

                  const categoriesWithProductCount = await Promise.all(
                    categoriesArray.map(async (category: Category) => {
                      try {
                        console.log(`Gửi yêu cầu lấy sản phẩm cho danh mục ${category._id}: http://localhost:5000/product/category/${category._id}`);
                        const productsResponse = await fetch(`http://localhost:5000/product/category/${category._id}`, {
                          headers: {
                            "Content-Type": "application/json",
                          },
                        });
                        if (!productsResponse.ok) {
                          const errorData = await productsResponse.json().catch(() => ({}));
                          console.warn(`Lỗi phản hồi sản phẩm cho danh mục ${category.name}:`, {
                            status: productsResponse.status,
                            statusText: productsResponse.statusText,
                            body: errorData,
                          });
                          return { ...category, productCount: 0 };
                        }
                        const productsData = await productsResponse.json();
                        console.log(`Dữ liệu sản phẩm cho danh mục ${category._id}:`, productsData);
                        const productsArray = Array.isArray(productsData.result) ? productsData.result : [];
                        console.log(`Số sản phẩm cho danh mục ${category.name}: ${productsArray.length}`);
                        return { ...category, productCount: productsArray.length };
                      } catch (err: any) {
                        console.warn(`Lỗi khi lấy sản phẩm cho danh mục ${category._id}:`, err.message);
                        return { ...category, productCount: 0 };
                      }
                    })
                  );

                  setCategories(categoriesWithProductCount);
                  setLoading(false);
                } catch (err: any) {
                  console.error("Lỗi tổng:", {
                    message: err.message,
                    stack: err.stack,
                  });
                  setError(err.message || "Đã xảy ra lỗi khi tải danh mục");
                  setLoading(false);
                }
              };
              fetchCategories();
            }}
          >
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
            <h1 className="text-3xl font-bold text-gray-900">Quản lý danh mục</h1>
            <p className="text-gray-600 mt-2">Theo dõi và quản lý tất cả danh mục sản phẩm</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingCategoryId(null)}>Thêm danh mục</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingCategoryId ? "Chỉnh sửa danh mục" : "Thêm danh mục"}</DialogTitle>
                <DialogDescription>
                  Nhập thông tin danh mục. Nhấn Lưu để hoàn tất.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Tên danh mục
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="col-span-3"
                    placeholder="Nhập tên danh mục"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Mô tả
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="col-span-3"
                    placeholder="Nhập mô tả danh mục"
                  />
                </div>
              </div>
              <Button onClick={handleSaveCategory}>Lưu</Button>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm danh mục..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Categories Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách danh mục</CardTitle>
            <CardDescription>Quản lý chi tiết từng danh mục</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên danh mục</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Số sản phẩm</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category, index) => (
                  <TableRow key={category._id || index}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>{category.description || "N/A"}</TableCell>
                    <TableCell>{category.productCount ?? 0}</TableCell>
                    <TableCell>
                      {category.isHidden ? (
                        <span className="text-red-600">Ẩn</span>
                      ) : (
                        <span className="text-green-600">Hiện</span>
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
                          <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleHidden(category._id, category.isHidden || false)}
                          >
                            {category.isHidden ? (
                              <>
                                <Eye className="mr-2 h-4 w-4" />
                                Hiện
                              </>
                            ) : (
                              <>
                                <EyeOff className="mr-2 h-4 w-4" />
                                Ẩn
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