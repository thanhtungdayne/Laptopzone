"use client";

import { useToast } from "@/components/ui/use-toast";

export default function TestToast() {
  const { toast } = useToast();

  return (
    <button
      onClick={() =>
        toast({
          title: "Test toast",
          description: "Thông báo toast hoạt động!",
        })
      }
    >
      Test Toast
    </button>
  );
}
