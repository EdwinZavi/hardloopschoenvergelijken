-- Loopwijzer feed staging schema.
-- Keeps TradeTracker and retailer feed data outside the public catalog until review.

create extension if not exists pgcrypto;

alter type offer_status add value if not exists 'feed_pending';
alter type offer_status add value if not exists 'rejected';

do $$
begin
  create type feed_provider_type as enum ('tradetracker', 'retailer_api', 'retailer_feed', 'manual_csv');
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  create type feed_import_status as enum ('received', 'normalized', 'matched', 'needs_review', 'rejected', 'published');
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  create type feed_match_confidence as enum ('none', 'low', 'medium', 'high', 'exact');
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  create type feed_record_review_action as enum (
    'approve_offer_candidate',
    'reject_offer_candidate',
    'needs_manual_match',
    'ignore_record',
    'approve_image_candidate',
    'reject_image_candidate'
  );
exception
  when duplicate_object then null;
end;
$$;

create table if not exists feed_imports (
  id uuid primary key default gen_random_uuid(),
  provider feed_provider_type not null,
  source_name text not null,
  source_reference text,
  import_status feed_import_status not null default 'received',
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  total_records integer not null default 0,
  normalized_records integer not null default 0,
  matched_records integer not null default 0,
  rejected_records integer not null default 0,
  publishable_records integer not null default 0,
  warning_count integer not null default 0,
  error_count integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint feed_imports_source_name_not_empty check (length(trim(source_name)) > 0),
  constraint feed_imports_counts_non_negative check (
    total_records >= 0 and
    normalized_records >= 0 and
    matched_records >= 0 and
    rejected_records >= 0 and
    publishable_records >= 0 and
    warning_count >= 0 and
    error_count >= 0
  ),
  constraint feed_imports_completed_after_started check (
    completed_at is null or completed_at >= started_at
  )
);

create table if not exists feed_records (
  id uuid primary key default gen_random_uuid(),
  import_id uuid not null references feed_imports(id) on update cascade on delete cascade,
  provider feed_provider_type not null,
  source_name text not null,
  source_record_id text,
  external_id text,
  retailer_name text,
  brand_name text,
  product_name text,
  model text,
  version text,
  gtin text,
  ean text,
  sku text,
  raw_price text,
  normalized_price numeric(10, 2),
  currency text,
  raw_availability text,
  normalized_availability offer_availability,
  product_url text,
  image_url text,
  size_labels text[] not null default '{}'::text[],
  raw_payload jsonb not null,
  normalized_payload jsonb not null default '{}'::jsonb,
  import_status feed_import_status not null default 'received',
  staged_offer_status text not null default 'feed_pending',
  warnings text[] not null default '{}'::text[],
  rejection_reason text,
  imported_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint feed_records_source_name_not_empty check (length(trim(source_name)) > 0),
  constraint feed_records_raw_payload_object check (jsonb_typeof(raw_payload) = 'object'),
  constraint feed_records_normalized_payload_object check (jsonb_typeof(normalized_payload) = 'object'),
  constraint feed_records_price_positive check (normalized_price is null or normalized_price > 0),
  constraint feed_records_currency_eur_or_review check (
    currency is null
    or currency = 'EUR'
    or import_status in ('needs_review', 'rejected')
  ),
  constraint feed_records_staged_offer_status_limited check (staged_offer_status in ('feed_pending', 'rejected')),
  constraint feed_records_rejected_has_reason check (
    import_status <> 'rejected'
    or length(trim(coalesce(rejection_reason, ''))) > 0
  )
);

create table if not exists feed_record_matches (
  id uuid primary key default gen_random_uuid(),
  feed_record_id uuid not null references feed_records(id) on update cascade on delete cascade,
  shoe_id text references shoes(id) on update cascade on delete restrict,
  match_confidence feed_match_confidence not null default 'none',
  match_source text not null,
  match_reason text,
  is_selected boolean not null default false,
  needs_review boolean not null default true,
  score numeric(5, 4),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint feed_record_matches_source_not_empty check (length(trim(match_source)) > 0),
  constraint feed_record_matches_score_range check (score is null or score between 0 and 1),
  constraint feed_record_matches_none_without_shoe check (
    match_confidence <> 'none'
    or shoe_id is null
  ),
  constraint feed_record_matches_confident_has_shoe check (
    match_confidence in ('none', 'low')
    or shoe_id is not null
  )
);

create table if not exists image_candidates (
  id uuid primary key default gen_random_uuid(),
  feed_record_id uuid references feed_records(id) on update cascade on delete set null,
  shoe_id text references shoes(id) on update cascade on delete restrict,
  external_id text,
  image_url text not null,
  source_url text,
  source_name text not null,
  source_type image_source_type not null default 'tradetracker_feed',
  image_status image_status not null default 'feed_pending',
  license_status image_license_status not null default 'needs_review',
  width_px integer,
  height_px integer,
  content_type text,
  last_checked_at timestamptz,
  review_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint image_candidates_image_url_not_empty check (length(trim(image_url)) > 0),
  constraint image_candidates_source_name_not_empty check (length(trim(source_name)) > 0),
  constraint image_candidates_http_url check (image_url ~* '^https?://'),
  constraint image_candidates_dimensions_positive check (
    (width_px is null or width_px > 0)
    and (height_px is null or height_px > 0)
  ),
  constraint image_candidates_feed_review_status check (image_status in ('feed_pending', 'verified', 'rejected'))
);

create table if not exists admin_reviews (
  id uuid primary key default gen_random_uuid(),
  feed_import_id uuid references feed_imports(id) on update cascade on delete cascade,
  feed_record_id uuid references feed_records(id) on update cascade on delete cascade,
  feed_record_match_id uuid references feed_record_matches(id) on update cascade on delete set null,
  image_candidate_id uuid references image_candidates(id) on update cascade on delete set null,
  action feed_record_review_action not null,
  decision_status feed_import_status not null default 'needs_review',
  reviewer_id uuid,
  reviewer_note text,
  created_at timestamptz not null default now(),
  constraint admin_reviews_has_subject check (
    feed_record_id is not null
    or feed_record_match_id is not null
    or image_candidate_id is not null
  ),
  constraint admin_reviews_decision_status_limited check (
    decision_status in ('needs_review', 'rejected', 'published')
  )
);

create unique index if not exists feed_records_import_source_record_uidx
on feed_records(import_id, source_record_id)
where source_record_id is not null;

create unique index if not exists feed_records_import_external_uidx
on feed_records(import_id, external_id)
where external_id is not null;

create unique index if not exists feed_record_matches_selected_uidx
on feed_record_matches(feed_record_id)
where is_selected = true;

create index if not exists feed_imports_status_started_idx
on feed_imports(import_status, started_at desc);

create index if not exists feed_imports_provider_source_idx
on feed_imports(provider, source_name);

create index if not exists feed_records_import_status_idx
on feed_records(import_id, import_status);

create index if not exists feed_records_source_idx
on feed_records(provider, source_name, retailer_name);

create index if not exists feed_records_gtin_ean_idx
on feed_records(gtin, ean);

create index if not exists feed_records_offer_status_idx
on feed_records(staged_offer_status);

create index if not exists feed_record_matches_confidence_idx
on feed_record_matches(match_confidence, needs_review);

create index if not exists feed_record_matches_shoe_idx
on feed_record_matches(shoe_id)
where shoe_id is not null;

create index if not exists image_candidates_status_source_idx
on image_candidates(image_status, source_type, source_name);

create index if not exists image_candidates_shoe_idx
on image_candidates(shoe_id)
where shoe_id is not null;

create index if not exists admin_reviews_record_idx
on admin_reviews(feed_record_id, created_at desc);

create index if not exists admin_reviews_image_idx
on admin_reviews(image_candidate_id, created_at desc)
where image_candidate_id is not null;

do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'feed_imports_set_updated_at'
  ) then
    create trigger feed_imports_set_updated_at
    before update on feed_imports
    for each row execute function set_updated_at();
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'feed_records_set_updated_at'
  ) then
    create trigger feed_records_set_updated_at
    before update on feed_records
    for each row execute function set_updated_at();
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'feed_record_matches_set_updated_at'
  ) then
    create trigger feed_record_matches_set_updated_at
    before update on feed_record_matches
    for each row execute function set_updated_at();
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'image_candidates_set_updated_at'
  ) then
    create trigger image_candidates_set_updated_at
    before update on image_candidates
    for each row execute function set_updated_at();
  end if;
end;
$$;

alter table feed_imports enable row level security;
alter table feed_records enable row level security;
alter table feed_record_matches enable row level security;
alter table image_candidates enable row level security;
alter table admin_reviews enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'feed_imports' and policyname = 'Admins can read feed imports'
  ) then
    create policy "Admins can read feed imports"
    on feed_imports
    for select
    to authenticated
    using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'feed_records' and policyname = 'Admins can read feed records'
  ) then
    create policy "Admins can read feed records"
    on feed_records
    for select
    to authenticated
    using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'feed_record_matches' and policyname = 'Admins can read feed record matches'
  ) then
    create policy "Admins can read feed record matches"
    on feed_record_matches
    for select
    to authenticated
    using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'image_candidates' and policyname = 'Admins can read image candidates'
  ) then
    create policy "Admins can read image candidates"
    on image_candidates
    for select
    to authenticated
    using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'admin_reviews' and policyname = 'Admins can read admin reviews'
  ) then
    create policy "Admins can read admin reviews"
    on admin_reviews
    for select
    to authenticated
    using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
  end if;
end;
$$;
