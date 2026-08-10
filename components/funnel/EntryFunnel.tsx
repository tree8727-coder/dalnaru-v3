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
import MemoirCard from './MemoirCard';
import {
  FLOW, ENRICH_STEPS, REWARD_BY_KEY, ACK_BY_KEY, EDU_CHIPS,
  buildResume, buildMemoir, resumeProgress, SAMPLE_ANSWERS,
  type Answers, type Chip,
} from '@/lib/funnelData';
import { matchJobs, matchWorknet, type JobMatch, type WorknetJob } from '@/lib/jobMatch';
import { newSessionId, saveFunnel, type FunnelStep } from '@/lib/funnelCollect';

type Role = 'bot' | 'user';
interface Msg { role: Role; text: string; typing?: boolean }
type Stage = 'greeting' | 'gate' | 'flow' | 'loading' | 'name' | 'result';

const STORE_KEY = 'dalnaru_funnel_v3';
const FONT_KEY = 'dalnaru_font_large';

/* 조급함을 파는 문구("방금 전 ○○님 완성")는 쓰지 않는다.
 * 이 나이대에 필요한 것은 재촉이 아니라 존중과 안심이다. 숫자 과시도 하지 않는다.
 * 신뢰 문구는 화면(UI)에 붙이지 않고 대화 속에서 자연스럽게 — 글씨가 늘면 부담이다. */
const GREETING = [
  '안녕하세요, 대표님. 서강대 연구실에서 시작한 달나루입니다. 평생 일해오신 경력은 그 자체로 자산입니다.',
  '저희가 그 경험을 기업이 알아보는 이력서 한 장으로 정리해 드립니다. 아래가 완성 예시입니다 — 천천히 살펴보세요. 서두르실 것 없습니다.',
];
const PROMISE =
  '대화를 마치면 두 가지를 드립니다.\n① 위 형식의 제출용 이력서 (PDF 저장 가능)\n② 대표님 조건에 맞는 일자리 안내\n\n2~3분이면 됩니다. 타이핑 없이 버튼만 누르시면 되고, 어려운 질문은 없습니다.\n중간에 쉬어가셔도 응답은 저장되어 있으니 언제든 이어서 하실 수 있습니다.\n\n응답 내용은 이름을 뺀 자료로 통계 작성과 시니어 일자리 연구에 활용됩니다. 시작하시면 동의하신 것으로 알겠습니다.';

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
  const [jobResult, setJobResult] = useState<{ matches: JobMatch[]; label: string } | null>(null);
  const [enrichOpen, setEnrichOpen] = useState<string | null>(null);
  const [enrichText, setEnrichText] = useState('');
  const [fontLarge, setFontLarge] = useState(false);
  const [showMemoir, setShowMemoir] = useState(false);

  // 회고 카드 인쇄: body 클래스로 인쇄 대상을 전환
  const printMemoir = () => {
    document.body.classList.add('print-memoir');
    window.print();
    document.body.classList.remove('print-memoir');
  };

  // 글자 크기 설정 복원 (노안 대응 — 한 번 키우면 계속 유지)
  useEffect(() => {
    try { if (localStorage.getItem(FONT_KEY) === '1') setFontLarge(true); } catch { /* 무시 */ }
  }, []);
  const toggleFont = () => {
    setFontLarge((v) => {
      try { localStorage.setItem(FONT_KEY, v ? '0' : '1'); } catch { /* 무시 */ }
      return !v;
    });
  };

  const session = useRef({ id: newSessionId(), startedAt: 0, steps: [] as FunnelStep[] });
  const gift = useRef<{ to?: string; from?: string; field?: string } | null>(null); // /gift 링크로 온 경우
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

  // 시작: 선물 링크 > 이어하기 > 일반 인사
  useEffect(() => {
    session.current.startedAt = Date.now();
    try {
      const g = new URLSearchParams(window.location.search).get('g');
      if (g) gift.current = JSON.parse(decodeURIComponent(escape(atob(g))));
    } catch { gift.current = null; }
    // 안내데스크의 "지난번 이력서 다시 보기"로 온 경우 — 바로 결과 화면 복원
    if (new URLSearchParams(window.location.search).get('view') === '1') {
      try {
        const done = JSON.parse(localStorage.getItem('dalnaru_done') ?? 'null');
        if (done?.answers?.field) {
          setAnswers(done.answers);
          setStage('result');
          later(() => botSay('다시 오셨네요! 지난번에 만드신 이력서입니다. 공고 추천도 새로 찾아 두었습니다.'), 400);
          return;
        }
      } catch { /* 무시 */ }
    }
    if (gift.current?.from) {
      const gf = gift.current;
      record('gift-opened', `${gf.to ?? ''}/${gf.field ?? '분야미상'}`);
      later(() => botSay(
        `${gf.to ?? '어르신'}, 안녕하세요! ${gf.from}님이 ${gf.to ?? '어르신'}를 위해 준비한 선물입니다. 평생 일해오신 경력은 그 자체로 자산이에요 — 저희가 그걸 기업이 알아보는 이력서 한 장으로 정리해 드릴게요.`,
        () => later(() => botSay(GREETING[1], () =>
          later(() => {
            setShowTeaser(true);
            later(() => botSay(PROMISE, () => { setStage('gate'); setChipsEnabled(true); }), 1200);
          }, 300),
        ), 350),
      ), 600);
      return;
    }
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

  const askStep = (idx: number, a: Answers, ack?: string) => {
    setStepIdx(idx);
    const text = ack ? `${ack} ${FLOW[idx].ask(a)}` : FLOW[idx].ask(a);
    later(() => botSay(text, () => {
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
      record('consent', '시작하기 = 통계·연구 활용 동의 문구 표시 후 동의');
      setStage('flow');
      // 선물 링크에 분야가 있으면 첫 질문을 건너뛴다 (자녀가 미리 채워둠)
      if (gift.current?.field) {
        const pre: Answers = { field: gift.current.field };
        setAnswers(pre);
        botSay(`${gift.current.from}님께 들으니 ${gift.current.field} 분야에서 일해오셨다고요.`, () => askStep(1, pre));
      } else {
        askStep(0, answers);
      }
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
      const done: Answers = { ...answers, name: label.trim() };
      setAnswers(done);
      record('성함', label.trim() ? '(입력함)' : '(건너뜀)', true); // 이름 원문은 이력서에만
      localStorage.removeItem(STORE_KEY); // 완주 — 이어하기 데이터 정리
      // 완성본을 로컬에 보관 — 재방문 시 안내데스크가 알아보고 다시 보여줄 수 있게
      try {
        localStorage.setItem('dalnaru_done', JSON.stringify({ answers: done, giftFrom: gift.current?.from ?? null }));
      } catch { /* 무시 */ }
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
      // 경청·칭찬 맞장구를 다음 질문 앞에 붙인다 (서비스직 톤)
      const ack = !skipped ? ACK_BY_KEY[currentStep.key]?.(label) : undefined;
      askStep(nextIdx, nextAnswers, ack);
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

  // 결과 단계: 워크넷 실공고 시도 → 없으면 예시 공고
  useEffect(() => {
    if (stage !== 'result') return;
    let alive = true;
    fetch(`/api/jobs?keyword=${encodeURIComponent(answers.field ?? '')}`)
      .then((r) => r.json())
      .then((d: { source: string; jobs?: WorknetJob[] }) => {
        if (!alive) return;
        if (d.source === 'worknet' && d.jobs?.length) {
          setJobResult({ matches: matchWorknet(d.jobs, answers), label: '워크넷 실시간 공고 · 출처 고용24' });
        } else {
          setJobResult({ matches: matchJobs(answers), label: '예시 공고 — 실제 공고 연동 준비 중' });
        }
      })
      .catch(() => alive && setJobResult({ matches: matchJobs(answers), label: '예시 공고 — 실제 공고 연동 준비 중' }));
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  // 지급 후 업그레이드: 답하면 이력서가 눈앞에서 좋아진다
  const submitEnrich = (key: string) => {
    const text = enrichText.trim();
    if (!text) return;
    setAnswers((a) => ({ ...a, [key]: text }));
    record(key, text);
    setEnrichOpen(null);
    setEnrichText('');
    const slot = REWARD_BY_KEY[key];
    if (slot) {
      setReward(`✓ 「${slot}」에 반영됐습니다`);
      later(() => setReward(null), 2000);
    }
  };

  const progress = stage === 'result' ? 100 : resumeProgress(answers);
  const resume = buildResume(answers);
  const sampleResume = buildResume(SAMPLE_ANSWERS);
  const matches = jobResult?.matches ?? [];
  const targetJob = selectedJob ? matches.find((m) => m.job.id === selectedJob)?.job ?? null : null;

  return (
    <div className={`funnel-shell ${fontLarge ? 'font-large' : ''}`}>
      {/* 글자 크기 버튼만 — 화면 글씨를 늘리지 않는다. 신뢰 문구는 대화(인사)에 있다 */}
      <div className="trust-strip">
        <button className="font-toggle" onClick={toggleFont} aria-label="글자 크기 바꾸기">
          {fontLarge ? '가 보통 크기' : '가⁺ 글자 크게'}
        </button>
      </div>

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
            {reward && <div className="enrich-reward">{reward}</div>}
            {/* 공고 지원 양식 완성: 부족한 항목만 짧게 추가로 묻는다 */}
            {targetJob && !answers.eduLevel && (
              <div className="enrich-card open">
                <div className="enrich-body" style={{ paddingTop: 14 }}>
                  <p className="enrich-ask">이 공고에 지원하는 양식으로 완성하려면 하나만 더 여쭐게요 — 최종 학력이 어떻게 되세요?</p>
                  <div className="funnel-chips">
                    {EDU_CHIPS.map((e) => (
                      <button key={e} className="funnel-chip" onClick={() => {
                        navigator.vibrate?.(12);
                        setAnswers((a) => ({ ...a, eduLevel: e }));
                        record('eduLevel', e);
                        setReward('✓ 「인적 사항」에 반영됐습니다');
                        later(() => setReward(null), 2000);
                      }}>
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <ResumeDoc resume={resume} targetJob={targetJob} />
            <div className="funnel-actions">
              <button className="btn-primary" onClick={() => window.print()}>
                📄 {targetJob ? '이 공고 맞춤 이력서' : '이력서'} PDF로 저장하기
              </button>
            </div>
            {/* 회고 카드 — 같은 대화의 두 번째 출구 (가족 공유용, 효능감) */}
            <div className="funnel-actions" style={{ marginTop: 4 }}>
              <button className="funnel-chip frontdesk-chip" onClick={() => setShowMemoir((v) => !v)}>
                👨‍👩‍👧 {showMemoir ? '회고 카드 접기' : '가족에게 남기는 회고 카드 보기'}
              </button>
            </div>
            {showMemoir && (
              <>
                <MemoirCard memoir={buildMemoir(answers)} />
                <div className="funnel-actions">
                  <button className="btn-primary" onClick={printMemoir}>💌 회고 카드 PDF로 저장하기</button>
                </div>
                <p className="funnel-privacy">가족 단톡에 보내보세요 — 자녀분들이 제일 좋아하는 선물입니다.</p>
              </>
            )}

            {/* 지급 후 업그레이드 — 자유 서술은 보상을 받은 뒤에만 (이탈 방지 설계) */}
            {ENRICH_STEPS.some((s) => !answers[s.key]) && (
              <div className="enrich-wrap">
                <div className="jobs-head">이력서를 더 돋보이게 (선택)</div>
                {ENRICH_STEPS.filter((s) => !answers[s.key]).map((s) => (
                  <div key={s.key} className={`enrich-card ${enrichOpen === s.key ? 'open' : ''}`}>
                    <button
                      className="enrich-toggle"
                      onClick={() => { setEnrichOpen(enrichOpen === s.key ? null : s.key); setEnrichText(''); }}
                    >
                      <span className="enrich-title">✏️ {s.title}</span>
                      <span className="enrich-benefit">{s.benefit}</span>
                    </button>
                    {enrichOpen === s.key && (
                      <div className="enrich-body">
                        <p className="enrich-ask">{s.ask}</p>
                        <textarea
                          className="funnel-input funnel-textarea enrich-textarea"
                          autoFocus
                          rows={3}
                          value={enrichText}
                          placeholder="말씀하시듯 편하게 쓰시면 됩니다"
                          onChange={(e) => setEnrichText(e.target.value)}
                        />
                        <button className="btn-primary enrich-save" disabled={!enrichText.trim()} onClick={() => submitEnrich(s.key)}>
                          이력서에 반영하기
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {/* 창업 준비를 고른 분에게만 — 대화형 가이드로 연결 (니즈 수집까지 이어짐) */}
            {answers.goal === '창업 준비' && (
              <a className="landing-card" href="/guide" style={{ marginTop: 14 }}>
                <span className="landing-card-emoji">🏆</span>
                <span className="landing-card-title">창업 준비하신다니 — 분야별 1등 도구를 알려드립니다</span>
                <span className="landing-card-desc">전 세계 추천 수로 검증된 것 하나씩만. 눈높이에 맞춰서.</span>
              </a>
            )}
            <JobMatches matches={matches} selectedId={selectedJob} onSelect={setSelectedJob} sourceLabel={jobResult?.label ?? '공고 불러오는 중…'} />

            {/* 유기적 연결: 선물로 온 분은 보낸 자녀에게 회신, 아니면 동년배 전파 */}
            <ShareRow giftFrom={gift.current?.from ?? null} onShare={(kind) => record('share-' + kind, '복사')} />

            <button className="funnel-restart" onClick={restart}>처음부터 다시</button>
            <p className="funnel-privacy">
              응답 내용은 이름을 뺀 자료로 저장되어 통계 작성과 시니어 일자리·업계 연구,
              서비스 개선에 활용됩니다. 성함은 이력서에만 쓰입니다.
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

/** 완성 후 전파: 선물 회신(자녀에게) 또는 동년배 소개 — 카톡 텍스트 복사 */
function ShareRow({ giftFrom, onShare }: { giftFrom: string | null; onShare: (kind: string) => void }) {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (kind: string, text: string) => {
    void navigator.clipboard?.writeText(text);
    setCopied(kind);
    onShare(kind);
    setTimeout(() => setCopied(null), 2200);
  };
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return (
    <div className="funnel-actions" style={{ marginTop: 10 }}>
      {giftFrom && (
        <button
          className="funnel-chip frontdesk-chip"
          onClick={() => copy('back', `${giftFrom}아(야), 고맙다. 네가 보내준 걸로 이력서 만들었다. 아버지(어머니) 아직 쓸 만하지? 허허.`)}
        >
          {copied === 'back' ? '✓ 복사됐습니다 — 카톡에 붙여넣으세요' : `💌 ${giftFrom}님께 완성 소식 보내기`}
        </button>
      )}
      <button
        className="funnel-chip frontdesk-chip"
        onClick={() => copy('peer', `나 이걸로 이력서 만들었는데 3분밖에 안 걸리더라고. 버튼만 누르면 돼. 자네도 한번 해봐.\n${origin}`)}
      >
        {copied === 'peer' ? '✓ 복사됐습니다 — 카톡에 붙여넣으세요' : '👥 친구분께 알려주기'}
      </button>
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

