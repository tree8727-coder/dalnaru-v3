'use client';

/**
 * 진입 퍼널 v2 (기획안 1장 Phase 1~5 + 데이터 수집)
 *
 * 설계 원칙
 * - 탭 6번, 타이핑 0번. 이름만 마지막(동기 최고조)에 묻고 건너뛸 수 있다.
 * - 완성 예시를 먼저 보여준다 — 말로 약속하지 않고 실물로 유인.
 * - 모든 응답은 Firestore에 저장 (실패 시 localStorage) — Step 2 페르소나 데이터.
 *
 * ⚠ MOCK 수치 주의 — TOAST_FEED / GREETING의 "314명" 등은 실측이 아니다.
 * 실제 수치·출처가 생기기 전에는 출시하지 않는다 (vault proto 정직성 규칙).
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import ProfileCard from './ProfileCard';
import {
  FIELD_CHIPS, YEAR_CHIPS, ROLE_CHIPS, GOAL_CHIPS,
  getAchvOptions, buildProfile, type AchvOption,
} from '@/lib/funnelData';
import { newSessionId, saveFunnel, type FunnelStep } from '@/lib/funnelCollect';

type Role = 'bot' | 'user';
interface Msg { role: Role; text: string; typing?: boolean }
type Phase = 'greeting' | 'field' | 'years' | 'role' | 'achv' | 'goal' | 'loading' | 'name' | 'profile';

// MOCK: 실측 아님 — 출시 전 실제 이벤트 피드로 교체
const TOAST_FEED = [
  "🔥 방금 전, '제조업 품질관리 25년' 선배님의 프리미엄 프로필이 완성되었습니다.",
  "🔥 방금 전, '건설 현장소장 30년' 선배님의 프리미엄 프로필이 완성되었습니다.",
  "🔥 방금 전, '은행 지점장 22년' 선배님의 프리미엄 프로필이 완성되었습니다.",
];

// MOCK: "314명"은 실측 아님
const GREETING = [
  '새로운 시작을 환영합니다, 대표님! 👏',
  '이번 주에만 314명의 선배님들이 평생의 귀한 경험을 아래와 같은 프리미엄 프로필로 바꿔가셨습니다.',
];
const GREETING_AFTER_TEASER =
  '대표님 것도 3분이면 됩니다. 타이핑은 없습니다 — 버튼만 눌러 주세요. 가장 오래 일하신 분야가 어디신가요?';

// 완성 예시 티저용 샘플 (명시적으로 "완성 예시" 라벨이 붙는다)
const SAMPLE_PROFILE = buildProfile({
  field: '건설/건축', years: '30년 이상 평생', role: '현장소장·공장장',
  achv: getAchvOptions('건설/건축')[0], goal: '후배 멘토링', name: '김ㅇㅇ',
});

const LOADING_STEPS = [
  '최신 시니어 채용 트렌드 키워드 매핑 중…',
  '대표님 경력의 강점 구조화 중…',
  '프리미엄 프로필 조판 중…',
];

const QUESTION: Record<string, string> = {
  field: '가장 오래 일하신 분야',
  years: '몸담은 기간',
  role: '주된 역할',
  achv: '가장 자랑할 만한 성과',
  goal: '앞으로의 목표',
  name: '성함',
};

export default function EntryFunnel() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [phase, setPhase] = useState<Phase>('greeting');
  const [inputText, setInputText] = useState('');
  const [chipsEnabled, setChipsEnabled] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  // 수집된 응답
  const answers = useRef<{ field?: string; years?: string; role?: string; achv?: AchvOption; goal?: string; name?: string }>({});
  const session = useRef({ id: newSessionId(), startedAt: 0, steps: [] as FunnelStep[] });

  const scrollRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, inputText, showTeaser, loadingStep, phase]);

  const record = (phaseKey: string, a: string, done = false) => {
    session.current.steps.push({ q: QUESTION[phaseKey] ?? phaseKey, a, tMs: Date.now() - session.current.startedAt });
    void saveFunnel(session.current.id, { steps: session.current.steps, done });
  };

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
      if (i < text.length) later(tick, 18);
      else onDone?.();
    };
    later(tick, 18);
  }, [later]);

  // Phase 1~2: 인사 → 티저 카드 → 첫 질문
  useEffect(() => {
    session.current.startedAt = Date.now();
    later(() => botSay(GREETING[0], () =>
      later(() => botSay(GREETING[1], () =>
        later(() => {
          setShowTeaser(true);
          later(() => botSay(GREETING_AFTER_TEASER, () => {
            setPhase('field');
            setChipsEnabled(true);
          }), 900);
        }, 300),
      ), 350),
    ), 800);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 칩 → 자동 타이핑 → 전송
  const handleChip = (label: string) => {
    if (!chipsEnabled) return;
    navigator.vibrate?.(12);
    if (label === '직접 입력할게요') { setManualMode(true); return; }
    if (phase === 'name' && label === '이름 없이 만들기') { send(''); return; }
    setChipsEnabled(false);
    const sentence = sentenceFor(phase, label);
    let i = 0;
    const type = () => {
      i += 1;
      setInputText(sentence.slice(0, i));
      if (i < sentence.length) later(type, 40);
      else later(() => send(label, sentence), 350);
    };
    later(type, 120);
  };

  const sentenceFor = (p: Phase, label: string) => {
    switch (p) {
      case 'field': return `${label} 분야에서 오래 일했습니다.`;
      case 'years': return `${label} 몸담았습니다.`;
      case 'role': return `${label}(으)로 일했습니다.`;
      case 'achv': return `${label}이(가) 제일 자랑스럽습니다.`;
      case 'goal': return `${label}를 생각하고 있습니다.`;
      default: return label;
    }
  };

  // 전송 → 다음 단계
  const send = (label: string, sentence?: string) => {
    const shown = sentence ?? label;
    setInputText('');
    setManualMode(false);
    if (shown) setMessages((m) => [...m, { role: 'user', text: shown }]);

    const next = (p: Phase, question: string) =>
      later(() => { setPhase(p); botSay(question, () => setChipsEnabled(true)); }, 450);

    switch (phase) {
      case 'field':
        answers.current.field = label || '직접입력';
        record('field', label);
        next('years', '역시 그 세월이 느껴집니다. 대략 어느 정도 기간 동안 몸담으셨나요?');
        break;
      case 'years':
        answers.current.years = label;
        record('years', label);
        next('role', '그 시간 동안 주로 어떤 역할을 맡으셨나요?');
        break;
      case 'role':
        answers.current.role = label;
        record('role', label);
        next('achv', '좋습니다. 딱 하나만 꼽는다면, 가장 자랑할 만한 것은 무엇인가요?');
        break;
      case 'achv': {
        const opt = getAchvOptions(answers.current.field ?? '').find((o) => o.chip === label)
          ?? { chip: label, title: '베테랑 전문가', bullets: ['수십 년 실무에서 다져진 판단력', '후배에게 전할 수 있는 실전 노하우', '현장에서 증명된 신뢰'] };
        answers.current.achv = opt;
        record('achv', label);
        next('goal', '마지막 질문입니다. 이 경험을 앞으로 어디에 쓰고 싶으세요?');
        break;
      }
      case 'goal':
        answers.current.goal = label;
        record('goal', label);
        startLoading();
        break;
      case 'name':
        answers.current.name = label.trim();
        record('name', label.trim() ? '(입력함)' : '(건너뜀)', true); // 이름 원문은 프로필에만, 수집 로그엔 입력 여부만
        later(() => {
          setPhase('profile');
          botSay('완성됐습니다! 아래가 대표님의 프리미엄 프로필입니다. 📄 PDF로 저장해서 자녀분께도 보내보세요.');
        }, 400);
        break;
      default:
        break;
    }
  };

  // Phase 5: 로딩 게이미피케이션 → 이름 질문
  const startLoading = () => {
    setPhase('loading');
    setLoadingStep(0);
    LOADING_STEPS.forEach((_, i) =>
      later(() => setLoadingStep(i + 1), 900 * (i + 1)),
    );
    later(() => {
      setPhase('name');
      botSay('거의 다 됐습니다! 프로필에 올릴 성함만 알려주세요. (원치 않으시면 이름 없이 만들어 드립니다)', () => setChipsEnabled(true));
    }, 900 * LOADING_STEPS.length + 400);
  };

  const chips: { emoji?: string; label: string }[] =
    phase === 'field' ? FIELD_CHIPS
    : phase === 'years' ? YEAR_CHIPS.map((l) => ({ label: l }))
    : phase === 'role' ? ROLE_CHIPS.map((l) => ({ label: l }))
    : phase === 'achv' ? getAchvOptions(answers.current.field ?? '').map((o) => ({ label: o.chip }))
    : phase === 'goal' ? GOAL_CHIPS.map((l) => ({ label: l }))
    : phase === 'name' ? [{ emoji: '🙈', label: '이름 없이 만들기' }, { emoji: '✍️', label: '직접 입력할게요' }]
    : [];

  const finalProfile = phase === 'profile' && answers.current.achv
    ? buildProfile({
        field: answers.current.field!, years: answers.current.years!, role: answers.current.role!,
        achv: answers.current.achv, goal: answers.current.goal!, name: answers.current.name ?? '',
      })
    : null;

  return (
    <div className="funnel-shell">
      <ToastNudge />

      <div className="funnel-chat" ref={scrollRef}>
        {messages.slice(0, 2).map((m, i) => (
          <Bubble key={i} m={m} />
        ))}
        {showTeaser && <ProfileCard profile={SAMPLE_PROFILE} teaser />}
        {messages.slice(2).map((m, i) => (
          <Bubble key={i + 2} m={m} />
        ))}

        {phase === 'loading' && (
          <div className="funnel-loading">
            {LOADING_STEPS.map((s, i) => (
              <div key={s} className={`funnel-loading-step ${i < loadingStep ? 'done' : i === loadingStep ? 'now' : ''}`}>
                {i < loadingStep ? '✓' : '•'} {s}
              </div>
            ))}
            <div className="funnel-gauge"><div className="funnel-gauge-fill" style={{ width: `${(loadingStep / LOADING_STEPS.length) * 100}%` }} /></div>
          </div>
        )}

        {finalProfile && (
          <>
            <ProfileCard profile={finalProfile} />
            <div className="funnel-actions">
              <button className="btn-primary" onClick={() => window.print()}>📄 PDF로 저장하기</button>
              <button className="funnel-restart" onClick={() => window.location.reload()}>처음부터 다시</button>
            </div>
            <p className="funnel-privacy">
              선택하신 내용(분야·기간·역할·성과·목표)은 서비스 개선을 위해 저장됩니다. 성함은 프로필에만 쓰입니다.
            </p>
          </>
        )}
      </div>

      {chips.length > 0 && (
        <div className="funnel-chips" role="group" aria-label="답변 선택">
          {chips.map((c) => (
            <button key={c.label} className="funnel-chip" disabled={!chipsEnabled} onClick={() => handleChip(c.label)}>
              {c.emoji && <span aria-hidden>{c.emoji} </span>}
              {c.label}
            </button>
          ))}
        </div>
      )}

      {phase !== 'profile' && phase !== 'loading' && (
        <div className="funnel-inputbar">
          {manualMode ? (
            <input
              className="funnel-input"
              autoFocus
              value={inputText}
              placeholder={phase === 'name' ? '성함을 입력해 주세요' : '입력해 주세요'}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && inputText.trim()) send(inputText.trim()); }}
            />
          ) : (
            <div className={`funnel-input ${inputText ? '' : 'empty'}`}>
              {inputText || '아래 버튼을 눌러 주세요'}
              {inputText && <span className="funnel-caret" />}
            </div>
          )}
          <button className="funnel-send" aria-label="전송" disabled={!inputText.trim()} onClick={() => inputText.trim() && send(inputText.trim())}>
            ↑
          </button>
        </div>
      )}
    </div>
  );
}

function Bubble({ m }: { m: Msg }) {
  return (
    <div className={`funnel-bubble ${m.role}`}>
      {m.text}
      {m.typing && <span className="funnel-caret" />}
    </div>
  );
}

/** Phase 1: 소셜프루프 토스트 — 문구는 MOCK */
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
    return () => { alive = false; clearTimeout(t); };
  }, []);
  return (
    <div className={`funnel-toast ${visible ? 'show' : ''}`} aria-live="polite">
      {TOAST_FEED[idx]}
    </div>
  );
}
