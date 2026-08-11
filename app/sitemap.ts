import type { MetadataRoute } from 'next';
import { certOutcomes, hypedWithoutData } from '@/lib/certData';

const SITE = 'https://dalnaru.vercel.app';

/** /gift는 선물 링크로 받아 들어오는 자리라 검색 대상이 아니다.
 *  /cert/*가 실질 검색 유입구 — "○○자격증 전망"을 검색하는 5060과 자녀가 대상. */
export default function sitemap(): MetadataRoute.Sitemap {
  const certs = [...certOutcomes.map((c) => c.name), ...hypedWithoutData].map((name) => ({
    url: `${SITE}/cert/${encodeURIComponent(name)}`,
    priority: 0.8,
  }));
  return [
    { url: SITE, priority: 1 },
    { url: `${SITE}/funnel`, priority: 0.9 },
    { url: `${SITE}/cert`, priority: 0.9 },
    ...certs,
    { url: `${SITE}/calc`, priority: 0.7 },
    { url: `${SITE}/call`, priority: 0.7 },
    { url: `${SITE}/guide`, priority: 0.7 },
    { url: `${SITE}/partners`, priority: 0.5 },
  ];
}
