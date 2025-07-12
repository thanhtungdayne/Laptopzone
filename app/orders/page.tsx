"use client";

import Image from "next/image";
import Link from "next/link";
import { Package, Truck, CheckCircle, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/header";
import Footer from "@/components/footer";

// Mock orders data
const orders = [
  {
    id: "ORD-2024-001",
    date: "2024-01-15",
    status: "delivered",
    total: 2499,
    items: [
      {
        id: 1,
        name: "MacBook Pro 16-inch M3 Pro",
        image: "/placeholder.svg?height=80&width=80",
        price: 2499,
        quantity: 1,
      },
    ],
    trackingNumber: "1Z999AA1234567890",
  },
  {
    id: "ORD-2024-002",
    date: "2024-01-20",
    status: "shipped",
    total: 1899,
    items: [
      {
        id: 3,
        name: "ASUS ROG Strix G16",
        image: "/placeholder.svg?height=80&width=80",
        price: 1899,
        quantity: 1,
      },
    ],
    trackingNumber: "1Z999AA1234567891",
    estimatedDelivery: "2024-01-25",
  },
  {
    id: "ORD-2024-003",
    date: "2024-01-22",
    status: "processing",
    total: 1649,
    items: [
      {
        id: 4,
        name: "ThinkPad X1 Carbon Gen 11",
        image: "/placeholder.svg?height=80&width=80",
        price: 1649,
        quantity: 1,
      },
    ],
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "delivered":
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    case "shipped":
      return <Truck className="h-5 w-5 text-blue-600" />;
    case "processing":
      return <Clock className="h-5 w-5 text-orange-600" />;
    default:
      return <Package className="h-5 w-5 text-gray-600" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-800";
    case "shipped":
      return "bg-blue-100 text-blue-800";
    case "processing":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="w-[85%] max-w-none mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Orders</h1>
            <p className="text-muted-foreground">Track and manage your orders</p>
          </div>

          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Order {order.id}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Placed on {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-2">
                        {getStatusIcon(order.status)}
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="font-semibold">${order.total.toLocaleString()}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Order Items */}
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4">
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${item.price.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}

                    {/* Order Actions */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-muted-foreground">
                        {order.trackingNumber && (
                          <p>
                            <span className="font-medium">Tracking:</span>{" "}
                            {order.trackingNumber}
                          </p>
                        )}
                        {order.estimatedDelivery && (
                          <p>
                            <span className="font-medium">Estimated Delivery:</span>{" "}
                            {new Date(order.estimatedDelivery).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        {order.status === "shipped" && (
                          <Button variant="outline" size="sm">
                            <Truck className="h-4 w-4 mr-2" />
                            Track Package
                          </Button>
                        )}
                        {order.status === "delivered" && (
                          <Button size="sm">
                            <Package className="h-4 w-4 mr-2" />
                            Reorder
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {orders.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-6">
                  When you place your first order, it will appear here.
                </p>
                <Button asChild>
                  <Link href="/">Start Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
