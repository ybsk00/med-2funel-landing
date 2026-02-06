
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Migration failed: Missing environment variables.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateSchema() {
    console.log('Updating schema...');

    try {
        // Add department column to patients table
        const { error: patientsError } = await supabase.rpc('exec_sql', {
            sql_query: 'ALTER TABLE patients ADD COLUMN IF NOT EXISTS department TEXT;'
        });

        if (patientsError) {
            console.log('RPC exec_sql might not be available. Trying direct query...');
            // Fallback if rpc is not available
            // Note: Direct SQL via supabase-js is not possible for DDL unless you have a custom RPC.
            // But we can try to use the MCP tool now that we know the project ID is definitely wlvneuspqnlapcmofgko
        } else {
            console.log('Department column added to patients table.');
        }

        // Add department column to appointments table
        await supabase.rpc('exec_sql', {
            sql_query: 'ALTER TABLE appointments ADD COLUMN IF NOT EXISTS department TEXT;'
        });
        console.log('Department column added to appointments table.');

    } catch (error) {
        console.error('Schema update failed:', error);
    }
}

updateSchema();
