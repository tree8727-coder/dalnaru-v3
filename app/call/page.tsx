'use client';

/**
 * 전화 안내 v2 — 목록이 아니라 상담원이다.
 *
 * 회의록(0728) 원문이 기준: "노인이 전화를 한다. 우리 집의 전기가 나갔는데
 * 어디로 연락해야 하는가를 문의한다. 그러면 (사람이) 답변을 해준다."
 * — 사용자는 찾지 않는다. 상황을 말하면 이쪽이 찾아준다.
 * v1은 8개 목록을 던져놓고 찾게 했다 (틀린 설계, 유재원 지적).
 *
 * v2: 상담원처럼 2번 묻고 → 번호·대본·준비물을 떠먹여준다.
 * "잘 모르겠어요"의 자유 서술이 곧 니즈 데이터다 (텔레마켓의 수확 그대로).
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { newSessionId, saveFunnel, type FunnelStep } from '@/lib/funnelCollect';

interface CallCard {
  id: string;
  number: string;
  org: string;
  ack: string;        // 경청 맞장구
  script: string;
  prepare: string[];
  note?: string;
  cta?: 'calc' | 'funnel';
  nextSteps?: string[]; // 통화 이후의 전체 순서 (긴급 건은 카드에 바로 노출)
  escalate?: string;    // "잘 안 됐어요"일 때의 다음 수
}

interface Category {
  chip: string;
  ack: string;                          // 카테고리 선택 시 맞장구
  follow: { chip: string; card: CallCard }[];
}

const CARDS: Record<string, CallCard> = {
  pension: {
    id: 'pension', number: '1355', org: '국민연금공단',
    ack: '그건 국민연금공단이 제일 정확합니다.',
    script: '"제 예상 연금 수령액이 궁금해서 전화드렸습니다. 본인 확인 도와주세요."',
    prepare: ['주민등록번호', '조용한 곳에서 통화'],
    note: '전화 전에 1분 계산기로 대략 값을 잡아가면 상담이 훨씬 빨라집니다.',
    cta: 'calc',
    escalate: '통화가 어려우면 가까운 국민연금공단 지사에 신분증 들고 방문하시면 그 자리에서 확인해 줍니다.',
  },
  health: {
    id: 'health', number: '1577-1000', org: '국민건강보험공단',
    ack: '퇴직 후에 갑자기 오르는 경우가 많습니다. 놀라실 것 없어요.',
    script: '"퇴직 후 보험료가 갑자기 올라서요. 지역가입 전환 내용과 조정 방법을 알고 싶습니다."',
    prepare: ['고지서', '퇴직 시기'],
    note: '"임의계속가입"을 꼭 물어보세요 — 퇴직 후 2년은 직장 때 보험료로 유지할 수 있습니다.',
    escalate: '설명이 어려우면 가까운 건보공단 지사 방문이 낫습니다. 고지서 들고 가시면 됩니다.',
  },
  welfare: {
    id: 'welfare', number: '129', org: '보건복지상담센터',
    ack: '몰라서 못 받는 지원이 생각보다 많습니다. 잘 물으셨어요.',
    script: '"제 나이와 소득에서 신청할 수 있는 지원이 뭐가 있는지 알고 싶습니다."',
    prepare: ['나이·가구원 수·대략의 소득'],
  },
  tax: {
    id: 'tax', number: '126', org: '국세상담센터',
    ack: '고지서는 원래 어렵게 쓰여 있습니다. 그쪽에 그대로 물으시면 됩니다.',
    script: '"고지서를 받았는데 내용을 잘 모르겠습니다. 하나씩 설명 부탁드립니다."',
    prepare: ['고지서를 손에 들고', '주민등록번호'],
  },
  localtax: {
    id: 'localtax', number: '지역번호 + 120', org: '시·군·구청 민원콜',
    ack: '재산세·자동차세 같은 지방세는 시·군·구청 담당입니다.',
    script: '"재산세(자동차세) 고지서 관련해서 문의드립니다."',
    prepare: ['고지서', '주소지 확인'],
    note: '서울은 02-120, 다른 지역도 지역번호+120이면 시청 민원실로 연결됩니다.',
  },
  job: {
    id: 'job', number: '1350', org: '고용노동부 상담센터',
    ack: '일자리 쪽은 여기가 총괄입니다.',
    script: '"실업급여 받을 수 있는 조건인지 확인하고 싶습니다." 또는 "중장년 일자리 지원을 알아보고 있습니다."',
    prepare: ['퇴직 시기와 근무 기간 메모'],
    note: '이력서가 필요하다고 하면 — 여기서 3분이면 만듭니다.',
    escalate: '가까운 고용센터에 방문하면 담당자가 앉아서 같이 봐줍니다. 신분증만 챙기세요.',
    cta: 'funnel',
  },
  phishing: {
    id: 'phishing', number: '112', org: '경찰 (즉시)',
    ack: '잘하셨습니다. 일단 끊으신 것만으로 절반은 막으신 겁니다.',
    script: '"방금 의심스러운 전화(문자)를 받았습니다. 돈은 아직 안 보냈습니다 / 보냈습니다."',
    prepare: ['보낸 계좌번호·금액·시각 메모 (통장 앱에서 확인)'],
    note: '어떤 기관도 전화로 이체나 앱 설치를 요구하지 않습니다. 돈을 보냈다면 10분 안의 신고가 환급률을 좌우합니다.',
    nextSteps: [
      '지금 즉시 — 112 또는 거래 은행 콜센터에 "지급정지 요청" (24시간 가능, 금감원 1332도 됨)',
      '오늘 중 — 가까운 경찰서 민원실에서 「사건사고 사실확인원」 발급',
      '3영업일 안 — 그 서류를 은행에 내고 피해구제 신청 (환급까지 통상 2~3개월)',
    ],
    escalate: '지급정지가 안 받아들여지면 금융감독원 1332로 다시 거세요. 그래도 막히면 경찰서에 직접 방문하는 게 가장 확실합니다.',
  },
  power: {
    id: 'power', number: '123', org: '한국전력 (한전)',
    ack: '전기가 나가면 정말 답답하시죠. 바로 이 번호입니다.',
    script: '"집에 전기가 안 들어옵니다. 저희 집만 그런 건지 확인 부탁드립니다."',
    prepare: ['주소', '두꺼비집(차단기)을 먼저 올려보고 전화하면 더 빠릅니다'],
  },
  telecom: {
    id: 'telecom', number: '114', org: '통신사 고객센터',
    ack: '요금 문제는 통신사에 직접 묻는 게 제일 빠릅니다.',
    script: '"요금이 갑자기 올라서요. 제 요금제와 청구 내역을 설명해 주세요."',
    prepare: ['본인 명의 휴대폰으로 114 (무료)'],
    note: '"더 싼 요금제로 바꿔달라"고 말해도 됩니다. 안 알려주는 할인도 물으면 나옵니다.',
  },
  refund: {
    id: 'refund', number: '1372', org: '소비자상담센터',
    ack: '혼자 싸우실 필요 없습니다. 이 번호가 그 일 하는 곳입니다.',
    script: '"물건(서비스)을 샀는데 문제가 있어 환불받고 싶습니다. 절차를 알려주세요."',
    prepare: ['영수증·계약서', '구매 날짜'],
  },
  anywhere: {
    id: 'anywhere', number: '110', org: '정부민원안내콜센터',
    ack: '어디 물을지 모를 땐 여기가 정답입니다. 대신 찾아서 연결해 줍니다.',
    script: '"이런 상황인데 어느 기관에 물어봐야 하는지 몰라서요. 연결 부탁드립니다."',
    prepare: ['상황을 한 문장으로 정리 (방금 쓰신 내용 그대로)'],
  },
};

const TRIAGE: Category[] = [
  {
    chip: '💰 연금·보험료·지원금',
    ack: '돈 문제는 확실히 해두는 게 좋지요. 어느 쪽인가요?',
    follow: [
      { chip: '내 연금 얼마 받는지', card: CARDS.pension },
      { chip: '건강보험료가 이상해요', card: CARDS.health },
      { chip: '받을 수 있는 지원금', card: CARDS.welfare },
    ],
  },
  {
    chip: '📄 세금·고지서',
    ack: '고지서는 원래 어렵게 옵니다. 어떤 고지서인가요?',
    follow: [
      { chip: '소득세·부가세 (국세)', card: CARDS.tax },
      { chip: '재산세·자동차세', card: CARDS.localtax },
      { chip: '뭔지 모르겠어요', card: CARDS.tax },
    ],
  },
  {
    chip: '💼 일자리·실업급여',
    ack: '다시 일을 알아보시는군요, 좋습니다.',
    follow: [
      { chip: '실업급여 조건', card: CARDS.job },
      { chip: '중장년 일자리 지원', card: CARDS.job },
    ],
  },
  {
    chip: '🚨 수상한 전화·문자',
    ack: '침착하게 잘 오셨습니다. 지금 상황이 어떤가요?',
    follow: [
      { chip: '돈은 아직 안 보냈어요', card: CARDS.phishing },
      { chip: '이미 돈을 보냈어요', card: CARDS.phishing },
    ],
  },
  {
    chip: '🏠 전기·통신·환불',
    ack: '생활 불편이 제일 급하죠. 어느 쪽인가요?',
    follow: [
      { chip: '전기가 안 들어와요', card: CARDS.power },
      { chip: '휴대폰·인터넷 요금', card: CARDS.telecom },
      { chip: '산 물건 환불', card: CARDS.refund },
    ],
  },
];

type Role = 'bot' | 'user';
interface Msg { role: Role; text: string; typing?: boolean }
type Stage = 'triage' | 'follow' | 'unknown' | 'card';

export default function CallPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [stage, setStage] = useState<Stage>('triage');
  const [cat, setCat] = useState<Category | null>(null);
  const [card, setCard] = useState<CallCard | null>(null);
  const [chipsOn, setChipsOn] = useState(false);
  const [unknownText, setUnknownText] = useState('');
  const [outcome, setOutcome] = useState<null | 'ok' | 'fail'>(null); // 통화 후 후속
  const [copied, setCopied] = useState(false);
  const [fontLarge, setFontLarge] = useState(false);
  const session = useRef({ id: newSessionId(), startedAt: Date.now(), steps: [] as FunnelStep[] });
  const scrollRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const later = useCallback((fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)); }, []);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, card, stage]);

  const record = (q: string, a: string) => {
    session.current.steps.push({ q: `call-${q}`, a, tMs: Date.now() - session.current.startedAt });
    void saveFunnel(session.current.id, { steps: session.current.steps });
  };

  const botSay = useCallback((text: string, onDone?: () => void) => {
    setMessages((m) => [...m, { role: 'bot', text: '', typing: true }]);
    let i = 0;
    const tick = () => {
      i += 2;
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { ...copy[copy.length - 1], text: text.slice(0, i), typing: i < text.length };
        return copy;
      });
      if (i < text.length) later(tick, 14);
      else onDone?.();
    };
    later(tick, 14);
  }, [later]);

  useEffect(() => {
    later(() => botSay(
      '안녕하세요, 무슨 일 있으세요? 어디에 전화하면 되는지, 뭐라고 말하면 되는지까지 제가 찾아드릴게요.',
      () => setChipsOn(true),
    ), 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pickCategory = (c: Category | 'unknown') => {
    if (!chipsOn) return;
    navigator.vibrate?.(10);
    setChipsOn(false);
    if (c === 'unknown') {
      setMessages((m) => [...m, { role: 'user', text: '어디 물어봐야 할지 모르겠어요' }]);
      record('cat', '모르겠음');
      botSay('괜찮습니다, 그래서 제가 있는걸요. 무슨 일인지 한 줄만 적어주세요 — 어디에 물으면 되는지 찾아드립니다.', () => setStage('unknown'));
      return;
    }
    setMessages((m) => [...m, { role: 'user', text: c.chip.replace(/^\S+\s/, '') }]);
    record('cat', c.chip);
    setCat(c);
    botSay(c.ack, () => { setStage('follow'); setChipsOn(true); });
  };

  const pickFollow = (f: { chip: string; card: CallCard }) => {
    if (!chipsOn) return;
    navigator.vibrate?.(10);
    setChipsOn(false);
    setMessages((m) => [...m, { role: 'user', text: f.chip }]);
    record('topic', f.chip);
    setOutcome(null);
    setCopied(false);
    botSay(`${f.card.ack} 아래에 번호와 하실 말씀을 준비해 드렸습니다. 그대로 읽으셔도 됩니다.`, () => {
      setCard(f.card);
      setStage('card');
    });
  };

  const submitUnknown = () => {
    const text = unknownText.trim();
    if (!text) return;
    setMessages((m) => [...m, { role: 'user', text }]);
    record('unknown-need', text); // 텔레마켓의 수확 — 분류 안 되는 니즈 원문
    setUnknownText('');
    botSay('말씀 잘 들었습니다. 이런 경우는 110(정부민원안내)에 지금 그 말씀 그대로 하시면, 담당 기관을 찾아 연결해 줍니다.', () => {
      setCard(CARDS.anywhere);
      setStage('card');
    });
  };

  const reset = () => {
    setCard(null); setCat(null); setStage('triage'); setChipsOn(false); setOutcome(null); setCopied(false);
    botSay('또 궁금한 일 있으세요?', () => setChipsOn(true));
  };

  return (
    <div className={`funnel-shell ${fontLarge ? 'font-large' : ''}`}>
      <div className="trust-strip">
        <button className="font-toggle" onClick={() => setFontLarge((v) => !v)}>
          {fontLarge ? '가 보통 크기' : '가⁺ 글자 크게'}
        </button>
      </div>

      <div className="funnel-chat" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`funnel-bubble ${m.role}`}>
            {m.text}
            {m.typing && <span className="funnel-caret" />}
          </div>
        ))}

        {stage === 'card' && card && (
          <div className="calc-result call-result">
            <div className="call-number-row">
              <a className="call-number" href={`tel:${card.number.replace(/[^0-9-]/g, '') || '110'}`}>📞 {card.number}</a>
              <span className="call-org">{card.org}</span>
            </div>
            <div className="call-section">
              <div className="call-label">이렇게 말씀하세요</div>
              <p className="call-script">{card.script}</p>
            </div>
            <div className="call-section">
              <div className="call-label">전화 전 준비</div>
              <ul className="guide-steps" style={{ margin: 0 }}>
                {card.prepare.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </div>
            {card.note && <p className="guide-why">💡 {card.note}</p>}

            {/* 긴급 건은 전체 순서를 바로 — 소개가 아니라 완주를 시킨다 */}
            {card.nextSteps && (
              <div className="call-section">
                <div className="call-label">전체 순서 — 이 순서만 따라가면 됩니다</div>
                <ol className="call-steps">
                  {card.nextSteps.map((s) => <li key={s}>{s}</li>)}
                </ol>
              </div>
            )}

            {/* 이 안내를 카톡으로 — 부모님께 보내는 전파 단위 */}
            <button
              className="funnel-chip"
              style={{ marginTop: 12 }}
              onClick={() => {
                const txt = `[달나루 전화 안내]\n📞 ${card.number} (${card.org})\n\n이렇게 말씀하세요:\n${card.script}\n\n준비물: ${card.prepare.join(', ')}` +
                  (card.nextSteps ? `\n\n전체 순서:\n${card.nextSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}` : '');
                void navigator.clipboard?.writeText(txt);
                setCopied(true);
                record('share', card.id);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              {copied ? '✓ 복사됐습니다 — 카톡에 붙여넣으세요' : '💬 이 안내 카톡으로 보내기'}
            </button>

            {/* 통화 후 후속 — 소개로 끝내지 않고 해결까지 따라간다 */}
            <div className="call-section">
              <div className="call-label">통화해 보셨어요?</div>
              {outcome === null ? (
                <div className="funnel-chips" style={{ padding: '4px 0' }}>
                  <button className="funnel-chip" onClick={() => { setOutcome('ok'); record('outcome-' + card.id, '해결'); }}>😊 잘 해결됐어요</button>
                  <button className="funnel-chip" onClick={() => { setOutcome('fail'); record('outcome-' + card.id, '미해결'); }}>😥 잘 안 됐어요</button>
                </div>
              ) : outcome === 'ok' ? (
                <p className="call-script">다행입니다! 또 궁금한 게 생기면 언제든 오세요.</p>
              ) : (
                <p className="guide-why">
                  💪 {card.escalate ?? '그럴 땐 110(정부민원안내)에 상황을 그대로 말씀하시면 담당 기관을 다시 찾아 연결해 줍니다. 가까운 주민센터 방문도 확실한 방법입니다.'}
                </p>
              )}
            </div>
            {card.cta === 'calc' && (
              <Link href="/calc" className="btn-primary calc-cta-btn" style={{ marginTop: 14 }}>🧮 전화 전에 1분 계산해 보기</Link>
            )}
            {card.cta === 'funnel' && (
              <Link href="/funnel" className="btn-primary calc-cta-btn" style={{ marginTop: 14 }}>📄 3분 이력서 만들기</Link>
            )}
            <button className="funnel-restart" onClick={reset}>다른 것도 물어보기</button>
          </div>
        )}
      </div>

      {stage === 'triage' && (
        <div className="funnel-chips" role="group" aria-label="상황 선택">
          {TRIAGE.map((c) => (
            <button key={c.chip} className="funnel-chip" disabled={!chipsOn} onClick={() => pickCategory(c)}>{c.chip}</button>
          ))}
          <button className="funnel-chip" disabled={!chipsOn} onClick={() => pickCategory('unknown')}>🤷 어디 물어봐야 할지 모르겠어요</button>
        </div>
      )}

      {stage === 'follow' && cat && (
        <div className="funnel-chips" role="group" aria-label="세부 상황 선택">
          {cat.follow.map((f) => (
            <button key={f.chip} className="funnel-chip" disabled={!chipsOn} onClick={() => pickFollow(f)}>{f.chip}</button>
          ))}
        </div>
      )}

      {stage === 'unknown' && (
        <div className="funnel-inputbar">
          <input
            className="funnel-input"
            autoFocus
            value={unknownText}
            placeholder="예: 윗집 누수 때문에 천장에 물이 새요"
            onChange={(e) => setUnknownText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') submitUnknown(); }}
          />
          <button className="funnel-send" aria-label="보내기" disabled={!unknownText.trim()} onClick={submitUnknown}>↑</button>
        </div>
      )}
    </div>
  );
}
