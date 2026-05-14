-- Adds release precision metadata so the catalog can distinguish year-only seed data
-- from future month/day-level release data from brands, editorial research, or feeds.

alter table shoes
  add column if not exists release_month integer,
  add column if not exists release_date date,
  add column if not exists release_date_precision text not null default 'year',
  add column if not exists release_date_source text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'shoes_release_month_range'
  ) then
    alter table shoes
      add constraint shoes_release_month_range
      check (release_month is null or release_month between 1 and 12);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'shoes_release_date_precision_check'
  ) then
    alter table shoes
      add constraint shoes_release_date_precision_check
      check (release_date_precision in ('year', 'month', 'day'));
  end if;
end $$;

create index if not exists shoes_release_recency_idx
on shoes (release_year desc, release_month desc, release_date desc);
