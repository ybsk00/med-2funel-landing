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

// 4종 시술 variant 키
type VariantKey = 'laser' | 'botox' | 'filler' | 'booster' | 'natural' | 'makeup' | 'bright';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const body = await request.json();
        const { sessionId, variant } = body;

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

        // 4. 선택된 단일 variant만 생성 (service_role 사용 - RLS 우회)
        const adminClient = getAdminClient();
        const targetVariant: VariantKey = variant || 'laser';

        const { error: variantError } = await adminClient
            .from('face_style_variants')
            .upsert({
                session_id: sessionId,
                variant_key: targetVariant,
                status: 'queued',
            }, {
                onConflict: 'session_id,variant_key'
            });

        if (variantError) {
            console.error('Variant creation error:', variantError);
            // 롤백: 세션 상태 복구
            await supabase
                .from('face_style_sessions')
                .update({ status: 'created' })
                .eq('id', sessionId);
            return NextResponse.json(
                { error: 'Failed to create variant' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            sessionId: sessionId,
            status: 'uploaded',
            variant: targetVariant,
        });

    } catch (error) {
        console.error('Mark uploaded error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
