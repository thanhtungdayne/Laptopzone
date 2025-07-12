"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, Chrome, Facebook } from "lucide-react"
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

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const { login, isLoading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!email || !password) {
      setError("Vui lòng điền đầy đủ thông tin")
      return
    }

    const result = await login(email, password)

    if (result.success) {
      setSuccess(result.message)
      setTimeout(() => {
        router.push("/")
      }, 1500)
    } else {
      setError(result.message)
    }
  }

  const handleSocialLogin = (provider: string) => {
    // Placeholder for social login - does nothing as requested
    console.log(`${provider} login clicked - not implemented`)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Chào mừng trở lại</CardTitle>
              <p className="text-muted-foreground">Đăng nhập vào tài khoản của bạn</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Test Credentials Info */}
              <Alert>
                <AlertDescription>
                  <strong>Test Credentials:</strong>
                  <br />
                  Username: admin
                  <br />
                  Password: 1234678
                </AlertDescription>
              </Alert>

              {/* Social Login Buttons */}
              <div className="space-y-3">
                <Button type="button" variant="outline" className="w-full" onClick={() => handleSocialLogin("Google")}>
                  <Chrome className="mr-2 h-4 w-4" />
                  Tiếp tục với Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSocialLogin("Facebook")}
                >
                  <Facebook className="mr-2 h-4 w-4" />
                  Tiếp tục với Facebook
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

              {/* Login Form */}
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
                  <Label htmlFor="email">Email hoặc tên đăng nhập</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="text"
                      placeholder="admin"
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
                      placeholder="1234678"
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

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <Label htmlFor="remember" className="text-sm">
                      Ghi nhớ tôi
                    </Label>
                  </div>
                  <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                    Quên mật khẩu?
                  </Link>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Đang tải..." : "Đăng nhập"}
                </Button>
              </form>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Chưa có tài khoản?{" "}
                  <Link href="/signup" className="text-primary hover:underline">
                    Tạo tài khoản
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
