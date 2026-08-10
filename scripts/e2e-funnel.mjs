/**
 * 이력서 퍼널 완주 테스트 — 진짜 폰(390x844)으로 끝까지 눌러본다.
 *
 * 실행:
 *   npm run check:e2e                       (프로덕션)
 *   npm run check:e2e -- http://localhost:3000/funnel   (로컬)
 *
 * 왜 있는가: 2026-08-11에 처음 돌렸더니 아무도 못 보던 것 둘이 나왔다.
 *   - 봇이 같은 칭찬을 연달아 두 번 함
 *   - 이력서 본문에 "10년 이하 동안 …지켜온" 이라는 비문
 * 둘 다 대화를 끝까지 가야만 보인다. 빌드도 타입체크도 잡아주지 않는다.
 * **배포 전에 한 번 돌린다.**
 *
 * 시스템에 깔린 Chrome을 그대로 쓴다(브라우저 내려받지 않음).
 * 보는 것: 막힌 지점 · 봇 반복 발화 · 콘솔 에러 · 가로 넘침 · Firestore 수집 여부.
 * 끝나면 final.png(전체 화면)를 남긴다.
 */
import { chromium } from 'playwright-core';

const URL = process.argv[2] ?? 'https://dalnaru.vercel.app/funnel';
const MAX_STEPS = 80;

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  locale: 'ko-KR',
});
const page = await ctx.newPage();

const consoleErrors = [];
const netFails = [];
const firestoreWrites = [];
page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 300)); });
page.on('pageerror', (e) => consoleErrors.push('PAGEERROR: ' + String(e).slice(0, 300)));
page.on('requestfailed', (r) => netFails.push(`${r.method()} ${r.url().slice(0, 160)} — ${r.failure()?.errorText}`));
page.on('response', (r) => {
  const u = r.url();
  if (/firestore|googleapis/.test(u)) firestoreWrites.push(`${r.status()} ${u.slice(0, 110)}`);
});

await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });

const overflow = async () => page.evaluate(() => ({
  scroll: document.documentElement.scrollWidth,
  inner: window.innerWidth,
}));
console.log('가로폭:', JSON.stringify(await overflow()));

const log = [];
let lastSig = '';
let stuck = 0;

for (let step = 0; step < MAX_STEPS; step++) {
  await page.waitForTimeout(900); // 타자 애니메이션이 끝나야 칩이 뜬다

  // 흐름을 되돌리거나 무한루프를 만드는 컨트롤은 제외한다.
  // (이력서 '완성 보기/접기' 토글에 갇혀서 진행이 멈췄던 적 있음)
  const SKIP = /완성\s*(보기|접기)|글자 크게|보통 크기|복사|한 줄 남기기|인쇄|PDF/;
  const all = page.locator('button:visible:not([disabled])');
  const chipsAll = [];
  for (let i = 0; i < (await all.count()); i++) {
    const el = all.nth(i);
    const t = (await el.innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
    if (t && !SKIP.test(t)) chipsAll.push({ el, t });
  }
  const chips = { count: async () => chipsAll.length, first: () => chipsAll[0]?.el };
  const input = page.locator('input.funnel-input:visible, textarea:visible').first();

  const botText = (await page.locator('.funnel-bubble.bot').last().innerText().catch(() => '')).slice(0, 90);
  const n = await chips.count();
  const hasInput = await input.count();

  const sig = `${botText}|${n}|${hasInput}`;
  if (sig === lastSig) { stuck++; } else { stuck = 0; lastSig = sig; }
  if (stuck >= 4) { log.push(`[${step}] 멈춤 — 더 진행할 수 있는 요소가 없음`); break; }

  if (hasInput) {
    const ph = (await input.getAttribute('placeholder')) ?? '';
    const val = /이름/.test(ph) ? '홍길동' : '30년간 현장에서 배운 것은 사람을 먼저 챙기면 사고가 줄어든다는 것입니다.';
    await input.fill(val);
    await input.press('Enter');
    log.push(`[${step}] 입력("${ph.slice(0, 24)}") <- ${val.slice(0, 20)}…`);
    continue;
  }

  if (n > 0) {
    // 마지막(가장 아래) 칩이 대개 '다음/완료' 계열이라 첫 칩을 고른다 — 실제 사용자와 비슷하게
    const target = chips.first();
    const label = chipsAll[0].t.slice(0, 34);
    await target.click({ timeout: 8000 }).catch((e) => log.push(`[${step}] 클릭 실패: ${e.message.slice(0, 80)}`));
    log.push(`[${step}] 봇="${botText.slice(0, 40)}" 클릭="${label}"`);
    continue;
  }

  log.push(`[${step}] 누를 것도 입력할 것도 없음 (봇="${botText.slice(0, 50)}")`);
}

console.log('\n--- 진행 로그 ---');
log.forEach((l) => console.log(l));

console.log('\n가로폭(최종):', JSON.stringify(await overflow()));
const resumeVisible = await page.locator('.resume-doc, [class*="resume"]').count();
console.log('이력서 문서 요소 수:', resumeVisible);
console.log('최종 URL:', page.url());

await page.screenshot({ path: 'final.png', fullPage: true });

// 봇이 같은 말을 연달아 하지 않는지 — 경청 톤이 이 제품의 차별점이라 반복은 치명적이다
const bubbles = await page.locator('.funnel-bubble.bot').allInnerTexts();
const norm = (s) => s.replace(/[\s.,!?~—…]/g, '');
const repeats = [];
for (let i = 1; i < bubbles.length; i++) {
  const a = norm(bubbles[i - 1]), b = norm(bubbles[i]);
  const shared = [a, b].sort((x, y) => x.length - y.length)[0].slice(0, 14);
  if (shared.length >= 10 && a.includes(shared) && b.includes(shared)) {
    repeats.push(`${i - 1}↔${i}: "${bubbles[i - 1].slice(0, 40)}" / "${bubbles[i].slice(0, 40)}"`);
  }
}
console.log('\n--- 봇 반복 발화 ---');
console.log(repeats.length ? repeats.join('\n') : `없음 (봇 발화 ${bubbles.length}개 검사)`);

console.log('\n--- 콘솔 에러 ---');
console.log(consoleErrors.length ? [...new Set(consoleErrors)].join('\n') : '없음');
console.log('\n--- 실패한 네트워크 ---');
console.log(netFails.length ? [...new Set(netFails)].join('\n') : '없음');
console.log('\n--- Firestore/구글 응답 ---');
console.log(firestoreWrites.length ? [...new Set(firestoreWrites)].slice(0, 10).join('\n') : '없음(수집 안 됨!)');

await browser.close();
