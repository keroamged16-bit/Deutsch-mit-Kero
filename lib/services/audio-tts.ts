import crypto from 'crypto';
import { prisma } from './prisma';
import { AudioCategory, AudioStatus, ContentOrigin } from '@prisma/client';

export interface GenerateAudioRequest {
  text: string;
  category: AudioCategory;
  origin?: ContentOrigin;
  sourceReference?: string;
  voiceName?: string;
}

export function computeAudioHash(text: string, locale = 'de-DE', voice = 'de-DE-ConradNeural'): string {
  return crypto
    .createHash('sha256')
    .update(`${locale}|${voice}|${text.trim()}`)
    .digest('hex');
}

export async function getOrGenerateGermanAudio(req: GenerateAudioRequest) {
  const cleanText = req.text.trim();
  if (!cleanText) {
    throw new Error('النص الألماني المطلوب تحويله لصوت فارغ.');
  }

  const locale = 'de-DE';
  const voiceName = req.voiceName || 'de-DE-ConradNeural';
  const textHash = computeAudioHash(cleanText, locale, voiceName);

  try {
    const existingAsset = await prisma.audioAsset.findUnique({
      where: { textHash },
    });

    if (existingAsset && existingAsset.status === AudioStatus.READY && existingAsset.storageUrl) {
      return {
        assetId: existingAsset.id,
        status: AudioStatus.READY,
        storageUrl: existingAsset.storageUrl,
        locale: existingAsset.locale,
        voiceName: existingAsset.voiceName,
        origin: existingAsset.origin,
        cached: true,
      };
    }
  } catch {}

  return {
    status: 'FALLBACK_ONLY',
    storageUrl: null,
    sourceText: cleanText,
    locale: 'de-DE',
    voiceName,
    origin: req.origin ?? 'ORIGINAL_TEXTBOOK',
    fallbackNoticeAr: 'بيتم تشغيل النطق الألماني (de-DE) حالياً عن طريق محرك الصوت المدمج في جهازك.',
  };
}

