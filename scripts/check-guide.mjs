/**
 * /guide 레시피의 "실측값"이 아직 사실인지 점검한다.
 *
 * 왜 있는가: 2026-08-10에 `winget install hledger`(패키지 없음)와
 * ImageMagick 별 4.4만(실제 1.7만)이 라이브 상태로 발견됐다.
 * 붙여넣은 명령이 실패하거나 수치가 부풀려지면 그걸로 신뢰가 끝난다.
 *
 * 실행: node scripts/check-guide.mjs   (winget·gh 필요. 수동 점검용이라 CI에 안 건다)
 * 종료코드 1이면 lib/guideData.ts를 고칠 것.
 */
import { readFileSync } from 'node:fs';
import { execFileSync, execSync } from 'node:child_process';

const src = readFileSync(new URL('../lib/guideData.ts', import.meta.url), 'utf8');

// 주석에도 명령 문자열이 나오므로 installCmd 값 안에서만 찾는다.
// 소스에는 줄바꿈이 리터럴 \n 두 글자로 들어 있어 그대로면 명령 끝을 못 자른다.
const cmds = [...src.matchAll(/installCmd: '([^']*)'/g)].map((m) => m[1].replace(/\\n/g, '\n')).join('\n');
const ids = [...cmds.matchAll(/winget install (?:--id )?([\w.-]+)/g)].map((m) => m[1]);
const npmPkgs = [...cmds.matchAll(/npm install -g (\S+)/g)].map((m) => m[1]);
const repos = [...src.matchAll(/repo: '([^']+)'/g)].map((m) => m[1]);
const stars = [...src.matchAll(/stars: '([\d.]+)(만|천)'/g)].map(([, n, u]) =>
  Math.round(Number(n) * (u === '만' ? 10000 : 1000)),
);

let bad = 0;
const fail = (msg) => { console.error('✗', msg); bad++; };

for (const id of ids) {
  try {
    execFileSync('winget', ['show', '--id', id, '--exact'], { stdio: 'ignore' });
    console.log('✓ winget', id);
  } catch {
    fail(`winget 패키지 없음: ${id} — 붙여넣으면 실패하는 명령이다`);
  }
}

for (const pkg of npmPkgs) {
  try {
    // npm은 윈도우에서 .cmd라 execFile로는 못 띄운다(Node가 막음). 인자는 이 저장소 소스에서만 온다.
    execSync(`npm view ${pkg} version`, { stdio: 'ignore' });
    console.log('✓ npm', pkg);
  } catch {
    fail(`npm 패키지 없음: ${pkg} — 붙여넣으면 실패하는 명령이다`);
  }
}

if (repos.length !== stars.length) fail(`repo ${repos.length}개 / stars ${stars.length}개 — 짝이 안 맞는다`);

repos.forEach((repo, i) => {
  let actual;
  try {
    actual = Number(execFileSync('gh', ['api', `repos/${repo}`, '--jq', '.stargazers_count'], { encoding: 'utf8' }).trim());
  } catch {
    return fail(`GitHub에서 못 찾음: ${repo}`);
  }
  const claimed = stars[i];
  // 표기는 유효숫자 2자리라 오차를 허용한다. 20% 넘게 벌어지면 부풀린 수치로 본다.
  const off = Math.abs(actual - claimed) / actual;
  const line = `${repo}: 표기 ${claimed.toLocaleString()} / 실제 ${actual.toLocaleString()}`;
  if (off > 0.2) fail(`${line} — ${Math.round(off * 100)}% 차이`);
  else console.log('✓', line);
});

if (bad) { console.error(`\n${bad}건 — lib/guideData.ts를 고칠 것.`); process.exit(1); }
console.log('\n전부 사실.');
