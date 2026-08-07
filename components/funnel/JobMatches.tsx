/**
 * 일자리 추천 카드 — 규칙 기반 적합도(%) + 이유.
 * 공고를 고르면 이력서가 그 공고 요구 역량 중심으로 재배치된다.
 * 모든 공고에 "예시 공고" 라벨 — 실제 공고 연동 전이라는 것을 숨기지 않는다.
 */
import type { JobMatch } from '@/lib/jobMatch';

export default function JobMatches({
  matches,
  selectedId,
  onSelect,
  sourceLabel,
}: {
  matches: JobMatch[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  sourceLabel: string;
}) {
  if (!matches.length) return null;
  return (
    <div className="jobs-wrap">
      <div className="jobs-head">
        대표님 경력과 맞는 일자리 <span className="jobs-note">{sourceLabel}</span>
      </div>
      {matches.map(({ job, score, reasons }) => (
        <button
          key={job.id}
          className={`job-card ${selectedId === job.id ? 'selected' : ''}`}
          onClick={() => onSelect(selectedId === job.id ? null : job.id)}
        >
          <div className="job-top">
            <span className="job-title">{job.title}</span>
            <span className="job-score">적합도 {score}%</span>
          </div>
          <div className="job-co">{job.company} · {job.category} · {job.workTypes.join('/')}</div>
          <div className="job-summary">{job.summary}</div>
          {reasons.length > 0 && (
            <ul className="job-reasons">
              {reasons.map((r) => <li key={r}>✓ {r}</li>)}
            </ul>
          )}
          <div className="job-cta">
            {selectedId === job.id ? '▲ 기본 이력서로 돌아가기' : '▼ 이 공고에 맞춘 이력서 보기'}
            {job.url && (
              <a className="job-link" href={job.url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                워크넷에서 공고 보기 ↗
              </a>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
