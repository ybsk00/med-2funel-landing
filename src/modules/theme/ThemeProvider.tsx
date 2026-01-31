"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { HospitalConfig } from '../config/schema';
import { getHospitalConfig, generateCSSVariables } from '../config/loader';

const ThemeContext = createContext<HospitalConfig | null>(null);

interface ThemeProviderProps {
  children: React.ReactNode;
  initialConfig?: HospitalConfig;
}

/**
 * 테마 프로바이더
 * 설정값을 CSS 변수로 주입하고 컨텍스트로 제공
 */
export function ThemeProvider({ children, initialConfig }: ThemeProviderProps) {
  const [config] = useState<HospitalConfig>(() => {
    // 서버에서 제공된 초기 설정이 있으면 사용, 없으면 로드
    return initialConfig || getHospitalConfig();
  });

  useEffect(() => {
    // CSS 변수 주입
    const cssVariables = generateCSSVariables(config);
    
    // 기존 스타일 태그 확인
    let styleTag = document.getElementById('hospital-theme-variables');
    
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'hospital-theme-variables';
      document.head.appendChild(styleTag);
    }
    
    styleTag.textContent = cssVariables;
    
    // 메타 태그 업데이트
    document.title = config.hospital.name;
    
    // 파비콘 업데이트 (옵션)
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon && config.healthcare.branding.logoImage) {
      favicon.setAttribute('href', config.healthcare.branding.logoImage);
    }
    
    console.log('🎨 Theme applied:', config.hospital.name);
  }, [config]);

  return (
    <ThemeContext.Provider value={config}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * 설정값 훅
 */
export function useHospitalConfig(): HospitalConfig {
  const context = useContext(ThemeContext);
  if (!context) {
    // Provider 외부에서 사용 시 새로 로드
    return getHospitalConfig();
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
