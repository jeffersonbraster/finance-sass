import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertAmountFromMiliunits(amount: number) {
  return amount / 1000
}

export function convertAmountToMiliunits(amount: string) {
  const amountWithDot = amount.replace(',', '.');

  const amountInMiliunits = Math.round(Number(amountWithDot) * 1000);
  
  return amountInMiliunits;
}

export function formatCurrency(value: number) {
  return Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);
}
