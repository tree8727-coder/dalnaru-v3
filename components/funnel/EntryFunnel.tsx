'use client';

/**
 * 진입 퍼널 v3.1 — 대화형 이력서 작성.
 *
 * v3.1 수정 (사용자 피드백):
 * - 더블 전송 버그: 자동 타이핑 중 전송 버튼 비활성 + 중복 커밋 가드
 * - 칩이 화면 밖으로 밀리던 것: 가로 스크롤 대신 줄바꿈(5070에게 숨은 스크롤은 없는 것)
 * - 티저가 너무 빨리 지나감: "시작하기" 버튼을 누를 때까지 예시가 머무름
 * - 보상 확신: 시작 전에 산출물(이력서 PDF + 맞춤 일자리)을 명시하고,
 *   답할 때마다 "○○에 반영됨 ✓"이 게이지에 뜸
 * - 이탈 방지: 작성 중 창을 닫으면 확인창 + 재방문 시 "이어서 하기"
 *
 * ⚠ MOCK 수치 — TOAST_FEED / GREETING의 "314명" 등은 실측 아님. 실측 전 출시 금지.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import ResumeDoc from './ResumeDoc';
import JobMatches from './JobMatches';
import {
  FLOW, REWARD_BY_KEY, buildResume, resumeProgress, SAMPLE_ANSWERS,
  type Answers, type Chip,
} from '@/lib/funnelData';
import { matchJobs, JOB_POOL } from '@/lib/jobMatch';
import { newSessionId, saveFunnel, type FunnelStep } from '@/lib/funnelCollect';

type Role = 'bot' | 'user';
interface Msg { role: Role; text: string; typing?: boolean }
type Stage = 'greeting' | 'gate' | 'flow' | 'loading' | 'name' | 'result';

const STORE_KEY = 'dalnaru_funnel_v3';

// MOCK: 실측 아님 — 출시 전 실제 이벤트 피드로 교체
const TOAST_FEED = [
  "🔥 방금 전, '제조업 품질관리 25년' 선배님의 이력서가 완성되었습니다.",
  "🔥 방금 전, '건설 현장소장 30년' 선배님의 이력서가 완성되었습니다.",
  "🔥 방금 전, '은행 지점장 22년' 선배님의 이력서가 완성되었습니다.",
];
// MOCK: "314명"은 실측 아님
const GREETING = [
  '반갑습니다, 대표님! 👏 저는 대표님의 평생 경력을 기업에 바로 낼 수 있는 이력서로 정리해 드리는 달나루입니다.',
  '이번 주에만 314명의 선배님들이 아래와 같은 이력서를 만들어 가셨습니다. 천천히 살펴보세요.',
];
const PROMISE =
  '대화를 마치면 두 가지를 바로 드립니다.\n① 위 형식의 제출용 이력서 (PDF 저장 가능)\n② 대표님 조건에 맞는 일자리 추천\n\n대부분은 버튼만 누르시면 되고, 이야기를 들려주고 싶은 곳에서만 편하게 쓰시면 됩니다. 답하실 때마다 위쪽 게이지에서 이력서가 채워지는 게 보입니다.\n\n응답 내용은 이름을 뺀 익명 자료로 시니어 일자리·업계 연구에 활용됩니다. 시작하시면 동의하신 것으로 알겠습니다.';

const LOADING_STEPS = [
  '응답하신 내용을 경력기술서 형식으로 조판 중…',
  '성과를 수치 중심으로 정리 중…',
  '대표님 조건과 맞는 일자리 대조 중…',
];

interface Saved { answers: Answers; stepIdx: number }

function loadSaved(): Saved | null {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Saved;
    return s.stepIdx > 0 && s.stepIdx < FLOW.length ? s : null;
  } catch { return null; }
}

export default function EntryFunnel() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [stage, setStage] = useState<Stage>('greeting');
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [inputText, setInputText] = useState('');
  const [chipsEnabled, setChipsEnabled] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [autoTyping, setAutoTyping] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [reward, setReward] = useState<string | null>(null);
  const [resumeOffer, setResumeOffer] = useState<Saved | null>(null);

  const session = useRef({ id: newSessionId(), startedAt: 0, steps: [] as FunnelStep[] });
  const committing = useRef(false); // 더블 전송 가드
  const leaving = useRef(false);    // "처음부터 다시"는 확인창 없이
  const scrollRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, inputText, showTeaser, loadingStep, stage, selectedJob]);

  // 작성 중 이탈 방지
  useEffect(() => {
    const guard = (e: BeforeUnloadEvent) => {
      if (leaving.current) return;
      if (stage === 'flow' || stage === 'name') {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', guard);
    return () => window.removeEventListener('beforeunload', guard);
  }, [stage]);

  const record = (q: string, a: string, done = false) => {
    session.current.steps.push({ q, a, tMs: Date.now() - session.current.startedAt });
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
      if (i < text.length) later(tick, 16);
      else onDone?.();
    };
    later(tick, 16);
  }, [later]);

  // 시작: 저장된 진행분이 있으면 이어하기 제안, 없으면 인사
  useEffect(() => {
    session.current.startedAt = Date.now();
    const saved = loadSaved();
    if (saved) {
      setResumeOffer(saved);
      later(() => botSay(
        `다시 오셨네요, 반갑습니다! 지난번에 이력서를 ${resumeProgress(saved.answers)}%까지 만드셨어요. 이어서 할까요?`,
        () => setChipsEnabled(true),
      ), 600);
      return;
    }
    runGreeting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runGreeting = () => {
    later(() => botSay(GREETING[0], () =>
      later(() => botSay(GREETING[1], () =>
        later(() => {
          setShowTeaser(true);
          later(() => botSay(PROMISE, () => {
            setStage('gate');
            setChipsEnabled(true);
          }), 1200);
        }, 300),
      ), 350),
    ), 700);
  };

  const askStep = (idx: number, a: Answers) => {
    setStepIdx(idx);
    later(() => botSay(FLOW[idx].ask(a), () => {
      committing.current = false;
      setChipsEnabled(true);
      if (FLOW[idx].input === 'text') setManualMode(true); // 자유 서술 — 글상자 바로 열기
    }), 420);
  };

  const currentStep = stage === 'flow' ? FLOW[stepIdx] : null;

  const chips: Chip[] =
    resumeOffer ? [{ emoji: '▶️', label: '이어서 하기' }, { emoji: '🔄', label: '처음부터 새로' }]
    : stage === 'gate' ? [{ emoji: '🚀', label: '좋아요, 시작하기' }]
    : stage === 'flow' && currentStep ? currentStep.chips(answers)
    : stage === 'name' ? [{ emoji: '🙈', label: '이름 없이 만들기' }, { emoji: '✍️', label: '직접 입력할게요' }]
    : [];

  const handleChip = (label: string) => {
    if (!chipsEnabled || autoTyping) return;
    navigator.vibrate?.(12);

    if (resumeOffer) {
      const saved = resumeOffer;
      setResumeOffer(null);
      setChipsEnabled(false);
      setMessages((m) => [...m, { role: 'user', text: label }]);
      if (label === '이어서 하기') {
        setAnswers(saved.answers);
        setStage('flow');
        botSay('좋습니다, 이어서 갑니다!', () => askStep(saved.stepIdx, saved.answers));
      } else {
        localStorage.removeItem(STORE_KEY);
        runGreeting();
      }
      return;
    }

    if (stage === 'gate') {
      setChipsEnabled(false);
      setMessages((m) => [...m, { role: 'user', text: label }]);
      record('consent', '시작하기 = 익명 활용 동의 문구 표시 후 동의');
      setStage('flow');
      askStep(0, answers);
      return;
    }

    if (label === '직접 입력할게요') { setManualMode(true); return; }
    if (stage === 'name' && label === '이름 없이 만들기') { commitAnswer(''); return; }

    setChipsEnabled(false);
    setAutoTyping(true);
    const sentence = currentStep ? currentStep.sentence(label) : label;
    let i = 0;
    const type = () => {
      i += 1;
      setInputText(sentence.slice(0, i));
      if (i < sentence.length) later(type, 36);
      else later(() => { setAutoTyping(false); commitAnswer(label, sentence); }, 320);
    };
    later(type, 100);
  };

  const commitAnswer = (label: string, sentence?: string) => {
    if (committing.current) return; // 더블 전송 가드
    committing.current = true;

    setInputText('');
    setManualMode(false);
    const shown = sentence ?? label;
    if (shown) setMessages((m) => [...m, { role: 'user', text: shown }]);

    if (stage === 'name') {
      setAnswers((a) => ({ ...a, name: label.trim() }));
      record('성함', label.trim() ? '(입력함)' : '(건너뜀)', true); // 이름 원문은 이력서에만
      localStorage.removeItem(STORE_KEY); // 완주 — 이어하기 데이터 정리
      later(() => {
        setStage('result');
        botSay('완성됐습니다! 기업에 바로 제출할 수 있는 형식으로 정리했고, 맞는 일자리도 함께 찾아 두었습니다. 공고를 누르면 그 공고에 맞춰 이력서가 다시 정렬됩니다.');
      }, 400);
      return;
    }

    if (!currentStep) { committing.current = false; return; }
    const skipped = currentStep.skipLabel === label;
    const nextAnswers: Answers = skipped ? answers : { ...answers, [currentStep.key]: label };
    if (!skipped) {
      setAnswers(nextAnswers);
      record(currentStep.key, label);
      // 보상 표시: 이 답이 이력서 어디에 들어갔는지
      const slot = REWARD_BY_KEY[currentStep.key];
      if (slot) {
        setReward(`✓ 「${slot}」에 반영됐습니다`);
        later(() => setReward(null), 1800);
      }
    }

    const nextIdx = stepIdx + 1;
    if (nextIdx < FLOW.length) {
      try { localStorage.setItem(STORE_KEY, JSON.stringify({ answers: nextAnswers, stepIdx: nextIdx } satisfies Saved)); } catch { /* 무시 */ }
      askStep(nextIdx, nextAnswers);
    } else {
      startLoading();
    }
  };

  const startLoading = () => {
    setStage('loading');
    setLoadingStep(0);
    LOADING_STEPS.forEach((_, i) => later(() => setLoadingStep(i + 1), 850 * (i + 1)));
    later(() => {
      setStage('name');
      botSay('거의 다 됐습니다! 이력서에 올릴 성함만 알려주세요. (원치 않으시면 이름 없이 만들어 드립니다)', () => {
        committing.current = false;
        setChipsEnabled(true);
      });
    }, 850 * LOADING_STEPS.length + 350);
  };

  const restart = () => {
    leaving.current = true;
    localStorage.removeItem(STORE_KEY);
    window.location.reload();
  };

  const progress = stage === 'result' ? 100 : resumeProgress(answers);
  const resume = buildResume(answers);
  const sampleResume = buildResume(SAMPLE_ANSWERS);
  const matches = stage === 'result' ? matchJobs(answers) : [];
  const targetJob = selectedJob ? JOB_POOL.find((j) => j.id === selectedJob) ?? null : null;

  return (
    <div className="funnel-shell">
      <ToastNudge />

      {(stage === 'flow' || stage === 'loading' || stage === 'name') && (
        <button className="resume-gaugebar" onClick={() => setShowPreview((v) => !v)}>
          <span>📄 내 이력서 {progress}% 완성</span>
          <span className="resume-gaugebar-hint">{reward ?? (showPreview ? '접기 ▲' : '보기 ▼')}</span>
          <div className="funnel-gauge"><div className="funnel-gauge-fill" style={{ width: `${progress}%` }} /></div>
        </button>
      )}
      {showPreview && stage !== 'result' && (
        <div className="resume-preview-wrap">
          <ResumeDoc resume={resume} preview />
        </div>
      )}

      <div className="funnel-chat" ref={scrollRef}>
        {messages.slice(0, 2).map((m, i) => <Bubble key={i} m={m} />)}
        {showTeaser && (stage === 'greeting' || stage === 'gate') && (
          <div className="resume-teaser">
            <div className="profile-teaser-label">완성 예시</div>
            <ResumeDoc resume={sampleResume} />
          </div>
        )}
        {messages.slice(2).map((m, i) => <Bubble key={i + 2} m={m} />)}

        {stage === 'loading' && (
          <div className="funnel-loading">
            {LOADING_STEPS.map((s, i) => (
              <div key={s} className={`funnel-loading-step ${i < loadingStep ? 'done' : i === loadingStep ? 'now' : ''}`}>
                {i < loadingStep ? '✓' : '•'} {s}
              </div>
            ))}
            <div className="funnel-gauge"><div className="funnel-gauge-fill" style={{ width: `${(loadingStep / LOADING_STEPS.length) * 100}%` }} /></div>
          </div>
        )}

        {stage === 'result' && (
          <>
            <ResumeDoc resume={resume} targetJob={targetJob} />
            <div className="funnel-actions">
              <button className="btn-primary" onClick={() => window.print()}>
                📄 {targetJob ? '이 공고 맞춤 이력서' : '이력서'} PDF로 저장하기
              </button>
            </div>
            <JobMatches matches={matches} selectedId={selectedJob} onSelect={setSelectedJob} />
            <button className="funnel-restart" onClick={restart}>처음부터 다시</button>
            <p className="funnel-privacy">
              응답 내용은 이름을 뺀 익명 자료로 저장되어 시니어 일자리·업계 연구와 서비스 개선에
              활용됩니다. 성함은 이력서에만 쓰입니다.
            </p>
          </>
        )}
      </div>

      {chips.length > 0 && (
        <div className="funnel-chips" role="group" aria-label="답변 선택">
          {chips.map((c) => (
            <button key={c.label} className="funnel-chip" disabled={!chipsEnabled || autoTyping} onClick={() => handleChip(c.label)}>
              {c.emoji && <span aria-hidden>{c.emoji} </span>}
              {c.label}
            </button>
          ))}
        </div>
      )}

      {stage !== 'result' && stage !== 'loading' && stage !== 'greeting' && (
        <div className="funnel-inputbar">
          {manualMode ? (
            currentStep?.input === 'text' ? (
              <textarea
                className="funnel-input funnel-textarea"
                autoFocus
                rows={3}
                value={inputText}
                placeholder="말씀하시듯 편하게 쓰시면 됩니다"
                onChange={(e) => setInputText(e.target.value)}
              />
            ) : (
              <input
                className="funnel-input"
                autoFocus
                value={inputText}
                placeholder={stage === 'name' ? '성함을 입력해 주세요' : '편하게 입력해 주세요'}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && inputText.trim()) commitAnswer(inputText.trim()); }}
              />
            )
          ) : (
            <div className={`funnel-input ${inputText ? '' : 'empty'}`}>
              {inputText || '아래 버튼을 눌러 주세요'}
              {inputText && <span className="funnel-caret" />}
            </div>
          )}
          <button
            className="funnel-send"
            aria-label="전송"
            disabled={!inputText.trim() || autoTyping || !manualMode}
            onClick={() => manualMode && inputText.trim() && commitAnswer(inputText.trim())}
          >
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
      {m.text.split('\n').map((line, i) => (
        <span key={i}>
          {i > 0 && <br />}
          {line}
        </span>
      ))}
      {m.typing && <span className="funnel-caret" />}
    </div>
  );
}

/** 소셜프루프 토스트 — 문구는 MOCK */
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
