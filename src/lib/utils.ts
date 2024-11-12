import { orgConfig } from "@/config/organization";
import { env } from "@/env";
import { MergedSectionData } from "@/types/portal";
import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";


export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// it tells you if the current link is active or not based on the pathname
export function isLinkActive(href: string, pathname: string | null) {
    return pathname === href;
}

export function setOrgCookie(orgId: string) {
    document.cookie = `${orgConfig.cookieName}=${orgId}; path=/; max-age=31536000;`;
}

export function getAbsoluteUrl(path: string) {
    return `${env.NEXTAUTH_URL}${path}`;
}

export function thousandToK(value: number) {
    return value / 1000;
}

export function formatDate(date: string | number | Date) {
    return format(new Date(date), "PP");
}


export function generateCustomUrl(): string {
  // Define the characters to be used in the random string
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const length = 12; // Length of the random string to match the format "BDDSmf7SjIBF"
  let result = "";

  // Generate a random string of the specified length
  for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
  }

  // Return the generated string
  return result;
}

export function generateGUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
  });
}


export function calculateTotalAverageDuration(data: MergedSectionData[]): string {
  if (data.length === 0) return "0 seconds";

  // Calculate the total duration in seconds
  const totalDuration = data.reduce((sum, item) => sum + item.total_duration, 0);

  // Calculate the average duration
  const averageDuration = totalDuration / data.length;

  // Format the duration based on its value
  if (averageDuration >= 60) {
    // Convert to minutes and seconds if it's 60 seconds or more
    const minutes = Math.floor(averageDuration / 60);
    const remainingSeconds = Math.floor(averageDuration % 60);
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    // Return in seconds if it's less than 60 seconds
    return `${Math.floor(averageDuration)} seconds`;
  }
}
