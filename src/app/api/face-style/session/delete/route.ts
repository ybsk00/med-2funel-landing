import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Service role client for storage deletion
function getAdminClient() {
    return createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

export async function DELETE(request: NextRequest) {
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
                { error: 'Session not found or not owned by user' },
                { status: 404 }
            );
        }

        const adminClient = getAdminClient();

        // 3. Storage에서 폴더 전체 삭제
        const folderPath = `${user.id}/${sessionId}`;
        const { data: files } = await adminClient.storage
            .from('face-style')
            .list(folderPath);

        if (files && files.length > 0) {
            const filesToDelete = files.map(f => `${folderPath}/${f.name}`);
            await adminClient.storage
                .from('face-style')
                .remove(filesToDelete);
        }

        // 4. face_style_variants 삭제 (cascade 또는 수동)
        await adminClient
            .from('face_style_variants')
            .delete()
            .eq('session_id', sessionId);

        // 5. face_style_sessions 삭제
        const { error: deleteError } = await supabase
            .from('face_style_sessions')
            .delete()
            .eq('id', sessionId);

        if (deleteError) {
            console.error('Session delete error:', deleteError);
            return NextResponse.json(
                { error: 'Failed to delete session' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Session and all associated files deleted',
        });

    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
