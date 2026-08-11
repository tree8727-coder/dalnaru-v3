'use client';

/**
 * 지혜 남기기 — 아담 실험의 첫 조각.
 *
 * 가설: 30년 전문가의 "이럴 땐 이렇게 한다"(판단력)는 책에 없는 지식이고,
 *       AI를 만드는 회사들이 이런 전문가 지식을 돈 주고 산다(Mercor의 실제 매출원).
 *       한국에서 시니어 전문가의 판단 데이터를 모으는 곳은 아직 없다.
 *
 * 실험 규모: 크게 걸지 않는다. 이 페이지 하나로 몇 명이 끝까지 남기는지,
 *       그 내용이 팔 만한 품질인지부터 본다. 페이지가 채워지지 않으면 접는다.
 *
 * 동의: 퍼널의 "통계·연구" 동의와 별개다. 여기서는 "AI 학습 자료로 만드는 데
 *       동의"를 명시적 체크로 받고, 체크 없으면 저장 자체가 안 된다(saveWisdom).
 */

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { FIELD_CHIPS } from '@/lib/funnelData';
import { newSessionId, saveWisdom } from '@/lib/funnelCollect';
import { useSpeech } from '@/lib/useSpeech';

const QUESTIONS = [
  '새로 온 후배가 가장 자주 하는 실수는 무엇이고, 어떻게 막습니까?',
  '겉으로는 문제없어 보이는데 "뭔가 이상하다" 싶을 때, 무엇을 먼저 확인하십니까?',
  '이 일을 30년 하면서 얻은, 책에는 안 나오는 요령을 하나만 적어 주십시오.',
];

export default function WisdomPage() {
  const sid = useMemo(() => newSessionId(), []);
  const [field, setField] = useState('');
  const [answers, setAnswers] = useState<string[]>(['', '', '']);
  const [consent, setConsent] = useState(false);
  const [done, setDone] = useState(false);
  const speech = useSpeech('ko-KR');
  const [hearing, setHearing] = useState<number | null>(null);

  const filled = answers.filter((a) => a.trim().length >= 10).length;
  const ready = Boolean(field) && filled >= 1 && consent;

  function dictate(i: number) {
    if (speech.listening) { speech.stop(); setHearing(null); return; }
    setHearing(i);
    speech.start((text) => {
      // 말한 내용을 기존 답에 이어 붙인다 — 긴 이야기를 끊어 말해도 쌓이게
      setAnswers((s) => s.map((a, j) => (j === i ? (a ? a + ' ' : '') + text : a)));
      setHearing(null);
    });
  }

  async function submit() {
    await saveWisdom(sid, {
      field,
      answers: QUESTIONS.map((q, i) => ({ q, a: answers[i].trim() })).filter((x) => x.a),
      consent,
    });
    setDone(true);
  }

  if (done) {
    return (
      <main className="wisdom-shell">
        <h1 className="wisdom-title">남겨 주셔서 감사합니다.</h1>
        <p className="wisdom-lead">
          30년의 요령은 사라지기엔 아까운 지식입니다. 소중히 보관하고,
          약속드린 용도(인공지능 학습 자료) 외에는 쓰지 않습니다.
        </p>
        <Link href="/funnel" className="wisdom-btn">이력서도 만들어 보기</Link>
      </main>
    );
  }

  return (
    <main className="wisdom-shell">
      <h1 className="wisdom-title">30년 요령, 세 가지만 남겨 주십시오</h1>
      <p className="wisdom-lead">
        오래 일하신 분의 &ldquo;이럴 땐 이렇게 한다&rdquo;는 책에 없는 지식입니다.
        이런 지식은 인공지능을 가르치는 자료로 값어치가 있습니다.
        타이핑 대신 <b>🎤 말로</b> 버튼을 눌러 말씀하셔도 됩니다.
      </p>

      <section className="wisdom-block">
        <h2 className="wisdom-q">어느 분야에서 일하셨습니까?</h2>
        <div className="wisdom-chips">
          {FIELD_CHIPS.filter((c) => !c.label.includes('직접')).map((c) => (
            <button key={c.label} type="button"
              className={`wisdom-chip${field === c.label ? ' on' : ''}`}
              onClick={() => setField(c.label)}>
              {c.emoji} {c.label}
            </button>
          ))}
        </div>
      </section>

      {QUESTIONS.map((q, i) => (
        <section className="wisdom-block" key={q}>
          <h2 className="wisdom-q">{i + 1}. {q}</h2>
          <textarea
            className="wisdom-input"
            rows={4}
            placeholder="편하게, 후배에게 말하듯 적어 주십시오"
            value={answers[i]}
            onChange={(e) => setAnswers((s) => s.map((a, j) => (j === i ? e.target.value : a)))}
          />
          {speech.supported && (
            <button type="button" className={`wisdom-mic${hearing === i ? ' on' : ''}`}
              onClick={() => dictate(i)}>
              {hearing === i ? '듣는 중… (누르면 멈춤)' : '🎤 말로 답하기'}
            </button>
          )}
        </section>
      ))}
      {speech.error && <p className="wisdom-err" role="alert">{speech.error}</p>}

      <label className="wisdom-consent">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
        <span>
          제가 남긴 내용(이름 없음)을 <b>인공지능 학습 자료로 만드는 데 동의합니다.</b>
          <small>동의하지 않으시면 저장되지 않습니다. 이름·연락처는 받지 않습니다.</small>
        </span>
      </label>

      <button type="button" className="wisdom-btn" disabled={!ready} onClick={submit}>
        {!field ? '분야를 골라 주십시오'
          : filled < 1 ? '한 가지 이상 적어 주십시오'
          : !consent ? '동의에 체크해 주십시오'
          : '남기기'}
      </button>
    </main>
  );
}
