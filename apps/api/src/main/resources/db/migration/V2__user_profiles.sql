alter table users add column google_avatar_url varchar(1000);
alter table users add column whatsapp_number varchar(13);
alter table users add column city varchar(100);
alter table users add column avatar_public_id varchar(300);
alter table users add column profile_completed_at timestamp with time zone;

update users
set google_avatar_url = avatar_url
where avatar_url is not null;
