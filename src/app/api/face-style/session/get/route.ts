import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Service role client for signed URL generation
function getAdminClient() {
    return createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);
        const sessionId = searchParams.get('sessionId');

        if (!sessionId) {
            return NextResponse.json(
                { error: 'sessionId query parameter is required' },
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

        // 2. 세션 조회 (본인 소유 확인 - RLS)
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

        // 3. variants 조회
        const { data: variants, error: variantsError } = await supabase
            .from('face_style_variants')
            .select('*')
            .eq('session_id', sessionId);

        if (variantsError) {
            console.error('Variants fetch error:', variantsError);
            return NextResponse.json(
                { error: 'Failed to fetch variants' },
                { status: 500 }
            );
        }

        // 4. Signed URLs 생성 (done 상태인 variants만)
        const adminClient = getAdminClient();
        const variantUrls: Record<string, string | null> = {};

        for (const variant of variants || []) {
            if (variant.status === 'done' && variant.image_path) {
                const { data: signedData } = await adminClient.storage
                    .from('face-style')
                    .createSignedUrl(variant.image_path, 300); // 5분 만료

                variantUrls[variant.variant_key] = signedData?.signedUrl || null;
            } else {
                variantUrls[variant.variant_key] = null;
            }
        }

        // 5. 원본 이미지 URL (선택)
        let originalUrl: string | null = null;
        if (session.original_image_path) {
            const { data: originalSignedData } = await adminClient.storage
                .from('face-style')
                .createSignedUrl(session.original_image_path, 300);
            originalUrl = originalSignedData?.signedUrl || null;
        }

        return NextResponse.json({
            sessionId: session.id,
            status: session.status,
            errorMessage: session.error_message,
            createdAt: session.created_at,
            originalUrl: originalUrl,
            variants: variants?.map(v => ({
                key: v.variant_key,
                status: v.status,
                url: variantUrls[v.variant_key],
            })) || [],
        });

    } catch (error) {
        console.error('Get session error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
