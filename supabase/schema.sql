-- ════════════════════════════════════════════════════════════════
-- YORU — schéma Supabase (PostgreSQL) pour les articles
-- À exécuter dans l'éditeur SQL de votre projet Supabase.
-- Puis : CONTENT_SOURCE=supabase, SUPABASE_URL, SUPABASE_ANON_KEY.
-- ════════════════════════════════════════════════════════════════

create table if not exists public.articles (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title         text not null,
  subtitle      text not null,
  excerpt       text not null check (char_length(excerpt) <= 220),
  universe      text not null check (universe in ('cinema','series','anime','manga','jeux-video','comics','collectors','tech')),
  type          text not null check (type in ('actu','critique','dossier','guide','top')),
  tags          text[] not null default '{}',
  -- Clé de data/media.ts, chemin /images/… ou URL https (ajoutez le domaine dans next.config.ts)
  cover         text not null,
  author        text not null,
  featured      boolean not null default false,
  popularity    integer not null default 0,
  demo          boolean not null default false,
  rating        numeric(3,1) check (rating between 0 and 10),
  -- Tableau de blocs : [{ "type": "p", "text": "…" }, { "type": "h2", "id": "…", "text": "…" }, …]
  body          jsonb not null,
  status        text not null default 'draft' check (status in ('draft','published')),
  published_at  timestamptz not null default now(),
  updated_at    timestamptz
);

create index if not exists articles_published_idx on public.articles (status, published_at desc);
create index if not exists articles_universe_idx on public.articles (universe);

-- ── Sécurité : Row Level Security ─────────────────────────────────
alter table public.articles enable row level security;

-- Lecture publique (clé anon) : uniquement les articles publiés.
drop policy if exists "Lecture publique des articles publiés" on public.articles;
create policy "Lecture publique des articles publiés"
  on public.articles for select
  to anon, authenticated
  using (status = 'published');

-- Aucune politique d'écriture pour anon/authenticated : seules la clé
-- service_role (côté serveur, jamais exposée) ou l'interface Supabase
-- peuvent créer / modifier des articles.

-- ── (Optionnel) Favoris synchronisés pour des comptes connectés ───
-- create table public.favorites (
--   user_id    uuid not null references auth.users on delete cascade,
--   slug       text not null references public.articles(slug) on delete cascade,
--   created_at timestamptz not null default now(),
--   primary key (user_id, slug)
-- );
-- alter table public.favorites enable row level security;
-- create policy "Chacun gère ses favoris" on public.favorites
--   for all to authenticated
--   using (auth.uid() = user_id) with check (auth.uid() = user_id);


-- ═════════════════════════════════════════════════════════════════
-- Boutique : catalogue modifiable depuis l'espace édition (/admin)
-- À utiliser avec PRODUCTS_SOURCE=supabase et SUPABASE_SERVICE_ROLE_KEY.
-- ═════════════════════════════════════════════════════════════════
create table if not exists public.products (
  slug       text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  status     text not null default 'draft' check (status in ('draft', 'published')),
  -- Fiche complète (même format que data/shop/catalog.json), validée par le site.
  data       jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

-- Lecture publique (clé anon) limitée aux produits publiés : les brouillons
-- ne sont lisibles qu'avec la clé service_role, côté serveur.
drop policy if exists "Lecture publique des produits publiés" on public.products;
create policy "Lecture publique des produits publiés"
  on public.products for select
  to anon, authenticated
  using (status = 'published');

-- Aucune politique d'écriture : seul le serveur du site (clé service_role) modifie le catalogue.

-- Photos produit : bucket public « products » (Storage → New bucket → Public).
-- Les envois passent par le serveur du site avec la clé service_role ;
-- aucune politique d'écriture n'est nécessaire pour anon/authenticated.
-- insert into storage.buckets (id, name, public) values ('products', 'products', true)
--   on conflict (id) do nothing;

-- Import du catalogue actuel : depuis le dossier du projet, avec les variables
-- SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY définies :
--   npm run catalog:push
