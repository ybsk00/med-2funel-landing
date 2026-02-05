
import { Pill, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getDepartmentConfig } from '@/lib/config/factory';

export default async function Page({ params }: { params: Promise<{ dept: string }> }) {
    const { dept } = await params;
    const config = await getDepartmentConfig(dept);
    const basePath = `/${dept}/patient`;

    return (
        <div className="min-h-screen pb-24" style={{ backgroundColor: '#0a0f1a' }}>
            <div className="max-w-lg mx-auto px-4 pt-6">
                <div className="flex items-center gap-4 mb-6">
                    <Link href={basePath}>
                        <button className="p-2 -ml-2 text-white hover:bg-white/10 rounded-full transition-colors">
                            <ArrowLeft size={24} />
                        </button>
                    </Link>
                    <h1 className="text-xl font-bold text-white">복약 관리</h1>
                </div>

                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mb-6">
                        <Pill size={40} className="text-gray-500" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">서비스 준비중입니다</h2>
                    <p className="text-gray-400 text-center mb-6">
                        {config.dept} 복약 관리 기능이<br />
                        곧 제공될 예정입니다.
                    </p>
                    <Link
                        href={basePath}
                        className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                    >
                        홈으로 돌아가기
                    </Link>
                </div>
            </div>
        </div>
    );
}
