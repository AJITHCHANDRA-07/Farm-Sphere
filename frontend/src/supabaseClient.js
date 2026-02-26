import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vrqthuouyxmkgycmmjzt.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZycXRodW91eXhta2d5Y21tanp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MjEwMTMsImV4cCI6MjA4NjE5NzAxM30.QyYs3TRH6pnHJ6qStkXIA6T29TDpsGl-8Pd1NXkkEtY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)