-- Run this in the Supabase SQL editor (or via `supabase db push`)
-- to set up the table backing the website's contact form.

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  business text not null,
  email text not null,
  phone text not null,
  service text,
  message text not null
);

-- Enable Row Level Security
alter table public.contact_submissions enable row level security;

-- Allow anyone (using the public anon key) to INSERT a submission,
-- but never allow reading, updating, or deleting from the client.
-- View/manage submissions from the Supabase dashboard (or with the
-- service_role key from a trusted server) instead.
drop policy if exists "Anyone can submit the contact form" on public.contact_submissions;
create policy "Anyone can submit the contact form"
  on public.contact_submissions
  for insert
  to anon
  with check (true);
