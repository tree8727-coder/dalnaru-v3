/**
 * 가족 공유용 회고 카드 — 이력서의 감성 쌍둥이.
 * 같은 답으로 기업엔 이력서, 가족엔 회고를 준다 (0806 참고문헌 5: 효능감·자서전).
 * 네이비+골드 감성 톤 — 제출 서류가 아니라 선물이므로.
 */
import type { Memoir } from '@/lib/funnelData';

export default function MemoirCard({ memoir }: { memoir: Memoir }) {
  return (
    <div className="memoir-card">
      <div className="memoir-eyebrow">나의 일 인생</div>
      <div className="memoir-title">{memoir.title}</div>
      <div className="memoir-headline">{memoir.headline}</div>
      <div className="memoir-body">
        {memoir.story && <p className="memoir-quote">“{memoir.story}”</p>}
        {memoir.crisis && <p>{memoir.crisis}</p>}
        {memoir.proud && <p>{memoir.proud}</p>}
      </div>
      {memoir.lesson && (
        <div className="memoir-lesson">
          <span>다음 사람에게 남기는 한 문장</span>
          <strong>“{memoir.lesson}”</strong>
        </div>
      )}
      <div className="memoir-closing">{memoir.closing}</div>
      <div className="memoir-brand">달나루 Dalnaru</div>
    </div>
  );
}
