import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Check if user is staff
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const from = searchParams.get('from') || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const to = searchParams.get('to') || new Date().toISOString().split('T')[0];

        const fromDate = `${from}T00:00:00.000Z`;
        const toDate = `${to}T23:59:59.999Z`;

        // Get event counts
        const { data: events, error: eventsError } = await supabase
            .from('marketing_events')
            .select('event_name, login_source, visitor_id')
            .gte('created_at', fromDate)
            .lte('created_at', toDate);

        if (eventsError) {
            console.error('Error fetching events:', eventsError);
            return NextResponse.json({ error: eventsError.message }, { status: 500 });
        }

        // Calculate metrics
        const f1Views = events.filter(e => e.event_name === 'f1_view');
        const f2Enters = events.filter(e => e.event_name === 'f2_enter');
        const reservations = events.filter(e => e.event_name === 'reservation_created');

        // Login source breakdown
        const directLogins = f2Enters.filter(e => e.login_source === 'direct').length;
        const chatLogins = f2Enters.filter(e => e.login_source === 'chat').length;

        // CTA clicks
        const ctaClicks = events.filter(e => e.event_name === 'f1_cta_login_click').length;
        const chatLoginClicks = events.filter(e => e.event_name === 'f1_chat_login_click').length;

        // Unique visitors
        const uniqueVisitors = new Set(f1Views.map(e => e.visitor_id)).size;

        // Calculate rates (avoid division by zero)
        const f1ToF2Rate = f1Views.length > 0 ? (f2Enters.length / f1Views.length * 100).toFixed(2) : '0.00';
        const f2ToReservationRate = f2Enters.length > 0 ? (reservations.length / f2Enters.length * 100).toFixed(2) : '0.00';
        const f1ToReservationRate = f1Views.length > 0 ? (reservations.length / f1Views.length * 100).toFixed(2) : '0.00';
        const directLoginRate = ctaClicks > 0 ? (directLogins / ctaClicks * 100).toFixed(2) : '0.00';
        const chatLoginRate = chatLoginClicks > 0 ? (chatLogins / chatLoginClicks * 100).toFixed(2) : '0.00';

        // UTM breakdown (top 5)
        const { data: utmBreakdown } = await supabase
            .from('marketing_events')
            .select('utm_source, utm_campaign')
            .gte('created_at', fromDate)
            .lte('created_at', toDate)
            .not('utm_source', 'is', null);

        const sourceCount: Record<string, number> = {};
        const campaignCount: Record<string, number> = {};

        (utmBreakdown || []).forEach(e => {
            if (e.utm_source) {
                sourceCount[e.utm_source] = (sourceCount[e.utm_source] || 0) + 1;
            }
            if (e.utm_campaign) {
                campaignCount[e.utm_campaign] = (campaignCount[e.utm_campaign] || 0) + 1;
            }
        });

        const topSources = Object.entries(sourceCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, count]) => ({ name, count }));

        const topCampaigns = Object.entries(campaignCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, count]) => ({ name, count }));

        // Average conversion time
        const { data: conversions } = await supabase
            .from('marketing_conversions')
            .select('conversion_time_seconds')
            .gte('created_at', fromDate)
            .lte('created_at', toDate)
            .not('conversion_time_seconds', 'is', null);

        const avgConversionTime = conversions && conversions.length > 0
            ? Math.round(conversions.reduce((sum, c) => sum + (c.conversion_time_seconds || 0), 0) / conversions.length)
            : null;

        return NextResponse.json({
            period: { from, to },
            metrics: {
                uniqueVisitors,
                f1Views: f1Views.length,
                f2Enters: f2Enters.length,
                reservations: reservations.length,
                directLogins,
                chatLogins,
                ctaClicks,
                chatLoginClicks
            },
            rates: {
                f1ToF2: parseFloat(f1ToF2Rate),
                f2ToReservation: parseFloat(f2ToReservationRate),
                f1ToReservation: parseFloat(f1ToReservationRate),
                directLoginRate: parseFloat(directLoginRate),
                chatLoginRate: parseFloat(chatLoginRate)
            },
            avgConversionTimeSeconds: avgConversionTime,
            topSources,
            topCampaigns
        });

    } catch (error) {
        console.error('Marketing summary error:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
