begin;

create table if not exists public.topup_operations (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  idempotency_key text not null,
  user_id uuid not null references auth.users(id) on delete restrict,
  service_type text not null check (service_type in ('airtime', 'data')),
  service_code text not null,
  variation_code text,
  customer_identifier text not null,
  phone text not null,
  customer_email text not null,
  customer_name text,
  amount_minor bigint not null check (amount_minor > 0),
  currency text not null default 'NGN' check (currency = 'NGN'),
  availability_status text not null default 'unchecked'
    check (availability_status in ('unchecked', 'available', 'unknown', 'unavailable')),
  availability_route jsonb,
  payment_status text not null default 'unpaid'
    check (payment_status in ('unpaid', 'pending', 'paid', 'failed')),
  vend_status text not null default 'not_started'
    check (vend_status in ('not_started', 'queued', 'processing', 'pending', 'unknown', 'delivered', 'failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, idempotency_key)
);

create table if not exists public.topup_payment_attempts (
  id uuid primary key,
  operation_id uuid not null references public.topup_operations(id) on delete restrict,
  provider text not null check (provider in ('monnify', 'opay', 'paystack')),
  provider_reference text not null unique,
  provider_transaction_reference text,
  expected_amount_minor bigint not null check (expected_amount_minor > 0),
  amount_paid_minor bigint,
  currency text not null check (currency = 'NGN'),
  status text not null check (
    status in (
      'initializing', 'ready', 'pending', 'unknown', 'technical_failure',
      'failed', 'cancelled', 'expired', 'amount_mismatch', 'paid'
    )
  ),
  definitive boolean,
  charge_possible boolean,
  payment_method text,
  failure_code text,
  checkout_snapshot jsonb,
  response_snapshot jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists topup_one_active_payment_attempt
  on public.topup_payment_attempts (operation_id)
  where status in ('initializing', 'ready', 'pending', 'unknown');

create table if not exists public.topup_vend_attempts (
  id uuid primary key,
  operation_id uuid not null references public.topup_operations(id) on delete restrict,
  provider text not null check (provider in ('vtpass', 'monnify_bills')),
  provider_reference text not null unique,
  provider_transaction_reference text,
  status text not null check (status in ('processing', 'pending', 'unknown', 'failed', 'delivered')),
  definitive boolean,
  fulfillment_possible boolean,
  failure_code text,
  response_code text,
  response_description text,
  purchased_code text,
  response_snapshot jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists topup_one_active_vend_attempt
  on public.topup_vend_attempts (operation_id)
  where status in ('processing', 'pending', 'unknown');

create table if not exists public.topup_provider_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  event_key text not null,
  operation_reference text,
  body_hash text not null,
  payload jsonb,
  status text not null default 'received' check (status in ('received', 'processed', 'ignored', 'failed')),
  created_at timestamptz not null default now(),
  processed_at timestamptz,
  unique (provider, event_key)
);

create table if not exists public.topup_outbox_jobs (
  id uuid primary key default gen_random_uuid(),
  operation_id uuid not null references public.topup_operations(id) on delete restrict,
  kind text not null check (kind = 'vend'),
  status text not null default 'pending' check (status in ('pending', 'processing', 'complete', 'failed')),
  attempts integer not null default 0 check (attempts >= 0),
  available_at timestamptz not null default now(),
  locked_at timestamptz,
  last_error_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (operation_id, kind)
);

alter table public.topup_operations enable row level security;
alter table public.topup_payment_attempts enable row level security;
alter table public.topup_vend_attempts enable row level security;
alter table public.topup_provider_events enable row level security;
alter table public.topup_outbox_jobs enable row level security;

revoke all on table public.topup_operations from anon, authenticated;
revoke all on table public.topup_payment_attempts from anon, authenticated;
revoke all on table public.topup_vend_attempts from anon, authenticated;
revoke all on table public.topup_provider_events from anon, authenticated;
revoke all on table public.topup_outbox_jobs from anon, authenticated;

grant all on table public.topup_operations to service_role;
grant all on table public.topup_payment_attempts to service_role;
grant all on table public.topup_vend_attempts to service_role;
grant all on table public.topup_provider_events to service_role;
grant all on table public.topup_outbox_jobs to service_role;

create or replace function public.topup_mark_payment_paid(
  p_operation_reference text,
  p_attempt_id uuid
)
returns public.topup_operations
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  operation_row public.topup_operations;
begin
  select * into operation_row
  from public.topup_operations
  where reference = p_operation_reference
  for update;

  if operation_row.id is null then
    raise exception 'TopUp operation not found';
  end if;

  if not exists (
    select 1
    from public.topup_payment_attempts
    where id = p_attempt_id
      and operation_id = operation_row.id
      and status = 'paid'
      and amount_paid_minor = expected_amount_minor
  ) then
    raise exception 'Payment attempt is not authoritatively paid';
  end if;

  update public.topup_operations
  set payment_status = 'paid',
      vend_status = case when vend_status = 'not_started' then 'queued' else vend_status end,
      updated_at = now()
  where id = operation_row.id
  returning * into operation_row;

  insert into public.topup_outbox_jobs (operation_id, kind)
  values (operation_row.id, 'vend')
  on conflict (operation_id, kind) do nothing;

  return operation_row;
end;
$$;

create or replace function public.topup_mark_vend_delivered(
  p_operation_reference text,
  p_attempt_id uuid
)
returns public.topup_operations
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  operation_row public.topup_operations;
begin
  select * into operation_row
  from public.topup_operations
  where reference = p_operation_reference
  for update;

  if operation_row.id is null or operation_row.payment_status <> 'paid' then
    raise exception 'Paid TopUp operation not found';
  end if;

  if not exists (
    select 1
    from public.topup_vend_attempts
    where id = p_attempt_id
      and operation_id = operation_row.id
      and status = 'delivered'
  ) then
    raise exception 'Vending attempt is not delivered';
  end if;

  update public.topup_operations
  set vend_status = 'delivered', updated_at = now()
  where id = operation_row.id
  returning * into operation_row;

  update public.topup_outbox_jobs
  set status = 'complete', updated_at = now()
  where operation_id = operation_row.id and kind = 'vend';

  return operation_row;
end;
$$;

create or replace function public.topup_claim_vend_jobs(p_limit integer default 10)
returns setof public.topup_operations
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  return query
  with claimed as (
    select job.id, job.operation_id
    from public.topup_outbox_jobs job
    where job.kind = 'vend'
      and job.status = 'pending'
      and job.available_at <= now()
    order by job.created_at
    for update skip locked
    limit greatest(1, least(p_limit, 25))
  ), updated as (
    update public.topup_outbox_jobs job
    set status = 'processing',
        attempts = job.attempts + 1,
        locked_at = now(),
        updated_at = now()
    from claimed
    where job.id = claimed.id
    returning job.operation_id
  )
  select operation.*
  from public.topup_operations operation
  join updated on updated.operation_id = operation.id;
end;
$$;

create or replace function public.topup_update_vend_job(
  p_operation_reference text,
  p_status text,
  p_error_code text default null,
  p_delay_seconds integer default 30
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if p_status not in ('pending', 'complete', 'failed') then
    raise exception 'Invalid outbox status';
  end if;

  update public.topup_outbox_jobs job
  set status = p_status,
      available_at = case
        when p_status = 'pending' then now() + make_interval(secs => greatest(5, least(p_delay_seconds, 3600)))
        else job.available_at
      end,
      locked_at = null,
      last_error_code = p_error_code,
      updated_at = now()
  from public.topup_operations operation
  where operation.reference = p_operation_reference
    and job.operation_id = operation.id
    and job.kind = 'vend';
end;
$$;

revoke all on function public.topup_mark_payment_paid(text, uuid) from public, anon, authenticated;
revoke all on function public.topup_mark_vend_delivered(text, uuid) from public, anon, authenticated;
revoke all on function public.topup_claim_vend_jobs(integer) from public, anon, authenticated;
revoke all on function public.topup_update_vend_job(text, text, text, integer) from public, anon, authenticated;
grant execute on function public.topup_mark_payment_paid(text, uuid) to service_role;
grant execute on function public.topup_mark_vend_delivered(text, uuid) to service_role;
grant execute on function public.topup_claim_vend_jobs(integer) to service_role;
grant execute on function public.topup_update_vend_job(text, text, text, integer) to service_role;

commit;
