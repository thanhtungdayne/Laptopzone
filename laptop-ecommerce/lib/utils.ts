import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Consistent number formatting to prevent hydration errors
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

export function formatPrice(price: number): string {
  return `$${formatNumber(price)}`;
}
