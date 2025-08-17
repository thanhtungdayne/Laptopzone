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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useAuth } from "@/context/auth-context";

interface UserData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  street?: string;
  dob?: string;
  role: "admin" | "user";
  status: boolean;
  avatar?: string;
}

interface Location {
  id: string;
  name: string;
}

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, updateUser } = useAuth();
  const router = useRouter();
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [editedUser, setEditedUser] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [provinces, setProvinces] = useState<Location[]>([]);
  const [districts, setDistricts] = useState<Location[]>([]);
  const [wards, setWards] = useState<Location[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedWard, setSelectedWard] = useState<string>("");

  // Fetch provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/location/provinces`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Không thể tải danh sách tỉnh/thành phố");
        }
        const data = await response.json();
        setProvinces(data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
        setError(error instanceof Error ? error.message : "Không thể tải danh sách tỉnh/thành phố");
      }
    };
    fetchProvinces();
  }, []);

  // Fetch districts
  useEffect(() => {
    if (selectedProvince) {
      const fetchDistricts = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/location/districts/${selectedProvince}`);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Không thể tải danh sách quận/huyện");
          }
          const data = await response.json();
          setDistricts(data);
          setWards([]);
          setSelectedDistrict("");
          setSelectedWard("");
        } catch (error) {
          console.error(`Error fetching districts for province ${selectedProvince}:`, error);
          setError(error instanceof Error ? error.message : "Không thể tải danh sách quận/huyện");
        }
      };
      fetchDistricts();
    } else {
      setDistricts([]);
      setWards([]);
      setSelectedDistrict("");
      setSelectedWard("");
    }
  }, [selectedProvince]);

  // Fetch wards
  useEffect(() => {
    if (selectedDistrict) {
      const fetchWards = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/location/wards/${selectedDistrict}`);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Không thể tải danh sách phường/xã");
          }
          const data = await response.json();
          setWards(data);
          setSelectedWard("");
        } catch (error) {
          console.error(`Error fetching wards for district ${selectedDistrict}:`, error);
          setError(error instanceof Error ? error.message : "Không thể tải danh sách phường/xã");
        }
      };
      fetchWards();
    } else {
      setWards([]);
      setSelectedWard("");
    }
  }, [selectedDistrict]);

  // Initialize user data
  useEffect(() => {
    if (isLoading) return; // Chờ xác thực từ AuthContext

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (user) {
      console.log("User from auth-context:", user);
      const userData: UserData = {
        id: user.id,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        street: user.address?.split(",")[0]?.trim() || "",
        dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
        role: user.role === 1 ? "admin" : "user",
        status: user.status ?? true,
        avatar: user.avatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn...",
      };
      setUserData(userData);
      setEditedUser(userData);
    }
  }, [isAuthenticated, user, router, isLoading]);

  // Update address
  useEffect(() => {
    if (!editedUser) return;

    const provinceName = provinces.find(p => p.id === selectedProvince)?.name || "";
    const districtName = districts.find(d => d.id === selectedDistrict)?.name || "";
    const wardName = wards.find(w => w.id === selectedWard)?.name || "";
    const street = editedUser.street || "";

    const fullAddress = [street, wardName, districtName, provinceName]
      .filter(Boolean)
      .join(", ");

    setEditedUser((prev) => (prev ? { ...prev, address: fullAddress } : null));
  }, [selectedProvince, selectedDistrict, selectedWard, editedUser?.street, provinces, districts, wards]);

  // Show loading state
  if (isLoading || !userData) {
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

  const handleEditPersonal = () => {
    setEditedUser(userData);
    setIsEditingPersonal(true);
    setError(null);
  };

  const handleEditAddress = () => {
    setEditedUser(userData);
    setIsEditingAddress(true);
    setError(null);
  };

  const handleCancelPersonal = () => {
    setEditedUser(userData);
    setIsEditingPersonal(false);
    setError(null);
  };

  const handleCancelAddress = () => {
    setEditedUser(userData);
    setIsEditingAddress(false);
    setError(null);
    setSelectedProvince("");
    setSelectedDistrict("");
    setSelectedWard("");
  };

  const handleSave = async () => {
    if (!editedUser) return;

    if (!editedUser.name?.trim()) {
      setError("Họ và tên là bắt buộc");
      return;
    }
    if (isEditingAddress && (!selectedProvince || !selectedDistrict || !selectedWard)) {
      setError("Vui lòng chọn đầy đủ tỉnh, quận, phường");
      return;
    }
    if (!editedUser.id) {
      setError("Không thể xác định người dùng. Vui lòng đăng nhập lại.");
      return;
    }

    setIsLoadingUser(true);
    setError(null);

    try {
      const { success, message } = await updateUser({
        name: editedUser.name,
        phone: editedUser.phone,
        address: editedUser.address,
        dob: editedUser.dob || undefined,
        avatar: editedUser.avatar,
      });

      if (!success) {
        throw new Error(message);
      }

      setUserData({
        ...editedUser,
        role: user?.role === 1 ? "admin" : "user",
        street: editedUser.street,
      });
      setIsEditingPersonal(false);
      setIsEditingAddress(false);
      setSelectedProvince("");
      setSelectedDistrict("");
      setSelectedWard("");
    } catch (err) {
      console.error("Error in handleSave:", err);
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
    } finally {
      setIsLoadingUser(false);
    }
  };

  const handleInputChange = (field: keyof UserData, value: string) => {
    if (!editedUser || field === "email") return;
    setEditedUser((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleAvatarChange = () => {
    console.log("Avatar change clicked");
  };

  const currentData = (isEditingPersonal || isEditingAddress) ? editedUser : userData;
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

            {error && (
              <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
                {error}
              </div>
            )}

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <Card className="border bg-white">
                  <CardContent className="p-6 text-center">
                    <div className="relative inline-block mb-4">
                      <Avatar className="h-24 w-24 mx-auto">
                        <AvatarImage src={currentData.avatar} alt={currentData.name} />
                        <AvatarFallback className="text-2xl">
                          {currentData.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        size="icon"
                        variant="outline"
                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-white"
                        onClick={handleAvatarChange}
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                    <h2 className="text-xl font-semibold mb-2 text-gray-900">
                      {currentData.name}
                    </h2>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      {currentData.role === "admin" && (
                        <Badge variant="destructive">Admin</Badge>
                      )}
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center justify-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {currentData.dob
                            ? new Date(currentData.dob).toLocaleDateString("vi-VN")
                            : "Chưa cung cấp ngày sinh"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <Card className="border bg-white">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-gray-900">Thông tin cá nhân</CardTitle>
                    {!isEditingPersonal ? (
                      <Button
                        onClick={handleEditPersonal}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Chỉnh sửa
                      </Button>
                    ) : (
                      <div className="space-x-2">
                        <Button
                          onClick={handleSave}
                          disabled={isLoadingUser}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {isLoadingUser ? "Đang tải..." : "Lưu"}
                        </Button>
                        <Button variant="outline" onClick={handleCancelPersonal}>
                          <X className="h-4 w-4 mr-2" />
                          Hủy
                        </Button>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email" className="font-semibold">
                          Email
                        </Label>
                        <div className="flex items-center space-x-3 mt-2 p-3 bg-gray-50 rounded-lg">
                          <Mail className="h-5 w-5 text-gray-600" />
                          <span className="font-medium">{currentData.email}</span>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="phone" className="font-semibold">
                          Số điện thoại
                        </Label>
                        {isEditingPersonal ? (
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
                        <Label htmlFor="dob" className="font-semibold">
                          Ngày sinh
                        </Label>
                        {isEditingPersonal ? (
                          <Input
                            id="dob"
                            type="date"
                            value={editedUser?.dob || ""}
                            onChange={(e) => handleInputChange("dob", e.target.value)}
                          />
                        ) : (
                          <div className="flex items-center space-x-3 mt-2 p-3 bg-gray-50 rounded-lg">
                            <Calendar className="h-5 w-5 text-gray-600" />
                            <span className="font-medium">
                              {currentData.dob
                                ? new Date(currentData.dob).toLocaleDateString("vi-VN")
                                : "Chưa cung cấp"}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="name" className="font-semibold">
                          Họ và tên
                        </Label>
                        {isEditingPersonal ? (
                          <Input
                            id="name"
                            value={editedUser?.name || ""}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                          />
                        ) : (
                          <div className="flex items-center space-x-3 mt-2 p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium">{currentData.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border bg-white">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-gray-900">Thông tin địa chỉ</CardTitle>
                    {!isEditingAddress ? (
                      <Button
                        onClick={handleEditAddress}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Chỉnh sửa
                      </Button>
                    ) : (
                      <div className="space-x-2">
                        <Button
                          onClick={handleSave}
                          disabled={isLoadingUser}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {isLoadingUser ? "Đang tải..." : "Lưu"}
                        </Button>
                        <Button variant="outline" onClick={handleCancelAddress}>
                          <X className="h-4 w-4 mr-2" />
                          Hủy
                        </Button>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isEditingAddress ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="street" className="font-semibold">
                            Địa chỉ cụ thể *
                          </Label>
                          <Input
                            id="street"
                            value={editedUser?.street || ""}
                            onChange={(e) => handleInputChange("street", e.target.value)}
                            placeholder="Số nhà, tên đường"
                          />
                        </div>
                        <div>
                          <Label htmlFor="province" className="font-semibold">
                            Tỉnh/Thành phố *
                          </Label>
                          <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                            <SelectTrigger id="province">
                              <SelectValue placeholder="Chọn tỉnh/thành phố" />
                            </SelectTrigger>
                            <SelectContent>
                              {provinces.map((province) => (
                                <SelectItem key={province.id} value={province.id}>
                                  {province.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="district" className="font-semibold">
                            Quận/Huyện *
                          </Label>
                          <Select
                            value={selectedDistrict}
                            onValueChange={setSelectedDistrict}
                            disabled={!selectedProvince}
                          >
                            <SelectTrigger id="district">
                              <SelectValue placeholder="Chọn quận/huyện" />
                            </SelectTrigger>
                            <SelectContent>
                              {districts.map((district) => (
                                <SelectItem key={district.id} value={district.id}>
                                  {district.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="ward" className="font-semibold">
                            Phường/Xã *
                          </Label>
                          <Select
                            value={selectedWard}
                            onValueChange={setSelectedWard}
                            disabled={!selectedDistrict}
                          >
                            <SelectTrigger id="ward">
                              <SelectValue placeholder="Chọn phường/xã" />
                            </SelectTrigger>
                            <SelectContent>
                              {wards.map((ward) => (
                                <SelectItem key={ward.id} value={ward.id}>
                                  {ward.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Label htmlFor="address" className="font-semibold">
                          Địa chỉ
                        </Label>
                        <div className="flex items-center space-x-3 mt-2 p-3 bg-gray-50 rounded-lg">
                          <MapPin className="h-5 w-5 text-gray-600" />
                          <span className="font-medium">
                            {currentData.address || "Chưa có địa chỉ"}
                          </span>
                        </div>
                      </div>
                    )}
                    {isEditingAddress && (
                      <div>
                        <Label className="font-semibold">Địa chỉ đầy đủ</Label>
                        <p className="text-sm text-gray-500 mt-1">
                          {currentData.address || "Vui lòng nhập đầy đủ thông tin địa chỉ"}
                        </p>
                      </div>
                    )}
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