import { NextRequest, NextResponse } from 'next/server';
import { getOrGenerateGermanAudio } from '@/lib/services/audio-tts';
import { AudioCategory, ContentOrigin } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, category, origin, sourceReference, voiceName } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'لازم تبعت النص الألماني المطلوب نطقه.' }, { status: 400 });
    }

    const validCategories: AudioCategory[] = ['HOEREN', 'SAETZE', 'WORTSCHATZ'];
    const selectedCategory: AudioCategory = validCategories.includes(category) ? category : 'SAETZE';

    const result = await getOrGenerateGermanAudio({
      text,
      category: selectedCategory,
      origin: (origin as ContentOrigin) || 'ORIGINAL_TEXTBOOK',
      sourceReference,
      voiceName,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { status: 'FALLBACK_ONLY', error: error?.message || 'هيتم استخدام نطق المتصفح البديل.' },
      { status: 200 }
    );
  }
}

