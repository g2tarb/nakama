import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { SPECIALITES } from '@/lib/constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSpecialiteLabel(value: string): string {
  return SPECIALITES.find((s) => s.value === value)?.label ?? value;
}
