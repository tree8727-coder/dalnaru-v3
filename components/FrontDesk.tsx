'use client';

/**
 * 안내데스크 — 카드 메뉴가 아니라 하나의 대화.
 * (유재원: "메뉴로 하기보다 자연스럽게 하나로 결합" — 2026-08-08)
 *
 * 봇이 용건을 묻고, 답을 고르면 맞장구와 함께 해당 방으로 안내한다.
 * 문 4개(이력서·계산기·전화·도구)는 그대로 있되, 사용자에게는
 * 기능 이름이 아니라 자기 상황의 언어("일을 다시 시작하고 싶어요")로 보인다.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { newSessionId, saveFunnel, type FunnelStep } from '@/lib/funnelCollect';

interface Door {
  chip: string;
  ack: string;
  href: string;
}

const DOORS: Door[] = [
  {
    chip: '💼 일을 다시 시작하고 싶어요',
    ack: '좋습니다. 평생 경력을 기업에 바로 낼 이력서로 정리해 드릴게요. 3분이면 됩니다.',
    href: '/funnel',
  },
  {
    chip: '💰 노후 자금이 걱정돼요',
    ack: '숫자로 보면 마음이 오히려 편해집니다. 네 가지만 맞춰보세요, 1분입니다.',
    href: '/calc',
  },
  {
    chip: '📞 어디 물어볼 데가 필요해요',
    ack: '무슨 일이든 어디로 전화하면 되는지, 뭐라고 말하면 되는지까지 찾아드릴게요.',
    href: '/call',
  },
  {
    chip: '🏆 부업·자동화가 궁금해요',
    ack: '분야마다 제일 좋은 도구 딱 하나씩만, 눈높이에 맞춰 알려드릴게요.',
    href: '/guide',
  },
];

type Role = 'bot' | 'user';
interface Msg { role: Role; text: string; typing?: boolean }

export default function FrontDesk() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [chipsOn, setChipsOn] = useState(false);
  const [fontLarge, setFontLarge] = useState(false);
  const router = useRouter();
  const session = useRef({ id: newSessionId(), startedAt: Date.now(), steps: [] as FunnelStep[] });
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const later = useCallback((fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)); }, []);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const botSay = useCallback((text: string, onDone?: () => void) => {
    setMessages((m) => [...m, { role: 'bot', text: '', typing: true }]);
    let i = 0;
    const tick = () => {
      i += 2;
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { ...copy[copy.length - 1], text: text.slice(0, i), typing: i < text.length };
        return copy;
      });
      if (i < text.length) later(tick, 14);
      else onDone?.();
    };
    later(tick, 14);
  }, [later]);

  useEffect(() => {
    later(() => botSay(
      '어서 오세요, 달나루입니다. 서강대 연구실에서 시작한 5060 경력 서비스예요. 오늘은 무슨 일로 오셨어요?',
      () => setChipsOn(true),
    ), 400);
    // 다음 페이지들이 즉시 뜨도록 미리 로드
    DOORS.forEach((d) => router.prefetch(d.href));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pick = (d: Door) => {
    if (!chipsOn) return;
    navigator.vibrate?.(10);
    setChipsOn(false);
    setMessages((m) => [...m, { role: 'user', text: d.chip.replace(/^\S+\s/, '') }]);
    session.current.steps.push({ q: 'frontdesk', a: d.chip, tMs: Date.now() - session.current.startedAt });
    void saveFunnel(session.current.id, { steps: session.current.steps });
    botSay(d.ack, () => later(() => router.push(d.href), 600));
  };

  return (
    <div className={`funnel-shell ${fontLarge ? 'font-large' : ''}`}>
      <div className="trust-strip">
        <span className="frontdesk-brand">달나루</span>
        <button className="font-toggle" onClick={() => setFontLarge((v) => !v)}>
          {fontLarge ? '가 보통 크기' : '가⁺ 글자 크게'}
        </button>
      </div>

      <div className="funnel-chat">
        {messages.map((m, i) => (
          <div key={i} className={`funnel-bubble ${m.role}`}>
            {m.text}
            {m.typing && <span className="funnel-caret" />}
          </div>
        ))}
      </div>

      <div className="funnel-chips" role="group" aria-label="용건 선택">
        {DOORS.map((d) => (
          <button key={d.href} className="funnel-chip frontdesk-chip" disabled={!chipsOn} onClick={() => pick(d)}>
            {d.chip}
          </button>
        ))}
      </div>

      <p className="landing-foot">응답은 이름 없이 보관됩니다 · 무료입니다</p>
    </div>
  );
}
