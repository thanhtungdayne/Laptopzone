"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  Settings,
  BarChart3,
  LogOut,
  Menu,
  X,
  Search,
  ChevronDown,
  FileText,
} from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";

const sidebarItems = [
  {
    title: "Tổng quan",
    href: "/admin",
    icon: Home,
  },
  {
    title: "Sản phẩm",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Đơn hàng",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Khách hàng",
    href: "/admin/customers",
    icon: Users,
  },
  {
    title: "Thống kê",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Báo cáo",
    href: "/admin/reports",
    icon: FileText,
  },
  {
    title: "Cài đặt",
    href: "/admin/settings",
    icon: Settings,
  },
];

interface AdminSidebarProps {
  children: React.ReactNode;
}

export default function AdminSidebar({ children }: AdminSidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LZ</span>
              </div>
              <span className="font-bold text-xl">Admin Panel</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Admin Badge */}
          <div className="px-4 py-3 border-b bg-red-50">
            <Badge variant="destructive" className="w-full justify-center">
              🚀 ADMIN MODE
            </Badge>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="border-t p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start p-2 h-auto">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user?.avatar || "/placeholder.svg"}
                        alt={user?.name || "Admin"}
                      />
                      <AvatarFallback className="bg-blue-100 text-blue-700">
                        {user?.name?.charAt(0) || "A"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium">{user?.name || "Admin"}</p>
                      <p className="text-xs text-gray-500">Quản trị viên</p>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </div>
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
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/profile" className="cursor-pointer">
                    Hồ sơ
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/" className="cursor-pointer">
                    Về trang chủ
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Tìm kiếm..." className="pl-10 w-64" />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Quick actions */}
            <Link href="/">
              <Button variant="outline" size="sm">
                Về trang chủ
              </Button>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
