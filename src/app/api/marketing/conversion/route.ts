import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface TouchData {
    utm_source: string | null;
    utm_medium: string | null;
    utm_campaign: string | null;
    utm_content: string | null;
    utm_term: string | null;
    sub1: string | null;
    sub2: string | null;
    referrer: string | null;
    click_ids: object | null;
    event_id: string;
    event_time: string;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { reservation_id } = body;
        if (!reservation_id) {
            return NextResponse.json(
                { error: 'Missing required field: reservation_id' },
                { status: 400 }
            );
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Check for duplicate conversion
        const { data: existing } = await supabase
            .from('marketing_conversions')
            .select('id')
            .eq('reservation_id', reservation_id)
            .single();

        if (existing) {
            return NextResponse.json({
                success: true,
                message: 'Conversion already recorded',
                duplicate: true
            });
        }

        const user_id = body.user_id || null;
        const visitor_id = body.visitor_id || null;

        // 1. Insert reservation_created event
        const { data: eventData, error: eventError } = await supabase
            .from('marketing_events')
            .insert({
                visitor_id: visitor_id || 'unknown',
                session_id: body.session_id || 'unknown',
                user_id,
                event_name: 'reservation_created',
                page_url: body.page_url,
                metadata: { reservation_id }
            })
            .select('id, created_at')
            .single();

        if (eventError) {
            console.error('Error inserting reservation event:', eventError);
        }

        // 2. Find attribution touches (30-day window)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Build query for valid touches
        let touchQuery = supabase
            .from('marketing_events')
            .select('id, created_at, utm_source, utm_medium, utm_campaign, utm_content, utm_term, sub1, sub2, referrer, click_ids')
            .gte('created_at', thirtyDaysAgo.toISOString());

        // Priority: user_id first, then visitor_id
        if (user_id) {
            touchQuery = touchQuery.eq('user_id', user_id);
        } else if (visitor_id) {
            touchQuery = touchQuery.eq('visitor_id', visitor_id);
        } else {
            // No identifier - create with empty attribution
            const { error: convError } = await supabase
                .from('marketing_conversions')
                .insert({
                    reservation_id,
                    user_id,
                    visitor_id,
                    last_touch: { source: 'unknown' },
                    first_touch: null,
                    path_summary: 'No attribution data'
                });

            if (convError) {
                console.error('Error inserting conversion:', convError);
            }

            return NextResponse.json({ success: true, attribution: 'none' });
        }

        // Filter for valid touches (has UTM, referrer, or click_ids)
        const { data: touches, error: touchError } = await touchQuery
            .order('created_at', { ascending: true });

        if (touchError) {
            console.error('Error fetching touches:', touchError);
        }

        // Filter valid touches (must have some attribution data)
        const validTouches = (touches || []).filter(t =>
            t.utm_source || t.utm_campaign || t.referrer || t.click_ids
        );

        // Build touch snapshots
        const buildTouchData = (touch: typeof validTouches[0]): TouchData => ({
            utm_source: touch.utm_source,
            utm_medium: touch.utm_medium,
            utm_campaign: touch.utm_campaign,
            utm_content: touch.utm_content,
            utm_term: touch.utm_term,
            sub1: touch.sub1,
            sub2: touch.sub2,
            referrer: touch.referrer,
            click_ids: touch.click_ids,
            event_id: touch.id,
            event_time: touch.created_at
        });

        const firstTouch = validTouches.length > 0 ? buildTouchData(validTouches[0]) : null;
        const lastTouch = validTouches.length > 0
            ? buildTouchData(validTouches[validTouches.length - 1])
            : { source: 'direct' };

        // Calculate conversion time (from first f1_view to reservation)
        let conversionTimeSeconds: number | null = null;
        if (validTouches.length > 0) {
            const { data: f1Event } = await supabase
                .from('marketing_events')
                .select('created_at')
                .eq(user_id ? 'user_id' : 'visitor_id', user_id || visitor_id)
                .eq('event_name', 'f1_view')
                .order('created_at', { ascending: true })
                .limit(1)
                .single();

            if (f1Event && eventData) {
                const f1Time = new Date(f1Event.created_at).getTime();
                const convTime = new Date(eventData.created_at).getTime();
                conversionTimeSeconds = Math.floor((convTime - f1Time) / 1000);
            }
        }

        // Build path summary
        const pathEvents = validTouches.slice(0, 5).map(t =>
            t.utm_source || t.referrer?.split('/')[2] || 'direct'
        );
        const pathSummary = pathEvents.join(' → ') + (validTouches.length > 5 ? ' → ...' : '');

        // 3. Insert conversion record
        const { error: convError } = await supabase
            .from('marketing_conversions')
            .insert({
                reservation_id,
                user_id,
                visitor_id,
                attributed_event_id: validTouches.length > 0 ? validTouches[validTouches.length - 1].id : null,
                last_touch: lastTouch,
                first_touch: firstTouch,
                path_summary: pathSummary || 'Direct',
                conversion_time_seconds: conversionTimeSeconds
            });

        if (convError) {
            console.error('Error inserting conversion:', convError);
            return NextResponse.json({ success: false, error: convError.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            last_touch: lastTouch,
            first_touch: firstTouch,
            conversion_time_seconds: conversionTimeSeconds,
            path_summary: pathSummary
        });

    } catch (error) {
        console.error('Marketing conversion exception:', error);
        return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
    }
}
