import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
            <p className="text-muted-foreground">The product you're looking for doesn't exist or has been removed.</p>
          </div>

          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/">Browse All Products</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
