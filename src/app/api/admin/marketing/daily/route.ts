import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const from = searchParams.get('from') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const to = searchParams.get('to') || new Date().toISOString().split('T')[0];

        const fromDate = `${from}T00:00:00.000Z`;
        const toDate = `${to}T23:59:59.999Z`;

        // Get all events in date range
        const { data: events, error } = await supabase
            .from('marketing_events')
            .select('event_name, created_at, login_source')
            .gte('created_at', fromDate)
            .lte('created_at', toDate)
            .in('event_name', ['f1_view', 'f2_enter', 'reservation_created']);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Group by date
        const dailyData: Record<string, {
            date: string;
            f1_view: number;
            f2_enter: number;
            reservation_created: number;
            direct_login: number;
            chat_login: number;
        }> = {};

        (events || []).forEach(event => {
            const date = event.created_at.split('T')[0];

            if (!dailyData[date]) {
                dailyData[date] = {
                    date,
                    f1_view: 0,
                    f2_enter: 0,
                    reservation_created: 0,
                    direct_login: 0,
                    chat_login: 0
                };
            }

            if (event.event_name === 'f1_view') {
                dailyData[date].f1_view++;
            } else if (event.event_name === 'f2_enter') {
                dailyData[date].f2_enter++;
                if (event.login_source === 'direct') {
                    dailyData[date].direct_login++;
                } else if (event.login_source === 'chat') {
                    dailyData[date].chat_login++;
                }
            } else if (event.event_name === 'reservation_created') {
                dailyData[date].reservation_created++;
            }
        });

        // Convert to array and sort by date
        const dailyArray = Object.values(dailyData)
            .sort((a, b) => a.date.localeCompare(b.date))
            .map(day => ({
                ...day,
                f1ToF2Rate: day.f1_view > 0 ? parseFloat((day.f2_enter / day.f1_view * 100).toFixed(2)) : 0,
                f2ToReservationRate: day.f2_enter > 0 ? parseFloat((day.reservation_created / day.f2_enter * 100).toFixed(2)) : 0,
                f1ToReservationRate: day.f1_view > 0 ? parseFloat((day.reservation_created / day.f1_view * 100).toFixed(2)) : 0
            }));

        return NextResponse.json({
            period: { from, to },
            data: dailyArray
        });

    } catch (error) {
        console.error('Marketing daily error:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
