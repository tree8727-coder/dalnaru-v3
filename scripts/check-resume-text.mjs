/**
 * 이력서 문장이 네 가지 연차 선택지 모두에서 말이 되는지 검사한다.
 *
 * 왜 있는가: 2026-08-11 프로덕션 완주 테스트에서 이력서 본문에
 * "10년 이하 동안 건설/건축 현장을 지켜온" 이 찍혀 있었다.
 * 칩 라벨을 문장에 그대로 박아서 생긴 일이고, 네 칩 중 둘이 그랬다.
 * 기업에 내는 문서라 어색한 한 줄이 그대로 사용자의 손해가 된다.
 *
 * 실행: npm run check:resume
 */
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../lib/funnelData.ts', import.meta.url), 'utf8');

const chips = (src.match(/export const YEAR_CHIPS = \[([^\]]+)\]/)?.[1] ?? '')
  .split(',').map((s) => s.trim().replace(/^'|'$/g, '')).filter(Boolean);

const phrases = [...src.matchAll(/'([^']+)':\s*'([^']+)',/g)]
  .filter(([, k]) => chips.includes(k))
  .reduce((m, [, k, v]) => ({ ...m, [k]: v }), {});

// 문장에 값이 끼워지는 자리들. 새 자리가 생기면 여기에 한 줄 추가한다.
const SLOTS = [
  (p) => `${p} 동안 건설/건축 현장을 지켜온 실무 전문가입니다.`,
  (p) => `${p}, 하나의 길`,
  (p) => `별도 자격 대신 ${p} 실무 경력으로 증명`,
  (p) => `${p} 건설/건축 실무 전문가`,
];

// 값 자체가 어겨선 안 되는 규칙
const BAD_VALUE = [
  [/이하|이상|~|-/, '범위 표현("이하·이상·~")은 문장에 넣으면 비문이 된다'],
  [/넘게|가까이|이상$/, '"넘게/가까이"는 뒤에 "동안"이 붙으면 비문이 된다'],
  [/평생/, '"평생"은 기간이 아니라 수식어라 표 칸과 문장 모두에서 어색하다'],
];

let bad = 0;
const fail = (m) => { console.error('✗', m); bad++; };

if (!chips.length) fail('YEAR_CHIPS를 못 찾았다');

for (const chip of chips) {
  const p = phrases[chip];
  if (!p) { fail(`'${chip}' 에 대응하는 문장 표현이 YEARS_PHRASE에 없다 — 라벨이 그대로 박힌다`); continue; }
  for (const [re, why] of BAD_VALUE) {
    if (re.test(p)) fail(`'${chip}' -> '${p}' : ${why}`);
  }
  console.log(`✓ '${chip}' -> '${p}'`);
  SLOTS.forEach((f) => console.log(`    ${f(p)}`));
}

if (bad) { console.error(`\n${bad}건 — lib/funnelData.ts의 YEARS_PHRASE를 고칠 것.`); process.exit(1); }
console.log('\n네 선택지 모두 문장이 성립한다.');
