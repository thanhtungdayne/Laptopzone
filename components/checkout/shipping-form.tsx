"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCheckout, type ShippingInfo } from "@/context/checkout-context";
import { useAuth } from "@/context/auth-context";

interface Location {
  id: string;
  name: string;
}

export default function ShippingForm() {
  const { state, dispatch } = useCheckout();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [errors, setErrors] = useState<Partial<ShippingInfo>>({});
  const [provinces, setProvinces] = useState<Location[]>([]);
  const [districts, setDistricts] = useState<Location[]>([]);
  const [wards, setWards] = useState<Location[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedWard, setSelectedWard] = useState<string>("");
  const [street, setStreet] = useState<string>(state.shipping.street || "");

  // Initialize user data
  useEffect(() => {
    if (isLoading || !isAuthenticated || !user) return;

    // Set default values from user data
    const shippingData: Partial<ShippingInfo> = {
      fullName: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      street: user.address?.split(",")[0]?.trim() || "",
    };

    // Update checkout context with user data
    dispatch({ type: "SET_SHIPPING", payload: shippingData });

    // If user has an address, parse it to prefill province, district, ward
    if (user.address) {
      const addressParts = user.address.split(",").map(part => part.trim());
      const streetPart = addressParts[0] || "";
      const wardName = addressParts[1] || "";
      const districtName = addressParts[2] || "";
      const provinceName = addressParts[3] || "";

      setStreet(streetPart);

      // Find province ID
      const fetchProvinceId = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/location/provinces`);
          if (!response.ok) throw new Error("Không thể tải danh sách tỉnh/thành phố");
          const data: Location[] = await response.json();
          const province = data.find(p => p.name === provinceName);
          if (province) {
            setSelectedProvince(province.id);
          }
        } catch (error) {
          console.error("Error fetching province ID:", error);
        }
      };

      fetchProvinceId();
    }
  }, [isLoading, isAuthenticated, user, dispatch]);

  // Fetch provinces on component mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/location/provinces`);
        if (!response.ok) throw new Error("Không thể tải danh sách tỉnh/thành phố");
        const data = await response.json();
        setProvinces(data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };
    fetchProvinces();
  }, []);

  // Fetch districts when province changes
  useEffect(() => {
    if (selectedProvince) {
      const fetchDistricts = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/location/districts/${selectedProvince}`);
          if (!response.ok) throw new Error("Không thể tải danh sách quận/huyện");
          const data = await response.json();
          setDistricts(data);
          setWards([]);
          setSelectedDistrict("");
          setSelectedWard("");

          // If user.address exists, prefill district
          if (user?.address) {
            const addressParts = user.address.split(",").map(part => part.trim());
            const districtName = addressParts[2] || "";
            const district = data.find((d: Location) => d.name === districtName);
            if (district) {
              setSelectedDistrict(district.id);
            }
          }
        } catch (error) {
          console.error("Error fetching districts:", error);
        }
      };
      fetchDistricts();
    } else {
      setDistricts([]);
      setWards([]);
      setSelectedDistrict("");
      setSelectedWard("");
    }
  }, [selectedProvince, user?.address]);

  // Fetch wards when district changes
  useEffect(() => {
    if (selectedDistrict) {
      const fetchWards = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/location/wards/${selectedDistrict}`);
          if (!response.ok) throw new Error("Không thể tải danh sách phường/xã");
          const data = await response.json();
          setWards(data);
          setSelectedWard("");

          // If user.address exists, prefill ward
          if (user?.address) {
            const addressParts = user.address.split(",").map(part => part.trim());
            const wardName = addressParts[1] || "";
            const ward = data.find((w: Location) => w.name === wardName);
            if (ward) {
              setSelectedWard(ward.id);
            }
          }
        } catch (error) {
          console.error("Error fetching wards:", error);
        }
      };
      fetchWards();
    } else {
      setWards([]);
      setSelectedWard("");
    }
  }, [selectedDistrict, user?.address]);

  const handleInputChange = (field: keyof ShippingInfo, value: string) => {
    dispatch({ type: "SET_SHIPPING", payload: { [field]: value } });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleStreetChange = (value: string) => {
    setStreet(value);
    handleInputChange("street", value);
  };

  // Update address whenever location selections or street change
  useEffect(() => {
    const provinceName = provinces.find(p => p.id === selectedProvince)?.name || "";
    const districtName = districts.find(d => d.id === selectedDistrict)?.name || "";
    const wardName = wards.find(w => w.id === selectedWard)?.name || "";
    
    const fullAddress = [street, wardName, districtName, provinceName]
      .filter(Boolean)
      .join(", ");
    
    dispatch({ type: "SET_SHIPPING", payload: { address: fullAddress } });
  }, [selectedProvince, selectedDistrict, selectedWard, street, provinces, districts, wards, dispatch]);

  const validateForm = (): boolean => {
    const newErrors: Partial<ShippingInfo> = {};
    const shipping = state.shipping;

    if (!shipping.fullName?.trim()) newErrors.fullName = "Họ và tên bắt buộc";
    if (!shipping.email?.trim()) newErrors.email = "Email bắt buộc";
    if (!shipping.phone?.trim()) newErrors.phone = "Số điện thoại bắt buộc";
    if (!street?.trim()) newErrors.street = "Địa chỉ cụ thể bắt buộc";
    if (!selectedProvince) newErrors.address = "Vui lòng chọn tỉnh/thành phố";
    if (!selectedDistrict) newErrors.address = "Vui lòng chọn quận/huyện";
    if (!selectedWard) newErrors.address = "Vui lòng chọn phường/xã";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      dispatch({ type: "SET_STEP", payload: 3 });
    }
  };

  const handleBack = () => {
    dispatch({ type: "SET_STEP", payload: 1 });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin vận chuyển</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">Họ và tên *</Label>
              <Input
                id="fullName"
                value={state.shipping.fullName || ""}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className={errors.fullName ? "border-red-500" : ""}
              />
              {errors.fullName && <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>}
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={state.shipping.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="phone">Số điện thoại *</Label>
            <Input
              id="phone"
              value={state.shipping.phone || ""}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="province">Tỉnh/Thành phố *</Label>
              <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                <SelectTrigger id="province" className={errors.address ? "border-red-500" : ""}>
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
              {errors.address && selectedProvince === "" && (
                <p className="text-sm text-red-500 mt-1">{errors.address}</p>
              )}
            </div>

            <div>
              <Label htmlFor="district">Quận/Huyện *</Label>
              <Select value={selectedDistrict} onValueChange={setSelectedDistrict} disabled={!selectedProvince}>
                <SelectTrigger id="district" className={errors.address ? "border-red-500" : ""}>
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
              {errors.address && selectedDistrict === "" && (
                <p className="text-sm text-red-500 mt-1">{errors.address}</p>
              )}
            </div>

            <div>
              <Label htmlFor="ward">Phường/Xã *</Label>
              <Select value={selectedWard} onValueChange={setSelectedWard} disabled={!selectedDistrict}>
                <SelectTrigger id="ward" className={errors.address ? "border-red-500" : ""}>
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
              {errors.address && selectedWard === "" && (
                <p className="text-sm text-red-500 mt-1">{errors.address}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="street">Địa chỉ cụ thể *</Label>
            <Input
              id="street"
              value={street}
              onChange={(e) => handleStreetChange(e.target.value)}
              className={errors.street ? "border-red-500" : ""}
              placeholder="Số nhà, tên đường"
            />
            {errors.street && <p className="text-sm text-red-500 mt-1">{errors.street}</p>}
          </div>

          <div>
            <Label>Địa chỉ đầy đủ</Label>
            <p className="text-sm text-gray-500">{state.shipping.address || "Vui lòng nhập đầy đủ thông tin địa chỉ"}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Quay lại giỏ hàng
        </Button>
        <Button
          onClick={handleContinue}
          disabled={Object.keys(errors).length > 0}
          className="bg-gradient-to-r from-[#923ce9] to-[#644feb] text-white hover:bg-gradient-to-r hover:from-[#7e33cc] hover:to-[#5744d3] transition disabled:opacity-50"
        >
          Tiếp tục thanh toán
        </Button>
      </div>
    </div>
  );
}