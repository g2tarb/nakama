import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export function formatPrice(amount: number): string {
  const isInteger = Number.isInteger(amount);
  const formatted = amount.toLocaleString('fr-FR', {
    minimumFractionDigits: isInteger ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return `${formatted} €`;
}

export function formatPricePerHour(amount: number): string {
  return `${formatPrice(amount)}/h`;
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'd MMMM yyyy', { locale: fr });
}

export function formatDateShort(date: string | Date): string {
  return format(new Date(date), 'd MMM', { locale: fr });
}

export function formatTime(date: string | Date): string {
  return format(new Date(date), 'HH:mm', { locale: fr });
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), 'EEEE d MMMM à HH:mm', { locale: fr });
}

export function formatRelative(date: string | Date): string {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: fr,
  });
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h${m.toString().padStart(2, '0')}` : `${h}h`;
}
