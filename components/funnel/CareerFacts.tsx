'use client';

/**
 * 제출용 사실 입력.
 *
 * 왜 필요한가 —
 *   칩 선택만으로 만든 이력서는 같은 분야를 고른 사람끼리 완전히 같은 문서가 된다.
 *   회사명·재직기간·직책이 없으면 인사담당자가 첫 줄에서 거른다. 즉 제출이 불가능하다.
 *   "타이핑 없이"라는 원칙이 결과물의 쓸모를 없애고 있었다.
 *
 * 어떻게 타협했나 —
 *   대화 중에 묻지 않는다. 이력서를 이미 받아 본 뒤에 묻는다. 보상이 먼저다.
 *   칸은 넷뿐이고 전부 건너뛸 수 있다. 회사명과 기간 둘만 채워도 제출용이 된다.
 *
 * 기억이 안 나는 문제 —
 *   30년 전 회사명과 정확한 입·퇴사일은 대부분 기억하지 못한다.
 *   국민연금 가입증명서에 사업장명과 기간이 그대로 나오고, 본인이 무료로 발급받는다.
 *   그 안내를 같이 두지 않으면 이 화면은 또 하나의 빈칸으로 남는다.
 */

import { useState } from 'react';
import type { Answers } from '@/lib/funnelData';
import { useSpeech } from '@/lib/useSpeech';

interface Props {
  answers: Answers;
  onSave: (facts: Partial<Answers>) => void;
}

const FIELDS = [
  {
    key: 'factOrg' as const,
    label: '어느 회사에서 일하셨습니까?',
    hint: '가장 오래 계셨던 곳 하나면 됩니다',
    placeholder: '예: 대한건설(주)',
    required: true,
  },
  {
    key: 'factPeriod' as const,
    label: '언제부터 언제까지 다니셨습니까?',
    hint: '연도와 월까지만 아시면 됩니다',
    placeholder: '예: 2011.03 ~ 2024.08',
    required: true,
  },
  {
    key: 'factTitle' as const,
    label: '직책이 무엇이었습니까?',
    hint: '마지막 직책을 적어 주십시오',
    placeholder: '예: 현장소장',
    required: false,
  },
  {
    key: 'factCert' as const,
    label: '가지고 계신 자격증이 있습니까?',
    hint: '자격증 이름과 딴 해를 적어 주십시오',
    placeholder: '예: 건설안전기사 (2015)',
    required: false,
  },
];

export default function CareerFacts({ answers, onSave }: Props) {
  const [v, setV] = useState<Record<string, string>>({
    factOrg: answers.factOrg ?? '',
    factPeriod: answers.factPeriod ?? '',
    factTitle: answers.factTitle ?? '',
    factCert: answers.factCert ?? '',
  });
  const [saved, setSaved] = useState(false);
  const [openTip, setOpenTip] = useState(false);
  // 음성 입력 — 지원 브라우저(Chrome 계열)에서만 버튼이 나타난다. 삼성 인터넷은 미지원.
  const speech = useSpeech('ko-KR');
  const [hearing, setHearing] = useState<string | null>(null); // 지금 듣고 있는 칸

  function dictate(key: string) {
    if (speech.listening) { speech.stop(); setHearing(null); return; }
    setHearing(key);
    speech.start((text) => {
      // 결과는 칸에 넣기만 한다 — 자동 제출하지 않는다. 틀리면 사용자가 고친다.
      setV((s) => ({ ...s, [key]: text }));
      setHearing(null);
    });
  }

  const ready = Boolean(v.factOrg.trim() && v.factPeriod.trim());

  function submit() {
    onSave(v);
    setSaved(true);
  }

  return (
    <section className="facts" aria-labelledby="facts-title">
      <h3 id="facts-title" className="facts-title">
        {saved ? '이제 제출하실 수 있습니다.' : '한 가지만 더 — 이대로는 제출이 어렵습니다.'}
      </h3>

      {!saved && (
        <p className="facts-lead">
          위 이력서에는 <strong>회사 이름과 다니신 기간</strong>이 빠져 있습니다.
          인사담당자가 가장 먼저 보는 칸이라, 비어 있으면 읽지 않고 넘깁니다.
          <strong> 두 칸만 채우시면</strong> 그대로 내실 수 있는 이력서가 됩니다.
        </p>
      )}

      {!saved && (
        <div className="facts-tip">
          <button
            type="button"
            className="facts-tip-toggle"
            aria-expanded={openTip}
            onClick={() => setOpenTip((o) => !o)}
          >
            {openTip ? '▾' : '▸'} 회사 이름이나 날짜가 기억나지 않으신가요?
          </button>
          {openTip && (
            <div className="facts-tip-body">
              <p>
                <strong>국민연금 가입증명서</strong>를 떼시면 다니셨던 회사 이름과
                기간이 전부 나와 있습니다. <strong>무료</strong>이고, 회사에 연락하지
                않으셔도 됩니다.
              </p>
              <p className="facts-tip-how">
                국민연금공단 전자민원 또는 정부24에서 &lsquo;가입증명서&rsquo;로 발급받으실 수 있습니다.
                가까운 국민연금공단 지사에 전화하셔도 됩니다.
              </p>
              <a
                className="facts-tip-link"
                href="https://www.nps.or.kr/elctcvlcpt/comm/getOHAC0000M5.do?menuId=MN24001054"
                target="_blank"
                rel="noopener noreferrer"
              >
                국민연금 가입증명서 발급하러 가기
              </a>
            </div>
          )}
        </div>
      )}

      {!saved &&
        FIELDS.map((f) => (
          <label key={f.key} className="facts-field">
            <span className="facts-label">
              {f.label}
              {!f.required && <em className="facts-optional">선택</em>}
            </span>
            <span className="facts-hint">{f.hint}</span>
            <span className="facts-row">
              <input
                className="facts-input"
                type="text"
                inputMode="text"
                autoComplete="off"
                placeholder={f.placeholder}
                value={v[f.key]}
                onChange={(e) => setV((s) => ({ ...s, [f.key]: e.target.value }))}
              />
              {speech.supported && (
                <button
                  type="button"
                  className={`facts-mic${hearing === f.key ? ' on' : ''}`}
                  aria-label={hearing === f.key ? '듣는 중 — 누르면 멈춥니다' : '말로 입력하기'}
                  onClick={() => dictate(f.key)}
                >
                  {hearing === f.key ? '듣는 중…' : '🎤 말로'}
                </button>
              )}
            </span>
          </label>
        ))}

      {!saved && speech.error && <p className="facts-mic-err" role="alert">{speech.error}</p>}

      {!saved && (
        <div className="facts-actions">
          <button type="button" className="facts-btn" disabled={!ready} onClick={submit}>
            {ready ? '이력서에 넣기' : '회사 이름과 기간을 채워 주십시오'}
          </button>
          <button type="button" className="facts-skip" onClick={() => setSaved(true)}>
            나중에 하겠습니다
          </button>
        </div>
      )}

      {saved && (
        <p className="facts-done">
          {ready
            ? '위 이력서에 반영되었습니다. 인쇄하시거나 저장해서 그대로 내십시오.'
            : '회사 이름과 기간은 비어 있습니다. 제출하시기 전에 손으로라도 꼭 채워 넣으십시오.'}
        </p>
      )}
    </section>
  );
}
