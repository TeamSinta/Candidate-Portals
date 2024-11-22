import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'Missing URL' }, { status: 400 });
    }

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; OpenGraphFetcher/1.0)',
            },
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Failed to fetch URL' },
                { status: response.status }
            );
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        const ogImage = $('meta[property="og:image"]').attr('content');
        const twitterImage = $('meta[name="twitter:image"]').attr('content');
        const image = ogImage || twitterImage || '/path-to-fallback-image.jpg';

        return NextResponse.json({ image });
    } catch (error) {
        console.error('Error fetching OpenGraph data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch OpenGraph data' },
            { status: 500 }
        );
    }
}
