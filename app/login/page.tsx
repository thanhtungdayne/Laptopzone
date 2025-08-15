
"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Chrome, Facebook, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useAuth } from "@/context/auth-context";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    const result = await login(email, password);

    if (result.success) {
      setSuccess("Đăng nhập thành công!");
      setTimeout(() => {
        router.push("/profile");
      }, 1000);
    } else {
      setError(result.message || "Đăng nhập thất bại");
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`${provider} login clicked - not implemented`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Đăng nhập</CardTitle>
              <p className="text-muted-foreground">Đăng nhập để tiếp tục mua sắm</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Button type="button" variant="outline" className="w-full" onClick={() => handleSocialLogin("Google")}>
                  <Chrome className="mr-2 h-4 w-4" />
                  Đăng nhập với Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSocialLogin("Facebook")}
                >
                  <Facebook className="mr-2 h-4 w-4" />
                  Đăng nhập với Facebook
                </Button>
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Hoặc đăng nhập bằng email</span>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {success && (
                  <Alert>
                    <AlertDescription className="text-green-600">{success}</AlertDescription>
                  </Alert>
                )}
                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@gmail.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="password">Mật khẩu</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="******"
                      className="pl-10 pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                </Button>
              </form>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Chưa có tài khoản?{" "}
                  <Link href="/signup" className="text-primary hover:underline">
                    Đăng ký ngay
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}