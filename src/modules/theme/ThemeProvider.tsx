"use client";

import React, { createContext, useContext, useState } from 'react';
import { HospitalConfig } from '../config/schema';
import { getDepartmentV2Config } from '../config/department-config';

const ThemeContext = createContext<HospitalConfig | null>(null);

interface ThemeProviderProps {
  children: React.ReactNode;
  initialConfig?: HospitalConfig;
}

/**
 * isColorDark - 색상 밝기 판단 유틸리티
 */
function isColorDark(hex?: string): boolean {
  if (!hex) return false;
  let h = hex.replace('#', '');
  if (h.length === 3) {
    h = h.split('').map(c => c + c).join('');
  }
  if (h.length !== 6) return false;
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5;
}

/**
 * 테마 프로바이더 (SSR-Safe)
 * CSS 변수를 inline style로 즉시 주입 (useEffect 제거)
 */
export function ThemeProvider({ children, initialConfig }: ThemeProviderProps) {
  const [config] = useState<HospitalConfig>(() => {
    return initialConfig || getDepartmentV2Config('dermatology');
  });

  const isDark = isColorDark(config.theme.healthcare.colors.background);

  // SSR-Safe: inline style로 CSS 변수 직접 주입
  const scopeStyle: React.CSSProperties = {
    // 헬스케어 영역 CSS 변수
    ['--skin-primary' as string]: config.theme.healthcare.colors.primary,
    ['--skin-secondary' as string]: config.theme.healthcare.colors.secondary,
    ['--skin-accent' as string]: config.theme.healthcare.colors.accent,
    ['--skin-bg' as string]: config.theme.healthcare.colors.background,
    ['--skin-text' as string]: config.theme.healthcare.colors.text,
    ['--skin-bg-secondary' as string]: isDark ? '#0F2535' : '#F8FAFC',
    ['--skin-surface' as string]: isDark ? '#152A3D' : '#FFFFFF',
    ['--skin-subtext' as string]: isDark ? '#94A3B8' : '#64748B',
    ['--skin-muted' as string]: isDark ? '#1E3A5F' : '#E2E8F0',
    // 메디컬 영역 CSS 변수
    ['--medical-primary' as string]: config.theme.medical.colors.primary,
    ['--medical-secondary' as string]: config.theme.medical.colors.secondary,
    ['--medical-accent' as string]: config.theme.medical.colors.accent,
    ['--medical-bg' as string]: config.theme.medical.colors.background,
    ['--medical-text' as string]: config.theme.medical.colors.text,
    // 치과 호환 변수
    ['--dental-primary' as string]: config.theme.healthcare.colors.primary,
    ['--dental-bg' as string]: config.theme.healthcare.colors.background,
    ['--dental-glow' as string]: 'rgba(59, 130, 246, 0.3)',
    // 병원 정보
    ['--hospital-name' as string]: config.hospital.name,
    ['--hospital-id' as string]: config.hospital.id,
  };

  return (
    <ThemeContext.Provider value={config}>
      <div style={scopeStyle}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

/**
 * 설정값 훅
 */
export function useHospitalConfig(): HospitalConfig {
  const context = useContext(ThemeContext);
  if (!context) {
    // Provider 외부에서 사용 시 기본값 반환
    return getDepartmentV2Config('dermatology');
  }
  return context;
}

/**
 * 특정 영역의 설정만 가져오기
 */
export function useHealthcareConfig() {
  const config = useHospitalConfig();
  return config.healthcare;
}

export function useMedicalConfig() {
  const config = useHospitalConfig();
  return config.medical;
}

export function useHospitalInfo() {
  const config = useHospitalConfig();
  return config.hospital;
}

export function useThemeConfig() {
  const config = useHospitalConfig();
  return config.theme;
}
