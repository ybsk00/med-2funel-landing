import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Service role client for all operations
function getAdminClient() {
    return createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

// 4종 시술 variant 키
type VariantKey = 'laser' | 'botox' | 'filler' | 'booster' | 'natural' | 'makeup' | 'bright';

// 간단한 이미지 처리 (Sharp 없이 원본 복사)
// 실제 프로덕션에서는 Sharp 또는 외부 API 사용 권장
async function processVariant(
    adminClient: ReturnType<typeof getAdminClient>,
    userId: string,
    sessionId: string,
    variantKey: VariantKey
): Promise<{ success: boolean; imagePath?: string; error?: string }> {
    try {
        // 원본 이미지 다운로드
        const originalPath = `${userId}/${sessionId}/original.jpg`;
        const { data: originalData, error: downloadError } = await adminClient.storage
            .from('face-style')
            .download(originalPath);

        if (downloadError || !originalData) {
            return { success: false, error: 'Failed to download original' };
        }

        // TODO: 실제 이미지 처리 로직 (Sharp, Cloud Vision API 등)
        // 현재는 원본을 그대로 복사 (placeholder)
        const variantPath = `${userId}/${sessionId}/${variantKey}.jpg`;

        const { error: uploadError } = await adminClient.storage
            .from('face-style')
            .upload(variantPath, originalData, {
                contentType: 'image/jpeg',
                upsert: true,
            });

        if (uploadError) {
            return { success: false, error: 'Failed to upload variant' };
        }

        return { success: true, imagePath: variantPath };
    } catch (error) {
        console.error(`Variant ${variantKey} processing error:`, error);
        return { success: false, error: 'Processing failed' };
    }
}

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

        // 2. 세션 확인
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

        if (session.status !== 'uploaded') {
            return NextResponse.json(
                { error: 'Session must be in uploaded status', currentStatus: session.status },
                { status: 400 }
            );
        }

        // 3. 세션 상태를 'generating'으로 업데이트
        await supabase
            .from('face_style_sessions')
            .update({ status: 'generating' })
            .eq('id', sessionId);

        const adminClient = getAdminClient();

        // 4. 선택된 단일 variant 또는 기본값
        const targetVariant: VariantKey = variant || 'laser';
        const results: Record<string, { success: boolean; error?: string }> = {};

        // 단일 variant만 처리
        const result = await processVariant(adminClient, user.id, sessionId, targetVariant);
        results[targetVariant] = { success: result.success, error: result.error };

        // variant 레코드 생성/업데이트 (upsert)
        await adminClient
            .from('face_style_variants')
            .upsert({
                session_id: sessionId,
                variant_key: targetVariant,
                status: result.success ? 'done' : 'failed',
                image_path: result.imagePath || null,
            }, {
                onConflict: 'session_id,variant_key'
            });

        // 5. 최종 세션 상태 결정
        const finalStatus = result.success ? 'ready' : 'failed';
        const errorMessage = result.success ? null : result.error;

        await supabase
            .from('face_style_sessions')
            .update({
                status: finalStatus,
                error_message: errorMessage,
            })
            .eq('id', sessionId);

        return NextResponse.json({
            success: result.success,
            sessionId: sessionId,
            status: finalStatus,
            variant: targetVariant,
            results: results,
        });

    } catch (error) {
        console.error('Generate error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
