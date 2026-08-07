/**
 * 제출용 이력서(경력기술서) — 실제 제출 서식을 따른 흰 종이 문서.
 * 구성: 1.인적사항 2.경력요약 3.핵심역량 4.경력사항 5.주요경험 6.자격 7.자기소개
 * (경력기술서 표준: 담당업무 + 수치화된 성과, 수치 없으면 규모·기간·횟수)
 * 대화 중에는 미완성 칸이 표시되어 채워지는 과정 자체가 동기부여가 된다.
 */
import type { Resume } from '@/lib/funnelData';
import type { JobPosting } from '@/lib/jobMatch';

const Blank = () => <span className="resume-blank">대화에서 채워집니다</span>;

export default function ResumeDoc({
  resume,
  targetJob,
  preview = false,
}: {
  resume: Resume;
  targetJob?: JobPosting | null;
  preview?: boolean;
}) {
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

      <div className="resume-doctitle">이 력 서</div>

      <header className="resume-header">
        <div>
          <div className="resume-name">{resume.name || (preview ? '성함 (마지막에 여쭙습니다)' : '무명의 전문가')}</div>
          <div className="resume-headline">{resume.headline || <Blank />}</div>
        </div>
        {resume.title && <div className="resume-title-badge">{resume.title}</div>}
      </header>

      <section>
        <h4 className="resume-h">1. 인적 사항</h4>
        <table className="resume-table">
          <tbody>
            <tr>
              <th>성명</th><td>{resume.name || <Blank />}</td>
              <th>연락처</th><td><span className="resume-fillin">제출 전 기입</span></td>
            </tr>
            <tr>
              <th>희망 직무</th><td>{targetJob ? targetJob.title : (resume.goal || <Blank />)}</td>
              <th>근무 형태</th><td>{resume.workType || <Blank />}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h4 className="resume-h">2. 경력 요약</h4>
        <p>{resume.summary || <Blank />}</p>
      </section>

      <section>
        <h4 className="resume-h">3. 핵심 역량</h4>
        {competencies.length ? (
          <ul className="resume-ul">
            {competencies.map((c) => <li key={c}>{c}</li>)}
          </ul>
        ) : <p><Blank /></p>}
      </section>

      <section>
        <h4 className="resume-h">4. 경력 사항</h4>
        {resume.career ? (
          <table className="resume-table">
            <tbody>
              <tr><th>기간</th><td colSpan={3}>{resume.career.period || <Blank />}</td></tr>
              <tr><th>분야·규모</th><td colSpan={3}>{resume.career.org || <Blank />}</td></tr>
              <tr><th>직책</th><td colSpan={3}>{resume.career.role || <Blank />}</td></tr>
              <tr><th>담당 업무</th><td colSpan={3}>{resume.career.duties.length ? resume.career.duties.join(', ') : <Blank />}</td></tr>
              <tr><th>주요 성과</th><td colSpan={3}><strong>{resume.career.achievement || <Blank />}</strong></td></tr>
            </tbody>
          </table>
        ) : <p><Blank /></p>}
      </section>

      <section>
        <h4 className="resume-h">5. 주요 경험</h4>
        {resume.experiences.length ? (
          <ul className="resume-ul">
            {resume.experiences.map((e) => <li key={e}>{e}</li>)}
          </ul>
        ) : <p><Blank /></p>}
      </section>

      <section>
        <h4 className="resume-h">6. 자격·보유 역량</h4>
        <p>{resume.certs || <Blank />}</p>
      </section>

      <section>
        <h4 className="resume-h">7. 자기소개</h4>
        {resume.tacitQuote && <p className="resume-quote">“{resume.tacitQuote}”</p>}
        <p>
          {resume.summary
            ? `${resume.tacitQuote ? '이 한 문장이 제 일의 기준이었습니다. ' : ''}${resume.summary}`
            : <Blank />}
        </p>
        {targetJob && (
          <p className="resume-apply">
            위 경력은 본 직무의 핵심 요건({targetJob.requirements.slice(0, 2).join(', ')})과 직접 맞닿아 있습니다.
          </p>
        )}
      </section>

      <footer className="resume-foot">
        <span>본 문서는 달나루 경력 정리 대화로 작성되었습니다.</span>
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
