import type { MetadataRoute } from 'next';

const SITE = 'https://dalnaru.vercel.app';

/** 문(門)만 싣는다. /gift는 선물 링크로 받아 들어오는 자리라 검색 대상이 아니다. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE, priority: 1 },
    { url: `${SITE}/funnel`, priority: 0.9 },
    { url: `${SITE}/calc`, priority: 0.7 },
    { url: `${SITE}/call`, priority: 0.7 },
    { url: `${SITE}/guide`, priority: 0.7 },
  ];
}
