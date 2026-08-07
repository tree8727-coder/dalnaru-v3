/**
 * 랜딩 = 안내데스크 대화 (카드 메뉴 폐지 — 2026-08-08 유재원).
 * 모든 문(이력서·계산기·전화·도구)이 한 대화에서 자연스럽게 갈라진다.
 */
import FrontDesk from '@/components/FrontDesk';

export const metadata = { title: '달나루 — 평생 경력, 다시 일이 되게' };

export default function Home() {
  return <FrontDesk />;
}
