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
        const date = searchParams.get('date');
        const source = searchParams.get('source');
        const campaign = searchParams.get('campaign');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');

        let query = supabase
            .from('marketing_conversions')
            .select('*')
            .order('created_at', { ascending: false });

        // Apply filters
        if (date) {
            const startDate = `${date}T00:00:00.000Z`;
            const endDate = `${date}T23:59:59.999Z`;
            query = query.gte('created_at', startDate).lte('created_at', endDate);
        }

        // Pagination
        const offset = (page - 1) * limit;
        query = query.range(offset, offset + limit - 1);

        const { data: conversions, error, count } = await query;

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Filter by source/campaign in last_touch (post-query since it's JSONB)
        let filtered = conversions || [];

        if (source) {
            filtered = filtered.filter(c => {
                const lt = c.last_touch as Record<string, unknown>;
                return lt && lt.utm_source === source;
            });
        }

        if (campaign) {
            filtered = filtered.filter(c => {
                const lt = c.last_touch as Record<string, unknown>;
                return lt && lt.utm_campaign === campaign;
            });
        }

        // Format response
        const formattedConversions = filtered.map(c => ({
            id: c.id,
            created_at: c.created_at,
            reservation_id: c.reservation_id,
            user_id: c.user_id,
            visitor_id: c.visitor_id,
            last_touch: c.last_touch,
            first_touch: c.first_touch,
            path_summary: c.path_summary,
            conversion_time_seconds: c.conversion_time_seconds,
            conversion_time_formatted: c.conversion_time_seconds
                ? formatDuration(c.conversion_time_seconds)
                : null
        }));

        return NextResponse.json({
            page,
            limit,
            total: count,
            data: formattedConversions
        });

    } catch (error) {
        console.error('Marketing conversions error:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

function formatDuration(seconds: number): string {
    if (seconds < 60) return `${seconds}초`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}분 ${seconds % 60}초`;
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}시간 ${mins}분`;
}
