'use client';

/**
 * 이력서를 받은 다음 화면. "이제 뭘 하죠?"에 답한다.
 *
 * 이 화면에 무엇을 넣지 않았는지가 더 중요하다 —
 *
 *  1. 평균 구직 기간(4.4개월)과 소득 감소율(24.5%)을 넣지 않았다.
 *     40대 이상 전체 평균이라 개인 예측으로 쓰면 통계 오용이고,
 *     이력서를 막 완성한 직후에 보여주면 앱 원칙("보상 먼저")과 정면으로 부딪힌다.
 *     중장년 재취업 포기율이 17.5%인데 거기에 우리가 보탤 이유가 없다.
 *
 *  2. 자격증을 "추천"하지 않았다. 공표된 취업률 상위 5종이 전부 현장·기술직이라,
 *     사무직으로 30년 일하신 분께 권하면 틀린 조언이 된다.
 *     게다가 취업률이 자격증 때문이라는 인과는 확인된 바 없다.
 *     그래서 "확인된 숫자가 있는 것 / 없는 것"의 구분만 보여준다.
 *
 * 대신 시간·돈을 실제로 아껴 주는 사실만 남겼다 — 무료 상담처, 훈련비 지원, 자격증 판별법.
 */

import { topByRate, hypedWithoutData, CERT_SOURCE } from '@/lib/certData';

interface Props {
  /** 퍼널에서 고른 분야 — 문구를 조금 바꾸는 데만 쓴다 */
  field?: string;
}

export default function NextSteps({ field }: Props) {
  const top = topByRate(5);

  return (
    <section className="nextsteps" aria-labelledby="nextsteps-title">
      <h3 id="nextsteps-title" className="nextsteps-title">이력서는 나왔습니다. 이제 세 가지만 아시면 됩니다.</h3>

      {/* 1 — 시간을 가장 많이 아껴 주는 것 */}
      <article className="nextstep-card">
        <div className="nextstep-num" aria-hidden>1</div>
        <div className="nextstep-body">
          <h4>혼자 하지 마십시오. 무료로 도와드리는 곳이 있습니다.</h4>
          <p>
            전국 <strong>중장년내일센터</strong>에서 40세 이상이면 누구나 무료로 상담받으실 수 있습니다.
            이력서 검토, 면접 연습, 일자리 소개까지 해 드립니다. 정부가 운영하는 곳이라 비용이 들지 않습니다.
          </p>
          <p className="nextstep-why">
            재취업이 늦어지는 가장 큰 이유 중 하나가 <strong>지인 소개와 일반 구인 사이트에만 의존</strong>하는 것입니다.
          </p>
          <div className="nextstep-actions">
            <a className="nextstep-btn" href="tel:1350">전화로 물어보기 &nbsp;1350</a>
            <a className="nextstep-btn nextstep-btn-sub"
               href="https://www.work24.go.kr/wk/u/a/1000/seniorCenterInfo.do"
               target="_blank" rel="noopener noreferrer">
              가까운 센터 찾기
            </a>
          </div>
        </div>
      </article>

      {/* 2 — 돈을 가장 많이 아껴 주는 것 */}
      <article className="nextstep-card">
        <div className="nextstep-num" aria-hidden>2</div>
        <div className="nextstep-body">
          <h4>배우실 생각이라면, 학원비를 먼저 내지 마십시오.</h4>
          <p>
            <strong>국민내일배움카드</strong>를 발급받으시면 훈련비를 지원받으실 수 있습니다.
            내 돈으로 등록하기 전에 이 카드부터 알아보시는 게 순서입니다.
          </p>
          <p className="nextstep-why">
            지원 한도와 조건은 사람마다 다릅니다. 위 1350번이나 센터에서 내 경우를 확인하실 수 있습니다.
          </p>
        </div>
      </article>

      {/* 3 — 광고와 사실을 가르는 것 */}
      <article className="nextstep-card">
        <div className="nextstep-num" aria-hidden>3</div>
        <div className="nextstep-body">
          <h4>자격증은 &ldquo;추천&rdquo;이 아니라 &ldquo;숫자&rdquo;로 고르십시오.</h4>
          <p>
            정부가 중장년 24만 명을 5년간 추적해서, <strong>자격을 딴 뒤 6개월 안에 실제로 취업한 비율</strong>을
            공표한 자료가 있습니다. 확인된 것은 아래가 전부입니다.
          </p>

          <ul className="cert-list">
            {top.map((c) => (
              <li key={c.name}>
                <span className="cert-name">{c.name}</span>
                <span className="cert-rate">{c.rate6m}%</span>
              </li>
            ))}
          </ul>

          <p className="nextstep-note">
            <strong>여기 없다고 나쁜 자격증이라는 뜻은 아닙니다.</strong> 확인된 숫자가 없다는 뜻입니다.
            인터넷에서 많이 권하는 {hypedWithoutData.slice(0, 3).join(' · ')} 같은 자격은
            공표된 중장년 취업률이 아직 없습니다.
          </p>
          <p className="nextstep-why">
            학원 설명만 듣고 정하지 마시고, <strong>채용 공고에서 그 자격을 실제로 요구하는지</strong> 먼저 확인해 보십시오.
            요구하지 않는 자격은 시간과 돈만 들어갑니다.
          </p>
          <p className="nextstep-src">
            {CERT_SOURCE.by} · {CERT_SOURCE.what} · {CERT_SOURCE.when}
          </p>
        </div>
      </article>

      {field && (
        <p className="nextstep-tail">
          {field} 분야에서 오래 일하신 경험은 그대로 남아 있습니다. 순서만 아시면 됩니다.
        </p>
      )}
    </section>
  );
}
