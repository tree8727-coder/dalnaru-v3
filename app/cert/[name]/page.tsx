import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { certOutcomes, hypedWithoutData, topByRate, CERT_SOURCE } from '@/lib/certData';

/**
 * 자격증별 정적 페이지 — 검색 유입구.
 *
 * 이 앱은 전부 대화 화면이라 검색엔진이 읽을 내용물이 없었다. 트래픽이 0인 구조적 이유.
 * 5060과 그 자녀가 실제로 검색하는 것은 "달나루"가 아니라
 * "지게차 자격증 전망", "50대 공조냉동" 같은 자격증 질문이다.
 * 그 질문에 정부 공표 통계로만 답하는 페이지를 자격증마다 만든다.
 *
 * 원칙은 앱과 같다 — 없는 숫자는 지어내지 않고 "공표된 통계 없음"이라고 말한다.
 * 그 정직함이 학원 광고 페이지들 사이에서 이 페이지가 살아남는 이유다.
 */

export function generateStaticParams() {
  const withData = certOutcomes.map((c) => c.name);
  return [...withData, ...hypedWithoutData].map((name) => ({ name }));
}

interface Props { params: Promise<{ name: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name: raw } = await params;
  const name = decodeURIComponent(raw);
  const hit = certOutcomes.find((c) => c.name === name);
  const desc = hit?.rate6m != null
    ? `${name} 취득 후 6개월 내 취업률 ${hit.rate6m}% — 정부가 중장년 24만 명을 추적한 공표 통계입니다. 학원 광고가 아닌 숫자로 확인하세요.`
    : `${name}, 50대·60대에게 정말 유리할까요? 공표된 중장년 취업 통계가 있는지, 학원 등록 전에 무엇을 확인해야 하는지 정리했습니다.`;
  return {
    title: `${name} — 50대·60대 취업률, 정부 통계로 확인 | 달나루`,
    description: desc,
    openGraph: { title: `${name} — 중장년 취업률, 정부 통계로 확인`, description: desc },
  };
}

export default async function CertPage({ params }: Props) {
  const { name: raw } = await params;
  const name = decodeURIComponent(raw);
  const hit = certOutcomes.find((c) => c.name === name);
  const isHyped = hypedWithoutData.includes(name);
  if (!hit && !isHyped) notFound();

  const top = topByRate(5);

  return (
    <main className="cert-shell">
      <p className="cert-eyebrow">자격증 사실 확인</p>
      <h1 className="cert-title">{name},<br />50대·60대에게 정말 유리할까요?</h1>

      {hit?.rate6m != null ? (
        <section className="cert-verdict ok">
          <p className="cert-big"><b>{hit.rate6m}%</b></p>
          <p className="cert-big-sub">
            이 자격을 딴 중장년 100명 중 <b>{Math.round(hit.rate6m)}명</b>이
            6개월 안에 취업했습니다.
          </p>
          <p className="cert-src">{CERT_SOURCE.by} · {CERT_SOURCE.what} · {CERT_SOURCE.when}</p>
          {hit.note && <p className="cert-note">{hit.note}</p>}
        </section>
      ) : hit?.payMonthly != null ? (
        <section className="cert-verdict ok">
          <p className="cert-big"><b>월 {hit.payMonthly}만원</b></p>
          <p className="cert-big-sub">취업하신 분들의 월평균 임금입니다. 다만 취업률 자체는 공표 자료에 없습니다.</p>
          <p className="cert-src">{CERT_SOURCE.by} · {CERT_SOURCE.when}</p>
          {hit.note && <p className="cert-note">{hit.note}</p>}
        </section>
      ) : (
        <section className="cert-verdict warn">
          <p className="cert-big-sub" style={{ fontSize: '1.25rem' }}>
            인터넷에서 많이 추천되지만, <b>공표된 중장년 취업률 통계가 없습니다.</b>
          </p>
          <p className="cert-note">
            나쁜 자격증이라는 뜻이 아닙니다 — <b>확인된 숫자가 없다</b>는 뜻입니다.
            &ldquo;단기 취득, 고소득&rdquo; 광고만 보고 학원비를 내기 전에, 아래 두 가지를 먼저 확인하십시오.
          </p>
          <ul className="cert-check">
            <li><b>채용 공고에서 이 자격증을 실제로 요구하는가?</b> 고용24(work24.go.kr)에서 자격증 이름으로 공고를 검색해 보십시오. 요구하는 공고가 없다면 시간과 돈만 들어갑니다.</li>
            <li><b>학원비를 내기 전에 국민내일배움카드를 확인했는가?</b> 훈련비를 지원받을 수 있습니다. 전화 1350에서 내 경우를 알 수 있습니다.</li>
          </ul>
        </section>
      )}

      <section className="cert-block">
        <h2>참고 — 취업률이 확인된 자격증은 이 다섯입니다</h2>
        <ul className="cert-rank">
          {top.map((c) => (
            <li key={c.name}>
              <Link href={`/cert/${encodeURIComponent(c.name)}`} className={c.name === name ? 'me' : ''}>
                {c.name}
              </Link>
              <b>{c.rate6m}%</b>
            </li>
          ))}
        </ul>
        <p className="cert-src">6개월 내 취업률 · {CERT_SOURCE.by}</p>
      </section>

      <section className="cert-cta">
        <p>자격증보다 먼저 필요한 것은 <b>제출할 수 있는 이력서</b>입니다.<br />
        타이핑 없이, 말로 3분이면 만들어집니다. 무료입니다.</p>
        <Link href="/funnel" className="cert-btn">3분 이력서 만들어 보기</Link>
        <Link href="/cert" className="cert-more">다른 자격증 확인하기</Link>
      </section>
    </main>
  );
}
