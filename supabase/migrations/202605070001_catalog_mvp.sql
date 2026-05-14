-- Loopwijzer catalog MVP schema.
-- Run this in the Supabase SQL Editor or through the Supabase CLI.

create type shoe_type as enum ('daily_trainer', 'tempo', 'race', 'stability', 'trail', 'recovery');
create type surface_type as enum ('road', 'track', 'trail', 'mixed');
create type support_type as enum ('neutral', 'light_stability', 'stability');
create type product_level as enum ('low', 'medium', 'high');
create type fit_profile as enum ('snug', 'regular', 'roomy');
create type width_label as enum ('narrow', 'regular', 'wide');
create type data_status as enum ('draft', 'needs_review', 'verified');
create type score_status as enum ('seed_estimate', 'editorial_reviewed', 'tested');
create type offer_status as enum ('placeholder', 'verified', 'expired');
create type offer_source_type as enum ('manual', 'affiliate_feed', 'retailer_feed');
create type offer_availability as enum ('in_stock', 'low_stock', 'out_of_stock', 'unknown');
create type image_source_type as enum ('tradetracker_feed', 'retailer_feed', 'brand_press', 'manual_verified');
create type image_status as enum ('missing', 'feed_pending', 'verified', 'rejected');
create type image_license_status as enum ('feed_allowed', 'brand_allowed', 'needs_review');

create table brands (
  id text primary key,
  slug text not null unique,
  name text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint brands_id_not_empty check (length(trim(id)) > 0),
  constraint brands_slug_not_empty check (length(trim(slug)) > 0),
  constraint brands_name_not_empty check (length(trim(name)) > 0)
);

create table shoes (
  id text primary key,
  slug text not null unique,
  brand_id text not null references brands(id) on update cascade on delete restrict,
  model text not null,
  version text not null,
  full_name text not null,
  image_url text,
  image_status image_status not null default 'missing',
  image_source_type image_source_type,
  image_source_name text,
  image_source_url text,
  image_last_checked_at timestamptz,
  image_license_status image_license_status,
  data_status data_status not null default 'needs_review',
  score_status score_status not null default 'seed_estimate',
  release_year integer not null,
  shoe_type shoe_type not null,
  primary_use_case text not null,
  surface_type surface_type not null,
  distance_bucket text not null,
  support_type support_type not null,
  cushioning_level product_level not null,
  responsiveness_level product_level not null,
  fit_profile fit_profile not null,
  width_label width_label not null,
  weight_grams integer not null,
  heel_drop_mm integer not null,
  stack_height_heel_mm integer,
  has_carbon_plate boolean not null default false,
  is_waterproof boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint shoes_id_not_empty check (length(trim(id)) > 0),
  constraint shoes_slug_not_empty check (length(trim(slug)) > 0),
  constraint shoes_model_not_empty check (length(trim(model)) > 0),
  constraint shoes_version_not_empty check (length(trim(version)) > 0),
  constraint shoes_full_name_not_empty check (length(trim(full_name)) > 0),
  constraint shoes_release_year_reasonable check (release_year between 1990 and 2100),
  constraint shoes_weight_positive check (weight_grams > 0),
  constraint shoes_drop_non_negative check (heel_drop_mm >= 0),
  constraint shoes_stack_positive check (stack_height_heel_mm is null or stack_height_heel_mm > 0)
);

create table editorial_scores (
  shoe_id text primary key references shoes(id) on update cascade on delete cascade,
  overall numeric(3, 1) not null,
  comfort numeric(3, 1) not null,
  cushioning numeric(3, 1) not null,
  stability numeric(3, 1) not null,
  responsiveness numeric(3, 1) not null,
  grip numeric(3, 1) not null,
  versatility numeric(3, 1) not null,
  value_for_money numeric(3, 1) not null,
  methodology_version text not null default 'mvp_seed_v1',
  tested_at date,
  reviewed_by text,
  confidence_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint editorial_scores_range check (
    overall between 0 and 10 and
    comfort between 0 and 10 and
    cushioning between 0 and 10 and
    stability between 0 and 10 and
    responsiveness between 0 and 10 and
    grip between 0 and 10 and
    versatility between 0 and 10 and
    value_for_money between 0 and 10
  )
);

create table editorial_verdicts (
  shoe_id text primary key references shoes(id) on update cascade on delete cascade,
  best_for text not null,
  less_suitable_for text not null,
  summary text not null,
  pros_text text,
  cons_text text,
  fit_notes text,
  ride_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint editorial_verdicts_best_for_not_empty check (length(trim(best_for)) > 0),
  constraint editorial_verdicts_less_suitable_not_empty check (length(trim(less_suitable_for)) > 0),
  constraint editorial_verdicts_summary_not_empty check (length(trim(summary)) > 0)
);

create table retailers (
  id text primary key,
  slug text not null unique,
  name text not null unique,
  website_url text,
  logo_url text,
  trust_score numeric(3, 1),
  shipping_note text,
  return_policy_note text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint retailers_id_not_empty check (length(trim(id)) > 0),
  constraint retailers_slug_not_empty check (length(trim(slug)) > 0),
  constraint retailers_name_not_empty check (length(trim(name)) > 0),
  constraint retailers_trust_score_range check (trust_score is null or trust_score between 0 and 10)
);

create table offers (
  id text primary key,
  shoe_id text not null references shoes(id) on update cascade on delete cascade,
  retailer_id text not null references retailers(id) on update cascade on delete restrict,
  price numeric(10, 2) not null,
  currency text not null default 'EUR',
  availability offer_availability not null default 'unknown',
  url text not null,
  offer_status offer_status not null default 'placeholder',
  last_checked_at timestamptz,
  source_type offer_source_type not null default 'manual',
  is_affiliate boolean not null default false,
  affiliate_network text,
  external_offer_id text,
  gtin text,
  size_availability text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint offers_id_not_empty check (length(trim(id)) > 0),
  constraint offers_url_not_empty check (length(trim(url)) > 0),
  constraint offers_price_positive check (price > 0),
  constraint offers_currency_eur_mvp check (currency = 'EUR'),
  constraint offers_verified_not_placeholder_url check (
    offer_status <> 'verified'
    or url !~* '^https?://([^/]+\.)?example\.com(/|$)'
  )
);

create index shoes_brand_id_idx on shoes(brand_id);
create index shoes_public_catalog_idx on shoes(data_status, shoe_type, surface_type, support_type);
create index offers_shoe_id_idx on offers(shoe_id);
create index offers_retailer_id_idx on offers(retailer_id);
create index offers_public_idx on offers(offer_status, availability, price);

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger brands_set_updated_at
before update on brands
for each row execute function set_updated_at();

create trigger shoes_set_updated_at
before update on shoes
for each row execute function set_updated_at();

create trigger editorial_scores_set_updated_at
before update on editorial_scores
for each row execute function set_updated_at();

create trigger editorial_verdicts_set_updated_at
before update on editorial_verdicts
for each row execute function set_updated_at();

create trigger retailers_set_updated_at
before update on retailers
for each row execute function set_updated_at();

create trigger offers_set_updated_at
before update on offers
for each row execute function set_updated_at();

alter table brands enable row level security;
alter table shoes enable row level security;
alter table editorial_scores enable row level security;
alter table editorial_verdicts enable row level security;
alter table retailers enable row level security;
alter table offers enable row level security;

create policy "Public can read active brands"
on brands
for select
to anon, authenticated
using (is_active = true);

create policy "Public can read non-draft shoes"
on shoes
for select
to anon, authenticated
using (data_status <> 'draft');

create policy "Public can read scores for public shoes"
on editorial_scores
for select
to anon, authenticated
using (
  exists (
    select 1
    from shoes
    where shoes.id = editorial_scores.shoe_id
      and shoes.data_status <> 'draft'
  )
);

create policy "Public can read verdicts for public shoes"
on editorial_verdicts
for select
to anon, authenticated
using (
  exists (
    select 1
    from shoes
    where shoes.id = editorial_verdicts.shoe_id
      and shoes.data_status <> 'draft'
  )
);

create policy "Public can read active retailers"
on retailers
for select
to anon, authenticated
using (is_active = true);

create policy "Public can read verified offers"
on offers
for select
to anon, authenticated
using (
  offer_status = 'verified'
  and availability in ('in_stock', 'low_stock')
  and url !~* '^https?://([^/]+\.)?example\.com(/|$)'
  and exists (
    select 1
    from shoes
    where shoes.id = offers.shoe_id
      and shoes.data_status <> 'draft'
  )
  and exists (
    select 1
    from retailers
    where retailers.id = offers.retailer_id
      and retailers.is_active = true
  )
);
