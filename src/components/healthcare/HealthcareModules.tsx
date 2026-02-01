"use client";

import { HospitalConfig } from "@/lib/config/hospital";
import { ArrowUpRight, BarChart2, Calendar, Droplet, Heart, Shield, Sparkles, Thermometer, User, Zap, Lock, Activity, Sun, Camera, Beaker } from "lucide-react";
import Link from "next/link";

interface HealthcareModulesProps {
    config: HospitalConfig;
}

// 모듈 아이콘/컬러 매핑
const MODULE_CONFIG: Record<string, { icon: any; color: string; gradient: string }> = {
    'glow-booster': { icon: Sparkles, color: 'pink', gradient: 'from-pink-500/20 to-pink-600/20' },
    'makeup-killer': { icon: Droplet, color: 'rose', gradient: 'from-rose-500/20 to-rose-600/20' },
    'barrier-reset': { icon: Shield, color: 'teal', gradient: 'from-teal-500/20 to-teal-600/20' },
    'lifting-check': { icon: ArrowUpRight, color: 'purple', gradient: 'from-purple-500/20 to-purple-600/20' },
    'skin-concierge': { icon: Heart, color: 'fuchsia', gradient: 'from-fuchsia-500/20 to-fuchsia-600/20' },
};

export default function HealthcareModules({ config }: HealthcareModulesProps) {
    if (!config.landingModules || !config.theme) return null;

    return (
        <section className="px-6 py-20 max-w-7xl mx-auto relative z-20">
            <div className="flex flex-col md:flex-row gap-12 items-start">
                <div className="w-full md:w-1/3 space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold leading-tight" style={{ color: config.theme.text }}>
                        <span style={{ color: config.theme.primary }}>AI 진단</span>으로<br />
                        시작하는<br />
                        맞춤 케어
                    </h2>
                    <p className="text-lg leading-relaxed opacity-80" style={{ color: config.theme.text }}>
                        내 고민에 딱 맞는 솔루션을<br />
                        가장 빠르고 정확하게 확인해보세요.
                    </p>
                </div>

                <div className="w-full md:w-2/3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {config.landingModules.map((module: any) => {
                            // 아이콘 매핑
                            const ICON_MAP: any = {
                                'Sparkles': Sparkles,
                                'Droplet': Droplet,
                                'Shield': Shield,
                                'ArrowUpRight': ArrowUpRight,
                                'Heart': Heart,
                                'User': User,
                                'Activity': Activity,
                                'Sun': Sun,
                                'Camera': Camera,
                                'Thermometer': Thermometer,
                                'Zap': Zap,
                                'Lock': Lock,
                                'Calendar': Calendar,
                                'Beaker': Droplet, // Fallback
                                'BarChart': BarChart2
                            };
                            const IconComponent = ICON_MAP[module.icon] || Sparkles;

                            // 컬러 매핑
                            const colorMap: Record<string, { border: string; shadow: string; text: string; gradient: string }> = {
                                pink: { border: 'border-pink-500/30', shadow: 'group-hover:shadow-pink-500/30', text: 'text-pink-400', gradient: 'from-pink-500/20 to-pink-600/20' },
                                rose: { border: 'border-rose-500/30', shadow: 'group-hover:shadow-rose-500/30', text: 'text-rose-400', gradient: 'from-rose-500/20 to-rose-600/20' },
                                teal: { border: 'border-teal-500/30', shadow: 'group-hover:shadow-teal-500/30', text: 'text-teal-400', gradient: 'from-teal-500/20 to-teal-600/20' },
                                purple: { border: 'border-purple-500/30', shadow: 'group-hover:shadow-purple-500/30', text: 'text-purple-400', gradient: 'from-purple-500/20 to-purple-600/20' },
                                fuchsia: { border: 'border-fuchsia-500/30', shadow: 'group-hover:shadow-fuchsia-500/30', text: 'text-fuchsia-400', gradient: 'from-fuchsia-500/20 to-fuchsia-600/20' },
                                // Add more defaults if needed
                                blue: { border: 'border-blue-500/30', shadow: 'group-hover:shadow-blue-500/30', text: 'text-blue-400', gradient: 'from-blue-500/20 to-blue-600/20' },
                                yellow: { border: 'border-yellow-500/30', shadow: 'group-hover:shadow-yellow-500/30', text: 'text-yellow-400', gradient: 'from-yellow-500/20 to-yellow-600/20' },
                                emerald: { border: 'border-emerald-500/30', shadow: 'group-hover:shadow-emerald-500/30', text: 'text-emerald-400', gradient: 'from-emerald-500/20 to-emerald-600/20' },
                                indigo: { border: 'border-indigo-500/30', shadow: 'group-hover:shadow-indigo-500/30', text: 'text-indigo-400', gradient: 'from-indigo-500/20 to-indigo-600/20' },
                                red: { border: 'border-red-500/30', shadow: 'group-hover:shadow-red-500/30', text: 'text-red-400', gradient: 'from-red-500/20 to-red-600/20' },
                                amber: { border: 'border-amber-500/30', shadow: 'group-hover:shadow-amber-500/30', text: 'text-amber-400', gradient: 'from-amber-500/20 to-amber-600/20' },
                                orange: { border: 'border-orange-500/30', shadow: 'group-hover:shadow-orange-500/30', text: 'text-orange-400', gradient: 'from-orange-500/20 to-orange-600/20' },
                                stone: { border: 'border-stone-500/30', shadow: 'group-hover:shadow-stone-500/30', text: 'text-stone-400', gradient: 'from-stone-500/20 to-stone-600/20' },
                                green: { border: 'border-green-500/30', shadow: 'group-hover:shadow-green-500/30', text: 'text-green-400', gradient: 'from-green-500/20 to-green-600/20' },
                                violet: { border: 'border-violet-500/30', shadow: 'group-hover:shadow-violet-500/30', text: 'text-violet-400', gradient: 'from-violet-500/20 to-violet-600/20' },
                            };
                            const colors = colorMap[module.color] || colorMap['pink'];

                            return (
                                <Link key={module.id} href={`healthcare/chat?topic=${module.id}`} className="group">
                                    <div className="h-full bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-skin-primary/30 transition-all duration-300 hover:scale-105 flex flex-col items-center text-center">
                                        <div className={`w-14 h-14 bg-gradient-to-br ${colors.gradient} rounded-full flex items-center justify-center mb-6 ${colors.border}`}>
                                            <IconComponent className={`w-7 h-7 ${colors.text} group-hover:scale-110 transition-transform`} />
                                        </div>
                                        <h3 className="text-lg font-bold text-skin-text mb-2 tracking-wide" style={{ color: config.theme.text }}>{module.title}</h3>
                                        <p className="text-xs text-skin-subtext leading-relaxed font-light" style={{ color: config.theme.text, opacity: 0.7 }}>
                                            {module.description}
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
