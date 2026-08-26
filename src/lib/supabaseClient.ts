import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://knfaopfuvnlwhzyjehkf.supabase.co';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_uS8ITLdCAb7BIwcPHuQhxA_dv5BcqCB';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Uploads any image file directly to the Supabase Cloud Storage bucket (platform-media)
 * and returns the permanent public CDN URL.
 */
export async function uploadImageToSupabase(file: File, folder: string = 'media'): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop() || 'png';
    const cleanFileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('platform-media')
      .upload(cleanFileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.warn('Supabase storage upload notice:', error.message);
      return null;
    }

    const { data: publicData } = supabase.storage
      .from('platform-media')
      .getPublicUrl(cleanFileName);

    return publicData?.publicUrl || null;
  } catch (err) {
    console.error('Error uploading image to Supabase:', err);
    return null;
  }
}
