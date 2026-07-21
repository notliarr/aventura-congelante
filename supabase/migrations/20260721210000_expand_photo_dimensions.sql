alter table public.photos drop constraint if exists photos_width_check;
alter table public.photos drop constraint if exists photos_height_check;

alter table public.photos
  add constraint photos_width_check check (width between 320 and 3840);

alter table public.photos
  add constraint photos_height_check check (height between 320 and 3840);
