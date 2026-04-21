import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const INDIA_TIME_ZONE = "Asia/Kolkata";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(value?: string | Date) {
  if (!value) return "N/A";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: INDIA_TIME_ZONE,
  }).format(new Date(value));
}

export function formatDateTime(value?: string | Date) {
  if (!value) return "N/A";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: INDIA_TIME_ZONE,
  }).format(new Date(value));
}

export function formatWeekdayDateIndia(value?: string | Date) {
  const parsed = value ? new Date(value) : new Date();
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: INDIA_TIME_ZONE,
  }).format(parsed);
}

export function formatTimeIndia(value?: string | Date) {
  const parsed = value ? new Date(value) : new Date();
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: INDIA_TIME_ZONE,
  }).format(parsed);
}

export function percentage(value: number) {
  return `${Math.round(value)}%`;
}
