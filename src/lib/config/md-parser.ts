import fs from 'fs';
import path from 'path';
import { HospitalConfig, HOSPITAL_CONFIG, LandingModuleConfig } from './hospital';

export function parseHospitalConfig(): HospitalConfig {
    try {
        const configPath = path.join(process.cwd(), 'hospital-config.md');
        if (!fs.existsSync(configPath)) {
            console.warn('hospital-config.md not found, using default config');
            return HOSPITAL_CONFIG;
        }

        const content = fs.readFileSync(configPath, 'utf-8');
        const config = { ...HOSPITAL_CONFIG };

        // Helper to extract value by key
        const extractValue = (section: string, key: string): string | undefined => {
            const sectionRegex = new RegExp(`## ${section}[\\s\\S]*?(?=##|$)`);
            const sectionMatch = content.match(sectionRegex);
            if (!sectionMatch) return undefined;

            const keyRegex = new RegExp(`- \\*\\*${key}\\*\\*: (.*)`);
            const keyMatch = sectionMatch[0].match(keyRegex);
            return keyMatch ? keyMatch[1].trim() : undefined;
        };

        // 1. Basic Info
        const name = extractValue('1. 병원 기본 정보', '병원 이름');
        if (name) config.name = name;

        const representative = extractValue('1. 병원 기본 정보', '대표자');
        if (representative) config.representative = representative;

        const address = extractValue('1. 병원 기본 정보', '주소');
        if (address) config.address = address;

        // 2. Personas (Simplified parsing for now, can be expanded)
        // ... (Existing persona parsing logic if needed, but we focus on landing modules)

        // 3. Theme
        // 3. Theme
        const primary = extractValue('3. 디자인 및 테마', '기본 색상 \\(Primary\\)');
        if (primary) config.theme.primary = primary;

        const secondary = extractValue('3. 디자인 및 테마', '보조 색상 \\(Secondary\\)');
        if (secondary) config.theme.secondary = secondary;

        const accent = extractValue('3. 디자인 및 테마', '강조 색상 \\(Accent\\)');
        if (accent) config.theme.accent = accent;

        const background = extractValue('3. 디자인 및 테마', '배경 색상 \\(Background\\)');
        if (background) config.theme.background = background;

        const text = extractValue('3. 디자인 및 테마', '텍스트 색상 \\(Text\\)');
        if (text) config.theme.text = text;

        // 4. Landing Modules
        const modulesSectionRegex = /## 4. 랜딩페이지 모듈([\s\S]*?)(?=##|$)/;
        const modulesMatch = content.match(modulesSectionRegex);

        if (modulesMatch) {
            const modulesContent = modulesMatch[1];
            const moduleRegex = /### (.*) \((.*)\)\n([\s\S]*?)(?=###|$)/g;
            const modules: LandingModuleConfig[] = [];

            let match;
            while ((match = moduleRegex.exec(modulesContent)) !== null) {
                const [_, title, id, body] = match;

                const descMatch = body.match(/- \*\*설명\*\*: (.*)/);
                const iconMatch = body.match(/- \*\*아이콘\*\*: (.*)/);
                const colorMatch = body.match(/- \*\*색상\*\*: (.*)/);

                if (descMatch && iconMatch && colorMatch) {
                    modules.push({
                        id: id.trim(),
                        title: title.trim(),
                        description: descMatch[1].trim(),
                        icon: iconMatch[1].trim(),
                        color: colorMatch[1].trim()
                    });
                }
            }

            if (modules.length > 0) {
                config.landingModules = modules;
            }
        }

        return config;
    } catch (error) {
        console.error('Error parsing hospital-config.md:', error);
        return HOSPITAL_CONFIG;
    }
}
