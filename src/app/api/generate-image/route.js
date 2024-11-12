import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        // 1. Validate the request
        if (!req.body) {
            return NextResponse.json(
                { error: 'Missing request body' },
                { status: 400 }
            );
        }

        const { prompt } = await req.json();
        
        // 2. Validate the API key
        if (!process.env.OPENAI_API_KEY) {
            console.error('OPENAI_API_KEY is not configured');
            return NextResponse.json(
                { error: 'OpenAI API key is not configured' },
                { status: 500 }
            );
        }

        // 3. Make the API request with better error handling
        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "dall-e-3",
                prompt: prompt,
                n: 1,
                size: "1024x1024",
            }),
        });

        // 4. Handle non-OK responses
        if (!response.ok) {
            const errorData = await response.json();
            console.error('OpenAI API error:', errorData);
            return NextResponse.json(
                { error: errorData.error?.message || 'Failed to generate image' },
                { status: response.status }
            );
        }

        // 5. Parse the successful response
        const data = await response.json();
        
        // 6. Validate the response data
        if (!data.data?.[0]?.url) {
            console.error('Unexpected API response format:', data);
            return NextResponse.json(
                { error: 'Invalid response from image generation API' },
                { status: 500 }
            );
        }

        // 7. Return the successful response
        return NextResponse.json({ imageUrl: data.data[0].url });

    } catch (error) {
        // 8. Handle any unexpected errors
        console.error('Image generation error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
