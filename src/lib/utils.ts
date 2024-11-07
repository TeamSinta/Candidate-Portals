import { orgConfig } from "@/config/organization";
import { env } from "@/env";
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

// utils/tinybird.ts
export async function sendEventToTinybird(eventData: any) {
  try {
      const response = await fetch(`https://api.us-east.tinybird.co/v0/events?name=${env.NEXT_PUBLIC_TINYBIRD_DATASOURCE}`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${env.NEXT_PUBLIC_TINYBIRD_INGESTION_TOKEN}`,
          },
          body: JSON.stringify(eventData),
      });

      if (!response.ok) {
          console.error("Failed to send event to Tinybird", await response.text());
      }
      console.log(response)


  } catch (error) {
      console.error("Error sending event to Tinybird:", error);
      console.log(error)
  }
}
