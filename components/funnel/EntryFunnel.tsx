'use client';

/**
 * 진입 퍼널 v3 — 대화형 이력서 작성.
 *
 * 설계
 * - 14문항 대화. 답할 때마다 상단 게이지("이력서 N% 완성")가 차오르고,
 *   게이지를 누르면 채워지는 이력서를 실시간으로 볼 수 있다 — 완성 과정이 동기부여.
 * - 질문 흐름은 lib/funnelData.ts의 FLOW 배열(데이터)이다. 질문 추가 = 데이터 추가.
 * - 모든 응답은 Firestore에 저장 — 특히 성과·암묵지·목표가 B2B/B2C 데이터.
 * - 완료 후: 흰 종이 경력기술서 + 규칙 기반 일자리 추천 + 공고 맞춤 재배치 + PDF.
 *
 * ⚠ MOCK 수치 — TOAST_FEED / GREETING의 "314명" 등은 실측 아님. 실측 전 출시 금지.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import ResumeDoc from './ResumeDoc';
import JobMatches from './JobMatches';
import {
  FLOW, buildResume, resumeProgress, SAMPLE_ANSWERS,
  type Answers, type Chip,
} from '@/lib/funnelData';
import { matchJobs, JOB_POOL } from '@/lib/jobMatch';
import { newSessionId, saveFunnel, type FunnelStep } from '@/lib/funnelCollect';

type Role = 'bot' | 'user';
interface Msg { role: Role; text: string; typing?: boolean }
type Stage = 'greeting' | 'flow' | 'loading' | 'name' | 'result';

// MOCK: 실측 아님 — 출시 전 실제 이벤트 피드로 교체
const TOAST_FEED = [
  "🔥 방금 전, '제조업 품질관리 25년' 선배님의 이력서가 완성되었습니다.",
  "🔥 방금 전, '건설 현장소장 30년' 선배님의 이력서가 완성되었습니다.",
  "🔥 방금 전, '은행 지점장 22년' 선배님의 이력서가 완성되었습니다.",
];
// MOCK: "314명"은 실측 아님
const GREETING = [
  '반갑습니다, 대표님! 👏 저는 대표님의 평생 경력을 기업에 바로 낼 수 있는 이력서로 정리해 드리는 달나루입니다.',
  '이번 주에만 314명의 선배님들이 아래와 같은 이력서를 만들어 가셨습니다.',
];
const GREETING_AFTER_TEASER =
  '몇 가지만 여쭤보면 됩니다. 타이핑은 없습니다 — 버튼만 눌러 주세요. 위의 게이지에서 이력서가 채워지는 걸 보실 수 있습니다.';

const LOADING_STEPS = [
  '응답하신 내용을 경력기술서 형식으로 조판 중…',
  '성과를 수치 중심으로 정리 중…',
  '대표님 조건과 맞는 일자리 대조 중…',
];

export default function EntryFunnel() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [stage, setStage] = useState<Stage>('greeting');
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [inputText, setInputText] = useState('');
  const [chipsEnabled, setChipsEnabled] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  const session = useRef({ id: newSessionId(), startedAt: 0, steps: [] as FunnelStep[] });
  const scrollRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, inputText, showTeaser, loadingStep, stage, selectedJob]);

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

  // 인사 → 티저 → 첫 질문
  useEffect(() => {
    session.current.startedAt = Date.now();
    later(() => botSay(GREETING[0], () =>
      later(() => botSay(GREETING[1], () =>
        later(() => {
          setShowTeaser(true);
          later(() => botSay(GREETING_AFTER_TEASER, () =>
            later(() => {
              setStage('flow');
              botSay(FLOW[0].ask({}), () => setChipsEnabled(true));
            }, 250),
          ), 900);
        }, 300),
      ), 350),
    ), 700);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentStep = stage === 'flow' ? FLOW[stepIdx] : null;

  const chips: Chip[] =
    stage === 'flow' && currentStep ? currentStep.chips(answers)
    : stage === 'name' ? [{ emoji: '🙈', label: '이름 없이 만들기' }, { emoji: '✍️', label: '직접 입력할게요' }]
    : [];

  const handleChip = (label: string) => {
    if (!chipsEnabled) return;
    navigator.vibrate?.(12);
    if (label === '직접 입력할게요') { setManualMode(true); return; }
    if (stage === 'name' && label === '이름 없이 만들기') { commitAnswer(''); return; }
    setChipsEnabled(false);
    const sentence = currentStep ? currentStep.sentence(label) : label;
    let i = 0;
    const type = () => {
      i += 1;
      setInputText(sentence.slice(0, i));
      if (i < sentence.length) later(type, 36);
      else later(() => commitAnswer(label, sentence), 320);
    };
    later(type, 100);
  };

  const commitAnswer = (label: string, sentence?: string) => {
    setInputText('');
    setManualMode(false);
    const shown = sentence ?? label;
    if (shown) setMessages((m) => [...m, { role: 'user', text: shown }]);

    if (stage === 'name') {
      setAnswers((a) => ({ ...a, name: label.trim() }));
      record('성함', label.trim() ? '(입력함)' : '(건너뜀)', true); // 이름 원문은 이력서에만
      later(() => {
        setStage('result');
        botSay('완성됐습니다! 기업에 바로 제출할 수 있는 형식으로 정리했고, 맞는 일자리도 함께 찾아 두었습니다. 공고를 누르면 그 공고에 맞춰 이력서가 다시 정렬됩니다.');
      }, 400);
      return;
    }

    if (!currentStep) return;
    const skipped = currentStep.skipLabel === label;
    const nextAnswers: Answers = skipped ? answers : { ...answers, [currentStep.key]: label };
    if (!skipped) {
      setAnswers(nextAnswers);
      record(currentStep.key, label);
    }

    const nextIdx = stepIdx + 1;
    if (nextIdx < FLOW.length) {
      setStepIdx(nextIdx);
      later(() => botSay(FLOW[nextIdx].ask(nextAnswers), () => setChipsEnabled(true)), 420);
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
      botSay('거의 다 됐습니다! 이력서에 올릴 성함만 알려주세요. (원치 않으시면 이름 없이 만들어 드립니다)', () => setChipsEnabled(true));
    }, 850 * LOADING_STEPS.length + 350);
  };

  const progress = stage === 'result' ? 100 : resumeProgress(answers);
  const resume = buildResume(answers);
  const sampleResume = buildResume(SAMPLE_ANSWERS);
  const matches = stage === 'result' ? matchJobs(answers) : [];
  const targetJob = selectedJob ? JOB_POOL.find((j) => j.id === selectedJob) ?? null : null;

  return (
    <div className="funnel-shell">
      <ToastNudge />

      {/* 이력서 완성도 게이지 — 누르면 실시간 미리보기 */}
      {stage !== 'greeting' && stage !== 'result' && (
        <button className="resume-gaugebar" onClick={() => setShowPreview((v) => !v)}>
          <span>📄 내 이력서 {progress}% 완성</span>
          <span className="resume-gaugebar-hint">{showPreview ? '접기 ▲' : '보기 ▼'}</span>
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
        {showTeaser && stage === 'greeting' && (
          <div className="resume-teaser">
            <div className="profile-teaser-label">완성 예시</div>
            <ResumeDoc resume={sampleResume} />
          </div>
        )}
        {showTeaser && stage !== 'greeting' && null}
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
            <button className="funnel-restart" onClick={() => window.location.reload()}>처음부터 다시</button>
            <p className="funnel-privacy">
              선택하신 내용(분야·기간·역할·성과·목표 등)은 서비스 개선을 위해 저장됩니다. 성함은 이력서에만 쓰입니다.
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

      {stage !== 'result' && stage !== 'loading' && (
        <div className="funnel-inputbar">
          {manualMode ? (
            <input
              className="funnel-input"
              autoFocus
              value={inputText}
              placeholder={stage === 'name' ? '성함을 입력해 주세요' : '편하게 입력해 주세요'}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && inputText.trim()) commitAnswer(inputText.trim()); }}
            />
          ) : (
            <div className={`funnel-input ${inputText ? '' : 'empty'}`}>
              {inputText || '아래 버튼을 눌러 주세요'}
              {inputText && <span className="funnel-caret" />}
            </div>
          )}
          <button className="funnel-send" aria-label="전송" disabled={!inputText.trim()} onClick={() => inputText.trim() && commitAnswer(inputText.trim())}>
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
