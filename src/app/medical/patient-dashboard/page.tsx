'use client';

import dynamic from 'next/dynamic';

const PatientDashboardClient = dynamic(
    () => import('./PatientDashboardClient'),
    {
        ssr: false,
        loading: () => <div className="min-h-screen bg-traditional-bg flex items-center justify-center">로딩중...</div>
    }
);

export default function PatientDashboardPage() {
    return <PatientDashboardClient />;
}
