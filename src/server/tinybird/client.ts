import { env } from "@/env";
import { Tinybird } from "@chronark/zod-bird";

export const tb = new Tinybird({
  token: env.NEXT_PUBLIC_TINYBIRD_PIPE_TOKEN as string,
  baseUrl: "https://api.us-east.tinybird.co"
});

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
