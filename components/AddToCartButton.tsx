'use client';

import axios from 'axios';
import { useToast } from "@/components/ui/use-toast";


export default function AddToCartButton({ userId, variantId, quantity = 1 }) {
  const { toast } = useToast();  // <-- Sửa ở đây

  const handleAddToCart = async () => {
    try {
      const res = await axios.post("http://localhost:5000/cart/add", {
        userId,
        variantId,
        quantity,
      });

      if (res.data.status) {
        toast({
          title: "🛒 Đã thêm vào giỏ hàng",
          description: "Sản phẩm đã được thêm thành công",
          variant: "default",
        });
      } else {
        toast({
          title: "❌ Thêm sản phẩm thất bại",
          description: res.data.message,
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "⚠️ Lỗi hệ thống",
        description: "Không thể kết nối đến server",
        variant: "destructive",
      });
    }
  };

  return (
    <button onClick={handleAddToCart}>
      Thêm vào giỏ hàng
    </button>
  );
}
