import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPASE_ANONKEY

export const supabase = createClient(supabaseUrl, supabaseKey)