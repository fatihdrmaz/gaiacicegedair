-- Galeri görsellerinde "öne çıkan" işareti — ana sayfa vitrini için

alter table gallery_images
  add column if not exists featured boolean not null default false;

create index if not exists idx_gallery_images_featured
  on gallery_images(featured) where featured = true;
