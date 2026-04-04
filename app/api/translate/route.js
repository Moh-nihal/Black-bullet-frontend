import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { text, target = 'ar', source = 'en' } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Using MyMemory open API as a simple free translation tier for the CMS
    // For production, replace with Google Cloud Translation API if limits are reached (500 words/day free)
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}`
    );
    
    if (!response.ok) {
        throw new Error('Translation API failed');
    }

    const data = await response.json();
    
    if (data.responseData && data.responseData.translatedText) {
      return NextResponse.json({ translatedText: data.responseData.translatedText });
    } else {
      throw new Error('Unexpected translation format');
    }

  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json({ error: 'Failed to translate' }, { status: 500 });
  }
}
