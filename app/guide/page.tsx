'use client';

/**
 * 워크플로우 가이드 챗봇 — "분야당 최선 1개, 눈높이에 맞게".
 * (교수님 피드백: 나열이 아니라 대화로 주고, 그 대화에서 니즈를 수집)
 *
 * 흐름: 뭘 하고 싶은가 → 컴퓨터 얼마나 편한가 → 최선의 레시피 1개 지급
 *      → "막히는 지점" 자유 서술 (Unmet Needs 수집)
 * 눈높이: 같은 레시피를 3단계로 다르게 렌더. 초심자에게는 명령어 대신
 *        "자녀·지인에게 부탁 메시지 복사" 경로를 준다.
 */

import { useRef, useState } from 'react';
import Link from 'next/link';
import {
  GUIDES, SKILL_CHIPS, SKILL_MAP, helpRequestMessage,
  type GuideRecipe, type SkillLevel,
} from '@/lib/guideData';
import { newSessionId, saveFunnel, type FunnelStep } from '@/lib/funnelCollect';

type Stage = 'goal' | 'skill' | 'recipe';

export default function GuidePage() {
  const [stage, setStage] = useState<Stage>('goal');
  const [recipe, setRecipe] = useState<GuideRecipe | null>(null);
  const [skill, setSkill] = useState<SkillLevel>('mid');
  const [needsText, setNeedsText] = useState('');
  const [needsSent, setNeedsSent] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [fontLarge, setFontLarge] = useState(false);
  const session = useRef({ id: newSessionId(), startedAt: Date.now(), steps: [] as FunnelStep[] });

  const record = (q: string, a: string) => {
    session.current.steps.push({ q: `guide-${q}`, a, tMs: Date.now() - session.current.startedAt });
    void saveFunnel(session.current.id, { steps: session.current.steps });
  };

  const copy = (text: string, tag: string) => {
    void navigator.clipboard?.writeText(text);
    setCopied(tag);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className={`funnel-shell calc-shell ${fontLarge ? 'font-large' : ''}`}>
      <div className="trust-strip">
        <button className="font-toggle" onClick={() => setFontLarge((v) => !v)}>
          {fontLarge ? '가 보통 크기' : '가⁺ 글자 크게'}
        </button>
      </div>

      <div className="calc-scroll">
        <h1 className="calc-title">뭘 하려고 하세요?</h1>
        <p className="calc-sub">
          분야마다 <strong>제일 좋은 방법 딱 하나</strong>만 알려드립니다. 이것저것 비교하실 필요 없습니다.
        </p>

        {/* Q1: 목표 */}
        <div className="funnel-chips" style={{ padding: '4px 0' }}>
          {GUIDES.map((g) => (
            <button
              key={g.id}
              className={`funnel-chip ${recipe?.id === g.id ? 'chip-on' : ''}`}
              onClick={() => {
                navigator.vibrate?.(10);
                setRecipe(g);
                record('goal', g.goalChip);
                if (stage === 'goal') setStage('skill');
              }}
            >
              {g.icon} {g.goalChip}
            </button>
          ))}
        </div>

        {/* Q2: 눈높이 */}
        {stage !== 'goal' && recipe && (
          <>
            <p className="calc-sub" style={{ marginTop: 8 }}>컴퓨터는 어느 정도 편하세요? 거기에 맞춰 설명드릴게요.</p>
            <div className="funnel-chips" style={{ padding: '4px 0' }}>
              {SKILL_CHIPS.map((c) => (
                <button
                  key={c.label}
                  className={`funnel-chip ${SKILL_MAP[c.label] === skill && stage === 'recipe' ? 'chip-on' : ''}`}
                  onClick={() => {
                    navigator.vibrate?.(10);
                    setSkill(SKILL_MAP[c.label]);
                    setStage('recipe');
                    record('skill', c.label);
                  }}
                >
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>
          </>
        )}

        {/* 레시피 지급 */}
        {stage === 'recipe' && recipe && (
          <div className="calc-result">
            <div className="guide-head">
              <span className="guide-icon">{recipe.icon}</span>
              <div>
                <div className="guide-title">{recipe.title}</div>
                <div className="guide-oneliner">{recipe.oneLiner}</div>
              </div>
            </div>

            <p className="guide-why">💡 {recipe.whyBest}</p>

            <ol className="guide-steps">
              {recipe.easySteps.map((s, i) => <li key={i}>{s}</li>)}
            </ol>

            {skill === 'easy' ? (
              <div className="guide-easy">
                <p className="enrich-ask">
                  설치에는 명령어 입력이 필요합니다. 직접 하지 않으셔도 됩니다 —
                  아래 버튼을 누르면 <strong>자녀분이나 지인에게 보낼 부탁 메시지</strong>가 복사됩니다.
                  카톡에 붙여넣기만 하세요. 받는 분은 10분이면 해드릴 수 있습니다.
                </p>
                <button className="btn-primary" onClick={() => copy(helpRequestMessage(recipe), 'help')}>
                  {copied === 'help' ? '✓ 복사됐습니다 — 카톡에 붙여넣으세요' : '💬 부탁 메시지 복사하기'}
                </button>
              </div>
            ) : (
              <>
                <div className="code-block">
                  <div className="code-block-label">
                    설치 (명령창에 붙여넣기)
                    <button className="code-copy" onClick={() => copy(recipe.installCmd, 'i')}>{copied === 'i' ? '✓ 복사됨' : '복사'}</button>
                  </div>
                  <pre>{recipe.installCmd}</pre>
                </div>
                <div className="code-block">
                  <div className="code-block-label">
                    실행 예시
                    <button className="code-copy" onClick={() => copy(recipe.runCmd, 'r')}>{copied === 'r' ? '✓ 복사됨' : '복사'}</button>
                  </div>
                  <pre>{recipe.runCmd}</pre>
                </div>
                {skill === 'mid' && !recipe.aiPrompt.startsWith('(') && (
                  <div className="code-block prompt">
                    <div className="code-block-label">
                      같이 쓰는 AI 부탁 문구
                      <button className="code-copy" onClick={() => copy(recipe.aiPrompt, 'p')}>{copied === 'p' ? '✓ 복사됨' : '복사'}</button>
                    </div>
                    <pre>{recipe.aiPrompt}</pre>
                  </div>
                )}
              </>
            )}

            {/* 니즈 수집 — 이 페이지의 진짜 수확 */}
            {!needsSent ? (
              <div className="guide-needs">
                <p className="enrich-ask">해보시다 막히거나, 찾는 게 여기 없다면 적어주세요. 다음 가이드에 반영하겠습니다.</p>
                <textarea
                  className="funnel-input funnel-textarea enrich-textarea"
                  rows={2}
                  value={needsText}
                  placeholder="예: 스마트스토어 리뷰 관리가 제일 답답해요"
                  onChange={(e) => setNeedsText(e.target.value)}
                />
                <button
                  className="btn-primary enrich-save"
                  disabled={!needsText.trim()}
                  onClick={() => { record('needs', needsText.trim()); setNeedsSent(true); }}
                >
                  보내기
                </button>
              </div>
            ) : (
              <p className="guide-thanks">✓ 잘 받았습니다. 숙제로 삼겠습니다.</p>
            )}

            <div className="guide-links">
              <a href="/tools.html" target="_blank" rel="noreferrer">🧰 도구 전체 보기</a>
              <Link href="/funnel">📄 3분 이력서 만들기</Link>
            </div>
          </div>
        )}

        <p className="calc-source">
          추천 근거(사용자 수·검증 뱃지)는 2026-08-07 GitHub·Winget 실측값입니다. 전부 무료·오픈소스입니다.
        </p>
      </div>
    </div>
  );
}
