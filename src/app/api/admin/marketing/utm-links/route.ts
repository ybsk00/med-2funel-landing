import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// UTM 채널별 기본 매핑
const CHANNEL_MAPPINGS: Record<string, { source: string; medium: string }> = {
    meta: { source: 'meta', medium: 'paid_social' },
    google: { source: 'google', medium: 'cpc' },
    naver: { source: 'naver', medium: 'cpc' },
    blog: { source: 'naver_blog', medium: 'referral' },
    other: { source: '', medium: '' }
};

function generateShortId(): string {
    return Math.random().toString(36).substring(2, 8);
}

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = (page - 1) * limit;

        const { data: links, error, count } = await supabase
            .from('utm_links')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            page,
            limit,
            total: count,
            data: links
        });

    } catch (error) {
        console.error('UTM links GET error:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { channel, landing_url, campaign_name, content, term, sub1, sub2, memo } = body;

        if (!channel || !landing_url || !campaign_name) {
            return NextResponse.json(
                { error: 'Missing required fields: channel, landing_url, campaign_name' },
                { status: 400 }
            );
        }

        // Get channel mapping
        const mapping = CHANNEL_MAPPINGS[channel] || CHANNEL_MAPPINGS.other;

        // Build UTM parameters
        const utm_source = body.utm_source || mapping.source || channel;
        const utm_medium = body.utm_medium || mapping.medium || 'referral';

        // Format campaign with date
        const now = new Date();
        const monthStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
        const utm_campaign = `${campaign_name}_${monthStr}`;

        // Auto-generate content if not provided
        const utm_content = content || `auto_${channel}_${generateShortId()}`;

        // Auto-generate sub1/sub2 if toggled
        const final_sub1 = sub1 || (body.auto_sub1 ? `auto_sub1_${generateShortId()}` : null);
        const final_sub2 = sub2 || (body.auto_sub2 ? `auto_sub2_${generateShortId()}` : null);

        // Build final URL
        const url = new URL(landing_url);
        url.searchParams.set('utm_source', utm_source);
        url.searchParams.set('utm_medium', utm_medium);
        url.searchParams.set('utm_campaign', utm_campaign);
        url.searchParams.set('utm_content', utm_content);
        if (term) url.searchParams.set('utm_term', term);
        if (final_sub1) url.searchParams.set('sub1', final_sub1);
        if (final_sub2) url.searchParams.set('sub2', final_sub2);

        const final_url = url.toString();

        // Save to database
        const { data: link, error } = await supabase
            .from('utm_links')
            .insert({
                created_by: user.id,
                channel,
                landing_url,
                final_url,
                utm_source,
                utm_medium,
                utm_campaign,
                utm_content,
                utm_term: term || null,
                sub1: final_sub1,
                sub2: final_sub2,
                memo: memo || null
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            data: link,
            final_url
        });

    } catch (error) {
        console.error('UTM links POST error:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
