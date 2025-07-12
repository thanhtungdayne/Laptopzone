import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Laptop } from "@/types/product";
import { useCart } from "@/context/cart-context";
import Link from "next/link";

interface ProductCardProps {
  laptop: Laptop;
}

export default function ProductCard({ laptop }: ProductCardProps) {
  const { dispatch } = useCart();

  const handleAddToCart = () => {
    dispatch({ type: "ADD_ITEM", payload: laptop });
  };

  return (
    <Link href={`/product/${laptop.id}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={laptop.image || "/placeholder.svg"}
            alt={laptop.name}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {laptop.originalPrice && (
            <Badge className="absolute top-2 left-2 bg-red-500">
              Save ${laptop.originalPrice - laptop.price}
            </Badge>
          )}
          {!laptop.inStock && (
            <Badge variant="secondary" className="absolute top-2 right-2">
              Out of Stock
            </Badge>
          )}
          {/* <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
          >
            <Heart className="h-4 w-4" />
          </Button> */}
        </div>

        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                {laptop.brand}
              </Badge>
              {/* <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-muted-foreground">
                  {laptop.rating} ({laptop.reviews})
                </span>
              </div> */}
            </div>

            <h3 className="font-semibold text-sm line-clamp-2 min-h-[2.5rem]">
              {laptop.name}
            </h3>

            <div className="space-y-1 text-xs text-muted-foreground">
              <div>{laptop.processor}</div>
              <div>
                {laptop.ram} RAM • {laptop.storage}
              </div>
              <div>{laptop.display}</div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-lg">
                    ${laptop.price.toLocaleString()}
                  </span>
                  {laptop.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      ${laptop.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              <Button
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  handleAddToCart();
                }}
                disabled={!laptop.inStock}
                className="shrink-0"
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
