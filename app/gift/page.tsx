'use client';

/**
 * 부모님 이력서 선물하기 — 유입 방향 뒤집기.
 * 시니어가 스스로 오길 기다리지 않고, 디지털 문턱이 낮은 자녀가 시작해
 * 부모에게 링크를 보낸다. (전파자·결제자는 자녀라는 vault 관찰 기반)
 *
 * 백엔드 없이 동작: 선물 정보를 URL에 담아 /funnel이 읽는다.
 */

import { useState } from 'react';
import { newSessionId, saveFunnel } from '@/lib/funnelCollect';

const TO_CHIPS = ['아버지', '어머니', '부모님', '장인어른', '장모님'];
const FIELD_CHIPS = ['건설/건축', '기계/제조', '금융/영업', '교육/연구', '물류/유통', '잘 모르겠어요'];

export default function GiftPage() {
  const [to, setTo] = useState('');
  const [from, setFrom] = useState('');
  const [field, setField] = useState('');
  const [copied, setCopied] = useState(false);

  const ready = to && from.trim();
  const link = () => {
    const payload = { to, from: from.trim(), field: field === '잘 모르겠어요' ? '' : field };
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    return `${window.location.origin}/funnel?g=${encoded}`;
  };
  const message = () =>
    `${to}, 저 ${from.trim()}이에요.\n` +
    `${to} 평생 일하신 이야기, 이력서 한 장으로 정리해 드리고 싶어서 준비했어요.\n` +
    `아래 링크 누르고 버튼만 몇 번 눌러 주세요. 3분이면 돼요.\n\n` +
    link();

  const copy = () => {
    void navigator.clipboard?.writeText(message());
    setCopied(true);
    const s = { id: newSessionId(), startedAt: Date.now() };
    void saveFunnel(s.id, { steps: [{ q: 'gift-created', a: `${to}/${field || '분야미상'}`, tMs: 0 }] });
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="funnel-shell calc-shell">
      <div className="calc-scroll">
        <h1 className="calc-title">부모님께 이력서를 선물하세요</h1>
        <p className="calc-sub">
          평생 일하신 경력을 <strong>3분 대화로 이력서 한 장</strong>으로 만들어 드리는 서비스입니다.
          자녀분이 링크만 보내드리면, 부모님은 버튼만 누르시면 됩니다.
        </p>

        <div className="calc-row">
          <div className="calc-label">누구께 보내세요?</div>
          <div className="funnel-chips" style={{ padding: '4px 0' }}>
            {TO_CHIPS.map((t) => (
              <button key={t} className={`funnel-chip ${to === t ? 'chip-on' : ''}`} onClick={() => setTo(t)}>{t}</button>
            ))}
          </div>
        </div>

        <div className="calc-row">
          <div className="calc-label">보내는 분 성함 (또는 호칭 — 예: 큰딸, 막내)</div>
          <input
            className="funnel-input gift-input"
            value={from}
            placeholder="예: 지현 / 큰아들"
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>

        <div className="calc-row">
          <div className="calc-label">어느 분야에서 일하셨는지 아세요? (모르셔도 됩니다)</div>
          <div className="funnel-chips" style={{ padding: '4px 0' }}>
            {FIELD_CHIPS.map((f) => (
              <button key={f} className={`funnel-chip ${field === f ? 'chip-on' : ''}`} onClick={() => setField(f)}>{f}</button>
            ))}
          </div>
        </div>

        {ready && (
          <div className="calc-result">
            <div className="call-label">카톡으로 보낼 메시지 (누르면 복사됩니다)</div>
            <pre className="gift-preview">{message()}</pre>
            <button className="btn-primary calc-cta-btn" onClick={copy}>
              {copied ? '✓ 복사됐습니다 — 카톡에 붙여넣으세요' : '💌 메시지 복사하기'}
            </button>
            <p className="funnel-privacy">
              링크를 받으신 부모님 화면에는 "{from.trim() || '○○'}님이 준비한 선물"이라는 인사가 먼저 나옵니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
