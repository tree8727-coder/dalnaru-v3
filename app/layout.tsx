import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

/**
 * 공유 링크 미리보기(OG) — 유통 경로가 카톡·밴드 링크 공유라 카드가 안 뜨면 그대로 손실이다.
 * 카드 이미지는 `public/og.png`, 원본 HTML은 `public/og-source.html`(고칠 때 그걸 열어 다시 캡처).
 * 로고·마스코트는 넣지 않았다 — vault brand-visual-log 기준 컨셉 확정 전까지 만들지 않는다.
 * 문구는 전부 앱에 이미 있는 확정 카피(랜딩 타이틀·안내데스크 인사)에서 가져왔다.
 */
const SITE = "https://dalnaru.vercel.app";
const DESC = "3분 대화로 평생 경력을 기업에 바로 낼 이력서로 정리해 드립니다. 서강대 연구실에서 시작한 5060 경력 서비스.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  // 하위 페이지 title이 이미 "달나루 — …" 형태라 template을 두면 브랜드명이 두 번 붙는다.
  title: "달나루 — 평생 경력, 다시 일이 되게",
  description: DESC,
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "달나루",
    title: "달나루 — 평생 경력, 다시 일이 되게",
    description: DESC,
    url: SITE,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "달나루 — 평생 경력, 다시 일이 되게" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "달나루 — 평생 경력, 다시 일이 되게",
    description: DESC,
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
