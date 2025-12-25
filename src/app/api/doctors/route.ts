import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
    try {
        const supabase = await createClient()

        const { data: doctors, error } = await supabase
            .from('doctors')
            .select('id, name, title, display_name, education, specialty, tracks, image_url')
            .eq('is_active', true)
            .order('sort_order', { ascending: true })

        if (error) {
            console.error('Doctors fetch error:', error)
            return NextResponse.json({ error: '의사 목록 조회 실패' }, { status: 500 })
        }

        return NextResponse.json({ doctors: doctors || [] })
    } catch (error) {
        console.error('Doctors API error:', error)
        return NextResponse.json({ error: '서버 오류' }, { status: 500 })
    }
}
