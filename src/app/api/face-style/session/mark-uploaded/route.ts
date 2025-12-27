import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Service role client for variant operations
function getAdminClient() {
    return createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const body = await request.json();
        const { sessionId } = body;

        if (!sessionId) {
            return NextResponse.json(
                { error: 'sessionId is required' },
                { status: 400 }
            );
        }

        // 1. 사용자 인증 확인
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // 2. 세션 소유권 확인
        const { data: session, error: sessionError } = await supabase
            .from('face_style_sessions')
            .select('*')
            .eq('id', sessionId)
            .eq('user_id', user.id)
            .single();

        if (sessionError || !session) {
            return NextResponse.json(
                { error: 'Session not found' },
                { status: 404 }
            );
        }

        if (session.status !== 'created') {
            return NextResponse.json(
                { error: 'Session already processed', currentStatus: session.status },
                { status: 400 }
            );
        }

        // 3. 세션 상태를 'uploaded'로 업데이트 + original_uploaded_at 기록
        const { error: updateError } = await supabase
            .from('face_style_sessions')
            .update({
                status: 'uploaded',
                original_image_path: `${user.id}/${sessionId}/original.jpg`,
                original_uploaded_at: new Date().toISOString(),
            })
            .eq('id', sessionId);

        if (updateError) {
            console.error('Session update error:', updateError);
            return NextResponse.json(
                { error: 'Failed to update session' },
                { status: 500 }
            );
        }

        // 4. variants 3개 생성 (service_role 사용 - RLS 우회)
        const adminClient = getAdminClient();
        const variantKeys = ['natural', 'makeup', 'bright'] as const;

        const variantsToInsert = variantKeys.map(key => ({
            session_id: sessionId,
            variant_key: key,
            status: 'queued',
        }));

        const { error: variantError } = await adminClient
            .from('face_style_variants')
            .insert(variantsToInsert);

        if (variantError) {
            console.error('Variants creation error:', variantError);
            // 롤백: 세션 상태 복구
            await supabase
                .from('face_style_sessions')
                .update({ status: 'created' })
                .eq('id', sessionId);
            return NextResponse.json(
                { error: 'Failed to create variants' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            sessionId: sessionId,
            status: 'uploaded',
            variants: variantKeys,
        });

    } catch (error) {
        console.error('Mark uploaded error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
