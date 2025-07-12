"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, Phone, MapPin, Calendar, Edit, Save, X, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";

// Extended user data interface for profile
interface ExtendedUserData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  bio?: string;
  joinDate?: string;
  totalOrders: number;
  totalSpent: number;
  dateOfBirth?: string;
  gender?: string;
  role: "admin" | "user";
}

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Extended user data with defaults
  const [userData, setUserData] = useState<ExtendedUserData | null>(null);
  const [editedUser, setEditedUser] = useState<ExtendedUserData | null>(null);

  // Check authentication and redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Initialize user data with defaults for missing fields
    if (user) {
      const extendedUserData: ExtendedUserData = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        avatar: user.avatar || "/placeholder.svg?height=100&width=100",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "Vietnam",
        bio: "",
        joinDate: "January 2024",
        totalOrders: user.role === "admin" ? 25 : 5,
        totalSpent: user.role === "admin" ? 45000 : 12000,
        dateOfBirth: "",
        gender: "",
        role: user.role,
      };
      setUserData(extendedUserData);
      setEditedUser(extendedUserData);
    }
  }, [isAuthenticated, user, router]);

  // Show loading state while checking authentication
  if (!isAuthenticated || !userData) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleEdit = () => {
    setEditedUser(userData);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedUser(userData);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!editedUser) return;

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setUserData(editedUser);
    setIsEditing(false);
    setIsLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    if (!editedUser) return;
    setEditedUser((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleAvatarChange = () => {
    // In a real app, this would open a file picker
    console.log("Avatar change clicked");
  };

  const currentData = isEditing ? editedUser : userData;
  if (!currentData) return null;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="w-full">
        <div className="w-[85%] max-w-none mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2 text-gray-900">Hồ sơ</h1>
              <p className="text-muted-foreground">
                Quản lý thông tin tài khoản và tùy chọn của bạn
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Profile Info */}
              <div className="lg:col-span-1">
                <Card className="border bg-white">
                  <CardContent className="p-6 text-center">
                    <div className="relative inline-block mb-4">
                      <Avatar className="h-24 w-24 mx-auto">
                        <AvatarImage
                          src={currentData.avatar || "/placeholder.svg"}
                          alt={currentData.name}
                        />
                        <AvatarFallback className="text-2xl">
                          {currentData.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <Button
                          size="icon"
                          variant="outline"
                          className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-white"
                          onClick={handleAvatarChange}
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="space-y-3 mb-4">
                        <Input
                          value={editedUser?.name || ""}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          className="text-center font-semibold"
                        />
                      </div>
                    ) : (
                      <h2 className="text-xl font-semibold mb-2 text-gray-900">
                        {currentData.name}
                      </h2>
                    )}

                    <div className="flex items-center justify-center gap-2 mb-4">
                      {currentData.role === "admin" && (
                        <Badge variant="destructive">Admin</Badge>
                      )}
                    </div>

                    <div className="space-y-2 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center justify-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>Thành viên từ {currentData.joinDate}</span>
                      </div>
                    </div>

                    {isEditing ? (
                      <div className="space-y-2">
                        <Button
                          onClick={handleSave}
                          disabled={isLoading}
                          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {isLoading ? "Đang tải..." : "Lưu thay đổi"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleCancel}
                          className="w-full"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Hủy
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={handleEdit}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Chỉnh sửa hồ sơ
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Account Details */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="border bg-white">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Thông tin cá nhân</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email" className="font-semibold">
                          Email
                        </Label>
                        {isEditing ? (
                          <Input
                            id="email"
                            type="email"
                            value={editedUser?.email || ""}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                          />
                        ) : (
                          <div className="flex items-center space-x-3 mt-2 p-3 bg-gray-50 rounded-lg">
                            <Mail className="h-5 w-5 text-gray-600" />
                            <span className="font-medium">{currentData.email}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="phone" className="font-semibold">
                          Số điện thoại
                        </Label>
                        {isEditing ? (
                          <Input
                            id="phone"
                            value={editedUser?.phone || ""}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                          />
                        ) : (
                          <div className="flex items-center space-x-3 mt-2 p-3 bg-gray-50 rounded-lg">
                            <Phone className="h-5 w-5 text-gray-600" />
                            <span className="font-medium">
                              {currentData.phone || "Chưa cung cấp"}
                            </span>
                          </div>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="dateOfBirth" className="font-semibold">
                          Ngày sinh
                        </Label>
                        {isEditing ? (
                          <Input
                            id="dateOfBirth"
                            type="date"
                            value={editedUser?.dateOfBirth || ""}
                            onChange={(e) =>
                              handleInputChange("dateOfBirth", e.target.value)
                            }
                          />
                        ) : (
                          <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium">
                              {currentData.dateOfBirth
                                ? new Date(currentData.dateOfBirth).toLocaleDateString()
                                : "Chưa cung cấp"}
                            </span>
                          </div>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="gender" className="font-semibold">
                          Giới tính
                        </Label>
                        {isEditing ? (
                          <Select
                            value={editedUser?.gender || ""}
                            onValueChange={(value) => handleInputChange("gender", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn giới tính" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Nam</SelectItem>
                              <SelectItem value="female">Nữ</SelectItem>
                              <SelectItem value="other">Khác</SelectItem>
                              <SelectItem value="prefer-not-to-say">
                                Không muốn tiết lộ
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium capitalize">
                              {currentData.gender || "Chưa xác định"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="bio" className="font-semibold">
                        Tiểu sử
                      </Label>
                      {isEditing ? (
                        <Textarea
                          id="bio"
                          value={editedUser?.bio || ""}
                          onChange={(e) => handleInputChange("bio", e.target.value)}
                          rows={3}
                          placeholder="Hãy chia sẻ về bản thân bạn..."
                        />
                      ) : (
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                          <p className="text-muted-foreground">
                            {currentData.bio || "Chưa có thông tin"}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border bg-white">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Thông tin địa chỉ</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="address" className="font-semibold">
                        Địa chỉ
                      </Label>
                      {isEditing ? (
                        <Input
                          id="address"
                          value={editedUser?.address || ""}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center space-x-3 mt-2 p-3 bg-gray-50 rounded-lg">
                          <MapPin className="h-5 w-5 text-gray-600" />
                          <span className="font-medium">
                            {currentData.address || "Chưa có địa chỉ"}
                          </span>
                        </div>
                      )}
                    </div>

                    {isEditing && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="city" className="font-semibold">
                            Thành phố
                          </Label>
                          <Input
                            id="city"
                            value={editedUser?.city || ""}
                            onChange={(e) => handleInputChange("city", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="state" className="font-semibold">
                            Tỉnh/Bang
                          </Label>
                          <Input
                            id="state"
                            value={editedUser?.state || ""}
                            onChange={(e) => handleInputChange("state", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="zipCode" className="font-semibold">
                            Mã bưu điện
                          </Label>
                          <Input
                            id="zipCode"
                            value={editedUser?.zipCode || ""}
                            onChange={(e) => handleInputChange("zipCode", e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    {isEditing && (
                      <div>
                        <Label htmlFor="country" className="font-semibold">
                          Quốc gia
                        </Label>
                        <Select
                          value={editedUser?.country || ""}
                          onValueChange={(value) => handleInputChange("country", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Vietnam">Việt Nam</SelectItem>
                            <SelectItem value="United States">Hoa Kỳ</SelectItem>
                            <SelectItem value="Canada">Canada</SelectItem>
                            <SelectItem value="United Kingdom">Anh</SelectItem>
                            <SelectItem value="Australia">Úc</SelectItem>
                            <SelectItem value="Other">Khác</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border bg-white">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Thống kê tài khoản</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-gray-900">
                          {currentData.totalOrders}
                        </p>
                        <p className="text-sm text-muted-foreground">Tổng đơn hàng</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-gray-900">
                          {formatPrice(currentData.totalSpent)}
                        </p>
                        <p className="text-sm text-muted-foreground">Tổng chi tiêu</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
