"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, User, Chrome, Facebook } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useAuth } from "@/context/auth-context"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const { signup, isLoading } = useAuth()
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      return "Vui lòng điền đầy đủ thông tin"
    }

    if (formData.name.length < 2) {
      return "Tên phải có ít nhất 2 ký tự"
    }

    if (!formData.email.includes("@")) {
      return "Vui lòng nhập địa chỉ email hợp lệ"
    }

    if (formData.password.length < 6) {
      return "Mật khẩu phải có ít nhất 6 ký tự"
    }

    if (formData.password !== formData.confirmPassword) {
      return "Mật khẩu không khớp"
    }

    if (!agreeToTerms) {
      return "Vui lòng đồng ý với Điều khoản dịch vụ và Chính sách bảo mật"
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    const result = await signup(formData.name, formData.email, formData.password)

    if (result.success) {
      setSuccess(result.message)
      setTimeout(() => {
        router.push("/")
      }, 1500)
    } else {
      setError(result.message)
    }
  }

  const handleSocialSignup = (provider: string) => {
    // Placeholder for social signup - does nothing as requested
    console.log(`${provider} signup clicked - not implemented`)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Tạo tài khoản</CardTitle>
              <p className="text-muted-foreground">Tạo tài khoản mới để bắt đầu mua sắm</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Social Signup Buttons */}
              <div className="space-y-3">
                <Button type="button" variant="outline" className="w-full" onClick={() => handleSocialSignup("Google")}>
                  <Chrome className="mr-2 h-4 w-4" />
                  Đăng ký với Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSocialSignup("Facebook")}
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
                  <span className="bg-background px-2 text-muted-foreground">Hoặc tiếp tục với</span>
                </div>
              </div>

              {/* Signup Form */}
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
                      placeholder="John Doe"
                      className="pl-10"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Địa chỉ email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
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
                      placeholder="Enter your password"
                      className="pl-10 pr-10"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
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

                <div>
                  <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="pl-10 pr-10"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreeToTerms}
                    onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                    className="mt-1"
                  />
                  <Label htmlFor="terms" className="text-sm leading-5">
                    Tôi đồng ý với{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      Điều khoản dịch vụ
                    </Link>{" "}
                    và{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                      Chính sách bảo mật
                    </Link>
                  </Label>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Đang tải..." : "Tạo tài khoản"}
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
  )
}
