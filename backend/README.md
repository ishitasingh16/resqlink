# ResQLink Backend

The backend database layer is implemented with Supabase PostgreSQL. The
frontend uses the Supabase JavaScript client when credentials are configured
and falls back to local demo data otherwise.

## Database setup

Run these files in the Supabase SQL Editor, in order:

1. [`supabase/schema.sql`](supabase/schema.sql)
2. [`supabase/seed.sql`](supabase/seed.sql)

The schema includes tables, row-level security policies, indexes, and the
stored procedures used by allocation approval and completion workflows.
