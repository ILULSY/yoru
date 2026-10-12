"use client";

import Link from "next/link";
import Image from "next/image";
import { startTransition, useActionState, useEffect, useId, useMemo, useRef, useState } from "react";
import { ArrowLeft, Eye, EyeOff, ImagePlus, LoaderCircle, Percent, Plus, Save, Trash2, TriangleAlert, X } from "lucide-react";
import {
  AVAILABILITIES,
  CURRENCIES,
  PRODUCT_BADGES,
  PRODUCT_CATEGORIES,
  VISUAL_KINDS,
  type Availability,
  type Currency,
  type ProductCategory,
  type VisualKind,
} from "@/types/shop";
import { CATEGORY_INFO, LICENSES } from "@/data/shop/licenses";
import { BADGE_LABELS } from "@/lib/shop/format";
import { draftSalePrice, draftToProduct, parseMoney, slugify, type ProductDraft } from "@/lib/shop/draft";
import { formatSaleDate, saleStatus, zurichInputToIso } from "@/lib/shop/pricing";
import { useShopNow } from "@/components/shop/CatalogProvider";
import { convert, formatMoney } from "@/lib/shop/currency";
import { useRates } from "@/lib/stores/currency";
import { saveProductAction, type SaveState } from "@/app/admin/actions";
import { ProductCard } from "@/components/shop/ProductCard";
import { FieldError, inputClasses } from "@/components/ui/Field";
import { buttonClasses } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const AVAILABILITY_LABELS: Record<Availability, string> = {
  in_stock: "En stock",
  preorder: "Précommande",
  out_of_stock: "Rupture de stock",
};

type Props = {
  mode: "create" | "edit";
  initial: ProductDraft;
  /** Adresse et version d'origine (modification). */
  previousSlug?: string;
  expectedUpdatedAt?: string;
  typeSuggestions: string[];
  /** Le stockage refuse les écritures : formulaire en lecture seule. */
  readOnly?: boolean;
};

export function ProductForm({ mode, initial, previousSlug, expectedUpdatedAt, typeSuggestions, readOnly }: Props) {
  const [state, formAction, pending] = useActionState<SaveState, FormData>(saveProductAction, {});
  const [draft, setDraft] = useState<ProductDraft>(initial);
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const errors = state.errors ?? {};
  const rates = useRates();

  const set = <K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) => setDraft((d) => ({ ...d, [key]: value }));
  const dirty = JSON.stringify(draft) !== JSON.stringify(initial);

  // Avertit avant de quitter la page avec des modifications non enregistrées.
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  // Ctrl/Cmd + S : enregistrer.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Après une erreur, on amène le résumé à l'écran.
  useEffect(() => {
    if (state.message) summaryRef.current?.focus();
  }, [state]);

  const preview = useMemo(() => {
    const p = draftToProduct(draft, new Date(0).toISOString());
    return {
      ...p,
      name: p.name || "Nom du produit",
      type: p.type || "Type",
      slug: p.slug || "apercu",
      price: Number.isFinite(p.price) ? p.price : 0,
      compareAtPrice: p.compareAtPrice && Number.isFinite(p.compareAtPrice) ? p.compareAtPrice : undefined,
      stock: Number.isFinite(p.stock) ? p.stock : 0,
      popularity: 0,
    };
  }, [draft]);

  const price = parseMoney(draft.price);
  const other: Currency = draft.currency === "CHF" ? "EUR" : "CHF";

  const id = (name: string) => `${uid}-${name}`;
  const a11y = (name: string, hint?: boolean) => ({
    id: id(name),
    "aria-invalid": Boolean(errors[name]) || undefined,
    "aria-describedby": [errors[name] ? `${id(name)}-error` : "", hint ? `${id(name)}-hint` : ""].filter(Boolean).join(" ") || undefined,
  });
  const input = (name: string, extra?: string) => cn(inputClasses(Boolean(errors[name])), "h-12", extra);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline">
            <ArrowLeft className="size-4" aria-hidden /> Tous les produits
          </Link>
          <h1 className="display mt-2 truncate text-4xl sm:text-5xl">{mode === "create" ? "Nouveau produit" : initial.name}</h1>
        </div>
        <div
          role="radiogroup"
          aria-label="Visibilité du produit"
          className="inline-flex border-[3px] border-ink bg-paper"
        >
          {(
            [
              ["draft", "Brouillon", EyeOff],
              ["published", "En boutique", Eye],
            ] as const
          ).map(([value, label, Icon]) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={draft.status === value}
              onClick={() => set("status", value)}
              className={cn(
                "inline-flex h-11 items-center gap-1.5 px-4 text-sm font-bold transition-colors",
                draft.status === value && (value === "published" ? "bg-violet text-paper" : "bg-ink text-paper"),
              )}
            >
              <Icon className="size-4" aria-hidden /> {label}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-2 text-sm text-muted">
        {draft.status === "published"
          ? "Visible par les clients dès l'enregistrement."
          : "Brouillon : invisible en boutique, dans la recherche et le panier. Seul l'espace édition le voit."}
      </p>

      {state.message && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="mt-6 flex items-start gap-2 border-[3px] border-ink bg-pink p-3 font-semibold outline-none"
        >
          <TriangleAlert className="mt-0.5 size-5 shrink-0" aria-hidden />
          <div>
            <p>{state.message}</p>
            {Object.keys(errors).length > 0 && (
              <ul className="mt-1 list-disc pl-5 text-sm font-medium">
                {Object.entries(errors).map(([k, v]) => (
                  <li key={k}>{v}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      <form
        ref={formRef}
        // Envoi manuel plutôt que `action` : React réinitialiserait sinon les listes
        // déroulantes (contrôlées) à leur valeur de départ après chaque envoi.
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          startTransition(() => formAction(data));
        }}
        className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <input type="hidden" name="payload" value={JSON.stringify(draft)} />
        <input type="hidden" name="previousSlug" value={previousSlug ?? ""} />
        <input type="hidden" name="expectedUpdatedAt" value={expectedUpdatedAt ?? ""} />

        <fieldset disabled={readOnly || pending} className="min-w-0 space-y-8">
          {/* ── Essentiel ── */}
          <Section title="Essentiel">
            <Field id={id("name")} label="Nom du produit" required error={errors.name}>
              <input
                {...a11y("name")}
                value={draft.name}
                maxLength={120}
                onChange={(e) => {
                  const name = e.target.value;
                  setDraft((d) => ({ ...d, name, slug: slugTouched ? d.slug : slugify(name) }));
                }}
                className={input("name")}
                placeholder="Booster One Piece Card Game OP-17"
              />
            </Field>

            <Field
              id={id("slug")}
              label="Adresse de la fiche"
              required
              error={errors.slug}
              hint={
                mode === "edit" && draft.slug !== previousSlug
                  ? "Attention : changer l'adresse rend invalides les liens déjà partagés et les paniers en cours."
                  : "Générée à partir du nom. Minuscules, chiffres et tirets."
              }
            >
              <div className="flex">
                <span className="hidden items-center border-[3px] border-r-0 border-ink bg-paper-2 px-3 font-mono text-sm text-muted sm:flex">
                  /boutique/produit/
                </span>
                <input
                  {...a11y("slug", true)}
                  value={draft.slug}
                  maxLength={80}
                  onChange={(e) => {
                    setSlugTouched(true);
                    set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"));
                  }}
                  className={input("slug", "font-mono text-sm")}
                  spellCheck={false}
                />
              </div>
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field id={id("category")} label="Catégorie" required error={errors.category}>
                <select {...a11y("category")} value={draft.category} onChange={(e) => set("category", e.target.value as ProductCategory)} className={input("category")}>
                  {PRODUCT_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {CATEGORY_INFO[c].name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field id={id("type")} label="Type" required error={errors.type} hint="Affiché sur la carte (Booster, Figurine PVC, Mug…).">
                <input
                  {...a11y("type", true)}
                  value={draft.type}
                  maxLength={60}
                  list={id("types")}
                  onChange={(e) => set("type", e.target.value)}
                  className={input("type")}
                />
                <datalist id={id("types")}>
                  {typeSuggestions.map((t) => (
                    <option key={t} value={t} />
                  ))}
                </datalist>
              </Field>
              <Field id={id("license")} label="Licence" error={errors.license}>
                <select {...a11y("license")} value={draft.license} onChange={(e) => set("license", e.target.value)} className={input("license")}>
                  <option value="">Aucune (accessoire, marque YORU)</option>
                  {LICENSES.map((l) => (
                    <option key={l.slug} value={l.slug}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field id={id("character")} label="Personnage" error={errors.character} hint="Facultatif, figurines surtout.">
                <input {...a11y("character", true)} value={draft.character} maxLength={60} onChange={(e) => set("character", e.target.value)} className={input("character")} />
              </Field>
            </div>
          </Section>

          {/* ── Prix et stock ── */}
          <Section title="Prix et stock">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                id={id("price")}
                label="Prix TTC"
                required
                error={errors.price}
                hint={
                  Number.isFinite(price) && price > 0
                    ? `Soit ${formatMoney(convert(price, draft.currency, other, rates), other)} au taux BCE du jour.`
                    : "Ex. 6,95"
                }
              >
                <div className="flex">
                  <input
                    {...a11y("price", true)}
                    value={draft.price}
                    inputMode="decimal"
                    onChange={(e) => set("price", e.target.value)}
                    className={input("price", "min-w-0")}
                    placeholder="6,95"
                  />
                  <div role="radiogroup" aria-label="Devise du prix" className="flex border-[3px] border-l-0 border-ink">
                    {CURRENCIES.map((c) => (
                      <button
                        key={c}
                        type="button"
                        role="radio"
                        aria-checked={draft.currency === c}
                        onClick={() => set("currency", c)}
                        className={cn("px-3 text-sm font-bold", draft.currency === c ? "bg-ink text-paper" : "bg-paper")}
                      >
                        {c === "EUR" ? "€" : "CHF"}
                      </button>
                    ))}
                  </div>
                </div>
              </Field>
              <Field id={id("compareAtPrice")} label="Prix barré" error={errors.compareAtPrice} hint="Facultatif : ancien prix, affiché barré.">
                <input
                  {...a11y("compareAtPrice", true)}
                  value={draft.compareAtPrice}
                  inputMode="decimal"
                  onChange={(e) => set("compareAtPrice", e.target.value)}
                  className={input("compareAtPrice")}
                />
              </Field>
              <Field id={id("availability")} label="Disponibilité" required error={errors.availability}>
                <select
                  {...a11y("availability")}
                  value={draft.availability}
                  onChange={(e) => {
                    const availability = e.target.value as Availability;
                    setDraft((d) => ({ ...d, availability, stock: availability === "out_of_stock" ? "0" : d.stock }));
                  }}
                  className={input("availability")}
                >
                  {AVAILABILITIES.map((a) => (
                    <option key={a} value={a}>
                      {AVAILABILITY_LABELS[a]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field id={id("stock")} label="Stock" required error={errors.stock} hint="Quantité vendable ; au-delà, le panier bloque.">
                <input
                  {...a11y("stock", true)}
                  value={draft.stock}
                  inputMode="numeric"
                  onChange={(e) => set("stock", e.target.value.replace(/\D/g, ""))}
                  className={input("stock")}
                />
              </Field>
              {draft.availability === "preorder" && (
                <Field id={id("releaseDate")} label="Date de sortie" required error={errors.releaseDate}>
                  <input {...a11y("releaseDate")} type="date" value={draft.releaseDate} onChange={(e) => set("releaseDate", e.target.value)} className={input("releaseDate")} />
                </Field>
              )}
            </div>
            <SaleFields draft={draft} setDraft={setDraft} error={errors.sale} idPrefix={id("sale")} />
          </Section>

          {/* ── Photo ── */}
          <Section title="Photo">
            <ImageField draft={draft} setDraft={setDraft} error={errors.image} altProps={a11y("image")} disabled={readOnly || pending} />
            <Field
              id={id("visual")}
              label="Visuel d'illustration"
              error={errors.visual}
              hint={draft.image ? "Utilisé seulement si vous retirez la photo." : "Sans photo, la boutique affiche cette illustration générée (sans logo officiel)."}
            >
              <select {...a11y("visual", true)} value={draft.visual} onChange={(e) => set("visual", e.target.value as VisualKind)} className={input("visual")}>
                {Object.entries(VISUAL_KINDS).map(([k, label]) => (
                  <option key={k} value={k}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>
          </Section>

          {/* ── Présentation ── */}
          <Section title="Présentation">
            <Field id={id("description")} label="Description" required error={errors.description} hint={`${draft.description.trim().length} / 2000 caractères (20 minimum).`}>
              <textarea
                {...a11y("description", true)}
                value={draft.description}
                maxLength={2000}
                rows={6}
                onChange={(e) => set("description", e.target.value)}
                className={cn(inputClasses(Boolean(errors.description)), "py-3 leading-relaxed")}
              />
            </Field>

            <fieldset>
              <legend className="mb-1.5 text-sm font-bold">Caractéristiques</legend>
              <p className="mb-3 text-sm text-muted">Affichées en tableau sur la fiche (Langue, Contenu, Dimensions…).</p>
              <div className="space-y-2">
                {draft.details.map(([label, value], i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      aria-label={`Caractéristique ${i + 1}`}
                      value={label}
                      maxLength={40}
                      placeholder="Langue"
                      onChange={(e) => set("details", draft.details.map((d, j) => (j === i ? [e.target.value, d[1]] : d)))}
                      className={cn(inputClasses(), "h-11 w-2/5")}
                    />
                    <input
                      aria-label={`Valeur de la caractéristique ${i + 1}`}
                      value={value}
                      maxLength={160}
                      placeholder="Français"
                      onChange={(e) => set("details", draft.details.map((d, j) => (j === i ? [d[0], e.target.value] : d)))}
                      className={cn(inputClasses(), "h-11 flex-1")}
                    />
                    <button
                      type="button"
                      onClick={() => set("details", draft.details.filter((_, j) => j !== i))}
                      className="grid size-11 shrink-0 place-items-center border-[3px] border-ink bg-paper hover:bg-pink"
                      aria-label={`Supprimer la caractéristique ${i + 1}`}
                    >
                      <X className="size-4" aria-hidden />
                    </button>
                  </div>
                ))}
              </div>
              {draft.details.length < 12 && (
                <button
                  type="button"
                  onClick={() => set("details", [...draft.details, ["", ""]])}
                  className="mt-3 inline-flex h-10 items-center gap-1.5 border-2 border-dashed border-ink px-3 text-sm font-bold hover:bg-yellow"
                >
                  <Plus className="size-4" aria-hidden /> Ajouter une caractéristique
                </button>
              )}
              <FieldError id={`${id("details")}-error`} message={errors.details} />
            </fieldset>

            <Field id={id("tags")} label="Mots-clés" error={errors.tags} hint="Séparés par des virgules. Servent à la recherche du site.">
              <input {...a11y("tags", true)} value={draft.tags} onChange={(e) => set("tags", e.target.value)} className={input("tags")} placeholder="TCG, booster, Luffy" />
            </Field>

            <fieldset>
              <legend className="mb-2 text-sm font-bold">Badges</legend>
              <div className="flex flex-wrap gap-2">
                {PRODUCT_BADGES.map((b) => {
                  const on = draft.badges.includes(b);
                  return (
                    <label
                      key={b}
                      className={cn(
                        "inline-flex cursor-pointer items-center gap-2 border-2 border-ink px-3 py-1.5 text-sm font-bold has-focus-visible:outline-2 has-focus-visible:outline-offset-2",
                        on ? "bg-yellow" : "bg-paper",
                      )}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={on}
                        onChange={() => set("badges", on ? draft.badges.filter((x) => x !== b) : [...draft.badges, b])}
                      />
                      {on ? "✓ " : ""}
                      {BADGE_LABELS[b]}
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </Section>

          {/* ── Réglages ── */}
          <Section title="Réglages">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id={id("popularity")} label="Mise en avant" error={errors.popularity} hint="Plus le nombre est élevé, plus le produit remonte (« Populaires », accueil).">
                <input
                  {...a11y("popularity", true)}
                  value={draft.popularity}
                  inputMode="numeric"
                  onChange={(e) => set("popularity", e.target.value.replace(/\D/g, ""))}
                  className={input("popularity")}
                />
              </Field>
              <Field id={id("addedAt")} label="Date d'ajout" error={errors.addedAt} hint="Sert au tri « Nouveautés ».">
                <input {...a11y("addedAt", true)} type="date" value={draft.addedAt} onChange={(e) => set("addedAt", e.target.value)} className={input("addedAt")} />
              </Field>
            </div>
            <label className="flex cursor-pointer items-start gap-3 border-[3px] border-ink bg-paper p-4">
              <input type="checkbox" checked={draft.demo} onChange={(e) => set("demo", e.target.checked)} className="mt-1 size-5 accent-[var(--color-ink)]" />
              <span>
                <span className="block font-bold">Produit de démonstration</span>
                <span className="text-sm text-muted">
                  Affiché avec la mention « Démo », non indexé par les moteurs de recherche, et impossible à payer avec une vraie clé
                  Stripe. Décochez pour un produit réellement en vente.
                </span>
              </span>
            </label>
          </Section>
        </fieldset>

        {/* ── Aperçu et enregistrement ── */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="border-[3px] border-ink bg-paper p-4">
            <p className="font-mono text-[11px] font-bold tracking-[0.25em] text-muted uppercase">Aperçu en boutique</p>
            <div inert className="mx-auto mt-3 max-w-64">
              <ProductCard product={preview} idSuffix="preview" />
            </div>
            {draft.status === "draft" && (
              <p className="mt-3 flex items-center gap-1.5 text-sm font-semibold">
                <EyeOff className="size-4" aria-hidden /> Brouillon : les clients ne le voient pas.
              </p>
            )}
          </div>
          <div className="mt-4 space-y-2">
            <button type="submit" disabled={readOnly || pending} className={buttonClasses("ink", "md", "w-full")}>
              {pending ? <LoaderCircle className="size-5 animate-spin" aria-hidden /> : <Save className="size-5" aria-hidden />}
              {pending ? "Enregistrement…" : mode === "create" ? "Créer le produit" : "Enregistrer"}
            </button>
            <p className="text-center font-mono text-[11px] text-muted">
              {readOnly ? "Stockage en lecture seule." : dirty ? "Modifications non enregistrées · Ctrl/⌘ + S" : "Aucune modification"}
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-[3px] border-ink bg-paper p-5 sm:p-6">
      <h2 className="mb-5 text-xl font-extrabold">{title}</h2>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function Field({
  id,
  label,
  required,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-bold">
        {label}
        {required && (
          <span className="text-[#b0005a]" aria-hidden>
            {" "}
            *
          </span>
        )}
      </label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="pt-1.5 text-sm text-muted">
          {hint}
        </p>
      )}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

/** Envoi de la photo : traitée par le serveur (WebP, 1600 px max, fond blanc retiré sur demande). */
function ImageField({
  draft,
  setDraft,
  error,
  altProps,
  disabled,
}: {
  draft: ProductDraft;
  setDraft: React.Dispatch<React.SetStateAction<ProductDraft>>;
  error?: string;
  altProps: { id: string; "aria-invalid"?: boolean; "aria-describedby"?: string };
  disabled?: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [removeWhite, setRemoveWhite] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setUploading(true);
    setUploadError(null);
    const body = new FormData();
    body.set("file", file);
    body.set("slug", draft.slug || draft.name);
    body.set("removeWhite", removeWhite ? "1" : "0");
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = (await res.json()) as { ok: boolean; message?: string; src?: string; width?: number; height?: number };
      if (!data.ok || !data.src) throw new Error(data.message ?? "Envoi impossible.");
      setDraft((d) => ({
        ...d,
        image: { src: data.src!, width: data.width!, height: data.height!, alt: d.image?.alt || (d.name ? `Photo du produit : ${d.name}` : "") },
      }));
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Envoi impossible.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start gap-4">
        <div className="relative grid size-36 shrink-0 place-items-center overflow-hidden border-[3px] border-ink bg-[repeating-conic-gradient(var(--color-paper-2)_0_25%,var(--color-paper)_0_50%)] bg-[length:16px_16px]">
          {draft.image ? (
            <Image src={draft.image.src} alt="" fill className="object-contain p-2" sizes="144px" />
          ) : (
            <ImagePlus className="size-10 text-muted" aria-hidden />
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          <label className={cn(buttonClasses("yellow", "sm"), "cursor-pointer has-focus-visible:outline-2 has-focus-visible:outline-offset-2", (disabled || uploading) && "pointer-events-none opacity-60")}>
            {uploading ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <ImagePlus className="size-4" aria-hidden />}
            {uploading ? "Envoi en cours…" : draft.image ? "Remplacer la photo" : "Choisir une photo"}
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="sr-only"
              disabled={disabled || uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void upload(file);
              }}
            />
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
            <input type="checkbox" checked={removeWhite} onChange={(e) => setRemoveWhite(e.target.checked)} className="size-4 accent-[var(--color-ink)]" />
            Retirer le fond blanc à l&apos;envoi
          </label>
          <p className="text-sm text-muted">JPEG, PNG, WebP ou AVIF, 12 Mo max. Idéalement un packshot détouré (fond transparent).</p>
          {draft.image && (
            <button
              type="button"
              onClick={() => setDraft((d) => ({ ...d, image: null }))}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#b0005a] hover:underline"
            >
              <Trash2 className="size-4" aria-hidden /> Retirer la photo
            </button>
          )}
          {uploadError && (
            <p role="alert" className="flex items-start gap-1.5 text-sm font-semibold text-[#b0005a]">
              <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden /> {uploadError}
            </p>
          )}
        </div>
      </div>

      {draft.image && (
        <div>
          <label htmlFor={altProps.id} className="mb-1.5 block text-sm font-bold">
            Description de la photo<span className="text-[#b0005a]" aria-hidden> *</span>
          </label>
          <input
            {...altProps}
            value={draft.image.alt}
            maxLength={200}
            onChange={(e) => setDraft((d) => (d.image ? { ...d, image: { ...d.image, alt: e.target.value } } : d))}
            className={cn(inputClasses(Boolean(error)), "h-12")}
            placeholder="Booster One Piece OP-17 : Luffy sur fond rouge"
          />
          <p className="pt-1.5 text-sm text-muted">Lue par les lecteurs d&apos;écran et les moteurs de recherche. Décrivez ce que montre la photo.</p>
          <FieldError id={`${altProps.id}-error`} message={error} />
        </div>
      )}
      {!draft.image && <FieldError id={`${altProps.id}-error`} message={error} />}
    </div>
  );
}

/** Solde : remise en % ou prix soldé, avec dates de début et de fin facultatives (heure suisse). */
function SaleFields({
  draft,
  setDraft,
  error,
  idPrefix,
}: {
  draft: ProductDraft;
  setDraft: React.Dispatch<React.SetStateAction<ProductDraft>>;
  error?: string;
  idPrefix: string;
}) {
  const now = useShopNow();
  const set = <K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) => setDraft((d) => ({ ...d, [key]: value }));
  const regular = parseMoney(draft.price);
  const salePrice = draftSalePrice(draft);
  const valid = Number.isFinite(regular) && Number.isFinite(salePrice) && salePrice > 0 && salePrice < regular;
  const percent = valid ? Math.round((1 - salePrice / regular) * 100) : null;
  const startsAt = zurichInputToIso(draft.saleStartsAt);
  const endsAt = zurichInputToIso(draft.saleEndsAt);
  const status = saleStatus({ sale: { price: 1, startsAt: startsAt || undefined, endsAt: endsAt || undefined } }, now);

  return (
    <div className={cn("border-[3px] border-ink p-4", draft.saleEnabled ? "bg-[#ffe1f0]" : "bg-paper-2/50")}>
      <label className="flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={draft.saleEnabled}
          onChange={(e) => set("saleEnabled", e.target.checked)}
          className="size-5 accent-[#c4006b]"
        />
        <span className="flex items-center gap-1.5 font-bold">
          <Percent className="size-4" aria-hidden /> Mettre ce produit en solde
        </span>
      </label>

      {draft.saleEnabled && (
        <div className="mt-4 space-y-4">
          <div role="radiogroup" aria-label="Type de solde" className="inline-flex border-[3px] border-ink bg-paper">
            {(
              [
                ["percent", "Remise en %"],
                ["price", "Prix soldé"],
              ] as const
            ).map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                role="radio"
                aria-checked={draft.saleMode === mode}
                onClick={() =>
                  setDraft((d) => ({
                    ...d,
                    saleMode: mode,
                    // On reporte la valeur calculée pour ne pas repartir de zéro.
                    salePrice: mode === "price" && valid ? (salePrice / 100).toFixed(2).replace(".", ",") : d.salePrice,
                    salePercent: mode === "percent" && percent !== null ? String(percent) : d.salePercent,
                  }))
                }
                className={cn("h-10 px-3 text-sm font-bold", draft.saleMode === mode && "bg-ink text-paper")}
              >
                {label}
              </button>
            ))}
          </div>

          {draft.saleMode === "percent" ? (
            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor={`${idPrefix}-percent`} className="sr-only">
                Remise en pourcentage
              </label>
              <div className="flex">
                <input
                  id={`${idPrefix}-percent`}
                  value={draft.salePercent}
                  inputMode="numeric"
                  onChange={(e) => set("salePercent", e.target.value.replace(/[^\d,.]/g, ""))}
                  className={cn(inputClasses(Boolean(error)), "h-11 w-24")}
                />
                <span className="grid place-items-center border-[3px] border-l-0 border-ink bg-paper px-3 font-bold">%</span>
              </div>
              {[10, 20, 30, 50].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => set("salePercent", String(p))}
                  className={cn("h-11 border-2 border-ink px-3 text-sm font-bold", draft.salePercent === String(p) ? "bg-yellow" : "bg-paper hover:bg-yellow")}
                >
                  −{p} %
                </button>
              ))}
            </div>
          ) : (
            <div>
              <label htmlFor={`${idPrefix}-price`} className="mb-1.5 block text-sm font-bold">
                Prix soldé ({draft.currency === "EUR" ? "€" : "CHF"})
              </label>
              <input
                id={`${idPrefix}-price`}
                value={draft.salePrice}
                inputMode="decimal"
                onChange={(e) => set("salePrice", e.target.value)}
                className={cn(inputClasses(Boolean(error)), "h-11 w-40")}
                placeholder="5,55"
              />
            </div>
          )}

          <p className="font-semibold" aria-live="polite">
            {valid ? (
              <>
                {formatMoney(salePrice, draft.currency)} au lieu de {formatMoney(regular, draft.currency)}{" "}
                <span className="bg-[#c4006b] px-1.5 text-paper">−{percent} %</span>
                {draft.currency === "CHF" && draft.saleMode === "percent" && <span className="text-sm font-normal text-muted"> (arrondi aux 5 centimes)</span>}
              </>
            ) : (
              <span className="text-[#b0005a]">Indiquez un prix normal, puis une remise ou un prix soldé inférieur.</span>
            )}
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={`${idPrefix}-start`} className="mb-1.5 block text-sm font-bold">
                Début
              </label>
              <input
                id={`${idPrefix}-start`}
                type="datetime-local"
                value={draft.saleStartsAt}
                onChange={(e) => set("saleStartsAt", e.target.value)}
                className={cn(inputClasses(), "h-11")}
              />
              <p className="pt-1 text-sm text-muted">Vide : dès l&apos;enregistrement.</p>
            </div>
            <div>
              <label htmlFor={`${idPrefix}-end`} className="mb-1.5 block text-sm font-bold">
                Fin
              </label>
              <input
                id={`${idPrefix}-end`}
                type="datetime-local"
                value={draft.saleEndsAt}
                onChange={(e) => set("saleEndsAt", e.target.value)}
                className={cn(inputClasses(), "h-11")}
              />
              <p className="pt-1 text-sm text-muted">Vide : jusqu&apos;à ce que vous le retiriez. Heure de Suisse et de France.</p>
            </div>
          </div>

          <p className="text-sm font-semibold">
            {status === "scheduled" && startsAt
              ? `Programmé : le solde commencera le ${formatSaleDate(startsAt)}.`
              : status === "ended" && endsAt
                ? `Terminé le ${formatSaleDate(endsAt)} : le prix normal s'applique.`
                : endsAt
                  ? `Solde actif (dès l'enregistrement s'il est nouveau) jusqu'au ${formatSaleDate(endsAt)}.`
                  : "Solde actif (dès l'enregistrement s'il est nouveau), sans date de fin."}
          </p>
          <FieldError id={`${idPrefix}-error`} message={error} />
        </div>
      )}
    </div>
  );
}
