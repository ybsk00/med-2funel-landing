/**
 * 병원 설정 모듈
 * 중앙 집중식 설정 관리
 */

export { loadHospitalConfig, getHospitalConfig, getConfigValue, generateCSSVariables } from './loader';
export { HospitalConfigSchema } from './schema';
export type { HospitalConfig, Contact, ColorScheme, HeroConfig, ModuleConfig, Persona, Track } from './schema';

// 과별 기본값 export
export { dermatologyDefaults } from './defaults/dermatology';
export { dentistryDefaults } from './defaults/dentistry';
export { orthopedicsDefaults } from './defaults/orthopedics';
export { urologyDefaults } from './defaults/urology';
export { internalMedicineDefaults } from './defaults/internal-medicine';
export { oncologyDefaults } from './defaults/oncology';
export { koreanMedicineDefaults } from './defaults/korean-medicine';
export { plasticSurgeryDefaults } from './defaults/plastic-surgery';
export { pediatricsDefaults } from './defaults/pediatrics';
export { neurosurgeryDefaults } from './defaults/neurosurgery';
export { obgynDefaults } from './defaults/obgyn';
