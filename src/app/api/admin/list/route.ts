import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
    try {
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false,
                },
            }
        );

        const { data: staffUsers, error } = await supabaseAdmin
            .from('staff_users')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        // Get emails from auth.users for each staff user
        const usersWithEmail = await Promise.all(
            (staffUsers || []).map(async (staff) => {
                const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(staff.user_id);
                return {
                    id: staff.user_id,
                    email: authUser?.user?.email || '',
                    name: staff.display_name,
                    role: staff.role,
                    created_at: staff.created_at,
                };
            })
        );

        return NextResponse.json({ users: usersWithEmail });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || '서버 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
