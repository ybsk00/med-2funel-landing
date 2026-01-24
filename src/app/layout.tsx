import type { Metadata } from "next";
import { Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
import "./globals.css";
import "@mantine/core/styles.css";
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
  title: HOSPITAL_CONFIG.name,
  description: `${HOSPITAL_CONFIG.name}에 오신 것을 환영합니다. ${HOSPITAL_CONFIG.theme.concept} 피부 관리와 미용 시술을 경험해보세요.`,
  openGraph: {
    title: HOSPITAL_CONFIG.name,
    description: `${HOSPITAL_CONFIG.name}에 오신 것을 환영합니다.`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: HOSPITAL_CONFIG.name,
    description: `${HOSPITAL_CONFIG.name}에 오신 것을 환영합니다.`,
  },
};

import { parseHospitalConfig } from "@/lib/config/md-parser";

// ... (imports)

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 서버 사이드에서 마크다운 설정 파일 파싱
  const config = parseHospitalConfig();

  return (
    <html lang="ko">
      <head>
        <ColorSchemeScript />
      </head>
      <body className={`${notoSansKr.variable} ${notoSerifKr.variable} font-sans antialiased`}>
        <NextAuthProvider>
          <HospitalProvider initialConfig={config}>
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

