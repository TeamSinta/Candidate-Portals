import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const iframeUrl = searchParams.get("url");

    if (!iframeUrl) {
        return NextResponse.json(
            { error: "URL parameter is missing" },
            { status: 400 },
        );
    }

    try {
        const response = await fetch(iframeUrl, { method: "HEAD" });

        // Check for headers that block iframes
        const xFrameOptions = response.headers.get("x-frame-options");
        const contentSecurityPolicy = response.headers.get(
            "content-security-policy",
        );

        if (xFrameOptions || contentSecurityPolicy) {
            return NextResponse.json(
                {
                    status: "blocked",
                    message:
                        "The content you're looking for isn't available here due to restrictions set by the website.",
                    xFrameOptions,
                    contentSecurityPolicy,
                },
                { status: 403 },
            );
        }

        return NextResponse.json(
            { status: "ok", message: "Iframe can be loaded." },
            { status: 200 },
        );
    } catch (error) {
        return NextResponse.json(
            { error: "", details: error.message },
            { status: 500 },
        );
    }
}
