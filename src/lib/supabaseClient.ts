import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://knfaopfuvnlwhzyjehkf.supabase.co';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_uS8ITLdCAb7BIwcPHuQhxA_dv5BcqCB';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
