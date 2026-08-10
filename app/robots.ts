import type { MetadataRoute } from 'next';

/** 검색 노출 = 광고비 안 드는 유일한 유통 경로. 막을 이유가 있는 페이지가 아직 없다. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://dalnaru.vercel.app/sitemap.xml',
  };
}
