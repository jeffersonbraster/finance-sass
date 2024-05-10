import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertAmountFromMiliunits(amount: number) {
  return amount / 1000
}

export function convertAmountToMiliunits(amount: string) {
  // Remover qualquer caracter que não seja número ou vírgula
  const cleanedAmount = amount.replace(/[^\d,]/g, '');
  
  // Substituir a vírgula por ponto
  const amountWithDot = cleanedAmount.replace(',', '.');

  // Converter o valor para número e multiplicar por 1000
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
