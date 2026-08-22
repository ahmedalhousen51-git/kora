/* ==========================================================================
   Kora — Supabase connection
   --------------------------------------------------------------------------
   1. Create a project at https://supabase.com  (free tier is enough)
   2. Run supabase/schema.sql in the SQL Editor
   3. Settings → API → copy "Project URL" and the "anon public" key below
   4. Redeploy. That's it — the app switches from local demo mode to live.

   Leave these empty to keep running in LOCAL DEMO MODE (browser storage only).
   The anon key is safe to expose publicly: every table is protected by Row
   Level Security and all privileged reads/writes go through SQL functions.
   ========================================================================== */
window.KORA_SUPABASE = {
  url: '',      // e.g. 'https://xxxxxxxxxxxx.supabase.co'
  anonKey: ''   // e.g. 'eyJhbGciOiJIUzI1NiIsInR5cCI6...'
};

/* Public site URL — used when generating table QR codes in the admin panel. */
window.KORA_SITE_URL = 'https://ahmedalhousen51-git.github.io/kora';
