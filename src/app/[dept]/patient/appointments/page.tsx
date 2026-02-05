
import { createClient } from '@/lib/supabase/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDepartmentConfig } from '@/lib/config/factory';
import DepartmentAppointmentListPage from '@/components/patient/DepartmentAppointmentListPage';

export default async function Page({ params }: { params: Promise<{ dept: string }> }) {
    const { dept } = await params;
    const config = await getDepartmentConfig(dept);
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const nextAuthSession = await getServerSession(authOptions);

    let appointments: any[] = [];

    if (user) {
        // Supabase Auth
        const { data } = await supabase
            .from('appointments')
            .select('*')
            .eq('user_id', user.id)
            .order('scheduled_at', { ascending: true });
        if (data) appointments = data;
    } else if (nextAuthSession?.user?.id) {
        // NextAuth (Naver)
        const { data } = await supabase
            .from('appointments')
            .select('*')
            .eq('naver_user_id', nextAuthSession.user.id)
            .order('scheduled_at', { ascending: true });
        if (data) appointments = data;
    }

    return (
        <DepartmentAppointmentListPage
            dept={dept}
            config={config}
            initialAppointments={appointments}
        />
    );
}
