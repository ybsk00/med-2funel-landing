import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { visitor_id, user_id } = body;
        if (!visitor_id || !user_id) {
            return NextResponse.json(
                { error: 'Missing required fields: visitor_id, user_id' },
                { status: 400 }
            );
        }

        // Supabase client (service role)
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Option: Retroactively update recent events with user_id
        // This links the visitor to the logged-in user for attribution
        if (body.retroactive) {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const { error } = await supabase
                .from('marketing_events')
                .update({ user_id })
                .eq('visitor_id', visitor_id)
                .gte('created_at', thirtyDaysAgo.toISOString())
                .is('user_id', null);

            if (error) {
                console.error('Marketing attach retroactive error:', error);
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Visitor attached to user. Future events will include user_id.'
        });
    } catch (error) {
        console.error('Marketing attach exception:', error);
        return NextResponse.json({ success: true, silent_error: true });
    }
}
