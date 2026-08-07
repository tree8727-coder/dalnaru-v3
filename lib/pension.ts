/**
 * 은퇴 자금 시뮬레이션 — 결정적 계산, AI 아님.
 *
 * 근거 수치 (화면에도 출처를 표기한다 — proto 정직성 규칙):
 * - 기대수명 83.7세 (남 80.8 · 여 86.6) — 국가데이터처(통계청) 2024년 생명표,
 *   2024-12 발표, 2026-08-08 확인
 * - 물가상승률 연 2% 가정 (한국은행 물가안정목표)
 * - 국민연금 수령 개시 65세 가정 (1969년생 이후 기준)
 */

export const LIFE_EXPECTANCY = 83.7;
export const INFLATION = 0.02;
export const PENSION_START_AGE = 65;
/** 2026년 적용 최저임금 시급 (고용노동부 고시, 2026-08-08 확인) */
export const MIN_WAGE = 10320;

/** 월 부족액(만원) → 주 몇 시간 일하면 채워지는가 (최저시급 기준, 월 4.345주) */
export function hoursPerWeekToCover(monthlyGapManwon: number): number {
  if (monthlyGapManwon <= 0) return 0;
  return Math.ceil((monthlyGapManwon * 10000) / MIN_WAGE / 4.345);
}

export interface SimInput {
  age: number;          // 현재 나이
  assets: number;       // 보유 금융자산 (만원)
  pension: number;      // 65세부터 예상 월 연금 (만원)
  spend: number;        // 현재 기준 월 생활비 (만원)
  horizon: number;      // 몇 세까지 계획하는가
}

export interface SimYear { age: number; assets: number }

export interface SimResult {
  crevasseYears: number;        // 소득 크레바스 (지금~65세)
  depletionAge: number | null;  // 자산이 바닥나는 나이 (null = 계획 수명까지 버팀)
  series: SimYear[];            // 나이별 자산 잔액 (시각화용)
  monthlyGapAt65: number;       // 65세 시점 월 부족액 (물가 반영, 만원)
}

export function simulate(inp: SimInput): SimResult {
  const series: SimYear[] = [];
  let assets = inp.assets;
  let depletionAge: number | null = null;
  let monthlyGapAt65 = 0;

  for (let age = inp.age; age <= inp.horizon; age++) {
    const yearsFromNow = age - inp.age;
    const spendNow = inp.spend * Math.pow(1 + INFLATION, yearsFromNow); // 물가 반영 생활비
    const income = age >= PENSION_START_AGE ? inp.pension : 0;          // 연금은 명목 고정 가정(보수적)
    const yearlyGap = (spendNow - income) * 12;
    assets -= yearlyGap;
    if (age === PENSION_START_AGE) monthlyGapAt65 = Math.max(0, Math.round(spendNow - income));
    if (assets < 0 && depletionAge === null) depletionAge = age;
    series.push({ age, assets: Math.round(assets) });
  }

  return {
    crevasseYears: Math.max(0, PENSION_START_AGE - inp.age),
    depletionAge,
    series,
    monthlyGapAt65,
  };
}
