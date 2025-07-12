"use client";

import { useState } from "react";
import {
  Menu,
  X,
  User,
  LogIn,
  UserPlus,
  Settings,
  LogOut,
  Package,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCart } from "@/context/cart-context";
import Cart from "./cart";
import SearchInput from "./search-input";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { state } = useCart();

  const handleLogout = () => {
    logout();
  };

  // Check if user is admin (you can modify this logic based on your user structure)
  const isAdmin = user?.role === "admin" || user?.email === "admin@laptopzone.com";

  return (
    <header className="sticky top-0 z-50 w-full flex items-center justify-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-[85%] max-w-none mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">LZ</span>
          </div>
          <span className="font-bold text-xl">LaptopZone</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/products"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Laptops
          </Link>
          <Link
            href="/products?category=gaming"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Gaming
          </Link>
          <Link
            href="/products?category=business"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Business
          </Link>
          <Link
            href="/products?category=ultrabook"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Ultrabooks
          </Link>
          <Link
            href="/products?category=workstation"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Workstations
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            About Us
          </Link>
        </nav>

        {/* Search Bar */}
        <div className="hidden md:flex items-center space-x-2 flex-1 max-w-sm mx-6">
          <SearchInput placeholder="Search laptops..." />
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* User Profile Dropdown */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user?.avatar || "/placeholder.svg"}
                      alt={user?.name || "User"}
                    />
                    <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || ""}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders" className="cursor-pointer">
                    <Package className="mr-2 h-4 w-4" />
                    <span>Orders</span>
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer">
                        <Shield className="mr-2 h-4 w-4 text-blue-600" />
                        <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent font-medium">
                          Admin Panel
                        </span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/login" className="cursor-pointer">
                    <LogIn className="mr-2 h-4 w-4" />
                    <span>Sign In</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/signup" className="cursor-pointer">
                    <UserPlus className="mr-2 h-4 w-4" />
                    <span>Create Account</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Cart Component */}
          <Cart />

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="w-[85%] max-w-none mx-auto px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <SearchInput
              placeholder="Search laptops..."
              onSearch={() => setIsMenuOpen(false)}
            />

            {/* Mobile Navigation */}
            <nav className="flex flex-col space-y-2">
              <Link
                href="/products"
                className="text-sm font-medium hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Laptops
              </Link>
              <Link
                href="/products?category=gaming"
                className="text-sm font-medium hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Gaming
              </Link>
              <Link
                href="/products?category=business"
                className="text-sm font-medium hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Business
              </Link>
              <Link
                href="/products?category=ultrabook"
                className="text-sm font-medium hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Ultrabooks
              </Link>
              <Link
                href="/products?category=workstation"
                className="text-sm font-medium hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Workstations
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
            </nav>

            {/* Mobile User Actions */}
            <div className="border-t pt-4">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 pb-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user?.avatar || "/placeholder.svg"}
                        alt={user?.name || "User"}
                      />
                      <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user?.name || "User"}</p>
                      <p className="text-xs text-muted-foreground">{user?.email || ""}</p>
                    </div>
                  </div>
                  <Link
                    href="/profile"
                    className="flex items-center space-x-2 text-sm font-medium hover:text-primary transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    href="/orders"
                    className="flex items-center space-x-2 text-sm font-medium hover:text-primary transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Package className="h-4 w-4" />
                    <span>Orders</span>
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 text-sm font-medium hover:text-primary transition-colors py-2 w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/login"
                    className="flex items-center space-x-2 text-sm font-medium hover:text-primary transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    href="/signup"
                    className="flex items-center space-x-2 text-sm font-medium hover:text-primary transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Create Account</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
