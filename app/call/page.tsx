'use client';

/**
 * 어디에 전화해야 하죠? — 상황별 공공 상담전화 + 말할 내용 대본.
 *
 * 회의록(0728) 텔레마켓 아이디어의 셀프서브 재해석.
 * 폐기된 것은 텔레마케터 인건비 모델(확장 불가)이지 니즈가 아니다 —
 * "전기가 나갔는데 어디로 연락해야 하는가" 그 니즈를 사람 없이 푼다.
 *
 * 번호는 전부 공공 대표번호 실측(2026-08 확인)이며 화면에 확인 시점을 표기한다.
 * 자녀→부모 카톡 공유가 자연스러운 전파 단위 (MET: 시간·노력 절약).
 */

import { useRef, useState } from 'react';
import Link from 'next/link';
import { newSessionId, saveFunnel, type FunnelStep } from '@/lib/funnelCollect';

interface CallCard {
  id: string;
  chip: string;
  icon: string;
  number: string;
  org: string;
  script: string;     // 전화해서 말할 내용
  prepare: string[];  // 준비물
  note?: string;
}

const CALLS: CallCard[] = [
  {
    id: 'pension', chip: '내 연금 얼마 받는지', icon: '💰', number: '1355', org: '국민연금공단',
    script: '"제 예상 연금 수령액이 궁금해서 전화드렸습니다. 본인 확인 도와주세요."',
    prepare: ['주민등록번호', '조용한 곳에서 통화'],
    note: '전화 전에 이 사이트의 은퇴 계산기로 대략 값을 잡아가면 상담이 빨라집니다.',
  },
  {
    id: 'tax', chip: '세금 고지서가 이해 안 될 때', icon: '📄', number: '126', org: '국세상담센터',
    script: '"고지서를 받았는데 내용을 잘 모르겠습니다. 하나씩 설명 부탁드립니다."',
    prepare: ['고지서를 손에 들고', '주민등록번호'],
    note: '재산세·자동차세 같은 지방세는 시·군·구청 대표번호(지역번호+120)입니다.',
  },
  {
    id: 'phishing', chip: '보이스피싱 의심될 때', icon: '🚨', number: '112', org: '경찰 (즉시)',
    script: '"방금 의심스러운 전화를 받았습니다. 돈은 보내지 않았습니다 / 보냈습니다."',
    prepare: ['이미 돈을 보냈다면 은행 콜센터에도 즉시 지급정지 요청', '금융감독원 1332도 도움'],
    note: '어떤 기관도 전화로 현금 이체·앱 설치를 요구하지 않습니다. 일단 끊고 거세요.',
  },
  {
    id: 'job', chip: '일자리·실업급여 문의', icon: '💼', number: '1350', org: '고용노동부 상담센터',
    script: '"실업급여 받을 수 있는 조건인지 확인하고 싶습니다." / "중장년 일자리 지원을 알아보고 있습니다."',
    prepare: ['퇴직 시기와 근무 기간 메모'],
    note: '이력서가 필요하다고 하면 — 이 사이트에서 3분이면 만듭니다.',
  },
  {
    id: 'health', chip: '건강보험료가 이상할 때', icon: '🏥', number: '1577-1000', org: '국민건강보험공단',
    script: '"퇴직 후 보험료가 갑자기 올라서요. 지역가입 전환 내용과 조정 방법을 알고 싶습니다."',
    prepare: ['고지서', '퇴직 시기'],
    note: '퇴직 후 2년은 직장 때 보험료로 유지하는 "임의계속가입"을 꼭 물어보세요.',
  },
  {
    id: 'welfare', chip: '받을 수 있는 복지 혜택', icon: '🎁', number: '129', org: '보건복지상담센터',
    script: '"제 나이와 소득에서 신청할 수 있는 지원이 뭐가 있는지 알고 싶습니다."',
    prepare: ['나이·가구원 수·대략의 소득'],
  },
  {
    id: 'consumer', chip: '환불·소비자 피해', icon: '🛒', number: '1372', org: '소비자상담센터',
    script: '"물건(서비스)을 샀는데 문제가 있어 환불받고 싶습니다. 절차를 알려주세요."',
    prepare: ['영수증·계약서', '구매 날짜'],
  },
  {
    id: 'any', chip: '어디 물을지 모르겠을 때', icon: '📞', number: '110', org: '정부민원안내콜센터',
    script: '"이런 상황인데 어느 기관에 물어봐야 하는지 몰라서요. 연결 부탁드립니다."',
    prepare: ['상황을 한 문장으로 정리'],
    note: '뭐든 일단 110. 담당 기관을 찾아 연결해 줍니다.',
  },
];

export default function CallPage() {
  const [sel, setSel] = useState<CallCard | null>(null);
  const [fontLarge, setFontLarge] = useState(false);
  const session = useRef({ id: newSessionId(), startedAt: Date.now(), steps: [] as FunnelStep[] });

  const pick = (c: CallCard) => {
    navigator.vibrate?.(10);
    setSel(c);
    // 어떤 상황이 많이 눌리는지 = 니즈 데이터
    session.current.steps.push({ q: 'call-topic', a: c.chip, tMs: Date.now() - session.current.startedAt });
    void saveFunnel(session.current.id, { steps: session.current.steps });
  };

  return (
    <div className={`funnel-shell calc-shell ${fontLarge ? 'font-large' : ''}`}>
      <div className="trust-strip">
        <button className="font-toggle" onClick={() => setFontLarge((v) => !v)}>
          {fontLarge ? '가 보통 크기' : '가⁺ 글자 크게'}
        </button>
      </div>

      <div className="calc-scroll">
        <h1 className="calc-title">어디에 전화해야 하죠?</h1>
        <p className="calc-sub">상황을 누르면 <strong>전화번호와 말할 내용</strong>까지 알려드립니다.</p>

        <div className="funnel-chips" style={{ padding: '4px 0' }}>
          {CALLS.map((c) => (
            <button key={c.id} className={`funnel-chip ${sel?.id === c.id ? 'chip-on' : ''}`} onClick={() => pick(c)}>
              {c.icon} {c.chip}
            </button>
          ))}
        </div>

        {sel && (
          <div className="calc-result">
            <div className="call-number-row">
              <a className="call-number" href={`tel:${sel.number}`}>📞 {sel.number}</a>
              <span className="call-org">{sel.org}</span>
            </div>

            <div className="call-section">
              <div className="call-label">이렇게 말씀하세요</div>
              <p className="call-script">{sel.script}</p>
            </div>

            <div className="call-section">
              <div className="call-label">전화 전 준비</div>
              <ul className="guide-steps" style={{ margin: 0 }}>
                {sel.prepare.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </div>

            {sel.note && <p className="guide-why">💡 {sel.note}</p>}

            {sel.id === 'pension' && (
              <Link href="/calc" className="btn-primary calc-cta-btn" style={{ marginTop: 14 }}>
                🧮 전화 전에 1분 계산해 보기
              </Link>
            )}
            {sel.id === 'job' && (
              <Link href="/funnel" className="btn-primary calc-cta-btn" style={{ marginTop: 14 }}>
                📄 3분 이력서 만들기
              </Link>
            )}
          </div>
        )}

        <p className="calc-source">
          공공 대표번호 기준 2026-08 확인. 통화료 외 상담은 무료이며, 전화로 돈·앱 설치를
          요구하는 곳은 공공기관이 아닙니다.
        </p>
      </div>
    </div>
  );
}
