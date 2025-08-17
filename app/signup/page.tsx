"use client";
// đăng ký
import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { Chrome, Facebook, Lock, Mail, User, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useAuth } from "@/context/auth-context";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { signup, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    console.log("Dữ liệu nhập vào:", { name,email, password, repassword });
    if (!name || !email || !password || !repassword) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (password !== repassword) {
      setError("Mật khẩu nhập lại không khớp");
      return;
    }

    if (!agree) {
      setError("Bạn cần đồng ý với điều khoản sử dụng");
      return;
    }

    const result = await signup(name, email, password,repassword);

    if (result.success) {
      setSuccess(result.message);
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } else {
      setError(result.message);
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
              <CardTitle className="text-2xl">Tạo tài khoản</CardTitle>
              <p className="text-muted-foreground">Đăng ký để bắt đầu trải nghiệm</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Button type="button" variant="outline" className="w-full" onClick={() => handleSocialLogin("Google")}>
                  <Chrome className="mr-2 h-4 w-4" />
                  Đăng ký với Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSocialLogin("Facebook")}
                >
                  <Facebook className="mr-2 h-4 w-4" />
                  Đăng ký với Facebook
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Hoặc đăng ký với</span>
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
                  <Label htmlFor="name">Họ và tên</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Nhập họ và tên của bạn"
                      className="pl-10"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

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
                  </div>
                </div>

                <div>
                  <Label htmlFor="repassword">Nhập lại mật khẩu</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="repassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="******"
                      className="pl-10 pr-10"
                      value={repassword}
                      onChange={(e) => setRepassword(e.target.value)}
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

                <div className="flex items-center space-x-2">
                  <Checkbox id="agree" checked={agree} onCheckedChange={(checked) => setAgree(checked as boolean)} />
                  <Label htmlFor="agree" className="text-sm">
                    Tôi đồng ý với{" "}
                    <a href="#" className="underline">
                      điều khoản sử dụng
                    </a>
                  </Label>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
                </Button>
              </form>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Đã có tài khoản?{" "}
                  <Link href="/login" className="text-primary hover:underline">
                    Đăng nhập
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
