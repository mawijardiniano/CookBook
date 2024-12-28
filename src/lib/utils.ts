import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
