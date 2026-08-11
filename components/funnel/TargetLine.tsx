'use client';

/**
 * 공고 맞춤 한 줄 — 공고를 고르면 그 공고에 맞춰 딱 하나만 더 묻는다.
 *
 * 왜 하나만 — 이미 긴 대화를 마친 직후다. 여기서 양식을 또 내밀면 이탈한다.
 * 기업별 이력서 양식을 그대로 불러오는 것은 불가(로그인·저작물 — 기존 조사)라서,
 * "그 공고가 찾는 것 + 그에 맞는 내 경험 한 줄"이 현실적인 최대치이자
 * 인사담당자 눈에는 가장 크게 보이는 차이다.
 */

import { useState } from 'react';
import type { JobPosting } from '@/lib/jobMatch';
import { useSpeech } from '@/lib/useSpeech';

interface Props {
  job: JobPosting;
  value: string;
  onSave: (line: string) => void;
}

export default function TargetLine({ job, value, onSave }: Props) {
  const [text, setText] = useState(value);
  const [saved, setSaved] = useState(Boolean(value));
  const speech = useSpeech('ko-KR');
  const [hearing, setHearing] = useState(false);

  function dictate() {
    if (speech.listening) { speech.stop(); setHearing(false); return; }
    setHearing(true);
    speech.start((t) => { setText((s) => (s ? s + ' ' : '') + t); setHearing(false); });
  }

  if (saved) {
    return (
      <p className="targetline-done">
        ✔ 이 공고 맞춤 한 줄이 이력서 맨 위에 실렸습니다.{' '}
        <button type="button" className="targetline-edit" onClick={() => setSaved(false)}>고치기</button>
      </p>
    );
  }

  return (
    <div className="targetline">
      <p className="targetline-q">
        <b>『{job.title}』</b>에 맞춰 딱 한 줄만 —<br />
        이 일과 관련해 가장 자신 있는 경험이나 강점 하나만 적어 주십시오.
      </p>
      <textarea
        className="targetline-input"
        rows={2}
        placeholder="예: 같은 규모 현장을 10년 넘게 무사고로 운영했습니다"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="targetline-actions">
        {speech.supported && (
          <button type="button" className={`targetline-mic${hearing ? ' on' : ''}`} onClick={dictate}>
            {hearing ? '듣는 중…' : '🎤 말로'}
          </button>
        )}
        <button
          type="button"
          className="targetline-btn"
          disabled={text.trim().length < 5}
          onClick={() => { onSave(text.trim()); setSaved(true); }}
        >
          이력서 맨 위에 싣기
        </button>
      </div>
    </div>
  );
}
