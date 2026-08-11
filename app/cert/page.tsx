import type { Metadata } from 'next';
import Link from 'next/link';
import { certOutcomes, hypedWithoutData, CERT_SOURCE } from '@/lib/certData';

export const metadata: Metadata = {
  title: '50대·60대 자격증, 정부 통계로 확인된 것만 | 달나루',
  description:
    '인터넷 추천 말고 숫자로 보십시오. 정부가 중장년 24만 명을 5년간 추적해 공표한 자격증별 취업률 — 확인된 것과 확인 안 된 것을 구분해 보여드립니다.',
};

export default function CertIndexPage() {
  const withRate = certOutcomes.filter((c) => c.rate6m != null);
  const withPay = certOutcomes.filter((c) => c.rate6m == null && c.payMonthly != null);

  return (
    <main className="cert-shell">
      <p className="cert-eyebrow">자격증 사실 확인</p>
      <h1 className="cert-title">추천 말고,<br />숫자로 고르십시오</h1>
      <p className="cert-lead">
        정부가 중장년 <b>24만 명을 5년간 추적</b>해 공표한 통계입니다.
        여기 있는 숫자가 전부이고, 없는 것은 &ldquo;확인 안 됨&rdquo;이라고 그대로 적었습니다.
      </p>

      <section className="cert-block">
        <h2>취업률이 확인된 자격증</h2>
        <ul className="cert-rank">
          {withRate.map((c) => (
            <li key={c.name}>
              <Link href={`/cert/${encodeURIComponent(c.name)}`}>{c.name}</Link>
              <b>{c.rate6m}%</b>
            </li>
          ))}
        </ul>
        <p className="cert-src">취득 후 6개월 내 취업률 · {CERT_SOURCE.by} · {CERT_SOURCE.when}</p>
      </section>

      <section className="cert-block">
        <h2>임금이 확인된 자격증</h2>
        <ul className="cert-rank">
          {withPay.map((c) => (
            <li key={c.name}>
              <Link href={`/cert/${encodeURIComponent(c.name)}`}>{c.name}</Link>
              <b>월 {c.payMonthly}만</b>
            </li>
          ))}
        </ul>
      </section>

      <section className="cert-block">
        <h2>많이 추천되지만, 공표된 취업률이 없는 자격증</h2>
        <ul className="cert-rank">
          {hypedWithoutData.map((n) => (
            <li key={n}>
              <Link href={`/cert/${encodeURIComponent(n)}`}>{n}</Link>
              <b className="na">확인 안 됨</b>
            </li>
          ))}
        </ul>
        <p className="cert-note">나쁘다는 뜻이 아니라 <b>확인된 숫자가 없다</b>는 뜻입니다. 각 페이지에 학원 등록 전 확인법을 적어 두었습니다.</p>
      </section>

      <section className="cert-cta">
        <p>자격증보다 먼저 필요한 것은 <b>제출할 수 있는 이력서</b>입니다.</p>
        <Link href="/funnel" className="cert-btn">3분 이력서 만들어 보기 — 무료</Link>
      </section>
    </main>
  );
}
