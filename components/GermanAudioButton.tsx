'use client';

import React, { useState } from 'react';

interface GermanAudioButtonProps {
  text: string;
  category?: 'WORTSCHATZ' | 'SAETZE' | 'HOEREN';
  origin?: 'ORIGINAL_TEXTBOOK' | 'VERIFIED_TRANSCRIPT_TTS' | 'AI_SUPPLEMENTARY';
  sourceReference?: string;
  label?: string;
  size?: 'sm' | 'md';
}

export default function GermanAudioButton({
  text,
  category = 'SAETZE',
  origin = 'ORIGINAL_TEXTBOOK',
  sourceReference,
  label,
  size = 'sm',
}: GermanAudioButtonProps) {
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'PLAYING' | 'FALLBACK' | 'ERROR'>('IDLE');
  const [notice, setNotice] = useState<string | null>(null);

  const playBrowserFallback = (germanText: string, fallbackMsg?: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setStatus('ERROR');
      setNotice('جهازك الحالي مش بيدعم تشغيل الصوت تلقائياً.');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(germanText);
    utterance.lang = 'de-DE';
    utterance.rate = category === 'HOEREN' ? 0.92 : 0.9;

    const voices = window.speechSynthesis.getVoices();
    const germanVoice = voices.find((v) => v.lang.startsWith('de'));
    if (germanVoice) utterance.voice = germanVoice;

    utterance.onstart = () => {
      setStatus('FALLBACK');
      if (fallbackMsg) setNotice(fallbackMsg);
    };
    utterance.onend = () => setStatus('IDLE');
    utterance.onerror = () => setStatus('ERROR');

    window.speechSynthesis.speak(utterance);
  };

  const handlePlay = async () => {
    if (status === 'LOADING' || status === 'PLAYING') return;
    setStatus('LOADING');
    setNotice(null);

    try {
      const res = await fetch('/api/audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, category, origin, sourceReference }),
      });

      const data = await res.json();
      if (data.status === 'READY' && data.storageUrl) {
        const audio = new Audio(data.storageUrl);
        audio.onplay = () => setStatus('PLAYING');
        audio.onended = () => setStatus('IDLE');
        audio.onerror = () => playBrowserFallback(text);
        await audio.play();
      } else {
        playBrowserFallback(text, data.fallbackNoticeAr);
      }
    } catch {
      playBrowserFallback(text);
    }
  };

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={handlePlay}
        disabled={status === 'LOADING'}
        className={`inline-flex items-center gap-1.5 rounded-lg border border-[#52796F]/30 bg-[#FAF7F2] text-[#1B4332] hover:bg-[#1B4332] hover:text-white transition-colors font-medium shadow-sm ${
          size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-2 text-sm'
        }`}
      >
        <span>{status === 'LOADING' ? '⏳' : status === 'PLAYING' || status === 'FALLBACK' ? '🔊' : '▶️'}</span>
        <span dir="ltr" className="font-semibold">{label || 'de-DE'}</span>
      </button>
      {notice && <span className="text-[11px] text-[#52796F]">ℹ️ {notice}</span>}
    </div>
  );
}

