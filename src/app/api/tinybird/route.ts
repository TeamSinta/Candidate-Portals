import { NextRequest, NextResponse } from "next/server";
import { env } from "@/env";

export async function POST(request: NextRequest) {
    try {
        // Parse the incoming request body
        const body = await request.json();
        const eventData = body.eventData;

        // Check for required data
        if (!eventData) {
            return NextResponse.json(
                { error: "eventData is required." },
                { status: 400 },
            );
        }

        // Make a request to the Tinybird API
        const tinybirdResponse = await fetch(
            `https://api.us-east.tinybird.co/v0/events?name=${env.TINYBIRD_DATASOURCE}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${env.TINYBIRD_INGESTION_TOKEN}`,
                },
                body: JSON.stringify(eventData),
            },
        );

        if (!tinybirdResponse.ok) {
            const errorText = await tinybirdResponse.text();
            console.error("Tinybird API Error:", errorText);
            return NextResponse.json(
                {
                    error: "Failed to send event to Tinybird.",
                    details: errorText,
                },
                { status: tinybirdResponse.status },
            );
        }

        return NextResponse.json(
            { message: "Event sent successfully!" },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error in Tinybird API Route:", error);
        return NextResponse.json(
            { error: "Internal Server Error", details: error.message },
            { status: 500 },
        );
    }
}
