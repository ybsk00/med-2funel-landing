
import type { Metadata } from "next";
import { Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
import "@mantine/core/styles.css";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { ColorSchemeScript } from "@mantine/core";
import MantineWrapper from "@/components/MantineWrapper";
import NextAuthProvider from "@/components/NextAuthProvider";
import { HospitalProvider } from "@/components/common/HospitalProvider";
import { HOSPITAL_CONFIG } from "@/lib/config/hospital";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-noto-sans-kr",
});

const notoSerifKr = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-noto-serif-kr",
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
  // 기본 설정 (인트로용)
  const defaultConfig = HOSPITAL_CONFIG;

  return (
    <html lang="ko">
      <head>
        <ColorSchemeScript />
      </head>
      <body className={`${notoSansKr.variable} ${notoSerifKr.variable} font-sans antialiased`}>
        <NextAuthProvider>
          <HospitalProvider initialConfig={defaultConfig}>
            <MantineWrapper>
              {process.env.NEXT_PUBLIC_GA_ID && (
                <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
              )}
              {children}
            </MantineWrapper>
          </HospitalProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
