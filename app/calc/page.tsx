'use client';

/**
 * 은퇴 자금 계산기 — Step 1 기획(0806 회의록)의 트래픽 앵커.
 * 큰 +/- 버튼과 즉시 갱신 — 슬라이더·키보드 없음 (시니어 눈높이).
 * 계산은 결정적이고 가정·출처를 화면에 명시한다.
 */

import { useState } from 'react';
import Link from 'next/link';
import { simulate, LIFE_EXPECTANCY, PENSION_START_AGE } from '@/lib/pension';

interface Field {
  key: 'age' | 'assets' | 'pension' | 'spend';
  label: string;
  unit: string;
  step: number;
  min: number;
  max: number;
}

const FIELDS: Field[] = [
  { key: 'age', label: '현재 나이', unit: '세', step: 1, min: 40, max: 80 },
  { key: 'assets', label: '모아둔 금융자산', unit: '만원', step: 1000, min: 0, max: 200000 },
  { key: 'pension', label: '65세부터 월 연금 (예상)', unit: '만원', step: 10, min: 0, max: 500 },
  { key: 'spend', label: '한 달 생활비', unit: '만원', step: 10, min: 50, max: 1000 },
];

export default function CalcPage() {
  const [v, setV] = useState({ age: 58, assets: 20000, pension: 100, spend: 250 });
  const [horizon, setHorizon] = useState(90);
  const [fontLarge, setFontLarge] = useState(false);

  const r = simulate({ ...v, horizon });
  const maxAsset = Math.max(v.assets, 1);

  const bump = (f: Field, dir: 1 | -1) => {
    navigator.vibrate?.(8);
    setV((prev) => ({ ...prev, [f.key]: Math.min(f.max, Math.max(f.min, prev[f.key] + dir * f.step)) }));
  };

  const fmt = (n: number) => n.toLocaleString('ko-KR');

  return (
    <div className={`funnel-shell calc-shell ${fontLarge ? 'font-large' : ''}`}>
      <div className="trust-strip">
        <button className="font-toggle" onClick={() => setFontLarge((x) => !x)}>
          {fontLarge ? '가 보통 크기' : '가⁺ 글자 크게'}
        </button>
      </div>

      <div className="calc-scroll">
        <h1 className="calc-title">내 은퇴 자금, 몇 살까지 버틸까?</h1>
        <p className="calc-sub">네 가지만 맞춰 주세요. 바로 계산됩니다.</p>

        {FIELDS.map((f) => (
          <div key={f.key} className="calc-row">
            <div className="calc-label">{f.label}</div>
            <div className="calc-stepper">
              <button className="calc-btn" onClick={() => bump(f, -1)} aria-label={`${f.label} 줄이기`}>−</button>
              <div className="calc-value">{fmt(v[f.key])}<span className="calc-unit">{f.unit}</span></div>
              <button className="calc-btn" onClick={() => bump(f, 1)} aria-label={`${f.label} 늘리기`}>+</button>
            </div>
          </div>
        ))}

        <div className="calc-row">
          <div className="calc-label">몇 세까지 계획할까요?</div>
          <div className="funnel-chips" style={{ padding: '4px 0' }}>
            {[85, 90, 95].map((h) => (
              <button key={h} className={`funnel-chip ${horizon === h ? 'chip-on' : ''}`} onClick={() => setHorizon(h)}>
                {h}세까지
              </button>
            ))}
          </div>
        </div>

        {/* 결과 */}
        <div className="calc-result">
          {r.depletionAge ? (
            <>
              <div className="calc-verdict">
                지금 생활비 기준, <strong>{r.depletionAge}세</strong>에 자산이 바닥납니다.
              </div>
              <div className="calc-verdict-sub">
                계획하신 {horizon}세까지 <strong>{horizon - r.depletionAge}년</strong>이 비어 있습니다.
                65세 시점 월 <strong>{fmt(r.monthlyGapAt65)}만원</strong>이 부족합니다.
              </div>
            </>
          ) : (
            <div className="calc-verdict ok">
              지금 조건이면 <strong>{horizon}세까지</strong> 자산이 버팁니다. 든든하시네요.
            </div>
          )}

          {/* 자산 잔액 추이 — 단일 시리즈, 끝값만 라벨 (proto 차트 규칙) */}
          <div className="calc-bars">
            {r.series.filter((s) => (s.age - v.age) % 5 === 0 || s.age === r.depletionAge).slice(0, 12).map((s) => (
              <div key={s.age} className="calc-bar-row">
                <span className="calc-bar-age">{s.age}세</span>
                <div className="calc-bar-track">
                  <div
                    className={`calc-bar-fill ${s.assets < 0 ? 'minus' : ''}`}
                    style={{ width: `${Math.min(100, Math.max(2, (Math.abs(s.assets) / maxAsset) * 100))}%` }}
                  />
                </div>
                <span className="calc-bar-val">{s.assets < 0 ? `−${fmt(Math.abs(s.assets))}` : fmt(s.assets)}만원</span>
              </div>
            ))}
          </div>

          <div className="calc-cta">
            <Link href="/funnel" className="btn-primary calc-cta-btn">
              부족분, 일로 채워볼까요? — 3분 이력서 만들기
            </Link>
            <Link href="/guide" className="guide-needs-link" style={{ display: 'block', textAlign: 'center', marginTop: 10 }}>
              🏆 부업·자동화 도구 1등 모음 보기
            </Link>
          </div>
        </div>

        <p className="calc-source">
          가정: 물가 연 2%(한국은행 물가안정목표) · 국민연금 {PENSION_START_AGE}세 수령 ·
          기대수명 {LIFE_EXPECTANCY}세(통계청 2024년 생명표, 2026-08 확인).
          단순 참고용 계산이며 금융 자문이 아닙니다.
        </p>
      </div>
    </div>
  );
}
