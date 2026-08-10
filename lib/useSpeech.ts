'use client';

/**
 * 브라우저 내장 음성 인식(Web Speech API) 훅.
 *
 * 왜 — 5060의 진짜 장벽은 화면이 아니라 타이핑이다. 앱에서 타이핑이 필요한 곳은
 *      제출용 사실 4칸뿐이고, 거기에 "말로 하기"를 붙인다. Mercor($10B)의 핵심도
 *      타이핑이 아니라 음성 대화다 — 우리는 그중 입력 부분만 가져온다.
 *
 * 지원 — Chrome/Edge/안드로이드 Chrome은 되고 삼성 인터넷은 안 된다.
 *      그래서 supported가 false면 버튼 자체를 그리지 않는다. 안 되는 기능을
 *      보여주고 실패시키는 것이 최악이다.
 *
 * 오류 — 인식 결과는 칸에 "넣기만" 한다. 자동 제출하지 않는다.
 *      틀리면 사용자가 고친다. 인식기가 확신 못 한 결과로 다음 단계를 밟지 않는다.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

// 표준 타입이 아직 lib.dom에 없어 최소 형태만 선언한다.
interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
}

type Ctor = new () => SpeechRecognitionLike;

function getCtor(): Ctor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as { SpeechRecognition?: Ctor; webkitSpeechRecognition?: Ctor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export interface UseSpeech {
  supported: boolean;
  listening: boolean;
  /** 마지막 오류 한글 안내. 없으면 null */
  error: string | null;
  /** 듣기 시작. 결과는 onText 콜백으로 한 번 온다 */
  start: (onText: (text: string) => void) => void;
  stop: () => void;
}

const ERROR_KO: Record<string, string> = {
  'not-allowed': '마이크 사용이 허용되지 않았습니다. 브라우저 주소창의 마이크 표시를 눌러 허용해 주십시오.',
  'no-speech': '말씀이 들리지 않았습니다. 다시 한 번 눌러서 말씀해 주십시오.',
  'audio-capture': '마이크를 찾을 수 없습니다.',
  network: '인터넷 연결을 확인해 주십시오.',
};

export function useSpeech(lang = 'ko-KR'): UseSpeech {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    // SSR/하이드레이션 불일치를 피하려고 마운트 후에 판정한다.
    setSupported(getCtor() !== null);
    return () => recRef.current?.abort();
  }, []);

  const stop = useCallback(() => {
    recRef.current?.stop();
    setListening(false);
  }, []);

  const start = useCallback(
    (onText: (text: string) => void) => {
      const C = getCtor();
      if (!C || recRef.current) return;
      const rec = new C();
      recRef.current = rec;
      rec.lang = lang;
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      rec.onresult = (e) => {
        const t = e.results[0]?.[0]?.transcript?.trim();
        if (t) onText(t);
      };
      rec.onerror = (e) => {
        setError(ERROR_KO[e.error] ?? '음성 인식에 실패했습니다. 직접 입력해 주십시오.');
      };
      rec.onend = () => {
        recRef.current = null;
        setListening(false);
      };
      setError(null);
      setListening(true);
      try {
        rec.start();
      } catch {
        recRef.current = null;
        setListening(false);
      }
    },
    [lang],
  );

  return { supported, listening, error, start, stop };
}
