
import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "@mantine/core/styles.css";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { ColorSchemeScript } from "@mantine/core";
import MantineWrapper from "@/components/MantineWrapper";
import NextAuthProvider from "@/components/NextAuthProvider";
// ThemeProvider를 루트에서 제거 - 각 과별 페이지가 독립적으로 HospitalProvider 사용

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-noto-sans-kr",
});

export const metadata: Metadata = {
  title: "AI 헬스케어 플랫폼",
  description: "AI 기반 맞춤형 헬스케어 솔루션",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <ColorSchemeScript />
      </head>
      <body className={`${notoSansKr.variable} font-sans antialiased`}>
        <NextAuthProvider>
          <MantineWrapper>
            {process.env.NEXT_PUBLIC_GA_ID && (
              <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
            )}
            {children}
          </MantineWrapper>
        </NextAuthProvider>
      </body>
    </html>
  );
}
