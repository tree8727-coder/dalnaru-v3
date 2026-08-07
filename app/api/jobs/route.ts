/**
 * 워크넷 실공고 프록시.
 * WORKNET_API_KEY(.env.local)가 있으면 워크넷 오픈API에서 실공고를 받아오고,
 * 없거나 실패하면 { source: 'sample' }을 돌려줘 클라이언트가 예시 공고를 쓴다.
 *
 * API: http://openapi.work.go.kr/opi/opi/opia/wantedApi.do (XML)
 * 키는 서버에서만 쓰인다 — 클라이언트에 노출되지 않는다.
 */
import { NextRequest } from 'next/server';

export const revalidate = 1800; // 30분 캐시 — 개발계정 일 1,000건 한도 보호

// ponytail: XML 파서 의존성 대신 정규식 추출 — 필드 6개뿐이라 충분. 스키마가 커지면 파서로
function pick(block: string, tag: string): string {
  const m = block.match(new RegExp(`<${tag}>\\s*(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?\\s*</${tag}>`));
  return m ? m[1].trim() : '';
}

export async function GET(req: NextRequest) {
  const key = process.env.WORKNET_API_KEY;
  if (!key) return Response.json({ source: 'sample' });

  const keyword = req.nextUrl.searchParams.get('keyword') ?? '';
  const url =
    'http://openapi.work.go.kr/opi/opi/opia/wantedApi.do' +
    `?authKey=${encodeURIComponent(key)}&callTp=L&returnType=XML&startPage=1&display=20` +
    (keyword ? `&keyword=${encodeURIComponent(keyword)}` : '');

  try {
    const res = await fetch(url, { next: { revalidate } });
    if (!res.ok) throw new Error(String(res.status));
    const xml = await res.text();
    const jobs = [...xml.matchAll(/<wanted>([\s\S]*?)<\/wanted>/g)].map(([, b], i) => ({
      id: `wn-${pick(b, 'wantedAuthNo') || i}`,
      title: pick(b, 'title'),
      company: pick(b, 'company'),
      category: pick(b, 'jobsNm') || pick(b, 'region'),
      region: pick(b, 'region'),
      salary: pick(b, 'sal') || pick(b, 'salTpNm'),
      career: pick(b, 'career'),
      url: pick(b, 'wantedInfoUrl'),
      closeDt: pick(b, 'closeDt'),
    })).filter((j) => j.title && j.company);
    if (!jobs.length) return Response.json({ source: 'sample' });
    return Response.json({ source: 'worknet', jobs });
  } catch {
    return Response.json({ source: 'sample' }); // 실패해도 퍼널은 죽지 않는다
  }
}
