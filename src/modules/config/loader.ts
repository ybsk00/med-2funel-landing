/**
 * 병원 설정 로더
 * YAML/JSON 설정 파일을 로드하고 검증
 */

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import yaml from 'js-yaml';
import { HospitalConfig, HospitalConfigSchema } from './schema';

// 과별 기본값 import
import { dermatologyDefaults } from './defaults/dermatology';
import { dentistryDefaults } from './defaults/dentistry';
import { orthopedicsDefaults } from './defaults/orthopedics';
import { urologyDefaults } from './defaults/urology';
import { internalMedicineDefaults } from './defaults/internal-medicine';
import { oncologyDefaults } from './defaults/oncology';
import { koreanMedicineDefaults } from './defaults/korean-medicine';
import { plasticSurgeryDefaults } from './defaults/plastic-surgery';
import { pediatricsDefaults } from './defaults/pediatrics';
import { neurosurgeryDefaults } from './defaults/neurosurgery';
import { obgynDefaults } from './defaults/obgyn';

// 과별 기본값 매핑
const DEPARTMENT_DEFAULTS: Record<string, Partial<HospitalConfig>> = {
  dermatology: dermatologyDefaults,
  dentistry: dentistryDefaults,
  orthopedics: orthopedicsDefaults,
  urology: urologyDefaults,
  'internal-medicine': internalMedicineDefaults,
  oncology: oncologyDefaults,
  'korean-medicine': koreanMedicineDefaults,
  'plastic-surgery': plasticSurgeryDefaults,
  pediatrics: pediatricsDefaults,
  neurosurgery: neurosurgeryDefaults,
  obgyn: obgynDefaults,
};

/**
 * 병원 설정 로드
 * 1. config/hospital-config.yaml 파일 확인
 * 2. 없으면 과별 기본값 사용
 * 3. Zod로 검증
 */
export function loadHospitalConfig(): HospitalConfig {
  const configPath = join(process.cwd(), 'config', 'hospital-config.yaml');
  const jsonConfigPath = join(process.cwd(), 'config', 'hospital-config.json');
  
  let config: Partial<HospitalConfig> = {};
  let sourceFile = '';
  
  // 1. YAML 파일 확인
  if (existsSync(configPath)) {
    try {
      const yamlContent = readFileSync(configPath, 'utf-8');
      config = yaml.load(yamlContent) as Partial<HospitalConfig>;
      sourceFile = 'hospital-config.yaml';
    } catch (error) {
      console.error('Error loading YAML config:', error);
    }
  }
  // 2. JSON 파일 확인
  else if (existsSync(jsonConfigPath)) {
    try {
      const jsonContent = readFileSync(jsonConfigPath, 'utf-8');
      config = JSON.parse(jsonContent);
      sourceFile = 'hospital-config.json';
    } catch (error) {
      console.error('Error loading JSON config:', error);
    }
  }
  
  // 3. 기본값 병합
  const department = config.hospital?.department || 'dermatology';
  const defaults = DEPARTMENT_DEFAULTS[department] || dermatologyDefaults;
  
  // 깊은 병합
  const mergedConfig = deepMerge(defaults, config);
  
  // 4. Zod 검증
  const result = HospitalConfigSchema.safeParse(mergedConfig);
  
  if (!result.success) {
    console.error('Config validation error:', result.error.format());
    console.warn('Using default config...');
    return defaults as HospitalConfig;
  }
  
  if (sourceFile) {
    console.log(`✅ Hospital config loaded from: ${sourceFile}`);
  } else {
    console.log(`✅ Using default config for: ${department}`);
  }
  
  return result.data;
}

/**
 * 서버 사이드 설정 로드 (캐싱 지원)
 */
let cachedConfig: HospitalConfig | null = null;

export function getHospitalConfig(): HospitalConfig {
  if (typeof window !== 'undefined') {
    // 클라이언트에서는 캐시된 값 반환
    return cachedConfig || loadHospitalConfig();
  }
  
  // 서버에서는 매번 로드 (개발) 또는 캐시 (프로덕션)
  if (process.env.NODE_ENV === 'production' && cachedConfig) {
    return cachedConfig;
  }
  
  cachedConfig = loadHospitalConfig();
  return cachedConfig;
}

/**
 * 설정 값 조회 헬퍼
 */
export function getConfigValue<T>(
  path: string,
  defaultValue?: T
): T | undefined {
  const config = getHospitalConfig();
  const keys = path.split('.');
  
  let value: unknown = config;
  for (const key of keys) {
    if (value && typeof value === 'object') {
      value = (value as Record<string, unknown>)[key];
    } else {
      return defaultValue;
    }
  }
  
  return (value as T) ?? defaultValue;
}

/**
 * CSS 변수 생성
 */
export function generateCSSVariables(config: HospitalConfig): string {
  const { healthcare, medical } = config.theme;
  
  return `
    :root {
      /* 헬스케어 영역 */
      --skin-primary: ${healthcare.colors.primary};
      --skin-secondary: ${healthcare.colors.secondary};
      --skin-accent: ${healthcare.colors.accent};
      --skin-bg: ${healthcare.colors.background};
      --skin-text: ${healthcare.colors.text};
      
      /* 메디컬 영역 */
      --medical-primary: ${medical.colors.primary};
      --medical-secondary: ${medical.colors.secondary};
      --medical-accent: ${medical.colors.accent};
      --medical-bg: ${medical.colors.background};
      --medical-text: ${medical.colors.text};
      
      /* 기타 변수 */
      --hospital-name: "${config.hospital.name}";
      --hospital-id: "${config.hospital.id}";
    }
  `;
}

/**
 * 깊은 병합 유틸리티
 */
function deepMerge<T>(target: T, source: Partial<T>): T {
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] as T[Extract<keyof T, string>], source[key] as Partial<T[Extract<keyof T, string>]>);
    } else if (source[key] !== undefined) {
      result[key] = source[key] as T[Extract<keyof T, string>];
    }
  }
  
  return result;
}

/**
 * 사용 가능한 과목 목록
 */
export const AVAILABLE_DEPARTMENTS = Object.keys(DEPARTMENT_DEFAULTS);

/**
 * 과목별 표시 이름
 */
export const DEPARTMENT_LABELS: Record<string, string> = {
  dermatology: '피부과',
  dentistry: '치과',
  orthopedics: '정형외과',
  urology: '비뇨기과',
  'internal-medicine': '내과',
  oncology: '암요양병원',
  'korean-medicine': '한의원',
  'plastic-surgery': '성형외과',
  pediatrics: '소아과',
  neurosurgery: '신경외과',
  obgyn: '산부인과',
};
