/**
 * 랜딩 — 회의록 기준 (0806 · 0728).
 * 메인은 이력서다. 계산기는 유입 정보(회의록 Step 1)로서의 보조 문.
 * 창업 가이드는 회의록 범위 밖이라 대문에 두지 않는다 (2026-08-08 유재원 지적).
 */
import Link from 'next/link';

export const metadata = { title: '달나루 — 평생 경력, 다시 일이 되게' };

export default function Home() {
  return (
    <div className="funnel-shell landing-shell">
      <div className="landing-hero">
        <div className="landing-brand">달나루</div>
        <h1 className="landing-title">평생 경력,<br />다시 일이 되게.</h1>
        <p className="landing-sub">서강대 연구실에서 시작한 5060 경력 서비스입니다.</p>
      </div>

      <div className="landing-cards">
        <Link href="/funnel" className="landing-card landing-main">
          <span className="landing-card-emoji">📄</span>
          <span className="landing-card-title">기업에 바로 내는 이력서 만들기</span>
          <span className="landing-card-desc">
            버튼만 눌러 대답하면 됩니다. 3분.
            평생 경력이 제출용 이력서가 되고, 맞는 일자리도 함께 찾아드립니다.
          </span>
        </Link>
        <Link href="/calc" className="landing-card">
          <span className="landing-card-emoji">🧮</span>
          <span className="landing-card-title">내 은퇴 자금, 몇 살까지 버틸까?</span>
          <span className="landing-card-desc">네 가지만 맞추면 바로 계산됩니다. 1분.</span>
        </Link>
        {/* 트래픽 유인책 — 검색 수요가 다른 세 번째 문. 메인(이력서)보다 작게 */}
        <Link href="/guide" className="landing-card">
          <span className="landing-card-emoji">🏆</span>
          <span className="landing-card-title">일 잘하는 사람들의 자동화 도구, 분야별 1등만</span>
          <span className="landing-card-desc">전 세계 추천 수로 검증된 것 하나씩만, 눈높이에 맞춰 알려드립니다.</span>
        </Link>
      </div>

      <p className="landing-foot">응답은 이름 없이 보관됩니다 · 무료입니다</p>
    </div>
  );
}
