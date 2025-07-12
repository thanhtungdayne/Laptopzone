"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Store, Bell, Shield, Mail, Upload, Save } from "lucide-react";
import AdminSidebar from "@/components/admin/admin-sidebar";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    storeName: "LaptopStore",
    storeDescription: "Cửa hàng laptop hàng đầu Việt Nam",
    storeEmail: "contact@laptopstore.com",
    storePhone: "1900 1234",
    storeAddress: "123 Đường ABC, Quận 1, TP.HCM",
    currency: "VND",
    timezone: "Asia/Ho_Chi_Minh",
    emailNotifications: true,
    orderNotifications: true,
    inventoryAlerts: true,
    promotionalEmails: false,
    smsNotifications: false,
    autoBackup: true,
    maintenanceMode: false,
  });

  const handleSave = () => {
    console.log("Saving settings:", settings);
  };

  return (
    <AdminSidebar>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cài đặt hệ thống</h1>
            <p className="text-gray-600 mt-2">Quản lý cấu hình và tùy chỉnh hệ thống</p>
          </div>
          <Button onClick={handleSave} className="flex items-center space-x-2">
            <Save className="h-4 w-4" />
            <span>Lưu thay đổi</span>
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">Chung</TabsTrigger>
            <TabsTrigger value="notifications">Thông báo</TabsTrigger>
            <TabsTrigger value="security">Bảo mật</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="system">Hệ thống</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin cửa hàng</CardTitle>
                  <CardDescription>
                    Cấu hình thông tin cơ bản của cửa hàng
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="storeName">Tên cửa hàng</Label>
                    <Input
                      id="storeName"
                      value={settings.storeName}
                      onChange={(e) =>
                        setSettings({ ...settings, storeName: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="storeDescription">Mô tả</Label>
                    <Textarea
                      id="storeDescription"
                      value={settings.storeDescription}
                      onChange={(e) =>
                        setSettings({ ...settings, storeDescription: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="storeEmail">Email liên hệ</Label>
                    <Input
                      id="storeEmail"
                      type="email"
                      value={settings.storeEmail}
                      onChange={(e) =>
                        setSettings({ ...settings, storeEmail: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="storePhone">Số điện thoại</Label>
                    <Input
                      id="storePhone"
                      value={settings.storePhone}
                      onChange={(e) =>
                        setSettings({ ...settings, storePhone: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="storeAddress">Địa chỉ</Label>
                    <Textarea
                      id="storeAddress"
                      value={settings.storeAddress}
                      onChange={(e) =>
                        setSettings({ ...settings, storeAddress: e.target.value })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cài đặt khu vực</CardTitle>
                  <CardDescription>Cấu hình tiền tệ và múi giờ</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Tiền tệ</Label>
                    <Input
                      id="currency"
                      value={settings.currency}
                      onChange={(e) =>
                        setSettings({ ...settings, currency: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Múi giờ</Label>
                    <Input
                      id="timezone"
                      value={settings.timezone}
                      onChange={(e) =>
                        setSettings({ ...settings, timezone: e.target.value })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Cài đặt thông báo</CardTitle>
                <CardDescription>Quản lý các loại thông báo hệ thống</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Thông báo email</Label>
                    <p className="text-sm text-muted-foreground">
                      Nhận thông báo qua email
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, emailNotifications: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Thông báo đơn hàng</Label>
                    <p className="text-sm text-muted-foreground">
                      Thông báo khi có đơn hàng mới
                    </p>
                  </div>
                  <Switch
                    checked={settings.orderNotifications}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, orderNotifications: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Cảnh báo tồn kho</Label>
                    <p className="text-sm text-muted-foreground">
                      Thông báo khi sản phẩm sắp hết hàng
                    </p>
                  </div>
                  <Switch
                    checked={settings.inventoryAlerts}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, inventoryAlerts: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Email khuyến mãi</Label>
                    <p className="text-sm text-muted-foreground">
                      Gửi email khuyến mãi cho khách hàng
                    </p>
                  </div>
                  <Switch
                    checked={settings.promotionalEmails}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, promotionalEmails: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Thông báo SMS</Label>
                    <p className="text-sm text-muted-foreground">Gửi thông báo qua SMS</p>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, smsNotifications: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Cài đặt bảo mật</CardTitle>
                <CardDescription>Quản lý bảo mật và quyền truy cập</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                  <Input id="currentPassword" type="password" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Mật khẩu mới</Label>
                  <Input id="newPassword" type="password" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                  <Input id="confirmPassword" type="password" />
                </div>

                <Button>Đổi mật khẩu</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle>Cấu hình email</CardTitle>
                <CardDescription>Thiết lập máy chủ email</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input id="smtpHost" placeholder="smtp.gmail.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input id="smtpPort" placeholder="587" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtpUsername">Username</Label>
                  <Input id="smtpUsername" placeholder="your-email@gmail.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">Password</Label>
                  <Input id="smtpPassword" type="password" />
                </div>

                <Button>Test kết nối</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle>Cài đặt hệ thống</CardTitle>
                <CardDescription>Quản lý hệ thống và bảo trì</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Tự động sao lưu</Label>
                    <p className="text-sm text-muted-foreground">
                      Sao lưu dữ liệu hàng ngày
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoBackup}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, autoBackup: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Chế độ bảo trì</Label>
                    <p className="text-sm text-muted-foreground">
                      Tạm ngưng hoạt động website
                    </p>
                  </div>
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, maintenanceMode: checked })
                    }
                  />
                </div>

                <div className="space-y-4">
                  <Button variant="outline">Tạo bản sao lưu</Button>
                  <Button variant="outline">Xóa cache</Button>
                  <Button variant="destructive">Reset hệ thống</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminSidebar>
  );
}
