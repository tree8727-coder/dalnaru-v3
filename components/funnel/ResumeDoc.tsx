/**
 * 제출용 이력서(경력기술서) 문서 — 흰 종이 스타일.
 * 기업에 내는 문서라 화면의 네이비 톤과 분리해 실제 서류처럼 조판한다.
 * 대화 중에는 미완성 칸이 "…"로 보여서 채워지는 과정 자체가 동기부여가 된다.
 * 인쇄(PDF)는 이 컴포넌트만 A4로 뽑는다.
 */
import type { Resume } from '@/lib/funnelData';
import type { JobPosting } from '@/lib/jobMatch';

const Blank = () => <span className="resume-blank">아직 대화에서 채워지지 않았습니다</span>;

export default function ResumeDoc({
  resume,
  targetJob,
  preview = false,
}: {
  resume: Resume;
  targetJob?: JobPosting | null;
  preview?: boolean;
}) {
  // 공고 맞춤: 요구 역량과 겹치는 핵심역량을 맨 위로 재배치
  const competencies = targetJob
    ? [...resume.competencies].sort((x, y) => relevance(y, targetJob) - relevance(x, targetJob))
    : resume.competencies;

  return (
    <div className={`resume-doc ${preview ? 'preview' : ''}`}>
      {targetJob && (
        <div className="resume-target">
          지원 직무 — {targetJob.title} <span className="resume-target-co">({targetJob.company} · 예시 공고)</span>
        </div>
      )}

      <header className="resume-header">
        <div>
          <div className="resume-name">{resume.name || (preview ? '성함 (마지막에 여쭙습니다)' : '무명의 전문가')}</div>
          <div className="resume-headline">{resume.headline || <Blank />}</div>
        </div>
        {resume.title && <div className="resume-title-badge">{resume.title}</div>}
      </header>

      <section>
        <h4 className="resume-h">희망 사항</h4>
        <p>{resume.targetLine || <Blank />}</p>
      </section>

      <section>
        <h4 className="resume-h">핵심 역량</h4>
        {competencies.length ? (
          <ul className="resume-ul">
            {competencies.map((c) => <li key={c}>{c}</li>)}
          </ul>
        ) : <p><Blank /></p>}
      </section>

      <section>
        <h4 className="resume-h">경력 사항</h4>
        {resume.career ? (
          <table className="resume-table">
            <tbody>
              <tr><th>기간</th><td>{resume.career.period || <Blank />}</td></tr>
              <tr><th>분야·규모</th><td>{resume.career.org || <Blank />}</td></tr>
              <tr><th>직책</th><td>{resume.career.role || <Blank />}</td></tr>
              <tr><th>담당 업무</th><td>{resume.career.duties.length ? resume.career.duties.join(', ') : <Blank />}</td></tr>
              <tr><th>주요 성과</th><td>{resume.career.achievement || <Blank />}</td></tr>
            </tbody>
          </table>
        ) : <p><Blank /></p>}
      </section>

      <section>
        <h4 className="resume-h">자격·보유 역량</h4>
        <p>{resume.certs || <Blank />}</p>
      </section>

      <section>
        <h4 className="resume-h">자기소개</h4>
        {resume.tacitQuote && <p className="resume-quote">“{resume.tacitQuote}”</p>}
        <p>{resume.summary || <Blank />}</p>
        {targetJob && (
          <p className="resume-apply">
            위 경력은 본 직무의 핵심 요건({targetJob.requirements.slice(0, 2).join(', ')})과 직접 맞닿아 있습니다.
          </p>
        )}
      </section>

      <footer className="resume-foot">
        <span>본 문서는 달나루 경력 정리 대화를 통해 작성되었습니다.</span>
        <span className="resume-foot-brand">Dalnaru</span>
      </footer>
    </div>
  );
}

function relevance(competency: string, job: JobPosting): number {
  return job.requirements.some((r) =>
    r.split(/[ ·]/).some((w) => w.length >= 2 && competency.includes(w)),
  ) ? 1 : 0;
}
