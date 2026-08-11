import Link from 'next/link';

/**
 * 기관·기업용 도입 안내 — 돈이 들어오는 문.
 *
 * B2C 화면과 분리한 이유: 어르신에게 보여줄 말과 기관에 보여줄 말이 다르다.
 * 어르신에겐 "무료·안심"이고, 기관에겐 "상담사 시간 절감·의무 이행·지원금"이다.
 *
 * 대상 시장(전부 이브 단계 — 법·제도가 만들었고 파는 곳이 아직 적다):
 *   중장년내일센터 38곳 / 재취업지원서비스 의무기업 1,054곳(1,000인 이상) /
 *   중장년 경력지원제 민간위탁기관 23곳(2026 신설, 기업 월 40만 지원)
 */

export const metadata = {
  title: '달나루 — 기관·기업 도입 안내',
  description: '상담사의 이력서 초안 작성 시간을 60분에서 5분으로. 중장년 구직 지원 기관을 위한 대화형 이력서 도구.',
};

const FIT = [
  {
    who: '중장년내일센터 · 고용센터',
    pain: '상담사가 이력서 초안 한 장에 한 시간을 씁니다.',
    gain: '어르신이 상담 전에 버튼·음성으로 초안을 만들어 오면, 상담사는 다듬기만 합니다.',
  },
  {
    who: '재취업지원서비스 의무기업 (1,000인 이상, 전국 1,054곳)',
    pain: '50세 이상 퇴직 예정자에게 재취업 지원을 법으로 제공해야 합니다.',
    gain: '진로설계·구직서류 지원 항목의 이행 증빙이 되는 결과물(이력서·상담 기록)이 남습니다.',
  },
  {
    who: '중장년 경력지원제 위탁기관 (2026 신설, 전국 23곳)',
    pain: '참여자 모집과 서류 준비를 사람 손으로 처리하고 있습니다.',
    gain: '참여자가 도구로 서류를 준비해 오면 운영 인력이 매칭에 집중할 수 있습니다.',
  },
];

export default function PartnersPage() {
  return (
    <main className="partners-shell">
      <p className="partners-eyebrow">기관·기업용 안내</p>
      <h1 className="partners-title">
        상담사의 이력서 초안 60분을<br />5분으로 줄입니다
      </h1>
      <p className="partners-lead">
        달나루는 5060 구직자가 <b>타이핑 없이</b>(버튼과 음성으로) 제출 가능한 이력서를
        만드는 도구입니다. 서강대 연구실에서 시작했고, 구직자에게는 전부 무료입니다.
      </p>

      <div className="partners-try">
        <Link href="/funnel" className="partners-cta">3분만 직접 써 보기 →</Link>
        <p className="partners-try-note">설치·가입 없이 이 링크가 전부입니다. 상담 창구에서 바로 쓸 수 있습니다.</p>
      </div>

      <section className="partners-block">
        <h2>어디에 맞는 도구인가</h2>
        {FIT.map((f) => (
          <article className="partners-card" key={f.who}>
            <h3>{f.who}</h3>
            <p className="pain">{f.pain}</p>
            <p className="gain">{f.gain}</p>
          </article>
        ))}
      </section>

      <section className="partners-block">
        <h2>왜 어르신들이 실제로 씁니까</h2>
        <ul className="partners-list">
          <li><b>타이핑이 없습니다.</b> 버튼 선택과 음성 입력만으로 끝납니다.</li>
          <li><b>고령층 접근성 기준을 기계로 검사합니다.</b> 글자 16px·버튼 44px·명암 기준, 전 화면 위반 0건(자동 측정 도구 동봉).</li>
          <li><b>경력 사실은 국민연금 가입증명서와 대조</b>하도록 안내하고, 대조 시 이력서에 표시가 남습니다.</li>
          <li><b>과장하지 않습니다.</b> 자격증 안내는 정부 공표 통계(중장년 24만 명 추적)만 씁니다.</li>
        </ul>
      </section>

      <section className="partners-block">
        <h2>파일럿 제안</h2>
        <p className="partners-pilot">
          한 곳이면 됩니다. 상담 창구에서 2주만 써 보시고,
          <b> 이력서 초안에 걸리는 시간이 실제로 줄었는지</b>만 알려주십시오.
          비용은 없습니다 — 저희가 얻는 것은 그 숫자입니다.
        </p>
        <a className="partners-cta partners-mail" href="mailto:tree8727@gmail.com?subject=달나루 도입 문의">
          도입 문의 메일 보내기
        </a>
      </section>

      <p className="partners-foot">
        달나루 · 서강대학교 연구실에서 시작 · 구직자 이용 무료<br />
        <Link href="/">← 서비스 첫 화면으로</Link>
      </p>
    </main>
  );
}
