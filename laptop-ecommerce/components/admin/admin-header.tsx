"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Settings, Bell, User, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/auth-context";

export default function AdminHeader() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-red-50 border-red-200">
      <div className="w-[90%] max-w-none mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="flex items-center space-x-2 text-sm font-medium hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Quay lại trang chủ</span>
            </Link>

            <div className="h-6 w-px bg-red-300" />

            <div className="flex items-center space-x-2">
              <Badge variant="destructive" className="bg-red-500">
                ADMIN MODE
              </Badge>
              <span className="text-sm font-semibold text-red-700">
                Bảng điều khiển quản trị
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/admin"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Tổng quan
            </Link>
            <Link
              href="/admin/products"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Sản phẩm
            </Link>
            <Link
              href="/admin/orders"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Đơn hàng
            </Link>
            <Link
              href="/admin/users"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Người dùng
            </Link>
            <Link
              href="/admin/settings"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Cài đặt
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            {/* Admin Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8 border-2 border-red-300">
                    <AvatarImage
                      src={user?.avatar || "/placeholder.svg"}
                      alt={user?.name || "Admin"}
                    />
                    <AvatarFallback className="bg-red-100 text-red-700">
                      {user?.name?.charAt(0) || "A"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.name || "Admin"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || "admin@laptopstore.com"}
                    </p>
                    <Badge variant="outline" className="text-xs w-fit mt-1">
                      Quản trị viên
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Hồ sơ admin</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Cài đặt hệ thống</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-red-200 bg-red-50">
            <div className="px-4 py-4 space-y-4">
              <nav className="flex flex-col space-y-2">
                <Link
                  href="/admin"
                  className="text-sm font-medium hover:text-primary transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Tổng quan
                </Link>
                <Link
                  href="/admin/products"
                  className="text-sm font-medium hover:text-primary transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sản phẩm
                </Link>
                <Link
                  href="/admin/orders"
                  className="text-sm font-medium hover:text-primary transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Đơn hàng
                </Link>
                <Link
                  href="/admin/users"
                  className="text-sm font-medium hover:text-primary transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Người dùng
                </Link>
                <Link
                  href="/admin/settings"
                  className="text-sm font-medium hover:text-primary transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Cài đặt
                </Link>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
