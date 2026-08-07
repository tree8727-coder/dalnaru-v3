/**
 * 랜딩 — Step 1 (0806 회의록: 전면에 AI 없음, 연금·돈·일자리만).
 * 문 두 개뿐이다. 고르는 데 생각이 필요 없어야 한다.
 * (이전 AI 탭 화면은 git 이력에 있음 — Step 2에서 재활용)
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
        <Link href="/calc" className="landing-card">
          <span className="landing-card-emoji">🧮</span>
          <span className="landing-card-title">내 은퇴 자금, 몇 살까지 버틸까?</span>
          <span className="landing-card-desc">네 가지만 맞추면 바로 계산됩니다. 1분.</span>
        </Link>
        <Link href="/funnel" className="landing-card">
          <span className="landing-card-emoji">📄</span>
          <span className="landing-card-title">기업에 바로 내는 이력서 만들기</span>
          <span className="landing-card-desc">버튼만 눌러 대답하면 됩니다. 3분. 맞는 일자리도 함께 찾아드립니다.</span>
        </Link>
        <Link href="/guide" className="landing-card">
          <span className="landing-card-emoji">🧰</span>
          <span className="landing-card-title">작은 창업·부업, 뭐부터 하면 돼요?</span>
          <span className="landing-card-desc">분야마다 제일 좋은 방법 딱 하나씩만, 눈높이에 맞춰 알려드립니다.</span>
        </Link>
      </div>

      <p className="landing-foot">응답은 이름 없이 보관됩니다 · 무료입니다</p>
    </div>
  );
}
