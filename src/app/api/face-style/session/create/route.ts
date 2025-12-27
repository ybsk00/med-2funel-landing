import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Service role client for storage operations
function getAdminClient() {
    return createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

export async function POST() {
    try {
        const supabase = await createClient();

        // 1. 사용자 인증 확인
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // 2. 동의 확인 - 모달 내에서 프론트엔드 동의 완료 후 호출되므로 생략
        // DB 동의 테이블 체크는 선택적 구현 (현재 미사용)

        // 3. 새 세션 생성
        const { data: session, error: sessionError } = await supabase
            .from('face_style_sessions')
            .insert({
                user_id: user.id,
                status: 'created',
            })
            .select()
            .single();

        if (sessionError || !session) {
            console.error('Session creation error:', sessionError);
            return NextResponse.json(
                { error: 'Failed to create session' },
                { status: 500 }
            );
        }

        // 4. Storage signed upload URL 생성 (service_role 사용)
        const adminClient = getAdminClient();
        const objectPath = `${user.id}/${session.id}/original.jpg`;

        const { data: uploadData, error: uploadError } = await adminClient.storage
            .from('face-style')
            .createSignedUploadUrl(objectPath);

        if (uploadError || !uploadData) {
            console.error('Upload URL error:', uploadError);
            // 세션 삭제 (롤백)
            await supabase.from('face_style_sessions').delete().eq('id', session.id);
            return NextResponse.json(
                { error: 'Failed to create upload URL' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            sessionId: session.id,
            signedUploadUrl: uploadData.signedUrl,
            objectPath: objectPath,
            expiresIn: 60, // 60초 후 만료
        });

    } catch (error) {
        console.error('Session create error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
