/**
 * 과별 v2 설정 로더 (클라이언트/서버 양쪽 안전)
 * fs 모듈 미사용 - 정적 import만 사용
 */

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
 * 과별 v2 설정 로드 (fs 미사용 - 클라이언트/서버 양쪽 사용 가능)
 * 각 과별 독립적인 설정을 반환
 */
export function getDepartmentV2Config(department: string): HospitalConfig {
  const defaults = DEPARTMENT_DEFAULTS[department] || dermatologyDefaults;
  // version 필드가 없는 기본값에 자동 주입
  const withVersion = { version: '2.0' as const, ...defaults };
  const result = HospitalConfigSchema.safeParse(withVersion);

  if (!result.success) {
    console.error('V2 config validation error for', department, result.error.format());
    const fallback = HospitalConfigSchema.safeParse({ version: '2.0' as const, ...dermatologyDefaults });
    return fallback.success ? fallback.data : { version: '2.0' as const, ...defaults } as HospitalConfig;
  }

  return result.data;
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
