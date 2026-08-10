/**
 * 중장년 국가기술자격 취업 성과.
 *
 * 출처 — 고용노동부·한국직업능력연구원, 2020~2024년 5년간
 *        자격 취득 당시 실업 상태였던 중장년 24만 명 분석 (2025-09 공표)
 *
 * 왜 이 데이터인가:
 *   인터넷이 5060에게 미는 자격증(지게차·요양보호사·공인중개사)과
 *   실제로 취업으로 이어진 자격증이 다르다. 학원비는 미리 나가고
 *   결과는 6개월 뒤에 나오므로, 순서를 바꾸면 시간과 돈을 아낄 수 있다.
 *
 * 원칙 — 여기 없는 숫자는 지어내지 않는다. rate6m: null 은 "공표 데이터에 없음"이며
 *        화면에서도 "확인되지 않음"으로 표시한다. 추정치를 넣는 순간 이 파일의 값이 사라진다.
 */

export const CERT_SOURCE = {
  by: '고용노동부 · 한국직업능력연구원',
  what: '2020~2024년 자격 취득 당시 실업 상태였던 중장년 24만 명 추적',
  when: '2025년 9월 공표',
  metric: '자격 취득 후 6개월 이내 취업률',
} as const;

export interface CertOutcome {
  /** 국가기술자격 종목명 */
  name: string;
  /** 취득 후 6개월 내 취업률(%). null = 공표 데이터에 없음 */
  rate6m: number | null;
  /** 취업 시 월평균 임금(만원). null = 공표 데이터에 없음 */
  payMonthly: number | null;
  /** 인터넷 추천 글에 자주 등장하는가 — 기대와 현실의 간격을 보기 위한 표시 */
  hyped?: boolean;
  note?: string;
}

/** 취업률이 확인된 종목 — 취업률 내림차순 */
export const certOutcomes: CertOutcome[] = [
  { name: '공조냉동기계기능사', rate6m: 54.3, payMonthly: null, note: '취업률 1위. 건물 냉난방·설비 유지보수' },
  { name: '에너지관리기능사', rate6m: 53.8, payMonthly: null, note: '보일러·열관리. 시설관리 법정 선임 대상' },
  { name: '산림기능사', rate6m: 52.6, payMonthly: null, note: '산림청·지자체 사업 연계' },
  { name: '승강기기능사', rate6m: 51.9, payMonthly: null, note: '승강기 안전관리 법정 인력' },
  { name: '전기기능사', rate6m: 49.8, payMonthly: null, hyped: true, note: '추천도 많고 실제 취업률도 상위' },

  // 임금이 확인된 종목 — 취업률은 공표 목록에 없음
  { name: '타워크레인운전기능사', rate6m: null, payMonthly: 369, note: '월임금 1위. 고소 작업이라 체력·건강검진 요건 확인 필요' },
  { name: '천공기운전기능사', rate6m: null, payMonthly: 326, note: '건설 기초공사' },
  { name: '불도저운전기능사', rate6m: null, payMonthly: 295, note: '건설 토목' },
];

/**
 * 인터넷 추천 상위인데 위 공표 목록에 취업률이 없는 종목.
 * "나쁘다"가 아니라 "확인된 숫자가 없다"는 뜻이다. 이 구분이 이 화면의 핵심이다.
 */
export const hypedWithoutData: string[] = [
  '지게차운전기능사',
  '요양보호사',
  '사회복지사2급',
  '공인중개사',
  '주택관리사',
  '한식조리기능사',
];

/** 취업률이 확인된 종목 중 상위 n개 */
export function topByRate(n = 5): CertOutcome[] {
  return certOutcomes
    .filter((c) => c.rate6m !== null)
    .sort((a, b) => (b.rate6m as number) - (a.rate6m as number))
    .slice(0, n);
}

/** 임금이 확인된 종목 중 상위 n개 */
export function topByPay(n = 3): CertOutcome[] {
  return certOutcomes
    .filter((c) => c.payMonthly !== null)
    .sort((a, b) => (b.payMonthly as number) - (a.payMonthly as number))
    .slice(0, n);
}

/**
 * 한 종목에 대해 화면에 그대로 쓸 수 있는 한 문장.
 * 없는 숫자를 있는 것처럼 말하지 않는다.
 */
export function readOut(name: string): string {
  const hit = certOutcomes.find((c) => c.name === name);
  if (hit?.rate6m != null) {
    return `이 자격을 딴 중장년 100명 중 ${Math.round(hit.rate6m)}명이 6개월 안에 일을 찾았습니다.`;
  }
  if (hit?.payMonthly != null) {
    return `취업하신 분들의 월평균 임금이 ${hit.payMonthly}만원입니다. 취업률은 공표된 자료에 없습니다.`;
  }
  if (hypedWithoutData.includes(name)) {
    return '많이 추천되는 자격이지만, 중장년 취업률로 공표된 숫자는 아직 없습니다. 학원 설명만으로 정하지 마시고 채용 공고에서 이 자격을 실제로 요구하는지 먼저 확인해 보십시오.';
  }
  return '공표된 중장년 취업 통계에 없는 종목입니다.';
}
