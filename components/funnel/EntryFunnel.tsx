'use client';

/**
 * 진입 퍼널 (기획안 1장 Phase 1~4)
 * 핵심: 키보드 없이 터치(칩)만으로 채팅 입력이 완성되는 Zero-Friction 뼈대.
 *
 * ⚠ MOCK 수치 주의 — 아래 TOAST_FEED / GREETING의 "314명" 등은 실측이 아니다.
 * 출시 전 실제 수치·출처로 교체할 것 (vault proto 스킬 정직성 규칙).
 */

import { useCallback, useEffect, useRef, useState } from 'react';

type Role = 'bot' | 'user';
interface Msg {
  role: Role;
  text: string;
  typing?: boolean; // 타이핑 연출 중
}
type Phase = 'greeting' | 'field' | 'years' | 'done';

// MOCK: 실측 아님 — 출시 전 실제 이벤트 피드로 교체
const TOAST_FEED = [
  "🔥 방금 전, '제조업 품질관리 25년' 선배님의 AI 이력서가 완성되었습니다.",
  "🔥 방금 전, '건설 현장소장 30년' 선배님의 프리미엄 프로필이 완성되었습니다.",
  "🔥 방금 전, '은행 지점장 22년' 선배님의 AI 이력서가 완성되었습니다.",
];

// MOCK: "314명"은 실측 아님
const GREETING = [
  '새로운 시작을 환영합니다, 대표님! 👏',
  '이번 주에만 314명의 선배님들이 이곳에서 평생의 귀한 경험을 트렌디한 AI 이력서로 바꿔가셨습니다.',
  "대표님의 경력도 요즘 기업이 가장 원하는 '프리미엄 프로필'로 제가 직접 세팅해 드릴게요. 가장 오래 일하신 분야를 아래에서 선택해 주세요.",
];

const FIELD_CHIPS = [
  { emoji: '🏗️', label: '건설/건축' },
  { emoji: '⚙️', label: '기계/제조' },
  { emoji: '📊', label: '금융/영업' },
  { emoji: '🏫', label: '교육/연구' },
  { emoji: '🚚', label: '물류/유통' },
  { emoji: '✍️', label: '직접 입력할게요' },
];

const YEAR_CHIPS = [
  { emoji: '', label: '10년 이하' },
  { emoji: '', label: '10년~20년' },
  { emoji: '', label: '20년~30년' },
  { emoji: '', label: '30년 이상 평생' },
];

const chipToSentence = (phase: Phase, label: string) =>
  phase === 'field'
    ? `${label} 분야에서 오래 일했습니다.`
    : `${label} 몸담았습니다.`;

export default function EntryFunnel() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [phase, setPhase] = useState<Phase>('greeting');
  const [inputText, setInputText] = useState(''); // 칩이 자동 타이핑하는 가짜 입력창
  const [chipsEnabled, setChipsEnabled] = useState(false);
  const [manualMode, setManualMode] = useState(false); // '직접 입력할게요'
  const scrollRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // 새 메시지마다 맨 아래로
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, inputText]);

  // 봇 말풍선을 글자 단위로 타이핑
  const botSay = useCallback(
    (text: string, onDone?: () => void) => {
      setMessages((m) => [...m, { role: 'bot', text: '', typing: true }]);
      let i = 0;
      const tick = () => {
        i += 2;
        setMessages((m) => {
          const copy = [...m];
          const last = copy[copy.length - 1];
          copy[copy.length - 1] = { ...last, text: text.slice(0, i), typing: i < text.length };
          return copy;
        });
        if (i < text.length) later(tick, 18);
        else onDone?.();
      };
      later(tick, 18);
    },
    [later],
  );

  // Phase 2: 첫인사 (문단 순차 타이핑)
  useEffect(() => {
    let idx = 0;
    const next = () => {
      if (idx >= GREETING.length) {
        setPhase('field');
        setChipsEnabled(true);
        return;
      }
      botSay(GREETING[idx++], () => later(next, 350));
    };
    later(next, 800);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 칩 터치 → 햅틱 → 입력창에 자동 타이핑 → 자동 전송
  const handleChip = (label: string) => {
    if (!chipsEnabled) return;
    navigator.vibrate?.(12); // 햅틱 (미지원 기기는 무시)

    if (label === '직접 입력할게요') {
      setManualMode(true);
      return;
    }
    setChipsEnabled(false);
    const sentence = chipToSentence(phase, label);
    let i = 0;
    const type = () => {
      i += 1;
      setInputText(sentence.slice(0, i));
      if (i < sentence.length) later(type, 45);
      else later(() => send(sentence), 400); // 다 찍히면 잠깐 보여주고 전송
    };
    later(type, 120);
  };

  // 전송: 유저 말풍선 추가 → 다음 Phase로
  const send = (text: string) => {
    setInputText('');
    setManualMode(false);
    setMessages((m) => [...m, { role: 'user', text }]);
    if (phase === 'field') {
      later(() => {
        setPhase('years');
        botSay('대략 어느 정도 기간 동안 몸담으셨나요?', () => setChipsEnabled(true));
      }, 500);
    } else if (phase === 'years') {
      later(() => {
        setPhase('done');
        // Phase 5는 다음 작업: 로딩 게이미피케이션 → PDF 버튼
        botSay('좋습니다! 최신 시니어 채용 트렌드 키워드를 매핑하고 있어요… ⏳');
      }, 500);
    }
  };

  const chips = phase === 'field' ? FIELD_CHIPS : phase === 'years' ? YEAR_CHIPS : [];

  return (
    <div className="funnel-shell">
      <ToastNudge />

      <div className="funnel-chat" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`funnel-bubble ${m.role}`}>
            {m.text}
            {m.typing && <span className="funnel-caret" />}
          </div>
        ))}
      </div>

      {chips.length > 0 && (
        <div className="funnel-chips" role="group" aria-label="답변 선택">
          {chips.map((c) => (
            <button
              key={c.label}
              className="funnel-chip"
              disabled={!chipsEnabled}
              onClick={() => handleChip(c.label)}
            >
              {c.emoji && <span aria-hidden>{c.emoji} </span>}
              {c.label}
            </button>
          ))}
        </div>
      )}

      {/* 가짜 입력창: 칩이 여기로 자동 타이핑한다. 직접입력 모드에서만 키보드 허용 */}
      <div className="funnel-inputbar">
        {manualMode ? (
          <input
            className="funnel-input"
            autoFocus
            value={inputText}
            placeholder="분야를 입력해 주세요"
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && inputText.trim()) send(inputText.trim());
            }}
          />
        ) : (
          <div className={`funnel-input ${inputText ? '' : 'empty'}`}>
            {inputText || '아래 버튼을 눌러 주세요'}
            {inputText && <span className="funnel-caret" />}
          </div>
        )}
        <button
          className="funnel-send"
          aria-label="전송"
          disabled={!inputText.trim()}
          onClick={() => inputText.trim() && send(inputText.trim())}
        >
          ↑
        </button>
      </div>
    </div>
  );
}

/** Phase 1: 상단 소셜프루프 토스트 (fade in/out 순환) — 문구는 MOCK */
function ToastNudge() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let alive = true;
    let t: ReturnType<typeof setTimeout>;
    const cycle = (i: number) => {
      if (!alive) return;
      setIdx(i);
      setVisible(true);
      t = setTimeout(() => {
        if (!alive) return;
        setVisible(false);
        t = setTimeout(() => cycle((i + 1) % TOAST_FEED.length), 1400);
      }, 3600);
    };
    t = setTimeout(() => cycle(0), 600);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, []);

  return (
    <div className={`funnel-toast ${visible ? 'show' : ''}`} aria-live="polite">
      {TOAST_FEED[idx]}
    </div>
  );
}
