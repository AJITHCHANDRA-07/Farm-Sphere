🔑 **HOW TO GET SERVICE ROLE KEY:**

1. Go to: https://supabase.com/dashboard/project/vrqthuouyxmkgycmmjzt/settings/api
2. Scroll down to "Project API Keys"
3. Find the "service_role" key (it's long and starts with eyJ...)
4. Click "Copy" to copy the full key
5. Replace the placeholder in your .env file

📄 **Your .env file should look like:**
SUPABASE_URL=https://vrqthuouyxmkgycmmjzt.supabase.co
SUPABASE_ANON_KEY=sb_publishable_yCupwjxS119EP4FeCQzvJA_JIYRUBl3
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your-full-key-here
PORT=3001
