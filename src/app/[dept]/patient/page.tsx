
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDepartmentConfig } from '@/lib/config/factory';
import DepartmentPatientHome from '@/components/patient/DepartmentPatientHome';

export default async function Page({ params }: { params: Promise<{ dept: string }> }) {
    const { dept } = await params;
    const config = await getDepartmentConfig(dept);

    // Auth Check
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const nextAuthSession = await getServerSession(authOptions);
    const isAuthenticated = !!user || !!nextAuthSession?.user;

    // Redirect if not authenticated (could redirect to a dept-specific login logic if needed, but keeping simple for now)
    if (!isAuthenticated) {
        // You might want to redirect to a login page that knows to come back here
        redirect('/login');
    }

    // Name Resolution
    let patientName = '환자';
    if (nextAuthSession?.user?.name) {
        patientName = nextAuthSession.user.name;
    } else if (user) {
        const { data: profile } = await supabase
            .from('patient_profiles')
            .select('full_name')
            .eq('user_id', user.id)
            .single();
        if (profile) patientName = profile.full_name || '환자';
    }

    // Appointment Fetching
    let upcomingAppointment = null;
    if (user) {
        const { data: appointment } = await supabase
            .from('appointments')
            .select('*')
            .eq('user_id', user.id)
            .in('status', ['scheduled', 'confirmed', 'pending'])
            .gte('scheduled_at', new Date().toISOString())
            .order('scheduled_at', { ascending: true })
            .limit(1)
            .single();
        if (appointment) upcomingAppointment = appointment;
    } else if (nextAuthSession?.user?.id) {
        const { data: appointment } = await supabase
            .from('appointments')
            .select('*')
            .eq('naver_user_id', nextAuthSession.user.id)
            .in('status', ['scheduled', 'confirmed', 'pending'])
            .gte('scheduled_at', new Date().toISOString())
            .order('scheduled_at', { ascending: true })
            .limit(1)
            .single();
        if (appointment) upcomingAppointment = appointment;
    }

    return (
        <DepartmentPatientHome
            dept={dept}
            config={config}
            patientName={patientName}
            upcomingAppointment={upcomingAppointment}
        />
    );
}
