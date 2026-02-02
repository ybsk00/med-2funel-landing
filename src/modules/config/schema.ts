/**
 * 병원 설정 스키마 (Zod)
 * 타입 안전성과 런타임 검증을 동시에 제공
 */

import { z } from 'zod';

// ============================================
// 기본 스키마 정의
// ============================================

export const ContactSchema = z.object({
  address: z.string(),
  phone: z.string(),
  fax: z.string().optional(),
  businessNumber: z.string(),
});

export const RepresentativeSchema = z.object({
  name: z.string(),
  title: z.string(),
});

export const ColorSchemeSchema = z.object({
  primary: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Hex color required'),
  secondary: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  accent: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  background: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  text: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
});

export const DesignThemeSchema = z.object({
  texture: z.enum(['glass', 'silk', 'hanji', 'blueprint', 'carbon', 'jelly', 'flower', 'botanic', 'linen', 'hologram', 'circuit']).default('glass'),
  font: z.string().default('font-sans'),
  sound: z.string().optional(),
});

export const HeroConfigSchema = z.object({
  type: z.enum(['glow-effect', 'smile-effect', 'motion-effect', 'clean-effect']),
  headline: z.string(),
  subheadline: z.string(),
  media: z.object({
    type: z.enum(['video', 'image']),
    src: z.string(),
    poster: z.string().optional(),
  }),
});

export const ModuleConfigSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string(), // Lucide icon name
  color: z.enum(['pink', 'rose', 'teal', 'purple', 'fuchsia', 'blue', 'green', 'orange', 'red', 'cyan', 'indigo']),
});

export const PersonaSchema = z.object({
  name: z.string(),
  title: z.string(),
  purpose: z.string(),
  tone: z.string(),
  rules: z.array(z.string()),
  maxTurns: z.number().int().min(1).max(20),
});

export const TrackSchema = z.object({
  id: z.string(),
  name: z.string(),
  keywords: z.array(z.string()),
});

// ============================================
// 메인 설정 스키마
// ============================================

export const HospitalConfigSchema = z.object({
  version: z.literal('2.0'),
  
  hospital: z.object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    name: z.string(),
    department: z.enum([
      'dermatology', 
      'dentistry', 
      'orthopedics', 
      'plastic-surgery', 
      'general',
      'internal-medicine',
      'oncology',
      'korean-medicine',
      'pediatrics',
      'neurosurgery',
      'urology',
      'obgyn'
    ]),
    representative: RepresentativeSchema,
    contact: ContactSchema,
    searchKeywords: z.array(z.string()),
  }),
  
  theme: z.object({
    healthcare: z.object({
      colors: ColorSchemeSchema,
      design: DesignThemeSchema,
      hero: HeroConfigSchema,
    }),
    medical: z.object({
      colors: ColorSchemeSchema,
      design: DesignThemeSchema,
    }),
    admin: z.object({
      theme: z.enum(['dark', 'light']),
      primaryColor: z.string(),
    }),
  }),
  
  healthcare: z.object({
    branding: z.object({
      logoText: z.string(),
      logoImage: z.string().optional(),
      showHospitalName: z.literal(false), // 헬스케어는 항상 false
    }),
    modules: z.array(ModuleConfigSchema).min(1).max(6),
    persona: PersonaSchema,
    conversion: z.object({
      turn3SoftGate: z.boolean(),
      turn5HardGate: z.boolean(),
      medicalKeywords: z.array(z.string()),
    }),
  }),
  
  medical: z.object({
    branding: z.object({
      logoText: z.string(),
      logoImage: z.string().optional(),
      showHospitalName: z.literal(true), // 메디컬은 항상 true
    }),
    footer: z.object({
      showHospitalInfo: z.boolean(),
      showBusinessNumber: z.boolean(),
      showAddress: z.boolean(),
      links: z.object({
        privacy: z.string(),
        terms: z.string(),
      }),
    }),
    persona: PersonaSchema,
    tracks: z.array(TrackSchema),
    reservation: z.object({
      enableOnlineBooking: z.boolean(),
      availableDoctors: z.array(z.object({
        name: z.string(),
        title: z.string(),
        specialties: z.array(z.string()),
      })),
      timeSlots: z.array(z.string()),
    }),
  }),
  
  crm: z.object({
    title: z.string(),
    features: z.array(z.enum(['patients', 'appointments', 'chat-history', 'marketing', 'statistics'])),
    defaultView: z.string(),
  }),
  
  marketing: z.object({
    gaId: z.string().optional(),
    pixelId: z.string().optional(),
    naverAnalytics: z.string().optional(),
    utmTracking: z.boolean(),
    funnelEvents: z.array(z.string()),
  }),
});

// ============================================
// 타입 추출
// ============================================

export type HospitalConfig = z.infer<typeof HospitalConfigSchema>;
export type Contact = z.infer<typeof ContactSchema>;
export type ColorScheme = z.infer<typeof ColorSchemeSchema>;
export type HeroConfig = z.infer<typeof HeroConfigSchema>;
export type ModuleConfig = z.infer<typeof ModuleConfigSchema>;
export type Persona = z.infer<typeof PersonaSchema>;
export type Track = z.infer<typeof TrackSchema>;
