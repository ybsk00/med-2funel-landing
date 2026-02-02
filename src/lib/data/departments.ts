import { createClient } from '@/lib/supabase/client';
import { DEPARTMENTS } from '@/lib/constants/departments';
import { Department } from '@/lib/constants/departments';

// Supabase client instance
const supabase = createClient();

export interface DepartmentConfigDB {
    id: string;
    name: string;
    label: string;
    virtual_name: string;
    representative: string;
    slogan: string;
    logo_icon: string;
    logo_color: string;
    theme: any;
}

/**
 * Fetch all departments from Supabase
 * Falls back to static constants if DB fetch fails
 */
export async function getDepartments(): Promise<Department[]> {
    try {
        const { data, error } = await supabase
            .from('departments')
            .select('*');

        if (error) {
            console.error('Error fetching departments:', error);
            // Return static data as fallback, but we should probably inform the user
            return Object.values(DEPARTMENTS);
        }

        if (!data || data.length === 0) {
            // If DB is empty, return static data
            return Object.values(DEPARTMENTS);
        }

        // Merge DB data with static data structure to ensure all properties exist
        return Object.values(DEPARTMENTS).map(staticDept => {
            const dbDept = data.find(d => d.id === staticDept.id);
            if (!dbDept) return staticDept;

            return mergeDeptData(staticDept, dbDept);
        });

    } catch (e) {
        console.error('Unexpected error fetching departments:', e);
        return Object.values(DEPARTMENTS);
    }
}

/**
 * Fetch a specific department by ID
 */
export async function getDepartment(id: string): Promise<Department> {
    try {
        const { data, error } = await supabase
            .from('departments')
            .select('*')
            .eq('id', id)
            .single();

        const staticDept = DEPARTMENTS[id];

        if (error || !data) {
            // console.warn(`Department ${id} not found in DB, using static data.`);
            return staticDept;
        }

        return mergeDeptData(staticDept, data);

    } catch (e) {
        // console.error(`Error fetching department ${id}:`, e);
        return DEPARTMENTS[id];
    }
}

/**
 * Update department configuration
 */
export async function updateDepartment(id: string, updates: Partial<DepartmentConfigDB>) {
    const { data, error } = await supabase
        .from('departments')
        .update(updates)
        .eq('id', id)
        .select();

    if (error) throw error;
    return data;
}

/**
 * Helper to merge Static Data + DB Data
 */
function mergeDeptData(staticDept: Department, dbDept: any): Department {
    return {
        ...staticDept,
        branding: {
            ...staticDept.branding,
            name: dbDept.virtual_name || staticDept.branding?.name || dbDept.name,
            representative: dbDept.representative || staticDept.branding?.representative,
            slogan: dbDept.slogan || staticDept.branding?.slogan,
            logoParams: {
                icon: dbDept.logo_icon || staticDept.branding?.logoParams?.icon || 'Sparkles',
                color: dbDept.logo_color || staticDept.branding?.logoParams?.color || 'pink',
            }
        },
        theme: dbDept.theme ? { ...staticDept.theme, ...dbDept.theme } : staticDept.theme
    };
}
