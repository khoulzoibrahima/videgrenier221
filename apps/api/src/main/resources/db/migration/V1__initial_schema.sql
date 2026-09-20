create table users (
    id uuid primary key,
    firebase_uid varchar(128) not null unique,
    email varchar(320) not null,
    display_name varchar(120) not null,
    avatar_url varchar(1000),
    role varchar(24) not null default 'SELLER',
    status varchar(24) not null default 'ACTIVE',
    created_at timestamp with time zone not null,
    updated_at timestamp with time zone not null
);

create table shops (
    id uuid primary key,
    owner_id uuid not null references users(id),
    name varchar(100) not null,
    slug varchar(120) not null unique,
    cover_url varchar(1000),
    region varchar(80) not null,
    city varchar(100) not null,
    neighborhood varchar(100),
    status varchar(24) not null default 'DRAFT',
    created_at timestamp with time zone not null,
    updated_at timestamp with time zone not null
);

create table listings (
    id uuid primary key,
    shop_id uuid not null references shops(id),
    title varchar(120) not null,
    description varchar(2000) not null,
    category varchar(80) not null,
    item_condition varchar(32) not null,
    price_cfa integer,
    negotiable boolean not null default false,
    status varchar(24) not null default 'DRAFT',
    seller_validated boolean not null default false,
    version bigint not null default 0,
    created_at timestamp with time zone not null,
    updated_at timestamp with time zone not null,
    constraint listings_price_positive check (price_cfa is null or price_cfa > 0)
);

create table listing_images (
    id uuid primary key,
    listing_id uuid not null references listings(id) on delete cascade,
    public_url varchar(1000) not null,
    alt_text varchar(240) not null,
    sort_order integer not null default 0
);

create table reservations (
    id uuid primary key,
    listing_id uuid not null references listings(id),
    buyer_name varchar(120) not null,
    buyer_phone varchar(32) not null,
    status varchar(24) not null default 'PENDING',
    expires_at timestamp with time zone not null,
    created_at timestamp with time zone not null,
    updated_at timestamp with time zone not null
);

create table analysis_jobs (
    id uuid primary key,
    owner_id uuid not null references users(id),
    shop_id uuid references shops(id),
    status varchar(32) not null default 'QUEUED',
    raw_result text,
    error_code varchar(80),
    retry_count integer not null default 0,
    created_at timestamp with time zone not null,
    updated_at timestamp with time zone not null
);

create table reports (
    id uuid primary key,
    reporter_id uuid references users(id),
    target_type varchar(24) not null,
    target_id uuid not null,
    reason varchar(80) not null,
    details varchar(1000),
    status varchar(24) not null default 'OPEN',
    created_at timestamp with time zone not null,
    updated_at timestamp with time zone not null
);

create table events (
    id uuid primary key,
    user_id uuid references users(id),
    session_id varchar(128),
    event_type varchar(64) not null,
    target_type varchar(32),
    target_id uuid,
    source varchar(80),
    occurred_at timestamp with time zone not null
);

create index idx_shops_owner on shops(owner_id);
create index idx_listings_shop_status on listings(shop_id, status);
create index idx_reservations_listing_status on reservations(listing_id, status);
create index idx_reports_status_created on reports(status, created_at);
create index idx_events_type_occurred on events(event_type, occurred_at);
