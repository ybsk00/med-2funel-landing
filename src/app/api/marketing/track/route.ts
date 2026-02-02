import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Rate limit: simple in-memory store (for MVP; use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 60; // 60 requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (!record || now > record.resetTime) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
        return true;
    }

    if (record.count >= RATE_LIMIT) {
        return false;
    }

    record.count++;
    return true;
}

function getDeviceType(userAgent: string): 'mobile' | 'tablet' | 'desktop' {
    const ua = userAgent.toLowerCase();
    if (/tablet|ipad|playbook|silk/i.test(ua)) {
        return 'tablet';
    }
    if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) {
        return 'mobile';
    }
    return 'desktop';
}

export async function POST(request: NextRequest) {
    try {
        // Rate limit check
        const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
        if (!checkRateLimit(ip)) {
            return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
        }

        const body = await request.json();

        // Required fields validation
        const { visitor_id, session_id, event_name } = body;
        if (!visitor_id || !session_id || !event_name) {
            return NextResponse.json(
                { error: 'Missing required fields: visitor_id, session_id, event_name' },
                { status: 400 }
            );
        }

        // Field length limits
        const maxLength = 500;
        const sanitize = (val: string | null | undefined) =>
            val ? val.substring(0, maxLength) : null;

        // Get user agent and device type
        const userAgent = request.headers.get('user-agent') || '';
        const deviceType = getDeviceType(userAgent);

        // Supabase client (service role for insert)
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Insert event
        const { error } = await supabase.from('marketing_events').insert({
            visitor_id: sanitize(visitor_id),
            session_id: sanitize(session_id),
            user_id: body.user_id || null,
            event_name: sanitize(event_name),
            page_url: sanitize(body.page_url),
            landing_url: sanitize(body.landing_url),
            referrer: sanitize(body.referrer),
            utm_source: sanitize(body.utm_source),
            utm_medium: sanitize(body.utm_medium),
            utm_campaign: sanitize(body.utm_campaign),
            utm_content: sanitize(body.utm_content),
            utm_term: sanitize(body.utm_term),
            sub1: sanitize(body.sub1),
            sub2: sanitize(body.sub2),
            // click_ids: body.click_ids || null,
            user_agent: userAgent.substring(0, 1000),
            // device_type: deviceType,
            login_source: sanitize(body.login_source),
            prompt_version_id: sanitize(body.prompt_version_id),
            flow_version_id: sanitize(body.flow_version_id),
            metadata: body.metadata || null
        });

        if (error) {
            console.error('Marketing track error details:', {
                code: error.code,
                message: error.message,
                details: error.details,
                hint: error.hint
            });
            // Silent fail - return success to not break user experience
            return NextResponse.json({ success: true, silent_error: true });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Marketing track exception:', error);
        // Silent fail
        return NextResponse.json({ success: true, silent_error: true });
    }
}
